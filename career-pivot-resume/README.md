# Career Pivot Resume

A Claude Code skill for career transitions — from JD analysis to tailored resume output.

## What It Does

This skill treats career transitions as a **strategic repositioning project**, not a keyword-matching exercise. It guides you through a structured 6-phase workflow:

```
Phase 1: Input Collection → Phase 2: JD Deep Analysis → Phase 3: Gap Analysis
                                                                    │
Phase 6: Deliverables  ←  Phase 5: Resume Generation  ←  Phase 4: Interview
```

**Core outputs:**
- JD deep analysis with P1/P2/P3 priority tiering
- Cross-JD competency cluster synthesis (multi-JD mode)
- Gap analysis with transferable skill mapping
- Tailored resume(s) with ATS optimization
- Interview prep guide with STAR-format stories
- Cognitive summary for interview readiness

## Install

```bash
# Clone to your Claude Code skills directory
git clone https://github.com/dominoghm123/skills.git ~/.claude/skills/career-pivot-resume
```

Or manually copy `SKILL.md` to `~/.claude/skills/career-pivot-resume/`.

## Usage

The skill triggers automatically in Claude Code when you mention:
- Resume tailoring, career transition, career pivot, job application
- JD analysis, resume rewriting, role matching
- Keywords: "简历", "转行", "转岗", "JD分析", "岗位匹配", "面试准备"

**Example prompts:**

```
I'm a data analyst looking to transition into product management.
Here's the JD I'm targeting: [paste JD]
```

```
我想从机械工程师转行做开发者关系，这是3个我看中的JD...
```

## Features

- **Multi-language**: Matches your language throughout the workflow. Resume output language is set separately.
- **Multi-JD mode**: Provide multiple JDs to discover competency clusters across roles.
- **Honesty calibration**: Flags where reframing is honest vs. where it would be a stretch.
- **Structured interview**: Optional deep interview phase that surfaces material no resume analysis can capture.
- **ATS optimization**: Keyword alignment with exact JD terminology, standard section headings.

## Skill Structure

```
career-pivot-resume/
├── SKILL.md          # Skill prompt (the core logic)
├── evals/
│   └── evals.json    # Evaluation scenarios
├── README.md
├── LICENSE           # MIT
└── .gitignore
```

## License

MIT
