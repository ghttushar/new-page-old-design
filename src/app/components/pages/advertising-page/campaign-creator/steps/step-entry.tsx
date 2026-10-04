import type { CcDraft } from '../campaign-creator.types';
import { ChoiceCard, Pill, StepHeading, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

const FUTURE_AD_TYPES = ['Sponsored Brands', 'Sponsored Display'];

export default function StepEntry({ draft, onChange }: {
  draft: CcDraft; onChange: (patch: Partial<CcDraft>) => void;
}) {
  return (
    <div>
      <StepHeading
        title="Create campaigns faster"
        subtitle="Smart Creation builds a recommended campaign structure, targeting and budget for you — review and adjust before anything is created."
      />

      <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: TEXT_FAINT, marginBottom: 10 }}>Ad Type</div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
        <ChoiceCard selected={draft.adType === 'sponsored-products'} onClick={() => onChange({ adType: 'sponsored-products' })} minWidth={200}>
          <div style={{ font: '700 14px/1.3 Inter,sans-serif', color: TEXT_PRIMARY }}>Sponsored Products</div>
          <div style={{ font: '400 11.5px/1.5 Inter,sans-serif', color: TEXT_MUTED, marginTop: 4 }}>Promote individual products in search and product pages.</div>
        </ChoiceCard>
        {FUTURE_AD_TYPES.map((t) => (
          <div key={t} style={{ flex: '1 1 200px', minWidth: 200, padding: 16, borderRadius: 11, border: '1.5px dashed #e6e8ec', background: '#fafbfd', opacity: 0.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ font: '700 14px/1.3 Inter,sans-serif', color: TEXT_PRIMARY }}>{t}</div>
              <Pill label="Future" />
            </div>
            <div style={{ font: '400 11.5px/1.5 Inter,sans-serif', color: TEXT_MUTED, marginTop: 4 }}>Not yet available in Smart Creation.</div>
          </div>
        ))}
      </div>
    </div>
  );
}
