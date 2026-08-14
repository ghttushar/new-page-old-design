# Case Studies — Audit & Polish Implementation Plan

Status: APPROVED (user: "Approve — implement everything")
Repo: ghttushar/anarix-website-final-state @ clone `C:\Users\ghttu\AppData\Local\Temp\opencode\view-inspect` (HEAD 93cde0d)
Constraint: reuse existing Anarix design system — no redesign. Enterprise-annual-report feel, understated motion.

## Root causes (from audit)

1. Homepage teasers exist but sit after ServicesGrid (effectively invisible) — must move to immediately after Hero and be rebuilt with mini dashboard + KPI chips.
2. Hero jump cards are `<Link to="/case-studies#id">` — react-router changes hash but never scrolls. No hash-scroll handler, no active-section tracking.
3/4/5. Pills are nested in the description column (`mt-5`), KPI grid is a separate container — no consistent rhythm; pills collide with cards.
6. No divider/chapter break between the two studies.
7. Charts understated: compact containers, no hover tooltips, no peak emphasis.
8. Challenge cards are stacked paragraphs; strategy steps lack a connector rail.
9. Navbar's top hairline bar exists on all pages, but no page-level/section progress (ScrollProgress is hardcoded to Home sections).
10. `useCountUp` defaults `start: true` → counts up on mount while off-screen → appears static when scrolled into view.

## Changes by file

### 1. `frontend/src/website/data/case-studies.ts`
- Add `caption: string` + `source: string` to all three chart variants in the `CaseChart` union.
- Fill captions/sources for all 4 charts:
  - Medical 1P vs 3P: caption "Monthly channel revenue · Jan → Dec" / source "Walmart marketplace · partner reporting"
  - Medical 1P share: caption "1P share of combined revenue · Jan → Dec" / same source
  - Apparel stacked: caption "Monthly revenue by ad type · Aug 2025 → Jul 2026" / source "Amazon Ads · partner reporting"
  - Apparel TACoS: caption "Blended TACoS · Aug 2025 → Jul 2026" / same source

### 2. `frontend/src/website/components/case-studies/charts.tsx`
- Export `smoothPath` / `areaPath` helpers (reused by teaser mini charts).
- ChartShell: larger padding (`p-7 sm:p-10`), title `text-2xl`, caption row at bottom: caption left, "Source: …" right (text-xs muted, hairline divider above).
- LineChart / TACoSChart:
  - stroke width 2.5 → 3, anchor dots r 4 → 5.5.
  - Peak pulse: ring pulsing (framer-motion scale 1→1.7→1, opacity fade, repeat Infinity) at max point of series 0 (line) / min point (TACoS trough).
  - Hover crosshair + tooltip (pointer-events on svg, nearest-index from clientX via getBoundingClientRect): vertical dashed line, dots on every series at index, tooltip card (fill hsl(var(--card)), stroke hsl(var(--border)), series values formatted). Desktop only (pointer events do nothing on touch — acceptable; tooltips also available via native `<title>` on dots).
  - Legend dimming: non-hovered series fade to opacity 0.25 while hovering a point.
- StackedBarChart:
  - Hover group: bars get stroke highlight + tooltip card above group (total + per-segment values).
  - BFCM marker: thicker line + label pill (rounded rect behind text, primary/10 fill).
  - More whitespace between charts handled by section spacing (see #4).

### 3. `frontend/src/website/components/case-studies/primitives.tsx`
- `KpiGrid`: move reveal to per-card. Each card gets own `useScrollReveal`; `useCountUp` gated on `start: isVisible` (fixes static numbers). Cards: `p-6` → `p-7` (+height), stagger via `transitionDelay: i * 90ms`, entry = opacity + translateY + slight scale (0.98→1).
- `MetricStat`: same count-up gating; `p-6` → `p-7`.
- `TimelineStep`: add vertical connector rail — `absolute left-[17px] top-10 bottom-[-2rem] w-px bg-border/60` on all but last step (container relative).
- New `SoftDivider`: full-width hairline `h-px bg-gradient-to-r from-transparent via-border/80 to-transparent` (max-w-6xl mx-auto), subtle draw-in (scaleX motion).
- New `ChapterDivider({ index, eyebrow, title, meta })`: animated chapter break — gradient hairlines above/below, centered "Next Case Study" small caps, big display index + title + meta chips, animated down-chevron (y 0→6 loop). Used between the two studies.

### 4. `frontend/src/website/components/case-studies/CaseStudyChapter.tsx`
- ChapterHero restructure — explicit rhythm (all via margin classes):
  - top row (index + partner line) `mb-12` (48)
  - eyebrow `mb-4` + title `mb-12` (48)
  - metric | description grid `mb-10` (40)
  - metadata pills moved OUT of the description column into their own full-width flex-wrap row `mb-12` (48)
  - `<KpiGrid>` rendered inside ChapterHero below pills `mb-20 sm:mb-24` (80–96)
  - remove the separate KPI container in `CaseStudyChapter`.
  - Hero count-up gated on `start: isVisible`.
- ChallengeSection: full-width heading (max-w-3xl), then **3-col responsive grid** of modular cards (each with number glyph `01/02/03`), then the visual "Where the business stood" panel full-width below (horizontal pct bars, keep motion grow). Remove sticky.
- StrategySection: numbered steps with connector rail (from #3).
- Section rhythm + alternating surfaces:
  - Add `tint` support to `Section` (new `.section-tint` utility in website.css: `background: hsl(var(--muted) / 0.35)`).
  - Challenge = tint band, charts = plain, insights = tint band, final metrics = plain; Strategy + Transition stay `section-dark`.
  - `SoftDivider` between: hero→challenge, strategy→charts, charts→insights, insights→transition, quote→final metrics.

### 5. `frontend/src/website/website.css`
- Add `.website-scope .section-tint { background-color: hsl(var(--muted) / 0.35); }`

### 6. `frontend/src/website/components/ScrollProgress.tsx`
- Add `sections` prop (default = current hardcoded Home list). Type `{ label: string; shape: string }[]`.

### 7. `frontend/src/hooks/useScrollToHash.ts` (new)
- On `location.pathname`/`location.hash` change: `document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" })` in a rAF (targets already have `scroll-mt-28` for navbar offset).

### 8. `frontend/src/website/pages/CaseStudies.tsx`
- Use `useScrollToHash` (fixes broken jump links; works for direct `#anchor` loads too).
- Active-section tracking: IntersectionObserver over both chapter ids (`rootMargin: "-35% 0px -55% 0px"`) → `activeId` state.
- Jump cards: active state styling when `activeId === cs.id` (border-primary, bg-primary/5, arrow → primary + translate); small `01 / 02` progress dots per card.
- Render `<ChapterDivider>` between chapter 1 and 2 (data from apparelStudy: index "02", eyebrow, title "Amazon Apparel", meta chips).
- Add `<ScrollProgress sections={[{label:"Hero",shape:"◆"},{label:"Walmart",shape:"●"},{label:"Amazon",shape:"●"},{label:"CTA",shape:"◆"}]} />` (like Home).

### 9. `frontend/src/website/components/home/CaseStudyTeasers.tsx` (rebuild)
- Two FULL-WIDTH stacked bands (never side-by-side even on desktop), alternating light / `section-dark`.
- Each band mirrors the study's first screen:
  - Eyebrow chip "CASE STUDY · WALMART" / "CASE STUDY · AMAZON", industry line from metadata (Walmart · Medical supplies).
  - Big count-up hero metric + stat line (gated on reveal).
  - One-sentence summary (intro).
  - **3 KPI chips** (rounded-pill, bg-card border, value bold + label) from `kpis.slice(0,3)`.
  - **Mini dashboard**: right-side card (rounded-2xl border bg-card, p-5) with compact SVG — Medical: mini 1P vs 3P area/line chart (reuses exported `smoothPath`/`areaPath`, viewBox ~560×150, draw-in animation, legend dots, caption); Apparel: mini stacked bars (12 groups, motion grow, legend). Alternate card side per band.
  - CTA "Explore Case Study" + ArrowRight → `/case-studies#id` (primary pill button style consistent with site).
  - Scroll reveal fade/translate.

### 10. `frontend/src/website/pages/Home.tsx`
- Move `<CaseStudyTeasers />` from after `<ServicesGrid />` to immediately after `<HeroSectionNew />`. Remove old placement (single teaser section).

## Verification
- `npx tsc -b` (workdir frontend) — clean.
- `npm run build` — success (bundle-size warning pre-existing).
- Commit `website: audit polish for case studies — hero teasers, scroll nav, chart tooltips, spacing` → push main (origin already has working classic token) → confirm live deploy ~60s later: `https://anarix-website-final-state.vercel.app/case-studies` bundle hash matches local `assets/index-*.js`.

## Explicitly out of scope
- Sticky chart while reading (needs layout overhaul; user's consolidated list omits it).
- Redesigning site language/tokens.
