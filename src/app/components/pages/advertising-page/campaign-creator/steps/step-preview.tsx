import { useMemo, useState } from 'react';
import ScopeSwitch from '../scope-switch';
import { HeadingGroup } from '../campaign-inline-summary';
import { MANUAL_STRATEGY_CATALOG, totalAdGroups, totalTargets, formatCurrency, type CcCampaign, type CcDraft, type CcProduct } from '../campaign-creator.types';
import { StepHeading } from '../campaign-creator-ui';
import { Panel } from '../ccd-design';
import RulesSection from './preview-rules';
import CampaignsTable from './preview-campaigns';
import { usePlanCampaigns } from './plan-campaigns';
import type { Scope } from '../product-groups';

// Section 8: Preview and confirm. Three parts: the summary, one table for the structure, budget and targeting, then the Rules.
// The campaigns are the ones built on Keywords, with the targets added there.

export default function StepPreview({ draft: sharedDraft, selectedProducts, scopes: groupScopes, onChange, rulesFocus = 0 }: {
  draft: CcDraft; selectedProducts: CcProduct[]; scopes: Scope[]; onChange: (patch: Partial<CcDraft>) => void;
  /** Bumped when the Create prompt's "Attach a Rule" sends the user to Rules. */
  rulesFocus?: number;
}) {
  const { campaigns, scopes, grouped, planBudget } = usePlanCampaigns(sharedDraft, groupScopes, selectedProducts, onChange);
  // Which group's campaigns the table shows: the first group until another is picked in the heading.
  const [groupId, setGroupId] = useState('');
  const shownScope = groupScopes.find((sc) => sc.id === groupId) ?? groupScopes[0];
  const noneWaiting = useMemo(() => new Set<string>(), []);
  const groupSwitch = grouped ? <HeadingGroup><ScopeSwitch scopes={groupScopes} activeId={shownScope.id} pending={noneWaiting} onChange={setGroupId} /></HeadingGroup> : undefined;
  const draft: CcDraft = { ...sharedDraft, dailyBudget: planBudget };
  const acosValues = Array.from(new Set(scopes.map((sc) => sc.draft.targetAcos)));

  const commit = (next: CcCampaign[]) => onChange({ generatedCampaigns: next });

  if (campaigns.length === 0) {
    return (
      <div>
        <StepHeading title="Review before we create" />
        <Panel><p style={{ margin: 0, padding: '28px 0', textAlign: 'center', font: '400 13.5px/1.5 Inter, sans-serif', color: '#646b76' }}>There's nothing to preview yet. Go back and choose a structure.</p></Panel>
      </div>
    );
  }

  const figures: [string, string][] = [
    ['Products', String(selectedProducts.length)],
    ['Campaigns', String(campaigns.length)],
    ['Ad groups', String(totalAdGroups(campaigns))],
    ['Targeting', String(totalTargets(campaigns))],
    ['Daily budget', formatCurrency(draft.dailyBudget)],
    ['Target ACOS', acosValues.length > 1 ? 'Varies by group' : acosValues[0] != null ? `${acosValues[0]}%` : 'Not set'],
  ];
  // The Manual strategies are a tag on the plan: shown once any group has one, as one list or "Varies by group".
  const strategyLists = Array.from(new Set(scopes.map((sc) => MANUAL_STRATEGY_CATALOG.filter((s) => (sc.draft.manualStrategies ?? []).includes(s.id)).map((s) => s.label).join(', '))));
  const strategyLine = !strategyLists.some(Boolean) ? null : strategyLists.length > 1 ? 'Varies by group' : strategyLists[0];

  return (
    <div>
      <StepHeading title="Review before we create" group={groupSwitch} />

      <div className="ccd-pv-stack">
        <Panel title="Plan at a glance" pad="20px 22px">
          <dl className="ccd-pv-sum">
            {figures.map(([k, v]) => <div key={k} className="ccd-pv-stat"><dt>{k}</dt><dd className="ccd-num">{v}</dd></div>)}
          </dl>
          {strategyLine && <p className="ccd-pv-tagline"><span>Strategy</span>{strategyLine}</p>}
        </Panel>

        {/* Rules sit above the table: with dozens of campaigns, a section under it would scroll out of sight. */}
        <RulesSection draft={draft} campaigns={campaigns} selectedProducts={selectedProducts} onChange={onChange} focusSignal={rulesFocus} />
        <CampaignsTable draft={draft} campaigns={campaigns} selectedProducts={selectedProducts} shownScope={shownScope} onCommit={commit} onApplyNaming={(naming, next) => onChange({ naming, generatedCampaigns: next })} />
      </div>
    </div>
  );
}
