---
name: strategic-compact
description: 在逻辑间隔点建议手动上下文压缩，以便在任务阶段之间保留上下文，而非任意自动压缩。
---

# Strategic Compact Skill

在工作流的策略性节点建议手动 `/compact`，而非依赖任意的自动压缩。

## Why Strategic Compaction?

自动压缩在任意时刻触发：
- 经常在任务中途，丢失重要上下文
- 不了解逻辑任务边界
- 可能中断复杂的多步骤操作

在逻辑边界进行策略性压缩：
- **After exploration, before execution** - 压缩研究上下文，保留实现计划
- **After completing a milestone** - 为下一阶段全新开始
- **Before major context shifts** - 在不同任务之前清除探索上下文

## How It Works

`suggest-compact.sh` 脚本在 PreToolUse (Edit/Write) 时运行：

1. **Tracks tool calls** - 计算会话中的工具调用次数
2. **Threshold detection** - 在可配置阈值处建议（默认：50 次调用）
3. **Periodic reminders** - 阈值后每 25 次调用提醒

## Hook Setup

添加到你的 `~/.claude/settings.json`：

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "tool == \"Edit\" || tool == \"Write\"",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/strategic-compact/suggest-compact.sh"
      }]
    }]
  }
}
```

## Configuration

环境变量：
- `COMPACT_THRESHOLD` - 首次建议前的工具调用次数（默认：50）

## Best Practices

1. **Compact after planning** - 计划确定后压缩以全新开始
2. **Compact after debugging** - 继续之前清除错误解决上下文
3. **Don't compact mid-implementation** - 保留相关更改的上下文
4. **Read the suggestion** - hook 告诉你*何时*，你决定*是否*

## Related

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - Token 优化章节
- Memory persistence hooks - 用于在压缩中存活的状态
