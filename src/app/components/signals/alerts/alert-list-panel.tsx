import { useState, useMemo, useEffect } from 'react';
import { PROTOTYPE_ALERTS, type PrototypeAlert, type AssigneeOption } from '@/constants/signals/prototype-data';
import { formatAlertValue } from './format-money';
import { SourceBadge, toRowSource } from './source-icon';
import { Badge as MarketplaceBadge } from './marketplace-glyph';
import { AssignDropdownList, AssignPopupModal, DEFAULT_ASSIGNEES, ASSIGN_POPUP_THRESHOLD, Avatar } from './assign-menu';
import { AssignIcon, ShareIcon, DismissIcon, EnvelopeSmallIcon, WorkspaceSmallIcon, RepeatIcon, MeetingGlyphIcon, MoreVertIcon, CheckIcon } from './icons';
import scrollStyles from './alerts-scroll.module.scss';
import motion from './motion.module.scss';
import rowStyles from './alert-row.module.scss';

interface Props {
  selectedAlertId: string | null;
  resolvedAlertIds: Set<string>;
  onSelectAlert: (id: string) => void;
  onOpenItemsForAlert: (id: string) => void;
  /** Called whenever the active search/filter changes, so a consumer (e.g. Speed Mode) can cycle only through what's currently shown here. */
  onFilteredChange: (ids: string[]) => void;
}

export function AlertListPanel({ selectedAlertId, resolvedAlertIds, onSelectAlert, onOpenItemsForAlert, onFilteredChange }: Props) {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [menuMode, setMenuMode] = useState<'main' | 'share' | 'assign'>('main');
  const [priorityFilters, setPriorityFilters] = useState<Record<string, boolean>>({});
  const [categoryFilters, setCategoryFilters] = useState<Record<string, boolean>>({});
  const [sourceFilters, setSourceFilters] = useState<Record<string, boolean>>({});
  const [valueOp, setValueOp] = useState<'>' | '<' | '='>('>');
  const [valueThreshold, setValueThreshold] = useState('');
  const [assignPopupFor, setAssignPopupFor] = useState<PrototypeAlert | null>(null);
  const [assignedTo, setAssignedTo] = useState<Record<string, AssigneeOption>>({});

  const assignAlert = (id: string, a: AssigneeOption) => setAssignedTo((m) => ({ ...m, [id]: a }));

  const filtered = useMemo(() => {
    return PROTOTYPE_ALERTS.filter((al) => {
      if (search && !(al.title + ' ' + al.account).toLowerCase().includes(search.toLowerCase())) return false;
      const activePriorities = Object.keys(priorityFilters).filter((k) => priorityFilters[k]);
      if (activePriorities.length && !activePriorities.includes(al.priority)) return false;
      const activeCategories = Object.keys(categoryFilters).filter((k) => categoryFilters[k]);
      if (activeCategories.length && !activeCategories.includes(al.category)) return false;
      if (valueThreshold) {
        const t = parseFloat(valueThreshold.replace(/[^0-9.]/g, '')) || 0;
        const v = Math.abs(al.valueNum);
        if (valueOp === '>' && !(v > t)) return false;
        if (valueOp === '<' && !(v < t)) return false;
        if (valueOp === '=' && !(Math.abs(v - t) < 1)) return false;
      }
      return true;
    });
  }, [search, priorityFilters, categoryFilters, valueOp, valueThreshold]);

  useEffect(() => {
    onFilteredChange(filtered.map((al) => al.id));
  }, [filtered, onFilteredChange]);

  const todayAlerts = filtered.filter((al) => al.day === 'today');
  const yesterdayAlerts = filtered.filter((al) => al.day === 'yesterday');
  const filterCount = Object.values(priorityFilters).filter(Boolean).length + Object.values(categoryFilters).filter(Boolean).length + Object.values(sourceFilters).filter(Boolean).length + (valueThreshold ? 1 : 0);

  const togglePriority = (k: string) => setPriorityFilters((p) => ({ ...p, [k]: !p[k] }));
  const toggleCategory = (k: string) => setCategoryFilters((p) => ({ ...p, [k]: !p[k] }));
  const toggleSource = (k: string) => setSourceFilters((p) => ({ ...p, [k]: !p[k] }));

  const requestAssign = (al: PrototypeAlert) => {
    const assignees = al.assignees ?? DEFAULT_ASSIGNEES;
    if (assignees.length > ASSIGN_POPUP_THRESHOLD) {
      setMenuFor(null);
      setAssignPopupFor(al);
    } else {
      setMenuFor(al.id);
      setMenuMode('assign');
    }
  };

  return (
    <div style={{ flex: '0 0 35%', maxWidth: '35%', minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'visible', position: 'relative' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #e6e8ec', display: 'flex', flexDirection: 'column', gap: 9, flex: 'none', position: 'relative' }}>
        <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search alerts, ASINs, campaigns" style={{ flex: 1, minWidth: 0, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }} />
          <span onClick={() => setFilterOpen(!filterOpen)} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 16px', border: `1px solid ${filterOpen ? '#77469b' : '#dfe3ea'}`, borderRadius: 6, font: '500 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', background: filterOpen ? '#f9f7fc' : '#fff', flex: 'none', whiteSpace: 'nowrap' as const }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M1 3h14M4 8h8M6.5 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            Filter{filterCount ? ` (${filterCount})` : ''}
          </span>
        </div>
        {filterOpen && (
          <div className={motion.popInTop} style={{ position: 'absolute', left: 16, top: 56, width: 270, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.16)', padding: 14, zIndex: 30, maxHeight: 440, overflowY: 'auto' }}>
            <FilterSection label="Impact value">
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, border: '1px solid #dfe3ea', borderRadius: 6, overflow: 'hidden' }}>
                {(['>', '<', '='] as const).map((op) => (
                  <span key={op} onClick={() => setValueOp(op)} style={{ padding: '8px 10px', background: valueOp === op ? '#f9f7fc' : '#fff', font: '700 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>{op}</span>
                ))}
                <span style={{ width: 1, height: 20, background: '#e6e8ec' }} />
                <span style={{ paddingLeft: 8, font: '600 12px/1 Inter,sans-serif', color: '#9aa0a8' }}>$</span>
                <input value={valueThreshold} onChange={(e) => setValueThreshold(e.target.value)} placeholder="1,000" style={{ flex: 1, minWidth: 0, padding: '8px 9px 8px 2px', border: 'none', font: '400 12px/1 Inter,sans-serif', outline: 'none' }} />
              </div>
            </FilterSection>
            <FilterSection label="Category">
              {['Catalog', 'Inventory', 'Advertising', 'Profitability', 'Compliance', 'Operations', 'Billing', 'Reviews'].map((k) => (
                <div key={k} onClick={() => toggleCategory(k)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
                  <span style={{ width: 13, height: 13, borderRadius: 3, border: '1.5px solid #cfd4dc', background: categoryFilters[k] ? '#77469b' : '#fff', flex: 'none' }} />
                  <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>{k}</span>
                </div>
              ))}
            </FilterSection>
            <FilterSection label="Source">
              {['Anarix', 'Jiva', 'Meeting', 'Slack', 'Workspace', 'Email'].map((k) => (
                <div key={k} onClick={() => toggleSource(k)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
                  <span style={{ width: 13, height: 13, borderRadius: 3, border: '1.5px solid #cfd4dc', background: sourceFilters[k] ? '#77469b' : '#fff', flex: 'none' }} />
                  <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>{k}</span>
                </div>
              ))}
            </FilterSection>
            <FilterSection label="Priority">
              {[['High', '#b3453f'], ['Medium', '#5c7f9e'], ['Low', '#3f7d6a']].map(([k, dot]) => (
                <div key={k} onClick={() => togglePriority(k)} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
                  <span style={{ width: 13, height: 13, borderRadius: 3, border: '1.5px solid #cfd4dc', background: priorityFilters[k] ? '#77469b' : '#fff', flex: 'none' }} />
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot }} />
                  <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>{k}</span>
                </div>
              ))}
            </FilterSection>
            <div style={{ height: 1, background: '#f1f2f4', margin: '13px 0' }} />
            <span onClick={() => { setSearch(''); setPriorityFilters({}); setCategoryFilters({}); setSourceFilters({}); setValueThreshold(''); }} style={{ display: 'block', textAlign: 'center', padding: 9, borderRadius: 6, border: '1px solid #dfe3ea', font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Clear all</span>
          </div>
        )}
      </div>

      <div className={scrollStyles.sleekScroll} style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        {todayAlerts.length > 0 && (
          <>
            <div style={{ padding: '9px 16px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Today</span>
              <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#6b7178' }}>{todayAlerts.length} alert{todayAlerts.length === 1 ? '' : 's'}</span>
            </div>
            {todayAlerts.map((al) => (
              <AlertRow key={al.id} al={al} selected={selectedAlertId === al.id} resolved={resolvedAlertIds.has(al.id)} onSelect={() => onSelectAlert(al.id)} onOpenItems={() => onOpenItemsForAlert(al.id)} menuFor={menuFor} setMenuFor={setMenuFor} menuMode={menuMode} setMenuMode={setMenuMode} requestAssign={requestAssign} assignedTo={assignedTo[al.id]} onAssign={assignAlert} />
            ))}
          </>
        )}
        {yesterdayAlerts.length > 0 && (
          <>
            <div style={{ padding: '9px 16px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Yesterday</span>
              <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#6b7178' }}>{yesterdayAlerts.length} alert{yesterdayAlerts.length === 1 ? '' : 's'}</span>
            </div>
            {yesterdayAlerts.map((al) => (
              <AlertRow key={al.id} al={al} selected={selectedAlertId === al.id} resolved={resolvedAlertIds.has(al.id)} onSelect={() => onSelectAlert(al.id)} onOpenItems={() => onOpenItemsForAlert(al.id)} menuFor={menuFor} setMenuFor={setMenuFor} menuMode={menuMode} setMenuMode={setMenuMode} requestAssign={requestAssign} assignedTo={assignedTo[al.id]} onAssign={assignAlert} />
            ))}
          </>
        )}
        {filtered.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ font: '600 13px/1.4 Inter,sans-serif', color: '#23272d' }}>No alerts match</div>
            <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 6 }}>Try clearing the search or filters.</div>
          </div>
        )}
      </div>

      {assignPopupFor && (
        <AssignPopupModal
          assignees={assignPopupFor.assignees ?? DEFAULT_ASSIGNEES}
          onClose={() => setAssignPopupFor(null)}
          onSelect={(a) => { assignAlert(assignPopupFor.id, a); setAssignPopupFor(null); }}
        />
      )}
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


function AlertRow({ al, selected, resolved, onSelect, onOpenItems, menuFor, setMenuFor, menuMode, setMenuMode, requestAssign, assignedTo, onAssign }: {
  al: PrototypeAlert; selected: boolean; resolved: boolean; onSelect: () => void; onOpenItems: () => void;
  menuFor: string | null; setMenuFor: (id: string | null) => void;
  menuMode: 'main' | 'share' | 'assign'; setMenuMode: (m: 'main' | 'share' | 'assign') => void;
  requestAssign: (al: PrototypeAlert) => void;
  assignedTo?: AssigneeOption;
  onAssign: (id: string, a: AssigneeOption) => void;
}) {
  const isOpen = menuFor === al.id;
  const origin = al.originType ?? 'anarix';
  const rowSource = toRowSource(origin);
  const assignOpen = isOpen && menuMode === 'assign';
  return (
    <div className={rowStyles.alertCard} style={{ margin: '10px 12px', padding: '14px 16px', border: '1px solid #eceef1', borderRadius: 10, background: selected ? '#f9f7fc' : 'transparent', boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer', position: 'relative', borderColor: selected ? '#77469b' : '#eceef1', opacity: resolved ? 0.62 : 1, transition: 'opacity 220ms ease-out, background 150ms ease-out, border-color 150ms ease-out' }}>
      {resolved && (
        <span className={motion.contentFadeIn} style={{ position: 'absolute', left: 12, top: 12, display: 'flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 5, background: '#eef6f3', font: '700 9px/1.5 Inter,sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: '#3f7d6a' }}>
          <CheckIcon size={8} color="#3f7d6a" /> Resolved
        </span>
      )}
      <div style={{ position: 'absolute', right: 12, top: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        {assignedTo ? (
          <span
            onClick={(e) => { e.stopPropagation(); if (assignOpen) setMenuFor(null); else requestAssign(al); }}
            className={motion.pressable}
            style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer' }}
          >
            <Avatar name={assignedTo.name} size={22} vivid />
          </span>
        ) : (
          <span
            onClick={(e) => { e.stopPropagation(); if (assignOpen) setMenuFor(null); else requestAssign(al); }}
            className={motion.pressable}
            style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, color: '#6b7178', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <AssignIcon size={14} />
          </span>
        )}
        <span
          onClick={(e) => { e.stopPropagation(); setMenuFor(isOpen && menuMode !== 'assign' ? null : al.id); setMenuMode('main'); }}
          className={motion.pressable}
          style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, color: '#6b7178', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <MoreVertIcon size={13} />
        </span>
      </div>
      <div onClick={onSelect} style={{ marginTop: resolved ? 20 : 0 }}>
        <span style={{ font: '700 20px/1 Inter,sans-serif', color: al.valueNum < 0 ? '#b3453f' : '#3f7d6a' }}>{formatAlertValue(al.valueNum)}</span>
        <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#8a919b', marginTop: 4 }}>
          {al.impactStr}
          {al.itemsCount > 1 && (
            <>
              {' · '}
              <span
                onClick={(e) => { e.stopPropagation(); onOpenItems(); }}
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 11, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 'none' }}>
          {al.priority !== 'Low' && (
            <span style={{ padding: '3px 8px', borderRadius: 5, background: al.priorityDot + '1a', font: '700 10px/1 Inter,sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: al.priorityDot, flex: 'none' }}>{al.priority}</span>
          )}
          <span style={{ padding: '3px 8px', borderRadius: 5, border: '1px solid #d9c6ec', background: '#fff', font: '600 10px/1 Inter,sans-serif', color: '#5f3880', flex: 'none', whiteSpace: 'nowrap' as const }}>{al.category}</span>
        </div>
        <span style={{ width: 1, height: 14, background: '#e6e8ec', flex: 'none' }} />
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 10px 2px 2px', borderRadius: 999, background: '#eef0f3', flex: 'none' }}>
          <MarketplaceBadge brand={al.mpBrand} size={20} style={{ borderRadius: 7 }} />
          <span style={{ font: '700 11px/1 Inter,sans-serif', color: '#3d434b' }}>{al.mpCountry}</span>
        </span>
        <span style={{ width: 1, height: 14, background: '#e6e8ec', flex: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 'none' }}>
          {rowSource && <SourceBadge source={rowSource} size={20} />}
          {al.repeated && (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, flex: 'none' }}>
              <RepeatIcon size={18} />
            </span>
          )}
          {al.hasMeeting && (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, flex: 'none' }}>
              <MeetingGlyphIcon size={18} />
            </span>
          )}
        </div>
        <span style={{ marginLeft: 'auto', font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8', whiteSpace: 'nowrap' as const, flex: 'none' }}>{al.time}</span>
      </div>
      {isOpen && (
        <div className={motion.popIn} style={{ position: 'absolute', right: 10, top: 40, width: 200, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 40 }} onClick={(e) => e.stopPropagation()}>
          {menuMode === 'main' && (
            <>
              <MenuItem icon={<ShareIcon size={13} />} label="Share" onClick={() => setMenuMode('share')} />
              <MenuItem icon={<DismissIcon size={13} />} label="Dismiss" onClick={() => setMenuFor(null)} />
            </>
          )}
          {menuMode === 'share' && (
            <>
              <div style={{ padding: '6px 10px 8px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Share via</div>
              <MenuItem icon={<EnvelopeSmallIcon size={12} />} label="Email" onClick={() => setMenuFor(null)} />
              <MenuItem icon={<WorkspaceSmallIcon size={12} />} label="Workspace · Nutrabay pod" onClick={() => setMenuFor(null)} />
              <MenuItem icon={<WorkspaceSmallIcon size={12} />} label="Workspace · Leadership" onClick={() => setMenuFor(null)} />
              <div onClick={() => setMenuMode('main')} style={{ padding: '8px 10px 4px', font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>← Back</div>
            </>
          )}
          {menuMode === 'assign' && (
            <>
              <div style={{ padding: '6px 10px 2px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Assign to</div>
              <AssignDropdownList assignees={al.assignees ?? DEFAULT_ASSIGNEES} onSelect={(a) => { onAssign(al.id, a); setMenuFor(null); }} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon?: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 6, cursor: 'pointer', font: '500 12px/1 Inter,sans-serif', color: '#3d434b' }}>
      {icon}{label}
    </div>
  );
}
