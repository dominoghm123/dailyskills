# Skills

A collection of Claude Code skills for specialized workflows.

## Available Skills

| Skill | Description |
|---|---|
| [career-pivot-resume](./career-pivot-resume/) | Full-workflow career transition system: JD analysis, gap assessment, structured interview, tailored resume generation, interview prep, and cognitive summary. |

## Install

Clone this repo and symlink (or copy) the skill folder you need into `~/.claude/skills/`:

```bash
git clone https://github.com/dominoghm123/skills.git
ln -s "$(pwd)/skills/career-pivot-resume" ~/.claude/skills/career-pivot-resume
```

Or copy a single skill directly:

```bash
cp -r skills/career-pivot-resume ~/.claude/skills/
```

## License

MIT
