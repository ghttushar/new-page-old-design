import { useMemo, useState } from 'react';
import MarketplaceLogo from '../../marketplace-logo';
import { CcCheckboxRow, CcPill, CcSection, CcTextInput } from '../campaign-creator-shared-ui';
import { ArrowRightIcon, MegaphoneIcon } from '../campaign-creator-icons';
import {
  CcDraft, CcGeneratedCampaign, CcStepId, CcTargetSource, MOCK_RULES_LIST, STRUCTURE_CATALOG, generateCampaigns, selectedProducts, structureCounts, targetTotal, totalAllocatedBudget,
} from '../campaign-creator.types';
import styles from '../campaign-creator.module.scss';

const OBJECTIVE_LABEL: Record<string, string> = { 'grow-sales': 'Grow Sales', 'improve-efficiency': 'Improve Efficiency', 'launch-discover': 'Launch & Discover' };

function sourceTone(source: CcTargetSource): 'purple' | 'default' | 'green' {
  if (source === 'anarix') return 'purple';
  if (source === 'platform') return 'default';
  return 'green';
}
function sourceLabel(source: CcTargetSource): string {
  if (source === 'anarix') return 'Anarix';
  if (source === 'platform') return 'Platform';
  return 'Custom';
}
function biddingLabel(kind: 'auto' | 'manual'): string {
  return kind === 'auto' ? 'Dynamic — down only' : 'Dynamic — up & down';
}

function CampaignRow({ campaign, onBudgetChange, onOpenTargeting }: { campaign: CcGeneratedCampaign; onBudgetChange: (v: string) => void; onOpenTargeting: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.previewCampaignBlock}>
      <div className={styles.previewCampaignRow}>
        <button type="button" className={styles.treeToggle} onClick={() => setOpen((v) => !v)}>{open ? '▾' : '▸'}</button>
        <span className={styles.previewCampaignName}>{campaign.name}</span>
        <CcPill tone={campaign.kind === 'auto' ? 'purple' : 'default'}>{campaign.kind}</CcPill>
        <span className={styles.previewCampaignTargets}>{campaign.adGroups.reduce((s, ag) => s + ag.targets.length, 0)} targets</span>
        <CcTextInput value={String(campaign.dailyBudget)} onChange={onBudgetChange} type="number" prefix="$" />
        <button type="button" className={styles.toolbarLink} onClick={onOpenTargeting}>Edit targeting</button>
      </div>
      {open && (
        <div className={styles.previewAdGroupList}>
          {campaign.adGroups.map((ag) => (
            <div key={ag.id} className={styles.previewAdGroup}>
              <div className={styles.previewAdGroupName}>└── {ag.name}</div>
              {ag.targets.slice(0, 4).map((t) => (
                <div key={t.id} className={styles.previewTargetRow}>
                  <span>{t.label}</span>
                  <span className={styles.previewTargetMeta}>{t.matchType}</span>
                  <span className={styles.previewTargetMeta}>${t.bid.toFixed(2)}</span>
                  <CcPill tone={sourceTone(t.source)}>{sourceLabel(t.source)}</CcPill>
                </div>
              ))}
              {ag.targets.length > 4 && <div className={styles.previewTargetMore}>+ {ag.targets.length - 4} more</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function StepPreview({
  draft, update, onEdit, errors,
}: { draft: CcDraft; update: (patch: Partial<CcDraft>) => void; onEdit: (step: CcStepId) => void; errors: string[] }) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const products = selectedProducts(draft);
  const campaigns = useMemo(() => generateCampaigns(draft, products), [draft, products]);
  const counts = draft.structure ? structureCounts(draft.structure, draft, products) : { campaigns: 0, adGroups: 0, targets: 0 };
  const allocated = totalAllocatedBudget(campaigns);
  const totalBudget = Number(draft.dailyBudget) || 0;
  const balanced = Math.abs(allocated - totalBudget) < 1;
  const structureTitle = STRUCTURE_CATALOG.find((s) => s.id === draft.structure)?.title ?? '—';
  const hasAuto = draft.targetingStrategies.includes('automatic');
  const hasManual = draft.targetingStrategies.some((s) => s !== 'automatic');
  const campaignGroupName = `${OBJECTIVE_LABEL[draft.objective ?? 'grow-sales']} — ${[hasAuto && 'Auto', hasManual && 'Manual'].filter(Boolean).join(' + ') || 'Campaign'}`;
  const startDate = useMemo(() => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), []);

  function setBudget(campaignId: string, value: string) {
    const n = Number(value) || 0;
    update({ campaignBudgetOverrides: { ...draft.campaignBudgetOverrides, [campaignId]: n } });
  }

  const validations = [
    { label: 'Products eligible', ok: products.length > 0 },
    { label: 'Budget valid', ok: totalBudget > 0 },
    { label: 'Targeting valid', ok: draft.targetingStrategies.length > 0 },
    { label: 'Campaign limits valid', ok: !draft.structure || counts.campaigns <= 40 },
    { label: 'Budget allocation balanced', ok: balanced },
    { label: 'Rules compatible', ok: draft.selectedRuleIds.every((id) => MOCK_RULES_LIST.find((r) => r.id === id)?.compatible) },
  ];

  return (
    <>
      {errors.length > 0 && (
        <div className={styles.errorBanner}>
          <strong>Fix the following before creating these campaigns:</strong>
          <ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}

      <div className={styles.overviewCard}>
        <div className={styles.overviewHeader}>
          <span className={styles.overviewIcon}><MegaphoneIcon size={20} /></span>
          <div className={styles.overviewTitleBlock}>
            <div className={styles.overviewTitleRow}>
              <span className={styles.overviewTitle}>{campaignGroupName}</span>
              <CcPill>Draft</CcPill>
            </div>
            <div className={styles.overviewDescription}>{OBJECTIVE_LABEL[draft.objective ?? 'grow-sales']} campaigns for your selected products, generated with a {structureTitle.toLowerCase()} structure.</div>
          </div>
          <button type="button" className={styles.editLink} onClick={() => onEdit('structure')}>Edit</button>
        </div>
        <div className={styles.overviewMetaGrid}>
          <div><div className={styles.overviewMetaLabel}>Marketplace</div><div className={styles.overviewMetaValue}><MarketplaceLogo marketplace={draft.marketplace ?? undefined} /> {draft.marketplace === 'walmart' ? 'Walmart' : 'Amazon US'}</div></div>
          <div><div className={styles.overviewMetaLabel}>Products</div><div className={styles.overviewMetaValue}>{products.length} selected</div></div>
          <div><div className={styles.overviewMetaLabel}>Campaigns</div><div className={styles.overviewMetaValue}>{counts.campaigns}</div></div>
          <div><div className={styles.overviewMetaLabel}>Ad groups</div><div className={styles.overviewMetaValue}>{counts.adGroups}</div></div>
          <div><div className={styles.overviewMetaLabel}>Targeting type</div><div className={styles.overviewMetaValue}>{structureTitle}</div></div>
          <div><div className={styles.overviewMetaLabel}>Start date</div><div className={styles.overviewMetaValue}>{startDate}</div></div>
          <div><div className={styles.overviewMetaLabel}>End date</div><div className={styles.overviewMetaValue}>No end date</div></div>
        </div>
      </div>

      <CcSection title={`Products (${products.length})`} trailing={<button type="button" className={styles.editLink} onClick={() => onEdit('products')}>Edit</button>}>
        <div className={styles.previewTable}>
          <div className={styles.previewProductsTableHeader}><span>#</span><span>Product name</span><span>Campaigns</span><span>Ad groups</span><span>Targeting</span></div>
          {products.map((p, i) => {
            const productCampaigns = campaigns.filter((c) => c.productIds.includes(p.id));
            return (
              <div key={p.id} className={styles.previewProductsTableRow}>
                <span>{i + 1}</span>
                <span>{p.name}</span>
                <span>{productCampaigns.length || counts.campaigns}</span>
                <span>{productCampaigns.reduce((s, c) => s + c.adGroups.length, 0) || counts.adGroups}</span>
                <span>{[hasAuto && 'Auto', hasManual && 'Manual'].filter(Boolean).join(' + ')}</span>
              </div>
            );
          })}
        </div>
      </CcSection>

      <CcSection title={`Campaign structure (${campaigns.length})`} trailing={<button type="button" className={styles.editLink} onClick={() => onEdit('structure')}>Edit</button>}>
        <div className={styles.previewTable}>
          <div className={styles.previewStructureTableHeader}><span>#</span><span>Campaign name</span><span>Type</span><span>Products</span><span>Ad groups</span><span>Bidding</span><span>Budget (daily)</span></div>
          {campaigns.map((c, i) => (
            <div key={c.id} className={styles.previewStructureTableRow}>
              <span>{i + 1}</span>
              <span>{c.name}</span>
              <span><CcPill tone={c.kind === 'auto' ? 'purple' : 'default'}>{c.kind === 'auto' ? 'Auto' : 'Manual'}</CcPill></span>
              <span>All ({c.productIds.length})</span>
              <span>{c.adGroups.length}</span>
              <span>{biddingLabel(c.kind)}</span>
              <span>${c.dailyBudget.toFixed(2)}</span>
            </div>
          ))}
          {campaigns.length === 0 && <div className={styles.productEmpty}>No campaigns generated yet — choose a structure to see the preview.</div>}
        </div>

        <button type="button" className={styles.toolbarLink} onClick={() => setAdvancedOpen((v) => !v)}>{advancedOpen ? 'Hide advanced editing' : 'Show advanced editing (budgets, targeting, rules, validation)'}</button>

        {advancedOpen && (
          <>
            <div className={styles.previewCampaignList}>
              {campaigns.map((c) => <CampaignRow key={c.id} campaign={c} onBudgetChange={(v) => setBudget(c.id, v)} onOpenTargeting={() => onEdit('targeting')} />)}
            </div>
            <div className={styles.budgetAllocationFooter}>
              <span>Allocated: ${allocated.toFixed(2)}</span>
              <span>Total: ${totalBudget.toFixed(2)}</span>
              {balanced ? <CcPill tone="green">Balanced</CcPill> : <CcPill tone="red">Not balanced</CcPill>}
            </div>

            {draft.selectedRuleIds.length > 0 && (
              <div className={styles.ruleSummaryList}>
                <div className={styles.ruleSummaryHeading}>Rules</div>
                {draft.selectedRuleIds.map((id) => {
                  const r = MOCK_RULES_LIST.find((x) => x.id === id);
                  if (!r) return null;
                  const count = draft.rulesApplyTo === 'all' ? campaigns.length : draft.selectedCampaignIdsForRules.length;
                  return <div key={id} className={styles.ruleSummaryRow}><span>{r.name}</span><span>Applied to {count} campaigns</span></div>;
                })}
              </div>
            )}

            <CcCheckboxRow
              checked={draft.aiManagementEnabled}
              onChange={(aiManagementEnabled) => update({ aiManagementEnabled })}
              label="Enable AI Management"
              description="Anarix will manage these campaigns using the selected AI management configuration once they're live."
            />

            <div className={styles.validationList}>
              {validations.map((v) => (
                <div key={v.label} className={styles.validationRow}>
                  <span className={v.ok ? styles.validationOk : styles.validationFail}>{v.ok ? '✓' : '✕'}</span>
                  <span>{v.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CcSection>
    </>
  );
}
