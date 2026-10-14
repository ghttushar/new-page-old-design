import { INotificationItem } from '@/interfaces/notifications/notification.interface';

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/** Sample notifications. Times are relative to now, so "N min ago" is always true when the app loads. */
export const getMockNotifications = (now = Date.now()): INotificationItem[] => [
  {
    id: 'n-budget-capped',
    category: 'campaign',
    tone: 'warning',
    title: 'Daily budget reached on 3 campaigns',
    preview: 'Brand Defense, Summer Sale and 1 more stopped spending at 2:14 pm.',
    details:
      'Spend is paused for the rest of the day on these campaigns. Budgets reset at midnight in your account timezone.',
    facts: [
      { label: 'Campaigns', value: '3' },
      { label: 'Budget used', value: '$450 of $450' },
    ],
    cta: { label: 'Review budgets', path: '/advertising/campaign-manager' },
    createdAt: now - 2 * MIN,
    read: false,
  },
  {
    id: 'n-rule-ran',
    category: 'rule',
    tone: 'success',
    title: 'Low ACOS Bid Optimization ran',
    preview: 'Lowered 41 bids across 24 campaigns.',
    details:
      'The rule checked 24 campaigns against your ACOS target and lowered bids where the last 14 days ran above it.',
    facts: [
      { label: 'Campaigns checked', value: '24' },
      { label: 'Bids lowered', value: '41' },
      { label: 'Next run', value: 'Tomorrow, 6:00 am' },
    ],
    cta: { label: 'View rule', path: '/rules' },
    createdAt: now - 14 * MIN,
    read: false,
  },
  {
    id: 'n-sync-failed',
    category: 'account',
    tone: 'warning',
    title: 'Boldfit US lost its Amazon connection',
    preview: 'Reconnect to keep your data up to date.',
    details:
      'We could not refresh data for Boldfit US since 9:02 am. Your campaigns keep running on Amazon, but numbers here may be out of date until you reconnect.',
    cta: { label: 'Reconnect', path: '/settings/integrations' },
    createdAt: now - 47 * MIN,
    read: false,
  },
  {
    id: 'n-report-ready',
    category: 'report',
    tone: 'info',
    title: 'Your weekly performance report is ready',
    preview: 'Sales are up 12.4% and ACOS is down 1.8 points.',
    details: 'Compared with the previous 7 days across all connected accounts.',
    facts: [
      { label: 'Sales', value: '$128,430' },
      { label: 'ACOS', value: '22.4%' },
      { label: 'Orders', value: '3,914' },
    ],
    cta: { label: 'Open report', path: '/reports' },
    createdAt: now - 2 * HOUR - 8 * MIN,
    read: true,
  },
  {
    id: 'n-campaigns-created',
    category: 'campaign',
    tone: 'success',
    title: '6 campaigns created. Whey Protein launch is live in Group 1 and Group 2.',
    preview: 'Whey Protein launch is live in Group 1 and Group 2.',
    cta: { label: 'View campaigns', path: '/advertising/campaign-manager' },
    createdAt: now - 5 * HOUR,
    read: false,
  },
  {
    id: 'n-bulk-edit',
    category: 'campaign',
    tone: 'warning',
    title: 'Bulk edit finished with 2 errors',
    preview: 'Updated bids on 128 keywords. 2 could not be changed.',
    details:
      'The 2 keywords belong to archived ad groups, so Amazon rejected the new bids. Everything else was saved.',
    facts: [
      { label: 'Updated', value: '128' },
      { label: 'Failed', value: '2' },
    ],
    cta: { label: 'See in logs', path: '/settings/logs' },
    createdAt: now - DAY + 3 * HOUR,
    read: true,
  },
  {
    id: 'n-invite-accepted',
    category: 'account',
    tone: 'info',
    title: 'Priya Nair accepted your invite and now has Manager access to Boldfit US.',
    preview: 'She now has Manager access to Boldfit US.',
    createdAt: now - DAY - 2 * HOUR,
    read: true,
  },
  {
    id: 'n-plan-usage',
    category: 'account',
    tone: 'warning',
    title: 'You have used 80% of your plan',
    preview: '1,642 of 2,000 campaign actions this month.',
    details:
      'At this pace you will reach the limit in about 6 days. Actions pause at the limit until the next billing date or a plan upgrade.',
    cta: { label: 'Manage plan', path: '/settings/billing' },
    createdAt: now - DAY - 9 * HOUR,
    read: true,
  },
  {
    id: 'n-rule-paused',
    category: 'rule',
    tone: 'warning',
    title: 'Inventory Protection paused 6 campaigns',
    preview: 'Stock fell below 14 days of cover on 4 products.',
    details:
      'Campaigns restart on their own once stock is back above the threshold you set in the rule.',
    facts: [
      { label: 'Products', value: '4' },
      { label: 'Campaigns paused', value: '6' },
    ],
    cta: { label: 'View rule', path: '/rules' },
    createdAt: now - 2 * DAY - 4 * HOUR,
    read: true,
  },
  {
    id: 'n-groups-new',
    category: 'campaign',
    tone: 'info',
    title: 'Product groups are in Campaign Creator. Split products and set up each group on its own.',
    preview: 'Split products into groups and set up each group on its own.',
    cta: { label: 'Try it', path: '/advertising/campaign-creator-dropdown' },
    createdAt: now - 3 * DAY,
    read: true,
  },
  {
    id: 'n-export-ready',
    category: 'report',
    tone: 'success',
    title: 'Your campaign export is ready: last 30 days, 214 campaigns.',
    preview: 'Last 30 days, 214 campaigns.',
    cta: { label: 'Open reports', path: '/reports' },
    createdAt: now - 4 * DAY - 6 * HOUR,
    read: true,
  },
  {
    id: 'n-schedule-updated',
    category: 'report',
    tone: 'info',
    title: 'Report schedule updated. Your weekly report now arrives on Mondays at 8:00 am.',
    preview: 'Your weekly report now arrives on Mondays at 8:00 am.',
    createdAt: now - 6 * DAY,
    read: true,
  },
];

type SimulatedTemplate = Omit<INotificationItem, 'id' | 'createdAt' | 'read'>;

/** Notifications that arrive one at a time while the demo switch is on. */
export const SIMULATED_NOTIFICATIONS: SimulatedTemplate[] = [
  {
    category: 'campaign',
    tone: 'info',
    title: 'Summer Sale is pacing ahead of budget',
    preview: '78% of today’s budget is spent by noon.',
    details:
      'At the current pace this campaign will hit its daily budget before 3 pm. You can raise the budget or let it pause for the day.',
    facts: [
      { label: 'Spent so far', value: '$78.40' },
      { label: 'Daily budget', value: '$100' },
    ],
    cta: { label: 'Open campaign', path: '/advertising/campaign-manager' },
  },
  {
    category: 'rule',
    tone: 'success',
    title: 'Placement Optimization raised top of search bids on 9 campaigns.',
    preview: 'Raised top of search bids on 9 campaigns.',
    cta: { label: 'View rule', path: '/rules' },
  },
  {
    category: 'account',
    tone: 'info',
    title: 'Arjun Mehta joined Boldfit US as an Analyst.',
    preview: 'Arjun Mehta accepted an invite as Analyst.',
  },
  {
    category: 'report',
    tone: 'success',
    title: 'Search term report is ready',
    preview: '312 new search terms found in the last 7 days.',
    details: '41 of them already convert above your target ACOS and are worth adding as exact keywords.',
    cta: { label: 'Open report', path: '/reports' },
  },
];
