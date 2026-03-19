const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const agentsDir = path.join(root, 'agents')

for (const file of fs.readdirSync(agentsDir).filter((name) => name.endsWith('.md')).sort()) {
  const rel = path.posix.join('agents', file)
  const content = fs.readFileSync(path.join(root, rel), 'utf8')
  const match = content.match(/^model:\s*(.+)$/m)
  assert.ok(match, `${rel} 缺少 model frontmatter`)
  assert.strictEqual(match[1].trim(), 'inherit', `${rel} 应继承当前会话模型`)
  assert.ok(!/^model:\s*(opus|sonnet|haiku)$/m.test(content), `${rel} 不应绑定固定官方模型别名`)
}

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8')
const usage = fs.readFileSync(path.join(root, 'docs', '使用说明.md'), 'utf8')
const claude = fs.readFileSync(path.join(root, 'CLAUDE.md'), 'utf8')

assert.ok(readme.includes('model: inherit'), 'README 未说明模型继承策略')
assert.ok(usage.includes('model: inherit'), '使用说明未说明模型继承策略')
assert.ok(claude.includes('model: inherit'), 'CLAUDE.md 未说明模型继承策略')

console.log('model-inheritance.test.js 通过')
