import { useEffect, useRef, useState } from 'react';
import { WORKSTATION_TASKS, ENGAGEMENT_STREAK, type WorkstationTask, type TaskStatus } from '@/constants/signals/prototype-data';
import { DEFAULT_ASSIGNEES } from '../alerts/assign-menu';
import { CheckIcon, XIcon, AssignIcon, CloseIcon } from '../alerts/icons';
import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
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

const CELEBRATIONS = [
  "Nice. Jiva approves.",
  "Task: eliminated. Ego: boosted.",
  "One down. Chaos, briefly avoided.",
  "You really said 'not today' to procrastination.",
  "Jiva is doing a tiny victory dance.",
  "Look at you, finishing things.",
  "That's one less thing haunting your dreams.",
  "Certified task-doer. Please clap.",
];

const CONFETTI_COLORS = ['#77469b', '#a37fc7', '#3f7d6a', '#a8763f', '#5c7f9e', '#f2b6b0'];

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

/** A short, self-clearing confetti burst — celebratory but confined to the streak card, never the whole page. */
function Confetti() {
  const pieces = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: 10 + Math.random() * 80,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    delay: Math.random() * 0.15,
    duration: 0.9 + Math.random() * 0.5,
    drift: (Math.random() - 0.5) * 60,
    rotate: Math.random() * 360,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' as const }}>
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute', top: '38%', left: `${p.left}%`, width: 6, height: 9, borderRadius: 1.5,
            background: p.color,
            // @ts-expect-error custom properties consumed by the keyframe below
            '--drift': `${p.drift}px`,
            '--rotate': `${p.rotate}deg`,
            animation: `wsConfettiFall ${p.duration}s ${p.delay}s cubic-bezier(0.23,1,0.32,1) forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes wsConfettiFall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--drift), 120px) rotate(var(--rotate)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/** A working week's worth of days — this card is a compact strip now, not a hero moment. */
const STREAK_WEEK = ENGAGEMENT_STREAK.slice(0, 5);

function StreakCard({ celebrateTick }: { celebrateTick: number }) {
  const [celebrating, setCelebrating] = useState(false);
  const [quip, setQuip] = useState('');
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setQuip(CELEBRATIONS[Math.floor(Math.random() * CELEBRATIONS.length)]);
    setCelebrating(true);
    const t = window.setTimeout(() => setCelebrating(false), 2400);
    return () => window.clearTimeout(t);
  }, [celebrateTick]);

  // Consecutive from Monday — breaks at the first inactive day within the 5-day work week.
  let streak = 0;
  for (const d of STREAK_WEEK) {
    if (!d.active) break;
    streak++;
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, height: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', padding: '0 18px' }}>
      {celebrating && <Confetti />}

      <div style={{ position: 'relative', flex: 'none' }}>
        <div style={{ transform: celebrating ? 'scale(1.15)' : 'scale(1)', transition: 'transform 300ms cubic-bezier(0.23,1,0.32,1)' }}>
          <DiamondMascot size={34} />
        </div>
        {celebrating && (
          <div className={motion.popInTop} style={{ position: 'absolute', bottom: 'calc(100% + 9px)', left: '50%', transform: 'translateX(-50%)', width: 190, padding: '8px 11px', borderRadius: 9, background: '#3d2a52', color: '#fff', font: '600 11px/1.4 Inter,sans-serif', textAlign: 'center' as const, boxShadow: '0 10px 22px rgba(20,24,33,.28)', zIndex: 5 }}>
            {quip}
            <span style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #3d2a52' }} />
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '700 15px/1 Inter,sans-serif', color: '#23272d' }}>{streak}-day streak</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          {STREAK_WEEK.map((d, i) => (
            <span key={i} title={d.label} style={{ flex: 1, height: 8, borderRadius: 3, background: d.active ? 'linear-gradient(90deg,#a37fc7,#77469b)' : '#f1f2f4' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorkStation() {
  const [tasks, setTasks] = useState<WorkstationTask[]>(WORKSTATION_TASKS);
  const [createOpen, setCreateOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState(DEFAULT_ASSIGNEES[0].id);
  const [newEta, setNewEta] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [celebrateTick, setCelebrateTick] = useState(0);
  const newTextRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (createOpen) newTextRef.current?.focus();
  }, [createOpen]);

  const flash = (msg: string) => { setToast(msg); window.setTimeout(() => setToast(null), 2600); };

  const setStatus = (id: string, status: TaskStatus) => {
    const current = tasks.find((t) => t.id === id);
    if (status === 'done' && current && current.status !== 'done') {
      setCelebrateTick((n) => n + 1);
    }
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

  const assignedToMe = tasks.filter((t) => t.assignee === 'You');
  const assignedByMe = tasks.filter((t) => t.createdBy === 'You' && t.assignee !== 'You');
  const doneThisWeek = tasks.filter((t) => t.status === 'done').length;

  return (
    <div style={{ height: '100%', display: 'flex', gap: 16, position: 'relative' }}>
      {/* Left — Assigned to me, the whole column */}
      <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e6e8ec', flex: 'none' }}>
          <div style={{ font: '600 15px/1 Inter,sans-serif', color: '#23272d' }}>Assigned to me</div>
          <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>{doneThisWeek} of {tasks.length} done this week</div>
        </div>
        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
          {assignedToMe.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>Nothing assigned to you right now.</div>
          )}
          {assignedToMe.map((t) => (
            <div key={t.id} className={motion.contentFadeIn} style={{ padding: '14px 20px', borderBottom: '1px solid #f1f2f4', display: 'flex', gap: 13, alignItems: 'flex-start' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: `${t.status === 'done' ? '400' : '500'} 13px/1.5 Inter,sans-serif`, color: t.status === 'done' ? '#6b7178' : '#23272d', textDecoration: t.status === 'done' ? 'line-through' : 'none' }}>{t.text}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 7, flexWrap: 'wrap' as const }}>
                  <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{t.createdBy !== 'You' ? `From ${t.createdBy}` : t.meeting}</span>
                  {t.etaLabel && <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{t.etaLabel}</span>}
                  {t.due && !t.etaLabel && <span style={{ font: '400 11px/1 Inter,sans-serif', color: t.dueColor || '#6b7178' }}>{t.due}</span>}
                </div>
                {t.lastReminder && (
                  <div style={{ font: '400 10.5px/1.5 Inter,sans-serif', color: '#a8763f', marginTop: 5 }}>{t.lastReminder}</div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7, flex: 'none' }}>
                {t.status === 'pending' && (
                  <div style={{ display: 'flex', gap: 7 }}>
                    <span onClick={() => setStatus(t.id, 'accepted')} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 11px', borderRadius: 6, background: '#eef6f3', color: '#3f7d6a', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer' }}>
                      <CheckIcon size={11} color="#3f7d6a" /> Accept
                    </span>
                    <span onClick={() => setStatus(t.id, 'declined')} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 11px', borderRadius: 6, background: '#fbf1ef', color: '#b3453f', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer' }}>
                      <XIcon size={11} color="#b3453f" /> Decline
                    </span>
                  </div>
                )}
                {t.status === 'done' && <StatusPill status="done" />}
                {(t.status === 'accepted' || t.status === 'in_progress') && (
                  <select
                    value={t.status}
                    onChange={(e) => setStatus(t.id, e.target.value as TaskStatus)}
                    style={{ padding: '6px 9px', border: '1px solid #dfe3ea', borderRadius: 6, font: '600 11px/1 Inter,sans-serif', color: STATUS_COLOR[t.status], outline: 'none', background: '#fff' }}
                  >
                    <option value="accepted">Accepted</option>
                    <option value="in_progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — a small streak strip (20% of this column) sitting above the "Assigned by me" card, which takes the rest */}
      <div style={{ flex: '0 0 40%', maxWidth: '40%', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ flex: '0 0 20%', minHeight: 76 }}>
          <StreakCard celebrateTick={celebrateTick} />
        </div>

        <div style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e6e8ec', flex: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ font: '600 15px/1 Inter,sans-serif', color: '#23272d' }}>Assigned by me</div>
                <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>{assignedByMe.length} outstanding</div>
              </div>
              <span onClick={() => setCreateOpen((v) => !v)} className={motion.pressable} style={{ padding: '9px 14px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>
                {createOpen ? 'Cancel' : 'Create task'}
              </span>
            </div>

            <div className={`${motion.accordionRow} ${createOpen ? motion.accordionRowOpen : ''}`}>
              <div>
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
          </div>

          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
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
