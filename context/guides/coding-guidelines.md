# Coding Guidelines

## Purpose

These rules apply once implementation is approved.

## Architecture Rules

- Preserve existing feature-access checks.
- Reuse existing app patterns for services, routing, subheaders, and report rendering.
- Keep the implementation API-driven.
- Prefer focused changes over broad refactors.

## Routing Rules

- URLs must be bookmarkable and shareable.
- Marketplace and selected report must be derivable from the route.
- The no-tab-selected state must be represented clearly.
- Invalid route combinations must be handled predictably.

## Data Rules

- Use typed interfaces for new report-config data.
- Avoid `any` in new report-related code.
- Keep mapping logic explicit and small.
- Treat API report-kind values as the source of truth for available tabs.
- Do not manually pass account-scoped request headers like `AccountId` from feature services when the shared axios/interceptor layer already applies them centrally.

## UI Rules

- Reuse the marketplace dropdown pattern already used in the app.
- Keep tab styling aligned with the current application language.
- Default to no selected tab.
- Show a clear prompt when no report tab is selected.
- Reuse the existing report rendering behavior where possible.

## Change Rules

- Keep edits scoped to the reports feature and directly related utilities.
- Avoid unrelated cleanup during implementation.
- Keep task and guide docs updated if the plan changes materially.
- If new work is discovered outside approved phase scope, do not implement it silently.
- Record out-of-scope work as a follow-up item or a new phase.
- Do not invent product behavior when the phase document leaves it unresolved.

## Git Guidelines

- Start each new feature on a new branch.
- The exact branch cut point is contextual and may depend on the cleanest or safest base at the time.
- Prefer branch names that describe the feature or phase being worked on.
- Commit whenever a logical unit is complete.
- Commit whenever a change is sizable enough that it would be costly to lose or untangle.
- Prefer small, coherent commits over large mixed commits.
- Avoid bundling unrelated changes into the same commit.
- If a task spans multiple logical units, use multiple commits rather than one final catch-all commit.

## Verification Rules

- Verify marketplace-only URLs
- Verify marketplace plus report URLs
- Verify invalid combinations
- Verify the no-selection prompt
- Verify valid report loading behavior

## Verification Policy

- Add tests when the change introduces or alters logic that can be reasonably covered.
- Use focused local verification when automated tests are not the right tool for the unit.
- If verification is skipped or blocked, record the gap explicitly in the phase document.
- Do not treat verification as optional just because implementation appears straightforward.

## Tooling Protocol

- Do not install dependencies unless the work requires them.
- Do not add or update dependencies silently; record that choice if it affects the phase.
- Do not run broad cleanup unrelated to the active unit.
- Do not fix unrelated warnings or errors as part of the same unit unless explicitly approved or inseparable.
