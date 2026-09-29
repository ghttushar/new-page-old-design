import { SparkleIcon } from '@/app/components/signals/alerts/icons';
import { CcCheckboxCard, CcSection, CcStatRow, CcWhyExplain } from '../campaign-creator-shared-ui';
import { CcDraft, CcStrategyId, RECOMMENDED_STRATEGY_IDS, selectedProducts, strategiesFor, targetTotal } from '../campaign-creator.types';
import styles from '../campaign-creator.module.scss';

export function StepTargeting({ draft, update, showErrors }: { draft: CcDraft; update: (patch: Partial<CcDraft>) => void; showErrors: boolean }) {
  const products = selectedProducts(draft);
  const strategies = strategiesFor(draft.marketplace);
  const recommendedTitles = RECOMMENDED_STRATEGY_IDS.map((id) => strategies.find((s) => s.id === id)?.title).filter(Boolean);

  function toggle(id: CcStrategyId) {
    const has = draft.targetingStrategies.includes(id);
    update({ targetingStrategies: has ? draft.targetingStrategies.filter((x) => x !== id) : [...draft.targetingStrategies, id] });
  }

  const targets = targetTotal(draft, products);

  return (
    <>
      <CcSection title="Choose your targeting" description="Anarix recommends targeting strategies based on your products, goals, budget and historical performance.">
        <div className={styles.recommendedBanner}>
          <div className={styles.recommendedBannerTitle}><SparkleIcon size={13} color="#77469b" /> Recommended for your budget</div>
          <div className={styles.recommendedBannerPills}>
            {recommendedTitles.map((t) => <span key={t} className={styles.recommendedBannerPill}>{t}</span>)}
          </div>
          <CcWhyExplain>
            Your selected {products.length} product{products.length === 1 ? '' : 's'} have sufficient historical search and conversion data for keyword-based targeting, and your ${draft.dailyBudget || '—'}/day budget supports Automatic, Exact and Phrase targeting together.
          </CcWhyExplain>
        </div>
      </CcSection>

      <CcSection title="Select targeting strategies" description="You can choose one or more strategies. Available options depend on your marketplace and ad type.">
        <div className={styles.strategyGrid}>
          {strategies.map((s) => (
            <CcCheckboxCard
              key={s.id}
              checked={draft.targetingStrategies.includes(s.id)}
              onChange={() => toggle(s.id)}
              title={s.title}
              description={s.description}
              recommended={(RECOMMENDED_STRATEGY_IDS as string[]).includes(s.id)}
            />
          ))}
        </div>
        {showErrors && draft.targetingStrategies.length === 0 && <div className={styles.inlineError}>Select at least one targeting strategy.</div>}
      </CcSection>

      <CcSection title="Current configuration">
        <CcStatRow
          stats={[
            { label: 'Products', value: String(products.length) },
            { label: 'Targeting strategies', value: String(draft.targetingStrategies.length) },
            { label: 'Estimated targets', value: `~${targets}` },
          ]}
        />
      </CcSection>
    </>
  );
}
