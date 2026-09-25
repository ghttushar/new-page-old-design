/**
 * Alerts' collapsed design: the "Claude concept" — dragged past its minimum, the column shrinks to
 * a thin sliver (this component) that sits behind the detail panel; hovering it brings the real
 * list back as a floating overlay on top of detail (see the hover orchestration in
 * signals-page.tsx, which swaps this sliver for the real `AlertListPanel` on mouse-enter).
 */
export function AlertsCollapsedSliver() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 4, height: 64, borderRadius: 3, background: '#d5d9e0' }} />
    </div>
  );
}
