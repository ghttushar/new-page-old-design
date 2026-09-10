/**
 * Shared icon set for the Alerts surface — one consistent stroke (1.3–1.6px) and weight,
 * replacing unicode/emoji glyphs (✦ ◆ ✓ ✕ 👤 ⤴) that don't belong to a real icon system.
 */
type IconProps = { size?: number; color?: string };

export function SparkleIcon({ size = 12, color = '#5f3880' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l1.4 4.1L13.5 7l-4.1 1.4L8 12.5l-1.4-4.1L2.5 7l4.1-1.4z" fill={color} />
    </svg>
  );
}

export function DiamondIcon({ size = 9, color = '#5f3880' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l6.5 6.5L8 14.5 1.5 8z" fill={color} />
    </svg>
  );
}

export function AssignIcon({ size = 15, color = '#464646' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="5.5" r="2.8" stroke={color} strokeWidth="1.4" />
      <path d="M1.8 14c0-3 2.1-5.2 4.7-5.2s4.7 2.2 4.7 5.2" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12.3 5.2v4M14.3 7.2h-4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function ShareIcon({ size = 13, color = '#464646' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="4" cy="8" r="2" stroke={color} strokeWidth="1.3" />
      <circle cx="12" cy="3.5" r="2" stroke={color} strokeWidth="1.3" />
      <circle cx="12" cy="12.5" r="2" stroke={color} strokeWidth="1.3" />
      <path d="M5.8 7l4.4-2.7M5.8 9l4.4 2.7" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

export function DismissIcon({ size = 13, color = '#464646' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.3" />
      <path d="M5 5l6 6" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ size = 14, color = '#fff' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3 8.2l3.3 3.3L13 4.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function XIcon({ size = 14, color = '#b3453f' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function ThumbUpIcon({ size = 15, color = '#9aa0a8' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M6 14H3.5A1.5 1.5 0 0 1 2 12.5V8a1.5 1.5 0 0 1 1.5-1.5H6m0 7.5V6.5m0 7.5h5.2c.7 0 1.3-.5 1.4-1.2l.9-4A1.5 1.5 0 0 0 12 7H9V3.5A1.5 1.5 0 0 0 7.5 2L6 6.5" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function ThumbDownIcon({ size = 15, color = '#9aa0a8' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" style={{ transform: 'rotate(180deg)' }}>
      <path d="M6 14H3.5A1.5 1.5 0 0 1 2 12.5V8a1.5 1.5 0 0 1 1.5-1.5H6m0 7.5V6.5m0 7.5h5.2c.7 0 1.3-.5 1.4-1.2l.9-4A1.5 1.5 0 0 0 12 7H9V3.5A1.5 1.5 0 0 0 7.5 2L6 6.5" stroke={color} strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

export function EnvelopeSmallIcon({ size = 12, color = '#464646' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.4" stroke={color} strokeWidth="1.3" />
      <path d="M2 4.5l6 4.5 6-4.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WorkspaceSmallIcon({ size = 12, color = '#464646' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke={color} strokeWidth="1.3" />
      <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke={color} strokeWidth="1.3" />
      <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke={color} strokeWidth="1.3" />
      <rect x="9" y="9" width="5.5" height="5.5" rx="1" stroke={color} strokeWidth="1.3" />
    </svg>
  );
}

export function CloseIcon({ size = 12, color = '#6b7178' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function BackArrowIcon({ size = 13, color = '#6b7178' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M10.5 3.5L5 8l5.5 4.5" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BoltIcon({ size = 12, color = '#a8763f' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8.8 1.5L3 9.2h4l-1 5.3L13 6.8H9z" fill={color} />
    </svg>
  );
}

export function InfoIcon({ size = 16, color = '#77469b' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.4" />
      <circle cx="8" cy="5.1" r="0.9" fill={color} />
      <path d="M8 7.6v3.6" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function MoreVertIcon({ size = 14, color = '#6b7178' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="3.4" r="1.35" fill={color} />
      <circle cx="8" cy="8" r="1.35" fill={color} />
      <circle cx="8" cy="12.6" r="1.35" fill={color} />
    </svg>
  );
}

export function ChevronDownIcon({ size = 9, color = '#9aa0a8' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M3.5 6l4.5 4.5L12.5 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
