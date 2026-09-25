import { useEffect, useState } from 'react';
import { MEETING_LIST, MEETING_DETAILS, PREP_RECORDS, COMPLETED_MEETINGS, type MeetingStat } from '@/constants/signals/prototype-data';
import { Avatar } from '../alerts/assign-menu';
import { HoverTip } from '../alerts/hover-tip';
import { DetailFooterBar } from '../alerts/detail-footer-bar';
import { ConnectedEmptyHero } from '../common/connected-empty-hero';
import { CloseIcon } from '../alerts/icons';
import scrollStyles from '../alerts/alerts-scroll.module.scss';
import motion from '../alerts/motion.module.scss';

interface Props {
  meetingId: string | null;
  onCreatePresentation: () => void;
  /** Applies a filter to the meeting list — used by the empty state's category cards. */
  onFilterCategory?: (filter: { kind: 'day' | 'status' | 'clear'; value?: string }) => void;
  /** Jumps straight to a specific meeting — used by the "Previous meeting" link. */
  onOpenMeeting?: (id: string) => void;
  /** Deselects the current meeting, returning to the empty state — the panel's "Back" button. */
  onBack?: () => void;
}

export function MeetingDetailPanel({ meetingId, onCreatePresentation, onFilterCategory, onOpenMeeting, onBack }: Props) {
  const meeting = MEETING_LIST.find((m) => m.id === meetingId);
  const detail = meetingId ? MEETING_DETAILS[meetingId] : undefined;
  const record = meetingId ? PREP_RECORDS[meetingId] : undefined;
  const previousMeeting = meeting ? COMPLETED_MEETINGS.find((m) => m.account === meeting.account) : undefined;

  const [discussion, setDiscussion] = useState<string[]>(record?.discussion ?? []);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  useEffect(() => {
    setDiscussion(record?.discussion ?? []);
    setEditingIdx(null);
  }, [meetingId, record]);

  if (!meeting || !detail || !record) {
    const upcomingToday = MEETING_LIST.filter((m) => m.dateLabel.startsWith('Today'));
    const upcomingTomorrow = MEETING_LIST.filter((m) => m.dateLabel.startsWith('Tomorrow'));
    const completedToday = COMPLETED_MEETINGS.filter((m) => m.dateLabel.startsWith('Today'));

    return (
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <ConnectedEmptyHero
          title="Your meetings."
          subtitle="Here's a quick overview of your meetings. Click a category to filter the list."
          categories={[
            { key: 'today', label: 'Today', count: upcomingToday.length + completedToday.length, unit: 'meetings', color: '#77469b', onClick: () => onFilterCategory?.({ kind: 'day', value: 'today' }) },
            { key: 'tomorrow', label: 'Tomorrow', count: upcomingTomorrow.length, unit: 'meetings', color: '#5c7f9e', onClick: () => onFilterCategory?.({ kind: 'day', value: 'tomorrow' }) },
            { key: 'upcoming', label: 'Upcoming', count: MEETING_LIST.length, unit: 'meetings', color: '#b3453f', onClick: () => onFilterCategory?.({ kind: 'status', value: 'Upcoming' }) },
            { key: 'completed', label: 'Completed', count: COMPLETED_MEETINGS.length, unit: 'meetings', color: '#3f7d6a', onClick: () => onFilterCategory?.({ kind: 'status', value: 'Completed' }) },
            { key: 'all', label: 'All meetings', count: MEETING_LIST.length + COMPLETED_MEETINGS.length, unit: 'meetings', color: '#a8763f', onClick: () => onFilterCategory?.({ kind: 'clear' }) },
          ]}
        />
      </div>
    );
  }

  const updatePoint = (i: number, text: string) => setDiscussion((prev) => prev.map((p, idx) => (idx === i ? text : p)));
  const addPoint = () => { setDiscussion((prev) => [...prev, '']); setEditingIdx(discussion.length); };


  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
    <div key={meetingId} className={`${scrollStyles.sleekScroll} ${motion.contentFadeIn}`} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f2f4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178' }}>{detail.dateTimeLabel}</span>
              <HoverTip label={detail.attendees.map((a) => `${a.name}, ${a.role}`).join(' · ')}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {detail.attendees.map((a, i) => (
                    <span key={a.name} style={{ marginLeft: i === 0 ? 0 : -6, zIndex: detail.attendees.length - i, position: 'relative', display: 'flex' }}>
                      <Avatar name={a.name} size={24} vivid={i === 0} />
                    </span>
                  ))}
                </span>
              </HoverTip>
            </div>
            <div style={{ font: '600 18px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 5 }}>{meeting.title}</div>
            {previousMeeting && (
              <span
                onClick={() => onOpenMeeting?.(previousMeeting.id)}
                className={motion.pressable}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 5, font: '600 12px/1.6 Inter,sans-serif', cursor: 'pointer' }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                <span style={{ color: '#23272d' }}>Previous meeting:</span>
                <span style={{ color: '#77469b' }}>{previousMeeting.title}</span>
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M6 3.5l5 4.5-5 4.5" stroke="#77469b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            )}
          </div>
          <span onClick={onBack} className={motion.pressable} style={{ display: 'flex', flex: 'none', cursor: 'pointer', padding: 3, borderRadius: 6 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <CloseIcon size={15} color="#6b7178" />
          </span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Agenda */}
        <div>
          <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Agenda</div>
          <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#464646', marginTop: 9 }}>{detail.agenda}</div>
        </div>

        {/* Positives + Negatives */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>Positives to raise</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {record.positives.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 9 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3f7d6a', marginTop: 6, flex: 'none' }} /><span style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#464646' }}>{p}</span></div>
              ))}
            </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 8, padding: '16px 18px' }}>
            <div style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>Negatives to get ahead of</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
              {record.negatives.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 9 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b3453f', marginTop: 6, flex: 'none' }} /><span style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#464646' }}>{p}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* Discussion points — same card design as the completed-meeting MOM's Decisions section */}
        <div>
          <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Discussion points</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 11 }}>
            {discussion.map((d, i) => (
              <div key={i} style={{ display: 'flex', gap: 11, padding: '12px 14px', border: '1px solid #e6e8ec', borderRadius: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3f7d6a', marginTop: 6, flex: 'none' }} />
                {editingIdx === i ? (
                  <input
                    autoFocus
                    value={d}
                    onChange={(e) => updatePoint(i, e.target.value)}
                    onBlur={() => setEditingIdx(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setEditingIdx(null); }}
                    className={motion.focusRing}
                    style={{ flex: 1, minWidth: 0, font: '400 12px/1.6 Inter,sans-serif', color: '#464646', border: '1px solid #77469b', borderRadius: 6, padding: '4px 8px', outline: 'none' }}
                  />
                ) : (
                  <span onClick={() => setEditingIdx(i)} className={motion.rowHover} style={{ flex: 1, font: '400 12px/1.6 Inter,sans-serif', color: '#464646', cursor: 'text', padding: '3px 6px', margin: '-3px -6px', borderRadius: 5 }}>{d}</span>
                )}
              </div>
            ))}
            <div onClick={addPoint} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ padding: '11px 14px', border: '1px dashed #cfd4dc', borderRadius: 8, font: '400 12px/1 Inter,sans-serif', color: '#6b7178', cursor: 'pointer' }}>+ Add a discussion point</div>
          </div>
        </div>

        {/* Relevant alerts, actions taken and impact */}
        <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid #f1f2f4', font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>Relevant alerts, actions taken and impact</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 190px 100px', padding: '9px 16px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.06em', color: '#6b7178' }}>
            <div>ALERT</div><div>ACTION TAKEN</div><div style={{ textAlign: 'right' }}>IMPACT</div>
          </div>
          {record.actions.map((a, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 190px 100px', padding: '12px 16px', borderBottom: i < record.actions.length - 1 ? '1px solid #f1f2f4' : 'none', alignItems: 'center', font: '400 12px/1.4 Inter,sans-serif' }}>
              <div style={{ color: '#464646' }}>{a.alert}</div>
              <div>
                <div style={{ color: '#6b7178' }}>{a.action}</div>
                <div style={{ font: '400 10.5px/1.4 Inter,sans-serif', color: '#9aa0a8', marginTop: 2 }}>{a.by} · {a.date}</div>
              </div>
              <div style={{ textAlign: 'right', fontWeight: 600, color: a.impactColor, fontStyle: a.impactStyle }}>{a.impact}</div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <DetailFooterBar>
      <span onClick={onCreatePresentation} className={`${motion.pressable} ${motion.btnPrimary}`} style={{ padding: '10px 16px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>Create presentation</span>
    </DetailFooterBar>
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
