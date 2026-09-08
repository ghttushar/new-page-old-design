import { useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  label: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom';
  wrap?: boolean;
  inline?: boolean;
}

/**
 * Lightweight hover tooltip rendered via portal so it never gets clipped by a
 * scrolling ancestor (list rows live inside overflow:auto containers).
 */
export function HoverTip({ label, children, placement = 'top', wrap = false, inline = true }: Props) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  const show = () => { if (ref.current) setRect(ref.current.getBoundingClientRect()); };
  const hide = () => setRect(null);

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
            top: placement === 'top' ? rect.top - 8 : rect.bottom + 8,
            left: rect.left + rect.width / 2,
            transform: placement === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
            background: '#23272d',
            color: '#fff',
            padding: '7px 10px',
            borderRadius: 7,
            font: '500 11px/1.5 Inter,sans-serif',
            whiteSpace: wrap ? 'normal' : 'nowrap',
            maxWidth: wrap ? 280 : 320,
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
