/**
 * Claude Code hooks 和脚本的跨平台工具函数
 * 适用于 Windows、macOS 和 Linux
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync, spawnSync } = require('child_process');

// 平台检测
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

/**
 * 获取用户主目录（跨平台）
 */
function getHomeDir() {
  return os.homedir();
}

/**
 * 获取 Claude 配置目录
 */
function getClaudeDir() {
  return path.join(getHomeDir(), '.claude');
}

/**
 * 获取会话目录
 */
function getSessionsDir() {
  return path.join(getClaudeDir(), 'sessions');
}

/**
 * 获取已学习 skills 目录
 */
function getLearnedSkillsDir() {
  return path.join(getClaudeDir(), 'skills', 'learned');
}

/**
 * 获取临时目录（跨平台）
 */
function getTempDir() {
  return os.tmpdir();
}

/**
 * 确保目录存在（如果不存在则创建）
 */
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  return dirPath;
}

/**
 * 获取当前日期，格式为 YYYY-MM-DD
 */
function getDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 获取当前时间，格式为 HH:MM
 */
function getTimeString() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 获取当前日期时间，格式为 YYYY-MM-DD HH:MM:SS
 */
function getDateTimeString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 在目录中查找匹配模式的文件（find 的跨平台替代）
 * @param {string} dir - 要搜索的目录
 * @param {string} pattern - 文件模式（例如 "*.tmp", "*.md"）
 * @param {object} options - 选项 { maxAge: days, recursive: boolean }
 */
function findFiles(dir, pattern, options = {}) {
  const { maxAge = null, recursive = false } = options;
  const results = [];

  if (!fs.existsSync(dir)) {
    return results;
  }

  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*/g, '.*')
    .replace(/\?/g, '.');
  const regex = new RegExp(`^${regexPattern}$`);

  function searchDir(currentDir) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isFile() && regex.test(entry.name)) {
          if (maxAge !== null) {
            const stats = fs.statSync(fullPath);
            const ageInDays = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
            if (ageInDays <= maxAge) {
              results.push({ path: fullPath, mtime: stats.mtimeMs });
            }
          } else {
            const stats = fs.statSync(fullPath);
            results.push({ path: fullPath, mtime: stats.mtimeMs });
          }
        } else if (entry.isDirectory() && recursive) {
          searchDir(fullPath);
        }
      }
    } catch (err) {
      // 忽略权限错误
    }
  }

  searchDir(dir);

  // 按修改时间排序（最新的在前）
  results.sort((a, b) => b.mtime - a.mtime);

  return results;
}

/**
 * 从 stdin 读取 JSON（用于 hook 输入）
 */
async function readStdinJson() {
  return new Promise((resolve, reject) => {
    let data = '';

    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => {
      data += chunk;
    });

    process.stdin.on('end', () => {
      try {
        if (data.trim()) {
          resolve(JSON.parse(data));
        } else {
          resolve({});
        }
      } catch (err) {
        reject(err);
      }
    });

    process.stdin.on('error', reject);
  });
}

/**
 * 输出到 stderr（在 Claude Code 中对用户可见）
 */
function log(message) {
  console.error(message);
}

/**
 * 输出到 stdout（返回给 Claude）
 */
function output(data) {
  if (typeof data === 'object') {
    console.log(JSON.stringify(data));
  } else {
    console.log(data);
  }
}

/**
 * 安全读取文本文件
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

/**
 * 写入文本文件
 */
function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

/**
 * 追加到文本文件
 */
function appendFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, content, 'utf8');
}

/**
 * 检查命令是否存在于 PATH 中
 */
function commandExists(cmd) {
  try {
    if (isWindows) {
      execSync(`where ${cmd}`, { stdio: 'pipe' });
    } else {
      execSync(`which ${cmd}`, { stdio: 'pipe' });
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * 运行命令并返回输出
 */
function runCommand(cmd, options = {}) {
  try {
    const result = execSync(cmd, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      ...options
    });
    return { success: true, output: result.trim() };
  } catch (err) {
    return { success: false, output: err.stderr || err.message };
  }
}

/**
 * 检查当前目录是否是 git 仓库
 */
function isGitRepo() {
  return runCommand('git rev-parse --git-dir').success;
}

/**
 * 获取 git 修改的文件
 */
function getGitModifiedFiles(patterns = []) {
  if (!isGitRepo()) return [];

  const result = runCommand('git diff --name-only HEAD');
  if (!result.success) return [];

  let files = result.output.split('\n').filter(Boolean);

  if (patterns.length > 0) {
    files = files.filter(file => {
      return patterns.some(pattern => {
        const regex = new RegExp(pattern);
        return regex.test(file);
      });
    });
  }

  return files;
}

/**
 * 替换文件中的文本（sed 的跨平台替代）
 */
function replaceInFile(filePath, search, replace) {
  const content = readFile(filePath);
  if (content === null) return false;

  const newContent = content.replace(search, replace);
  writeFile(filePath, newContent);
  return true;
}

/**
 * 统计文件中模式的出现次数
 */
function countInFile(filePath, pattern) {
  const content = readFile(filePath);
  if (content === null) return 0;

  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern, 'g');
  const matches = content.match(regex);
  return matches ? matches.length : 0;
}

/**
 * 在文件中搜索模式并返回匹配的行及行号
 */
function grepFile(filePath, pattern) {
  const content = readFile(filePath);
  if (content === null) return [];

  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
  const lines = content.split('\n');
  const results = [];

  lines.forEach((line, index) => {
    if (regex.test(line)) {
      results.push({ lineNumber: index + 1, content: line });
    }
  });

  return results;
}

module.exports = {
  // 平台信息
  isWindows,
  isMacOS,
  isLinux,

  // 目录
  getHomeDir,
  getClaudeDir,
  getSessionsDir,
  getLearnedSkillsDir,
  getTempDir,
  ensureDir,

  // 日期/时间
  getDateString,
  getTimeString,
  getDateTimeString,

  // 文件操作
  findFiles,
  readFile,
  writeFile,
  appendFile,
  replaceInFile,
  countInFile,
  grepFile,

  // Hook I/O
  readStdinJson,
  log,
  output,

  // 系统
  commandExists,
  runCommand,
  isGitRepo,
  getGitModifiedFiles
};
