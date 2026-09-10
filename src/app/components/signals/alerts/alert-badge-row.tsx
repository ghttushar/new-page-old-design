import type { PrototypeAlert } from '@/constants/signals/prototype-data';
import { Badge as MarketplaceBadge } from './marketplace-glyph';
import { SourceBadge, GoogleMeetMark, toRowSource } from './source-icon';
import { RepeatIcon } from './icons';

/**
 * The badge/marketplace/source strip shared verbatim by the Alerts list row and the
 * detail card header, so the two never drift into different icon systems.
 */
export function AlertBadgeRow({ al, size = 20, showTime = true }: { al: PrototypeAlert; size?: number; showTime?: boolean }) {
  const origin = al.originType ?? 'anarix';
  const rowSource = toRowSource(origin);
  const iconSize = Math.round(size * 0.9);
  const iconBox = Math.round(size * 1.2);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 'none' }}>
        {al.priority !== 'Low' && (
          <span style={{ padding: '3px 8px', borderRadius: 5, background: al.priorityDot + '1a', font: '700 10px/1 Inter,sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: al.priorityDot, flex: 'none' }}>{al.priority}</span>
        )}
        <span style={{ padding: '3px 8px', borderRadius: 5, border: '1px solid #d9c6ec', background: '#fff', font: '600 10px/1 Inter,sans-serif', color: '#5f3880', flex: 'none', whiteSpace: 'nowrap' as const }}>{al.category}</span>
      </div>
      <span style={{ width: 1, height: 14, background: '#e6e8ec', flex: 'none' }} />
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 10px 2px 2px', borderRadius: 999, background: '#eef0f3', flex: 'none' }}>
        <MarketplaceBadge brand={al.mpBrand} size={size} style={{ borderRadius: 7 }} />
        <span style={{ font: '700 11px/1 Inter,sans-serif', color: '#3d434b' }}>{al.mpCountry}</span>
      </span>
      <span style={{ width: 1, height: 14, background: '#e6e8ec', flex: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 'none' }}>
        {rowSource && <SourceBadge source={rowSource} size={size} />}
        {al.repeated && (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: iconBox, height: iconBox, flex: 'none' }}>
            <RepeatIcon size={iconSize} />
          </span>
        )}
        {al.hasMeeting && (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: iconBox, height: iconBox, flex: 'none' }}>
            <GoogleMeetMark size={iconSize} />
          </span>
        )}
      </div>
      {showTime && (
        <span style={{ marginLeft: 'auto', font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8', whiteSpace: 'nowrap' as const, flex: 'none' }}>{al.time}</span>
      )}
    </div>
  );
}
