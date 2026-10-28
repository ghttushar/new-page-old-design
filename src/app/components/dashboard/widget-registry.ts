import { BinocularsIcon, BroadcastIcon, CoinsIcon, LightningIcon, MegaphoneSimpleIcon, PackageIcon, ShieldCheckIcon, StarIcon, TagIcon, WarehouseIcon } from '@phosphor-icons/react';
import type { CategoryMeta, WidgetCategory, WidgetDefinition, WidgetKind } from './dashboard.types';
import { CAMPAIGN_MANAGER_WIDGETS } from './widgets/campaign-manager';
import { ADS_WIDGETS, AUTOMATION_WIDGETS, CATALOG_WIDGETS, HEALTH_WIDGETS, INVENTORY_WIDGETS, MARKET_WIDGETS, PRICING_WIDGETS, PROFIT_WIDGETS, REVIEWS_WIDGETS, WORK_WIDGETS } from './widgets/insights';
import { RULES_WIDGETS } from './widgets/rules';
import { SIGNALS_WIDGETS } from './widgets/signals';

// Every widget the dashboard can hold, grouped by the area of Anarix it comes from.
// To add an area: give it a CategoryMeta entry and a folder under widgets/ that exports its definitions.

export const CATEGORIES: CategoryMeta[] = [
  { id: 'Signals', label: 'Signals', icon: BroadcastIcon, description: 'Alerts, the money they carry, the messages that come with them, and your own tasks and meetings.' },
  { id: 'Rules', label: 'Rules', icon: LightningIcon, description: 'What your automation rules change, measured against a baseline or against each other, and the rules that need a look.' },
  { id: 'Campaign Manager', label: 'Campaign Manager', icon: MegaphoneSimpleIcon, description: 'Your campaigns and keywords ranked on a metric, budgets, placements and hours, the keywords to review or add, and the items worth advertising.' },
  { id: 'Catalog', label: 'Catalog', icon: PackageIcon, description: 'Listings that can’t sell, weak content, unexpected edits, rank movers and other sellers on your listings.' },
  { id: 'Inventory', label: 'Inventory', icon: WarehouseIcon, description: 'Who runs out first, stock that can’t sell, aged units, inbound shipments and what to send next.' },
  { id: 'Pricing', label: 'Pricing', icon: TagIcon, description: 'Buy Box win rate, who takes it, prices above the market, recent price moves and promotions.' },
  { id: 'Profitability', label: 'Profitability', icon: CoinsIcon, description: 'Net profit after every cost, items that lose money, TACoS, fees, refunds and the monthly target.' },
  { id: 'Market intelligence', label: 'Market intelligence', icon: BinocularsIcon, description: 'Share of voice, keyword rank, the search funnel, competitor moves and what shoppers buy together.' },
  { id: 'Reviews', label: 'Reviews', icon: StarIcon, description: 'Ratings that slip, new negative reviews, complaint themes, return reasons and review growth.' },
  { id: 'Account health', label: 'Account health', icon: ShieldCheckIcon, description: 'Performance metrics against policy targets, open violations, and cases waiting on a reply.' },
];

const ALL: WidgetDefinition[] = [
  ...SIGNALS_WIDGETS, ...WORK_WIDGETS,
  ...RULES_WIDGETS, ...AUTOMATION_WIDGETS,
  ...CAMPAIGN_MANAGER_WIDGETS, ...ADS_WIDGETS,
  ...CATALOG_WIDGETS, ...INVENTORY_WIDGETS, ...PRICING_WIDGETS, ...PROFIT_WIDGETS,
  ...MARKET_WIDGETS, ...REVIEWS_WIDGETS, ...HEALTH_WIDGETS,
];

export const WIDGETS = Object.fromEntries(ALL.map((d) => [d.kind, d])) as Record<WidgetKind, WidgetDefinition>;

export const WIDGET_ORDER: WidgetKind[] = ALL.map((d) => d.kind);

export const widgetsIn = (category: WidgetCategory): WidgetDefinition[] => ALL.filter((d) => d.category === category);
