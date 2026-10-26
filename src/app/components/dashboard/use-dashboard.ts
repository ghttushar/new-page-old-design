import type { Layout, Layouts } from 'react-grid-layout';
import { useCallback, useEffect, useState } from 'react';
import type { DashboardState, DashboardTemplate, WidgetConfig, WidgetInstance, WidgetKind } from './dashboard.types';
import { WIDGETS } from './widget-registry';

const STORAGE_KEY = 'anarix-dashboard-v1';

export const COLS = { lg: 12, md: 6, sm: 1 } as const;
export const BREAKPOINTS = { lg: 1100, md: 640, sm: 0 } as const;
type Bp = keyof typeof COLS;

export const DEFAULT_NAME = 'My dashboard';

const EMPTY: DashboardState = { name: DEFAULT_NAME, widgets: [], layouts: { lg: [], md: [], sm: [] }, templates: [] };

/**
 * Every visit starts fresh: the dashboard opens empty, in its skeleton state, so the first-visit flow plays each time.
 * Only saved templates are kept between visits, so any layout can be brought back in one click.
 */
function load(): DashboardState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<DashboardState>;
    // Templates that refer to widgets which no longer exist are dropped.
    const templates = (parsed.templates ?? []).filter((t) => t.widgets.every((w) => WIDGETS[w.kind]));
    return { ...EMPTY, templates };
  } catch {
    return EMPTY;
  }
}

const newId = (kind: string) => `${kind}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** The first free spot for a w × h box, reading left to right, top to bottom. */
export function findSlot(layout: Layout[], w: number, h: number, cols: number): { x: number; y: number } {
  const width = Math.min(w, cols);
  const fits = (x: number, y: number) => layout.every((l) => x + width <= l.x || x >= l.x + l.w || y + h <= l.y || y >= l.y + l.h);
  for (let y = 0; y < 500; y += 1) {
    for (let x = 0; x + width <= cols; x += 1) if (fits(x, y)) return { x, y };
  }
  return { x: 0, y: Infinity };
}

function placeIn(layouts: Layouts, id: string, kind: WidgetKind): Layouts {
  const { size } = WIDGETS[kind];
  const next: Layouts = { ...layouts };
  (Object.keys(COLS) as Bp[]).forEach((bp) => {
    const cols = COLS[bp];
    const w = bp === 'lg' ? size.w : bp === 'md' ? Math.min(cols, Math.max(3, Math.round(size.w / 2))) : 1;
    const minW = Math.min(bp === 'lg' ? size.minW : bp === 'md' ? Math.max(2, Math.round(size.minW / 2)) : 1, w);
    const current = layouts[bp] ?? [];
    const { x, y } = findSlot(current, w, size.h, cols);
    next[bp] = [...current, { i: id, x, y, w, h: size.h, minW, minH: size.minH, maxH: size.maxH }];
  });
  return next;
}

/** Copies widgets and layouts with fresh ids, so a template can be applied more than once. */
function cloneWithNewIds(widgets: WidgetInstance[], layouts: Layouts): { widgets: WidgetInstance[]; layouts: Layouts } {
  const map = new Map(widgets.map((w) => [w.id, newId(w.kind)]));
  const next: Layouts = {};
  Object.entries(layouts).forEach(([bp, items]) => {
    next[bp] = (items ?? []).filter((l) => map.has(l.i)).map((l) => ({ ...l, i: map.get(l.i) as string }));
  });
  return { widgets: widgets.map((w) => ({ ...w, id: map.get(w.id) as string, config: { ...w.config } })), layouts: next };
}

export type Snapshot = Pick<DashboardState, 'name' | 'widgets' | 'layouts'>;

export default function useDashboard() {
  const [state, setState] = useState<DashboardState>(load);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ templates: state.templates })); } catch { /* storage unavailable */ }
  }, [state.templates]);

  const snapshot = useCallback((): Snapshot => ({ name: state.name, widgets: state.widgets, layouts: state.layouts }), [state]);
  const restore = useCallback((s: Snapshot) => setState((prev) => ({ ...prev, name: s.name, widgets: s.widgets, layouts: s.layouts })), []);

  const addWidget = useCallback((kind: WidgetKind, config?: WidgetConfig) => {
    const id = newId(kind);
    setState((prev) => ({
      ...prev,
      widgets: [...prev.widgets, { id, kind, config: { ...WIDGETS[kind].defaults, ...config } }],
      layouts: placeIn(prev.layouts, id, kind),
    }));
    return id;
  }, []);

  const removeWidget = useCallback((id: string) => {
    setState((prev) => {
      const layouts: Layouts = {};
      Object.entries(prev.layouts).forEach(([bp, items]) => { layouts[bp] = (items ?? []).filter((l) => l.i !== id); });
      return { ...prev, widgets: prev.widgets.filter((w) => w.id !== id), layouts };
    });
  }, []);

  const updateConfig = useCallback((id: string, patch: WidgetConfig) => {
    setState((prev) => ({ ...prev, widgets: prev.widgets.map((w) => (w.id === id ? { ...w, config: { ...w.config, ...patch } } : w)) }));
  }, []);

  const setLayouts = useCallback((layouts: Layouts) => setState((prev) => ({ ...prev, layouts })), []);

  const clear = useCallback(() => setState((prev) => ({ ...prev, name: DEFAULT_NAME, widgets: [], layouts: { lg: [], md: [], sm: [] } })), []);

  const applyTemplate = useCallback((t: DashboardTemplate) => {
    const copy = cloneWithNewIds(t.widgets, t.layouts);
    setState((prev) => ({ ...prev, ...copy, name: t.name }));
  }, []);

  /** Saves the current dashboard under a free default name and returns the new template's id, so its name can be edited. */
  const saveTemplate = useCallback((): string => {
    const id = newId('template');
    setState((prev) => {
      const copy = cloneWithNewIds(prev.widgets, prev.layouts);
      const taken = new Set(prev.templates.map((t) => t.name.toLowerCase()));
      let n = prev.templates.length + 1;
      while (taken.has(`template ${n}`)) n += 1;
      const template: DashboardTemplate = { id, name: `Template ${n}`, createdAt: Date.now(), ...copy };
      return { ...prev, name: template.name, templates: [template, ...prev.templates] };
    });
    return id;
  }, []);

  const renameTemplate = useCallback((id: string, name: string) => {
    setState((prev) => {
      const old = prev.templates.find((t) => t.id === id);
      if (!old) return prev;
      return {
        ...prev,
        // The dashboard keeps showing the template it came from under its new name.
        name: prev.name === old.name ? name : prev.name,
        templates: prev.templates.map((t) => (t.id === id ? { ...t, name } : t)),
      };
    });
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setState((prev) => ({ ...prev, templates: prev.templates.filter((t) => t.id !== id) }));
  }, []);

  return { ...state, snapshot, restore, addWidget, removeWidget, updateConfig, setLayouts, clear, applyTemplate, saveTemplate, renameTemplate, deleteTemplate };
}
