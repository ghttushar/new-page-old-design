import { useMemo, useState } from 'react';
import {
  WORKSTATION_TASKS,
  type WorkstationTask, type TaskStatus, type TaskPriority, type AssigneeOption,
} from '@/constants/signals/prototype-data';
import { DEFAULT_ASSIGNEES } from '../alerts/assign-menu';
import { PlusIcon, SparkleIcon } from '../alerts/icons';
import { WorkStationListView } from './work-station-list-view';
import { WorkStationBoardView } from './work-station-board-view';
import { WorkStationDetailPanel } from './work-station-detail-panel';
import { WorkStationAskJivaPanel } from './work-station-ask-jiva-panel';
import { ListViewIcon, BoardViewIcon, STATUS_COLOR, PRIORITY_COLOR } from './work-station-icons';
import scrollStyles from '../alerts/alerts-scroll.module.scss';
import motion from '../alerts/motion.module.scss';

function assigneeNameFor(id: string): string {
  const a = DEFAULT_ASSIGNEES.find((d) => d.id === id);
  return id === 'self' ? 'You' : a?.name ?? id;
}

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = { open: 'in_progress', in_progress: 'done', done: 'open' };

const PRIORITY_FILTER_COLOR: Record<string, string> = {
  ...PRIORITY_COLOR, Generative: '#5f3880', Overdue: '#b3453f',
};

interface Props {
  onOpenAlert?: (id: string) => void;
  onOpenMeeting?: (id: string) => void;
  /** Forces the List/Board toggle on mount — for the design-handoff preview, not used by the real app. */
  initialView?: 'list' | 'board';
  /** Forces a task selected (docking the detail panel) on mount — for the design-handoff preview, not used by the real app. */
  initialSelectedId?: string | null;
  /** Forces the Ask Jiva panel open on mount — for the design-handoff preview, not used by the real app. */
  initialJivaOpen?: boolean;
  /** Forces the Priority filter popover open on mount — for the design-handoff preview, not used by the real app. */
  initialPriorityFilterOpen?: boolean;
  /** Forces the New task popover open on mount — for the design-handoff preview, not used by the real app. */
  initialCreateOpen?: boolean;
  /** Forces the detail panel's Context section expanded on mount — for the design-handoff preview, not used by the real app. */
  initialDetailContextOpen?: boolean;
}

export function WorkStation({ onOpenAlert, onOpenMeeting, initialView = 'list', initialSelectedId = null, initialJivaOpen = false, initialPriorityFilterOpen = false, initialCreateOpen = false, initialDetailContextOpen = false }: Props) {
  const [tasks, setTasks] = useState<WorkstationTask[]>(WORKSTATION_TASKS);
  const [view, setView] = useState<'list' | 'board'>(initialView);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [jivaOpen, setJivaOpen] = useState(initialJivaOpen);
  const [search, setSearch] = useState('');
  const [personFilter, setPersonFilter] = useState('');
  const [priorityFilterOpen, setPriorityFilterOpen] = useState(initialPriorityFilterOpen);
  const [priorityFilters, setPriorityFilters] = useState<Record<string, boolean>>({});
  const [createOpen, setCreateOpen] = useState(initialCreateOpen);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState('self');
  const [newPriority, setNewPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [newDue, setNewDue] = useState('');

  const selectTask = (id: string) => { setSelectedId(id); setJivaOpen(false); };

  const setStatus = (id: string, status: TaskStatus) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  const cycleStatus = (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: NEXT_STATUS[t.status] } : t)));
  const setPriority = (id: string, priority: TaskPriority) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, priority } : t)));
  const setDue = (id: string, due: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, due, overdue: false, dueColor: undefined } : t)));
  const togglePriorityFilter = (k: string) => setPriorityFilters((p) => ({ ...p, [k]: !p[k] }));

  const createTask = () => {
    const title = newTitle.trim();
    if (!title) return;
    const id = `t${Date.now()}`;
    const task: WorkstationTask = {
      id, text: title, description: newDescription.trim() || title,
      priority: newPriority,
      assignee: newAssigneeId === 'unassigned' ? 'Unassigned' : assigneeNameFor(newAssigneeId),
      assigneeId: newAssigneeId === 'unassigned' ? undefined : newAssigneeId,
      createdBy: 'You', due: newDue.trim() || 'No due date', overdue: false,
      status: 'open', origin: 'direct',
      logs: [{ time: 'Just now', text: 'Created directly' }],
    };
    setTasks((prev) => [task, ...prev]);
    selectTask(id);
    setCreateOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewAssigneeId('self');
    setNewPriority('Medium');
    setNewDue('');
  };

  const reassign = (id: string, a: AssigneeOption) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, assignee: a.id === 'self' ? 'You' : a.name, assigneeId: a.id } : t)));
  };

  const activePriorityFilters = Object.keys(priorityFilters).filter((k) => priorityFilters[k]);
  const q = search.trim().toLowerCase();
  const matches = (t: WorkstationTask) => {
    if (activePriorityFilters.length) {
      const isMatch = activePriorityFilters.some((k) => (k === 'Overdue' ? t.overdue : k === 'Generative' ? t.origin === 'generative' : t.priority === k));
      if (!isMatch) return false;
    }
    if (personFilter === 'unassigned') {
      if (t.assignee !== 'Unassigned') return false;
    } else if (personFilter) {
      if (t.assignee !== assigneeNameFor(personFilter)) return false;
    }
    if (q && !(t.text + ' ' + t.assignee).toLowerCase().includes(q)) return false;
    return true;
  };

  const assignedToMe = tasks.filter((t) => t.assignee === 'You').filter(matches);
  const unassignedTasks = tasks.filter((t) => t.assignee === 'Unassigned').filter(matches);
  const assignedByMe = tasks.filter((t) => t.createdBy === 'You' && t.assignee !== 'You' && t.assignee !== 'Unassigned').filter(matches);

  const overdueCount = useMemo(() => tasks.filter((t) => t.overdue).length, [tasks]);
  const jivaCount = useMemo(() => tasks.filter((t) => t.origin === 'generative').length, [tasks]);
  const statusCounts = useMemo(() => ({
    open: tasks.filter((t) => t.status === 'open').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  }), [tasks]);
  const selectedTask = tasks.find((t) => t.id === selectedId) ?? null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #e6e8ec', flex: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap' as const, gap: 8 }}>
          <div>
            <div style={{ font: '700 17px/1.3 Inter,sans-serif', color: '#23272d' }}>Workstation</div>
            <div style={{ font: '400 11.5px/1.5 Inter,sans-serif', color: '#9aa0a8', marginTop: 2 }}>
              {tasks.length} task{tasks.length === 1 ? '' : 's'}{overdueCount > 0 ? ` · ${overdueCount} overdue` : ''}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 'none' }}>
            {([['open', 'Open'], ['in_progress', 'In progress'], ['done', 'Done']] as const).map(([key, label]) => (
              <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 999, background: STATUS_COLOR[key] + '14', font: '600 10.5px/1 Inter,sans-serif', color: STATUS_COLOR[key] }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[key], flex: 'none' }} />
                {statusCounts[key]} {label}
              </span>
            ))}
            {jivaCount > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 999, background: '#f3eefa', font: '600 10.5px/1 Inter,sans-serif', color: '#5f3880' }}>
                <SparkleIcon size={9} /> {jivaCount} from Jiva
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, flexWrap: 'wrap' as const }}>
          <div style={{ display: 'flex', padding: 3, background: '#f1f2f4', borderRadius: 8, gap: 2, flex: 'none' }}>
            <span
              onClick={() => setView('list')}
              className={motion.pressable}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', font: '600 11.5px/1 Inter,sans-serif', color: view === 'list' ? '#5f3880' : '#6b7178', background: view === 'list' ? '#fff' : 'transparent', boxShadow: view === 'list' ? '0 1px 4px rgba(20,24,33,.12)' : 'none', transition: 'all .15s ease' }}
            >
              <ListViewIcon size={13} color={view === 'list' ? '#5f3880' : '#6b7178'} /> List
            </span>
            <span
              onClick={() => setView('board')}
              className={motion.pressable}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 6, cursor: 'pointer', font: '600 11.5px/1 Inter,sans-serif', color: view === 'board' ? '#5f3880' : '#6b7178', background: view === 'board' ? '#fff' : 'transparent', boxShadow: view === 'board' ? '0 1px 4px rgba(20,24,33,.12)' : 'none', transition: 'all .15s ease' }}
            >
              <BoardViewIcon size={13} color={view === 'board' ? '#5f3880' : '#6b7178'} /> Board
            </span>
          </div>

          <span style={{ width: 1, height: 22, background: '#e6e8ec', flex: 'none' }} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks"
            className={motion.focusRing}
            style={{ flex: '1 1 180px', minWidth: 140, padding: '8px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
          />
          <select
            value={personFilter}
            onChange={(e) => setPersonFilter(e.target.value)}
            className={motion.focusRing}
            style={{ padding: '8px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none', background: '#fff', flex: 'none' }}
          >
            <option value="">Everyone</option>
            {DEFAULT_ASSIGNEES.map((a) => (
              <option key={a.id} value={a.id}>{a.id === 'self' ? 'Me' : a.name}</option>
            ))}
            <option value="unassigned">Unassigned</option>
          </select>
          <span style={{ position: 'relative', flex: 'none' }}>
            <span
              onClick={() => { setPriorityFilterOpen((v) => !v); setCreateOpen(false); }}
              className={`${motion.pressable} ${motion.btnSecondary}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', border: `1px solid ${activePriorityFilters.length ? '#77469b' : '#dfe3ea'}`, borderRadius: 7, background: activePriorityFilters.length ? '#f9f7fc' : '#fff', font: '500 12px/1 Inter,sans-serif', color: activePriorityFilters.length ? '#5f3880' : '#3d434b', cursor: 'pointer', whiteSpace: 'nowrap' as const }}
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M1 3h14M4 8h8M6.5 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              Priority{activePriorityFilters.length ? ` (${activePriorityFilters.length})` : ''}
            </span>
            {priorityFilterOpen && (
              <div className={motion.popInTop} style={{ position: 'absolute', left: 0, top: 40, width: 190, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.16)', padding: 10, zIndex: 60 }} onClick={(e) => e.stopPropagation()}>
                {(['High', 'Medium', 'Low'] as const).map((k) => (
                  <div key={k} onClick={() => togglePriorityFilter(k)} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '6px 8px', borderRadius: 6 }}>
                    <span style={{ width: 13, height: 13, borderRadius: 3, border: `1.5px solid ${priorityFilters[k] ? PRIORITY_FILTER_COLOR[k] : '#cfd4dc'}`, background: priorityFilters[k] ? PRIORITY_FILTER_COLOR[k] : '#fff', flex: 'none', transition: 'background 120ms ease-out' }} />
                    <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>{k}</span>
                  </div>
                ))}
                <div style={{ height: 1, background: '#f1f2f4', margin: '6px 0' }} />
                <div style={{ font: '600 9px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8', padding: '0 8px 4px' }}>Origin</div>
                {(['Generative', 'Overdue'] as const).map((k) => (
                  <div key={k} onClick={() => togglePriorityFilter(k)} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '6px 8px', borderRadius: 6 }}>
                    <span style={{ width: 13, height: 13, borderRadius: 3, border: `1.5px solid ${priorityFilters[k] ? PRIORITY_FILTER_COLOR[k] : '#cfd4dc'}`, background: priorityFilters[k] ? PRIORITY_FILTER_COLOR[k] : '#fff', flex: 'none', transition: 'background 120ms ease-out' }} />
                    <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>{k}</span>
                  </div>
                ))}
                {activePriorityFilters.length > 0 && (
                  <span
                    onClick={() => setPriorityFilters({})}
                    className={motion.pressable}
                    style={{ display: 'block', textAlign: 'center' as const, marginTop: 6, padding: 7, borderRadius: 6, border: '1px solid #dfe3ea', font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}
                  >
                    Clear
                  </span>
                )}
              </div>
            )}
          </span>

          <span style={{ position: 'relative', marginLeft: 'auto', flex: 'none' }}>
            <span
              onClick={() => { setCreateOpen((v) => !v); setPriorityFilterOpen(false); }}
              className={`${motion.pressable} ${motion.btnPrimary}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' as const }}
            >
              <PlusIcon size={11} /> New task
            </span>
            {createOpen && (
              <div className={motion.popIn} style={{ position: 'absolute', right: 0, top: 40, width: 320, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 14, zIndex: 60 }} onClick={(e) => e.stopPropagation()}>
                <div style={{ font: '700 12.5px/1 Inter,sans-serif', color: '#23272d', marginBottom: 10 }}>New task</div>
                <input
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) createTask(); if (e.key === 'Escape') setCreateOpen(false); }}
                  placeholder="What needs to get done?"
                  className={motion.focusRing}
                  style={{ width: '100%', padding: '9px 11px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12.5px/1.4 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
                />
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Add more detail (optional)"
                  rows={2}
                  className={motion.focusRing}
                  style={{ width: '100%', marginTop: 8, padding: '8px 11px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1.5 Inter,sans-serif', color: '#3d434b', outline: 'none', resize: 'none' as const, fontFamily: 'inherit' }}
                />

                <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8', marginTop: 11 }}>Priority</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  {(['High', 'Medium', 'Low'] as const).map((p) => (
                    <span
                      key={p}
                      onClick={() => setNewPriority(p)}
                      className={motion.pressable}
                      style={{ flex: 1, textAlign: 'center' as const, padding: '6px 0', borderRadius: 6, border: `1px solid ${newPriority === p ? PRIORITY_COLOR[p] : '#dfe3ea'}`, background: newPriority === p ? PRIORITY_COLOR[p] + '14' : '#fff', font: '600 11px/1 Inter,sans-serif', color: newPriority === p ? PRIORITY_COLOR[p] : '#6b7178', cursor: 'pointer' }}
                    >
                      {p}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 11 }}>
                  <select
                    value={newAssigneeId}
                    onChange={(e) => setNewAssigneeId(e.target.value)}
                    className={motion.focusRing}
                    style={{ flex: 1, minWidth: 0, padding: '8px 9px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 11.5px/1 Inter,sans-serif', color: '#3d434b', outline: 'none', background: '#fff' }}
                  >
                    {DEFAULT_ASSIGNEES.map((a) => (
                      <option key={a.id} value={a.id}>{a.id === 'self' ? 'Me' : a.name}</option>
                    ))}
                    <option value="unassigned">Unassigned</option>
                  </select>
                  <input
                    value={newDue}
                    onChange={(e) => setNewDue(e.target.value)}
                    placeholder="Due (optional)"
                    className={motion.focusRing}
                    style={{ flex: 1, minWidth: 0, padding: '8px 9px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 11.5px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <span onClick={() => setCreateOpen(false)} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ flex: 1, textAlign: 'center' as const, padding: '8px', border: '1px solid #dfe3ea', borderRadius: 7, font: '600 11.5px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Cancel</span>
                  <span
                    onClick={createTask}
                    className={newTitle.trim() ? `${motion.pressable} ${motion.btnPrimary}` : motion.pressable}
                    style={{ flex: 1, textAlign: 'center' as const, padding: '8px', borderRadius: 7, background: newTitle.trim() ? '#77469b' : '#eee7f5', color: newTitle.trim() ? '#fff' : '#c3b3d6', font: '600 11.5px/1 Inter,sans-serif', cursor: newTitle.trim() ? 'pointer' : 'default' }}
                  >
                    Create task
                  </span>
                </div>
              </div>
            )}
          </span>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
        {jivaOpen && selectedTask ? (
          <>
            <WorkStationDetailPanel
              key={selectedTask.id}
              task={selectedTask}
              onClose={() => { setSelectedId(null); setJivaOpen(false); }}
              onReassign={(a) => reassign(selectedTask.id, a)}
              onSetStatus={(s) => setStatus(selectedTask.id, s)}
              onSetPriority={(p) => setPriority(selectedTask.id, p)}
              onSetDue={(d) => setDue(selectedTask.id, d)}
              onOpenAlert={onOpenAlert}
              onOpenMeeting={onOpenMeeting}
              onOpenJiva={() => setJivaOpen((v) => !v)}
              jivaOpen={jivaOpen}
              initialContextOpen={initialDetailContextOpen}
            />
            <WorkStationAskJivaPanel task={selectedTask} onClose={() => setJivaOpen(false)} />
          </>
        ) : (
          <>
            <div className={view === 'list' ? scrollStyles.sleekScroll : undefined} style={{ flex: 1, minWidth: 0, overflowY: view === 'list' ? 'auto' : 'hidden', background: '#fafbfc', borderRight: selectedTask ? '1px solid #eceef1' : 'none' }}>
              {view === 'list' ? (
                <WorkStationListView assignedToMe={assignedToMe} unassigned={unassignedTasks} assignedByMe={assignedByMe} selectedId={selectedId} onSelect={selectTask} onCycleStatus={cycleStatus} />
              ) : (
                <WorkStationBoardView assignedToMe={assignedToMe} unassigned={unassignedTasks} assignedByMe={assignedByMe} selectedId={selectedId} onSelect={selectTask} onCycleStatus={cycleStatus} />
              )}
            </div>

            {selectedTask && (
              <WorkStationDetailPanel
                key={selectedTask.id}
                task={selectedTask}
                onClose={() => setSelectedId(null)}
                onReassign={(a) => reassign(selectedTask.id, a)}
                onSetStatus={(s) => setStatus(selectedTask.id, s)}
                onSetPriority={(p) => setPriority(selectedTask.id, p)}
                onSetDue={(d) => setDue(selectedTask.id, d)}
                onOpenAlert={onOpenAlert}
                onOpenMeeting={onOpenMeeting}
                onOpenJiva={() => setJivaOpen((v) => !v)}
                jivaOpen={jivaOpen}
                initialContextOpen={initialDetailContextOpen}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
