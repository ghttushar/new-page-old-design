// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { useEffect, useMemo } from 'react';
import {
  AUTO_TYPE_CATALOG, MARKETPLACE_CAPABILITY, TARGETING_STRATEGY_CATALOG, recommendTargetingStrategies,
  type AutoTypeId, type CcDraft, type CcProduct, type TargetingStrategyId,
} from '../campaign-creator.types';
import { Checkbox, FONT, GOOD, StepHeading, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

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

// ── Matrix pieces ─────────────────────────────────────────────────────────────────────────────

/** A selectable target: a rounded tile that lifts on hover and fills with the brand tint when picked. */
function Tile({ checked, disabled, label, onToggle, children }: {
  checked: boolean; disabled?: boolean; label: string; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div
      role="checkbox" aria-checked={checked} aria-label={label} aria-disabled={disabled} tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onToggle()}
      onKeyDown={(e) => { if (!disabled && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); onToggle(); } }}
      className="cc-tg-tile"
    >
      <Checkbox checked={checked} disabled={disabled} />
      <span className="cc-tg-tile__text">{children}</span>
    </div>
  );
}

function NotApplicable() {
  return <div className="cc-tg-na">Not applicable</div>;
}

function IntentLabel({ intent, name, info }: { intent: keyof typeof INTENT; name: string; info: string }) {
  const { color, icon: Icon } = INTENT[intent];
  return (
    <div className="cc-tg-label">
      <span className="cc-tg-label__icon" style={{ background: color + '1a', borderColor: color + '33' }}><Icon color={color} /></span>
      <span className="cc-tg-label__copy" title={info}>
        <strong>{name}</strong>
        <small>{info}</small>
      </span>
    </div>
  );
}

function IntentRow({ intent, name, info, keywordCells, productCells, wide }: {
  intent: keyof typeof INTENT; name: string; info: string; keywordCells: React.ReactNode[]; productCells: React.ReactNode[]; wide?: boolean;
}) {
  return (
    <div className="cc-tg-row" style={{ ['--tg-accent' as string]: INTENT[intent].color }}>
      <IntentLabel intent={intent} name={name} info={info} />
      {wide ? (
        <div className="cc-tg-cells cc-tg-cells--wide">{keywordCells}</div>
      ) : (
        <>
          <div className="cc-tg-cells">{keywordCells.length ? keywordCells : <NotApplicable />}</div>
          <div className="cc-tg-cells">{productCells.length ? productCells : <NotApplicable />}</div>
        </>
      )}
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
    <Tile key={id} label={text} checked={draft.targetingStrategies.includes(id)} disabled={!supported.includes(id)} onToggle={() => toggle(id)}>
      {lead}{text}
    </Tile>
  );

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

  return (
    <div>
      <StepHeading title="Pick how shoppers find you" />

      <div className="cc-tg">
        <div className="cc-tg-head" aria-hidden>
          <span>Strategy</span>
          <span>Keyword targets</span>
          <span>Product targets</span>
        </div>

        <IntentRow intent="auto" name="Auto" info={TARGETING_STRATEGY_CATALOG.auto.description} keywordCells={[cell('auto', 'Auto campaign')]} productCells={[]} wide />
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
          productCells={[cell('category', 'Product category')]}
        />
        <IntentRow
          intent="performance" name="Performance" info="Capture high-intent shoppers with precise, conversion-focused targeting."
          keywordCells={[cell('exact', 'Exact match')]}
          productCells={[cell('product', 'Single product')]}
        />

        {hasAuto && (
          <div className="cc-tg-row cc-tg-row--auto" style={{ ['--tg-accent' as string]: INTENT.auto.color }}>
            <div className="cc-tg-label">
              <span className="cc-tg-label__copy">
                <strong>Auto targeting types</strong>
                <small>Keep at least one selected.</small>
              </span>
            </div>
            <div className="cc-tg-cells cc-tg-cells--wide cc-tg-cells--two">
              {AUTO_TYPE_CATALOG.map((a) => {
                const on = autoTypes.includes(a.id);
                const last = on && autoTypes.length === 1;
                return (
                  <div
                    key={a.id} role="checkbox" aria-checked={on} aria-label={a.label} aria-disabled={last} tabIndex={0} className="cc-tg-tile cc-tg-tile--stacked"
                    title={last ? 'At least one type must stay selected' : undefined}
                    onClick={() => toggleAutoType(a.id)}
                    onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleAutoType(a.id); } }}
                  >
                    <Checkbox checked={on} />
                    <span className="cc-tg-tile__text">
                      {a.label}
                      <small>{a.description}</small>
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="cc-tg-note">
              The Product + Multiple Auto structure (Structure 5) creates one Auto campaign per selected type per product, so {autoTypes.length} {autoTypes.length === 1 ? 'type' : 'types'} means {autoTypes.length} Auto {autoTypes.length === 1 ? 'campaign' : 'campaigns'} for each product.
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 14 }}>
        {selected.length > 0 && unsupported.length === 0 && !productStyleOnly && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, font: `500 12.5px/1.5 ${FONT}`, color: GOOD }}>
            <span aria-hidden>✓</span> {selected.length} {selected.length === 1 ? 'strategy' : 'strategies'} selected — supported combination
          </div>
        )}
      </div>
    </div>
  );
}
