---
name: continuous-learning
description: 从 Claude Code 会话中自动提取可复用模式，并将其保存为学习到的技能供将来使用。
---

# 持续学习技能

在每次会话结束时自动评估 Claude Code 会话，以提取可保存为学习技能的可复用模式。

## 工作原理

此技能作为 **Stop hook** 在每次会话结束时运行：

1. **会话评估**：检查会话是否有足够的消息（默认：10+）
2. **模式检测**：从会话中识别可提取的模式
3. **技能提取**：将有用的模式保存到 `~/.claude/skills/learned/`

## 配置

编辑 `config.json` 进行自定义：

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific"
  ],
  "ignore_patterns": [
    "simple_typos",
    "one_time_fixes",
    "external_api_issues"
  ]
}
```

## 模式类型

| 模式 | 描述 |
|---------|-------------|
| `error_resolution` | 特定错误是如何解决的 |
| `user_corrections` | 来自用户纠正的模式 |
| `workarounds` | 框架/库问题的解决方案 |
| `debugging_techniques` | 有效的调试方法 |
| `project_specific` | 项目特定的约定 |

## Hook 设置

添加到你的 `~/.claude/settings.json`：

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

## 为什么使用 Stop Hook？

- **轻量级**：在会话结束时只运行一次
- **非阻塞**：不会为每条消息增加延迟
- **完整上下文**：可以访问完整的会话记录

## 相关资源

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - 持续学习章节
- `/learn` 命令 - 会话中途手动提取模式
