import type { Decision } from '@/constants/signals/decisions.constants';
import type { AlertTabKey } from '@/constants/signals/tabs.constants';

export interface CategorizedGroup {
  key: string;
  label: string;
  defaultOpen: boolean;
  items: Decision[];
}

const DOMAIN_LABEL: Record<string, string> = {
  campaign: 'Advertising',
  retail: 'Retail Listings',
  profitability: 'Profitability',
  inventory: 'Inventory',
  cs: 'Customer Service',
  buyer: 'Buyer / Accounts',
};

const ALL_ORDER: string[] = [
  'Advertising',
  'Inventory',
  'Profitability',
  'Customer Service',
  'Buyer / Accounts',
  'Retail Listings',
  'Automated',
];

const MEETINGS_ORDER: string[] = [
  'Amazon',
  'Walmart',
  'Internal',
  'Customer Calls',
  'Pending This Week',
  'Automated',
];

const FYI_ORDER: string[] = [
  'Insights',
  'Trends',
  'Market Changes',
  'Competitor Updates',
  'Pending This Week',
  'Automated',
];

const DONE_ORDER: string[] = ['Completed Today', 'Completed This Week'];

function meetingBucket(d: Decision): string {
  const label = (d.meetingRef?.title || d.sourceRef.label || '').toLowerCase();
  if (label.includes('staples') || label.includes('walmart') || label.includes('target') || label.includes('customer')) {
    if (label.includes('walmart')) return 'Walmart';
    if (label.includes('customer') || label.includes('buyer')) return 'Customer Calls';
    return 'Amazon';
  }
  if (label.includes('amazon')) return 'Amazon';
  return 'Internal';
}

function fyiBucket(d: Decision): string {
  const t = (d.insight + ' ' + d.sourceRef.label).toLowerCase();
  if (t.includes('competitor') || t.includes('undercut') || t.includes('buy box')) return 'Competitor Updates';
  if (t.includes('trend') || t.includes('velocity') || t.includes('weeks')) return 'Trends';
  if (t.includes('market') || t.includes('price')) return 'Market Changes';
  return 'Insights';
}

function isThisWeekPending(d: Decision): boolean {
  const week = 7 * 24 * 3_600_000;
  const age = Date.now() - d.createdAt;
  return d.status === 'open' && age <= week;
}

function isAutomated(d: Decision): boolean {
  return d.status === 'with_aan' || d.status === 'in_flight';
}

function isCompletedToday(d: Decision): boolean {
  if (!(d.status === 'completed' || d.status === 'rejected' || d.status === 'in_flight' || d.status === 'with_aan')) return false;
  const today = new Date().toDateString();
  return new Date(d.updatedAt).toDateString() === today;
}

function isCompletedThisWeek(d: Decision): boolean {
  if (isCompletedToday(d)) return false;
  const week = 7 * 24 * 3_600_000;
  return Date.now() - d.updatedAt < week;
}

export function categorize(tab: AlertTabKey, list: Decision[]): CategorizedGroup[] {
  const buckets = new Map<string, Decision[]>();
  const add = (k: string, d: Decision) => {
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(d);
  };

  for (const d of list) {
    if (tab === 'done') {
      if (isCompletedToday(d)) add('Completed Today', d);
      else if (isCompletedThisWeek(d)) add('Completed This Week', d);
    } else if (tab === 'meetings') {
      add(meetingBucket(d), d);
      if (isAutomated(d)) add('Automated', d);
      else if (isThisWeekPending(d)) add('Pending This Week', d);
    } else if (tab === 'fyi') {
      add(fyiBucket(d), d);
      if (isAutomated(d)) add('Automated', d);
      else if (isThisWeekPending(d)) add('Pending This Week', d);
    } else {
      add(DOMAIN_LABEL[d.domain] || 'Other', d);
      if (isAutomated(d)) add('Automated', d);
    }
  }

  const order = tab === 'done' ? DONE_ORDER : tab === 'meetings' ? MEETINGS_ORDER : tab === 'fyi' ? FYI_ORDER : ALL_ORDER;

  const result: CategorizedGroup[] = [];
  for (const label of order) {
    const items = buckets.get(label);
    if (!items || items.length === 0) continue;
    result.push({
      key: label,
      label,
      defaultOpen: label !== 'Automated' && label !== 'Completed This Week',
      items,
    });
  }
  for (const [label, items] of buckets) {
    if (order.includes(label)) continue;
    result.push({ key: label, label, defaultOpen: false, items });
  }
  return result;
}
