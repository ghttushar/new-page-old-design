import type { Decision } from './decisions.constants';

export type AlertTabKey = 'all' | 'meetings' | 'fyi' | 'done';

export const ALERT_TABS: { key: AlertTabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'meetings', label: 'From Meetings' },
  { key: 'fyi', label: 'FYI' },
  { key: 'done', label: 'Done' },
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
  if (tab === 'done') return all.filter(isDone);
  if (tab === 'meetings') return all.filter((d) => isMeeting(d) && !isDone(d));
  if (tab === 'fyi') return all.filter(isFyi);
  return all.filter((d) => !isDone(d));
}

export function computeTabCounts(all: Decision[]): Record<AlertTabKey, number> {
  return {
    all: filterByTab(all, 'all').length,
    meetings: filterByTab(all, 'meetings').length,
    fyi: filterByTab(all, 'fyi').length,
    done: filterByTab(all, 'done').length,
  };
}
