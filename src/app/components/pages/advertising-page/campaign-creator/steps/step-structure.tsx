// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { useEffect, useMemo, useState } from 'react';
import {
  AUTO_TYPE_CATALOG, MODE_STRUCTURES, STRUCTURE_CATALOG, accountCampaignLimits, structureTagline, formatCurrency, generateCampaigns, structureCounts, recommendStructure, validateCampaignLimit,
  splitManualTypes, structureVariantFor, structuresFor, variantsFor, usesSplits, customLocked, campaignsForPlan, countsForPlan, combinationNotes,
  type CampaignMode, type CcCampaign, type CcDraft, type CcProduct, type StructureId, type StructureVariant, type TargetingStrategyId,
} from '../campaign-creator.types';
import { StructureMap, groupCampaigns } from './structure-map';
import PerformanceEnhancer from './structure-splits';
import { Panel } from '../ccd-design';
import {
  BAD, BORDER, BRAND, BRAND_TINT, CheckIcon, Checkbox, FONT, HAIR, InfoIcon, Radio, SparkleGlyph, StepHeading,
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

function DiagramLegend() {
  const items: { glyph: React.ReactNode; label: string }[] = [
    { glyph: <ProductGlyph color={GLYPH.product} size={14} />, label: 'Product' },
    { glyph: <CircleGlyph color={GLYPH.auto} size={14} />, label: 'Auto campaign' },
    { glyph: <DiamondGlyph color={GLYPH.manual} size={14} />, label: 'Manual campaign' },
    { glyph: <SquareGlyph color={TEXT_FAINT} size={11} />, label: 'Ad group' },
  ];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: '8px 18px' }}>
      {items.map((it) => (
        <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {it.glyph}
          <span style={{ font: `400 12px/1 ${FONT}`, color: TEXT_MUTED }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function StructureOption({ id, number, name, tagline, meta, recommended, committed, viewing, disabled, disabledNote = 'Over account limit', info, plain, soon, onClick }: {
  id: StructureId; number: number; name: string; tagline: string; meta: string; recommended: boolean; committed: boolean; viewing: boolean; disabled: boolean; disabledNote?: string; info?: string;
  /** Three-structure layout: no number chip, and a "Coming soon" pill instead of the meta line for a locked option. */
  plain?: boolean; soon?: boolean; onClick: () => void;
}) {
  return (
    <div
      role="radio" aria-checked={committed} aria-disabled={disabled} tabIndex={disabled && plain ? -1 : 0} className={`ccd-pick ccd-structure-option${plain ? ' ccd-structure-option--plain' : ''}${committed ? ' is-selected' : ''}${viewing ? ' is-viewing' : ''}${disabled ? ' is-disabled' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      {!plain && <span className="ccd-so__num">0{number}</span>}
      <div className="ccd-so__copy">
        <strong>{name}{info && <span className="ccd-tm-info ccd-so__tip" title={info} role="img" aria-label={info}><InfoIcon size={12} color="#8a909b" /></span>}{soon && <em className="ccd-so__soon">Coming soon</em>}</strong>
        <span>{tagline}</span>
        {!plain && (meta || disabled) && (
          <div className="ccd-so__facts">
            {meta && <span>{meta}</span>}
            {disabled && disabledNote && <span className="is-warn">{disabledNote}</span>}
          </div>
        )}
      </div>
      <span className="ccd-so__radio"><Radio checked={committed} disabled={disabled} /></span>
    </div>
  );
}

/**
 * The viewed structure's variations, opened under its card: how its Manual campaigns split into ad groups. A sibling
 * of the card's radio rather than inside it, so each list stays its own radio group.
 */
function VariantList({ structureId, marketplace, name, value, disabled, onPick }: {
  structureId: StructureId; marketplace: CcDraft['marketplace']; name: string; value: StructureVariant; disabled: boolean; onPick: (v: StructureVariant) => void;
}) {
  return (
    <div className="ccd-sv ccd-enter" role="radiogroup" aria-label={`${name} variations`}>
      {variantsFor(structureId, marketplace).map((v) => {
        const on = value === v.id;
        return (
          <div
            key={v.id} role="radio" aria-checked={on} aria-disabled={disabled} tabIndex={disabled ? -1 : 0}
            className={`ccd-sv__opt${on ? ' is-on' : ''}`}
            onClick={() => !disabled && onPick(v.id)}
            onKeyDown={(e) => { if (!disabled && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onPick(v.id); } }}
          >
            <Radio checked={on} disabled={disabled} />
            <span className="ccd-sv__copy">
              <strong>{v.label}</strong>
              <span>{v.hint}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** §7.6 — account campaign usage, plus how many campaigns the active structure would add. */
function LimitMeter({ used, limit, available, estimated }: { used: number; limit: number; available: number; estimated: number }) {
  const over = estimated > available;
  return (
    <div style={{ marginTop: 14 }}>
      <div className="ccd-num" style={{ display: 'flex', alignItems: 'baseline', gap: 16, whiteSpace: 'nowrap', font: `400 12px/1.4 ${FONT}`, color: TEXT_MUTED }}>
        <span>Account campaign limit: <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{used.toLocaleString()}</b> of {limit.toLocaleString()} campaigns used · <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{available.toLocaleString()}</b> available</span>
        {estimated > 0 && <span style={{ color: TEXT_PRIMARY, fontWeight: 600, whiteSpace: 'nowrap' as const }}>+{estimated.toLocaleString()} with this structure</span>}
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

/** Spec v9 §4.4 tooltips. */
const STRUCTURE_TIPS: Partial<Record<StructureId, string>> = {
  consolidated: 'One Auto and one Manual campaign. Split ad groups to keep targets organised.',
  standard: 'Separate campaigns for each split you choose, for finer bids and reporting.',
  custom: 'Describe your own structure in plain language. Coming soon.',
};

// §7.3 — structure comparison. Auto / manual wording follows the requirements table.
const COMPARE_COPY: Record<StructureId, { auto: string; manual: string }> = {
  consolidated: { auto: '1', manual: '1' },
  'targeting-type': { auto: '1', manual: 'Per match type, plus 1 for products' },
  'product-targeting': { auto: '1 shared, an ad group per product', manual: 'Per product, as in Targeting-Type' },
  'product-single-auto': { auto: '1 per product', manual: 'Per product, as in Targeting-Type' },
  'product-multi-auto': { auto: '1 per Auto type, per product', manual: 'Per product, as in Targeting-Type' },
  custom: { auto: 'User-defined', manual: 'User-defined' },
};

function CompareTable({ activeId, estimateFor, limit, catalog, mode }: { activeId: StructureId; estimateFor: (id: StructureId) => number; limit: number; catalog: typeof STRUCTURE_CATALOG; mode: CampaignMode }) {
  const showAuto = mode !== 'manual';
  const showManual = mode !== 'auto';
  const th: React.CSSProperties = { textAlign: 'left', padding: '9px 10px', font: `600 11.5px/1.3 ${FONT}`, color: TEXT_MUTED, borderBottom: `1px solid ${BORDER}` };
  const td: React.CSSProperties = { padding: '9px 10px', font: `400 12.5px/1.4 ${FONT}`, color: '#3d434b', borderTop: `1px solid ${HAIR}`, verticalAlign: 'top' };
  return (
    <div className="ccd-structure-compare-table">
      <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
        <colgroup>
          <col style={{ width: '24%' }} /><col style={{ width: '15%' }} /><col style={{ width: '19%' }} /><col style={{ width: '12%' }} /><col style={{ width: '13%' }} /><col style={{ width: '17%' }} />
        </colgroup>
        <thead>
          <tr>
            <th style={th}>Structure</th>{showAuto && <th style={th}>Auto campaigns</th>}{showManual && <th style={th}>Manual campaigns</th>}
            <th style={th}>Product separation</th><th style={th}>Granularity</th><th style={th}>Est. campaigns</th>
          </tr>
        </thead>
        <tbody>
          {catalog.map((s, i) => {
            const isActive = s.id === activeId;
            const est = s.id === 'custom' ? null : estimateFor(s.id);
            const rowBg = isActive ? BRAND_TINT : 'transparent';
            return (
              <tr key={s.id} aria-current={isActive ? 'true' : undefined}>
                <td style={{ ...td, background: rowBg, fontWeight: 600, color: TEXT_PRIMARY }}>{i + 1}. {s.name}</td>
                {showAuto && <td style={{ ...td, background: rowBg }}>{COMPARE_COPY[s.id].auto}</td>}
                {showManual && <td style={{ ...td, background: rowBg }}>{COMPARE_COPY[s.id].manual}</td>}
                <td style={{ ...td, background: rowBg }}>{s.id === 'custom' ? 'User-defined' : s.productSeparation ? 'Yes' : 'No'}</td>
                <td style={{ ...td, background: rowBg }}>{s.granularity}</td>
                <td className="ccd-num" style={{ ...td, background: rowBg, color: est !== null && est > limit ? BAD : '#3d434b' }}>
                  {est === null ? 'User-defined' : <>{est.toLocaleString()}{est > limit && <span style={{ color: BAD }}> · over limit</span>}</>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Structure built from a list of campaigns (used for Jiva's custom structure, and for every structure's written view) ──

const campaignLabel = (c: CcCampaign) => (c.kind === 'auto' ? c.targetingLabel.replace('Automatic', 'Auto') : c.targetingLabel);

function WrittenStructure({ campaigns, products }: { campaigns: CcCampaign[]; products: CcProduct[] }) {
  const groups = groupCampaigns(campaigns, products);
  return (
    <div className="ccd-scroll" style={{ maxHeight: 400, overflowY: 'auto', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10 }}>
      {groups.map((g, gi) => (
        <div key={g.key} style={{ borderTop: gi === 0 ? 'none' : `1px solid ${BORDER}` }}>
          <div style={{ padding: '11px 14px 6px', font: `600 13px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>{g.title}</div>
          {g.campaigns.map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '6px 14px 6px 28px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: `400 13px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>
                {c.kind === 'auto' ? <CircleGlyph color={GLYPH.auto} size={12} /> : <DiamondGlyph color={GLYPH.manual} size={12} />}
                {campaignLabel(c)}
              </span>
              <span className="ccd-num" style={{ font: `400 12px/1 ${FONT}`, color: TEXT_FAINT, whiteSpace: 'nowrap' }}>{c.adGroups.length} ad group{c.adGroups.length === 1 ? '' : 's'}</span>
            </div>
          ))}
          <div style={{ height: 6 }} />
        </div>
      ))}
    </div>
  );
}

type StructureView = 'graphic' | 'written' | 'compare';

const viewStroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
/** A small comparison table. */
/** A small node tree: one parent branching into two children. */
const MapViewIcon = () => (
  <svg width={14} height={14} viewBox="0 0 16 16" aria-hidden {...viewStroke}>
    <circle cx="8" cy="3.2" r="1.7" /><circle cx="3.6" cy="12.6" r="1.7" /><circle cx="12.4" cy="12.6" r="1.7" />
    <path d="M7.1 4.7L4.5 11M8.9 4.7L11.5 11" />
  </svg>
);

/** The visualization card: an icon diagram or the written structure, switchable. */
function StructureCard({ view, onView, title, empty, legend, graphic, written, compare, count }: {
  count: number;
  view: StructureView; onView: (v: StructureView) => void; title?: string; empty?: string; legend: boolean; graphic: React.ReactNode; written: React.ReactNode; compare: React.ReactNode;
}) {
  return (
    <div className="ccd-structure-card">
      <div className="ccd-structure-card__head">
        <div><strong>{view === 'compare' ? `Compare the ${count} structures` : title ?? 'Campaign architecture'}</strong></div>
      </div>
      <div className={`ccd-structure-card__body ccd-structure-card__body--${view}`}>
        {view === 'compare' ? compare : empty ? (
          <div style={{ padding: '70px 20px', textAlign: 'center', font: `400 13px/1.6 ${FONT}`, color: TEXT_MUTED }}>{empty}</div>
        ) : graphic}
      </div>
    </div>
  );
}

export default function StepStructure({ draft, selectedProducts, campaignLimit, jivaOpen, onChange, onJivaChange, groupCount = 0, applyAll = false, onApplyAll }: {
  draft: CcDraft; selectedProducts: CcProduct[]; campaignLimit: number; onChange: (patch: Partial<CcDraft>) => void;
  jivaOpen: boolean;
  onJivaChange: (open: boolean) => void;
  /** Product groups in the plan, and the "Apply to all groups" checkbox above the structure block (spec v9 §4.1). */
  groupCount?: number; applyAll?: boolean; onApplyAll?: (on: boolean) => void;
}) {
  const [viewId, setViewId] = useState<StructureId | null>(null);
  const [whyFor, setWhyFor] = useState<StructureId | null>(null);
  const [view, setView] = useState<StructureView>('graphic');

  const hasAuto = draft.targetingStrategies.includes('auto');
  const manualTypes = draft.targetingStrategies.filter((s) => s !== 'auto');
  const manualTypesCount = manualTypes.length;
  const productCount = selectedProducts.length;
  const autoTypesCount = Math.max(draft.autoTypes.length, 1);
  const autoLabels = draft.autoTypes.map((id) => AUTO_TYPE_CATALOG.find((a) => a.id === id)?.label ?? id);
  const limits = accountCampaignLimits(draft.marketplace ?? 'amazon');
  const mode: CampaignMode = draft.campaignMode ?? 'both';
  // The variation the campaigns are built with; shown only when there are Manual campaigns to split.
  const variant = structureVariantFor(draft.marketplace, draft.structureVariant);
  // Both marketplaces shape their campaigns with the Performance enhancer; the numbered structures and variations below
  // are only reached by older plans.
  const amazon = usesSplits(draft.marketplace);
  const showVariants = mode !== 'auto' && !amazon;
  const split = splitManualTypes(draft.targetingStrategies);
  const manualSplit = { keyword: split.keyword.length, product: split.product.length };
  // A structure other than the chosen one is counted with its default variation, as it would be picked.
  const countsFor = (id: StructureId) => (amazon
    ? countsForPlan({ ...draft, structureId: id }, productCount, draft.marketplace)
    : structureCounts(id, productCount, hasAuto, manualSplit, autoTypesCount, id === draft.structureId ? variant : 'match'));
  const allowed = structuresFor(mode, draft.marketplace);
  const catalog = STRUCTURE_CATALOG.filter((st) => allowed.includes(st.id));
  // A recommendation the type (or marketplace) can't use becomes its closest fit.
  const fitToMode = (id: StructureId): StructureId => {
    if (allowed.includes(id)) return id;
    if (mode === 'auto') return id === 'product-targeting' ? 'product-single-auto' : 'consolidated';
    return id === 'product-single-auto' || id === 'product-multi-auto' ? 'product-targeting' : 'consolidated';
  };

  const recommendation = useMemo(() => {
    // Consolidated is the default.
    if (amazon) return { structureId: 'consolidated' as StructureId, reason: '' };
    const r = recommendStructure(productCount, manualTypesCount, draft.dailyBudget, campaignLimit);
    return { ...r, structureId: fitToMode(r.structureId) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCount, manualTypesCount, draft.dailyBudget, campaignLimit, mode]);

  // A new structure starts on its default variation, Match type only.
  function selectStructure(id: StructureId, structureVariant: StructureVariant = id === draft.structureId ? draft.structureVariant ?? 'match' : 'match') {
    onChange({ structureId: id, structureVariant, customCampaigns: id === 'custom' ? draft.customCampaigns : null });
  }

  // Pre-select the recommendation the first time this step is reached with nothing chosen yet.
  useEffect(() => {
    // A structure this marketplace doesn't offer (one picked before switching, or Amazon's locked Custom) goes back to the default.
    const unusable = draft.structureId && (!allowed.includes(draft.structureId) || (draft.structureId === 'custom' && customLocked(draft.marketplace)));
    if (amazon && (!draft.structureId || unusable)) { selectStructure('consolidated'); return; }
    if ((!draft.structureId || unusable) && validateCampaignLimit(countsFor(recommendation.structureId).totalCampaigns, campaignLimit).ok) {
      selectStructure(recommendation.structureId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeId: StructureId = viewId ?? draft.structureId ?? recommendation.structureId;
  const activeDef = STRUCTURE_CATALOG.find((s) => s.id === activeId)!;
  const activeCounts = activeId !== 'custom' ? countsFor(activeId) : null;
  const activeCheck = activeCounts ? validateCampaignLimit(activeCounts.totalCampaigns, campaignLimit) : { ok: true };
  const estimatedTotal = activeCounts ? activeCounts.totalCampaigns : (draft.customCampaigns?.length ?? 0);
  const perCampaignBudget = estimatedTotal > 0 ? draft.dailyBudget / estimatedTotal : null;
  const budgetTooLow = perCampaignBudget !== null && perCampaignBudget < 3;
  // §7.6 — only offer more consolidated structures that actually fit within the available limit.
  // The campaigns the viewed structure would create: what the written view lists and the custom diagram draws.
  const viewedCampaigns = useMemo(
    () => (activeId === 'custom'
      ? draft.customCampaigns
      : amazon
        ? campaignsForPlan({ ...draft, structureId: activeId }, selectedProducts, draft.marketplace)
        : generateCampaigns(activeId, selectedProducts, draft.targetingStrategies, draft.dailyBudget, draft.autoTypes, activeId === draft.structureId ? variant : 'match')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeId, draft.structureId, variant, amazon, JSON.stringify(draft.splits ?? null), (draft.manualStrategies ?? []).join(','), draft.customCampaigns, selectedProducts.map((p) => p.id).join(','), draft.targetingStrategies.join(','), draft.dailyBudget, draft.autoTypes.join(',')],
  );
  const notes = activeId === 'custom' ? [] : combinationNotes({ ...draft, structureId: activeId });
  const alternatives = catalog
    .filter((s) => s.id !== 'custom' && s.id !== activeId && activeCounts
      && countsFor(s.id).totalCampaigns < activeCounts.totalCampaigns && validateCampaignLimit(countsFor(s.id).totalCampaigns, campaignLimit).ok)
    .slice(0, 3)
    .map((s) => ({ id: s.id, label: `Use Structure ${catalog.indexOf(s) + 1} — ${s.name}` }));

  return (
    <div className="ccd-step-structure">
      <StepHeading title="Choose how campaigns are organised" />

      <div className="ccd-structure-workspace">
        <aside className={`ccd-structure-library${amazon ? ' ccd-structure-library--splits' : ''}`}>
          <div className="ccd-structure-catalog-head ccd-structure-catalog-head--row">
            <div><strong>Choose your structure</strong></div>
            {groupCount > 1 && onApplyAll && (
              <button type="button" role="checkbox" aria-checked={applyAll} className="ccd-apply-all" onClick={() => onApplyAll(!applyAll)}>
                <Checkbox checked={applyAll} size={15} />
                <span>Apply to all groups</span>
                <span className="ccd-tm-info" title="Copies the changes you make here to every product group." role="img" aria-label="Copies the changes you make here to every product group."><InfoIcon size={12} color="#8a909b" /></span>
              </button>
            )}
          </div>
          {/* Consolidated / Standard / Custom as one compact segmented control, with the chosen one explained under it,
              so the whole left column fits one screen. */}
          {amazon && (
            <>
              <div role="radiogroup" aria-label="Campaign structure" className="ccd-seg">
                {catalog.map((s) => {
                  const locked = s.id === 'custom' && customLocked(draft.marketplace);
                  const on = draft.structureId === s.id;
                  const pick = () => { if (locked) return; setViewId(s.id); setView('graphic'); onJivaChange(false); selectStructure(s.id); };
                  return (
                    <div
                      key={s.id} role="radio" aria-checked={on} aria-disabled={locked} tabIndex={locked ? -1 : 0} title={STRUCTURE_TIPS[s.id]}
                      className={`ccd-seg__opt${on ? ' is-on' : ''}${locked ? ' is-locked' : ''}`}
                      onClick={pick} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } }}
                    >
                      <span>{s.name}</span>{locked && <em>Soon</em>}
                    </div>
                  );
                })}
              </div>
              {draft.structureId && STRUCTURE_TIPS[draft.structureId] && <p className="ccd-seg__desc">{STRUCTURE_TIPS[draft.structureId]}</p>}
            </>
          )}
          {!amazon && (
          <div role="radiogroup" aria-label="Campaign structure" className="ccd-structure-options">
          {catalog.map((s, i) => {
            const isCustom = s.id === 'custom';
            const counts = isCustom ? null : countsFor(s.id);
            const check = counts ? validateCampaignLimit(counts.totalCampaigns, campaignLimit) : { ok: true };
            // Custom is shown but locked; a structure over the limit stays pickable, as the splits change its count.
            const locked = isCustom && customLocked(draft.marketplace);
            const disabled = locked || (!amazon && !isCustom && !check.ok);
            const meta = isCustom ? (locked ? 'AI prompt' : 'Built with Jiva') : '';
            const open = showVariants && !isCustom && activeId === s.id;
            return (
              // Open, the card and its variations share one frame; the card stays its own radio inside it.
              <div key={s.id} className={`ccd-so-group${open ? ' is-open' : ''}${draft.structureId === s.id ? ' is-selected' : ''}`}>
              <StructureOption
                id={s.id}
                number={i + 1}
                name={s.name}
                tagline={structureTagline(s, mode)}
                info={STRUCTURE_TIPS[s.id]}
                meta={meta}
                recommended={recommendation.structureId === s.id}
                committed={draft.structureId === s.id}
                viewing={activeId === s.id}
                disabled={disabled}
                disabledNote={locked ? 'Not available yet' : undefined}
                plain={amazon} soon={locked}
                onClick={() => {
                  if (locked) return;
                  setViewId(s.id);
                  setView('graphic');
                  if (isCustom) { onJivaChange(true); return; }
                  onJivaChange(false);
                  // Unavailable structures stay viewable (with an explanation) but are never committed.
                  if (!disabled) selectStructure(s.id);
                }}
              />
              {open && (
                <VariantList
                  structureId={s.id} marketplace={draft.marketplace} name={s.name} disabled={disabled}
                  value={draft.structureId === s.id ? variant : 'match'}
                  onPick={(v) => { setViewId(s.id); selectStructure(s.id, v); }}
                />
              )}
              </div>
            );
          })}
          </div>
          )}
          {amazon ? (
            draft.structureId && draft.structureId !== 'custom' && <PerformanceEnhancer draft={draft} productCount={productCount} onChange={onChange} />
          ) : (
            <div className="ccd-structure-compare-row">
              <button
                type="button" className={`ccd-structure-compare-link${view === 'compare' ? ' is-active' : ''}`} aria-pressed={view === 'compare'}
                onClick={() => { setView('compare'); onJivaChange(false); }}
              >Compare structures</button>
            </div>
          )}
        </aside>

        <Panel pad={0} className="ccd-structure-studio">
          <section aria-live="polite" key={activeId} className="ccd-enter ccd-structure-detail">
          {view !== 'compare' && (
          <>
          <div className="ccd-structure-detail__intro">
            <div>
              <h2>{activeDef.name}</h2>
              {amazon && activeCounts && (
                <p className="ccd-structure-detail__count ccd-num">
                  {activeCounts.totalCampaigns.toLocaleString()} campaign{activeCounts.totalCampaigns === 1 ? '' : 's'} · {activeCounts.adGroups.toLocaleString()} ad group{activeCounts.adGroups === 1 ? '' : 's'}
                </p>
              )}
            </div>
          </div>

          {amazon && activeCounts && !activeCheck.ok && (
            <p className="ccd-pe__error" role="alert" style={{ marginTop: 12 }}>
              <WarningIcon size={12} />
              This would create {activeCounts.totalCampaigns.toLocaleString()} campaigns; the account has {campaignLimit.toLocaleString()} available. Turn off Split products or split by fewer types.
            </p>
          )}
          {!amazon && activeCounts && !activeCheck.ok && (
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: `600 12.5px/1.4 ${FONT}`, color: BAD }}>
                <WarningIcon size={12} color={BAD} /> Unavailable: over the account campaign limit
              </span>
              <TextButton onClick={() => setWhyFor(whyFor === activeId ? null : activeId)}>Why is this unavailable?</TextButton>
            </div>
          )}
          {!amazon && activeCounts && !activeCheck.ok && whyFor === activeId && (
            <UnavailablePanel
              total={activeCounts.totalCampaigns}
              available={campaignLimit}
              alternatives={alternatives}
              onPick={(id) => { setViewId(id); setWhyFor(null); onJivaChange(false); selectStructure(id); }}
              onJiva={() => { setViewId('custom'); setWhyFor(null); onJivaChange(true); }}
            />
          )}
          </>
          )}

          {activeId === 'custom' ? (
            <>
              <StructureCard
                view={view} onView={setView} legend
                title={draft.customCampaigns ? `Jiva's proposal · ${draft.customCampaigns.length} campaigns` : undefined}
                empty={draft.customCampaigns ? undefined : 'Ask Jiva to build a structure and it will appear here.'}
                graphic={draft.customCampaigns ? <StructureMap structureId="custom" campaigns={draft.customCampaigns} products={selectedProducts} /> : null}
                written={draft.customCampaigns ? <WrittenStructure campaigns={draft.customCampaigns} products={selectedProducts} /> : null}
                count={catalog.length}
                compare={<CompareTable activeId={activeId} estimateFor={(id) => countsFor(id).totalCampaigns} limit={campaignLimit} catalog={catalog} mode={mode} />}
              />
              <div style={{ marginTop: 18 }}>
                <button
                  type="button" className="ccd-btn ccd-primary" onClick={() => onJivaChange(true)} disabled={jivaOpen}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 8, border: 'none', background: jivaOpen ? '#eee7f5' : BRAND, color: jivaOpen ? '#c3b3d6' : '#fff', font: `600 13px/1 ${FONT}`, cursor: jivaOpen ? 'not-allowed' : 'pointer' }}
                >
                  <SparkleGlyph size={12} color={jivaOpen ? '#c3b3d6' : '#fff'} /> Ask Jiva
                </button>
              </div>
            </>
          ) : (
            <StructureCard
              view={view} onView={setView} legend
              graphic={viewedCampaigns ? <StructureMap structureId={activeId} campaigns={viewedCampaigns} products={selectedProducts} /> : null}
              written={viewedCampaigns ? <WrittenStructure campaigns={viewedCampaigns} products={selectedProducts} /> : null}
              count={catalog.length}
                compare={<CompareTable activeId={activeId} estimateFor={(id) => countsFor(id).totalCampaigns} limit={campaignLimit} catalog={catalog} mode={mode} />}
            />
          )}

          {/* Spec v9 §4.3: combinations that pair a brand strategy with a looser match type stay, with a note. */}
          {activeId !== 'custom' && notes.length > 0 && (
            <ul className="ccd-combo-notes" aria-label="Combination notes">
              {notes.map((n) => <li key={n.id}><b>{n.id}</b><span>{n.text}</span></li>)}
            </ul>
          )}

          </section>
        </Panel>
      </div>
    </div>
  );
}
