import { MarketplaceEnum } from '@/enums/serp.enums';
import { ISBProductAdsAsins } from '@/interfaces/column.interface';
import { getAdsEligibility, getProductUrl } from '@/utils/advertising.utils';
import styles from 'src/app/components/pages/advertising-page/advertising-walmart/sp/account-level/wmt-sp-account-level.module.scss';
export function CreativeAsinsSb({ asinEligibility }: ISBProductAdsAsins) {
  return asinEligibility && asinEligibility.length ? (
    asinEligibility.map((asin, index) => (
      <div
        className={styles.productNameContainer}
        key={`${asin.asin}-${index}`}
        style={{ display: 'flex' }}
      >
        <span className="flex" style={{ minWidth: '12.5rem' }}>
          <span>Asin No.:</span>
          <a
            className={styles.productTitle}
            href={getProductUrl(asin.asin || '', MarketplaceEnum.AMAZON)}
            target="_blank"
            rel="noreferrer"
          >
            <p title={asin.asin || ''}>{asin.asin}</p>
          </a>
        </span>

        <span style={{ color: '#474747', fontWeight: '500' }}>
          | {getAdsEligibility(asin.eligibility)}
        </span>
      </div>
    ))
  ) : (
    <div className="no-data-view">-</div>
  );
}
