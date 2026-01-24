---
name: strategic-compact
description: 建议在逻辑间隔点手动压缩上下文，以便在任务阶段之间保留上下文，而不是任意的自动压缩。
---

# 策略性压缩技能

建议在工作流的战略点手动执行 `/compact`，而不是依赖任意的自动压缩。

## 为什么需要策略性压缩？

自动压缩在任意点触发：
- 通常在任务中途，丢失重要上下文
- 不了解逻辑任务边界
- 可能中断复杂的多步骤操作

在逻辑边界处进行策略性压缩：
- **探索后，执行前** - 压缩研究上下文，保留实现计划
- **完成里程碑后** - 为下一阶段重新开始
- **重大上下文切换前** - 在不同任务前清除探索上下文

## 工作原理

`suggest-compact.sh` 脚本在 PreToolUse (Edit/Write) 时运行，并：

1. **跟踪工具调用** - 计算会话中的工具调用次数
2. **阈值检测** - 在可配置的阈值（默认：50 次调用）时建议
3. **定期提醒** - 阈值后每 25 次调用提醒一次

## Hook 设置

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

## 配置

环境变量：
- `COMPACT_THRESHOLD` - 首次建议前的工具调用次数（默认：50）

## 最佳实践

1. **规划后压缩** - 计划确定后，压缩以重新开始
2. **调试后压缩** - 在继续之前清除错误解决上下文
3. **不要在实现中途压缩** - 保留相关更改的上下文
4. **阅读建议** - hook 告诉你*何时*，你决定*是否*

## 相关资源

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - 令牌优化章节
- 内存持久化 hooks - 用于在压缩后保留的状态
