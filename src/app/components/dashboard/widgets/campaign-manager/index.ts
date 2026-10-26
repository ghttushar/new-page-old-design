import { ArrowsSplitIcon, HeartbeatIcon, RankingIcon, StorefrontIcon, TrendDownIcon } from '@phosphor-icons/react';
import type { WidgetDefinition } from '../../dashboard.types';
import ItemHealth, { describeHealth } from './item-health';
import NewKeywords, { describeNewKeywords } from './new-keywords';
import Opportunities, { describeOpportunities } from './opportunities';
import PoorKeywords, { describePoor } from './poor-keywords';
import TopPerformers, { describeTop } from './top-performers';

// Nuggets built from Campaign Manager: the account's campaigns and keywords ranked on the metric you pick, the keywords
// worth reviewing or adding, the items worth advertising, and the health of the items they advertise.

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
    kind: 'poor-keywords',
    title: 'Review poor performing keywords',
    category: 'Campaign Manager',
    summary: 'Your weakest keywords, by lowest ROAS or highest Ad Spend, each with both figures.',
    dataPoints: ['Keywords', 'ID', 'ROAS', 'Ad Spend', 'Top 5, 10, 15 or all'],
    size: { w: 8, h: 10, minW: 4, minH: 7 },
    defaults: { metric: 'roas', top: '5', viz: 'table', range: '30' },
    fields: [],
    describe: describePoor,
    link: { label: 'Open Campaign Manager', to: '/advertising/campaign-manager' },
    icon: TrendDownIcon,
    Body: PoorKeywords,
  },
  {
    kind: 'new-keywords',
    title: 'Add new keywords',
    category: 'Campaign Manager',
    summary: 'Keywords Targeting Actions suggests adding, Auto to Manual and Manual to Manual.',
    dataPoints: ['Campaigns', 'Keywords', 'Unique keywords', 'Avg ROAS'],
    size: { w: 6, h: 7, minW: 4, minH: 6 },
    defaults: {},
    fields: [],
    describe: describeNewKeywords,
    link: { label: 'Open Targeting Actions', to: '/advertising/targeting-actions' },
    icon: ArrowsSplitIcon,
    Body: NewKeywords,
  },
  {
    kind: 'new-opportunities',
    title: 'New opportunities',
    category: 'Campaign Manager',
    summary: 'High quality items you aren’t advertising yet, with their last 30 days of sales.',
    dataPoints: ['Items', 'Avg units per item', 'Avg GMV per item', 'Last 30 days'],
    size: { w: 6, h: 9, minW: 4, minH: 6 },
    defaults: {},
    fields: [],
    describe: describeOpportunities,
    link: { label: 'Open Campaign Creator', to: '/advertising/campaign-creator' },
    icon: StorefrontIcon,
    Body: Opportunities,
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
