# 用户级 CLAUDE.md 示例

这是一个用户级 CLAUDE.md 文件示例。放置于 `~/.claude/CLAUDE.md`。

用户级配置全局应用于所有项目。用于：
- 个人编码偏好
- 你希望始终执行的通用规则
- 指向你的模块化规则的链接

---

## Core Philosophy

你是 Claude Code。我使用专门的 agents 和 skills 处理复杂任务。

**Key Principles:**
1. **Agent-First**: 将复杂工作委托给专门的 agents
2. **Parallel Execution**: 尽可能使用 Task tool 配合多个 agents
3. **Plan Before Execute**: 复杂操作使用 Plan Mode
4. **Test-Driven**: 先写测试再实现
5. **Security-First**: 安全永不妥协

---

## Modular Rules

详细指南在 `~/.claude/rules/`：

| Rule File | Contents |
|-----------|----------|
| security.md | 安全检查、secret 管理 |
| coding-style.md | Immutability、文件组织、错误处理 |
| testing.md | TDD 工作流、80% 覆盖率要求 |
| git-workflow.md | Commit 格式、PR 工作流 |
| agents.md | Agent 编排、何时使用哪个 agent |
| patterns.md | API 响应、repository 模式 |
| performance.md | 模型选择、上下文管理 |

---

## Available Agents

位于 `~/.claude/agents/`：

| Agent | Purpose |
|-------|---------|
| planner | 功能实现规划 |
| architect | 系统设计和架构 |
| tdd-guide | 测试驱动开发 |
| code-reviewer | 质量/安全代码审查 |
| security-reviewer | 安全漏洞分析 |
| build-error-resolver | 构建错误解决 |
| e2e-runner | Playwright E2E 测试 |
| refactor-cleaner | 死代码清理 |
| doc-updater | 文档更新 |

---

## Personal Preferences

### Code Style
- 代码、注释或文档中不使用 emojis
- 偏好 immutability - 永不修改对象或数组
- 多个小文件优于少数大文件
- 典型 200-400 行，每文件最多 800 行

### Git
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- 提交前始终在本地测试
- 小而专注的 commits

### Testing
- TDD: 先写测试
- 最低 80% 覆盖率
- 关键流程使用 Unit + integration + E2E

---

## Editor Integration

我使用 Zed 作为主要编辑器：
- Agent Panel 用于文件追踪
- CMD+Shift+R 打开命令面板
- 启用 Vim 模式

---

## Success Metrics

成功的标准：
- 所有测试通过（80%+ 覆盖率）
- 无安全漏洞
- 代码可读且可维护
- 满足用户需求

---

**Philosophy**: Agent-first 设计、并行执行、行动前规划、代码前测试、安全始终优先。
