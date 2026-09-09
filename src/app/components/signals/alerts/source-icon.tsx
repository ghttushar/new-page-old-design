import { Envelope } from '@phosphor-icons/react';
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

/** Circular badge background per source — solid brand colour for single-tone marks, white for marks that carry their own official colour. */
const BADGE_BG: Record<AlertSource, string> = {
  anarix: '#77469b',
  jiva: '#0f9488',
  meeting: '#3874ff',
  email: '#5b6b8c',
  slack: '#ffffff',
  workspace: '#ffffff',
};

/** The Anarix mark, cropped to just the icon (the source file's viewBox includes the wordmark's canvas). */
function AnarixMark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 607 343" fill={color}>
      <polygon points="300.4,149.8 366.5,74.4 299.7,0 233.6,75.4" />
      <path d="M399.9,111.7l-99.1,113.1L200.6,113.1L0,342h155.4c27.2,0,53-11.7,70.9-32.1l74.7-85.2l77.2,86.1
        c17.9,19.9,43.4,31.3,70.2,31.3h158.1L399.9,111.7L399.9,111.7z" />
    </svg>
  );
}

/** Video-camera mark — matches the standalone meeting-link glyph elsewhere; a calendar here reads as a date picker. */
function MeetingMark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="4.5" width="8.2" height="7" rx="1.4" stroke={color} strokeWidth="1.4" />
      <path d="M9.7 7.2l4.1-2.5a.55.55 0 0 1 .84.47v5.6a.55.55 0 0 1-.84.48L9.7 8.8" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function JivaMark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5c.4 2.6 1.2 4 3.9 4.6-2.7.6-3.5 2-3.9 4.6-.4-2.6-1.2-4-3.9-4.6C6.8 5.5 7.6 4.1 8 1.5Z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M13 10.2c.2 1.1.5 1.7 1.6 1.9-1.1.2-1.4.8-1.6 1.9-.2-1.1-.5-1.7-1.6-1.9 1.1-.2 1.4-.8 1.6-1.9Z" stroke={color} strokeWidth="1.1" strokeLinejoin="round" />
    </svg>
  );
}

/** Official Google "G" mark, full colour. */
function GoogleMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

/** Official Slack mark, full colour. */
function SlackMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 122.8 122.8">
      <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9z" fill="#E01E5A" />
      <path d="M32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#E01E5A" />
      <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2z" fill="#36C5F0" />
      <path d="M45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36C5F0" />
      <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2z" fill="#2EB67D" />
      <path d="M90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2EB67D" />
      <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9z" fill="#ECB22E" />
      <path d="M77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ECB22E" />
    </svg>
  );
}

function Glyph({ source, size }: { source: AlertSource; size: number }) {
  switch (source) {
    case 'anarix':
      return <AnarixMark size={size} color="#ffffff" />;
    case 'jiva':
      return <JivaMark size={size} color="#ffffff" />;
    case 'meeting':
      return <MeetingMark size={size} color="#ffffff" />;
    case 'email':
      return <Envelope size={size} color="#ffffff" weight="fill" />;
    case 'slack':
      return <SlackMark size={size} />;
    case 'workspace':
      return <GoogleMark size={size} />;
  }
}

export function SourceIcon({ origin, detail, size = 19 }: { origin: AlertSource; detail?: string; size?: number }) {
  const tooltip = detail ? `${LABELS[origin]} · ${detail}` : LABELS[origin];
  const iconSize = Math.round(size * 0.58);
  const needsRing = BADGE_BG[origin] === '#ffffff';

  return (
    <HoverTip label={tooltip}>
      <span
        style={{
          width: size, height: size, borderRadius: '50%', background: BADGE_BG[origin],
          display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none',
          boxShadow: needsRing ? '0 0 0 1.5px #fff, 0 0 0 2px #e6e8ec' : '0 0 0 1.5px #fff',
          cursor: 'default',
        }}
      >
        <Glyph source={origin} size={iconSize} />
      </span>
    </HoverTip>
  );
}
