import { useState } from 'react';
import type { WorkstationTask } from '@/constants/signals/prototype-data';
import { Avatar } from '../alerts/assign-menu';
import { ChevronDownIcon, SparkleIcon } from '../alerts/icons';
import { HoverTip } from '../alerts/hover-tip';
import { StatusCircleIcon, OriginGlyph, ContextSourceStack, STATUS_COLOR, STATUS_LABEL } from './work-station-icons';
import motion from '../alerts/motion.module.scss';

function TaskRow({ task, selected, onSelect, onCycleStatus }: { task: WorkstationTask; selected: boolean; onSelect: () => void; onCycleStatus: () => void }) {
  const lastLog = task.logs[task.logs.length - 1];
  const lastIsJiva = !!lastLog && lastLog.text.toLowerCase().includes('jiva');
  return (
    <div
      onClick={onSelect}
      className={motion.cardHover}
      style={{
        margin: '10px 12px', padding: '14px 16px',
        border: '1px solid #eceef1', borderLeft: selected ? '3px solid #77469b' : '1px solid #eceef1',
        borderRadius: 10, background: selected ? '#f9f7fc' : task.origin === 'generative' ? 'linear-gradient(135deg, rgba(119,70,155,.05), #fff 60%)' : '#fff',
        boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer',
      }}
    >
      {/* Top line — badges left, due date right, same placement as the Meetings row's time/dateLabel line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ flex: 'none', display: 'flex' }}><Avatar name={task.assignee} size={20} vivid={task.assignee !== 'Unassigned'} /></span>
        <span style={{ display: 'flex', alignItems: 'center', flex: 'none' }}>
          {task.contextSources?.length ? <ContextSourceStack sources={task.contextSources} size={17} /> : <OriginGlyph origin={task.origin} size={14} />}
        </span>
        <span style={{ marginLeft: 'auto', font: '600 11px/1 Inter,sans-serif', color: task.overdue ? '#b3453f' : (task.dueColor || '#9aa0a8'), flex: 'none' }}>{task.due}</span>
      </div>

      {/* Full title, own line — never truncated */}
      <div style={{ font: `${task.status === 'done' ? '400' : '600'} 14px/1.35 Inter,sans-serif`, color: task.status === 'done' ? '#9aa0a8' : '#23272d', textDecoration: task.status === 'done' ? 'line-through' : 'none', marginTop: 9 }}>
        {task.text}
      </div>

      {/* Status pill + last activity, same role as the Meetings row's status line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 9, minWidth: 0 }}>
        <HoverTip label="Click to advance status">
          <span onClick={(e) => { e.stopPropagation(); onCycleStatus(); }} className={motion.pressable} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px 4px 6px', borderRadius: 999, background: STATUS_COLOR[task.status] + '14', cursor: 'pointer', flex: 'none' }}>
            <StatusCircleIcon status={task.status} size={12} />
            <span style={{ font: '600 11px/1 Inter,sans-serif', color: STATUS_COLOR[task.status], whiteSpace: 'nowrap' as const }}>{STATUS_LABEL[task.status]}</span>
          </span>
        </HoverTip>
        {lastLog && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0, flex: 1 }}>
            {lastIsJiva && <span style={{ flex: 'none', display: 'flex' }}><SparkleIcon size={10} color="#8a5eae" /></span>}
            <span style={{ flex: 1, minWidth: 0, font: '400 11.5px/1.4 Inter,sans-serif', color: '#9aa0a8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{lastLog.text}</span>
          </div>
        )}
      </div>
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
