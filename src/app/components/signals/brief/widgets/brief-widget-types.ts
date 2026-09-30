export type WidgetKind =
  | 'legacyKpiRow'
  | 'legacyActivity'
  | 'kpi'
  | 'metricRow'
  | 'barChartVertical'
  | 'barChartHorizontal'
  | 'comparisonChart'
  | 'pieChart'
  | 'dataTable'
  | 'comparisonTable'
  | 'lineChart'
  | 'hourlyChart'
  | 'summaryCard'
  | 'dailyRecap'
  | 'watchlist'
  | 'revenueTrend'
  | 'efficiency'
  | 'spendSales'
  | 'actionMix'
  | 'dayparting'
  | 'keywordFunnel'
  | 'activity'
  | 'alerts'
  | 'notifications'
  | 'actionsInProgress'
  | 'channels'
  | 'recommendations'
  | 'topMovers'
  | 'note'
  | 'checklist'
  | 'custom';

export type WidgetTone = 'default' | 'positive' | 'warning' | 'focus';

export interface WidgetInstance {
  id: string;
  kind: WidgetKind;
  title: string;
  tone?: WidgetTone;
  config: Record<string, unknown>;
}

export interface WidgetLayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

export interface WidgetCatalogEntry {
  kind: WidgetKind;
  title: string;
  category: string;
  summary: string;
}

/** Every widget shape available from "Add widget" — grouped so the picker can show one section per category. Covers the whole platform, not just Signals: rules, agents, people, keyword discovery and dayparting all have a home here. */
export const WIDGET_CATALOG: WidgetCatalogEntry[] = [
  { kind: 'legacyKpiRow', title: 'Key stats', category: 'Overview', summary: 'A row of predefined stats — add or remove any from the library, click one for its category breakdown.' },
  { kind: 'legacyActivity', title: 'While you were away', category: 'Overview', summary: "Jiva's autonomous activity feed, original Brief style." },
  { kind: 'kpi', title: 'Metric card', category: 'Metrics', summary: 'A single reassignable number with trend — spend, sales, ROAS, CVR and more.' },
  { kind: 'metricRow', title: 'Metric row', category: 'Metrics', summary: 'Two or more metric cards sharing one background — drag KPI cards together to build this too.' },
  { kind: 'barChartVertical', title: 'Vertical bar graph', category: 'Build your own', summary: 'Empty until you add up to 5 metrics — column chart, pick each bar and its color.' },
  { kind: 'barChartHorizontal', title: 'Horizontal bar graph', category: 'Build your own', summary: 'Empty until you add up to 5 metrics — same idea, bars run sideways.' },
  { kind: 'comparisonChart', title: 'Comparison chart', category: 'Build your own', summary: 'Up to 5 metrics, each shown against its own previous-period value.' },
  { kind: 'lineChart', title: 'Line graph', category: 'Build your own', summary: 'Up to 5 lines across the last 7 days — revenue, spend, ROAS, ACOS, ad sales.' },
  { kind: 'hourlyChart', title: 'Hourly chart', category: 'Build your own', summary: 'Up to 5 lines across the day — revenue, spend, ROAS by hour.' },
  { kind: 'pieChart', title: 'Pie chart', category: 'Build your own', summary: 'Empty until you add up to 5 metrics — same donut Action Mix uses, pick each slice and its color.' },
  { kind: 'dataTable', title: 'Table', category: 'Build your own', summary: 'Empty until you add up to 5 metrics — a plain rows-and-columns table.' },
  { kind: 'comparisonTable', title: 'Comparison table', category: 'Build your own', summary: 'Up to 5 metrics, each row showing current vs previous period and the change.' },
  { kind: 'revenueTrend', title: 'Revenue trend', category: 'Charts', summary: 'Revenue and ad sales across the last 7 days.' },
  { kind: 'efficiency', title: 'ROAS & ACOS', category: 'Charts', summary: 'Efficiency movement over the last 7 days.' },
  { kind: 'spendSales', title: 'Spend vs ad sales', category: 'Charts', summary: 'Compare investment with attributed sales.' },
  { kind: 'actionMix', title: 'Action mix', category: 'Charts', summary: 'Rules, agents, users, harvest and dayparting activity.' },
  { kind: 'dayparting', title: 'Hourly performance', category: 'Charts', summary: 'Dayparting and intraday revenue vs spend.' },
  { kind: 'keywordFunnel', title: 'Keyword funnel', category: 'Charts', summary: 'Search-term discovery through promotion.' },
  { kind: 'activity', title: 'Platform activity', category: 'Operations', summary: 'Rules, MCP Agents, users, keyword harvesting and dayparting changes.' },
  { kind: 'alerts', title: 'Priority alerts', category: 'Operations', summary: 'Issues that need attention this morning.' },
  { kind: 'notifications', title: 'Notifications', category: 'Operations', summary: 'The most recent alerts across every account, newest first.' },
  { kind: 'actionsInProgress', title: 'Actions in progress', category: 'Operations', summary: 'Work-station tasks currently being worked, with who owns each one.' },
  { kind: 'channels', title: 'Marketplace health', category: 'Commerce', summary: 'Channel revenue, efficiency and budget.' },
  { kind: 'topMovers', title: 'Top movers', category: 'Commerce', summary: 'Campaigns and SKUs moving the morning number.' },
  { kind: 'recommendations', title: 'Recommended actions', category: 'Written insight', summary: 'A prioritized operator action plan.' },
  { kind: 'summaryCard', title: 'Summary', category: 'Written insight', summary: "A short written morning briefing — one paragraph, not a list." },
  { kind: 'dailyRecap', title: 'Daily recap', category: 'Written insight', summary: "What happened today, told as a few plain sentences instead of a chip-heavy feed." },
  { kind: 'watchlist', title: 'Watchlist', category: 'Written insight', summary: 'A short list of things to keep an eye on, each with a one-line reason why.' },
  { kind: 'note', title: 'Note', category: 'Personal', summary: 'A sticky note for your own thinking.' },
  { kind: 'checklist', title: 'Checklist', category: 'Personal', summary: 'Starts empty — add, complete, or delete your own to-dos.' },
];

export const WIDGET_CATEGORY_ORDER = ['Overview', 'Metrics', 'Build your own', 'Charts', 'Operations', 'Commerce', 'Written insight', 'Personal'];

/** The product-defined widgets available from "Add item" — nothing here is Jiva-editable, and the
 * only per-widget customization is Key stats' own add/remove-a-stat controls. */
const FIXED_WIDGET_KINDS: WidgetKind[] = ['legacyKpiRow', 'legacyActivity', 'notifications', 'actionsInProgress', 'checklist'];
export const FIXED_WIDGET_CATALOG: WidgetCatalogEntry[] = WIDGET_CATALOG.filter((w) => FIXED_WIDGET_KINDS.includes(w.kind));

/** The one and only user-defined widget kind — starts blank, and is entirely configured by telling
 * Jiva what to show; see brief-widget-ai-sheet.tsx's handling of `config.vizKind`. */
export const CUSTOM_WIDGET_CATALOG: WidgetCatalogEntry[] = [
  { kind: 'custom', title: 'Custom widget', category: 'Custom', summary: 'Starts blank — tell Jiva what you want to see and it picks the data points and the visualization. No preset chart types or metrics.' },
];

/** Every other kind this system has ever supported — every chart family, KPI card and written-insight
 * card — no longer individually addable from "Add item"; it lives pre-populated with mock data on the
 * Component Library tab instead, as a visual reference, not a live editable widget. */
export const COMPONENT_LIBRARY_CATALOG: WidgetCatalogEntry[] = WIDGET_CATALOG.filter((w) => !FIXED_WIDGET_KINDS.includes(w.kind));

export const TONE_TINT: Record<WidgetTone, { border: string; bg: string }> = {
  default: { border: '#e6e8ec', bg: '#fff' },
  positive: { border: 'rgba(63,125,106,.35)', bg: 'rgba(63,125,106,.05)' },
  warning: { border: 'rgba(179,69,63,.35)', bg: 'rgba(179,69,63,.05)' },
  focus: { border: 'rgba(119,70,155,.35)', bg: 'rgba(119,70,155,.05)' },
};
