# Project Guidelines Skill (Example)

这是一个项目特定 skill 的示例。用作你自己项目的模板。

基于真实生产应用：[Zenith](https://zenith.chat) - AI 驱动的客户发现平台。

---

## When to Use

在为其设计的特定项目上工作时引用此 skill。Project skills 包含：
- 架构概述
- 文件结构
- 代码模式
- 测试要求
- 部署工作流

---

## Architecture Overview

**Tech Stack:**
- **Frontend**: Next.js 15 (App Router), TypeScript, React
- **Backend**: FastAPI (Python), Pydantic models
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude API with tool calling and structured output
- **Deployment**: Google Cloud Run
- **Testing**: Playwright (E2E), pytest (backend), React Testing Library

**Services:**
```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│  Next.js 15 + TypeScript + TailwindCSS                     │
│  Deployed: Vercel / Cloud Run                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                             │
│  FastAPI + Python 3.11 + Pydantic                          │
│  Deployed: Cloud Run                                       │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Supabase │   │  Claude  │   │  Redis   │
        │ Database │   │   API    │   │  Cache   │
        └──────────┘   └──────────┘   └──────────┘
```

---

## File Structure

```
project/
├── frontend/
│   └── src/
│       ├── app/              # Next.js app router pages
│       │   ├── api/          # API routes
│       │   ├── (auth)/       # 认证保护的路由
│       │   └── workspace/    # 主应用工作区
│       ├── components/       # React components
│       │   ├── ui/           # 基础 UI 组件
│       │   ├── forms/        # 表单组件
│       │   └── layouts/      # 布局组件
│       ├── hooks/            # Custom React hooks
│       ├── lib/              # 工具
│       ├── types/            # TypeScript 定义
│       └── config/           # 配置
│
├── backend/
│   ├── routers/              # FastAPI route handlers
│   ├── models.py             # Pydantic models
│   ├── main.py               # FastAPI app 入口
│   ├── auth_system.py        # 认证
│   ├── database.py           # 数据库操作
│   ├── services/             # 业务逻辑
│   └── tests/                # pytest 测试
│
├── deploy/                   # 部署配置
├── docs/                     # 文档
└── scripts/                  # 工具脚本
```

---

## Code Patterns

### API Response Format (FastAPI)

```python
from pydantic import BaseModel
from typing import Generic, TypeVar, Optional

T = TypeVar('T')

class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[str] = None

    @classmethod
    def ok(cls, data: T) -> "ApiResponse[T]":
        return cls(success=True, data=data)

    @classmethod
    def fail(cls, error: str) -> "ApiResponse[T]":
        return cls(success=False, error=error)
```

### Frontend API Calls (TypeScript)

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }

    return await response.json()
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
```

### Claude AI Integration (Structured Output)

```python
from anthropic import Anthropic
from pydantic import BaseModel

class AnalysisResult(BaseModel):
    summary: str
    key_points: list[str]
    confidence: float

async def analyze_with_claude(content: str) -> AnalysisResult:
    client = Anthropic()

    response = client.messages.create(
        model="claude-sonnet-4-5-20250514",
        max_tokens=1024,
        messages=[{"role": "user", "content": content}],
        tools=[{
            "name": "provide_analysis",
            "description": "Provide structured analysis",
            "input_schema": AnalysisResult.model_json_schema()
        }],
        tool_choice={"type": "tool", "name": "provide_analysis"}
    )

    # 提取 tool use 结果
    tool_use = next(
        block for block in response.content
        if block.type == "tool_use"
    )

    return AnalysisResult(**tool_use.input)
```

### Custom Hooks (React)

```typescript
import { useState, useCallback } from 'react'

interface UseApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useApi<T>(
  fetchFn: () => Promise<ApiResponse<T>>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    const result = await fetchFn()

    if (result.success) {
      setState({ data: result.data!, loading: false, error: null })
    } else {
      setState({ data: null, loading: false, error: result.error! })
    }
  }, [fetchFn])

  return { ...state, execute }
}
```

---

## Testing Requirements

### Backend (pytest)

```bash
# 运行所有测试
poetry run pytest tests/

# 运行带覆盖率
poetry run pytest tests/ --cov=. --cov-report=html

# 运行特定测试文件
poetry run pytest tests/test_auth.py -v
```

**Test structure:**
```python
import pytest
from httpx import AsyncClient
from main import app

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
```

### Frontend (React Testing Library)

```bash
# 运行测试
npm run test

# 运行带覆盖率
npm run test -- --coverage

# 运行 E2E 测试
npm run test:e2e
```

**Test structure:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { WorkspacePanel } from './WorkspacePanel'

describe('WorkspacePanel', () => {
  it('renders workspace correctly', () => {
    render(<WorkspacePanel />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('handles session creation', async () => {
    render(<WorkspacePanel />)
    fireEvent.click(screen.getByText('New Session'))
    expect(await screen.findByText('Session created')).toBeInTheDocument()
  })
})
```

---

## Deployment Workflow

### Pre-Deployment Checklist

- [ ] All tests passing locally
- [ ] `npm run build` succeeds (frontend)
- [ ] `poetry run pytest` passes (backend)
- [ ] No hardcoded secrets
- [ ] Environment variables documented
- [ ] Database migrations ready

### Deployment Commands

```bash
# 构建和部署前端
cd frontend && npm run build
gcloud run deploy frontend --source .

# 构建和部署后端
cd backend
gcloud run deploy backend --source .
```

### Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Backend (.env)
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJ...
```

---

## Critical Rules

1. **No emojis** 在代码、注释或文档中
2. **Immutability** - 永不修改对象或数组
3. **TDD** - 在实现之前写测试
4. **80% coverage** minimum
5. **Many small files** - 200-400 行典型，最多 800 行
6. **No console.log** 在生产代码中
7. **Proper error handling** 使用 try/catch
8. **Input validation** 使用 Pydantic/Zod

---

## Related Skills

- `coding-standards.md` - 通用编码最佳实践
- `backend-patterns.md` - API 和数据库模式
- `frontend-patterns.md` - React 和 Next.js 模式
- `tdd-workflow/` - 测试驱动开发方法论
