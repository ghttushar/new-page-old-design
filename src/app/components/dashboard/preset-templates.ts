import { ChartLineUpIcon, CrownIcon, HandshakeIcon, LightningIcon, PackageIcon, TargetIcon, type Icon } from '@phosphor-icons/react';
import type { Layout, Layouts } from 'react-grid-layout';
import type { DashboardTemplate, WidgetConfig, WidgetKind } from './dashboard.types';
import { COLS, findSlot } from './use-dashboard';
import { WIDGETS } from './widget-registry';
import { HEALTH_ITEMS, healthOf } from './widgets/campaign-manager/item-health-data';

// Ready-made dashboards for the teams of an e-commerce account management agency, built from the existing nuggets.
// Each is laid out by hand on the 12-column grid so the nuggets tile with no gaps; narrower screens re-flow from it.

export interface PresetTemplate extends DashboardTemplate {
  /** Who it is for, e.g. "For PPC managers". */
  team: string;
  description: string;
  icon: Icon;
}

interface Placed { kind: WidgetKind; x: number; y: number; w: number; h: number; config?: WidgetConfig }

/** Builds a template from its wide layout; the 6-column layout re-flows it in reading order, the phone one stacks it. */
function preset(id: string, name: string, team: string, description: string, icon: Icon, placed: Placed[]): PresetTemplate {
  const ids = placed.map((_, i) => `preset-${id}-${i + 1}`);
  const widgets = placed.map((p, i) => ({ id: ids[i], kind: p.kind, config: { ...WIDGETS[p.kind].defaults, ...p.config } }));
  const limits = (kind: WidgetKind) => ({ minH: WIDGETS[kind].size.minH, maxH: WIDGETS[kind].size.maxH });

  const lg: Layout[] = placed.map((p, i) => ({ i: ids[i], x: p.x, y: p.y, w: p.w, h: p.h, minW: WIDGETS[p.kind].size.minW, ...limits(p.kind) }));

  const order = placed.map((p, i) => ({ p, i })).sort((a, b) => a.p.y - b.p.y || a.p.x - b.p.x);
  const md: Layout[] = [];
  order.forEach(({ p, i }) => {
    const w = Math.min(COLS.md, Math.max(3, Math.round(p.w / 2)));
    const { x, y } = findSlot(md, w, p.h, COLS.md);
    md.push({ i: ids[i], x, y, w, h: p.h, minW: Math.min(w, Math.max(2, Math.round(WIDGETS[p.kind].size.minW / 2))), ...limits(p.kind) });
  });
  let top = 0;
  const sm: Layout[] = order.map(({ p, i }) => {
    const item = { i: ids[i], x: 0, y: top, w: 1, h: p.h, minW: 1, ...limits(p.kind) };
    top += p.h;
    return item;
  });

  const layouts: Layouts = { lg, md, sm };
  return { id: `preset-${id}`, name, createdAt: 0, widgets, layouts, team, description, icon };
}

/** Item health in a template opens on the four weakest items, so its panel has something to read straight away. */
const weakest = { picked: [...HEALTH_ITEMS].sort((a, b) => healthOf(a) - healthOf(b)).slice(0, 4).map((i) => i.id) };

/** Top performers set-ups the templates reuse: the view and metric change with the job the nugget does. */
const top = (entity: 'campaign' | 'keyword', metric: string, viz: 'bars' | 'table', count = '5') => ({ entity, metric, top: count, viz, range: '30' });

// Each layout is composed rather than stacked: a focal nugget, a band of figures or a tall side panel, and splits that
// change from row to row (3/3/6, 8/4, 5/7…), so no two templates read the same.
export const PRESET_TEMPLATES: PresetTemplate[] = [
  preset('leadership', 'Leadership overview', 'For leadership and directors',
    'The money at stake and in reach up top, the best campaigns as the centrepiece, and what needs a reply.', CrownIcon, [
      { kind: 'value-at-risk', x: 0, y: 0, w: 4, h: 6 },
      { kind: 'opportunity-value', x: 4, y: 0, w: 4, h: 6 },
      { kind: 'new-opportunities', x: 8, y: 0, w: 4, h: 6 },
      { kind: 'top-performers', x: 0, y: 6, w: 8, h: 11, config: top('campaign', 'sales', 'bars', '10') },
      { kind: 'item-health', x: 8, y: 6, w: 4, h: 11, config: weakest },
      { kind: 'important-messages', x: 0, y: 17, w: 5, h: 9 },
      { kind: 'while-away', x: 5, y: 17, w: 7, h: 9 },
    ]),
  preset('ppc', 'PPC & advertising', 'For PPC managers',
    'Best and worst keywords side by side, the keywords to add across the middle, and what rules and spend are doing.', TargetIcon, [
      { kind: 'top-performers', x: 0, y: 0, w: 7, h: 10, config: top('keyword', 'roas', 'bars', '10') },
      { kind: 'poor-keywords', x: 7, y: 0, w: 5, h: 10 },
      { kind: 'new-keywords', x: 0, y: 10, w: 12, h: 6 },
      { kind: 'rule-impact', x: 0, y: 16, w: 6, h: 10 },
      { kind: 'top-performers', x: 6, y: 16, w: 6, h: 10, config: top('campaign', 'spend', 'table') },
    ]),
  preset('automation', 'Automation & rules', 'For ad operations',
    'One rule\u2019s impact across the full width, two rules compared, and the money and messages beside them.', LightningIcon, [
      { kind: 'rule-impact', x: 0, y: 0, w: 12, h: 10 },
      { kind: 'rule-compare', x: 0, y: 10, w: 8, h: 11 },
      { kind: 'value-at-risk', x: 8, y: 10, w: 4, h: 5 },
      { kind: 'important-messages', x: 8, y: 15, w: 4, h: 6 },
    ]),
  preset('catalog', 'Catalog & marketplace ops', 'For listing and inventory teams',
    'Item health and messages down the side; items worth advertising, the money involved and overnight alerts beside them.', PackageIcon, [
      { kind: 'item-health', x: 0, y: 0, w: 4, h: 12, config: weakest },
      { kind: 'important-messages', x: 0, y: 12, w: 4, h: 12 },
      { kind: 'new-opportunities', x: 4, y: 0, w: 8, h: 9 },
      { kind: 'value-at-risk', x: 4, y: 9, w: 4, h: 6 },
      { kind: 'opportunity-value', x: 8, y: 9, w: 4, h: 6 },
      { kind: 'while-away', x: 4, y: 15, w: 8, h: 9 },
    ]),
  preset('client-success', 'Client success', 'For account managers',
    'The inbox first, then what came in overnight and the money in it, with the best campaigns and item health below.', HandshakeIcon, [
      { kind: 'important-messages', x: 0, y: 0, w: 4, h: 12 },
      { kind: 'while-away', x: 4, y: 0, w: 8, h: 7 },
      { kind: 'opportunity-value', x: 4, y: 7, w: 4, h: 5 },
      { kind: 'value-at-risk', x: 8, y: 7, w: 4, h: 5 },
      { kind: 'top-performers', x: 0, y: 12, w: 7, h: 9, config: top('campaign', 'sales', 'bars') },
      { kind: 'item-health', x: 7, y: 12, w: 5, h: 9, config: weakest },
    ]),
  preset('growth', 'Growth & strategy', 'For strategists and growth leads',
    'Items and revenue worth chasing up top, keywords to add across the middle, and what sells best below.', ChartLineUpIcon, [
      { kind: 'new-opportunities', x: 0, y: 0, w: 7, h: 9 },
      { kind: 'opportunity-value', x: 7, y: 0, w: 5, h: 9 },
      { kind: 'new-keywords', x: 0, y: 9, w: 12, h: 6 },
      { kind: 'top-performers', x: 0, y: 15, w: 6, h: 10, config: top('campaign', 'sales', 'bars') },
      { kind: 'top-performers', x: 6, y: 15, w: 6, h: 10, config: top('keyword', 'sales', 'table') },
    ]),
];
