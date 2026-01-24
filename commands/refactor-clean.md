# Refactor Clean

通过测试验证安全地识别和移除死代码：

1. 运行死代码分析工具：
   - knip：查找未使用的 exports 和文件
   - depcheck：查找未使用的依赖
   - ts-prune：查找未使用的 TypeScript exports

2. 在 .reports/dead-code-analysis.md 生成综合报告

3. 按严重性分类发现：
   - SAFE：测试文件、未使用的工具函数
   - CAUTION：API routes、组件
   - DANGER：配置文件、主入口点

4. 仅提议安全的删除

5. 每次删除之前：
   - 运行完整测试套件
   - 验证测试通过
   - 应用变更
   - 重新运行测试
   - 如果测试失败则回滚

6. 显示已清理项目的摘要

删除代码之前务必先运行测试！
