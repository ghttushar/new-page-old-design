# Tracking Guide

## Purpose

This guide defines the status model and update rules used across all phases.

## Phase Document Requirement

Each phase should be tracked in a single document under `context/tasks/phases/`.

That phase document is expected to contain:

- phase metadata
- implementation preconditions
- scope and assumptions
- non-goals
- risks
- escalation triggers
- unit breakdown
- unit status fields
- dependency order
- next actions
- verification approach
- completion checklist
- current status summary
- phase-level change log
- review status
- phase lifecycle state

## Status Definitions

- `Pending`
  The unit exists but has not started.
- `In Progress`
  The unit is actively being worked on.
- `Blocked`
  The unit cannot proceed because of a dependency or unresolved issue.
- `On Hold`
  The unit is intentionally paused.
- `Done`
  The unit is complete for the agreed scope.

## Tracking Rules

1. Each phase has its own single phase document.
2. [context/tasks/index.md](../tasks/index.md) is the fastest place to see current status.
3. The active phase document is the detailed live source of truth.
4. Only one unit should normally be `In Progress`.
5. If scope changes materially, update the phase document before continuing.
6. If workflow changes materially, update [context/guides/orchestration.md](./orchestration.md).
7. If the active phase summary changes, update [context/tasks/index.md](../tasks/index.md) in the same logical change.
8. When a phase is archived, move the phase document to `context/archive/` and update the task index in the same logical change.

## Index Sync Requirements

The following fields must remain aligned between the active phase document and [context/tasks/index.md](../tasks/index.md):

- active phase
- active phase title
- lifecycle state
- planning state
- review status
- implementation state
- in-progress unit or units
- blocked units
- completed units
- current focus

## Archive Tracking

When archiving a phase:

- set the phase lifecycle to `Archived`
- preserve the phase change log
- move the file to `context/archive/`
- update `context/tasks/index.md` so archived phases are no longer treated as active

## Review Recording Rules

Phase review outcomes must be recorded in the active phase document by updating:

- review status
- relevant summary fields
- phase change log

Approval should never exist only in chat context.

## Documentation Ownership

If implementation changes agreed feature behavior, the relevant feature documentation and phase document must be updated as part of the same logical change.

## Reopen Rules

Completed work is not immutable.

If a completed unit needs more work:

- move it out of `Done`
- record why it was reopened
- update next action and blocker state if applicable
- add a dated phase change-log entry

If reopening a unit changes the phase summary, update [context/tasks/index.md](../tasks/index.md) in the same logical change.

## Change Log Format

Use short dated entries such as:

- `2026-03-18: Phase 1 planning docs created`
- `2026-03-18: Phase 1 marked active`
- `2026-03-18: U3 moved to In Progress`

## Current Change Log

- 2026-03-18: Initial context structure created
- 2026-03-18: Context reorganized into feature docs, guides, and tasks

## Handoff Tracking

When a unit is paused or handed off, the phase document should capture:

- latest status
- next action
- blocker if any
- important assumptions

This prevents critical execution state from living only in conversation history.
