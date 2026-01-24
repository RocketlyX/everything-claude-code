#!/usr/bin/env node
/**
 * Stop Hook (Session End) - 会话结束时持久化学习内容
 *
 * 跨平台 (Windows, macOS, Linux)
 *
 * 在 Claude 会话结束时运行。创建/更新带时间戳的会话日志文件
 * 以进行连续性跟踪。
 */

const path = require('path');
const fs = require('fs');
const {
  getSessionsDir,
  getDateString,
  getTimeString,
  ensureDir,
  readFile,
  writeFile,
  replaceInFile,
  log
} = require('../lib/utils');

async function main() {
  const sessionsDir = getSessionsDir();
  const today = getDateString();
  const sessionFile = path.join(sessionsDir, `${today}-session.tmp`);

  ensureDir(sessionsDir);

  const currentTime = getTimeString();

  // 如果今天的会话文件存在，更新结束时间
  if (fs.existsSync(sessionFile)) {
    const success = replaceInFile(
      sessionFile,
      /\*\*Last Updated:\*\*.*/,
      `**Last Updated:** ${currentTime}`
    );

    if (success) {
      log(`[SessionEnd] Updated session file: ${sessionFile}`);
    }
  } else {
    // 使用模板创建新的会话文件
    const template = `# Session: ${today}
**Date:** ${today}
**Started:** ${currentTime}
**Last Updated:** ${currentTime}

---

## Current State

[会话上下文放在这里]

### Completed
- [ ]

### In Progress
- [ ]

### Notes for Next Session
-

### Context to Load
\`\`\`
[相关文件]
\`\`\`
`;

    writeFile(sessionFile, template);
    log(`[SessionEnd] Created session file: ${sessionFile}`);
  }

  process.exit(0);
}

main().catch(err => {
  console.error('[SessionEnd] Error:', err.message);
  process.exit(0);
});
