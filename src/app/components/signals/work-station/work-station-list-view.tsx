import { useState } from 'react';
import { PROTOTYPE_ALERTS, type WorkstationTask } from '@/constants/signals/prototype-data';
import { Avatar } from '../alerts/assign-menu';
import { ChevronDownIcon, BellIcon, MoreVertIcon, ShareIcon, EnvelopeSmallIcon, WorkspaceSmallIcon } from '../alerts/icons';
import { formatAlertValue } from '../alerts/format-money';
import { HoverTip } from '../alerts/hover-tip';
import { StatusCircleIcon, OriginGlyph, ContextSourceStack, STATUS_COLOR, STATUS_LABEL } from './work-station-icons';
import motion from '../alerts/motion.module.scss';

/** A task the current user delegated to a named person — the only tasks the "Remind" ping applies to. */
export function isDelegated(task: WorkstationTask): boolean {
  return task.createdBy === 'You' && task.assignee !== 'You' && task.assignee !== 'Unassigned';
}

/** The corner dot is a "there's a new notification on this" badge, not a read/unread marker (the
 * title's bold/light weight already covers that) — so it's a stable-but-scattered pick across
 * cards, roughly a third of them, rather than tied to any real per-task state. */
function hasNotificationBadge(id: string): boolean {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 997;
  return hash % 3 === 0;
}

function MenuItem({ icon, label, onClick }: { icon?: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <div onClick={onClick} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 6, cursor: 'pointer', font: '500 12px/1 Inter,sans-serif', color: '#3d434b' }}>
      {icon}{label}
    </div>
  );
}

function TaskRow({ task, selected, unread, onSelect, onCycleStatus, onRemind }: { task: WorkstationTask; selected: boolean; unread: boolean; onSelect: () => void; onCycleStatus: () => void; onRemind: () => void }) {
  const done = task.status === 'done';
  const linkedAlert = task.origin === 'alert' && task.alertId ? PROTOTYPE_ALERTS.find((a) => a.id === task.alertId) : undefined;
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<'main' | 'share'>('main');
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
      {hasNotificationBadge(task.id) && <span title="New notification" style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: '50%', background: '#77469b', boxShadow: '0 0 0 2px #fff' }} />}
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
          <span style={{ position: 'relative', flex: 'none' }}>
            <span
              onClick={(e) => { e.stopPropagation(); setMenuMode('main'); setMenuOpen((v) => !v); }}
              className={motion.pressable}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: 6, marginLeft: 8, cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <MoreVertIcon size={13} />
            </span>
            {menuOpen && (
              <div className={motion.popIn} style={{ position: 'absolute', right: 0, top: 26, width: 190, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 40 }} onClick={(e) => e.stopPropagation()}>
                {menuMode === 'main' && (
                  <>
                    {isDelegated(task) && !done && (
                      <MenuItem icon={<BellIcon size={13} />} label={`Remind ${task.assignee}`} onClick={() => { onRemind(); setMenuOpen(false); }} />
                    )}
                    <MenuItem icon={<ShareIcon size={13} />} label="Share" onClick={() => setMenuMode('share')} />
                  </>
                )}
                {menuMode === 'share' && (
                  <>
                    <div style={{ padding: '6px 10px 8px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Share via</div>
                    <MenuItem icon={<EnvelopeSmallIcon size={12} />} label="Email" onClick={() => setMenuOpen(false)} />
                    <MenuItem icon={<WorkspaceSmallIcon size={12} />} label="Workspace" onClick={() => setMenuOpen(false)} />
                    <div onClick={() => setMenuMode('main')} style={{ padding: '8px 10px 4px', font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>← Back</div>
                  </>
                )}
              </div>
            )}
          </span>
        </div>

        {/* Full title, own line — never truncated. Alert-origin tasks lead with the alert's $ value, folded into the title itself rather than a separate badge. */}
        <div style={{ font: `${unread ? 700 : 500} 14px/1.35 Inter,sans-serif`, color: unread ? '#23272d' : '#6b7178', marginTop: 9 }}>
          {linkedAlert && !linkedAlert.hideValue && (
            <span style={{ color: linkedAlert.valueNum < 0 ? '#b3453f' : '#1e8449' }}>{formatAlertValue(linkedAlert.valueNum)}{' '}</span>
          )}
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

export function WorkStationListView({ assignedToMe, unassigned, assignedByMe, selectedId, readTaskIds, onSelect, onCycleStatus, onRemind, initialActiveGroup = 'to-me' }: {
  assignedToMe: WorkstationTask[];
  unassigned: WorkstationTask[];
  assignedByMe: WorkstationTask[];
  selectedId: string | null;
  /** Tasks the user has opened at least once — undots the row. */
  readTaskIds: Set<string>;
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
              <TaskRow key={t.id} task={t} selected={selectedId === t.id} unread={!readTaskIds.has(t.id)} onSelect={() => onSelect(t.id)} onCycleStatus={() => onCycleStatus(t.id)} onRemind={() => onRemind(t.id)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
