import { useEffect, useState } from 'react';
import type { ResizableColumn } from './resizable-column';

// The collapsed list column on Alerts, Meetings and Work-station: a thin sliver behind the detail panel. Hovering it
// brings the real list back as a floating overlay, and the overlay carries a grip on its right edge: drag it to pin the
// list back into the layout at the width you let go at. Dragging any border narrower than the collapse point again
// sends it back to the sliver.

export const PEEK_SLIVER_WIDTH = 14;

function Sliver() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 4, height: 64, borderRadius: 3, background: '#d5d9e0' }} />
    </div>
  );
}

/** The overlay's drag bar: a visible grip mid-height, over a full-height strip that's easy to catch. */
function PeekGrip({ col }: { col: ResizableColumn }) {
  const [hover, setHover] = useState(false);
  const lit = hover || col.dragging;
  return (
    <div
      {...col.dragHandlePropsFrom(col.width)}
      title="Drag to pin the list open"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: 'absolute', top: 0, bottom: 0, right: -9, width: 18, cursor: 'col-resize', zIndex: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div style={{ position: 'absolute', left: '50%', top: 6, bottom: 6, width: 2, transform: 'translateX(-50%)', borderRadius: 2, background: lit ? '#d9c8ea' : 'transparent', transition: 'background-color 120ms ease-out' }} />
      <div
        style={{
          position: 'relative', width: 12, height: 44, borderRadius: 6,
          background: lit ? '#77469b' : '#fff', border: `1px solid ${lit ? '#77469b' : '#dcdfe5'}`,
          boxShadow: '0 2px 6px rgba(20,24,33,.14)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
          transition: 'background-color 120ms ease-out, border-color 120ms ease-out',
        }}
      >
        {[0, 1, 2].map((i) => <span key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: lit ? '#fff' : '#a3a8b2' }} />)}
      </div>
    </div>
  );
}

export function CollapsedPeek({ col, children }: { col: ResizableColumn; children: React.ReactNode }) {
  const [hovering, setHovering] = useState(false);
  // Once pinned (or expanded any other way) the peek is over.
  useEffect(() => { if (!col.collapsed) setHovering(false); }, [col.collapsed]);
  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { if (!col.dragging) setHovering(false); }}
      style={{ flex: `0 0 ${PEEK_SLIVER_WIDTH}px`, position: 'relative', height: '100%' }}
    >
      <div
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: hovering ? col.width : PEEK_SLIVER_WIDTH,
          // A list whose toolbar needs more room than the stored width (Work-station's) grows to fit rather than clip.
          minWidth: hovering ? 'min-content' : undefined,
          display: 'flex',
          zIndex: hovering ? 40 : 1,
          transition: col.dragging ? 'none' : 'width 150ms ease-out',
          boxShadow: hovering ? '14px 0 32px rgba(20,24,33,.22)' : 'none',
          borderRadius: 10,
        }}
      >
        {/* overflow:hidden sits on this inner box so it clips the list without clipping the grip, which overhangs the edge. */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', borderRadius: 10, overflow: 'hidden' }}>
          {hovering ? children : <Sliver />}
        </div>
        {hovering && <PeekGrip col={col} />}
      </div>
    </div>
  );
}
