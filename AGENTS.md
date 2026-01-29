# Repository Guidelines

## Project Structure & Module Organization

This repo is a Claude Code plugin and config library with a Codex-compatible layer. Key paths:

- `agents/`, `skills/`, `commands/`, `rules/` for reusable configs and workflows.
- `hooks/` and `scripts/` for automation (Node.js).
- `tests/` for Node-based tests.
- `contexts/`, `examples/`, `mcp-configs/`, `.claude-plugin/` for runtime context and packaging.
- `.codex/` for Codex project config, skills, and command rules.
Add new additions to the matching folder (for example, a new agent goes in `agents/agent-name.md`).

## Build, Test, and Development Commands

- No build step; changes are Markdown/JSON/JS configs plus Node scripts.
- Run all tests: `node tests/run-all.js`.
- Run a single test: `node tests/lib/utils.test.js`.
- Package-manager helper: `node scripts/setup-package-manager.js --detect` or `node scripts/setup-package-manager.js --project bun`.

## Rules Summary (Codex)

- Security: no secrets, validate inputs, prevent injection/XSS/CSRF, verify auth.
- Testing: TDD (red→green→refactor), run unit/integration/E2E, 80%+ coverage.
- Coding style: immutable updates, small cohesive files, explicit error handling, no console.log.
- Git/PR: commit format `<type>: <description>`; include PR summary and test plan.
- Hooks/automation: prefer tmux for long tasks; avoid ad-hoc doc files; format JS/TS.
- Patterns/perf: follow API/repository patterns; use proven skeletons; mind context limits.
- Delegation: use planner for complex work, tdd-guide for features, code-reviewer after edits.

## Codex Skill Triggers

- Use `plan`, `tdd`, `code-review`, `verify`, `build-fix` for the matching workflows.
- Use `commands-catalog` for any other /command not covered above.
