import { useEffect, useState } from 'react';
import { MOM_RECORDS } from '@/constants/signals/prototype-data';
import { BackArrowIcon, CheckIcon } from '../alerts/icons';
import motion from '../alerts/motion.module.scss';

interface Props {
  meetingId: string | null;
  onBackToMeetings: () => void;
  onGoWorkstation: () => void;
}

export function MeetingMOM({ meetingId, onBackToMeetings, onGoWorkstation }: Props) {
  const record = meetingId ? MOM_RECORDS[meetingId] : undefined;
  const [sent, setSent] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [summaryText, setSummaryText] = useState(record?.summary ?? '');

  useEffect(() => {
    setSent(false);
    setEditMode(false);
    setSummaryText(record?.summary ?? '');
  }, [meetingId, record?.summary]);

  if (!record) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 300 }}>
          <div style={{ font: '600 15px/1.4 Inter,sans-serif', color: '#23272d' }}>No minutes to show</div>
          <div style={{ font: '400 13px/1.7 Inter,sans-serif', color: '#6b7178', marginTop: 8 }}>Open a completed meeting from the list and choose "Verify MOM".</div>
        </div>
      </div>
    );
  }

  const isSent = record.sent || sent;

  return (
    <div key={meetingId} className={motion.contentFadeIn} style={{ height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center', paddingTop: 18 }}>
      <div style={{ maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span onClick={onBackToMeetings} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', gap: 6, font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>
            <BackArrowIcon size={12} color="#77469b" /> All meetings
          </span>
          <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>· Minutes</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', marginTop: 14 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f2f4' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ padding: '2px 7px', borderRadius: 4, background: '#eef6f3', font: '600 10px/1.5 Inter,sans-serif', color: '#3f7d6a' }}>{record.completedLabel}</span>
              <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{record.transcriptMeta}</span>
            </div>
            <div style={{ font: '600 19px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 11 }}>{record.title}</div>
            <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>{record.dateLabel}</div>
          </div>

          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Discussion summary */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Discussion summary</span>
                {!isSent && (
                  <span onClick={() => setEditMode((v) => !v)} className={motion.pressable} style={{ font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>{editMode ? 'Done editing' : 'Edit'}</span>
                )}
              </div>
              {editMode ? (
                <textarea
                  autoFocus
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  style={{ width: '100%', minHeight: 110, marginTop: 9, padding: 12, border: '1px solid #77469b', borderRadius: 7, font: '400 13px/1.8 Inter,sans-serif', color: '#464646', outline: 'none', resize: 'vertical' as const }}
                />
              ) : (
                <div style={{ font: '400 13px/1.8 Inter,sans-serif', color: '#464646', marginTop: 9 }}>{summaryText}</div>
              )}
            </div>

            {/* Decisions */}
            <div>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Decisions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 11 }}>
                {record.decisions.map((d, i) => (
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
                <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{record.tasks.length} extracted · assignees detected</span>
              </div>
              <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 11 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px 110px 110px', padding: '9px 15px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', font: '600 9px/1 Inter,sans-serif', letterSpacing: '0.06em', color: '#6b7178' }}>
                  <div>TASK</div><div>ASSIGNEE</div><div>DUE</div><div style={{ textAlign: 'right' }}>DELIVERY</div>
                </div>
                {record.tasks.map((t, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 170px 110px 110px', padding: '12px 15px', borderBottom: i < record.tasks.length - 1 ? '1px solid #f1f2f4' : 'none', alignItems: 'center', font: '400 12px/1.5 Inter,sans-serif' }}>
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
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingTop: 16, borderTop: '1px solid #f1f2f4' }}>
              {isSent ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '11px 17px', borderRadius: 7, background: '#eef6f3', color: '#3f7d6a', font: '600 13px/1 Inter,sans-serif' }}>
                  <CheckIcon size={12} color="#3f7d6a" /> Sent to client
                </span>
              ) : (
                <span onClick={() => setSent(true)} className={motion.pressable} style={{ padding: '11px 17px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 13px/1 Inter,sans-serif', cursor: 'pointer' }}>Send MOM to client</span>
              )}
              <span onClick={() => setEditMode((v) => !v)} className={motion.pressable} style={{ padding: '11px 17px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 13px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>{editMode ? 'Done editing' : 'Edit before sending'}</span>
              <span onClick={onGoWorkstation} className={motion.pressable} style={{ marginLeft: 'auto', font: '600 12px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>See my tasks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
