import { ReactNode, useState } from 'react';
import { SparkleIcon } from '@/app/components/signals/alerts/icons';
import { CcPill, CcSection, CcWarningBanner, CcWhyExplain } from '../campaign-creator-shared-ui';
import { ArrowRightIcon, ChartUpIcon } from '../campaign-creator-icons';
import {
  CAMPAIGN_LIMIT, CcDraft, CcGeneratedCampaign, CcStructureId, STRUCTURE_CATALOG, isStructureAvailable,
  recommendStructure, selectedProducts, structureCounts, structureRecommendationReason,
} from '../campaign-creator.types';
import { JivaCustomDrawer } from './jiva-custom-drawer';
import styles from '../campaign-creator.module.scss';

interface TreeRow { label: string; leaf?: string; leaves?: string[] }

function TreeNode({ children, variant }: { children: ReactNode; variant?: 'root' | 'leaf' }) {
  const cls = variant === 'root' ? `${styles.treeNode} ${styles.treeNodeRoot}` : variant === 'leaf' ? `${styles.treeNode} ${styles.treeNodeLeaf}` : styles.treeNode;
  return <span className={cls}>{children}</span>;
}

function TreeDiagram({ roots, rows, compact }: { roots: string[]; rows: TreeRow[]; compact?: boolean }) {
  return (
    <div className={`${styles.treeDiagram} ${compact ? styles.treeDiagramCompact : ''}`}>
      <div className={styles.treeRootCol}>
        {roots.map((r) => <TreeNode key={r} variant="root">{r}</TreeNode>)}
      </div>
      <div className={styles.treeBranchCol}>
        {rows.map((row) => (
          <div key={row.label} className={styles.treeBranchRow}>
            <TreeNode>{row.label}</TreeNode>
            {row.leaf && (
              <>
                <span className={styles.treeArrowLine} />
                <TreeNode variant="leaf">{row.leaf}</TreeNode>
              </>
            )}
            {row.leaves && (
              <div className={styles.treeInlineLeafGroup}>
                {row.leaves.map((l) => <TreeNode key={l} variant="leaf">{l}</TreeNode>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const CHAIN_ROWS: Record<'targeting-type' | 'product-single-auto' | 'product-multiple-auto', TreeRow[]> = {
  'targeting-type': [
    { label: 'Auto Campaign', leaf: 'Auto Ad Group' },
    { label: 'Manual — Exact', leaf: 'Ad Group' },
    { label: 'Manual — Phrase', leaf: 'Ad Group' },
    { label: 'Manual — Broad', leaf: 'Ad Group' },
    { label: 'Manual — Product', leaf: 'Ad Group' },
  ],
  'product-single-auto': [
    { label: 'Auto Campaign', leaf: 'Auto Ad Group' },
    { label: 'Manual — Exact', leaf: 'Ad Group' },
    { label: 'Manual — Phrase', leaf: 'Ad Group' },
    { label: 'Manual — Broad', leaf: 'Ad Group' },
    { label: 'Manual — Product', leaf: 'Ad Group' },
  ],
  'product-multiple-auto': [
    { label: 'Auto — Close Match', leaf: 'Ad Group' },
    { label: 'Auto — Loose Match', leaf: 'Ad Group' },
    { label: 'Manual — Exact', leaf: 'Ad Group' },
    { label: 'Manual — Phrase', leaf: 'Ad Group' },
    { label: 'Manual — Broad', leaf: 'Ad Group' },
    { label: 'Manual — Product', leaf: 'Ad Group' },
  ],
};

const FANOUT_ROWS: TreeRow[] = [{ label: 'Auto' }, { label: 'Exact' }, { label: 'Phrase' }, { label: 'Broad' }, { label: 'Product' }];

function StructureDiagram({ id }: { id: Exclude<CcStructureId, 'custom'> }) {
  if (id === 'consolidated') {
    return (
      <TreeDiagram
        roots={['SP Campaigns']}
        rows={[
          { label: 'Auto Campaign', leaf: 'Auto Ad Group' },
          { label: 'Manual Campaign', leaves: ['Exact', 'Phrase', 'Broad', 'Product'] },
        ]}
      />
    );
  }
  if (id === 'product-targeting') {
    return (
      <div className={styles.treeMultiProduct}>
        <TreeDiagram roots={['Product A']} rows={FANOUT_ROWS} compact />
        <TreeDiagram roots={['Product B']} rows={FANOUT_ROWS} compact />
        <div className={styles.treeEllipsis}>⋮</div>
      </div>
    );
  }
  return <TreeDiagram roots={['Product A']} rows={CHAIN_ROWS[id]} />;
}

export function StepStructure({ draft, update, showErrors }: { draft: CcDraft; update: (patch: Partial<CcDraft>) => void; showErrors: boolean }) {
  const [jivaOpen, setJivaOpen] = useState(false);
  const products = selectedProducts(draft);
  const recommended = recommendStructure(draft, products);

  function selectStructure(id: CcStructureId) {
    if (id === 'custom') { setJivaOpen(true); return; }
    update({ structure: id });
  }

  function acceptJiva(tree: CcGeneratedCampaign[], prompt: string) {
    update({ structure: 'custom', jivaTree: tree, jivaPrompt: prompt });
    setJivaOpen(false);
  }

  const activeCounts = draft.structure && draft.structure !== 'custom' ? structureCounts(draft.structure, draft, products) : null;

  return (
    <>
      <div className={styles.setupHeader2}>
        <div className={styles.setupEyebrow}>Campaign Creator</div>
        <div className={styles.setupHeadline}>Choose your campaign structure</div>
        <div className={styles.setupHeadlineSub}>Select how your campaigns and ad groups will be organized. We&apos;ll recommend the best structure based on your products, targeting strategies and budget.</div>
      </div>

      <CcSection title="Anarix recommendation">
        <div className={styles.recommendedBanner}>
          <div className={styles.recommendedBannerTitle}><SparkleIcon size={13} color="#77469b" /> Recommended: {STRUCTURE_CATALOG.find((s) => s.id === recommended)?.title}</div>
          <CcWhyExplain>{structureRecommendationReason(recommended, draft, products)}</CcWhyExplain>
        </div>
      </CcSection>

      <div className={styles.structureOptionsNote}>Structure options — if a structure isn&apos;t supported for your current configuration, it&apos;s disabled rather than selectable.</div>

      <div className={styles.structureGrid}>
        {STRUCTURE_CATALOG.map((s) => {
          if (s.id === 'custom') {
            return (
              <div key="custom" className={`${styles.structureCard} ${styles.structureCardCustom} ${draft.structure === 'custom' ? styles.structureCardActive : ''}`}>
                <div className={styles.structureCardHeader}>
                  <span className={`${styles.setupRadio} ${draft.structure === 'custom' ? styles.setupRadioActive : ''}`}>{draft.structure === 'custom' && <span className={styles.setupRadioDot} />}</span>
                  <div className={styles.structureCardTitle}>Custom with Jiva</div>
                </div>
                <div className={styles.structureCardUseCase}>Describe how you want your campaigns organized and Jiva will generate the structure.</div>
                {draft.structure === 'custom' && draft.jivaTree && (
                  <div className={styles.structureCardCounts}>
                    <CcPill tone="purple">{draft.jivaTree.length} campaigns</CcPill>
                  </div>
                )}
                <button type="button" className={styles.jivaAskButton} onClick={() => selectStructure('custom')}>
                  <SparkleIcon size={12} color="#77469b" />
                  {draft.structure === 'custom' ? 'Edit with Jiva' : 'Ask Jiva to create a custom structure'}
                  <ArrowRightIcon size={12} color="#77469b" />
                </button>
                <div className={styles.jivaExamplePillRow}>
                  <span className={styles.jivaExamplePill}>e.g. Separate Exact and Phrase campaigns</span>
                  <span className={styles.jivaExamplePill}>One Auto campaign per product</span>
                </div>
              </div>
            );
          }
          const available = isStructureAvailable(s.id, draft, products);
          const counts = structureCounts(s.id, draft, products);
          const isRecommended = s.id === recommended;
          const isActive = draft.structure === s.id;
          return (
            <button
              key={s.id}
              type="button"
              disabled={!available}
              onClick={() => available && selectStructure(s.id)}
              className={`${styles.structureCard} ${isActive ? styles.structureCardActive : ''} ${!available ? styles.choiceCardDisabled : ''}`}
            >
              <div className={styles.structureCardHeader}>
                <span className={`${styles.setupRadio} ${isActive ? styles.setupRadioActive : ''}`}>{isActive && <span className={styles.setupRadioDot} />}</span>
                <div className={styles.structureCardTitle}>{s.title}</div>
                {isRecommended && available && <CcPill tone="purple">Recommended</CcPill>}
              </div>
              <div className={styles.structureCardUseCase}>{s.useCase}</div>
              <StructureDiagram id={s.id} />
              {available ? (
                <div className={styles.structureStatRow}>
                  <div className={styles.structureStat}>
                    <div className={styles.structureStatValue}>{counts.campaigns}</div>
                    <div className={styles.structureStatLabel}>Campaigns</div>
                  </div>
                  <div className={styles.structureStat}>
                    <div className={styles.structureStatValue}>{counts.adGroups}</div>
                    <div className={styles.structureStatLabel}>Ad groups</div>
                  </div>
                </div>
              ) : (
                <div className={styles.structureUnavailableNote}>
                  Unavailable — would create {counts.campaigns} campaigns, exceeding the {CAMPAIGN_LIMIT}-campaign account limit.
                </div>
              )}
            </button>
          );
        })}
      </div>

      {draft.structure && !isStructureAvailable(draft.structure, draft, products) && (
        <CcWarningBanner title="Campaign limit exceeded" tone="error">
          This structure will create {structureCounts(draft.structure, draft, products).campaigns} campaigns, but only {CAMPAIGN_LIMIT} are available for this account.
          <br />Try a more consolidated structure, reduce the number of selected products, or use Custom Structure with Jiva.
        </CcWarningBanner>
      )}

      {showErrors && !draft.structure && <div className={styles.inlineError}>Select a campaign structure to continue.</div>}

      <div className={styles.configImpactBar}>
        <span className={styles.configImpactIcon}><ChartUpIcon size={18} color="#77469b" /></span>
        <div className={styles.configImpactTitleBlock}>
          <div className={styles.configImpactTitle}>Configuration impact</div>
          <div className={styles.configImpactSubtitle}>Updates based on the selected structure.</div>
        </div>
        <div className={styles.configImpactStats}>
          <div className={styles.configImpactStat}>
            <div className={styles.configImpactStatValue}>{products.length}</div>
            <div className={styles.configImpactStatLabel}>Products selected</div>
          </div>
          <div className={styles.configImpactStat}>
            <div className={styles.configImpactStatValue}>{draft.targetingStrategies.length}</div>
            <div className={styles.configImpactStatLabel}>Targeting strategies</div>
          </div>
          <div className={styles.configImpactStat}>
            <div className={styles.configImpactStatValue}>{activeCounts ? activeCounts.campaigns : '—'}</div>
            <div className={styles.configImpactStatLabel}>Estimated campaigns</div>
          </div>
          <div className={styles.configImpactStat}>
            <div className={styles.configImpactStatValue}>{activeCounts ? activeCounts.adGroups : '—'}</div>
            <div className={styles.configImpactStatLabel}>Estimated ad groups</div>
          </div>
        </div>
      </div>

      {jivaOpen && <JivaCustomDrawer draft={draft} onAccept={acceptJiva} onClose={() => setJivaOpen(false)} />}
    </>
  );
}
