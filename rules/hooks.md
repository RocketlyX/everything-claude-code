# Hooks System

## Hook Types

- **PreToolUse**: 工具执行前（验证、参数修改）
- **PostToolUse**: 工具执行后（自动格式化、检查）
- **Stop**: 会话结束时（最终验证）

## Current Hooks (in ~/.claude/settings.json)

### PreToolUse
- **tmux reminder**: 对长时间运行的命令（npm, pnpm, yarn, cargo 等）建议使用 tmux
- **git push review**: 推送前在 Zed 中打开审查
- **doc blocker**: 阻止创建不必要的 .md/.txt 文件

### PostToolUse
- **PR creation**: 记录 PR URL 和 GitHub Actions 状态
- **Prettier**: 编辑后自动格式化 JS/TS 文件
- **TypeScript check**: 编辑 .ts/.tsx 文件后运行 tsc
- **console.log warning**: 警告编辑的文件中存在 console.log

### Stop
- **console.log audit**: 会话结束前检查所有修改的文件是否有 console.log

## Auto-Accept Permissions

谨慎使用：
- 对可信的、定义明确的计划启用
- 对探索性工作禁用
- 永远不要使用 dangerously-skip-permissions flag
- 改用在 `~/.claude.json` 中配置 `allowedTools`

## TodoWrite Best Practices

使用 TodoWrite 工具来：
- 跟踪多步骤任务的进度
- 验证对指令的理解
- 启用实时调整
- 显示细粒度的实现步骤

Todo 列表可揭示：
- 顺序错误的步骤
- 缺失的项目
- 多余的不必要项目
- 错误的粒度
- 误解的需求
