import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SparkleIcon } from '@/app/components/signals/alerts/icons';
import { CcPill, CcSection, CcTextInput } from '../campaign-creator-shared-ui';
import { CcDraft, MOCK_RULES_LIST, generateCampaigns, recommendedRules, selectedProducts } from '../campaign-creator.types';
import styles from '../campaign-creator.module.scss';

export function StepRules({ draft, update }: { draft: CcDraft; update: (patch: Partial<CcDraft>) => void }) {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const products = selectedProducts(draft);
  const campaigns = useMemo(() => generateCampaigns(draft, products), [draft, products]);
  const recommended = recommendedRules(draft, products);

  const filtered = MOCK_RULES_LIST.filter((r) => r.name.toLowerCase().includes(search.trim().toLowerCase()) || r.type.toLowerCase().includes(search.trim().toLowerCase()));

  function toggle(id: string) {
    const has = draft.selectedRuleIds.includes(id);
    update({ selectedRuleIds: has ? draft.selectedRuleIds.filter((x) => x !== id) : [...draft.selectedRuleIds, id] });
  }

  return (
    <>
      <CcSection title="Automation rules" description="Assign existing Rules to your new campaigns. This step does not create or modify Rules — it only assigns campaigns to rules that already exist in your account.">
        {recommended.length > 0 && (
          <div className={styles.recommendedRuleBanner}>
            <div className={styles.recommendedBannerTitle}><SparkleIcon size={13} color="#77469b" /> Recommended for your campaigns</div>
            {recommended.map((r) => (
              <div key={r.id} className={styles.recommendedRuleRow}>
                <div>
                  <div className={styles.ruleName}>{r.name}</div>
                  <div className={styles.ruleDescriptionSmall}>Recommended because your selection includes {r.recommendedReason}.</div>
                </div>
                <button type="button" className={styles.jivaGenerateButton} onClick={() => !draft.selectedRuleIds.includes(r.id) && toggle(r.id)}>
                  {draft.selectedRuleIds.includes(r.id) ? 'Selected' : 'Select'}
                </button>
              </div>
            ))}
          </div>
        )}

        <CcTextInput value={search} onChange={setSearch} placeholder="Search rules by name or type..." />

        <div className={styles.ruleList}>
          {filtered.map((r) => {
            const checked = draft.selectedRuleIds.includes(r.id);
            const expanded = expandedId === r.id;
            return (
              <div key={r.id} className={`${styles.ruleCard} ${!r.compatible ? styles.ruleCardIncompatible : ''}`}>
                <label className={styles.ruleCardMain}>
                  <input type="checkbox" checked={checked} disabled={!r.compatible} onChange={() => toggle(r.id)} />
                  <div className={styles.ruleCardBody}>
                    <div className={styles.ruleCardTitleRow}>
                      <span className={styles.ruleName}>{r.name}</span>
                      <CcPill tone="default">{r.type}</CcPill>
                      <CcPill tone={r.status === 'Active' ? 'green' : 'default'}>{r.status}</CcPill>
                    </div>
                    <div className={styles.ruleDescriptionSmall}>{r.description}</div>
                    {!r.compatible && <div className={styles.ruleIncompatibleNote}>Not available for the selected campaigns. {r.incompatibleReason}</div>}
                  </div>
                </label>
                <button type="button" className={styles.toolbarLink} onClick={() => setExpandedId(expanded ? null : r.id)}>{expanded ? 'Hide' : 'View Rule'}</button>
                {expanded && (
                  <div className={styles.ruleExpandedDetail}>
                    <div><strong>Conditions:</strong> {r.conditions}</div>
                    <div><strong>Actions:</strong> {r.actions}</div>
                    <div><strong>Scope:</strong> {r.scope}</div>
                    <div><strong>Currently assigned to:</strong> {r.assignedCampaigns} campaigns</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.manageRulesNote}>
          Want to create or modify a Rule? <Link to="/rules/agents" className={styles.manageRulesLink}>Go to Rules → Manage Rules</Link>
        </div>
      </CcSection>

      {draft.selectedRuleIds.length > 0 && (
        <CcSection title="Apply selected Rules to">
          <div className={styles.applyToRow}>
            <label className={styles.radioRow}>
              <input type="radio" checked={draft.rulesApplyTo === 'all'} onChange={() => update({ rulesApplyTo: 'all' })} /> All campaigns ({campaigns.length})
            </label>
            <label className={styles.radioRow}>
              <input type="radio" checked={draft.rulesApplyTo === 'selected'} onChange={() => update({ rulesApplyTo: 'selected' })} /> Selected campaigns
            </label>
          </div>
          {draft.rulesApplyTo === 'selected' && (
            <div className={styles.categoryList}>
              {campaigns.map((c) => (
                <label key={c.id} className={styles.categoryRow}>
                  <input
                    type="checkbox"
                    checked={draft.selectedCampaignIdsForRules.includes(c.id)}
                    onChange={(e) => update({ selectedCampaignIdsForRules: e.target.checked ? [...draft.selectedCampaignIdsForRules, c.id] : draft.selectedCampaignIdsForRules.filter((x) => x !== c.id) })}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          )}

          <div className={styles.ruleSummaryList}>
            <div className={styles.ruleSummaryHeading}>{draft.selectedRuleIds.length} Rule{draft.selectedRuleIds.length === 1 ? '' : 's'} selected</div>
            {draft.selectedRuleIds.map((id) => {
              const r = MOCK_RULES_LIST.find((x) => x.id === id);
              if (!r) return null;
              const count = draft.rulesApplyTo === 'all' ? campaigns.length : draft.selectedCampaignIdsForRules.length;
              return <div key={id} className={styles.ruleSummaryRow}><span>{r.name}</span><span>Applied to {count} campaign{count === 1 ? '' : 's'}</span></div>;
            })}
          </div>
        </CcSection>
      )}
    </>
  );
}
