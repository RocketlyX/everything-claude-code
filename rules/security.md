# 安全指南

## 强制安全检查

任何提交之前：
- [ ] 无硬编码密钥（API 密钥、密码、令牌）
- [ ] 所有用户输入已验证
- [ ] SQL 注入防护（参数化查询）
- [ ] XSS 防护（HTML 已净化）
- [ ] CSRF 保护已启用
- [ ] 认证/授权已验证
- [ ] 所有端点有速率限制
- [ ] 错误消息不泄露敏感数据

## 密钥管理

```typescript
// 禁止：硬编码密钥
const apiKey = "sk-proj-xxxxx"

// 必须：环境变量
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY 未配置')
}
```

## 安全响应协议

如果发现安全问题：
1. 立即停止
2. 使用 **security-reviewer** agent
3. 在继续之前修复 CRITICAL 问题
4. 轮换任何暴露的密钥
5. 审查整个代码库是否有类似问题
