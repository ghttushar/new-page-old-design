import type { TaskStatus, TaskOrigin } from '@/constants/signals/prototype-data';
import { SparkleIcon } from '../alerts/icons';
import { GoogleMeetMark } from '../alerts/source-icon';
import { HoverTip } from '../alerts/hover-tip';

export const STATUS_COLOR: Record<TaskStatus, string> = {
  open: '#9aa0a8',
  in_progress: '#a8763f',
  done: '#3f7d6a',
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

/** Filled warning-triangle mark, white-on-colour — same stroke language as the rest of the Alerts icon set. */
function AlertMark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.8l6.6 11.4H1.4z" fill={color} />
    </svg>
  );
}

/**
 * Origin badge — a circular colour-coded disc exactly like the source badges on the
 * Alerts row (`SourceIcon`/`SourceBadge`), reusing their real marks (Jiva's sparkle,
 * Google Meet's camera) instead of inventing a parallel icon language for Workstation.
 */
export function OriginGlyph({ origin, size = 17 }: { origin: TaskOrigin; size?: number }) {
  const bg = origin === 'alert' ? '#b3453f' : origin === 'meeting' ? '#ffffff' : origin === 'generative' ? '#5f3880' : '#eceef1';
  const needsRing = bg === '#ffffff' || bg === '#eceef1';
  const iconSize = Math.round(size * 0.58);
  return (
    <HoverTip label={ORIGIN_LABEL[origin]}>
      <span
        style={{
          width: size, height: size, borderRadius: '50%', background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
          boxShadow: needsRing ? '0 0 0 1.5px #fff, 0 0 0 2px #e6e8ec' : '0 0 0 1.5px #fff',
        }}
      >
        {origin === 'alert' && <AlertMark size={iconSize} color="#fff" />}
        {origin === 'meeting' && <GoogleMeetMark size={iconSize} />}
        {origin === 'generative' && <SparkleIcon size={iconSize} color="#fff" />}
        {origin === 'direct' && <span style={{ width: Math.round(iconSize * 0.75), height: 2, borderRadius: 1, background: '#9aa0a8' }} />}
      </span>
    </HoverTip>
  );
}
