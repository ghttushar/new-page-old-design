import { Fragment, useEffect, useState } from 'react';
import {
  MARKETPLACE_CAPABILITY, accountCampaignLimits, generateCampaigns, totalAdGroups, totalTargets, formatCurrency,
  type CcCampaign, type CcDraft, type CcProduct,
} from '../campaign-creator.types';
import {
  BORDER, CheckIcon, ChevronRightIcon, FONT, GOOD, HAIR, Note, SectionTitle, StepHeading, SURFACE_MUTED, TEXT_FAINT,
  TEXT_MUTED, TEXT_PRIMARY, TextButton, WARN, WarningIcon,
} from '../campaign-creator-ui';
import { CampaignDetails } from './preview-targets';
import RulesSection, { ruleNamesForCampaign } from './preview-rules';

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '10px 14px', font: `500 12px/1 ${FONT}`, color: TEXT_MUTED,
  background: SURFACE_MUTED, borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap',
};
const TD: React.CSSProperties = { padding: '11px 14px', borderBottom: `1px solid ${HAIR}`, verticalAlign: 'middle' };

function KindMark({ auto }: { auto: boolean }) {
  const color = auto ? '#2f6fed' : '#77469b';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, font: `500 12.5px/1 ${FONT}`, color: TEXT_MUTED }}>
      <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden>
        {auto
          ? <circle cx="8" cy="8" r="6" stroke={color} strokeWidth="1.7" />
          : <path d="M8 1.6L14.4 8 8 14.4 1.6 8Z" stroke={color} strokeWidth="1.7" strokeLinejoin="round" />}
      </svg>
      {auto ? 'Auto' : 'Manual'}
    </span>
  );
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      <span style={{ color: TEXT_FAINT }}>{label}</span>{' '}
      <span className="cc-num" style={{ fontWeight: 600, color: TEXT_PRIMARY }}>{value}</span>
    </span>
  );
}

function CheckLine({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, font: `400 12.5px/1.6 ${FONT}`, color: ok ? TEXT_MUTED : WARN }}>
      <span style={{ display: 'inline-flex', width: 14, flex: 'none', justifyContent: 'center' }}>
        {ok ? <CheckIcon size={13} color={GOOD} /> : <WarningIcon size={12} color={WARN} />}
      </span>
      {children}
    </div>
  );
}

export default function StepPreview({ draft, selectedProducts, onChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!draft.structureId) return;
    const campaigns = draft.structureId === 'custom'
      ? (draft.customCampaigns ?? [])
      : generateCampaigns(draft.structureId, selectedProducts, draft.targetingStrategies, draft.dailyBudget, draft.autoTypes);
    onChange({ generatedCampaigns: campaigns });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.structureId, draft.productIds.join(','), draft.targetingStrategies.join(','), draft.autoTypes.join(','), draft.dailyBudget, draft.customCampaigns]);

  const campaigns = draft.generatedCampaigns ?? [];
  const marketplace = draft.marketplace ?? 'amazon';
  const capability = MARKETPLACE_CAPABILITY[marketplace];

  const commit = (next: CcCampaign[]) => onChange({ generatedCampaigns: next });

  function updateBudget(campaignId: string, value: number) {
    commit(withShares(campaigns.map((c) => (c.id === campaignId ? { ...c, dailyBudget: value } : c))));
  }
  function splitEvenly() {
    commit(allocateByWeights(campaigns, campaigns.map(() => 1), draft.dailyBudget));
  }
  function allocateByPerformance() {
    commit(allocateByWeights(campaigns, campaigns.map((c) => performanceWeight(c, selectedProducts)), draft.dailyBudget));
  }
  function updateCampaign(next: CcCampaign) {
    commit(campaigns.map((c) => (c.id === next.id ? next : c)));
  }

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const allocatedTotal = campaigns.reduce((s, c) => s + c.dailyBudget, 0);
  const allocationMismatch = Math.abs(allocatedTotal - draft.dailyBudget) > 0.5;
  const duplicateCount = campaigns.filter((c) => c.possibleDuplicate).length;
  const total: React.CSSProperties = { ...TD, borderBottom: 'none', background: SURFACE_MUTED, font: `600 13px/1.2 ${FONT}`, color: TEXT_PRIMARY };

  // §14 / §9 — the final validation shown in the confirmation block.
  const adGroupCount = totalAdGroups(campaigns);
  const targetCount = totalTargets(campaigns);
  const ineligible = selectedProducts.filter((p) => !p.eligible).length;
  const budgetMeetsMin = draft.dailyBudget >= capability.minDailyBudget;
  const invalidTargets = campaigns.reduce((n, c) => n + c.adGroups.reduce((m, ag) => m + ag.targets.filter((t) => !t.label.trim() || t.bid <= 0).length, 0), 0);
  const limits = accountCampaignLimits(marketplace);
  const withinLimit = campaigns.length <= limits.available;
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
      <StepHeading
        eyebrow="Step 5 of 5"
        title="Review before we create"
        subtitle={`${campaigns.length} campaigns across ${selectedProducts.length} product${selectedProducts.length === 1 ? '' : 's'}. Open a row to edit its targets and negatives, and set any daily budget right in the table.`}
      />

      {duplicateCount > 0 && (
        <div style={{ marginBottom: 14 }}>
          <Note tone="warn">{duplicateCount} of these campaigns {duplicateCount === 1 ? 'is a possible duplicate' : 'are possible duplicates'}, because at least one of their products already has a live campaign. You can still create them.</Note>
        </div>
      )}

      {/* Stats strip + table toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 22px', marginBottom: 10, font: `400 12.5px/1.6 ${FONT}` }}>
        <Stat label="Products" value={String(selectedProducts.length)} />
        <Stat label="Campaigns" value={String(campaigns.length)} />
        <Stat label="Ad groups" value={String(adGroupCount)} />
        <Stat label="Targets" value={String(targetCount)} />
        <Stat label="Daily budget" value={formatCurrency(draft.dailyBudget)} />
        <Stat label="Target ACOS" value={draft.targetAcos != null ? `${draft.targetAcos}%` : 'No target'} />
      </div>

      {campaigns.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '6px 20px', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <TextButton onClick={() => setOpen(new Set(campaigns.map((c) => c.id)))}>Expand all</TextButton>
            <TextButton onClick={() => setOpen(new Set())}>Collapse all</TextButton>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px 16px' }}>
            <span style={{ font: `400 12.5px/1 ${FONT}`, color: TEXT_FAINT }}>Budget</span>
            <TextButton onClick={splitEvenly}>Split evenly</TextButton>
            <TextButton onClick={allocateByPerformance}>Allocate by performance</TextButton>
            <span className="cc-num" style={{ font: `500 12.5px/1 ${FONT}`, color: allocationMismatch ? WARN : GOOD }}>
              Allocated {formatCurrency(allocatedTotal)} of {formatCurrency(draft.dailyBudget)}
            </span>
          </div>
        </div>
      )}

      <div className="cc-scroll" style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, font: `400 13px/1.4 ${FONT}` }}>
          <thead>
            <tr>
              <th style={{ ...TH, width: 36 }} />
              <th style={TH}>Campaign</th>
              <th style={TH}>Type</th>
              <th style={TH}>Targeting</th>
              <th style={{ ...TH, textAlign: 'right' }}>Ad groups</th>
              <th style={{ ...TH, textAlign: 'right' }}>Targets</th>
              <th style={TH}>Daily budget</th>
              <th style={{ ...TH, textAlign: 'right' }}>Share</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => {
              const isOpen = open.has(c.id);
              const isAuto = c.kind === 'auto';
              return (
                <Fragment key={c.id}>
                  <tr className="cc-row" onClick={() => toggle(c.id)} style={{ cursor: 'pointer' }}>
                    <td style={{ ...TD, paddingRight: 0 }}>
                      <button
                        type="button" aria-expanded={isOpen} aria-label={`${isOpen ? 'Hide' : 'Show'} details for ${c.name}`}
                        onClick={(e) => { e.stopPropagation(); toggle(c.id); }}
                        style={{ width: 22, height: 22, padding: 0, border: 'none', background: 'none', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 140ms ease-out' }}
                      ><ChevronRightIcon size={12} color={TEXT_MUTED} /></button>
                    </td>
                    <td style={{ ...TD, font: `500 13px/1.4 ${FONT}`, color: TEXT_PRIMARY, minWidth: 240 }}>
                      {c.name}
                      {c.possibleDuplicate && (
                        <div style={{ marginTop: 3, font: `400 12px/1.4 ${FONT}`, color: WARN }}>Possible duplicate — one of these products already has a live campaign</div>
                      )}
                    </td>
                    <td style={TD}><KindMark auto={isAuto} /></td>
                    <td style={{ ...TD, color: TEXT_MUTED }}>{isAuto ? 'Automatic' : c.targetingLabel}</td>
                    <td className="cc-num" style={{ ...TD, textAlign: 'right', color: TEXT_MUTED }}>{c.adGroups.length}</td>
                    <td className="cc-num" style={{ ...TD, textAlign: 'right', color: TEXT_MUTED }}>{c.adGroups.reduce((n, ag) => n + ag.targets.length, 0)}</td>
                    <td style={TD} onClick={(e) => e.stopPropagation()}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: TEXT_MUTED }}>
                        $
                        <input
                          className="cc-input cc-num" type="number" inputMode="decimal" value={c.dailyBudget} aria-label={`Daily budget for ${c.name}`}
                          onChange={(e) => updateBudget(c.id, Math.max(0, Number(e.target.value) || 0))}
                          style={{ width: 78, padding: '6px 8px', border: `1px solid ${BORDER}`, borderRadius: 6, font: `500 13px/1 ${FONT}`, color: TEXT_PRIMARY, outline: 'none', background: '#fff' }}
                        />
                      </span>
                    </td>
                    <td className="cc-num" style={{ ...TD, textAlign: 'right', color: TEXT_MUTED }}>{c.budgetAllocationPct}%</td>
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={8} style={{ padding: '10px 14px 18px 50px', borderBottom: `1px solid ${HAIR}`, background: SURFACE_MUTED }}>
                        <CampaignDetails campaign={c} ruleNames={ruleNamesForCampaign(draft, c.id, campaigns)} onChange={updateCampaign} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {campaigns.length === 0 && (
              <tr><td colSpan={8} style={{ padding: '40px 14px', textAlign: 'center', color: TEXT_MUTED }}>There's nothing to preview yet. Go back and choose a structure.</td></tr>
            )}
          </tbody>
          {campaigns.length > 0 && (
            <tfoot>
              <tr>
                <td style={total} />
                <td style={total}>Total</td>
                <td style={{ ...total, color: TEXT_MUTED, fontWeight: 400 }} colSpan={2}>{campaigns.length} campaigns</td>
                <td className="cc-num" style={{ ...total, textAlign: 'right' }}>{adGroupCount}</td>
                <td className="cc-num" style={{ ...total, textAlign: 'right' }}>{targetCount}</td>
                <td className="cc-num" style={{ ...total, color: allocationMismatch ? WARN : TEXT_PRIMARY }}>{formatCurrency(allocatedTotal)}</td>
                <td className="cc-num" style={{ ...total, textAlign: 'right' }}>100%</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {allocationMismatch && campaigns.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <Note tone="warn">Your campaign budgets add up to {formatCurrency(allocatedTotal)}, but the daily budget you set was {formatCurrency(draft.dailyBudget)}. Adjust a row above, or use Split evenly or Allocate by performance. You can't create the campaigns until they match.</Note>
        </div>
      )}

      {campaigns.length > 0 && (
        <RulesSection draft={draft} campaigns={campaigns} selectedProducts={selectedProducts} onChange={onChange} />
      )}

      {campaigns.length > 0 && (
        <section style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${BORDER}` }} aria-label="Ready to create campaigns">
          <SectionTitle>Ready to create campaigns</SectionTitle>
          <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '10px 28px' }}>
            {confirmRows.map(([k, v]) => (
              <div key={k}>
                <dt style={{ font: `400 12px/1.4 ${FONT}`, color: TEXT_FAINT }}>{k}</dt>
                <dd className="cc-num" style={{ margin: '2px 0 0', font: `600 14px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>{v}</dd>
              </div>
            ))}
          </dl>
          <div style={{ marginTop: 18 }}>
            <CheckLine ok={ineligible === 0}>{ineligible === 0 ? 'All selected products are eligible for advertising' : `${ineligible} selected product${ineligible === 1 ? ' is' : 's are'} not eligible for advertising`}</CheckLine>
            <CheckLine ok={budgetMeetsMin}>{budgetMeetsMin ? `Daily budget meets the ${capability.label} minimum of ${formatCurrency(capability.minDailyBudget)}` : `Daily budget is below the ${capability.label} minimum of ${formatCurrency(capability.minDailyBudget)}`}</CheckLine>
            <CheckLine ok={invalidTargets === 0}>{invalidTargets === 0 ? 'Targeting is valid' : `${invalidTargets} target${invalidTargets === 1 ? ' needs' : 's need'} a keyword and a bid above $0`}</CheckLine>
            <CheckLine ok={withinLimit}>{withinLimit ? `Within the campaign limit (${limits.available.toLocaleString()} available)` : `Over the campaign limit (${limits.available.toLocaleString()} available)`}</CheckLine>
            <CheckLine ok={!allocationMismatch}>{!allocationMismatch ? 'Campaign budgets add up to the daily budget' : 'Campaign budgets do not add up to the daily budget'}</CheckLine>
          </div>
        </section>
      )}
    </div>
  );
}
