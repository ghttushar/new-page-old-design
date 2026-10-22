// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { useState } from 'react';
import {
  BIDDING_STRATEGIES, MARKETPLACE_CAPABILITY, formatCurrency, todayIso,
  type BidMultipliers, type BiddingStrategy, type BudgetType, type CcDraft, type CcProduct, type PlacementAdjust, type PlacementInclusion,
} from '../campaign-creator.types';
import { BAD, BORDER, BRAND, BRAND_TINT, Checkbox, FONT, InfoIcon, StepHeading, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';
import { Panel } from '../ccd-design';

const glyph = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const icons: Record<string, React.ReactNode> = {
  acos: <path d="M2.5 13.5h11M4 11V8M8 11V4.5M12 11V6.5" />,
  budget: <><rect x="2" y="4" width="12" height="8.5" rx="1.6" /><path d="M2 7h12M10.5 10h1.5" /></>,
  date: <><rect x="2" y="3" width="12" height="10.5" rx="2" /><path d="M2 6.5h12M5.5 1.8v2.6M10.5 1.8v2.6" /></>,
  bidding: <><path d="M2.5 11.5l3.4-3.8 2.4 2L13.5 4" /><path d="M10 4h3.5v3.5" /></>,
  eye: <><path d="M1.5 8s2.3-4.5 6.5-4.5S14.5 8 14.5 8s-2.3 4.5-6.5 4.5S1.5 8 1.5 8z" /><circle cx="8" cy="8" r="1.9" /></>,
  layout: <><rect x="2" y="2.5" width="12" height="4" rx="1.2" /><rect x="2" y="9" width="5.4" height="4.5" rx="1.2" /><rect x="8.6" y="9" width="5.4" height="4.5" rx="1.2" /></>,
  expand: <><circle cx="8" cy="8" r="2.2" /><path d="M8 1.8v2.4M8 11.8v2.4M1.8 8h2.4M11.8 8h2.4" /></>,
  multiply: <><path d="M4 4l8 8M12 4l-8 8" /></>,
};

const HINT = { margin: '10px 0 0', minHeight: 40, font: `400 13px/1.55 ${FONT}`, color: TEXT_MUTED } as const;
const NOTE = { margin: '10px 0 0', font: `400 12.5px/1.4 ${FONT}`, minHeight: 17 } as const;
const FIELD_LABEL = { display: 'block', margin: '0 0 6px', font: `500 12.5px/1.3 ${FONT}`, color: TEXT_MUTED } as const;
const inputStyle = (bad: boolean, width = 130) => ({
  width, padding: '10px 12px', border: `1px solid ${bad ? '#e0a5a0' : BORDER}`, borderRadius: 8, font: `500 14px/1.2 ${FONT}`, color: TEXT_PRIMARY, outline: 'none', background: '#fff',
});

const BIDDING_HINT: Record<BiddingStrategy, string> = {
  'Dynamic bids - down only': 'Bids are lowered in real time when an ad is less likely to convert.',
  'Dynamic bids - up and down': 'Bids go up when an ad is more likely to convert and down when it is less likely.',
  'Fixed bids': 'Your bid stays as you set it and is never changed for you.',
  Fixed: 'Your bid stays as you set it and is never changed for you.',
  Dynamic: 'Walmart adjusts your bid in real time to the chance of a sale.',
};

const PLACEMENT_FIELDS: [keyof PlacementAdjust, string][] = [['top', 'Top of search (first page)'], ['product', 'Product pages'], ['rest', 'Rest of search']];

const BUDGET_TYPES: { id: BudgetType; label: string; hint: string }[] = [
  { id: 'daily', label: 'Daily', hint: 'The most the new campaigns spend each day.' },
  { id: 'total', label: 'Total', hint: 'The most the new campaigns spend over their whole run.' },
  { id: 'both', label: 'Daily and total', hint: 'A daily limit, and a total the campaigns never go past.' },
];

/** Walmart placements. Search in-grid is always on; Buy box is always on for Auto campaigns. */
const INCLUSIONS: [keyof PlacementInclusion, string, string][] = [
  ['searchInGrid', 'Search in-grid', 'Ads shown inside the grid of search results. This placement is always on.'],
  ['searchCarousel', 'Search carousel', 'Ads shown in a carousel within search results.'],
  ['itemCarousel', 'Item carousel', 'Ads shown in a carousel on item pages.'],
  ['buyBox', 'Buy box', 'Ads shown beside the Buy Box on an item page.'],
];

const MULTIPLIER_GROUPS: { key: keyof BidMultipliers; title: string; fields: [string, string][]; when: 'auto' | 'manual' | 'always' }[] = [
  { key: 'auto', title: 'Placement · Auto campaigns', when: 'auto', fields: [['buyBox', 'Buy box'], ['searchInGrid', 'Search in-grid'], ['homePage', 'Home page'], ['stockUp', 'Stock up']] },
  { key: 'manual', title: 'Placement · Manual campaigns', when: 'manual', fields: [['buyBox', 'Buy box'], ['searchInGrid', 'Search in-grid']] },
  { key: 'platform', title: 'Platform', when: 'always', fields: [['desktop', 'Desktop'], ['app', 'App'], ['mobile', 'Mobile']] },
];

type Patch = (patch: Partial<CcDraft>) => void;
type Issue = { field: 'dailyBudget'; min: number; message: string } | null | undefined;

function CardHead({ icon, label, htmlFor, optional, aside }: { icon: string; label: string; htmlFor?: string; optional?: boolean; aside?: React.ReactNode }) {
  const text = <>{label}{optional && <span style={{ fontWeight: 400, color: TEXT_FAINT }}> (Optional)</span>}</>;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 30, height: 30, borderRadius: 8, background: BRAND_TINT, color: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden {...glyph}>{icons[icon]}</svg>
      </span>
      {htmlFor ? <label htmlFor={htmlFor} style={{ flex: 1, font: `600 14px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>{text}</label> : <h2 style={{ flex: 1, margin: 0, font: `600 14px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>{text}</h2>}
      {aside}
    </div>
  );
}

/** A number with its unit either side, e.g. "$ [ 50 ] per day". */
function NumberField({ id, value, placeholder, prefix, suffix, step = 1, min = 0, max, error, width, label, onChange }: {
  id: string; value: number | null; placeholder: string; prefix?: string; suffix?: string; step?: number; min?: number; max?: number;
  error?: boolean; width?: number; label?: string; onChange: (v: number | null) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {prefix && <span style={{ font: `500 14px/1 ${FONT}`, color: TEXT_MUTED }}>{prefix}</span>}
      <input
        id={id} className="ccd-input" type="number" inputMode="decimal" step={step} min={min} max={max} aria-label={label}
        value={value ?? ''} placeholder={placeholder} aria-invalid={Boolean(error)}
        onChange={(e) => { const raw = e.target.value.trim(); const n = raw === '' ? null : Number(raw); onChange(n !== null && Number.isNaN(n) ? value : n); }}
        style={inputStyle(Boolean(error), width)}
      />
      {suffix && <span style={{ font: `400 13px/1 ${FONT}`, color: TEXT_MUTED }}>{suffix}</span>}
    </div>
  );
}

function Note({ error, children }: { error?: string | null; children?: React.ReactNode }) {
  return <p role={error ? 'alert' : undefined} style={{ ...NOTE, color: error ? BAD : TEXT_FAINT }}>{error ?? children ?? ''}</p>;
}

// ── Cards both marketplaces use ───────────────────────────────────────────────────────────────

function StartDateCard({ draft, onChange }: { draft: CcDraft; onChange: Patch }) {
  const error = draft.startDate && draft.startDate < todayIso() ? "The start date can't be in the past." : null;
  return (
    <Panel pad={18} className="ccd-goal-card">
      <CardHead icon="date" label="Start date" htmlFor="ccd-obj-start" />
      <p style={HINT}>The day the new campaigns begin running.</p>
      <input id="ccd-obj-start" type="date" className="ccd-input ccd-date" value={draft.startDate} min={todayIso()} onChange={(e) => onChange({ startDate: e.target.value })} aria-invalid={Boolean(error)} />
      <Note error={error} />
    </Panel>
  );
}

/** Amazon: an optional date, empty for no end. Walmart adds "Run indefinitely", which clears and locks the date. */
function EndDateCard({ draft, onChange, indefiniteBox }: { draft: CcDraft; onChange: Patch; indefiniteBox?: boolean }) {
  const [pickEnd, setPickEnd] = useState(false);
  const indefinite = Boolean(indefiniteBox) && !draft.endDate && !pickEnd;
  const error = draft.endDate && draft.endDate < draft.startDate ? 'The end date is before the start date.' : null;
  return (
    <Panel pad={18} className="ccd-goal-card">
      <CardHead icon="date" label="End date" htmlFor="ccd-obj-end" optional />
      <p style={HINT}>{indefiniteBox ? 'Pick the day the campaigns stop, or let them run until you stop them.' : 'Leave it empty to keep running until you stop the campaigns.'}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 16px', marginTop: 14 }}>
        <input id="ccd-obj-end" type="date" className="ccd-input ccd-date" style={{ marginTop: 0 }} value={draft.endDate} min={draft.startDate || todayIso()} disabled={indefinite} onChange={(e) => onChange({ endDate: e.target.value })} aria-invalid={Boolean(error)} />
        {indefiniteBox && (
          <button
            type="button" role="checkbox" aria-checked={indefinite} className="ccd-check-btn"
            onClick={() => { if (indefinite) setPickEnd(true); else { setPickEnd(false); onChange({ endDate: '' }); } }}
          >
            <Checkbox checked={indefinite} size={16} />
            <span>Run indefinitely</span>
          </button>
        )}
      </div>
      <Note error={error} />
    </Panel>
  );
}

function AcosCard({ draft, onChange }: { draft: CcDraft; onChange: Patch }) {
  const max = (draft.marketplace && MARKETPLACE_CAPABILITY[draft.marketplace]?.maxTargetAcos) ?? 90;
  const v = draft.targetAcos;
  const error = v !== null && (v < 1 || v > max) ? `Enter a value between 1 and ${max}.` : null;
  return (
    <Panel pad={18} className="ccd-goal-card" style={error ? { borderColor: '#e0a5a0' } : undefined}>
      <CardHead icon="acos" label="Target ACOS" htmlFor="ccd-obj-acos" optional />
      <p style={HINT}>The advertising cost of sale you are aiming for.</p>
      <div style={{ marginTop: 14 }}>
        <NumberField id="ccd-obj-acos" value={v} placeholder="25" suffix="%" error={Boolean(error)} onChange={(n) => onChange({ targetAcos: n })} />
      </div>
      <Note error={error}>Allowed range: 1–{max}%</Note>
    </Panel>
  );
}

function BiddingCard({ draft, onChange }: { draft: CcDraft; onChange: Patch }) {
  const options = BIDDING_STRATEGIES[draft.marketplace ?? 'amazon'];
  const value = options.includes(draft.biddingStrategy) ? draft.biddingStrategy : options[0];
  return (
    <Panel pad={18} className="ccd-goal-card">
      <CardHead icon="bidding" label="Bidding strategy" htmlFor="ccd-obj-bidding" />
      <p style={HINT}>{BIDDING_HINT[value]}</p>
      <select id="ccd-obj-bidding" className="ccd-input ccd-date" value={value} onChange={(e) => onChange({ biddingStrategy: e.target.value as BiddingStrategy })}>
        {options.map((b) => <option key={b} value={b}>{b}</option>)}
      </select>
      <Note />
    </Panel>
  );
}

// ── Amazon ────────────────────────────────────────────────────────────────────────────────────

function AmazonObjectives({ draft, onChange, issue }: { draft: CcDraft; onChange: Patch; issue: Issue }) {
  const cap = MARKETPLACE_CAPABILITY.amazon;
  const budgetError = issue && draft.dailyBudget < issue.min ? issue.message
    : draft.dailyBudget < cap.minDailyBudget ? `The minimum for this marketplace is ${formatCurrency(cap.minDailyBudget)}.` : null;
  return (
    <div className="ccd-goal-grid">
      <StartDateCard draft={draft} onChange={onChange} />
      <EndDateCard draft={draft} onChange={onChange} />

      <Panel pad={18} className="ccd-goal-card" style={budgetError ? { borderColor: '#e0a5a0' } : undefined}>
        <CardHead icon="budget" label="Daily budget" htmlFor="ccd-obj-budget" />
        <p style={HINT}>How much you are happy to spend across all the new campaigns each day.</p>
        <div style={{ marginTop: 14 }}>
          <NumberField id="ccd-obj-budget" value={draft.dailyBudget} placeholder="50" prefix="$" suffix="per day" error={Boolean(budgetError)} onChange={(n) => onChange({ dailyBudget: Math.max(0, n ?? 0) })} />
        </div>
        <Note error={budgetError} />
      </Panel>

      <AcosCard draft={draft} onChange={onChange} />
      <BiddingCard draft={draft} onChange={onChange} />

      <Panel pad={18} className="ccd-goal-card">
        <CardHead icon="layout" label="Adjust bids by placement" optional />
        <p style={HINT}>Raise your bid where ads show, from 0% to 900%. Leave a field empty for no change.</p>
        <div className="ccd-place-grid ccd-place-grid--stack">
          {PLACEMENT_FIELDS.map(([key, text]) => {
            const v = draft.placementAdjust[key];
            const bad = v !== null && (v < 0 || v > 900);
            return (
              <div key={key} className="ccd-place-row">
                <label htmlFor={`ccd-place-${key}`} style={{ ...FIELD_LABEL, margin: 0 }}>{text}</label>
                <NumberField id={`ccd-place-${key}`} value={v} placeholder="0" suffix="%" min={0} max={900} width={92} error={bad} onChange={(n) => onChange({ placementAdjust: { ...draft.placementAdjust, [key]: n } })} />
                {bad && <p role="alert" style={{ ...NOTE, margin: 0, color: BAD }}>Enter a value from 0 to 900.</p>}
              </div>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}

// ── Walmart ───────────────────────────────────────────────────────────────────────────────────

function WalmartBudgetCard({ draft, onChange, issue }: { draft: CcDraft; onChange: Patch; issue: Issue }) {
  const cap = MARKETPLACE_CAPABILITY.walmart;
  const usesDaily = draft.budgetType !== 'total';
  const usesTotal = draft.budgetType !== 'daily';
  const dailyError = !usesDaily ? null
    : issue && draft.dailyBudget < issue.min ? issue.message
    : draft.dailyBudget < cap.minDailyBudget ? `The minimum for this marketplace is ${formatCurrency(cap.minDailyBudget)}.` : null;
  const totalError = !usesTotal ? null
    : !draft.totalBudget ? 'Enter a total budget.'
    : usesDaily && draft.totalBudget < draft.dailyBudget ? 'The total budget is below the daily budget.' : null;
  const type = BUDGET_TYPES.find((t) => t.id === draft.budgetType) ?? BUDGET_TYPES[0];
  return (
    <Panel pad={18} className="ccd-goal-card" style={dailyError || totalError ? { borderColor: '#e0a5a0' } : undefined}>
      {/* The budget type is a quiet dropdown in the card's header; the fields below follow it. */}
      <CardHead
        icon="budget" label="Budget"
        aside={(
          <select id="ccd-obj-btype" className="ccd-input ccd-wm-btype" aria-label="Budget type" value={draft.budgetType} onChange={(e) => onChange({ budgetType: e.target.value as BudgetType })}>
            {BUDGET_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        )}
      />
      <p style={HINT}>{type.hint}</p>
      <div className={`ccd-wm-budget${usesDaily && usesTotal ? ' is-pair' : ''}`}>
        {usesDaily && (
          <div>
            <label htmlFor="ccd-obj-budget" style={FIELD_LABEL}>Daily budget</label>
            <NumberField id="ccd-obj-budget" value={draft.dailyBudget} placeholder="50" prefix="$" suffix={usesTotal ? undefined : 'per day'} width={usesTotal ? 96 : 130} error={Boolean(dailyError)} onChange={(n) => onChange({ dailyBudget: Math.max(0, n ?? 0) })} />
          </div>
        )}
        {usesTotal && (
          <div>
            <label htmlFor="ccd-obj-total" style={FIELD_LABEL}>Total budget</label>
            <NumberField id="ccd-obj-total" value={draft.totalBudget} placeholder="1,500" prefix="$" width={usesDaily ? 96 : 130} error={Boolean(totalError)} onChange={(n) => onChange({ totalBudget: n })} />
          </div>
        )}
      </div>
      {usesDaily && (
        <div className="ccd-wm-rollover">
          <span id="ccd-obj-rollover" className="ccd-wm-rollover__label">
            Roll over unspent daily budget
            <span className="ccd-tm-info" title="Carries what wasn't spent yesterday into today's daily budget."><InfoIcon size={13} color="#8a909b" /></span>
          </span>
          <div className="ccd-seg" role="radiogroup" aria-labelledby="ccd-obj-rollover">
            <button type="button" role="radio" aria-checked={draft.budgetRollover} className={draft.budgetRollover ? 'is-on' : ''} onClick={() => onChange({ budgetRollover: true })}>Yes</button>
            <button type="button" role="radio" aria-checked={!draft.budgetRollover} disabled title="Not available at the moment">No</button>
          </div>
        </div>
      )}
      <Note error={dailyError ?? totalError} />
    </Panel>
  );
}

function ExpandedTargetingCard({ draft, onChange }: { draft: CcDraft; onChange: Patch }) {
  const et = draft.expandedTargeting;
  const options: [keyof typeof et, string][] = [['brandTerms', 'Brand term targeting'], ['complementary', 'Complementary product targeting']];
  return (
    <Panel pad={18} className="ccd-goal-card">
      <CardHead icon="expand" label="Expanded targeting" />
      <p style={HINT}>Extra reach for the Auto campaigns, on top of their own targeting.</p>
      <div className="ccd-wm-checks">
        {options.map(([key, text]) => (
          <button key={key} type="button" role="checkbox" aria-checked={et[key]} className="ccd-check-btn" onClick={() => onChange({ expandedTargeting: { ...et, [key]: !et[key] } })}>
            <Checkbox checked={et[key]} size={16} />
            <span>{text}</span>
          </button>
        ))}
      </div>
    </Panel>
  );
}

function InclusionsCard({ draft, onChange, hasAuto, hasManual }: { draft: CcDraft; onChange: Patch; hasAuto: boolean; hasManual: boolean }) {
  const pi = draft.placementInclusion;
  // Buy box can only be turned off for Manual campaigns; Auto campaigns always show there.
  const locked = (key: keyof PlacementInclusion) => key === 'searchInGrid' || (key === 'buyBox' && !hasManual);
  const on = (key: keyof PlacementInclusion) => (locked(key) ? true : pi[key]);
  const caption = (key: keyof PlacementInclusion) => (key === 'searchInGrid' ? 'Always on' : key === 'buyBox' && hasAuto ? 'Always on for Auto campaigns' : null);
  return (
    <Panel pad={18} className="ccd-goal-card ccd-goal-card--pi">
      <CardHead icon="eye" label="Placement inclusions" />
      <p style={HINT}>Choose where you'd like customers to see your ads.</p>
      <div className="ccd-pi ccd-pi--list">
        <div className="ccd-pi__cols">
          {INCLUSIONS.map(([key, text, info]) => (
            <div key={key} className="ccd-pi__row">
              <button
                type="button" role="switch" aria-checked={on(key)} aria-label={text} disabled={locked(key)}
                className={`ccd-nm-toggle${on(key) ? ' is-on' : ''}`}
                onClick={() => onChange({ placementInclusion: { ...pi, [key]: !pi[key] } })}
              ><i /></button>
              <span>{text}{caption(key) && <small className="ccd-pi__cap">{caption(key)}</small>}</span>
              <span className="ccd-tm-info" title={info}><InfoIcon size={13} color="#8a909b" /></span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function MultipliersCard({ draft, onChange, hasAuto, hasManual, span }: { draft: CcDraft; onChange: Patch; hasAuto: boolean; hasManual: boolean; span: 2 | 3 }) {
  const bm = draft.bidMultipliers;
  const groups = MULTIPLIER_GROUPS.filter((g) => g.when === 'always' || (g.when === 'auto' ? hasAuto : hasManual));
  return (
    <Panel pad={18} className={`ccd-goal-card ccd-goal-card--span${span}`}>
      <CardHead icon="multiply" label="Bid multipliers" optional />
      <p style={HINT}>Raise bids by a percentage for a placement or a device, from 0% to 900%. 0% leaves the bid as it is.</p>
      <div className="ccd-wm-mult">
        {groups.map((g) => (
          <fieldset key={g.key} className="ccd-wm-mult__group">
            <legend>{g.title}</legend>
            {g.fields.map(([field, text]) => {
              const v = bm[g.key][field];
              const bad = v !== null && (v < 0 || v > 900);
              return (
                <div key={field} className="ccd-place-row">
                  <label htmlFor={`ccd-mult-${g.key}-${field}`} style={{ ...FIELD_LABEL, margin: 0 }}>{text}</label>
                  <NumberField
                    id={`ccd-mult-${g.key}-${field}`} value={v} placeholder="0" suffix="%" min={0} max={900} width={72} error={bad}
                    onChange={(n) => onChange({ bidMultipliers: { ...bm, [g.key]: { ...bm[g.key], [field]: n ?? 0 } } })}
                  />
                </div>
              );
            })}
          </fieldset>
        ))}
      </div>
    </Panel>
  );
}

function WalmartObjectives({ draft, onChange, issue }: { draft: CcDraft; onChange: Patch; issue: Issue }) {
  // Which campaigns this plan (or group) makes decides the Auto-only and Manual-only settings.
  const strategies = draft.targetingStrategies ?? [];
  const mode = draft.campaignMode ?? 'both';
  const hasAuto = strategies.length ? strategies.includes('auto') : mode !== 'manual';
  const hasManual = strategies.length ? strategies.some((s) => s !== 'auto') : mode !== 'auto';
  // Three cards a row, every row full: with Auto, Expanded targeting closes row two and Placement inclusions sits beside
  // the bid multipliers; without it, Placement inclusions closes row two and the multipliers take the last row alone.
  return (
    <div className="ccd-goal-grid">
      <StartDateCard draft={draft} onChange={onChange} />
      <EndDateCard draft={draft} onChange={onChange} indefiniteBox />
      <BiddingCard draft={draft} onChange={onChange} />

      <WalmartBudgetCard draft={draft} onChange={onChange} issue={issue} />
      <AcosCard draft={draft} onChange={onChange} />
      {hasAuto && <ExpandedTargetingCard draft={draft} onChange={onChange} />}

      <InclusionsCard draft={draft} onChange={onChange} hasAuto={hasAuto} hasManual={hasManual} />
      <MultipliersCard draft={draft} onChange={onChange} hasAuto={hasAuto} hasManual={hasManual} span={hasAuto ? 2 : 3} />
    </div>
  );
}

/** Objectives differ by marketplace: Amazon and Walmart each get their own fields, defaults and rules. */
export default function StepObjectives({ draft, onChange, issue }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onChange: Patch;
  /** A daily budget the marketplace rejected on an earlier run: the field stays red until it is raised enough. */
  issue?: Issue;
}) {
  return (
    <div>
      <StepHeading title="Set your goals" />
      {draft.marketplace === 'walmart'
        ? <WalmartObjectives draft={draft} onChange={onChange} issue={issue} />
        : <AmazonObjectives draft={draft} onChange={onChange} issue={issue} />}
    </div>
  );
}
