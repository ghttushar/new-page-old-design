// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { MARKETPLACE_CAPABILITY, formatCurrency, type CcDraft, type CcProduct, type ExtraObjectiveId } from '../campaign-creator.types';
import { BAD, BORDER, BRAND, BRAND_TINT, FONT, StepHeading, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';
import { Panel } from '../cc-design';

const glyph = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const icons: Record<string, React.ReactNode> = {
  acos: <path d="M2.5 13.5h11M4 11V8M8 11V4.5M12 11V6.5" />,
  budget: <><rect x="2" y="4" width="12" height="8.5" rx="1.6" /><path d="M2 7h12M10.5 10h1.5" /></>,
  roas: <><rect x="2" y="4" width="12" height="8.5" rx="1.6" /><path d="M5 8.2h6M5 10.4h3" /></>,
  cpc: <><path d="M6 2.5l7.5 6-3.3.7 1.7 3.6-1.6.8-1.7-3.6L6 11.7z" /></>,
  cvr: <><path d="M2.5 3.5h11L9.6 8.4v4l-3.2-1.6V8.4z" /></>,
  cap: <><circle cx="8" cy="8" r="5.6" /><path d="M8 4.8V8l2.2 1.4" /></>,
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

export default function StepObjectives({ draft, onChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const cap = draft.marketplace ? MARKETPLACE_CAPABILITY[draft.marketplace] : null;
  const ex = draft.extraObjectives;

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
                <span style={{ font: `500 11.5px/1 ${FONT}`, color: t.optional ? TEXT_FAINT : BRAND }}>{t.optional ? 'Optional' : 'Required'}</span>
              </div>
              <p style={{ margin: '10px 0 0', minHeight: 40, font: `400 13px/1.55 ${FONT}`, color: TEXT_MUTED }}>{t.hint}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
                {t.unit.prefix && <span style={{ font: `500 14px/1 ${FONT}`, color: TEXT_MUTED }}>{t.unit.prefix}</span>}
                <input
                  id={`cc-obj-${t.id}`} className="cc-input" type="number" inputMode="decimal" step={t.step ?? 1} min={0}
                  value={v ?? ''} placeholder={t.placeholder} onChange={(e) => setValue(t.id, e.target.value)}
                  aria-invalid={Boolean(err)} aria-describedby={`cc-obj-${t.id}-note`}
                  style={{ width: 130, padding: '10px 12px', border: `1px solid ${err ? '#e0a5a0' : BORDER}`, borderRadius: 8, font: `500 14px/1.2 ${FONT}`, color: TEXT_PRIMARY, outline: 'none', background: '#fff' }}
                />
                {t.unit.suffix && <span style={{ font: `400 13px/1 ${FONT}`, color: TEXT_MUTED }}>{t.unit.suffix}</span>}
              </div>

              <p id={`cc-obj-${t.id}-note`} role={err ? 'alert' : undefined} style={{ margin: '10px 0 0', font: `400 12.5px/1.4 ${FONT}`, color: err ? BAD : TEXT_FAINT, minHeight: 17 }}>
                {err ?? t.range}
              </p>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
