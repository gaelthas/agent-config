# Workflow Status Clarity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce false `config-sensitive` pauses and make `/ucc-flow-status` report only the delegates and verification items that belong to the current workflow node.

**Architecture:** Extend workflow control-plane records with node ownership, filter status rendering by current node with legacy fallback, and tighten `config-sensitive` guidance in orchestrator and user docs. Keep runtime file formats backward compatible so existing runs do not break.

**Tech Stack:** Node.js, CommonJS, JSON workflow definitions, markdown docs, custom test suite

---

### Task 1: Add failing runtime tests

**Files:**
- Modify: `tests/workflow-runtime.test.js`
- Test: `tests/workflow-runtime.test.js`

- [ ] **Step 1: Write the failing test**

Add assertions that:
- delegate records persist the originating node
- verification records persist the originating node
- status output for a later node no longer shows earlier-node delegates
- empty verification state for the current node is explicit

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/workflow-runtime.test.js`
Expected: FAIL because runtime does not yet tag records by node or filter output by current node.

- [ ] **Step 3: Write minimal implementation**

Update workflow runtime helpers to tag control-plane records with `node` and filter formatted status output by the current node while preserving legacy fallback.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/workflow-runtime.test.js`
Expected: PASS

### Task 2: Tighten config-sensitive guidance

**Files:**
- Modify: `agents/team-orchestrator.md`
- Modify: `agents/workflow-orchestrator.md`
- Modify: `README.md`
- Modify: `docs/使用说明.md`
- Modify: `workflows/README.md`
- Test: `tests/workflow-command-metadata.test.js`

- [ ] **Step 1: Write the failing test**

Add assertions for the narrowed `config-sensitive` semantics in metadata/docs checks where appropriate.

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/workflow-command-metadata.test.js`
Expected: FAIL because docs still describe broad configuration-sensitive pausing.

- [ ] **Step 3: Write minimal implementation**

Update docs and agent protocols so `config-sensitive` is reserved for workflow runtime core changes only.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/workflow-command-metadata.test.js`
Expected: PASS

### Task 3: Full verification

**Files:**
- Modify: `scripts/lib/workflow-runtime.js`
- Modify: `tests/workflow-runtime.test.js`
- Modify: `tests/workflow-command-metadata.test.js`
- Modify: `agents/team-orchestrator.md`
- Modify: `agents/workflow-orchestrator.md`
- Modify: `README.md`
- Modify: `docs/使用说明.md`
- Modify: `workflows/README.md`

- [ ] **Step 1: Run targeted runtime tests**

Run: `node tests/workflow-runtime.test.js`
Expected: PASS

- [ ] **Step 2: Run targeted metadata/doc tests**

Run: `node tests/workflow-command-metadata.test.js`
Expected: PASS

- [ ] **Step 3: Run repo validation**

Run: `node scripts/validate-config.js`
Expected: `配置校验通过`

- [ ] **Step 4: Run full regression**

Run: `node tests/run-all.js`
Expected: `全部自测通过`
