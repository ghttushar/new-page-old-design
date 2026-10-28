import { LifebuoyIcon, ShieldCheckIcon, WarningOctagonIcon } from '@phosphor-icons/react';
import type { WidgetDefinition } from '../../dashboard.types';
import { defineInsight, type Row, type Tone } from './insight-view';
import { MARKET_LABEL, num, pick, plural, productsIn, unit, whole, type Marketplace } from './shared';

// Account health & compliance: the performance metrics that keep an account safe from suspension, open policy
// violations, and support cases waiting on a reply.

const marketsOf = (m: 'all' | Marketplace): Marketplace[] => (m === 'all' ? ['amazon', 'walmart'] : [m]);

interface Metric {
  name: string;
  value: number;
  /** The policy limit, in the same unit as the value. */
  target: number;
  /** 'max': stay under the target (defects). 'min': stay above it (tracking, on time). */
  side: 'max' | 'min';
}

const METRICS: Record<Marketplace, Metric[]> = {
  amazon: [
    { name: 'Order defect rate', value: 0.42, target: 1, side: 'max' },
    { name: 'Late shipment rate', value: 2.9, target: 4, side: 'max' },
    { name: 'Pre-fulfilment cancellation rate', value: 0.6, target: 2.5, side: 'max' },
    { name: 'Valid tracking rate', value: 97.8, target: 95, side: 'min' },
    { name: 'On-time delivery rate', value: 91.4, target: 90, side: 'min' },
  ],
  walmart: [
    { name: 'On-time delivery', value: 93.1, target: 95, side: 'min' },
    { name: 'Valid tracking rate', value: 99.2, target: 99, side: 'min' },
    { name: 'Seller cancellation rate', value: 1.4, target: 2, side: 'max' },
    { name: 'Return rate', value: 4.1, target: 6, side: 'max' },
    { name: 'Negative feedback rate', value: 1.2, target: 2, side: 'max' },
  ],
};

/** How much of the allowance is used, 0–1+: 1 means the metric sits on its limit. */
function used(x: Metric): number {
  if (x.side === 'max') return x.value / x.target;
  // For a floor, the allowance is the gap between the limit and 100%.
  return (100 - x.value) / (100 - x.target);
}
const fmt = (n: number) => `${n % 1 === 0 ? n : n.toFixed(n < 10 ? 2 : 1)}%`;

const VIOLATIONS = ['Intellectual property complaint', 'Restricted product', 'Product safety', 'Listing policy', 'Food & product safety', 'Customer product reviews policy'];
const CASE_SUBJECTS = ['Listing suppressed after a category change', 'FBA shipment received short', 'Reinstate listing after IP complaint', 'Brand Registry access', 'Buy Box eligibility', 'Fee charged at the wrong size tier', 'WFS inbound received damaged'];

export const HEALTH_WIDGETS: WidgetDefinition[] = [
  defineInsight({
    kind: 'health-account', title: 'Account health', category: 'Account health', icon: ShieldCheckIcon, art: 'gauge', availability: 'A·W',
    summary: 'Each performance metric against its policy target, with any at risk flagged.',
    description: 'Breaching a performance target can get the account suspended. This shows how close each metric is to its limit.',
    logic: 'Each metric against the marketplace’s target: Amazon’s order defect rate under 1%, late shipment under 4%, pre-fulfilment cancellation under 2.5%, valid tracking over 95% and on-time delivery over 90%; Walmart’s on-time delivery over 95%, valid tracking over 99% and cancellations under 2%. The bar shows how much of the allowance is used; over 80% is at risk.',
    sources: ['Amazon Account Health (SP-API)', 'Walmart Seller Performance API'],
    build: (m) => {
      const rows: Row[] = marketsOf(m).flatMap((mk) => METRICS[mk].map((x) => {
        const u = used(x);
        return { id: `${mk}-${x.name}`, name: x.name, meta: `${MARKET_LABEL[mk]} · target ${x.side === 'max' ? 'under' : 'over'} ${fmt(x.target)}`, value: fmt(x.value), sub: u >= 1 ? 'breached' : u >= 0.8 ? 'at risk' : 'healthy', bar: Math.min(1, u), tone: (u >= 1 ? 'bad' : u >= 0.8 ? 'warn' : 'good') as Tone };
      })).sort((a, b) => (b.bar ?? 0) - (a.bar ?? 0));
      const risk = rows.filter((r) => (r.bar ?? 0) >= 0.8).length;
      const stats = marketsOf(m).map((mk) => mk === 'amazon'
        ? { label: 'Amazon AHR', value: '248', caption: 'Healthy (200+)', tone: 'good' as Tone }
        : { label: 'Walmart', value: METRICS.walmart.some((x) => used(x) >= 1) ? 'At risk' : 'Good', caption: 'Seller Performance', tone: (METRICS.walmart.some((x) => used(x) >= 1) ? 'bad' : 'good') as Tone });
      return {
        line: risk ? `${plural(risk, 'metric')} at risk` : 'Every metric inside its target',
        stats: [...stats, { label: 'At risk', value: num(risk), caption: 'over 80% used', tone: risk ? 'bad' : 'good' }],
        rowsHead: ['Metric and target', 'Now'],
        rows,
      };
    },
  }),
  defineInsight({
    kind: 'health-violations', title: 'Policy violations', category: 'Account health', icon: WarningOctagonIcon, art: 'list', availability: 'A·W', cta: { label: 'Open Catalog', to: '/inventory' },
    summary: 'Open listing policy violations, with the type and how long each has been open.',
    description: 'Unresolved violations count against account health and can take listings down. The oldest need an answer first.',
    logic: 'Open violations on your listings (intellectual property, restricted products, safety, listing policy), oldest first, with the item and days open. Amazon’s warnings carry the account-health points they cost.',
    sources: ['Amazon Account Health', 'Listings Items issues', 'Walmart Item compliance'],
    build: (m) => {
      const open = productsIn(m).filter((p) => unit(p.id, 'violation') > 0.86).map((p) => ({ p, type: pick(p.id, 'violation-type', VIOLATIONS), days: whole(p.id, 'violation-days', 1, 41), points: whole(p.id, 'violation-points', 4, 100) })).sort((a, b) => b.days - a.days);
      return {
        line: `${plural(open.length, 'open violation')}${open.length ? ` · oldest ${open[0].days} days` : ''}`,
        stats: [{ label: 'Open', value: num(open.length), tone: open.length ? 'bad' : 'good' }, { label: 'Over 14 days', value: num(open.filter((x) => x.days > 14).length), tone: 'warn' }],
        rowsHead: ['Item and type', 'Open for'],
        rows: open.map((x) => ({ id: x.p.id, name: x.p.name, tag: x.type, meta: `${MARKET_LABEL[x.p.market]}${x.p.market === 'amazon' ? ` · ${x.points} health points` : ''}`, value: plural(x.days, 'day'), tone: (x.days > 14 ? 'bad' : 'warn') as Tone })),
        empty: 'No open policy violations.',
      };
    },
  }),
  defineInsight({
    kind: 'health-cases', title: 'Cases & appeals', category: 'Account health', icon: LifebuoyIcon, art: 'feed', availability: 'A·W', cta: { label: 'Open Signals', to: '/signals' },
    summary: 'Open seller support cases and appeals, by status and age.',
    description: 'Cases stall when nobody follows up. This shows which ones are waiting on you and which on the marketplace.',
    logic: 'Open cases and appeals, tracked as Work-station tasks, grouped by status: waiting on you, waiting on the marketplace, or escalated. Age = days since the case was opened.',
    sources: ['Anarix Signals Work-station', 'Seller Central and Walmart Seller Center cases'],
    build: (m) => {
      const statuses = ['Waiting on you', 'Waiting on marketplace', 'Escalated'] as const;
      const cases = marketsOf(m).flatMap((mk) => CASE_SUBJECTS.filter((c) => unit(c, `case-${mk}`) > (mk === 'walmart' ? 0.6 : 0.3)).filter((c) => mk === 'walmart' ? !c.includes('FBA') && !c.includes('Brand Registry') : !c.includes('WFS')).map((c) => ({
        id: `${mk}-${c}`, c, mk, status: pick(c, `case-status-${mk}`, statuses), age: whole(c, `case-age-${mk}`, 1, 26), ref: `${mk === 'amazon' ? '' : 'WM-'}${whole(c, `case-id-${mk}`, 1000000000, 9999999999)}`,
      }))).sort((a, b) => b.age - a.age);
      return {
        line: `${plural(cases.length, 'open case')} · ${num(cases.filter((x) => x.status === 'Waiting on you').length)} waiting on you`,
        stats: statuses.map((s) => ({ label: s, value: num(cases.filter((x) => x.status === s).length), tone: (s === 'Waiting on you' ? 'warn' : s === 'Escalated' ? 'bad' : 'neutral') as Tone })),
        rowsHead: ['Case', 'Open for'],
        rows: cases.map((x) => ({ id: x.id, name: x.c, tag: x.status, meta: `${MARKET_LABEL[x.mk]} · case ${x.ref}`, value: plural(x.age, 'day'), tone: (x.status === 'Waiting on you' ? 'warn' : x.status === 'Escalated' ? 'bad' : 'neutral') as Tone })),
        empty: 'No open cases.',
      };
    },
  }),
];
