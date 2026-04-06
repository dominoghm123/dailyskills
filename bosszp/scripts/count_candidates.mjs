import fs from "node:fs";
import { chromium } from "playwright";
import yaml from "yaml";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

async function main() {
  const root = yaml.parse(fs.readFileSync("config.yaml", "utf8"));
  const profile = root.profiles.default;

  const browser = await chromium.connectOverCDP(root.browser.cdp_url);
  const context = browser.contexts()[0] ?? (await browser.newContext());
  const page = await context.newPage();
  await gotoWithRetry(page, "https://www.zhipin.com/web/geek/jobs?query=AI%E4%BA%A7%E5%93%81%E8%BF%90%E8%90%A5&city=100010000");

  const seen = new Set();
  const countsByKeyword = new Map();
  const countsByCity = new Map();

  for (const keyword of profile.search.keywords) {
    let keywordCount = 0;
    console.log(`Scanning keyword: ${keyword}`);

    for (let pageNo = 1; pageNo <= 10; pageNo += 1) {
      const query = new URLSearchParams({
        query: keyword,
        city: "100010000",
        page: String(pageNo),
        pageSize: "30",
      }).toString();

      let data;
      let lastError;
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          data = await page.evaluate(async (url) => {
            const res = await fetch(url, {
              credentials: "include",
              headers: { "x-requested-with": "XMLHttpRequest" },
            });
            return res.json();
          }, `https://www.zhipin.com/wapi/zpgeek/search/joblist.json?${query}`);
          break;
        } catch (error) {
          lastError = error;
          await gotoWithRetry(page, "https://www.zhipin.com/web/geek/jobs?query=AI%E4%BA%A7%E5%93%81%E8%BF%90%E8%90%A5&city=100010000");
        }
      }
      if (!data) throw lastError;

      if (data?.code && data.code !== 0) {
        throw new Error(`${keyword} page ${pageNo}: ${data.message || data.code}`);
      }
      console.log(`  page ${pageNo}: ${data?.zpData?.jobList?.length || 0} raw jobs`);

      const list = data?.zpData?.jobList || [];
      for (const job of list) {
        if (seen.has(job.encryptJobId)) continue;
        if (job.contact) continue;
        if (!matchesProfile(job, profile)) continue;

        seen.add(job.encryptJobId);
        keywordCount += 1;
        countsByCity.set(job.cityName, (countsByCity.get(job.cityName) || 0) + 1);
      }

      if (!data?.zpData?.hasMore) break;
    }

    countsByKeyword.set(keyword, keywordCount);
  }

  console.log(JSON.stringify({
    total: seen.size,
    byKeyword: Object.fromEntries(countsByKeyword),
    byCity: Object.fromEntries(countsByCity),
    cities: profile.search.city,
    keywords: profile.search.keywords,
  }, null, 2));

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
