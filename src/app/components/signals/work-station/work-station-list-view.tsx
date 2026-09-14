import { useState } from 'react';
import type { WorkstationTask } from '@/constants/signals/prototype-data';
import { Avatar } from '../alerts/assign-menu';
import { ChevronDownIcon } from '../alerts/icons';
import { HoverTip } from '../alerts/hover-tip';
import { StatusCircleIcon, OriginGlyph } from './work-station-icons';
import motion from '../alerts/motion.module.scss';

function TaskRow({ task, selected, onSelect, onCycleStatus }: { task: WorkstationTask; selected: boolean; onSelect: () => void; onCycleStatus: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={motion.cardHover}
      style={{
        display: 'flex', alignItems: 'center', gap: 11,
        margin: '7px 14px', padding: '11px 14px',
        border: '1px solid #eceef1', borderLeft: selected ? '3px solid #77469b' : '1px solid #eceef1',
        borderRadius: 9, background: selected ? '#f9f7fc' : '#fff',
        boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer',
      }}
    >
      <HoverTip label="Click to advance status">
        <span onClick={(e) => { e.stopPropagation(); onCycleStatus(); }} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer', borderRadius: '50%' }}>
          <StatusCircleIcon status={task.status} />
        </span>
      </HoverTip>
      <span style={{ flex: 1, minWidth: 0, font: `${task.status === 'done' ? '400' : '500'} 12.5px/1.4 Inter,sans-serif`, color: task.status === 'done' ? '#9aa0a8' : '#23272d', textDecoration: task.status === 'done' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
        {task.text}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', flex: 'none' }}><OriginGlyph origin={task.origin} size={16} /></span>
      <span style={{ font: '500 11px/1 Inter,sans-serif', color: task.overdue ? '#b3453f' : (task.dueColor || '#9aa0a8'), flex: 'none', width: 96, textAlign: 'right' as const, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {task.due}
      </span>
      <span style={{ flex: 'none', display: 'flex' }}><Avatar name={task.assignee} size={22} vivid={task.assignee !== 'Unassigned'} /></span>
    </div>
  );
}

function TaskGroup({ label, color, tasks, selectedId, onSelect, onCycleStatus, emptyText }: {
  label: string; color: string; tasks: WorkstationTask[]; selectedId: string | null; onSelect: (id: string) => void; onCycleStatus: (id: string) => void; emptyText: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ paddingTop: 10 }}>
      <div onClick={() => setOpen((v) => !v)} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', margin: '0 14px', borderRadius: 6, cursor: 'pointer' }}>
        <span style={{ display: 'flex', transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform 160ms ease-out' }}>
          <ChevronDownIcon size={9} color="#6b7178" />
        </span>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flex: 'none' }} />
        <span style={{ font: '700 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#464646' }}>{label}</span>
        <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>{tasks.length}</span>
      </div>
      <div className={`${motion.accordionRow} ${open ? motion.accordionRowOpen : ''}`}>
        <div>
          {tasks.length === 0 && (
            <div style={{ margin: '2px 14px 4px', padding: '10px 14px', border: '1px dashed #e6e8ec', borderRadius: 9, font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>{emptyText}</div>
          )}
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} selected={selectedId === t.id} onSelect={() => onSelect(t.id)} onCycleStatus={() => onCycleStatus(t.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function WorkStationListView({ assignedToMe, unassigned, assignedByMe, selectedId, onSelect, onCycleStatus }: {
  assignedToMe: WorkstationTask[];
  unassigned: WorkstationTask[];
  assignedByMe: WorkstationTask[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCycleStatus: (id: string) => void;
}) {
  return (
    <div style={{ paddingBottom: 16 }}>
      <TaskGroup label="Assigned to me" color="#77469b" tasks={assignedToMe} selectedId={selectedId} onSelect={onSelect} onCycleStatus={onCycleStatus} emptyText="Nothing assigned to you right now." />
      <TaskGroup label="Assigned by me" color="#5c7f9e" tasks={assignedByMe} selectedId={selectedId} onSelect={onSelect} onCycleStatus={onCycleStatus} emptyText="You haven't assigned anything to the team yet." />
      <TaskGroup label="Unassigned" color="#a8763f" tasks={unassigned} selectedId={selectedId} onSelect={onSelect} onCycleStatus={onCycleStatus} emptyText="Nothing waiting on an owner." />
    </div>
  );
}
