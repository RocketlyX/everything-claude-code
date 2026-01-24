# Performance Optimization

## Model Selection Strategy

**Haiku 4.5**（Sonnet 90% 能力，成本节省 3 倍）：
- 频繁调用的轻量级 agents
- 配对编程和代码生成
- 多 agent 系统中的 worker agents

**Sonnet 4.5**（最佳编码模型）：
- 主要开发工作
- 编排多 agent 工作流
- 复杂编码任务

**Opus 4.5**（最深推理）：
- 复杂架构决策
- 需要最大推理能力
- 研究和分析任务

## Context Window Management

在上下文窗口最后 20% 避免：
- 大规模重构
- 跨多文件的功能实现
- 调试复杂交互

上下文敏感度较低的任务：
- 单文件编辑
- 独立工具函数创建
- 文档更新
- 简单 bug 修复

## Ultrathink + Plan Mode

对于需要深度推理的复杂任务：
1. 使用 `ultrathink` 增强思考
2. 启用 **Plan Mode** 进行结构化方法
3. 通过多轮批评"预热引擎"
4. 使用分角色 sub-agents 进行多元分析

## Build Troubleshooting

如果构建失败：
1. 使用 **build-error-resolver** agent
2. 分析错误信息
3. 增量修复
4. 每次修复后验证
