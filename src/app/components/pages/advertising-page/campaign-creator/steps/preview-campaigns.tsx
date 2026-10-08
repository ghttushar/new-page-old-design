import { useMemo, useState } from 'react';
import { formatCurrency, type CcCampaign, type CcDraft, type CcProduct } from '../campaign-creator.types';
import { Panel } from '../cc-design';
import { TextButton } from '../campaign-creator-ui';
import { groupCampaigns } from './structure-map';
import { MATCH_LABEL, NumField, campaignLabel, typesOf } from './preview-cells';
import { rulesForCampaign } from './preview-rules';
import { TargetingPopup } from './preview-targets';
import { allocateByWeights, allocationGap, allocationMatches, performanceWeight, round2, withShares } from './budget-math';

// Sections 8.3 to 8.6 as one flat table: a row per campaign with its budget and targeting, products merged down the left.
// The pencil opens the targeting popup. Section 8.7.7: a campaign's Rules sit under its name.

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const PencilIcon = () => <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2.5 13.5l.7-3 7.6-7.6a1.4 1.4 0 0 1 2 0l.3.3a1.4 1.4 0 0 1 0 2l-7.6 7.6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
const sum = (list: number[]) => list.reduce((s, n) => s + n, 0);

type Mode = 'even' | 'performance' | 'custom';

export default function CampaignsTable({ draft, campaigns, selectedProducts, onCommit }: {
  draft: CcDraft; campaigns: CcCampaign[]; selectedProducts: CcProduct[]; onCommit: (next: CcCampaign[]) => void;
}) {
  const overall = draft.dailyBudget;
  const [mode, setMode] = useState<Mode>('even');
  const [editingId, setEditingId] = useState<string | null>(null);

  const groups = useMemo(() => groupCampaigns(campaigns, selectedProducts) as { key: string; title: string; productScoped: boolean; campaigns: CcCampaign[] }[], [campaigns, selectedProducts]);

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
          <colgroup><col style={{ width: 210 }} /><col /><col style={{ width: 210 }} /><col style={{ width: 170 }} /><col style={{ width: 170 }} /></colgroup>
          <thead>
            <tr><th>Product</th><th>Campaign</th><th>Daily budget</th><th>Target type</th><th>Targets</th></tr>
          </thead>
          <tbody>
            {groups.flatMap((g) => g.campaigns.map((c, i) => {
              const rules = rulesForCampaign(draft, c.id);
              const targets = sum(c.adGroups.map((a) => a.targets.length));
              const negatives = sum(c.adGroups.map((a) => a.negatives.length));
              const share = overall > 0 ? Math.round((c.dailyBudget / overall) * 1000) / 10 : 0;
              const adGroupLine = c.adGroups.length === 1 ? c.adGroups[0].name : plural(c.adGroups.length, 'ad group');
              const targetType = c.kind === 'auto' ? 'Automatic' : typesOf(c).map((t) => MATCH_LABEL[t]).join(', ') || 'None yet';
              return (
                <tr key={c.id} className={i === g.campaigns.length - 1 ? 'is-last' : undefined}>
                  {i === 0 && (
                    <td rowSpan={g.campaigns.length} className="cc-ctab-prod">
                      <span className="cc-ctab-ptitle">{g.title}</span>
                      <span className="cc-ctab-psub">{plural(g.campaigns.length, 'campaign')}</span>
                    </td>
                  )}
                  <td>
                    <span className="cc-ctab-two">
                      <span className="cc-ctab-name">{campaignLabel(c)}</span>
                      <span className="cc-ctab-sub">{adGroupLine}</span>
                      {rules.length > 0 && <span className="cc-ctab-ruleline">{plural(rules.length, 'rule')}: {rules.join(', ')}</span>}
                    </span>
                  </td>
                  <td>
                    <span className="cc-ctab-budget">
                      <NumField value={c.dailyBudget} prefix="$" width={56} label={`Daily budget for ${campaignLabel(c)}`} onCommit={(v) => setBudget(c.id, v)} />
                      <span className="cc-num cc-ctab-pct">{share}%</span>
                    </span>
                  </td>
                  <td><span className="cc-ctab-type">{targetType}</span></td>
                  <td>
                    <span className="cc-ctab-targets">
                      <span className="cc-ctab-count">
                        {c.kind === 'auto' ? 'Automatic' : plural(targets, 'Target')}
                        {negatives > 0 && <small>{plural(negatives, 'negative')}</small>}
                      </span>
                      <button type="button" className="cc-ctab-edit" aria-label={`Edit targeting for ${campaignLabel(c)}`} onClick={() => setEditingId(c.id)}><PencilIcon /></button>
                    </span>
                  </td>
                </tr>
              );
            }))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>Total <span className="cc-ctab-sub cc-ctab-sub--inline">{plural(campaigns.length, 'campaign')} · {plural(adGroupTotal, 'ad group')}</span></td>
              <td className={`cc-num${ok ? '' : ' is-off'}`}>{formatCurrency(allocated)}</td>
              <td />
              <td />
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
