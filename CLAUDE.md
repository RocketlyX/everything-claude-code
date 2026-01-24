# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Everything Claude Code 是一个 Claude Code 插件，提供经过实战检验的配置集合，包括 agents、skills、hooks、commands 和 rules。支持 Windows、macOS 和 Linux。

## Commands

```bash
# 运行所有测试
node tests/run-all.js

# 运行单个测试文件
node tests/lib/utils.test.js
node tests/lib/package-manager.test.js
node tests/hooks/hooks.test.js

# 配置包管理器
node scripts/setup-package-manager.js --global pnpm   # 全局配置
node scripts/setup-package-manager.js --project bun   # 项目配置
node scripts/setup-package-manager.js --detect        # 检测当前设置
```

## Architecture

### 插件组件

- **agents/** - 9 个专用子代理 (planner, architect, code-reviewer, security-reviewer, tdd-guide, build-error-resolver, e2e-runner, refactor-cleaner, doc-updater)
- **commands/** - 15 个斜杠命令 (/tdd, /plan, /code-review, /e2e, /build-fix, /refactor-clean, /learn, /checkpoint, /verify, /eval, /orchestrate, /setup-pm, /test-coverage, /update-codemaps, /update-docs)
- **skills/** - 领域知识模块 (tdd-workflow, backend-patterns, frontend-patterns, coding-standards, security-review, verification-loop, eval-harness, strategic-compact, continuous-learning, clickhouse-io)
- **rules/** - 8 个规则文件 (security, coding-style, testing, git-workflow, performance, agents, patterns, hooks)
- **hooks/** - hooks.json 包含 PreToolUse, PostToolUse, PreCompact, SessionStart, SessionEnd, Stop 事件钩子

### 核心脚本

```
scripts/
├── lib/
│   ├── utils.js              # 跨平台文件/路径/系统工具
│   └── package-manager.js    # 包管理器检测和选择逻辑
├── hooks/
│   ├── session-start.js      # 会话开始时加载上下文
│   ├── session-end.js        # 会话结束时保存状态
│   ├── pre-compact.js        # 压缩前保存状态
│   ├── suggest-compact.js    # 策略性压缩建议
│   └── evaluate-session.js   # 从会话中提取模式
└── setup-package-manager.js  # 交互式包管理器配置
```

### 包管理器检测优先级

1. 环境变量: `CLAUDE_PACKAGE_MANAGER`
2. 项目配置: `.claude/package-manager.json`
3. package.json 的 `packageManager` 字段
4. Lock 文件检测 (package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb)
5. 全局配置: `~/.claude/package-manager.json`
6. 回退: 首个可用的包管理器

### 插件清单

- `.claude-plugin/plugin.json` - 插件元数据，声明 commands 和 skills 路径
- `.claude-plugin/marketplace.json` - 市场分发配置

## Hooks 系统

hooks.json 使用 `${CLAUDE_PLUGIN_ROOT}` 变量引用插件根目录下的脚本。主要钩子功能:

- **PreToolUse**: 阻止 tmux 外的 dev server、git push 前提醒、阻止不必要的 .md 文件创建、建议手动压缩
- **PostToolUse**: 记录 PR URL、自动格式化 JS/TS 文件、TypeScript 类型检查、console.log 警告
- **PreCompact**: 压缩前保存状态
- **SessionStart**: 加载上下文和检测包管理器
- **SessionEnd**: 持久化会话状态、评估会话模式

## Agent 和 Command 格式

Agent 使用 YAML frontmatter 定义:
```yaml
---
name: agent-name
description: 描述
tools: Read, Grep, Glob, Bash
model: opus
---
```

Command 同样使用 YAML frontmatter，可指定 allowed_tools 和 steps。
