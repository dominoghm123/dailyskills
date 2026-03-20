# Daily Skills

A collection of AI agent skills for specialized workflows. Each skill is a self-contained module that turns your coding agent into a domain specialist.

## Available Skills

| Skill | What it does |
|---|---|
| [career-pivot-resume](./career-pivot-resume/) | Turns career transitions into a strategic repositioning project. JD deep analysis, competency mapping, gap assessment, structured interview, tailored resume, interview prep, and cognitive summary. |

## Install

**Requirements:** [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (or any agent supporting the [SKILL.md standard](https://github.com/vercel-labs/skills))

```bash
# One command — installs to your agent automatically
npx skills add dominoghm123/dailyskills

# Or install a specific skill only
npx skills add dominoghm123/dailyskills --skill career-pivot-resume
```

### Manual install

```bash
git clone https://github.com/dominoghm123/dailyskills.git
ln -s "$(pwd)/dailyskills/career-pivot-resume" ~/.claude/skills/career-pivot-resume
```

### Other agents (Cursor, Codex, Gemini CLI, etc.)

```bash
npx skills add dominoghm123/dailyskills -a cursor
npx skills add dominoghm123/dailyskills -a codex
```

## How it works

Skills trigger automatically based on what you say. No slash commands to memorize — just describe your task and the right skill activates.

**career-pivot-resume** runs a structured 6-phase workflow:

```
Phase 1: Input Collection ──→ Phase 2: JD Deep Analysis ──→ Phase 3: Gap Analysis
                                                                      │
Phase 6: Deliverables    ←── Phase 5: Resume Generation  ←── Phase 4: Interview
```

| Phase | What happens | Skippable? |
|---|---|---|
| 1. Input Collection | Gathers your resume, target JD(s), and supplementary materials (blogs, side projects, GitHub) | No |
| 2. JD Deep Analysis | Extracts P1/P2/P3 requirements, hidden expectations, ATS keywords, and competency clusters | No |
| 3. Gap Analysis | Maps your background against every requirement — direct match, transferable, or real gap | No |
| 4. Structured Interview | Deep interview from a hiring manager's perspective to surface hidden strengths | Yes |
| 5. Resume Generation | Tailored resume with target-industry vocabulary, ATS optimization, one-page discipline | No |
| 6. Deliverables | Resume + Interview Prep Guide + Cognitive Summary + optional cover letter/LinkedIn | No |

Phases 2-3 always run — they're the analytical backbone. Phase 4 (interview) is the only optional phase, but it's where the best material comes from.

## See it work

### Example 1: Single JD, career pivot from data analyst to PM

```
You:    I'm a data analyst at ByteDance looking to transition into product
        management. Here's the JD I'm targeting: [paste JD]

Claude: [reads your resume, analyzes the JD]
        ── JD Deep Analysis ──
        P1 (Deal-breakers): 2+ years PM experience, cross-team collaboration
        P2 (Strongly desired): AI/LLM product familiarity, data-driven decision making
        P3 (Nice-to-have): startup experience
        Hidden requirement: "fast-paced" = high autonomy + context-switching

        ── Gap Analysis ──
        ✅ Direct match: data analysis, SQL/Python, metrics-driven thinking
        🔄 Transferable: user growth analysis → user research & product insights
        ⚠️ Gap: no PM title, no product roadmap ownership
        Your core advantage: you think in funnels and metrics — most PM
        candidates can't do that natively.

Claude: Would you like to do a deep interview before I write the resume?

You:    Yes.

Claude: [4 rounds of focused questions — career narrative, role understanding,
        capability deep-dive, self-awareness]
        "Walk me through a project where YOUR analysis directly changed
        a product decision."
        "What do you think a PM actually does day-to-day that's different
        from what you do now?"

        ── Resume Generated ──
        [1-page resume in Chinese, reframed with PM vocabulary]
        [Interview Prep: 5 likely questions + STAR-format stories]
        [Cognitive Summary: your strategic positioning rationale]
```

### Example 2: Multi-JD mode, exploring a career direction

```
You:    I'm a mechanical engineer exploring DevRel roles. Here are 3 JDs:
        - Developer Advocate at Vercel
        - Developer Relations Engineer at Stripe
        - Technical Community Manager at GitHub

        I run a YouTube channel (15K subs) about 3D printing and contribute
        to open source CAD tools.

Claude: ── Cross-JD Competency Synthesis ──
        Cluster 1: Technical content creation (3/3 JDs)
        Cluster 2: Community building (3/3 JDs)
        Cluster 3: Public speaking (2/3 JDs)
        Cluster 4: Software engineering (2/3 JDs)
        Cluster 5: Developer ecosystem understanding (2/3 JDs)

        Composite archetype: "A technical storyteller who builds in public
        and grows developer communities."

        Your YouTube + open source work maps directly to clusters 1-3.
        That's your unfair advantage over career DevRel people who've
        never shipped content to a real audience.

        ── 2 Tailored Resumes ──
        [Vercel version: emphasizes content creation + Next.js blog]
        [Stripe version: emphasizes engineering background + API docs]
        [Interview prep for each role]
```

### Example 3: Skip interview, dual-language output

```
You:    I have two JDs — one at Bambu Lab (Chinese), one at Machinepulse
        (English). My resume is at cv-2026/resume.md.
        Skip the interview, just give me the resumes.

Claude: [reads resume, runs JD analysis + gap analysis on both]
        [generates Chinese resume for Bambu Lab]
        [generates English resume for Machinepulse]
        [JD Analysis + Gap Analysis included as deliverables]
```

## What you get

Every run produces a complete package, not just a resume:

| Deliverable | What it is |
|---|---|
| **Tailored Resume** | Reframed with target-industry vocabulary, ATS-optimized, one page |
| **JD Analysis** | P1/P2/P3 priority tiering, hidden requirements, keyword map |
| **Gap Analysis** | Cluster-by-cluster mapping with migration logic for transferable skills |
| **Interview Prep** | 3-5 likely questions, STAR stories, the "why are you switching" answer |
| **Cognitive Summary** | Strategic positioning rationale — helps you own the narrative before interviews |

## Key features

- **Multi-language** — matches your language throughout. Resume output language set separately.
- **Multi-JD mode** — provide multiple JDs to discover competency clusters across an entire career direction.
- **Honesty calibration** — flags where reframing is honest vs. where it would be a stretch. If you can't defend it in a 30-minute interview, it doesn't go on the resume.
- **Structured interview** — optional but powerful. Surfaces material that no resume analysis can capture.
- **ATS optimization** — exact JD keywords woven in naturally, standard section headings, no emoji.
- **Translation, not fabrication** — finds the authentic thread between where you've been and where you're going.

## License

MIT
