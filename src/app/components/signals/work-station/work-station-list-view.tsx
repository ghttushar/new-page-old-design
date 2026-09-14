import { useState } from 'react';
import type { WorkstationTask } from '@/constants/signals/prototype-data';
import { Avatar } from '../alerts/assign-menu';
import { StatusCircleIcon, OriginGlyph } from './work-station-icons';
import motion from '../alerts/motion.module.scss';

function GroupDisclosure({ open }: { open: boolean }) {
  return (
    <svg width="8" height="8" viewBox="0 0 16 16" fill="none" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 150ms ease-out', flex: 'none' }}>
      <path d="M5 2.5l6 5.5-6 5.5" stroke="#6b7178" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TaskRow({ task, selected, onSelect }: { task: WorkstationTask; selected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={motion.rowHover}
      style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 20px', margin: '0 8px', borderRadius: 7, cursor: 'pointer', background: selected ? '#f6f4fa' : 'transparent' }}
    >
      <StatusCircleIcon status={task.status} />
      <span style={{ flex: 1, minWidth: 0, font: `${task.status === 'done' ? '400' : '500'} 12.5px/1.4 Inter,sans-serif`, color: task.status === 'done' ? '#9aa0a8' : '#23272d', textDecoration: task.status === 'done' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
        {task.text}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', flex: 'none' }}><OriginGlyph origin={task.origin} /></span>
      <span style={{ font: '500 11px/1 Inter,sans-serif', color: task.overdue ? '#b3453f' : (task.dueColor || '#9aa0a8'), flex: 'none', width: 96, textAlign: 'right' as const, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {task.due}
      </span>
      <span style={{ flex: 'none', display: 'flex' }}><Avatar name={task.assignee} size={22} vivid={task.assignee !== 'Unassigned'} /></span>
    </div>
  );
}

function TaskGroup({ label, color, tasks, selectedId, onSelect, emptyText }: {
  label: string; color: string; tasks: WorkstationTask[]; selectedId: string | null; onSelect: (id: string) => void; emptyText: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ paddingTop: 6 }}>
      <div onClick={() => setOpen((v) => !v)} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', margin: '0 8px', borderRadius: 7, cursor: 'pointer' }}>
        <GroupDisclosure open={open} />
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flex: 'none' }} />
        <span style={{ font: '700 11.5px/1 Inter,sans-serif', color: '#23272d' }}>{label}</span>
        <span style={{ font: '500 11px/1 Inter,sans-serif', color: '#9aa0a8' }}>{tasks.length}</span>
      </div>
      <div className={`${motion.accordionRow} ${open ? motion.accordionRowOpen : ''}`}>
        <div>
          {tasks.length === 0 && (
            <div style={{ padding: '10px 20px 14px 46px', font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>{emptyText}</div>
          )}
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} selected={selectedId === t.id} onSelect={() => onSelect(t.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorkStationListView({ assignedToMe, assignedByMe, selectedId, onSelect }: {
  assignedToMe: WorkstationTask[];
  assignedByMe: WorkstationTask[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div style={{ paddingBottom: 16 }}>
      <TaskGroup label="Assigned to me" color="#77469b" tasks={assignedToMe} selectedId={selectedId} onSelect={onSelect} emptyText="Nothing assigned to you right now." />
      <TaskGroup label="Assigned by me" color="#5c7f9e" tasks={assignedByMe} selectedId={selectedId} onSelect={onSelect} emptyText="You haven't assigned anything to the team yet." />
    </div>
  );
}
