interface IconProps { size?: number; color?: string }

export function TagIcon({ size = 18, color = '#6b7178' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M7.4 1.5H3a1.5 1.5 0 0 0-1.5 1.5v4.4c0 .4.16.78.44 1.06l6.1 6.1c.58.59 1.53.59 2.12 0l4.4-4.4c.59-.59.59-1.54 0-2.12l-6.1-6.1a1.5 1.5 0 0 0-1.06-.44z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" /><circle cx="5.2" cy="5.2" r="1" fill={color} /></svg>;
}
export function ImageIcon({ size = 18, color = '#6b7178' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="11" rx="1.3" stroke={color} strokeWidth="1.3" /><circle cx="5" cy="6" r="1.2" stroke={color} strokeWidth="1.2" /><path d="M2 11.5l3.5-3.5 2.5 2.5 2-2 3.5 3.5" stroke={color} strokeWidth="1.3" strokeLinejoin="round" /></svg>;
}
export function MonitorIcon({ size = 18, color = '#6b7178' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="9" rx="1.2" stroke={color} strokeWidth="1.3" /><path d="M5.5 14h5M8 11.5v2.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" /></svg>;
}
export function ChartUpIcon({ size = 18, color = '#6b7178' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M1.5 14h13" stroke={color} strokeWidth="1.3" strokeLinecap="round" /><rect x="3" y="9" width="2.2" height="5" rx="0.4" fill={color} /><rect x="6.9" y="6" width="2.2" height="8" rx="0.4" fill={color} /><rect x="10.8" y="2.5" width="2.2" height="11.5" rx="0.4" fill={color} /></svg>;
}
export function TargetGoalIcon({ size = 18, color = '#6b7178' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.2" stroke={color} strokeWidth="1.3" /><circle cx="8" cy="8" r="3.4" stroke={color} strokeWidth="1.3" /><circle cx="8" cy="8" r="0.9" fill={color} /></svg>;
}
export function RocketIcon({ size = 18, color = '#6b7178' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 1.6c1.8 1 3 3 3 5.6 0 1.6-.4 2.9-1 4l-2 2.3-2-2.3c-.6-1.1-1-2.4-1-4 0-2.6 1.2-4.6 3-5.6z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" /><circle cx="8" cy="6.8" r="1.2" stroke={color} strokeWidth="1.2" /><path d="M5.5 12l-2 2.4M10.5 12l2 2.4" stroke={color} strokeWidth="1.3" strokeLinecap="round" /></svg>;
}
export function LayersIcon({ size = 18, color = '#6b7178' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 1.8 14 5 8 8.2 2 5z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" /><path d="M2 8l6 3.2L14 8M2 11l6 3.2L14 11" stroke={color} strokeWidth="1.3" strokeLinejoin="round" /></svg>;
}
export function HierarchyIcon({ size = 18, color = '#6b7178' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="2.6" r="1.6" stroke={color} strokeWidth="1.3" /><circle cx="3" cy="13" r="1.6" stroke={color} strokeWidth="1.3" /><circle cx="13" cy="13" r="1.6" stroke={color} strokeWidth="1.3" /><path d="M8 4.2v3.4M8 7.6 3 11.6M8 7.6l5 4" stroke={color} strokeWidth="1.3" /></svg>;
}
export function MegaphoneIcon({ size = 18, color = '#77469b' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M2 6.4v3.2c0 .5.4.9.9.9h1.3l3.9 2.5c.6.4 1.4-.05 1.4-.75V3.75c0-.7-.8-1.15-1.4-.75L4.2 5.5H2.9c-.5 0-.9.4-.9.9z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" /><path d="M11 5.3a3.6 3.6 0 0 1 0 5.4M13 3.3a6.6 6.6 0 0 1 0 9.4" stroke={color} strokeWidth="1.3" strokeLinecap="round" /></svg>;
}
export function InfoCircleIcon({ size = 20, color = '#77469b' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.3" stroke={color} strokeWidth="1.3" /><path d="M8 7.2v4M8 5.2v.1" stroke={color} strokeWidth="1.4" strokeLinecap="round" /></svg>;
}
export function WarningTriangleIcon({ size = 16, color = '#a8763f' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M8 1.8 14.8 13.4H1.2z" stroke={color} strokeWidth="1.3" strokeLinejoin="round" /><path d="M8 6.4v3M8 11.2v.1" stroke={color} strokeWidth="1.4" strokeLinecap="round" /></svg>;
}
export function XCircleIcon({ size = 16, color = '#b3453f' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.3" stroke={color} strokeWidth="1.3" /><path d="M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4" stroke={color} strokeWidth="1.4" strokeLinecap="round" /></svg>;
}
export function ArrowRightIcon({ size = 14, color = 'currentColor' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
export function ExternalLinkIcon({ size = 13, color = 'currentColor' }: IconProps) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none"><path d="M6.5 2.5H3a1 1 0 0 0-1 1V13a1 1 0 0 0 1 1h9.5a1 1 0 0 0 1-1V9.5" stroke={color} strokeWidth="1.3" strokeLinecap="round" /><path d="M9 2.5h4.5V7M13.3 2.7 7 9" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
