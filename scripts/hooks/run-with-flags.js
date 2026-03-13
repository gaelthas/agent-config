#!/usr/bin/env node

'use strict'

const path = require('path')
const { spawn } = require('child_process')
const { log, output, readStdinJson } = require('../lib/utils')
const { isHookEnabled } = require('../lib/hook-flags')

const PLUGIN_ROOT = process.env.CLAUDE_PLUGIN_ROOT || path.resolve(__dirname, '..', '..')
const DEFAULT_PROFILES = 'standard,strict'

function resolveScript(relPath) {
  if (!relPath) return ''
  return path.isAbsolute(relPath) ? relPath : path.join(PLUGIN_ROOT, relPath)
}

async function main() {
  const [hookId, relScriptPath, profilesCsv] = process.argv.slice(2)
  const input = await readStdinJson()

  if (!hookId || !relScriptPath) {
    log('[Hook] run-with-flags 缺少 hookId 或 scriptPath，已跳过。')
    output(input)
    return
  }

  if (!isHookEnabled(hookId, { profiles: profilesCsv || DEFAULT_PROFILES })) {
    output(input)
    return
  }

  const scriptPath = resolveScript(relScriptPath)
  const child = spawn('node', [scriptPath], { stdio: ['pipe', 'pipe', 'pipe'] })

  let stdout = ''
  let stderr = ''

  child.stdout.on('data', (chunk) => {
    stdout += chunk
  })

  child.stderr.on('data', (chunk) => {
    stderr += chunk
  })

  child.on('error', (err) => {
    log(`[Hook] run-with-flags 执行失败: ${String(err)}`)
    output(input)
  })

  child.on('close', (code) => {
    if (stderr.trim()) {
      log(stderr.trim())
    }

    if (code === 2) {
      process.exit(2)
    }

    if (stdout.trim()) {
      process.stdout.write(stdout.trim() + '\n')
      return
    }

    output(input)
  })

  child.stdin.write(JSON.stringify(input))
  child.stdin.end()
}

main().catch((err) => {
  log(`[Hook] run-with-flags 异常: ${String(err)}`)
  process.exit(0)
})
