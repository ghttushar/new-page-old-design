import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
import type { TaskStatus, TaskOrigin } from '@/constants/signals/prototype-data';
import { GoogleMeetMark, SourceBadge, rowSourceLabel, type RowSource } from '../alerts/source-icon';
import { HoverTip } from '../alerts/hover-tip';

export const STATUS_COLOR: Record<TaskStatus, string> = {
  open: '#9aa0a8',
  in_progress: '#a8763f',
  done: '#3f7d6a',
};

export const STATUS_LABEL: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  done: 'Done',
};

export const PRIORITY_COLOR: Record<'High' | 'Medium' | 'Low', string> = {
  High: '#b3453f',
  Medium: '#a8763f',
  Low: '#9aa0a8',
};

/** Plane/Linear-style status glyph — an empty ring, a half-filled pie, or a filled check — instead of just a colored word. */
export function StatusCircleIcon({ status, size = 14 }: { status: TaskStatus; size?: number }) {
  const color = STATUS_COLOR[status];
  if (status === 'done') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill={color} />
        <path d="M4.8 8.2l2.1 2.1 4.3-4.3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'in_progress') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.3" stroke={color} strokeWidth="1.6" fill="none" />
        <path d="M8 8V1.7A6.3 6.3 0 0 1 14.3 8z" fill={color} />
      </svg>
    );
  }
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.3" stroke={color} strokeWidth="1.6" fill="none" /></svg>;
}

export function ListViewIcon({ size = 14, color = '#6b7178' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="2.3" cy="3.5" r="1.1" fill={color} />
      <circle cx="2.3" cy="8" r="1.1" fill={color} />
      <circle cx="2.3" cy="12.5" r="1.1" fill={color} />
      <path d="M5.5 3.5h9M5.5 8h9M5.5 12.5h9" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function BoardViewIcon({ size = 14, color = '#6b7178' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2" width="3.6" height="12" rx="1" stroke={color} strokeWidth="1.4" />
      <rect x="6.2" y="2" width="3.6" height="8" rx="1" stroke={color} strokeWidth="1.4" />
      <rect x="10.9" y="2" width="3.6" height="10" rx="1" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

const ORIGIN_LABEL: Record<TaskOrigin, string> = {
  alert: 'From an alert',
  meeting: 'From a meeting',
  generative: 'Generative task — Jiva can draft this',
  direct: 'Created directly',
};

/** The ripple mark (the Alerts icon), white on the badge colour. */
function AlertMark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.3" fill={color} />
      <circle cx="8" cy="8" r="4.8" stroke={color} strokeWidth="1.6" />
      <circle cx="8" cy="8" r="7.4" stroke={color} strokeWidth="1.4" opacity="0.7" />
    </svg>
  );
}

/**
 * Origin badge — a circular colour-coded disc exactly like the source badges on the
 * Alerts row (`SourceIcon`/`SourceBadge`), reusing their real marks (Jiva's sparkle,
 * Google Meet's camera) instead of inventing a parallel icon language for Workstation.
 */
export function OriginGlyph({ origin, size = 17 }: { origin: TaskOrigin; size?: number }) {
  const bg = origin === 'alert' ? '#ffffff' : origin === 'meeting' ? '#ffffff' : origin === 'generative' ? '#ffffff' : '#eceef1';
  const needsRing = bg === '#ffffff' || bg === '#eceef1';
  // The Meet mark reads small at the same ratio as a single-tone glyph — give it more of the badge to fill.
  const iconSize = Math.round(size * (origin === 'meeting' ? 0.8 : origin === 'alert' ? 0.8 : origin === 'generative' ? 0.84 : 0.6));
  return (
    <HoverTip label={ORIGIN_LABEL[origin]}>
      <span
        style={{
          width: size, height: size, borderRadius: '50%', background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
          boxShadow: origin === 'alert' || origin === 'generative' ? '0 0 0 1.5px #fff, 0 0 0 2.5px #cdb6e3' : needsRing ? '0 0 0 1.5px #fff, 0 0 0 2px #e6e8ec' : '0 0 0 1.5px #fff',
        }}
      >
        {origin === 'alert' && <AlertMark size={iconSize} color="#77469b" />}
        {origin === 'meeting' && <GoogleMeetMark size={iconSize} />}
        {origin === 'generative' && (
          // The mascot only draws its eyes at 16px and up, so draw it at 16 and scale it down to sit inside the badge.
          <span style={{ display: 'flex', width: 16, height: 16, flex: 'none', transform: `scale(${(size * 0.9) / 22.6})` }}><DiamondMascot size={16} /></span>
        )}
        {origin === 'direct' && <span style={{ width: Math.round(iconSize * 0.75), height: 2, borderRadius: 1, background: '#9aa0a8' }} />}
      </span>
    </HoverTip>
  );
}

/**
 * The channels that raised/discussed a task, as the exact same overlapping badge
 * stack the Alerts row uses for its sources — same real marks, same size, same overlap math.
 */
export function ContextSourceStack({ sources, size = 20 }: { sources: RowSource[]; size?: number }) {
  const overlap = Math.round(size * 0.3);
  return (
    <HoverTip label={sources.map(rowSourceLabel).join(' + ')}>
      <span style={{ display: 'flex', alignItems: 'center' }}>
        {sources.map((s, i) => (
          <SourceBadge key={s} source={s} size={size} style={{ position: 'relative', marginLeft: i === 0 ? 0 : -overlap, zIndex: sources.length - i }} />
        ))}
      </span>
    </HoverTip>
  );
}
