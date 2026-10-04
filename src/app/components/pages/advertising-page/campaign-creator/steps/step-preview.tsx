import { Fragment, useEffect, useState } from 'react';
import { generateCampaigns, totalAdGroups, totalTargets, formatCurrency, type CcDraft, type CcProduct } from '../campaign-creator.types';
import { BORDER, ChevronRightIcon, Pill, StepHeading, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

const TH: React.CSSProperties = {
  textAlign: 'left', padding: '11px 14px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase',
  color: TEXT_FAINT, background: '#fafbfd', borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap',
};
const TD: React.CSSProperties = { padding: '10px 14px', borderBottom: '1px solid #f1f2f4', verticalAlign: 'middle' };

export default function StepPreview({ draft, selectedProducts, onChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!draft.structureId) return;
    const campaigns = draft.structureId === 'custom'
      ? (draft.customCampaigns ?? [])
      : generateCampaigns(draft.structureId, selectedProducts, draft.targetingStrategies, draft.dailyBudget);
    onChange({ generatedCampaigns: campaigns });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.structureId, draft.productIds.join(','), draft.targetingStrategies.join(','), draft.dailyBudget, draft.customCampaigns]);

  const campaigns = draft.generatedCampaigns ?? [];

  function updateBudget(campaignId: string, value: number) {
    const next = campaigns.map((c) => (c.id === campaignId ? { ...c, dailyBudget: value } : c));
    const total = next.reduce((s, c) => s + c.dailyBudget, 0);
    onChange({ generatedCampaigns: next.map((c) => ({ ...c, budgetAllocationPct: total > 0 ? Math.round((c.dailyBudget / total) * 1000) / 10 : 0 })) });
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
  const strong: React.CSSProperties = { ...TD, borderBottom: 'none', font: '700 12px/1 Inter,sans-serif', color: TEXT_PRIMARY };

  return (
    <div>
      <StepHeading title="Preview & confirm" subtitle="Review exactly what will be created. Expand a campaign to see its ad groups and targets, and edit budgets inline." />

      <div style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', font: '400 12px/1.4 Inter,sans-serif' }}>
          <thead>
            <tr>
              <th style={{ ...TH, width: 34 }} />
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
                  <tr onClick={() => toggle(c.id)} style={{ cursor: 'pointer', background: isOpen ? '#fafbfd' : '#fff' }}>
                    <td style={{ ...TD, paddingRight: 0 }}>
                      <span style={{ display: 'flex', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 140ms ease-out' }}><ChevronRightIcon size={12} color={TEXT_MUTED} /></span>
                    </td>
                    <td style={{ ...TD, font: '600 12px/1.4 Inter,sans-serif', color: TEXT_PRIMARY, minWidth: 240 }}>{c.name}</td>
                    <td style={TD}><Pill label={isAuto ? 'Auto' : 'Manual'} color={isAuto ? '#2f6fed' : '#77469b'} bg={isAuto ? '#eaf2fd' : '#f6f2fb'} /></td>
                    <td style={{ ...TD, color: TEXT_MUTED }}>{isAuto ? 'Automatic' : c.targetingLabel}</td>
                    <td style={{ ...TD, textAlign: 'right', color: TEXT_MUTED }}>{c.adGroups.length}</td>
                    <td style={{ ...TD, textAlign: 'right', color: TEXT_MUTED }}>{c.adGroups.reduce((n, ag) => n + ag.targets.length, 0)}</td>
                    <td style={TD} onClick={(e) => e.stopPropagation()}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: TEXT_MUTED }}>
                        $<input type="number" value={c.dailyBudget} onChange={(e) => updateBudget(c.id, Math.max(0, Number(e.target.value) || 0))} style={{ width: 72, padding: '5px 7px', border: `1px solid ${BORDER}`, borderRadius: 6, font: '500 12px/1 Inter,sans-serif', outline: 'none' }} />
                      </span>
                    </td>
                    <td style={{ ...TD, textAlign: 'right', color: TEXT_MUTED }}>{c.budgetAllocationPct}%</td>
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={8} style={{ padding: '4px 14px 14px 48px', borderBottom: '1px solid #f1f2f4', background: '#fafbfd' }}>
                        {c.adGroups.map((ag) => (
                          <div key={ag.id} style={{ marginTop: 8, paddingLeft: 14, borderLeft: `2px solid ${BORDER}` }}>
                            <div style={{ font: '600 11.5px/1.4 Inter,sans-serif', color: TEXT_MUTED, marginBottom: 4 }}>{ag.name}</div>
                            {ag.targets.length === 0 && <div style={{ font: '400 11.5px/1.5 Inter,sans-serif', color: TEXT_FAINT }}>Automatic targeting — no individual targets to configure.</div>}
                            {ag.targets.map((t) => (
                              <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0', font: '400 12px/1.5 Inter,sans-serif' }}>
                                <span style={{ color: TEXT_PRIMARY }}>{t.label}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                  <span style={{ font: '400 10.5px/1 Inter,sans-serif', color: TEXT_FAINT }}>{t.source}</span>
                                  <span style={{ font: '600 12px/1 Inter,sans-serif', color: TEXT_MUTED, minWidth: 44, textAlign: 'right' }}>${t.bid.toFixed(2)}</span>
                                </span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {campaigns.length === 0 && (
              <tr><td colSpan={8} style={{ padding: '34px 14px', textAlign: 'center', color: TEXT_FAINT }}>No campaigns to show yet — go back and complete the Structure step.</td></tr>
            )}
          </tbody>
          {campaigns.length > 0 && (
            <tfoot>
              <tr style={{ background: '#fafbfd' }}>
                <td style={{ ...TD, borderBottom: 'none' }} />
                <td style={strong}>Total</td>
                <td style={{ ...TD, borderBottom: 'none', color: TEXT_MUTED }} colSpan={2}>{campaigns.length} campaigns · {selectedProducts.length} product{selectedProducts.length === 1 ? '' : 's'}</td>
                <td style={{ ...strong, textAlign: 'right' }}>{totalAdGroups(campaigns)}</td>
                <td style={{ ...strong, textAlign: 'right' }}>{totalTargets(campaigns)}</td>
                <td style={{ ...strong, color: allocationMismatch ? '#a8763f' : TEXT_PRIMARY }}>{formatCurrency(allocatedTotal)}</td>
                <td style={{ ...strong, textAlign: 'right' }}>100%</td>
              </tr>
              {allocationMismatch && (
                <tr>
                  <td colSpan={8} style={{ padding: '9px 14px', background: '#fdf8f1', font: '500 11.5px/1.5 Inter,sans-serif', color: '#a8763f', borderTop: `1px solid ${BORDER}` }}>
                    Allocated total ({formatCurrency(allocatedTotal)}) doesn't match your daily budget ({formatCurrency(draft.dailyBudget)}).
                  </td>
                </tr>
              )}
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
