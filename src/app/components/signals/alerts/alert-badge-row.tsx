import type { PrototypeAlert, AlertSource } from '@/constants/signals/prototype-data';
import { Badge as MarketplaceBadge } from './marketplace-glyph';
import { SourceBadge, GoogleMeetMark, toRowSource, rowSourceLabel, type RowSource } from './source-icon';
import { HoverTip } from './hover-tip';

/**
 * The badge/marketplace/source strip shared verbatim by the Alerts list row and the
 * detail card header, so the two never drift into different icon systems.
 */
export function AlertBadgeRow({ al, size = 20, showTime = true }: { al: PrototypeAlert; size?: number; showTime?: boolean }) {
  const origins: AlertSource[] = al.originTypes && al.originTypes.length > 0 ? al.originTypes : [al.originType ?? 'anarix'];
  const rowSources = Array.from(new Set(origins.map(toRowSource).filter((s): s is RowSource => s !== null)));
  // A row already showing a "meeting" source badge doesn't also need the separate meeting-link glyph — same icon, redundant.
  const showMeetingGlyph = al.hasMeeting && !rowSources.includes('meeting');
  const iconSize = Math.round(size * 0.9);
  const iconBox = Math.round(size * 1.2);
  const overlap = Math.round(size * 0.3);

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
        {rowSources.length > 0 && (
          <HoverTip label={rowSources.map(rowSourceLabel).join(' + ')}>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {rowSources.map((s, i) => (
                <SourceBadge key={s} source={s} size={size} style={{ position: 'relative', marginLeft: i === 0 ? 0 : -overlap, zIndex: rowSources.length - i }} />
              ))}
            </span>
          </HoverTip>
        )}
        {showMeetingGlyph && (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: iconBox, height: iconBox, flex: 'none' }}>
            <GoogleMeetMark size={iconSize} />
          </span>
        )}
      </div>
      {showTime && (
        <span style={{ marginLeft: 'auto', font: '400 12px/1 Inter,sans-serif', color: '#9aa0a8', whiteSpace: 'nowrap' as const, flex: 'none' }}>{al.time}</span>
      )}
    </div>
  );
}
