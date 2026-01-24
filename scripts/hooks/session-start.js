#!/usr/bin/env node
/**
 * SessionStart Hook - 新会话时加载之前的上下文
 *
 * 跨平台 (Windows, macOS, Linux)
 *
 * 在新的 Claude 会话开始时运行。检查最近的会话文件
 * 并通知 Claude 可加载的上下文。
 */

const path = require('path');
const {
  getSessionsDir,
  getLearnedSkillsDir,
  findFiles,
  ensureDir,
  log
} = require('../lib/utils');
const { getPackageManager, getSelectionPrompt } = require('../lib/package-manager');

async function main() {
  const sessionsDir = getSessionsDir();
  const learnedDir = getLearnedSkillsDir();

  // 确保目录存在
  ensureDir(sessionsDir);
  ensureDir(learnedDir);

  // 检查最近的会话文件（最近 7 天）
  const recentSessions = findFiles(sessionsDir, '*.tmp', { maxAge: 7 });

  if (recentSessions.length > 0) {
    const latest = recentSessions[0];
    log(`[SessionStart] Found ${recentSessions.length} recent session(s)`);
    log(`[SessionStart] Latest: ${latest.path}`);
  }

  // 检查已学习的 skills
  const learnedSkills = findFiles(learnedDir, '*.md');

  if (learnedSkills.length > 0) {
    log(`[SessionStart] ${learnedSkills.length} learned skill(s) available in ${learnedDir}`);
  }

  // 检测并报告包管理器
  const pm = getPackageManager();
  log(`[SessionStart] Package manager: ${pm.name} (${pm.source})`);

  // 如果包管理器是通过 fallback 检测的，显示选择提示
  if (pm.source === 'fallback' || pm.source === 'default') {
    log('[SessionStart] No package manager preference found.');
    log(getSelectionPrompt());
  }

  process.exit(0);
}

main().catch(err => {
  console.error('[SessionStart] Error:', err.message);
  process.exit(0); // 出错时不阻塞
});
