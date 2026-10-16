export type SignalTabKey = 'alerts' | 'meetings' | 'workstation';

export const SIGNAL_TABS: { key: SignalTabKey; label: string }[] = [
  { key: 'alerts', label: 'Alerts' },
  { key: 'meetings', label: 'Meetings' },
  { key: 'workstation', label: 'Work-station' },
];

