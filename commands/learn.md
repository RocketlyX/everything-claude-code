# /learn - 提取可复用模式

分析当前会话并提取值得保存为 skills 的模式。

## Trigger

在会话中解决了非平凡问题时，随时运行 `/learn`。

## What to Extract

寻找以下内容：

1. **Error Resolution Patterns**
   - 发生了什么错误？
   - 根本原因是什么？
   - 什么修复了它？
   - 这对类似错误可复用吗？

2. **Debugging Techniques**
   - 非显而易见的调试步骤
   - 有效的工具组合
   - 诊断模式

3. **Workarounds**
   - 库的特殊行为
   - API 限制
   - 版本特定的修复

4. **Project-Specific Patterns**
   - 发现的代码库约定
   - 做出的架构决策
   - 集成模式

## Output Format

在 `~/.claude/skills/learned/[pattern-name].md` 创建 skill 文件：

```markdown
# [Descriptive Pattern Name]

**Extracted:** [Date]
**Context:** [Brief description of when this applies]

## Problem
[What problem this solves - be specific]

## Solution
[The pattern/technique/workaround]

## Example
[Code example if applicable]

## When to Use
[Trigger conditions - what should activate this skill]
```

## Process

1. 审查会话中可提取的模式
2. 识别最有价值/可复用的见解
3. 起草 skill 文件
4. 保存前请用户确认
5. 保存到 `~/.claude/skills/learned/`

## Notes

- 不要提取平凡的修复（拼写错误、简单语法错误）
- 不要提取一次性问题（特定 API 中断等）
- 专注于能在未来会话中节省时间的模式
- 保持 skills 专注 - 每个 skill 一个模式
