---
name: continuous-learning
description: 在 Claude Code 会话结束时自动提取可复用模式，并将其保存为 learned skills 供未来使用。
---

# Continuous Learning Skill

在每个会话结束时自动评估 Claude Code 会话，提取可复用模式并保存为 learned skills。

## How It Works

此 skill 作为 **Stop hook** 在每个会话结束时运行：

1. **Session Evaluation**: 检查会话是否有足够的消息（默认：10+）
2. **Pattern Detection**: 从会话中识别可提取的模式
3. **Skill Extraction**: 将有用的模式保存到 `~/.claude/skills/learned/`

## Configuration

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

## Pattern Types

| Pattern | Description |
|---------|-------------|
| `error_resolution` | 特定错误如何被解决 |
| `user_corrections` | 从用户纠正中提取的模式 |
| `workarounds` | 框架/库特殊行为的解决方案 |
| `debugging_techniques` | 有效的调试方法 |
| `project_specific` | 项目特定的约定 |

## Hook Setup

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

## Why Stop Hook?

- **Lightweight**: 会话结束时只运行一次
- **Non-blocking**: 不会给每条消息增加延迟
- **Complete context**: 可以访问完整的会话记录

## Related

- [The Longform Guide](https://x.com/affaanmustafa/status/2014040193557471352) - 持续学习章节
- `/learn` command - 会话中手动模式提取
