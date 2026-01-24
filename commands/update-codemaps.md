# Update Codemaps

分析代码库结构并更新架构文档：

1. 扫描所有源文件的 imports、exports 和依赖
2. 以以下格式生成 token 精简的 codemaps：
   - codemaps/architecture.md - 整体架构
   - codemaps/backend.md - Backend 结构
   - codemaps/frontend.md - Frontend 结构
   - codemaps/data.md - 数据模型和 schemas

3. 计算与上一版本的 diff 百分比
4. 如果变更 > 30%，更新前请求用户批准
5. 向每个 codemap 添加时效性时间戳
6. 将报告保存到 .reports/codemap-diff.txt

使用 TypeScript/Node.js 进行分析。关注高层结构，而非实现细节。
