import type { ReactNode } from 'react';
import type { MpBrand } from '@/constants/signals/prototype-data';
import { Badge as MarketplaceBadge, brandLabel } from '../alerts/marketplace-glyph';
import motion from '../alerts/motion.module.scss';

const MARKETPLACES: MpBrand[] = ['amazon', 'walmart'];
const COUNTRIES = ['US', 'UK', 'CA', 'DE', 'IN'];
const BRANDS = ['Nutrabay', 'Boldfit', 'Wellbeing Nutrition'];

interface Props {
  marketplaces: MpBrand[];
  countries: string[];
  brands: string[];
  onToggleMarketplace: (m: MpBrand) => void;
  onToggleCountry: (c: string) => void;
  onToggleBrand: (b: string) => void;
  onAll: () => void;
}

function CheckMark({ color = '#fff', size = 9 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8l3.5 3.5L13 4.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#9aa0a8', margin: '12px 4px 6px' }}>
      {children}
    </div>
  );
}

function Row({ label, checked, onClick, leading }: { label: string; checked: boolean; onClick: () => void; leading?: ReactNode }) {
  return (
    <div
      onClick={onClick}
      className={motion.pressable}
      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 7, cursor: 'pointer', transition: 'background 120ms ease-out' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <span
        style={{
          width: 15, height: 15, borderRadius: 4, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: checked ? 'none' : '1.4px solid #cfd4dc', background: checked ? '#77469b' : 'transparent',
          transition: 'background 120ms ease-out, border-color 120ms ease-out',
        }}
      >
        {checked && <CheckMark />}
      </span>
      {leading}
      <span style={{ font: '500 12px/1 Inter,sans-serif', color: '#3d434b' }}>{label}</span>
    </div>
  );
}

/** Filter dropdown for the Signals header — narrows by marketplace, country and brand, with a one-click reset to All. */
export function AccountFilterDropdown({ marketplaces, countries, brands, onToggleMarketplace, onToggleCountry, onToggleBrand, onAll }: Props) {
  const allSelected = marketplaces.length === 0 && countries.length === 0 && brands.length === 0;

  return (
    <div className={motion.popInTop} style={{ position: 'absolute', right: 0, top: 38, width: 232, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: '10px 10px 12px', zIndex: 50 }}>
      <div
        onClick={onAll}
        className={motion.pressable}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 7, cursor: 'pointer', background: allSelected ? '#f3eefa' : 'transparent', transition: 'background 120ms ease-out' }}
        onMouseEnter={(e) => { if (!allSelected) e.currentTarget.style.background = '#f6f4fa'; }}
        onMouseLeave={(e) => { if (!allSelected) e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ font: '700 12px/1 Inter,sans-serif', color: allSelected ? '#5f3880' : '#3d434b' }}>All accounts</span>
        {allSelected && <CheckMark color="#77469b" size={10} />}
      </div>

      <SectionLabel>Marketplace</SectionLabel>
      {MARKETPLACES.map((m) => (
        <Row key={m} label={brandLabel(m)} checked={marketplaces.includes(m)} onClick={() => onToggleMarketplace(m)} leading={<MarketplaceBadge brand={m} size={16} style={{ borderRadius: 5 }} />} />
      ))}

      <SectionLabel>Country</SectionLabel>
      {COUNTRIES.map((c) => (
        <Row key={c} label={c} checked={countries.includes(c)} onClick={() => onToggleCountry(c)} />
      ))}

      <SectionLabel>Brand</SectionLabel>
      {BRANDS.map((b) => (
        <Row key={b} label={b} checked={brands.includes(b)} onClick={() => onToggleBrand(b)} />
      ))}
    </div>
  );
}
