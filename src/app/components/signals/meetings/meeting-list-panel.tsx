import { useMemo, useState } from 'react';
import { MEETING_LIST, COMPLETED_MEETINGS } from '@/constants/signals/prototype-data';
import motion from '../alerts/motion.module.scss';

interface Props {
  selectedMeetingId: string | null;
  onSelectMeeting: (id: string) => void;
}

export function MeetingListPanel({ selectedMeetingId, onSelectMeeting }: Props) {
  const [search, setSearch] = useState('');

  const q = search.trim().toLowerCase();
  const upcoming = useMemo(() => {
    if (!q) return MEETING_LIST;
    return MEETING_LIST.filter((m) => (m.title + ' ' + m.account).toLowerCase().includes(q));
  }, [q]);
  const completed = useMemo(() => {
    if (!q) return COMPLETED_MEETINGS;
    return COMPLETED_MEETINGS.filter((m) => (m.title + ' ' + m.account).toLowerCase().includes(q));
  }, [q]);

  return (
    <div style={{ flex: '0 0 35%', maxWidth: '35%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #e6e8ec', flex: 'none' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search meetings or accounts"
          className={motion.focusRing}
          style={{ width: '100%', padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {upcoming.length === 0 && completed.length === 0 && (
          <div style={{ padding: '30px 20px', textAlign: 'center', font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>No meetings match.</div>
        )}
        {upcoming.map((m) => {
          const isSelected = selectedMeetingId === m.id;
          const allDone = m.tasksTotal > 0 && m.tasksCompleted === m.tasksTotal;
          return (
            <div
              key={m.id}
              onClick={() => onSelectMeeting(m.id)}
              className={`${motion.rowHover} ${motion.cardHover}`}
              style={{ margin: '10px 12px', padding: '14px 16px', border: '1px solid #eceef1', borderLeft: isSelected ? '3px solid #77469b' : '1px solid #eceef1', borderRadius: 10, background: isSelected ? '#f9f7fc' : 'transparent', boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#464646' }}>{m.timeRange}</span>
                <span style={{ marginLeft: 'auto', font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>{m.dateLabel}</span>
              </div>
              <div style={{ font: `${isSelected ? '600' : '500'} 13px/1.45 Inter,sans-serif`, color: '#23272d', marginTop: 9 }}>{m.title}</div>
              <div style={{ marginTop: 9, font: '600 11px/1 Inter,sans-serif', color: allDone ? '#3f7d6a' : '#a8763f' }}>
                {m.tasksCompleted}/{m.tasksTotal} task{m.tasksTotal === 1 ? '' : 's'} completed
              </div>
            </div>
          );
        })}
        {completed.map((m) => {
          const isSelected = selectedMeetingId === m.id;
          return (
            <div
              key={m.id}
              onClick={() => onSelectMeeting(m.id)}
              className={`${motion.rowHover} ${motion.cardHover}`}
              style={{ margin: '10px 12px', padding: '14px 16px', border: '1px solid #eceef1', borderLeft: isSelected ? '3px solid #77469b' : '1px solid #eceef1', borderRadius: 10, background: isSelected ? '#f9f7fc' : 'transparent', boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#464646' }}>{m.timeRange}</span>
                <span style={{ padding: '2px 7px', borderRadius: 4, background: m.momColor + '1a', font: '600 10px/1.5 Inter,sans-serif', color: m.momColor }}>{m.momStatus}</span>
                <span style={{ marginLeft: 'auto', font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>{m.dateLabel}</span>
              </div>
              <div style={{ font: `${isSelected ? '600' : '500'} 13px/1.45 Inter,sans-serif`, color: '#23272d', marginTop: 9 }}>{m.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
