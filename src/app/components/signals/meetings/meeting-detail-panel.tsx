import { useEffect, useState } from 'react';
import { PROTOTYPE_ALERTS, MEETING_LIST, MEETING_DETAILS, type MeetingStat } from '@/constants/signals/prototype-data';
import { EmptyAlertGraphic } from '../alerts/empty-alert-graphic';
import motion from '../alerts/motion.module.scss';

interface Props {
  meetingId: string | null;
  onOpenAlert: (id: string) => void;
  onPrepare: () => void;
}

export function MeetingDetailPanel({ meetingId, onOpenAlert, onPrepare }: Props) {
  const [extraLinkedIds, setExtraLinkedIds] = useState<string[]>([]);
  const [attachOpen, setAttachOpen] = useState(false);
  const [attachSearch, setAttachSearch] = useState('');

  useEffect(() => {
    setExtraLinkedIds([]);
    setAttachOpen(false);
    setAttachSearch('');
  }, [meetingId]);

  const meeting = MEETING_LIST.find((m) => m.id === meetingId);
  const detail = meetingId ? MEETING_DETAILS[meetingId] : undefined;

  if (!meeting || !detail) {
    return (
      <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10 }}>
        <div style={{ textAlign: 'center' }}>
          <EmptyAlertGraphic />
          <div style={{ font: '700 16px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 22 }}>Select a meeting</div>
          <div style={{ font: '400 12.5px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 7, maxWidth: 280, marginLeft: 'auto', marginRight: 'auto' }}>Agenda, account study, linked alerts and preparation open here.</div>
        </div>
      </div>
    );
  }

  const linkedAlerts = PROTOTYPE_ALERTS.filter((a) => a.linkedMeetingId === meetingId || extraLinkedIds.includes(a.id));
  const q = attachSearch.trim().toLowerCase();
  const attachCandidates = PROTOTYPE_ALERTS
    .filter((a) => !linkedAlerts.some((la) => la.id === a.id))
    .filter((a) => !q || (a.title + ' ' + a.account).toLowerCase().includes(q))
    .slice(0, 30);

  return (
    <div key={meetingId} className={motion.contentFadeIn} style={{ flex: 1, minWidth: 0, height: '100%', overflowY: 'auto', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10 }}>
      {/* Header */}
      <div style={{ padding: '22px 24px', borderBottom: '1px solid #f1f2f4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{detail.dateTimeLabel}</div>
            <div style={{ font: '600 21px/1.35 Inter,sans-serif', color: '#23272d', marginTop: 9 }}>{meeting.account} · {meeting.title}</div>
            <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 6 }}>{detail.attendees}</div>
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
          <span onClick={onPrepare} className={motion.pressable} style={{ padding: '11px 17px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 13px/1 Inter,sans-serif', cursor: 'pointer' }}>Prepare for meeting</span>
          <span style={{ position: 'relative' }}>
            <span onClick={() => setAttachOpen((v) => !v)} className={motion.pressable} style={{ display: 'flex', padding: '11px 17px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 13px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Attach an alert</span>
            {attachOpen && (
              <div className={motion.popInTop} style={{ position: 'absolute', left: 0, top: 44, width: 320, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', zIndex: 40, overflow: 'hidden' }}>
                <div style={{ padding: 10, borderBottom: '1px solid #f1f2f4' }}>
                  <input
                    autoFocus
                    value={attachSearch}
                    onChange={(e) => setAttachSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Search alerts to link…"
                    style={{ width: '100%', padding: '7px 9px', border: '1px solid #dfe3ea', borderRadius: 6, font: '400 11px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
                  />
                </div>
                <div style={{ maxHeight: 220, overflowY: 'auto', padding: 6 }}>
                  {attachCandidates.map((a) => (
                    <div
                      key={a.id}
                      onClick={(e) => { e.stopPropagation(); setExtraLinkedIds((prev) => [...prev, a.id]); setAttachOpen(false); }}
                      style={{ padding: '8px 9px', borderRadius: 6, cursor: 'pointer', font: '500 12px/1.4 Inter,sans-serif', color: '#3d434b' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {a.title}
                      <span style={{ display: 'block', font: '400 10.5px/1.4 Inter,sans-serif', color: '#9aa0a8' }}>{a.account}</span>
                    </div>
                  ))}
                  {attachCandidates.length === 0 && (
                    <div style={{ padding: '14px 9px', textAlign: 'center', font: '400 11px/1.5 Inter,sans-serif', color: '#9aa0a8' }}>No matches.</div>
                  )}
                </div>
              </div>
            )}
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Agenda + Account study */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ background: '#fff', padding: 16 }}>
            <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Agenda</div>
            <div style={{ font: '400 13px/1.75 Inter,sans-serif', color: '#464646', marginTop: 9 }}>{detail.agenda}</div>
          </div>
          <div style={{ background: '#fff', padding: 16 }}>
            <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Account study</div>
            <div style={{ font: '400 13px/1.75 Inter,sans-serif', color: '#464646', marginTop: 9 }}>{detail.accountStudy}</div>
          </div>
        </div>

        {/* Metrics */}
        <div>
          <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Important metric changes</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 11 }}>
            {detail.metrics.map((s: MeetingStat) => (
              <StatCard key={s.label} stat={s} />
            ))}
          </div>
        </div>

        {/* Linked alerts */}
        <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid #f1f2f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Linked alerts</span>
            <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{linkedAlerts.length} mapped to this meeting</span>
          </div>
          {linkedAlerts.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>Nothing linked yet — use "Attach an alert" above.</div>
          )}
          {linkedAlerts.map((al, i) => (
            <div key={al.id} onClick={() => onOpenAlert(al.id)} className={motion.rowHover} style={{ padding: '13px 16px', borderBottom: i < linkedAlerts.length - 1 ? '1px solid #f1f2f4' : 'none', display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: al.priorityDot, flex: 'none' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '500 13px/1.4 Inter,sans-serif', color: '#23272d' }}>{al.title}</div>
                <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 3 }}>{al.impactStr}</div>
              </div>
              <span style={{ font: '600 13px/1 Inter,sans-serif', color: al.valueNum < 0 ? '#b3453f' : '#3f7d6a', flex: 'none' }}>{al.valueLabel}</span>
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
