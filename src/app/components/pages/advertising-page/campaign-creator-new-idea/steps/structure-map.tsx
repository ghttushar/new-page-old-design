// @ts-nocheck -- presentation-only map for the ported creator
import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { type CcCampaign, type CcProduct, type StructureId } from '../campaign-creator.types';

export function groupCampaigns(campaigns: CcCampaign[], products: CcProduct[]) {
  const groups = new Map();
  campaigns.forEach((campaign) => {
    const scoped = campaign.productIds.length === 1;
    const key = scoped ? campaign.productIds[0] : 'all';
    if (!groups.has(key)) {
      const product = scoped ? products.find((item) => item.id === key) : undefined;
      groups.set(key, {
        key,
        title: scoped ? (product?.title ?? 'Product') : `All ${products.length} products`,
        productScoped: scoped,
        campaigns: [],
      });
    }
    groups.get(key)?.campaigns.push(campaign);
  });
  return Array.from(groups.values());
}

// ── what a campaign holds ─────────────────────────────────────────────────────────────────────

const KEYWORD_TYPES = new Set(['brand', 'competitor', 'broad', 'phrase', 'exact']);
/** Always listed in this order, so the same target kind sits in the same place in every column. */
const TARGET_ORDER = ['broad', 'phrase', 'exact', 'brand', 'competitor', 'category', 'product'];
const TARGET_LABEL = { broad: 'Broad', phrase: 'Phrase', exact: 'Exact', brand: 'Brand', competitor: 'Competitor', category: 'Category', product: 'ASIN' };

function describe(campaign: CcCampaign) {
  const kinds = new Set();
  campaign.adGroups.forEach((group) => group.targets.forEach((target) => kinds.add(target.matchType)));
  const targets = TARGET_ORDER.filter((type) => kinds.has(type)).map((type) => ({ type, keyword: KEYWORD_TYPES.has(type) }));
  return { targets };
}

// ── small marks, all drawn at one size ────────────────────────────────────────────────────────

const KeywordGlyph = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 13L7 3h2l4 10M4.6 9.4h6.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const ProductGlyph = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M8 1.8l5.2 2.7v5.4L8 12.6 2.8 9.9V4.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M2.8 4.5L8 7.2l5.2-2.7M8 7.2v5.4" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
);
const GroupGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden><rect x="2.4" y="2.4" width="5.6" height="5.6" rx="1.4" stroke="currentColor" strokeWidth="1.6" /><rect x="10" y="2.4" width="5.6" height="5.6" rx="1.4" stroke="currentColor" strokeWidth="1.6" /><rect x="2.4" y="10" width="5.6" height="5.6" rx="1.4" stroke="currentColor" strokeWidth="1.6" /><rect x="10" y="10" width="5.6" height="5.6" rx="1.4" stroke="currentColor" strokeWidth="1.6" /></svg>
);

function Legend() {
  return (
    <div className="ccn-tr-key" aria-hidden>
      <span><i className="ccn-tr-shape ccn-tr-shape--auto"><b>A</b></i>Auto campaign</span>
      <span><i className="ccn-tr-shape ccn-tr-shape--manual"><b>M</b></i>Manual campaign</span>
      <span><i className="ccn-tr-ag"><GroupGlyph /></i>Ad group</span>
      <span><i className="ccn-tr-pill ccn-tr-pill--kw"><KeywordGlyph /></i>Keyword target</span>
      <span><i className="ccn-tr-pill ccn-tr-pill--pr"><ProductGlyph /></i>Product target</span>
    </div>
  );
}

// ── the tree ──────────────────────────────────────────────────────────────────────────────────

/** Shrinks the tree to the panel's width when it is wide; never enlarges it. */
function Fit({ children }: { children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, height: 0 });
  useLayoutEffect(() => {
    const measure = () => {
      if (!outer.current || !inner.current) return;
      const naturalW = inner.current.offsetWidth || 1;
      const naturalH = inner.current.offsetHeight;
      const scale = Math.max(0.55, Math.min(1, outer.current.clientWidth / naturalW));
      setFit((prev) => (Math.abs(prev.scale - scale) < 0.001 && Math.abs(prev.height - naturalH * scale) < 1 ? prev : { scale, height: naturalH * scale }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (outer.current) observer.observe(outer.current);
    if (inner.current) observer.observe(inner.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={outer} className="ccn-tr-fit" style={{ height: fit.height || undefined }}>
      <div ref={inner} className="ccn-tr-wrap" style={{ transform: `translateX(-50%) scale(${fit.scale})` }}>{children}</div>
    </div>
  );
}

export function StructureMap({ structureId, campaigns, products }: { structureId: StructureId; campaigns: CcCampaign[]; products: CcProduct[] }) {
  if (campaigns.length === 0) return null;
  // One group stands for the whole structure — a per-product structure repeats this same shape for every product.
  const group = groupCampaigns(campaigns, products)[0];
  const n = group.campaigns.length;
  return (
    <div className="ccn-tree-map" data-structure={structureId} aria-label="Campaign hierarchy">
      <Fit>
        <div className="ccn-tr" style={{ gridTemplateColumns: `repeat(${n}, minmax(112px, auto))` }}>
          {/* root */}
          <div className="ccn-tr-root" style={{ gridColumn: `1 / span ${n}`, gridRow: 1 }}>
            <span className="ccn-tr-root__badge">Campaign</span>
            <i className="ccn-tr-link" />
          </div>

          {group.campaigns.map((campaign, i) => {
            const info = describe(campaign);
            const col = i + 1;
            const pos = n === 1 ? 'only' : i === 0 ? 'first' : i === n - 1 ? 'last' : 'mid';
            return (
              <Fragment key={campaign.id}>
                <div className={`ccn-tr-bus ccn-tr-bus--${pos}`} style={{ gridColumn: col, gridRow: 2 }} />
                <div className="ccn-tr-cell" style={{ gridColumn: col, gridRow: 3 }} title={campaign.name}>
                  {campaign.kind === 'auto'
                    ? <span className="ccn-tr-shape ccn-tr-shape--auto"><b>A</b></span>
                    : <span className="ccn-tr-shape ccn-tr-shape--manual"><b>M</b></span>}
                </div>
                <div className="ccn-tr-cell" style={{ gridColumn: col, gridRow: 4 }}>
                  <i className="ccn-tr-link" />
                  <span className="ccn-tr-ag"><GroupGlyph /></span>
                </div>
                <div className="ccn-tr-cell ccn-tr-cell--targets" style={{ gridColumn: col, gridRow: 5 }}>
                  {info.targets.length > 0 && (
                    <>
                      <i className="ccn-tr-link" />
                      <div className="ccn-tr-list">
                        {info.targets.map((target) => (
                          <span key={target.type} className={`ccn-tr-pill ccn-tr-pill--${target.keyword ? 'kw' : 'pr'}`}>
                            {target.keyword ? <KeywordGlyph /> : <ProductGlyph />}{TARGET_LABEL[target.type]}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </Fragment>
            );
          })}
        </div>
      </Fit>
      <Legend />
    </div>
  );
}
