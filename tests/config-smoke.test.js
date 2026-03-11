const assert = require('assert')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')

const mustHave = [
  'agents/doc-updater.md',
  'agents/e2e-runner.md',
  'commands/ucc-update-docs.md',
  'commands/ucc-e2e.md',
  'rules/javascript/coding-style.md',
  'rules/javascript/security.md',
  'rules/javascript/testing.md',
  'rules/javascript/patterns.md',
  'skills/node-backend-patterns/SKILL.md',
  'skills/design-collaboration/SKILL.md',
  'agents/database-reviewer.md',
  'agents/design-doc-writer.md',
  'agents/delivery-doc-writer.md',
  'commands/ucc-db-review.md',
  'commands/ucc-design-doc.md',
  'commands/ucc-delivery-doc.md',
  'commands/ucc-quality-gate.md',
  'skills/design-doc-patterns/SKILL.md',
  'skills/delivery-patterns/SKILL.md',
  'skills/docker-patterns/SKILL.md',
  'skills/deployment-patterns/SKILL.md',
]

for (const file of mustHave) {
  assert.ok(fs.existsSync(path.join(root, file)), `缺少文件: ${file}`)
}

console.log('config-smoke.test.js 通过')
