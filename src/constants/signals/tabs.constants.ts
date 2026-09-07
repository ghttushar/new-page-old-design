export type SignalTabKey = 'brief' | 'alerts' | 'meetings' | 'workstation';

export const SIGNAL_TABS: { key: SignalTabKey; label: string }[] = [
  { key: 'brief', label: 'Brief' },
  { key: 'alerts', label: 'Alerts' },
  { key: 'meetings', label: 'Meetings' },
  { key: 'workstation', label: 'Work-station' },
];

export type BriefState = 'full' | 'nointeg' | 'onboard';
