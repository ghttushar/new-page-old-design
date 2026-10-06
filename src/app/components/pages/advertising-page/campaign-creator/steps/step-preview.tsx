import { useEffect, useState } from 'react';
import {
  BIDDING_STRATEGIES, MARKETPLACE_CAPABILITY, generateCampaigns, totalAdGroups, totalTargets, formatCurrency,
  type BiddingStrategy, type CcCampaign, type PlacementAdjust, type CcDraft, type CcProduct,
} from '../campaign-creator.types';
import {
  BORDER, FONT, GOOD, HAIR, Note, SectionTitle, StepHeading, SURFACE_MUTED, TEXT_FAINT,
  TEXT_MUTED, TEXT_PRIMARY, TextButton, WARN, WarningIcon,
} from '../campaign-creator-ui';
import { Panel } from '../cc-design';
import RulesSection from './preview-rules';
import { CounterInput, IntentionBadge, PlacementCell, TargetTypeBadges, decorateCampaigns, intentionOf } from './preview-cells';

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '10px 14px', font: `500 12px/1 ${FONT}`, color: TEXT_MUTED,
  background: SURFACE_MUTED, borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap',
};
const TD: React.CSSProperties = { padding: '11px 14px', borderBottom: `1px solid ${HAIR}`, verticalAlign: 'middle' };

function KindMark({ auto }: { auto: boolean }) {
  return <span style={{ font: `500 12.5px/1 ${FONT}`, color: TEXT_PRIMARY }}>{auto ? 'Auto' : 'Manual'}</span>;
}

// ── Budget helpers (§8.4) ─────────────────────────────────────────────────────────────────────

/** Re-derives each campaign's share from its budget. */
function withShares(campaigns: CcCampaign[]): CcCampaign[] {
  const total = campaigns.reduce((s, c) => s + c.dailyBudget, 0);
  return campaigns.map((c) => ({ ...c, budgetAllocationPct: total > 0 ? Math.round((c.dailyBudget / total) * 1000) / 10 : 0 }));
}

/** Splits `budget` across weights to the cent; the rounding remainder goes to the heaviest campaign. */
function allocateByWeights(campaigns: CcCampaign[], weights: number[], budget: number): CcCampaign[] {
  if (campaigns.length === 0) return campaigns;
  const sum = weights.reduce((s, w) => s + w, 0) || 1;
  const cents = weights.map((w) => Math.floor((budget * 100 * w) / sum));
  const remainder = Math.round(budget * 100) - cents.reduce((s, n) => s + n, 0);
  cents[weights.indexOf(Math.max(...weights))] += remainder;
  return withShares(campaigns.map((c, i) => ({ ...c, dailyBudget: cents[i] / 100 })));
}

/** Mock "performance": campaigns holding lower-ACOS products get more. */
function performanceWeight(c: CcCampaign, products: CcProduct[]): number {
  const own = products.filter((p) => c.productIds.includes(p.id));
  if (own.length === 0) return 1;
  return own.reduce((s, p) => s + 1 / (p.acos > 0 ? p.acos : 30), 0) / own.length;
}

// ── Small pieces ──────────────────────────────────────────────────────────────────────────────

export default function StepPreview({ draft, selectedProducts, onChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const [allocMode, setAllocMode] = useState<'even' | 'performance'>('even');

  useEffect(() => {
    if (!draft.structureId) return;
    const campaigns = draft.structureId === 'custom'
      ? (draft.customCampaigns ?? [])
      : generateCampaigns(draft.structureId, selectedProducts, draft.targetingStrategies, draft.dailyBudget, draft.autoTypes);
    onChange({ generatedCampaigns: decorateCampaigns(campaigns, selectedProducts) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.structureId, draft.productIds.join(','), draft.targetingStrategies.join(','), draft.autoTypes.join(','), draft.dailyBudget, draft.customCampaigns]);

  const campaigns = draft.generatedCampaigns ?? [];
  const marketplace = draft.marketplace ?? 'amazon';
  const capability = MARKETPLACE_CAPABILITY[marketplace];

  const commit = (next: CcCampaign[]) => onChange({ generatedCampaigns: next });

  function updateBudget(campaignId: string, value: number) {
    commit(withShares(campaigns.map((c) => (c.id === campaignId ? { ...c, dailyBudget: value } : c))));
  }
  function patchCampaign(id: string, patch: Partial<CcCampaign>) {
    commit(campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function renameAdGroup(id: string, name: string) {
    commit(campaigns.map((c) => (c.id === id ? { ...c, adGroups: c.adGroups.map((ag, i) => (i === 0 ? { ...ag, name } : ag)) } : c)));
  }
  function splitEvenly() {
    commit(allocateByWeights(campaigns, campaigns.map(() => 1), draft.dailyBudget));
  }
  function allocateByPerformance() {
    commit(allocateByWeights(campaigns, campaigns.map((c) => performanceWeight(c, selectedProducts)), draft.dailyBudget));
  }
  const allocatedTotal = campaigns.reduce((s, c) => s + c.dailyBudget, 0);
  const allocationMismatch = Math.abs(allocatedTotal - draft.dailyBudget) > 0.5;
  const total: React.CSSProperties = { ...TD, borderBottom: 'none', background: SURFACE_MUTED, font: `600 13px/1.2 ${FONT}`, color: TEXT_PRIMARY };


  // Consecutive campaigns with the same promotion intention share one badge cell.
  const intentions = campaigns.map(intentionOf);
  const spans = intentions.map((it, i) => {
    if (i > 0 && intentions[i - 1] === it) return 0;
    let n = 1;
    while (i + n < intentions.length && intentions[i + n] === it) n += 1;
    return n;
  });

  const adGroupCount = totalAdGroups(campaigns);
  const targetCount = totalTargets(campaigns);
  const ruleCount = draft.ruleIds.length;

  const confirmRows: [string, string][] = [
    ['Marketplace', capability.label],
    ['Ad type', 'Sponsored Products'],
    ['Products', String(selectedProducts.length)],
    ['Campaigns', String(campaigns.length)],
    ['Ad groups', String(adGroupCount)],
    ['Targeting', String(targetCount)],
    ['Daily budget', formatCurrency(draft.dailyBudget)],
    ['Rules', String(ruleCount)],
  ];

  return (
    <div>
      <StepHeading title="Review before we create" />

      {campaigns.length > 0 && (
        <Panel style={{ marginBottom: 20 }}>
          <SectionTitle>Ready to create campaigns</SectionTitle>
          <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '10px 28px' }}>
            {confirmRows.map(([k, v]) => (
              <div key={k}>
                <dt style={{ font: `400 12px/1.4 ${FONT}`, color: TEXT_FAINT }}>{k}</dt>
                <dd className="cc-num" style={{ margin: '2px 0 0', font: `600 14px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      )}

      {campaigns.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '6px 20px', marginBottom: 10 }}>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, font: `500 13px/1 ${FONT}`, color: TEXT_MUTED }}>
            Budget
            <select
              className="cc-input" value={allocMode} aria-label="Budget allocation"
              onChange={(e) => {
                const mode = e.target.value as 'even' | 'performance';
                setAllocMode(mode);
                if (mode === 'even') splitEvenly(); else allocateByPerformance();
              }}
              style={{ padding: '7px 30px 7px 12px', border: `1px solid ${BORDER}`, borderRadius: 8, background: '#fff', font: `500 13px/1.2 ${FONT}`, color: TEXT_PRIMARY, outline: 'none', cursor: 'pointer' }}
            >
              <option value="even">Split evenly</option>
              <option value="performance">Allocate by performance</option>
            </select>
          </label>
        </div>
      )}

      <Panel pad={0} style={{ overflow: 'hidden' }}>
      <div className="cc-scroll" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', minWidth: 1304, tableLayout: 'fixed', borderCollapse: 'separate', borderSpacing: 0, font: `400 13px/1.4 ${FONT}` }}>
          <thead>
            <tr>
              <th style={{ ...TH, width: 148, whiteSpace: 'normal' }}>Promotion Intention</th>
              <th style={{ ...TH, width: 244 }}>Campaign</th>
              <th style={{ ...TH, width: 68 }}>Ad Type</th>
              <th style={{ ...TH, width: 148 }}>Budget</th>
              <th style={{ ...TH, width: 176 }}>Bidding Strategy</th>
              <th style={{ ...TH, width: 218 }} title="Replaces the campaign-level bid settings">Adjust bids by placement</th>
              <th style={{ ...TH, width: 176 }}>Ad Group Name</th>
              <th style={{ ...TH, width: 92 }}>Target type</th>
              <th style={{ ...TH, width: 82 }}>Targets</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => {
              const isAuto = c.kind === 'auto';
              const targets = c.adGroups.reduce((n, ag) => n + ag.targets.length, 0);
              const placement: PlacementAdjust = c.placement ?? { top: null, product: null, rest: null };
              return (
                <tr key={c.id} className="cc-row">
                  {spans[i] > 0 && (
                    <td rowSpan={spans[i]} style={{ ...TD, verticalAlign: 'top', paddingTop: 16, borderRight: `1px solid ${HAIR}` }}>
                      <IntentionBadge intention={intentions[i]} />
                    </td>
                  )}
                  <td style={TD}>
                    <CounterInput value={c.name} max={106} prefix="Anarix_" label={`Campaign name`} onChange={(v) => patchCampaign(c.id, { name: v })} />
                    {c.possibleDuplicate && (
                      <div style={{ marginTop: 4, font: `400 11.5px/1.4 ${FONT}`, color: WARN }}>Possible duplicate</div>
                    )}
                  </td>
                  <td style={TD}><KindMark auto={isAuto} /></td>
                  <td style={TD}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${BORDER}`, borderRadius: 7, background: '#fff', overflow: 'hidden' }}>
                        <span style={{ padding: '0 9px', alignSelf: 'stretch', display: 'flex', alignItems: 'center', background: SURFACE_MUTED, borderRight: `1px solid ${BORDER}`, color: TEXT_MUTED, font: `500 13px/1 ${FONT}` }}>$</span>
                        <input
                          className="cc-num" type="number" inputMode="decimal" value={c.dailyBudget} aria-label={`Daily budget for ${c.name}`}
                          onChange={(e) => updateBudget(c.id, Math.max(0, Number(e.target.value) || 0))}
                          style={{ width: 62, padding: '8px 8px', border: 'none', font: `500 13px/1.2 ${FONT}`, color: TEXT_PRIMARY, outline: 'none', background: 'transparent' }}
                        />
                      </span>
                      <span className="cc-num" style={{ font: `400 12.5px/1 ${FONT}`, color: TEXT_MUTED }}>{c.budgetAllocationPct.toFixed(2)}%</span>
                    </span>
                  </td>
                  <td style={TD}>
                    <select
                      className="cc-input" value={c.biddingStrategy ?? 'Fixed bids'} aria-label={`Bidding strategy for ${c.name}`}
                      onChange={(e) => patchCampaign(c.id, { biddingStrategy: e.target.value as BiddingStrategy })}
                      style={{ width: '100%', padding: '8px 26px 8px 10px', border: `1px solid ${BORDER}`, borderRadius: 7, background: '#fff', font: `400 13px/1.2 ${FONT}`, color: TEXT_PRIMARY, outline: 'none', cursor: 'pointer' }}
                    >
                      {BIDDING_STRATEGIES.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </td>
                  <td style={TD}><PlacementCell value={placement} campaignName={c.name} onChange={(v) => patchCampaign(c.id, { placement: v })} /></td>
                  <td style={TD}>
                    <CounterInput value={c.adGroups[0]?.name ?? ''} max={235} label={`Ad group name for ${c.name}`} onChange={(v) => renameAdGroup(c.id, v)} />
                  </td>
                  <td style={TD}><TargetTypeBadges campaign={c} /></td>
                  <td className="cc-num" style={{ ...TD, color: TEXT_PRIMARY, whiteSpace: 'nowrap' }}>
                    {isAuto && targets === 0 ? 'Automatic' : `${targets} Target${targets === 1 ? '' : 's'}`}
                  </td>
                </tr>
              );
            })}
            {campaigns.length === 0 && (
              <tr><td colSpan={9} style={{ padding: '40px 14px', textAlign: 'center', color: TEXT_MUTED }}>There's nothing to preview yet. Go back and choose a structure.</td></tr>
            )}
          </tbody>
          {campaigns.length > 0 && (
            <tfoot>
              <tr>
                <td style={total} colSpan={3}>Total <span style={{ color: TEXT_MUTED, fontWeight: 400 }}>· {campaigns.length} campaigns · {adGroupCount} ad groups</span></td>
                <td className="cc-num" style={{ ...total, color: allocationMismatch ? WARN : TEXT_PRIMARY }}>{formatCurrency(allocatedTotal)} <span style={{ color: TEXT_MUTED, fontWeight: 400 }}>100%</span></td>
                <td style={total} colSpan={4} />
                <td className="cc-num" style={total}>{targetCount}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      </Panel>

      {campaigns.length > 0 && (
        <RulesSection draft={draft} campaigns={campaigns} selectedProducts={selectedProducts} onChange={onChange} />
      )}

    </div>
  );
}
