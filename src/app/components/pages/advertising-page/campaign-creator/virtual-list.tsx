import { useEffect, useRef, useState } from 'react';

/**
 * A scrolling list that only draws the rows in view, so a list of thousands costs the same as a list of ten.
 * Rows have one fixed height. `activeIndex` is scrolled into view, for keyboard movement.
 */
export default function VirtualList<T>({ items, rowHeight, height, getKey, renderRow, activeIndex, className, label }: {
  items: T[];
  rowHeight: number;
  height: number;
  getKey: (item: T) => string;
  renderRow: (item: T, index: number) => React.ReactNode;
  activeIndex?: number;
  className?: string;
  label?: string;
}) {
  const [top, setTop] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const shown = Math.min(height, items.length * rowHeight);
  const overscan = 4;
  const start = Math.max(0, Math.floor(top / rowHeight) - overscan);
  const end = Math.min(items.length, Math.ceil((top + shown) / rowHeight) + overscan);

  // Back to the top when the list itself changes (a new search, say).
  const first = items.length ? getKey(items[0]) : '';
  useEffect(() => { if (ref.current) ref.current.scrollTop = 0; setTop(0); }, [first, items.length]);

  useEffect(() => {
    const box = ref.current;
    if (!box || activeIndex === undefined || activeIndex < 0) return;
    const rowTop = activeIndex * rowHeight;
    if (rowTop < box.scrollTop) box.scrollTop = rowTop;
    else if (rowTop + rowHeight > box.scrollTop + shown) box.scrollTop = rowTop + rowHeight - shown;
  }, [activeIndex, rowHeight, shown]);

  return (
    <div ref={ref} className={className} role="presentation" aria-label={label} style={{ height: shown, overflowY: 'auto' }} onScroll={(e) => setTop(e.currentTarget.scrollTop)}>
      <div style={{ height: items.length * rowHeight, position: 'relative' }}>
        {items.slice(start, end).map((item, i) => (
          <div key={getKey(item)} style={{ position: 'absolute', top: (start + i) * rowHeight, left: 0, right: 0, height: rowHeight }}>
            {renderRow(item, start + i)}
          </div>
        ))}
      </div>
    </div>
  );
}
