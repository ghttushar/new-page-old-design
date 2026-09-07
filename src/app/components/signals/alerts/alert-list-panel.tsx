import { useState, useMemo } from 'react';
import { PROTOTYPE_ALERTS, type PrototypeAlert, type AlertDay } from '@/constants/signals/prototype-data';

interface Props {
  selectedAlertId: string | null;
  onSelectAlert: (id: string) => void;
  loggedActionsCount?: number;
  onOpenActionItems?: () => void;
}

export function AlertListPanel({ selectedAlertId, onSelectAlert, loggedActionsCount = 0, onOpenActionItems }: Props) {
  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [menuMode, setMenuMode] = useState<'main' | 'share' | 'assign'>('main');
  const [priorityFilters, setPriorityFilters] = useState<Record<string, boolean>>({});
  const [categoryFilters, setCategoryFilters] = useState<Record<string, boolean>>({});
  const [sourceFilters, setSourceFilters] = useState<Record<string, boolean>>({});
  const [valueOp, setValueOp] = useState<'>' | '<' | '='>('>');
  const [valueThreshold, setValueThreshold] = useState('');

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

  const todayAlerts = filtered.filter((al) => al.day === 'today');
  const yesterdayAlerts = filtered.filter((al) => al.day === 'yesterday');
  const filterCount = Object.values(priorityFilters).filter(Boolean).length + Object.values(categoryFilters).filter(Boolean).length + Object.values(sourceFilters).filter(Boolean).length + (valueThreshold ? 1 : 0);

  const togglePriority = (k: string) => setPriorityFilters((p) => ({ ...p, [k]: !p[k] }));
  const toggleCategory = (k: string) => setCategoryFilters((p) => ({ ...p, [k]: !p[k] }));
  const toggleSource = (k: string) => setSourceFilters((p) => ({ ...p, [k]: !p[k] }));

  const money = (n: number) => {
    const abs = Math.abs(n);
    const sign = n < 0 ? '−$' : '+$';
    if (abs >= 1000000) return sign + (abs / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (abs >= 1000) return sign + (abs / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return sign + abs.toLocaleString();
  };

  return (
    <div style={{ flex: '0 0 35%', maxWidth: '35%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'visible', position: 'relative' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #e6e8ec', display: 'flex', flexDirection: 'column', gap: 9, flex: 'none', position: 'relative' }}>
        <div style={{ display: 'flex', gap: 7, position: 'relative' }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search alerts, ASINs, campaigns" style={{ padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none', width: 330 }} />
          <span onClick={() => setFilterOpen(!filterOpen)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 21px', border: `1px solid ${filterOpen ? '#77469b' : '#dfe3ea'}`, borderRadius: 6, font: '500 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', background: filterOpen ? '#f9f7fc' : '#fff' }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M1 3h14M4 8h8M6.5 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            Filter{filterCount ? ` (${filterCount})` : ''}
          </span>
        </div>
        {onOpenActionItems && (
          <span onClick={onOpenActionItems} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 12px', border: '1px solid #dfe3ea', borderRadius: 6, font: '500 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', alignSelf: 'flex-start' }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M3 8h10M3 11.5h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            Action items{loggedActionsCount ? ` (${loggedActionsCount})` : ''}
          </span>
        )}
        {filterOpen && (
          <div style={{ position: 'absolute', left: 16, top: 56, width: 270, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.16)', padding: 14, zIndex: 30, maxHeight: 440, overflowY: 'auto' }}>
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
              {['Anarix', 'Jiva', 'Meeting', 'Slack', 'Teams', 'Email'].map((k) => (
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

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {todayAlerts.length > 0 && (
          <>
            <div style={{ padding: '9px 16px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Today</span>
              <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#6b7178' }}>{todayAlerts.length} alert{todayAlerts.length === 1 ? '' : 's'}</span>
            </div>
            {todayAlerts.map((al) => (
              <AlertRow key={al.id} al={al} selected={selectedAlertId === al.id} onSelect={() => onSelectAlert(al.id)} menuFor={menuFor} setMenuFor={setMenuFor} menuMode={menuMode} setMenuMode={setMenuMode} money={money} />
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
              <AlertRow key={al.id} al={al} selected={selectedAlertId === al.id} onSelect={() => onSelectAlert(al.id)} menuFor={menuFor} setMenuFor={setMenuFor} menuMode={menuMode} setMenuMode={setMenuMode} money={money} />
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

function AlertRow({ al, selected, onSelect, menuFor, setMenuFor, menuMode, setMenuMode, money }: {
  al: PrototypeAlert; selected: boolean; onSelect: () => void;
  menuFor: string | null; setMenuFor: (id: string | null) => void;
  menuMode: 'main' | 'share' | 'assign'; setMenuMode: (m: 'main' | 'share' | 'assign') => void;
  money: (n: number) => string;
}) {
  const isOpen = menuFor === al.id;
  return (
    <div style={{ margin: '10px 12px', padding: '14px 16px', border: '1px solid #eceef1', borderRadius: 10, background: selected ? '#f9f7fc' : 'transparent', boxShadow: '0 1px 2px rgba(20,24,33,.03)', cursor: 'pointer', position: 'relative', borderColor: selected ? '#77469b' : '#eceef1' }}>
      <span onClick={(e) => { e.stopPropagation(); setMenuFor(isOpen ? null : al.id); setMenuMode('main'); }} style={{ position: 'absolute', right: 12, top: 12, padding: '2px 6px', font: '700 13px/1 Inter,sans-serif', color: '#6b7178', cursor: 'pointer' }}>⋯</span>
      <div onClick={onSelect}>
        <span style={{ font: '700 20px/1 Inter,sans-serif', color: al.valueNum < 0 ? '#b3453f' : '#3f7d6a' }}>{money(al.valueNum)}</span>
        <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#8a919b', marginTop: 4 }}>{al.impactStr} · {al.category} agent{al.itemsCount > 1 ? ` · ${al.itemsBreakdown}` : ''}</div>
        <div style={{ font: '600 14px/1.35 Inter,sans-serif', color: '#23272d', marginTop: 6, paddingRight: 20, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{al.title}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 11, flexWrap: 'wrap' }}>
        <span style={{ padding: '3px 8px', borderRadius: 5, background: al.priorityDot + '1a', font: '700 10px/1.5 Inter,sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' as const, color: al.priorityDot, flex: 'none' }}>{al.priority}</span>
        {al.repeated && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 5, background: '#fbf1ef', flex: 'none', whiteSpace: 'nowrap' as const }}>
            <svg width="9" height="9" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 0 1 10.5-4M14 8a6 6 0 0 1-10.5 4" stroke="#a8763f" strokeWidth="1.4" strokeLinecap="round" /><path d="M12.5 1.5v3h-3M3.5 14.5v-3h3" stroke="#a8763f" strokeWidth="1.4" strokeLinecap="round" /></svg>
            <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#a8763f' }}>Repeated</span>
          </span>
        )}
        {al.hasMeeting && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 5, background: '#eef2fb', flex: 'none', whiteSpace: 'nowrap' as const }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M6.5 9.5a3 3 0 0 0 4.2 0l1.6-1.6a3 3 0 0 0-4.2-4.2L7 4.7M9.5 6.5a3 3 0 0 0-4.2 0l-1.6 1.6a3 3 0 0 0 4.2 4.2L9 11.3" stroke="#4a6fa5" strokeWidth="1.3" strokeLinecap="round" /></svg>
            <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#4a6fa5' }}>{al.meetingLabel || 'Meeting'}</span>
          </span>
        )}
        <span style={{ marginLeft: 'auto', font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8', whiteSpace: 'nowrap' as const, flex: 'none' }}>{al.time}</span>
      </div>
      {isOpen && (
        <div style={{ position: 'absolute', right: 10, top: 34, width: 172, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 40 }}>
          {menuMode === 'main' && (
            <>
              <MenuItem icon={<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="4" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" /><circle cx="12" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.3" /><circle cx="12" cy="12.5" r="2" stroke="currentColor" strokeWidth="1.3" /><path d="M5.8 7l4.4-2.7M5.8 9l4.4 2.7" stroke="currentColor" strokeWidth="1.3" /></svg>} label="Share" onClick={() => setMenuMode('share')} />
              <MenuItem icon={<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" /><path d="M5 5l6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>} label="Dismiss" onClick={() => setMenuFor(null)} />
              <MenuItem icon={<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" /><path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="currentColor" strokeWidth="1.3" /></svg>} label="Assign to…" onClick={() => setMenuMode('assign')} />
            </>
          )}
          {menuMode === 'share' && (
            <>
              <div style={{ padding: '6px 10px 8px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Share via</div>
              <MenuItem label="✉ Email" onClick={() => setMenuFor(null)} />
              <MenuItem label="▦ Workspace · Nutrabay pod" onClick={() => setMenuFor(null)} />
              <MenuItem label="▦ Workspace · Leadership" onClick={() => setMenuFor(null)} />
              <div onClick={() => setMenuMode('main')} style={{ padding: '8px 10px 4px', font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>← Back</div>
            </>
          )}
          {menuMode === 'assign' && (
            <>
              <div style={{ padding: '6px 10px 8px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Assign to</div>
              <AssignMenuItem name="✦ Jiva" role="AI" />
              <AssignMenuItem name="Mike" role="Ops" />
              <AssignMenuItem name="Sarah" role="Marketing" />
              <AssignMenuItem name="Myself" role="You" />
              <div onClick={() => setMenuMode('main')} style={{ padding: '8px 10px 4px', font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>← Back</div>
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

function AssignMenuItem({ name, role }: { name: string; role: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', borderRadius: 6, cursor: 'pointer' }}>
      <span style={{ font: '500 12px/1 Inter,sans-serif', color: name.includes('Jiva') ? '#5f3880' : '#3d434b' }}>{name}</span>
      <span style={{ marginLeft: 'auto', font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>{role}</span>
    </div>
  );
}
