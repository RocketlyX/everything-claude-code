# Eval Command

管理 eval 驱动的开发工作流。

## Usage

`/eval [define|check|report|list] [feature-name]`

## Define Evals

`/eval define feature-name`

创建新的 eval 定义：

1. 使用以下模板创建 `.claude/evals/feature-name.md`：

```markdown
## EVAL: feature-name
Created: $(date)

### Capability Evals
- [ ] [Description of capability 1]
- [ ] [Description of capability 2]

### Regression Evals
- [ ] [Existing behavior 1 still works]
- [ ] [Existing behavior 2 still works]

### Success Criteria
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals
```

2. 提示用户填写具体标准

## Check Evals

`/eval check feature-name`

运行某个功能的 evals：

1. 从 `.claude/evals/feature-name.md` 读取 eval 定义
2. 对每个 capability eval：
   - 尝试验证标准
   - 记录 PASS/FAIL
   - 在 `.claude/evals/feature-name.log` 中记录尝试
3. 对每个 regression eval：
   - 运行相关测试
   - 与基线比较
   - 记录 PASS/FAIL
4. 报告当前状态：

```
EVAL CHECK: feature-name
========================
Capability: X/Y passing
Regression: X/Y passing
Status: IN PROGRESS / READY
```

## Report Evals

`/eval report feature-name`

生成全面的 eval 报告：

```
EVAL REPORT: feature-name
=========================
Generated: $(date)

CAPABILITY EVALS
----------------
[eval-1]: PASS (pass@1)
[eval-2]: PASS (pass@2) - required retry
[eval-3]: FAIL - see notes

REGRESSION EVALS
----------------
[test-1]: PASS
[test-2]: PASS
[test-3]: PASS

METRICS
-------
Capability pass@1: 67%
Capability pass@3: 100%
Regression pass^3: 100%

NOTES
-----
[Any issues, edge cases, or observations]

RECOMMENDATION
--------------
[SHIP / NEEDS WORK / BLOCKED]
```

## List Evals

`/eval list`

显示所有 eval 定义：

```
EVAL DEFINITIONS
================
feature-auth      [3/5 passing] IN PROGRESS
feature-search    [5/5 passing] READY
feature-export    [0/4 passing] NOT STARTED
```

## Arguments

$ARGUMENTS:
- `define <name>` - 创建新的 eval 定义
- `check <name>` - 运行并检查 evals
- `report <name>` - 生成完整报告
- `list` - 显示所有 evals
- `clean` - 删除旧的 eval 日志（保留最近 10 次运行）
