// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { useState } from 'react';
import {
  BIDDING_STRATEGIES, MARKETPLACE_CAPABILITY, formatCurrency, todayIso,
  type BidMultipliers, type BiddingStrategy, type BudgetType, type CcDraft, type CcProduct, type PlacementAdjust, type PlacementInclusion,
} from '../campaign-creator.types';
import { BORDER, Checkbox, FONT, InfoIcon, StepHeading, TEXT_PRIMARY } from '../campaign-creator-ui';
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
  multiply: <><path d="M2 4h3.2M8.4 4H14M2 8h7.6M12.8 8H14M2 12h1.6M6.8 12H14" /><circle cx="6.8" cy="4" r="1.6" /><circle cx="11.2" cy="8" r="1.6" /><circle cx="5.2" cy="12" r="1.6" /></>,
};

/** Every number field on the page is one of two widths: on its own in a card, or in a list of fields. */
const SINGLE_WIDTH = 120;
const LIST_WIDTH = 84;

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

// ── The parts every card is made of ───────────────────────────────────────────────────────────

/**
 * One card: icon and title, a two-line hint, the controls, then a note line for an error or a quiet range. Every card on
 * the page is this shape, so titles, hints and controls line up across a row.
 */
function GoalCard({ icon, title, htmlFor, optional, hint, error, note, wide, children }: {
  icon: string; title: string; htmlFor?: string; optional?: boolean; hint: React.ReactNode;
  error?: string | null; note?: React.ReactNode; wide?: boolean; children: React.ReactNode;
}) {
  const heading = <>{title}{optional && <span className="ccd-gc-optional"> Optional</span>}</>;
  return (
    <Panel pad={18} className={`ccd-goal-card${wide ? ' ccd-goal-card--span3' : ''}${error ? ' is-error' : ''}`}>
      <div className="ccd-gc-head">
        <span className="ccd-gc-icon"><svg width={16} height={16} viewBox="0 0 16 16" aria-hidden {...glyph}>{icons[icon]}</svg></span>
        {htmlFor ? <label htmlFor={htmlFor}>{heading}</label> : <h2>{heading}</h2>}
      </div>
      <p className="ccd-gc-hint">{hint}</p>
      <div className="ccd-gc-body">{children}</div>
      <p className={`ccd-gc-note${error ? ' is-error' : ''}`} role={error ? 'alert' : undefined}>{error ?? note ?? ''}</p>
    </Panel>
  );
}

/** A label and its control on one line; a list of these shares one label column. */
function FieldRow({ label, htmlFor, children }: { label: React.ReactNode; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="ccd-field-row">
      {htmlFor ? <label htmlFor={htmlFor}>{label}</label> : <span className="ccd-field-row__label">{label}</span>}
      <div className="ccd-field-row__control">{children}</div>
    </div>
  );
}

/** A checkbox or a switch with its label, and a grey caption under the label when there is one. */
function OptionRow({ kind, checked, disabled, label, caption, info, onToggle }: {
  kind: 'check' | 'switch'; checked: boolean; disabled?: boolean; label: string; caption?: string | null; info?: string; onToggle: () => void;
}) {
  const text = <span className="ccd-option-row__text"><span>{label}</span>{caption && <small>{caption}</small>}</span>;
  if (kind === 'check') {
    return (
      <button type="button" role="checkbox" aria-checked={checked} disabled={disabled} className="ccd-option-row" onClick={onToggle}>
        <Checkbox checked={checked} disabled={disabled} size={16} />{text}
      </button>
    );
  }
  return (
    <div className="ccd-option-row">
      <button type="button" role="switch" aria-checked={checked} aria-label={label} disabled={disabled} className={`ccd-nm-toggle${checked ? ' is-on' : ''}`} onClick={onToggle}><i /></button>
      {text}
      {info && <span className="ccd-tm-info" title={info}><InfoIcon size={13} color="#8a909b" /></span>}
    </div>
  );
}

/** A number with its unit either side, e.g. "$ [ 50 ] per day". */
function NumberField({ id, value, placeholder, prefix, suffix, step = 1, min = 0, max, error, width = SINGLE_WIDTH, onChange }: {
  id: string; value: number | null; placeholder: string; prefix?: string; suffix?: string; step?: number; min?: number; max?: number;
  error?: boolean; width?: number; onChange: (v: number | null) => void;
}) {
  return (
    <div className="ccd-num-field">
      {prefix && <span className="ccd-num-field__unit">{prefix}</span>}
      <input
        id={id} className="ccd-input" type="number" inputMode="decimal" step={step} min={min} max={max}
        value={value ?? ''} placeholder={placeholder} aria-invalid={Boolean(error)}
        onChange={(e) => { const raw = e.target.value.trim(); const n = raw === '' ? null : Number(raw); onChange(n !== null && Number.isNaN(n) ? value : n); }}
        style={{ width, padding: '9px 12px', border: `1px solid ${error ? '#e0a5a0' : BORDER}`, borderRadius: 8, font: `500 14px/1.2 ${FONT}`, color: TEXT_PRIMARY, outline: 'none', background: '#fff' }}
      />
      {suffix && <span className="ccd-num-field__unit">{suffix}</span>}
    </div>
  );
}

// ── Cards both marketplaces use ───────────────────────────────────────────────────────────────

function StartDateCard({ draft, onChange }: { draft: CcDraft; onChange: Patch }) {
  const error = draft.startDate && draft.startDate < todayIso() ? "The start date can't be in the past." : null;
  return (
    <GoalCard icon="date" title="Start date" htmlFor="ccd-obj-start" hint="The day the new campaigns begin running." error={error}>
      <input id="ccd-obj-start" type="date" className="ccd-input ccd-date" value={draft.startDate} min={todayIso()} onChange={(e) => onChange({ startDate: e.target.value })} aria-invalid={Boolean(error)} />
    </GoalCard>
  );
}

/** Amazon: an optional date, empty for no end. Walmart adds "Run indefinitely", which clears and locks the date. */
function EndDateCard({ draft, onChange, indefiniteBox }: { draft: CcDraft; onChange: Patch; indefiniteBox?: boolean }) {
  const [pickEnd, setPickEnd] = useState(false);
  const indefinite = Boolean(indefiniteBox) && !draft.endDate && !pickEnd;
  const error = draft.endDate && draft.endDate < draft.startDate ? 'The end date is before the start date.' : null;
  return (
    <GoalCard
      icon="date" title="End date" htmlFor="ccd-obj-end" optional error={error}
      hint={indefiniteBox ? 'Pick the day the campaigns stop, or let them run until you stop them.' : 'Leave it empty to keep running until you stop the campaigns.'}
    >
      <input id="ccd-obj-end" type="date" className="ccd-input ccd-date" value={draft.endDate} min={draft.startDate || todayIso()} disabled={indefinite} onChange={(e) => onChange({ endDate: e.target.value })} aria-invalid={Boolean(error)} />
      {indefiniteBox && (
        <OptionRow
          kind="check" checked={indefinite} label="Run indefinitely"
          onToggle={() => { if (indefinite) setPickEnd(true); else { setPickEnd(false); onChange({ endDate: '' }); } }}
        />
      )}
    </GoalCard>
  );
}

function AcosCard({ draft, onChange }: { draft: CcDraft; onChange: Patch }) {
  const max = (draft.marketplace && MARKETPLACE_CAPABILITY[draft.marketplace]?.maxTargetAcos) ?? 90;
  const v = draft.targetAcos;
  const error = v !== null && (v < 1 || v > max) ? `Enter a value between 1 and ${max}.` : null;
  return (
    <GoalCard icon="acos" title="Target ACOS" htmlFor="ccd-obj-acos" optional hint="The advertising cost of sale you are aiming for." error={error} note={`Allowed range: 1–${max}%`}>
      <NumberField id="ccd-obj-acos" value={v} placeholder="25" suffix="%" error={Boolean(error)} onChange={(n) => onChange({ targetAcos: n })} />
    </GoalCard>
  );
}

function BiddingCard({ draft, onChange }: { draft: CcDraft; onChange: Patch }) {
  const options = BIDDING_STRATEGIES[draft.marketplace ?? 'amazon'];
  const value = options.includes(draft.biddingStrategy) ? draft.biddingStrategy : options[0];
  return (
    <GoalCard icon="bidding" title="Bidding strategy" htmlFor="ccd-obj-bidding" hint={BIDDING_HINT[value]}>
      <select id="ccd-obj-bidding" className="ccd-input ccd-date" value={value} onChange={(e) => onChange({ biddingStrategy: e.target.value as BiddingStrategy })}>
        {options.map((b) => <option key={b} value={b}>{b}</option>)}
      </select>
    </GoalCard>
  );
}

// ── Amazon ────────────────────────────────────────────────────────────────────────────────────

function AmazonObjectives({ draft, onChange, issue }: { draft: CcDraft; onChange: Patch; issue: Issue }) {
  const cap = MARKETPLACE_CAPABILITY.amazon;
  const budgetError = issue && draft.dailyBudget < issue.min ? issue.message
    : draft.dailyBudget < cap.minDailyBudget ? `The minimum for this marketplace is ${formatCurrency(cap.minDailyBudget)}.` : null;
  const badPlacement = PLACEMENT_FIELDS.some(([key]) => { const v = draft.placementAdjust[key]; return v !== null && (v < 0 || v > 900); });
  return (
    <div className="ccd-goal-grid">
      <StartDateCard draft={draft} onChange={onChange} />
      <EndDateCard draft={draft} onChange={onChange} />
      <GoalCard
        icon="budget" title="Daily budget" htmlFor="ccd-obj-budget" error={budgetError} note={`Minimum ${formatCurrency(cap.minDailyBudget)} a day`}
        hint="How much you are happy to spend across all the new campaigns each day."
      >
        <NumberField id="ccd-obj-budget" value={draft.dailyBudget} placeholder="50" prefix="$" suffix="per day" error={Boolean(budgetError)} onChange={(n) => onChange({ dailyBudget: Math.max(0, n ?? 0) })} />
      </GoalCard>

      <AcosCard draft={draft} onChange={onChange} />
      <BiddingCard draft={draft} onChange={onChange} />
      <GoalCard
        icon="layout" title="Adjust bids by placement" optional error={badPlacement ? 'Enter a value from 0 to 900.' : null}
        hint="Raise your bid where ads show, from 0% to 900%. Leave a field empty for no change."
      >
        <div className="ccd-field-list">
          {PLACEMENT_FIELDS.map(([key, text]) => {
            const v = draft.placementAdjust[key];
            return (
              <FieldRow key={key} label={text} htmlFor={`ccd-place-${key}`}>
                <NumberField id={`ccd-place-${key}`} value={v} placeholder="0" suffix="%" min={0} max={900} width={LIST_WIDTH} error={v !== null && (v < 0 || v > 900)} onChange={(n) => onChange({ placementAdjust: { ...draft.placementAdjust, [key]: n } })} />
              </FieldRow>
            );
          })}
        </div>
      </GoalCard>
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
    <GoalCard
      icon="budget" title="Budget" hint={type.hint} error={dailyError ?? totalError}
      note={usesDaily ? `Minimum ${formatCurrency(cap.minDailyBudget)} a day` : undefined}
    >
      <div className="ccd-field-list">
        <FieldRow label="Budget type" htmlFor="ccd-obj-btype">
          <select id="ccd-obj-btype" className="ccd-input ccd-field-select" value={draft.budgetType} onChange={(e) => onChange({ budgetType: e.target.value as BudgetType })}>
            {BUDGET_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </FieldRow>
        {usesDaily && (
          <FieldRow label="Daily budget" htmlFor="ccd-obj-budget">
            <NumberField id="ccd-obj-budget" value={draft.dailyBudget} placeholder="50" prefix="$" width={LIST_WIDTH} error={Boolean(dailyError)} onChange={(n) => onChange({ dailyBudget: Math.max(0, n ?? 0) })} />
          </FieldRow>
        )}
        {usesTotal && (
          <FieldRow label="Total budget" htmlFor="ccd-obj-total">
            <NumberField id="ccd-obj-total" value={draft.totalBudget} placeholder="1500" prefix="$" width={LIST_WIDTH} error={Boolean(totalError)} onChange={(n) => onChange({ totalBudget: n })} />
          </FieldRow>
        )}
        {usesDaily && (
          <FieldRow label={<>Roll over unused <span className="ccd-tm-info" title="Carries what wasn't spent yesterday into today's daily budget."><InfoIcon size={13} color="#8a909b" /></span></>}>
            <div className="ccd-seg" role="radiogroup" aria-label="Roll over unspent daily budget">
              <button type="button" role="radio" aria-checked={draft.budgetRollover} className={draft.budgetRollover ? 'is-on' : ''} onClick={() => onChange({ budgetRollover: true })}>Yes</button>
              <button type="button" role="radio" aria-checked={!draft.budgetRollover} disabled title="Not available at the moment">No</button>
            </div>
          </FieldRow>
        )}
      </div>
    </GoalCard>
  );
}

function ExpandedTargetingCard({ draft, onChange }: { draft: CcDraft; onChange: Patch }) {
  const et = draft.expandedTargeting;
  const options: [keyof typeof et, string][] = [['brandTerms', 'Brand term targeting'], ['complementary', 'Complementary product targeting']];
  return (
    <GoalCard icon="expand" title="Expanded targeting" hint="Extra reach for the Auto campaigns, on top of their own targeting.">
      <div className="ccd-option-list">
        {options.map(([key, text]) => (
          <OptionRow key={key} kind="check" checked={et[key]} label={text} onToggle={() => onChange({ expandedTargeting: { ...et, [key]: !et[key] } })} />
        ))}
      </div>
    </GoalCard>
  );
}

/** As its own card, a list of switches; across the page (`wide`), the same switches side by side. */
function InclusionsCard({ draft, onChange, hasAuto, hasManual, wide }: { draft: CcDraft; onChange: Patch; hasAuto: boolean; hasManual: boolean; wide?: boolean }) {
  const pi = draft.placementInclusion;
  // Buy box can only be turned off for Manual campaigns; Auto campaigns always show there.
  const locked = (key: keyof PlacementInclusion) => key === 'searchInGrid' || (key === 'buyBox' && !hasManual);
  const caption = (key: keyof PlacementInclusion) => (key === 'searchInGrid' ? 'Always on' : key === 'buyBox' && hasAuto ? 'Always on for Auto campaigns' : null);
  return (
    <GoalCard icon="eye" title="Placement inclusions" wide={wide} hint="Choose where you'd like customers to see your ads.">
      <div className={`ccd-option-list${wide ? ' ccd-option-list--across' : ''}`}>
        {INCLUSIONS.map(([key, text, info]) => (
          <OptionRow
            key={key} kind="switch" checked={locked(key) ? true : pi[key]} disabled={locked(key)} label={text} caption={caption(key)} info={info}
            onToggle={() => onChange({ placementInclusion: { ...pi, [key]: !pi[key] } })}
          />
        ))}
      </div>
    </GoalCard>
  );
}

function MultipliersCard({ draft, onChange, hasAuto, hasManual }: { draft: CcDraft; onChange: Patch; hasAuto: boolean; hasManual: boolean }) {
  const bm = draft.bidMultipliers;
  const groups = MULTIPLIER_GROUPS.filter((g) => g.when === 'always' || (g.when === 'auto' ? hasAuto : hasManual));
  const bad = groups.some((g) => g.fields.some(([field]) => { const v = bm[g.key][field]; return v < 0 || v > 900; }));
  return (
    <GoalCard
      icon="multiply" title="Bid multipliers" optional wide error={bad ? 'Enter a value from 0 to 900.' : null}
      hint="Raise bids for a placement or a device, from 0% to 900%. 0% leaves the bid as it is."
    >
      <div className="ccd-gc-groups">
        {groups.map((g) => (
          <fieldset key={g.key} className="ccd-gc-group">
            <legend>{g.title}</legend>
            <div className="ccd-field-list">
              {g.fields.map(([field, text]) => {
                const v = bm[g.key][field];
                return (
                  <FieldRow key={field} label={text} htmlFor={`ccd-mult-${g.key}-${field}`}>
                    <NumberField
                      id={`ccd-mult-${g.key}-${field}`} value={v} placeholder="0" suffix="%" min={0} max={900} width={LIST_WIDTH} error={v < 0 || v > 900}
                      onChange={(n) => onChange({ bidMultipliers: { ...bm, [g.key]: { ...bm[g.key], [field]: n ?? 0 } } })}
                    />
                  </FieldRow>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
    </GoalCard>
  );
}

function WalmartObjectives({ draft, onChange, issue }: { draft: CcDraft; onChange: Patch; issue: Issue }) {
  // The campaign choice (Auto, Manual, or both) decides the Auto-only and Manual-only settings: with both, every
  // setting shows, whatever strategies are ticked on Targeting.
  const mode = draft.campaignMode ?? 'both';
  const hasAuto = mode !== 'manual';
  const hasManual = mode !== 'auto';
  // Three cards a row, every row full. With Auto, Expanded targeting closes row two and the placements take a row of
  // their own; without it, the placements close row two as a card like the rest.
  return (
    <div className="ccd-goal-grid">
      <StartDateCard draft={draft} onChange={onChange} />
      <EndDateCard draft={draft} onChange={onChange} indefiniteBox />
      <BiddingCard draft={draft} onChange={onChange} />

      <WalmartBudgetCard draft={draft} onChange={onChange} issue={issue} />
      <AcosCard draft={draft} onChange={onChange} />
      {hasAuto
        ? <ExpandedTargetingCard draft={draft} onChange={onChange} />
        : <InclusionsCard draft={draft} onChange={onChange} hasAuto={hasAuto} hasManual={hasManual} />}

      {hasAuto && <InclusionsCard draft={draft} onChange={onChange} hasAuto={hasAuto} hasManual={hasManual} wide />}
      <MultipliersCard draft={draft} onChange={onChange} hasAuto={hasAuto} hasManual={hasManual} />
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
