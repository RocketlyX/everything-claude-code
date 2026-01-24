---
description: 执行测试驱动开发工作流。先搭建接口，先生成测试，然后实现最小代码以通过测试。确保 80%+ 覆盖率。
---

# TDD Command

此命令调用 **tdd-guide** agent 来执行测试驱动开发方法论。

## What This Command Does

1. **Scaffold Interfaces** - 先定义 types/interfaces
2. **Generate Tests First** - 编写失败的测试 (RED)
3. **Implement Minimal Code** - 只写刚好能通过的代码 (GREEN)
4. **Refactor** - 在保持测试通过的同时改进代码 (REFACTOR)
5. **Verify Coverage** - 确保 80%+ 测试覆盖率

## When to Use

使用 `/tdd` 当：
- 实现新功能
- 添加新函数/组件
- 修复 bugs（先写重现 bug 的测试）
- 重构现有代码
- 构建关键业务逻辑

## How It Works

tdd-guide agent 将：

1. **Define interfaces** 定义输入/输出接口
2. **Write tests that will FAIL**（因为代码还不存在）
3. **Run tests** 验证它们以正确的原因失败
4. **Write minimal implementation** 使测试通过
5. **Run tests** 验证它们通过
6. **Refactor** 在保持测试通过的同时重构代码
7. **Check coverage** 如低于 80% 则添加更多测试

## TDD Cycle

```
RED → GREEN → REFACTOR → REPEAT

RED:      Write a failing test
GREEN:    Write minimal code to pass
REFACTOR: Improve code, keep tests passing
REPEAT:   Next feature/scenario
```

## Example Usage

```
User: /tdd I need a function to calculate market liquidity score

Agent (tdd-guide):
# TDD Session: Market Liquidity Score Calculator

## Step 1: Define Interface (SCAFFOLD)

```typescript
// lib/liquidity.ts
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}

export function calculateLiquidityScore(market: MarketData): number {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

## Step 2: Write Failing Test (RED)

```typescript
// lib/liquidity.test.ts
import { calculateLiquidityScore } from './liquidity'

describe('calculateLiquidityScore', () => {
  it('should return high score for liquid market', () => {
    const market = {
      totalVolume: 100000,
      bidAskSpread: 0.01,
      activeTraders: 500,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeGreaterThan(80)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('should return low score for illiquid market', () => {
    const market = {
      totalVolume: 100,
      bidAskSpread: 0.5,
      activeTraders: 2,
      lastTradeTime: new Date(Date.now() - 86400000) // 1 day ago
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeLessThan(30)
    expect(score).toBeGreaterThanOrEqual(0)
  })

  it('should handle edge case: zero volume', () => {
    const market = {
      totalVolume: 0,
      bidAskSpread: 0,
      activeTraders: 0,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBe(0)
  })
})
```

## Step 3: Run Tests - Verify FAIL

```bash
npm test lib/liquidity.test.ts

FAIL lib/liquidity.test.ts
  ✕ should return high score for liquid market (2 ms)
    Error: Not implemented

1 test failed, 0 passed
```

✅ Tests fail as expected. Ready to implement.

## Step 4: Implement Minimal Code (GREEN)

```typescript
// lib/liquidity.ts
export function calculateLiquidityScore(market: MarketData): number {
  // 处理零交易量边缘情况
  if (market.totalVolume === 0) {
    return 0
  }

  // 计算各组件分数（0-100 范围）
  const volumeScore = Math.min(market.totalVolume / 1000, 100)
  const spreadScore = Math.max(100 - (market.bidAskSpread * 1000), 0)
  const traderScore = Math.min(market.activeTraders / 10, 100)

  // 近期活动加成
  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = Math.max(100 - (hoursSinceLastTrade * 10), 0)

  // 加权平均
  const score = (
    volumeScore * 0.4 +
    spreadScore * 0.3 +
    traderScore * 0.2 +
    recencyScore * 0.1
  )

  return Math.min(Math.max(score, 0), 100) // 限制在 0-100 范围
}
```

## Step 5: Run Tests - Verify PASS

```bash
npm test lib/liquidity.test.ts

PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ All tests passing!

## Step 6: Refactor (IMPROVE)

```typescript
// lib/liquidity.ts - 使用常量重构，提高可读性
const WEIGHTS = {
  VOLUME: 0.4,
  SPREAD: 0.3,
  TRADERS: 0.2,
  RECENCY: 0.1,
} as const

const SCALE_FACTORS = {
  VOLUME: 1000,
  SPREAD: 1000,
  TRADERS: 10,
  RECENCY_PENALTY: 10,
} as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function calculateLiquidityScore(market: MarketData): number {
  if (market.totalVolume === 0) return 0

  const volumeScore = Math.min(market.totalVolume / SCALE_FACTORS.VOLUME, 100)
  const spreadScore = clamp(100 - (market.bidAskSpread * SCALE_FACTORS.SPREAD), 0, 100)
  const traderScore = Math.min(market.activeTraders / SCALE_FACTORS.TRADERS, 100)

  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = clamp(100 - (hoursSinceLastTrade * SCALE_FACTORS.RECENCY_PENALTY), 0, 100)

  const weightedScore =
    volumeScore * WEIGHTS.VOLUME +
    spreadScore * WEIGHTS.SPREAD +
    traderScore * WEIGHTS.TRADERS +
    recencyScore * WEIGHTS.RECENCY

  return clamp(weightedScore, 0, 100)
}
```

## Step 7: Verify Tests Still Pass

```bash
npm test lib/liquidity.test.ts

PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ Refactoring complete, tests still passing!

## Step 8: Check Coverage

```bash
npm test -- --coverage lib/liquidity.test.ts

File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|--------
liquidity.ts   |   100   |   100    |   100   |   100

Coverage: 100% ✅ (Target: 80%)
```

✅ TDD session complete!
```

## TDD Best Practices

**DO:**
- ✅ 在任何实现之前先写测试
- ✅ 运行测试并验证它们在实现前失败
- ✅ 写最小代码使测试通过
- ✅ 只在测试通过后才重构
- ✅ 添加边缘情况和错误场景
- ✅ 目标 80%+ 覆盖率（关键代码 100%）

**DON'T:**
- ❌ 在测试之前写实现
- ❌ 每次修改后跳过运行测试
- ❌ 一次写太多代码
- ❌ 忽略失败的测试
- ❌ 测试实现细节（要测试行为）
- ❌ mock 一切（优先集成测试）

## Test Types to Include

**Unit Tests**（函数级）：
- 正常路径场景
- 边缘情况（空、null、最大值）
- 错误条件
- 边界值

**Integration Tests**（组件级）：
- API endpoints
- 数据库操作
- 外部服务调用
- 带 hooks 的 React 组件

**E2E Tests**（使用 `/e2e` 命令）：
- 关键用户流程
- 多步骤流程
- 全栈集成

## Coverage Requirements

- **80% minimum** 对于所有代码
- **100% required** 对于：
  - 金融计算
  - 认证逻辑
  - 安全关键代码
  - 核心业务逻辑

## Important Notes

**MANDATORY**: 测试必须在实现之前编写。TDD 循环是：

1. **RED** - 写失败的测试
2. **GREEN** - 实现以通过
3. **REFACTOR** - 改进代码

永远不要跳过 RED 阶段。永远不要在测试之前写代码。

## Integration with Other Commands

- 先使用 `/plan` 理解要构建什么
- 使用 `/tdd` 带测试实现
- 如果发生构建错误使用 `/build-and-fix`
- 使用 `/code-review` 审查实现
- 使用 `/test-coverage` 验证覆盖率

## Related Agents

此命令调用位于以下位置的 `tdd-guide` agent：
`~/.claude/agents/tdd-guide.md`

并可引用以下位置的 `tdd-workflow` skill：
`~/.claude/skills/tdd-workflow/`
