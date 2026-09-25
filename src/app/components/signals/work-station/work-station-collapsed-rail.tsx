/** Work-station's collapsed design: a minimal notch bar — no icons, no data, just a grab affordance. Distinct from Alerts' hover-overlay and Meetings' rotated label by being the simplest of the three. */
export function WorkStationCollapsedRail({ onExpand }: { onExpand: () => void }) {
  return (
    <div
      onClick={onExpand}
      title="Expand work-station"
      style={{ width: 22, flex: 'none', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
    >
      <div
        style={{ width: 5, height: 72, borderRadius: 3, background: '#d5d9e0', transition: 'background 140ms ease-out' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = '#77469b')}
        onMouseLeave={(e) => (e.currentTarget.style.background = '#d5d9e0')}
      />
    </div>
  );
}
