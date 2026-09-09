import { useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  label: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom';
  wrap?: boolean;
  inline?: boolean;
}

const MARGIN = 10;

/**
 * Lightweight hover tooltip rendered via portal so it never gets clipped by a
 * scrolling ancestor (list rows live inside overflow:auto containers).
 *
 * Position is viewport-aware: it flips to the side with room and clamps
 * horizontally so it never renders off-screen or unreadably close to an edge
 * (both of which happened for hover targets near the top/right of the panel).
 */
export function HoverTip({ label, children, placement = 'top', wrap = false, inline = true }: Props) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  const show = () => { if (ref.current) setRect(ref.current.getBoundingClientRect()); };
  const hide = () => setRect(null);

  const maxWidth = wrap ? 280 : 320;
  // Rough worst-case height used only to decide whether there's room — the tooltip's
  // real height is whatever its content needs, this just avoids flipping off-screen.
  const estimatedHeight = wrap ? 90 : 34;

  let top = 0;
  let translateY = '0';
  let resolvedPlacement = placement;
  let clampedLeft = 0;

  if (rect) {
    const fitsAbove = rect.top - estimatedHeight - MARGIN > 0;
    const fitsBelow = rect.bottom + estimatedHeight + MARGIN < window.innerHeight;
    resolvedPlacement = placement === 'top' && !fitsAbove && fitsBelow ? 'bottom'
      : placement === 'bottom' && !fitsBelow && fitsAbove ? 'top'
      : placement;

    if (resolvedPlacement === 'top') {
      top = rect.top - 8;
      translateY = '-100%';
    } else {
      top = rect.bottom + 8;
      translateY = '0';
    }

    const idealLeft = rect.left + rect.width / 2;
    clampedLeft = Math.min(Math.max(idealLeft, MARGIN + maxWidth / 2), window.innerWidth - MARGIN - maxWidth / 2);
  }

  return (
    <span
      ref={ref}
      tabIndex={0}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      aria-describedby={rect ? tooltipId : undefined}
      style={{ display: inline ? 'inline-flex' : 'block', alignItems: 'center', minWidth: 0, outlineOffset: 2 }}
    >
      {children}
      {rect && createPortal(
        <div
          role="tooltip"
          id={tooltipId}
          style={{
            position: 'fixed',
            top,
            left: clampedLeft,
            transform: `translate(-50%, ${translateY})`,
            background: '#23272d',
            color: '#fff',
            padding: '7px 10px',
            borderRadius: 7,
            font: '500 11px/1.5 Inter,sans-serif',
            whiteSpace: wrap ? 'normal' : 'nowrap',
            maxWidth,
            zIndex: 800,
            boxShadow: '0 10px 24px rgba(20,24,33,.32)',
            pointerEvents: 'none',
          }}
        >
          {label}
        </div>,
        document.body
      )}
    </span>
  );
}
