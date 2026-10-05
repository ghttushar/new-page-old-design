import { useEffect, useMemo } from 'react';
import {
  AUTO_TYPE_CATALOG, MARKETPLACE_CAPABILITY, TARGETING_STRATEGY_CATALOG, formatCurrency, recommendTargetingStrategies,
  type AutoTypeId, type CcDraft, type CcProduct, type TargetingStrategyId,
} from '../campaign-creator.types';
import { BORDER, BRAND_TINT, Checkbox, FONT, GOOD, HAIR, InfoIcon, Note, RecommendedTag, StepHeading, SURFACE_MUTED, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

// ── Intent icons ──────────────────────────────────────────────────────────────────────────────

const ico = (children: React.ReactNode, color: string) => (
  <svg width={17} height={17} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
);
const AutoIcon = ({ color }: { color: string }) => ico(<><path d="M8 2.2a5.8 5.8 0 1 0 5.8 5.8" /><path d="M8 5.2a2.8 2.8 0 1 0 2.8 2.8" /></>, color);
const CompetitorIcon = ({ color }: { color: string }) => ico(<><circle cx="8" cy="8" r="5.2" /><circle cx="8" cy="8" r="1.6" /><path d="M8 1v3M8 12v3M1 8h3M12 8h3" /></>, color);
const ResearchIcon = ({ color }: { color: string }) => ico(<><circle cx="7" cy="7" r="4.4" /><path d="M10.4 10.4L14 14" /></>, color);
const PerformanceIcon = ({ color }: { color: string }) => ico(<><path d="M2 11.5a6 6 0 1 1 12 0" /><path d="M8 11.5l2.6-3.4" /></>, color);
const BrandIcon = ({ color }: { color: string }) => ico(<><path d="M8 1.8l5 1.9v4c0 3.2-2.1 5.2-5 6.5-2.9-1.3-5-3.3-5-6.5v-4z" /><path d="M5.8 8l1.6 1.6L10.4 6.4" /></>, color);

const INTENT = {
  auto: { color: '#6b7178', icon: AutoIcon },
  brand: { color: '#c26a1a', icon: BrandIcon },
  competitor: { color: '#4b5bb5', icon: CompetitorIcon },
  research: { color: '#2f8ae8', icon: ResearchIcon },
  performance: { color: '#6fa83a', icon: PerformanceIcon },
};

function TagPill({ label }: { label: string }) {
  return <span style={{ padding: '2px 6px', borderRadius: 4, background: '#2f6fed', color: '#fff', font: `600 10px/1.3 ${FONT}` }}>{label}</span>;
}
function CategoryGlyph() {
  return <svg width={15} height={15} viewBox="0 0 16 16" fill="none" stroke="#2f6fed" strokeWidth="1.5" strokeLinecap="round" aria-hidden><path d="M2.5 4h2M7 4h6.5M2.5 8h2M7 8h6.5M2.5 12h2M7 12h6.5" /></svg>;
}

// ── Matrix pieces ─────────────────────────────────────────────────────────────────────────────

const GRID = '188px minmax(0, 1fr) minmax(0, 1fr)';

function Cell({ checked, disabled, recommended, label, onToggle, children }: {
  checked: boolean; disabled?: boolean; recommended?: boolean; label: string; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div
      role="checkbox" aria-checked={checked} aria-label={label} aria-disabled={disabled} tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onToggle()}
      onKeyDown={(e) => { if (!disabled && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); onToggle(); } }}
      className="cc-row"
      style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', minHeight: 52, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, background: checked ? BRAND_TINT : undefined, borderRadius: 0 }}
    >
      <span style={{ marginTop: 1 }}><Checkbox checked={checked} disabled={disabled} /></span>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: `500 13.5px/1.35 ${FONT}`, color: TEXT_PRIMARY }}>{children}</div>
        {recommended && <div style={{ marginTop: 4 }}><RecommendedTag /></div>}
      </div>
    </div>
  );
}

function Empty() {
  return <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', minHeight: 52, font: `400 13px/1 ${FONT}`, color: TEXT_FAINT }}>Not applicable</div>;
}

function Stack({ children }: { children: React.ReactNode[] }) {
  return <div>{children.map((c, i) => <div key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${HAIR}` }}>{c}</div>)}</div>;
}

function IntentLabel({ intent, name, info }: { intent: keyof typeof INTENT; name: string; info: string }) {
  const { color, icon: Icon } = INTENT[intent];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '15px 16px', background: SURFACE_MUTED, borderRight: `1px solid ${HAIR}` }}>
      <span style={{ marginTop: 1 }}><Icon color={color} /></span>
      <span style={{ font: `600 13.5px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>{name}</span>
      <span title={info} aria-label={info} style={{ display: 'flex', marginTop: 2, cursor: 'help' }}><InfoIcon size={13} color={TEXT_FAINT} /></span>
    </div>
  );
}

function IntentRow({ intent, name, info, keywordCells, productCells }: {
  intent: keyof typeof INTENT; name: string; info: string; keywordCells: React.ReactNode[]; productCells: React.ReactNode[];
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: GRID, borderTop: `1px solid ${HAIR}` }}>
      <IntentLabel intent={intent} name={name} info={info} />
      <div style={{ borderRight: `1px solid ${HAIR}` }}>{keywordCells.length ? <Stack>{keywordCells}</Stack> : <Empty />}</div>
      <div>{productCells.length ? <Stack>{productCells}</Stack> : <Empty />}</div>
    </div>
  );
}

// ── Step ──────────────────────────────────────────────────────────────────────────────────────

export default function StepTargeting({ draft, selectedProducts, onChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const supported = draft.marketplace ? MARKETPLACE_CAPABILITY[draft.marketplace].targetingStrategies : [];
  const recommended = useMemo(() => (draft.marketplace ? recommendTargetingStrategies(selectedProducts, draft.marketplace) : []), [selectedProducts, draft.marketplace]);

  // Pre-fill the recommendation once, the first time this step is reached with nothing selected yet.
  useEffect(() => {
    if (draft.targetingStrategies.length === 0 && recommended.length > 0) {
      onChange({ targetingStrategies: recommended });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(id: TargetingStrategyId) {
    const set = new Set(draft.targetingStrategies);
    if (set.has(id)) set.delete(id); else set.add(id);
    onChange({ targetingStrategies: Array.from(set) });
  }

  const cell = (id: TargetingStrategyId, text: string, lead?: React.ReactNode) => (
    <Cell key={id} label={text} checked={draft.targetingStrategies.includes(id)} disabled={!supported.includes(id)} recommended={recommended.includes(id)} onToggle={() => toggle(id)}>
      {lead}{text}
    </Cell>
  );

  // Explainable recommendation (section 6.3), built from the selected products' history and the objectives.
  const totalSpend = selectedProducts.reduce((s, p) => s + p.adSpend, 0);
  const totalAdSales = selectedProducts.reduce((s, p) => s + p.adSales, 0);
  const blendedAcos = totalAdSales > 0 ? (totalSpend / totalAdSales) * 100 : 0;
  const n = selectedProducts.length;
  const objectives = draft.targetAcos != null ? `${formatCurrency(draft.dailyBudget)} daily budget and ${draft.targetAcos}% target ACOS` : `${formatCurrency(draft.dailyBudget)} daily budget`;
  const reason = totalSpend > 0
    ? `Your ${n} selected ${n === 1 ? 'product has' : 'products have'} ${formatCurrency(totalSpend)} of recent ad spend at ${blendedAcos.toFixed(1)}% ACOS, enough search and conversion history for keyword-based targeting. Auto keeps discovering new terms, and the set fits your ${objectives}.`
    : `Your selected ${n === 1 ? 'product has' : 'products have'} little ad history, so we added Broad match to discover terms. Auto and keyword targeting together fit your ${objectives}.`;

  // Combination validation (section 6.4).
  const selected = draft.targetingStrategies;
  const productStyleOnly = selected.length > 0 && selected.every((s) => s === 'product' || s === 'category');
  const unsupported = selected.filter((s) => !supported.includes(s));
  const hasAuto = selected.includes('auto');
  const autoTypes = draft.autoTypes;

  function toggleAutoType(id: AutoTypeId) {
    const set = new Set(autoTypes);
    if (set.has(id)) { if (set.size === 1) return; set.delete(id); } else set.add(id);
    onChange({ autoTypes: AUTO_TYPE_CATALOG.map((a) => a.id).filter((x) => set.has(x)) });
  }

  const head: React.CSSProperties ={ padding: '11px 16px', font: `500 12px/1 ${FONT}`, color: TEXT_MUTED, background: SURFACE_MUTED };

  return (
    <div>
      <StepHeading
        eyebrow="Step 3 of 5"
        title="Pick how shoppers find you"
        subtitle="Choose as many strategies as you like. Each manual strategy becomes its own targeting group in the structure you pick next."
      />

      {recommended.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <Note>
            <span style={{ display: 'block', font: `600 13px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>Why we're recommending this</span>
            <span style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', margin: '6px 0' }}>
              {recommended.map((id) => (
                <span key={id} style={{ font: `500 12.5px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>
                  <span aria-hidden style={{ color: GOOD, marginRight: 5 }}>✓</span>{TARGETING_STRATEGY_CATALOG[id].label}
                </span>
              ))}
            </span>
            <span style={{ display: 'block' }}>{reason}</span>
          </Note>
        </div>
      )}

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: GRID, borderBottom: `1px solid ${BORDER}` }}>
          <div style={head}>Strategy</div>
          <div style={{ ...head, borderLeft: `1px solid ${HAIR}` }}>Keyword targets</div>
          <div style={{ ...head, borderLeft: `1px solid ${HAIR}` }}>Product targets</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: GRID }}>
          <IntentLabel intent="auto" name="Auto" info={TARGETING_STRATEGY_CATALOG.auto.description} />
          <div style={{ gridColumn: '2 / 4' }}>{cell('auto', 'Auto campaign')}</div>
        </div>

        <IntentRow
          intent="brand" name="Brand" info="Defend your own brand terms and protect your listings from competitors."
          keywordCells={[cell('brand', 'Brand keywords')]} productCells={[]}
        />
        <IntentRow
          intent="competitor" name="Competitor" info="Reach shoppers who are considering competing products and brands."
          keywordCells={[cell('competitor', 'Core competitor keywords')]} productCells={[]}
        />
        <IntentRow
          intent="research" name="Research" info="Discover new search terms and products with broader reach."
          keywordCells={[cell('broad', 'Broad match'), cell('phrase', 'Phrase match')]}
          productCells={[cell('category', 'Product category', <CategoryGlyph />)]}
        />
        <IntentRow
          intent="performance" name="Performance" info="Capture high-intent shoppers with precise, conversion-focused targeting."
          keywordCells={[cell('exact', 'Exact match')]}
          productCells={[cell('product', 'Single product', <TagPill label="exact" />)]}
        />

        {hasAuto && (
          <div style={{ borderTop: `1px solid ${HAIR}` }}>
            <div style={{ display: 'grid', gridTemplateColumns: GRID }}>
              <div style={{ padding: '15px 16px', background: SURFACE_MUTED, borderRight: `1px solid ${HAIR}` }}>
                <div style={{ font: `600 13.5px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>Auto targeting types</div>
                <div style={{ marginTop: 4, font: `400 12px/1.45 ${FONT}`, color: TEXT_MUTED }}>Keep at least one selected.</div>
              </div>
              <div style={{ gridColumn: '2 / 4', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                {AUTO_TYPE_CATALOG.map((a, i) => {
                  const on = autoTypes.includes(a.id);
                  const last = on && autoTypes.length === 1;
                  return (
                    <div
                      key={a.id} role="checkbox" aria-checked={on} aria-label={a.label} tabIndex={0} className="cc-row"
                      title={last ? 'At least one type must stay selected' : undefined}
                      onClick={() => toggleAutoType(a.id)}
                      onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleAutoType(a.id); } }}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', cursor: last ? 'not-allowed' : 'pointer', background: on ? BRAND_TINT : undefined,
                        borderTop: i > 1 ? `1px solid ${HAIR}` : 'none', borderLeft: i % 2 === 1 ? `1px solid ${HAIR}` : 'none',
                      }}
                    >
                      <span style={{ marginTop: 1 }}><Checkbox checked={on} /></span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ font: `500 13.5px/1.35 ${FONT}`, color: TEXT_PRIMARY }}>{a.label}</div>
                        <div style={{ marginTop: 2, font: `400 12px/1.45 ${FONT}`, color: TEXT_MUTED }}>{a.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ padding: '10px 16px', borderTop: `1px solid ${HAIR}`, background: SURFACE_MUTED, font: `400 12px/1.5 ${FONT}`, color: TEXT_MUTED }}>
              The Product + Multiple Auto structure (Structure 5) creates one Auto campaign per selected type per product, so {autoTypes.length} {autoTypes.length === 1 ? 'type' : 'types'} means {autoTypes.length} Auto {autoTypes.length === 1 ? 'campaign' : 'campaigns'} for each product.
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 14 }}>
        {selected.length === 0 ? (
          <Note tone="warn">Select at least one targeting strategy to continue.</Note>
        ) : unsupported.length > 0 ? (
          <Note tone="warn">{unsupported.map((s) => TARGETING_STRATEGY_CATALOG[s].label).join(', ')} {unsupported.length === 1 ? 'is' : 'are'} not supported on this marketplace. Remove {unsupported.length === 1 ? 'it' : 'them'} to continue.</Note>
        ) : productStyleOnly ? (
          <Note tone="warn">Product targeting works best alongside a keyword or Auto strategy.</Note>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, font: `500 12.5px/1.5 ${FONT}`, color: GOOD }}>
            <span aria-hidden>✓</span> {selected.length} {selected.length === 1 ? 'strategy' : 'strategies'} selected — supported combination
          </div>
        )}
      </div>
    </div>
  );
}
