import { ClockCounterClockwiseIcon, EnvelopeSimpleIcon, TrendUpIcon, WarningDiamondIcon } from '@phosphor-icons/react';
import type { CustomizeField, Option, WidgetConfig, WidgetDefinition } from '../../dashboard.types';
import { ALERT_CATEGORIES, VALUE_CATEGORIES } from './data';
import ImportantMessages, { isRead, messagesFor } from './important-messages';
import makeValueKpi, { readFilter } from './value-kpi';
import WhileYouWereAway, { arrivalsFor } from './while-you-were-away';

// Widgets built from Signals: alerts, the money they carry, and the messages that come with them.

const PERIODS: Option[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'both', label: 'Last 2 days' },
];

const MARKETS: Option[] = [
  { value: 'all', label: 'All' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'walmart', label: 'Walmart' },
];

const asOptions = (list: string[]): Option[] => list.map((c) => ({ value: c, label: c }));

/** "All categories", "Catalog", "Catalog and Inventory", "3 categories". */
function categoriesText(list: string[]): string {
  if (list.length === 0) return 'all categories';
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.length} categories`;
}

const marketText = (m: string) => (m === 'amazon' ? 'Amazon' : m === 'walmart' ? 'Walmart' : 'All marketplaces');

const VALUE_FIELDS: CustomizeField[] = [
  { key: 'market', label: 'Marketplace', type: 'segmented', options: MARKETS },
  { key: 'categories', label: 'Categories', type: 'multi', options: asOptions(VALUE_CATEGORIES), emptyLabel: 'All categories' },
  { key: 'breakdown', label: 'Show the split by category', type: 'toggle' },
];

const VALUE_DEFAULTS: WidgetConfig = { period: 'today', market: 'all', categories: [], breakdown: true };

const describeValue = (config: WidgetConfig) => {
  const f = readFilter(config);
  return `${marketText(f.market)}, ${categoriesText(f.categories)}`;
};

export const SIGNALS_WIDGETS: WidgetDefinition[] = [
  {
    kind: 'value-at-risk',
    title: 'Value at risk',
    category: 'Signals',
    summary: 'Money at stake across open alerts, split by category.',
    dataPoints: ['Alerts', 'Value', 'Category', 'Marketplace'],
    size: { w: 4, h: 7, minW: 3, minH: 3 },
    defaults: VALUE_DEFAULTS,
    header: { key: 'period', label: 'Period', options: PERIODS },
    fields: VALUE_FIELDS,
    describe: describeValue,
    link: { label: 'Open Signals', to: '/signals' },
    icon: WarningDiamondIcon,
    Body: makeValueKpi('risk'),
  },
  {
    kind: 'opportunity-value',
    title: 'Opportunity value',
    category: 'Signals',
    summary: 'Revenue you can still capture from open opportunities.',
    dataPoints: ['Alerts', 'Value', 'Category', 'Marketplace'],
    size: { w: 4, h: 7, minW: 3, minH: 3 },
    defaults: VALUE_DEFAULTS,
    header: { key: 'period', label: 'Period', options: PERIODS },
    fields: VALUE_FIELDS,
    describe: describeValue,
    link: { label: 'Open Signals', to: '/signals' },
    icon: TrendUpIcon,
    Body: makeValueKpi('opportunity'),
  },
  {
    kind: 'important-messages',
    title: 'Important messages',
    category: 'Signals',
    summary: 'Email, Slack and Workspace messages. Open any one to read it in full.',
    dataPoints: ['Messages', 'Channel', 'Sender', 'Read status'],
    size: { w: 4, h: 10, minW: 3, minH: 5 },
    defaults: { channel: 'all', unreadOnly: false, rows: '5', readIds: [], unreadIds: [] },
    header: {
      key: 'channel',
      label: 'Channel',
      options: [
        { value: 'all', label: 'All channels' },
        { value: 'email', label: 'Email' },
        { value: 'slack', label: 'Slack' },
        { value: 'workspace', label: 'Workspace' },
      ],
    },
    fields: [
      { key: 'unreadOnly', label: 'Only unread messages', type: 'toggle' },
      { key: 'rows', label: 'Messages shown', type: 'segmented', options: [{ value: '3', label: '3' }, { value: '5', label: '5' }, { value: 'all', label: 'All' }] },
    ],
    describe: (config) => {
      const all = messagesFor({ ...config, unreadOnly: false });
      const unread = all.filter((m) => !isRead(m, config)).length;
      return unread > 0 ? `${unread} unread of ${all.length}` : `${all.length} messages, all read`;
    },
    link: { label: 'Open Signals', to: '/signals' },
    icon: EnvelopeSimpleIcon,
    Body: ImportantMessages,
  },
  {
    kind: 'while-away',
    title: 'While you were away',
    category: 'Signals',
    summary: 'Every alert that came in since your last visit, newest first.',
    dataPoints: ['Alerts', 'Time', 'Priority', 'Category', 'Value'],
    size: { w: 8, h: 10, minW: 4, minH: 5 },
    defaults: { priority: 'all', categories: [], showValue: true, groupBy: 'time' },
    header: {
      key: 'priority',
      label: 'Priority',
      options: [
        { value: 'all', label: 'All priorities' },
        { value: 'medium-up', label: 'Medium and high' },
        { value: 'high', label: 'High only' },
      ],
    },
    fields: [
      { key: 'groupBy', label: 'Group by', type: 'segmented', options: [{ value: 'time', label: 'Hour' }, { value: 'category', label: 'Category' }] },
      { key: 'categories', label: 'Categories', type: 'multi', options: asOptions(ALERT_CATEGORIES.slice(0, 8)), emptyLabel: 'All categories' },
      { key: 'showValue', label: 'Show the value of each alert', type: 'toggle' },
    ],
    describe: (config) => {
      const list = arrivalsFor(config);
      const high = list.filter((a) => a.priority === 'High').length;
      if (list.length === 0) return 'Nothing new since your last visit';
      return `${list.length} new since your last visit${high && config.priority !== 'high' ? `, ${high} high priority` : ''}`;
    },
    link: { label: 'Open Signals', to: '/signals' },
    icon: ClockCounterClockwiseIcon,
    Body: WhileYouWereAway,
  },
];
