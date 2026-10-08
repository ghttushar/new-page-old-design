import { useState } from 'react';
import { BIDDING_STRATEGIES, formatCurrency, type BiddingStrategy, type CcCampaign, type CcDraft, type CcProduct, type PlacementAdjust } from '../campaign-creator.types';
import { Panel } from '../cc-design';
import { TextButton } from '../campaign-creator-ui';
import { CounterInput, MATCH_LABEL, NumField, PlacementCell, campaignLabel, typesOf } from './preview-cells';
import { rulesForCampaign } from './preview-rules';
import { TargetingPopup } from './preview-targets';
import { allocateByWeights, allocationGap, allocationMatches, performanceWeight, round2, withShares } from './budget-math';

// Sections 8.3 to 8.6 as one flat table: a row per campaign with its budget, bidding and targeting.
// The pencil on Targeting type opens the keyword popup. Section 8.7.7: a campaign's Rules sit under its name.

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const sum = (list: number[]) => list.reduce((s, n) => s + n, 0);
const PencilIcon = () => <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2.5 13.5l.7-3 7.6-7.6a1.4 1.4 0 0 1 2 0l.3.3a1.4 1.4 0 0 1 0 2l-7.6 7.6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const NO_PLACEMENT: PlacementAdjust = { top: null, product: null, rest: null };

type Mode = 'even' | 'performance' | 'custom';

export default function CampaignsTable({ draft, campaigns, selectedProducts, onCommit }: {
  draft: CcDraft; campaigns: CcCampaign[]; selectedProducts: CcProduct[]; onCommit: (next: CcCampaign[]) => void;
}) {
  const overall = draft.dailyBudget;
  const [mode, setMode] = useState<Mode>('even');
  const [editingId, setEditingId] = useState<string | null>(null);

  const patchCampaign = (id: string, patch: Partial<CcCampaign>) => onCommit(campaigns.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  const renameAdGroup = (id: string, name: string) => onCommit(campaigns.map((c) => (c.id === id ? { ...c, adGroups: c.adGroups.map((ag, i) => (i === 0 ? { ...ag, name } : ag)) } : c)));

  // Budget (8.4)
  const allocated = round2(sum(campaigns.map((c) => c.dailyBudget)));
  const gap = allocationGap(campaigns, overall);
  const ok = allocationMatches(campaigns, overall);

  function setBudget(id: string, value: number) {
    setMode('custom');
    onCommit(withShares(campaigns.map((c) => (c.id === id ? { ...c, dailyBudget: round2(value) } : c)), overall));
  }
  function pickMode(next: Mode) {
    setMode(next);
    if (next === 'even') onCommit(allocateByWeights(campaigns, campaigns.map(() => 1), overall));
    if (next === 'performance') onCommit(allocateByWeights(campaigns, campaigns.map((c) => performanceWeight(c, selectedProducts)), overall));
  }
  function rebalance() {
    setMode('custom');
    onCommit(allocateByWeights(campaigns, campaigns.map((c) => c.dailyBudget || 1), overall));
  }

  const editing = campaigns.find((c) => c.id === editingId);
  const adGroupTotal = sum(campaigns.map((c) => c.adGroups.length));

  return (
    <Panel
      title="Campaigns" pad="4px 20px 18px"
      aside={
        <label className="cc-pb-mode">
          <span>Split budget</span>
          <select className="cc-input" value={mode} aria-label="How the budget is split" onChange={(e) => pickMode(e.target.value as Mode)}>
            <option value="even">Evenly</option>
            <option value="performance">By performance</option>
            {mode === 'custom' && <option value="custom" disabled>Custom</option>}
          </select>
        </label>
      }
    >
      <div className="cc-scroll cc-ctab-scroll">
        <table className="cc-ctab">
          <colgroup>
            <col style={{ width: 270 }} /><col style={{ width: 84 }} /><col style={{ width: 170 }} /><col style={{ width: 196 }} /><col style={{ width: 210 }} /><col style={{ width: 210 }} /><col style={{ width: 210 }} />
          </colgroup>
          <thead>
            <tr><th>Campaign</th><th>Ad type</th><th>Budget</th><th>Bidding strategy</th><th>Adjust bids by placement</th><th>Ad group name</th><th>Targeting type</th></tr>
          </thead>
          <tbody>
            {campaigns.map((c) => {
              const rules = rulesForCampaign(draft, c.id);
              const targets = sum(c.adGroups.map((a) => a.targets.length));
              const negatives = sum(c.adGroups.map((a) => a.negatives.length));
              const share = overall > 0 ? Math.round((c.dailyBudget / overall) * 1000) / 10 : 0;
              const targetType = c.kind === 'auto' ? 'Automatic' : typesOf(c).map((t) => MATCH_LABEL[t]).join(', ') || 'None yet';
              return (
                <tr key={c.id}>
                  <td>
                    <span className="cc-ctab-two">
                      <CounterInput value={c.name} max={106} prefix="Anarix_" label="Campaign name" onChange={(v) => patchCampaign(c.id, { name: v })} />
                      {rules.length > 0 && <span className="cc-ctab-ruleline">{plural(rules.length, 'rule')}: {rules.join(', ')}</span>}
                    </span>
                  </td>
                  <td><span className="cc-ctab-type">{c.kind === 'auto' ? 'Auto' : 'Manual'}</span></td>
                  <td>
                    <span className="cc-ctab-budget">
                      <NumField value={c.dailyBudget} prefix="$" width={56} label={`Daily budget for ${campaignLabel(c)}`} onCommit={(v) => setBudget(c.id, v)} />
                      <span className="cc-num cc-ctab-pct">{share}%</span>
                    </span>
                  </td>
                  <td>
                    <select
                      className="cc-input cc-ctab-select" value={c.biddingStrategy ?? 'Fixed bids'} aria-label={`Bidding strategy for ${campaignLabel(c)}`}
                      onChange={(e) => patchCampaign(c.id, { biddingStrategy: e.target.value as BiddingStrategy })}
                    >
                      {BIDDING_STRATEGIES.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </td>
                  <td><PlacementCell value={c.placement ?? NO_PLACEMENT} campaignName={campaignLabel(c)} onChange={(v) => patchCampaign(c.id, { placement: v })} /></td>
                  <td><CounterInput value={c.adGroups[0]?.name ?? ''} max={235} label={`Ad group name for ${campaignLabel(c)}`} onChange={(v) => renameAdGroup(c.id, v)} /></td>
                  <td>
                    <span className="cc-ctab-targets">
                      <span className="cc-ctab-count">
                        <span className="cc-ctab-type">{targetType}</span>
                        <small>{c.kind === 'auto' ? 'Matched by the marketplace' : plural(targets, 'target')}{negatives > 0 ? ` · ${plural(negatives, 'negative')}` : ''}</small>
                      </span>
                      <button type="button" className="cc-ctab-edit" aria-label={`Edit targeting for ${campaignLabel(c)}`} onClick={() => setEditingId(c.id)}><PencilIcon /></button>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Total <span className="cc-ctab-sub cc-ctab-sub--inline">{plural(campaigns.length, 'campaign')} · {plural(adGroupTotal, 'ad group')}</span></td>
              <td className={`cc-num${ok ? '' : ' is-off'}`}>{formatCurrency(allocated)}</td>
              <td colSpan={4} />
            </tr>
          </tfoot>
        </table>
      </div>

      <div className={`cc-pb-status ${ok ? 'is-ok' : 'is-off'}`} role="status">
        {ok ? (
          <>
            <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 8.4l3.2 3.2L13 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span>The campaigns add up to your {formatCurrency(overall)} daily budget.</span>
          </>
        ) : (
          <>
            <span>{gap > 0 ? `${formatCurrency(gap)} over` : `${formatCurrency(-gap)} under`} your {formatCurrency(overall)} daily budget. The campaigns can't be created until the total matches.</span>
            <TextButton onClick={rebalance}>Rebalance to {formatCurrency(overall)}</TextButton>
          </>
        )}
      </div>

      {editing && (
        <TargetingPopup
          campaign={editing} onClose={() => setEditingId(null)}
          onSave={(next) => { onCommit(campaigns.map((x) => (x.id === next.id ? next : x))); setEditingId(null); }}
        />
      )}
    </Panel>
  );
}
