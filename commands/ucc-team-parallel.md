---
description: 并行团队交付流程入口。显式启动 team.parallel 工作流，在保留质量门禁的前提下并行推进可拆分的实施任务。
context: fork
agent: team-orchestrator
workflowCapable: true
workflowProfile: team.parallel
workflowNode: clarify
executionMode: auto
pausePolicy: balanced
triggerVisibility: always
---

# UCC Team Parallel 命令

这是面向低冲突、多模块任务的受控并行入口。它会先评估并行准入条件，再在受限范围内并行推进实施，并在进入审查前统一收口集成。

## workflow 要求

- 启动时必须调用 workflow runtime 创建或加入 `team.parallel` run
- 默认自动推进 `clarify -> plan -> parallel-implement -> integrate -> review -> verify -> docs -> summary`
- 只有明确满足低冲突、文件所有权清晰、可集中集成时，才继续并行实施
- 命中 `pausePolicy: balanced`、发生冲突、危险改动或切片失败时暂停或回退到更保守路径；默认推荐回退到 `team.standard.implement`
- 暂停后使用 `/ucc-flow-continue [runId]`

## 固定流程

1. `当前阶段：需求澄清`
2. `当前阶段：实现计划`
3. `当前阶段：并行实施`
4. `当前阶段：集成收口`
5. `当前阶段：审查`
6. `当前阶段：验证`
7. `当前阶段：文档同步`
8. `当前阶段：交付总结`

## 完成条件

- 已明确并行准入条件、切片边界与回退策略
- 已完成并行实施并统一集成收口
- 已完成审查、验证和必要文档同步
- 最终输出必须包含：
  - `流程完成：UCC Team Workflow`
  - `配置标识：UCC`
