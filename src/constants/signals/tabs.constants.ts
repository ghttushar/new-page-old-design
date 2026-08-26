import type { Decision } from './decisions.constants';

export type AlertTabKey = 'unread' | 'meetings' | 'fyi' | 'read' | 'completed';

export const ALERT_TABS: { key: AlertTabKey; label: string }[] = [
  { key: 'unread', label: 'Unread' },
  { key: 'meetings', label: 'From Meetings' },
  { key: 'fyi', label: 'FYI' },
  { key: 'read', label: 'Read' },
  { key: 'completed', label: 'Completed' },
];

function isDone(d: Decision): boolean {
  return (
    d.status === 'completed' ||
    d.status === 'rejected' ||
    d.status === 'in_flight' ||
    d.status === 'with_aan'
  );
}

function isFyi(d: Decision): boolean {
  return d.severity === 'fyi' && d.status === 'open';
}

function isMeeting(d: Decision): boolean {
  return !!d.meetingRef;
}

export function filterByTab(all: Decision[], tab: AlertTabKey): Decision[] {
  if (tab === 'read') return all.filter(isDone);
  if (tab === 'meetings') return all.filter((d) => isMeeting(d) && !isDone(d));
  if (tab === 'fyi') return all.filter(isFyi);
  if (tab === 'completed') return all.filter((d) => d.status === 'completed');
  return all.filter((d) => !isDone(d));
}

export function computeTabCounts(all: Decision[]): Record<AlertTabKey, number> {
  return {
    unread: filterByTab(all, 'unread').length,
    meetings: filterByTab(all, 'meetings').length,
    fyi: filterByTab(all, 'fyi').length,
    read: filterByTab(all, 'read').length,
    completed: filterByTab(all, 'completed').length,
  };
}
