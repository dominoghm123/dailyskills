import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import yaml from "yaml";

const WEEKDAY_INDEX = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

function parseArgs(argv) {
  const args = {
    configPath: "config.yaml",
    once: true,
    dryRun: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;

    const [flag, inlineValue] = token.split("=", 2);
    const nextValue = inlineValue ?? argv[i + 1];
    const consumeNext = inlineValue == null;

    switch (flag) {
      case "--time":
        args.time = nextValue;
        if (consumeNext) i += 1;
        break;
      case "--days":
        args.days = nextValue;
        if (consumeNext) i += 1;
        break;
      case "--timezone":
      case "--tz":
        args.timezone = nextValue;
        if (consumeNext) i += 1;
        break;
      case "--config":
        args.configPath = nextValue;
        if (consumeNext) i += 1;
        break;
      case "--loop":
        args.once = false;
        break;
      case "--once":
        args.once = true;
        break;
      case "--dry-run":
        args.dryRun = true;
        break;
      default:
        break;
    }
  }

  return args;
}

function parseTime(value) {
  const raw = String(value || "").trim();
  const match = raw.match(/^(\d{1,2}):(\d{2})$/u);
  if (!match) throw new Error(`Invalid --time format: ${raw}. Expected HH:MM.`);
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error(`Invalid --time value: ${raw}. Hour 0-23, minute 0-59.`);
  }
  return { hour, minute, raw: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}` };
}

function parseDays(value) {
  if (!value || String(value).trim() === "") {
    return [0, 1, 2, 3, 4, 5, 6];
  }
  const raw = String(value).trim().toLowerCase();
  if (raw === "weekdays") return [1, 2, 3, 4, 5];
  if (raw === "weekends") return [0, 6];

  const list = raw.split(",").map((part) => part.trim()).filter(Boolean);
  const days = list.map((part) => {
    if (/^\d$/u.test(part)) {
      const n = Number(part);
      if (n < 0 || n > 6) throw new Error(`Invalid weekday index: ${part}. Use 0-6.`);
      return n;
    }
    if (!(part in WEEKDAY_INDEX)) {
      throw new Error(`Invalid weekday token: ${part}. Use mon,tue,... or 0-6.`);
    }
    return WEEKDAY_INDEX[part];
  });

  return [...new Set(days)].sort((a, b) => a - b);
}

function getTzDateParts(date, timezone) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  });

  const parts = formatter.formatToParts(date);
  const map = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  const weekday = map.weekday.toLowerCase();
  const weekdayIndex = WEEKDAY_INDEX[weekday.slice(0, 3)];
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
    second: Number(map.second),
    weekdayIndex,
  };
}

function getWaitMsUntilNextSlot(now, timezone, target, allowedDays) {
  const start = now.getTime();
  const maxMinutes = 14 * 24 * 60;

  for (let i = 1; i <= maxMinutes; i += 1) {
    const candidate = new Date(start + i * 60 * 1000);
    const parts = getTzDateParts(candidate, timezone);
    if (!allowedDays.includes(parts.weekdayIndex)) continue;
    if (parts.hour !== target.hour || parts.minute !== target.minute) continue;
    candidate.setSeconds(0, 0);
    const diff = candidate.getTime() - now.getTime();
    if (diff > 0) return diff;
  }

  throw new Error("Unable to compute next schedule slot with provided --time/--days/--timezone.");
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runProductionBatch(cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn("node", ["scripts/prod_apply_api.mjs"], {
      cwd,
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      if (code === 0) return resolve();
      return reject(new Error(`prod_apply_api.mjs exited with code ${code}`));
    });

    child.on("error", (error) => reject(error));
  });
}

function loadConfig(configPath) {
  const abs = path.resolve(configPath);
  if (!fs.existsSync(abs)) return null;
  return yaml.parse(fs.readFileSync(abs, "utf8"));
}

async function main() {
  const args = parseArgs(process.argv);
  const loaded = loadConfig(args.configPath);
  const configAutomation = loaded?.automation || {};

  const timezone = args.timezone || configAutomation.schedule_timezone || loaded?.browser?.timezone_id || "Asia/Shanghai";
  const targetTime = parseTime(args.time || configAutomation.schedule_time || "16:00");
  const allowedDays = parseDays(args.days || configAutomation.schedule_days || "weekdays");

  console.log(`Schedule config: time=${targetTime.raw} days=${allowedDays.join(",")} tz=${timezone}`);

  do {
    const now = new Date();
    const waitMs = getWaitMsUntilNextSlot(now, timezone, targetTime, allowedDays);
    const runAt = new Date(now.getTime() + waitMs);
    console.log(`Next run at: ${runAt.toISOString()} (in ${Math.round(waitMs / 1000)}s)`);

    if (args.dryRun) {
      if (args.once) return;
      await sleep(1500);
      continue;
    }

    await sleep(waitMs);
    await runProductionBatch(process.cwd());

    if (args.once) return;
    await sleep(1200);
  } while (!args.once);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
