---
description: Vue/TypeScript 前端代码审查（优先 vue-tsc），覆盖类型安全、组件正确性与异步模式。调用 typescript-reviewer 代理。
context: fork
agent: typescript-reviewer
---

# TypeScript 前端代码审查

此命令调用 **typescript-reviewer** 代理进行前端 TypeScript/Vue 专项审查。

## 命令功能

1. **识别变更**：通过 `git diff` 查找修改的 `.ts`、`.tsx`、`.vue` 文件
2. **类型检查**：优先 `vue-tsc --noEmit`，否则 `tsc --noEmit`
3. **代码检查**：执行 `eslint`、`prettier --check`
4. **安全审查**：检查 XSS、v-html 风险、用户输入处理
5. **生成报告**：按严重程度分类问题

## 何时使用

以下情况使用 `/ucc-typescript-review`：
- 编写或修改 Vue 3 + TypeScript 代码后
- 前端 PR 审查
- 类型错误排查

## 自动检查

```bash
# Vue 项目优先
npx vue-tsc --noEmit

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

- 代理：`agents/typescript-reviewer.md`
- 规则：`rules/typescript/`
- 技能：`skills/frontend-patterns/`
