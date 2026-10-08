import type { CcDraft } from '../campaign-creator.types';
import { Radio, StepHeading } from '../campaign-creator-ui';

const ico = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/** A tagged product — Sponsored Products. */
const ProductsIcon = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" aria-hidden {...ico}>
    <path d="M10 2.6l6.4 3.3v7.2L10 16.4 3.6 13.1V5.9z" /><path d="M3.6 5.9L10 9.2l6.4-3.3M10 9.2v7.2" />
  </svg>
);
/** A banner with a headline — Sponsored Brands. */
const BrandsIcon = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" aria-hidden {...ico}>
    <rect x="2.6" y="4.2" width="14.8" height="8.2" rx="1.8" /><path d="M5.6 7.4h5M5.6 9.8h3M7 15.8h6" />
  </svg>
);
/** A screen with an image — Sponsored Display. */
const DisplayIcon = () => (
  <svg width={20} height={20} viewBox="0 0 20 20" aria-hidden {...ico}>
    <rect x="2.6" y="3.6" width="14.8" height="10" rx="1.8" /><path d="M7.2 16.6h5.6M3.6 11.4l3.6-3.2 3 2.6 2.2-1.8 3.4 2.4" />
  </svg>
);

/** A small abstract product shot: a rounded tile with a simple headphone-like arc. */
const Thumb = ({ x, y, s }: { x: number; y: number; s: number }) => (
  <g>
    <rect className="a-thumb" x={x} y={y} width={s} height={s} rx={s * 0.2} />
    <path className="a-mark" d={`M${x + s * 0.24} ${y + s * 0.6} a${s * 0.26} ${s * 0.26} 0 0 1 ${s * 0.52} 0`} />
    <rect className="a-mark-fill" x={x + s * 0.2} y={y + s * 0.56} width={s * 0.12} height={s * 0.2} rx={s * 0.05} />
    <rect className="a-mark-fill" x={x + s * 0.68} y={y + s * 0.56} width={s * 0.12} height={s * 0.2} rx={s * 0.05} />
  </g>
);

/** Where a Sponsored Products ad shows: one promoted result among the normal results. */
const ProductsArt = () => (
  <svg viewBox="0 0 320 136" className="cc-ad-art__svg" aria-hidden>
    <rect className="a-bar" x="62" y="12" width="196" height="16" rx="8" />
    <circle className="a-mark-fill" cx="74" cy="20" r="3.2" />
    <rect className="a-line" x="84" y="18" width="70" height="4" rx="2" />
    <g className="a-dim">
      <rect className="a-row" x="62" y="104" width="196" height="26" rx="7" />
      <rect className="a-thumb" x="70" y="109" width="16" height="16" rx="4" />
      <rect className="a-line" x="94" y="112" width="90" height="4" rx="2" /><rect className="a-line" x="94" y="120" width="56" height="3.5" rx="1.75" />
    </g>
    <g className="a-lift">
      <rect className="a-card a-card--on" x="54" y="38" width="212" height="58" rx="10" />
      <Thumb x={64} y={46} s={42} />
      <rect className="a-line a-line--dark" x="118" y="50" width="104" height="5" rx="2.5" />
      <rect className="a-line" x="118" y="60" width="132" height="4" rx="2" />
      <rect className="a-line" x="118" y="68" width="84" height="4" rx="2" />
      <rect className="a-chip" x="118" y="78" width="46" height="12" rx="6" /><rect className="a-chip-ink" x="125" y="82.6" width="32" height="3.2" rx="1.6" />
      <rect className="a-btn" x="206" y="76" width="50" height="14" rx="7" />
    </g>
  </svg>
);

/** Where a Sponsored Brands ad shows: a banner with a logo, headline and a few products. */
const BrandsArt = () => (
  <svg viewBox="0 0 320 136" className="cc-ad-art__svg" aria-hidden>
    <rect className="a-bar" x="62" y="12" width="196" height="16" rx="8" />
    <circle className="a-mark-fill" cx="74" cy="20" r="3.2" />
    <rect className="a-line" x="84" y="18" width="60" height="4" rx="2" />
    <g className="a-lift">
      <rect className="a-card a-card--on" x="54" y="38" width="212" height="88" rx="10" />
      <circle className="a-logo" cx="74" cy="56" r="10" />
      <path className="a-logo-mark" d="M70 56l3 3 5-6" />
      <rect className="a-line a-line--dark" x="92" y="49" width="84" height="5" rx="2.5" />
      <rect className="a-line" x="92" y="59" width="58" height="4" rx="2" />
      <rect className="a-btn" x="212" y="49" width="44" height="14" rx="7" />
      <Thumb x={66} y={78} s={38} /><Thumb x={112} y={78} s={38} /><Thumb x={158} y={78} s={38} />
      <rect className="a-row" x="204" y="78" width="52" height="38" rx="8" /><rect className="a-line" x="212" y="92" width="36" height="4" rx="2" /><rect className="a-line" x="218" y="100" width="24" height="3.5" rx="1.75" />
    </g>
  </svg>
);

/** Where a Sponsored Display ad shows: a banner placed beside a product page. */
const DisplayArt = () => (
  <svg viewBox="0 0 320 136" className="cc-ad-art__svg" aria-hidden>
    <rect className="a-card" x="54" y="12" width="212" height="114" rx="10" />
    <rect className="a-thumb" x="66" y="24" width="84" height="64" rx="8" />
    <path className="a-mark" d="M82 70a16 16 0 0 1 32 0" /><rect className="a-mark-fill" x="78" y="66" width="8" height="12" rx="3" /><rect className="a-mark-fill" x="110" y="66" width="8" height="12" rx="3" />
    <rect className="a-line a-line--dark" x="66" y="98" width="70" height="5" rx="2.5" />
    <rect className="a-line" x="66" y="108" width="90" height="4" rx="2" />
    <rect className="a-line" x="162" y="26" width="30" height="4" rx="2" /><rect className="a-line" x="162" y="34" width="22" height="4" rx="2" />
    <g className="a-lift">
      <rect className="a-card a-card--on" x="204" y="40" width="70" height="78" rx="9" />
      <Thumb x={214} y={50} s={50} />
      <rect className="a-line a-line--dark" x="214" y="106" width="34" height="4" rx="2" />
      <rect className="a-chip" x="250" y="100" width="18" height="12" rx="6" />
    </g>
  </svg>
);

const FORMATS = [
  { id: 'sponsored-products', name: 'Sponsored Products', blurb: 'Promote individual products in search results and on product pages.', icon: <ProductsIcon />, art: <ProductsArt />, ready: true },
  { id: 'sponsored-brands', name: 'Sponsored Brands', blurb: 'Brand-led ads with a logo, headline and several products.', icon: <BrandsIcon />, art: <BrandsArt />, ready: false },
  { id: 'sponsored-display', name: 'Sponsored Display', blurb: 'Retargeting and audience ads on and off the marketplace.', icon: <DisplayIcon />, art: <DisplayArt />, ready: false },
] as const;

export default function StepEntry({ draft, onChange }: {
  draft: CcDraft; onChange: (patch: Partial<CcDraft>) => void;
}) {
  return (
    <div>
      <StepHeading title="Choose an ad format" summary={false} />
      <div role="radiogroup" aria-label="Ad type" className="cc-ad-grid">
        {FORMATS.map((f) => {
          const selected = f.ready && draft.adType === 'sponsored-products';
          const pick = () => f.ready && onChange({ adType: 'sponsored-products' });
          return (
            <div
              key={f.id} role="radio" aria-checked={selected} aria-disabled={!f.ready} tabIndex={f.ready ? 0 : -1}
              className={`cc-pick cc-ad-card${selected ? ' is-selected' : ''}${f.ready ? '' : ' is-soon'}`}
              onClick={pick}
              onKeyDown={(e) => { if (f.ready && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); pick(); } }}
            >
              <div className="cc-ad-art">
                {f.art}
              </div>
              <div className="cc-ad-card__body">
                <div className="cc-ad-card__top">
                  <span className="cc-ad-card__icon">{f.icon}</span>
                  <strong>{f.name}</strong>
                  {f.ready ? <Radio checked={selected} /> : <span className="cc-ad-card__soon">Coming soon</span>}
                </div>
                <p>{f.blurb}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
