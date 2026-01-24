# Code Review

对未提交的变更进行全面的安全和质量审查：

1. 获取变更的文件：git diff --name-only HEAD

2. 对于每个变更的文件，检查：

**Security Issues (CRITICAL):**
- 硬编码的凭证、API keys、tokens
- SQL injection 漏洞
- XSS 漏洞
- 缺失的输入验证
- 不安全的依赖
- Path traversal 风险

**Code Quality (HIGH):**
- 函数 > 50 行
- 文件 > 800 行
- 嵌套深度 > 4 层
- 缺失错误处理
- console.log 语句
- TODO/FIXME 注释
- 公共 APIs 缺失 JSDoc

**Best Practices (MEDIUM):**
- Mutation patterns（改用 immutable）
- 代码/注释中使用 Emoji
- 新代码缺失测试
- Accessibility 问题 (a11y)

3. 生成报告，包含：
   - 严重性：CRITICAL、HIGH、MEDIUM、LOW
   - 文件位置和行号
   - 问题描述
   - 建议的修复

4. 如果发现 CRITICAL 或 HIGH 问题，阻止 commit

永远不要批准存在安全漏洞的代码！
