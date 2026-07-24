# Execution Workflow

## Purpose

This guide defines the exact operating loop to follow when implementing work from an approved phase.

## Required Execution Loop

1. Read [agents.md](../../agents.md)
2. Check [context/tasks/index.md](../tasks/index.md)
3. Open the active phase document under `context/tasks/phases/`
4. Confirm the phase is approved for implementation
5. Identify the next eligible unit based on dependencies and status
6. Confirm branch strategy before making changes
7. Move the unit to `In Progress`
8. Implement only the approved scope for that unit
9. Run the required verification for that unit
10. Update the active phase document
11. Update [context/tasks/index.md](../tasks/index.md) if the phase summary changed
12. Create a coherent commit for the completed logical unit or checkpoint
13. Mark the unit `Done` only when its exit criteria and definition of done are satisfied

## Unit Start Rules

Before starting a unit:

- confirm dependencies are satisfied
- confirm the phase remains active
- confirm no unresolved blocker prevents the unit
- confirm any open product decision needed by the unit is already resolved

## Unit Finish Rules

Before marking a unit `Done`:

- verify the unit exit criteria are satisfied
- verify the required checks were run or document why they were not
- update phase status fields
- update the change log if the change materially advanced the phase
- create the expected commit unless the work is intentionally paused

## Scope Discipline

- implement only the current approved unit
- do not silently absorb adjacent improvements into the same unit
- if new work is discovered, record it in the phase doc or propose a new phase instead of implementing it by default

## Ambiguity Rule

If product behavior is ambiguous:

- first check the active phase document
- then check feature documentation
- if still unresolved, record it as an open decision instead of inventing behavior

## Verification Discipline

- verification is part of execution, not a separate optional cleanup
- if verification cannot be completed, record the gap in the phase document
- do not present a unit as fully done if required verification is knowingly missing
