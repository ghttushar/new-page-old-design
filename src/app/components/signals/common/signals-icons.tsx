// Icons for Signals and its tabs. Drawn on a 24px grid with a 1.7 stroke so they sit with the sidebar's Phosphor icons,
// and they inherit the surrounding text colour (so they turn brand purple when their item is active).

interface IconProps { size?: number; className?: string }

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function Svg({ size = 20, className, children }: IconProps & { children: React.ReactNode }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden focusable="false" {...stroke}>{children}</svg>;
}

/** Signals: a diamond (the Jiva mark) at the centre of two broadcast arcs on each side — things being picked up for you. */
export function SignalsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M12 8.4l3.6 3.6-3.6 3.6L8.4 12z" fill="currentColor" fillOpacity={0.16} />
      <path d="M6.4 7.4a7 7 0 0 0 0 9.2M17.6 7.4a7 7 0 0 1 0 9.2" />
      <path d="M3.4 4.6a11.2 11.2 0 0 0 0 14.8M20.6 4.6a11.2 11.2 0 0 1 0 14.8" opacity={0.55} />
    </Svg>
  );
}

/** Alerts: a point with rings spreading out from it, like a ping. */
export function AlertsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="9.6" opacity={0.5} />
    </Svg>
  );
}

/** Brief: a page with a spark — the day at a glance. */
export function BriefIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <path d="M6 3.6h8.2L19 8.4v11a1.2 1.2 0 0 1-1.2 1.2H6a1.2 1.2 0 0 1-1.2-1.2V4.8A1.2 1.2 0 0 1 6 3.6z" fill="currentColor" fillOpacity={0.1} />
      <path d="M14 3.8v4.6h4.8" />
      <path d="M8.4 12.6h7.2M8.4 16h4.4" />
    </Svg>
  );
}

/** Meetings: a calendar with a marked day. */
export function MeetingsIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="3.6" y="5" width="16.8" height="15.4" rx="2.4" fill="currentColor" fillOpacity={0.1} />
      <path d="M3.6 10h16.8M8 3.2v3.6M16 3.2v3.6" />
      <circle cx="12" cy="14.8" r="1.7" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** Work-station: a task list with a ticked item. */
export function WorkStationIcon(props: IconProps) {
  return (
    <Svg {...props}>
      <rect x="4" y="3.6" width="16" height="16.8" rx="2.4" fill="currentColor" fillOpacity={0.1} />
      <path d="M8 9.2l1.5 1.5L12 8.2M8 15.4h8M13.6 10h2.4" />
    </Svg>
  );
}

export const SIGNAL_TAB_ICONS = { brief: BriefIcon, alerts: AlertsIcon, meetings: MeetingsIcon, workstation: WorkStationIcon } as const;
