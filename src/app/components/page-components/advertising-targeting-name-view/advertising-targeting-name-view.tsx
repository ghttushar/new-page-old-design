import { textStartStyles } from '@/constants/table-columns/new-column-names.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  checkAsinIdentifier,
  checkIsAsin,
  getAsinString,
  getFormattedTargetingItemValue,
  getProductUrl,
} from '@/utils/advertising.utils';
import { LinkIcon } from '@phosphor-icons/react';
import styles from './advertising-targeting-name-view.module.scss';

interface IAdvertisingTargetingNameViewProps {
  targetingValue: string;
  defaultBoldFont?: boolean;
  bidAutomation?: string;
  isPinned?: boolean;
}

export default function AdvertisingTargetingNameView({
  targetingValue,
  defaultBoldFont = false,
  bidAutomation,
  isPinned, //
}: IAdvertisingTargetingNameViewProps) {
  const hasAsinIdentifier = checkAsinIdentifier(targetingValue);
  const asinString = hasAsinIdentifier ? getAsinString(targetingValue) : '';

  if (hasAsinIdentifier && checkIsAsin(asinString)) {
    if (!asinString) return <div className="no-data-view">-</div>;
    const formatValue = getFormattedTargetingItemValue(targetingValue);

    return (
      <div
        className={`commonCell`}
        style={{
          ...textStartStyles,
        }}
      >
        <div className={styles.productNameContainer}>
          <div className={styles.productTitle}>
            <span className={styles.productTitleText} title={formatValue}>
              {formatValue}
              <a
                className={styles.productTitleLinkIcon}
                href={getProductUrl(asinString, MarketplaceEnum.AMAZON)}
                target="_blank"
                rel="noreferrer"
              >
                <LinkIcon size={'1.4rem'} color="#77469b" weight="bold" />
              </a>
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div
        className={`commonCell ${styles.titleContainer}`}
        style={textStartStyles}
      >
        <p
          className={styles.titleName}
          title={targetingValue}
          style={{ fontWeight: defaultBoldFont ? '700' : 'initial' }}
        >
          {targetingValue}
        </p>
      </div>
    );
  }
}
