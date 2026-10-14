import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MOCK_RULES, RULE_SCHEDULE, RULE_TYPES, ruleIncompatibility,
  type CcCampaign, type CcDraft, type CcProduct, type CcRule, type RuleScope, type RuleType,
} from '../campaign-creator.types';
import {
  Checkbox, ChevronRightIcon, FONT, GOOD, SearchIcon,
  TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY, TextButton,
} from '../campaign-creator-ui';
import { Panel } from '../ccd-design';
import { FIELD } from './preview-targets';

// Section 8.7: attach the new campaigns to existing Rules. A Rule is only ever read here, never created or changed.

/** Campaign ids attached to one Rule. */
export const campaignsForRule = (draft: CcDraft, ruleId: string): string[] => draft.ruleAssignments[ruleId] ?? [];

/** Names of the Rules a campaign is attached to (section 8.7.7). */
export function rulesForCampaign(draft: CcDraft, campaignId: string): string[] {
  return MOCK_RULES.filter((r) => campaignsForRule(draft, r.id).includes(campaignId)).map((r) => r.name);
}

/** How many Rules have at least one campaign attached. */
export const attachedRuleCount = (draft: CcDraft): number => MOCK_RULES.filter((r) => campaignsForRule(draft, r.id).length > 0).length;

const COLS = '28px minmax(190px, 1.6fr) 96px 84px 112px 176px 96px 84px 132px 150px';

// ── The checklist that opens from "Attach campaigns" ─────────────────────────────────────────

function AttachPopover({ rule, campaigns, selected, anchor, onChange, onClose }: {
  rule: CcRule; campaigns: CcCampaign[]; selected: string[]; anchor: DOMRect; onChange: (ids: string[]) => void; onClose: () => void;
}) {
  const [query, setQuery] = useState('');
  // Filter by group: a row of the groups under the search bar, opened from the funnel button.
  const [filterOpen, setFilterOpen] = useState(false);
  const [groupFilter, setGroupFilter] = useState<string[]>([]);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const groupOf = (c: CcCampaign) => c.groupName ?? 'Ungrouped';
  const groupCounts = useMemo(() => {
    const counts = new Map<string, number>();
    campaigns.forEach((c) => counts.set(groupOf(c), (counts.get(groupOf(c)) ?? 0) + 1));
    return Array.from(counts.entries());
  }, [campaigns]);
  const toggleGroup = (name: string) => setGroupFilter((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));

  const q = query.trim().toLowerCase();
  const shown = campaigns.filter((c) => (!q || ('anarix_' + c.name).toLowerCase().includes(q)) && (groupFilter.length === 0 || groupFilter.includes(groupOf(c))));
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  const width = 360;
  const left = Math.max(8, Math.min(anchor.right - width, window.innerWidth - width - 8));
  const top = Math.min(anchor.bottom + 8, Math.max(8, window.innerHeight - 440));

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 239 }} onMouseDown={onClose} />
      <div role="dialog" aria-label={`Attach campaigns to ${rule.name}`} className="ccd-rl-pop" onMouseDown={(e) => e.stopPropagation()} style={{ top, left, width }}>
        <div className="ccd-rl-pop__head">
          <div style={{ minWidth: 0 }}>
            <strong>Attach campaigns</strong>
            <span title={rule.name}>{rule.name}</span>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="ccd-rl-pop__x">
            <svg width={10} height={10} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>

        <div className="ccd-rl-pop__tools">
          <span style={{ position: 'relative', flex: 1, display: 'flex' }}>
            <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}><SearchIcon /></span>
            <input className="ccd-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search campaigns" aria-label="Search campaigns" style={{ ...FIELD, width: '100%', padding: '7px 8px 7px 30px' }} />
          </span>
          <button
            type="button" className={`ccd-rl-filterbtn ccd-rl-pop__filter${filterOpen ? ' is-open' : ''}`} aria-expanded={filterOpen} aria-label="Filter campaigns by group"
            onClick={() => setFilterOpen((v) => !v)}
          >
            <FunnelIcon />Filter{groupFilter.length > 0 && <i className="ccd-num">{groupFilter.length}</i>}
          </button>
        </div>
        {filterOpen && (
          <div className="ccd-rl-pop__groups" role="group" aria-label="Filter by group">
            <span className="ccd-rl-pop__groups-title">Group{groupFilter.length > 0 && <button type="button" onClick={() => setGroupFilter([])}>Clear</button>}</span>
            {groupCounts.map(([name, n]) => {
              const on = groupFilter.includes(name);
              return (
                <button key={name} type="button" role="checkbox" aria-checked={on} className="ccd-rl-pop__group" onClick={() => toggleGroup(name)}>
                  <Checkbox checked={on} size={15} />
                  <span title={name}>{name}</span>
                  <small className="ccd-num">{n}</small>
                </button>
              );
            })}
          </div>
        )}
        <div className="ccd-rl-pop__bar">
          <span className="ccd-num">{selected.length} of {campaigns.length} attached</span>
          <span style={{ display: 'inline-flex', gap: 14 }}>
            <TextButton onClick={() => onChange(Array.from(new Set([...selected, ...shown.map((c) => c.id)])))}>Select all</TextButton>
            <TextButton onClick={() => { const drop = new Set(shown.map((c) => c.id)); onChange(selected.filter((id) => !drop.has(id))); }}>Clear</TextButton>
          </span>
        </div>

        <div className="ccd-scroll ccd-rl-pop__list" role="group" aria-label="Campaigns">
          {shown.map((c) => {
            const on = selected.includes(c.id);
            return (
              <button key={c.id} type="button" role="checkbox" aria-checked={on} onClick={() => toggle(c.id)} className="ccd-row ccd-rl-pop__item">
                <Checkbox checked={on} size={16} />
                <span className="ccd-rl-pop__name" title={c.name}>{c.name}</span>
                <span className="ccd-rl-group" title={`Group: ${groupOf(c)}`}>{groupOf(c)}</span>
              </button>
            );
          })}
          {shown.length === 0 && <div style={{ padding: '22px 14px', textAlign: 'center', font: `400 13px/1.5 ${FONT}`, color: TEXT_MUTED }}>No campaigns match.</div>}
        </div>

        <div className="ccd-rl-pop__foot">
          <button type="button" onClick={onClose} className="ccd-btn ccd-primary" style={{ padding: '8px 18px', border: 'none', borderRadius: 8, color: '#fff', font: `600 12.5px/1 ${FONT}`, cursor: 'pointer' }}>Done</button>
        </div>
      </div>
    </>,
    document.body,
  );
}

// ── The one Filters menu: type, status and scope ─────────────────────────────────────────────

const FunnelIcon = () => <svg width={13} height={13} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M2.5 3.5h11L9.4 8.4v4l-2.8 1.3V8.4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>;

function FilterPopover({ anchor, type, status, scope, onType, onStatus, onScope, onReset, onClose }: {
  anchor: DOMRect; type: RuleType | 'all'; status: 'all' | 'Active' | 'Inactive'; scope: RuleScope | 'all';
  onType: (v: RuleType | 'all') => void; onStatus: (v: 'all' | 'Active' | 'Inactive') => void; onScope: (v: RuleScope | 'all') => void;
  onReset: () => void; onClose: () => void;
}) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const width = 280;
  const left = Math.max(8, Math.min(anchor.left, window.innerWidth - width - 8));
  const top = Math.min(anchor.bottom + 8, Math.max(8, window.innerHeight - 330));
  const any = type !== 'all' || status !== 'all' || scope !== 'all';

  return createPortal(
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 239 }} onMouseDown={onClose} />
      <div role="dialog" aria-label="Filter Rules" className="ccd-rl-pop ccd-rl-filters" onMouseDown={(e) => e.stopPropagation()} style={{ top, left, width }}>
        <label className="ccd-rl-filters__field">
          <span>Rule type</span>
          <select className="ccd-input" value={type} onChange={(e) => onType(e.target.value as RuleType | 'all')} style={{ ...FIELD, width: '100%' }}>
            <option value="all">All types</option>
            {RULE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <label className="ccd-rl-filters__field">
          <span>Status</span>
          <select className="ccd-input" value={status} onChange={(e) => onStatus(e.target.value as 'all' | 'Active' | 'Inactive')} style={{ ...FIELD, width: '100%' }}>
            <option value="all">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </label>
        <label className="ccd-rl-filters__field">
          <span>Scope</span>
          <select className="ccd-input" value={scope} onChange={(e) => onScope(e.target.value as RuleScope | 'all')} style={{ ...FIELD, width: '100%' }}>
            <option value="all">All scopes</option>
            <option value="Campaign">Campaign</option>
            <option value="Ad group">Ad group</option>
            <option value="Account">Account</option>
          </select>
        </label>
        <div className="ccd-rl-filters__foot">
          <button type="button" className="ccd-rl-filters__reset" disabled={!any} onClick={onReset}>Reset filters</button>
          <button type="button" onClick={onClose} className="ccd-btn ccd-primary" style={{ padding: '8px 18px', border: 'none', borderRadius: 8, color: '#fff', font: `600 12.5px/1 ${FONT}`, cursor: 'pointer' }}>Done</button>
        </div>
      </div>
    </>,
    document.body,
  );
}

// ── One Rule, read only ──────────────────────────────────────────────────────────────────────

function RuleRow({ rule, attached, total, onAttach }: {
  rule: CcRule; attached: number; total: number; onAttach: (anchor: DOMRect) => void;
}) {
  const [open, setOpen] = useState(false);
  const sched = RULE_SCHEDULE[rule.id];
  const active = rule.status === 'Active';

  return (
    <div className="ccd-rl-card">
      <div className="ccd-rl-row">
        <button type="button" className="ccd-rl-chev" aria-expanded={open} aria-label={open ? `Hide details of ${rule.name}` : `Show details of ${rule.name}`} onClick={() => setOpen((v) => !v)}>
          <span style={{ display: 'inline-flex', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 140ms ease-out' }}><ChevronRightIcon size={11} /></span>
        </button>
        <div className="ccd-rl-namecell">
          <span className="ccd-rl-name">{rule.name}</span>
        </div>
        <span className="ccd-rl-cell">{rule.type}</span>
        <span className="ccd-rl-cell ccd-rl-status"><i style={{ background: active ? GOOD : '#aab0bb' }} />{rule.status}</span>
        <span className="ccd-rl-cell">
          <span className="ccd-rl-linked">{rule.assignedCampaigns} campaigns</span>
          {attached > 0 && <span className="ccd-rl-new">+{attached} new</span>}
        </span>
        <span className="ccd-rl-cell ccd-num">{sched.runFrom} - {sched.runTo}</span>
        <span className="ccd-rl-cell">{sched.frequency}</span>
        <span className="ccd-rl-cell ccd-num">{sched.lastRun}</span>
        <span className="ccd-rl-cell ccd-num">{sched.nextTrigger}</span>
        <span className="ccd-rl-cell ccd-rl-actioncell">
          <button
            type="button" className={`ccd-rl-attach${attached > 0 ? ' is-on' : ''}`}
            aria-label={`Attach campaigns to ${rule.name}`}
            onClick={(e) => onAttach(e.currentTarget.getBoundingClientRect())}
          >
            {attached > 0 ? (
              <>
                <svg width={12} height={12} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3 8.4l3.2 3.2L13 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {attached} of {total} attached
              </>
            ) : 'Attach campaigns'}
          </button>
        </span>
      </div>

      {open && (
        <dl className="ccd-rl-detail">
          <div><dt>Description</dt><dd>{rule.description}</dd></div>
          <div><dt>Conditions</dt><dd>{rule.conditions}</dd></div>
          <div><dt>Actions</dt><dd>{rule.actions}</dd></div>
          <div><dt>Scope</dt><dd>{rule.scope}</dd></div>
          <div><dt>Ad type</dt><dd>{rule.adType}</dd></div>
          <div><dt>Date created</dt><dd className="ccd-num">{sched.created}</dd></div>
        </dl>
      )}
    </div>
  );
}

// ── The section ──────────────────────────────────────────────────────────────────────────────

export default function RulesSection({ draft, campaigns, onChange }: {
  draft: CcDraft; campaigns: CcCampaign[]; selectedProducts?: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const marketplace = draft.marketplace ?? 'amazon';
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<RuleType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [scopeFilter, setScopeFilter] = useState<RuleScope | 'all'>('all');
  const [popover, setPopover] = useState<{ ruleId: string; anchor: DOMRect } | null>(null);
  const [filterAnchor, setFilterAnchor] = useState<DOMRect | null>(null);
  // Rules are optional, so the section starts folded away.
  const [expanded, setExpanded] = useState(false);

  const visible = useMemo(() => MOCK_RULES.filter((r) => {
    if (ruleIncompatibility(r, marketplace) !== null) return false;
    const q = query.trim().toLowerCase();
    if (q && !r.name.toLowerCase().includes(q) && !r.type.toLowerCase().includes(q)) return false;
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (scopeFilter !== 'all' && r.scope !== scopeFilter) return false;
    return true;
  }), [marketplace, query, typeFilter, statusFilter, scopeFilter]);

  const attachedRules = MOCK_RULES.filter((r) => campaignsForRule(draft, r.id).length > 0);
  const filterCount = (typeFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (scopeFilter !== 'all' ? 1 : 0) + (query.trim() ? 1 : 0);
  const activeFilters = (typeFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (scopeFilter !== 'all' ? 1 : 0);
  const clearFilters = () => { setQuery(''); setTypeFilter('all'); setStatusFilter('all'); setScopeFilter('all'); };
  const setAssignment = (ruleId: string, ids: string[]) => onChange({ ruleAssignments: { ...draft.ruleAssignments, [ruleId]: ids } });
  const open = popover ? MOCK_RULES.find((r) => r.id === popover.ruleId) : undefined;

  return (
    <Panel
      title={<>Rules <span className="ccd-rl-optional">(Optional)</span></>}
      pad={expanded ? 20 : 0}
      aside={
        <button type="button" className={`ccd-rl-toggle${expanded ? ' is-open' : ''}`} aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
          {!expanded && attachedRules.length > 0 && <span className="ccd-rl-toggle__n">{attachedRules.length} attached</span>}
          {expanded ? 'Hide' : 'Show'}
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden><path d="M4 6.2l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      }
    >
      {expanded && (<>
      <p style={{ margin: '0 0 16px', font: `400 13px/1.55 ${FONT}`, color: TEXT_MUTED }}>
        Attach your new campaigns to the Rules already in your account. Rules can't be created or changed from here.
      </p>

      <div className="ccd-rl-bar">
        <span style={{ position: 'relative', flex: '1 1 220px', maxWidth: 320, display: 'flex' }}>
          <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}><SearchIcon /></span>
          <input className="ccd-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or type" aria-label="Search Rules" style={{ ...FIELD, width: '100%', padding: '7px 8px 7px 30px' }} />
        </span>
        <button
          type="button" className="ccd-rl-filterbtn" aria-haspopup="dialog" aria-expanded={filterAnchor !== null}
          onClick={(e) => setFilterAnchor(filterAnchor ? null : e.currentTarget.getBoundingClientRect())}
        >
          <FunnelIcon />Filters{activeFilters > 0 && <i className="ccd-num">{activeFilters}</i>}
        </button>
      </div>

      <div className="ccd-scroll ccd-rl-scroll">
        <div className="ccd-rl" style={{ ['--ccd-rl-cols' as string]: COLS }}>
          <div className="ccd-rl-head" role="row">
            <span />
            <span>Rule name</span><span>Rule type</span><span>Status</span><span>Linked campaigns</span><span>Run between</span><span>Frequency</span><span>Last run</span><span>Next trigger</span><span style={{ textAlign: 'right' }}>Attach</span>
          </div>
          {visible.map((r) => (
            <RuleRow
              key={r.id} rule={r} attached={campaignsForRule(draft, r.id).length} total={campaigns.length}
              onAttach={(anchor) => setPopover({ ruleId: r.id, anchor })}
            />
          ))}
          {visible.length === 0 && (
            <div className="ccd-rl-empty">
              <strong>No Rules match these filters</strong>
              <span>Try a different name or type, or clear the filters to see every Rule you can use here.</span>
              <TextButton onClick={clearFilters}>Clear filters</TextButton>
            </div>
          )}
        </div>
      </div>

      <div className="ccd-rl-summary">
        {attachedRules.length === 0 ? (
          <p style={{ margin: 0, font: `400 12.5px/1.5 ${FONT}`, color: TEXT_FAINT }}>No campaigns attached to a Rule yet. Rules are optional, and your campaigns will be created without any automation.</p>
        ) : (
          <>
            <div style={{ font: `600 13px/1.3 ${FONT}`, color: TEXT_PRIMARY, marginBottom: 6 }}>{attachedRules.length} Rule{attachedRules.length === 1 ? '' : 's'} attached</div>
            {attachedRules.map((r) => {
              const n = campaignsForRule(draft, r.id).length;
              return (
                <div key={r.id} className="ccd-rl-summary__row">
                  <span className="ccd-rl-summary__name" title={r.name}>{r.name}</span>
                  <span className="ccd-num" style={{ color: TEXT_MUTED }}>Applied to {n} of {campaigns.length} campaign{campaigns.length === 1 ? '' : 's'}</span>
                  <TextButton onClick={() => setAssignment(r.id, [])}>Detach all</TextButton>
                </div>
              );
            })}
          </>
        )}
      </div>

      {filterAnchor && (
        <FilterPopover
          anchor={filterAnchor} type={typeFilter} status={statusFilter} scope={scopeFilter}
          onType={setTypeFilter} onStatus={setStatusFilter} onScope={setScopeFilter}
          onReset={() => { setTypeFilter('all'); setStatusFilter('all'); setScopeFilter('all'); }}
          onClose={() => setFilterAnchor(null)}
        />
      )}

      {popover && open && (
        <AttachPopover
          rule={open} campaigns={campaigns} selected={campaignsForRule(draft, open.id)} anchor={popover.anchor}
          onChange={(ids) => setAssignment(open.id, ids)} onClose={() => setPopover(null)}
        />
      )}
      </>)}
    </Panel>
  );
}
