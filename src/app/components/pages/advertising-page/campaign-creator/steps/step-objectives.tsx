// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { BIDDING_STRATEGIES, MARKETPLACE_CAPABILITY, formatCurrency, todayIso, type BiddingStrategy, type CcDraft, type CcProduct, type ExtraObjectiveId, type PlacementAdjust, type PlacementInclusion } from '../campaign-creator.types';
import { BAD, BORDER, BRAND, BRAND_TINT, FONT, InfoIcon, StepHeading, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';
import { Panel } from '../cc-design';

const glyph = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const icons: Record<string, React.ReactNode> = {
  acos: <path d="M2.5 13.5h11M4 11V8M8 11V4.5M12 11V6.5" />,
  budget: <><rect x="2" y="4" width="12" height="8.5" rx="1.6" /><path d="M2 7h12M10.5 10h1.5" /></>,
  roas: <><rect x="2" y="4" width="12" height="8.5" rx="1.6" /><path d="M5 8.2h6M5 10.4h3" /></>,
  cpc: <><path d="M6 2.5l7.5 6-3.3.7 1.7 3.6-1.6.8-1.7-3.6L6 11.7z" /></>,
  cvr: <><path d="M2.5 3.5h11L9.6 8.4v4l-3.2-1.6V8.4z" /></>,
  cap: <><circle cx="8" cy="8" r="5.6" /><path d="M8 4.8V8l2.2 1.4" /></>,
  date: <><rect x="2" y="3" width="12" height="10.5" rx="2" /><path d="M2 6.5h12M5.5 1.8v2.6M10.5 1.8v2.6" /></>,
  bidding: <><path d="M2.5 11.5l3.4-3.8 2.4 2L13.5 4" /><path d="M10 4h3.5v3.5" /></>,
  eye: <><path d="M1.5 8s2.3-4.5 6.5-4.5S14.5 8 14.5 8s-2.3 4.5-6.5 4.5S1.5 8 1.5 8z" /><circle cx="8" cy="8" r="1.9" /></>,
  layout: <><rect x="2" y="2.5" width="12" height="4" rx="1.2" /><rect x="2" y="9" width="5.4" height="4.5" rx="1.2" /><rect x="8.6" y="9" width="5.4" height="4.5" rx="1.2" /></>,
};

interface Tile {
  id: 'acos' | 'budget' | ExtraObjectiveId;
  label: string;
  hint: string;
  unit: { prefix?: string; suffix?: string };
  placeholder: string;
  range: string;
  optional?: boolean;
  step?: number;
}

const TILES: Tile[] = [
  { id: 'acos', label: 'Target ACOS', hint: 'The advertising cost of sale you are aiming for.', unit: { suffix: '%' }, placeholder: '25', range: 'Allowed range: 1–90%', optional: true },
  { id: 'budget', label: 'Daily budget', hint: 'How much you are happy to spend across all the new campaigns each day.', unit: { prefix: '$', suffix: 'per day' }, placeholder: '50', range: '' },
  { id: 'roas', label: 'Total budget', hint: 'The most you want to spend across all the new campaigns, in total.', unit: { prefix: '$' }, placeholder: '1,500', range: 'Must be at least your daily budget', optional: true },
  { id: 'maxCpc', label: 'Max CPC bid', hint: 'The most you will pay for a single click on any target.', unit: { prefix: '$' }, placeholder: '1.50', range: 'Allowed range: $0.02–$50', optional: true, step: 0.01 },
  { id: 'cvr', label: 'Minimum conversion rate', hint: 'Targets converting below this rate become candidates to pause.', unit: { suffix: '%' }, placeholder: '8', range: 'Allowed range: 0.1–100%', optional: true, step: 0.1 },
  { id: 'monthlyCap', label: 'Monthly spend cap', hint: 'A hard ceiling on spend across the month, whatever the daily budget.', unit: { prefix: '$', suffix: 'per month' }, placeholder: '1,500', range: 'Must be at least your daily budget', optional: true },
];

/** The goals the page offers. The other tiles above stay defined so one can be brought back by adding its id here. */
const SHOWN: Tile['id'][] = ['acos', 'budget', 'roas'];

const HINT = { margin: '10px 0 0', minHeight: 40, font: `400 13px/1.55 ${FONT}`, color: TEXT_MUTED } as const;
const NOTE = { margin: '10px 0 0', font: `400 12.5px/1.4 ${FONT}`, minHeight: 17 } as const;

const BIDDING_HINT: Record<BiddingStrategy, string> = {
  'Fixed bids': 'Your bid stays as you set it and is never changed for you.',
  'Dynamic bids - down only': 'Bids are lowered in real time when an ad is less likely to convert.',
  'Dynamic bids - up and down': 'Bids go up when an ad is more likely to convert and down when it is less likely.',
};

const BUDGET_MODES: { id: 'total' | 'division'; title: string; text: string; parts: [number, number][] }[] = [
  { id: 'total', title: 'Total campaign', text: 'One total shared by all the new campaigns.', parts: [[0, 100]] },
  { id: 'division', title: 'Campaign division', text: 'The total is split across each campaign.', parts: [[0, 44], [48, 24], [76, 24]] },
];

const PLACEMENT_FIELDS: [keyof PlacementAdjust, string][] = [['top', 'Top of search (first page)'], ['product', 'Product pages'], ['rest', 'Rest of search']];
const PLACEMENT_SWITCHES: [keyof PlacementInclusion, string, string][] = [
  ['searchInGrid', 'Search in-grid', 'Ads shown inside the grid of search results. This placement is always on.'],
  ['buyBox', 'Buy box', 'Ads shown beside the Buy Box on a product page.'],
  ['searchCarousel', 'Search carousel', 'Ads shown in a carousel within search results.'],
  ['itemCarousel', 'Item carousel', 'Ads shown in a carousel on item pages.'],
];

function CardHead({ icon, label, htmlFor }: { icon: string; label: string; htmlFor?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 30, height: 30, borderRadius: 8, background: BRAND_TINT, color: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden {...glyph}>{icons[icon]}</svg>
      </span>
      {htmlFor ? <label htmlFor={htmlFor} style={{ flex: 1, font: `600 14px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>{label}</label> : <h2 style={{ flex: 1, margin: 0, font: `600 14px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>{label}</h2>}
    </div>
  );
}

export default function StepObjectives({ draft, onChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const cap = draft.marketplace ? MARKETPLACE_CAPABILITY[draft.marketplace] : null;
  const ex = draft.extraObjectives;

  const startError = draft.startDate && draft.startDate < todayIso() ? "The start date can't be in the past." : null;
  const endError = draft.endDate && draft.endDate < draft.startDate ? 'The end date is before the start date.' : null;

  const value = (id: Tile['id']): number | null => (id === 'acos' ? draft.targetAcos : id === 'budget' ? draft.dailyBudget : ex[id]);
  function setValue(id: Tile['id'], raw: string) {
    const n = raw.trim() === '' ? null : Number(raw);
    if (id === 'acos') onChange({ targetAcos: n !== null && Number.isNaN(n) ? draft.targetAcos : n });
    else if (id === 'budget') onChange({ dailyBudget: Math.max(0, n ?? 0) });
    else onChange({ extraObjectives: { ...ex, [id]: n !== null && Number.isNaN(n) ? ex[id] : n } });
  }

  function errorFor(id: Tile['id']): string | null {
    const v = value(id);
    if (id === 'budget') return cap && draft.dailyBudget < cap.minDailyBudget ? `The minimum for this marketplace is ${formatCurrency(cap.minDailyBudget)}.` : null;
    if (v === null) return null;
    if (id === 'acos') return v < 1 || v > (cap?.maxTargetAcos ?? 90) ? `Enter a value between 1 and ${cap?.maxTargetAcos ?? 90}.` : null;
    if (id === 'roas') return v < draft.dailyBudget ? 'The total budget is below your daily budget.' : null;
    if (id === 'maxCpc') return v < 0.02 || v > 50 ? 'Enter a value between $0.02 and $50.' : null;
    if (id === 'cvr') return v < 0.1 || v > 100 ? 'Enter a value between 0.1 and 100.' : null;
    if (id === 'monthlyCap') return v < draft.dailyBudget ? 'The monthly cap is below your daily budget.' : null;
    return null;
  }

  return (
    <div>
      <StepHeading title="Set your goals" />

      <div className="cc-goal-grid">
        {TILES.filter((t) => SHOWN.includes(t.id)).map((t) => {
          const err = errorFor(t.id);
          const v = value(t.id);
          return (
            <Panel key={t.id} pad={18} className={`cc-goal-card cc-goal-card--${t.id}`} style={err ? { borderColor: '#e0a5a0' } : undefined}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: BRAND_TINT, color: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                  <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden {...glyph}>{icons[t.id === 'maxCpc' ? 'cpc' : t.id === 'monthlyCap' ? 'cap' : t.id]}</svg>
                </span>
                <label htmlFor={`cc-obj-${t.id}`} style={{ flex: 1, font: `600 14px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>{t.label}</label>
              </div>
              <p style={{ margin: '10px 0 0', minHeight: 40, font: `400 13px/1.55 ${FONT}`, color: TEXT_MUTED }}>{t.id === 'roas' ? BUDGET_MODES.find((m) => m.id === draft.totalBudgetMode)?.text : t.hint}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
                {t.unit.prefix && <span style={{ font: `500 14px/1 ${FONT}`, color: TEXT_MUTED }}>{t.unit.prefix}</span>}
                <input
                  id={`cc-obj-${t.id}`} className="cc-input" type="number" inputMode="decimal" step={t.step ?? 1} min={0}
                  value={v ?? ''} placeholder={t.placeholder} onChange={(e) => setValue(t.id, e.target.value)}
                  aria-invalid={Boolean(err)} aria-describedby={`cc-obj-${t.id}-note`}
                  style={{ width: 130, padding: '10px 12px', border: `1px solid ${err ? '#e0a5a0' : BORDER}`, borderRadius: 8, font: `500 14px/1.2 ${FONT}`, color: TEXT_PRIMARY, outline: 'none', background: '#fff' }}
                />
                {t.unit.suffix && <span style={{ font: `400 13px/1 ${FONT}`, color: TEXT_MUTED }}>{t.unit.suffix}</span>}
                {t.id === 'roas' && (
                  <select
                    className="cc-input cc-bsel" aria-label="How the total budget is used" value={draft.totalBudgetMode}
                    onChange={(e) => onChange({ totalBudgetMode: e.target.value })}
                  >
                    {BUDGET_MODES.map(({ id, title }) => <option key={id} value={id}>{title}</option>)}
                  </select>
                )}
              </div>

              <p id={`cc-obj-${t.id}-note`} role={err ? 'alert' : undefined} style={{ margin: t.id === 'roas' && !err ? 0 : '10px 0 0', font: `400 12.5px/1.4 ${FONT}`, color: err ? BAD : TEXT_FAINT, minHeight: t.id === 'roas' ? 0 : 17 }}>
                {t.id === 'roas' ? (err ?? '') : (err ?? t.range)}
              </p>
            </Panel>
          );
        })}

        <Panel pad={18} className="cc-goal-card">
          <CardHead icon="date" label="Start date" htmlFor="cc-obj-start" />
          <p style={HINT}>The day the new campaigns begin running.</p>
          <input id="cc-obj-start" type="date" className="cc-input cc-date" value={draft.startDate} min={todayIso()} onChange={(e) => onChange({ startDate: e.target.value })} aria-invalid={Boolean(startError)} />
          <p role={startError ? 'alert' : undefined} style={{ ...NOTE, color: startError ? BAD : TEXT_FAINT }}>{startError ?? ''}</p>
        </Panel>

        <Panel pad={18} className="cc-goal-card">
          <CardHead icon="date" label="End date" htmlFor="cc-obj-end" />
          <p style={HINT}>Leave it empty to keep running until you stop the campaigns.</p>
          <input id="cc-obj-end" type="date" className="cc-input cc-date" value={draft.endDate} min={draft.startDate || todayIso()} onChange={(e) => onChange({ endDate: e.target.value })} aria-invalid={Boolean(endError)} />
          <p role={endError ? 'alert' : undefined} style={{ ...NOTE, color: endError ? BAD : TEXT_FAINT }}>{endError ?? ''}</p>
        </Panel>

        <Panel pad={18} className="cc-goal-card">
          <CardHead icon="bidding" label="Bidding strategy" htmlFor="cc-obj-bidding" />
          <p style={HINT}>{BIDDING_HINT[draft.biddingStrategy]}</p>
          <select id="cc-obj-bidding" className="cc-input cc-date" value={draft.biddingStrategy} onChange={(e) => onChange({ biddingStrategy: e.target.value as BiddingStrategy })}>
            {BIDDING_STRATEGIES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <p style={NOTE}></p>
        </Panel>

        <div className="cc-goal-pair">
        <Panel pad={18} className="cc-goal-card cc-goal-card--wide">
          <CardHead icon="layout" label="Adjust bids by placement" />
          <p style={HINT}>Raise or lower your bid where ads show, from -90% to +900%. Leave a field empty for no change.</p>
          <div className="cc-place-grid">
            {PLACEMENT_FIELDS.map(([key, text]) => {
              const v = draft.placementAdjust[key];
              const bad = v !== null && (v < -90 || v > 900);
              return (
                <div key={key}>
                  <label htmlFor={`cc-place-${key}`} style={{ display: 'block', margin: '0 0 6px', font: `500 12.5px/1.3 ${FONT}`, color: TEXT_MUTED }}>{text}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      id={`cc-place-${key}`} className="cc-input" type="number" inputMode="decimal" min={-90} max={900} value={v ?? ''} placeholder="0" aria-invalid={bad}
                      onChange={(e) => onChange({ placementAdjust: { ...draft.placementAdjust, [key]: e.target.value === '' ? null : Number(e.target.value) } })}
                      style={{ width: 110, padding: '10px 12px', border: `1px solid ${bad ? '#e0a5a0' : BORDER}`, borderRadius: 8, font: `500 14px/1.2 ${FONT}`, color: TEXT_PRIMARY, outline: 'none', background: '#fff' }}
                    />
                    <span style={{ font: `400 13px/1 ${FONT}`, color: TEXT_MUTED }}>%</span>
                  </div>
                  <p role={bad ? 'alert' : undefined} style={{ ...NOTE, color: bad ? BAD : TEXT_FAINT }}>{bad ? 'Enter a value from -90 to 900.' : ''}</p>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel pad={18} className="cc-goal-card cc-goal-card--wide">
          <CardHead icon="eye" label="Placement inclusion" />
          <p style={HINT}>Choose where you'd like customers to see your ads.</p>
          <div className="cc-pi">
            <div className="cc-pi__cols">
              {PLACEMENT_SWITCHES.map(([key, text, info]) => (
                <div key={key} className="cc-pi__row">
                  <button
                    type="button" role="switch" aria-checked={draft.placementInclusion[key]} aria-label={text} disabled={key === 'searchInGrid'}
                    className={`cc-nm-toggle${draft.placementInclusion[key] ? ' is-on' : ''}`}
                    onClick={() => onChange({ placementInclusion: { ...draft.placementInclusion, [key]: !draft.placementInclusion[key] } })}
                  ><i /></button>
                  <span>{text}</span>
                  <span className="cc-tm-info" title={info}><InfoIcon size={13} color="#8a909b" /></span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
        </div>
      </div>
    </div>
  );
}
