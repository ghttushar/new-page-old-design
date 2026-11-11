import { useState } from 'react';
import type { AlertStatus, TaskStatus } from '@/constants/signals/prototype-data';

// One quiet status mark for Alerts and Work-station: a ring glyph that carries the colour and a plain grey label.
// No fill, no uppercase, so a list of them reads as information rather than a row of badges.

export const STATUS_COLOR: Record<TaskStatus, string> = {
  open: '#b4b9c1',
  in_progress: '#b8853f',
  done: '#4b8f76',
};

export const STATUS_LABEL: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  done: 'Done',
};

/** An alert's status in the same three words as a task: needs attention reads as Open, resolved as Done. */
export function alertTaskStatus(s: AlertStatus): TaskStatus {
  return s === 'resolved' ? 'done' : s === 'in_progress' ? 'in_progress' : 'open';
}

/** Plane/Linear-style status glyph: an empty ring, a half-filled ring, or a filled check. */
export function StatusCircleIcon({ status, size = 14 }: { status: TaskStatus; size?: number }) {
  const color = STATUS_COLOR[status];
  if (status === 'done') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden style={{ flex: 'none' }}>
        <circle cx="8" cy="8" r="7" fill={color} />
        <path d="M4.9 8.2l2 2 4.2-4.2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (status === 'in_progress') {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden style={{ flex: 'none' }}>
        <circle cx="8" cy="8" r="6.3" stroke={color} strokeWidth="1.4" fill="none" />
        <path d="M8 8V3.4A4.6 4.6 0 0 1 12.6 8z" fill={color} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden style={{ flex: 'none' }}>
      <circle cx="8" cy="8" r="6.3" stroke={color} strokeWidth="1.4" fill="none" />
    </svg>
  );
}

const Chevron = () => (
  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden style={{ flex: 'none' }}>
    <path d="M2.2 3.8L5 6.6l2.8-2.8" stroke="#9aa0a8" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** The status mark. Clickable ones (cycle a task, open a menu) get a faint wash on hover, never a pill at rest. */
export function StatusTag({ status, size = 'sm', onClick, chevron, title }: {
  status: TaskStatus; size?: 'sm' | 'md'; onClick?: (e: React.MouseEvent) => void; chevron?: boolean; title?: string;
}) {
  const [hover, setHover] = useState(false);
  const md = size === 'md';
  const interactive = Boolean(onClick);
  return (
    <span
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      title={title}
      aria-label={`Status: ${STATUS_LABEL[status]}`}
      onClick={onClick}
      onKeyDown={interactive ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(e as unknown as React.MouseEvent); } } : undefined}
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: md ? 6 : 5, flex: 'none',
        padding: interactive ? (md ? '4px 7px 4px 5px' : '3px 6px 3px 4px') : 0,
        margin: interactive ? (md ? '-4px -7px -4px -5px' : '-3px -6px -3px -4px') : 0,
        borderRadius: 6, background: hover ? '#f3f4f6' : 'transparent',
        cursor: interactive ? 'pointer' : 'default', transition: 'background-color 120ms ease-out',
        font: `500 ${md ? 12.5 : 11.5}px/1 Inter,sans-serif`, color: '#5c626b', whiteSpace: 'nowrap',
      }}
    >
      <StatusCircleIcon status={status} size={md ? 14 : 12} />
      {STATUS_LABEL[status]}
      {chevron && <Chevron />}
    </span>
  );
}
