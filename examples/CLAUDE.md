# 项目级 CLAUDE.md 示例

这是一个项目级 CLAUDE.md 文件示例。将此文件放在项目根目录。

## Project Overview

[项目简介 - 功能描述、技术栈]

## Critical Rules

### 1. Code Organization

- 多个小文件优于少数大文件
- 高内聚，低耦合
- 典型 200-400 行，每文件最多 800 行
- 按功能/领域组织，而非按类型

### 2. Code Style

- 代码、注释或文档中不使用 emojis
- 始终保持 Immutability - 永不修改对象或数组
- 生产代码中不使用 console.log
- 使用 try/catch 进行正确的错误处理
- 使用 Zod 或类似工具进行输入验证

### 3. Testing

- TDD: 先写测试
- 最低 80% 覆盖率
- 工具函数使用单元测试
- APIs 使用集成测试
- 关键流程使用 E2E 测试

### 4. Security

- 不硬编码 secrets
- 敏感数据使用环境变量
- 验证所有用户输入
- 仅使用参数化查询
- 启用 CSRF 保护

## File Structure

```
src/
|-- app/              # Next.js app router
|-- components/       # 可复用 UI 组件
|-- hooks/            # 自定义 React hooks
|-- lib/              # 工具库
|-- types/            # TypeScript 定义
```

## Key Patterns

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling

```typescript
try {
  const result = await operation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { success: false, error: 'User-friendly message' }
}
```

## Environment Variables

```bash
# 必需
DATABASE_URL=
API_KEY=

# 可选
DEBUG=false
```

## Available Commands

- `/tdd` - 测试驱动开发工作流
- `/plan` - 创建实现计划
- `/code-review` - 审查代码质量
- `/build-fix` - 修复构建错误

## Git Workflow

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- 永不直接提交到 main 分支
- PRs 需要审查
- 合并前所有测试必须通过
