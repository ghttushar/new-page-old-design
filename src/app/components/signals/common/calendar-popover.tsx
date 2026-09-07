interface Props {
  onToday: () => void;
  onThisWeek: () => void;
  onClose: () => void;
}

export function CalendarPopover({ onToday, onThisWeek }: Props) {
  const days = [];
  for (let i = 1; i <= 30; i++) {
    days.push({ n: i, color: i === 1 ? '#fff' : '#464646', bg: i === 1 ? '#77469b' : 'transparent' });
  }

  return (
    <div style={{ position: 'absolute', right: 0, top: 38, width: 260, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 14, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>November 2025</span>
        <span style={{ display: 'flex', gap: 10, font: '700 12px/1 Inter,sans-serif', color: '#6b7178' }}>
          <span style={{ cursor: 'pointer' }}>‹</span>
          <span style={{ cursor: 'pointer' }}>›</span>
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginTop: 11 }}>
        {days.map((d, i) => (
          <span key={i} style={{ textAlign: 'center', padding: '6px 0', borderRadius: 6, font: '500 11px/1 Inter,sans-serif', color: d.color, background: d.bg }}>{d.n}</span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 7, marginTop: 13 }}>
        <span onClick={onToday} style={{ flex: 1, textAlign: 'center', padding: 8, borderRadius: 6, background: '#77469b', color: '#fff', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer' }}>Today</span>
        <span onClick={onThisWeek} style={{ flex: 1, textAlign: 'center', padding: 8, borderRadius: 6, border: '1px solid #dfe3ea', font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>This week</span>
      </div>
    </div>
  );
}
