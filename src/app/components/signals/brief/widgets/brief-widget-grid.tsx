import { useEffect, useMemo, useRef, useState } from 'react';
import { Responsive, WidthProvider, type Layout, type Layouts } from 'react-grid-layout';
import { PlusIcon } from '../../alerts/icons';
import motion from '../../alerts/motion.module.scss';
import { WidgetShell } from './brief-widget-shell';
import { WidgetBody, kpiMetricIds } from './brief-widget-body';
import { WidgetPicker } from './brief-widget-picker';
import { WidgetAiSheet } from './brief-widget-ai-sheet';
import { DASHBOARD_PRESETS } from './brief-widget-presets';
import type { WidgetInstance, WidgetKind } from './brief-widget-types';

const ResponsiveGrid = WidthProvider(Responsive);
const STORAGE_KEY = 'anarix-brief-v4';
const PREVIOUS_STORAGE_KEY = 'anarix-brief-dashboard-v3';

/** The Brief opens on the original page's own two blocks — everything else this widget system can do (charts, marketplace health, notes, etc.) lives behind "Add item" instead of pre-added. */
const DEFAULT_WIDGETS: WidgetInstance[] = [
  { id: 'legacy-kpi', kind: 'legacyKpiRow', title: 'Key stats', config: {} },
  { id: 'legacy-activity', kind: 'legacyActivity', title: 'While you were away', config: {} },
];

// The two default sections sit side by side in a fixed row, sized like the Alerts tab: a 320px list column and a detail column that takes the rest.
// They are not draggable or resizable. Anything added through "Add item" lives on the grid below.
const LEFT_COLUMN_WIDTH = 320;
const FIXED_ROW_MIN_HEIGHT = 480;
const DEFAULT_LAYOUT: Layout[] = [];

const CHART_KINDS: WidgetKind[] = ['revenueTrend', 'efficiency', 'spendSales', 'actionMix', 'dayparting', 'keywordFunnel'];
const CONFIGURABLE_CHART_KINDS: WidgetKind[] = ['barChartVertical', 'barChartHorizontal', 'comparisonChart', 'pieChart', 'dataTable', 'comparisonTable', 'lineChart', 'hourlyChart'];
/** `kpi` and `metricRow` are the same underlying widget (one or more metric slots sharing a card) — mergeable into each other by dragging one onto the other. */
function isMetricFamily(kind: WidgetKind | undefined): boolean {
  return kind === 'kpi' || kind === 'metricRow';
}

function makeLayoutFor(id: string, kind: WidgetKind): Layout {
  if (kind === 'legacyKpiRow') return { i: id, x: 0, y: 9999, w: 4, h: 7, minW: 3, minH: 5 };
  if (kind === 'legacyActivity') return { i: id, x: 0, y: 9999, w: 8, h: 7, minW: 5, minH: 4 };
  if (kind === 'kpi') return { i: id, x: 0, y: 9999, w: 3, h: 2, minW: 2, minH: 2 };
  if (kind === 'metricRow') return { i: id, x: 0, y: 9999, w: 6, h: 2, minW: 4, minH: 2 };
  if (kind === 'topMovers') return { i: id, x: 0, y: 9999, w: 8, h: 4, minW: 5, minH: 3 };
  if (CHART_KINDS.includes(kind) || CONFIGURABLE_CHART_KINDS.includes(kind)) return { i: id, x: 0, y: 9999, w: 6, h: 5, minW: 4, minH: 4 };
  return { i: id, x: 0, y: 9999, w: 6, h: 5, minW: 4, minH: 3 };
}

/** Appends one new grid item to every breakpoint's layout that's already populated, not just `lg`.
 * Once `md`/`sm` have been synced at least once (by react-grid-layout's own onLayoutChange), leaving
 * them untouched here means RGL finds the new id missing from those arrays and silently invents a
 * degenerate 1x1 default for it — the widget looks fine at a wide `lg` viewport and collapses to a
 * sliver everywhere narrower. Cloning the same item into `md`/`sm` (width clamped to each one's own
 * column count) keeps every breakpoint in sync from the moment the widget is created. */
function appendLayoutItem(current: Layouts, item: Layout): Layouts {
  const next: Layouts = { ...current, lg: [...(current.lg ?? []), item] };
  if (current.md) next.md = [...current.md, { ...item, w: Math.min(item.w, 4), x: 0 }];
  if (current.sm) next.sm = [...current.sm, { ...item, w: 1, x: 0 }];
  return next;
}

/** Saved layouts may still carry entries for the two pinned blocks; the grid ignores ids it has no child for, so just keep them tidy. */
function dropPinned(layouts: Layouts): Layouts {
  const next: Layouts = {};
  for (const [bp, items] of Object.entries(layouts)) next[bp] = (items ?? []).filter((l) => l.i !== 'legacy-kpi' && l.i !== 'legacy-activity');
  return next;
}

function formatHeaderDate(): string {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

function formatHeaderTime(): string {
  const now = new Date();
  let h = now.getHours();
  const m = now.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

/** The default Brief view: a curated set of widgets on a draggable grid. "Default" only describes the starting layout — every widget can be moved, recolored, retitled or removed, and new ones added, so this single view can lean as written or as chart-heavy as the user wants instead of being one of three fixed pages. */
export function BriefWidgetGrid() {
  const [widgets, setWidgets] = useState<WidgetInstance[]>(DEFAULT_WIDGETS);
  const [layouts, setLayouts] = useState<Layouts>({ lg: DEFAULT_LAYOUT });
  const [mounted, setMounted] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);
  // Which one series (chart-series kinds) or metric slot (kpi/metricRow, as its index) the sheet is
  // scoped to — null means "the whole widget," same as opening it from the header sparkle.
  const [editingFocusKey, setEditingFocusKey] = useState<string | null>(null);
  // Dragging one `kpi` widget onto another merges them onto one shared card, same idea as Key
  // Stats' cards — tracked outside react-grid-layout's own drag/collision system since RGL has no
  // "dropped onto another item" concept of its own.
  const [dragMergeTarget, setDragMergeTarget] = useState<string | null>(null);
  const draggingKpiIdRef = useRef<string | null>(null);
  const justMergedRef = useRef(false);
  const gridWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { widgets?: WidgetInstance[]; layouts?: Layouts };
        if (parsed.widgets?.length && parsed.layouts) {
          setWidgets(parsed.widgets);
          setLayouts(dropPinned(parsed.layouts));
        }
      } else {
        // Carry the home dashboard over from the tabbed version; its extra tabs are gone.
        const previous = window.localStorage.getItem(PREVIOUS_STORAGE_KEY);
        const parsed = previous ? (JSON.parse(previous) as { dashboards?: { id: string; widgets: WidgetInstance[]; layouts: Layouts }[] }) : null;
        const home = parsed?.dashboards?.find((d) => d.id === 'overview') ?? parsed?.dashboards?.[0];
        if (home?.widgets?.length) {
          setWidgets(home.widgets);
          setLayouts(dropPinned(home.layouts));
        }
      }
    } catch {
      // Keep the curated default when stored data is unavailable or corrupt.
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ widgets, layouts }));
  }, [widgets, layouts, mounted]);

  // react-grid-layout only re-measures on window resize, so when the sidebar settles after first paint it keeps a stale width
  // and the right-hand card spills past the edge. Nudge it whenever this container's own width changes.
  useEffect(() => {
    const el = gridWrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    let lastWidth = el.offsetWidth;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      if (el.offsetWidth === lastWidth) return;
      lastWidth = el.offsetWidth;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
    });
    observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [mounted]);

  const pinnedKpi = widgets.find((w) => w.kind === 'legacyKpiRow');
  const pinnedActivity = widgets.find((w) => w.kind === 'legacyActivity');
  const gridWidgets = widgets.filter((w) => w !== pinnedKpi && w !== pinnedActivity);

  const editingWidget = useMemo(() => widgets.find((w) => w.id === editingWidgetId) ?? null, [widgets, editingWidgetId]);

  function openAiSheet(widgetId: string, focusKey?: string) {
    setEditingWidgetId(widgetId);
    setEditingFocusKey(focusKey ?? null);
  }

  function closeAiSheet() {
    setEditingWidgetId(null);
    setEditingFocusKey(null);
  }

  function addWidget(kind: WidgetKind, title: string) {
    const id = `${kind}-${Date.now()}`;
    // Everything else starts empty/single per its own kind's default — metricRow specifically starts
    // with two real metrics (matching what dragging two KPI cards together already produces) rather
    // than empty, since a bare metric slot with nothing chosen has no sensible blank rendering the
    // way a chart does.
    const config: Record<string, unknown> = kind === 'metricRow' ? { metricIds: ['ad-spend', 'ad-sales'] } : {};
    setWidgets((current) => [...current, { id, kind, title, config }]);
    setLayouts((current) => appendLayoutItem(current, makeLayoutFor(id, kind)));
    setPickerOpen(false);
  }

  function removeWidget(id: string) {
    setWidgets((current) => current.filter((w) => w.id !== id));
    setLayouts((current) => ({ ...current, lg: (current.lg ?? []).filter((l) => l.i !== id) }));
  }

  function updateWidget(id: string, changes: Partial<WidgetInstance>) {
    setWidgets((current) => current.map((w) => (w.id === id ? { ...w, ...changes } : w)));
  }

  /** Absorbs `draggedId`'s metric(s) into `targetId`'s card and removes the dragged widget entirely — the reverse of splitKpiMetric below. */
  function mergeKpiWidgets(targetId: string, draggedId: string) {
    const target = widgets.find((w) => w.id === targetId);
    const dragged = widgets.find((w) => w.id === draggedId);
    if (!target || !dragged) return;
    const mergedIds = [...kpiMetricIds(target.config), ...kpiMetricIds(dragged.config)];
    setWidgets((current) => current
      .filter((w) => w.id !== draggedId)
      .map((w) => (w.id === targetId ? { ...w, config: { ...w.config, metricIds: mergedIds, metricId: undefined } } : w)));
    setLayouts((current) => {
      const lg = current.lg ?? [];
      const targetLayout = lg.find((l) => l.i === targetId);
      const draggedLayout = lg.find((l) => l.i === draggedId);
      const nextLg = lg
        .filter((l) => l.i !== draggedId)
        .map((l) => (l.i === targetId && targetLayout && draggedLayout ? { ...l, w: Math.min(12, targetLayout.w + draggedLayout.w) } : l));
      return { ...current, lg: nextLg };
    });
  }

  /** Pops one metric (by its index within the widget) back out into its own standalone widget — the reverse of a merge, triggered from the small "x" on a merged card's member instead of a drag gesture (see [[project_brief_widget_dashboard]] for why). */
  function splitKpiMetric(widgetId: string, index: number) {
    const target = widgets.find((w) => w.id === widgetId);
    if (!target) return;
    const ids = kpiMetricIds(target.config);
    if (ids.length <= 1) return;
    const poppedId = ids[index];
    const remaining = ids.filter((_, i) => i !== index);
    const newId = `kpi-${Date.now()}`;
    setWidgets((current) => [
      ...current.map((w) => (w.id === widgetId ? { ...w, config: { ...w.config, metricIds: remaining, metricId: undefined } } : w)),
      { id: newId, kind: 'kpi', title: 'KPI metric', config: { metricIds: [poppedId] } },
    ]);
    setLayouts((current) => appendLayoutItem(current, makeLayoutFor(newId, 'kpi')));
  }

  function handleDragStart(_layout: Layout[], oldItem: Layout) {
    const w = widgets.find((x) => x.id === oldItem.i);
    draggingKpiIdRef.current = isMetricFamily(w?.kind) ? oldItem.i : null;
    setDragMergeTarget(null);
  }

  function handleDrag(_layout: Layout[], _oldItem: Layout, _newItem: Layout, _placeholder: Layout, e: MouseEvent) {
    if (!draggingKpiIdRef.current) return;
    const candidates = Array.from(gridWrapRef.current?.querySelectorAll<HTMLElement>('[data-widget-id]') ?? []);
    let found: string | null = null;
    for (const el of candidates) {
      const id = el.dataset.widgetId;
      if (!id || id === draggingKpiIdRef.current) continue;
      if (!isMetricFamily(widgets.find((w) => w.id === id)?.kind)) continue;
      const r = el.getBoundingClientRect();
      if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
        found = id;
        break;
      }
    }
    setDragMergeTarget(found);
  }

  function handleDragStop() {
    const draggedId = draggingKpiIdRef.current;
    const targetId = dragMergeTarget;
    draggingKpiIdRef.current = null;
    setDragMergeTarget(null);
    if (draggedId && targetId) {
      justMergedRef.current = true;
      mergeKpiWidgets(targetId, draggedId);
    }
  }

  function applyPreset(presetId: string) {
    const preset = DASHBOARD_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setWidgets(preset.widgets);
    setLayouts({ lg: preset.layout });
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' as const, paddingTop: 2 }}>
        <h2 style={{ margin: 0, minWidth: 0, font: '600 26px/1.25 Inter,sans-serif', letterSpacing: '-0.02em', color: '#23272d' }}>
          {formatHeaderDate()}
          <span style={{ font: '400 14px/1.25 Inter,sans-serif', letterSpacing: 0, color: '#9aa0a8' }}> · Updated {formatHeaderTime()}</span>
        </h2>
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className={motion.pressable}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 8, background: '#fff', border: '1px solid #e6e8ec', font: '600 12.5px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#fafbfd')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
        >
          <PlusIcon size={11} color="#77469b" /> Add item
        </button>
      </header>

      {mounted && (pinnedKpi || pinnedActivity) && (
        <div style={{ display: 'grid', gridTemplateColumns: pinnedKpi && pinnedActivity ? `${LEFT_COLUMN_WIDTH}px minmax(0, 1fr)` : 'minmax(0, 1fr)', gridTemplateRows: 'minmax(0, 1fr)', gap: 14, flex: `1 0 ${FIXED_ROW_MIN_HEIGHT}px`, minHeight: 0 }}>
          {[pinnedKpi, pinnedActivity].map((widget) => widget && (
            <div key={widget.id} style={{ minWidth: 0, minHeight: 0 }}>
              <WidgetShell
                widget={widget}
                plain
                movable={false}
                onTitleChange={(title) => updateWidget(widget.id, { title })}
                onEditWithAi={() => openAiSheet(widget.id)}
                onRemove={() => removeWidget(widget.id)}
              >
                <WidgetBody widget={widget} onConfigChange={(config) => updateWidget(widget.id, { config })} />
              </WidgetShell>
            </div>
          ))}
        </div>
      )}

      {mounted ? (
        <div ref={gridWrapRef}>
          <ResponsiveGrid
            className="layout"
            layouts={layouts}
            breakpoints={{ lg: 1100, md: 768, sm: 0 }}
            cols={{ lg: 12, md: 4, sm: 1 }}
            rowHeight={56}
            margin={[14, 14]}
            containerPadding={[0, 0]}
            draggableHandle=".brief-widget-drag-handle"
            isResizable={false}
            isDraggable
            compactType="vertical"
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragStop={handleDragStop}
            onLayoutChange={(layout, allLayouts) => {
              if (justMergedRef.current) { justMergedRef.current = false; return; }
              setLayouts({ ...allLayouts, lg: allLayouts.lg ?? layout });
            }}
          >
            {gridWidgets.map((widget) => (
              <div key={widget.id} data-widget-id={widget.id}>
                <WidgetShell
                  widget={widget}
                  dropTarget={dragMergeTarget === widget.id}
                  aiEditable={widget.kind === 'custom'}
                  onTitleChange={(title) => updateWidget(widget.id, { title })}
                  onEditWithAi={() => openAiSheet(widget.id)}
                  onRemove={() => removeWidget(widget.id)}
                >
                  <WidgetBody
                    widget={widget}
                    onConfigChange={(config) => updateWidget(widget.id, { config })}
                    onSplitKpiMetric={(index) => splitKpiMetric(widget.id, index)}
                    onEditKpiMember={widget.kind === 'custom' ? (index) => openAiSheet(widget.id, String(index)) : undefined}
                    onEditSeries={widget.kind === 'custom' ? (seriesId) => openAiSheet(widget.id, seriesId) : undefined}
                    onOpenAiSheet={widget.kind === 'custom' ? () => openAiSheet(widget.id) : undefined}
                  />
                </WidgetShell>
              </div>
            ))}
          </ResponsiveGrid>
        </div>
      ) : (
        <div aria-hidden style={{ display: 'grid', gridTemplateColumns: `${LEFT_COLUMN_WIDTH}px minmax(0, 1fr)`, gap: 14 }}>
          <div style={{ height: FIXED_ROW_MIN_HEIGHT, borderRadius: 14, background: '#f6f7f9' }} />
          <div style={{ height: FIXED_ROW_MIN_HEIGHT, borderRadius: 14, background: '#f6f7f9' }} />
        </div>
      )}

      {mounted && widgets.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, padding: '36px 0', borderTop: '1px solid #eceef1' }}>
          <div style={{ font: '600 15px/1.3 Inter,sans-serif', color: '#23272d' }}>Your Brief is empty</div>
          <div style={{ font: '400 13px/1.55 Inter,sans-serif', color: '#6b7178', maxWidth: 420 }}>Add key stats, what Jiva did while you were away, or a chart. You can move anything you add.</div>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className={motion.pressable}
            style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 8, border: 'none', background: '#77469b', font: '600 12.5px/1 Inter,sans-serif', color: '#fff', cursor: 'pointer' }}
          >
            <PlusIcon size={11} color="#fff" /> Add item
          </button>
        </div>
      )}

      {pickerOpen && <WidgetPicker onClose={() => setPickerOpen(false)} onAdd={addWidget} onApplyPreset={applyPreset} />}
      {editingWidget && (
        <WidgetAiSheet
          widget={editingWidget}
          focusKey={editingFocusKey}
          onClose={closeAiSheet}
          onApply={(changes) => updateWidget(editingWidget.id, changes)}
        />
      )}
    </div>
  );
}
