import type { CcDraft } from '../campaign-creator.types';
import { BORDER, BRAND, BRAND_TINT, FONT, HAIR, Radio, StepHeading, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

const LATER = [
  { name: 'Sponsored Brands', blurb: 'Brand-led ads with a logo, headline and several products.' },
  { name: 'Sponsored Display', blurb: 'Retargeting and audience ads on and off the marketplace.' },
];

export default function StepEntry({ draft, onChange }: {
  draft: CcDraft; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const selected = draft.adType === 'sponsored-products';

  return (
    <div>
      <StepHeading
        title="Create campaigns faster"
        subtitle="Pick what you want to promote and Smart Creation drafts the campaigns, targeting and budgets. You review everything before anything goes live."
      />

      <h2 style={{ margin: '0 0 12px', font: `600 14px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>What kind of ads?</h2>

      <div role="radiogroup" aria-label="Ad type" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          role="radio" aria-checked={selected} tabIndex={0} className="cc-pick"
          onClick={() => onChange({ adType: 'sponsored-products' })}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange({ adType: 'sponsored-products' }); } }}
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 10, cursor: 'pointer', border: `1.5px solid ${selected ? BRAND : BORDER}`, background: selected ? BRAND_TINT : '#fff' }}
        >
          <Radio checked={selected} />
          <div>
            <div style={{ font: `600 14px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>Sponsored Products</div>
            <div style={{ font: `400 13px/1.5 ${FONT}`, color: TEXT_MUTED, marginTop: 2 }}>Promote individual products in search results and on product pages.</div>
          </div>
        </div>

        {LATER.map((t) => (
          <div key={t.name} role="radio" aria-checked={false} aria-disabled="true" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 10, border: `1px solid ${HAIR}`, background: '#fff' }}>
            <Radio checked={false} disabled />
            <div style={{ flex: 1 }}>
              <div style={{ font: `500 14px/1.3 ${FONT}`, color: TEXT_FAINT }}>{t.name}</div>
              <div style={{ font: `400 13px/1.5 ${FONT}`, color: TEXT_FAINT, marginTop: 2 }}>{t.blurb}</div>
            </div>
            <span style={{ font: `500 12px/1 ${FONT}`, color: TEXT_FAINT }}>Coming later</span>
          </div>
        ))}
      </div>
    </div>
  );
}
