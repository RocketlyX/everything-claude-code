---
description: 配置你偏好的包管理器 (npm/pnpm/yarn/bun)
disable-model-invocation: true
---

# Package Manager Setup

为此项目或全局配置你偏好的包管理器。

## Usage

```bash
# 检测当前包管理器
node scripts/setup-package-manager.js --detect

# 设置全局偏好
node scripts/setup-package-manager.js --global pnpm

# 设置项目偏好
node scripts/setup-package-manager.js --project bun

# 列出可用的包管理器
node scripts/setup-package-manager.js --list
```

## Detection Priority

确定使用哪个包管理器时，按以下顺序检查：

1. **Environment variable**: `CLAUDE_PACKAGE_MANAGER`
2. **Project config**: `.claude/package-manager.json`
3. **package.json**: `packageManager` 字段
4. **Lock file**: 存在 package-lock.json、yarn.lock、pnpm-lock.yaml 或 bun.lockb
5. **Global config**: `~/.claude/package-manager.json`
6. **Fallback**: 首个可用的包管理器 (pnpm > bun > yarn > npm)

## Configuration Files

### Global Configuration
```json
// ~/.claude/package-manager.json
{
  "packageManager": "pnpm"
}
```

### Project Configuration
```json
// .claude/package-manager.json
{
  "packageManager": "bun"
}
```

### package.json
```json
{
  "packageManager": "pnpm@8.6.0"
}
```

## Environment Variable

设置 `CLAUDE_PACKAGE_MANAGER` 以覆盖所有其他检测方法：

```bash
# Windows (PowerShell)
$env:CLAUDE_PACKAGE_MANAGER = "pnpm"

# macOS/Linux
export CLAUDE_PACKAGE_MANAGER=pnpm
```

## Run the Detection

要查看当前包管理器检测结果，运行：

```bash
node scripts/setup-package-manager.js --detect
```
