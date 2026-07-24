import type { Decision } from '@/constants/signals/decisions.constants';

export type BriefingSlot = 'morning' | 'afternoon' | 'evening' | 'end_of_day';

export interface Briefing {
  slot: BriefingSlot;
  greeting: string;
  dateline: string;
  bullets: string[];
  actionText?: string;
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

  if (slot === 'morning') {
    return {
      slot,
      greeting: 'Good morning.',
      dateline: "Here's everything that happened overnight.",
      bullets: [
        `${open.length} decisions waiting on you · ${fmtDollars(openValue)} of opportunity`,
        `${meetingCount} meeting${meetingCount === 1 ? '' : 's'} created action items`,
        `Aan handled ${inFlight.length} low-risk automation${inFlight.length === 1 ? '' : 's'} while you slept`,
      ],
      actionText: 'Start with the highest-value item',
    };
  }
  if (slot === 'afternoon') {
    return {
      slot,
      greeting: 'Good afternoon.',
      dateline: "Here's what's changed since this morning.",
      bullets: [
        `${completedToday.length} action${completedToday.length === 1 ? '' : 's'} completed · ${fmtDollars(revenueProtected)} protected`,
        `${open.length} still open · ${fmtDollars(openValue)} of opportunity remaining`,
        `${inFlight.length} automation${inFlight.length === 1 ? '' : 's'} running in the background`,
      ],
      actionText: 'Pick up where you left off',
    };
  }
  if (slot === 'evening') {
    return {
      slot,
      greeting: 'Good evening.',
      dateline: "Here's how the day went.",
      bullets: [
        `${completedToday.length} decisions completed · ${fmtDollars(revenueProtected)} protected today`,
        `${open.length} carry over to tomorrow`,
        `${meetingCount} meeting${meetingCount === 1 ? '' : 's'} still have follow-ups`,
      ],
      actionText: "Review tomorrow's priorities",
    };
  }

  return {
    slot,
    greeting: "Today's summary",
    dateline: 'End of day recap.',
    bullets: [
      `Revenue protected: ${fmtDollars(revenueProtected)}`,
      `Actions completed: ${completedToday.length}`,
      `Outstanding work: ${open.length}`,
    ],
  };
}
