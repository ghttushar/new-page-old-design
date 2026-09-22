import { useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  WORKSTATION_TASKS, PROTOTYPE_ALERTS, MEETING_LIST, COMPLETED_MEETINGS,
  type PrototypeAlert, type WorkstationTask, type MeetingListItem, type CompletedMeeting, type AssigneeOption,
} from '@/constants/signals/prototype-data';
import { AlertBadgeRow } from '../signals/alerts/alert-badge-row';
import { formatAlertValue } from '../signals/alerts/format-money';
import { Avatar, AssignDropdownList, DEFAULT_ASSIGNEES } from '../signals/alerts/assign-menu';
import { HoverTip } from '../signals/alerts/hover-tip';
import { ChevronDownIcon, AssignIcon, MoreVertIcon, ShareIcon, DismissIcon, CheckIcon } from '../signals/alerts/icons';
import { ItemsModal } from '../signals/alerts/items-modal';
import { StatusCircleIcon, OriginGlyph, ContextSourceStack, STATUS_COLOR, STATUS_LABEL } from '../signals/work-station/work-station-icons';
import motion from '../signals/alerts/motion.module.scss';
import rowStyles from '../signals/alerts/alert-row.module.scss';

export type SectionKey = 'todos' | 'alerts' | 'meetings';

/** Carried alongside an entry-point's prefill text so Jiva knows which real record the conversation is about. */
export interface EntryMeta {
  kind: 'alert' | 'task' | 'meeting';
  id: string;
}

/** Same 5 real categories that dominate the Alerts data (top by volume — Operations/Reviews/Billing have just 1 each). */
const ALERT_CATEGORIES = ['Catalog', 'Inventory', 'Compliance', 'Advertising', 'Profitability'] as const;

/** Controlled accordion — open state and order both live in the parent so a group can be pushed to the bottom on expand. */
function SubGroup({ label, color, count, open, onToggle, children }: { label: string; color: string; count: number; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <div style={{ paddingTop: 10 }}>
      <div onClick={onToggle} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 16px', cursor: 'pointer' }}>
        <span style={{ display: 'flex', transform: open ? 'none' : 'rotate(-90deg)', transition: 'transform 160ms ease-out' }}>
          <ChevronDownIcon size={9} color="#9aa0a8" />
        </span>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flex: 'none' }} />
        <span style={{ font: '700 10px/1 Inter,sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#6b7178' }}>{label}</span>
        <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>{count}</span>
      </div>
      <div className={`${motion.accordionRow} ${open ? motion.accordionRowOpen : ''}`}>
        <div>{children}</div>
      </div>
    </div>
  );
}

interface GroupSpec { key: string; label: string; color: string; count: number; content: ReactNode }

/**
 * Renders a domain's sub-groups collapsed by default; expanding one shifts it to the
 * bottom of the row so whatever's still collapsed stays on top and easy to scan. Lives
 * inside a `{domain === '...' && ...}` branch, so switching domains unmounts/remounts it
 * fresh — no manual reset needed.
 */
function OrderedGroups({ groups }: { groups: GroupSpec[] }) {
  const [order, setOrder] = useState<string[]>(() => groups.map((g) => g.key));
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});

  const toggle = (key: string) => {
    setOpenKeys((prev) => {
      const nowOpen = !prev[key];
      if (nowOpen) setOrder((o) => [...o.filter((k) => k !== key), key]);
      return { ...prev, [key]: nowOpen };
    });
  };

  const byKey = new Map(groups.map((g) => [g.key, g]));
  return (
    <>
      {order.filter((k) => byKey.has(k)).map((k) => {
        const g = byKey.get(k)!;
        return (
          <SubGroup key={g.key} label={g.label} color={g.color} count={g.count} open={!!openKeys[g.key]} onToggle={() => toggle(g.key)}>
            {g.content}
          </SubGroup>
        );
      })}
    </>
  );
}

function Empty({ text }: { text: string }) {
  return <div style={{ margin: '4px 18px 10px', font: '400 12px/1.6 Inter,sans-serif', color: '#9aa0a8' }}>{text}</div>;
}

/** Same filter-popover section shape as the real Alerts filter. */
function FilterSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 9 }}>{children}</div>
      <div style={{ height: 1, background: '#f1f2f4', margin: '13px 0' }} />
    </>
  );
}

const SOURCE_OPTIONS = ['Anarix', 'Jiva', 'Meeting', 'Slack', 'Workspace', 'Email'] as const;
const PRIORITY_OPTIONS: [string, string][] = [['High', '#b3453f'], ['Medium', '#5c7f9e'], ['Low', '#3f7d6a']];

function MenuItem({ icon, label, onClick }: { icon?: ReactNode; label: string; onClick: () => void }) {
  return (
    <div onClick={onClick} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 6, cursor: 'pointer', font: '500 12px/1 Inter,sans-serif', color: '#3d434b' }}>
      {icon}{label}
    </div>
  );
}

/** Same visual language as the real Work-station task row — status pill, origin/context badges, avatar, due date. */
function TaskOverviewRow({ task, onClick }: { task: WorkstationTask; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={motion.cardHover}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, margin: '8px 12px', padding: '12px 14px',
        border: '1px solid #eceef1', borderRadius: 10,
        background: task.origin === 'generative' ? 'linear-gradient(135deg, rgba(119,70,155,.05), #fff 60%)' : '#fff',
        boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer',
      }}
    >
      <span style={{ flex: 1, minWidth: 0, font: `${task.status === 'done' ? '400' : '600'} 13px/1.35 Inter,sans-serif`, color: task.status === 'done' ? '#9aa0a8' : '#23272d', textDecoration: task.status === 'done' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
        {task.text}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', flex: 'none' }}>
        {task.contextSources?.length ? <ContextSourceStack sources={task.contextSources} size={18} /> : <OriginGlyph origin={task.origin} size={15} />}
      </span>
      <HoverTip label="Status">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px 4px 6px', borderRadius: 999, background: STATUS_COLOR[task.status] + '14', flex: 'none' }}>
          <StatusCircleIcon status={task.status} size={11} />
          <span style={{ font: '600 10.5px/1 Inter,sans-serif', color: STATUS_COLOR[task.status], whiteSpace: 'nowrap' as const }}>{STATUS_LABEL[task.status]}</span>
        </span>
      </HoverTip>
      <span style={{ font: '600 10.5px/1 Inter,sans-serif', color: task.overdue ? '#b3453f' : (task.dueColor || '#8a919b'), flex: 'none', whiteSpace: 'nowrap' as const }}>{task.due}</span>
      <span style={{ flex: 'none', display: 'flex' }}><Avatar name={task.assignee} size={20} vivid={task.assignee !== 'Unassigned'} /></span>
    </div>
  );
}

/**
 * Same visual language as the real Alerts row, plus the pieces the compact overview card
 * was missing: the affected-items/ASIN breakdown link (opens the same items modal as the
 * real Alerts page), the assign avatar, the three-dot Share/Dismiss menu, and the
 * timestamp. When `actioned`, it greys out and shows "Action taken" instead of the real
 * page's "Resolved" — same treatment, different label since this came from a Jiva chat
 * completion rather than a manual resolve.
 */
function AlertOverviewRow({ al, actioned, selected, onClick }: { al: PrototypeAlert; actioned: boolean; selected: boolean; onClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuMode, setMenuMode] = useState<'main' | 'share' | 'assign'>('main');
  const [assignedTo, setAssignedTo] = useState<AssigneeOption | undefined>(undefined);
  const [itemsOpen, setItemsOpen] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`${rowStyles.alertCard} ${motion.cardHover}`}
      style={{
        position: 'relative', margin: '10px 12px', padding: '14px 16px', borderRadius: 10, cursor: 'pointer', opacity: actioned ? 0.62 : 1,
        border: '1px solid #eceef1', borderLeft: selected ? '3px solid #77469b' : '1px solid #eceef1',
        background: selected ? '#f9f7fc' : 'transparent', boxShadow: '0 1px 2px rgba(20,24,33,.03)',
        transition: 'opacity 220ms ease-out, background 150ms ease-out, border-color 150ms ease-out',
      }}
    >
      {actioned && (
        <span className={motion.contentFadeIn} style={{ position: 'absolute', left: 14, top: 12, display: 'flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 5, background: '#eef6f3', font: '700 9px/1.5 Inter,sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: '#3f7d6a' }}>
          <CheckIcon size={8} color="#3f7d6a" /> Action taken
        </span>
      )}
      <div style={{ position: 'absolute', right: 12, top: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
        {assignedTo ? (
          <span onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => (menuMode === 'assign' && v ? false : true)); setMenuMode('assign'); }} className={motion.pressable} style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer' }}>
            <Avatar name={assignedTo.name} size={20} vivid />
          </span>
        ) : (
          <span onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => (menuMode === 'assign' && v ? false : true)); setMenuMode('assign'); }} className={motion.pressable} style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, color: '#6b7178', cursor: 'pointer' }}>
            <AssignIcon size={13} />
          </span>
        )}
        <span
          onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => (menuMode !== 'assign' && v ? false : true)); setMenuMode('main'); }}
          className={motion.pressable}
          style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, color: '#6b7178', cursor: 'pointer' }}
        >
          <MoreVertIcon size={12} />
        </span>
      </div>
      <div style={{ marginTop: actioned ? 20 : 0 }}>
        {!al.hideValue && (
          <span style={{ font: '700 20px/1 Inter,sans-serif', color: al.valueNum < 0 ? '#b3453f' : '#3f7d6a' }}>{formatAlertValue(al.valueNum)}</span>
        )}
        <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#8a919b', marginTop: al.hideValue ? 0 : 4 }}>
          {al.impactStr}
          {al.itemsCount > 0 && (
            <>
              {' · '}
              <span
                onClick={(e) => { e.stopPropagation(); setItemsOpen(true); }}
                className={rowStyles.breakdownLink}
                style={{ fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' as const, textUnderlineOffset: 2 }}
              >
                {al.itemsBreakdown}
              </span>
            </>
          )}
        </div>
        <div style={{ font: '600 14px/1.35 Inter,sans-serif', color: '#23272d', marginTop: 6, paddingRight: 56, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>{al.title}</div>
      </div>
      <div style={{ marginTop: 11 }}>
        <AlertBadgeRow al={al} size={20} />
      </div>

      {menuOpen && (
        <div className={motion.popIn} style={{ position: 'absolute', right: 10, top: 38, width: 190, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 40 }} onClick={(e) => e.stopPropagation()}>
          {menuMode === 'main' && (
            <>
              <MenuItem icon={<ShareIcon size={13} />} label="Share" onClick={() => setMenuMode('share')} />
              <MenuItem icon={<DismissIcon size={13} />} label="Dismiss" onClick={() => setMenuOpen(false)} />
            </>
          )}
          {menuMode === 'share' && (
            <>
              <div style={{ padding: '6px 10px 8px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Share via</div>
              <MenuItem label="Email" onClick={() => setMenuOpen(false)} />
              <MenuItem label="Workspace · Nutrabay pod" onClick={() => setMenuOpen(false)} />
              <div onClick={() => setMenuMode('main')} style={{ padding: '8px 10px 4px', font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>← Back</div>
            </>
          )}
          {menuMode === 'assign' && (
            <>
              <div style={{ padding: '6px 10px 2px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Assign to</div>
              <AssignDropdownList assignees={al.assignees ?? DEFAULT_ASSIGNEES} onSelect={(a) => { setAssignedTo(a); setMenuOpen(false); }} />
            </>
          )}
        </div>
      )}

      {itemsOpen && createPortal(
        <ItemsModal items={al.items} itemCount={al.itemsCount} breakdown={al.itemsBreakdown} onClose={() => setItemsOpen(false)} />,
        document.body,
      )}
    </div>
  );
}

/** Same visual language as the real upcoming-meeting row — time range + date, title, task-completion line. */
function MeetingOverviewRow({ m, onClick }: { m: MeetingListItem; onClick: () => void }) {
  const allDone = m.tasksTotal > 0 && m.tasksCompleted === m.tasksTotal;
  return (
    <div
      onClick={onClick}
      className={motion.cardHover}
      style={{ margin: '8px 12px', padding: '12px 14px', border: '1px solid #eceef1', borderRadius: 10, background: '#fff', boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#464646' }}>{m.timeRange}</span>
        <span style={{ marginLeft: 'auto', font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>{m.dateLabel}</span>
      </div>
      <div style={{ font: '600 13px/1.35 Inter,sans-serif', color: '#23272d', marginTop: 8 }}>{m.title}</div>
      <div style={{ marginTop: 8, font: '600 10.5px/1 Inter,sans-serif', color: allDone ? '#3f7d6a' : '#a8763f' }}>
        {m.tasksCompleted}/{m.tasksTotal} task{m.tasksTotal === 1 ? '' : 's'} completed
      </div>
    </div>
  );
}

/** Same visual language as the real completed-meeting row — time range + MOM status, title. */
function CompletedMeetingOverviewRow({ m, onClick }: { m: CompletedMeeting; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={motion.cardHover}
      style={{ margin: '8px 12px', padding: '12px 14px', border: '1px solid #eceef1', borderRadius: 10, background: '#fff', boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#464646' }}>{m.timeRange}</span>
        <span style={{ padding: '2px 7px', borderRadius: 4, background: m.momColor + '1a', font: '600 10px/1.5 Inter,sans-serif', color: m.momColor }}>{m.momStatus}</span>
        <span style={{ marginLeft: 'auto', font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>{m.dateLabel}</span>
      </div>
      <div style={{ font: '600 13px/1.35 Inter,sans-serif', color: '#23272d', marginTop: 8 }}>{m.title}</div>
    </div>
  );
}

interface Props {
  domain: SectionKey;
  actionTakenAlertIds: Set<string>;
  /** The alert currently in focus in the Jiva conversation — entered directly, or the one Jiva just suggested picking up next. Same "selected" treatment (purple left border + tint) as the real Alerts row. */
  selectedAlertId: string | null;
  onEntryPoint: (text: string, meta?: EntryMeta) => void;
}

/**
 * The left column — shows exactly one domain at a time, driven entirely by the nav
 * rail selection (Todo/Alerts/Meetings), split the same way the real pages split it:
 * To-dos by assignment (to me/by me/unassigned), Alerts by category (top 5 by volume),
 * Meetings by upcoming/completed. Row styles match the real Work-station/Alerts/Meetings
 * rows. Picking a card is an entry point into the Jiva conversation on the right.
 */
export function SignalsNextOverview({ domain, actionTakenAlertIds, selectedAlertId, onEntryPoint }: Props) {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [priorityFilters, setPriorityFilters] = useState<Record<string, boolean>>({});
  const [sourceFilters, setSourceFilters] = useState<Record<string, boolean>>({});
  const [valueOp, setValueOp] = useState<'>' | '<' | '='>('>');
  const [valueThreshold, setValueThreshold] = useState('');

  const activePriorities = Object.keys(priorityFilters).filter((k) => priorityFilters[k]);
  const activeSources = Object.keys(sourceFilters).filter((k) => sourceFilters[k]);
  const filterCount = activePriorities.length + activeSources.length + (valueThreshold ? 1 : 0);
  const togglePriority = (k: string) => setPriorityFilters((p) => ({ ...p, [k]: !p[k] }));
  const toggleSource = (k: string) => setSourceFilters((p) => ({ ...p, [k]: !p[k] }));
  const clearAll = () => { setSearch(''); setPriorityFilters({}); setSourceFilters({}); setValueThreshold(''); };

  const q = search.trim().toLowerCase();

  const matchesTask = (t: WorkstationTask) => {
    if (q && !t.text.toLowerCase().includes(q)) return false;
    if (activePriorities.length && !activePriorities.includes(t.priority)) return false;
    return true;
  };

  const matchesAlert = (a: PrototypeAlert) => {
    if (q && !(a.title + ' ' + a.account).toLowerCase().includes(q)) return false;
    if (activePriorities.length && !activePriorities.includes(a.priority)) return false;
    if (activeSources.length) {
      const origins = a.originTypes && a.originTypes.length > 0 ? a.originTypes : [a.originType ?? 'anarix'];
      if (!origins.some((o) => activeSources.some((s) => s.toLowerCase() === o))) return false;
    }
    if (valueThreshold) {
      const t = parseFloat(valueThreshold.replace(/[^0-9.]/g, '')) || 0;
      const v = Math.abs(a.valueNum);
      if (valueOp === '>' && !(v > t)) return false;
      if (valueOp === '<' && !(v < t)) return false;
      if (valueOp === '=' && !(Math.abs(v - t) < 1)) return false;
    }
    return true;
  };

  const matchesTitle = (title: string) => !q || title.toLowerCase().includes(q);

  const allTasks = WORKSTATION_TASKS.filter(matchesTask);
  const assignedToMe = allTasks.filter((t) => t.assignee === 'You');
  const assignedByMe = allTasks.filter((t) => t.createdBy === 'You' && t.assignee !== 'You' && t.assignee !== 'Unassigned');
  const unassignedTasks = allTasks.filter((t) => t.assignee === 'Unassigned');

  const todayAlerts = PROTOTYPE_ALERTS.filter((a) => a.day === 'today').filter(matchesAlert);
  const alertsByCategory = ALERT_CATEGORIES.map((cat) => {
    const items = todayAlerts.filter((a) => a.category === cat);
    // Actioned alerts sink to the bottom of their category, same idea as the section-level reorder.
    const sorted = [...items].sort((a, b) => Number(actionTakenAlertIds.has(a.id)) - Number(actionTakenAlertIds.has(b.id)));
    return { cat, items: sorted };
  });

  const upcomingMeetings = MEETING_LIST.filter((m) => matchesTitle(m.title));
  const completedMeetings = COMPLETED_MEETINGS.filter((m) => matchesTitle(m.title));

  const searchPlaceholder = domain === 'todos' ? 'Search tasks' : domain === 'alerts' ? 'Search alerts, ASINs, campaigns' : 'Search meetings';

  return (
    <>
      <div style={{ flex: 'none', padding: '14px 16px', borderBottom: '1px solid #e6e8ec', position: 'relative' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className={motion.focusRing}
            style={{ flex: 1, minWidth: 0, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
          />
          <span
            onClick={() => setFilterOpen((v) => !v)}
            className={motion.pressable}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 14px', border: `1px solid ${filterOpen ? '#77469b' : '#dfe3ea'}`, borderRadius: 6, font: '500 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', background: filterOpen ? '#f9f7fc' : '#fff', flex: 'none', whiteSpace: 'nowrap' as const }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M1 3h14M4 8h8M6.5 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            Filter{filterCount ? ` (${filterCount})` : ''}
          </span>
        </div>
        {filterOpen && (
          <div className={motion.popInTop} style={{ position: 'absolute', left: 16, right: 16, top: 56, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.16)', padding: 14, zIndex: 30, maxHeight: 440, overflowY: 'auto' }}>
            {domain === 'alerts' && (
              <FilterSection label="Impact value">
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, border: '1px solid #dfe3ea', borderRadius: 6, overflow: 'hidden' }}>
                  {(['>', '<', '='] as const).map((op) => (
                    <span key={op} onClick={() => setValueOp(op)} className={motion.pressable} style={{ padding: '8px 10px', background: valueOp === op ? '#f9f7fc' : '#fff', font: '700 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>{op}</span>
                  ))}
                  <span style={{ width: 1, height: 20, background: '#e6e8ec' }} />
                  <span style={{ paddingLeft: 8, font: '600 12px/1 Inter,sans-serif', color: '#9aa0a8' }}>$</span>
                  <input value={valueThreshold} onChange={(e) => setValueThreshold(e.target.value)} placeholder="1,000" style={{ flex: 1, minWidth: 0, padding: '8px 9px 8px 2px', border: 'none', font: '400 12px/1 Inter,sans-serif', outline: 'none' }} />
                </div>
              </FilterSection>
            )}
            {domain === 'alerts' && (
              <FilterSection label="Source">
                {SOURCE_OPTIONS.map((k) => (
                  <div key={k} onClick={() => toggleSource(k)} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '4px 6px', margin: '0 -6px', borderRadius: 6 }}>
                    <span style={{ width: 13, height: 13, borderRadius: 3, border: '1.5px solid #cfd4dc', background: sourceFilters[k] ? '#77469b' : '#fff', flex: 'none' }} />
                    <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>{k}</span>
                  </div>
                ))}
              </FilterSection>
            )}
            {(domain === 'alerts' || domain === 'todos') && (
              <FilterSection label="Priority">
                {PRIORITY_OPTIONS.map(([k, dot]) => (
                  <div key={k} onClick={() => togglePriority(k)} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '4px 6px', margin: '0 -6px', borderRadius: 6 }}>
                    <span style={{ width: 13, height: 13, borderRadius: 3, border: '1.5px solid #cfd4dc', background: priorityFilters[k] ? '#77469b' : '#fff', flex: 'none' }} />
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />
                    <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>{k}</span>
                  </div>
                ))}
              </FilterSection>
            )}
            <span
              onClick={clearAll}
              className={motion.pressable}
              style={{ display: 'block', textAlign: 'center' as const, padding: 9, borderRadius: 6, border: '1px solid #dfe3ea', font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}
            >
              Clear all
            </span>
          </div>
        )}
      </div>

      <div className={motion.contentFadeIn} key={domain} style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: 10 }}>
        {domain === 'todos' && (
          <OrderedGroups
            groups={[
              {
                key: 'mine', label: 'Assigned to me', color: '#77469b', count: assignedToMe.length,
                content: assignedToMe.length === 0 ? <Empty text="Nothing assigned to you." /> : assignedToMe.map((t) => (
                  <TaskOverviewRow key={t.id} task={t} onClick={() => onEntryPoint(`Let's work on "${t.text}". ${t.description}`, { kind: 'task', id: t.id })} />
                )),
              },
              {
                key: 'by-me', label: 'Assigned by me', color: '#5c7f9e', count: assignedByMe.length,
                content: assignedByMe.length === 0 ? <Empty text="You haven't assigned anything to the team yet." /> : assignedByMe.map((t) => (
                  <TaskOverviewRow key={t.id} task={t} onClick={() => onEntryPoint(`Let's work on "${t.text}". ${t.description}`, { kind: 'task', id: t.id })} />
                )),
              },
              {
                key: 'unassigned', label: 'Unassigned', color: '#a8763f', count: unassignedTasks.length,
                content: unassignedTasks.length === 0 ? <Empty text="Nothing waiting on an owner." /> : unassignedTasks.map((t) => (
                  <TaskOverviewRow key={t.id} task={t} onClick={() => onEntryPoint(`Let's work on "${t.text}". ${t.description}`, { kind: 'task', id: t.id })} />
                )),
              },
            ]}
          />
        )}

        {domain === 'alerts' && (
          <OrderedGroups
            groups={alertsByCategory.map(({ cat, items }) => ({
              key: cat, label: cat, color: '#9aa0a8', count: items.length,
              content: items.length === 0 ? <Empty text={`No ${cat.toLowerCase()} alerts today.`} /> : items.map((a) => (
                <AlertOverviewRow key={a.id} al={a} actioned={actionTakenAlertIds.has(a.id)} selected={selectedAlertId === a.id} onClick={() => onEntryPoint(`Tell me about the alert "${a.title}" on ${a.account}.`, { kind: 'alert', id: a.id })} />
              )),
            }))}
          />
        )}

        {domain === 'meetings' && (
          <OrderedGroups
            groups={[
              {
                key: 'upcoming', label: 'Upcoming', color: '#77469b', count: upcomingMeetings.length,
                content: upcomingMeetings.length === 0 ? <Empty text="Nothing upcoming." /> : upcomingMeetings.map((m) => (
                  <MeetingOverviewRow key={m.id} m={m} onClick={() => onEntryPoint(`Help me prep for "${m.title}" at ${m.timeRange}.`, { kind: 'meeting', id: m.id })} />
                )),
              },
              {
                key: 'completed', label: 'Completed', color: '#3f7d6a', count: completedMeetings.length,
                content: completedMeetings.length === 0 ? <Empty text="Nothing completed yet." /> : completedMeetings.map((m) => (
                  <CompletedMeetingOverviewRow key={m.id} m={m} onClick={() => onEntryPoint(`Tell me about the completed meeting "${m.title}" with ${m.account}.`, { kind: 'meeting', id: m.id })} />
                )),
              },
            ]}
          />
        )}
      </div>
    </>
  );
}
