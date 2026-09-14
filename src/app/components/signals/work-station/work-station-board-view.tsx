import type { WorkstationTask, TaskStatus } from '@/constants/signals/prototype-data';
import { Avatar } from '../alerts/assign-menu';
import { HoverTip } from '../alerts/hover-tip';
import { StatusCircleIcon, OriginGlyph, STATUS_COLOR, ContextSourceStack } from './work-station-icons';
import motion from '../alerts/motion.module.scss';

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'open', label: 'Open' },
  { status: 'in_progress', label: 'In progress' },
  { status: 'done', label: 'Done' },
];

interface BoardTask extends WorkstationTask {
  relation: 'to-me' | 'by-me' | 'unassigned';
}

const RELATION_LABEL: Record<BoardTask['relation'], string> = {
  'to-me': 'To me',
  'by-me': 'By me',
  unassigned: 'Unassigned',
};
const RELATION_COLOR: Record<BoardTask['relation'], string> = {
  'to-me': '#77469b',
  'by-me': '#5c7f9e',
  unassigned: '#a8763f',
};

function BoardCard({ task, selected, onSelect, onCycleStatus }: { task: BoardTask; selected: boolean; onSelect: () => void; onCycleStatus: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={motion.cardHover}
      style={{
        padding: '11px 12px',
        border: '1px solid #eceef1', borderLeft: selected ? '3px solid #77469b' : '1px solid #eceef1',
        borderRadius: 9, background: selected ? '#faf8fd' : '#fff',
        boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 9,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        {task.contextSources?.length ? <ContextSourceStack sources={task.contextSources} size={20} /> : <OriginGlyph origin={task.origin} size={16} />}
        <span style={{ font: '600 9px/1.5 Inter,sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: RELATION_COLOR[task.relation] }}>
          {RELATION_LABEL[task.relation]}
        </span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          {task.overdue && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#b3453f', flex: 'none' }} />}
          <HoverTip label="Click to advance status">
            <span onClick={(e) => { e.stopPropagation(); onCycleStatus(); }} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer', borderRadius: '50%' }}>
              <StatusCircleIcon status={task.status} />
            </span>
          </HoverTip>
        </span>
      </div>
      <div style={{ font: `${task.status === 'done' ? '400' : '500'} 12.5px/1.4 Inter,sans-serif`, color: task.status === 'done' ? '#9aa0a8' : '#23272d', textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
        {task.text}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Avatar name={task.assignee} size={18} vivid={task.assignee !== 'Unassigned'} />
        <span style={{ font: '500 11px/1 Inter,sans-serif', color: task.assignee === 'Unassigned' ? '#a8763f' : '#6b7178', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{task.assignee}</span>
        <span style={{ font: '600 10.5px/1 Inter,sans-serif', color: task.overdue ? '#b3453f' : (task.dueColor || '#9aa0a8'), flex: 'none' }}>{task.due}</span>
      </div>
    </div>
  );
}

export function WorkStationBoardView({ assignedToMe, unassigned, assignedByMe, selectedId, onSelect, onCycleStatus }: {
  assignedToMe: WorkstationTask[];
  unassigned: WorkstationTask[];
  assignedByMe: WorkstationTask[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCycleStatus: (id: string) => void;
}) {
  const all: BoardTask[] = [
    ...assignedToMe.map((t) => ({ ...t, relation: 'to-me' as const })),
    ...assignedByMe.map((t) => ({ ...t, relation: 'by-me' as const })),
    ...unassigned.map((t) => ({ ...t, relation: 'unassigned' as const })),
  ];

  return (
    <div style={{ display: 'flex', gap: 14, padding: '4px 20px 20px', height: '100%', minHeight: 0 }}>
      {COLUMNS.map((col) => {
        const items = all.filter((t) => t.status === col.status);
        const accent = STATUS_COLOR[col.status];
        return (
          <div key={col.status} style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ height: 2.5, borderRadius: 2, background: accent, opacity: 0.5, flex: 'none', margin: '0 4px 8px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 4px 8px', flex: 'none' }}>
              <StatusCircleIcon status={col.status} />
              <span style={{ font: '700 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#464646' }}>{col.label}</span>
              <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>{items.length}</span>
            </div>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 9, padding: '2px 4px 6px', background: `${accent}08`, borderRadius: 9, border: '1px solid #f1f2f4' }}>
              {items.length === 0 && (
                <div style={{ margin: '2px 0', padding: '20px 10px', textAlign: 'center', border: '1px dashed #e6e8ec', borderRadius: 9, font: '400 11.5px/1.6 Inter,sans-serif', color: '#c3c7cd' }}>No tasks</div>
              )}
              {items.map((t) => (
                <BoardCard key={t.id} task={t} selected={selectedId === t.id} onSelect={() => onSelect(t.id)} onCycleStatus={() => onCycleStatus(t.id)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
