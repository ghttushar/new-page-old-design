import { useState } from 'react';
import motion from '../alerts/motion.module.scss';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Parses a "3 Nov" style due-date label back into a Date, for seeding the picker's initial month/selection. Falls back to null when the label isn't a recognizable date (e.g. "No due date"). */
function parseDueLabel(due: string): Date | null {
  const m = due.match(/^(\d{1,2})\s+([A-Za-z]{3,})/);
  if (!m) return null;
  const day = parseInt(m[1], 10);
  const monthIdx = MONTHS_SHORT.findIndex((name) => name.toLowerCase() === m[2].slice(0, 3).toLowerCase());
  if (monthIdx === -1) return null;
  return new Date(new Date().getFullYear(), monthIdx, day);
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

interface Props {
  /** The task's current due label, e.g. "3 Nov" — used only to seed the initial month/selection. */
  value: string;
  onSelect: (dueLabel: string) => void;
}

export function DueDatePopover({ value, onSelect }: Props) {
  const selected = parseDueLabel(value);
  const [viewDate, setViewDate] = useState(selected ?? new Date());
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className={motion.popInTop} style={{ position: 'absolute', left: 0, top: 32, width: 236, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 14, zIndex: 50 }} onClick={(e) => e.stopPropagation()}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>{MONTHS_FULL[month]} {year}</span>
        <span style={{ display: 'flex', gap: 4 }}>
          <span
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className={motion.pressable}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 6, cursor: 'pointer', font: '700 12px/1 Inter,sans-serif', color: '#6b7178', transition: 'background 120ms ease-out' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >‹</span>
          <span
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className={motion.pressable}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 6, cursor: 'pointer', font: '700 12px/1 Inter,sans-serif', color: '#6b7178', transition: 'background 120ms ease-out' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >›</span>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginTop: 10 }}>
        {WEEKDAYS.map((w, i) => (
          <span key={i} style={{ textAlign: 'center', padding: '2px 0 6px', font: '600 9.5px/1 Inter,sans-serif', color: '#9aa0a8' }}>{w}</span>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <span key={i} />;
          const cellDate = new Date(year, month, d);
          const isSelected = selected ? isSameDay(cellDate, selected) : false;
          const isToday = isSameDay(cellDate, today);
          const isDisabled = cellDate < todayStart;
          return (
            <span
              key={i}
              onClick={() => { if (!isDisabled) onSelect(`${d} ${MONTHS_SHORT[month]}`); }}
              className={isDisabled ? undefined : motion.pressable}
              style={{
                textAlign: 'center', padding: '6px 0', borderRadius: 6, font: '500 11px/1 Inter,sans-serif',
                color: isDisabled ? '#c7cbd1' : isSelected ? '#fff' : '#464646',
                background: isSelected ? '#77469b' : 'transparent',
                boxShadow: !isSelected && isToday ? 'inset 0 0 0 1px #c9b6dd' : 'none',
                cursor: isDisabled ? 'not-allowed' : 'pointer', transition: 'background 120ms ease-out',
              }}
              onMouseEnter={(e) => { if (!isSelected && !isDisabled) e.currentTarget.style.background = '#f6f4fa'; }}
              onMouseLeave={(e) => { if (!isSelected && !isDisabled) e.currentTarget.style.background = 'transparent'; }}
            >
              {d}
            </span>
          );
        })}
      </div>
    </div>
  );
}
