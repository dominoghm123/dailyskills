import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";
import { chromium } from "playwright";
import yaml from "yaml";
import { stringify } from "csv-stringify/sync";

const execFile = promisify(execFileCallback);

const CHAT_INPUT_SELECTORS = [
  ".chat-input textarea",
  "textarea[placeholder*='说点']",
  "textarea[placeholder*='输入']",
  "textarea[placeholder*='消息']",
  ".editor-container textarea",
  "div[contenteditable='true']",
  "textarea",
];

const SEND_BUTTON_SELECTORS = [
  "button:has-text('发送')",
  ".send-btn",
  "button.btn-send",
  "[class*='send']:not(input)",
];

const MAX_AUTO_DEBUG_ATTEMPTS = 12;
const CDP_CONNECT_ATTEMPTS = 3;
const CDP_CONNECT_RETRY_DELAY_MS = 1200;
const MAX_CONSECUTIVE_ABNORMAL = 3;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getPostRecordCooldownMs(seq) {
  if (seq % 10 === 0) return 60000;
  if (seq % 5 === 0) return 30000;
  return 8000;
}

function hasAnyText(haystack, needles) {
  return needles.some((needle) => haystack.includes(needle));
}

function randomBetween(minMs, maxMs) {
  if (maxMs <= minMs) return minMs;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

async function gotoWithRetry(page, url, attempts = 3) {
  let lastError;
  for (let index = 0; index < attempts; index += 1) {
    try {
      await page.goto(url, {
        waitUntil: "commit",
        timeout: 25000,
      });
      return;
    } catch (error) {
      lastError = error;
      await sleep(1500);
    }
  }
  throw lastError;
}

function toList(value) {
  return Array.isArray(value) ? value : [value];
}

function parseSalaryFloorK(value) {
  const normalized = String(value || "").replace(/\s+/g, "").toUpperCase();
  if (!normalized) return null;

  const kRange = normalized.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)K/u);
  if (kRange) return Number(kRange[1]);

  const kSingle = normalized.match(/(\d+(?:\.\d+)?)K(?:以上|起|及以上)?/u);
  if (kSingle) return Number(kSingle[1]);

  const wanRange = normalized.match(/(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)万/u);
  if (wanRange) return Number(wanRange[1]) * 10;

  const wanSingle = normalized.match(/(\d+(?:\.\d+)?)万(?:以上|起|及以上)?/u);
  if (wanSingle) return Number(wanSingle[1]) * 10;

  return null;
}

function matchesProfile(job, profile) {
  const cities = new Set(toList(profile.search.city));
  const experiences = new Set(toList(profile.search.experience));
  const requiredSalaryK = parseSalaryFloorK(profile.search.salary);
  const jobSalaryK = parseSalaryFloorK(job.salaryDesc);

  if (cities.size && !cities.has(job.cityName)) return false;
  if (experiences.size && !experiences.has(job.jobExperience)) return false;
  if (profile.search.education && job.jobDegree !== profile.search.education) return false;
  if (requiredSalaryK !== null && (jobSalaryK === null || jobSalaryK < requiredSalaryK)) return false;
  return true;
}

function inTargetRoleScope(jobName) {
  const title = String(jobName || "").toLowerCase();
  const hasAI = /ai|aigc|大模型|人工智能|agent/u.test(title);
  const isProductOps = /产品运营/u.test(title);
  const isContentOps = /内容运营/u.test(title);
  const isPlatformOps = /平台.*产品运营|产品运营.*平台|平台运营/u.test(title);
  const isBEnd = /b端|to ?b|企业端|企业级|商家端/u.test(title);

  const bEndAiProductOps = hasAI && isProductOps && isBEnd;
  const aiTrackContentOps = hasAI && isContentOps;
  const platformProductOps = isPlatformOps && isProductOps;
  return bEndAiProductOps || aiTrackContentOps || platformProductOps;
}

async function getStableChatPage(context) {
  const page = await context.newPage();
  await gotoWithRetry(page, "https://www.zhipin.com/web/geek/chat");
  return page;
}

async function getStableJobsPage(context) {
  const page = await context.newPage();
  await gotoWithRetry(page, "https://www.zhipin.com/web/geek/jobs?query=AI%E4%BA%A7%E5%93%81%E8%BF%90%E8%90%A5&city=100010000");
  return page;
}

async function preflightOrThrow(page) {
  await sleep(1500);
  const currentUrl = page.url();
  const bodyText = ((await page.locator("body").innerText().catch(() => "")) || "").replace(/\s+/g, " ");

  if (currentUrl.includes("/web/passport/zp/verify") || currentUrl.includes("code=36")) {
    throw new Error("BLOCKER: Boss verification/risk-control page");
  }

  if (
    currentUrl.includes("/web/user/") ||
    currentUrl.includes("login") ||
    hasAnyText(bodyText, ["扫码登录", "登录后", "立即登录", "登录/注册"])
  ) {
    throw new Error("BLOCKER: Boss login expired");
  }

  if (hasAnyText(bodyText, ["账号异常", "账户异常", "异常行为", "风险提示", "暂时无法", "封禁"])) {
    throw new Error("BLOCKER: account abnormal");
  }
}

function nowStamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function asSafeName(value) {
  return String(value || "")
    .replace(/[^\p{Letter}\p{Number}_-]+/gu, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48) || "unknown";
}

function isHardBlockerMessage(message) {
  return String(message || "").includes("BLOCKER:");
}

function isSearchRiskControlMessage(message) {
  return hasAnyText(String(message || ""), ["您的环境存在异常", "环境存在异常", "异常行为", "风险"]);
}

function isAccountAbnormalMessage(message) {
  return hasAnyText(String(message || ""), ["账号异常", "账户异常", "异常行为", "风险提示", "封禁"]);
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

async function probeCdpEndpoint(cdpUrl) {
  const endpointBase = toCdpHttpEndpoint(cdpUrl);
  const endpoint = `${endpointBase}/json/version`;
  const startedAt = new Date().toISOString();
  try {
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(5000),
    });
    const text = await response.text();
    let parsed = null;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
    return {
      endpoint,
      startedAt,
      ok: response.ok,
      status: response.status,
      browser: parsed?.Browser || "",
      webSocketDebuggerUrl: parsed?.webSocketDebuggerUrl || "",
      bodySnippet: String(text || "").slice(0, 280),
    };
  } catch (error) {
    return {
      endpoint,
      startedAt,
      ok: false,
      status: 0,
      browser: "",
      webSocketDebuggerUrl: "",
      error: extractErrorMessage(error),
    };
  }
}

function summarizeCdpHint({ preflight, postflight, lastError }) {
  const message = extractErrorMessage(lastError);
  const looksPermissionIssue = /\bEPERM\b/u.test(message);
  const bothUnreachable = !preflight?.ok && !postflight?.ok;

  if (looksPermissionIssue && preflight?.ok) {
    return "Endpoint is reachable but websocket attach was denied (EPERM). Retry should self-heal; otherwise re-run automation process permissions.";
  }
  if (bothUnreachable) {
    return "CDP endpoint is not reachable. Keep external Chrome running with --remote-debugging-port=9222.";
  }
  if (preflight?.ok || postflight?.ok) {
    return "CDP endpoint is reachable but attach failed intermittently. Script retried automatically and captured diagnostics.";
  }
  return "Unknown CDP attach failure. Check diagnostics JSON for probe and attempt details.";
}

function parseCdpPort(cdpUrl) {
  try {
    const parsed = new URL(toCdpHttpEndpoint(cdpUrl));
    return Number(parsed.port || (parsed.protocol === "https:" ? 443 : 80));
  } catch {
    return 9222;
  }
}

function checkTcpPort({ host, port, timeoutMs = 1500 }) {
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

async function collectCdpUnavailableDiagnostics(cdpUrl, lastError) {
  const endpointBase = toCdpHttpEndpoint(cdpUrl);
  let host = "127.0.0.1";
  try {
    host = new URL(endpointBase).hostname || host;
  } catch {}
  const port = parseCdpPort(cdpUrl);

  const [tcpProbe, psProbe, lsofProbe] = await Promise.all([
    checkTcpPort({ host, port, timeoutMs: 1800 }),
    tryExec("ps", ["aux"]),
    tryExec("lsof", ["-nP", `-iTCP:${port}`, "-sTCP:LISTEN"]),
  ]);

  const cdpVersionProbe = await probeCdpEndpoint(cdpUrl);
  const cdpListProbe = await (async () => {
    const endpoint = `${endpointBase}/json/list`;
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
        tabCount: Array.isArray(parsed) ? parsed.length : null,
        bodySnippet: String(text || "").slice(0, 300),
      };
    } catch (error) {
      return {
        endpoint,
        ok: false,
        status: 0,
        error: extractErrorMessage(error),
      };
    }
  })();

  const chromeLines =
    psProbe.ok && psProbe.stdout
      ? psProbe.stdout
          .split(/\r?\n/u)
          .filter((line) => line.includes("Google Chrome") || line.includes("Chrome") || line.includes("--remote-debugging-port"))
          .slice(0, 40)
      : [];

  return {
    type: "cdp_connect_failure",
    timestamp: new Date().toISOString(),
    cdpUrl,
    endpointBase,
    tcpProbe,
    cdpVersionProbe,
    cdpListProbe,
    processProbe: {
      command: psProbe.command,
      ok: psProbe.ok,
      error: psProbe.error || "",
      chromeLikeLines: chromeLines,
    },
    portProbe: lsofProbe,
    attachError: extractErrorMessage(lastError),
  };
}

async function writeCdpDiagnostics(payload) {
  const dir = path.resolve("output/debug");
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `cdp-connect-${nowStamp()}.json`);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
  return filePath;
}

async function connectOverCdpWithAutoDebug(cdpUrl) {
  const preflight = await probeCdpEndpoint(cdpUrl);
  const attempts = [];
  let lastError = null;

  for (let attempt = 1; attempt <= CDP_CONNECT_ATTEMPTS; attempt += 1) {
    try {
      const browser = await chromium.connectOverCDP(cdpUrl);
      if (attempt > 1) {
        console.warn(`CDP attach recovered on attempt ${attempt}`);
      }
      return browser;
    } catch (error) {
      lastError = error;
      attempts.push({
        attempt,
        at: new Date().toISOString(),
        error: extractErrorMessage(error),
      });
      if (attempt < CDP_CONNECT_ATTEMPTS) {
        await sleep(CDP_CONNECT_RETRY_DELAY_MS * attempt);
      }
    }
  }

  const postflight = await probeCdpEndpoint(cdpUrl);
  const diagnostics = await collectCdpUnavailableDiagnostics(cdpUrl, lastError);
  diagnostics.preflight = preflight;
  diagnostics.postflight = postflight;
  diagnostics.attempts = attempts;
  const diagnosticsPath = await writeCdpDiagnostics(diagnostics);
  const hint = summarizeCdpHint({ preflight, postflight, lastError });
  throw new Error(
    `BLOCKER: Chrome/CDP unavailable (${extractErrorMessage(lastError)}); diagnostics=${diagnosticsPath}; hint=${hint}`
  );
}

async function collectChatState(page) {
  const bodyText = ((await page.locator("body").innerText().catch(() => "")) || "").replace(/\s+/g, " ");
  const inputVisible = await waitForChatInput(page, 2500).then(Boolean).catch(() => false);
  const fileInputCount = await page.locator("input[type='file']").count().catch(() => 0);
  return {
    url: page.url(),
    inputVisible,
    fileInputCount,
    bodyText,
  };
}

async function saveDebugArtifacts(page, candidate, attempt) {
  const baseDir = path.resolve("output/debug", nowStamp());
  fs.mkdirSync(baseDir, { recursive: true });
  const tag = `${asSafeName(candidate.brandName)}-${asSafeName(candidate.jobName)}-a${attempt}`;
  const screenPath = path.join(baseDir, `${tag}.png`);
  const htmlPath = path.join(baseDir, `${tag}.html`);
  await page.screenshot({ path: screenPath, fullPage: true }).catch(() => {});
  const html = await page.content().catch(() => "");
  if (html) {
    fs.writeFileSync(htmlPath, html, "utf8");
  }
  return { screenPath, htmlPath };
}

async function recoverAndRetryChat(page, chatUrl) {
  await preflightOrThrow(page);

  // Step 1: refresh current target chat route
  await gotoWithRetry(page, chatUrl, 2);
  await sleep(1800);
  let state = await collectChatState(page);
  if (state.inputVisible) return state;

  // Step 2: bounce through chat home then return
  await gotoWithRetry(page, "https://www.zhipin.com/web/geek/chat", 2);
  await sleep(1600);
  await gotoWithRetry(page, chatUrl, 2);
  await sleep(1800);
  state = await collectChatState(page);
  if (state.inputVisible) return state;

  // Step 3: hard reload once and recheck
  await page.reload({ waitUntil: "domcontentloaded", timeout: 45000 }).catch(() => {});
  await sleep(2200);
  return collectChatState(page);
}

async function fetchJobPage(page, keyword, pageNo) {
  const query = new URLSearchParams({
    query: keyword,
    city: "100010000",
    page: String(pageNo),
    pageSize: "30",
  }).toString();

  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await page.evaluate(async (qs) => {
        const res = await fetch(`https://www.zhipin.com/wapi/zpgeek/search/joblist.json?${qs}`, {
          credentials: "include",
          headers: { "x-requested-with": "XMLHttpRequest" },
        });
        return res.json();
      }, query);
    } catch (error) {
      lastError = error;
      await gotoWithRetry(page, "https://www.zhipin.com/web/geek/jobs?query=AI%E4%BA%A7%E5%93%81%E8%BF%90%E8%90%A5&city=100010000");
    }
  }

  throw lastError;
}

async function collectCandidates(page, profile, limit, maxPages = 10) {
  const candidates = [];
  const seen = new Set();
  const targetCount = Math.max(limit, Math.ceil(limit * 1.5));
  let collectedAnyPage = false;

  for (const keyword of profile.search.keywords) {
    for (let pageNo = 1; pageNo <= maxPages; pageNo += 1) {
      const data = await fetchJobPage(page, keyword, pageNo);
      if (data?.code && data.code !== 0) {
        const message = `joblist failed for ${keyword} page ${pageNo}: ${data.message || data.code}`;
        if (isSearchRiskControlMessage(data.message || data.code)) {
          console.warn(`Search API risk-control on ${keyword} page ${pageNo}; keeping collected candidates and moving on`);
          if (collectedAnyPage || pageNo > 1 || candidates.length > 0) {
            break;
          }
        }
        throw new Error(message);
      }
      collectedAnyPage = true;
      const list = data?.zpData?.jobList || [];

      for (const job of list) {
        if (seen.has(job.encryptJobId)) continue;
        seen.add(job.encryptJobId);
        if (job.contact) continue;
        if (!matchesProfile(job, profile)) continue;
        if (!inTargetRoleScope(job.jobName)) continue;
        candidates.push({ keyword, ...job });
      }

      if (candidates.length >= targetCount) {
        return candidates;
      }
      if (!data?.zpData?.hasMore) break;
      await sleep(1500);
    }
  }

  return candidates;
}

async function addFriend(page, candidate) {
  const payload = await page.evaluate(async ({ securityId, jobId }) => {
    const qs = new URLSearchParams({ securityId, jobId });
    const res = await fetch(`/wapi/zpgeek/friend/add.json?${qs.toString()}`, {
      method: "POST",
      credentials: "include",
      headers: { "x-requested-with": "XMLHttpRequest" },
    });
    return res.json();
  }, { securityId: candidate.securityId, jobId: candidate.encryptJobId });

  if (payload?.code !== 0 || !payload?.zpData?.encBossId || !payload?.zpData?.securityId) {
    throw new Error(payload?.message || "add.json failed");
  }

  return {
    chatUrl:
      `https://www.zhipin.com/web/geek/chat?id=${encodeURIComponent(payload.zpData.encBossId)}` +
      `&jobId=${encodeURIComponent(candidate.encryptJobId)}` +
      `&securityId=${encodeURIComponent(payload.zpData.securityId)}&lid=`,
    bossId: payload.zpData.encBossId,
    securityId: payload.zpData.securityId,
  };
}

async function waitForChatInput(page, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    for (const selector of CHAT_INPUT_SELECTORS) {
      const locator = page.locator(selector).first();
      if (await locator.isVisible().catch(() => false)) {
        return locator;
      }
    }
    await sleep(300);
  }
  return null;
}

async function sendGreeting(page, greeting) {
  if (!greeting) return false;
  const input = await waitForChatInput(page, 12000);
  if (!input) return false;

  await input.click().catch(() => {});
  const tagName = await input.evaluate((el) => el.tagName.toLowerCase()).catch(() => "");
  if (tagName === "div") {
    await input.type(greeting, { delay: 20 });
  } else {
    await input.fill(greeting);
  }
  await sleep(300);

  for (const selector of SEND_BUTTON_SELECTORS) {
    const button = page.locator(selector).first();
    if (await button.isVisible().catch(() => false)) {
      await button.click().catch(() => {});
      await sleep(800);
      return true;
    }
  }

  await page.keyboard.press("Enter").catch(() => {});
  await sleep(800);
  return true;
}

async function uploadResumeImage(page, resumePath) {
  if (!resumePath) {
    return { attempted: false, uploaded: false, warning: "resume_image not configured" };
  }
  if (!fs.existsSync(resumePath)) {
    return { attempted: false, uploaded: false, warning: `resume_image missing: ${resumePath}` };
  }

  const fileInputs = page.locator("input[type='file']");
  const count = await fileInputs.count().catch(() => 0);
  if (count === 0) {
    return { attempted: false, uploaded: false, warning: "chat file input not found" };
  }

  let imageInputIndex = -1;
  for (let i = 0; i < count; i += 1) {
    const accept = (await fileInputs.nth(i).getAttribute("accept").catch(() => "")) || "";
    if (accept.includes("image/gif") || accept.includes("image/jpg")) {
      imageInputIndex = i;
      break;
    }
  }

  if (imageInputIndex === -1) {
    return { attempted: false, uploaded: false, warning: "chat image input not found" };
  }

  await fileInputs.nth(imageInputIndex).setInputFiles(resumePath);
  await sleep(3500);

  const body = ((await page.locator("body").innerText().catch(() => "")) || "").replace(/\s+/g, " ");
  const uploaded = body.includes("[图片]");
  return {
    attempted: true,
    uploaded,
    warning: uploaded ? "" : "image uploaded but no [图片] marker found in chat list",
  };
}

async function verifyConversationVisible(page, candidate, greeting) {
  const items = await page
    .locator(".friend-content-warp, .friend-content")
    .evaluateAll((nodes) =>
      nodes.map((node) => (node.textContent || "").replace(/\s+/g, " ").trim()).filter(Boolean)
    )
    .catch(() => []);

  const greetingPrefix = String(greeting || "").slice(0, 12);
  return items.some((item) => {
    const hasIdentity = item.includes(candidate.bossName) || item.includes(candidate.brandName);
    const hasSignal =
      item.includes("[送达]") ||
      item.includes("[已读]") ||
      (greetingPrefix && item.includes(greetingPrefix)) ||
      item.includes("[图片]") ||
      item.includes("您的附件简历");
    return hasIdentity && hasSignal;
  });
}

function writeCsv(records, outPath) {
  const abs = path.resolve(outPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const rows = records.map((record) => [
    record.seq,
    record.title,
    record.company,
    record.salary,
    record.city,
    record.jd,
    record.jdUrl,
    record.status,
    record.hrContact,
  ]);

  const csv = stringify(rows, {
    header: true,
    columns: [
      "序号",
      "岗位名称",
      "投递公司",
      "薪资范围",
      "城市",
      "岗位JD",
      "JD链接",
      "投递状态",
      "HR联系方式",
    ],
  });

  fs.writeFileSync(abs, csv, "utf-8");
}

async function main() {
  const configPath = path.resolve("config.yaml");
  const root = yaml.parse(fs.readFileSync(configPath, "utf8"));
  const profile = root.profiles.default;
  const cap = Math.min(profile.limits.daily_cap, profile.limits.run_cap, 50);

  const browser = await connectOverCdpWithAutoDebug(root.browser.cdp_url);
  const context = browser.contexts()[0] ?? (await browser.newContext());
  const verifyPage = context.pages().find((page) => {
    const url = page.url();
    return url.includes("/web/passport/zp/verify") || url.includes("code=36");
  });
  if (verifyPage) {
    throw new Error(`BLOCKER: Boss verification/risk-control page (${verifyPage.url()})`);
  }
  const jobsPage = await getStableJobsPage(context);
  const chatPage = await getStableChatPage(context);
  jobsPage.setDefaultTimeout(root.browser.timeout_ms);
  chatPage.setDefaultTimeout(root.browser.timeout_ms);
  await preflightOrThrow(jobsPage);
  await preflightOrThrow(chatPage);

  const candidates = await collectCandidates(jobsPage, profile, cap, 10);
  console.log(`Collected ${candidates.length} matching candidates`);

  const records = [];
  const warnings = [];
  let consecutiveAbnormal = 0;

  for (const candidate of candidates.slice(0, cap)) {
    const seq = records.length + 1;
    const jdUrl = `https://www.zhipin.com/job_detail/${candidate.encryptJobId}.html`;
    let status = "投递失败";

    let delivered = false;
    let lastFailure = "";
    for (let attempt = 1; attempt <= MAX_AUTO_DEBUG_ATTEMPTS; attempt += 1) {
      try {
        await sleep(randomBetween(2600, 6800));
        const chat = await addFriend(chatPage, candidate);
        await chatPage.goto(chat.chatUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
        await sleep(randomBetween(2400, 6200));
        await preflightOrThrow(chatPage);

        const greeted = await sendGreeting(chatPage, profile.greeting || "");
        await sleep(randomBetween(1300, 3600));
        const upload = await uploadResumeImage(chatPage, profile.resume_image || "");
        await sleep(randomBetween(1300, 3600));
        const visible = await verifyConversationVisible(chatPage, candidate, profile.greeting || "");

        if (upload.warning) {
          warnings.push(`${candidate.brandName}/${candidate.jobName}: ${upload.warning}`);
        }

        if (visible && greeted) {
          status = "已投递";
          delivered = true;
          break;
        }

        const failReason = greeted ? "未确认聊天列表可见" : "未找到聊天输入框";
        const debug = await saveDebugArtifacts(chatPage, candidate, attempt);
        const recovered = await recoverAndRetryChat(chatPage, chat.chatUrl);
        lastFailure =
          `${failReason}; auto-debug attempt=${attempt}; ` +
          `input=${recovered.inputVisible}; fileInputs=${recovered.fileInputCount}; ` +
          `screenshot=${debug.screenPath}; html=${debug.htmlPath}`;
        console.warn(`Auto-debug retry ${attempt}: ${candidate.brandName}/${candidate.jobName} -> ${lastFailure}`);
      } catch (error) {
        const message = (error && error.message) ? error.message : String(error);
        if (isHardBlockerMessage(message)) {
          throw error;
        }
        const debug = await saveDebugArtifacts(chatPage, candidate, attempt);
        lastFailure =
          `${message}; auto-debug attempt=${attempt}; ` +
          `screenshot=${debug.screenPath}; html=${debug.htmlPath}`;
        console.warn(`Auto-debug retry ${attempt}: ${candidate.brandName}/${candidate.jobName} -> ${lastFailure}`);
        await sleep(randomBetween(1400, 3800));
      }
    }

    if (!delivered) {
      status = `投递失败: 自动重试${MAX_AUTO_DEBUG_ATTEMPTS}次未成功; ${lastFailure || "unknown"}`;
    }

    records.push({
      seq,
      title: candidate.jobName,
      company: candidate.brandName,
      salary: candidate.salaryDesc,
      city: candidate.cityName,
      jd: [candidate.jobExperience, candidate.jobDegree, ...(candidate.skills || [])].join(" / "),
      jdUrl,
      status,
      hrContact: `${candidate.bossName || ""} ${candidate.bossTitle || ""}`.trim(),
    });

    writeCsv(records, profile.output.csv_path);
    console.log(`${seq}. ${candidate.brandName} / ${candidate.jobName} -> ${status}`);

    if (isAccountAbnormalMessage(status)) {
      consecutiveAbnormal += 1;
      if (consecutiveAbnormal >= MAX_CONSECUTIVE_ABNORMAL) {
        throw new Error(
          `BLOCKER: account abnormal repeated ${consecutiveAbnormal} times; auto-pausing to avoid risk escalation`
        );
      }
    } else {
      consecutiveAbnormal = 0;
    }

    await sleep(getPostRecordCooldownMs(seq));
  }

  if (warnings.length) {
    const warningPath = path.resolve("output/prod-apply-warnings.log");
    fs.writeFileSync(warningPath, warnings.join("\n"), "utf8");
    console.log(`Warnings written: ${warningPath}`);
  }
  const delivered = records.filter((record) => record.status === "已投递").length;
  const failed = records.filter((record) => record.status.startsWith("投递失败")).length;
  console.log(`SUMMARY total=${records.length} delivered=${delivered} failed=${failed}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
