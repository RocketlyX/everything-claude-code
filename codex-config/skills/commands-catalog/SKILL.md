---
name: commands-catalog
description: Catalog of repo commands and how to run them manually in Codex.
---

# Commands Catalog

## When to use
- You need a /command not covered by dedicated skills (plan/tdd/code-review/verify/build-fix).
- You want the canonical command instructions before running them manually.

Use this skill when you need to replicate Claude Code slash commands in Codex.

## How to use
1. Pick a command from the index below.
2. Open the referenced file under `references/commands/`.
3. Follow the steps manually (Codex does not execute slash commands).

## Command index
- /build-fix -> references/commands/build-fix.md — See file for details.
- /checkpoint -> references/commands/checkpoint.md — See file for details.
- /code-review -> references/commands/code-review.md — See file for details.
- /e2e -> references/commands/e2e.md — Generate and run end-to-end tests with Playwright. Creates test journeys, runs tests, captures screenshots/videos/traces, and uploads artifacts.
- /eval -> references/commands/eval.md — See file for details.
- /evolve -> references/commands/evolve.md — Cluster related instincts into skills, commands, or agents
- /go-build -> references/commands/go-build.md — Fix Go build errors, go vet warnings, and linter issues incrementally. Invokes the go-build-resolver agent for minimal, surgical fixes.
- /go-review -> references/commands/go-review.md — Comprehensive Go code review for idiomatic patterns, concurrency safety, error handling, and security. Invokes the go-reviewer agent.
- /go-test -> references/commands/go-test.md — Enforce TDD workflow for Go. Write table-driven tests first, then implement. Verify 80%+ coverage with go test -cover.
- /instinct-export -> references/commands/instinct-export.md — Export instincts for sharing with teammates or other projects
- /instinct-import -> references/commands/instinct-import.md — Import instincts from teammates, Skill Creator, or other sources
- /instinct-status -> references/commands/instinct-status.md — Show all learned instincts with their confidence levels
- /learn -> references/commands/learn.md — See file for details.
- /orchestrate -> references/commands/orchestrate.md — See file for details.
- /plan -> references/commands/plan.md — Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
- /refactor-clean -> references/commands/refactor-clean.md — See file for details.
- /setup-pm -> references/commands/setup-pm.md — Configure your preferred package manager (npm/pnpm/yarn/bun)
- /skill-create -> references/commands/skill-create.md — Analyze local git history to extract coding patterns and generate SKILL.md files. Local version of the Skill Creator GitHub App.
- /tdd -> references/commands/tdd.md — Enforce test-driven development workflow. Scaffold interfaces, generate tests FIRST, then implement minimal code to pass. Ensure 80%+ coverage.
- /test-coverage -> references/commands/test-coverage.md — See file for details.
- /update-codemaps -> references/commands/update-codemaps.md — See file for details.
- /update-docs -> references/commands/update-docs.md — See file for details.
- /verify -> references/commands/verify.md — See file for details.
