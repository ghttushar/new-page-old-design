import motion from '../alerts/motion.module.scss';

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
    <div className={motion.popInTop} style={{ position: 'absolute', right: 0, top: 38, width: 260, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 14, zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>November 2025</span>
        <span style={{ display: 'flex', gap: 4, font: '700 12px/1 Inter,sans-serif', color: '#6b7178' }}>
          <span className={motion.pressable} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 6, cursor: 'pointer', transition: 'background 120ms ease-out' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>‹</span>
          <span className={motion.pressable} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 6, cursor: 'pointer', transition: 'background 120ms ease-out' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>›</span>
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginTop: 11 }}>
        {days.map((d, i) => (
          <span
            key={i}
            className={motion.pressable}
            style={{ textAlign: 'center', padding: '6px 0', borderRadius: 6, font: '500 11px/1 Inter,sans-serif', color: d.color, background: d.bg, cursor: 'pointer', transition: 'background 120ms ease-out' }}
            onMouseEnter={(e) => { if (d.bg !== '#77469b') e.currentTarget.style.background = '#f6f4fa'; }}
            onMouseLeave={(e) => { if (d.bg !== '#77469b') e.currentTarget.style.background = 'transparent'; }}
          >
            {d.n}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 7, marginTop: 13 }}>
        <span
          onClick={onToday}
          className={motion.pressable}
          style={{ flex: 1, textAlign: 'center', padding: 8, borderRadius: 6, background: '#77469b', color: '#fff', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer', transition: 'background 140ms ease-out, box-shadow 140ms ease-out' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#663d87'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(119,70,155,.28)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#77469b'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          Today
        </span>
        <span
          onClick={onThisWeek}
          className={motion.pressable}
          style={{ flex: 1, textAlign: 'center', padding: 8, borderRadius: 6, border: '1px solid #dfe3ea', font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', transition: 'background 140ms ease-out, border-color 140ms ease-out' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#f9f7fc'; e.currentTarget.style.borderColor = '#c9b6dd'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#dfe3ea'; }}
        >
          This week
        </span>
      </div>
    </div>
  );
}
