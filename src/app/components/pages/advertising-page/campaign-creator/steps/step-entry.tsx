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
    <div className="cc-entry">
      <div className="cc-entry__intro">
        <span className="cc-entry__kicker">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M8 1.5l1.5 4.2 4.2 1.5-4.2 1.5L8 13l-1.5-4.3L2.3 7.2l4.2-1.5z" fill="#e4d3f0" /></svg>
          Smart Creation
        </span>
        <h1>Create focused campaigns <em>without the busywork.</em></h1>
        <p>Choose an ad format. We’ll shape the products, goals, targeting and structure into a campaign plan you can review before creation.</p>
        <div className="cc-entry__plan" aria-hidden>
          <svg viewBox="0 0 420 170" fill="none">
            <path className="p-line" d="M62 85 C 100 85, 104 36, 142 36" />
            <path className="p-line" d="M62 85 L 142 85" />
            <path className="p-line" d="M62 85 C 100 85, 104 134, 142 134" />
            <path className="p-line" d="M246 36 C 276 36, 280 20, 312 20" />
            <path className="p-line" d="M246 36 C 276 36, 280 52, 312 52" />
            <path className="p-line" d="M246 85 C 276 85, 280 70, 312 70" />
            <path className="p-line" d="M246 85 C 276 85, 280 102, 312 102" />
            <path className="p-line" d="M246 134 C 276 134, 280 120, 312 120" />
            <path className="p-line" d="M246 134 C 276 134, 280 150, 312 150" />
            <circle className="p-glow" cx="40" cy="85" r="26" />
            <circle className="p-root" cx="40" cy="85" r="18" />
            <path d="M40 76l2.3 6.4 6.4 2.3-6.4 2.3L40 93.4l-2.3-6.4-6.4-2.3 6.4-2.3z" fill="#fff" />
            <rect className="p-card" x="142" y="20" width="104" height="32" rx="9" />
            <rect className="p-bar" x="154" y="31" width="52" height="4" rx="2" />
            <rect className="p-bar--dim p-bar" x="154" y="39" width="34" height="3.5" rx="1.75" />
            <rect className="p-card" x="142" y="69" width="104" height="32" rx="9" />
            <rect className="p-bar" x="154" y="80" width="60" height="4" rx="2" />
            <rect className="p-bar--dim p-bar" x="154" y="88" width="40" height="3.5" rx="1.75" />
            <rect className="p-card" x="142" y="118" width="104" height="32" rx="9" />
            <rect className="p-bar" x="154" y="129" width="46" height="4" rx="2" />
            <rect className="p-bar--dim p-bar" x="154" y="137" width="30" height="3.5" rx="1.75" />
            <rect className="p-leaf p-leaf--on" x="312" y="12" width="64" height="16" rx="8" />
            <rect className="p-leaf" x="312" y="44" width="52" height="16" rx="8" />
            <rect className="p-leaf" x="312" y="62" width="70" height="16" rx="8" />
            <rect className="p-leaf" x="312" y="94" width="48" height="16" rx="8" />
            <rect className="p-leaf" x="312" y="112" width="60" height="16" rx="8" />
            <rect className="p-leaf" x="312" y="142" width="54" height="16" rx="8" />
          </svg>
        </div>
      </div>
      <div className="cc-entry__chooser">
      <div className="cc-entry__chooser-head"><span>Choose an ad format</span></div>
      <div role="radiogroup" aria-label="Ad type" className="cc-entry__options">
        <div
          role="radio" aria-checked={selected} tabIndex={0} className="cc-pick cc-entry__primary-option"
          onClick={() => onChange({ adType: 'sponsored-products' })}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange({ adType: 'sponsored-products' }); } }}
          style={{ cursor: 'pointer', borderColor: selected ? BRAND : BORDER, background: selected ? BRAND_TINT : '#fff' }}
        >
          <Radio checked={selected} />
          <div style={{ flex: 1 }}>
            <div className="cc-entry__option-label">Sponsored Products</div>
            <div style={{ font: `400 13px/1.5 ${FONT}`, color: TEXT_MUTED, marginTop: 7 }}>Promote individual products in search results and on product pages.</div>
          </div>
        </div>

        {LATER.map((t) => (
          <div key={t.name} role="radio" aria-checked={false} aria-disabled="true" className="cc-entry__future-option">
            <div style={{ flex: 1 }}>
              <div style={{ font: `500 14px/1.3 ${FONT}`, color: TEXT_FAINT }}>{t.name}</div>
              <div style={{ font: `400 13px/1.5 ${FONT}`, color: TEXT_FAINT, marginTop: 2 }}>{t.blurb}</div>
            </div>
            <span style={{ font: `500 12px/1 ${FONT}`, color: TEXT_FAINT }}>Coming soon</span>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
