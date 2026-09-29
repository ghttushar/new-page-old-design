import { useState } from 'react';
import { createPortal } from 'react-dom';
import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
import { CcAdGroup, CcDraft, CcGeneratedCampaign, CcProduct, nextCcId, selectedProducts } from '../campaign-creator.types';
import styles from '../campaign-creator.module.scss';

const EXAMPLE_PROMPTS = [
  'Separate Exact and Phrase campaigns.',
  'Keep Broad and Product Targeting together.',
  'Create one Auto campaign per product.',
  'Keep all products separate.',
];

function buildJivaTree(products: CcProduct[], draft: CcDraft): CcGeneratedCampaign[] {
  const hasAuto = draft.targetingStrategies.includes('automatic');
  const manual = draft.targetingStrategies.filter((s) => s !== 'automatic');
  const campaigns: CcGeneratedCampaign[] = [];
  const acos = Number(draft.targetAcos) || 25;
  const budget = Number(draft.dailyBudget) || 0;

  products.forEach((p) => {
    const groups: CcAdGroup[] = [];
    if (hasAuto) {
      groups.push({ id: nextCcId('ag'), name: 'Auto Ad Group', productIds: [p.id], targets: [{ id: nextCcId('t'), label: 'Automatic targeting', matchType: 'Auto', bid: acos / 10, source: 'platform' }] });
      campaigns.push({ id: nextCcId('camp'), name: `${p.name} — Auto`, kind: 'auto', productIds: [p.id], adGroups: groups.slice(-1), dailyBudget: 0, ruleIds: [] });
    }
    const exactPhrase = manual.filter((m) => m === 'exact' || m === 'phrase');
    const broadProduct = manual.filter((m) => m === 'broad' || m === 'product' || m === 'competitor' || m === 'brand' || m === 'category');
    exactPhrase.forEach((m) => {
      campaigns.push({
        id: nextCcId('camp'), name: `${p.name} — ${m === 'exact' ? 'Exact' : 'Phrase'}`, kind: 'manual', productIds: [p.id],
        adGroups: [{ id: nextCcId('ag'), name: 'Ad Group', productIds: [p.id], targets: [{ id: nextCcId('t'), label: `${m} keyword`, matchType: m, bid: acos / 15, source: 'anarix' }] }],
        dailyBudget: 0, ruleIds: [],
      });
    });
    if (broadProduct.length) {
      campaigns.push({
        id: nextCcId('camp'), name: `${p.name} — Broad + Product Targeting`, kind: 'manual', productIds: [p.id],
        adGroups: [{ id: nextCcId('ag'), name: 'Ad Group', productIds: [p.id], targets: broadProduct.map((m) => ({ id: nextCcId('t'), label: `${m} target`, matchType: m, bid: acos / 15, source: 'anarix' as const })) }],
        dailyBudget: 0, ruleIds: [],
      });
    }
  });

  const equalShare = campaigns.length ? Math.round((budget / campaigns.length) * 100) / 100 : 0;
  campaigns.forEach((c) => { c.dailyBudget = equalShare; });
  return campaigns;
}

export function JivaCustomDrawer({ draft, onAccept, onClose }: { draft: CcDraft; onAccept: (tree: CcGeneratedCampaign[], prompt: string) => void; onClose: () => void }) {
  const [prompt, setPrompt] = useState('');
  const [generated, setGenerated] = useState<CcGeneratedCampaign[] | null>(null);
  const products = selectedProducts(draft);

  function generate() {
    setGenerated(buildJivaTree(products, draft));
  }

  return createPortal(
    <div className={styles.jivaBackdrop} onMouseDown={onClose}>
      <div className={styles.jivaDrawer} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.jivaHeader}>
          <DiamondMascot size={26} />
          <div>
            <div className={styles.jivaHeaderTitle}>Build your campaign structure with Jiva</div>
            <div className={styles.jivaHeaderSubtitle}>Describe how you want your campaigns organized.</div>
          </div>
          <button type="button" className={styles.jivaCloseButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.jivaBody}>
          {!generated ? (
            <>
              <textarea
                className={styles.jivaTextarea}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Keep all products separate. Create one Auto campaign per product. Put Exact and Phrase in separate manual campaigns. Keep Broad and Product Targeting together."
                rows={5}
              />
              <div className={styles.jivaExampleRow}>
                {EXAMPLE_PROMPTS.map((ex) => (
                  <button key={ex} type="button" className={styles.jivaExampleChip} onClick={() => setPrompt((p) => (p ? `${p} ${ex}` : ex))}>{ex}</button>
                ))}
              </div>
              <button type="button" className={styles.jivaGenerateButton} disabled={!prompt.trim()} onClick={generate}>Ask Jiva →</button>
            </>
          ) : (
            <>
              <div className={styles.jivaResponseHeader}>
                <DiamondMascot size={18} /> Jiva Recommendation
              </div>
              <div className={styles.jivaResponseNote}>Product-level campaign separation: Enabled</div>
              <div className={styles.jivaTreeList}>
                {products.map((p) => {
                  const productCampaigns = generated.filter((c) => c.productIds.includes(p.id));
                  return (
                    <div key={p.id} className={styles.jivaTreeProduct}>
                      <div className={styles.jivaTreeProductName}>{p.name}</div>
                      {productCampaigns.map((c) => <div key={c.id} className={styles.jivaTreeCampaign}>├── {c.name}</div>)}
                    </div>
                  );
                })}
              </div>
              <div className={styles.jivaActionRow}>
                <button type="button" className={styles.jivaSecondaryButton} onClick={() => setGenerated(null)}>Ask Jiva again</button>
                <button type="button" className={styles.jivaSecondaryButton} onClick={() => setGenerated(null)}>Modify</button>
                <button type="button" className={styles.jivaGenerateButton} onClick={() => onAccept(generated, prompt)}>Use this structure</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
