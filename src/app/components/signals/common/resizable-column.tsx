import { useCallback, useEffect, useRef, useState } from 'react';

interface UseResizableColumnOptions {
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  /** Dragging narrower than this snaps the column into its collapsed rail instead of clamping at minWidth. Omit for a column that resizes but never collapses. */
  collapseBelow?: number;
  /** The collapsed rail's actual rendered width — lets a drag started from the *other* panel's border (e.g. Detail's left edge) while this column is already collapsed begin from where the border visually is, instead of jumping from whatever pre-collapse width is still stored. Required if `collapseBelow` is set and the column is meant to be re-expandable by dragging. */
  collapsedWidth?: number;
  /** Which border of the column the handle sits on. 'right' (default) is for a column on the left side of the row (dragging right grows it, e.g. the List column). 'left' is for a column on the right side (dragging left grows it, e.g. the Jiva column) — same drag-left-to-widen-this-column feel either way, just mirrored. */
  edge?: 'left' | 'right';
}

export interface ResizableColumn {
  width: number;
  collapsed: boolean;
  dragging: boolean;
  expand: () => void;
  dragHandleProps: { onMouseDown: (e: React.MouseEvent) => void };
  /**
   * Like `dragHandleProps`, but the drag starts from an explicit width instead of the hook's own
   * collapsed/expanded default — for a handle on a temporary preview rendered at its own width that
   * doesn't match the column's stored state (e.g. Alerts' hover-overlay, shown at `width` while the
   * column itself is still `collapsed`). Dragging this the same way any other handle would still
   * un-collapses the column live once it crosses `collapseBelow`.
   */
  dragHandlePropsFrom: (startWidth: number) => { onMouseDown: (e: React.MouseEvent) => void };
}

/** Pixel-width column state with a mouse-drag handle. Collapse (when `collapseBelow` is set) happens live while dragging, not just on release, so crossing the threshold snaps the rail in immediately — same feel as a VS Code sidebar. */
export function useResizableColumn({ defaultWidth, minWidth, maxWidth, collapseBelow, collapsedWidth, edge = 'right' }: UseResizableColumnOptions): ResizableColumn {
  const [width, setWidth] = useState(defaultWidth);
  const [collapsed, setCollapsed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; width: number } | null>(null);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!dragStart.current) return;
    const rawDelta = e.clientX - dragStart.current.x;
    const next = dragStart.current.width + (edge === 'left' ? -rawDelta : rawDelta);
    if (collapseBelow !== undefined && next < collapseBelow) {
      setCollapsed(true);
      // `width` otherwise freezes at whatever it last was the instant collapseBelow was crossed —
      // which can be arbitrarily close to collapseBelow itself on a fast drag (a mousemove event
      // can jump straight past the threshold in one step). A consumer that previews the column at
      // its own `width` while collapsed (Alerts' hover-reveal) would then render at that stale,
      // too-narrow value instead of a width its content actually fits. Reset it back to a width the
      // column was actually designed for, so anything reading `width` while collapsed always gets a
      // sane value, not a snapshot of wherever the drag happened to be at the moment it crossed over.
      setWidth(defaultWidth);
    } else {
      setCollapsed(false);
      setWidth(Math.min(maxWidth, Math.max(minWidth, next)));
    }
  }, [maxWidth, minWidth, collapseBelow, edge, defaultWidth]);

  const stopDrag = useCallback(() => {
    dragStart.current = null;
    setDragging(false);
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopDrag);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMouseMove]);

  const startDragAt = useCallback((e: React.MouseEvent, startWidth: number) => {
    e.preventDefault();
    dragStart.current = { x: e.clientX, width: startWidth };
    setDragging(true);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', stopDrag);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [onMouseMove, stopDrag]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // Dragging can start from a handle on the *other* panel's border while this column sits
    // collapsed — begin from the rail's real rendered width, not a stale pre-collapse value.
    startDragAt(e, collapsed ? (collapsedWidth ?? minWidth) : width);
  }, [collapsed, collapsedWidth, minWidth, width, startDragAt]);

  useEffect(() => () => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopDrag);
  }, [onMouseMove, stopDrag]);

  return {
    width, collapsed, dragging,
    expand: () => { setCollapsed(false); setWidth(defaultWidth); },
    dragHandleProps: { onMouseDown },
    dragHandlePropsFrom: (startWidth: number) => ({ onMouseDown: (e: React.MouseEvent) => startDragAt(e, startWidth) }),
  };
}

/**
 * No separate bar sitting in the layout — this is an invisible strip absolutely positioned right on
 * top of its column's own border, so the border itself is what you grab. Place it as the last child
 * of a `position: relative` wrapper around the resizable column (not as a flex sibling); it takes up
 * no flex space of its own. `side` picks which border — 'right' for a column left of its neighbor
 * (e.g. List), 'left' for a column right of its neighbor (e.g. Jiva) — and should match the same
 * column's `useResizableColumn({ edge })`.
 */
export function ResizeHandle({ dragHandleProps, active, side = 'right' }: { dragHandleProps: { onMouseDown: (e: React.MouseEvent) => void }; active: boolean; side?: 'left' | 'right' }) {
  return (
    <div {...dragHandleProps} style={{ position: 'absolute' as const, top: 0, bottom: 0, [side]: -6, width: 12, cursor: 'col-resize', zIndex: 6 }}>
      <div
        style={{ position: 'absolute' as const, left: '50%', top: 6, bottom: 6, width: 3, transform: 'translateX(-50%)', borderRadius: 2, background: active ? '#77469b' : 'transparent', transition: active ? 'none' : 'background 120ms ease-out' }}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#e3d8f0'; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
      />
    </div>
  );
}
