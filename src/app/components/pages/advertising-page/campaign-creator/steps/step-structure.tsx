import { useEffect, useMemo, useState } from 'react';
import {
  AUTO_TYPE_CATALOG, STRUCTURE_CATALOG, accountCampaignLimits, formatCurrency, structureCounts, recommendStructure, validateCampaignLimit,
  type CcDraft, type CcProduct, type StructureId, type TargetingStrategyId,
} from '../campaign-creator.types';
import {
  BAD, BORDER, BRAND, BRAND_TINT, CheckIcon, FONT, HAIR, Note, Radio, RecommendedTag, SparkleGlyph, StepHeading,
  SURFACE_MUTED, TextButton, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY, WARN, WarningIcon,
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

function AutoLeaf({ label = 'Auto' }: { label?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
      <DiagStub />
      <CircleGlyph color={GLYPH.auto} />
      <SquareGlyph color={GLYPH.auto} />
      <LeafLabel>{label}</LeafLabel>
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

function ProductBranch({ index, hasAuto, autoLabels, manualTypes }: { index: number; hasAuto: boolean; autoLabels: string[]; manualTypes: TargetingStrategyId[] }) {
  const leaves: React.ReactNode[] = [];
  if (hasAuto) {
    if (autoLabels.length === 0) leaves.push(<AutoLeaf key="auto" />);
    else autoLabels.forEach((l) => leaves.push(<AutoLeaf key={`auto-${l}`} label={l} />));
  }
  manualTypes.forEach((t) => leaves.push(<TypeLeaf key={t} type={t} />));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <DiagStub />
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', borderRadius: 999, background: '#eaf5f1', border: `1px solid ${GLYPH.product}33` }}>
        <ProductGlyph color={GLYPH.product} size={16} />
        <span style={{ font: '700 12.5px/1 Inter,sans-serif', color: GLYPH.product }}>P{index + 1}</span>
      </div>
      {leaves.length > 0 && <DiagStub h={12} />}
      <DiagRake gap={12}>{leaves}</DiagRake>
    </div>
  );
}

/** A compact, iconographic diagram of how campaigns/ad groups will be organized for a given structure. */
function StructureDiagram({ structureId, productCount, hasAuto, manualTypes, autoLabels }: {
  structureId: StructureId; productCount: number; hasAuto: boolean; manualTypes: TargetingStrategyId[]; autoLabels: string[];
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
    <ProductBranch key={i} index={i} hasAuto={hasAuto} autoLabels={structureId === 'product-multi-auto' ? autoLabels : []} manualTypes={manualTypes} />
  ));
  if (extra > 0) branches.push(<MoreLeaf key="more" n={extra} />);
  return <DiagRake gap={16}>{branches}</DiagRake>;
}

function DiagramLegend() {
  const items: { glyph: React.ReactNode; label: string }[] = [
    { glyph: <CircleGlyph color={GLYPH.auto} size={14} />, label: 'Auto campaign' },
    { glyph: <DiamondGlyph color={GLYPH.manual} size={14} />, label: 'Manual campaign' },
    { glyph: <SquareGlyph color={TEXT_FAINT} size={11} />, label: 'Ad group' },
    { glyph: <KeywordGlyph color={TEXT_MUTED} size={13} />, label: 'Keyword target' },
    { glyph: <ProductGlyph color={TEXT_MUTED} size={13} />, label: 'Product target' },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px 18px' }}>
      {items.map((it) => (
        <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {it.glyph}
          <span style={{ font: `400 12px/1 ${FONT}`, color: TEXT_MUTED }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function StructureOption({ name, meta, committed, viewing, recommended, disabled, onClick }: {
  name: string; meta: string; committed: boolean; viewing: boolean; recommended: boolean; disabled: boolean; onClick: () => void;
}) {
  return (
    <div
      role="radio" aria-checked={committed} aria-disabled={disabled} tabIndex={0} className="cc-pick"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      style={{
        display: 'flex', gap: 12, padding: '12px 14px', borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1,
        border: `1.5px solid ${committed ? BRAND : viewing ? '#cdbfe0' : 'transparent'}`, background: committed ? BRAND_TINT : '#fff',
      }}
    >
      <span style={{ marginTop: 1 }}><Radio checked={committed} disabled={disabled} /></span>
      <div style={{ minWidth: 0 }}>
        <div style={{ font: `600 13.5px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>{name}</div>
        <div style={{ font: `400 12.5px/1.4 ${FONT}`, color: disabled ? BAD : TEXT_MUTED, marginTop: 2 }}>{meta}</div>
        {recommended && !disabled && <div style={{ marginTop: 6 }}><RecommendedTag /></div>}
      </div>
    </div>
  );
}

/** §7.6 — account campaign usage, with the active structure's estimate shown as a lighter extension of the bar. */
function LimitMeter({ used, limit, available, estimated }: { used: number; limit: number; available: number; estimated: number }) {
  const usedPct = Math.min((used / limit) * 100, 100);
  const over = estimated > available;
  const extPct = Math.min((estimated / limit) * 100, 100 - usedPct);
  return (
    <div style={{ marginTop: 14, maxWidth: 520 }}>
      <div className="cc-num" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, font: `400 12px/1.4 ${FONT}`, color: TEXT_MUTED }}>
        <span>Account campaign limit: <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{used.toLocaleString()}</b> of {limit.toLocaleString()} campaigns used · <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{available.toLocaleString()}</b> available</span>
        {estimated > 0 && <span style={{ color: over ? BAD : BRAND, fontWeight: 600, whiteSpace: 'nowrap' as const }}>+{estimated.toLocaleString()} with this structure</span>}
      </div>
      <div role="img" aria-label={`${used} of ${limit} campaigns used, ${estimated} more with this structure`} style={{ display: 'flex', height: 6, marginTop: 6, borderRadius: 999, background: HAIR, overflow: 'hidden' }}>
        <div style={{ width: `${usedPct}%`, background: '#b9bfc8' }} />
        <div style={{ width: `${extPct}%`, background: over ? '#e8b9b5' : '#c9b0df' }} />
      </div>
    </div>
  );
}

/** §7.6 / §7.9 — richer explanation for a structure that exceeds the account's available campaign limit. */
function UnavailablePanel({ total, available, alternatives, onPick, onJiva }: {
  total: number; available: number; alternatives: { id: StructureId; label: string }[]; onPick: (id: StructureId) => void; onJiva: () => void;
}) {
  return (
    <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 8, background: '#fdf8f1', font: `400 12.5px/1.55 ${FONT}`, color: '#3d434b', maxWidth: 520 }}>
      <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
        <span style={{ flex: 'none', marginTop: 2 }}><WarningIcon size={12} color={WARN} /></span>
        <span>This structure would create <b>{total.toLocaleString()}</b> campaigns, which exceeds the account's available campaign limit (<b>{available.toLocaleString()}</b>).</span>
      </div>
      <div style={{ margin: '10px 0 4px 21px', font: `600 12.5px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>Try one of the following:</div>
      <ul style={{ margin: '0 0 0 21px', padding: '0 0 0 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {alternatives.map((a) => <li key={a.id}><TextButton onClick={() => onPick(a.id)}>{a.label}</TextButton></li>)}
        <li><span style={{ color: TEXT_MUTED }}>Reduce the number of selected products</span></li>
        <li><TextButton onClick={onJiva}>Use Custom Structure with Jiva</TextButton></li>
      </ul>
    </div>
  );
}

// §7.3 — structure comparison. Auto / manual wording follows the requirements table.
const COMPARE_COPY: Record<StructureId, { auto: string; manual: string }> = {
  consolidated: { auto: '1', manual: '1' },
  'targeting-type': { auto: '1', manual: 'Multiple by targeting type' },
  'product-targeting': { auto: 'Multiple per product', manual: 'Multiple per product' },
  'product-single-auto': { auto: '1 per product', manual: 'Multiple per product' },
  'product-multi-auto': { auto: 'Multiple per product', manual: 'Multiple per product' },
  custom: { auto: 'User-defined', manual: 'User-defined' },
};

function CompareTable({ activeId, estimateFor, limit }: { activeId: StructureId; estimateFor: (id: StructureId) => number; limit: number }) {
  const th: React.CSSProperties = { textAlign: 'left', padding: '9px 10px', font: `600 11.5px/1.3 ${FONT}`, color: TEXT_MUTED, borderBottom: `1px solid ${BORDER}` };
  const td: React.CSSProperties = { padding: '9px 10px', font: `400 12.5px/1.4 ${FONT}`, color: '#3d434b', borderTop: `1px solid ${HAIR}`, verticalAlign: 'top' };
  return (
    <div style={{ marginTop: 22 }}>
      <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
        <colgroup>
          <col style={{ width: '24%' }} /><col style={{ width: '15%' }} /><col style={{ width: '19%' }} /><col style={{ width: '12%' }} /><col style={{ width: '13%' }} /><col style={{ width: '17%' }} />
        </colgroup>
        <thead>
          <tr>
            <th style={th}>Structure</th><th style={th}>Auto campaigns</th><th style={th}>Manual campaigns</th>
            <th style={th}>Product separation</th><th style={th}>Granularity</th><th style={th}>Est. campaigns</th>
          </tr>
        </thead>
        <tbody>
          {STRUCTURE_CATALOG.map((s) => {
            const isActive = s.id === activeId;
            const est = s.id === 'custom' ? null : estimateFor(s.id);
            const rowBg = isActive ? BRAND_TINT : 'transparent';
            return (
              <tr key={s.id} aria-current={isActive ? 'true' : undefined}>
                <td style={{ ...td, background: rowBg, fontWeight: 600, color: TEXT_PRIMARY }}>{s.number}. {s.name}</td>
                <td style={{ ...td, background: rowBg }}>{COMPARE_COPY[s.id].auto}</td>
                <td style={{ ...td, background: rowBg }}>{COMPARE_COPY[s.id].manual}</td>
                <td style={{ ...td, background: rowBg }}>{s.id === 'custom' ? 'User-defined' : s.productSeparation ? 'Yes' : 'No'}</td>
                <td style={{ ...td, background: rowBg }}>{s.granularity}</td>
                <td className="cc-num" style={{ ...td, background: rowBg, color: est !== null && est > limit ? BAD : '#3d434b' }}>
                  {est === null ? 'User-defined' : <>{est.toLocaleString()}{est > limit && <span style={{ color: BAD }}> · over limit</span>}</>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ margin: '8px 0 0', font: `400 11.5px/1.5 ${FONT}`, color: TEXT_FAINT }}>
        "1" in the Auto column means one consolidated Auto campaign when Auto targeting is selected. If Auto targeting is not selected, no Auto campaign is created.
      </p>
    </div>
  );
}

export default function StepStructure({ draft, selectedProducts, campaignLimit, onChange, onJivaChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; campaignLimit: number; onChange: (patch: Partial<CcDraft>) => void;
  onJivaChange: (open: boolean) => void;
}) {
  const [viewId, setViewId] = useState<StructureId | null>(null);
  const [whyFor, setWhyFor] = useState<StructureId | null>(null);
  const [compare, setCompare] = useState(false);

  const hasAuto = draft.targetingStrategies.includes('auto');
  const manualTypes = draft.targetingStrategies.filter((s) => s !== 'auto');
  const manualTypesCount = manualTypes.length;
  const productCount = selectedProducts.length;
  const autoTypesCount = Math.max(draft.autoTypes.length, 1);
  const autoLabels = draft.autoTypes.map((id) => AUTO_TYPE_CATALOG.find((a) => a.id === id)?.label ?? id);
  const limits = accountCampaignLimits(draft.marketplace ?? 'amazon');
  const countsFor = (id: StructureId) => structureCounts(id, productCount, hasAuto, manualTypesCount, autoTypesCount);

  const recommendation = useMemo(
    () => recommendStructure(productCount, manualTypesCount, draft.dailyBudget, campaignLimit),
    [productCount, manualTypesCount, draft.dailyBudget, campaignLimit],
  );

  function selectStructure(id: StructureId) {
    onChange({ structureId: id, customCampaigns: id === 'custom' ? draft.customCampaigns : null });
  }

  // Pre-select the recommendation the first time this step is reached with nothing chosen yet.
  useEffect(() => {
    if (!draft.structureId && validateCampaignLimit(countsFor(recommendation.structureId).totalCampaigns, campaignLimit).ok) {
      selectStructure(recommendation.structureId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeId: StructureId = viewId ?? draft.structureId ?? recommendation.structureId;
  const activeDef = STRUCTURE_CATALOG.find((s) => s.id === activeId)!;
  const activeCounts = activeId !== 'custom' ? countsFor(activeId) : null;
  const activeCheck = activeCounts ? validateCampaignLimit(activeCounts.totalCampaigns, campaignLimit) : { ok: true };
  const isRecommendedActive = recommendation.structureId === activeId && activeCheck.ok;
  const recommendedDef = STRUCTURE_CATALOG.find((s) => s.id === recommendation.structureId)!;
  const estimatedTotal = activeCounts ? activeCounts.totalCampaigns : (draft.customCampaigns?.length ?? 0);
  const perCampaignBudget = estimatedTotal > 0 ? draft.dailyBudget / estimatedTotal : null;
  const budgetTooLow = perCampaignBudget !== null && perCampaignBudget < 3;
  // §7.6 — only offer more consolidated structures that actually fit within the available limit.
  const alternatives = STRUCTURE_CATALOG
    .filter((s) => s.id !== 'custom' && s.id !== activeId && activeCounts
      && countsFor(s.id).totalCampaigns < activeCounts.totalCampaigns && validateCampaignLimit(countsFor(s.id).totalCampaigns, campaignLimit).ok)
    .slice(0, 3)
    .map((s) => ({ id: s.id, label: `Use Structure ${s.number} — ${s.name}` }));

  return (
    <div>
      <StepHeading
        eyebrow="Step 4 of 5"
        title="Choose how campaigns are organised"
        subtitle="Pick a structure on the left and the diagram shows exactly what we'll create from your products and targeting."
      />

      <div style={{ display: 'grid', gridTemplateColumns: '236px minmax(0, 1fr)', gap: 36, alignItems: 'start' }}>
        <div role="radiogroup" aria-label="Campaign structure" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {STRUCTURE_CATALOG.map((s) => {
            const isCustom = s.id === 'custom';
            const counts = isCustom ? null : countsFor(s.id);
            const check = counts ? validateCampaignLimit(counts.totalCampaigns, campaignLimit) : { ok: true };
            const disabled = !isCustom && !check.ok;
            const meta = isCustom
              ? 'Describe it, Jiva builds it'
              : disabled
                ? `${counts!.totalCampaigns.toLocaleString()} campaigns — over your limit`
                : `${counts!.totalCampaigns.toLocaleString()} campaign${counts!.totalCampaigns === 1 ? '' : 's'}`;
            return (
              <StructureOption
                key={s.id}
                name={s.name}
                meta={meta}
                committed={draft.structureId === s.id}
                viewing={activeId === s.id}
                recommended={recommendation.structureId === s.id}
                disabled={disabled}
                onClick={() => {
                  setViewId(s.id);
                  if (isCustom) { onJivaChange(true); return; }
                  onJivaChange(false);
                  // Unavailable structures stay viewable (with an explanation) but are never committed.
                  if (!disabled) selectStructure(s.id);
                }}
              />
            );
          })}
        </div>

        <section aria-live="polite" key={activeId} className="cc-enter">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16 }}>
            <h2 style={{ margin: 0, font: `600 18px/1.3 ${FONT}`, letterSpacing: '-0.01em', color: TEXT_PRIMARY }}>{activeDef.name}</h2>
            <TextButton onClick={() => setCompare((v) => !v)}>{compare ? 'Hide comparison' : 'Compare structures'}</TextButton>
          </div>
          <p style={{ margin: '4px 0 0', font: `400 13.5px/1.55 ${FONT}`, color: TEXT_MUTED, maxWidth: 520 }}>{activeId === 'custom' ? activeDef.description : activeDef.tagline}</p>
          {activeId !== 'custom' && (
            <p style={{ margin: '2px 0 0', font: `400 12.5px/1.5 ${FONT}`, color: TEXT_FAINT, maxWidth: 520 }}>{activeDef.useCase}</p>
          )}

          {activeCounts && (
            <p className="cc-num" style={{ margin: '10px 0 0', font: `400 13px/1.5 ${FONT}`, color: TEXT_MUTED }}>
              <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{activeCounts.autoCampaigns}</b> auto · <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{activeCounts.manualCampaigns}</b> manual · <b style={{ fontWeight: 600, color: activeCheck.ok ? BRAND : BAD }}>{activeCounts.totalCampaigns.toLocaleString()} campaigns</b> · <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{activeCounts.adGroups.toLocaleString()}</b> ad groups · <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{activeCounts.targets.toLocaleString()}</b> targets
            </p>
          )}

          <LimitMeter used={limits.used} limit={limits.limit} available={limits.available} estimated={estimatedTotal} />

          {activeCounts && !activeCheck.ok && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: `600 12.5px/1.4 ${FONT}`, color: BAD }}>
                <WarningIcon size={12} color={BAD} /> Unavailable: over the account campaign limit
              </span>
              <TextButton onClick={() => setWhyFor(whyFor === activeId ? null : activeId)}>Why is this unavailable?</TextButton>
            </div>
          )}
          {activeCounts && !activeCheck.ok && whyFor === activeId && (
            <UnavailablePanel
              total={activeCounts.totalCampaigns}
              available={campaignLimit}
              alternatives={alternatives}
              onPick={(id) => { setViewId(id); setWhyFor(null); onJivaChange(false); selectStructure(id); }}
              onJiva={() => { setViewId('custom'); setWhyFor(null); onJivaChange(true); }}
            />
          )}

          {activeId === 'custom' ? (
            <div style={{ marginTop: 22 }}>
              {draft.customCampaigns ? (
                <>
                  <div style={{ font: `600 13px/1.3 ${FONT}`, color: TEXT_PRIMARY, marginBottom: 10 }}>Jiva's proposal · {draft.customCampaigns.length} campaigns</div>
                  <div className="cc-scroll" style={{ border: `1px solid ${BORDER}`, borderRadius: 10, maxHeight: 280, overflowY: 'auto' }}>
                    {draft.customCampaigns.map((c, i) => (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 14px', borderTop: i === 0 ? 'none' : `1px solid ${HAIR}` }}>
                        <span style={{ font: `500 13px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>{c.name}</span>
                        <span style={{ font: `400 12px/1 ${FONT}`, color: TEXT_FAINT, whiteSpace: 'nowrap' as const }}>{c.adGroups.length} ad group{c.adGroups.length === 1 ? '' : 's'}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 16 }}>
                    {draft.structureId === 'custom'
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: `600 13px/1 ${FONT}`, color: '#1e8449' }}><CheckIcon size={13} color="#1e8449" /> Applied</span>
                      : <span style={{ font: `500 13px/1.4 ${FONT}`, color: WARN }}>Not applied yet. Accept it in the Ask Jiva panel.</span>}
                    <TextButton onClick={() => onJivaChange(true)}>Reopen Ask Jiva</TextButton>
                  </div>
                </>
              ) : (
                <button
                  type="button" className="cc-btn cc-primary" onClick={() => onJivaChange(true)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, border: 'none', background: BRAND, color: '#fff', font: `600 13px/1 ${FONT}`, cursor: 'pointer' }}
                >
                  <SparkleGlyph size={12} color="#fff" /> Ask Jiva to build it
                </button>
              )}
            </div>
          ) : (
            <>
              <div style={{ marginTop: 22 }}><DiagramLegend /></div>
              <div style={{ marginTop: 12, background: SURFACE_MUTED, borderRadius: 12, padding: '30px 20px 28px', minHeight: 300 }}>
                <StructureDiagram structureId={activeId} productCount={productCount} hasAuto={hasAuto} manualTypes={manualTypes} autoLabels={autoLabels} />
              </div>

              {isRecommendedActive && (
                <div style={{ marginTop: 14 }}>
                  <Note>
                    <b style={{ fontWeight: 600 }}>Recommended: Structure {recommendedDef.number} — {recommendedDef.name}.</b> {recommendation.reason} <b style={{ fontWeight: 600 }}>Estimated campaigns: {activeCounts!.totalCampaigns.toLocaleString()}</b>
                  </Note>
                </div>
              )}
            </>
          )}

          {budgetTooLow && perCampaignBudget !== null && (
            <div style={{ marginTop: 14 }}>
              <Note tone="warn">
                Your budget may not support the selected campaign structure. Try Consolidated or Targeting-Type, or increase your budget. Your {formatCurrency(draft.dailyBudget)} daily budget works out to about {formatCurrency(Math.round(perCampaignBudget * 100) / 100)} per campaign across {estimatedTotal.toLocaleString()} campaigns.
              </Note>
            </div>
          )}

          {compare && <CompareTable activeId={activeId} estimateFor={(id) => countsFor(id).totalCampaigns} limit={campaignLimit} />}
        </section>
      </div>
    </div>
  );
}
