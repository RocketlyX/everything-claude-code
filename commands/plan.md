---
description: 重述需求，评估风险，创建分步实现计划。在接触任何代码之前等待用户确认。
---

# Plan Command

此命令调用 **planner** agent 在编写任何代码之前创建全面的实现计划。

## What This Command Does

1. **Restate Requirements** - 澄清需要构建什么
2. **Identify Risks** - 揭示潜在问题和阻碍
3. **Create Step Plan** - 将实现分解为阶段
4. **Wait for Confirmation** - 必须在继续之前获得用户批准

## When to Use

使用 `/plan` 当：
- 开始新功能
- 进行重大架构变更
- 处理复杂重构
- 多个文件/组件将受影响
- 需求不清晰或模糊

## How It Works

planner agent 将：

1. **Analyze the request** 用清晰的术语重述需求
2. **Break down into phases** 包含具体、可执行的步骤
3. **Identify dependencies** 组件之间的依赖关系
4. **Assess risks** 和潜在阻碍
5. **Estimate complexity** (High/Medium/Low)
6. **Present the plan** 并等待你的明确确认

## Example Usage

```
User: /plan I need to add real-time notifications when markets resolve

Agent (planner):
# Implementation Plan: Real-Time Market Resolution Notifications

## Requirements Restatement
- Send notifications to users when markets they're watching resolve
- Support multiple notification channels (in-app, email, webhook)
- Ensure notifications are delivered reliably
- Include market outcome and user's position result

## Implementation Phases

### Phase 1: Database Schema
- Add notifications table with columns: id, user_id, market_id, type, status, created_at
- Add user_notification_preferences table for channel preferences
- Create indexes on user_id and market_id for performance

### Phase 2: Notification Service
- Create notification service in lib/notifications.ts
- Implement notification queue using BullMQ/Redis
- Add retry logic for failed deliveries
- Create notification templates

### Phase 3: Integration Points
- Hook into market resolution logic (when status changes to "resolved")
- Query all users with positions in market
- Enqueue notifications for each user

### Phase 4: Frontend Components
- Create NotificationBell component in header
- Add NotificationList modal
- Implement real-time updates via Supabase subscriptions
- Add notification preferences page

## Dependencies
- Redis (for queue)
- Email service (SendGrid/Resend)
- Supabase real-time subscriptions

## Risks
- HIGH: Email deliverability (SPF/DKIM required)
- MEDIUM: Performance with 1000+ users per market
- MEDIUM: Notification spam if markets resolve frequently
- LOW: Real-time subscription overhead

## Estimated Complexity: MEDIUM
- Backend: 4-6 hours
- Frontend: 3-4 hours
- Testing: 2-3 hours
- Total: 9-13 hours

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

## Important Notes

**CRITICAL**: planner agent 在你明确用 "yes" 或 "proceed" 或类似肯定回复确认计划之前**不会**编写任何代码。

如果你想要修改，回复：
- "modify: [your changes]"
- "different approach: [alternative]"
- "skip phase 2 and do phase 3 first"

## Integration with Other Commands

计划完成后：
- 使用 `/tdd` 进行测试驱动开发实现
- 如果发生构建错误使用 `/build-and-fix`
- 使用 `/code-review` 审查完成的实现

## Related Agents

此命令调用位于以下位置的 `planner` agent：
`~/.claude/agents/planner.md`
