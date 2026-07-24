# Phase 2

## Title

Restore existing reports flow and add a new reports tab under Reports

## Phase Status

- Lifecycle state: Approved
- Planning state: Approved
- Review status: Approved for implementation
- Implementation state: U8 in progress

## Objective

Correct the earlier implementation so that:

- nothing existing in the current reports experience is broken or replaced
- the existing reports pages and routes continue to work as before
- a new reports tab is added under the existing Reports sidebar section
- that new tab provides the new marketplace-driven, API-backed report experience you originally asked for
- the new tab is bookmarkable and shareable for users logged into the same account context

## Related References

- Task index: [context/tasks/index.md](../index.md)
- Feature overview: [context/documentation/reports/overview.md](../../documentation/reports/overview.md)
- Orchestration guide: [context/guides/orchestration.md](../../guides/orchestration.md)
- Tracking guide: [context/guides/tracking.md](../../guides/tracking.md)
- Execution workflow: [context/guides/execution-workflow.md](../../guides/execution-workflow.md)
- Definition of done: [context/guides/definition-of-done.md](../../guides/definition-of-done.md)
- Coding guidelines: [context/guides/coding-guidelines.md](../../guides/coding-guidelines.md)
- Verification template: [context/guides/verification-template.md](../../guides/verification-template.md)
- Review template: [context/guides/review-template.md](../../guides/review-template.md)
- Unit update template: [context/guides/unit-update-template.md](../../guides/unit-update-template.md)

## Implementation Preconditions

- Phase 2 review must be approved and recorded in this document
- the active phase summary and [context/tasks/index.md](../index.md) must agree
- any unit started must have all dependencies satisfied
- existing reports behavior to preserve must be identified before code changes begin

## Scope Checklist

- restore the original existing reports behavior if it was changed incorrectly
- preserve current report routes and current report pages unless explicitly extending them
- add a new tab under the existing Reports sidebar section instead of replacing the old experience
- keep the old report entries working as before
- implement the new marketplace dropdown using `useMarketplaceSubheader`
- show only marketplace-specific available reports from the API in the new tab
- keep no selected report tab by default in the new tab
- show a prompt before a new report tab is selected
- use the existing tab visual reference based on `_singleFilterContainer_8l2p2_42`
- follow the existing report page styling/behavior patterns
- keep the new experience bookmarkable and shareable
- keep account access checks intact
- avoid unrelated refactors while restoring the correct behavior

## Non-Goals

- redesigning the whole reports area
- replacing unrelated sidebar behavior
- changing the old reports behavior unless required to restore it
- broad cleanup outside the reports feature

## Risks

- restoring the old flow may conflict with the new implementation work already done
- sidebar navigation wiring may have hidden assumptions
- route overlap between old and new reports experiences may cause regressions if not isolated

## Escalation Triggers

- the sidebar structure does not support adding a nested reports tab cleanly
- preserving old routes and adding the new experience creates conflicting route ownership
- existing report navigation behavior depends on undocumented sidebar assumptions
- restoring the original flow would require touching unrelated navigation systems

## Behavior Contract

- existing report pages continue to behave as before
- the new experience is exposed as a separate new tab under Reports
- the new tab owns the marketplace-driven report-config flow
- users can copy a URL from the new tab and reopen the same report under the same account context
- existing submenu items continue to resolve to their current routes:
  `/reports/business`, `/reports/search-query-performance`, and `/reports/hourly-performance`
- the new submenu item `New Reports` should resolve to `/reports/new-reports`
- the new marketplace-driven experience should live under:
  `/reports/new-reports/:marketplace/:reportKind?`
- `/reports/*` route ownership must distinguish the legacy three report pages from the new additive flow instead of sending all traffic into the new experience

## Assumptions

- the user expectation is to preserve the old reports experience fully
- the new experience should be additive, not destructive
- the sidebar already has a Reports section where a new tab can be added

## Open Decisions

- None

## Decision Log

- 2026-03-18: Phase 2 created to correct a requirement mismatch from the previous implementation
- 2026-03-18: Existing reports behavior must be preserved and the new experience must be additive
- 2026-03-18: The new Reports sub-tab label is `New Reports`
- 2026-03-18: Phase 2 approved for implementation

## Units

### U1. Audit The Existing Reports Navigation

Status: Done
Owner: Codex
Depends on: None
Next action: Complete
Exit criteria:

- existing sidebar Reports structure is documented
- existing report entries and routes are documented
- the exact mismatch between requested and current behavior is documented

Tasks:

- inspect how the Reports section is rendered in the sidebar
- identify how current report tabs or entries are defined
- document what should remain untouched

Audit notes:

- the Reports sidebar menu is defined in `src/constants/side-bar/sidebar.constants.tsx`
- the Reports submenu currently has three items:
  `Business Performance`, `Search Query Performance`, and `Hourly Performance`
- submenu navigation is generated as `/${selectedMenuItem}/${subMenuItem}`
- the incorrect replacement behavior currently lives in `src/app/components/pages/reports-wrapper/reports-wrapper.tsx`

### U2. Define Additive Navigation Contract

Status: Done
Owner: Codex
Depends on: U1
Next action: Define how `New Reports` is added as a fourth Reports submenu item without replacing the existing three items
Exit criteria:

- the new tab placement under Reports is defined
- route ownership between old and new experiences is defined
- no-breaking-change strategy is documented

Tasks:

- define the new tab name and placement
- define the route for the new experience
- define how old and new flows coexist

Contract notes:

- placement: add `New Reports` as the fourth submenu item under the existing
  `Reports` sidebar group, after `Hourly Performance`
- legacy ownership: keep the existing three submenu entries mapped to their
  current leaf routes and pages
- additive ownership: mount the new API-driven reports shell only beneath
  `/reports/new-reports/*`
- wrapper responsibility: `ReportsWrapper` should route legacy report paths to
  the existing report pages and reserve only the additive branch for the new
  marketplace/report-kind experience
- access strategy: continue to gate both legacy and new routes behind the
  existing Reports feature access check
- no-breaking-change strategy: avoid changing the existing submenu keys or
  legacy route segments; isolate new behavior behind the new submenu key and
  route branch

### U3. Restore Existing Behavior If Needed

Status: Done
Owner: Codex
Depends on: U1, U2
Next action: Complete
Exit criteria:

- existing report routes/pages are restored where required
- old behavior is preserved
- no unnecessary rollback is included

Tasks:

- identify which current changes broke the expected additive behavior
- plan the minimum restoration required
- isolate restoration from the new additive work

Implementation notes:

- restored `ReportsWrapper` ownership for the legacy report pages:
  `/reports/business`, `/reports/search-query-performance`, and
  `/reports/hourly-performance`
- removed the replacement behavior where the wrapper routed all Reports traffic
  into the new marketplace-driven page
- kept the existing Reports feature access and connect-account checks intact

### U4. Add Sidebar Tab Entry

Status: Done
Owner: Codex
Depends on: U2, U3
Next action: Complete
Exit criteria:

- new tab appears under Reports in the sidebar
- old entries remain visible and functional
- navigation to the new experience is isolated and correct

Tasks:

- add the new sidebar entry
- preserve existing Reports navigation items
- verify route target for the new entry

Implementation notes:

- added `New Reports` as the fourth submenu item under the existing
  `Reports` group
- preserved the original three submenu items and their route keys unchanged

### U5. Re-scope The New Reports Experience

Status: Done
Owner: Codex
Depends on: U2, U3
Next action: Complete
Exit criteria:

- new experience is mounted on the correct additive route
- old experience no longer gets replaced
- route boundaries are documented clearly

Tasks:

- move or remap the new reports shell to the additive path
- preserve bookmarkable behavior for the new experience
- ensure route ownership is unambiguous

Implementation notes:

- remapped the new reports shell from `/reports/reports/:marketplace/:reportKind?`
  to `/reports/new-reports/:marketplace/:reportKind?`
- updated the URL helpers and feature documentation to match the additive path
- added a dedicated `/reports/new-reports` entry route that redirects into the
  marketplace-specific branch through the existing page logic

### U6. Marketplace And Tab Experience

Status: Done
Owner: Codex
Depends on: U5
Next action: Complete
Exit criteria:

- `useMarketplaceSubheader` is used
- marketplace-specific tabs come from the API
- no selected tab is the default
- selection prompt and tab styling match the agreed behavior

Tasks:

- bind marketplace dropdown to the new experience
- show only available report kinds for the selected marketplace
- keep no selected tab by default
- apply the agreed tab design reference

Implementation notes:

- retained the existing `ReportsHomePage` implementation on the new additive
  route
- confirmed it still uses `useMarketplaceSubheader`, derives tabs from the
  report-config API, and shows the no-selection prompt when no report kind is
  present

### U7. Report Loading And URL Sharing

Status: Done
Owner: Codex
Depends on: U5, U6
Next action: Complete
Exit criteria:

- selected report loads correctly in the new experience
- URLs are bookmarkable and shareable
- same-account reopen behavior is preserved

Tasks:

- bind selected tab to report rendering
- keep URL state in sync
- verify reopen behavior under the same account context

Implementation notes:

- preserved route-driven report selection through `:marketplace/:reportKind?`
- kept the existing report-config lookup and embed-token loading behavior on
  the additive route
- updated the legacy report pages so account switching keeps users on the same
  legacy report route instead of sending them into the new route branch

### U8. Verification And Closeout

Status: In Progress
Owner: Codex
Depends on: U1, U2, U3, U4, U5, U6, U7
Next action: Finish focused verification for both legacy and additive flows and document any remaining manual checks
Exit criteria:

- restoration behavior is verified
- old reports behavior is verified
- new sidebar tab behavior is verified
- known gaps are documented

Tasks:

- verify old routes still work
- verify new tab appears in sidebar
- verify new experience works without replacing the old one
- document any remaining issues

## Verification Approach

- verify the sidebar structure first
- verify preservation of the old reports flow
- verify additive navigation into the new experience
- verify route/share behavior for the new experience
- record any skipped checks and reasons

## Completion Checklist

- all in-scope units are `Done`
- no critical blockers remain
- existing reports behavior is preserved
- new tab under Reports exists and works
- relevant documentation is updated
- phase summary is current
- [context/tasks/index.md](../index.md) is synchronized
- verification status and known gaps are recorded
- logical implementation commits have been created

## Current Status Summary

- Active unit: U8. Verification And Closeout
- Blocked units: None
- Completed units: U1, U2, U3, U4, U5, U6, U7
- Current focus: verify the restored legacy routes and additive `New Reports` route behavior end to end

## Review Checklist

- confirm the additive-not-replacement requirement
- confirm the need to preserve the old reports behavior
- confirm the new sidebar-tab requirement
- confirm the route coexistence strategy
- confirm implementation should remain paused until this phase is approved

## Change Log

- 2026-03-18: Phase 2 created to correct the implementation direction and restore additive behavior
- 2026-03-18: `New Reports` selected as the new sidebar tab label
- 2026-03-18: Phase 2 approved for implementation and U1 moved to In Progress
- 2026-03-18: U1 audit completed and U2 moved to In Progress
- 2026-03-18: U2 additive navigation contract recorded with legacy route preservation and `/reports/new-reports/:marketplace/:reportKind?` ownership
- 2026-03-18: U2 marked Done and U3 moved to In Progress after confirming the legacy reports pages still exist and only route ownership needs restoration
- 2026-03-18: Restored legacy report route ownership, added the `New Reports` sidebar item, and remapped the new API-driven experience onto `/reports/new-reports/:marketplace/:reportKind?`
- 2026-03-18: Added focused reports URL tests and verified the implementation with `npx vitest run src/utils/reports.utils.spec.ts` and `npx tsc -p tsconfig.json --noEmit`

## Archive Note

- archive this phase to `context/archive/` once it is complete and no longer active
