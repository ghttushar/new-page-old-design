import { BroadcastIcon, LightningIcon, MegaphoneSimpleIcon } from '@phosphor-icons/react';
import type { CategoryMeta, WidgetCategory, WidgetDefinition, WidgetKind } from './dashboard.types';
import { CAMPAIGN_MANAGER_WIDGETS } from './widgets/campaign-manager';
import { RULES_WIDGETS } from './widgets/rules';
import { SIGNALS_WIDGETS } from './widgets/signals';

// Every widget the dashboard can hold, grouped by the area of Anarix it comes from.
// To add an area: give it a CategoryMeta entry and a folder under widgets/ that exports its definitions.

export const CATEGORIES: CategoryMeta[] = [
  { id: 'Signals', label: 'Signals', icon: BroadcastIcon, description: 'Alerts, the money they carry, and the messages that come with them.' },
  { id: 'Rules', label: 'Rules', icon: LightningIcon, description: 'What your automation rules change, measured against a baseline or against each other.' },
  { id: 'Campaign Manager', label: 'Campaign Manager', icon: MegaphoneSimpleIcon, description: 'Your campaigns and keywords ranked on a metric, and the health of the items they advertise.' },
];

const ALL: WidgetDefinition[] = [...SIGNALS_WIDGETS, ...RULES_WIDGETS, ...CAMPAIGN_MANAGER_WIDGETS];

export const WIDGETS = Object.fromEntries(ALL.map((d) => [d.kind, d])) as Record<WidgetKind, WidgetDefinition>;

export const WIDGET_ORDER: WidgetKind[] = ALL.map((d) => d.kind);

export const widgetsIn = (category: WidgetCategory): WidgetDefinition[] => ALL.filter((d) => d.category === category);
