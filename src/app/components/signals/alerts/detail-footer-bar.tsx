import type { ReactNode } from 'react';

/**
 * The fixed action bar pinned to the bottom of a detail card (Alert view, Meeting detail,
 * Meeting MOM). Always the same height regardless of how much content sits above it —
 * a flex sibling of the scrollable body, never part of the scroll flow itself.
 */
export function DetailFooterBar({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        flex: 'none',
        height: 60,
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(14px) saturate(180%)',
        WebkitBackdropFilter: 'blur(14px) saturate(180%)',
        borderTop: '1px solid rgba(230,232,236,0.7)',
        boxShadow: '0 -8px 20px -14px rgba(20,24,33,.12)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
