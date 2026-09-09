import { useMemo, useState } from 'react';
import { MEETING_LIST, COMPLETED_MEETINGS } from '@/constants/signals/prototype-data';
import motion from '../alerts/motion.module.scss';

interface Props {
  selectedMeetingId: string | null;
  onSelectMeeting: (id: string) => void;
  onVerifyMom: (id: string) => void;
}

export function MeetingListPanel({ selectedMeetingId, onSelectMeeting, onVerifyMom }: Props) {
  const [meetTab, setMeetTab] = useState<'upcoming' | 'done'>('upcoming');
  const [search, setSearch] = useState('');
  const [needsDiscussionOnly, setNeedsDiscussionOnly] = useState(false);

  const q = search.trim().toLowerCase();
  const upcoming = useMemo(() => {
    return MEETING_LIST.filter((m) => {
      if (needsDiscussionOnly && m.readiness === 'Ready') return false;
      if (!q) return true;
      return (m.title + ' ' + m.account).toLowerCase().includes(q);
    });
  }, [q, needsDiscussionOnly]);
  const completed = useMemo(() => {
    if (!q) return COMPLETED_MEETINGS;
    return COMPLETED_MEETINGS.filter((m) => (m.title + ' ' + m.account).toLowerCase().includes(q));
  }, [q]);

  return (
    <div style={{ flex: '0 0 35%', maxWidth: '35%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #e6e8ec', display: 'flex', flexDirection: 'column', gap: 10, flex: 'none' }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search meetings or accounts"
          style={{ padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: 7 }}>
          <span
            onClick={() => setNeedsDiscussionOnly((v) => !v)}
            className={motion.pressable}
            style={{ padding: '8px 11px', border: `1px solid ${needsDiscussionOnly ? '#77469b' : '#dfe3ea'}`, borderRadius: 6, background: needsDiscussionOnly ? '#f9f7fc' : '#fff', font: '500 11px/1 Inter,sans-serif', color: needsDiscussionOnly ? '#5f3880' : '#3d434b', cursor: 'pointer' }}
          >
            Needs discussion only
          </span>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          <span onClick={() => setMeetTab('upcoming')} className={motion.pressable} style={{ padding: '7px 12px', borderRadius: 6, border: '1px solid #dfe3ea', background: meetTab === 'upcoming' ? '#f1ebf7' : '#fff', color: meetTab === 'upcoming' ? '#23272d' : '#6b7178', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer' }}>Upcoming</span>
          <span onClick={() => setMeetTab('done')} className={motion.pressable} style={{ padding: '7px 12px', borderRadius: 6, border: '1px solid #dfe3ea', background: meetTab === 'done' ? '#f1ebf7' : '#fff', color: meetTab === 'done' ? '#23272d' : '#6b7178', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer' }}>Completed</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {meetTab === 'upcoming' ? (
          <>
            {upcoming.length === 0 && (
              <div style={{ padding: '30px 20px', textAlign: 'center', font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>No meetings match.</div>
            )}
            {['Today', 'Monday · 3 November'].map((dateLabel, di) => {
              const rows = upcoming.filter((m) => m.dateLabel === dateLabel);
              if (rows.length === 0) return null;
              return (
                <div key={di}>
                  <div style={{ padding: '9px 16px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6b7178' }}>{dateLabel}</div>
                  {rows.map((m) => {
                    const isSelected = selectedMeetingId === m.id;
                    return (
                      <div key={m.id} onClick={() => onSelectMeeting(m.id)} className={motion.rowHover} style={{ padding: '15px 16px', borderBottom: '1px solid #f1f2f4', background: isSelected ? '#f9f7fc' : 'transparent', borderLeft: isSelected ? '2px solid #77469b' : 'none', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                          <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#464646' }}>{m.timeRange}</span>
                          <span style={{ padding: '2px 7px', borderRadius: 4, background: '#f1f2f4', font: '600 10px/1.5 Inter,sans-serif', color: '#5c636e' }}>{m.account}</span>
                          <span style={{ marginLeft: 'auto', font: '500 11px/1 Inter,sans-serif', color: m.readinessColor }}>{m.readiness}</span>
                        </div>
                        <div style={{ font: `${isSelected ? '600' : '500'} 13px/1.45 Inter,sans-serif`, color: '#23272d', marginTop: 9 }}>{m.title}</div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 7, font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>
                          <span>{m.alertsMapped} alerts mapped</span>
                          <span>{m.tasksOpen} tasks open</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 2, background: '#f1f2f4', marginTop: 9, overflow: 'hidden' }}>
                          <div style={{ width: `${m.progress}%`, height: '100%', background: m.progressColor, transition: 'width 300ms ease-out' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                          <span onClick={(e) => { e.stopPropagation(); onSelectMeeting(m.id); }} className={motion.pressable} style={{ padding: '7px 12px', border: '1px solid #dfe3ea', borderRadius: 6, background: '#fff', font: '600 11px/1 Inter,sans-serif', color: '#3d434b' }}>Details</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </>
        ) : (
          <>
            {completed.length === 0 && (
              <div style={{ padding: '30px 20px', textAlign: 'center', font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>No meetings match.</div>
            )}
            {completed.map((m) => {
              const isSelected = selectedMeetingId === m.id;
              return (
                <div key={m.id} onClick={() => onVerifyMom(m.id)} className={motion.rowHover} style={{ padding: '15px 16px', borderBottom: '1px solid #f1f2f4', background: isSelected ? '#f9f7fc' : 'transparent', borderLeft: isSelected ? '2px solid #77469b' : 'none', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#464646' }}>{m.timeRange}</span>
                    <span style={{ padding: '2px 7px', borderRadius: 4, background: '#f1f2f4', font: '600 10px/1.5 Inter,sans-serif', color: '#5c636e' }}>{m.account}</span>
                    <span style={{ padding: '2px 7px', borderRadius: 4, background: '#eef6f3', font: '600 10px/1.5 Inter,sans-serif', color: m.statusColor }}>{m.status}</span>
                    <span style={{ marginLeft: 'auto', font: '500 11px/1 Inter,sans-serif', color: m.momColor }}>{m.momStatus}</span>
                  </div>
                  <div style={{ font: '600 13px/1.45 Inter,sans-serif', color: '#23272d', marginTop: 9 }}>{m.title}</div>
                  <div style={{ display: 'flex', gap: 16, marginTop: 7, font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>
                    <span>{m.alertsMapped} alerts mapped</span>
                    <span>{m.tasksExtracted} tasks extracted</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: '#f1f2f4', marginTop: 9, overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', background: '#3f7d6a' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                    <span onClick={(e) => { e.stopPropagation(); onVerifyMom(m.id); }} className={motion.pressable} style={{ padding: '7px 12px', borderRadius: 6, background: '#77469b', color: '#fff', font: '600 11px/1 Inter,sans-serif' }}>Verify MOM</span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
