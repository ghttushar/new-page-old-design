import { type CcCampaign, type CcProduct, type StructureId, type TargetingStrategyId } from '../campaign-creator.types';
import { BORDER, BRAND, FONT, HAIR, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

/** Campaigns grouped under the product they belong to, or under "all products" when a campaign spans several. */
export function groupCampaigns(campaigns: CcCampaign[], products: CcProduct[]): { key: string; title: string; productScoped: boolean; color: string; campaigns: CcCampaign[] }[] {
  const groups = new Map<string, { key: string; title: string; productScoped: boolean; color: string; campaigns: CcCampaign[] }>();
  campaigns.forEach((c) => {
    const scoped = c.productIds.length === 1;
    const key = scoped ? c.productIds[0] : 'all';
    if (!groups.has(key)) {
      const product = scoped ? products.find((p) => p.id === key) : undefined;
      const title = scoped ? (product?.title ?? 'Product') : `All ${products.length} product${products.length === 1 ? '' : 's'}`;
      groups.set(key, { key, title, productScoped: scoped, color: product?.thumbnailColor ?? '#3f7d6a', campaigns: [] });
    }
    groups.get(key)!.campaigns.push(c);
  });
  return Array.from(groups.values());
}

// ── Palette: one hue per role so the eye can follow a branch ──────────────────────────────────
const AUTO = { ink: '#2f6fed', tint: '#eaf1fe', line: '#c5d6f8' };
const MANUAL = { ink: BRAND, tint: '#f3ecf9', line: '#dccbec' };
const TEAL = { ink: '#2f7a64', tint: '#e6f4ef', line: '#c3e0d5' };
const WIRE = '#d5d9e0';
const SHOW_PRODUCTS = 3;

const ABBR: Partial<Record<TargetingStrategyId, { label: string; kind: 'keyword' | 'product' }>> = {
  exact: { label: 'Exact', kind: 'keyword' }, phrase: { label: 'Phrase', kind: 'keyword' }, broad: { label: 'Broad', kind: 'keyword' },
  brand: { label: 'Brand', kind: 'keyword' }, product: { label: 'Product', kind: 'product' },
  competitor: { label: 'Competitor', kind: 'product' }, category: { label: 'Category', kind: 'product' },
};

const trunc = (t: string, n: number) => (t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t);
const typesOf = (c: CcCampaign) => Array.from(new Set(c.adGroups.flatMap((ag) => ag.targets.map((t) => t.matchType))));

/** Short name for a campaign inside a chip: "Auto", "Auto · Close match", "Exact", "Manual · 3 types". */
function chipLabel(c: CcCampaign): string {
  if (c.kind === 'auto') {
    const type = c.targetingLabel.split(' · ')[1];
    return type ? type.replace(' match', '') : 'Auto';
  }
  const types = typesOf(c);
  if (types.length === 1) return ABBR[types[0]]?.label ?? c.targetingLabel;
  return types.length > 1 ? `Manual · ${types.length} types` : 'Manual';
}

// ── Shared pieces ─────────────────────────────────────────────────────────────────────────────

function Glyph({ kind, size = 14, color }: { kind: 'auto' | 'manual'; size?: number; color?: string }) {
  const c = color ?? (kind === 'auto' ? AUTO.ink : MANUAL.ink);
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
      {kind === 'auto'
        ? <circle cx="8" cy="8" r="5.6" stroke={c} strokeWidth="1.8" />
        : <path d="M8 1.8L14.2 8 8 14.2 1.8 8Z" stroke={c} strokeWidth="1.8" strokeLinejoin="round" />}
    </svg>
  );
}

function IconTile({ kind, size = 24 }: { kind: 'auto' | 'manual'; size?: number }) {
  const tone = kind === 'auto' ? AUTO : MANUAL;
  return <span style={{ width: size, height: size, borderRadius: Math.round(size * 0.32), background: tone.tint, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><Glyph kind={kind} size={Math.round(size * 0.6)} /></span>;
}

function Chip({ kind, label, sub }: { kind: 'auto' | 'manual'; label: string; sub?: string }) {
  const tone = kind === 'auto' ? AUTO : MANUAL;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 11px 4px 5px', borderRadius: 10, background: '#fff', border: `1px solid ${tone.line}`, boxShadow: '0 1px 2px rgba(28,34,48,.05)', whiteSpace: 'nowrap' }}>
      <IconTile kind={kind} size={20} />
      <span style={{ font: `600 12px/1.2 ${FONT}`, color: TEXT_PRIMARY }}>{label}</span>
      {sub && <span style={{ font: `400 11px/1.2 ${FONT}`, color: TEXT_MUTED }}>{sub}</span>}
    </span>
  );
}

function Cube({ size = 14, color = TEAL.ink }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden><path d="M7 1.2l5.2 2.7v5.4L7 12 1.8 9.3V3.9Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" /><path d="M1.8 3.9L7 6.6l5.2-2.7M7 6.6V12" stroke={color} strokeWidth="1.4" /></svg>;
}

function GroupGlyph() {
  return <svg width={12} height={12} viewBox="0 0 14 14" fill="none" aria-hidden><rect x="1.5" y="1.5" width="4.4" height="4.4" rx="1.2" stroke={TEAL.ink} strokeWidth="1.3" /><rect x="8.1" y="1.5" width="4.4" height="4.4" rx="1.2" stroke={TEAL.ink} strokeWidth="1.3" /><rect x="1.5" y="8.1" width="4.4" height="4.4" rx="1.2" stroke={TEAL.ink} strokeWidth="1.3" /><rect x="8.1" y="8.1" width="4.4" height="4.4" rx="1.2" stroke={TEAL.ink} strokeWidth="1.3" /></svg>;
}

/** The product (or "all products") badge that anchors a branch. */
function ProductBadge({ title, color, index, scoped, width }: { title: string; color: string; index?: number; scoped: boolean; width?: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px 5px 6px', borderRadius: 11, background: TEAL.tint, border: `1px solid ${TEAL.line}`, width, minWidth: 0 }}>
      <span style={{ width: 22, height: 22, borderRadius: 7, background: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
        {scoped ? <Cube size={13} /> : <GroupGlyph />}
      </span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: 'block', font: `600 12px/1.25 ${FONT}`, color: TEAL.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trunc(title, 26)}</span>
        {scoped && index !== undefined && <span style={{ display: 'block', font: `500 10.5px/1.2 ${FONT}`, color: TEXT_FAINT }}>Product {index + 1}</span>}
      </span>
      {scoped && <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flex: 'none', marginLeft: 'auto' }} />}
    </span>
  );
}

function RootPill({ products }: { products: number }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px 6px 10px', borderRadius: 999, background: 'linear-gradient(135deg, #8a55b0, #5b3480)', color: '#fff', font: `600 12px/1.2 ${FONT}`, boxShadow: '0 2px 6px rgba(91,52,128,.28)' }}>
      <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden><circle cx="8" cy="8" r="6" stroke="#fff" strokeWidth="1.6" opacity=".9" /><circle cx="8" cy="8" r="2.2" fill="#fff" /></svg>
      Sponsored Products
      <span style={{ font: `500 11px/1 ${FONT}`, opacity: 0.8 }}>· {products} product{products === 1 ? '' : 's'}</span>
    </span>
  );
}

/** Stub from a parent down to a row of children, joined by a bar with a drop above each child. */
function Rake({ children, gap = 12, width }: { children: React.ReactNode[]; gap?: number; width?: number | string }) {
  const n = children.length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: 1.5, height: 14, background: WIRE }} />
      <div style={{ display: 'flex', justifyContent: 'center', gap, width }}>
        {children.map((child, i) => (
          <div key={i} style={{ position: 'relative', paddingTop: 14, flex: width ? '1 1 0' : '0 0 auto', minWidth: 0 }}>
            {n > 1 && <span aria-hidden style={{ position: 'absolute', top: 0, height: 1.5, background: WIRE, left: i === 0 ? '50%' : -gap / 2, right: i === n - 1 ? '50%' : -gap / 2 }} />}
            <span aria-hidden style={{ position: 'absolute', top: 0, left: '50%', width: 1.5, height: 14, background: WIRE, transform: 'translateX(-0.75px)' }} />
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

function MoreNote({ n, children }: { n: number; children?: React.ReactNode }) {
  if (n <= 0) return null;
  return (
    <div style={{ marginTop: 10, padding: '7px 12px', borderRadius: 10, border: `1px dashed ${WIRE}`, font: `500 12px/1.3 ${FONT}`, color: TEXT_MUTED, textAlign: 'center' }}>
      +{n} more product{n === 1 ? '' : 's'} {children ?? 'with the same pattern'}
    </div>
  );
}

function AdGroupTag({ n = 1, ink = TEAL.ink }: { n?: number; ink?: string }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: `500 11px/1 ${FONT}`, color: TEXT_MUTED }}>
      <span style={{ width: 8, height: 8, borderRadius: 2.4, background: ink }} /> {n} ad group{n === 1 ? '' : 's'}
    </span>
  );
}

// ── 1 · Consolidated: one Auto and one Manual, side by side ───────────────────────────────────

function ConsolidatedMap({ campaigns, products }: { campaigns: CcCampaign[]; products: CcProduct[] }) {
  const cards = campaigns.map((c) => {
    const types = typesOf(c);
    return (
      <div key={c.id} style={{ padding: '12px 14px', borderRadius: 14, background: '#fff', border: `1px solid ${c.kind === 'auto' ? AUTO.line : MANUAL.line}`, boxShadow: '0 1px 3px rgba(28,34,48,.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <IconTile kind={c.kind} size={28} />
          <div>
            <div style={{ font: `600 13px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>{c.kind === 'auto' ? 'Auto campaign' : 'Manual campaign'}</div>
            <AdGroupTag n={c.adGroups.length} />
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 10 }}>
          {c.kind === 'auto'
            ? <span style={{ padding: '3px 9px', borderRadius: 999, background: AUTO.tint, color: AUTO.ink, font: `500 11.5px/1.3 ${FONT}` }}>Automatic targeting</span>
            : types.map((t) => <span key={t} style={{ padding: '3px 9px', borderRadius: 999, background: MANUAL.tint, color: MANUAL.ink, font: `500 11.5px/1.3 ${FONT}` }}>{ABBR[t]?.label ?? t}</span>)}
        </div>
      </div>
    );
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <RootPill products={products.length} />
      <Rake gap={16} width={cards.length > 1 ? 540 : 270}>{cards}</Rake>
    </div>
  );
}

// ── 2 · Targeting-Type: one Auto plus a lane per targeting type ───────────────────────────────

function LanesMap({ campaigns, products }: { campaigns: CcCampaign[]; products: CcProduct[] }) {
  const lanes = campaigns.map((c) => (
    <div key={c.id} style={{ width: 92, padding: '10px 6px 9px', borderRadius: 14, background: '#fff', border: `1px solid ${c.kind === 'auto' ? AUTO.line : MANUAL.line}`, boxShadow: '0 1px 3px rgba(28,34,48,.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
      <IconTile kind={c.kind} size={30} />
      <span style={{ font: `600 12px/1.2 ${FONT}`, color: TEXT_PRIMARY, textAlign: 'center' }}>{chipLabel(c)}</span>
      <AdGroupTag n={c.adGroups.length} ink={c.kind === 'auto' ? AUTO.ink : MANUAL.ink} />
    </div>
  ));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <RootPill products={products.length} />
      <Rake gap={10}>{lanes}</Rake>
    </div>
  );
}

// ── 3 · Product + Targeting: one swimlane per product, a campaign chip for each ───────────────

function SwimlaneRow({ g, index, children }: { g: ReturnType<typeof groupCampaigns>[number]; index: number; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '8px 0', borderTop: index === 0 ? 'none' : `1px solid ${HAIR}` }}>
      <div style={{ width: 196, flex: 'none' }}><ProductBadge title={g.title} color={g.color} index={index} scoped={g.productScoped} width={196} /></div>
      <span aria-hidden style={{ width: 22, height: 1.5, background: WIRE, flex: 'none' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 7, minWidth: 0 }}>{children}</div>
    </div>
  );
}

function SwimlanesMap({ campaigns, products }: { campaigns: CcCampaign[]; products: CcProduct[] }) {
  const groups = groupCampaigns(campaigns, products);
  const shown = groups.slice(0, SHOW_PRODUCTS);
  return (
    <div>
      {shown.map((g, i) => (
        <SwimlaneRow key={g.key} g={g} index={i}>
          {g.campaigns.map((c) => <Chip key={c.id} kind={c.kind} label={chipLabel(c)} />)}
        </SwimlaneRow>
      ))}
      <MoreNote n={groups.length - shown.length} />
    </div>
  );
}

// ── 4 · Product + Single Auto: one Auto block per product, Manual grouped by type ─────────────

function SingleAutoMap({ campaigns, products }: { campaigns: CcCampaign[]; products: CcProduct[] }) {
  const groups = groupCampaigns(campaigns, products);
  const shown = groups.slice(0, SHOW_PRODUCTS);
  return (
    <div>
      {shown.map((g, i) => {
        const autos = g.campaigns.filter((c) => c.kind === 'auto');
        const manuals = g.campaigns.filter((c) => c.kind === 'manual');
        return (
          <SwimlaneRow key={g.key} g={g} index={i}>
            {autos.length > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px 6px 7px', borderRadius: 12, background: AUTO.tint, border: `1px solid ${AUTO.line}` }}>
                <IconTile kind="auto" size={24} />
                <span>
                  <span style={{ display: 'block', font: `600 12px/1.2 ${FONT}`, color: AUTO.ink }}>1 Auto</span>
                  <span style={{ display: 'block', font: `400 10.5px/1.2 ${FONT}`, color: TEXT_MUTED }}>all in one</span>
                </span>
              </span>
            )}
            <span aria-hidden style={{ width: 1.5, height: 26, background: WIRE, margin: '0 4px' }} />
            <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 12, border: `1px dashed ${MANUAL.line}` }}>
              <span style={{ font: `600 10.5px/1 ${FONT}`, color: MANUAL.ink, letterSpacing: '.04em', textTransform: 'uppercase' }}>Manual</span>
              {manuals.map((c) => <Chip key={c.id} kind="manual" label={chipLabel(c)} />)}
            </span>
          </SwimlaneRow>
        );
      })}
      <MoreNote n={groups.length - shown.length} />
    </div>
  );
}

// ── 5 · Product + Multiple Auto: a matrix, products down the side, campaign types across ──────

function MatrixMap({ campaigns, products }: { campaigns: CcCampaign[]; products: CcProduct[] }) {
  const groups = groupCampaigns(campaigns, products);
  const shown = groups.slice(0, SHOW_PRODUCTS);
  const cols = (groups[0]?.campaigns ?? []).map((c) => ({ id: c.id, kind: c.kind, label: chipLabel(c) }));
  const autoN = cols.filter((c) => c.kind === 'auto').length;
  const manualN = cols.length - autoN;
  const template = `176px repeat(${cols.length}, minmax(48px, 1fr))`;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: template, alignItems: 'end', paddingBottom: 6 }}>
        <span />
        {autoN > 0 && <span style={{ gridColumn: `span ${autoN}`, textAlign: 'center', font: `700 10px/1 ${FONT}`, letterSpacing: '.08em', color: AUTO.ink, borderBottom: `2px solid ${AUTO.line}`, paddingBottom: 5, margin: '0 4px' }}>AUTO</span>}
        {manualN > 0 && <span style={{ gridColumn: `span ${manualN}`, textAlign: 'center', font: `700 10px/1 ${FONT}`, letterSpacing: '.08em', color: MANUAL.ink, borderBottom: `2px solid ${MANUAL.line}`, paddingBottom: 5, margin: '0 4px' }}>MANUAL</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: template, paddingBottom: 6, borderBottom: `1px solid ${HAIR}` }}>
        <span />
        {cols.map((c) => <span key={c.id} style={{ textAlign: 'center', font: `500 11px/1.2 ${FONT}`, color: TEXT_MUTED }}>{c.label}</span>)}
      </div>
      {shown.map((g, i) => (
        <div key={g.key} style={{ display: 'grid', gridTemplateColumns: template, alignItems: 'center', padding: '8px 0', borderTop: i === 0 ? 'none' : `1px solid ${HAIR}` }}>
          <div style={{ paddingRight: 10 }}><ProductBadge title={g.title} color={g.color} index={i} scoped={g.productScoped} /></div>
          {cols.map((col, ci) => {
            const has = g.campaigns[ci];
            return (
              <span key={col.id} style={{ display: 'flex', justifyContent: 'center' }}>
                {has ? <IconTile kind={has.kind} size={26} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: WIRE }} />}
              </span>
            );
          })}
        </div>
      ))}
      <MoreNote n={groups.length - shown.length}>with {cols.length} campaigns each</MoreNote>
    </div>
  );
}

/** A compact map of the structure, drawn in a different layout for each structure type. */
export function StructureMap({ structureId, campaigns, products }: { structureId: StructureId; campaigns: CcCampaign[]; products: CcProduct[] }) {
  if (campaigns.length === 0) return null;
  const scoped = groupCampaigns(campaigns, products).every((g) => g.productScoped);
  const props = { campaigns, products };
  switch (structureId) {
    case 'consolidated': return <ConsolidatedMap {...props} />;
    case 'targeting-type': return <LanesMap {...props} />;
    case 'product-targeting': return <SwimlanesMap {...props} />;
    case 'product-single-auto': return <SingleAutoMap {...props} />;
    case 'product-multi-auto': return <MatrixMap {...props} />;
    default: return scoped ? <SwimlanesMap {...props} /> : <LanesMap {...props} />;
  }
}
