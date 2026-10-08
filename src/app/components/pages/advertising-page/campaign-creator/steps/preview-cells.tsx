import { useEffect, useRef, useState } from 'react';
import { type CcCampaign, type CcProduct, type TargetSource, type TargetingStrategyId, type BiddingStrategy } from '../campaign-creator.types';

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
