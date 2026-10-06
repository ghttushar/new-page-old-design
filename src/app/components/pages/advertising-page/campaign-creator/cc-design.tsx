import { TARGETING_STRATEGY_CATALOG, formatCurrency, type CcDraft, type CcProduct, type CcStepId } from './campaign-creator.types';
import { BORDER, BRAND, CheckIcon, FONT, GOOD, HAIR, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from './campaign-creator-ui';

// The creator follows the Alerts design system: Signals' light page tint, with each block on its own white card
// (1px #e6e8ec border, 10px radius, #fafbfd header band).

/** Signals' page tint — what every card sits on. */
export const PAGE_TINT = '#f3f5fa';

// ── Card ──────────────────────────────────────────────────────────────────────────────────────

/** A white card on the page tint, drawn the way Alerts draws its panels. An optional title becomes a tinted header band. */
export function Panel({ children, title, aside, pad = 20, style, className }: {
  children: React.ReactNode; title?: React.ReactNode; aside?: React.ReactNode; pad?: number | string; style?: React.CSSProperties; className?: string;
}) {
  return (
    <section className={className} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden', minWidth: 0, ...style }}>
      {title && (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '11px 18px', background: '#fafbfd', borderBottom: `1px solid ${HAIR}` }}>
          <h2 style={{ margin: 0, font: `600 13px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>{title}</h2>
          {aside}
        </header>
      )}
      <div style={{ padding: pad }}>{children}</div>
    </section>
  );
}

// ── Stepper ───────────────────────────────────────────────────────────────────────────────────

interface StepDef { id: CcStepId; label: string }

const iconStroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const STEP_ICONS: Partial<Record<CcStepId, React.ReactNode>> = {
  products: <><path d="M10 2.2l6.4 3.2v7.2L10 15.8 3.6 12.6V5.4z" /><path d="M3.6 5.4L10 8.6l6.4-3.2M10 8.6v7.2" /></>,
  objectives: <><circle cx="10" cy="10" r="7" /><circle cx="10" cy="10" r="3.6" /><circle cx="10" cy="10" r=".9" fill="currentColor" /></>,
  targeting: <><circle cx="10" cy="10" r="5.4" /><path d="M10 1.8v3.4M10 14.8v3.4M1.8 10h3.4M14.8 10h3.4" /></>,
  structure: <><rect x="7" y="2.2" width="6" height="4.2" rx="1.2" /><rect x="1.8" y="13.6" width="6" height="4.2" rx="1.2" /><rect x="12.2" y="13.6" width="6" height="4.2" rx="1.2" /><path d="M10 6.4v3.4M4.8 13.6V9.8h10.4v3.8" /></>,
  preview: <><path d="M1.8 10S5 4.6 10 4.6 18.2 10 18.2 10 15 15.4 10 15.4 1.8 10 1.8 10z" /><circle cx="10" cy="10" r="2.6" /></>,
};

/** Large icon circles joined by lines, centred; reached steps stay clickable so nothing is lost going back. */
export function Stepper({ steps, current, furthestIndex, onJump }: {
  steps: StepDef[]; current: CcStepId; furthestIndex: number; onJump: (id: CcStepId) => void;
}) {
  const ci = steps.findIndex((s) => s.id === current);
  return (
    <ol aria-label="Campaign creation steps" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', rowGap: 14 }}>
      {steps.map((s, i) => {
        const active = i === ci;
        const done = i < ci;
        const reachable = i <= furthestIndex;
        return (
          <li key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
            <button type="button" onClick={() => reachable && onJump(s.id)} disabled={!reachable} aria-current={active ? 'step' : undefined} style={{ padding: 0, border: 'none', background: 'none', display: 'flex', alignItems: 'center', gap: 12, cursor: reachable ? 'pointer' : 'default' }}>
              <span style={{ position: 'relative', width: 40, height: 40, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? GOOD : active ? BRAND : '#fff', border: `1.5px solid ${done ? GOOD : active ? BRAND : '#d5d9e0'}`, color: done || active ? '#fff' : TEXT_FAINT, boxShadow: active ? '0 0 0 4px rgba(119,70,155,.14)' : 'none', transition: 'background-color 160ms ease-out, border-color 160ms ease-out, box-shadow 160ms ease-out' }}>
                <svg width={19} height={19} viewBox="0 0 20 20" aria-hidden {...iconStroke}>{STEP_ICONS[s.id]}</svg>
                {done && (
                  <span style={{ position: 'absolute', right: -3, bottom: -3, width: 16, height: 16, borderRadius: '50%', background: '#fff', border: `1.5px solid ${GOOD}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckIcon size={9} color={GOOD} /></span>
                )}
              </span>
              <span style={{ font: `${active ? 600 : 500} 14.5px/1.2 ${FONT}`, color: active ? TEXT_PRIMARY : reachable ? '#3d434b' : TEXT_FAINT }}>{s.label}</span>
            </button>
            {i < steps.length - 1 && <span aria-hidden style={{ width: 64, height: 2, margin: '0 18px', borderRadius: 2, background: done ? '#bfe0cb' : '#e3e5ea', flex: 'none' }} />}
          </li>
        );
      })}
    </ol>
  );
}

// ── Previous-step summary ─────────────────────────────────────────────────────────────────────

export interface SummaryItem { id: CcStepId; label: string; value: string; sub?: string }

/** What was chosen on the steps before `step` (empty on the preview, which has its own review). */
export function summaryFor(step: CcStepId, draft: CcDraft, selectedProducts: CcProduct[]): SummaryItem[] {
  const n = selectedProducts.length;
  const items: SummaryItem[] = [];
  if (step === 'products') items.push({ id: 'entry', label: 'Ad type', value: 'Sponsored Products', sub: 'Amazon' });
  if (['objectives', 'targeting', 'structure'].includes(step)) {
    items.push({ id: 'products', label: 'Products', value: `${n} product${n === 1 ? '' : 's'} selected`, sub: draft.groupingMode === 'split-by-ad-group' ? 'Split by ad group' : 'Split by campaign' });
  }
  if (['targeting', 'structure'].includes(step)) {
    const extras = Object.values(draft.extraObjectives).filter((v) => v !== null).length;
    items.push({
      id: 'objectives', label: 'Goals', value: `${formatCurrency(draft.dailyBudget)} a day`,
      sub: [draft.targetAcos != null ? `${draft.targetAcos}% target ACOS` : 'No ACOS target', ...(extras ? [`+${extras} more`] : [])].join(' · '),
    });
  }
  if (step === 'structure') {
    const names = draft.targetingStrategies.map((s) => TARGETING_STRATEGY_CATALOG[s].label.replace('Keyword — ', ''));
    items.push({ id: 'targeting', label: 'Targeting', value: names.length ? names.join(', ') : 'None yet', sub: draft.targetingStrategies.includes('auto') ? `${draft.autoTypes.length} Auto type${draft.autoTypes.length === 1 ? '' : 's'}` : undefined });
  }
  return items;
}

/** One bar listing what was chosen on the earlier steps; each item jumps back to its step. */
export function StepSummary({ items, onJump }: { items: SummaryItem[]; onJump: (id: CcStepId) => void }) {
  if (items.length === 0) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, marginBottom: 26, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', background: '#fafbfd', borderRight: `1px solid ${BORDER}`, font: `600 11px/1.2 ${FONT}`, letterSpacing: '.06em', textTransform: 'uppercase', color: TEXT_MUTED }}>So far</div>
      {items.map((it, i) => (
        <button key={it.id} type="button" className="cc-row" onClick={() => onJump(it.id)} title={`Edit ${it.label.toLowerCase()}`} style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', padding: '12px 16px', border: 'none', borderLeft: i === 0 ? 'none' : `1px solid ${HAIR}`, background: 'none', cursor: 'pointer' }}>
          <CheckIcon size={14} color={GOOD} />
          <span style={{ minWidth: 0 }}>
            <span style={{ display: 'block', font: `500 11.5px/1.3 ${FONT}`, color: TEXT_MUTED }}>{it.label}</span>
            <span style={{ display: 'block', font: `600 13px/1.35 ${FONT}`, color: TEXT_PRIMARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.value}</span>
            {it.sub && <span style={{ display: 'block', font: `400 11.5px/1.35 ${FONT}`, color: TEXT_FAINT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.sub}</span>}
          </span>
        </button>
      ))}
    </div>
  );
}
