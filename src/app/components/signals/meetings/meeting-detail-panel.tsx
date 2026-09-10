import { useEffect, useState } from 'react';
import { MEETING_LIST, MEETING_DETAILS, PREP_RECORDS, type MeetingStat } from '@/constants/signals/prototype-data';
import { EmptyAlertGraphic } from '../alerts/empty-alert-graphic';
import { Avatar } from '../alerts/assign-menu';
import { CloseIcon } from '../alerts/icons';
import motion from '../alerts/motion.module.scss';

interface Props {
  meetingId: string | null;
  onCreatePresentation: () => void;
}

export function MeetingDetailPanel({ meetingId, onCreatePresentation }: Props) {
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
      <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10 }}>
        <div style={{ textAlign: 'center' }}>
          <EmptyAlertGraphic />
          <div style={{ font: '700 16px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 22 }}>Select a meeting</div>
          <div style={{ font: '400 12.5px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 7, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>Agenda, prep and discussion points open here.</div>
        </div>
      </div>
    );
  }

  const updatePoint = (i: number, text: string) => setDiscussion((prev) => prev.map((p, idx) => (idx === i ? text : p)));
  const removePoint = (i: number) => setDiscussion((prev) => prev.filter((_, idx) => idx !== i));
  const addPoint = () => { setDiscussion((prev) => [...prev, '']); setEditingIdx(discussion.length); };

  return (
    <div key={meetingId} className={motion.contentFadeIn} style={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10 }}>
      {/* Header */}
      <div style={{ padding: '22px 24px', borderBottom: '1px solid #f1f2f4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{detail.dateTimeLabel}</div>
            <div style={{ font: '600 21px/1.35 Inter,sans-serif', color: '#23272d', marginTop: 9 }}>{meeting.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 9 }}>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                {detail.attendees.map((a, i) => (
                  <span key={a.name} style={{ marginLeft: i === 0 ? 0 : -6, zIndex: detail.attendees.length - i, position: 'relative', display: 'flex' }}>
                    <Avatar name={a.name} size={24} vivid={i === 0} />
                  </span>
                ))}
              </span>
              <span style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178' }}>
                {detail.attendees.map((a) => `${a.name}, ${a.role}`).join(' · ')} · {detail.lastMet}
              </span>
            </div>
          </div>
          <div style={{ flex: 'none', textAlign: 'right' }}>
            <div style={{ font: '600 22px/1 Inter,sans-serif', color: '#23272d' }}>{detail.resolvedPct}%</div>
            <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>of linked work resolved</div>
            <div style={{ width: 130, height: 4, borderRadius: 2, background: '#f1f2f4', marginTop: 9, overflow: 'hidden' }}>
              <div style={{ width: `${detail.resolvedPct}%`, height: '100%', background: detail.resolvedColor, transition: 'width 300ms ease-out' }} />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>
          <span onClick={onCreatePresentation} className={motion.pressable} style={{ padding: '11px 17px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 13px/1 Inter,sans-serif', cursor: 'pointer' }}>Create presentation</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Agenda */}
        <div>
          <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Agenda</div>
          <div style={{ font: '400 13px/1.75 Inter,sans-serif', color: '#464646', marginTop: 9 }}>{detail.agenda}</div>
        </div>

        {/* Positives + Negatives */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>Positives to raise</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {record.positives.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 9 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3f7d6a', marginTop: 6, flex: 'none' }} /><span style={{ font: '400 12.5px/1.6 Inter,sans-serif', color: '#464646' }}>{p}</span></div>
              ))}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>Negatives to get ahead of</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {record.negatives.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 9 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b3453f', marginTop: 6, flex: 'none' }} /><span style={{ font: '400 12.5px/1.6 Inter,sans-serif', color: '#464646' }}>{p}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* Discussion points — genuinely editable, click the text itself */}
        <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>Discussion points</span>
            <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Click a point to edit</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
            {discussion.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', border: '1px solid #e6e8ec', borderRadius: 8 }}>
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
                  <span onClick={() => setEditingIdx(i)} style={{ flex: 1, font: '400 13px/1.6 Inter,sans-serif', color: '#464646', cursor: 'text' }}>{d}</span>
                )}
                <span onClick={() => removePoint(i)} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer', flex: 'none' }}><CloseIcon size={11} /></span>
              </div>
            ))}
            <div onClick={addPoint} className={motion.pressable} style={{ padding: '11px 13px', border: '1px dashed #cfd4dc', borderRadius: 8, font: '400 13px/1 Inter,sans-serif', color: '#6b7178', cursor: 'pointer' }}>+ Add a discussion point</div>
          </div>
        </div>

        {/* Relevant alerts, actions taken and impact */}
        <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid #f1f2f4', font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Relevant alerts, actions taken and impact</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 190px 100px 100px', padding: '9px 16px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', font: '600 9px/1 Inter,sans-serif', letterSpacing: '0.06em', color: '#6b7178' }}>
            <div>ALERT</div><div>ACTION TAKEN</div><div style={{ textAlign: 'right' }}>IMPACT</div><div style={{ textAlign: 'right' }}>STATE</div>
          </div>
          {record.actions.map((a, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 190px 100px 100px', padding: '12px 16px', borderBottom: i < record.actions.length - 1 ? '1px solid #f1f2f4' : 'none', alignItems: 'center', font: '400 12px/1.5 Inter,sans-serif' }}>
              <div style={{ color: '#464646' }}>{a.alert}</div>
              <div style={{ color: '#6b7178' }}>{a.action}</div>
              <div style={{ textAlign: 'right', fontWeight: 600, color: a.impactColor, fontStyle: a.impactStyle }}>{a.impact}</div>
              <div style={{ textAlign: 'right', color: a.stateColor }}>{a.state}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StatCard({ stat }: { stat: MeetingStat }) {
  return (
    <div style={{ background: '#fff', padding: 15 }}>
      <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{stat.label}</div>
      <div style={{ font: '600 18px/1 Inter,sans-serif', color: '#23272d', marginTop: 8 }}>{stat.value}</div>
      <div style={{ font: '500 11px/1 Inter,sans-serif', color: stat.trendColor, marginTop: 6 }}>{stat.trend}</div>
    </div>
  );
}
