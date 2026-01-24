# Agent Orchestration

## Available Agents

位于 `~/.claude/agents/`：

| Agent | Purpose | When to Use |
|-------|---------|-------------|
| planner | 实现规划 | 复杂功能、重构 |
| architect | 系统设计 | 架构决策 |
| tdd-guide | 测试驱动开发 | 新功能、bug 修复 |
| code-reviewer | 代码审查 | 写完代码后 |
| security-reviewer | 安全分析 | 提交前 |
| build-error-resolver | 修复构建错误 | 构建失败时 |
| e2e-runner | E2E 测试 | 关键用户流程 |
| refactor-cleaner | 死代码清理 | 代码维护 |
| doc-updater | 文档更新 | 更新文档时 |

## Immediate Agent Usage

无需用户提示即可使用：
1. 复杂功能请求 - 使用 **planner** agent
2. 刚写完/修改的代码 - 使用 **code-reviewer** agent
3. Bug 修复或新功能 - 使用 **tdd-guide** agent
4. 架构决策 - 使用 **architect** agent

## Parallel Task Execution

对于独立操作始终使用并行 Task 执行：

```markdown
# GOOD: Parallel execution
Launch 3 agents in parallel:
1. Agent 1: Security analysis of auth.ts
2. Agent 2: Performance review of cache system
3. Agent 3: Type checking of utils.ts

# BAD: Sequential when unnecessary
First agent 1, then agent 2, then agent 3
```

## Multi-Perspective Analysis

对于复杂问题，使用分角色 sub-agents：
- Factual reviewer
- Senior engineer
- Security expert
- Consistency reviewer
- Redundancy checker
