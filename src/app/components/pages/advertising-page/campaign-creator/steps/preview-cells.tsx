// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { type CcCampaign, type CcProduct, type PlacementAdjust, type TargetingStrategyId, type BiddingStrategy } from '../campaign-creator.types';
import { BORDER, BRAND, FONT, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

// ── Data the table edits: names, bidding strategy, placement adjustments ──────────────────────

export const typesOf = (c: CcCampaign): TargetingStrategyId[] => Array.from(new Set(c.adGroups.flatMap((ag) => ag.targets.map((t) => t.matchType))));

export type Intention = 'Auto' | 'Research' | 'Performance' | 'Brand' | 'Competitor' | 'Manual';

/** The promotion intention a campaign serves, matching the intent rows of the targeting step. */
export function intentionOf(c: CcCampaign): Intention {
  if (c.kind === 'auto') return 'Auto';
  const t = typesOf(c)[0];
  if (t === 'brand') return 'Brand';
  if (t === 'competitor') return 'Competitor';
  if (t === 'broad' || t === 'phrase' || t === 'category') return 'Research';
  if (t === 'exact' || t === 'product') return 'Performance';
  return 'Manual';
}

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Gives freshly generated campaigns their editable defaults: names, ad group names, bidding strategy and empty placement adjustments. */
export function decorateCampaigns(campaigns: CcCampaign[], products: CcProduct[]): CcCampaign[] {
  return campaigns.map((c) => {
    const types = typesOf(c);
    const asin = c.productIds.length === 1 ? (products.find((p) => p.id === c.productIds[0])?.asin ?? 'ASIN') : 'ALL';
    const autoSub = c.targetingLabel.split(' · ')[1]?.replace(' match', '');
    const suffix = c.kind === 'auto' ? `Auto${autoSub ? `_${autoSub}` : ''}` : types.length === 1 ? cap(types[0]) : 'Manual';
    const agLabel = c.kind === 'auto' ? `${autoSub ?? 'Auto'} match` : types.length === 1 ? cap(types[0]) : 'Mixed';
    const strategy: BiddingStrategy = c.kind === 'auto' || types[0] === 'exact' || types[0] === 'phrase' ? 'Fixed bids' : 'Dynamic bids - down only';
    return {
      ...c,
      name: `${asin}_SP_${suffix}`,
      biddingStrategy: strategy,
      placement: { top: null, product: null, rest: null },
      adGroups: c.adGroups.map((ag, i) => (i === 0 ? { ...ag, name: `ad group_${agLabel}` } : ag)),
    };
  });
}

// ── Cells ─────────────────────────────────────────────────────────────────────────────────────

const ico = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const INTENT_STYLE: Record<Intention, { bg: string; ink: string; icon: React.ReactNode }> = {
  Auto: { bg: '#eaf1fe', ink: '#2f6fed', icon: <><path d="M8 2.4a5.6 5.6 0 1 0 5.6 5.6" /><path d="M8 5.2a2.8 2.8 0 1 0 2.8 2.8" /></> },
  Research: { bg: '#e6f1fd', ink: '#2f8ae8', icon: <><circle cx="7" cy="7" r="4.4" /><path d="M10.4 10.4L14 14" /></> },
  Performance: { bg: '#edf6e3', ink: '#5f9a2c', icon: <><path d="M2 11.5a6 6 0 1 1 12 0" /><path d="M8 11.5l2.6-3.4" /></> },
  Brand: { bg: '#fdf0e3', ink: '#c26a1a', icon: <><path d="M8 1.8l5 1.9v4c0 3.2-2.1 5.2-5 6.5-2.9-1.3-5-3.3-5-6.5v-4z" /></> },
  Competitor: { bg: '#eceefb', ink: '#4b5bb5', icon: <><circle cx="8" cy="8" r="5.2" /><circle cx="8" cy="8" r="1.6" /><path d="M8 1v3M8 12v3M1 8h3M12 8h3" /></> },
  Manual: { bg: '#f1f2f4', ink: '#6b7178', icon: <><path d="M8 2l6 6-6 6-6-6z" /></> },
};

export function IntentionBadge({ intention }: { intention: Intention }) {
  const s = INTENT_STYLE[intention];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 11px 5px 8px', borderRadius: 999, background: s.bg, color: s.ink, font: `600 12px/1.2 ${FONT}` }}>
      <svg width={14} height={14} viewBox="0 0 16 16" aria-hidden {...ico}>{s.icon}</svg>
      {intention}
    </span>
  );
}

const LETTER: Partial<Record<TargetingStrategyId, { text: string; bg: string }>> = {
  exact: { text: 'E', bg: '#77469b' },
  phrase: { text: 'P', bg: '#3d4f6e' },
  broad: { text: 'B', bg: '#2f6fed' },
};

function TypeBadge({ type }: { type: TargetingStrategyId | 'auto' }) {
  const base: React.CSSProperties = { width: 24, height: 24, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', border: '2px solid #fff', marginLeft: -6 };
  const letter = type !== 'auto' ? LETTER[type] : undefined;
  if (letter) return <span style={{ ...base, background: letter.bg, color: '#fff', font: `700 11px/1 ${FONT}` }}>{letter.text}</span>;
  const icon: Record<string, { bg: string; ink: string; node: React.ReactNode }> = {
    auto: { bg: '#d8f3ef', ink: '#1aa596', node: <><path d="M3 6h10M3 10h10" /><circle cx="8" cy="8" r="5.4" /></> },
    category: { bg: '#e6f1fd', ink: '#2f6fed', node: <path d="M2.5 4h2M7 4h6.5M2.5 8h2M7 8h6.5M2.5 12h2M7 12h6.5" /> },
    product: { bg: '#e8ebf2', ink: '#5b6779', node: <><path d="M8 1.8l5.2 2.7v5.4L8 12.6 2.8 9.9V4.5z" /><path d="M2.8 4.5L8 7.2l5.2-2.7M8 7.2v5.4" /></> },
    brand: { bg: '#fdf0e3', ink: '#c26a1a', node: <path d="M8 1.8l5 1.9v4c0 3.2-2.1 5.2-5 6.5-2.9-1.3-5-3.3-5-6.5v-4z" /> },
    competitor: { bg: '#eceefb', ink: '#4b5bb5', node: <><circle cx="8" cy="8" r="5" /><circle cx="8" cy="8" r="1.5" /></> },
  };
  const i = icon[type] ?? icon.product;
  return <span style={{ ...base, background: i.bg, color: i.ink }}><svg width={13} height={13} viewBox="0 0 16 16" aria-hidden {...ico}>{i.node}</svg></span>;
}

/** The kinds of target a campaign holds, written out. */
export function TargetTypeBadges({ campaign }: { campaign: CcCampaign }) {
  const types: (TargetingStrategyId | 'auto')[] = campaign.kind === 'auto' ? ['auto'] : typesOf(campaign);
  return <span style={{ font: `500 12.5px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>{types.map((t) => cap(t)).join(', ')}</span>;
}

/** A text input with a "typed / allowed" counter inside its right edge. */
export function CounterInput({ value, max, onChange, label, prefix, width }: {
  value: string; max: number; onChange: (v: string) => void; label: string; prefix?: string; width?: number | string;
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width, minWidth: 0 }}>
      {prefix && <span style={{ font: `400 12.5px/1 ${FONT}`, color: TEXT_FAINT, whiteSpace: 'nowrap' }}>{prefix}</span>}
      <span style={{ position: 'relative', flex: 1, minWidth: 0, display: 'block' }}>
        <input
          className="cc-input" value={value} maxLength={max} onChange={(e) => onChange(e.target.value)} aria-label={label}
          style={{ width: '100%', padding: '8px 52px 8px 10px', border: `1px solid ${BORDER}`, borderRadius: 7, font: `400 13px/1.2 ${FONT}`, color: TEXT_PRIMARY, outline: 'none', background: '#fff' }}
        />
        <span className="cc-num" style={{ position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)', font: `400 11px/1 ${FONT}`, color: TEXT_FAINT, pointerEvents: 'none' }}>{value.length}/{max}</span>
      </span>
    </span>
  );
}

const fmtPct = (n: number | null) => (n === null ? '--' : `${n > 0 ? '+' : ''}${n}%`);

/** Shows the three placement adjustments, with a pencil that opens a small editor. */
export function PlacementCell({ value, onChange, campaignName }: { value: PlacementAdjust; onChange: (v: PlacementAdjust) => void; campaignName: string }) {
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const [draft, setDraft] = useState<PlacementAdjust>(value);
  const rows: [keyof PlacementAdjust, string][] = [['top', 'Top of search (first page)'], ['product', 'Product pages'], ['rest', 'Rest of search']];

  const close = () => setAnchor(null);
  const left = anchor ? Math.max(8, Math.min(anchor.left - 280, window.innerWidth - 320)) : 0;
  const top = anchor ? Math.min(anchor.bottom + 6, window.innerHeight - 260) : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
      <div style={{ font: `400 12px/1.65 ${FONT}`, color: TEXT_MUTED, whiteSpace: 'nowrap' }}>
        {rows.map(([k, label]) => <div key={k}>{label}: <span className="cc-num" style={{ color: value[k] === null ? TEXT_FAINT : TEXT_PRIMARY, fontWeight: value[k] === null ? 400 : 600 }}>{fmtPct(value[k])}</span></div>)}
      </div>
      <button
        type="button" aria-label={`Edit placement bids for ${campaignName}`} title="Adjust bids by placement"
        onClick={(e) => { setDraft(value); setAnchor(e.currentTarget.getBoundingClientRect()); }}
        style={{ flex: 'none', width: 24, height: 24, padding: 0, border: 'none', background: 'none', color: BRAND, cursor: 'pointer', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg width={14} height={14} viewBox="0 0 16 16" aria-hidden {...ico}><path d="M2.5 13.5l.7-3 7.6-7.6a1.4 1.4 0 0 1 2 0l.3.3a1.4 1.4 0 0 1 0 2l-7.6 7.6z" /></svg>
      </button>
      {anchor && createPortal(
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 239 }} onMouseDown={close} />
          <div role="dialog" aria-label="Adjust bids by placement" className="cc-enter" onMouseDown={(e) => e.stopPropagation()} style={{ position: 'fixed', top, left, width: 300, padding: 16, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, boxShadow: '0 16px 36px rgba(20,24,33,.2)', zIndex: 240, fontFamily: FONT }}>
            <div style={{ font: `600 13px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>Adjust bids by placement</div>
            <div style={{ font: `400 12px/1.5 ${FONT}`, color: TEXT_MUTED, margin: '3px 0 12px' }}>Raise or lower the bid for a placement, from -90% to +900%. Leave blank for no change.</div>
            {rows.map(([k, label]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '6px 0', font: `400 12.5px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>
                {label}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  <input
                    className="cc-input cc-num" type="number" min={-90} max={900} value={draft[k] ?? ''} placeholder="0"
                    onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value === '' ? null : Math.max(-90, Math.min(900, Number(e.target.value))) }))}
                    style={{ width: 70, padding: '6px 8px', border: `1px solid ${BORDER}`, borderRadius: 6, font: `500 13px/1 ${FONT}`, outline: 'none', textAlign: 'right' }}
                  />
                  <span style={{ color: TEXT_FAINT }}>%</span>
                </span>
              </label>
            ))}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, marginTop: 12 }}>
              <button type="button" onClick={() => { onChange({ top: null, product: null, rest: null }); close(); }} style={{ padding: 0, border: 'none', background: 'none', color: TEXT_MUTED, font: `600 12.5px/1 ${FONT}`, cursor: 'pointer' }}>Clear</button>
              <button type="button" onClick={close} style={{ padding: 0, border: 'none', background: 'none', color: TEXT_MUTED, font: `600 12.5px/1 ${FONT}`, cursor: 'pointer' }}>Cancel</button>
              <button type="button" onClick={() => { onChange(draft); close(); }} style={{ padding: '7px 14px', border: 'none', borderRadius: 7, background: BRAND, color: '#fff', font: `600 12.5px/1 ${FONT}`, cursor: 'pointer' }}>Save</button>
            </div>
          </div>
        </>,
        document.body,
      )}
    </div>
  );
}
