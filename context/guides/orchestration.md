# Orchestration Guide

## Purpose

This guide defines how work moves across phases and within the currently selected phase.

## Phase Document Requirement

Each phase must be a single self-contained document under `context/tasks/phases/`.

That document should contain everything needed to orchestrate work inside the phase, including:

- phase title
- phase status
- phase lifecycle state
- planning state
- review status
- implementation state
- objective
- related references
- implementation preconditions
- scope checklist
- non-goals
- risks
- escalation triggers
- URL or behavior contract when relevant
- assumptions
- open decisions
- decision log
- unit list
- status, owner, dependencies, and next action for each unit
- verification approach
- completion checklist
- current status summary
- review checklist
- change log

## Phase Lifecycle

- `Draft`
  The phase exists but is still being shaped.
- `Active`
  The phase is the current planning or execution focus.
- `Approved`
  The phase has cleared review and implementation may begin.
- `In Progress`
  At least one unit in the phase is actively being executed.
- `Blocked`
  The next required unit cannot proceed because of a critical blocker.
- `Done`
  All scoped units are complete and exit criteria are satisfied.
- `Archived`
  The phase is complete and no longer active.

## Archive Rule

When a phase is finished and no longer the active working phase:

- move the phase document from `context/tasks/phases/` to `context/archive/`
- keep the archived document intact as the historical record
- update [context/tasks/index.md](../tasks/index.md) so the active phase list remains current
- use the `Archived` lifecycle state before or when moving the phase

## Phase Model

- Work is organized into phases.
- Only one phase should normally be active at a time.
- Future phases may be drafted before they become active.

## Phase Summary Requirement

Each active phase document must expose a summary that includes:

- lifecycle state
- planning state
- review status
- implementation state
- active unit
- blocked units
- completed units
- current focus

This summary must be mirrored in [context/tasks/index.md](../tasks/index.md).

## Approval Gate

Implementation may begin only when approval is recorded in the active phase document.

Approval is considered recorded only when:

- the phase review status is updated to approved
- the lifecycle state is moved to `Approved`
- the phase change log includes a dated approval entry

After approval, [context/tasks/index.md](../tasks/index.md) must also be updated in the same logical change.

## Phase Selection Rules

1. Check [context/tasks/index.md](../tasks/index.md)
2. Find the phase marked active
3. Open the active phase document
4. Work only from that phase unless explicitly asked to prepare another phase

## In-Phase Execution Rules

- Work should normally proceed in the order defined by the active phase document.
- Only one unit should normally be `In Progress`.
- A later unit may begin early only if:
  - dependencies are complete, or
  - the work is preparatory and low-risk.

## Parallel Work Exception

More than one unit may be `In Progress` only when:

- the units do not block each other
- the write scopes are clearly separable
- the phase document explicitly lists multiple active units
- [context/tasks/index.md](../tasks/index.md) is updated to reflect parallel work

If those conditions are not met, keep a single active unit.

## Scope Change Rules

If scope changes during the phase:

- update the same phase document if the work still serves the same objective and remains reviewable
- create a new phase if the added work changes the objective materially, becomes independently shippable, or significantly expands scope

When a new phase is created:

- keep the current phase limited to already accepted scope
- add the follow-up phase separately
- update [context/tasks/index.md](../tasks/index.md) only if the active phase actually changes

## Handoff Rules

When work is paused or transferred, update the active phase document with:

- current unit status
- next action
- blocker note if blocked
- assumptions changed during work

Important handoffs should also be recorded in the phase change log.

## Git Workflow In Orchestration

Git behavior should follow phase and unit boundaries:

- start a new branch when beginning a new feature
- the branch cut point is contextual and should be chosen from the safest reasonable base
- when a unit or logical sub-unit is completed, create a coherent commit
- when a change is sizable or costly to reconstruct, create a checkpoint commit even if the full phase is not done
- avoid mixing unrelated unit work in the same commit unless the work is inseparable

When execution begins on an approved phase, branch intent and commit cadence should follow the active phase document and the coding guidelines.

## Blocked Work

When a unit is blocked:

1. Mark it `Blocked` in the active phase document
2. Add a short blocker note
3. Update the change log in [context/guides/tracking.md](./tracking.md) if sequencing or scope changed
4. Move to the next safe unit only if it does not create rework risk

## Blocker Resolution

A blocked unit is unblocked when:

- the dependency is completed
- a review decision resolves the uncertainty
- the phase document is updated with a newly approved path forward

When a blocker is resolved:

- update the unit status
- clear or revise the blocker note
- add a dated phase change-log entry if sequencing or scope changed

## Review Gate

- Planning docs can be edited during review.
- Implementation must not begin until the active phase is explicitly approved.

## Phase Completion

A phase may move to `Done` only when:

- all in-scope units are `Done`, or explicitly removed with approval
- no critical blockers remain
- the active unit field is empty or `None`
- [context/tasks/index.md](../tasks/index.md) is updated
- the phase change log includes a dated completion entry

After completion, archive the phase when it is no longer the active working phase.

## Reopen Rule

A completed unit or phase may be reopened when:

- verification fails
- a blocker was missed
- a review decision changes expected behavior

When reopening work:

- change the affected unit from `Done` to `In Progress`, `Blocked`, or `On Hold`
- update the next action
- record the reason in the phase change log
- update [context/tasks/index.md](../tasks/index.md) if the phase summary changes
