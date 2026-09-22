import { useState } from 'react';
import {
  WORKSTATION_TASKS,
  type WorkstationTask, type TaskStatus, type TaskPriority, type AssigneeOption,
} from '@/constants/signals/prototype-data';
import { DEFAULT_ASSIGNEES } from '../alerts/assign-menu';
import { PlusIcon } from '../alerts/icons';
import { WorkStationListView } from './work-station-list-view';
import { WorkStationDetailPanel } from './work-station-detail-panel';
import { WorkStationAskJivaPanel } from './work-station-ask-jiva-panel';
import { PRIORITY_COLOR, ListViewIcon } from './work-station-icons';
import { SignalsEmptyState } from '../common/signals-empty-state';
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

/** Category filters the empty-state cards apply — kept separate from priority/person filters since they're mutually exclusive facets. */
const QUICK_FILTER_LABEL = {
  'to-me': 'Assigned to me', 'by-me': 'Assigned by me', unassigned: 'Unassigned',
  overdue: 'Overdue', in_progress: 'In progress', done: 'Done',
} as const;

interface Props {
  onOpenAlert?: (id: string) => void;
  onOpenMeeting?: (id: string) => void;
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

export function WorkStation({ onOpenAlert, onOpenMeeting, initialSelectedId = null, initialJivaOpen = false, initialPriorityFilterOpen = false, initialCreateOpen = false, initialDetailContextOpen = false }: Props) {
  const [tasks, setTasks] = useState<WorkstationTask[]>(WORKSTATION_TASKS);
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const [jivaOpen, setJivaOpen] = useState(initialJivaOpen);
  const [search, setSearch] = useState('');
  const [personFilter, setPersonFilter] = useState('');
  const [priorityFilterOpen, setPriorityFilterOpen] = useState(initialPriorityFilterOpen);
  const [priorityFilters, setPriorityFilters] = useState<Record<string, boolean>>({});
  const [categoryQuickFilter, setCategoryQuickFilter] = useState<keyof typeof QUICK_FILTER_LABEL | null>(null);
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
    if (categoryQuickFilter) {
      const isMatch =
        categoryQuickFilter === 'to-me' ? t.assignee === 'You' :
        categoryQuickFilter === 'by-me' ? (t.createdBy === 'You' && t.assignee !== 'You' && t.assignee !== 'Unassigned') :
        categoryQuickFilter === 'unassigned' ? t.assignee === 'Unassigned' :
        categoryQuickFilter === 'overdue' ? !!t.overdue :
        categoryQuickFilter === 'in_progress' ? t.status === 'in_progress' :
        t.status === 'done';
      if (!isMatch) return false;
    }
    if (q && !(t.text + ' ' + t.assignee).toLowerCase().includes(q)) return false;
    return true;
  };

  const assignedToMe = tasks.filter((t) => t.assignee === 'You').filter(matches);
  const unassignedTasks = tasks.filter((t) => t.assignee === 'Unassigned').filter(matches);
  const assignedByMe = tasks.filter((t) => t.createdBy === 'You' && t.assignee !== 'You' && t.assignee !== 'Unassigned').filter(matches);
  const overdueTasks = tasks.filter((t) => t.overdue);
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const doneTasks = tasks.filter((t) => t.status === 'done');
  // Unfiltered totals for the empty-state cards — independent of categoryQuickFilter so clicking one card doesn't shrink the others' counts.
  const totalToMe = tasks.filter((t) => t.assignee === 'You').length;
  const totalByMe = tasks.filter((t) => t.createdBy === 'You' && t.assignee !== 'You' && t.assignee !== 'Unassigned').length;
  const totalUnassigned = tasks.filter((t) => t.assignee === 'Unassigned').length;

  const selectedTask = tasks.find((t) => t.id === selectedId) ?? null;

  return (
    <div style={{ height: '100%', display: 'flex', gap: 16 }}>
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
          <div style={{ flex: '0 0 35%', maxWidth: '35%', minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'visible', position: 'relative' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #e6e8ec', display: 'flex', flexDirection: 'column', gap: 9, flex: 'none', position: 'relative' }}>
              <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks"
                  className={motion.focusRing}
                  style={{ flex: 1, minWidth: 0, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
                />
          <span style={{ position: 'relative', flex: 'none' }}>
            <span
              onClick={() => { setPriorityFilterOpen((v) => !v); setCreateOpen(false); }}
              className={motion.pressable}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 16px', border: `1px solid ${priorityFilterOpen ? '#77469b' : '#dfe3ea'}`, borderRadius: 6, font: '500 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', background: priorityFilterOpen ? '#f9f7fc' : '#fff', whiteSpace: 'nowrap' as const, transition: 'background 140ms ease-out, border-color 140ms ease-out' }}
              onMouseEnter={(e) => { if (!priorityFilterOpen) e.currentTarget.style.background = '#fafbfd'; }}
              onMouseLeave={(e) => { if (!priorityFilterOpen) e.currentTarget.style.background = '#fff'; }}
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M1 3h14M4 8h8M6.5 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
              Filter{activePriorityFilters.length + (personFilter ? 1 : 0) ? ` (${activePriorityFilters.length + (personFilter ? 1 : 0)})` : ''}
            </span>
            {priorityFilterOpen && (
              <div className={motion.popInTop} style={{ position: 'absolute', left: 0, top: 40, width: 200, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.16)', padding: 10, zIndex: 60 }} onClick={(e) => e.stopPropagation()}>
                <div style={{ font: '600 9px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8', padding: '0 8px 4px' }}>Priority</div>
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
                <div style={{ height: 1, background: '#f1f2f4', margin: '6px 0' }} />
                <div style={{ font: '600 9px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8', padding: '0 8px 4px' }}>Assigned to</div>
                <div onClick={() => setPersonFilter('')} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '6px 8px', borderRadius: 6 }}>
                  <span style={{ width: 13, height: 13, borderRadius: 3, border: `1.5px solid ${personFilter === '' ? '#77469b' : '#cfd4dc'}`, background: personFilter === '' ? '#77469b' : '#fff', flex: 'none', transition: 'background 120ms ease-out' }} />
                  <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>Everyone</span>
                </div>
                {DEFAULT_ASSIGNEES.map((a) => (
                  <div key={a.id} onClick={() => setPersonFilter(a.id)} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '6px 8px', borderRadius: 6 }}>
                    <span style={{ width: 13, height: 13, borderRadius: 3, border: `1.5px solid ${personFilter === a.id ? '#77469b' : '#cfd4dc'}`, background: personFilter === a.id ? '#77469b' : '#fff', flex: 'none', transition: 'background 120ms ease-out' }} />
                    <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>{a.id === 'self' ? 'Me' : a.name}</span>
                  </div>
                ))}
                <div onClick={() => setPersonFilter('unassigned')} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '6px 8px', borderRadius: 6 }}>
                  <span style={{ width: 13, height: 13, borderRadius: 3, border: `1.5px solid ${personFilter === 'unassigned' ? '#77469b' : '#cfd4dc'}`, background: personFilter === 'unassigned' ? '#77469b' : '#fff', flex: 'none', transition: 'background 120ms ease-out' }} />
                  <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>Unassigned</span>
                </div>
                {(activePriorityFilters.length > 0 || personFilter) && (
                  <span
                    onClick={() => { setPriorityFilters({}); setPersonFilter(''); setCategoryQuickFilter(null); }}
                    className={motion.pressable}
                    style={{ display: 'block', textAlign: 'center' as const, marginTop: 6, padding: 7, borderRadius: 6, border: '1px solid #dfe3ea', font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}
                  >
                    Clear
                  </span>
                )}
              </div>
            )}
          </span>

                <span style={{ position: 'relative', flex: 'none' }}>
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
              {categoryQuickFilter && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 6px 4px 10px', borderRadius: 999, background: '#f9f7fc', border: '1px solid #e3d8f0', font: '600 11px/1 Inter,sans-serif', color: '#5f3880' }}>
                    {QUICK_FILTER_LABEL[categoryQuickFilter]}
                    <span onClick={() => setCategoryQuickFilter(null)} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 16, height: 16, borderRadius: '50%', cursor: 'pointer', color: '#5f3880' }}>
                      <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    </span>
                  </span>
                </div>
              )}
            </div>

            <div className={scrollStyles.sleekScroll} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <WorkStationListView assignedToMe={assignedToMe} unassigned={unassignedTasks} assignedByMe={assignedByMe} selectedId={selectedId} onSelect={selectTask} onCycleStatus={cycleStatus} />
            </div>
          </div>

          {selectedTask ? (
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
          ) : (
            <div style={{ flex: 1, minWidth: 0, minHeight: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
              <SignalsEmptyState
                icon={<ListViewIcon size={16} color="#77469b" />}
                title="Select a task to view details"
                subtitle="Here's a quick overview of your work-station. Click a category to filter the list."
                categories={[
                  { key: 'to-me', label: 'Assigned to me', count: totalToMe, unit: 'tasks', color: '#77469b', onClick: () => setCategoryQuickFilter('to-me') },
                  { key: 'by-me', label: 'Assigned by me', count: totalByMe, unit: 'tasks', color: '#5c7f9e', onClick: () => setCategoryQuickFilter('by-me') },
                  { key: 'unassigned', label: 'Unassigned', count: totalUnassigned, unit: 'tasks', color: '#a8763f', onClick: () => setCategoryQuickFilter('unassigned') },
                  { key: 'overdue', label: 'Overdue', count: overdueTasks.length, unit: 'tasks', color: '#b3453f', onClick: () => setCategoryQuickFilter('overdue') },
                  { key: 'in-progress', label: 'In progress', count: inProgressTasks.length, unit: 'tasks', color: '#0071ce', onClick: () => setCategoryQuickFilter('in_progress') },
                  { key: 'done', label: 'Done', count: doneTasks.length, unit: 'tasks', color: '#3f7d6a', onClick: () => setCategoryQuickFilter('done') },
                ]}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
