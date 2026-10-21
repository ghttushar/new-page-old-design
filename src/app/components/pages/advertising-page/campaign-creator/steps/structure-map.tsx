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
const TARGET_LABEL = { broad: 'Broad', phrase: 'Phrase', exact: 'Exact', brand: 'Brand', competitor: 'Competitor', category: 'Category', product: 'Product targeting' };

/**
 * What a campaign holds, named the way the structure spec (7.2) names it: "Auto campaign" / "Manual — Exact", its ad
 * group, and its targeting. An Auto campaign targets automatically, by its Auto type when it has one of its own.
 */
function describe(campaign: CcCampaign) {
  const kinds = new Set();
  campaign.adGroups.forEach((group) => group.targets.forEach((target) => kinds.add(target.matchType)));
  const types = TARGET_ORDER.filter((type) => kinds.has(type));
  if (campaign.kind === 'auto') {
    const autoType = campaign.targetingLabel.split(' · ')[1];
    return {
      title: autoType ? `Auto — ${autoType}` : 'Auto campaign',
      adGroup: 'Auto ad group',
      targets: [{ type: 'auto', label: autoType ?? 'Automatic targeting', tone: 'auto' }],
    };
  }
  return {
    // One manual campaign holding every type (Consolidated) is just "Manual campaign"; otherwise it is named by its type.
    title: types.length === 1 ? `Manual — ${TARGET_LABEL[types[0]]}` : 'Manual campaign',
    adGroup: types.length === 1 ? 'Ad group' : 'Manual ad group',
    targets: types.map((type) => ({ type, label: TARGET_LABEL[type], tone: KEYWORD_TYPES.has(type) ? 'kw' : 'pr' })),
  };
}

// ── small marks, all drawn at one size ────────────────────────────────────────────────────────

const KeywordGlyph = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 13L7 3h2l4 10M4.6 9.4h6.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const ProductGlyph = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M8 1.8l5.2 2.7v5.4L8 12.6 2.8 9.9V4.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M2.8 4.5L8 7.2l5.2-2.7M8 7.2v5.4" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /></svg>
);
const AutoGlyph = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M8.6 1.8L3.4 9h4l-.6 5.2L12.6 7h-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
);
const GroupGlyph = () => (
  <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden><rect x="2.4" y="2.4" width="5.6" height="5.6" rx="1.4" stroke="currentColor" strokeWidth="1.6" /><rect x="10" y="2.4" width="5.6" height="5.6" rx="1.4" stroke="currentColor" strokeWidth="1.6" /><rect x="2.4" y="10" width="5.6" height="5.6" rx="1.4" stroke="currentColor" strokeWidth="1.6" /><rect x="10" y="10" width="5.6" height="5.6" rx="1.4" stroke="currentColor" strokeWidth="1.6" /></svg>
);

/** The key, listing only the marks this structure actually draws. */
function Legend({ campaigns, perProduct }: { campaigns: CcCampaign[]; perProduct?: boolean }) {
  const tones = new Set(campaigns.flatMap((c) => describe(c).targets.map((t) => t.tone)));
  const has = (kind: string) => campaigns.some((c) => c.kind === kind);
  return (
    <div className="ccd-tr-key" aria-hidden>
      {perProduct && <span><i className="ccd-tr-prod ccd-tr-prod--key"><ProductGlyph /></i>Product</span>}
      {has('auto') && <span><i className="ccd-tr-shape ccd-tr-shape--auto"><b>A</b></i>Auto campaign</span>}
      {has('manual') && <span><i className="ccd-tr-shape ccd-tr-shape--manual"><b>M</b></i>Manual campaign</span>}
      <span><i className="ccd-tr-ag"><GroupGlyph /></i>Ad group</span>
      {tones.has('auto') && <span><i className="ccd-tr-pill ccd-tr-pill--auto"><AutoGlyph /></i>Automatic targeting</span>}
      {tones.has('kw') && <span><i className="ccd-tr-pill ccd-tr-pill--kw"><KeywordGlyph /></i>Keyword target</span>}
      {tones.has('pr') && <span><i className="ccd-tr-pill ccd-tr-pill--pr"><ProductGlyph /></i>Product target</span>}
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
    <div ref={outer} className="ccd-tr-fit" style={{ height: fit.height || undefined }}>
      <div ref={inner} className="ccd-tr-wrap" style={{ transform: `translateX(-50%) scale(${fit.scale})` }}>{children}</div>
    </div>
  );
}

const busPos = (i: number, n: number) => (n === 1 ? 'only' : i === 0 ? 'first' : i === n - 1 ? 'last' : 'mid');

/** One campaign's column: its shape, its ad group and the kinds of target it holds, from grid row `row` down. */
function CampaignColumn({ campaign, col, row, pos }: { campaign: CcCampaign; col: number; row: number; pos: string }) {
  const info = describe(campaign);
  return (
    <>
      <div className={`ccd-tr-bus ccd-tr-bus--${pos}`} style={{ gridColumn: col, gridRow: row }} />
      <div className="ccd-tr-cell ccd-tr-cell--camp" style={{ gridColumn: col, gridRow: row + 1 }} title={campaign.name}>
        {campaign.kind === 'auto'
          ? <span className="ccd-tr-shape ccd-tr-shape--auto"><b>A</b></span>
          : <span className="ccd-tr-shape ccd-tr-shape--manual"><b>M</b></span>}
        <strong>{info.title}</strong>
      </div>
      <div className="ccd-tr-cell" style={{ gridColumn: col, gridRow: row + 2 }}>
        <i className="ccd-tr-link" />
        <span className="ccd-tr-ag"><GroupGlyph /></span>
        <small>{info.adGroup}</small>
      </div>
      <div className="ccd-tr-cell ccd-tr-cell--targets" style={{ gridColumn: col, gridRow: row + 3 }}>
        <i className="ccd-tr-link" />
        <div className="ccd-tr-list">
          {info.targets.map((target) => (
            <span key={target.type} className={`ccd-tr-pill ccd-tr-pill--${target.tone}`}>
              {target.tone === 'auto' ? <AutoGlyph /> : target.tone === 'kw' ? <KeywordGlyph /> : <ProductGlyph />}{target.label}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export function StructureMap({ structureId, campaigns, products }: { structureId: StructureId; campaigns: CcCampaign[]; products: CcProduct[] }) {
  if (campaigns.length === 0) return null;
  const groups = groupCampaigns(campaigns, products);
  const perProduct = groups[0].productScoped;
  const productCount = perProduct ? groups.length : products.length;
  const rootLabel = perProduct || productCount === 1 ? `${productCount} ${productCount === 1 ? 'product' : 'products'}` : `All ${productCount} products`;

  // Campaigns shared by every product hang straight off the root.
  if (!perProduct) {
    const shared = groups[0].campaigns;
    const n = shared.length;
    return (
      <div className="ccd-tree-map" data-structure={structureId} aria-label="Campaign hierarchy">
        <Fit>
          <div className="ccd-tr" style={{ gridTemplateColumns: `repeat(${n}, minmax(112px, auto))` }}>
            <div className="ccd-tr-root" style={{ gridColumn: `1 / span ${n}`, gridRow: 1 }}>
              <span className="ccd-tr-root__badge">{rootLabel}</span>
              <i className="ccd-tr-link" />
            </div>
            {shared.map((campaign, i) => <CampaignColumn key={campaign.id} campaign={campaign} col={i + 1} row={2} pos={busPos(i, n)} />)}
          </div>
        </Fit>
        <Legend campaigns={campaigns} />
      </div>
    );
  }

  // Per product: a product layer under the root, each product with its own campaigns. Two products are drawn (one when
  // each has several campaigns) and the rest are summed up in a "+N more" node.
  const shownCount = groups[0].campaigns.length <= 2 ? 2 : 1;
  const shown = groups.slice(0, shownCount);
  const more = groups.length - shown.length;
  const branches = shown.length + (more > 0 ? 1 : 0);
  let col = 1;
  const placed = shown.map((group) => { const start = col; col += group.campaigns.length; return { group, start }; });
  const moreCol = col;
  const columns = col - 1 + (more > 0 ? 1 : 0);

  return (
    <div className="ccd-tree-map" data-structure={structureId} aria-label="Campaign hierarchy">
      <Fit>
        <div className="ccd-tr" style={{ gridTemplateColumns: `repeat(${columns}, minmax(112px, auto))` }}>
          <div className="ccd-tr-root" style={{ gridColumn: `1 / span ${columns}`, gridRow: 1 }}>
            <span className="ccd-tr-root__badge">{rootLabel}</span>
            <i className="ccd-tr-link" />
          </div>

          {placed.map(({ group, start }, bi) => {
            const n = group.campaigns.length;
            const span = `${start} / span ${n}`;
            return (
              <Fragment key={group.key}>
                <div className={`ccd-tr-bus ccd-tr-bus--${busPos(bi, branches)}`} style={{ gridColumn: span, gridRow: 2 }} />
                <div className="ccd-tr-cell" style={{ gridColumn: span, gridRow: 3 }}>
                  <span className="ccd-tr-prod" title={group.title}><ProductGlyph /><span>{group.title}</span></span>
                  {/* Names in a catalog often start the same, so the SKU tells the two apart. */}
                  <small>{products.find((p) => p.id === group.key)?.sku}</small>
                  <i className="ccd-tr-link" />
                </div>
                {group.campaigns.map((campaign, i) => <CampaignColumn key={campaign.id} campaign={campaign} col={start + i} row={4} pos={busPos(i, n)} />)}
              </Fragment>
            );
          })}

          {more > 0 && (
            <>
              <div className={`ccd-tr-bus ccd-tr-bus--${busPos(branches - 1, branches)}`} style={{ gridColumn: moreCol, gridRow: 2 }} />
              <div className="ccd-tr-cell" style={{ gridColumn: moreCol, gridRow: 3 }}>
                <span className="ccd-tr-prod ccd-tr-prod--more">+{more} more</span>
                <small>Same campaigns for each</small>
              </div>
            </>
          )}
        </div>
      </Fit>
      <Legend campaigns={campaigns} perProduct />
    </div>
  );
}
