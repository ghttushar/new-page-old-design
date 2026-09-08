import { useEffect, useRef, useState } from 'react';
import { WORKSTATION_TASKS, ACTION_HISTORY, ACCOUNT_GOALS, type WorkstationTask, type TaskStatus } from '@/constants/signals/prototype-data';
import { DEFAULT_ASSIGNEES } from '../alerts/assign-menu';
import { CheckIcon, XIcon, AssignIcon, CloseIcon } from '../alerts/icons';
import motion from '../alerts/motion.module.scss';

const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: 'Awaiting response',
  accepted: 'Accepted',
  declined: 'Declined',
  in_progress: 'In progress',
  done: 'Done',
};

const STATUS_COLOR: Record<TaskStatus, string> = {
  pending: '#a8763f',
  accepted: '#5c7f9e',
  declined: '#b3453f',
  in_progress: '#77469b',
  done: '#3f7d6a',
};

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
}

function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  return (
    <span
      style={{
        width: size, height: size, borderRadius: '50%', flex: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#eceef1', color: '#5c636e',
        font: `700 ${Math.round(size * 0.4)}px/1 Inter,sans-serif`,
      }}
    >
      {initials(name)}
    </span>
  );
}

function StatusPill({ status }: { status: TaskStatus }) {
  return (
    <span style={{ padding: '3px 8px', borderRadius: 5, background: STATUS_COLOR[status] + '1a', font: '600 10px/1.5 Inter,sans-serif', letterSpacing: '0.03em', color: STATUS_COLOR[status], flex: 'none', whiteSpace: 'nowrap' as const }}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function WorkStation() {
  const [tasks, setTasks] = useState<WorkstationTask[]>(WORKSTATION_TASKS);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState(DEFAULT_ASSIGNEES[0].id);
  const [newEta, setNewEta] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const newTextRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (createOpen) newTextRef.current?.focus();
  }, [createOpen]);

  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(null), 2600); };

  const setStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const sendReminder = (t: WorkstationTask) => {
    const note = `You sent a reminder to ${t.assignee} · just now`;
    setTasks((prev) => prev.map((p) => (p.id === t.id ? { ...p, lastReminder: note } : p)));
    flash(`Reminder sent to ${t.assignee}`);
  };

  const createTask = () => {
    if (!newText.trim()) return;
    const person = DEFAULT_ASSIGNEES.find((a) => a.id === newAssigneeId)!;
    const assignee = person.id === 'self' ? 'You' : person.name;
    const task: WorkstationTask = {
      id: `t-${Date.now()}`,
      text: newText.trim(),
      assignee,
      assigneeId: person.id,
      createdBy: 'You',
      meeting: 'Created directly',
      due: newEta ? `Due ${newEta}` : '',
      status: assignee === 'You' ? 'accepted' : 'pending',
      etaLabel: newEta ? `ETA ${newEta}` : undefined,
    };
    setTasks((prev) => [task, ...prev]);
    setNewText('');
    setNewEta('');
    setNewAssigneeId(DEFAULT_ASSIGNEES[0].id);
    setCreateOpen(false);
    flash(assignee === 'You' ? 'Task created' : `Task sent to ${assignee}`);
  };

  const q = search.trim().toLowerCase();
  const matches = (t: WorkstationTask) => !q || t.text.toLowerCase().includes(q) || t.assignee.toLowerCase().includes(q);

  const assignedToMe = tasks.filter((t) => t.assignee === 'You' && matches(t));
  const assignedByMe = tasks.filter((t) => t.createdBy === 'You' && t.assignee !== 'You' && matches(t));
  const doneThisWeek = tasks.filter((t) => t.status === 'done').length;

  return (
    <div style={{ height: '100%', display: 'flex', gap: 16, position: 'relative' }}>
      {/* Left — Task workspace */}
      <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e6e8ec', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ font: '600 15px/1 Inter,sans-serif', color: '#23272d' }}>Tasks</div>
              <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>{doneThisWeek} of {tasks.length} done this week</div>
            </div>
            <span onClick={() => setCreateOpen((v) => !v)} className={motion.pressable} style={{ padding: '9px 14px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>
              {createOpen ? 'Cancel' : 'Create task'}
            </span>
          </div>
          <div style={{ marginTop: 13 }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks or people"
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
            />
          </div>

          <div className={`${motion.accordionRow} ${createOpen ? motion.accordionRowOpen : ''}`}>
            <div style={{ marginTop: 13, padding: 14, border: '1px solid #e6e8ec', borderRadius: 8, background: '#fafbfd' }}>
              <textarea
                ref={newTextRef}
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="What needs to get done?"
                style={{ width: '100%', minHeight: 54, padding: '9px 11px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12.5px/1.5 Inter,sans-serif', color: '#3d434b', outline: 'none', resize: 'vertical' as const }}
              />
              <div style={{ display: 'flex', gap: 9, marginTop: 10, alignItems: 'center' }}>
                <select
                  value={newAssigneeId}
                  onChange={(e) => setNewAssigneeId(e.target.value)}
                  style={{ padding: '8px 10px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none', background: '#fff' }}
                >
                  {DEFAULT_ASSIGNEES.map((a) => (
                    <option key={a.id} value={a.id}>{a.id === 'self' ? 'Myself' : a.name}</option>
                  ))}
                </select>
                <input
                  value={newEta}
                  onChange={(e) => setNewEta(e.target.value)}
                  placeholder="ETA, e.g. 7 Nov"
                  style={{ flex: 1, minWidth: 0, padding: '8px 10px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
                />
                <span onClick={createTask} className={motion.pressable} style={{ padding: '8px 14px', borderRadius: 7, background: newText.trim() ? '#77469b' : '#e6e0ec', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: newText.trim() ? 'pointer' : 'default', flex: 'none' }}>
                  {newAssigneeId === 'self' ? 'Create' : 'Assign'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Assigned to me */}
          <div style={{ padding: '11px 20px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Assigned to me</span>
            <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#6b7178' }}>{assignedToMe.length}</span>
          </div>
          {assignedToMe.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>Nothing assigned to you right now.</div>
          )}
          {assignedToMe.map((t) => (
            <div key={t.id} className={motion.contentFadeIn} style={{ padding: '14px 20px', borderBottom: '1px solid #f1f2f4', display: 'flex', gap: 13, alignItems: 'flex-start' }}>
              {t.status === 'done' ? (
                <span style={{ width: 16, height: 16, borderRadius: 4, background: '#3f7d6a', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 2 }}><CheckIcon size={9} /></span>
              ) : (
                <span
                  onClick={() => t.status !== 'pending' && setStatus(t.id, 'done')}
                  style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid #cfd4dc', flex: 'none', marginTop: 2, cursor: t.status !== 'pending' ? 'pointer' : 'default' }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: `${t.status === 'done' ? '400' : '500'} 13px/1.5 Inter,sans-serif`, color: t.status === 'done' ? '#6b7178' : '#23272d', textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>{t.text}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 7, flexWrap: 'wrap' as const }}>
                  <StatusPill status={t.status} />
                  <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{t.createdBy !== 'You' ? `From ${t.createdBy}` : t.meeting}</span>
                  {t.etaLabel && <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{t.etaLabel}</span>}
                  {t.due && !t.etaLabel && <span style={{ font: '400 11px/1 Inter,sans-serif', color: t.dueColor || '#6b7178' }}>{t.due}</span>}
                </div>
                {t.lastReminder && (
                  <div style={{ font: '400 10.5px/1.5 Inter,sans-serif', color: '#a8763f', marginTop: 5 }}>{t.lastReminder}</div>
                )}
                {t.status !== 'pending' && t.status !== 'done' && (
                  <select
                    value={t.status}
                    onChange={(e) => setStatus(t.id, e.target.value as TaskStatus)}
                    style={{ marginTop: 8, padding: '5px 8px', border: '1px solid #dfe3ea', borderRadius: 6, font: '500 11px/1 Inter,sans-serif', color: '#3d434b', outline: 'none', background: '#fff' }}
                  >
                    <option value="accepted">Accepted</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                )}
              </div>
              {t.status === 'pending' && (
                <div style={{ display: 'flex', gap: 7, flex: 'none' }}>
                  <span onClick={() => setStatus(t.id, 'accepted')} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 11px', borderRadius: 6, background: '#eef6f3', color: '#3f7d6a', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer' }}>
                    <CheckIcon size={11} color="#3f7d6a" /> Accept
                  </span>
                  <span onClick={() => setStatus(t.id, 'declined')} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 11px', borderRadius: 6, background: '#fbf1ef', color: '#b3453f', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer' }}>
                    <XIcon size={11} color="#b3453f" /> Decline
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Assigned by me */}
          <div style={{ padding: '11px 20px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', borderTop: '1px solid #f1f2f4', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Assigned by me</span>
            <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#6b7178' }}>{assignedByMe.length}</span>
          </div>
          {assignedByMe.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>You haven't assigned anything to the team yet.</div>
          )}
          {assignedByMe.map((t) => (
            <div key={t.id} className={motion.contentFadeIn} style={{ padding: '14px 20px', borderBottom: '1px solid #f1f2f4', display: 'flex', gap: 13, alignItems: 'flex-start' }}>
              <Avatar name={t.assignee} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '500 13px/1.5 Inter,sans-serif', color: '#23272d' }}>{t.text}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 7, flexWrap: 'wrap' as const }}>
                  <StatusPill status={t.status} />
                  <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#464646' }}>{t.assignee}</span>
                  {t.etaLabel && <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{t.etaLabel}</span>}
                  {t.due && !t.etaLabel && <span style={{ font: '400 11px/1 Inter,sans-serif', color: t.dueColor || '#6b7178' }}>{t.due}</span>}
                </div>
                {t.lastReminder && (
                  <div style={{ font: '400 10.5px/1.5 Inter,sans-serif', color: '#a8763f', marginTop: 5 }}>{t.lastReminder}</div>
                )}
              </div>
              {t.status !== 'done' && t.status !== 'declined' && (
                <span onClick={() => sendReminder(t)} className={motion.pressable} style={{ padding: '7px 11px', border: '1px solid #dfe3ea', borderRadius: 6, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', flex: 'none' }}>
                  Send reminder
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right — Goals + Actions */}
      <div style={{ flex: '0 0 38%', maxWidth: '38%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Account goals */}
        <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: '18px 20px' }}>
          <div style={{ font: '600 15px/1 Inter,sans-serif', color: '#23272d' }}>Account goals</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 14 }}>
            {ACCOUNT_GOALS.slice(0, 2).map((g, i) => (
              <div key={i} style={{ background: '#fafbfd', padding: 15 }}>
                <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{g.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 8 }}>
                  <span style={{ font: '600 19px/1 Inter,sans-serif', color: '#23272d' }}>{g.current}</span>
                  <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>of {g.target}</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: '#e6e8ec', marginTop: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${g.pct}%`, height: '100%', background: g.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions history */}
        <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f2f4', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Actions taken for net margin</span>
            <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>4 this month</span>
          </div>
          {ACTION_HISTORY.map((a, i) => (
            <div key={i} style={{ padding: '14px 20px', borderBottom: i < ACTION_HISTORY.length - 1 ? '1px solid #f1f2f4' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.dotColor }} />
                <span style={{ flex: 1, font: '500 13px/1.4 Inter,sans-serif', color: '#464646' }}>{a.label}</span>
                <span style={{ font: '600 12px/1 Inter,sans-serif', color: a.impactColor, fontStyle: a.impactStyle }}>{a.impact}</span>
              </div>
              <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>{a.meta}</div>
            </div>
          ))}
        </div>
      </div>

      {toast && (
        <div className={motion.toastIn} style={{ position: 'absolute', right: 20, bottom: 20, padding: '12px 16px', borderRadius: 9, background: '#23272d', color: '#fff', font: '500 12px/1.4 Inter,sans-serif', boxShadow: '0 12px 28px rgba(20,24,33,.28)', zIndex: 250, display: 'flex', alignItems: 'center', gap: 9 }}>
          <AssignIcon size={13} color="#fff" />
          {toast}
          <span onClick={() => setToast(null)} style={{ display: 'flex', cursor: 'pointer', marginLeft: 6 }}><CloseIcon size={11} color="#fff" /></span>
        </div>
      )}
    </div>
  );
}
