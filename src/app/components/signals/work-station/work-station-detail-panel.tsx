import { useState } from 'react';
import {
  PROTOTYPE_ALERTS, MEETING_DETAILS, MEETING_LIST,
  type WorkstationTask, type TaskStatus, type TaskPriority, type AssigneeOption,
} from '@/constants/signals/prototype-data';
import { DEFAULT_ASSIGNEES, AssignDropdownList, Avatar } from '../alerts/assign-menu';
import { CloseIcon, ChevronDownIcon, SparkleIcon, AiDraftBadge } from '../alerts/icons';
import { SourceIcon, SourceBadge } from '../alerts/source-icon';
import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
import { StatusCircleIcon, STATUS_COLOR, STATUS_LABEL, PRIORITY_COLOR } from './work-station-icons';
import scrollStyles from '../alerts/alerts-scroll.module.scss';
import motion from '../alerts/motion.module.scss';

const STATUS_ORDER: TaskStatus[] = ['open', 'in_progress', 'done'];
const PRIORITY_ORDER: TaskPriority[] = ['High', 'Medium', 'Low'];

/** The time-range tail of a meeting's "Today, 1 November · 10:30 – 11:15 AM" label — a compact timestamp for the small context card. */
function extractMeetingTime(dateTimeLabel: string | undefined): string {
  if (!dateTimeLabel) return '';
  const parts = dateTimeLabel.split('·');
  return parts[parts.length - 1].trim();
}

function slug(s: string): string {
  return s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

/** The account this task's context traces back to — from its linked alert or meeting — used to synthesize a plausible email domain / Slack channel for the mock email and Slack cards. */
function accountFor(task: WorkstationTask, linkedAlert?: { account: string }): string | undefined {
  if (linkedAlert) return linkedAlert.account;
  if (task.meetingId) return MEETING_LIST.find((m) => m.id === task.meetingId)?.account;
  return undefined;
}

function emailAddressFor(name: string, account?: string): string {
  const [first, ...rest] = name.trim().toLowerCase().split(/\s+/);
  const local = rest.length ? `${first}.${rest[rest.length - 1]}` : first;
  return `${local}@${account ? slug(account) : 'company'}.com`;
}

interface Props {
  task: WorkstationTask;
  onClose: () => void;
  onReassign: (a: AssigneeOption) => void;
  onSetStatus: (s: TaskStatus) => void;
  onSetPriority: (p: TaskPriority) => void;
  onSetDue: (due: string) => void;
  onOpenAlert?: (id: string) => void;
  onOpenMeeting?: (id: string) => void;
  onOpenJiva: () => void;
  jivaOpen: boolean;
  /** Forces the Context section expanded on mount — for the design-handoff preview, not used by the real app. */
  initialContextOpen?: boolean;
}

export function WorkStationDetailPanel({ task, onClose, onReassign, onSetStatus, onSetPriority, onSetDue, onOpenAlert, onOpenMeeting, onOpenJiva, jivaOpen, initialContextOpen = false }: Props) {
  const [assignMenuOpen, setAssignMenuOpen] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [priorityMenuOpen, setPriorityMenuOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(initialContextOpen);
  const [activityOpen, setActivityOpen] = useState(false);
  const [dueEditing, setDueEditing] = useState(false);
  const [dueDraft, setDueDraft] = useState(task.due);
  const linkedAlert = task.origin === 'alert' && task.alertId ? PROTOTYPE_ALERTS.find((a) => a.id === task.alertId) : undefined;
  const linkedMeeting = task.origin === 'meeting' && task.meetingId ? MEETING_DETAILS[task.meetingId] : undefined;

  return (
    <div className={motion.slideInRight} style={{ flex: 1, minWidth: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f2f4', display: 'flex', alignItems: 'flex-start', gap: 12, flex: 'none', background: 'radial-gradient(circle at 88% -20%, rgba(119,70,155,.06), transparent 55%)' }}>
        <span style={{ flex: 1, minWidth: 0, font: `${task.status === 'done' ? '500' : '600'} 15px/1.4 Inter,sans-serif`, color: '#23272d', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>{task.text}</span>
        <span onClick={onClose} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer', padding: 4, flex: 'none' }}><CloseIcon size={13} /></span>
      </div>

      <div className={scrollStyles.sleekScroll} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 14, rowGap: 16, padding: '14px 16px', border: '1px solid #eceef1', borderRadius: 10, background: '#fafbfd' }}>
          <div>
            <div style={{ font: '600 9.5px/1 Inter,sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#9aa0a8', marginBottom: 8 }}>Assignee</div>
            <span onClick={() => setAssignMenuOpen((v) => !v)} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', position: 'relative' }}>
              <Avatar name={task.assignee} size={20} vivid={task.assignee !== 'Unassigned'} />
              <span style={{ font: '600 12.5px/1 Inter,sans-serif', color: task.assignee === 'Unassigned' ? '#a8763f' : '#3d434b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{task.assignee}</span>
              {assignMenuOpen && (
                <div className={motion.popIn} style={{ position: 'absolute', left: 0, top: 26, width: 220, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 50 }} onClick={(e) => e.stopPropagation()}>
                  <AssignDropdownList assignees={DEFAULT_ASSIGNEES} onSelect={(a) => { onReassign(a); setAssignMenuOpen(false); }} />
                </div>
              )}
            </span>
          </div>

          <div>
            <div style={{ font: '600 9.5px/1 Inter,sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#9aa0a8', marginBottom: 8 }}>Status</div>
            <span onClick={() => setStatusMenuOpen((v) => !v)} className={motion.pressable} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 7px', borderRadius: 999, background: STATUS_COLOR[task.status] + '14', cursor: 'pointer', position: 'relative' }}>
              <StatusCircleIcon status={task.status} />
              <span style={{ font: '600 12.5px/1 Inter,sans-serif', color: STATUS_COLOR[task.status] }}>{STATUS_LABEL[task.status]}</span>
              {statusMenuOpen && (
                <div className={motion.popIn} style={{ position: 'absolute', left: 0, top: 30, width: 160, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 50 }} onClick={(e) => e.stopPropagation()}>
                  {STATUS_ORDER.map((s) => (
                    <div key={s} onClick={() => { onSetStatus(s); setStatusMenuOpen(false); }} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 6, cursor: 'pointer' }}>
                      <StatusCircleIcon status={s} />
                      <span style={{ font: '500 12px/1 Inter,sans-serif', color: '#3d434b' }}>{STATUS_LABEL[s]}</span>
                    </div>
                  ))}
                </div>
              )}
            </span>
          </div>

          <div>
            <div style={{ font: '600 9.5px/1 Inter,sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#9aa0a8', marginBottom: 8 }}>Priority</div>
            <span onClick={() => setPriorityMenuOpen((v) => !v)} className={motion.pressable} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px 4px 7px', borderRadius: 999, background: PRIORITY_COLOR[task.priority] + '14', cursor: 'pointer', position: 'relative' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: PRIORITY_COLOR[task.priority], flex: 'none' }} />
              <span style={{ font: '600 12.5px/1 Inter,sans-serif', color: PRIORITY_COLOR[task.priority] }}>{task.priority}</span>
              {priorityMenuOpen && (
                <div className={motion.popIn} style={{ position: 'absolute', left: 0, top: 30, width: 140, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 50 }} onClick={(e) => e.stopPropagation()}>
                  {PRIORITY_ORDER.map((p) => (
                    <div key={p} onClick={() => { onSetPriority(p); setPriorityMenuOpen(false); }} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 6, cursor: 'pointer' }}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: PRIORITY_COLOR[p], flex: 'none' }} />
                      <span style={{ font: '500 12px/1 Inter,sans-serif', color: '#3d434b' }}>{p}</span>
                    </div>
                  ))}
                </div>
              )}
            </span>
          </div>

          <div>
            <div style={{ font: '600 9.5px/1 Inter,sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#9aa0a8', marginBottom: 8 }}>Due</div>
            {dueEditing ? (
              <input
                autoFocus
                value={dueDraft}
                onChange={(e) => setDueDraft(e.target.value)}
                onFocus={(e) => e.currentTarget.select()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { onSetDue(dueDraft.trim() || task.due); setDueEditing(false); }
                  if (e.key === 'Escape') { setDueDraft(task.due); setDueEditing(false); }
                }}
                onBlur={() => { onSetDue(dueDraft.trim() || task.due); setDueEditing(false); }}
                className={motion.focusRing}
                style={{ width: '100%', boxSizing: 'border-box' as const, padding: '5px 8px', border: '1px solid #dfe3ea', borderRadius: 6, font: '600 12.5px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
              />
            ) : (
              <span onClick={() => setDueEditing(true)} className={motion.pressable} style={{ display: 'inline-block', font: '600 12.5px/1 Inter,sans-serif', color: task.overdue ? '#b3453f' : (task.dueColor || '#3d434b'), cursor: 'pointer', padding: '5px 8px', margin: '-5px -8px', borderRadius: 6 }}>
                {task.due}
              </span>
            )}
          </div>
        </div>

        <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid #f1f2f4' }}>
          <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Description</div>
          <div style={{ font: '400 12.5px/1.65 Inter,sans-serif', color: '#464646', marginTop: 8 }}>{task.description}</div>
        </div>

        {task.origin === 'generative' && (
          <div style={{ marginTop: 16, padding: '13px 14px', borderRadius: 8, border: '1px solid #e6ddf0', background: 'linear-gradient(180deg, rgba(119,70,155,.05), transparent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
              <AiDraftBadge label="JIVA-FLAGGED" />
              <span style={{ font: '600 12px/1.4 Inter,sans-serif', color: '#3d2a52' }}>Jiva flagged this from account activity</span>
            </div>
            <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 6 }}>No single alert or meeting produced it directly — ask Jiva to draft a first pass whenever you're ready.</div>
            <span onClick={onOpenJiva} className={`${motion.pressable} ${motion.btnPrimary}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, padding: '8px 13px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer' }}>
              <DiamondMascot size={12} /> Draft it
            </span>
          </div>
        )}

        <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid #f1f2f4' }}>
          <div onClick={() => setContextOpen((v) => !v)} className={motion.rowHover} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', margin: '0 -6px', padding: '2px 6px', borderRadius: 6 }}>
            <span style={{ display: 'flex', transform: contextOpen ? 'none' : 'rotate(-90deg)', transition: 'transform 160ms ease-out' }}>
              <ChevronDownIcon size={9} color="#6b7178" />
            </span>
            <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Context</span>
          </div>
          <div className={`${motion.accordionRow} ${contextOpen ? motion.accordionRowOpen : ''}`}>
            <div style={{ paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {task.contextSources?.length ? (
                task.contextSources.map((source, i) => {
                  const account = accountFor(task, linkedAlert);
                  if (source === 'meeting') {
                    return (
                      <div
                        key={i}
                        onClick={() => task.meetingId && onOpenMeeting?.(task.meetingId)}
                        className={`${motion.pressable} ${motion.cardHover}`}
                        style={{ padding: '11px 13px', border: '1px solid #eceef1', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                      >
                        <SourceBadge source="meeting" size={22} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ font: '600 13px/1.4 Inter,sans-serif', color: '#23272d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{task.meetingLabel ?? 'Meeting'}</div>
                          <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 2 }}>{linkedMeeting?.attendees?.[0]?.name ?? 'Host TBD'}</div>
                        </div>
                        <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#6b7178', flex: 'none' }}>{extractMeetingTime(linkedMeeting?.dateTimeLabel)}</span>
                      </div>
                    );
                  }
                  const log = task.logs.find((l) => l.text.toLowerCase().includes(source));
                  const sender = task.createdBy;
                  if (source === 'email') {
                    return (
                      <div
                        key={i}
                        onClick={() => {}}
                        className={`${motion.pressable} ${motion.cardHover}`}
                        style={{ padding: '10px 12px', border: '1px solid #eceef1', borderRadius: 8, background: '#fff', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <SourceBadge source="email" size={18} />
                          <span style={{ flex: 1, minWidth: 0, font: '600 11.5px/1.3 Inter,sans-serif', color: '#23272d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>Re: {task.text}</span>
                          <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8', flex: 'none' }}>{log?.time ?? ''}</span>
                        </div>
                        <div style={{ font: '400 11.5px/1.4 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>{emailAddressFor(sender, account)}</div>
                        <div style={{ font: '400 12px/1.4 Inter,sans-serif', color: '#464646', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                          {log?.text ?? 'Followed up over email.'}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={i}
                      onClick={() => {}}
                      className={`${motion.pressable} ${motion.cardHover}`}
                      style={{ padding: '10px 12px', border: '1px solid #eceef1', borderRadius: 8, background: '#fff', cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <SourceBadge source="slack" size={18} />
                        <span style={{ flex: 1, minWidth: 0, font: '600 11.5px/1.3 Inter,sans-serif', color: '#23272d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{`#${account ? slug(account) : 'team'}-pod`}</span>
                        <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8', flex: 'none' }}>{log?.time ?? ''}</span>
                      </div>
                      <div style={{ font: '400 12px/1.4 Inter,sans-serif', color: '#464646', marginTop: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                        <span style={{ fontWeight: 600, color: '#3d434b' }}>{sender}: </span>
                        {log?.text ?? 'Discussed in Slack.'}
                      </div>
                    </div>
                  );
                })
              ) : task.origin === 'alert' ? (
                <div
                  onClick={() => onOpenAlert?.(task.alertId!)}
                  className={`${motion.pressable} ${motion.cardHover}`}
                  style={{ padding: '10px 12px', border: '1px solid #eceef1', borderRadius: 8, background: '#fff', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <SourceIcon origin={linkedAlert?.originType ?? 'anarix'} size={13} />
                    <span style={{ flex: 1, minWidth: 0, font: '600 11.5px/1.3 Inter,sans-serif', color: '#23272d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{linkedAlert?.account ?? 'Alert'}</span>
                    <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8', flex: 'none' }}>{linkedAlert?.time}</span>
                  </div>
                  <div style={{ font: '400 12px/1.4 Inter,sans-serif', color: '#464646', marginTop: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                    <span style={{ fontWeight: 600, color: '#3d434b' }}>{linkedAlert?.title ?? task.alertId}: </span>
                    {linkedAlert?.aiSummary ?? `Raised from an alert on ${linkedAlert?.account ?? 'this account'}.`}
                  </div>
                </div>
              ) : task.origin === 'meeting' ? (
                <div
                  onClick={() => onOpenMeeting?.(task.meetingId!)}
                  className={`${motion.pressable} ${motion.cardHover}`}
                  style={{ padding: '11px 13px', border: '1px solid #eceef1', borderRadius: 8, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
                >
                  <SourceBadge source="meeting" size={22} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: '600 13px/1.4 Inter,sans-serif', color: '#23272d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{task.meetingLabel}</div>
                    <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 2 }}>{linkedMeeting?.attendees?.[0]?.name ?? 'Host TBD'}</div>
                  </div>
                  <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#6b7178', flex: 'none' }}>{extractMeetingTime(linkedMeeting?.dateTimeLabel)}</span>
                </div>
              ) : null}
              {task.origin === 'generative' && (
                <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#464646' }}>
                  Synthesized from patterns across recent alerts and meetings on this account, rather than tied to any one of them.
                </div>
              )}
              {task.origin === 'direct' && (
                <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>
                  Created directly by {task.createdBy === 'You' ? 'you' : task.createdBy} — no linked alert or meeting.
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid #f1f2f4' }}>
          <div onClick={() => setActivityOpen((v) => !v)} className={motion.rowHover} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', margin: '0 -6px', padding: '2px 6px', borderRadius: 6 }}>
            <span style={{ display: 'flex', transform: activityOpen ? 'none' : 'rotate(-90deg)', transition: 'transform 160ms ease-out' }}>
              <ChevronDownIcon size={9} color="#6b7178" />
            </span>
            <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Activity</span>
          </div>
          <div className={`${motion.accordionRow} ${activityOpen ? motion.accordionRowOpen : ''}`}>
            <div style={{ paddingTop: 10, position: 'relative' }}>
              {task.logs.length > 1 && <span style={{ position: 'absolute', left: 3, top: 6, bottom: 6, width: 1, background: '#e6e8ec' }} />}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {task.logs.map((l, i) => {
                  const byJiva = l.text.toLowerCase().includes('jiva');
                  return (
                    <div key={i} style={{ display: 'flex', gap: 10, position: 'relative' }}>
                      {byJiva ? (
                        <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#f3eefa', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -3, marginLeft: -3.5, flex: 'none', zIndex: 1 }}>
                          <SparkleIcon size={8} />
                        </span>
                      ) : (
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#c9b6dd', marginTop: 3, flex: 'none', zIndex: 1 }} />
                      )}
                      <div>
                        <div style={{ font: '400 11.5px/1.4 Inter,sans-serif', color: '#464646' }}>{l.text}</div>
                        <div style={{ font: '400 10.5px/1 Inter,sans-serif', color: '#9aa0a8', marginTop: 3 }}>{l.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div style={{ padding: '13px 20px', borderTop: '1px solid #f1f2f4', display: 'flex', flexDirection: 'column', gap: 8, flex: 'none' }}>
        <span onClick={onOpenJiva} className={`${motion.pressable} ${motion.btnPrimary}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 14px', borderRadius: 7, font: '600 12px/1 Inter,sans-serif', color: '#fff', background: jivaOpen ? '#5f3880' : '#77469b', cursor: 'pointer', width: '100%', boxSizing: 'border-box' as const }}>
          <DiamondMascot size={13} /> Complete with Jiva
        </span>
        {task.origin === 'alert' && (
          <span onClick={() => onOpenAlert?.(task.alertId!)} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ textAlign: 'center' as const, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>View alert</span>
        )}
      </div>
    </div>
  );
}
