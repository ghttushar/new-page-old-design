import type { Icon } from '@phosphor-icons/react';
import type { ComponentType } from 'react';
import type { Layouts } from 'react-grid-layout';

export type WidgetKind = 'value-at-risk' | 'opportunity-value' | 'important-messages' | 'while-away' | 'rule-impact' | 'rule-compare' | 'top-performers' | 'item-health' | 'poor-keywords' | 'new-opportunities' | 'new-keywords' | InsightKind;

/** The nuggets built on the shared insight view (widgets/insights): one list of figures and rows per job. */
export type InsightKind =
  | 'cat-suppressed' | 'cat-quality' | 'cat-content-gaps' | 'cat-changes' | 'cat-variations' | 'cat-bsr' | 'cat-new-listings' | 'cat-hijackers'
  | 'inv-cover' | 'inv-oos' | 'inv-aged' | 'inv-inbound' | 'inv-stranded' | 'inv-storage' | 'inv-reorder'
  | 'price-buybox' | 'price-buybox-lost' | 'price-competitive' | 'price-changes' | 'price-deals'
  | 'profit-net' | 'profit-least' | 'profit-tacos' | 'profit-fees' | 'profit-refunds' | 'profit-target'
  | 'ads-budget-pacing' | 'ads-wasted' | 'ads-placement' | 'ads-mix' | 'ads-bid-impact' | 'ads-ntb' | 'ads-daypart'
  | 'mi-sov' | 'mi-rank' | 'mi-sqp' | 'mi-competitors' | 'mi-basket' | 'mi-repeat'
  | 'rev-rating' | 'rev-negative' | 'rev-themes' | 'rev-returns' | 'rev-velocity'
  | 'health-account' | 'health-violations' | 'health-cases'
  | 'rules-activity' | 'rules-attention'
  | 'work-tasks' | 'work-meetings' | 'work-alert-categories';

/** The library drawing a nugget without its own art uses, by the shape of what it shows. */
export type ArtShape = 'list' | 'stats' | 'gauge' | 'split' | 'heat' | 'feed';

/**
 * The area of Anarix a widget's data comes from. Each area gets its own entry in the widget library, so adding
 * widgets from another area (Advertising, Profitability, Catalog...) is one new category plus its widget definitions.
 */
export type WidgetCategory =
  | 'Signals' | 'Rules' | 'Campaign Manager' | 'Catalog' | 'Inventory' | 'Pricing' | 'Profitability'
  | 'Market intelligence' | 'Reviews' | 'Account health';

export interface CategoryMeta {
  id: WidgetCategory;
  label: string;
  /** The glyph beside the area's name in the library. */
  icon: Icon;
  description: string;
}

export type WidgetConfig = Record<string, unknown>;

export interface WidgetInstance {
  id: string;
  kind: WidgetKind;
  config: WidgetConfig;
}

export interface Option<V extends string = string> {
  value: V;
  label: string;
}

/** One setting in a widget's Customize panel. Each widget declares its own. */
export type CustomizeField =
  | { key: string; label: string; type: 'segmented'; options: Option[] }
  | { key: string; label: string; type: 'select'; options: Option[] }
  | { key: string; label: string; type: 'multi'; options: Option[]; emptyLabel: string }
  | { key: string; label: string; type: 'toggle'; hint?: string };

export interface WidgetBodyProps {
  config: WidgetConfig;
  onConfig: (patch: WidgetConfig) => void;
  /** A read-only render for the widget library. */
  preview?: boolean;
}

export interface WidgetDefinition {
  kind: WidgetKind;
  title: string;
  category: WidgetCategory;
  summary: string;
  /** What the widget is built from, shown in the widget library. */
  dataPoints: string[];
  size: { w: number; h: number; minW: number; minH: number; maxH?: number };
  defaults: WidgetConfig;
  /** The one setting shown in the widget's header (a metric, a period, a channel). */
  header?: { key: string; label: string; options: Option[] };
  fields: CustomizeField[];
  /** The line under the title: what the widget is showing right now, worked out from its settings. */
  describe: (config: WidgetConfig) => string;
  /** Where the full picture lives. */
  link?: { label: string; to: string };
  /** A small glyph for the nugget's header tile. */
  icon: Icon;
  Body: ComponentType<WidgetBodyProps>;
  /** Shows a "New" tag on the nugget's library card. */
  isNew?: boolean;
  /** For the library card's tooltip: what the nugget shows, and how it is worked out. */
  description?: string;
  logic?: string;
  /** Which marketplaces have the data, e.g. "Amazon and Walmart". */
  availability?: string;
  /** The library drawing, for nuggets without one of their own. */
  art?: ArtShape;
}

export interface DashboardTemplate {
  id: string;
  name: string;
  createdAt: number;
  widgets: WidgetInstance[];
  layouts: Layouts;
}

export interface DashboardState {
  /** The name shown in the dashboard switcher: the template it came from, or "My dashboard". */
  name: string;
  widgets: WidgetInstance[];
  layouts: Layouts;
  templates: DashboardTemplate[];
}
