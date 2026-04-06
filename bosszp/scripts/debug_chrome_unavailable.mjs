import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import yaml from "yaml";

const execFile = promisify(execFileCallback);

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function extractErrorMessage(error) {
  if (!error) return "unknown error";
  if (typeof error === "string") return error;
  if (typeof error.message === "string" && error.message.trim()) return error.message.trim();
  return String(error);
}

function toCdpHttpEndpoint(cdpUrl) {
  if (!cdpUrl) return "";
  if (cdpUrl.startsWith("ws://")) {
    return cdpUrl.replace(/^ws:\/\//u, "http://").replace(/\/devtools\/browser\/.*$/u, "");
  }
  if (cdpUrl.startsWith("wss://")) {
    return cdpUrl.replace(/^wss:\/\//u, "https://").replace(/\/devtools\/browser\/.*$/u, "");
  }
  return cdpUrl.replace(/\/+$/u, "");
}

function parseHostPort(cdpUrl) {
  const endpointBase = toCdpHttpEndpoint(cdpUrl);
  try {
    const parsed = new URL(endpointBase);
    return {
      endpointBase,
      host: parsed.hostname,
      port: Number(parsed.port || (parsed.protocol === "https:" ? 443 : 80)),
    };
  } catch {
    return {
      endpointBase,
      host: "127.0.0.1",
      port: 9222,
    };
  }
}

function checkTcpPort(host, port, timeoutMs = 1800) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const done = (ok, error = "") => {
      try {
        socket.destroy();
      } catch {}
      resolve({ ok, error });
    };

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => done(true, ""));
    socket.once("timeout", () => done(false, `timeout ${timeoutMs}ms`));
    socket.once("error", (error) => done(false, extractErrorMessage(error)));
    socket.connect(port, host);
  });
}

async function tryExec(command, args) {
  try {
    const { stdout, stderr } = await execFile(command, args, { timeout: 2500, encoding: "utf8" });
    return {
      ok: true,
      command: `${command} ${args.join(" ")}`.trim(),
      stdout: String(stdout || "").trim(),
      stderr: String(stderr || "").trim(),
    };
  } catch (error) {
    return {
      ok: false,
      command: `${command} ${args.join(" ")}`.trim(),
      error: extractErrorMessage(error),
    };
  }
}

async function probeEndpointJson(endpoint) {
  try {
    const response = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });
    const text = await response.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
    return {
      endpoint,
      ok: response.ok,
      status: response.status,
      parsed,
      bodySnippet: String(text || "").slice(0, 320),
    };
  } catch (error) {
    return {
      endpoint,
      ok: false,
      status: 0,
      error: extractErrorMessage(error),
    };
  }
}

function deriveHint(diag) {
  const tcpError = String(diag?.tcp?.error || "");
  const hasListener = Boolean(diag?.portListener?.ok && diag?.portListener?.stdout);
  if (tcpError.includes("EPERM") && hasListener) {
    return "9222 端口在监听但当前进程被 EPERM 阻止连接；请检查终端/自动化进程的本机网络权限后重试。";
  }
  if (!diag.tcp.ok) {
    if (hasListener) {
      return "端口有监听，但 TCP 探测失败；优先检查本机安全软件/防火墙策略。";
    }
    return "CDP 端口未连通。请保持外部 Chrome 以 --remote-debugging-port=9222 运行。";
  }
  if (!diag.version.ok) {
    return "TCP 可达但 /json/version 不可用；检查 CDP 地址、代理或端口映射。";
  }
  if (!diag.version.parsed?.webSocketDebuggerUrl) {
    return "CDP 返回缺少 webSocketDebuggerUrl；建议重启 Chrome 并重新开启 remote-debugging-port。";
  }
  return "CDP 基础可用；若仍报 unavailable，多为 attach 权限/会话瞬态问题，可直接重跑批次。";
}

async function main() {
  const primaryConfigPath = path.resolve("config.yaml");
  const fallbackConfigPath = path.resolve("config.example.yaml");
  let root = {};
  let configSource = "defaults";

  if (fs.existsSync(primaryConfigPath)) {
    root = yaml.parse(fs.readFileSync(primaryConfigPath, "utf8")) || {};
    configSource = "config.yaml";
  } else if (fs.existsSync(fallbackConfigPath)) {
    root = yaml.parse(fs.readFileSync(fallbackConfigPath, "utf8")) || {};
    configSource = "config.example.yaml";
  }

  const cdpUrl = root?.browser?.cdp_url || "http://127.0.0.1:9222";
  const { endpointBase, host, port } = parseHostPort(cdpUrl);

  const [tcp, version, list, ps, portListener] = await Promise.all([
    checkTcpPort(host, port),
    probeEndpointJson(`${endpointBase}/json/version`),
    probeEndpointJson(`${endpointBase}/json/list`),
    tryExec("ps", ["aux"]),
    tryExec("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN"]),
  ]);

  const chromeLines =
    ps.ok && ps.stdout
      ? ps.stdout
          .split(/\r?\n/u)
          .filter((line) => line.includes("Chrome") || line.includes("--remote-debugging-port"))
          .slice(0, 40)
      : [];

  const diagnostics = {
    type: "cdp_auto_debug",
    timestamp: new Date().toISOString(),
    cdpUrl,
    endpointBase,
    host,
    port,
    tcp,
    version: {
      endpoint: version.endpoint,
      ok: version.ok,
      status: version.status,
      browser: version.parsed?.Browser || "",
      webSocketDebuggerUrl: version.parsed?.webSocketDebuggerUrl || "",
      bodySnippet: version.bodySnippet || "",
      error: version.error || "",
    },
    list: {
      endpoint: list.endpoint,
      ok: list.ok,
      status: list.status,
      tabCount: Array.isArray(list.parsed) ? list.parsed.length : null,
      bodySnippet: list.bodySnippet || "",
      error: list.error || "",
    },
    processProbe: {
      command: ps.command,
      ok: ps.ok,
      error: ps.error || "",
      chromeLikeLines: chromeLines,
    },
    portListener,
  };

  diagnostics.hint = deriveHint(diagnostics);

  const outDir = path.resolve("output/debug");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `cdp-auto-debug-${nowStamp()}.json`);
  fs.writeFileSync(outPath, JSON.stringify(diagnostics, null, 2), "utf8");

  console.log(`CDP_URL=${cdpUrl}`);
  console.log(`CONFIG_SOURCE=${configSource}`);
  console.log(`TCP_OK=${diagnostics.tcp.ok}`);
  console.log(`VERSION_OK=${diagnostics.version.ok}`);
  console.log(`TAB_COUNT=${diagnostics.list.tabCount ?? "unknown"}`);
  console.log(`HINT=${diagnostics.hint}`);
  console.log(`DIAG_PATH=${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
