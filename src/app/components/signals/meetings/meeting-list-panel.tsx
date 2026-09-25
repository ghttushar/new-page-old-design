import { useEffect, useMemo, useState } from 'react';
import { MEETING_LIST, COMPLETED_MEETINGS, type MeetingListItem, type CompletedMeeting } from '@/constants/signals/prototype-data';
import { ChevronDownIcon } from '../alerts/icons';
import scrollStyles from '../alerts/alerts-scroll.module.scss';
import motion from '../alerts/motion.module.scss';

interface Props {
  selectedMeetingId: string | null;
  onSelectMeeting: (id: string) => void;
  /** Forces the filter popover open on mount — for the design-handoff preview, not used by the real app. */
  initialFilterOpen?: boolean;
  /** Forces the given day groups collapsed on mount — for the design-handoff preview, not used by the real app. */
  initialCollapsedGroups?: Partial<Record<GroupKey, boolean>>;
  /** A filter to apply from outside (e.g. the empty state's category cards) — bump `nonce` to reapply. */
  applyFilter?: { kind: 'day' | 'status' | 'clear'; value?: string; nonce: number } | null;
  /** Splits this column evenly with its siblings instead of the usual fixed ~35% — used only when list, detail and Ask Jiva are all showing at once. */
  /** Explicit pixel width from the drag-resize handle — supersedes the default fixed ~35%. */
  width?: number;
}

type GroupKey = 'today' | 'tomorrow' | 'earlier';

const GROUP_ORDER: { key: GroupKey; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'earlier', label: 'Earlier' },
];

const ALL_ACCOUNTS = Array.from(new Set([...MEETING_LIST, ...COMPLETED_MEETINGS].map((m) => m.account)));

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function plainDate(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** Overview rows show a real date instead of "Today"/"Yesterday"/a weekday name — computed when the label doesn't already carry one. */
function displayDate(dateLabel: string): string {
  const now = new Date();
  if (dateLabel.startsWith('Today')) {
    return dateLabel.slice(5).replace(/^\s*·\s*/, '') || plainDate(now);
  }
  if (dateLabel.startsWith('Tomorrow')) {
    const rest = dateLabel.slice(8).replace(/^\s*·\s*/, '');
    if (rest) return rest;
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return plainDate(tomorrow);
  }
  if (dateLabel.startsWith('Yesterday')) {
    const rest = dateLabel.slice(9).replace(/^\s*·\s*/, '');
    if (rest) return rest;
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return plainDate(yesterday);
  }
  const weekdayPrefix = dateLabel.match(/^[A-Za-z]+\s*·\s*(.+)$/);
  return weekdayPrefix ? weekdayPrefix[1] : dateLabel;
}

function groupFor(dateLabel: string): GroupKey {
  if (dateLabel.startsWith('Today')) return 'today';
  if (dateLabel.startsWith('Tomorrow')) return 'tomorrow';
  return 'earlier';
}

export function MeetingListPanel({ selectedMeetingId, onSelectMeeting, initialFilterOpen = false, initialCollapsedGroups, applyFilter = null, width }: Props) {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(initialFilterOpen);
  const [accountFilters, setAccountFilters] = useState<Record<string, boolean>>({});
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({});
  const [dayFilter, setDayFilter] = useState<GroupKey | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Partial<Record<GroupKey, boolean>>>(initialCollapsedGroups ?? {});
  const toggleGroup = (key: GroupKey) => setCollapsedGroups((p) => ({ ...p, [key]: !p[key] }));

  const toggleAccount = (k: string) => setAccountFilters((p) => ({ ...p, [k]: !p[k] }));
  const toggleStatus = (k: string) => setStatusFilters((p) => ({ ...p, [k]: !p[k] }));

  useEffect(() => {
    if (!applyFilter) return;
    if (applyFilter.kind === 'day') { setDayFilter(applyFilter.value as GroupKey); setStatusFilters({}); }
    else if (applyFilter.kind === 'status') { setStatusFilters({ [applyFilter.value!]: true }); setDayFilter(null); }
    else { setDayFilter(null); setStatusFilters({}); setAccountFilters({}); }
    setSearch('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyFilter?.nonce]);

  const activeAccounts = Object.keys(accountFilters).filter((k) => accountFilters[k]);
  const activeStatus = Object.keys(statusFilters).filter((k) => statusFilters[k]);
  const filterCount = activeAccounts.length + activeStatus.length + (dayFilter ? 1 : 0);

  const q = search.trim().toLowerCase();

  const filteredUpcoming = useMemo(() => {
    return MEETING_LIST.filter((m) => {
      if (q && !(m.title + ' ' + m.account).toLowerCase().includes(q)) return false;
      if (activeAccounts.length && !activeAccounts.includes(m.account)) return false;
      if (activeStatus.length && !activeStatus.includes('Upcoming')) return false;
      if (dayFilter && groupFor(m.dateLabel) !== dayFilter) return false;
      return true;
    });
  }, [q, activeAccounts, activeStatus, dayFilter]);

  const filteredCompleted = useMemo(() => {
    return COMPLETED_MEETINGS.filter((m) => {
      if (q && !(m.title + ' ' + m.account).toLowerCase().includes(q)) return false;
      if (activeAccounts.length && !activeAccounts.includes(m.account)) return false;
      if (activeStatus.length && !activeStatus.includes('Completed')) return false;
      if (dayFilter && groupFor(m.dateLabel) !== dayFilter) return false;
      return true;
    });
  }, [q, activeAccounts, activeStatus, dayFilter]);

  const grouped = useMemo(() => {
    const map: Record<GroupKey, { upcoming: MeetingListItem[]; completed: CompletedMeeting[] }> = {
      today: { upcoming: [], completed: [] },
      tomorrow: { upcoming: [], completed: [] },
      earlier: { upcoming: [], completed: [] },
    };
    filteredUpcoming.forEach((m) => map[groupFor(m.dateLabel)].upcoming.push(m));
    filteredCompleted.forEach((m) => map[groupFor(m.dateLabel)].completed.push(m));
    return map;
  }, [filteredUpcoming, filteredCompleted]);

  const totalMatches = filteredUpcoming.length + filteredCompleted.length;

  return (
    <div style={{ flex: width ? `0 0 ${width}px` : '0 0 35%', maxWidth: width ? 'none' : '35%', minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'visible', position: 'relative' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #e6e8ec', display: 'flex', flexDirection: 'column', gap: 9, flex: 'none', position: 'relative' }}>
        <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search meetings or accounts"
            className={motion.focusRing}
            style={{ flex: 1, minWidth: 0, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
          />
          <span
            onClick={() => setFilterOpen(!filterOpen)}
            className={motion.pressable}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 16px', border: `1px solid ${filterOpen ? '#77469b' : '#dfe3ea'}`, borderRadius: 6, font: '500 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', background: filterOpen ? '#f9f7fc' : '#fff', flex: 'none', whiteSpace: 'nowrap' as const, transition: 'background 140ms ease-out, border-color 140ms ease-out' }}
            onMouseEnter={(e) => { if (!filterOpen) e.currentTarget.style.background = '#fafbfd'; }}
            onMouseLeave={(e) => { if (!filterOpen) e.currentTarget.style.background = '#fff'; }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M1 3h14M4 8h8M6.5 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            Filter{filterCount ? ` (${filterCount})` : ''}
          </span>
        </div>
        {filterOpen && (
          <div className={motion.popInTop} style={{ position: 'absolute', left: 16, top: 56, width: 250, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.16)', padding: 14, zIndex: 30, maxHeight: 440, overflowY: 'auto' }}>
            <FilterSection label="Account">
              {ALL_ACCOUNTS.map((k) => (
                <div key={k} onClick={() => toggleAccount(k)} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '4px 6px', margin: '0 -6px', borderRadius: 6 }}>
                  <span style={{ width: 13, height: 13, borderRadius: 3, border: '1.5px solid #cfd4dc', background: accountFilters[k] ? '#77469b' : '#fff', flex: 'none', transition: 'background 120ms ease-out' }} />
                  <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>{k}</span>
                </div>
              ))}
            </FilterSection>
            <FilterSection label="Day">
              {GROUP_ORDER.map(({ key, label }) => (
                <div key={key} onClick={() => setDayFilter((p) => (p === key ? null : key))} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '4px 6px', margin: '0 -6px', borderRadius: 6 }}>
                  <span style={{ width: 13, height: 13, borderRadius: 3, border: '1.5px solid #cfd4dc', background: dayFilter === key ? '#77469b' : '#fff', flex: 'none', transition: 'background 120ms ease-out' }} />
                  <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>{label}</span>
                </div>
              ))}
            </FilterSection>
            <FilterSection label="Status">
              {['Upcoming', 'Completed'].map((k) => (
                <div key={k} onClick={() => toggleStatus(k)} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '4px 6px', margin: '0 -6px', borderRadius: 6 }}>
                  <span style={{ width: 13, height: 13, borderRadius: 3, border: '1.5px solid #cfd4dc', background: statusFilters[k] ? '#77469b' : '#fff', flex: 'none', transition: 'background 120ms ease-out' }} />
                  <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>{k}</span>
                </div>
              ))}
            </FilterSection>
            <span
              onClick={() => { setSearch(''); setAccountFilters({}); setStatusFilters({}); setDayFilter(null); }}
              className={motion.pressable}
              style={{ display: 'block', textAlign: 'center', padding: 9, borderRadius: 6, border: '1px solid #dfe3ea', font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', transition: 'background 140ms ease-out, border-color 140ms ease-out' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f9f7fc'; e.currentTarget.style.borderColor = '#c9b6dd'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#dfe3ea'; }}
            >
              Clear all
            </span>
          </div>
        )}
      </div>

      <div className={scrollStyles.sleekScroll} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {totalMatches === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ font: '600 13px/1.4 Inter,sans-serif', color: '#23272d' }}>No meetings match</div>
            <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 6 }}>Try clearing the search or filters.</div>
          </div>
        )}
        {GROUP_ORDER.map(({ key, label }) => {
          const bucket = grouped[key];
          const count = bucket.upcoming.length + bucket.completed.length;
          if (count === 0) return null;
          const collapsible = key !== 'today';
          const collapsed = collapsible && !!collapsedGroups[key];
          return (
            <div key={key}>
              <div
                onClick={collapsible ? () => toggleGroup(key) : undefined}
                className={collapsible ? motion.rowHover : undefined}
                style={{ padding: '9px 16px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: collapsible ? 'pointer' : 'default' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {collapsible && (
                    <span style={{ display: 'flex', transform: collapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 160ms ease-out' }}>
                      <ChevronDownIcon size={9} />
                    </span>
                  )}
                  <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6b7178' }}>{label}</span>
                </span>
                <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#6b7178' }}>{count} meeting{count === 1 ? '' : 's'}</span>
              </div>
              <div className={`${motion.accordionRow} ${!collapsed ? motion.accordionRowOpen : ''}`}>
                <div>
                  {key === 'today' ? (
                    <>
                      {bucket.upcoming.length > 0 && (
                        <>
                          <div style={{ padding: '10px 16px 4px' }}>
                            <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Upcoming</span>
                          </div>
                          {bucket.upcoming.map((m) => (
                            <UpcomingRow key={m.id} m={m} selected={selectedMeetingId === m.id} onSelect={() => onSelectMeeting(m.id)} />
                          ))}
                        </>
                      )}
                      {bucket.completed.length > 0 && (
                        <>
                          <div style={{ padding: '10px 16px 4px' }}>
                            <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Completed</span>
                          </div>
                          {bucket.completed.map((m) => (
                            <CompletedRow key={m.id} m={m} selected={selectedMeetingId === m.id} onSelect={() => onSelectMeeting(m.id)} />
                          ))}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {bucket.upcoming.map((m) => (
                        <UpcomingRow key={m.id} m={m} selected={selectedMeetingId === m.id} onSelect={() => onSelectMeeting(m.id)} />
                      ))}
                      {bucket.completed.map((m) => (
                        <CompletedRow key={m.id} m={m} selected={selectedMeetingId === m.id} onSelect={() => onSelectMeeting(m.id)} />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 9 }}>{children}</div>
      <div style={{ height: 1, background: '#f1f2f4', margin: '13px 0' }} />
    </>
  );
}

function UpcomingRow({ m, selected, onSelect }: { m: MeetingListItem; selected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={motion.cardHover}
      style={{ margin: '10px 12px', padding: '14px 16px', border: '1px solid #eceef1', borderLeft: selected ? '3px solid #77469b' : '1px solid #eceef1', borderRadius: 10, background: selected ? '#f9f7fc' : 'transparent', boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer' }}
    >
      <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#9aa0a8' }}>{m.timeRange} · {displayDate(m.dateLabel)}</div>
      <div style={{ font: '600 14px/1.35 Inter,sans-serif', color: '#23272d', marginTop: 9 }}>{m.title}</div>
    </div>
  );
}

function CompletedRow({ m, selected, onSelect }: { m: CompletedMeeting; selected: boolean; onSelect: () => void }) {
  const allDone = m.tasksTotal > 0 && m.tasksCompleted === m.tasksTotal;
  return (
    <div
      onClick={onSelect}
      className={motion.cardHover}
      style={{ margin: '10px 12px', padding: '14px 16px', border: '1px solid #eceef1', borderLeft: selected ? '3px solid #77469b' : '1px solid #eceef1', borderRadius: 10, background: selected ? '#f9f7fc' : 'transparent', boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#9aa0a8' }}>{m.timeRange} · {displayDate(m.dateLabel)}</span>
        <span style={{ marginLeft: 'auto', font: '600 11px/1 Inter,sans-serif', color: allDone ? '#3f7d6a' : '#a8763f' }}>
          {m.tasksCompleted}/{m.tasksTotal} task{m.tasksTotal === 1 ? '' : 's'} completed
        </span>
      </div>
      <div style={{ font: '600 14px/1.35 Inter,sans-serif', color: '#23272d', marginTop: 9 }}>{m.title}</div>
    </div>
  );
}
