import type { Icon } from '@phosphor-icons/react';
import type { ComponentType } from 'react';
import type { Layouts } from 'react-grid-layout';

export type WidgetKind = 'value-at-risk' | 'opportunity-value' | 'important-messages' | 'while-away' | 'rule-impact' | 'rule-compare' | 'top-performers' | 'item-health' | 'poor-keywords' | 'new-opportunities' | 'new-keywords';

/**
 * The area of Anarix a widget's data comes from. Each area gets its own entry in the widget library, so adding
 * widgets from another area (Advertising, Profitability, Catalog...) is one new category plus its widget definitions.
 */
export type WidgetCategory = 'Signals' | 'Rules' | 'Campaign Manager';

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
