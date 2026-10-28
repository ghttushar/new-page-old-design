import { CalendarDotsIcon, CheckSquareOffsetIcon, SquaresFourIcon } from '@phosphor-icons/react';
import { MEETING_DETAILS, MEETING_LIST, PROTOTYPE_ALERTS, WORKSTATION_TASKS } from '@/constants/signals/prototype-data';
import type { WidgetDefinition } from '../../dashboard.types';
import { defineInsight, type Tone } from './insight-view';
import { num, plural } from './shared';

// More for Signals: your own to-dos, the client calls coming up, and where alerts cluster.

const PRIORITY_TONE: Record<string, Tone> = { High: 'bad', Medium: 'warn', Low: 'neutral' };

export const WORK_WIDGETS: WidgetDefinition[] = [
  defineInsight({
    kind: 'work-tasks', title: 'My tasks', category: 'Signals', icon: CheckSquareOffsetIcon, art: 'list', availability: 'A·W', accountWide: true, cta: { label: 'Open Work-station', to: '/signals?tab=workstation' },
    summary: 'Work-station tasks assigned to you: overdue, open and done.',
    description: 'Your own to-do list from Signals, overdue first, without opening the Work-station.',
    logic: 'Work-station tasks where you are the assignee and the task isn’t done, overdue first, then by priority and due date. Done = your tasks marked done.',
    sources: ['Anarix Signals Work-station'],
    build: () => {
      const mine = WORKSTATION_TASKS.filter((t) => t.assignee === 'You');
      const rank = { High: 0, Medium: 1, Low: 2 } as const;
      const open = mine.filter((t) => t.status !== 'done').sort((a, b) => Number(b.overdue) - Number(a.overdue) || rank[a.priority] - rank[b.priority]);
      return {
        line: `${plural(open.length, 'open task')}${open.some((t) => t.overdue) ? ` · ${num(open.filter((t) => t.overdue).length)} overdue` : ''}`,
        stats: [{ label: 'Open', value: num(open.length) }, { label: 'Overdue', value: num(open.filter((t) => t.overdue).length), tone: open.some((t) => t.overdue) ? 'bad' : 'neutral' }, { label: 'Done', value: num(mine.filter((t) => t.status === 'done').length), tone: 'good' }],
        rowsHead: ['Task', 'Due'],
        rows: open.map((t) => ({ id: t.id, name: t.text, tag: t.status === 'in_progress' ? 'In progress' : undefined, meta: `${t.priority} priority · from ${t.createdBy === 'You' ? 'you' : t.createdBy}${t.meetingLabel ? ` · ${t.meetingLabel}` : ''}`, value: t.due, sub: t.overdue ? 'overdue' : undefined, tone: t.overdue ? 'bad' : PRIORITY_TONE[t.priority] })),
        empty: 'Nothing assigned to you.',
      };
    },
  }),
  defineInsight({
    kind: 'work-meetings', title: 'Upcoming meetings', category: 'Signals', icon: CalendarDotsIcon, art: 'feed', availability: 'A·W', accountWide: true, cta: { label: 'Open Meetings', to: '/signals?tab=meetings' },
    summary: 'Your next client meetings, prep progress and the open alerts for each account.',
    description: 'Walk into each client call knowing what’s open on their account and what’s already done.',
    logic: 'Meetings from Signals, soonest first. Prep = tasks done ÷ tasks for the meeting. Open alerts = alerts on the meeting’s account that still need attention.',
    sources: ['Anarix Signals Meetings', 'Signals alerts'],
    build: () => {
      const rows = MEETING_LIST.map((mt) => {
        const alerts = PROTOTYPE_ALERTS.filter((a) => a.account.startsWith(mt.account) || mt.account.startsWith(a.account));
        const high = alerts.filter((a) => a.priority === 'High').length;
        return { mt, alerts: alerts.length, high, attendees: MEETING_DETAILS[mt.id]?.attendees.map((a) => a.name).join(', ') };
      });
      return {
        line: `${plural(rows.length, 'meeting')} today · ${plural(rows.reduce((s, r) => s + r.alerts, 0), 'open alert')} across them`,
        rowsHead: ['Meeting and account', 'Prep'],
        rows: rows.map(({ mt, alerts, high, attendees }) => ({ id: mt.id, name: mt.title, tag: mt.account, meta: `${mt.dateLabel}, ${mt.timeRange} · ${plural(alerts, 'open alert')}${high ? ` (${high} high)` : ''}${attendees ? ` · with ${attendees}` : ''}`, value: `${mt.tasksCompleted}/${mt.tasksTotal}`, sub: mt.tasksCompleted === mt.tasksTotal ? 'ready' : 'tasks done', bar: mt.tasksTotal ? mt.tasksCompleted / mt.tasksTotal : 0, tone: (mt.tasksCompleted === mt.tasksTotal ? 'good' : 'warn') as Tone })),
        empty: 'No meetings coming up.',
      };
    },
  }),
  defineInsight({
    kind: 'work-alert-categories', title: 'Alerts by category', category: 'Signals', icon: SquaresFourIcon, art: 'list', availability: 'A·W', cta: { label: 'Open Alerts', to: '/signals?tab=alerts' },
    summary: 'Open alerts per category, today against yesterday.',
    description: 'Shows where problems cluster, so a team can take a whole category instead of chasing alerts one by one.',
    logic: 'Alerts grouped by category, filtered to the marketplace. Today and yesterday are counted separately; the bar is the category’s share of all alerts.',
    sources: ['Anarix Signals alerts'],
    build: (m) => {
      const alerts = PROTOTYPE_ALERTS.filter((a) => m === 'all' || a.mpBrand === m || a.mpBrands?.includes(m));
      const cats = new Map<string, { today: number; yesterday: number; high: number }>();
      alerts.forEach((a) => {
        const c = cats.get(a.category) ?? { today: 0, yesterday: 0, high: 0 };
        c[a.day] += 1;
        if (a.priority === 'High') c.high += 1;
        cats.set(a.category, c);
      });
      const rows = [...cats.entries()].map(([name, c]) => ({ name, ...c, total: c.today + c.yesterday })).sort((a, b) => b.total - a.total);
      const max = Math.max(1, ...rows.map((r) => r.total));
      return {
        line: `${plural(alerts.length, 'alert')} in ${plural(rows.length, 'category', 'categories')} · most in ${rows[0]?.name ?? '—'}`,
        stats: [{ label: 'Today', value: num(alerts.filter((a) => a.day === 'today').length) }, { label: 'Yesterday', value: num(alerts.filter((a) => a.day === 'yesterday').length) }, { label: 'High priority', value: num(alerts.filter((a) => a.priority === 'High').length), tone: 'bad' }],
        rowsHead: ['Category', 'Alerts'],
        rows: rows.map((r) => ({ id: r.name, name: r.name, meta: `${num(r.today)} today · ${num(r.yesterday)} yesterday${r.high ? ` · ${num(r.high)} high priority` : ''}`, value: num(r.total), bar: r.total / max, tone: (r.high ? 'warn' : 'neutral') as Tone })),
        empty: 'No alerts.',
      };
    },
  }),
];
