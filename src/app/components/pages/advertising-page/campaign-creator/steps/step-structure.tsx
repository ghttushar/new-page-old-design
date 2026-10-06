import { useEffect, useMemo, useState } from 'react';
import {
  AUTO_TYPE_CATALOG, STRUCTURE_CATALOG, accountCampaignLimits, formatCurrency, generateCampaigns, structureCounts, recommendStructure, validateCampaignLimit,
  type CcCampaign, type CcDraft, type CcProduct, type StructureId, type TargetingStrategyId,
} from '../campaign-creator.types';
import { StructureMap, groupCampaigns } from './structure-map';
import { Panel } from '../cc-design';
import {
  BAD, BORDER, BRAND, BRAND_TINT, CheckIcon, FONT, HAIR, Radio, SparkleGlyph, StepHeading,
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

function StructureOption({ name, meta, committed, viewing, disabled, onClick }: {
  name: string; meta: string; committed: boolean; viewing: boolean; disabled: boolean; onClick: () => void;
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
      </div>
    </div>
  );
}

/** §7.6 — account campaign usage, plus how many campaigns the active structure would add. */
function LimitMeter({ used, limit, available, estimated }: { used: number; limit: number; available: number; estimated: number }) {
  const over = estimated > available;
  return (
    <div style={{ marginTop: 14 }}>
      <div className="cc-num" style={{ display: 'flex', alignItems: 'baseline', gap: 16, whiteSpace: 'nowrap', font: `400 12px/1.4 ${FONT}`, color: TEXT_MUTED }}>
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

// ── Structure built from a list of campaigns (used for Jiva's custom structure, and for every structure's written view) ──

const campaignLabel = (c: CcCampaign) => (c.kind === 'auto' ? c.targetingLabel.replace('Automatic', 'Auto') : c.targetingLabel);

function WrittenStructure({ campaigns, products }: { campaigns: CcCampaign[]; products: CcProduct[] }) {
  const groups = groupCampaigns(campaigns, products);
  return (
    <div className="cc-scroll" style={{ maxHeight: 400, overflowY: 'auto', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10 }}>
      {groups.map((g, gi) => (
        <div key={g.key} style={{ borderTop: gi === 0 ? 'none' : `1px solid ${BORDER}` }}>
          <div style={{ padding: '11px 14px 6px', font: `600 13px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>{g.title}</div>
          {g.campaigns.map((c) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '6px 14px 6px 28px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: `400 13px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>
                {c.kind === 'auto' ? <CircleGlyph color={GLYPH.auto} size={12} /> : <DiamondGlyph color={GLYPH.manual} size={12} />}
                {campaignLabel(c)}
              </span>
              <span className="cc-num" style={{ font: `400 12px/1 ${FONT}`, color: TEXT_FAINT, whiteSpace: 'nowrap' }}>{c.adGroups.length} ad group{c.adGroups.length === 1 ? '' : 's'}</span>
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
const CompareViewIcon = () => (
  <svg width={14} height={14} viewBox="0 0 16 16" aria-hidden {...viewStroke}>
    <rect x="2" y="2.5" width="12" height="11" rx="1.6" /><path d="M2 6.5h12M6.2 6.5v7M10 6.5v7" />
  </svg>
);
/** A small node tree: one parent branching into two children. */
const MapViewIcon = () => (
  <svg width={14} height={14} viewBox="0 0 16 16" aria-hidden {...viewStroke}>
    <circle cx="8" cy="3.2" r="1.7" /><circle cx="3.6" cy="12.6" r="1.7" /><circle cx="12.4" cy="12.6" r="1.7" />
    <path d="M7.1 4.7L4.5 11M8.9 4.7L11.5 11" />
  </svg>
);
/** An indented outline: parent line with nested lines beneath it. */
const OutlineViewIcon = () => (
  <svg width={14} height={14} viewBox="0 0 16 16" aria-hidden {...viewStroke}>
    <path d="M2.5 3.5h11M5.5 8h8M5.5 12.5h8M3 6v6.5" />
  </svg>
);

/** The visualization card: an icon diagram or the written structure, switchable. */
function StructureCard({ view, onView, title, empty, legend, graphic, written, compare }: {
  view: StructureView; onView: (v: StructureView) => void; title?: string; empty?: string; legend: boolean; graphic: React.ReactNode; written: React.ReactNode; compare: React.ReactNode;
}) {
  const tabs: { id: StructureView; label: string; hint: string; icon: React.ReactNode }[] = [
    { id: 'graphic', label: 'Map', hint: 'See the structure as a map of icons', icon: <MapViewIcon /> },
    { id: 'written', label: 'Outline', hint: 'Read the structure as an outline, campaign by campaign', icon: <OutlineViewIcon /> },
    { id: 'compare', label: 'Compare', hint: 'Compare all six structures side by side', icon: <CompareViewIcon /> },
  ];
  return (
    <div style={{ marginTop: 22, background: SURFACE_MUTED, borderRadius: 12, padding: '16px 20px 26px', minHeight: 300 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
        <span style={{ font: `600 13px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>{title}</span>
        <div role="radiogroup" aria-label="Structure view" style={{ display: 'inline-flex', padding: 2, borderRadius: 8, background: '#eceef2' }}>
          {tabs.map((t) => (
            <button
              key={t.id} type="button" role="radio" aria-checked={view === t.id} aria-label={t.hint} title={t.hint} className="cc-btn" onClick={() => onView(t.id)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', border: 'none', borderRadius: 6, background: view === t.id ? '#fff' : 'transparent', boxShadow: view === t.id ? '0 1px 2px rgba(20,24,33,.12)' : 'none', font: `600 12px/1 ${FONT}`, color: view === t.id ? TEXT_PRIMARY : TEXT_MUTED, cursor: 'pointer' }}
            >{t.icon}{t.label}</button>
          ))}
        </div>
      </div>
      {view === 'compare' ? compare : empty ? (
        <div style={{ padding: '70px 20px', textAlign: 'center', font: `400 13px/1.6 ${FONT}`, color: TEXT_MUTED }}>{empty}</div>
      ) : view === 'graphic' ? (
        <>
          {legend && <div style={{ marginBottom: 26 }}><DiagramLegend /></div>}
          {graphic}
        </>
      ) : written}
    </div>
  );
}

export default function StepStructure({ draft, selectedProducts, campaignLimit, jivaOpen, onChange, onJivaChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; campaignLimit: number; onChange: (patch: Partial<CcDraft>) => void;
  jivaOpen: boolean;
  onJivaChange: (open: boolean) => void;
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
  const estimatedTotal = activeCounts ? activeCounts.totalCampaigns : (draft.customCampaigns?.length ?? 0);
  const perCampaignBudget = estimatedTotal > 0 ? draft.dailyBudget / estimatedTotal : null;
  const budgetTooLow = perCampaignBudget !== null && perCampaignBudget < 3;
  // §7.6 — only offer more consolidated structures that actually fit within the available limit.
  // The campaigns the viewed structure would create: what the written view lists and the custom diagram draws.
  const viewedCampaigns = useMemo(
    () => (activeId === 'custom'
      ? draft.customCampaigns
      : generateCampaigns(activeId, selectedProducts, draft.targetingStrategies, draft.dailyBudget, draft.autoTypes)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeId, draft.customCampaigns, draft.productIds.join(','), draft.targetingStrategies.join(','), draft.dailyBudget, draft.autoTypes.join(',')],
  );
  const alternatives = STRUCTURE_CATALOG
    .filter((s) => s.id !== 'custom' && s.id !== activeId && activeCounts
      && countsFor(s.id).totalCampaigns < activeCounts.totalCampaigns && validateCampaignLimit(countsFor(s.id).totalCampaigns, campaignLimit).ok)
    .slice(0, 3)
    .map((s) => ({ id: s.id, label: `Use Structure ${s.number} — ${s.name}` }));

  return (
    <div>
      <StepHeading title="Choose how campaigns are organised" />

      <Panel pad={0}>
      <div style={{ display: 'grid', gridTemplateColumns: '256px minmax(0, 1fr)', alignItems: 'stretch' }}>
        <div style={{ padding: 12, borderRight: `1px solid ${BORDER}`, background: '#fcfcfe' }}>
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
        </div>

        <section aria-live="polite" key={activeId} className="cc-enter" style={{ padding: 22, minWidth: 0 }}>
          <h2 style={{ margin: 0, font: `600 18px/1.3 ${FONT}`, letterSpacing: '-0.01em', color: TEXT_PRIMARY }}>{activeDef.name}</h2>
          <p style={{ margin: '4px 0 0', font: `400 13.5px/1.55 ${FONT}`, color: TEXT_MUTED, ...(activeId === 'custom' ? { whiteSpace: 'nowrap' as const } : { maxWidth: 520 }) }}>{activeId === 'custom' ? activeDef.description : activeDef.tagline}</p>
          {activeId !== 'custom' && (
            <p style={{ margin: '2px 0 0', font: `400 12.5px/1.5 ${FONT}`, color: TEXT_FAINT, whiteSpace: 'nowrap' }}>{activeDef.useCase}</p>
          )}

          {activeCounts && (
            <p className="cc-num" style={{ margin: '10px 0 0', font: `400 13px/1.5 ${FONT}`, color: TEXT_MUTED }}>
              <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{activeCounts.autoCampaigns}</b> auto · <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{activeCounts.manualCampaigns}</b> manual · <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{activeCounts.totalCampaigns.toLocaleString()}</b> campaigns · <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{activeCounts.adGroups.toLocaleString()}</b> ad groups · <b style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{activeCounts.targets.toLocaleString()}</b> targets
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
            <>
              <StructureCard
                view={view} onView={setView} legend
                title={draft.customCampaigns ? `Jiva's proposal · ${draft.customCampaigns.length} campaigns` : undefined}
                empty={draft.customCampaigns ? undefined : 'Ask Jiva to build a structure and it will appear here.'}
                graphic={draft.customCampaigns ? <StructureMap structureId="custom" campaigns={draft.customCampaigns} products={selectedProducts} /> : null}
                written={draft.customCampaigns ? <WrittenStructure campaigns={draft.customCampaigns} products={selectedProducts} /> : null}
                compare={<CompareTable activeId={activeId} estimateFor={(id) => countsFor(id).totalCampaigns} limit={campaignLimit} />}
              />
              <div style={{ marginTop: 18 }}>
                <button
                  type="button" className="cc-btn cc-primary" onClick={() => onJivaChange(true)} disabled={jivaOpen}
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
              compare={<CompareTable activeId={activeId} estimateFor={(id) => countsFor(id).totalCampaigns} limit={campaignLimit} />}
            />
          )}

        </section>
      </div>
      </Panel>
    </div>
  );
}
