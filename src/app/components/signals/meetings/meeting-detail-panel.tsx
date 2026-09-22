import { useEffect, useState } from 'react';
import { MEETING_LIST, MEETING_DETAILS, PREP_RECORDS, COMPLETED_MEETINGS, type MeetingStat, type MomTaskItem } from '@/constants/signals/prototype-data';
import { Avatar, AssignDropdownList, DEFAULT_ASSIGNEES } from '../alerts/assign-menu';
import { HoverTip } from '../alerts/hover-tip';
import { CloseIcon, AssignIcon } from '../alerts/icons';
import { DetailFooterBar } from '../alerts/detail-footer-bar';
import { SignalsEmptyState } from '../common/signals-empty-state';
import scrollStyles from '../alerts/alerts-scroll.module.scss';
import motion from '../alerts/motion.module.scss';

interface Props {
  meetingId: string | null;
  onCreatePresentation: () => void;
  /** Applies a filter to the meeting list — used by the empty state's category cards. */
  onFilterCategory?: (filter: { kind: 'day' | 'status' | 'mom' | 'clear'; value?: string }) => void;
}

function CalendarGlyphIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="10.5" rx="1.5" stroke={color} strokeWidth="1.4" />
      <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function MeetingDetailPanel({ meetingId, onCreatePresentation, onFilterCategory }: Props) {
  const meeting = MEETING_LIST.find((m) => m.id === meetingId);
  const detail = meetingId ? MEETING_DETAILS[meetingId] : undefined;
  const record = meetingId ? PREP_RECORDS[meetingId] : undefined;

  const [discussion, setDiscussion] = useState<string[]>(record?.discussion ?? []);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [tasks, setTasks] = useState<MomTaskItem[]>(record?.tasks ?? []);
  const [taskEditCell, setTaskEditCell] = useState<{ idx: number; field: 'task' | 'due' } | null>(null);
  const [assignOpenIdx, setAssignOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    setDiscussion(record?.discussion ?? []);
    setEditingIdx(null);
    setTasks(record?.tasks ?? []);
    setTaskEditCell(null);
    setAssignOpenIdx(null);
  }, [meetingId, record]);

  if (!meeting || !detail || !record) {
    const upcomingToday = MEETING_LIST.filter((m) => m.dateLabel.startsWith('Today'));
    const upcomingTomorrow = MEETING_LIST.filter((m) => m.dateLabel.startsWith('Tomorrow'));
    const completedToday = COMPLETED_MEETINGS.filter((m) => m.dateLabel.startsWith('Today'));
    const needsMom = COMPLETED_MEETINGS.filter((m) => m.momStatus !== 'MOM sent');

    return (
      <div style={{ flex: 1, minWidth: 0, minHeight: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <SignalsEmptyState
          icon={<CalendarGlyphIcon color="#77469b" />}
          title="Select a meeting to view details"
          subtitle="Here's a quick overview of your meetings. Click a category to filter the list."
          categories={[
            { key: 'today', label: 'Today', count: upcomingToday.length + completedToday.length, unit: 'meetings', color: '#77469b', onClick: () => onFilterCategory?.({ kind: 'day', value: 'today' }) },
            { key: 'tomorrow', label: 'Tomorrow', count: upcomingTomorrow.length, unit: 'meetings', color: '#5c7f9e', onClick: () => onFilterCategory?.({ kind: 'day', value: 'tomorrow' }) },
            { key: 'upcoming', label: 'Upcoming', count: MEETING_LIST.length, unit: 'meetings', color: '#b3453f', onClick: () => onFilterCategory?.({ kind: 'status', value: 'Upcoming' }) },
            { key: 'completed', label: 'Completed', count: COMPLETED_MEETINGS.length, unit: 'meetings', color: '#3f7d6a', onClick: () => onFilterCategory?.({ kind: 'status', value: 'Completed' }) },
            { key: 'needs-mom', label: 'Needs MOM', count: needsMom.length, unit: 'meetings', color: '#a8763f', onClick: () => onFilterCategory?.({ kind: 'mom', value: 'MOM unsent' }) },
            { key: 'all', label: 'All meetings', count: MEETING_LIST.length + COMPLETED_MEETINGS.length, unit: 'meetings', color: '#0071ce', onClick: () => onFilterCategory?.({ kind: 'clear' }) },
          ]}
        />
      </div>
    );
  }

  const updatePoint = (i: number, text: string) => setDiscussion((prev) => prev.map((p, idx) => (idx === i ? text : p)));
  const removePoint = (i: number) => setDiscussion((prev) => prev.filter((_, idx) => idx !== i));
  const addPoint = () => { setDiscussion((prev) => [...prev, '']); setEditingIdx(discussion.length); };

  const updateTask = (i: number, patch: Partial<MomTaskItem>) => setTasks((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  const addTask = () => {
    setTasks((prev) => [...prev, { task: '', assignee: 'Unassigned', due: 'Set date', status: 'Work-station' }]);
    setTaskEditCell({ idx: tasks.length, field: 'task' });
  };

  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
    <div key={meetingId} className={`${scrollStyles.sleekScroll} ${motion.contentFadeIn}`} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f2f4' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{detail.dateTimeLabel}</div>
            <div style={{ font: '600 18px/1.35 Inter,sans-serif', color: '#23272d', marginTop: 9 }}>{meeting.title}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 9 }}>
              <HoverTip label={detail.attendees.map((a) => `${a.name}, ${a.role}`).join(' · ')}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  {detail.attendees.map((a, i) => (
                    <span key={a.name} style={{ marginLeft: i === 0 ? 0 : -6, zIndex: detail.attendees.length - i, position: 'relative', display: 'flex' }}>
                      <Avatar name={a.name} size={24} vivid={i === 0} />
                    </span>
                  ))}
                </span>
              </HoverTip>
              <span style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178' }}>{detail.lastMet}</span>
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

        {/* Discussion points — genuinely editable, click the text itself */}
        <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>Discussion points</span>
            <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Click a point to edit</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
            {discussion.map((d, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 12px', border: '1px solid #e6e8ec', borderRadius: 8, transition: 'box-shadow 140ms ease-out' }}>
                <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178', width: 12, flex: 'none' }}>{i + 1}</span>
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
                <span onClick={() => removePoint(i)} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer', flex: 'none' }}><CloseIcon size={11} /></span>
              </div>
            ))}
            <div onClick={addPoint} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ padding: '11px 13px', border: '1px dashed #cfd4dc', borderRadius: 8, font: '400 12px/1 Inter,sans-serif', color: '#6b7178', cursor: 'pointer' }}>+ Add a discussion point</div>
          </div>
        </div>

        {/* Task items — same extracted/editable card as the completed-meeting MOM */}
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Task items</span>
            <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{tasks.length} extracted · assignees detected</span>
          </div>
          <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 11 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 170px 100px 110px', padding: '9px 15px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.06em', color: '#6b7178' }}>
              <div>TASK</div><div>ASSIGN</div><div>DUE</div><div style={{ textAlign: 'right' as const }}>STATUS</div>
            </div>
            {tasks.map((t, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 170px 100px 110px', padding: '10px 15px', borderBottom: i < tasks.length - 1 ? '1px solid #f1f2f4' : 'none', alignItems: 'center', font: '400 12px/1.4 Inter,sans-serif' }}>
                {taskEditCell?.idx === i && taskEditCell.field === 'task' ? (
                  <input
                    autoFocus
                    value={t.task}
                    onChange={(e) => updateTask(i, { task: e.target.value })}
                    onBlur={() => setTaskEditCell(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setTaskEditCell(null); }}
                    className={motion.focusRing}
                    style={{ minWidth: 0, font: '400 12px/1.4 Inter,sans-serif', color: '#464646', border: '1px solid #77469b', borderRadius: 6, padding: '4px 7px', outline: 'none' }}
                  />
                ) : (
                  <span onClick={() => setTaskEditCell({ idx: i, field: 'task' })} className={motion.rowHover} style={{ color: t.task ? '#464646' : '#9aa0a8', cursor: 'text', padding: '3px 6px', margin: '-3px -6px', borderRadius: 5 }}>{t.task || 'Untitled task'}</span>
                )}
                <span style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    onClick={() => setAssignOpenIdx(assignOpenIdx === i ? null : i)}
                    className={motion.pressable}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 6, color: '#6b7178', cursor: 'pointer', flex: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <AssignIcon size={12} />
                  </span>
                  <span style={{ color: '#6b7178', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{t.assignee}</span>
                  {assignOpenIdx === i && (
                    <div className={motion.popIn} style={{ position: 'absolute', left: 0, top: 26, width: 200, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 50 }}>
                      <AssignDropdownList assignees={DEFAULT_ASSIGNEES} onSelect={(a) => { updateTask(i, { assignee: a.name }); setAssignOpenIdx(null); }} />
                    </div>
                  )}
                </span>
                {taskEditCell?.idx === i && taskEditCell.field === 'due' ? (
                  <input
                    autoFocus
                    value={t.due}
                    onChange={(e) => updateTask(i, { due: e.target.value })}
                    onBlur={() => setTaskEditCell(null)}
                    onKeyDown={(e) => { if (e.key === 'Enter') setTaskEditCell(null); }}
                    className={motion.focusRing}
                    style={{ minWidth: 0, font: '400 12px/1.4 Inter,sans-serif', color: '#464646', border: '1px solid #77469b', borderRadius: 6, padding: '4px 7px', outline: 'none' }}
                  />
                ) : (
                  <span onClick={() => setTaskEditCell({ idx: i, field: 'due' })} className={motion.rowHover} style={{ color: '#6b7178', cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' as const, textUnderlineOffset: 2, padding: '3px 6px', margin: '-3px -6px', borderRadius: 5 }}>{t.due}</span>
                )}
                <div style={{ textAlign: 'right' as const }}>
                  <select
                    value={t.status}
                    onChange={(e) => updateTask(i, { status: e.target.value })}
                    className={motion.focusRing}
                    style={{ font: '600 12px/1 Inter,sans-serif', color: t.status === 'Work-station' ? '#5f3880' : '#6b7178', border: '1px solid transparent', borderRadius: 6, background: 'transparent', padding: '4px 6px', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value="Work-station">Work-station</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>
            ))}
            <div onClick={addTask} className={`${motion.pressable} ${motion.rowHover}`} style={{ padding: '11px 15px', borderTop: tasks.length > 0 ? '1px solid #f1f2f4' : 'none', font: '400 12px/1 Inter,sans-serif', color: '#6b7178', cursor: 'pointer' }}>+ Add a task</div>
          </div>
          <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 9 }}>Assignees outside Anarix receive their task by email; Anarix users see it in their Work-station.</div>
        </div>

        {/* Relevant alerts, actions taken and impact */}
        <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px', borderBottom: '1px solid #f1f2f4', font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>Relevant alerts, actions taken and impact</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 190px 100px 100px', padding: '9px 16px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.06em', color: '#6b7178' }}>
            <div>ALERT</div><div>ACTION TAKEN</div><div style={{ textAlign: 'right' }}>IMPACT</div><div style={{ textAlign: 'right' }}>STATE</div>
          </div>
          {record.actions.map((a, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 190px 100px 100px', padding: '12px 16px', borderBottom: i < record.actions.length - 1 ? '1px solid #f1f2f4' : 'none', alignItems: 'center', font: '400 12px/1.4 Inter,sans-serif' }}>
              <div style={{ color: '#464646' }}>{a.alert}</div>
              <div style={{ color: '#6b7178' }}>{a.action}</div>
              <div style={{ textAlign: 'right', fontWeight: 600, color: a.impactColor, fontStyle: a.impactStyle }}>{a.impact}</div>
              <div style={{ textAlign: 'right', color: a.stateColor }}>{a.state}</div>
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
