import { useEffect, useMemo, useState } from 'react';
import ScopeSwitch from '../scope-switch';
import { HeadingGroup } from '../campaign-inline-summary';
import { MIN_KEYWORD_BID, generateCampaigns, keywordRules, totalAdGroups, totalTargets, formatCurrency, type CcCampaign, type CcDraft, type CcProduct } from '../campaign-creator.types';
import { StepHeading } from '../campaign-creator-ui';
import { Panel } from '../ccd-design';
import RulesSection from './preview-rules';
import CampaignsTable from './preview-campaigns';
import { decorateCampaigns } from './preview-cells';
import { withShares } from './budget-math';
import { UNGROUPED_COLOR, pickSettings, type Scope } from '../product-groups';

const PRODUCT_MATCHES = ['product', 'category'];

/**
 * Puts the lists from the Keywords step into the generated campaigns:
 * - keyword targets on Manual ad groups that target keywords, and product targets (Amazon) on those that target products;
 * - negative keywords on every campaign that can take them (not Walmart Automatic campaigns with Dynamic bidding), and
 *   negative product targets (Amazon) on every campaign.
 */
function withKeywords(campaigns: CcCampaign[], draft: CcDraft): CcCampaign[] {
  const rules = keywordRules(draft, draft.marketplace);
  const keywords = rules.keywords === 'required' ? draft.keywordTargets.filter((k) => k.enabled) : [];
  const products = rules.products === 'required' ? (draft.productTargets ?? []).filter((p) => p.enabled) : [];
  const negatives = rules.negatives === 'unavailable' ? [] : draft.negativeKeywords.filter((k) => k.enabled);
  const negativeAsins = rules.negativeProducts ? (draft.negativeProducts ?? []).filter((p) => p.enabled) : [];
  if (keywords.length + products.length + negatives.length + negativeAsins.length === 0) return campaigns;
  return campaigns.map((c) => ({
    ...c,
    adGroups: c.adGroups.map((ag) => {
      const haveTarget = new Set(ag.targets.map((t) => `${t.label.toLowerCase()}|${t.matchType}`));
      const haveNegative = new Set(ag.negatives.map((n) => `${n.kind}|${n.text.toLowerCase()}|${n.matchType ?? ''}`));
      const targetsProducts = ag.targets.some((t) => PRODUCT_MATCHES.includes(t.matchType));
      const targetsKeywords = ag.targets.length === 0 || ag.targets.some((t) => !PRODUCT_MATCHES.includes(t.matchType));
      const keywordTargets = c.kind === 'manual' && targetsKeywords
        ? keywords.filter((k) => !haveTarget.has(`${k.text.toLowerCase()}|${k.match}`)).map((k) => ({ id: `${ag.id}-${k.id}`, label: k.text, matchType: k.match, bid: Math.max(k.bid, MIN_KEYWORD_BID), source: 'Custom input' as const }))
        : [];
      const productTargets = c.kind === 'manual' && targetsProducts
        ? products.filter((p) => !haveTarget.has(`${p.text.toLowerCase()}|${p.match}`)).map((p) => ({ id: `${ag.id}-${p.id}`, label: p.text, matchType: p.match, bid: Math.max(p.bid, MIN_KEYWORD_BID), source: 'Custom input' as const }))
        : [];
      const takesNegatives = !(c.kind === 'auto' && rules.negatives === 'manual-only');
      const addedKeywords = (takesNegatives ? negatives : [])
        .filter((n) => !haveNegative.has(`keyword|${n.text.toLowerCase()}|${n.match}`))
        .map((n) => ({ id: `${ag.id}-${n.id}`, text: n.text, kind: 'keyword' as const, matchType: n.match }));
      const addedAsins = negativeAsins
        .filter((n) => !haveNegative.has(`product|${n.text.toLowerCase()}|`))
        .map((n) => ({ id: `${ag.id}-${n.id}`, text: n.text.toUpperCase(), kind: 'product' as const }));
      return { ...ag, targets: [...ag.targets, ...keywordTargets, ...productTargets], negatives: [...ag.negatives, ...addedKeywords, ...addedAsins] };
    }),
  }));
}

// Section 8: Preview and confirm. Three parts: the summary, one table for the structure, budget and targeting, then the Rules.

export default function StepPreview({ draft: sharedDraft, selectedProducts, scopes: groupScopes, onChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; scopes: Scope[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  // Without groups the plan is one scope, exactly as before. With groups, each group builds its own campaigns from its own settings.
  const scopes: Scope[] = groupScopes.length > 0 ? groupScopes : [{ id: 'all', name: '', products: selectedProducts, color: UNGROUPED_COLOR, settings: pickSettings(sharedDraft), draft: sharedDraft }];
  const grouped = groupScopes.length > 0;
  // Which group's campaigns the table shows: the first group until another is picked in the heading.
  const [groupId, setGroupId] = useState('');
  const shownScope = groupScopes.find((sc) => sc.id === groupId) ?? groupScopes[0];
  const noneWaiting = useMemo(() => new Set<string>(), []);
  const groupSwitch = grouped ? <HeadingGroup><ScopeSwitch scopes={groupScopes} activeId={shownScope.id} pending={noneWaiting} onChange={setGroupId} /></HeadingGroup> : undefined;
  const planBudget = scopes.reduce((sum, sc) => sum + sc.draft.dailyBudget, 0);
  const draft: CcDraft = { ...sharedDraft, dailyBudget: planBudget };
  const acosValues = Array.from(new Set(scopes.map((sc) => sc.draft.targetAcos)));

  // Everything the campaigns are built from. If it hasn't changed since last time, the user's edits stay.
  const sourceKey = JSON.stringify(scopes.map((sc) => [
    sc.id, sc.draft.structureId, sc.products.map((p) => p.id), sc.draft.targetingStrategies, sc.draft.autoTypes, sc.draft.dailyBudget,
    sc.draft.structureId === 'custom' ? sc.draft.customCampaigns ?? null : '',
    sc.draft.biddingStrategy, sc.draft.placementAdjust,
    sc.draft.keywordTargets.filter((k) => k.enabled), sc.draft.negativeKeywords.filter((n) => n.enabled),
    (sc.draft.productTargets ?? []).filter((p) => p.enabled), (sc.draft.negativeProducts ?? []).filter((n) => n.enabled),
  ]));

  useEffect(() => {
    if (scopes.every((sc) => !sc.draft.structureId)) return;
    if (draft.generatedCampaigns && draft.generatedKey === sourceKey) return;
    const built = scopes.flatMap((sc) => {
      const id = sc.draft.structureId;
      if (!id) return [];
      const made = id === 'custom'
        ? (sc.draft.customCampaigns ?? [])
        : generateCampaigns(id, sc.products, sc.draft.targetingStrategies, sc.draft.dailyBudget, sc.draft.autoTypes);
      const decorated = decorateCampaigns(withKeywords(made, sc.draft), sc.products, draft.naming, { biddingStrategy: sc.draft.biddingStrategy, placement: sc.draft.placementAdjust });
      if (!grouped) return decorated;
      // Ids repeat from one group to the next, so each carries its group's id.
      return decorated.map((camp) => ({
        ...camp, id: `${sc.id}:${camp.id}`, groupName: sc.name,
        adGroups: camp.adGroups.map((ag) => ({ ...ag, id: `${sc.id}:${ag.id}` })),
      }));
    });
    onChange({ generatedCampaigns: grouped ? withShares(built, planBudget) : built, generatedKey: sourceKey });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceKey]);

  const campaigns = draft.generatedCampaigns ?? [];
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

  return (
    <div>
      <StepHeading title="Review before we create" group={groupSwitch} />

      <div className="ccd-pv-stack">
        <Panel title="Plan at a glance" pad="20px 22px">
          <dl className="ccd-pv-sum">
            {figures.map(([k, v]) => <div key={k} className="ccd-pv-stat"><dt>{k}</dt><dd className="ccd-num">{v}</dd></div>)}
          </dl>
        </Panel>

        <CampaignsTable draft={draft} campaigns={campaigns} selectedProducts={selectedProducts} shownScope={shownScope} onCommit={commit} onApplyNaming={(naming, next) => onChange({ naming, generatedCampaigns: next })} />
        <RulesSection draft={draft} campaigns={campaigns} selectedProducts={selectedProducts} onChange={onChange} />
      </div>
    </div>
  );
}
