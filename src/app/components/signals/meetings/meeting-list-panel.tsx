import { useState } from 'react';
import { MEETING_LIST, COMPLETED_MEETINGS } from '@/constants/signals/prototype-data';

interface Props {
  selectedMeetingId: string | null;
  onSelectMeeting: (id: string) => void;
}

export function MeetingListPanel({ selectedMeetingId, onSelectMeeting }: Props) {
  const [meetTab, setMeetTab] = useState<'upcoming' | 'done'>('upcoming');

  return (
    <div style={{ width: 490, flex: 'none', height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #e6e8ec', display: 'flex', flexDirection: 'column', gap: 10, flex: 'none' }}>
        <div style={{ padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#6b7178' }}>Search meetings, accounts, attendees</div>
        <div style={{ display: 'flex', gap: 7 }}>
          <span style={{ padding: '8px 11px', border: '1px solid #dfe3ea', borderRadius: 6, font: '500 11px/1 Inter,sans-serif', color: '#3d434b' }}>Type: needs discussion</span>
          <span style={{ padding: '8px 11px', border: '1px solid #dfe3ea', borderRadius: 6, font: '500 11px/1 Inter,sans-serif', color: '#3d434b' }}>1 – 8 Nov</span>
        </div>
        <div style={{ display: 'flex', gap: 5 }}>
          <span onClick={() => setMeetTab('upcoming')} style={{ padding: '7px 12px', borderRadius: 6, border: '1px solid #dfe3ea', background: meetTab === 'upcoming' ? '#f1ebf7' : '#fff', color: meetTab === 'upcoming' ? '#23272d' : '#6b7178', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer' }}>Upcoming</span>
          <span onClick={() => setMeetTab('done')} style={{ padding: '7px 12px', borderRadius: 6, border: '1px solid #dfe3ea', background: meetTab === 'done' ? '#f1ebf7' : '#fff', color: meetTab === 'done' ? '#23272d' : '#6b7178', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer' }}>Completed</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {meetTab === 'upcoming' ? (
          <>
            {['Today', 'Monday · 3 November'].map((dateLabel, di) => (
              <div key={di}>
                <div style={{ padding: '9px 16px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6b7178' }}>{dateLabel}</div>
                {MEETING_LIST.filter((m) => m.dateLabel === dateLabel).map((m) => {
                  const isSelected = selectedMeetingId === m.id;
                  return (
                    <div key={m.id} onClick={() => onSelectMeeting(m.id)} style={{ padding: '15px 16px', borderBottom: '1px solid #f1f2f4', background: isSelected ? '#f9f7fc' : '#fff', borderLeft: isSelected ? '2px solid #77469b' : 'none', cursor: 'pointer' }}>
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
                        <div style={{ width: `${m.progress}%`, height: '100%', background: m.progressColor }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                        <span style={{ padding: '7px 12px', border: '1px solid #dfe3ea', borderRadius: 6, background: '#fff', font: '600 11px/1 Inter,sans-serif', color: '#3d434b' }}>Details</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </>
        ) : (
          <>
            {COMPLETED_MEETINGS.map((m) => {
              const isSelected = selectedMeetingId === m.id;
              return (
                <div key={m.id} onClick={() => onSelectMeeting(m.id)} style={{ padding: '15px 16px', borderBottom: '1px solid #f1f2f4', background: isSelected ? '#f9f7fc' : '#fff', borderLeft: isSelected ? '2px solid #77469b' : 'none', cursor: 'pointer' }}>
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
                    <span style={{ padding: '7px 12px', borderRadius: 6, background: '#77469b', color: '#fff', font: '600 11px/1 Inter,sans-serif' }}>Verify MOM</span>
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
