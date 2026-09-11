import { AmazonLogo } from '@phosphor-icons/react';
import type { MpBrand, PrototypeAlert } from '@/constants/signals/prototype-data';
import { HoverTip } from './hover-tip';

const BRAND: Record<MpBrand, { bg: string; fg: string }> = {
  amazon: { bg: '#FF9900', fg: '#FFFFFF' },
  walmart: { bg: '#0071CE', fg: '#FFC220' },
};

function BrandIcon({ brand, size }: { brand: MpBrand; size: number }) {
  const iconSize = Math.round(size * 0.62);
  return brand === 'walmart' ? (
    <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" fill="none">
      <g stroke={BRAND.walmart.fg} strokeWidth="2.1" strokeLinecap="round"><path d="M8 1.2v4.6M8 10.2v4.6M2.3 4l4 2.3M9.7 9.7l4 2.3M2.3 12l4-2.3M9.7 6.3l4-2.3" /></g>
    </svg>
  ) : (
    <AmazonLogo size={iconSize} color={BRAND.amazon.fg} weight="bold" />
  );
}

/** Raw circular badge with no HoverTip — exported for composing with SourceBadge in the Alerts row's overlapping-circle group. */
export function Badge({ brand, size, style }: { brand: MpBrand; size: number; style?: React.CSSProperties }) {
  return (
    <span
      style={{
        width: size, height: size, borderRadius: '50%', background: BRAND[brand].bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
        boxShadow: '0 0 0 1.5px #fff',
        ...style,
      }}
    >
      <BrandIcon brand={brand} size={size} />
    </span>
  );
}

export function brandLabel(b: MpBrand): string {
  return b === 'walmart' ? 'Walmart' : 'Amazon';
}

/** One or two marketplace badges — plain coloured circular icons, overlapping ~18% when there are two. */
export function MarketplaceGlyph({ al, size = 20 }: { al: PrototypeAlert; size?: number }) {
  const brands: MpBrand[] = al.mpBrands && al.mpBrands.length > 0 ? al.mpBrands : [al.mpBrand];
  const label = brands.map(brandLabel).join(' + ');

  if (brands.length === 1) {
    return (
      <HoverTip label={label}>
        <Badge brand={brands[0]} size={size} />
      </HoverTip>
    );
  }

  const overlap = Math.round(size * 0.18);
  return (
    <HoverTip label={label}>
      <span style={{ display: 'flex', alignItems: 'center', flex: 'none' }}>
        <Badge brand={brands[0]} size={size} style={{ position: 'relative', zIndex: 2 }} />
        <Badge brand={brands[1]} size={size} style={{ marginLeft: -overlap, zIndex: 1 }} />
      </span>
    </HoverTip>
  );
}
