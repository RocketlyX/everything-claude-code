#!/usr/bin/env node
/**
 * 包管理器设置脚本
 *
 * 配置首选包管理器的交互式脚本。
 * 可以直接运行或通过 /setup-pm 命令运行。
 *
 * 用法:
 *   node scripts/setup-package-manager.js [pm-name]
 *   node scripts/setup-package-manager.js --detect
 *   node scripts/setup-package-manager.js --global pnpm
 *   node scripts/setup-package-manager.js --project bun
 */

const {
  PACKAGE_MANAGERS,
  getPackageManager,
  setPreferredPackageManager,
  setProjectPackageManager,
  getAvailablePackageManagers,
  detectFromLockFile,
  detectFromPackageJson,
  getSelectionPrompt
} = require('./lib/package-manager');
const { log } = require('./lib/utils');

function showHelp() {
  console.log(`
Claude Code 包管理器设置

用法:
  node scripts/setup-package-manager.js [options] [package-manager]

选项:
  --detect        检测并显示当前包管理器
  --global <pm>   设置全局偏好（保存到 ~/.claude/package-manager.json）
  --project <pm>  设置项目偏好（保存到 .claude/package-manager.json）
  --list          列出可用的包管理器
  --help          显示此帮助消息

包管理器:
  npm             Node Package Manager（Node.js 默认）
  pnpm            快速、磁盘空间高效的包管理器
  yarn            经典 Yarn 包管理器
  bun             一体化 JavaScript 运行时和工具包

示例:
  # 检测当前包管理器
  node scripts/setup-package-manager.js --detect

  # 将 pnpm 设置为全局偏好
  node scripts/setup-package-manager.js --global pnpm

  # 为当前项目设置 bun
  node scripts/setup-package-manager.js --project bun

  # 列出可用的包管理器
  node scripts/setup-package-manager.js --list
`);
}

function detectAndShow() {
  const pm = getPackageManager();
  const available = getAvailablePackageManagers();
  const fromLock = detectFromLockFile();
  const fromPkg = detectFromPackageJson();

  console.log('\n=== 包管理器检测 ===\n');

  console.log('当前选择:');
  console.log(`  包管理器: ${pm.name}`);
  console.log(`  来源: ${pm.source}`);
  console.log('');

  console.log('检测结果:');
  console.log(`  从 package.json: ${fromPkg || '未指定'}`);
  console.log(`  从 lock 文件: ${fromLock || '未找到'}`);
  console.log(`  环境变量: ${process.env.CLAUDE_PACKAGE_MANAGER || '未设置'}`);
  console.log('');

  console.log('可用的包管理器:');
  for (const pmName of Object.keys(PACKAGE_MANAGERS)) {
    const installed = available.includes(pmName);
    const indicator = installed ? '✓' : '✗';
    const current = pmName === pm.name ? ' (current)' : '';
    console.log(`  ${indicator} ${pmName}${current}`);
  }

  console.log('');
  console.log('命令:');
  console.log(`  安装: ${pm.config.installCmd}`);
  console.log(`  运行脚本: ${pm.config.runCmd} <script>`);
  console.log(`  执行二进制: ${pm.config.execCmd} <binary>`);
  console.log('');
}

function listAvailable() {
  const available = getAvailablePackageManagers();
  const pm = getPackageManager();

  console.log('\n可用的包管理器:\n');

  for (const pmName of Object.keys(PACKAGE_MANAGERS)) {
    const config = PACKAGE_MANAGERS[pmName];
    const installed = available.includes(pmName);
    const current = pmName === pm.name ? ' (current)' : '';

    console.log(`${pmName}${current}`);
    console.log(`  已安装: ${installed ? '是' : '否'}`);
    console.log(`  Lock 文件: ${config.lockFile}`);
    console.log(`  安装命令: ${config.installCmd}`);
    console.log(`  运行命令: ${config.runCmd}`);
    console.log('');
  }
}

function setGlobal(pmName) {
  if (!PACKAGE_MANAGERS[pmName]) {
    console.error(`错误: 未知的包管理器 "${pmName}"`);
    console.error(`可用: ${Object.keys(PACKAGE_MANAGERS).join(', ')}`);
    process.exit(1);
  }

  const available = getAvailablePackageManagers();
  if (!available.includes(pmName)) {
    console.warn(`警告: ${pmName} 未在你的系统中安装`);
  }

  try {
    setPreferredPackageManager(pmName);
    console.log(`\n✓ 全局偏好已设置为: ${pmName}`);
    console.log('  保存到: ~/.claude/package-manager.json');
    console.log('');
  } catch (err) {
    console.error(`错误: ${err.message}`);
    process.exit(1);
  }
}

function setProject(pmName) {
  if (!PACKAGE_MANAGERS[pmName]) {
    console.error(`错误: 未知的包管理器 "${pmName}"`);
    console.error(`可用: ${Object.keys(PACKAGE_MANAGERS).join(', ')}`);
    process.exit(1);
  }

  try {
    setProjectPackageManager(pmName);
    console.log(`\n✓ 项目偏好已设置为: ${pmName}`);
    console.log('  保存到: .claude/package-manager.json');
    console.log('');
  } catch (err) {
    console.error(`错误: ${err.message}`);
    process.exit(1);
  }
}

// 主程序
const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

if (args.includes('--detect')) {
  detectAndShow();
  process.exit(0);
}

if (args.includes('--list')) {
  listAvailable();
  process.exit(0);
}

const globalIdx = args.indexOf('--global');
if (globalIdx !== -1) {
  const pmName = args[globalIdx + 1];
  if (!pmName) {
    console.error('错误: --global 需要一个包管理器名称');
    process.exit(1);
  }
  setGlobal(pmName);
  process.exit(0);
}

const projectIdx = args.indexOf('--project');
if (projectIdx !== -1) {
  const pmName = args[projectIdx + 1];
  if (!pmName) {
    console.error('错误: --project 需要一个包管理器名称');
    process.exit(1);
  }
  setProject(pmName);
  process.exit(0);
}

// 如果只提供了包管理器名称，则全局设置它
const pmName = args[0];
if (PACKAGE_MANAGERS[pmName]) {
  setGlobal(pmName);
} else {
  console.error(`错误: 未知的选项或包管理器 "${pmName}"`);
  showHelp();
  process.exit(1);
}
