import { useEffect, useState } from 'react';
import { MEETING_LIST, MEETING_DETAILS, PREP_RECORDS } from '@/constants/signals/prototype-data';
import { StatCard } from './meeting-detail-panel';
import { BackArrowIcon, CloseIcon } from '../alerts/icons';
import motion from '../alerts/motion.module.scss';

interface Props {
  meetingId: string | null;
  onBack: () => void;
  onCreatePresentation: () => void;
}

export function MeetingPrep({ meetingId, onBack, onCreatePresentation }: Props) {
  const meeting = MEETING_LIST.find((m) => m.id === meetingId);
  const detail = meetingId ? MEETING_DETAILS[meetingId] : undefined;
  const record = meetingId ? PREP_RECORDS[meetingId] : undefined;

  const [discussion, setDiscussion] = useState<string[]>(record?.discussion ?? []);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  useEffect(() => {
    setDiscussion(record?.discussion ?? []);
    setEditingIdx(null);
  }, [meetingId, record]);

  if (!meeting || !detail || !record) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ font: '400 13px/1.6 Inter,sans-serif', color: '#6b7178' }}>Select a meeting to prepare for.</div>
      </div>
    );
  }

  const updatePoint = (i: number, text: string) => setDiscussion((prev) => prev.map((p, idx) => (idx === i ? text : p)));
  const removePoint = (i: number) => setDiscussion((prev) => prev.filter((_, idx) => idx !== i));
  const addPoint = () => { setDiscussion((prev) => [...prev, '']); setEditingIdx(discussion.length); };

  return (
    <div key={meetingId} className={motion.contentFadeIn} style={{ height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center', paddingTop: 18 }}>
      <div style={{ maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span onClick={onBack} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', gap: 6, font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>
            <BackArrowIcon size={12} color="#77469b" /> Back to meeting
          </span>
          <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>· {meeting.account} {meeting.title}, {meeting.dateLabel.toLowerCase()} {meeting.timeRange.split(' – ')[0]}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12 }}>
          <div>
            <div style={{ font: '600 20px/1.35 Inter,sans-serif', color: '#23272d' }}>Preparation summary</div>
            <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>Built from {record.actions.length} linked alert{record.actions.length === 1 ? '' : 's'} and this week's metrics.</div>
          </div>
          <span onClick={onCreatePresentation} className={motion.pressable} style={{ padding: '11px 17px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 13px/1 Inter,sans-serif', cursor: 'pointer' }}>Create presentation</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
          {/* Account performance */}
          <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: '18px 20px' }}>
            <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Account performance</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 13 }}>
              {detail.metrics.map((s) => <StatCard key={s.label} stat={s} />)}
            </div>
          </div>

          {/* Positives + Negatives */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Positives to raise</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 13 }}>
                {record.positives.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3f7d6a', marginTop: 6, flex: 'none' }} /><span style={{ font: '400 13px/1.7 Inter,sans-serif', color: '#464646' }}>{p}</span></div>
                ))}
              </div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Negatives to get ahead of</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 13 }}>
                {record.negatives.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b3453f', marginTop: 6, flex: 'none' }} /><span style={{ font: '400 13px/1.7 Inter,sans-serif', color: '#464646' }}>{p}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions table */}
          <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f2f4', font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Relevant alerts, actions taken and impact</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 190px 110px 110px', padding: '9px 20px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', font: '600 9px/1 Inter,sans-serif', letterSpacing: '0.06em', color: '#6b7178' }}>
              <div>ALERT</div><div>ACTION TAKEN</div><div style={{ textAlign: 'right' }}>IMPACT</div><div style={{ textAlign: 'right' }}>STATE</div>
            </div>
            {record.actions.map((a, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 190px 110px 110px', padding: '12px 20px', borderBottom: i < record.actions.length - 1 ? '1px solid #f1f2f4' : 'none', alignItems: 'center', font: '400 12px/1.5 Inter,sans-serif' }}>
                <div style={{ color: '#464646' }}>{a.alert}</div>
                <div style={{ color: '#6b7178' }}>{a.action}</div>
                <div style={{ textAlign: 'right', fontWeight: 600, color: a.impactColor, fontStyle: a.impactStyle }}>{a.impact}</div>
                <div style={{ textAlign: 'right', color: a.stateColor }}>{a.state}</div>
              </div>
            ))}
          </div>

          {/* Discussion points — genuinely editable */}
          <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Discussion points</span>
              <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Add or remove your own</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 13 }}>
              {discussion.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', border: '1px solid #e6e8ec', borderRadius: 8 }}>
                  <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178', width: 12, flex: 'none' }}>{i + 1}</span>
                  {editingIdx === i ? (
                    <input
                      autoFocus
                      value={d}
                      onChange={(e) => updatePoint(i, e.target.value)}
                      onBlur={() => setEditingIdx(null)}
                      onKeyDown={(e) => { if (e.key === 'Enter') setEditingIdx(null); }}
                      style={{ flex: 1, minWidth: 0, font: '400 13px/1.6 Inter,sans-serif', color: '#464646', border: '1px solid #77469b', borderRadius: 6, padding: '4px 8px', outline: 'none' }}
                    />
                  ) : (
                    <span style={{ flex: 1, font: '400 13px/1.6 Inter,sans-serif', color: '#464646' }}>{d}</span>
                  )}
                  <span onClick={() => setEditingIdx(i)} className={motion.pressable} style={{ font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer', flex: 'none' }}>Edit</span>
                  <span onClick={() => removePoint(i)} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer', flex: 'none' }}><CloseIcon size={11} /></span>
                </div>
              ))}
              <div onClick={addPoint} className={motion.pressable} style={{ padding: '11px 13px', border: '1px dashed #cfd4dc', borderRadius: 8, font: '400 13px/1 Inter,sans-serif', color: '#6b7178', cursor: 'pointer' }}>+ Add a discussion point</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
