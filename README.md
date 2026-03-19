# Daily Skills

A collection of AI agent skills for specialized workflows.

## Available Skills

| Skill | Description |
|---|---|
| [career-pivot-resume](./career-pivot-resume/) | Full-workflow career transition system: JD analysis, gap assessment, structured interview, tailored resume generation, interview prep, and cognitive summary. |

## Install

```bash
# Install all skills
npx skills add dominoghm123/dailyskills

# Install a specific skill
npx skills add dominoghm123/dailyskills --skill career-pivot-resume
```

Or manually clone and symlink:

```bash
git clone https://github.com/dominoghm123/dailyskills.git
ln -s "$(pwd)/dailyskills/career-pivot-resume" ~/.claude/skills/career-pivot-resume
```

## License

MIT
