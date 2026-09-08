---
target: Signals → Alerts (Normal + Speed mode)
total_score: 22
max_score: 40
na_heuristics: 
p0_count: 2
p1_count: 2
target_identity: "file:C:\\Users\\ghttu\\Desktop\\new-page-old-design\\src\\app\\components\\signals\\alerts"
timestamp: 2026-09-08T14-42-51Z
slug: src-app-components-signals-alerts
closed: true
---
Method: dual-agent (A: design-review sub-agent · B: detector/browser-evidence sub-agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Progress bars and position counters are good, but committing an action gets only a 3.2s toast / 400ms flash — nothing persists after |
| 2 | Match to Real World | 4 | Copy is genuine ops vocabulary (PIM feed, MAP violation, buy-box, search-suppressed) |
| 3 | User Control and Freedom | 1 | Normal-mode "Dismiss" button has no onClick — confirmed live, does nothing |
| 4 | Consistency and Standards | 2 | Shared icon set exists but isn't fully adopted; raw text glyphs (⋯ × ← → ⚡) remain in several files |
| 5 | Error Prevention | 1 | One click or one swipe commits marketplace-facing pricing/catalog changes worth tens of thousands of dollars, no confirmation step |
| 6 | Recognition Rather Than Recall | 4 | Expected $ and confidence sit on every option, no cross-screen memory burden |
| 7 | Flexibility and Efficiency | 2 | Speed Mode silently ignores the list panel's active search/filter — reproduced live |
| 8 | Aesthetic and Minimalist Design | 3 | Appropriately dense for an ops tool; Speed Mode's decorative gradient is the one overreach |
| 9 | Error Recovery | 1 | The dead Dismiss button fails silently — the worst kind, since the user believes it worked |
| 10 | Help and Documentation | 1 | No onboarding for the drag-to-swipe gesture, no help affordance anywhere |
| **Total** | | **22/40** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment**: Genuinely authored for marketplace ops, not generic. The specificity lives in the copy/data layer — "Revert bullet points to the 27 Oct version," "Ask the client for a PIM approval gate" — which is real domain reasoning, not templated notification copy. The visual chrome is intentionally plain per Operate-mode conventions; that's correct restraint, not a flaw.

**Deterministic scan**: `impeccable detect` on `src/app/components/signals/alerts` and `src/app/components/pages/signals-page` returned exactly 2 findings, both rule `layout-transition` (width-transition progress bars in alert-detail-panel.tsx:196 and alert-speed-card.tsx:177). Both verified in context as real matches, but low-impact (thin 4-6px bars, infrequent discrete updates, not continuous animation) — triaged and suppressed with disclosed reasons during this session. No other findings anywhere in scope.

**Visual overlays**: No script-injection overlay was run this pass (screenshots + console + CLI detect were used as evidence instead). No reliable user-visible overlay is available for this run.

## Overall Impression

The reasoning and data layer is authentically domain-specific and the recent fix pass (icon system, item-count padding, Speed Mode parity, image-gen flow) closed real bugs — verified live. But the surface still lets a single click or swipe commit high-value, marketplace-facing changes with no confirmation and a silently-broken "undo" path (Dismiss), which is a serious mismatch for a tool whose entire premise is authorizing real money and inventory decisions. The single biggest opportunity: build a lightweight confirm-and-log layer under the existing action flows before adding any more visual polish.

## What's Working

1. **Domain-authentic reasoning** — Why/root-cause/option copy reads as real ops analysis, not lorem-ipsum alerting.
2. **Speed Mode parity is real** — Assign, Share, thumbs feedback, AI summary, and Why/Root are genuinely present and functional in the widened card, verified live.
3. **Deliberate edge-case coverage in the mock data** — item counts spanning 0/1/3/6/14/24/340/600 and title lengths from four words to a full sentence show real discipline in stress-testing layout before shipping.

## Priority Issues

- **[P0] Dead "Dismiss" button, Normal mode.** `alert-detail-panel.tsx` renders a Dismiss control with no onClick handler at all. Confirmed live: clicking it does nothing — no toast, no state change. On a triage surface this is worse than no button, since the user believes a high-priority alert was cleared. **Fix**: wire it to remove/mark-reviewed with the same toast feedback Execute already has. **Suggested command**: `/impeccable harden`.

- **[P0] No confirmation before high-value commits.** One click (Execute) or one swipe (Speed Approve) fires actions like "Revert all 600 ASINs to their pre-incident price" ($42,600) with only a transient toast as the record — no confirm step, no durable log, no undo. **Fix**: a magnitude-scaled confirm step plus a persistent, reviewable action log instead of an auto-dismissing toast. **Suggested command**: `/impeccable harden`.

- **[P1] Speed Mode ignores the active list filter.** Reproduced live: searching narrows the list to one alert; approving it advances Speed Mode into the full unfiltered 36-alert queue instead of stopping. The Speed queue is driven off the raw alert array/index rather than the list panel's filtered subset. **Fix**: thread the filtered array through to Speed Mode's position/queue state. **Suggested command**: `/impeccable optimize`.

- **[P1] Icon cleanup fixed the named examples, not the pattern.** The shared icon set is adopted in most places, but `alert-list-panel.tsx` still hand-rolls separate inline SVGs for "Repeated"/"Meeting" instead of importing it; `×`/`←`/`→` remain plain text characters in `items-modal.tsx`, `assign-menu.tsx`, and `image-gen-studio.tsx`; and the Normal/Speed toggle itself introduces a new emoji (⚡) in the same body of work meant to retire ad hoc glyphs. **Fix**: extend the icon-set migration to the remaining files and the toggle. **Suggested command**: `/impeccable polish`.

- **[P2] No audit trail of completed actions on the list row itself.** Approve/Execute/Deny leave no mark on the underlying list row (no strikethrough, badge, or removal) — a real gap for a high-volume triage tool where "what have I already handled" matters. **Fix**: reflect resolved state on the row. **Suggested command**: `/impeccable clarify`.

- **[P2] Keyboard/screen-reader access to tooltip-only context.** `HoverTip` is mouse-only (no onFocus, no aria-describedby/role) yet carries the value-methodology explanation, marketplace identity, and repeated/meeting context — a keyboard or screen-reader user cannot independently learn what a dollar figure means on a surface whose job is authorizing money decisions. **Fix**: make HoverTip focusable and announce via ARIA. **Suggested command**: `/impeccable harden`.

## Persona Red Flags

**Alex (Power User)**: Filters to a subset, swipes once in Speed Mode, gets silently rerouted into the full 36-alert queue (P1 above) — the mode built for Alex's speed actively undermines it.

**Riley (Stress Tester)**: The 600-ASIN alert Riley would specifically go looking for is exactly where the item-count fix broke this session (now fixed) — and it's also where the dead Dismiss button surfaces within the first few clicks.

**Sam (Accessibility-Dependent)**: Marketplace identity, source/provenance, repeated/meeting context, and the value "i" explanation are all gated behind a mouse-only tooltip. A keyboard/screen-reader user cannot independently learn what a dollar figure means here.

## Minor Observations

- The value-info "i" icon is an italic serif glyph in a circle — visually inconsistent with the flat geometric icon set, easy to misread as a typo at small sizes.
- List rows can stack 5-6 same-row badges/icons (priority, category, up to 2 marketplace glyphs, source, repeated, meeting) — exceeds the ≤4-per-group cognitive-load guideline before scanning even starts.
- The AI-generated content review screen and the impact-report screen both hardcode the same protein-supplement copy regardless of which alert triggered them — undercuts the peak-end payoff of actually resolving a specific alert.
- Speed Mode's floating Approve/Deny buttons sit visually disconnected below the card rather than reading as part of it.
- The Assign popup in Speed Mode overlaps and obscures the "Approving will…" summary behind it instead of displacing it.

## Questions to Consider

1. If the list never reflects what's been approved or dismissed, what is Speed Mode actually optimizing — decision speed, or the appearance of decision speed?
2. Is a Tinder-style swipe the right emotional register for authorizing a $42,600 pricing reversal, or did "fast and fun" win by default over "appropriately serious"?
3. Now that item-count padding covers every alert including the 600-ASIN one, is synthetic placeholder data at that scale acceptable for a live customer demo, or does the data itself need a second pass first?

---

## Audit — Technical Quality (companion pass)

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 1 | Value/marketplace/source/repeated context is gated behind a mouse-only tooltip with no keyboard or screen-reader path |
| 2 | Performance | 3 | Only the 2 triaged width-transition progress bars; no layout thrash, no unbounded effects |
| 3 | Responsive Design | 1 | Fixed-pixel card widths (e.g. 800px), 35/65 flex splits, no mobile/tablet breakpoints, icon touch targets well under 44px — expected for a desktop ops tool, but the surface as built does not degrade gracefully below desktop width |
| 4 | Theming | 1 | Every color is an inline hex literal; no design-token system, no dark mode — consistent across the whole prototype, not new to this pass |
| 5 | Implementation Integrity | 3 | 2 verified detector findings, both minor and now triaged/suppressed with disclosed reasons; nothing else found in either scanned directory |
| **Total** | | **9/20** | **Poor — but read in context** |

**Implementation Integrity Verdict**: Pass, with one caveat. The feature expresses a coherent, product-specific system (real ops vocabulary, deliberate edge-case data) rather than an interchangeable generic template. The technical score is dragged down almost entirely by theming and responsiveness choices that are standing, deliberate conventions of this prototype (inline styles, desktop-only), not defects introduced this pass — worth the team explicitly deciding whether those conventions still hold before this ships beyond an internal desktop demo.

### Recommended Actions (priority order)

1. **[P0] `/impeccable harden`** — wire the dead Dismiss button and add a confirm step + durable action log before high-value commits.
2. **[P1] `/impeccable optimize`** — thread the list panel's active filter into Speed Mode's queue.
3. **[P1] `/impeccable polish`** — finish the icon-set migration (list-panel inline SVGs, remaining text-glyph close/back buttons, the ⚡ emoji in the mode toggle).
4. **[P2] `/impeccable clarify`** — reflect resolved/actioned state on list rows.
5. **[P2] `/impeccable harden`** — make HoverTip keyboard- and screen-reader-accessible.
6. **[P3] `/impeccable colorize` or a scoped follow-up** — decide whether a design-token system and dark mode are in scope before this leaves internal demo use.
7. **`/impeccable polish`** — final pass once the above land.
