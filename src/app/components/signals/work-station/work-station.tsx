import { useState } from 'react';
import {
  WORKSTATION_TASKS, PROTOTYPE_ALERTS,
  type WorkstationTask, type TaskStatus, type AssigneeOption,
} from '@/constants/signals/prototype-data';
import { DEFAULT_ASSIGNEES, AssignDropdownList, Avatar } from '../alerts/assign-menu';
import { AssignIcon, ChevronDownIcon, CloseIcon } from '../alerts/icons';
import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
import motion from '../alerts/motion.module.scss';

const STATUS_LABEL: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  done: 'Done',
};

const STATUS_COLOR: Record<TaskStatus, string> = {
  open: '#a8763f',
  in_progress: '#77469b',
  done: '#3f7d6a',
};

function StatusPill({ status }: { status: TaskStatus }) {
  return (
    <span style={{ padding: '3px 8px', borderRadius: 5, background: STATUS_COLOR[status] + '1a', font: '600 10px/1.5 Inter,sans-serif', letterSpacing: '0.03em', color: STATUS_COLOR[status], flex: 'none', whiteSpace: 'nowrap' as const }}>
      {STATUS_LABEL[status]}
    </span>
  );
}

function assigneeNameFor(id: string): string {
  const a = DEFAULT_ASSIGNEES.find((d) => d.id === id);
  return id === 'self' ? 'You' : a?.name ?? id;
}

/** A compact, inline Jiva assist — reuses the task's own text as context, no separate page/column. */
function MiniJivaPanel({ task, onClose }: { task: WorkstationTask; onClose: () => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    window.setTimeout(() => {
      setGenerating(false);
      setDraft(`Here's a first pass on "${task.text.toLowerCase()}": ${task.description}`);
    }, 700);
  };

  return (
    <div className={motion.contentFadeIn} style={{ marginTop: 12, border: '1px solid #e6ddf0', borderRadius: 8, padding: 13, background: 'linear-gradient(180deg, rgba(119,70,155,.05), transparent)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <DiamondMascot size={20} />
        <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#3d2a52' }}>Ask Jiva</span>
        <span onClick={onClose} className={motion.pressable} style={{ marginLeft: 'auto', display: 'flex', cursor: 'pointer' }}><CloseIcon size={11} /></span>
      </div>
      {!draft && !generating && (
        <>
          <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 8 }}>Want me to draft this for you?</div>
          <span onClick={generate} className={motion.pressable} style={{ display: 'inline-block', marginTop: 9, padding: '8px 13px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer' }}>Generate draft</span>
        </>
      )}
      {generating && <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 8 }}>Drafting…</div>}
      {draft && (
        <>
          <div style={{ marginTop: 9, padding: '9px 12px', borderRadius: 8, background: '#f6f4fa', color: '#3d2a52', font: '400 12.5px/1.6 Inter,sans-serif' }}>{draft}</div>
          <span onClick={generate} className={motion.pressable} style={{ display: 'inline-block', marginTop: 8, font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>Regenerate</span>
        </>
      )}
    </div>
  );
}

function TaskCard({
  task, expanded, onToggle, assignMenuOpen, onToggleAssignMenu, onReassign, onSetStatus, jivaOpen, onToggleJiva, onOpenAlert, onOpenMeeting,
}: {
  task: WorkstationTask;
  expanded: boolean;
  onToggle: () => void;
  assignMenuOpen: boolean;
  onToggleAssignMenu: () => void;
  onReassign: (a: AssigneeOption) => void;
  onSetStatus: (s: TaskStatus) => void;
  jivaOpen: boolean;
  onToggleJiva: () => void;
  onOpenAlert?: (id: string) => void;
  onOpenMeeting?: (id: string) => void;
}) {
  const linkedAlert = task.origin === 'alert' && task.alertId ? PROTOTYPE_ALERTS.find((a) => a.id === task.alertId) : undefined;

  return (
    <div className={motion.contentFadeIn} style={{ margin: '10px 12px', border: '1px solid #eceef1', borderRadius: 10, background: '#fff', boxShadow: '0 1px 2px rgba(20,24,33,.03)', overflow: 'hidden' }}>
      <div onClick={onToggle} style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
        <Avatar name={task.assignee} size={26} vivid={task.assignee !== 'Unassigned'} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: `${task.status === 'done' ? '400' : '500'} 13px/1.45 Inter,sans-serif`, color: task.status === 'done' ? '#6b7178' : '#23272d', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>{task.text}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, flexWrap: 'wrap' as const }}>
            <span style={{ font: '600 11px/1 Inter,sans-serif', color: task.assignee === 'Unassigned' ? '#a8763f' : '#464646' }}>{task.assignee}</span>
            <span style={{ font: '400 11px/1 Inter,sans-serif', color: task.overdue ? '#b3453f' : (task.dueColor || '#6b7178') }}>{task.due}</span>
          </div>
        </div>
        <StatusPill status={task.status} />
        <span style={{ display: 'flex', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease-out', flex: 'none' }}><ChevronDownIcon size={10} /></span>
      </div>

      <div className={`${motion.accordionRow} ${expanded ? motion.accordionRowOpen : ''}`}>
        <div>
          <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f1f2f4', marginTop: 0 }}>
            <div style={{ marginTop: 13 }}>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Description</div>
              <div style={{ font: '400 12.5px/1.6 Inter,sans-serif', color: '#464646', marginTop: 7 }}>{task.description}</div>
            </div>

            <div style={{ marginTop: 13 }}>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Context</div>
              <div style={{ marginTop: 7 }}>
                {task.origin === 'alert' && (
                  <span onClick={() => onOpenAlert?.(task.alertId!)} className={motion.pressable} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: '600 12px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>
                    Linked alert: {linkedAlert?.title ?? task.alertId} →
                  </span>
                )}
                {task.origin === 'meeting' && (
                  <span onClick={() => onOpenMeeting?.(task.meetingId!)} className={motion.pressable} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: '600 12px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>
                    Linked meeting: {task.meetingLabel} →
                  </span>
                )}
                {task.origin === 'generative' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 5, background: '#f3eefa', font: '600 10px/1.5 Inter,sans-serif', color: '#5f3880' }}>Generative task — Jiva can draft this</span>
                )}
                {task.origin === 'direct' && (
                  <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#9aa0a8' }}>Created directly, no linked alert or meeting.</span>
                )}
              </div>
            </div>

            <div style={{ marginTop: 13 }}>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Logs</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8 }}>
                {task.logs.map((l, i) => (
                  <div key={i} style={{ display: 'flex', gap: 9, font: '400 11.5px/1.5 Inter,sans-serif' }}>
                    <span style={{ color: '#9aa0a8', flex: 'none' }}>{l.time}</span>
                    <span style={{ color: '#464646' }}>{l.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 15, flexWrap: 'wrap' as const, position: 'relative' }}>
              <span onClick={(e) => { e.stopPropagation(); onToggleAssignMenu(); }} className={motion.pressable} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>
                <AssignIcon size={12} /> Assign to someone else
              </span>
              {task.origin === 'alert' && (
                <span onClick={() => onOpenAlert?.(task.alertId!)} className={motion.pressable} style={{ padding: '8px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>View alert</span>
              )}
              {task.origin === 'meeting' && (
                <span onClick={() => onOpenMeeting?.(task.meetingId!)} className={motion.pressable} style={{ padding: '8px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>View meeting</span>
              )}
              {task.origin === 'generative' && (
                <span onClick={onToggleJiva} className={motion.pressable} style={{ padding: '8px 12px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 11px/1 Inter,sans-serif', cursor: 'pointer' }}>Open Jiva</span>
              )}
              <select
                value={task.status}
                onChange={(e) => onSetStatus(e.target.value as TaskStatus)}
                onClick={(e) => e.stopPropagation()}
                style={{ marginLeft: 'auto', padding: '7px 9px', border: '1px solid #dfe3ea', borderRadius: 6, font: '600 11px/1 Inter,sans-serif', color: STATUS_COLOR[task.status], outline: 'none', background: '#fff' }}
              >
                <option value="open">Open</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>

              {assignMenuOpen && (
                <div className={motion.popIn} style={{ position: 'absolute', left: 0, top: 42, width: 220, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 30 }} onClick={(e) => e.stopPropagation()}>
                  <AssignDropdownList assignees={DEFAULT_ASSIGNEES} onSelect={onReassign} />
                </div>
              )}
            </div>

            {jivaOpen && <MiniJivaPanel task={task} onClose={onToggleJiva} />}
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  onOpenAlert?: (id: string) => void;
  onOpenMeeting?: (id: string) => void;
}

export function WorkStation({ onOpenAlert, onOpenMeeting }: Props) {
  const [tasks, setTasks] = useState<WorkstationTask[]>(WORKSTATION_TASKS);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [assignMenuFor, setAssignMenuFor] = useState<string | null>(null);
  const [jivaOpenFor, setJivaOpenFor] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [personFilter, setPersonFilter] = useState('');
  const [overdueOnly, setOverdueOnly] = useState(false);

  const toggleExpanded = (id: string) => setExpandedIds((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const setStatus = (id: string, status: TaskStatus) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

  const reassign = (id: string, a: AssigneeOption) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, assignee: a.id === 'self' ? 'You' : a.name, assigneeId: a.id } : t)));
    setAssignMenuFor(null);
  };

  const q = search.trim().toLowerCase();
  const matches = (t: WorkstationTask) => {
    if (overdueOnly && !t.overdue) return false;
    if (personFilter === 'unassigned') {
      if (t.assignee !== 'Unassigned') return false;
    } else if (personFilter) {
      if (t.assignee !== assigneeNameFor(personFilter)) return false;
    }
    if (q && !(t.text + ' ' + t.assignee).toLowerCase().includes(q)) return false;
    return true;
  };

  const assignedToMe = tasks.filter((t) => t.assignee === 'You').filter(matches);
  const assignedByMe = tasks.filter((t) => t.createdBy === 'You' && t.assignee !== 'You').filter(matches);

  const renderSection = (label: string, list: WorkstationTask[], emptyText: string) => (
    <div style={{ flex: '1 1 0', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '13px 20px 9px', flex: 'none' }}>
        <div style={{ font: '600 14px/1 Inter,sans-serif', color: '#23272d' }}>{label}</div>
        <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 4 }}>{list.length} task{list.length === 1 ? '' : 's'}</div>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {list.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>{emptyText}</div>
        )}
        {list.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            expanded={expandedIds.has(t.id)}
            onToggle={() => toggleExpanded(t.id)}
            assignMenuOpen={assignMenuFor === t.id}
            onToggleAssignMenu={() => setAssignMenuFor(assignMenuFor === t.id ? null : t.id)}
            onReassign={(a) => reassign(t.id, a)}
            onSetStatus={(s) => setStatus(t.id, s)}
            jivaOpen={jivaOpenFor === t.id}
            onToggleJiva={() => setJivaOpenFor(jivaOpenFor === t.id ? null : t.id)}
            onOpenAlert={onOpenAlert}
            onOpenMeeting={onOpenMeeting}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #e6e8ec', display: 'flex', gap: 9, flex: 'none', flexWrap: 'wrap' as const }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks"
          style={{ flex: '1 1 200px', minWidth: 160, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
        />
        <select
          value={personFilter}
          onChange={(e) => setPersonFilter(e.target.value)}
          style={{ padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none', background: '#fff' }}
        >
          <option value="">Everyone</option>
          {DEFAULT_ASSIGNEES.map((a) => (
            <option key={a.id} value={a.id}>{a.id === 'self' ? 'Me' : a.name}</option>
          ))}
          <option value="unassigned">Unassigned</option>
        </select>
        <span
          onClick={() => setOverdueOnly((v) => !v)}
          className={motion.pressable}
          style={{ padding: '9px 13px', border: `1px solid ${overdueOnly ? '#77469b' : '#dfe3ea'}`, borderRadius: 7, background: overdueOnly ? '#f9f7fc' : '#fff', font: '500 12px/1 Inter,sans-serif', color: overdueOnly ? '#5f3880' : '#3d434b', cursor: 'pointer' }}
        >
          Overdue only
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {renderSection('Assigned to me', assignedToMe, 'Nothing assigned to you right now.')}
        <div style={{ height: 1, background: '#e6e8ec', flex: 'none' }} />
        {renderSection('Assigned by me', assignedByMe, "You haven't assigned anything to the team yet.")}
      </div>
    </div>
  );
}
