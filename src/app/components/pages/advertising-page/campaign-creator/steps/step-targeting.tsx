import { useEffect, useMemo } from 'react';
import {
  MARKETPLACE_CAPABILITY, TARGETING_STRATEGY_CATALOG, recommendTargetingStrategies,
  type CcDraft, type CcProduct, type TargetingStrategyId,
} from '../campaign-creator.types';
import { BORDER, BRAND, BRAND_TINT, CheckIcon, InfoIcon, StepHeading, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY, WhyRecommended } from '../campaign-creator-ui';

// ── Intent icons ──────────────────────────────────────────────────────────────────────────────

const ico = (children: React.ReactNode, color: string) => (
  <svg width={17} height={17} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
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

// ── Small cell building blocks ────────────────────────────────────────────────────────────────

function TagPill({ label }: { label: string }) {
  return <span style={{ padding: '2px 6px', borderRadius: 4, background: '#2f6fed', color: '#fff', font: '700 9px/1.3 Inter,sans-serif' }}>{label}</span>;
}
function CategoryGlyph() {
  return <svg width={15} height={15} viewBox="0 0 16 16" fill="none" stroke="#2f6fed" strokeWidth="1.5" strokeLinecap="round"><path d="M2.5 4h2M7 4h6.5M2.5 8h2M7 8h6.5M2.5 12h2M7 12h6.5" /></svg>;
}

function Checkbox({ checked, disabled }: { checked: boolean; disabled?: boolean }) {
  return (
    <span style={{ width: 17, height: 17, borderRadius: 4.5, flex: 'none', border: `1.5px solid ${checked ? BRAND : '#cfd4dc'}`, background: checked ? BRAND : disabled ? '#f1f2f4' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {checked && <CheckIcon size={10} />}
    </span>
  );
}

function Cell({ checked, disabled, recommended, onToggle, children }: {
  checked: boolean; disabled?: boolean; recommended?: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div
      onClick={() => !disabled && onToggle()}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', minHeight: 50, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, background: checked ? BRAND_TINT : 'transparent', transition: 'background 120ms ease-out' }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: '500 12.5px/1.3 Inter,sans-serif', color: TEXT_PRIMARY }}>{children}</div>
        {recommended && <span style={{ font: '700 8.5px/1 Inter,sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase' as const, color: BRAND }}>✦ Recommended</span>}
      </div>
      <Checkbox checked={checked} disabled={disabled} />
    </div>
  );
}

function EmptyCell() {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 50, font: '500 11px/1 Inter,sans-serif', color: TEXT_FAINT }}>—</div>;
}

function Stack({ children }: { children: React.ReactNode[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      {children.map((c, i) => <div key={i} style={{ borderTop: i === 0 ? 'none' : `1px solid ${BORDER}` }}>{c}</div>)}
    </div>
  );
}

const GRID = '200px 1fr 1fr';

function IntentRow({ intent, label, info, keywordCells, productCells }: {
  intent: keyof typeof INTENT; label: string; info: string; keywordCells: React.ReactNode[]; productCells: React.ReactNode[];
}) {
  const { color, icon: Icon } = INTENT[intent];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: GRID, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 16px', borderRight: `1px solid ${BORDER}` }}>
        <Icon color={color} />
        <span style={{ font: '700 13px/1 Inter,sans-serif', color }}>{label}</span>
        <span title={info} style={{ display: 'flex', cursor: 'help' }}><InfoIcon size={13} color={TEXT_FAINT} /></span>
      </div>
      <div style={{ borderRight: `1px solid ${BORDER}` }}>{keywordCells.length ? <Stack>{keywordCells}</Stack> : <EmptyCell />}</div>
      <div>{productCells.length ? <Stack>{productCells}</Stack> : <EmptyCell />}</div>
    </div>
  );
}

function Section({ title, columnHeaders, children }: { title: string; columnHeaders?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ background: '#f4f5f8', borderRadius: 12, padding: '14px 14px 4px', marginBottom: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: columnHeaders ? GRID : undefined, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ font: '700 13px/1 Inter,sans-serif', color: TEXT_PRIMARY, padding: '0 2px' }}>{title}</div>
        {columnHeaders && (
          <>
            <div style={{ textAlign: 'center' as const, font: '600 11.5px/1 Inter,sans-serif', color: TEXT_MUTED }}>Manual Campaign – Keyword targets</div>
            <div style={{ textAlign: 'center' as const, font: '600 11.5px/1 Inter,sans-serif', color: TEXT_MUTED }}>Manual Campaign – Product targets</div>
          </>
        )}
      </div>
      {children}
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

  const cell = (id: TargetingStrategyId, content: React.ReactNode) => (
    <Cell key={id} checked={draft.targetingStrategies.includes(id)} disabled={!supported.includes(id)} recommended={recommended.includes(id)} onToggle={() => toggle(id)}>
      {content}
    </Cell>
  );

  return (
    <div>
      <StepHeading title="Select targeting strategy" subtitle="Recommended based on your selected products, target ACOS and daily budget. Pick as many strategies as you need." />

      <Section title="Auto">
        <div style={{ display: 'grid', gridTemplateColumns: GRID, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 16px', borderRight: `1px solid ${BORDER}` }}>
            <AutoIcon color={INTENT.auto.color} />
            <span style={{ font: '700 13px/1 Inter,sans-serif', color: INTENT.auto.color }}>Auto</span>
            <span title={TARGETING_STRATEGY_CATALOG.auto.description} style={{ display: 'flex', cursor: 'help' }}><InfoIcon size={13} color={TEXT_FAINT} /></span>
          </div>
          <div style={{ gridColumn: '2 / 4' }}>{cell('auto', 'Auto Campaign')}</div>
        </div>
      </Section>

      <Section title="Manual" columnHeaders>
        <IntentRow
          intent="brand" label="Brand" info="Defend your own brand terms and protect your listings from competitors."
          keywordCells={[cell('brand', 'Brand Keywords')]}
          productCells={[]}
        />
        <IntentRow
          intent="competitor" label="Competitor" info="Reach shoppers who are considering competing products and brands."
          keywordCells={[cell('competitor', 'Core Competitor Keywords')]}
          productCells={[]}
        />
        <IntentRow
          intent="research" label="Research" info="Discover new search terms and products with broader reach."
          keywordCells={[
            cell('broad', 'Broad Match'),
            cell('phrase', 'Phrase Match'),
          ]}
          productCells={[cell('category', <><CategoryGlyph /> Product category</>)]}
        />
        <IntentRow
          intent="performance" label="Performance" info="Capture high-intent shoppers with precise, conversion-focused targeting."
          keywordCells={[cell('exact', 'Exact Match')]}
          productCells={[cell('product', <><TagPill label="exact" /> Single product</>)]}
        />
      </Section>

      {recommended.length > 0 && (
        <WhyRecommended reason="Your selected products have sufficient historical search and conversion data for keyword-based targeting, within your target ACOS and daily budget." />
      )}
    </div>
  );
}
