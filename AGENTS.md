# Repository Guidelines

## 项目结构与模块组织
本仓库维护 Claude Code 的 UCC 配置资产。核心运行时内容位于 `agents/`、`commands/`、`skills/`、`hooks/`、`workflows/` 和 `mcp-configs/`。贡献者规则位于 `rules/common/` 与 `rules/javascript/`。维护文档放在 `docs/`，验证与回归测试放在 `tests/`，辅助脚本放在 `scripts/`。新增文件应放入对应领域目录，例如 `commands/ucc-foo.md`、`agents/<role>.md`、`skills/<name>/SKILL.md`。

## 构建、测试与开发命令
本仓库没有编译步骤，日常维护以 Node 脚本为主。

- `node scripts/validate-config.js`：校验必需文件、Frontmatter、目录数量、workflow 定义、hook 配置以及退役命令引用。
- `node tests/run-all.js`：运行完整回归测试。
- `node tests/<name>.test.js`：运行单项测试，例如 `node tests/workflow-runtime.test.js`。
- `node scripts/copy-config.js <target>`：将配置复制到目标项目做人工验证。

涉及结构性改动前后都应运行 `node scripts/validate-config.js`；提交 PR 前应运行 `node tests/run-all.js`。

## 编码风格与命名约定
遵循现有 JavaScript 风格：2 空格缩进、单引号、非必要不加分号。优先使用不可变更新、提前返回和显式错误处理，并沿用文件当前采用的模块系统。函数尽量控制在 50 行内，文件尽量控制在 800 行内。

命名属于接口约束：

- 命令文件必须使用 `ucc-` 前缀
- 测试文件使用 `*.test.js`
- 技能目录使用 `skills/<name>/SKILL.md`
- agents、commands 和 skills 必须包含必需的 YAML Frontmatter

## 测试指南
共享规则要求最低 80% 覆盖率。优先采用 TDD：先写失败测试，再做最小实现，最后重构。凡是修改 workflow、命令元数据、hook 行为或复制/安装逻辑时，都应补充或更新有针对性的测试。

## 提交与 Pull Request 规范
Git 历史遵循 Conventional Commit 风格，常见前缀包括 `feat:`、`fix:`、`docs:`、`refactor:` 和 `chore:`，也存在 `feat(hooks): ...` 这类带 scope 的形式。提交标题使用祈使句，前缀后小写开头，并保持简洁。

AI 执行 `git commit` 时，提交信息必须使用简体中文。约束如下：

- 保留 Conventional Commit 的英文前缀与可选 scope，例如 `feat:`、`fix:`、`docs:`、`chore:`、`feat(hooks):`
- 冒号后的主题必须使用简体中文，禁止只写英文，禁止繁体中文，避免中英混杂句式
- 若需要补充提交说明，正文同样默认使用简体中文
- 未完成验证前不要创建提交；提交前至少确认本次改动已完成约定中的校验

PR 应遵循 `.github/PULL_REQUEST_TEMPLATE.md`，说明变更类型与验证方式，并确认 `node scripts/validate-config.js` 和 `node tests/run-all.js` 已通过。若新增或重命名 agents、commands、skills 或带版本的文档，还需同步更新 `CLAUDE.md`、`docs/配置定制指南.md`、`README.md` 以及 `scripts/validate-config.js` 中受数量或文件清单约束的内容。
