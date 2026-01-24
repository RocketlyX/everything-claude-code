---
name: coding-standards
description: TypeScript、JavaScript、React 和 Node.js 开发的通用编码标准、最佳实践和模式。
---

# Coding Standards & Best Practices

适用于所有项目的通用编码标准。

## Code Quality Principles

### 1. Readability First
- 代码被阅读的次数多于编写
- 清晰的变量和函数命名
- 自文档化代码优于注释
- 一致的格式化

### 2. KISS (Keep It Simple, Stupid)
- 最简单的可行解决方案
- 避免过度工程
- 不要过早优化
- 易于理解 > 聪明的代码

### 3. DRY (Don't Repeat Yourself)
- 将公共逻辑提取为函数
- 创建可复用组件
- 跨模块共享工具
- 避免复制粘贴编程

### 4. YAGNI (You Aren't Gonna Need It)
- 不要在需要之前构建功能
- 避免投机性泛化
- 仅在需要时添加复杂性
- 从简单开始，在需要时重构

## TypeScript/JavaScript Standards

### Variable Naming

```typescript
// ✅ GOOD: 描述性命名
const marketSearchQuery = 'election'
const isUserAuthenticated = true
const totalRevenue = 1000

// ❌ BAD: 不清晰的命名
const q = 'election'
const flag = true
const x = 1000
```

### Function Naming

```typescript
// ✅ GOOD: 动词-名词模式
async function fetchMarketData(marketId: string) { }
function calculateSimilarity(a: number[], b: number[]) { }
function isValidEmail(email: string): boolean { }

// ❌ BAD: 不清晰或仅名词
async function market(id: string) { }
function similarity(a, b) { }
function email(e) { }
```

### Immutability Pattern (CRITICAL)

```typescript
// ✅ 始终使用展开运算符
const updatedUser = {
  ...user,
  name: 'New Name'
}

const updatedArray = [...items, newItem]

// ❌ 永不直接修改
user.name = 'New Name'  // BAD
items.push(newItem)     // BAD
```

### Error Handling

```typescript
// ✅ GOOD: 全面的错误处理
async function fetchData(url: string) {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw new Error('Failed to fetch data')
  }
}

// ❌ BAD: 无错误处理
async function fetchData(url) {
  const response = await fetch(url)
  return response.json()
}
```

### Async/Await Best Practices

```typescript
// ✅ GOOD: 可能时并行执行
const [users, markets, stats] = await Promise.all([
  fetchUsers(),
  fetchMarkets(),
  fetchStats()
])

// ❌ BAD: 不必要的顺序执行
const users = await fetchUsers()
const markets = await fetchMarkets()
const stats = await fetchStats()
```

### Type Safety

```typescript
// ✅ GOOD: 正确的类型
interface Market {
  id: string
  name: string
  status: 'active' | 'resolved' | 'closed'
  created_at: Date
}

function getMarket(id: string): Promise<Market> {
  // 实现
}

// ❌ BAD: 使用 'any'
function getMarket(id: any): Promise<any> {
  // 实现
}
```

## React Best Practices

### Component Structure

```typescript
// ✅ GOOD: 带类型的函数组件
interface ButtonProps {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  )
}

// ❌ BAD: 无类型，结构不清晰
export function Button(props) {
  return <button onClick={props.onClick}>{props.children}</button>
}
```

### Custom Hooks

```typescript
// ✅ GOOD: 可复用的 custom hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

// 使用方式
const debouncedQuery = useDebounce(searchQuery, 500)
```

### State Management

```typescript
// ✅ GOOD: 正确的状态更新
const [count, setCount] = useState(0)

// 基于前一个状态的函数式更新
setCount(prev => prev + 1)

// ❌ BAD: 直接引用状态
setCount(count + 1)  // 在异步场景中可能是陈旧的
```

### Conditional Rendering

```typescript
// ✅ GOOD: 清晰的条件渲染
{isLoading && <Spinner />}
{error && <ErrorMessage error={error} />}
{data && <DataDisplay data={data} />}

// ❌ BAD: 三元地狱
{isLoading ? <Spinner /> : error ? <ErrorMessage error={error} /> : data ? <DataDisplay data={data} /> : null}
```

## API Design Standards

### REST API Conventions

```
GET    /api/markets              # 列出所有 markets
GET    /api/markets/:id          # 获取特定 market
POST   /api/markets              # 创建新 market
PUT    /api/markets/:id          # 更新 market（完整）
PATCH  /api/markets/:id          # 更新 market（部分）
DELETE /api/markets/:id          # 删除 market

# 用于过滤的查询参数
GET /api/markets?status=active&limit=10&offset=0
```

### Response Format

```typescript
// ✅ GOOD: 一致的响应结构
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}

// 成功响应
return NextResponse.json({
  success: true,
  data: markets,
  meta: { total: 100, page: 1, limit: 10 }
})

// 错误响应
return NextResponse.json({
  success: false,
  error: 'Invalid request'
}, { status: 400 })
```

### Input Validation

```typescript
import { z } from 'zod'

// ✅ GOOD: Schema 验证
const CreateMarketSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  endDate: z.string().datetime(),
  categories: z.array(z.string()).min(1)
})

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const validated = CreateMarketSchema.parse(body)
    // 使用验证后的数据继续
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: error.errors
      }, { status: 400 })
    }
  }
}
```

## File Organization

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── markets/           # Market pages
│   └── (auth)/           # Auth pages (route groups)
├── components/            # React components
│   ├── ui/               # 通用 UI 组件
│   ├── forms/            # 表单组件
│   └── layouts/          # 布局组件
├── hooks/                # Custom React hooks
├── lib/                  # 工具和配置
│   ├── api/             # API clients
│   ├── utils/           # 辅助函数
│   └── constants/       # 常量
├── types/                # TypeScript types
└── styles/              # 全局样式
```

### File Naming

```
components/Button.tsx          # 组件使用 PascalCase
hooks/useAuth.ts              # hooks 使用 camelCase 带 'use' 前缀
lib/formatDate.ts             # 工具使用 camelCase
types/market.types.ts         # 类型使用 camelCase 带 .types 后缀
```

## Comments & Documentation

### When to Comment

```typescript
// ✅ GOOD: 解释 WHY，而非 WHAT
// 使用指数退避以避免在故障期间压垮 API
const delay = Math.min(1000 * Math.pow(2, retryCount), 30000)

// 这里故意使用 mutation 以提高大数组的性能
items.push(newItem)

// ❌ BAD: 陈述显而易见的事情
// 计数器加 1
count++

// 将名字设为用户的名字
name = user.name
```

### JSDoc for Public APIs

```typescript
/**
 * 使用语义相似度搜索 markets。
 *
 * @param query - 自然语言搜索查询
 * @param limit - 最大结果数（默认：10）
 * @returns 按相似度分数排序的 markets 数组
 * @throws {Error} 如果 OpenAI API 失败或 Redis 不可用
 *
 * @example
 * ```typescript
 * const results = await searchMarkets('election', 5)
 * console.log(results[0].name) // "Trump vs Biden"
 * ```
 */
export async function searchMarkets(
  query: string,
  limit: number = 10
): Promise<Market[]> {
  // 实现
}
```

## Performance Best Practices

### Memoization

```typescript
import { useMemo, useCallback } from 'react'

// ✅ GOOD: 记忆化昂贵的计算
const sortedMarkets = useMemo(() => {
  return markets.sort((a, b) => b.volume - a.volume)
}, [markets])

// ✅ GOOD: 记忆化回调
const handleSearch = useCallback((query: string) => {
  setSearchQuery(query)
}, [])
```

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react'

// ✅ GOOD: 懒加载重型组件
const HeavyChart = lazy(() => import('./HeavyChart'))

export function Dashboard() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyChart />
    </Suspense>
  )
}
```

### Database Queries

```typescript
// ✅ GOOD: 只选择需要的列
const { data } = await supabase
  .from('markets')
  .select('id, name, status')
  .limit(10)

// ❌ BAD: 选择所有
const { data } = await supabase
  .from('markets')
  .select('*')
```

## Testing Standards

### Test Structure (AAA Pattern)

```typescript
test('calculates similarity correctly', () => {
  // Arrange
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // Act
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // Assert
  expect(similarity).toBe(0)
})
```

### Test Naming

```typescript
// ✅ GOOD: 描述性测试名称
test('returns empty array when no markets match query', () => { })
test('throws error when OpenAI API key is missing', () => { })
test('falls back to substring search when Redis unavailable', () => { })

// ❌ BAD: 模糊的测试名称
test('works', () => { })
test('test search', () => { })
```

## Code Smell Detection

注意这些反模式：

### 1. Long Functions
```typescript
// ❌ BAD: 函数 > 50 行
function processMarketData() {
  // 100 行代码
}

// ✅ GOOD: 拆分为更小的函数
function processMarketData() {
  const validated = validateData()
  const transformed = transformData(validated)
  return saveData(transformed)
}
```

### 2. Deep Nesting
```typescript
// ❌ BAD: 5+ 层嵌套
if (user) {
  if (user.isAdmin) {
    if (market) {
      if (market.isActive) {
        if (hasPermission) {
          // 做某事
        }
      }
    }
  }
}

// ✅ GOOD: 早期返回
if (!user) return
if (!user.isAdmin) return
if (!market) return
if (!market.isActive) return
if (!hasPermission) return

// 做某事
```

### 3. Magic Numbers
```typescript
// ❌ BAD: 无解释的数字
if (retryCount > 3) { }
setTimeout(callback, 500)

// ✅ GOOD: 命名常量
const MAX_RETRIES = 3
const DEBOUNCE_DELAY_MS = 500

if (retryCount > MAX_RETRIES) { }
setTimeout(callback, DEBOUNCE_DELAY_MS)
```

**Remember**: 代码质量不可协商。清晰、可维护的代码支持快速开发和自信的重构。
