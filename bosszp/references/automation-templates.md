# BossZP Automation Templates

Use these templates to make the skill work out-of-the-box in mainstream agent products.

## 1) Codex / Claude Code automation task prompt

Replace `{TIME}` and `{TZ}` and paste as automation prompt body.

```text
Run one BossZP production outreach batch using the current config.yaml settings in this workspace.
Before starting, preserve any existing output/results.csv and latest batch screenshot into a timestamped folder under output/history if they exist.
Use the existing live Chrome CDP session at http://127.0.0.1:9222, and do not close or restart the external Chrome process.
Execute up to 50 real outreach actions with the current greeting plus resume screenshot image flow, then report total records written, counts of 已投递 vs 投递失败, and any selector, login, or account-abnormal blockers with paths to the latest CSV and screenshot.
If Chrome/CDP is unavailable or the Boss login has expired, stop and report the blocker without changing config or browser state.
Schedule hint: run at {TIME} in {TZ}.
```

## 2) CLI scheduled run

Single next run at custom time:

```bash
npm run run:scheduled -- --time 16:00 --days weekdays --timezone Asia/Shanghai
```

Continuous loop mode (for long-running host):

```bash
npm run run:scheduled -- --time 18:30 --days mon,tue,wed,thu,fri --timezone Asia/Shanghai --loop
```

Only verify next trigger time without executing:

```bash
npm run run:scheduled -- --time 20:15 --days 1,3,5 --timezone Asia/Shanghai --dry-run
```

## 3) Config-driven schedule (no CLI flags)

Set in `config.yaml`:

```yaml
automation:
  schedule_time: "16:00"
  schedule_days: "weekdays"
  schedule_timezone: "Asia/Shanghai"
```

Then run:

```bash
npm run run:scheduled
```
