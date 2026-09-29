import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import { ArrowRightIcon, ImageIcon, MonitorIcon, TagIcon } from '../campaign-creator-icons';
import MarketplaceLogo from '../../marketplace-logo';
import { CcMarketplace } from '../campaign-creator.types';
import styles from '../campaign-creator.module.scss';

export function StepSetup({ marketplace, onSelectMarketplace, onStart }: { marketplace: CcMarketplace | null; onSelectMarketplace: (m: CcMarketplace) => void; onStart: () => void }) {
  return (
    <div className={styles.setupScreen}>
      <div className={styles.setupHeader}>
        <div className={styles.setupEyebrow}>Campaign Creator</div>
        <div className={styles.setupHeadline}>Let&apos;s set up your campaign</div>
        <div className={styles.setupHeadlineSub}>Select the marketplace and ad type to get started. We&apos;ll use this to show relevant products, targeting options and campaign structures.</div>
      </div>

      <div className={styles.setupCard}>
        <div className={styles.setupSubsection}>
          <span className={styles.setupNumberBadge}>1</span>
          <div className={styles.setupSubsectionBody}>
            <div className={styles.setupSectionTitle}>Marketplace</div>
            <div className={styles.setupSectionDescription}>Choose the marketplace where you want to create campaigns.</div>
            <div className={styles.setupMarketplaceGrid}>
              {(['amazon', 'walmart'] as CcMarketplace[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onSelectMarketplace(m)}
                  className={`${styles.setupMarketplaceCard} ${marketplace === m ? styles.setupMarketplaceCardActive : ''}`}
                >
                  <span className={styles.setupMarketplaceLogo}><MarketplaceLogo marketplace={m} /></span>
                  <span>
                    <div className={styles.setupMarketplaceTitle}>{m === 'amazon' ? 'Amazon' : 'Walmart'}</div>
                    <div className={styles.setupMarketplaceDescription}>Create campaigns for your {m === 'amazon' ? 'Amazon' : 'Walmart'} marketplace.</div>
                  </span>
                  <span className={`${styles.setupRadio} ${marketplace === m ? styles.setupRadioActive : ''}`}>{marketplace === m && <span className={styles.setupRadioDot} />}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.setupSubsection}>
          <span className={styles.setupNumberBadge}>2</span>
          <div className={styles.setupSubsectionBody}>
            <div className={styles.setupSectionTitle}>Ad Type</div>
            <div className={styles.setupSectionDescription}>Select the type of advertising campaign you want to create.</div>
            <div className={styles.setupAdTypeGrid}>
              <button type="button" className={`${styles.setupMarketplaceCard} ${styles.setupMarketplaceCardActive}`}>
                <span className={styles.setupAdTypeIcon}><TagIcon size={22} color="#77469b" /></span>
                <span>
                  <div className={styles.setupMarketplaceTitle}>Sponsored Products</div>
                  <div className={styles.setupMarketplaceDescription}>Promote individual products in search results and product pages.</div>
                </span>
                <span className={`${styles.setupRadio} ${styles.setupRadioActive}`}><span className={styles.setupRadioDot} /></span>
              </button>
              <button type="button" disabled className={`${styles.setupMarketplaceCard} ${styles.choiceCardDisabled}`}>
                <span className={styles.setupAdTypeIcon}><ImageIcon size={22} /></span>
                <span>
                  <div className={styles.setupMarketplaceTitle}>Sponsored Brands</div>
                  <span className={styles.setupSoonPill}>Coming soon</span>
                  <div className={styles.setupMarketplaceDescription}>Showcase your brand with custom creative.</div>
                </span>
              </button>
              <button type="button" disabled className={`${styles.setupMarketplaceCard} ${styles.choiceCardDisabled}`}>
                <span className={styles.setupAdTypeIcon}><MonitorIcon size={22} /></span>
                <span>
                  <div className={styles.setupMarketplaceTitle}>Sponsored Display</div>
                  <span className={styles.setupSoonPill}>Coming soon</span>
                  <div className={styles.setupMarketplaceDescription}>Reach shoppers on and off {marketplace === 'walmart' ? 'Walmart' : 'Amazon'}.</div>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.setupFooter}>
          <PrimaryButton
            buttonText="Start Creating"
            buttonFunction={onStart}
            disabled={!marketplace}
            bgColor="#77469b"
            width="16rem"
            height="4.2rem"
            isButtonIconRequired
            isEndIcon
            buttonIcon={<ArrowRightIcon size={14} color="#fff" />}
          />
        </div>
      </div>
    </div>
  );
}
