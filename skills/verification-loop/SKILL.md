# Verification Loop Skill

Claude Code 会话的全面验证系统。

## When to Use

调用此 skill：
- 完成功能或重要代码更改后
- 创建 PR 之前
- 当你想确保质量门禁通过时
- 重构之后

## Verification Phases

### Phase 1: Build Verification
```bash
# 检查项目是否构建成功
npm run build 2>&1 | tail -20
# 或
pnpm build 2>&1 | tail -20
```

如果构建失败，停止并在继续之前修复。

### Phase 2: Type Check
```bash
# TypeScript 项目
npx tsc --noEmit 2>&1 | head -30

# Python 项目
pyright . 2>&1 | head -30
```

报告所有类型错误。在继续之前修复关键错误。

### Phase 3: Lint Check
```bash
# JavaScript/TypeScript
npm run lint 2>&1 | head -30

# Python
ruff check . 2>&1 | head -30
```

### Phase 4: Test Suite
```bash
# 运行带覆盖率的测试
npm run test -- --coverage 2>&1 | tail -50

# 检查覆盖率阈值
# 目标: 80% minimum
```

报告：
- Total tests: X
- Passed: X
- Failed: X
- Coverage: X%

### Phase 5: Security Scan
```bash
# 检查 secrets
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10
grep -rn "api_key" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# 检查 console.log
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

### Phase 6: Diff Review
```bash
# 显示变更内容
git diff --stat
git diff HEAD~1 --name-only
```

审查每个更改的文件：
- 意外的更改
- 缺失的错误处理
- 潜在的边缘情况

## Output Format

运行所有阶段后，生成验证报告：

```
VERIFICATION REPORT
==================

Build:     [PASS/FAIL]
Types:     [PASS/FAIL] (X errors)
Lint:      [PASS/FAIL] (X warnings)
Tests:     [PASS/FAIL] (X/Y passed, Z% coverage)
Security:  [PASS/FAIL] (X issues)
Diff:      [X files changed]

Overall:   [READY/NOT READY] for PR

Issues to Fix:
1. ...
2. ...
```

## Continuous Mode

对于长会话，每 15 分钟或重大更改后运行验证：

```markdown
设置心理检查点：
- 完成每个函数后
- 完成组件后
- 进入下一个任务之前

运行: /verify
```

## Integration with Hooks

此 skill 补充 PostToolUse hooks 但提供更深入的验证。
Hooks 立即捕获问题；此 skill 提供全面审查。
