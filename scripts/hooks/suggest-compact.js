#!/usr/bin/env node
/**
 * Strategic Compact Suggester
 *
 * 跨平台 (Windows, macOS, Linux)
 *
 * 在 PreToolUse 或定期运行，在逻辑间隔处建议手动压缩
 *
 * 为什么使用手动而非自动压缩:
 * - 自动压缩在任意时间点发生，通常在任务中途
 * - 策略性压缩在逻辑阶段之间保留上下文
 * - 在探索之后、执行之前压缩
 * - 在完成里程碑之后、开始下一个之前压缩
 */

const path = require('path');
const fs = require('fs');
const {
  getTempDir,
  readFile,
  writeFile,
  log
} = require('../lib/utils');

async function main() {
  // 跟踪工具调用计数（在临时文件中递增）
  // 使用基于父进程 PID 或环境中会话 ID 的会话特定计数器文件
  const sessionId = process.env.CLAUDE_SESSION_ID || process.ppid || 'default';
  const counterFile = path.join(getTempDir(), `claude-tool-count-${sessionId}`);
  const threshold = parseInt(process.env.COMPACT_THRESHOLD || '50', 10);

  let count = 1;

  // 读取现有计数或从 1 开始
  const existing = readFile(counterFile);
  if (existing) {
    count = parseInt(existing.trim(), 10) + 1;
  }

  // 保存更新后的计数
  writeFile(counterFile, String(count));

  // 在达到阈值后建议压缩
  if (count === threshold) {
    log(`[StrategicCompact] ${threshold} tool calls reached - consider /compact if transitioning phases`);
  }

  // 在阈值之后定期建议
  if (count > threshold && count % 25 === 0) {
    log(`[StrategicCompact] ${count} tool calls - good checkpoint for /compact if context is stale`);
  }

  process.exit(0);
}

main().catch(err => {
  console.error('[StrategicCompact] Error:', err.message);
  process.exit(0);
});
