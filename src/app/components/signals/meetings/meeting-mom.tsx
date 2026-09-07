import { MOM_DECISIONS, MOM_TASKS } from '@/constants/signals/prototype-data';

interface Props {
  onBackToMeetings: () => void;
  onGoWorkstation: () => void;
}

export function MeetingMOM({ onBackToMeetings, onGoWorkstation }: Props) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center', paddingTop: 18 }}>
      <div style={{ maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span onClick={onBackToMeetings} style={{ font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>All meetings</span>
          <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>· Minutes</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', marginTop: 14 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f2f4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ padding: '2px 7px', borderRadius: 4, background: '#eef6f3', font: '600 10px/1.5 Inter,sans-serif', color: '#3f7d6a' }}>Completed 15:44</span>
              <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>From transcript · 44 minutes · 4 attendees</span>
            </div>
            <div style={{ font: '600 19px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 11 }}>Wellbeing Nutrition · Quarterly business review</div>
            <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>31 October 2025 · draft minutes, not yet sent</div>
          </div>

          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Discussion summary */}
            <div>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Discussion summary</div>
              <div style={{ font: '400 13px/1.8 Inter,sans-serif', color: '#464646', marginTop: 9 }}>The quarter closed ahead on GMV but short on margin, and most of the conversation was about why. We walked through the two suppressed listings, agreed the compliance issue was avoidable, and committed to a pre-flight image check before any future asset push. Priya raised concern about Q4 stock cover on the hero range; we agreed to model two scenarios before the next call. The team accepted our recommendation on bullet copy without changes.</div>
            </div>

            {/* Decisions */}
            <div>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Decisions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 11 }}>
                {MOM_DECISIONS.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 11, padding: '12px 14px', border: '1px solid #e6e8ec', borderRadius: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3f7d6a', marginTop: 6, flex: 'none' }} />
                    <span style={{ font: '400 13px/1.7 Inter,sans-serif', color: '#464646' }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Task items */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Task items</span>
                <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>4 extracted · assignees detected</span>
              </div>
              <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 11 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px 110px 110px', padding: '9px 15px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', font: '600 9px/1 Inter,sans-serif', letterSpacing: '0.06em', color: '#6b7178' }}>
                  <div>TASK</div><div>ASSIGNEE</div><div>DUE</div><div style={{ textAlign: 'right' }}>DELIVERY</div>
                </div>
                {MOM_TASKS.map((t, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 170px 110px 110px', padding: '12px 15px', borderBottom: i < MOM_TASKS.length - 1 ? '1px solid #f1f2f4' : 'none', alignItems: 'center', font: '400 12px/1.5 Inter,sans-serif' }}>
                    <div style={{ color: '#464646' }}>{t.task}</div>
                    <div style={{ color: '#6b7178' }}>{t.assignee}</div>
                    <div style={{ color: '#6b7178' }}>{t.due}</div>
                    <div style={{ textAlign: 'right', color: t.delivery === 'Work-station' ? '#5f3880' : '#6b7178' }}>{t.delivery}</div>
                  </div>
                ))}
              </div>
              <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 9 }}>Assignees outside Anarix receive their task by email; Anarix users see it in their Work-station.</div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingTop: 4, borderTop: '1px solid #f1f2f4' }}>
              <span style={{ padding: '11px 17px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 13px/1 Inter,sans-serif', marginTop: 16 }}>Send MOM to client</span>
              <span style={{ padding: '11px 17px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 13px/1 Inter,sans-serif', color: '#3d434b', marginTop: 16 }}>Edit before sending</span>
              <span onClick={onGoWorkstation} style={{ marginLeft: 'auto', font: '600 12px/1 Inter,sans-serif', color: '#77469b', marginTop: 16, cursor: 'pointer' }}>See my tasks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
