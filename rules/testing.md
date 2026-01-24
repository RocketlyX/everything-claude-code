# Testing Requirements

## Minimum Test Coverage: 80%

测试类型（全部必需）：
1. **Unit Tests** - 单独的函数、工具、组件
2. **Integration Tests** - API endpoints、数据库操作
3. **E2E Tests** - 关键用户流程（Playwright）

## Test-Driven Development

强制工作流：
1. 先写测试 (RED)
2. 运行测试 - 应该失败
3. 编写最小实现 (GREEN)
4. 运行测试 - 应该通过
5. 重构 (IMPROVE)
6. 验证覆盖率 (80%+)

## Troubleshooting Test Failures

1. 使用 **tdd-guide** agent
2. 检查测试隔离
3. 验证 mocks 是否正确
4. 修复实现，而非测试（除非测试有误）

## Agent Support

- **tdd-guide** - 对新功能主动使用，执行先写测试原则
- **e2e-runner** - Playwright E2E 测试专家
