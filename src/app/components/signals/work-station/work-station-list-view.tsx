import { useState } from 'react';
import type { WorkstationTask } from '@/constants/signals/prototype-data';
import { Avatar } from '../alerts/assign-menu';
import { ChevronDownIcon, BellIcon, CheckIcon } from '../alerts/icons';
import { HoverTip } from '../alerts/hover-tip';
import { StatusCircleIcon, OriginGlyph, ContextSourceStack, STATUS_COLOR, STATUS_LABEL } from './work-station-icons';
import motion from '../alerts/motion.module.scss';

/** A task the current user delegated to a named person — the only tasks the "Remind" ping applies to. */
export function isDelegated(task: WorkstationTask): boolean {
  return task.createdBy === 'You' && task.assignee !== 'You' && task.assignee !== 'Unassigned';
}

function TaskRow({ task, selected, onSelect, onCycleStatus, onRemind }: { task: WorkstationTask; selected: boolean; onSelect: () => void; onCycleStatus: () => void; onRemind: () => void }) {
  const done = task.status === 'done';
  const [justReminded, setJustReminded] = useState(false);
  return (
    <div
      onClick={onSelect}
      className={motion.cardHover}
      style={{
        margin: '10px 12px', padding: '14px 16px',
        border: '1px solid #eceef1', borderLeft: selected ? '3px solid #77469b' : '1px solid #eceef1',
        borderRadius: 10, background: selected ? '#f9f7fc' : task.origin === 'generative' ? 'linear-gradient(135deg, rgba(119,70,155,.05), #fff 60%)' : '#fff',
        boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer', position: 'relative' as const,
        opacity: done ? 0.62 : 1, transition: 'opacity 220ms ease-out, background 150ms ease-out, border-color 150ms ease-out',
      }}
    >
      <div>
        {/* Top line — status, assignee, context inline on the left (dividers matching the Alerts badge row), due date pinned right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <HoverTip label="Click to advance status">
            <span onClick={(e) => { e.stopPropagation(); onCycleStatus(); }} className={motion.pressable} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px 4px 6px', borderRadius: 999, background: STATUS_COLOR[task.status] + '14', cursor: 'pointer', flex: 'none' }}>
              <StatusCircleIcon status={task.status} size={12} />
              <span style={{ font: '600 11px/1 Inter,sans-serif', color: STATUS_COLOR[task.status], whiteSpace: 'nowrap' as const }}>{STATUS_LABEL[task.status]}</span>
            </span>
          </HoverTip>
          <span style={{ width: 1, height: 14, background: '#e6e8ec', flex: 'none' }} />
          <span style={{ flex: 'none', display: 'flex' }}><Avatar name={task.assignee} size={20} vivid={task.assignee !== 'Unassigned'} /></span>
          <span style={{ width: 1, height: 14, background: '#e6e8ec', flex: 'none' }} />
          <span style={{ display: 'flex', alignItems: 'center', flex: 'none' }}>
            {task.contextSources?.length ? <ContextSourceStack sources={task.contextSources} size={17} /> : <OriginGlyph origin={task.origin} size={14} />}
          </span>
          <span style={{ marginLeft: 'auto', font: '600 11px/1 Inter,sans-serif', color: task.overdue ? '#b3453f' : (task.dueColor || '#9aa0a8'), flex: 'none' }}>{task.due}</span>
          {isDelegated(task) && !done && (
            <HoverTip label={justReminded ? 'Reminder sent' : `Remind ${task.assignee}`}>
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  if (justReminded) return;
                  onRemind();
                  setJustReminded(true);
                  setTimeout(() => setJustReminded(false), 2200);
                }}
                className={motion.pressable}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 6, marginLeft: 8, cursor: justReminded ? 'default' : 'pointer', flex: 'none', background: justReminded ? '#eef6f3' : 'transparent', transition: 'background 140ms ease-out' }}
              >
                {justReminded ? <CheckIcon size={11} color="#3f7d6a" /> : <BellIcon size={13} color="#9aa0a8" />}
              </span>
            </HoverTip>
          )}
        </div>

        {/* Full title, own line — never truncated */}
        <div style={{ font: '600 14px/1.35 Inter,sans-serif', color: '#23272d', marginTop: 9 }}>
          {task.text}
        </div>
      </div>
    </div>
  );
}

export type GroupKey = 'to-me' | 'by-me' | 'unassigned';

/** Keeps relative order within each bucket, but sinks done tasks to the bottom of the row. */
function doneLast(tasks: WorkstationTask[]): WorkstationTask[] {
  return [...tasks].sort((a, b) => (a.status === 'done' ? 1 : 0) - (b.status === 'done' ? 1 : 0));
}

function GroupHeader({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <div onClick={onClick} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', margin: '0 14px', borderRadius: 6, cursor: 'pointer', background: active ? '#f9f7fc' : undefined }}>
      <span style={{ display: 'flex', transform: active ? 'none' : 'rotate(-90deg)', transition: 'transform 160ms ease-out' }}>
        <ChevronDownIcon size={9} color="#6b7178" />
      </span>
      <span style={{ font: '700 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#464646' }}>{label}</span>
      <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>{count}</span>
    </div>
  );
}

export function WorkStationListView({ assignedToMe, unassigned, assignedByMe, selectedId, onSelect, onCycleStatus, onRemind, initialActiveGroup = 'to-me' }: {
  assignedToMe: WorkstationTask[];
  unassigned: WorkstationTask[];
  assignedByMe: WorkstationTask[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCycleStatus: (id: string) => void;
  onRemind: (id: string) => void;
  /** Which group tab starts expanded — for the design-handoff preview, not used by the real app. */
  initialActiveGroup?: GroupKey;
}) {
  const [activeGroup, setActiveGroup] = useState<GroupKey>(initialActiveGroup);

  const groups: { key: GroupKey; label: string; tasks: WorkstationTask[]; emptyText: string }[] = [
    { key: 'to-me', label: 'Assigned to me', tasks: doneLast(assignedToMe), emptyText: 'Nothing assigned to you right now.' },
    { key: 'by-me', label: 'Assigned by me', tasks: doneLast(assignedByMe), emptyText: "You haven't assigned anything to the team yet." },
    { key: 'unassigned', label: 'Unassigned', tasks: doneLast(unassigned), emptyText: 'Nothing waiting on an owner.' },
  ];
  // The expanded tab's header drops to the bottom of the cluster, right above its own tasks; the other two stay stacked at top in their original order.
  const orderedGroups = [...groups.filter((g) => g.key !== activeGroup), ...groups.filter((g) => g.key === activeGroup)];

  return (
    <div style={{ paddingBottom: 16 }}>
      {/* All three group tabs stay clustered together at the top — only the active one's tasks expand, below the whole cluster. */}
      <div style={{ paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {orderedGroups.map((g) => (
          <GroupHeader key={g.key} label={g.label} count={g.tasks.length} active={activeGroup === g.key} onClick={() => setActiveGroup(g.key)} />
        ))}
      </div>
      {groups.map((g) => (
        <div key={g.key} className={`${motion.accordionRow} ${activeGroup === g.key ? motion.accordionRowOpen : ''}`}>
          <div>
            {g.tasks.length === 0 && (
              <div style={{ margin: '10px 14px 4px', padding: '10px 14px', border: '1px dashed #e6e8ec', borderRadius: 9, font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>{g.emptyText}</div>
            )}
            {g.tasks.map((t) => (
              <TaskRow key={t.id} task={t} selected={selectedId === t.id} onSelect={() => onSelect(t.id)} onCycleStatus={() => onCycleStatus(t.id)} onRemind={() => onRemind(t.id)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
