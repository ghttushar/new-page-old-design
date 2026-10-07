// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { AnimatePresence, motion } from 'motion/react';
import { STRUCTURE_CATALOG, TARGETING_STRATEGY_CATALOG, formatCurrency, type CcDraft, type CcProduct, type CcStepId } from './campaign-creator.types';
import { BORDER, BRAND, CheckIcon, FONT, GOOD, HAIR, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from './campaign-creator-ui';
export { CampaignSummaryProvider } from './campaign-summary-context';

/** Signals' page tint — what every card sits on. */
export const PAGE_TINT = '#f3f5fa';
export const DISPLAY = "'Inter Tight', Inter, sans-serif";

// ── Card ──────────────────────────────────────────────────────────────────────────────────────

/** A white surface. An optional title becomes a quiet header row with a hairline under it. */
export function Panel({ children, title, aside, pad = 20, style, className }: {
  children: React.ReactNode; title?: React.ReactNode; aside?: React.ReactNode; pad?: number | string; style?: React.CSSProperties; className?: string;
}) {
  return (
    <section className={`cc-panel ${className ?? ''}`} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', minWidth: 0, ...style }}>
      {title && (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 20px', borderBottom: `1px solid ${HAIR}` }}>
          <h2 style={{ margin: 0, font: `600 14px/1.3 ${DISPLAY}`, color: TEXT_PRIMARY, letterSpacing: '-0.01em' }}>{title}</h2>
          {aside}
        </header>
      )}
      <div style={{ padding: pad }}>{children}</div>
    </section>
  );
}

// ── Top-bar stepper ───────────────────────────────────────────────────────────────────────────

interface StepDef { id: CcStepId; label: string }

/** Compact numbered segments for the top bar; reached steps stay clickable. */
export function Stepper({ steps, current, furthestIndex, onJump }: {
  steps: StepDef[]; current: CcStepId; furthestIndex: number; onJump: (id: CcStepId) => void;
}) {
  const ci = steps.findIndex((s) => s.id === current);
  return (
    <ol aria-label="Campaign creation steps" className="cc-journey">
      {steps.map((s, i) => {
        const active = i === ci;
        const done = i < ci;
        const reachable = i <= furthestIndex;
        const next = i === ci + 1;
        return (
          <li key={s.id} className={`cc-journey__step ${active ? 'is-active' : done ? 'is-done' : next ? 'is-next' : ''}`}>
            {i > 0 && <span aria-hidden className="cc-journey__rail"><motion.span initial={false} animate={{ scaleX: done || active ? 1 : 0 }} transition={{ type: 'spring', stiffness: 180, damping: 25 }} /></span>}
            <button type="button" onClick={() => reachable && onJump(s.id)} disabled={!reachable} aria-current={active ? 'step' : undefined} className="cc-btn cc-journey__button">
              {active && <motion.span layoutId="cc-journey-active" className="cc-journey__active" transition={{ type: 'spring', stiffness: 380, damping: 31 }} />}
              <span className="cc-journey__node">
                {done ? <span className="cc-pop" style={{ display: 'flex' }}><CheckIcon size={11} /></span> : i + 1}
              </span>
              <span className="cc-journey__copy"><small>{done ? 'Complete' : active ? 'In progress' : next ? 'Up next' : `Step ${i + 1}`}</small><strong>{s.label}</strong></span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

// ── Previous-step summary (kept for reference by other modules) ────────────────────────────────

export interface SummaryItem { id: CcStepId; label: string; value: string; sub?: string }

export function summaryFor(step: CcStepId, draft: CcDraft, selectedProducts: CcProduct[]): SummaryItem[] {
  const n = selectedProducts.length;
  const items: SummaryItem[] = [];
  if (step === 'products') items.push({ id: 'entry', label: 'Ad type', value: 'Sponsored Products', sub: 'Amazon' });
  if (['objectives', 'targeting', 'structure'].includes(step)) {
    items.push({ id: 'products', label: 'Products', value: `${n} product${n === 1 ? '' : 's'} selected` });
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

// ── Live campaign summary (right column) ──────────────────────────────────────────────────────

const ORDER: CcStepId[] = ['entry', 'products', 'objectives', 'targeting', 'structure'];

/** Rows for the live summary: every step's choice, filled in once that step has been passed. */
function liveRows(step: CcStepId, draft: CcDraft, selectedProducts: CcProduct[]) {
  const ci = ORDER.indexOf(step);
  const passed = (id: CcStepId) => ORDER.indexOf(id) < ci;
  const n = selectedProducts.length;
  const extras = Object.values(draft.extraObjectives).filter((v) => v !== null).length;
  const names = draft.targetingStrategies.map((s) => TARGETING_STRATEGY_CATALOG[s].label.replace('Keyword — ', ''));
  const structure = STRUCTURE_CATALOG.find((s) => s.id === draft.structureId);
  return [
    { id: 'entry', label: 'Ad type', set: passed('entry'), value: 'Sponsored Products', sub: 'Amazon' },
    { id: 'products', label: 'Products', set: passed('products'), value: `${n} product${n === 1 ? '' : 's'}`, sub: selectedProducts.slice(0, 2).map((p) => p.name ?? p.title).filter(Boolean).join(', ') || undefined },
    { id: 'objectives', label: 'Goals', set: passed('objectives'), value: `${formatCurrency(draft.dailyBudget)} / day`, sub: [draft.targetAcos != null ? `${draft.targetAcos}% target ACOS` : 'No ACOS target', ...(extras ? [`+${extras} more`] : [])].join(' · ') },
    { id: 'targeting', label: 'Targeting', set: passed('targeting'), value: names.length ? names.join(', ') : 'None', sub: draft.targetingStrategies.includes('auto') ? `${draft.autoTypes.length} Auto type${draft.autoTypes.length === 1 ? '' : 's'}` : undefined },
    { id: 'structure', label: 'Structure', set: passed('structure'), value: structure ? structure.name : draft.structureId === 'custom' ? 'Custom' : '—', sub: structure?.tagline },
  ] as { id: CcStepId; label: string; set: boolean; value: string; sub?: string }[];
}

export function LiveSummary({ step, draft, selectedProducts, onJump }: {
  step: CcStepId; draft: CcDraft; selectedProducts: CcProduct[]; onJump: (id: CcStepId) => void;
}) {
  const rows = liveRows(step, draft, selectedProducts);
  const done = rows.filter((r) => r.set).length;
  return (
    <aside className="cc-summary" style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--cc-shadow-card)' }}>
      <div style={{ padding: '18px 20px 16px', background: 'var(--cc-summary-head)', color: '#fff' }}>
        <div style={{ font: `600 10.5px/1 ${FONT}`, letterSpacing: '.12em', textTransform: 'uppercase', opacity: 0.75 }}>Your campaign</div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span className="cc-num" style={{ font: `700 28px/1 ${DISPLAY}`, letterSpacing: '-0.02em' }}>{done}</span>
          <span style={{ font: `500 13px/1 ${FONT}`, opacity: 0.8 }}>of {rows.length} decisions made</span>
        </div>
        <div style={{ marginTop: 14, height: 4, borderRadius: 4, background: 'rgba(255,255,255,.2)', overflow: 'hidden' }}>
          <motion.div initial={false} animate={{ width: `${(done / rows.length) * 100}%` }} transition={{ type: 'spring', stiffness: 180, damping: 26 }} style={{ height: '100%', borderRadius: 4, background: '#fff' }} />
        </div>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 8 }}>
        {rows.map((r) => {
          const current = r.id === step;
          return (
            <li key={r.id}>
              <button type="button" disabled={!r.set} onClick={() => r.set && onJump(r.id)} className={r.set ? 'cc-row' : undefined} title={r.set ? `Edit ${r.label.toLowerCase()}` : undefined}
                style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 12, padding: '11px 12px', border: 'none', borderRadius: 12, textAlign: 'left', background: current ? 'var(--cc-brand-tint)' : 'transparent', cursor: r.set ? 'pointer' : 'default' }}>
                <span style={{ flex: 'none', marginTop: 1, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: r.set ? '#e8f6ee' : current ? '#fff' : '#f3f4f7', boxShadow: r.set ? 'inset 0 0 0 1px #c6e8d4' : current ? `inset 0 0 0 1.5px ${BRAND}` : 'none' }}>
                  {r.set ? <CheckIcon size={11} color={GOOD} /> : current ? <span className="cc-pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND }} /> : null}
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: 'block', font: `600 11px/1.3 ${FONT}`, letterSpacing: '.06em', textTransform: 'uppercase', color: current ? BRAND : TEXT_FAINT }}>{r.label}</span>
                  <AnimatePresence mode="wait" initial={false}>
                    {r.set ? (
                      <motion.span key="v" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} style={{ display: 'block' }}>
                        <span style={{ display: 'block', marginTop: 3, font: `600 13.5px/1.35 ${FONT}`, color: TEXT_PRIMARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.value}</span>
                        {r.sub && <span style={{ display: 'block', marginTop: 1, font: `400 12px/1.4 ${FONT}`, color: TEXT_MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.sub}</span>}
                      </motion.span>
                    ) : (
                      <motion.span key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'block', marginTop: 3, font: `400 13px/1.35 ${FONT}`, color: current ? '#3d434b' : TEXT_FAINT }}>
                        {current ? 'Deciding now…' : 'Not set yet'}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}


/** Legacy horizontal summary — superseded by LiveSummary. */
export function StepSummary(_: { items: SummaryItem[]; onJump: (id: CcStepId) => void }) {
  return null;
}
