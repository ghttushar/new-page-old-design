# Definition Of Done

## Purpose

This guide defines the minimum bar for considering a unit or feature complete.

## Unit Done Criteria

A unit may be marked `Done` only when all of the following are true:

- the unit exit criteria in the active phase document are satisfied
- implementation is complete for the approved scope
- required verification has been run, or the missing verification is explicitly documented
- any relevant feature or phase documentation has been updated
- the active phase document has been updated
- [context/tasks/index.md](../tasks/index.md) has been updated if the phase summary changed
- a coherent commit has been created, unless the work is explicitly paused before commit

## Feature Done Criteria

A feature or phase may be considered done when:

- all in-scope units are done
- no unresolved critical blockers remain
- no unresolved required product decisions remain for shipped behavior
- verification status is recorded
- known gaps, if any, are documented

Once a phase is done and no longer active, it should be archived under `context/archive/`.

## Not Done

The following are not sufficient on their own:

- code compiles
- the UI looks correct in one path
- the main file was changed
- the task feels complete
- implementation was discussed but not recorded in docs/status
