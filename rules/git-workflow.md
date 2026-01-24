# Git Workflow

## Commit Message Format

```
<type>: <description>

<optional body>
```

Types: feat, fix, refactor, docs, test, chore, perf, ci

注意：Attribution 已通过 ~/.claude/settings.json 全局禁用。

## Pull Request Workflow

创建 PR 时：
1. 分析完整提交历史（不只是最新提交）
2. 使用 `git diff [base-branch]...HEAD` 查看所有更改
3. 起草全面的 PR 摘要
4. 包含带 TODO 的测试计划
5. 如果是新分支，使用 `-u` flag 推送

## Feature Implementation Workflow

1. **Plan First**
   - 使用 **planner** agent 创建实现计划
   - 识别依赖和风险
   - 分解为阶段

2. **TDD Approach**
   - 使用 **tdd-guide** agent
   - 先写测试 (RED)
   - 实现以通过测试 (GREEN)
   - 重构 (IMPROVE)
   - 验证 80%+ 覆盖率

3. **Code Review**
   - 写完代码后立即使用 **code-reviewer** agent
   - 解决 CRITICAL 和 HIGH 问题
   - 尽可能修复 MEDIUM 问题

4. **Commit & Push**
   - 详细的提交信息
   - 遵循 conventional commits 格式
