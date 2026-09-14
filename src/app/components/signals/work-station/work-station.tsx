import { useMemo, useState } from 'react';
import {
  WORKSTATION_TASKS,
  type WorkstationTask, type TaskStatus, type AssigneeOption,
} from '@/constants/signals/prototype-data';
import { DEFAULT_ASSIGNEES } from '../alerts/assign-menu';
import { WorkStationListView } from './work-station-list-view';
import { WorkStationBoardView } from './work-station-board-view';
import { WorkStationDetailPanel } from './work-station-detail-panel';
import { WorkStationAskJivaPanel } from './work-station-ask-jiva-panel';
import { ListViewIcon, BoardViewIcon } from './work-station-icons';
import scrollStyles from '../alerts/alerts-scroll.module.scss';
import motion from '../alerts/motion.module.scss';

function assigneeNameFor(id: string): string {
  const a = DEFAULT_ASSIGNEES.find((d) => d.id === id);
  return id === 'self' ? 'You' : a?.name ?? id;
}

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = { open: 'in_progress', in_progress: 'done', done: 'open' };

interface Props {
  onOpenAlert?: (id: string) => void;
  onOpenMeeting?: (id: string) => void;
}

export function WorkStation({ onOpenAlert, onOpenMeeting }: Props) {
  const [tasks, setTasks] = useState<WorkstationTask[]>(WORKSTATION_TASKS);
  const [view, setView] = useState<'list' | 'board'>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [jivaOpen, setJivaOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [personFilter, setPersonFilter] = useState('');
  const [overdueOnly, setOverdueOnly] = useState(false);

  const selectTask = (id: string) => { setSelectedId(id); setJivaOpen(false); };

  const setStatus = (id: string, status: TaskStatus) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  const cycleStatus = (id: string) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: NEXT_STATUS[t.status] } : t)));

  const reassign = (id: string, a: AssigneeOption) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, assignee: a.id === 'self' ? 'You' : a.name, assigneeId: a.id } : t)));
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
  const unassignedTasks = tasks.filter((t) => t.assignee === 'Unassigned').filter(matches);
  const assignedByMe = tasks.filter((t) => t.createdBy === 'You' && t.assignee !== 'You' && t.assignee !== 'Unassigned').filter(matches);

  const overdueCount = useMemo(() => tasks.filter((t) => t.overdue).length, [tasks]);
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
          <span
            onClick={() => setOverdueOnly((v) => !v)}
            className={`${motion.pressable} ${motion.btnSecondary}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 13px', border: `1px solid ${overdueOnly ? '#77469b' : '#dfe3ea'}`, borderRadius: 7, background: overdueOnly ? '#f9f7fc' : '#fff', font: '500 12px/1 Inter,sans-serif', color: overdueOnly ? '#5f3880' : '#3d434b', cursor: 'pointer', flex: 'none', whiteSpace: 'nowrap' as const }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M1 3h14M4 8h8M6.5 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            Overdue only
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
              onOpenAlert={onOpenAlert}
              onOpenMeeting={onOpenMeeting}
              onOpenJiva={() => setJivaOpen((v) => !v)}
              jivaOpen={jivaOpen}
            />
            <WorkStationAskJivaPanel task={selectedTask} onClose={() => setJivaOpen(false)} />
          </>
        ) : (
          <>
            <div className={view === 'list' ? scrollStyles.sleekScroll : undefined} style={{ flex: 1, minWidth: 0, overflowY: view === 'list' ? 'auto' : 'hidden' }}>
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
                onOpenAlert={onOpenAlert}
                onOpenMeeting={onOpenMeeting}
                onOpenJiva={() => setJivaOpen((v) => !v)}
                jivaOpen={jivaOpen}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
