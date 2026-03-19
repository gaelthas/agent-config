---
description: Node/TypeScript 后端代码审查，强调类型安全、输入验证与错误处理。调用 typescript-backend-reviewer 代理。
context: fork
agent: typescript-backend-reviewer
---

# TypeScript 后端代码审查

此命令调用 **typescript-backend-reviewer** 代理进行 Node.js TypeScript 后端专项审查。

## 命令功能

1. **识别变更**：通过 `git diff` 查找修改的 `.ts`、`.tsx` 文件
2. **类型检查**：`tsc --noEmit` 或项目 `typecheck`
3. **代码检查**：执行 `eslint`、`prettier --check`
4. **安全审查**：检查输入验证、SQL 注入、配置安全
5. **生成报告**：按严重程度分类问题

## 何时使用

以下情况使用 `/ucc-typescript-backend-review`：
- 编写或修改 Node/TypeScript 后端代码后
- 后端 PR 审查
- 类型错误排查

## 自动检查

```bash
# TypeScript 类型检查
npx tsc --noEmit

# ESLint 检查
npx eslint . --max-warnings 0

# 格式检查
npx prettier --check .
```

## 与其他命令集成

- 用 `/ucc-tdd` 先写测试再实现
- 复杂问题用 `/ucc-plan`
- 非 TS 专项问题用 `/ucc-code-review`

## 相关

- 代理：`agents/typescript-backend-reviewer.md`
- 规则：`rules/typescript/`
- 技能：`skills/node-backend-patterns/`
