import { Envelope, SlackLogo, GoogleLogo, CalendarBlank } from '@phosphor-icons/react';
import type { AlertSource } from '@/constants/signals/prototype-data';
import { HoverTip } from './hover-tip';

const LABELS: Record<AlertSource, string> = {
  anarix: 'Detected by Anarix',
  jiva: 'Flagged by Jiva',
  meeting: 'Raised in a meeting',
  email: 'Reported by email',
  slack: 'Shared via Slack',
  workspace: 'Shared via Google Workspace',
};

const STROKE = '#464646';

/** The Anarix mark, cropped to just the icon (the source file's viewBox includes the wordmark's canvas). */
function AnarixMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 607 343" fill={STROKE}>
      <polygon points="300.4,149.8 366.5,74.4 299.7,0 233.6,75.4" />
      <path d="M399.9,111.7l-99.1,113.1L200.6,113.1L0,342h155.4c27.2,0,53-11.7,70.9-32.1l74.7-85.2l77.2,86.1
        c17.9,19.9,43.4,31.3,70.2,31.3h158.1L399.9,111.7L399.9,111.7z" />
    </svg>
  );
}

function JivaMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5c.4 2.6 1.2 4 3.9 4.6-2.7.6-3.5 2-3.9 4.6-.4-2.6-1.2-4-3.9-4.6C6.8 5.5 7.6 4.1 8 1.5Z" stroke={STROKE} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M13 10.2c.2 1.1.5 1.7 1.6 1.9-1.1.2-1.4.8-1.6 1.9-.2-1.1-.5-1.7-1.6-1.9 1.1-.2 1.4-.8 1.6-1.9Z" stroke={STROKE} strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

function Glyph({ source, size }: { source: AlertSource; size: number }) {
  switch (source) {
    case 'anarix':
      return <AnarixMark size={size} />;
    case 'jiva':
      return <JivaMark size={size} />;
    case 'meeting':
      return <CalendarBlank size={size} color={STROKE} />;
    case 'email':
      return <Envelope size={size} color={STROKE} />;
    case 'slack':
      return <SlackLogo size={size} color={STROKE} />;
    case 'workspace':
      return <GoogleLogo size={size} color={STROKE} />;
  }
}

export function SourceIcon({ origin, detail, size = 17 }: { origin: AlertSource; detail?: string; size?: number }) {
  const tooltip = detail ? `${LABELS[origin]} · ${detail}` : LABELS[origin];
  return (
    <HoverTip label={tooltip}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: size + 6, height: size + 6, flex: 'none', cursor: 'default' }}>
        <Glyph source={origin} size={size} />
      </span>
    </HoverTip>
  );
}
