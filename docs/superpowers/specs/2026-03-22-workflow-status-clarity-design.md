# Workflow Status Clarity Design

**Date:** 2026-03-22

## Goal

Reduce false `config-sensitive` pauses in `team.standard` and make `/ucc-flow-status` show only the control-plane data that belongs to the current node.

## Problems

1. `config-sensitive` currently pauses `team.standard` under `balanced`, but its usage is too broad at the agent/protocol layer.
2. Control-plane `delegates` and `verification` entries are stored without node ownership, so `/ucc-flow-status` can show stale plan-stage data while the run is already in `review`.
3. `验证状态: 无` is technically correct but operationally ambiguous because it does not tell the user whether verification has not started yet or whether data is missing.

## Design

### 1. Node-scoped control-plane entries

- Add `node` to delegate records written by `updateDelegateStatus()`.
- Add `node` to verification records written by `updateVerificationStatus()`.
- Keep backward compatibility: existing records without `node` remain readable.

### 2. Current-node status rendering

- `formatRunSummary()` filters delegate and verification sections to the current node when node-tagged records are available.
- If the current node has no verification records, render a clearer empty state:
  - `- 当前节点尚未开始验证`
- For older runs that only contain legacy records without `node`, keep the old fallback behavior.

### 3. Narrowed `config-sensitive` semantics

`config-sensitive` is redefined as a runtime-core signal and should only be used when the change affects one of these areas:

- `.claude/scripts/lib/workflow-runtime.js`
- `.claude/scripts/workflow/runner.js`
- `.claude/workflows/definitions.json`
- `/ucc-flow-status`
- `/ucc-flow-continue`
- `/ucc-flow-abort`

Other `.claude` changes, documentation edits, and ordinary agent/command text changes should not use `config-sensitive` by default.

### 4. Documentation alignment

- Update team/workflow agent docs to constrain when `config-sensitive` may be emitted.
- Update user docs so `balanced` is described as pausing on runtime-core workflow configuration risk, not any generic configuration edit.

## Testing

- Extend `tests/workflow-runtime.test.js` to prove delegate/verification records are tagged with their originating node.
- Extend `tests/workflow-runtime.test.js` to prove status output only shows current-node control-plane data.
- Extend `tests/workflow-command-metadata.test.js` and docs assertions to enforce the narrowed `config-sensitive` wording where needed.

## Compatibility

- No migration step required.
- Existing run files and control snapshots remain readable.
- New writes enrich future runs with node ownership for clearer status output.
