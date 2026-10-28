import { LightningIcon, WrenchIcon } from '@phosphor-icons/react';
import type { WidgetDefinition } from '../../dashboard.types';
import { RULES, RULE_TYPES } from '../rules/data';
import { defineInsight, type Tone } from './insight-view';
import { num, pick, plural, unit, whole } from './shared';

// More for Rules: what automation did this week, and which rules are broken, idle or fighting each other.

const CTA = { label: 'Open Rules', to: '/rules' };
const TYPE_LABEL = Object.fromEntries(RULE_TYPES.map((t) => [t.id, t.label])) as Record<string, string>;
const ACTION: Record<string, string> = { bidding: 'bids changed', budget: 'budgets adjusted', daypart: 'hourly bid changes', harvest: 'keywords added or negated' };

// Only live rules act; templates are starting points.
const LIVE = RULES.filter((r) => r.kind === 'Rule');

export const AUTOMATION_WIDGETS: WidgetDefinition[] = [
  defineInsight({
    kind: 'rules-activity', title: 'Rule activity', category: 'Rules', icon: LightningIcon, art: 'stats', availability: 'A·W', accountWide: true, cta: CTA,
    summary: 'What your rules did in the last 7 days, by kind of action, and the busiest rules.',
    description: 'A plain record of the work automation did for you this week, so nothing changes without you knowing.',
    logic: 'Counts every action logged by your live rules in the last 7 days, grouped by kind: bid changes, budget changes, hourly (day-part) changes, and keywords added or negated. Rules are ranked by actions taken.',
    sources: ['Anarix Rules logs'],
    build: () => {
      const rows = LIVE.map((r) => ({ r, actions: whole(r.id, 'actions-7d', 6, 340), paused: r.type === 'budget' ? whole(r.id, 'paused', 1, 9) : 0 })).sort((a, b) => b.actions - a.actions);
      const by = (type: string) => rows.filter((x) => x.r.type === type).reduce((s, x) => s + x.actions, 0);
      const total = rows.reduce((s, x) => s + x.actions, 0);
      const max = Math.max(1, ...rows.map((x) => x.actions));
      return {
        line: `${plural(total, 'action')} by ${plural(rows.length, 'rule')} in 7 days`,
        stats: [{ label: 'Bids changed', value: num(by('bidding') + by('daypart')) }, { label: 'Budgets', value: num(by('budget')), caption: `${num(rows.reduce((s, x) => s + x.paused, 0))} campaigns paused` }, { label: 'Keywords', value: num(by('harvest')), caption: 'added or negated' }],
        rowsHead: ['Rule', 'Actions'],
        rows: rows.map((x) => ({ id: x.r.id, name: x.r.name, tag: TYPE_LABEL[x.r.type], meta: `${x.r.detail} · ${num(x.actions)} ${ACTION[x.r.type]}`, value: num(x.actions), bar: x.actions / max })),
      };
    },
  }),
  defineInsight({
    kind: 'rules-attention', title: 'Rules needing attention', category: 'Rules', icon: WrenchIcon, art: 'list', availability: 'A·W', accountWide: true, cta: CTA,
    summary: 'Rules that failed to run, haven’t triggered in 30 days, or clash on the same target.',
    description: 'A broken or idle rule gives a false sense of cover. Two rules on one target can undo each other.',
    logic: 'Errored = the rule’s last run failed (for example, a campaign it points to was archived). Idle = no action in 30 days. Conflict = two live rules changed the same target’s bid or budget in opposite directions within 24 hours.',
    sources: ['Anarix Rules', 'Rules logs'],
    build: () => {
      const errors = ['Campaign archived', 'Ads API token expired', 'Target no longer exists'];
      const flagged = LIVE.flatMap((r) => {
        const out: { id: string; name: string; tag: string; meta: string; value: string; tone: Tone }[] = [];
        if (unit(r.id, 'errored') > 0.7) out.push({ id: `${r.id}-err`, name: r.name, tag: 'Errored', meta: `${pick(r.id, 'error', errors)} · last run failed`, value: `${whole(r.id, 'err-h', 1, 20)}h ago`, tone: 'bad' });
        if (unit(r.id, 'idle') > 0.68) out.push({ id: `${r.id}-idle`, name: r.name, tag: 'Idle', meta: `No action since its conditions were last met · ${r.detail}`, value: `${whole(r.id, 'idle-d', 31, 74)} days`, tone: 'warn' });
        return out;
      });
      const bidding = LIVE.filter((r) => r.type === 'bidding' || r.type === 'daypart');
      if (bidding.length >= 2) flagged.push({ id: 'conflict', name: `${bidding[0].name} vs ${bidding[1].name}`, tag: 'Conflict', meta: `Opposite bid changes on ${num(whole('conflict', 'targets', 2, 9))} keywords within 24 hours`, value: 'Today', tone: 'bad' });
      return {
        line: flagged.length ? `${plural(flagged.length, 'rule issue')} to look at` : 'Every rule is running cleanly',
        stats: [{ label: 'Errored', value: num(flagged.filter((x) => x.tag === 'Errored').length), tone: 'bad' }, { label: 'Idle 30+ days', value: num(flagged.filter((x) => x.tag === 'Idle').length), tone: 'warn' }, { label: 'Conflicts', value: num(flagged.filter((x) => x.tag === 'Conflict').length), tone: 'bad' }],
        rowsHead: ['Rule and issue', 'Since'],
        rows: flagged,
        empty: 'Every rule ran and acted in the last 30 days.',
      };
    },
  }),
];
