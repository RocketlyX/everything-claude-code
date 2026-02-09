# Hooks System

## Hook Types

- **PreToolUse**: Before tool execution (validation, parameter modification)
- **PostToolUse**: After tool execution (auto-format, checks)
- **Stop**: When session ends (final verification)

## Auto-Accept Permissions

Use with caution:
- Enable for trusted, well-defined plans
- Disable for exploratory work
- Never use dangerously-skip-permissions flag
- Configure `allowedTools` in `~/.claude.json` instead

## TodoWrite Best Practices

Use TodoWrite tool to:
- Track progress on multi-step tasks
- Verify understanding of instructions
- Enable real-time steering
- Show granular implementation steps

Todo list reveals:
- Out of order steps
- Missing items
- Extra unnecessary items
- Wrong granularity
- Misinterpreted requirements

## Codex Skill Triggers

Use these Codex skills when applicable:
- `plan`: start complex work or refactors; plan before coding.
- `tdd`: add features or fix bugs with red → green → refactor.
- `code-review`: review after code changes or before PRs.
- `verify`: run verification after completing a change set.
- `build-fix`: triage and fix build/test failures.
- `commands-catalog`: any other /command not covered above.
