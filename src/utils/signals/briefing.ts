import type { Decision } from '@/constants/signals/decisions.constants';
import { formatValue } from './valueFormat';

export type BriefingSlot = 'morning' | 'afternoon' | 'evening' | 'end_of_day';

export interface PriorityAlert {
  title: string;
  value: string;
  verb: string;
  severity: 'critical' | 'opportunity' | 'fyi';
}

export interface UpcomingMeeting {
  title: string;
  signalCount: number;
}

export interface Briefing {
  slot: BriefingSlot;
  greeting: string;
  dateline: string;
  bullets: string[];
  actionText?: string;
  priorityAlerts?: PriorityAlert[];
  upcomingMeetings?: UpcomingMeeting[];
  aanActivity?: string[];
  weeklyStreak?: string;
}

function slotOf(hours = new Date().getHours()): BriefingSlot {
  if (hours < 12) return 'morning';
  if (hours < 17) return 'afternoon';
  if (hours < 20) return 'evening';
  return 'end_of_day';
}

function fmtDollars(cents: number): string {
  const d = Math.abs(cents) / 100;
  if (d < 1000) return `$${Math.round(d)}`;
  if (d < 1_000_000) return `$${(d / 1000).toFixed(1)}k`;
  return `$${(d / 1_000_000).toFixed(1)}M`;
}

export function briefingFor(decisions: Decision[]): Briefing {
  const slot = slotOf();

  const open = decisions.filter((d) => d.status === 'open');
  const inFlight = decisions.filter((d) => d.status === 'in_flight' || d.status === 'with_aan');
  const completedToday = decisions.filter((d) => {
    if (d.status !== 'completed' && d.status !== 'rejected' && d.status !== 'in_flight' && d.status !== 'with_aan') return false;
    return new Date(d.updatedAt).toDateString() === new Date().toDateString();
  });

  const meetingCount = new Set(
    decisions.filter((d) => d.meetingRef).map((d) => d.meetingRef!.bundleId),
  ).size;

  const revenueProtected = completedToday.reduce(
    (n, d) => n + (d.valueKind === 'info' ? 0 : Math.abs(d.valueCents)),
    0,
  );

  const openValue = open.reduce(
    (n, d) => n + (d.valueKind === 'info' ? 0 : Math.abs(d.valueCents)),
    0,
  );

  const priorityAlerts: PriorityAlert[] = open
    .sort((a, b) => Math.abs(b.valueCents) - Math.abs(a.valueCents))
    .slice(0, 3)
    .map((d) => {
      const val = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });
      return { title: d.insight, value: val.text, verb: d.actionVerb, severity: d.severity };
    });

  const meetingMap = new Map<string, { title: string; signalCount: number }>();
  for (const d of decisions) {
    if (!d.meetingRef) continue;
    const existing = meetingMap.get(d.meetingRef.bundleId);
    if (existing) existing.signalCount++;
    else meetingMap.set(d.meetingRef.bundleId, { title: d.meetingRef.title, signalCount: 1 });
  }
  const upcomingMeetings: UpcomingMeeting[] = [...meetingMap.values()].slice(0, 3);

  const aanActivity: string[] = inFlight.slice(0, 3).map((d) => {
    if (d.status === 'with_aan') return `Jiva is working on: ${d.insight}`;
    return `Executing: ${d.insight}`;
  });

  const weekMs = 7 * 24 * 3_600_000;
  const daysWithActivity = new Set(
    decisions
      .filter((d) => d.status === 'completed' || d.status === 'rejected')
      .filter((d) => Date.now() - d.updatedAt < weekMs)
      .map((d) => new Date(d.updatedAt).toDateString()),
  ).size;
  const weeklyStreak = `${daysWithActivity} of 7 days with completed actions`;

  if (slot === 'morning') {
    return {
      slot,
      greeting: 'Good morning.',
      dateline: 'Here\'s everything that happened overnight.',
      bullets: [
        `${open.length} decisions waiting on you · ${fmtDollars(openValue)} of opportunity`,
        `${meetingCount} meeting${meetingCount === 1 ? '' : 's'} created action items`,
        `Jiva handled ${inFlight.length} low-risk automation${inFlight.length === 1 ? '' : 's'} while you slept`,
      ],
      actionText: 'Start with the highest-value item',
      priorityAlerts,
      upcomingMeetings,
      aanActivity,
      weeklyStreak,
    };
  }
  if (slot === 'afternoon') {
    return {
      slot,
      greeting: 'Good afternoon.',
      dateline: 'Here\'s what\'s changed since this morning.',
      bullets: [
        `${completedToday.length} action${completedToday.length === 1 ? '' : 's'} completed · ${fmtDollars(revenueProtected)} protected`,
        `${open.length} still open · ${fmtDollars(openValue)} of opportunity remaining`,
        `${inFlight.length} automation${inFlight.length === 1 ? '' : 's'} running in the background`,
      ],
      actionText: 'Pick up where you left off',
      priorityAlerts,
      upcomingMeetings,
      aanActivity,
      weeklyStreak,
    };
  }
  if (slot === 'evening') {
    return {
      slot,
      greeting: 'Good evening.',
      dateline: 'Here\'s how the day went.',
      bullets: [
        `${completedToday.length} decisions completed · ${fmtDollars(revenueProtected)} protected today`,
        `${open.length} carry over to tomorrow`,
        `${meetingCount} meeting${meetingCount === 1 ? '' : 's'} still have follow-ups`,
      ],
      actionText: 'Review tomorrow\'s priorities',
      priorityAlerts,
      upcomingMeetings,
      aanActivity,
      weeklyStreak,
    };
  }

  return {
    slot,
    greeting: 'Today\'s summary',
    dateline: 'End of day recap.',
    bullets: [
      `Revenue protected: ${fmtDollars(revenueProtected)}`,
      `Actions completed: ${completedToday.length}`,
      `Outstanding work: ${open.length}`,
    ],
    priorityAlerts,
    upcomingMeetings,
    aanActivity,
    weeklyStreak,
  };
}
