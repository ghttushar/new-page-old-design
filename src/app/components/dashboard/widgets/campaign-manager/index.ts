import { HeartbeatIcon, RankingIcon } from '@phosphor-icons/react';
import type { WidgetDefinition } from '../../dashboard.types';
import ItemHealth, { describeHealth } from './item-health';
import TopPerformers, { describeTop } from './top-performers';

// Nuggets built from Campaign Manager: the account's campaigns and keywords ranked on the metric you pick, and the
// health of the items they advertise.

export const CAMPAIGN_MANAGER_WIDGETS: WidgetDefinition[] = [
  {
    kind: 'top-performers',
    title: 'Top performers',
    category: 'Campaign Manager',
    summary: 'Your top campaigns or keywords on one metric, as a table or as bars.',
    dataPoints: ['Campaigns', 'Keywords', 'ID', '10 ad metrics', 'Top 5, 10, 15 or all'],
    size: { w: 8, h: 10, minW: 4, minH: 7 },
    defaults: { entity: 'campaign', metric: 'sales', top: '5', viz: 'table', range: '30' },
    fields: [],
    describe: describeTop,
    link: { label: 'Open Campaign Manager', to: '/advertising/campaign-manager' },
    icon: RankingIcon,
    Body: TopPerformers,
  },
  {
    kind: 'item-health',
    title: 'Item health',
    category: 'Campaign Manager',
    summary: 'One health bar for all your items, or for the ones you pick, each opening to its details.',
    dataPoints: ['Listing quality', 'In stock', 'Availability', 'Buy Box win rate', 'Signals alerts'],
    size: { w: 4, h: 10, minW: 3, minH: 7 },
    defaults: { picked: [] },
    fields: [],
    describe: describeHealth,
    link: { label: 'Open Signals', to: '/signals' },
    icon: HeartbeatIcon,
    Body: ItemHealth,
  },
];
