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
  bundleId: string;
  title: string;
  signalCount: number;
}

export interface TodoItem {
  task: string;
  from: 'meeting' | 'alert' | 'manual';
  due?: string;
}

export interface PendingItem {
  task: string;
  from: 'meeting' | 'alert';
  since: string;
}

export interface OvernightChange {
  change: string;
  impact: string;
  type: 'new_alert' | 'status_change' | 'value_change';
}

export interface StreakDay {
  day: string;
  label: string;
  active: boolean;
}

export interface WeeklySummary {
  totalDecisions: number;
  resolvedCount: number;
  revenueProtected: number;
  avgResponseTime: string;
  onTimeRate: number;
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
  todoToday?: TodoItem[];
  pendingYesterday?: PendingItem[];
  overnightChanges?: OvernightChange[];
  // Gamification
  monthlyRevenueProtected?: number;
  streakDays?: StreakDay[];
  weeklySummary?: WeeklySummary;
}

function slotOf(hours = new Date().getHours()): BriefingSlot {
  if (hours < 12) return 'morning';
  if (hours < 17) return 'afternoon';
  if (hours < 20) return 'evening';
  return 'end_of_day';
}

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const hrs = diff / 3_600_000;
  if (hrs < 1) return `${Math.max(1, Math.round(diff / 60_000))}m ago`;
  if (hrs < 24) return `${Math.round(hrs)}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function isOvernight(ts: number): boolean {
  const date = new Date(ts);
  const hrs = date.getHours();
  return hrs >= 0 && hrs < 6;
}

function formatDateForPending(ts: number): string {
  const date = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 3_600_000);
  if (ts > Date.now() - 24 * 3_600_000) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function fmtDollars(cents: number): string {
  const d = Math.abs(cents) / 100;
  if (d < 1000) return `$${Math.round(d)}`;
  if (d < 1_000_000) return `$${(d / 1000).toFixed(1)}k`;
  return `$${(d / 1_000_000).toFixed(1)}M`;
}

function buildTodoToday(decisions: Decision[]): { task: string; from: 'meeting' | 'alert' | 'manual'; due?: string }[] {
  const staticTodos: { task: string; from: 'meeting' | 'alert' | 'manual'; due?: string }[] = [
    { task: 'Review Q4 ad spend allocation', from: 'manual', due: 'EOD' },
    { task: 'Follow up with supply chain on restock ETA', from: 'meeting', due: 'EOD' },
    { task: 'Approve Black Friday creative assets', from: 'alert', due: 'EOD' },
    { task: 'Check competitor pricing changes on Walmart', from: 'manual', due: 'EOD' },
    { task: 'Circulate meeting recap to internal Slack', from: 'manual', due: 'EOD' },
  ];

  const items = [...staticTodos];

  decisions.forEach((d) => {
    if (items.length >= 5) return;
    if (d.status !== 'open') return;
    const createdToday = new Date(d.createdAt).toDateString() === new Date().toDateString();
    const updatedToday = new Date(d.updatedAt).toDateString() === new Date().toDateString();
    if (!createdToday && !updatedToday) return;
    const task = d.actionVerb || d.insight.slice(0, 60);
    if (!items.some((existing) => existing.task === task)) {
      items.push({ task, from: d.meetingRef ? 'meeting' : 'alert', due: 'EOD' });
    }
  });

  return items.slice(0, 5);
}

function buildPendingYesterday(decisions: Decision[]): { task: string; from: 'meeting' | 'alert'; since: string }[] {
  const items: { task: string; from: 'meeting' | 'alert'; since: string }[] = [];

  decisions.forEach((d) => {
    if (d.status !== 'open') return;
    const updatedYesterday = new Date(d.updatedAt).toDateString() === new Date(Date.now() - 24 * 3_600_000).toDateString();
    const createdBeforeYesterday = new Date(d.createdAt).toDateString() < new Date().toDateString();

    if (updatedYesterday || (d.meetingRef && new Date(d.createdAt).toDateString() <= new Date(Date.now() - 24 * 3_600_000).toDateString())) {
      items.push({
        task: d.actionVerb || d.insight.slice(0, 60),
        from: d.meetingRef ? 'meeting' : 'alert',
        since: formatDateForPending(d.updatedAt),
      });
    }
  });

  return items.slice(0, 5);
}

function buildOvernightChanges(decisions: Decision[]): { change: string; impact: string; type: 'new_alert' | 'status_change' | 'value_change' }[] {
  const items: { change: string; impact: string; type: 'new_alert' | 'status_change' | 'value_change' }[] = [];

  decisions.forEach((d) => {
    if (!isOvernight(d.createdAt) && !isOvernight(d.updatedAt)) return;

    if (isOvernight(d.createdAt)) {
      items.push({ change: `New alert: ${d.insight}`, impact: d.valueCaption || 'Pending review', type: 'new_alert' });
    } else if (isOvernight(d.updatedAt)) {
      items.push({ change: `Status updated: ${d.insight.slice(0, 50)}`, impact: 'Status changed', type: 'status_change' });
    }
  });

  return items.slice(0, 5);
}

function buildStreakDays(decisions: Decision[]): StreakDay[] {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const todayDayIdx = (today.getDay() + 6) % 7;

  const daysWithAction = new Set(
    decisions
      .filter((d) => d.status === 'completed' || d.status === 'rejected')
      .map((d) => new Date(d.updatedAt).toDateString())
  );

  return dayNames.slice(0, todayDayIdx + 1).map((name, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (todayDayIdx - i));
    return {
      day: name,
      label: i === todayDayIdx ? 'Today' : name,
      active: daysWithAction.has(d.toDateString()),
    };
  });
}

function buildWeeklySummary(decisions: Decision[]): WeeklySummary {
  const weekMs = 7 * 24 * 3_600_000;
  const weekAgo = Date.now() - weekMs;

  const weekDecisions = decisions.filter((d) => d.createdAt >= weekAgo || d.updatedAt >= weekAgo);
  const resolved = weekDecisions.filter((d) => d.status === 'completed' || d.status === 'rejected');
  const revenueProtected = resolved.reduce((n, d) => n + (d.valueKind === 'info' ? 0 : Math.abs(d.valueCents)), 0);

  const responseTimes = resolved.map((d) => d.updatedAt - d.createdAt);
  const avgMs = responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0;
  const avgHrs = avgMs / 3_600_000;
  const avgResponseTime = avgHrs < 1 ? `${Math.round(avgHrs * 60)}m` : `${Math.round(avgHrs)}h`;

  const onTime = resolved.filter((d) => (d.updatedAt - d.createdAt) < 24 * 3_600_000).length;
  const onTimeRate = resolved.length > 0 ? Math.round((onTime / resolved.length) * 100) : 100;

  return {
    totalDecisions: weekDecisions.length,
    resolvedCount: resolved.length,
    revenueProtected,
    avgResponseTime,
    onTimeRate,
  };
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

  const meetingMap = new Map<string, { bundleId: string; title: string; signalCount: number }>();
  for (const d of decisions) {
    if (!d.meetingRef) continue;
    const existing = meetingMap.get(d.meetingRef.bundleId);
    if (existing) existing.signalCount++;
    else meetingMap.set(d.meetingRef.bundleId, { bundleId: d.meetingRef.bundleId, title: d.meetingRef.title, signalCount: 1 });
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

  // Monthly revenue protected
  const monthMs = 30 * 24 * 3_600_000;
  const monthlyRevenueProtected = decisions
    .filter((d) => (d.status === 'completed' || d.status === 'rejected') && Date.now() - d.updatedAt < monthMs)
    .reduce((n, d) => n + (d.valueKind === 'info' ? 0 : Math.abs(d.valueCents)), 0);

  // Gamification data
  const streakDays = buildStreakDays(decisions);
  const weeklySummary = buildWeeklySummary(decisions);

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
      todoToday: buildTodoToday(decisions),
      pendingYesterday: buildPendingYesterday(decisions),
      overnightChanges: buildOvernightChanges(decisions),
      monthlyRevenueProtected,
      streakDays,
      weeklySummary,
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
      monthlyRevenueProtected,
      streakDays,
      weeklySummary,
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
      monthlyRevenueProtected,
      streakDays,
      weeklySummary,
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
    monthlyRevenueProtected,
    streakDays,
    weeklySummary,
  };
}
