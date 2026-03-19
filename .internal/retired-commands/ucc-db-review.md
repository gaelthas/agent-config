---
description: 审查数据库 Schema、SQL 查询和迁移脚本。支持 MySQL 和 SQLite，覆盖性能、安全和规范性检查。
context: fork
agent: database-reviewer
---

# DB Review 命令

此命令调用 **database-reviewer** 代理，对数据库相关代码进行全面审查。

## 命令功能

1. **Schema 审查** — 检查表结构、索引、约束设计
2. **查询优化** — 分析 SQL 性能，识别慢查询
3. **迁移审查** — 验证迁移脚本安全性和回滚方案
4. **安全检查** — 检测 SQL 注入、敏感数据保护

## 何时使用

以下情况使用 `/ucc-db-review`：
- 新建或修改数据库表结构
- 编写复杂 SQL 查询
- 提交数据库迁移脚本
- 性能优化阶段
- 涉及敏感数据的数据库操作

## 支持的数据库

| 数据库 | 审查重点 |
|--------|----------|
| **MySQL** | 索引策略、字符集、分表建议、事务优化 |
| **SQLite** | WAL 模式、并发限制、STRICT 表、嵌入场景 |

## 使用示例

```
用户: /ucc-db-review 请检查 db/migrations/ 目录下的最新迁移脚本

代理 (database-reviewer):
# 数据库审查报告

## 审查范围
- 文件：db/migrations/20250301_add_orders_table.sql
- 数据库类型：MySQL

## 发现

### 🔴 严重
1. `orders` 表缺少 `customer_id` 上的索引 — 建议添加：
   CREATE INDEX idx_orders_customer_id ON orders(customer_id);

### 🟡 警告
1. `total_amount` 使用 FLOAT 类型 — 金额建议使用 DECIMAL(10,2) 避免精度问题
2. 缺少回滚脚本 — 建议添加 DROP TABLE IF EXISTS orders;

### 🟢 建议
1. 考虑添加 `created_at` 和 `updated_at` 时间戳字段
```

## 与其他命令集成

审查后：
- 使用 `/ucc-design-doc` 更新数据模型文档
- 使用 `/ucc-code-review` 审查关联的业务代码
- 使用 `/ucc-quality-gate` 进行提交前检查

## 相关代理

此命令调用 `database-reviewer` 代理，位于：
`agents/database-reviewer.md`
