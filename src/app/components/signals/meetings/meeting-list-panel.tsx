import { useMemo, useState } from 'react';
import { MEETING_LIST, COMPLETED_MEETINGS, type MeetingListItem, type CompletedMeeting } from '@/constants/signals/prototype-data';
import scrollStyles from '../alerts/alerts-scroll.module.scss';
import motion from '../alerts/motion.module.scss';

interface Props {
  selectedMeetingId: string | null;
  onSelectMeeting: (id: string) => void;
  /** Forces the filter popover open on mount — for the design-handoff preview, not used by the real app. */
  initialFilterOpen?: boolean;
}

type GroupKey = 'today' | 'tomorrow' | 'earlier';

const GROUP_ORDER: { key: GroupKey; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'earlier', label: 'Earlier' },
];

const ALL_ACCOUNTS = Array.from(new Set([...MEETING_LIST, ...COMPLETED_MEETINGS].map((m) => m.account)));
const ALL_MOM_STATUSES = Array.from(new Set(COMPLETED_MEETINGS.map((m) => m.momStatus)));

function groupFor(dateLabel: string): GroupKey {
  if (dateLabel.startsWith('Today')) return 'today';
  if (dateLabel.startsWith('Tomorrow')) return 'tomorrow';
  return 'earlier';
}

export function MeetingListPanel({ selectedMeetingId, onSelectMeeting, initialFilterOpen = false }: Props) {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(initialFilterOpen);
  const [accountFilters, setAccountFilters] = useState<Record<string, boolean>>({});
  const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({});
  const [momFilters, setMomFilters] = useState<Record<string, boolean>>({});

  const toggleAccount = (k: string) => setAccountFilters((p) => ({ ...p, [k]: !p[k] }));
  const toggleStatus = (k: string) => setStatusFilters((p) => ({ ...p, [k]: !p[k] }));
  const toggleMom = (k: string) => setMomFilters((p) => ({ ...p, [k]: !p[k] }));

  const activeAccounts = Object.keys(accountFilters).filter((k) => accountFilters[k]);
  const activeStatus = Object.keys(statusFilters).filter((k) => statusFilters[k]);
  const activeMom = Object.keys(momFilters).filter((k) => momFilters[k]);
  const filterCount = activeAccounts.length + activeStatus.length + activeMom.length;

  const q = search.trim().toLowerCase();

  const filteredUpcoming = useMemo(() => {
    return MEETING_LIST.filter((m) => {
      if (q && !(m.title + ' ' + m.account).toLowerCase().includes(q)) return false;
      if (activeAccounts.length && !activeAccounts.includes(m.account)) return false;
      if (activeStatus.length && !activeStatus.includes('Upcoming')) return false;
      return true;
    });
  }, [q, activeAccounts, activeStatus]);

  const filteredCompleted = useMemo(() => {
    return COMPLETED_MEETINGS.filter((m) => {
      if (q && !(m.title + ' ' + m.account).toLowerCase().includes(q)) return false;
      if (activeAccounts.length && !activeAccounts.includes(m.account)) return false;
      if (activeStatus.length && !activeStatus.includes('Completed')) return false;
      if (activeMom.length && !activeMom.includes(m.momStatus)) return false;
      return true;
    });
  }, [q, activeAccounts, activeStatus, activeMom]);

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
    <div style={{ flex: '0 0 35%', maxWidth: '35%', minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'visible', position: 'relative' }}>
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
            <FilterSection label="Status">
              {['Upcoming', 'Completed'].map((k) => (
                <div key={k} onClick={() => toggleStatus(k)} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '4px 6px', margin: '0 -6px', borderRadius: 6 }}>
                  <span style={{ width: 13, height: 13, borderRadius: 3, border: '1.5px solid #cfd4dc', background: statusFilters[k] ? '#77469b' : '#fff', flex: 'none', transition: 'background 120ms ease-out' }} />
                  <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>{k}</span>
                </div>
              ))}
            </FilterSection>
            <FilterSection label="MOM status">
              {ALL_MOM_STATUSES.map((k) => (
                <div key={k} onClick={() => toggleMom(k)} className={motion.rowHover} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '4px 6px', margin: '0 -6px', borderRadius: 6 }}>
                  <span style={{ width: 13, height: 13, borderRadius: 3, border: '1.5px solid #cfd4dc', background: momFilters[k] ? '#77469b' : '#fff', flex: 'none', transition: 'background 120ms ease-out' }} />
                  <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>{k}</span>
                </div>
              ))}
            </FilterSection>
            <span
              onClick={() => { setSearch(''); setAccountFilters({}); setStatusFilters({}); setMomFilters({}); }}
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
          return (
            <div key={key}>
              <div style={{ padding: '9px 16px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6b7178' }}>{label}</span>
                <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#6b7178' }}>{count} meeting{count === 1 ? '' : 's'}</span>
              </div>
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
  const allDone = m.tasksTotal > 0 && m.tasksCompleted === m.tasksTotal;
  return (
    <div
      onClick={onSelect}
      className={motion.cardHover}
      style={{ margin: '10px 12px', padding: '14px 16px', border: '1px solid #eceef1', borderLeft: selected ? '3px solid #77469b' : '1px solid #eceef1', borderRadius: 10, background: selected ? '#f9f7fc' : 'transparent', boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#464646' }}>{m.timeRange}</span>
        <span style={{ marginLeft: 'auto', font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>{m.dateLabel}</span>
      </div>
      <div style={{ font: '600 14px/1.35 Inter,sans-serif', color: '#23272d', marginTop: 9 }}>{m.title}</div>
      <div style={{ marginTop: 9, font: '600 11px/1 Inter,sans-serif', color: allDone ? '#3f7d6a' : '#a8763f' }}>
        {m.tasksCompleted}/{m.tasksTotal} task{m.tasksTotal === 1 ? '' : 's'} completed
      </div>
    </div>
  );
}

function CompletedRow({ m, selected, onSelect }: { m: CompletedMeeting; selected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      className={motion.cardHover}
      style={{ margin: '10px 12px', padding: '14px 16px', border: '1px solid #eceef1', borderLeft: selected ? '3px solid #77469b' : '1px solid #eceef1', borderRadius: 10, background: selected ? '#f9f7fc' : 'transparent', boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#464646' }}>{m.timeRange}</span>
        <span style={{ padding: '2px 7px', borderRadius: 4, background: m.momColor + '1a', font: '600 10px/1.5 Inter,sans-serif', color: m.momColor }}>{m.momStatus}</span>
        <span style={{ marginLeft: 'auto', font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>{m.dateLabel}</span>
      </div>
      <div style={{ font: '600 14px/1.35 Inter,sans-serif', color: '#23272d', marginTop: 9 }}>{m.title}</div>
    </div>
  );
}
