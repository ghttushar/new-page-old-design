import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { type CcCampaign, type CcProduct, type PlacementAdjust, type TargetSource, type TargetingStrategyId, type BiddingStrategy } from '../campaign-creator.types';
import { BORDER, BRAND, FONT, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

// Small pieces shared by the Preview sections: names, labels, the source tag and the number field.

export const typesOf = (c: CcCampaign): TargetingStrategyId[] => Array.from(new Set(c.adGroups.flatMap((ag) => ag.targets.map((t) => t.matchType))));

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Gives freshly generated campaigns their names, ad group names and default bidding strategy. */
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

/** The name a campaign is created under. */
export const campaignLabel = (c: CcCampaign): string => `Anarix_${c.name}`;

/** Match types, written the way a person reads them. */
export const MATCH_LABEL: Record<string, string> = {
  exact: 'Exact', phrase: 'Phrase', broad: 'Broad', brand: 'Brand', competitor: 'Competitor',
  category: 'Category', product: 'Product (ASIN)', auto: 'Automatic',
  'negative-phrase': 'Negative phrase', 'negative-exact': 'Negative exact', 'negative-asin': 'Negative ASIN',
};

export function KindChip({ kind }: { kind: 'auto' | 'manual' }) {
  return <span className={`cc-rl-kind cc-rl-kind--${kind}`}>{kind === 'auto' ? 'Auto' : 'Manual'}</span>;
}

const SOURCE_CLASS: Record<TargetSource, string> = {
  'Anarix recommendation': 'anarix', 'Platform recommendation': 'platform', 'Custom input': 'custom', 'Keyword list': 'list', 'Labels / tags': 'labels',
};
export const sourceClass = (s: TargetSource): string => SOURCE_CLASS[s];

/** Where a targeting item came from (section 8.6). */
export function SourceTag({ source }: { source: TargetSource }) {
  return <span className={`cc-src cc-src--${SOURCE_CLASS[source]}`}>{source}</span>;
}

/** Money reads as 5.60, never 5.6; whole amounts stay whole. */
const fmt = (n: number, money: boolean) => (money && !Number.isInteger(Math.round(n * 100) / 100) ? n.toFixed(2) : String(Math.round(n * 100) / 100));

/** A small number input with an optional $ or % beside it. Typing is free-form; the value is tidied when you leave the field. */
export function NumField({ value, onCommit, label, prefix, suffix, max, width = 72, invalid }: {
  value: number; onCommit: (n: number) => void; label: string; prefix?: string; suffix?: string; max?: number; width?: number; invalid?: boolean;
}) {
  const money = prefix === '$';
  const [text, setText] = useState(fmt(value, money));
  const editing = useRef(false);
  useEffect(() => { if (!editing.current) setText(fmt(value, money)); }, [value, money]);

  return (
    <span className={`cc-nf${invalid ? ' is-invalid' : ''}`}>
      {prefix && <i>{prefix}</i>}
      <input
        className="cc-num" inputMode="decimal" aria-label={label} value={text} style={{ width }}
        onFocus={(e) => { editing.current = true; e.currentTarget.select(); }}
        onChange={(e) => {
          const t = e.target.value;
          if (!/^\d{0,7}(\.\d{0,2})?$/.test(t)) return;
          setText(t);
          const n = parseFloat(t);
          if (!Number.isNaN(n)) onCommit(max != null ? Math.min(max, n) : n);
        }}
        onBlur={() => { editing.current = false; setText(fmt(value, money)); }}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
      />
      {suffix && <i>{suffix}</i>}
    </span>
  );
}

// ── Editable names and placement bids (restored from the original table) ────────────────────

const ico = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

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

/** Shorter names for the table cell; the editor keeps the full wording. */
const CELL_LABEL: Record<keyof PlacementAdjust, string> = { top: 'Top of search', product: 'Product pages', rest: 'Rest of search' };

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
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <div style={{ width: 140, flex: 'none', font: `400 12px/1.65 ${FONT}`, color: TEXT_MUTED, whiteSpace: 'nowrap' }}>
        {rows.map(([k]) => <div key={k}>{CELL_LABEL[k]}: <span className="cc-num" style={{ color: value[k] === null ? TEXT_FAINT : TEXT_PRIMARY, fontWeight: value[k] === null ? 400 : 600 }}>{fmtPct(value[k])}</span></div>)}
      </div>
      <button
        type="button" aria-label={`Edit placement bids for ${campaignName}`}
        onClick={(e) => { setDraft(value); setAnchor(e.currentTarget.getBoundingClientRect()); }}
        style={{ flex: 'none', width: 30, height: 30, padding: 0, border: 'none', background: 'none', color: BRAND, cursor: 'pointer', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
