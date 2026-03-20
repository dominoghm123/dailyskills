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
```

### Invoking a skill

Skills activate automatically when you describe your task — no commands needed. You can also invoke them directly:

| Agent | Syntax |
|---|---|
| Claude Code | `/career-pivot-resume` · `/ielts-writing-tutor` |
| Cursor | `@career-pivot-resume` · `@ielts-writing-tutor` |
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
```

### 如何调用技能

技能会根据你的描述自动触发，无需任何命令。你也可以直接调用：

| Agent | 调用方式 |
|---|---|
| Claude Code | `/career-pivot-resume` · `/ielts-writing-tutor` |
| Cursor | `@career-pivot-resume` · `@ielts-writing-tutor` |
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

## 许可证

MIT
