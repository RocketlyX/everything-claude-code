---
name: tdd-workflow
description: 在编写新功能、修复 bugs 或重构代码时使用此 skill。执行测试驱动开发，确保 80%+ 覆盖率，包括单元测试、集成测试和 E2E 测试。
---

# Test-Driven Development Workflow

此 skill 确保所有代码开发遵循 TDD 原则，并具有全面的测试覆盖率。

## When to Activate

- 编写新功能或功能
- 修复 bugs 或问题
- 重构现有代码
- 添加 API endpoints
- 创建新组件

## Core Principles

### 1. Tests BEFORE Code
始终先写测试，然后实现代码使测试通过。

### 2. Coverage Requirements
- 最低 80% 覆盖率（单元 + 集成 + E2E）
- 覆盖所有边缘情况
- 测试错误场景
- 验证边界条件

### 3. Test Types

#### Unit Tests
- 单独的函数和工具
- 组件逻辑
- 纯函数
- 辅助函数和工具

#### Integration Tests
- API endpoints
- 数据库操作
- 服务交互
- 外部 API 调用

#### E2E Tests (Playwright)
- 关键用户流程
- 完整工作流
- 浏览器自动化
- UI 交互

## TDD Workflow Steps

### Step 1: Write User Journeys
```
As a [role], I want to [action], so that [benefit]

示例:
As a user, I want to search for markets semantically,
so that I can find relevant markets even without exact keywords.
```

### Step 2: Generate Test Cases
对每个 user journey，创建全面的测试用例：

```typescript
describe('Semantic Search', () => {
  it('returns relevant markets for query', async () => {
    // 测试实现
  })

  it('handles empty query gracefully', async () => {
    // 测试边缘情况
  })

  it('falls back to substring search when Redis unavailable', async () => {
    // 测试回退行为
  })

  it('sorts results by similarity score', async () => {
    // 测试排序逻辑
  })
})
```

### Step 3: Run Tests (They Should Fail)
```bash
npm test
# 测试应该失败 - 我们还没实现
```

### Step 4: Implement Code
编写最小代码使测试通过：

```typescript
// 由测试指导的实现
export async function searchMarkets(query: string) {
  // 在这里实现
}
```

### Step 5: Run Tests Again
```bash
npm test
# 测试现在应该通过
```

### Step 6: Refactor
在保持测试绿色的同时改进代码质量：
- 消除重复
- 改进命名
- 优化性能
- 提高可读性

### Step 7: Verify Coverage
```bash
npm run test:coverage
# 验证达到 80%+ 覆盖率
```

## Testing Patterns

### Unit Test Pattern (Jest/Vitest)
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click</Button>)

    fireEvent.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### API Integration Test Pattern
```typescript
import { NextRequest } from 'next/server'
import { GET } from './route'

describe('GET /api/markets', () => {
  it('returns markets successfully', async () => {
    const request = new NextRequest('http://localhost/api/markets')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })

  it('validates query parameters', async () => {
    const request = new NextRequest('http://localhost/api/markets?limit=invalid')
    const response = await GET(request)

    expect(response.status).toBe(400)
  })

  it('handles database errors gracefully', async () => {
    // Mock 数据库失败
    const request = new NextRequest('http://localhost/api/markets')
    // 测试错误处理
  })
})
```

### E2E Test Pattern (Playwright)
```typescript
import { test, expect } from '@playwright/test'

test('user can search and filter markets', async ({ page }) => {
  // 导航到 markets 页面
  await page.goto('/')
  await page.click('a[href="/markets"]')

  // 验证页面加载
  await expect(page.locator('h1')).toContainText('Markets')

  // 搜索 markets
  await page.fill('input[placeholder="Search markets"]', 'election')

  // 等待 debounce 和结果
  await page.waitForTimeout(600)

  // 验证显示搜索结果
  const results = page.locator('[data-testid="market-card"]')
  await expect(results).toHaveCount(5, { timeout: 5000 })

  // 验证结果包含搜索词
  const firstResult = results.first()
  await expect(firstResult).toContainText('election', { ignoreCase: true })

  // 按状态过滤
  await page.click('button:has-text("Active")')

  // 验证过滤后的结果
  await expect(results).toHaveCount(3)
})

test('user can create a new market', async ({ page }) => {
  // 首先登录
  await page.goto('/creator-dashboard')

  // 填写 market 创建表单
  await page.fill('input[name="name"]', 'Test Market')
  await page.fill('textarea[name="description"]', 'Test description')
  await page.fill('input[name="endDate"]', '2025-12-31')

  // 提交表单
  await page.click('button[type="submit"]')

  // 验证成功消息
  await expect(page.locator('text=Market created successfully')).toBeVisible()

  // 验证重定向到 market 页面
  await expect(page).toHaveURL(/\/markets\/test-market/)
})
```

## Test File Organization

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx          # 单元测试
│   │   └── Button.stories.tsx       # Storybook
│   └── MarketCard/
│       ├── MarketCard.tsx
│       └── MarketCard.test.tsx
├── app/
│   └── api/
│       └── markets/
│           ├── route.ts
│           └── route.test.ts         # 集成测试
└── e2e/
    ├── markets.spec.ts               # E2E 测试
    ├── trading.spec.ts
    └── auth.spec.ts
```

## Common Testing Mistakes to Avoid

### ❌ WRONG: Testing Implementation Details
```typescript
// 不要测试内部状态
expect(component.state.count).toBe(5)
```

### ✅ CORRECT: Test User-Visible Behavior
```typescript
// 测试用户看到的
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```

### ❌ WRONG: Brittle Selectors
```typescript
// 容易中断
await page.click('.css-class-xyz')
```

### ✅ CORRECT: Semantic Selectors
```typescript
// 对变更有弹性
await page.click('button:has-text("Submit")')
await page.click('[data-testid="submit-button"]')
```

### ❌ WRONG: No Test Isolation
```typescript
// 测试相互依赖
test('creates user', () => { /* ... */ })
test('updates same user', () => { /* 依赖前一个测试 */ })
```

### ✅ CORRECT: Independent Tests
```typescript
// 每个测试设置自己的数据
test('creates user', () => {
  const user = createTestUser()
  // 测试逻辑
})

test('updates user', () => {
  const user = createTestUser()
  // 更新逻辑
})
```

## Continuous Testing

### Watch Mode During Development
```bash
npm test -- --watch
# 文件更改时自动运行测试
```

### Pre-Commit Hook
```bash
# 每次提交前运行
npm test && npm run lint
```

### CI/CD Integration
```yaml
# GitHub Actions
- name: Run Tests
  run: npm test -- --coverage
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Best Practices

1. **Write Tests First** - 始终 TDD
2. **One Assert Per Test** - 专注于单一行为
3. **Descriptive Test Names** - 解释测试内容
4. **Arrange-Act-Assert** - 清晰的测试结构
5. **Mock External Dependencies** - 隔离单元测试
6. **Test Edge Cases** - Null, undefined, empty, large
7. **Test Error Paths** - 不只是 happy paths
8. **Keep Tests Fast** - 单元测试 < 50ms each
9. **Clean Up After Tests** - 无副作用
10. **Review Coverage Reports** - 识别差距

## Success Metrics

- 80%+ 代码覆盖率
- 所有测试通过（绿色）
- 无跳过或禁用的测试
- 快速测试执行（单元测试 < 30s）
- E2E 测试覆盖关键用户流程
- 测试在生产前捕获 bugs

---

**Remember**: 测试不是可选的。它们是支持自信重构、快速开发和生产可靠性的安全网。
