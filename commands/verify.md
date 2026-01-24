# Verification Command

对当前代码库状态运行全面验证。

## 指令

按以下确切顺序执行验证：

1. **Build Check**
   - 运行此项目的 build 命令
   - 如果失败，报告错误并停止

2. **Type Check**
   - 运行 TypeScript/类型检查器
   - 报告所有错误，包含 file:line

3. **Lint Check**
   - 运行 linter
   - 报告警告和错误

4. **Test Suite**
   - 运行所有测试
   - 报告通过/失败数量
   - 报告覆盖率百分比

5. **Console.log Audit**
   - 在源文件中搜索 console.log
   - 报告位置

6. **Git Status**
   - 显示未提交的变更
   - 显示自上次 commit 以来修改的文件

## 输出

生成简洁的验证报告：

```
VERIFICATION: [PASS/FAIL]

Build:    [OK/FAIL]
Types:    [OK/X errors]
Lint:     [OK/X issues]
Tests:    [X/Y passed, Z% coverage]
Secrets:  [OK/X found]
Logs:     [OK/X console.logs]

Ready for PR: [YES/NO]
```

如果有任何关键问题，列出它们并提供修复建议。

## 参数

$ARGUMENTS 可以是：
- `quick` - 仅 build + types
- `full` - 所有检查（默认）
- `pre-commit` - 与 commits 相关的检查
- `pre-pr` - 完整检查加安全扫描
