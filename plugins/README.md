# Plugins and Marketplaces

Plugins 为 Claude Code 扩展新的工具和功能。本指南仅涵盖安装 - 有关何时以及为何使用它们，请参阅[完整文章](https://x.com/affaanmustafa/status/2012378465664745795)。

---

## Marketplaces

Marketplaces 是可安装 plugins 的仓库。

### 添加 Marketplace

```bash
# 添加官方 Anthropic marketplace
claude plugin marketplace add https://github.com/anthropics/claude-plugins-official

# 添加社区 marketplaces
claude plugin marketplace add https://github.com/mixedbread-ai/mgrep
```

### 推荐的 Marketplaces

| Marketplace | Source |
|-------------|--------|
| claude-plugins-official | `anthropics/claude-plugins-official` |
| claude-code-plugins | `anthropics/claude-code` |
| Mixedbread-Grep | `mixedbread-ai/mgrep` |

---

## 安装 Plugins

```bash
# 打开 plugins 浏览器
/plugins

# 或直接安装
claude plugin install typescript-lsp@claude-plugins-official
```

### 推荐的 Plugins

**Development:**
- `typescript-lsp` - TypeScript 智能补全
- `pyright-lsp` - Python 类型检查
- `hookify` - 通过对话创建 hooks
- `code-simplifier` - 重构代码

**Code Quality:**
- `code-review` - 代码审查
- `pr-review-toolkit` - PR 自动化
- `security-guidance` - 安全检查

**Search:**
- `mgrep` - 增强搜索（优于 ripgrep）
- `context7` - 实时文档查询

**Workflow:**
- `commit-commands` - Git 工作流
- `frontend-design` - UI 模式
- `feature-dev` - 功能开发

---

## 快速设置

```bash
# 添加 marketplaces
claude plugin marketplace add https://github.com/anthropics/claude-plugins-official
claude plugin marketplace add https://github.com/mixedbread-ai/mgrep

# 打开 /plugins 安装你需要的
```

---

## Plugin 文件位置

```
~/.claude/plugins/
|-- cache/                    # 已下载的 plugins
|-- installed_plugins.json    # 已安装列表
|-- known_marketplaces.json   # 已添加的 marketplaces
|-- marketplaces/             # Marketplace 数据
```
