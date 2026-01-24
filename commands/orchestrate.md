# Orchestrate Command

用于复杂任务的顺序 agent 工作流。

## Usage

`/orchestrate [workflow-type] [task-description]`

## Workflow Types

### feature
完整功能实现工作流：
```
planner -> tdd-guide -> code-reviewer -> security-reviewer
```

### bugfix
Bug 调查和修复工作流：
```
explorer -> tdd-guide -> code-reviewer
```

### refactor
安全重构工作流：
```
architect -> code-reviewer -> tdd-guide
```

### security
安全专注审查：
```
security-reviewer -> code-reviewer -> architect
```

## Execution Pattern

对工作流中的每个 agent：

1. **Invoke agent** 带上前一个 agent 的上下文
2. **Collect output** 作为结构化交接文档
3. **Pass to next agent** 在链中传递
4. **Aggregate results** 汇总到最终报告

## Handoff Document Format

在 agents 之间，创建交接文档：

```markdown
## HANDOFF: [previous-agent] -> [next-agent]

### Context
[Summary of what was done]

### Findings
[Key discoveries or decisions]

### Files Modified
[List of files touched]

### Open Questions
[Unresolved items for next agent]

### Recommendations
[Suggested next steps]
```

## Example: Feature Workflow

```
/orchestrate feature "Add user authentication"
```

执行过程：

1. **Planner Agent**
   - 分析需求
   - 创建实现计划
   - 识别依赖项
   - 输出：`HANDOFF: planner -> tdd-guide`

2. **TDD Guide Agent**
   - 阅读 planner 交接文档
   - 先写测试
   - 实现以通过测试
   - 输出：`HANDOFF: tdd-guide -> code-reviewer`

3. **Code Reviewer Agent**
   - 审查实现
   - 检查问题
   - 建议改进
   - 输出：`HANDOFF: code-reviewer -> security-reviewer`

4. **Security Reviewer Agent**
   - 安全审计
   - 漏洞检查
   - 最终批准
   - 输出：最终报告

## Final Report Format

```
ORCHESTRATION REPORT
====================
Workflow: feature
Task: Add user authentication
Agents: planner -> tdd-guide -> code-reviewer -> security-reviewer

SUMMARY
-------
[One paragraph summary]

AGENT OUTPUTS
-------------
Planner: [summary]
TDD Guide: [summary]
Code Reviewer: [summary]
Security Reviewer: [summary]

FILES CHANGED
-------------
[List all files modified]

TEST RESULTS
------------
[Test pass/fail summary]

SECURITY STATUS
---------------
[Security findings]

RECOMMENDATION
--------------
[SHIP / NEEDS WORK / BLOCKED]
```

## Parallel Execution

对于独立检查，并行运行 agents：

```markdown
### Parallel Phase
Run simultaneously:
- code-reviewer (quality)
- security-reviewer (security)
- architect (design)

### Merge Results
Combine outputs into single report
```

## Arguments

$ARGUMENTS:
- `feature <description>` - 完整功能工作流
- `bugfix <description>` - Bug 修复工作流
- `refactor <description>` - 重构工作流
- `security <description>` - 安全审查工作流
- `custom <agents> <description>` - 自定义 agent 序列

## Custom Workflow Example

```
/orchestrate custom "architect,tdd-guide,code-reviewer" "Redesign caching layer"
```

## Tips

1. **Start with planner** 对于复杂功能
2. **Always include code-reviewer** 在合并前
3. **Use security-reviewer** 对于 auth/payment/PII
4. **Keep handoffs concise** - 专注于下一个 agent 需要的内容
5. **Run verification** 如需要在 agents 之间运行验证
