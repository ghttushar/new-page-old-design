import { useEffect, useState } from 'react';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import { ExternalLinkIcon, InfoCircleIcon, WarningTriangleIcon } from '../campaign-creator-icons';
import { CcDraft, CcGeneratedCampaign, generateCampaigns, selectedProducts, structureCounts, targetTotal } from '../campaign-creator.types';
import styles from '../campaign-creator.module.scss';

type StageKey = 'validate' | 'campaigns' | 'adGroups' | 'productAds' | 'targeting' | 'rules' | 'ai';

interface Stage { key: StageKey; label: string; total: number; done: number; status: 'pending' | 'active' | 'done' | 'partial'; }

export function StepCreation({ draft, onRestart }: { draft: CcDraft; onRestart: () => void }) {
  const products = selectedProducts(draft);
  const campaigns = generateCampaigns(draft, products);
  const counts = draft.structure ? structureCounts(draft.structure, draft, products) : { campaigns: campaigns.length, adGroups: campaigns.length, targets: 0 };
  const targets = targetTotal(draft, products);
  const willPartiallyFail = counts.campaigns > 15;
  const failedCampaignCount = willPartiallyFail ? 1 : 0;

  const [stages, setStages] = useState<Stage[]>([
    { key: 'validate', label: 'Configuration validated', total: 1, done: 0, status: 'pending' },
    { key: 'campaigns', label: 'Campaigns created', total: counts.campaigns, done: 0, status: 'pending' },
    { key: 'adGroups', label: 'Ad groups created', total: counts.adGroups, done: 0, status: 'pending' },
    { key: 'productAds', label: 'Product ads created', total: counts.adGroups, done: 0, status: 'pending' },
    { key: 'targeting', label: 'Targeting created', total: targets, done: 0, status: 'pending' },
    { key: 'rules', label: 'Rule assignments', total: draft.selectedRuleIds.length, done: 0, status: 'pending' },
    { key: 'ai', label: 'AI management', total: draft.aiManagementEnabled ? 1 : 0, done: 0, status: 'pending' },
  ]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const order: StageKey[] = ['validate', 'campaigns', 'adGroups', 'productAds', 'targeting', 'rules', 'ai'];
      for (const key of order) {
        if (cancelled) return;
        setStages((prev) => prev.map((s) => (s.key === key ? { ...s, status: 'active' } : s)));
        const total = key === 'campaigns' ? counts.campaigns : key === 'adGroups' || key === 'productAds' ? counts.adGroups : key === 'targeting' ? targets : key === 'rules' ? draft.selectedRuleIds.length : 1;
        const steps = Math.max(1, Math.min(6, total));
        for (let i = 1; i <= steps; i += 1) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, 90));
          if (cancelled) return;
          const done = Math.round((total * i) / steps);
          setStages((prev) => prev.map((s) => (s.key === key ? { ...s, done } : s)));
        }
        const isPartial = key === 'campaigns' && willPartiallyFail;
        setStages((prev) => prev.map((s) => (s.key === key ? { ...s, done: isPartial ? total - failedCampaignCount : total, status: isPartial ? 'partial' : 'done' } : s)));
      }
      if (!cancelled) setFinished(true);
    }
    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!finished) {
    return (
      <div className={styles.creationScreen}>
        <div className={styles.creationTitle}>Creating your campaigns...</div>
        <div className={styles.creationStageList}>
          {stages.map((s) => (
            <div key={s.key} className={styles.creationStageRow}>
              <span className={s.status === 'done' ? styles.validationOk : s.status === 'partial' ? styles.creationPartialIcon : s.status === 'active' ? styles.creationActiveIcon : styles.creationPendingIcon}>
                {s.status === 'done' ? '✓' : s.status === 'partial' ? '⚠' : s.status === 'active' ? '●' : '○'}
              </span>
              <span className={styles.creationStageLabel}>{s.label}</span>
              {s.total > 0 && <span className={styles.creationStageCount}>{s.done}/{s.total}</span>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (willPartiallyFail) {
    return <PartialResult draft={draft} campaigns={campaigns} failedCount={failedCampaignCount} onRestart={onRestart} />;
  }
  return <SuccessResult draft={draft} campaigns={campaigns} onRestart={onRestart} />;
}

function SuccessResult({ draft, campaigns, onRestart }: { draft: CcDraft; campaigns: CcGeneratedCampaign[]; onRestart: () => void }) {
  const marketplaceName = draft.marketplace === 'walmart' ? 'Walmart' : 'Amazon';
  return (
    <div className={styles.successScreen}>
      <div className={styles.successIcon}>✓</div>
      <div className={styles.successTitle}>Campaign created successfully!</div>
      <div className={styles.successSubtitle}>Your campaign is being set up and may take a few minutes to reflect in {marketplaceName} Campaign Manager.</div>

      <div className={styles.infoCallout}>
        <span className={styles.infoCalloutIcon}><InfoCircleIcon size={20} /></span>
        <div>
          <div className={styles.infoCalloutTitle}>It might take some time</div>
          <div className={styles.infoCalloutBody}>The {campaigns.length} campaign{campaigns.length === 1 ? '' : 's'}, ad groups and targeting will usually appear in {marketplaceName} Campaign Manager within a few minutes. In some cases, it can take up to 15–30 minutes.</div>
        </div>
      </div>

      <div className={styles.footerButtonRow}>
        <PrimaryButton buttonText="Create another campaign" buttonFunction={onRestart} disabled={false} bgColor="#fff" textColor="#23272d" width="18rem" height="4rem" />
        <PrimaryButton
          buttonText="Go to Campaign Manager"
          buttonFunction={() => { window.location.href = '/advertising/campaign-manager'; }}
          disabled={false}
          bgColor="#77469b"
          width="20rem"
          height="4rem"
          isButtonIconRequired
          isEndIcon
          buttonIcon={<ExternalLinkIcon size={13} color="#fff" />}
        />
      </div>
    </div>
  );
}

function PartialResult({ draft, campaigns, failedCount, onRestart }: { draft: CcDraft; campaigns: CcGeneratedCampaign[]; failedCount: number; onRestart: () => void }) {
  const failed = campaigns.slice(0, failedCount);
  const created = campaigns.length - failedCount;
  return (
    <div className={styles.successScreen}>
      <div className={`${styles.successIcon} ${styles.successIconWarning}`}><WarningTriangleIcon size={28} color="#a8763f" /></div>
      <div className={styles.successTitle}>Campaign creation partially completed</div>
      <div className={styles.successSubtitle}>{created} of {campaigns.length} campaigns were created successfully. {failedCount} campaign{failedCount === 1 ? '' : 's'} could not be created.</div>

      <div className={styles.partialFailureTable}>
        <div className={styles.previewTableHeader}><span>Entity</span><span>Status</span><span>Reason</span><span>Recommended action</span></div>
        {failed.map((c) => (
          <div key={c.id} className={styles.previewTableRow}>
            <span>{c.name}</span>
            <span>Failed</span>
            <span>Campaign limit reached</span>
            <span>Use a more consolidated structure</span>
          </div>
        ))}
      </div>

      <div className={styles.footerButtonRow}>
        <PrimaryButton buttonText="Retry failed" buttonFunction={onRestart} disabled={false} bgColor="#fff" textColor="#23272d" width="16rem" height="4rem" />
        <PrimaryButton
          buttonText="Go to Campaign Manager"
          buttonFunction={() => { window.location.href = '/advertising/campaign-manager'; }}
          disabled={false}
          bgColor="#77469b"
          width="20rem"
          height="4rem"
          isButtonIconRequired
          isEndIcon
          buttonIcon={<ExternalLinkIcon size={13} color="#fff" />}
        />
      </div>
    </div>
  );
}
