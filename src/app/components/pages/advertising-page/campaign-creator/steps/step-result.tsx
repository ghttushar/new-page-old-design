import { type CcDraft, type CcProduct } from '../campaign-creator.types';
import { CheckIcon, GOOD, SectionCard, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

export default function StepResult({ draft, selectedProducts }: { draft: CcDraft; selectedProducts: CcProduct[] }) {
  const campaigns = draft.generatedCampaigns ?? [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' as const, paddingTop: 30 }}>
      <span style={{ width: 56, height: 56, borderRadius: '50%', background: '#e9f7ef', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <CheckIcon size={26} color={GOOD} />
      </span>
      <div style={{ font: '700 19px/1.3 Inter,sans-serif', color: TEXT_PRIMARY }}>Campaign creation completed</div>
      <div style={{ font: '400 13px/1.6 Inter,sans-serif', color: TEXT_MUTED, marginTop: 6, maxWidth: 420 }}>
        {campaigns.length} campaign{campaigns.length === 1 ? '' : 's'} created successfully for {selectedProducts.length} product{selectedProducts.length === 1 ? '' : 's'}.
      </div>

      <SectionCard style={{ marginTop: 24, width: '100%', maxWidth: 480, textAlign: 'left' as const }}>
        <ResultRow label={`${campaigns.length} campaigns created`} />
        <ResultRow label={`${campaigns.reduce((s, c) => s + c.adGroups.length, 0)} ad groups created`} />
        <ResultRow label={`${campaigns.reduce((s, c) => s + c.adGroups.reduce((n, ag) => n + ag.targets.length, 0), 0)} targets created`} />
      </SectionCard>
    </div>
  );
}

function ResultRow({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0' }}>
      <CheckIcon size={13} color={GOOD} />
      <span style={{ font: '500 12.5px/1.4 Inter,sans-serif', color: TEXT_PRIMARY }}>{label}</span>
    </div>
  );
}
