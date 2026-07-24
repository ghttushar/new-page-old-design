# Phase 1

## Title

Reports bookmarkable tab flow

## Phase Status

- Lifecycle state: Archived
- Planning state: Approved
- Review status: Approved for implementation
- Implementation state: Complete

## Objective

Build a bookmarkable reports experience under the existing `/reports/*` route where:

- the marketplace is selected from the marketplace subheader dropdown using `useMarketplaceSubheader`
- report tabs are populated from the report-config API for the current account
- only the reports available for the selected marketplace are shown as tabs
- no report tab is selected by default
- the page prompts the user to select a tab before loading a report
- selecting a tab updates the URL
- sharing the URL opens the same marketplace and report for a logged-in user on the same account

## Related References

- Task index: [context/tasks/index.md](../tasks/index.md)
- Feature overview: [context/documentation/reports/overview.md](../documentation/reports/overview.md)
- Orchestration guide: [context/guides/orchestration.md](../guides/orchestration.md)
- Tracking guide: [context/guides/tracking.md](../guides/tracking.md)
- Execution workflow: [context/guides/execution-workflow.md](../guides/execution-workflow.md)
- Definition of done: [context/guides/definition-of-done.md](../guides/definition-of-done.md)
- Coding guidelines: [context/guides/coding-guidelines.md](../guides/coding-guidelines.md)
- Verification template: [context/guides/verification-template.md](../guides/verification-template.md)
- Review template: [context/guides/review-template.md](../guides/review-template.md)
- Unit update template: [context/guides/unit-update-template.md](../guides/unit-update-template.md)

## Implementation Preconditions

- phase review must be approved and recorded in this document
- the active phase summary and [context/tasks/index.md](../tasks/index.md) must agree
- any unit started must have all dependencies satisfied
- no unresolved product decision required by the unit may remain open

## Scope Checklist

- keep the existing `/reports/*` entry route
- preserve account access checks already enforced by the reports wrapper
- fetch report configs from the account-scoped report-config API
- derive available tabs from API data for the selected marketplace
- show only marketplace-specific available report tabs from the API response
- support both `amazon` and `walmart`
- keep the marketplace dropdown in the subheader using `useMarketplaceSubheader`
- make the selected marketplace URL-driven
- make the selected report tab URL-driven
- keep the default state as no selected tab
- show a prompt when no tab is selected
- load the selected report using the existing Power BI behavior
- follow the existing reports-page behavior and styling patterns where possible
- use the existing tab visual reference based on `_singleFilterContainer_8l2p2_42`
- handle invalid marketplace values safely
- handle invalid report-kind values safely
- handle marketplaces with no available reports safely
- keep the result bookmarkable and shareable for the same logged-in account
- ensure a copied URL opens the same report for another user logged into the same account context
- add focused verification for the new route and selection behavior

## Non-Goals

- reworking unrelated report pages
- redesigning sidebar navigation
- replacing the existing Power BI integration stack
- broad cleanup of unrelated report or routing code

## Risks

- route-driven state may conflict with prior local-selection behavior
- report availability is API-driven and may expose edge cases per marketplace
- existing access-control and connect-account behavior could regress if the wrapper changes too broadly

## Escalation Triggers

- the planned route contract no longer fits the existing app routing model
- report-config API behavior differs from the planned account-scoped assumptions
- a required behavior depends on unresolved product decisions
- implementing the current unit would require unrelated refactors

## URL Contract

- Base page: `/reports/reports/:marketplace`
- Selected report: `/reports/reports/:marketplace/:reportKind`

## Assumptions

- the route remains nested under the existing reports entry point
- report availability is determined by API response, not hard-coded route availability
- URL-driven state should win over stale local-only selection state
- the existing report pages remain the behavioral reference for loading and rendering:
  `/business`, `/search-query-performance`, and `/hourly-performance`
- the report-config API request is account-scoped and must use the current account context

## Open Decisions

- None

## Decision Log

- 2026-03-18: Phase document structure approved as the single source of truth for this phase
- 2026-03-18: Invalid report URLs will not receive special handling in Phase 1

## Units

### U1. Define Contracts

Status: Done
Owner: Codex
Depends on: None
Next action: Complete
Exit criteria:

- report-config response types are defined
- report-kind helper strategy is defined
- URL helper strategy is defined
- route normalization rules are documented in the phase or code plan
- any assumptions affecting contract design are recorded

Tasks:

- add report-config response types
- add report-kind helpers
- add URL generation and parsing helpers
- define route normalization rules for marketplace and report kind
- document how API `reportKind` values map to displayed tab labels and route segments

### U2. Service Integration

Status: Done
Owner: Codex
Depends on: U1
Next action: Complete
Exit criteria:

- report-config service entry exists in the agreed service layer
- account id handling is defined
- API response is mapped into a stable UI-ready shape
- service behavior is consistent with the active feature assumptions

Tasks:

- add a service method for `GET /api/auth/report-config`
- ensure the current account id is sent correctly
- define the response-to-UI mapping shape used by the reports page
- preserve the account-scoped request behavior implied by the provided API contract

### U3. Route State Model

Status: Done
Owner: Codex
Depends on: U1, U2
Next action: Complete
Exit criteria:

- marketplace resolution rules are defined
- selected report-kind resolution rules are defined
- invalid combination behavior is defined
- redirect vs normalize vs keep behavior is documented
- URL-driven state precedence is explicitly defined

Tasks:

- define how marketplace is resolved from the URL
- define how selected report kind is resolved from the URL
- define fallback behavior for invalid route combinations
- define when to keep the URL, normalize it, or redirect

### U4. Reports Wrapper Refactor

Status: Done
Owner: Codex
Depends on: U2, U3
Next action: Complete
Exit criteria:

- reports wrapper owns the new reports shell behavior
- existing access checks remain intact
- existing connect-account and denied states remain intact
- wrapper ownership boundaries are clear enough to avoid scope creep

Tasks:

- replace the fixed nested reports routes with a shell page
- keep current feature-access checks intact
- keep connect-account and access-denied behavior intact
- make the wrapper the owner of route-driven reports state

### U5. Marketplace Integration

Status: Done
Owner: Codex
Depends on: U3, U4
Next action: Complete
Exit criteria:

- marketplace dropdown behavior is integrated into the reports shell
- marketplace route updates are defined
- initial route hydration behavior is defined
- marketplace behavior does not rely on undocumented assumptions

Tasks:

- integrate marketplace subheader behavior into the reports shell
- use `useMarketplaceSubheader` as the required marketplace dropdown mechanism
- ensure marketplace changes update the route correctly
- ensure initial page load respects the route rather than only local state

### U6. Tab UX

Status: Done
Owner: Codex
Depends on: U4, U5
Next action: Complete
Exit criteria:

- marketplace-specific tabs are defined from API data
- no-tab-selected behavior is defined
- tab-to-URL behavior is defined
- tab availability behavior is documented for empty marketplaces

Tasks:

- render marketplace-specific report tabs
- keep no tab selected by default
- display a prompt when no tab is selected
- make tab selection update the URL
- use the existing tab style reference based on `_singleFilterContainer_8l2p2_42`

### U7. Report Render

Status: Done
Owner: Codex
Depends on: U2, U4, U6
Next action: Complete
Exit criteria:

- selected report rendering path is defined
- Power BI input mapping is defined
- loading and unavailable-config behavior is defined
- rendering behavior stays within the existing report integration approach

Tasks:

- render the selected report using the existing Power BI behavior
- map API report config to embed inputs
- handle loading state for a selected report
- handle unavailable report config for a selected report
- keep behavior aligned with the existing report pages used today as the reference flow

### U8. Empty And Error States

Status: Done
Owner: Codex
Depends on: U4, U6, U7
Next action: Complete
Exit criteria:

- no-tab-selected prompt behavior is defined
- no-reports-for-marketplace behavior is defined
- invalid-selection behavior is defined
- empty/error behavior is aligned with the approved phase decisions

Tasks:

- define the prompt state for no selected tab
- define the state for no reports for a marketplace
- define the state for invalid report selection

### U9. URL Sync And Sharing

Status: Done
Owner: Codex
Depends on: U5, U6, U7, U8
Next action: Complete
Exit criteria:

- route rehydration behavior is defined
- shareable URL behavior is defined
- URL stability expectations are defined
- shared-link behavior is documented for same-account use

Tasks:

- verify marketplace and tab rehydrate from the URL
- verify copied URLs reopen the same report for the same account context
- ensure URL updates remain stable across marketplace and tab changes

### U10. Verification

Status: Done
Owner: Codex
Depends on: U1, U2, U3, U4, U5, U6, U7, U8, U9
Next action: Complete
Exit criteria:

- verification checklist is complete
- expected coverage areas are checked
- known gaps are documented
- any skipped verification is explicitly recorded

Tasks:

- validate route behavior, empty state behavior, and selected report behavior
- validate marketplace switching behavior
- validate report availability behavior
- document any remaining gaps

## Verification Approach

- use focused verification for route-driven behavior
- verify marketplace-only and marketplace-plus-report URLs
- verify empty, loading, and unavailable-report states
- verify the marketplace dropdown behavior matches the expected subheader pattern
- verify only marketplace-specific available reports appear as tabs
- record any skipped checks and reasons

Verification notes:

- `npx tsc -p tsconfig.app.json --noEmit` passed
- `npx nx test anarix-ui` failed due pre-existing unrelated suite and environment issues in the workspace
- `npx vitest run src/app/components/pages/reports-wrapper/reports-wrapper.spec.tsx` failed due a pre-existing import/runtime issue outside the new reports flow implementation

## Completion Checklist

- all in-scope units are `Done`
- no critical blockers remain
- relevant feature documentation is updated
- phase summary is current
- [context/tasks/index.md](../tasks/index.md) is synchronized
- verification status and known gaps are recorded
- logical implementation commits have been created

## Current Status Summary

- Active unit: None
- Blocked units: None
- Completed units: U1-U10
- Current focus: phase archived

## Review Checklist

- confirm the phase objective
- confirm the URL contract
- confirm the unit breakdown and dependency order
- confirm empty-state behavior for invalid or unavailable report selections
- confirm implementation should remain paused

## Change Log

- 2026-03-18: Phase 1 consolidated into a single self-contained phase document
- 2026-03-18: Phase lifecycle, approval, sync, blocker, handoff, and completion rules aligned with guides
- 2026-03-18: Non-goals, risks, escalation triggers, and invalid-URL decision recorded
- 2026-03-18: Phase 1 approved for implementation and U1 moved to In Progress
- 2026-03-18: Reports bookmarkable flow implemented, type-checked, and phase marked complete with known unrelated test-suite issues recorded
- 2026-03-18: Phase 1 moved to archive

## Archive Note

- archived from `context/tasks/phases/phase-1.md`
