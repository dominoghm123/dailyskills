---
name: career-pivot-resume
description: >
  Full-workflow career transition resume system: JD deep analysis, competency extraction,
  gap analysis, structured interview, resume generation, interview prep, and cognitive summary.
  Use this skill whenever the user mentions resume tailoring, career transition, career pivot,
  job application, JD analysis, resume rewriting, or wants to prepare for a role change.
  Also trigger when the user provides a job description and asks for help applying,
  or mentions "简历", "转行", "转岗", "JD分析", "岗位匹配", or "面试准备".
---

# Career Pivot Resume

A comprehensive career transition toolkit that goes far beyond resume generation.
This skill guides the user through a structured workflow — from JD analysis to
deep self-discovery interview to tailored resume output — producing not just a
polished resume, but a clear articulation of the user's professional identity,
transferable strengths, and strategic positioning for their target role.

## Why This Skill Exists

Career transitions are not about fabricating a new identity. They're about
**translation** — finding the authentic thread between where you've been and
where you're going, then expressing it in the language your target industry
understands. Most resume tools treat this as a keyword-matching exercise.
This skill treats it as a strategic repositioning project.

## Language Rule

Match the user's language throughout the entire workflow. If the user
communicates in Chinese, all phases — including the interview questions,
analysis outputs, gap analysis, and recommendations — must be in Chinese.
If the user communicates in English, use English throughout. This applies
to the conversational interaction, not the resume output language (which
is set separately in Phase 5.1).

---

## Workflow Overview

The full workflow has 6 phases. Each phase builds on the previous one.
The user can enter at any phase if earlier phases are already complete.

```
Phase 1: Input Collection ──→ Phase 2: JD Deep Analysis ──→ Phase 3: Gap Analysis
                                                                      │
Phase 6: Deliverables ←── Phase 5: Resume Generation ←── Phase 4: Interview
```

### Phase Dependencies — What Can Be Skipped

| Phase | Skippable? | Rule |
|---|---|---|
| Phase 1: Input Collection | No | Always required |
| Phase 2: JD Deep Analysis | No | Always required — even when the user says "just make a resume," the analysis informs vocabulary and emphasis choices. Output the analysis as a deliverable. |
| Phase 3: Gap Analysis | No | Always required — it's what makes the resume a *tailored* resume, not a generic rewrite. Output the analysis as a deliverable. |
| Phase 4: Interview | Yes | Only if user explicitly declines. Ask before skipping. |
| Phase 5: Resume Generation | No | This is the core output. |
| Phase 6: Deliverables | Depends on Phase 4 | See deliverable rules below. |

**Deliverable rules based on interview status:**

- **Interview conducted** → Output all: Resume(s) + JD Analysis + Gap Analysis + Interview Prep + Cognitive Summary
- **Interview skipped** → Output only 3 items: (a) Tailored Resume(s), (b) JD Analysis, (c) Gap Analysis. Do not generate Interview Prep or Cognitive Summary — there is not enough depth to make them useful without the interview material.

The most common mistake is skipping Phases 2-3 when the user says "skip interview" or
"just give me the resume." The interview (Phase 4) is the only optional phase.
Phases 2 and 3 must always run — they are the analytical backbone that makes
every downstream output better.

---

## Phase 1: Input Collection

Gather three categories of material from the user:

### 1.1 Target JDs (one or multiple)
- Accept JDs as pasted text, file paths, or URLs
- For URLs behind auth walls (BOSS直聘, 小红书, WeChat), ask the user to paste content directly rather than wasting time on failed fetches
- Support both single-JD mode (targeting one specific role) and multi-JD mode (exploring a career direction across multiple roles)

### 1.2 Current Resume
- Read the user's existing resume (any format: .docx, .pdf, .pages, .md, .txt)
- If multiple versions exist, read all of them — different versions may contain different details
- Extract: work history, education, skills, certifications, achievements with metrics

### 1.3 Supplementary Background
- Proactively ask about materials beyond the resume:
  - Personal content: blogs, podcasts, social media accounts, newsletters
  - Side projects: GitHub repos, personal sites, creative projects
  - Community involvement: speaking, events, volunteer work
  - Informal experience: freelance work, content creation, open source contributions
- These are often the most valuable materials for career changers — they reveal authentic interests and capabilities that formal work history doesn't capture
- Fetch and analyze supplementary links when possible (personal sites, podcast platforms, etc.) to extract concrete metrics

---

## Phase 2: JD Deep Analysis

### 2.1 Single-JD Mode
Extract and structure:
- **Company context**: industry, stage, culture signals
- **Role positioning**: where this role sits in the org, who it reports to, who it collaborates with
- **Core requirements**: hard skills, soft skills, experience level, domain knowledge
- **Priority tiering**:
  - P1 (Deal-breakers): requirements that appear in both the title and the body, or are listed first
  - P2 (Strongly desired): requirements mentioned multiple times or with emphasis
  - P3 (Nice-to-have): requirements listed with "preferred", "bonus", or "plus"
- **Keywords**: exact terminology used (for ATS optimization and vocabulary alignment)
- **Hidden requirements**: what the JD implies but doesn't say explicitly (e.g., "fast-paced environment" = high autonomy + multi-threading)

### 2.2 Multi-JD Mode
When the user provides multiple JDs:
- Perform single-JD analysis on each
- Then synthesize across all JDs to identify **competency clusters** — recurring capability themes ranked by frequency
- Create a priority matrix showing which clusters appear in which JDs
- Identify the **composite archetype** — the ideal candidate profile that emerges from the pattern
- This cross-JD synthesis is the most strategically valuable output: it reveals what the market actually wants, not just what one company says

### 2.3 Output Format
Present the analysis as a structured table + narrative summary. Include:
- JD landscape overview (table: company, role, track, seniority)
- Competency clusters with frequency counts
- Priority matrix visualization
- Composite archetype description (1-2 sentences)

---

## Phase 3: Gap Analysis

Map the user's background against the extracted competency clusters.

### 3.1 For Each Cluster, Assess:

| Category | Description |
|---|---|
| **Direct match** | Experience that maps 1:1 to the requirement |
| **Transferable** | Experience in a different context but with the same underlying skill |
| **Supplementary evidence** | Personal projects, content, side work that demonstrates the capability |
| **Gap** | No evidence available — a real weakness to address |

### 3.2 Migration Logic
For transferable skills, provide explicit mapping:
- Show the user HOW their experience translates, not just THAT it translates
- Use side-by-side comparison tables (e.g., "Your consulting workflow" vs. "Content marketing workflow")
- Explain the vocabulary shift needed (same skill, different industry language)
- Flag where reframing is honest vs. where it would be a stretch — career changers need to know the difference

### 3.3 Honesty Calibration
For each claim the resume will make:
- Can the user defend this in a 30-minute interview?
- Is the metric accurate, or does it need qualification? (e.g., "全网10万+" is defensible if you can break down the math; "独立运营227万粉丝账号" is misleading if you inherited the audience)
- Would a savvy interviewer catch the reframing? If yes, how should the user explain it?

### 3.4 Output Format
- Cluster-by-cluster mapping table with evidence and fit type
- Summary matrix: strength rating, gap severity, reframe difficulty
- 3 key takeaways (what's the user's core advantage, biggest presentation gap, and most underutilized asset)

---

## Phase 4: Structured Interview

This is the heart of the skill. The interview surfaces material that no resume
or JD analysis can capture — the user's authentic motivation, hidden capabilities,
and strategic thinking about their career.

### 4.1 Before Starting
Ask the user: **"Would you like to do a deep interview before I write the resume? This helps me surface material and framing that makes the resume significantly stronger. If you'd prefer to skip it, I can go straight to writing."**

If the user declines, skip to Phase 5.

### 4.2 Interview Approach
- Adopt the perspective of a **senior hiring manager or CEO** reviewing the candidate — not a friendly chatbot, but a thoughtful, incisive interviewer
- Ask questions that reveal the user's **thinking**, not just their history
- Don't limit to a fixed number of rounds — continue as long as there's valuable material to extract
- Each round should have 2-4 focused questions
- Listen for contradictions, understatements, and hidden strengths

### 4.3 Core Interview Tracks

**Track A: Career Narrative**
- Why are you making this transition? (the real reason, not the polished version)
- What's the authentic thread connecting your past roles to your target role?
- What did you discover about yourself in your previous work?
- What part of your past work felt like "you" vs. what felt like performing?

**Track B: Role Understanding**
- Which specific roles excite you most, and why?
- What do you think this role actually does day-to-day?
- How do you see yourself contributing in the first 90 days?
- What's your understanding of the industry/company you're targeting?

**Track C: Capability Deep-Dive**
- Walk me through a project you're most proud of — what was YOUR specific contribution?
- Give me concrete metrics for your personal content/projects
- What tools and workflows do you actually use daily?
- What's something you can do that most candidates for this role can't?

**Track D: Self-Awareness & Growth**
- What's the biggest gap between you and the ideal candidate?
- How are you actively closing that gap?
- What would you need to learn in the first 6 months?
- If I told you "you're not qualified for this role," how would you respond?

### 4.4 Adaptive Questioning
- If the user gives a surface-level answer, probe deeper: "Can you be more specific?" or "What does that look like in practice?"
- If the user reveals something unexpected (a side project, a freelance gig, a personal achievement), explore it — these often become the strongest resume material
- If the user is uncertain about something, help them think through it rather than moving on

---

## Phase 5: Resume Generation

### 5.1 Language Setting
Before generating, ask: **"What language should the resume be in? Options: Chinese (default), English, or separate versions in both. Other languages available on request."**

### 5.2 Structural Principles

**Summary (3-4 bullets):**
- Lead with the most relevant credential for the target role (not necessarily the most impressive one overall)
- Each bullet should address a different competency cluster
- Use the target industry's vocabulary, not the source industry's
- Last bullet: forward-looking statement about passion/direction

**Work Experience:**
- Reframe with target-role vocabulary, but stay honest
- Bullet formula: `[Action Verb] + [What] + [Context/Method] + [Result/Impact]`
- Prioritize bullets by relevance to target role, not by impressiveness
- Include project names as sub-headers when they add credibility
- Quantify everything possible, but qualify metrics that need context

**Content/Creative/Side Projects:**
- For career changers, this section is often MORE important than work experience
- Include concrete metrics (subscribers, plays, engagement, growth)
- Show the full content operation: planning → creation → distribution → analytics
- Personal brands and side projects demonstrate initiative and authentic interest

**Education:**
- For career changers with non-traditional backgrounds, frame the degree as an asset
- Include relevant coursework only if it bridges to the target role

**Skills:**
- Categorize by function (e.g., Data Analysis, Project Management, Programming)
- List specific tools, not vague categories
- Include emerging skills with honest qualifiers (e.g., "exploring", "learning")

### 5.3 ATS Optimization
- Use standard section headings that ATS systems recognize (e.g., "Professional Experience", not "My Journey")
- After generating the resume, append a brief **ATS Keyword Checklist** as a comment section at the bottom, listing:
  - Keywords from the JD that ARE present in the resume (with location)
  - Keywords from the JD that are MISSING and should be considered for inclusion
  - This checklist is for the user's reference and should be removed before submission
- Incorporate exact keywords from the JD naturally (don't keyword-stuff)
- Spell out acronyms on first use when the full form appears in the JD
- Avoid tables, graphics, or complex formatting in the base version
- Match job title terminology where truthful
- Do not use emoji in professional resumes (no 📧📱📍 — use plain text labels)

### 5.4 Multi-Role Targeting
When generating resumes for multiple roles:
- Use the same fact base but different emphasis and vocabulary
- Adjust the summary to speak directly to each role's priorities
- Reorder bullets within each experience section by relevance
- The user should be able to see HOW the same experience is framed differently
- When targeting 3+ roles, prioritize completeness of deliverables over number of resume variants. It is better to produce 2 complete packages (resume + interview prep + cognitive summary each) than 5 resumes with no supporting materials. Ask the user which roles to prioritize if time/context is constrained.

### 5.5 One-Page Discipline
- Keep to 1 page for <10 years experience
- Every line must earn its space — if a bullet doesn't serve the target role, cut it
- When space is tight, cut the weakest experience entirely rather than compressing everything

---

## Phase 6: Deliverables & Wrap-Up

### 6.1 Required Outputs

Every run of this skill must produce all three of these deliverables,
regardless of whether the interview was conducted. If the interview was
skipped, base the Interview Prep and Cognitive Summary on the JD analysis,
gap analysis, and whatever background information is available.

**A. Tailored Resume(s)**
- Output as text in conversation first for review
- Export as .md file(s) after user approval
- File naming convention: `[Name]-[Company]-[Role].md` or `[Name]-[Role-Category].md`

**B. Interview Prep Guide**
This is required even when the interview phase is skipped — the user still
needs to prepare for real interviews. Based on the JD analysis and gap analysis, generate:
- **3-5 likely interview questions** specific to this role + this candidate's background, focusing on the gaps and reframed experience that interviewers will probe
- **Talking points** for each question (drawing from interview material if available, or from gap analysis)
- **The "why are you switching" answer** — polished version of the career narrative, 60 seconds max
- **2-3 stories to prepare** using STAR format, mapped to key competency clusters
- **Questions to ask the interviewer** that demonstrate domain understanding

**C. Cognitive Summary**
This is required because it helps the user internalize their positioning
before interviews. Without it, the resume is just a document — with it,
the user owns the narrative. Generate:
- The user's strategic positioning rationale (why this framing, why this emphasis)
- Assessment of strengths and genuine weaknesses
- Their understanding of the target role and industry (based on interview answers or inferred from background)
- Key insights from the process
- Pre-interview checklist with actionable preparation steps
- This document is for the user's own reference — it helps them internalize the narrative before interviews

### 6.2 Optional Outputs (ask user after core deliverables)
- **Cover letter hooks**: 2-3 opening paragraphs tailored to specific companies
- **LinkedIn summary**: rewritten to align with the new positioning
- **Additional language versions**: translate approved resume into other languages
- **Alternative role versions**: adapt the resume for adjacent roles

### 6.3 Iteration Protocol
After presenting the first draft:
- Ask for specific feedback on wording, emphasis, structure
- When the user makes their own edits, analyze the diff and learn from their choices
- The user's self-edits reveal their instincts about honesty calibration and self-presentation — respect these signals

---

## Best Practices

### Do:
- Read the user's existing resume before suggesting changes
- Explain the "why" behind every reframing choice
- Provide migration logic when translating cross-domain experience
- Quantify achievements with specific, defensible metrics
- Respect the user's honesty instincts — if they downgrade a claim, don't push back
- Ask about supplementary evidence (side projects, content, freelance) — career changers often undervalue these

### Don't:
- Fabricate experience or inflate metrics beyond what's defensible
- Use the source industry's vocabulary in the target resume
- Assume the user's strongest credential is the most relevant one
- Skip the interview phase for career changers — it's where the best material comes from
- Generate a resume without understanding the user's career narrative first
- Keyword-stuff or over-optimize for ATS at the expense of readability

### Career Changer Specifics:
- The resume is a **translation job**, not a fabrication job
- Lead with transferable skills and authentic interest, not with years of experience
- Personal content and side projects are first-class credentials, not filler
- The career narrative must be coherent: past → bridge → future should feel inevitable, not random
- Honesty calibration matters more for career changers — interviewers will probe harder on reframed experience
