# Claude Code 配置（UCC）

> 适用于 Golang、Vue、TypeScript（前后端）、JavaScript、Node.js 开发的开箱即用 Claude Code 配置

配置标识：`UCC` · 调用标记：`@ucc` · 命令前缀：`/ucc-*`

---

## 快速开始（3 步）

### 1. 复制配置到项目

```bash
# 方式一：脚本复制（推荐）
node ai-config/scripts/copy-config.js <你的项目目录>

# 方式二：手动复制
cp ai-config/CLAUDE.md your-project/
cp -r ai-config/{rules,agents,commands,skills,contexts} your-project/.claude/
```

### 2. 修改编码规范（可选但建议）

编辑 `rules/common/` 下的文件，匹配你们团队的约定：

| 文件 | 改什么 | 默认值 |
|------|--------|--------|
| `coding-style.md` | 函数行数、文件行数 | 函数 < 50行，文件 < 800行 |
| `testing.md` | 测试覆盖率 | 80% |
| `git-workflow.md` | 提交格式、分支策略 | Conventional Commits |

### 3. 开始使用

```bash
# 规划功能
/ucc-plan "添加用户通知功能"

# 测试驱动开发
/ucc-tdd

# 代码审查
/ucc-code-review

# 生成设计文档
/ucc-design-doc 技术方案

# 生成交付文档
/ucc-delivery-doc 安装手册
```

---

## 目录结构

```
ai-config/
├── CLAUDE.md                    # 主配置文件（放项目根目录）
├── README.md                    # 本指南
│
├── contexts/                    # 工作模式（3个）
├── rules/                       # 编码规范（团队最常改的部分）
│   ├── common/                  # 通用规范
│   ├── golang/                  # Go 规范
│   ├── javascript/              # JavaScript 规范
│   └── typescript/              # TypeScript/Vue 规范
│
├── agents/                      # 代理（17个）
├── commands/                    # 斜杠命令（31个）
├── skills/                      # 技能模块（17个）
├── mcp-configs/                 # MCP 服务配置（需替换密钥占位符）
├── hooks/                       # 可选安全钩子
├── scripts/                     # 工具脚本
├── docs/                        # 深度定制教程
│   └── 配置定制指南.md           # 详细的分步定制指南
├── tests/                       # 配置验证测试
└── .github/                     # CI/CD 管道
```

---

## 常用命令速查

### 开发流程

| 命令 | 用途 | 何时用 |
|------|------|--------|
| `/ucc-plan` | 实现规划 | 新功能、重大变更前 |
| `/ucc-tdd` | TDD 开发 | 写代码时 |
| `/ucc-code-review` | 代码审查 | 写完代码后 |
| `/ucc-build-fix` | 修复构建错误 | 构建失败时 |
| `/ucc-verify` | 综合验证 | 提交前 |
| `/ucc-quality-gate` | 质量门禁 | 提交 PR 前 |
| `/ucc-harness-audit` | Harness 快速体检 | 配置升级或异常时 |
| `/ucc-loop-start` | 启动验证循环 | 大改后或演示前 |
| `/ucc-loop-status` | 查看验证状态 | 循环运行中 |
| `/ucc-model-route` | 检查模型路由 | 模型策略调整前 |

### 文档输出

| 命令 | 用途 | 何时用 |
|------|------|--------|
| `/ucc-design-doc` | 设计文档（PRD/技术方案/接口文档） | 功能启动时 |
| `/ucc-delivery-doc` | 交付文档（安装手册/使用说明/测试报告） | 项目交付时 |
| `/ucc-update-docs` | 同步更新文档 | 代码变更后 |

### 语言专用

| 命令 | 用途 |
|------|------|
| `/ucc-go-review` | Go 代码审查 |
| `/ucc-go-test` | Go TDD（表驱动测试） |
| `/ucc-go-build` | Go 构建错误修复 |
| `/ucc-javascript-review` | JS/TS/Vue 代码审查 |
| `/ucc-typescript-review` | 前端 TypeScript/Vue 代码审查 |
| `/ucc-typescript-backend-review` | 后端 TypeScript/Node 代码审查 |
| `/ucc-db-review` | 数据库审查（MySQL/SQLite） |

### 工作模式

```bash
/ucc-context-dev       # 开发模式：先写代码，后解释
/ucc-context-review    # 审查模式：先读代码，再评论
/ucc-context-research  # 研究模式：先理解，后行动
```

---

## 团队协作约定

### 配置变更流程

1. 修改配置文件
2. 运行校验（必须通过）：
   ```bash
   node scripts/validate-config.js
   node tests/run-all.js
   ```
3. 提交 PR，至少 1 人审查

### 提交规范

```
agents: 新增 database-reviewer 代理
commands: 新增 /ucc-design-doc 命令
rules: 调整函数行数限制为 80 行
skills: 新增 docker-patterns 技能
docs: 更新配置定制指南
```

### 排查"配置不生效"

1. 在请求中加上 `@ucc`
2. 检查输出末尾是否出现 `配置标识：UCC`
3. 如果没出现 → 配置未加载，检查文件位置

### 注意事项

- ❌ 不要把密钥写进仓库（`mcp-configs/` 的占位符需替换）
- ❌ 不要硬编码团队成员的本机路径
- ✅ 团队先统一 `rules/common/`，再各语言目录做差异化

---

## 深入定制

需要更详细的定制教程（如何删减代理、添加自定义技能、修改语言规则等），请参阅：

📖 **[配置定制指南](docs/配置定制指南.md)** — 完整的分步定制教程，含需求问卷、修改示例和项目模板

---

## 版本日志

- **v1.0.0** - 初始版本，支持 Golang、Vue 开发
- **v1.1.0** - 添加 commands 和 skills 模块
- **v1.2.0** - 补齐构建修复代理，新增 TypeScript 规则和 hooks
- **v1.3.0** - 新增文档同步、E2E 测试、JavaScript 规则和基础自测
- **v2.0.0** - 移除 Python，Vue 合并到 TypeScript，新增 JS reviewer
- **v2.1.0** - 新增工作模式切换、工具函数库、3 个新技能和 2 个新命令
- **v2.2.0** - 新增 `/ucc-context` 快捷切换命令
- **v2.3.0** - 新增 MCP 配置、3 代理、6 命令、2 技能、项目模板
- **v3.0.0** - 新增数据库审查、设计/交付文档、Docker/部署技能、质量门禁、CI/CD 管道
- **v3.1.0** - 增量支持前后端 TypeScript 审查，新增 harness/loop/model-route 命令与 hook 运行时控制

---

## 使用风险提示

- `mcp-configs/mcp-servers.json` 含 `YOUR_*_HERE` 占位符：请替换为实际密钥
- `docs/配置定制指南.md` 中含删除命令示例：执行前务必确认目录
