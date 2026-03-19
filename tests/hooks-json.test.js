const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const content = fs.readFileSync(path.join(root, 'hooks/hooks.json'), 'utf8')
const json = JSON.parse(content)
const projectSettingsContent = fs.readFileSync(path.join(root, 'hooks/project-settings.json'), 'utf8')
const projectSettings = JSON.parse(projectSettingsContent)

assert.ok(json.$schema, 'hooks.json 缺少 $schema')
assert.ok(json.hooks, 'hooks.json 缺少 hooks')
assert.ok(Array.isArray(json.hooks.PreToolUse), 'hooks.PreToolUse 必须为数组')
assert.ok(Array.isArray(json.hooks.PostToolUse), 'hooks.PostToolUse 必须为数组')
assert.ok(Array.isArray(json.hooks.Stop), 'hooks.Stop 必须为数组')

assert.ok(projectSettings.$schema, 'project-settings.json 缺少 $schema')
assert.ok(projectSettings.hooks, 'project-settings.json 缺少 hooks')
assert.ok(Array.isArray(projectSettings.hooks.PreToolUse), 'project-settings.PreToolUse 必须为数组')
assert.ok(Array.isArray(projectSettings.hooks.PostToolUse), 'project-settings.PostToolUse 必须为数组')
assert.ok(Array.isArray(projectSettings.hooks.Stop), 'project-settings.Stop 必须为数组')

console.log('hooks-json.test.js 通过')
