import { useEffect } from 'react';
import { generateCampaigns, totalAdGroups, totalTargets, formatCurrency, type CcCampaign, type CcDraft, type CcProduct } from '../campaign-creator.types';
import { StepHeading } from '../campaign-creator-ui';
import { Panel } from '../cc-design';
import RulesSection from './preview-rules';
import CampaignsTable from './preview-campaigns';
import { decorateCampaigns } from './preview-cells';

// Section 8: Preview and confirm. Three parts: the summary, one table for the structure, budget and targeting, then the Rules.

export default function StepPreview({ draft, selectedProducts, onChange }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  // Everything the campaigns are built from. If it hasn't changed since last time, the user's edits stay.
  const sourceKey = [
    draft.structureId, draft.productIds.join(','), draft.targetingStrategies.join(','), draft.autoTypes.join(','), draft.dailyBudget,
    draft.structureId === 'custom' ? JSON.stringify(draft.customCampaigns ?? null) : '',
  ].join('|');

  useEffect(() => {
    if (!draft.structureId) return;
    if (draft.generatedCampaigns && draft.generatedKey === sourceKey) return;
    const campaigns = draft.structureId === 'custom'
      ? (draft.customCampaigns ?? [])
      : generateCampaigns(draft.structureId, selectedProducts, draft.targetingStrategies, draft.dailyBudget, draft.autoTypes);
    onChange({ generatedCampaigns: decorateCampaigns(campaigns, selectedProducts), generatedKey: sourceKey });
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
    ['Target ACOS', draft.targetAcos != null ? `${draft.targetAcos}%` : 'Not set'],
  ];

  return (
    <div>
      <StepHeading title="Review before we create" />

      <div className="cc-pv-stack">
        <Panel title="Plan at a glance" pad="20px 22px">
          <dl className="cc-pv-sum">
            {figures.map(([k, v]) => <div key={k} className="cc-pv-stat"><dt>{k}</dt><dd className="cc-num">{v}</dd></div>)}
          </dl>
        </Panel>

        <CampaignsTable draft={draft} campaigns={campaigns} selectedProducts={selectedProducts} onCommit={commit} />
        <RulesSection draft={draft} campaigns={campaigns} selectedProducts={selectedProducts} onChange={onChange} />
      </div>
    </div>
  );
}
