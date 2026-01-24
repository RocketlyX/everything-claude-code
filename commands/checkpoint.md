# Checkpoint Command

在工作流中创建或验证 checkpoint。

## 用法

`/checkpoint [create|verify|list] [name]`

## 创建 Checkpoint

创建 checkpoint 时：

1. 运行 `/verify quick` 确保当前状态干净
2. 创建带 checkpoint 名称的 git stash 或 commit
3. 将 checkpoint 记录到 `.claude/checkpoints.log`：

```bash
echo "$(date +%Y-%m-%d-%H:%M) | $CHECKPOINT_NAME | $(git rev-parse --short HEAD)" >> .claude/checkpoints.log
```

4. 报告 checkpoint 已创建

## 验证 Checkpoint

对照 checkpoint 验证时：

1. 从 log 读取 checkpoint
2. 比较当前状态与 checkpoint：
   - 自 checkpoint 以来添加的文件
   - 自 checkpoint 以来修改的文件
   - 现在 vs 当时的测试通过率
   - 现在 vs 当时的覆盖率

3. 报告：
```
CHECKPOINT COMPARISON: $NAME
============================
Files changed: X
Tests: +Y passed / -Z failed
Coverage: +X% / -Y%
Build: [PASS/FAIL]
```

## 列出 Checkpoints

显示所有 checkpoints，包含：
- 名称
- 时间戳
- Git SHA
- 状态（current、behind、ahead）

## 工作流

典型的 checkpoint 流程：

```
[Start] --> /checkpoint create "feature-start"
   |
[Implement] --> /checkpoint create "core-done"
   |
[Test] --> /checkpoint verify "core-done"
   |
[Refactor] --> /checkpoint create "refactor-done"
   |
[PR] --> /checkpoint verify "feature-start"
```

## 参数

$ARGUMENTS:
- `create <name>` - 创建命名 checkpoint
- `verify <name>` - 对照命名 checkpoint 验证
- `list` - 显示所有 checkpoints
- `clear` - 移除旧 checkpoints（保留最近 5 个）
