import type { TaskStatus } from '@/constants/signals/prototype-data';

const STATUS_COLOR: Record<TaskStatus, string> = {
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

/** Small pill icon for the task's origin — mirrors the badge glyph vocabulary used in Alerts/Meetings so the three surfaces read as one system. */
export function OriginGlyph({ origin, size = 12 }: { origin: 'alert' | 'meeting' | 'generative' | 'direct'; size?: number }) {
  const color = origin === 'alert' ? '#b3453f' : origin === 'meeting' ? '#3874ff' : origin === 'generative' ? '#5f3880' : '#9aa0a8';
  if (origin === 'alert') {
    return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 1.5l7 12.5H1z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" /><path d="M8 6.5v3.2M8 11.7v.1" stroke={color} strokeWidth="1.3" strokeLinecap="round" /></svg>;
  }
  if (origin === 'meeting') {
    return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><rect x="1.5" y="4" width="8.5" height="7.2" rx="1.3" stroke={color} strokeWidth="1.3" /><path d="M10 7l4.1-2.4c.4-.2.9.1.9.5v5.6c0 .4-.5.7-.9.5L10 9z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" /></svg>;
  }
  if (origin === 'generative') {
    return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 1.5l1.4 4.1L13.5 7l-4.1 1.4L8 12.5l-1.4-4.1L2.5 7l4.1-1.4z" fill={color} /></svg>;
  }
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M4 8h8" stroke={color} strokeWidth="1.4" strokeLinecap="round" /></svg>;
}
