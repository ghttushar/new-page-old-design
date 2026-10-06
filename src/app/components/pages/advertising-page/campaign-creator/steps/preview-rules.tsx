import { useMemo, useState } from 'react';
import {
  MOCK_RULES, RULE_TYPES, ruleIncompatibility,
  type CcCampaign, type CcDraft, type CcProduct, type CcRule, type RuleScope, type RuleType,
} from '../campaign-creator.types';
import {
  BORDER, Checkbox, ChevronRightIcon, FONT, GOOD, HAIR, Radio, SearchIcon, SectionTitle,
  TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY, TextButton, WARN,
} from '../campaign-creator-ui';
import { Panel } from '../cc-design';
import { FIELD } from './preview-targets';

// §8.7 — assign existing Rules to the generated campaigns. Never creates or edits a Rule.

/** Campaign ids a Rule assignment currently covers. */
export function assignedCampaignIds(draft: CcDraft, campaigns: CcCampaign[]): string[] {
  if (draft.ruleIds.length === 0) return [];
  if (draft.ruleScope === 'all') return campaigns.map((c) => c.id);
  return campaigns.filter((c) => draft.ruleCampaignIds.includes(c.id)).map((c) => c.id);
}

/** Names of the Rules that will be attached to one campaign (§8.7.7). */
export function ruleNamesForCampaign(draft: CcDraft, campaignId: string, campaigns: CcCampaign[]): string[] {
  if (!assignedCampaignIds(draft, campaigns).includes(campaignId)) return [];
  return draft.ruleIds.map((id) => MOCK_RULES.find((r) => r.id === id)?.name).filter((n): n is string => !!n);
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: `400 12px/1 ${FONT}`, color: TEXT_MUTED }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? GOOD : TEXT_FAINT }} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
}

function RuleRow({ rule, selected, reason, onToggle }: { rule: CcRule; selected: boolean; reason: string | null; onToggle: () => void }) {
  const [open, setOpen] = useState(false);
  const disabled = reason !== null;
  return (
    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${HAIR}`, opacity: disabled ? 0.8 : 1 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <button
          type="button" role="checkbox" aria-checked={selected} aria-disabled={disabled} aria-label={`Assign ${rule.name}`} disabled={disabled}
          onClick={onToggle}
          style={{ marginTop: 1, padding: 0, border: 'none', background: 'none', cursor: disabled ? 'not-allowed' : 'pointer', display: 'flex' }}
        ><Checkbox checked={selected} disabled={disabled} /></button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '2px 14px' }}>
            <span style={{ font: `600 13px/1.4 ${FONT}`, color: disabled ? TEXT_MUTED : TEXT_PRIMARY }}>{rule.name}</span>
            <span style={{ font: `400 12px/1.4 ${FONT}`, color: TEXT_MUTED }}>{rule.type}</span>
            <StatusDot active={rule.status === 'Active'} />
          </div>
          <div style={{ marginTop: 3, font: `400 12.5px/1.5 ${FONT}`, color: TEXT_MUTED }}>{rule.description}</div>
          <div className="cc-num" style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: '2px 16px', font: `400 12px/1.5 ${FONT}`, color: TEXT_FAINT }}>
            <span>Scope: {rule.scope}</span>
            <span>Used by {rule.assignedCampaigns} campaign{rule.assignedCampaigns === 1 ? '' : 's'}</span>
          </div>
          {disabled && <div style={{ marginTop: 6, font: `400 12.5px/1.5 ${FONT}`, color: WARN }}>Not available for the selected campaigns. {reason}</div>}
          {!disabled && <div style={{ marginTop: 6, font: `400 12px/1.5 ${FONT}`, color: GOOD }}>Compatible with selected campaigns</div>}
          <button
            type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="cc-link"
            style={{ marginTop: 6, padding: 0, border: 'none', background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, font: `600 12px/1.4 ${FONT}`, color: TEXT_MUTED }}
          >
            <span style={{ display: 'inline-flex', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 140ms ease-out' }}><ChevronRightIcon size={10} /></span>
            {open ? 'Hide rule' : 'View rule'}
          </button>
          {open && (
            <dl style={{ margin: '8px 0 0', display: 'grid', gridTemplateColumns: '84px 1fr', gap: '4px 12px', font: `400 12.5px/1.5 ${FONT}` }}>
              <dt style={{ color: TEXT_FAINT }}>Conditions</dt><dd style={{ margin: 0, color: TEXT_PRIMARY }}>{rule.conditions}</dd>
              <dt style={{ color: TEXT_FAINT }}>Actions</dt><dd style={{ margin: 0, color: TEXT_PRIMARY }}>{rule.actions}</dd>
              <dt style={{ color: TEXT_FAINT }}>Ad type</dt><dd style={{ margin: 0, color: TEXT_PRIMARY }}>{rule.adType}</dd>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RulesSection({ draft, campaigns, selectedProducts, onChange }: {
  draft: CcDraft; campaigns: CcCampaign[]; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const marketplace = draft.marketplace ?? 'amazon';
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<RuleType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [scopeFilter, setScopeFilter] = useState<RuleScope | 'all'>('all');

  const visible = MOCK_RULES.filter((r) => {
    const q = query.trim().toLowerCase();
    if (q && !r.name.toLowerCase().includes(q) && !r.type.toLowerCase().includes(q)) return false;
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (scopeFilter !== 'all' && r.scope !== scopeFilter) return false;
    return true;
  });

  const selectedRules = draft.ruleIds.map((id) => MOCK_RULES.find((r) => r.id === id)).filter((r): r is CcRule => !!r);
  const appliedCount = assignedCampaignIds(draft, campaigns).length;

  const toggleRule = (id: string) => onChange({ ruleIds: draft.ruleIds.includes(id) ? draft.ruleIds.filter((x) => x !== id) : [...draft.ruleIds, id] });
  const toggleCampaign = (id: string) => onChange({ ruleCampaignIds: draft.ruleCampaignIds.includes(id) ? draft.ruleCampaignIds.filter((x) => x !== id) : [...draft.ruleCampaignIds, id] });

  const filterCount = (typeFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0) + (scopeFilter !== 'all' ? 1 : 0) + (query.trim() ? 1 : 0);

  return (
    <Panel style={{ marginTop: 24 }}>
      <SectionTitle aside={<span className="cc-num" style={{ font: `400 12px/1 ${FONT}`, color: TEXT_FAINT }}>Optional</span>}>Rules</SectionTitle>
      <p style={{ margin: '-4px 0 14px', font: `400 13px/1.55 ${FONT}`, color: TEXT_MUTED }}>Assign existing Rules to your new campaigns. This doesn't create or change a Rule.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <span style={{ position: 'relative', flex: '1 1 220px', maxWidth: 320, display: 'flex' }}>
          <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}><SearchIcon /></span>
          <input
            className="cc-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or type" aria-label="Search Rules"
            style={{ ...FIELD, width: '100%', padding: '7px 8px 7px 30px' }}
          />
        </span>
        <select className="cc-input" aria-label="Rule type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as RuleType | 'all')} style={FIELD}>
          <option value="all">All types</option>
          {RULE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="cc-input" aria-label="Rule status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Active' | 'Inactive')} style={FIELD}>
          <option value="all">Status: all</option>
          <option value="Active">Status: active</option>
          <option value="Inactive">Status: inactive</option>
        </select>
        <select className="cc-input" aria-label="Campaign scope" value={scopeFilter} onChange={(e) => setScopeFilter(e.target.value as RuleScope | 'all')} style={FIELD}>
          <option value="all">Scope: all</option>
          <option value="Campaign">Scope: campaign</option>
          <option value="Ad group">Scope: ad group</option>
          <option value="Account">Scope: account</option>
        </select>
        {filterCount > 0 && <TextButton onClick={() => { setQuery(''); setTypeFilter('all'); setStatusFilter('all'); setScopeFilter('all'); }}>Clear filters</TextButton>}
      </div>

      <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
        {visible.map((r) => (
          <RuleRow key={r.id} rule={r} selected={draft.ruleIds.includes(r.id)} reason={ruleIncompatibility(r, marketplace)} onToggle={() => toggleRule(r.id)} />
        ))}
        {visible.length === 0 && <div style={{ padding: '24px 14px', textAlign: 'center', font: `400 13px/1.5 ${FONT}`, color: TEXT_MUTED }}>No Rules match these filters.</div>}
      </div>

      {selectedRules.length === 0 ? (
        <p style={{ margin: '14px 0 0', font: `400 12.5px/1.5 ${FONT}`, color: TEXT_FAINT }}>No Rules selected. Rules are optional, and your campaigns will be created without any automation.</p>
      ) : (
        <div style={{ marginTop: 20 }}>
          <div style={{ font: `600 13px/1.3 ${FONT}`, color: TEXT_PRIMARY, marginBottom: 8 }}>Apply selected Rules to:</div>
          <div role="radiogroup" aria-label="Apply selected Rules to" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {([['all', 'All campaigns'], ['selected', 'Selected campaigns']] as const).map(([val, label]) => (
              <button
                key={val} type="button" role="radio" aria-checked={draft.ruleScope === val} onClick={() => onChange({ ruleScope: val })}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: 0, border: 'none', background: 'none', cursor: 'pointer', font: `500 13px/1.3 ${FONT}`, color: TEXT_PRIMARY }}
              ><Radio checked={draft.ruleScope === val} /> {label}</button>
            ))}
          </div>

          {draft.ruleScope === 'selected' && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', gap: 14, marginBottom: 6, font: `400 12px/1.4 ${FONT}`, color: TEXT_MUTED }}>
                <span className="cc-num">{appliedCount} of {campaigns.length} selected</span>
                <TextButton onClick={() => onChange({ ruleCampaignIds: campaigns.map((c) => c.id) })}>Select all</TextButton>
                <TextButton onClick={() => onChange({ ruleCampaignIds: [] })}>Clear</TextButton>
              </div>
              <div className="cc-scroll" style={{ maxHeight: 220, overflow: 'auto', border: `1px solid ${BORDER}`, borderRadius: 8 }}>
                {campaigns.map((c) => {
                  const on = draft.ruleCampaignIds.includes(c.id);
                  return (
                    <button
                      key={c.id} type="button" role="checkbox" aria-checked={on} onClick={() => toggleCampaign(c.id)} className="cc-row"
                      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 12px', border: 'none', borderBottom: `1px solid ${HAIR}`, background: 'transparent', cursor: 'pointer', textAlign: 'left', font: `400 13px/1.4 ${FONT}`, color: TEXT_PRIMARY }}
                    ><Checkbox checked={on} size={16} /> {c.name}</button>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginTop: 22 }}>
            <div style={{ font: `600 13px/1.3 ${FONT}`, color: TEXT_PRIMARY, marginBottom: 6 }}>{selectedRules.length} Rule{selectedRules.length === 1 ? '' : 's'} selected</div>
            {selectedRules.map((r) => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderBottom: `1px solid ${HAIR}` }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ font: `500 13px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>{r.name}</div>
                  <div className="cc-num" style={{ font: `400 12px/1.4 ${FONT}`, color: appliedCount === 0 ? WARN : TEXT_MUTED }}>
                    Applied to: {appliedCount} campaign{appliedCount === 1 ? '' : 's'}{appliedCount === 0 ? '. Choose campaigns above.' : ''}
                  </div>
                </div>
                <button
                  type="button" aria-label={`Remove ${r.name}`} title={`Remove ${r.name}`} onClick={() => toggleRule(r.id)} className="cc-btn cc-ghost"
                  style={{ width: 24, height: 24, padding: 0, border: 'none', background: 'transparent', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}
                ><svg width={10} height={10} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke={TEXT_MUTED} strokeWidth="1.8" strokeLinecap="round" /></svg></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 12, font: `400 12.5px/1.5 ${FONT}`, color: TEXT_MUTED }}>
        <span>Want to create or modify a Rule? Rules are created and edited in Rules, not here.</span>
        <TextButton onClick={() => { /* mock: no navigation */ }}>Manage Rules</TextButton>
      </div>
    </Panel>
  );
}
