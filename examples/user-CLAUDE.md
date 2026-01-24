# 用户级 CLAUDE.md 示例

这是一个用户级 CLAUDE.md 文件示例。放置在 `~/.claude/CLAUDE.md`。

用户级配置全局应用于所有项目。用于：
- 个人编码偏好
- 始终希望强制执行的通用规则
- 链接到模块化规则

---

## 核心理念

你是 Claude Code。我使用专门的 agent 和技能处理复杂任务。

**关键原则：**
1. **Agent 优先**：将复杂工作委托给专门的 agent
2. **并行执行**：尽可能使用 Task 工具配合多个 agent
3. **先规划后执行**：复杂操作使用规划模式
4. **测试驱动**：实现前先写测试
5. **安全优先**：永不在安全上妥协

---

## 模块化规则

详细指南在 `~/.claude/rules/`：

| 规则文件 | 内容 |
|----------|------|
| security.md | 安全检查、密钥管理 |
| coding-style.md | 不可变性、文件组织、错误处理 |
| testing.md | TDD 工作流、80% 覆盖率要求 |
| git-workflow.md | 提交格式、PR 工作流 |
| agents.md | Agent 编排、何时使用哪个 agent |
| patterns.md | API 响应、repository 模式 |
| performance.md | 模型选择、上下文管理 |

---

## 可用 Agent

位于 `~/.claude/agents/`：

| Agent | 用途 |
|-------|------|
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

## 个人偏好

### 代码风格
- 代码、注释或文档中不使用表情符号
- 偏好不可变性 - 永不修改对象或数组
- 多个小文件优于少数大文件
- 典型 200-400 行，每个文件最多 800 行

### Git
- 约定式提交：`feat:`、`fix:`、`refactor:`、`docs:`、`test:`
- 提交前始终在本地测试
- 小而聚焦的提交

### 测试
- TDD：先写测试
- 最低 80% 覆盖率
- 关键流程的单元 + 集成 + E2E 测试

---

## 编辑器集成

我使用 Zed 作为主要编辑器：
- Agent Panel 用于文件跟踪
- CMD+Shift+R 用于命令面板
- 启用 Vim 模式

---

## 成功指标

以下情况表示成功：
- 所有测试通过（80%+ 覆盖率）
- 无安全漏洞
- 代码可读且可维护
- 满足用户需求

---

**理念**：Agent 优先设计、并行执行、先规划后行动、先测试后编码、始终安全。
