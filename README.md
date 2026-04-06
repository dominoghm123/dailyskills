[English](#english) | [中文](#中文)

---

<a name="english"></a>

# Daily Skills

A curated collection of Claude Code skills — self-contained modules that turn your agent into a domain specialist.

**Requirements:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

```bash
# Install all skills
npx skills add dominoghm123/dailyskills

# Install a specific skill
npx skills add dominoghm123/dailyskills --skill career-pivot-resume
npx skills add dominoghm123/dailyskills --skill ielts-writing-tutor
npx skills add dominoghm123/dailyskills --skill project-abroad-helper
npx skills add dominoghm123/dailyskills --skill bosszp
```

### Invoking a skill

Skills activate automatically when you describe your task — no commands needed. You can also invoke them directly:

| Agent | Syntax |
|---|---|
| Claude Code | `/career-pivot-resume` · `/ielts-writing-tutor` · `/project-abroad-helper` · `/bosszp` |
| Cursor | `@career-pivot-resume` · `@ielts-writing-tutor` · `@project-abroad-helper` · `@bosszp` |
| Other agents | Refer to your agent's skill invocation docs |

---

## career-pivot-resume

Turns career transitions into a strategic repositioning project — not just a resume rewrite.

**Auto-triggers on:** career pivot, resume tailoring, JD analysis, interview prep

### Workflow

```
Input → JD Analysis → Gap Analysis → Interview (optional) → Resume → Deliverables
```

| Phase | What happens |
|---|---|
| JD Deep Analysis | P1/P2/P3 priority tiering, hidden expectations, ATS keyword map |
| Gap Analysis | Direct match / transferable / real gap — cluster by cluster |
| Structured Interview | Hiring-manager-style questions to surface hidden strengths |
| Resume Generation | Target-industry vocabulary, ATS-optimized, one-page discipline |
| Deliverables | Resume + Interview Prep + Cognitive Summary |

### Example

```
You:    Data analyst at ByteDance → PM role. Here's the JD.

Claude: P1: 2+ yrs PM experience, cross-team collaboration
        P2: AI/LLM familiarity, data-driven mindset
        ✅ Direct: SQL, metrics, A/B testing
        🔄 Transferable: growth analysis → product insights
        ⚠️  Gap: no PM title, no roadmap ownership
        Your edge: you think in funnels — most PM candidates can't.

        [Resume + interview prep generated]
```

### What you get

| Deliverable | What it is |
|---|---|
| Tailored Resume | Reframed with target-industry vocabulary, ATS-optimized, one page |
| JD Analysis | P1/P2/P3 tiering, hidden requirements, keyword map |
| Gap Analysis | Every requirement mapped — direct, transferable, or gap |
| Interview Prep | 3–5 likely questions with STAR-format stories |
| Cognitive Summary | Your strategic positioning rationale for the interview room |

---

## ielts-writing-tutor

Expert IELTS Academic Writing tutor for Task 1 and Task 2. Scores essays against the official 4-criterion band descriptors (May 2023), delivers structured feedback, and produces model rewrites at Band 7 or Band 8–9.

**Auto-triggers on:** IELTS essay, Task 1, Task 2, band score, "雅思作文", "雅思写作"

### Workflow

**Mode A — Review** (paste essay → get feedback → study rewrite)
```
Essay in → Score + Feedback → Choose rewrite version → Study model answer
```

**Mode B — Guided Writing** (build from prompt with a tutor)
```
Prompt in → Brainstorm → Outline → Write section by section → Final score
```

| Phase | What happens |
|---|---|
| Language selection | English or 中英双语 — applies to all output |
| Task identification | Confirms Task 1/2 type; checks word count |
| Evaluation | Scores TA/TR · CC · LR · GRA with evidence quoted from your essay |
| Feedback report | Grammar edits with rules explained, vocabulary upgrades, structural advice |
| Rewrite | Full model essay first, then paragraph analysis, then improvement table |

### Example

```
You:    [pastes Task 2 Discussion essay, target band 7.0]

Claude: 请问您希望以哪种语言接收反馈？
        (a) English  (b) 中英双语

You:    b

Claude: Band 6.0 overall
        TR 6.0 — Both views addressed; personal opinion not stated in intro
        CC 6.5 — Clear structure; effective discourse markers
        LR 6.0 — Good vocab ("echo chambers") alongside clichés ("bridging the gap")
        GRA 6.0 — "families...was" → "were"; "separated" → "separates"

        请问你想要哪个版本的改写范文？
        (a) Band 7  (b) Band 8–9  (c) Both
```

### What you get

| Deliverable | What it is |
|---|---|
| Band Score | Overall + per-criterion, calibrated against official May 2023 descriptors |
| Grammar & Spelling Edits | Itemized corrections with the underlying rule explained |
| Vocabulary Upgrades | 3–5 phrase-level substitutions with reasoning |
| Structural Suggestions | Paragraph-level advice; TEE method coaching |
| Model Rewrite | Band 7 (learnable) and/or Band 8–9 (optimal): full essay → paragraph analysis → improvement table |

---

## project-abroad-helper

All-in-one overseas opportunity discovery and application assistant — not just degree programs. Covers WHV, digital nomad visas, job seeker visas, residencies, study tours, and more, anywhere in the world. Remembers your profile and application status across sessions.

**Auto-triggers on:** going abroad, WHV, working holiday, digital nomad, study abroad, SOP, overseas program, visa application, 留学, 出国, 打工度假, 数字游民, 海外项目

### Opportunity types covered

| Type | Examples |
|---|---|
| Master's / PhD | Europe, Singapore, Australia, Canada |
| Working Holiday Visa (WHV) | Australia, New Zealand, Canada, Ireland, Japan |
| Digital Nomad Visa | Portugal, Estonia, Thailand, Bali, Spain |
| Job Seeker Visa | Germany, Spain, Portugal, Austria |
| Study tours / Language schools | Immersive short-term programs worldwide |
| Exchange programs | University exchange, academic visits |
| Artist residencies | Creative overseas residency programs |
| Volunteer programs | Overseas volunteer with housing / stipend |

### Evaluation dimensions

Every opportunity is evaluated across five equal dimensions: employment resources, city vibe, local salary, PR/residency pathway, and scholarship/funding support.

### Example

```
You:    Architecture background, IELTS 7.5, interested in Tech × Art intersection.
        Looking for something in Europe — open to any format, not just a degree.

Claude: Here are 4 options that fit your profile:

        | Program / Visa        | Type          | Country  | Cost / Funding        | PR Path | Employment Highlight   | Deadline  |
        |-----------------------|---------------|----------|-----------------------|---------|------------------------|-----------|
        | TU Delft MSc RMIT     | Master's      | NL       | ~€2,000/yr tuition    | ✅ 5yr  | Top design firms nearby| Jan 15    |
        | Portugal D8 Nomad     | Digital Nomad | PT       | €760/mo income req    | ✅ 5yr  | Lisbon tech scene      | Rolling   |
        | Germany Job Seeker    | Job Seeker    | DE       | Self-funded 6 months  | ✅      | Strong UX market       | Rolling   |
        | Ars Electronica Res.  | Residency     | AT       | Stipend provided      | ❌      | AI × Art, top network  | Mar 1     |

        TU Delft stands out for your Tech × Art focus — the industrial design ecosystem
        in Delft is one of Europe's strongest, and the 5-year residence path is clean.
```

### What you get

| Deliverable | What it is |
|---|---|
| Opportunity shortlist | Table + personalized notes on why each fits your profile |
| Requirements breakdown | Checklist of materials, gap analysis against your profile |
| Application documents | SOP, CV, motivation letter, cold email to professors |
| Application tracker | Status, deadlines, and materials tracked across sessions |
| Deadline reminders | 30-day alerts at the start of every session |

---

## bosszp

Boss直聘 outreach automation skill for real production batches via an existing Chrome CDP session.

**Auto-triggers on:** Boss直聘/BossZP outreach, batch apply, Chrome unavailable, CDP attach failures, delivery/failure reporting

### What it handles

| Capability | Details |
|---|---|
| Production batch run | Sends greeting + resume image flow and writes CSV records |
| CDP resilience | Retries attach, captures diagnostics, emits blocker hints |
| Failure diagnostics | One-command debug for `Chrome/CDP unavailable` |
| Custom schedule | Supports `--time/--days/--timezone` via CLI scheduler |
| Run reporting | Summarizes total, 已投递, 投递失败 and blocker categories |

### Typical commands inside the skill

```bash
npm install
./bin/launch-chrome.sh 9222
npm run debug:cdp
npm run run:scheduled -- --time 16:00 --days weekdays --timezone Asia/Shanghai
npm run prod:apply
```

---

## License

MIT

---

<a name="中文"></a>

# Daily Skills（技能库）

一个 Claude Code 技能合集 —— 每个 Skill 都是独立模块，让你的 AI Agent 成为特定领域的专家。

**环境要求：** [Claude Code](https://docs.anthropic.com/en/docs/claude-code)

```bash
# 安装全部技能
npx skills add dominoghm123/dailyskills

# 安装指定技能
npx skills add dominoghm123/dailyskills --skill career-pivot-resume
npx skills add dominoghm123/dailyskills --skill ielts-writing-tutor
npx skills add dominoghm123/dailyskills --skill project-abroad-helper
npx skills add dominoghm123/dailyskills --skill bosszp
```

### 如何调用技能

技能会根据你的描述自动触发，无需任何命令。你也可以直接调用：

| Agent | 调用方式 |
|---|---|
| Claude Code | `/career-pivot-resume` · `/ielts-writing-tutor` · `/project-abroad-helper` · `/bosszp` |
| Cursor | `@career-pivot-resume` · `@ielts-writing-tutor` · `@project-abroad-helper` · `@bosszp` |
| 其他 Agent | 参考对应 Agent 的技能调用文档 |

---

## career-pivot-resume（职业转型简历）

将职业转型变成一次系统性的战略重塑，而不只是改一份简历。

**自动触发条件：** 职业转型、简历优化、JD 分析、面试准备、"转行"、"转岗"

### 工作流程

```
输入材料 → JD 深度分析 → 差距分析 → 结构化访谈（可选）→ 简历生成 → 交付物
```

| 阶段 | 内容 |
|---|---|
| JD 深度分析 | P1/P2/P3 优先级拆解、隐性要求识别、ATS 关键词图谱 |
| 差距分析 | 逐项映射：直接匹配 / 可迁移 / 真实差距 |
| 结构化访谈 | 以招聘官视角深挖你的核心优势，发现简历里写不出来的竞争力 |
| 简历生成 | 目标行业词汇重塑，ATS 优化，严格一页 |
| 交付物 | 简历 + 面试准备 + 认知摘要 |

### 使用示例

```
你：    我是字节跳动的数据分析师，想转产品经理。这是我在投的 JD。

Claude：P1（硬门槛）：2 年以上 PM 经验、跨团队协作能力
        P2（加分项）：AI/LLM 产品认知、数据驱动决策
        ✅ 直接匹配：SQL、指标体系、A/B 测试
        🔄 可迁移：增长分析 → 用户洞察与产品决策
        ⚠️  真实差距：无 PM title，无产品路线图经验
        你的核心优势：你天然用漏斗和数据思考问题，
        大多数转型 PM 候选人没有这个底子。

        [简历已生成 + 面试准备已完成]
```

### 你会得到什么

| 交付物 | 内容说明 |
|---|---|
| 定制简历 | 目标行业词汇重构，ATS 优化，严格一页 |
| JD 分析报告 | P1/P2/P3 优先级拆解、隐性要求、关键词图谱 |
| 差距分析 | 每项要求的映射结果：直接匹配、可迁移或真实差距 |
| 面试准备 | 3–5 道高频问题 + STAR 格式参考答案 |
| 认知摘要 | 你的战略定位逻辑 —— 帮你在面试前先想清楚自己的叙事 |

---

## ielts-writing-tutor（雅思写作辅导）

雅思学术类写作专项辅导，覆盖 Task 1 和 Task 2。依据官方四维评分标准（2023 年 5 月版）打分，提供结构化反馈，并生成 Band 7 或 Band 8–9 范文。

**自动触发条件：** 雅思作文、Task 1、Task 2、band score、"雅思写作"

### 工作流程

**模式 A — 作文批改**（提交已写作文 → 获取反馈 → 学习范文）
```
提交作文 → 评分 + 详细反馈 → 选择范文版本 → 对照学习
```

**模式 B — 辅导写作**（从题目开始，一步步写完）
```
提交题目 → 头脑风暴 → 提纲 → 分段写作 + 实时反馈 → 整体评分
```

| 阶段 | 内容 |
|---|---|
| 语言选择 | English 或 中英双语，适用于所有输出内容 |
| 题型识别 | 确认 Task 1/2 类型；检查字数是否达标 |
| 评分 | 按 TA/TR · CC · LR · GRA 四维打分，引用原文句子作为评分依据 |
| 反馈报告 | 语法纠错（附规则说明）、词汇升级建议、结构优化指导 |
| 范文改写 | 先呈现完整范文，再逐段分析改动，最后汇总核心提升点 |

### 使用示例

```
你：    [粘贴一篇雅思 Task 2 双方观点题，目标分数 7.0]

Claude：请问您希望以哪种语言接收反馈？
        (a) English  (b) 中英双语

你：    b

Claude：综合评分 6.0
        TR 6.0 — 两方观点均有论及；引言段未明确表达个人立场
        CC 6.5 — 段落结构清晰；篇章标记词使用得当
        LR 6.0 — 亮点词汇（"echo chambers"）与陈套表达（"bridging the gap"）并存
        GRA 6.0 — "families...was" → "were"；"separated" → "separates"

        请问你想要哪个版本的改写范文？
        (a) Band 7  (b) Band 8–9  (c) 两个版本都要
```

### 你会得到什么

| 交付物 | 内容说明 |
|---|---|
| 雅思评分 | 综合分 + 四维细分，依据官方 2023 年 5 月版评分标准 |
| 语法与拼写纠错 | 逐条列出，附规则说明 —— 不只告诉你改什么，还告诉你为什么 |
| 词汇升级建议 | 3–5 处具体短语替换，附理由说明 |
| 结构优化指导 | 段落层面的组织建议；TEE 写作法辅导 |
| 范文改写 | Band 7（可学习版）和/或 Band 8–9（最优版）：完整范文 → 逐段解析 → 核心提升汇总表 |

---

## project-abroad-helper（海外项目申请助手）

全类型海外机会发现与申请助手——不只是留学，打工度假、数字游民签证、求职签证、艺术驻留全都覆盖，全球范围，跨 session 记忆你的档案和申请进度。

**自动触发条件：** 出国、留学、WHV、打工度假、数字游民、海外项目、SOP、申请文书、签证、出海、帮我找项目

### 覆盖的机会类型

| 类型 | 举例 |
|---|---|
| 硕士 / 博士学位 | 欧洲、新加坡、澳大利亚、加拿大等 |
| 打工度假签证（WHV） | 澳大利亚、新西兰、加拿大、爱尔兰、日本等 |
| 数字游民签证 | 葡萄牙、爱沙尼亚、泰国、巴厘岛、西班牙等 |
| 求职签证 | 德国、西班牙、葡萄牙、奥地利等 |
| 短期游学 / 语言学校 | 全球性价比高的沉浸式项目 |
| 交换项目 | 大学交换、学术访问 |
| 艺术家驻留 | 创意方向的海外驻留 |
| 志愿者项目 | 有住宿或津贴的海外志愿者 |

### 评估维度

每个机会从五个平等权重的维度评估：就业资源、城市氛围、当地薪酬、居留路径、经费支持。

### 使用示例

```
你：    建筑背景，雅思 7.5，对 Tech × Art 方向感兴趣。
        想去欧洲，不限形式，不一定要读学位。

Claude：以下 4 个方向符合你的情况：

        | 项目 / 签证           | 类型     | 国家 | 费用 / 资金         | 居留路径 | 就业亮点             | 截止日期 |
        |-----------------------|----------|------|---------------------|----------|----------------------|----------|
        | TU Delft MSc RMIT     | 硕士     | 荷兰 | ~€2,000/年学费      | ✅ 5年   | 顶级设计公司聚集     | 1月15日  |
        | 葡萄牙 D8 数字游民    | 数字游民 | 葡萄牙 | 月收入€760要求    | ✅ 5年   | 里斯本科技生态成熟   | 随时申请 |
        | 德国求职签证          | 求职签证 | 德国 | 自费，最长6个月     | ✅       | UX 市场需求强劲      | 随时申请 |
        | Ars Electronica 驻留  | 艺术驻留 | 奥地利 | 提供津贴          | ❌       | AI × Art 顶级圈子   | 3月1日   |

        TU Delft 最契合你的 Tech × Art 方向——代尔夫特的工业设计生态是欧洲最强之一，
        5 年居留路径也清晰。
```

### 你会得到什么

| 交付物 | 内容说明 |
|---|---|
| 项目推荐清单 | 表格 + 个性化点评，说明为什么适合你 |
| 申请要求拆解 | 材料清单 + 对照你的档案的 Gap 分析 |
| 申请文书 | SOP、CV、动机信、教授套磁邮件 |
| 申请追踪 | 跨 session 记录状态、截止日期、材料进度 |
| Deadline 提醒 | 30 天内截止自动在对话开头提醒 |

---

## bosszp（Boss 直聘自动化外联）

面向真实投递场景的 Boss 直聘自动化 skill，基于已登录 Chrome 的 CDP 会话执行批量外联。

**自动触发条件：** Boss直聘/BossZP 自动投递、批量打招呼、Chrome unavailable、CDP 连接失败、投递结果统计

### 核心能力

| 能力 | 说明 |
|---|---|
| 生产批次执行 | 发送问候语 + 上传简历图片，并写入 CSV |
| CDP 稳定性增强 | 自动重试 attach，失败时输出诊断与 hint |
| 一键故障排查 | `npm run debug:cdp` 快速定位 Chrome/CDP 不可用原因 |
| 自定义投递时间 | 支持 `--time/--days/--timezone` 直接调度 |
| 批次结果汇总 | 输出 total、已投递、投递失败和 blocker 分类 |

### 典型命令

```bash
npm install
./bin/launch-chrome.sh 9222
npm run debug:cdp
npm run run:scheduled -- --time 16:00 --days weekdays --timezone Asia/Shanghai
npm run prod:apply
```

---

## 许可证

MIT
