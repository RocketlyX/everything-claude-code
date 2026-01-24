---
description: 使用 Playwright 生成和运行端到端测试。创建测试 journeys，运行测试，捕获 screenshots/videos/traces，上传 artifacts。
---

# E2E Command

此命令调用 **e2e-runner** agent 来生成、维护和执行使用 Playwright 的端到端测试。

## 此命令的功能

1. **Generate Test Journeys** - 为用户流程创建 Playwright 测试
2. **Run E2E Tests** - 跨浏览器执行测试
3. **Capture Artifacts** - 失败时捕获 Screenshots、videos、traces
4. **Upload Results** - HTML reports 和 JUnit XML
5. **Identify Flaky Tests** - 隔离不稳定的测试

## 何时使用

在以下情况使用 `/e2e`：
- 测试关键用户 journeys（登录、交易、支付）
- 验证多步骤流程端到端工作
- 测试 UI 交互和导航
- 验证 frontend 和 backend 之间的集成
- 准备生产部署

## 工作原理

e2e-runner agent 将：

1. **分析用户流程**并识别测试场景
2. **生成 Playwright 测试**使用 Page Object Model 模式
3. **跨多个浏览器运行测试**（Chrome、Firefox、Safari）
4. **捕获失败**包含 screenshots、videos 和 traces
5. **生成报告**包含结果和 artifacts
6. **识别 flaky tests**并推荐修复

## 使用示例

```
User: /e2e Test the market search and view flow

Agent (e2e-runner):
# E2E Test Generation: Market Search and View Flow

## Test Scenario Identified

**User Journey:** Market Search → View Results → Click Market → View Details

**Test Coverage:**
1. Navigate to markets page
2. Perform semantic search
3. Verify search results
4. Click on first result
5. Verify market details page loads
6. Verify chart renders

## Generated Test Code

```typescript
// tests/e2e/markets/search-and-view.spec.ts
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'
import { MarketDetailsPage } from '../../pages/MarketDetailsPage'

test.describe('Market Search and View Flow', () => {
  test('user can search markets and view details', async ({ page }) => {
    // 1. 导航到 markets 页面
    const marketsPage = new MarketsPage(page)
    await marketsPage.goto()

    // 验证页面已加载
    await expect(page).toHaveTitle(/Markets/)
    await expect(page.locator('h1')).toContainText('Markets')

    // 2. 执行语义搜索
    await marketsPage.searchMarkets('election')

    // 等待 API 响应
    await page.waitForResponse(resp =>
      resp.url().includes('/api/markets/search') && resp.status() === 200
    )

    // 3. 验证搜索结果
    const marketCards = marketsPage.marketCards
    await expect(marketCards.first()).toBeVisible()
    const resultCount = await marketCards.count()
    expect(resultCount).toBeGreaterThan(0)

    // 截取搜索结果的截图
    await page.screenshot({ path: 'artifacts/search-results.png' })

    // 4. 点击第一个结果
    const firstMarketTitle = await marketCards.first().textContent()
    await marketCards.first().click()

    // 5. 验证 market 详情页加载
    await expect(page).toHaveURL(/\/markets\/[a-z0-9-]+/)

    const detailsPage = new MarketDetailsPage(page)
    await expect(detailsPage.marketName).toBeVisible()
    await expect(detailsPage.marketDescription).toBeVisible()

    // 6. 验证图表渲染
    await expect(detailsPage.priceChart).toBeVisible()

    // 验证 market 名称匹配
    const detailsTitle = await detailsPage.marketName.textContent()
    expect(detailsTitle?.toLowerCase()).toContain(
      firstMarketTitle?.toLowerCase().substring(0, 20) || ''
    )

    // 截取 market 详情的截图
    await page.screenshot({ path: 'artifacts/market-details.png' })
  })

  test('search with no results shows empty state', async ({ page }) => {
    const marketsPage = new MarketsPage(page)
    await marketsPage.goto()

    // 搜索不存在的 market
    await marketsPage.searchMarkets('xyznonexistentmarket123456')

    // 验证空状态
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible()
    await expect(page.locator('[data-testid="no-results"]')).toContainText(
      /no.*results|no.*markets/i
    )

    const marketCount = await marketsPage.marketCards.count()
    expect(marketCount).toBe(0)
  })

  test('can clear search and see all markets again', async ({ page }) => {
    const marketsPage = new MarketsPage(page)
    await marketsPage.goto()

    // 初始 market 数量
    const initialCount = await marketsPage.marketCards.count()

    // 执行搜索
    await marketsPage.searchMarkets('trump')
    await page.waitForLoadState('networkidle')

    // 验证过滤后的结果
    const filteredCount = await marketsPage.marketCards.count()
    expect(filteredCount).toBeLessThan(initialCount)

    // 清除搜索
    await marketsPage.searchInput.clear()
    await page.waitForLoadState('networkidle')

    // 验证再次显示所有 markets
    const finalCount = await marketsPage.marketCards.count()
    expect(finalCount).toBe(initialCount)
  })
})
```

## Running Tests

```bash
# 运行生成的测试
npx playwright test tests/e2e/markets/search-and-view.spec.ts

Running 3 tests using 3 workers

  ✓  [chromium] › search-and-view.spec.ts:5:3 › user can search markets and view details (4.2s)
  ✓  [chromium] › search-and-view.spec.ts:52:3 › search with no results shows empty state (1.8s)
  ✓  [chromium] › search-and-view.spec.ts:67:3 › can clear search and see all markets again (2.9s)

  3 passed (9.1s)

Artifacts generated:
- artifacts/search-results.png
- artifacts/market-details.png
- playwright-report/index.html
```

## Test Report

```
╔══════════════════════════════════════════════════════════════╗
║                    E2E Test Results                          ║
╠══════════════════════════════════════════════════════════════╣
║ Status:     ✅ ALL TESTS PASSED                              ║
║ Total:      3 tests                                          ║
║ Passed:     3 (100%)                                         ║
║ Failed:     0                                                ║
║ Flaky:      0                                                ║
║ Duration:   9.1s                                             ║
╚══════════════════════════════════════════════════════════════╝

Artifacts:
📸 Screenshots: 2 files
📹 Videos: 0 files (only on failure)
🔍 Traces: 0 files (only on failure)
📊 HTML Report: playwright-report/index.html

View report: npx playwright show-report
```

✅ E2E test suite ready for CI/CD integration!
```

## Test Artifacts

测试运行时，捕获以下 artifacts：

**On All Tests:**
- HTML Report 包含时间线和结果
- JUnit XML 用于 CI 集成

**On Failure Only:**
- 失败状态的 Screenshot
- 测试的视频录制
- Trace 文件用于调试（逐步回放）
- 网络日志
- Console 日志

## 查看 Artifacts

```bash
# 在浏览器中查看 HTML 报告
npx playwright show-report

# 查看特定 trace 文件
npx playwright show-trace artifacts/trace-abc123.zip

# Screenshots 保存在 artifacts/ 目录
open artifacts/search-results.png
```

## Flaky Test 检测

如果测试间歇性失败：

```
⚠️  FLAKY TEST DETECTED: tests/e2e/markets/trade.spec.ts

Test passed 7/10 runs (70% pass rate)

Common failure:
"Timeout waiting for element '[data-testid="confirm-btn"]'"

Recommended fixes:
1. Add explicit wait: await page.waitForSelector('[data-testid="confirm-btn"]')
2. Increase timeout: { timeout: 10000 }
3. Check for race conditions in component
4. Verify element is not hidden by animation

Quarantine recommendation: Mark as test.fixme() until fixed
```

## 浏览器配置

默认在多个浏览器上运行测试：
- ✅ Chromium (Desktop Chrome)
- ✅ Firefox (Desktop)
- ✅ WebKit (Desktop Safari)
- ✅ Mobile Chrome (optional)

在 `playwright.config.ts` 中配置以调整浏览器。

## CI/CD 集成

添加到你的 CI pipeline：

```yaml
# .github/workflows/e2e.yml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npx playwright test

- name: Upload artifacts
  if: always()
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

## 项目特定的关键流程

对于项目，优先测试以下 E2E 测试：

**🔴 CRITICAL（必须始终通过）:**
1. 用户可以连接钱包
2. 用户可以浏览 markets
3. 用户可以搜索 markets（语义搜索）
4. 用户可以查看 market 详情
5. 用户可以下单交易（使用测试资金）
6. Market 正确结算
7. 用户可以提取资金

**🟡 IMPORTANT:**
1. Market 创建流程
2. 用户资料更新
3. 实时价格更新
4. 图表渲染
5. 过滤和排序 markets
6. 移动端响应式布局

## 最佳实践

**DO:**
- ✅ 使用 Page Object Model 提高可维护性
- ✅ 使用 data-testid 属性作为选择器
- ✅ 等待 API 响应，而不是任意超时
- ✅ 端到端测试关键用户 journeys
- ✅ 合并到 main 之前运行测试
- ✅ 测试失败时查看 artifacts

**DON'T:**
- ❌ 使用脆弱的选择器（CSS classes 可能会变）
- ❌ 测试实现细节
- ❌ 对生产环境运行测试
- ❌ 忽略 flaky tests
- ❌ 失败时跳过 artifact 审查
- ❌ 用 E2E 测试每个边缘情况（使用单元测试）

## 重要说明

**CRITICAL:**
- 涉及真金白银的 E2E 测试必须仅在 testnet/staging 上运行
- 永远不要对生产环境运行交易测试
- 为金融测试设置 `test.skip(process.env.NODE_ENV === 'production')`
- 仅使用带有少量测试资金的测试钱包

## 与其他命令集成

- 使用 `/plan` 识别需要测试的关键 journeys
- 使用 `/tdd` 进行单元测试（更快、更细粒度）
- 使用 `/e2e` 进行集成和用户 journey 测试
- 使用 `/code-review` 验证测试质量

## 相关 Agents

此命令调用位于以下位置的 `e2e-runner` agent：
`~/.claude/agents/e2e-runner.md`

## 快速命令

```bash
# 运行所有 E2E 测试
npx playwright test

# 运行特定测试文件
npx playwright test tests/e2e/markets/search.spec.ts

# 在 headed 模式运行（显示浏览器）
npx playwright test --headed

# 调试测试
npx playwright test --debug

# 生成测试代码
npx playwright codegen http://localhost:3000

# 查看报告
npx playwright show-report
```
