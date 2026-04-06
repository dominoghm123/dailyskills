---
name: bosszp
description: >
  Boss直聘自动化投递与批量外联 skill。使用现有 Chrome CDP 会话执行岗位搜索、打招呼、上传简历截图、写入 CSV，并在失败时自动生成诊断。
  当用户提到 Boss直聘、BossZP、批量投递、自动打招呼、CDP 连接失败、Chrome unavailable、岗位外联、投递结果统计时必须触发。
  也用于“继续上一批次投递”“检查登录/风控/选择器阻塞”“生成投递失败诊断报告”等场景。
---

# BossZP

用于在本地执行 Boss 直聘外联批次，核心目标是：
1. 稳定执行真实投递动作。
2. 在失败时给出可定位的 blocker（CDP、登录过期、风控、选择器）。
3. 产出结构化记录（CSV + debug JSON）。

## 目录

- `scripts/prod_apply_api.mjs`: 生产批次执行脚本（CDP + 自动重试 + 诊断）。
- `scripts/debug_chrome_unavailable.mjs`: CDP 不可用一键诊断。
- `scripts/count_candidates.mjs`: 候选量预估工具。
- `scripts/scheduled_run.mjs`: 按时间/时区/星期执行批次（支持 CLI 自定义投递时间）。
- `bin/launch-chrome.sh`: 本地 Chrome 启动器（含 `--remote-debugging-port`）。
- `config.example.yaml`: 脱敏配置模板。
- `references/automation-templates.md`: 主流 agent 自动化任务模板 + CLI 调度示例。

## 运行前检查

1. Node.js 18+。
2. 在 skill 目录执行 `npm install`。
3. 从 `config.example.yaml` 复制为 `config.yaml`，填写：
- `greeting`
- `resume_image`
- 搜索关键词/城市/薪资条件
4. 启动外部 Chrome（不要在批次中重启）：

```bash
./bin/launch-chrome.sh 9222
```

5. 确保 `browser.cdp_url` 指向 `http://127.0.0.1:9222`。

## 常用命令

```bash
# 生产外联批次
node scripts/prod_apply_api.mjs

# 仅诊断 Chrome unavailable / CDP 连接失败
npm run debug:cdp

# 预估符合条件岗位数量
node scripts/count_candidates.mjs

# 自定义投递时间（示例：工作日 16:00）
npm run run:scheduled -- --time 16:00 --days weekdays --timezone Asia/Shanghai
```

## 标准执行流程

1. 先备份旧产物（如 `output/results.csv`、最近批次截图）到 `output/history/<timestamp>/`。
2. 执行生产脚本：`node scripts/prod_apply_api.mjs`。
3. 结束后汇总：
- `total records`
- `已投递`
- `投递失败`
- 是否出现 blocker（CDP/login/风控/selector）
4. 报告最新：
- CSV 路径
- 关键截图路径
- debug JSON 路径（若有）

## CDP unavailable 处理

遇到 `BLOCKER: Chrome/CDP unavailable` 时，必须先跑：

```bash
npm run debug:cdp
```

该命令会输出并落盘：
- TCP 端口可达性
- `/json/version`、`/json/list` 探测结果
- 监听端口与进程快照
- 自动 hint

诊断文件在：`output/debug/cdp-auto-debug-*.json`。

## 自动化与时间配置（开箱即用）

- 在 agent 自动化平台中，直接使用 `references/automation-templates.md` 的 prompt 模板。
- 在 CLI 中通过参数直接定义投递时间，无需改脚本：
  - `--time HH:MM`
  - `--days weekdays|weekends|mon,tue,...|0,1,...,6`
  - `--timezone Asia/Shanghai`
- 也可以写入 `config.yaml`：
  - `automation.schedule_time`
  - `automation.schedule_days`
  - `automation.schedule_timezone`

## 安全边界

- 不自动修改用户问候语与岗位筛选条件，除非用户明确要求。
- 不自动重启/关闭用户外部 Chrome 进程。
- 若出现登录过期或风控验证页，立即停止并报告 blocker。
- 对真实投递动作保持“上限控制”（脚本内部最大 50）。
