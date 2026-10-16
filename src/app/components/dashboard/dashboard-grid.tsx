import { Responsive, WidthProvider, type Layout, type Layouts } from 'react-grid-layout';
import { useEffect, useMemo, useState } from 'react';
import { useElementSize } from './controls';
import type { WidgetConfig, WidgetInstance } from './dashboard.types';
import { BREAKPOINTS, COLS } from './use-dashboard';
import WidgetFrame from './widget-frame';
import styles from './dashboard.module.scss';

const Grid = WidthProvider(Responsive);

export const ROW_HEIGHT = 40;
export const GAP = 16;

const colsFor = (width: number) => (width >= BREAKPOINTS.lg ? COLS.lg : width >= BREAKPOINTS.md ? COLS.md : COLS.sm);

/** Column guides, shown only while a widget is being moved or resized, so placement reads against the grid it snaps to. */
function Guides({ cols, height }: { cols: number; height: number }) {
  return (
    <div className={styles.guides} style={{ height, ['--dash-cols' as string]: cols }} aria-hidden>
      {Array.from({ length: cols }, (_, i) => <span key={i} />)}
    </div>
  );
}

export default function DashboardGrid({ widgets, layouts, onLayouts, onConfig, onRemove, onDuplicate }: {
  widgets: WidgetInstance[];
  layouts: Layouts;
  onLayouts: (l: Layouts) => void;
  onConfig: (id: string, patch: WidgetConfig) => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const [wrapRef, size] = useElementSize<HTMLDivElement>();
  const [moving, setMoving] = useState(false);

  // The sidebar settles after the page mounts; let the grid measure itself again.
  useEffect(() => {
    const id = window.setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
    return () => window.clearTimeout(id);
  }, [size.width]);

  const items = useMemo(() => widgets.map((w) => (
    <div key={w.id} data-widget-id={w.id}>
      <WidgetFrame
        widget={w}
        onConfig={(patch) => onConfig(w.id, patch)} onRemove={() => onRemove(w.id)} onDuplicate={() => onDuplicate(w.id)}
      />
    </div>
  )), [widgets, onConfig, onRemove, onDuplicate]);

  const start = () => setMoving(true);
  const stop = () => setMoving(false);

  return (
    <div ref={wrapRef} className={`${styles.gridWrap}${moving ? ` ${styles.gridMoving}` : ''}`}>
      {moving && <Guides cols={colsFor(size.width)} height={Math.max(size.height + 120, 640)} />}
      <Grid
        className={styles.grid}
        layouts={layouts}
        breakpoints={BREAKPOINTS}
        cols={COLS}
        rowHeight={ROW_HEIGHT}
        margin={[GAP, GAP]}
        containerPadding={[0, 0]}
        compactType="vertical"
        draggableHandle=".dash-drag-handle"
        resizeHandles={['se']}
        resizeHandle={(axis: string, ref: React.Ref<HTMLSpanElement>) => (
          <span ref={ref} className={`react-resizable-handle react-resizable-handle-${axis} ${styles.resizeHandle}`} title="Drag to resize" aria-hidden />
        )}
        onDragStart={start}
        onDragStop={stop}
        onResizeStart={start}
        onResizeStop={stop}
        onLayoutChange={(_: Layout[], all: Layouts) => onLayouts(all)}
        useCSSTransforms
      >
        {items}
      </Grid>
    </div>
  );
}
