# BossZP MCP Skill MVP Design

Date: 2026-03-23
Owner: dqc76 + Codex
Status: Approved for implementation planning (pending spec review)

## Overview
Build a local, one-shot CLI-driven MCP skill that automates Boss 直聘 job applications end-to-end using Playwright. The tool runs once per command, handles QR login, applies to jobs matching configured search criteria, and outputs results to CSV for Obsidian.

## Goals
- One-shot command that exits automatically when done.
- Full automation: search -> open job -> apply -> record results.
- Per-run throughput: process >= 50 jobs per run within <= 3 minutes (network/anti-bot allowing).
- Configurable job profiles, keywords, and daily/run caps.
- All documentation and config stored inside the skill directory.

## Non-Goals
- Multi-platform support beyond local CLI + Playwright.
- Chrome extension or native messaging.
- Long-running daemon or background scheduler.
- Cloud deployment.

## Requirements
### Functional
- Input filters: keyword(s), city, salary, experience, education.
- Profile selection via CLI key.
- Keyword append via CLI.
- Resume selection based on keyword mapping to local Markdown files.
- Deduplication by job detail URL.
- Output CSV with fields:
  1. 序号
  2. 岗位名称
  3. 投递公司
  4. 薪资范围
  5. 城市
  6. 岗位JD
  7. JD链接
  8. 投递状态
  9. HR联系方式（微信/邮箱，如有）
- Login via QR every run, using an isolated browser profile directory.
- Cap: default daily limit 30 (configurable), per-run cap configurable.

### Non-Functional
- Reliability: resume/selector failures should not crash the run; failed job attempts must still be logged.
- Maintainability: selectors centralized and easy to update.
- Safety: throttle to reduce risk of anti-bot triggers.

## High-Level Architecture
Modules (all within `src/`):
- `cli`: Parse args, select profile, apply overrides.
- `config`: Load/validate `config.yaml`.
- `browser`: Launch Playwright with isolated user data dir; manage login.
- `search`: Navigate search results, collect job cards, paginate/scroll.
- `dedupe`: Track applied URLs within run; optional persistent log later.
- `apply`: Open job detail, select resume, submit application.
- `extract`: Extract job info, JD text, HR contact.
- `output`: Write CSV results.
- `throttle`: Delays and jitter.

## Data Flow
1. CLI parses `--profile` and `--keywords`.
2. Config loads profile and applies keyword append.
3. Browser starts; checks login state; if not logged in, triggers QR and waits.
4. For each keyword:
   - Navigate to search page with filters.
   - Gather job cards (scroll/paginate).
   - For each job URL:
     - Skip if already seen.
     - Open details, extract info.
     - Select resume from mapping and apply.
     - Record status and metadata in memory.
5. Stop when run cap reached or no new jobs.
6. Write CSV to configured output path.
7. Exit.

## Configuration
All files live under `/Users/dqc76/skills/bosszp/`.

Proposed layout:
- `config.yaml`
- `resumes/`
- `output/`
- `logs/`
- `src/`
- `README.md`
- `SKILL.md`
- `docs/`

Sample config shape:
```yaml
profiles:
  default:
    search:
      keywords: ["客服", "客户成功"]
      city: "上海"
      salary: "15-25K"
      experience: "3-5年"
      education: "本科"
    limits:
      daily_cap: 30
      run_cap: 50
    resume_map:
      "客户成功": "resumes/csm.md"
      "客服": "resumes/cs.md"
    output:
      csv_path: "output/results.csv"

browser:
  user_data_dir: "profile/Default"
  headless: false
  slow_mo_ms: 80
  timeout_ms: 30000

automation:
  min_delay_ms: 300
  max_delay_ms: 900
```

## Error Handling
- Login timeout: exit with message prompting QR scan.
- Selector missing: stop with explicit error suggesting selector update.
- Apply failure: log status and continue.
- Anti-bot/captcha detected: stop and report.

## Performance Strategy
- Optimize scroll/pagination to collect batches quickly.
- Parallel page tabs optional but off by default (riskier for anti-bot).
- Minimal delays with jitter to balance speed and safety.
- Target >= 50 jobs / <= 3 minutes under normal conditions.

## Testing
- Unit tests for config parsing and CSV output.
- Smoke test for Playwright flow with limited run cap (e.g., 5 jobs).
- Manual selector verification when Boss UI changes.

## Security & Compliance
- Runs locally only.
- No credential storage beyond Playwright profile cache for session.
- Respect rate limits and anti-bot signals; halt on captcha.

## Acceptance Criteria
- One command run processes >= 50 jobs and exits within 3 minutes.
- CSV output fields exactly as specified.
- Supports multiple profiles and keyword appends.
- QR login per run with isolated browser config.

## Open Questions
- None (MVP scope locked).
