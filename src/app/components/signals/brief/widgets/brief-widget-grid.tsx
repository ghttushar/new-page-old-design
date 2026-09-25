import { useEffect, useMemo, useRef, useState } from 'react';
import { Responsive, WidthProvider, type Layout, type Layouts } from 'react-grid-layout';
import { PlusIcon, ResetIcon } from '../../alerts/icons';
import motion from '../../alerts/motion.module.scss';
import { WidgetShell } from './brief-widget-shell';
import { WidgetBody, kpiMetricIds } from './brief-widget-body';
import { WidgetPicker } from './brief-widget-picker';
import { WidgetAiSheet } from './brief-widget-ai-sheet';
import type { WidgetInstance, WidgetKind } from './brief-widget-types';

const ResponsiveGrid = WidthProvider(Responsive);
const STORAGE_KEY = 'anarix-brief-dashboard-v2';

/** The default view is the original Brief page's own two blocks — everything else this widget system can do (charts, marketplace health, notes, etc.) lives behind "Add widget" instead of pre-added, per the user's call: keep the old Brief as what you see first, make the rest opt-in. */
const DEFAULT_WIDGETS: WidgetInstance[] = [
  { id: 'legacy-kpi', kind: 'legacyKpiRow', title: 'Key stats', config: {} },
  { id: 'legacy-activity', kind: 'legacyActivity', title: 'While you were away', config: {} },
];

// Key stats only needs enough height for its own collapsed row by default — it grows to
// LEGACY_KPI_EXPANDED_H itself (see setLegacyKpiExpanded) the moment a card opens, and shrinks back
// the moment it closes, instead of always reserving room for a detail nothing may ever open.
const LEGACY_KPI_COLLAPSED_H = 3;
const LEGACY_KPI_EXPANDED_H = 9;

const DEFAULT_LAYOUT: Layout[] = [
  { i: 'legacy-kpi', x: 0, y: 0, w: 12, h: LEGACY_KPI_COLLAPSED_H, minW: 8, minH: 3 },
  { i: 'legacy-activity', x: 0, y: LEGACY_KPI_COLLAPSED_H, w: 12, h: 6, minW: 6, minH: 4 },
];

const CHART_KINDS: WidgetKind[] = ['revenueTrend', 'efficiency', 'spendSales', 'actionMix', 'dayparting', 'keywordFunnel'];
const CONFIGURABLE_CHART_KINDS: WidgetKind[] = ['barChartVertical', 'barChartHorizontal', 'comparisonChart', 'pieChart', 'dataTable', 'comparisonTable', 'lineChart', 'hourlyChart'];
/** `kpi` and `metricRow` are the same underlying widget (one or more metric slots sharing a card) — mergeable into each other by dragging one onto the other. */
function isMetricFamily(kind: WidgetKind | undefined): boolean {
  return kind === 'kpi' || kind === 'metricRow';
}

function makeLayoutFor(id: string, kind: WidgetKind): Layout {
  if (kind === 'legacyKpiRow') return { i: id, x: 0, y: 9999, w: 12, h: LEGACY_KPI_COLLAPSED_H, minW: 8, minH: 3 };
  if (kind === 'legacyActivity') return { i: id, x: 0, y: 9999, w: 12, h: 6, minW: 6, minH: 4 };
  if (kind === 'kpi') return { i: id, x: 0, y: 9999, w: 3, h: 2, minW: 2, minH: 2 };
  if (kind === 'metricRow') return { i: id, x: 0, y: 9999, w: 6, h: 2, minW: 4, minH: 2 };
  if (kind === 'topMovers') return { i: id, x: 0, y: 9999, w: 8, h: 4, minW: 5, minH: 3 };
  if (CHART_KINDS.includes(kind) || CONFIGURABLE_CHART_KINDS.includes(kind)) return { i: id, x: 0, y: 9999, w: 6, h: 5, minW: 4, minH: 4 };
  return { i: id, x: 0, y: 9999, w: 6, h: 5, minW: 4, minH: 3 };
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

/** The default Brief view: a curated set of widgets on a draggable, resizable grid. "Default" only describes the starting layout — every widget can be moved, resized, recolored, retitled or removed, and new ones added, so this single view can lean as written or as chart-heavy as the user wants instead of being one of three fixed pages. */
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
        if (parsed.widgets?.length) setWidgets(parsed.widgets);
        if (parsed.layouts?.lg?.length) setLayouts(parsed.layouts);
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
    setLayouts((current) => ({ ...current, lg: [...(current.lg ?? []), makeLayoutFor(id, kind)] }));
    setPickerOpen(false);
  }

  function removeWidget(id: string) {
    setWidgets((current) => current.filter((w) => w.id !== id));
    setLayouts((current) => ({ ...current, lg: (current.lg ?? []).filter((l) => l.i !== id) }));
  }

  function updateWidget(id: string, changes: Partial<WidgetInstance>) {
    setWidgets((current) => current.map((w) => (w.id === id ? { ...w, ...changes } : w)));
  }

  function setLegacyKpiExpanded(id: string, expanded: boolean) {
    const h = expanded ? LEGACY_KPI_EXPANDED_H : LEGACY_KPI_COLLAPSED_H;
    setLayouts((current) => ({ ...current, lg: (current.lg ?? []).map((l) => (l.i === id ? { ...l, h } : l)) }));
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
    setLayouts((current) => ({ ...current, lg: [...(current.lg ?? []), makeLayoutFor(newId, 'kpi')] }));
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

  function resetToDefault() {
    setWidgets(DEFAULT_WIDGETS);
    setLayouts({ lg: DEFAULT_LAYOUT });
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', paddingRight: 4, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' as const }}>
        <div>
          <div style={{ font: '600 18px/1.3 Inter,sans-serif', color: '#23272d' }}>{formatHeaderDate()} · {formatHeaderTime()}</div>
          <div style={{ font: '400 12.5px/1.5 Inter,sans-serif', color: '#9aa0a8', marginTop: 3 }}>Drag a widget by its grip to move it, resize from its lower-right corner, or add more from the whole platform.</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flex: 'none' }}>
          <span
            onClick={resetToDefault}
            className={motion.pressable}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 13px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}
          >
            <ResetIcon size={12} /> Reset
          </span>
          <span
            onClick={() => setPickerOpen(true)}
            className={motion.pressable}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 7, background: '#77469b', font: '600 12px/1 Inter,sans-serif', color: '#fff', cursor: 'pointer' }}
          >
            <PlusIcon size={11} /> Add widget
          </span>
        </div>
      </div>

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
            isResizable
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
            {widgets.map((widget) => (
              <div key={widget.id} data-widget-id={widget.id}>
                <WidgetShell
                  widget={widget}
                  dropTarget={dragMergeTarget === widget.id}
                  onTitleChange={(title) => updateWidget(widget.id, { title })}
                  onEditWithAi={() => openAiSheet(widget.id)}
                  onRemove={() => removeWidget(widget.id)}
                >
                  <WidgetBody
                    widget={widget}
                    onConfigChange={(config) => updateWidget(widget.id, { config })}
                    onLegacyKpiExpand={(expanded) => setLegacyKpiExpanded(widget.id, expanded)}
                    onSplitKpiMetric={(index) => splitKpiMetric(widget.id, index)}
                    onEditKpiMember={(index) => openAiSheet(widget.id, String(index))}
                    onEditSeries={(seriesId) => openAiSheet(widget.id, seriesId)}
                    onOpenAiSheet={() => openAiSheet(widget.id)}
                  />
                </WidgetShell>
              </div>
            ))}
          </ResponsiveGrid>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {DEFAULT_WIDGETS.slice(0, 4).map((w) => <div key={w.id} style={{ height: 120, borderRadius: 10, background: '#fafbfd', border: '1px solid #f1f2f4' }} />)}
        </div>
      )}

      {pickerOpen && <WidgetPicker onClose={() => setPickerOpen(false)} onAdd={addWidget} />}
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
