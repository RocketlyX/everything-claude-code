#!/usr/bin/env node
/**
 * Continuous Learning - Session Evaluator
 *
 * 跨平台 (Windows, macOS, Linux)
 *
 * 在 Stop hook 运行以从 Claude Code 会话中提取可复用的模式
 *
 * 为什么使用 Stop hook 而不是 UserPromptSubmit:
 * - Stop 在会话结束时运行一次（轻量级）
 * - UserPromptSubmit 每条消息都运行（重，增加延迟）
 */

const path = require('path');
const fs = require('fs');
const {
  getLearnedSkillsDir,
  ensureDir,
  readFile,
  countInFile,
  log
} = require('../lib/utils');

async function main() {
  // 获取脚本目录以找到配置
  const scriptDir = __dirname;
  const configFile = path.join(scriptDir, '..', '..', 'skills', 'continuous-learning', 'config.json');

  // 默认配置
  let minSessionLength = 10;
  let learnedSkillsPath = getLearnedSkillsDir();

  // 如果存在则加载配置
  const configContent = readFile(configFile);
  if (configContent) {
    try {
      const config = JSON.parse(configContent);
      minSessionLength = config.min_session_length || 10;

      if (config.learned_skills_path) {
        // 处理路径中的 ~
        learnedSkillsPath = config.learned_skills_path.replace(/^~/, require('os').homedir());
      }
    } catch {
      // 无效配置，使用默认值
    }
  }

  // 确保 learned skills 目录存在
  ensureDir(learnedSkillsPath);

  // 从环境变量获取 transcript 路径（由 Claude Code 设置）
  const transcriptPath = process.env.CLAUDE_TRANSCRIPT_PATH;

  if (!transcriptPath || !fs.existsSync(transcriptPath)) {
    process.exit(0);
  }

  // 统计会话中的用户消息数
  const messageCount = countInFile(transcriptPath, /"type":"user"/g);

  // 跳过短会话
  if (messageCount < minSessionLength) {
    log(`[ContinuousLearning] Session too short (${messageCount} messages), skipping`);
    process.exit(0);
  }

  // 向 Claude 发出信号，表示应评估会话以提取可复用模式
  log(`[ContinuousLearning] Session has ${messageCount} messages - evaluate for extractable patterns`);
  log(`[ContinuousLearning] Save learned skills to: ${learnedSkillsPath}`);

  process.exit(0);
}

main().catch(err => {
  console.error('[ContinuousLearning] Error:', err.message);
  process.exit(0);
});
