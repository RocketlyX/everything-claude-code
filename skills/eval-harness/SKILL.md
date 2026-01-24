# Eval Harness Skill

Claude Code 会话的正式评估框架，实现 eval 驱动开发 (EDD) 原则。

## Philosophy

Eval 驱动开发将 evals 视为"AI 开发的单元测试"：
- 在实现之前定义预期行为
- 开发过程中持续运行 evals
- 跟踪每次更改的回归
- 使用 pass@k 指标衡量可靠性

## Eval Types

### Capability Evals
测试 Claude 是否能做之前不能做的事情：
```markdown
[CAPABILITY EVAL: feature-name]
Task: Description of what Claude should accomplish
Success Criteria:
  - [ ] Criterion 1
  - [ ] Criterion 2
  - [ ] Criterion 3
Expected Output: Description of expected result
```

### Regression Evals
确保更改不会破坏现有功能：
```markdown
[REGRESSION EVAL: feature-name]
Baseline: SHA or checkpoint name
Tests:
  - existing-test-1: PASS/FAIL
  - existing-test-2: PASS/FAIL
  - existing-test-3: PASS/FAIL
Result: X/Y passed (previously Y/Y)
```

## Grader Types

### 1. Code-Based Grader
使用代码进行确定性检查：
```bash
# 检查文件是否包含预期模式
grep -q "export function handleAuth" src/auth.ts && echo "PASS" || echo "FAIL"

# 检查测试是否通过
npm test -- --testPathPattern="auth" && echo "PASS" || echo "FAIL"

# 检查构建是否成功
npm run build && echo "PASS" || echo "FAIL"
```

### 2. Model-Based Grader
使用 Claude 评估开放式输出：
```markdown
[MODEL GRADER PROMPT]
Evaluate the following code change:
1. Does it solve the stated problem?
2. Is it well-structured?
3. Are edge cases handled?
4. Is error handling appropriate?

Score: 1-5 (1=poor, 5=excellent)
Reasoning: [explanation]
```

### 3. Human Grader
标记需要人工审查：
```markdown
[HUMAN REVIEW REQUIRED]
Change: Description of what changed
Reason: Why human review is needed
Risk Level: LOW/MEDIUM/HIGH
```

## Metrics

### pass@k
"k 次尝试中至少成功一次"
- pass@1: 首次尝试成功率
- pass@3: 3 次尝试内成功
- 典型目标: pass@3 > 90%

### pass^k
"k 次试验全部成功"
- 可靠性的更高标准
- pass^3: 连续 3 次成功
- 用于关键路径

## Eval Workflow

### 1. Define (Before Coding)
```markdown
## EVAL DEFINITION: feature-xyz

### Capability Evals
1. Can create new user account
2. Can validate email format
3. Can hash password securely

### Regression Evals
1. Existing login still works
2. Session management unchanged
3. Logout flow intact

### Success Metrics
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals
```

### 2. Implement
编写代码以通过定义的 evals。

### 3. Evaluate
```bash
# 运行 capability evals
[Run each capability eval, record PASS/FAIL]

# 运行 regression evals
npm test -- --testPathPattern="existing"

# 生成报告
```

### 4. Report
```markdown
EVAL REPORT: feature-xyz
========================

Capability Evals:
  create-user:     PASS (pass@1)
  validate-email:  PASS (pass@2)
  hash-password:   PASS (pass@1)
  Overall:         3/3 passed

Regression Evals:
  login-flow:      PASS
  session-mgmt:    PASS
  logout-flow:     PASS
  Overall:         3/3 passed

Metrics:
  pass@1: 67% (2/3)
  pass@3: 100% (3/3)

Status: READY FOR REVIEW
```

## Integration Patterns

### Pre-Implementation
```
/eval define feature-name
```
在 `.claude/evals/feature-name.md` 创建 eval 定义文件

### During Implementation
```
/eval check feature-name
```
运行当前 evals 并报告状态

### Post-Implementation
```
/eval report feature-name
```
生成完整 eval 报告

## Eval Storage

在项目中存储 evals：
```
.claude/
  evals/
    feature-xyz.md      # Eval 定义
    feature-xyz.log     # Eval 运行历史
    baseline.json       # Regression 基线
```

## Best Practices

1. **Define evals BEFORE coding** - 强制清晰思考成功标准
2. **Run evals frequently** - 尽早发现回归
3. **Track pass@k over time** - 监控可靠性趋势
4. **Use code graders when possible** - 确定性 > 概率性
5. **Human review for security** - 永远不要完全自动化安全检查
6. **Keep evals fast** - 慢的 evals 不会被运行
7. **Version evals with code** - Evals 是一等公民工件

## Example: Adding Authentication

```markdown
## EVAL: add-authentication

### Phase 1: Define (10 min)
Capability Evals:
- [ ] User can register with email/password
- [ ] User can login with valid credentials
- [ ] Invalid credentials rejected with proper error
- [ ] Sessions persist across page reloads
- [ ] Logout clears session

Regression Evals:
- [ ] Public routes still accessible
- [ ] API responses unchanged
- [ ] Database schema compatible

### Phase 2: Implement (varies)
[Write code]

### Phase 3: Evaluate
Run: /eval check add-authentication

### Phase 4: Report
EVAL REPORT: add-authentication
==============================
Capability: 5/5 passed (pass@3: 100%)
Regression: 3/3 passed (pass^3: 100%)
Status: SHIP IT
```
