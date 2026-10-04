import { useEffect, useMemo, useState } from 'react';
import {
  STRUCTURE_CATALOG, structureCounts, recommendStructure, validateCampaignLimit,
  type CcDraft, type CcProduct, type StructureId, type TargetingStrategyId,
} from '../campaign-creator.types';
import {
  BAD, BORDER, BRAND, BRAND_TINT, SparkleGlyph, StepHeading,
  TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY, WARN,
} from '../campaign-creator-ui';

// ── Custom iconography for the structure diagram (circle = Auto, diamond = Manual, square = Ad Group) ──

const GLYPH = { auto: '#2f6fed', manual: '#77469b', product: '#3f7d6a', more: TEXT_FAINT };

function CircleGlyph({ color, size = 28 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.7" fill="none" /></svg>;
}
function DiamondGlyph({ color, size = 28 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16"><path d="M8 1.6L14.4 8 8 14.4 1.6 8Z" stroke={color} strokeWidth="1.7" fill="none" strokeLinejoin="round" /></svg>;
}
function SquareGlyph({ color, size = 18 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 14 14"><rect x="1.5" y="1.5" width="11" height="11" rx="2.5" fill={color} /></svg>;
}
function KeywordGlyph({ color, size = 20 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 14 14"><path d="M2 2h4.6L12 7.4 7.4 12 2 6.6Z" stroke={color} strokeWidth="1.3" fill="none" strokeLinejoin="round" /><circle cx="4" cy="4" r="0.85" fill={color} /></svg>;
}
function ProductGlyph({ color, size = 20 }: { color: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 14 14"><path d="M7 1.4L12.3 4.2v5.6L7 12.6 1.7 9.8V4.2Z" stroke={color} strokeWidth="1.3" fill="none" strokeLinejoin="round" /><path d="M1.7 4.2L7 7l5.3-2.8M7 7v5.6" stroke={color} strokeWidth="1.3" fill="none" /></svg>;
}

const TYPE_META: Partial<Record<TargetingStrategyId, { abbr: string; kind: 'keyword' | 'product' }>> = {
  exact: { abbr: 'Exact', kind: 'keyword' },
  phrase: { abbr: 'Phrase', kind: 'keyword' },
  broad: { abbr: 'Broad', kind: 'keyword' },
  brand: { abbr: 'Brand', kind: 'keyword' },
  product: { abbr: 'Product', kind: 'product' },
  competitor: { abbr: 'Competitor', kind: 'product' },
  category: { abbr: 'Category', kind: 'product' },
};

function DiagStub({ h = 14 }: { h?: number }) {
  return <div style={{ width: 1.5, height: h, background: BORDER, flex: 'none' }} />;
}

function DiagRake({ children, gap = 30 }: { children: React.ReactNode[]; gap?: number }) {
  if (children.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap, rowGap: 26, paddingTop: 14, borderTop: children.length > 1 ? `1.4px solid ${BORDER}` : 'none', justifyContent: 'center' }}>
      {children}
    </div>
  );
}

function LeafLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ font: '600 11px/1.2 Inter,sans-serif', color: TEXT_MUTED, whiteSpace: 'nowrap' as const }}>{children}</div>;
}

function AutoLeaf() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
      <DiagStub />
      <CircleGlyph color={GLYPH.auto} />
      <SquareGlyph color={GLYPH.auto} />
      <LeafLabel>Auto</LeafLabel>
    </div>
  );
}
function ManualConsolidatedLeaf() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
      <DiagStub />
      <DiamondGlyph color={GLYPH.manual} />
      <SquareGlyph color={GLYPH.manual} />
      <LeafLabel>Manual</LeafLabel>
    </div>
  );
}
function TypeLeaf({ type }: { type: TargetingStrategyId }) {
  const meta = TYPE_META[type] ?? { abbr: type, kind: 'keyword' as const };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
      <DiagStub />
      <DiamondGlyph color={GLYPH.manual} />
      <SquareGlyph color={GLYPH.manual} />
      {meta.kind === 'keyword' ? <KeywordGlyph color={GLYPH.manual} /> : <ProductGlyph color={GLYPH.manual} />}
      <LeafLabel>{meta.abbr}</LeafLabel>
    </div>
  );
}
function MoreLeaf({ n }: { n: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
      <DiagStub />
      <div style={{ width: 28, height: 28, borderRadius: '50%', border: `1.6px dashed ${TEXT_FAINT}` }} />
      <LeafLabel>+{n}</LeafLabel>
    </div>
  );
}

function ProductBranch({ index, hasAuto, manualTypes }: { index: number; hasAuto: boolean; manualTypes: TargetingStrategyId[] }) {
  const leaves: React.ReactNode[] = [];
  if (hasAuto) leaves.push(<AutoLeaf key="auto" />);
  manualTypes.forEach((t) => leaves.push(<TypeLeaf key={t} type={t} />));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <DiagStub />
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 999, background: '#eaf5f1', border: `1px solid ${GLYPH.product}33` }}>
        <ProductGlyph color={GLYPH.product} size={16} />
        <span style={{ font: '700 12.5px/1 Inter,sans-serif', color: GLYPH.product }}>P{index + 1}</span>
      </div>
      {leaves.length > 0 && <DiagStub h={12} />}
      <DiagRake gap={22}>{leaves}</DiagRake>
    </div>
  );
}

/** A compact, iconographic diagram of how campaigns/ad groups will be organized for a given structure. */
function StructureDiagram({ structureId, productCount, hasAuto, manualTypes }: {
  structureId: StructureId; productCount: number; hasAuto: boolean; manualTypes: TargetingStrategyId[];
}) {
  if (structureId === 'custom') return null;

  if (structureId === 'consolidated') {
    const leaves: React.ReactNode[] = [];
    if (hasAuto) leaves.push(<AutoLeaf key="auto" />);
    if (manualTypes.length) leaves.push(<ManualConsolidatedLeaf key="manual" />);
    return <DiagRake>{leaves}</DiagRake>;
  }

  if (structureId === 'targeting-type') {
    const leaves: React.ReactNode[] = [];
    if (hasAuto) leaves.push(<AutoLeaf key="auto" />);
    manualTypes.forEach((t) => leaves.push(<TypeLeaf key={t} type={t} />));
    return <DiagRake>{leaves}</DiagRake>;
  }

  // Product-separated structures (3, 4, 5): each product gets its own Auto + Manual-per-type branch.
  const count = Math.max(productCount, 0);
  const shown = Math.min(count, 4);
  const extra = count - shown;
  const branches: React.ReactNode[] = Array.from({ length: shown }, (_, i) => (
    <ProductBranch key={i} index={i} hasAuto={hasAuto} manualTypes={manualTypes} />
  ));
  if (extra > 0) branches.push(<MoreLeaf key="more" n={extra} />);
  return <DiagRake gap={44}>{branches}</DiagRake>;
}

function DiagramLegend() {
  const items: { glyph: React.ReactNode; label: string }[] = [
    { glyph: <CircleGlyph color={GLYPH.auto} size={13} />, label: 'Auto Campaign' },
    { glyph: <DiamondGlyph color={GLYPH.manual} size={13} />, label: 'Manual Campaign' },
    { glyph: <SquareGlyph color={TEXT_FAINT} size={10} />, label: 'Ad Group' },
    { glyph: <KeywordGlyph color={TEXT_MUTED} size={11} />, label: 'Keyword Target' },
    { glyph: <ProductGlyph color={TEXT_MUTED} size={11} />, label: 'Product Target' },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 14 }}>
      {items.map((it) => (
        <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {it.glyph}
          <span style={{ font: '500 10px/1 Inter,sans-serif', color: TEXT_FAINT }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function StructureOptionTile({ number, name, meta, committed, previewing, recommended, disabled, onClick }: {
  number: number; name: string; meta: string; committed: boolean; previewing: boolean; recommended: boolean; disabled: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderRadius: 12, textAlign: 'left' as const,
        cursor: disabled ? 'not-allowed' : 'pointer', position: 'relative' as const,
        border: `1.5px solid ${committed ? BRAND : previewing ? '#c3b3d6' : BORDER}`,
        background: committed ? BRAND_TINT : disabled ? '#fafbfd' : '#fff', opacity: disabled ? 0.55 : 1,
        boxShadow: previewing && !committed ? '0 0 0 3px #f6f2fb' : 'none',
        transition: 'border-color 120ms ease-out, background 120ms ease-out',
      }}
    >
      <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: committed ? BRAND : '#f1f2f4', color: committed ? '#fff' : TEXT_MUTED, font: '700 11.5px/1 Inter,sans-serif', flex: 'none' }}>
        {committed ? <CheckGlyph color="#fff" size={11} /> : number}
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ font: '700 12.5px/1.3 Inter,sans-serif', color: committed ? BRAND : TEXT_PRIMARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{name}</div>
        <div style={{ font: '500 10px/1.3 Inter,sans-serif', color: disabled ? BAD : TEXT_FAINT, marginTop: 2 }}>{meta}</div>
      </div>
      {recommended && !disabled && (
        <span style={{ position: 'absolute' as const, top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px #fff' }}>
          <SparkleGlyph size={9} color="#fff" />
        </span>
      )}
    </button>
  );
}

function CheckGlyph({ color = '#fff', size = 10 }: { color?: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 8.2l3.3 3.3L13 4.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function StepStructure({ draft, selectedProducts, campaignLimit, onChange, onJivaChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; campaignLimit: number; onChange: (patch: Partial<CcDraft>) => void;
  onJivaChange: (open: boolean) => void;
}) {
  const [viewId, setViewId] = useState<StructureId | null>(null);

  const hasAuto = draft.targetingStrategies.includes('auto');
  const manualTypes = draft.targetingStrategies.filter((s) => s !== 'auto');
  const manualTypesCount = manualTypes.length;
  const productCount = selectedProducts.length;

  const recommendation = useMemo(
    () => recommendStructure(productCount, manualTypesCount, draft.dailyBudget, campaignLimit),
    [productCount, manualTypesCount, draft.dailyBudget, campaignLimit],
  );

  function selectStructure(id: StructureId) {
    onChange({ structureId: id, customCampaigns: id === 'custom' ? draft.customCampaigns : null });
  }

  // Pre-select the recommendation the first time this step is reached with nothing chosen yet.
  useEffect(() => {
    if (!draft.structureId && validateCampaignLimit(structureCounts(recommendation.structureId, productCount, hasAuto, manualTypesCount).totalCampaigns, campaignLimit).ok) {
      selectStructure(recommendation.structureId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeId: StructureId = viewId ?? draft.structureId ?? recommendation.structureId;
  const activeDef = STRUCTURE_CATALOG.find((s) => s.id === activeId)!;
  const activeCounts = activeId !== 'custom' ? structureCounts(activeId, productCount, hasAuto, manualTypesCount) : null;
  const activeCheck = activeCounts ? validateCampaignLimit(activeCounts.totalCampaigns, campaignLimit) : { ok: true };

  const isRecommendedActive = recommendation.structureId === activeId && activeCheck.ok;
  const committedActive = draft.structureId === activeId;

  return (
    <div>
      <StepHeading title="Select ad structure" subtitle="This determines how your selected products and targeting are organized into campaigns and ad groups." />

      {/* Representation */}
      <div style={{ background: '#fff', border: `1.5px solid ${committedActive ? BRAND : BORDER}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 120ms ease-out' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <span style={{ width: 28, height: 28, borderRadius: 9, background: BRAND_TINT, color: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 13px/1 Inter,sans-serif', flex: 'none' }}>
            {activeId === 'custom' ? <SparkleGlyph size={16} /> : activeDef.number}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: '700 14.5px/1.3 Inter,sans-serif', color: TEXT_PRIMARY }}>{activeDef.name}</div>
            <div style={{ font: '400 11.5px/1.4 Inter,sans-serif', color: TEXT_MUTED }}>{activeDef.tagline}</div>
          </div>
          {isRecommendedActive && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 999, background: BRAND_TINT, font: '700 10px/1.5 Inter,sans-serif', letterSpacing: '0.03em', textTransform: 'uppercase' as const, color: BRAND }}>
              <SparkleGlyph size={9} /> Recommended
            </span>
          )}
        </div>

        {activeId === 'custom' ? (
          <div style={{ padding: 22 }}>
            <div style={{ font: '400 12.5px/1.6 Inter,sans-serif', color: TEXT_MUTED, marginBottom: 16 }}>{activeDef.description}</div>
            {draft.customCampaigns ? (
              <>
                <div style={{ font: '700 11.5px/1 Inter,sans-serif', color: '#5f3880', marginBottom: 10 }}>Jiva's proposed structure · {draft.customCampaigns.length} campaigns</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 260, overflowY: 'auto' }}>
                  {draft.customCampaigns.map((c) => (
                    <div key={c.id} style={{ padding: '9px 12px', borderRadius: 8, background: '#fafbfd', border: '1px solid #f1f2f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ font: '600 12px/1.4 Inter,sans-serif', color: TEXT_PRIMARY }}>{c.name}</span>
                      <span style={{ font: '500 11px/1 Inter,sans-serif', color: TEXT_FAINT }}>{c.adGroups.length} ad group{c.adGroups.length === 1 ? '' : 's'}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
                  {draft.structureId === 'custom'
                    ? <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: '700 12.5px/1 Inter,sans-serif', color: '#1e8449' }}><CheckGlyph color="#1e8449" size={12} /> Applied</span>
                    : <span style={{ font: '500 12px/1 Inter,sans-serif', color: WARN }}>Not applied yet — accept it in the Ask Jiva panel.</span>}
                  <span onClick={() => onJivaChange(true)} style={{ font: '600 12px/1 Inter,sans-serif', color: BRAND, cursor: 'pointer' }}>Reopen Ask Jiva →</span>
                </div>
              </>
            ) : (
              <button
                onClick={() => onJivaChange(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 18px', borderRadius: 8, border: 'none', background: BRAND, color: '#fff', font: '600 13px/1 Inter,sans-serif', cursor: 'pointer' }}
              >
                <SparkleGlyph size={12} color="#fff" /> Ask Jiva to build it
              </button>
            )}
          </div>
        ) : (
          <div style={{ padding: 14 }}>
            <div style={{ background: '#fafbfd', borderRadius: 12, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 10, padding: '9px 16px', borderBottom: `1px solid ${BORDER}`, background: '#fff' }}>
                <DiagramLegend />
                {activeCounts && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, font: '500 11px/1 Inter,sans-serif', color: TEXT_MUTED }}>
                    <span>Auto <b style={{ color: TEXT_PRIMARY }}>{activeCounts.autoCampaigns}</b></span>
                    <span>Manual <b style={{ color: TEXT_PRIMARY }}>{activeCounts.manualCampaigns}</b></span>
                    <span>Total <b style={{ color: BRAND }}>{activeCounts.totalCampaigns}</b></span>
                    <span>Ad groups <b style={{ color: TEXT_PRIMARY }}>{activeCounts.adGroups}</b></span>
                  </div>
                )}
              </div>
              <div style={{ padding: '30px 16px 30px', minHeight: 300, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                <div style={{ width: '100%' }}>
                  <StructureDiagram structureId={activeId} productCount={productCount} hasAuto={hasAuto} manualTypes={manualTypes} />
                </div>
              </div>
              {isRecommendedActive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderTop: `1px solid ${BORDER}`, background: BRAND_TINT, font: '400 11.5px/1.5 Inter,sans-serif', color: '#3d434b' }}>
                  <SparkleGlyph size={11} /> <span>{recommendation.reason}</span>
                </div>
              )}
              {!activeCheck.ok && (
                <div style={{ padding: '9px 16px', borderTop: `1px solid ${BORDER}`, background: '#fdf3f2', font: '600 11.5px/1.5 Inter,sans-serif', color: BAD }}>
                  Unavailable — {activeCheck.message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: TEXT_FAINT, margin: '26px 0 12px' }}>Choose a structure</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
        {STRUCTURE_CATALOG.map((s) => {
          const isCustom = s.id === 'custom';
          const counts = isCustom ? null : structureCounts(s.id, productCount, hasAuto, manualTypesCount);
          const check = counts ? validateCampaignLimit(counts.totalCampaigns, campaignLimit) : { ok: true };
          const disabled = !isCustom && !check.ok;
          const meta = isCustom
            ? 'Describe it, Jiva builds it'
            : disabled
              ? `Exceeds limit (${counts!.totalCampaigns.toLocaleString()})`
              : `${counts!.totalCampaigns.toLocaleString()} campaign${counts!.totalCampaigns === 1 ? '' : 's'}`;
          return (
            <StructureOptionTile
              key={s.id}
              number={s.number}
              name={s.name}
              meta={meta}
              committed={draft.structureId === s.id}
              previewing={activeId === s.id && draft.structureId !== s.id}
              recommended={recommendation.structureId === s.id}
              disabled={disabled}
              onClick={() => {
                if (disabled) return;
                setViewId(s.id);
                if (isCustom) { onJivaChange(true); return; }
                onJivaChange(false);
                selectStructure(s.id);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

