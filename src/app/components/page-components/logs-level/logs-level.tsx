import {
  ActionTypesEnum,
  AmazonLevelEnum,
  WalmartLevelEnum,
} from '@/enums/logs.enums';
import { ILogsData, ITargeting } from '@/interfaces/logs/logs.interface';
import React from 'react';
import styles from './logs-level.module.scss';
interface ILogsLevelProps {
  data: ILogsData;
}

type PlatformLevel = AmazonLevelEnum | WalmartLevelEnum;

const CampaignLevel = ({ campaignName }: { campaignName: string }) => (
  <div className={styles.container}>
    <span className={styles.heading}>Campaign:</span> {campaignName}{' '}
  </div>
);

const RuleLevel = ({ campaignName, ruleId }: { campaignName: string; ruleId?: string }) => (
  <div className="flex flex-col">
    <div className={styles.container}>
      <span className={styles.heading}>Rule Name:</span> {campaignName}{' '}
    </div>
    {ruleId && (
      <span className={styles.subHeading}>
        Rule ID:
        {ruleId}
      </span>
    )}
  </div>
);

const AdGroupLevel = ({
  campaignName,
  adGroupName,
}: {
  campaignName: string;
  adGroupName: string;
}) => (
  <div className="flex flex-col">
    <div className={`${styles.container} commonCell`}>
      <span className={styles.heading}>Ad Group:</span> {adGroupName}
    </div>
    <SubHeading campaignName={campaignName} adGroupName={''} />
  </div>
);

const ProductAdsLevel = ({
  productName,
  campaignName,
  adGroupName,
}: {
  productName: string;
  campaignName: string;
  adGroupName: string;
}) => (
  <div className="flex flex-col">
    <div className={`${styles.container} ${styles.productTitle} commonCell`}>
      <span className={styles.heading}>Product Name:</span> {productName}
    </div>
    <SubHeading campaignName={campaignName} adGroupName={adGroupName} />
  </div>
);

const TargetingLevel = ({ targeting }: { targeting: ITargeting }) => {
  const { keyword, product, negativeKeyword } = targeting;

  const getTargetingContent = () => {
    if (keyword) {
      return (
        <React.Fragment>
          <span className={styles.heading}>Keyword & MatchType:</span>{' '}
          {keyword.name ?? keyword.id}
          {keyword.matchType && (
            <span className={styles.matchType}> ({keyword.matchType})</span>
          )}
        </React.Fragment>
      );
    }

    if (product) {
      return (
        <React.Fragment>
          <span className={styles.heading}>Product Name:</span>{' '}
          {product.productName ?? product.id}
          {product.asin && (
            <span className={styles.asin}> ({product.asin})</span>
          )}
        </React.Fragment>
      );
    }

    if (negativeKeyword) {
      return (
        <React.Fragment>
          <span className={styles.heading}>Negative Keyword & MatchType:</span>{' '}
          {negativeKeyword.keywordText ?? negativeKeyword.id}
          {negativeKeyword.matchType && (
            <span className={styles.matchType}>
              {' '}
              ({negativeKeyword.matchType})
            </span>
          )}
        </React.Fragment>
      );
    }

    return null;
  };

  return (
    <div className={styles.targetingContainer}>{getTargetingContent()}</div>
  );
};

const SubHeading = ({
  campaignName,
  adGroupName,
}: {
  campaignName: string;
  adGroupName: string;
}) => (
  <div className={styles.subHeadingContainer}>
    {campaignName && (
      <span className={styles.subHeading}>
        Campaign:
        {campaignName}
        <br />
      </span>
    )}
    {adGroupName && (
      <span className={styles.subHeading}>
        Ad Group:
        {adGroupName}
      </span>
    )}
  </div>
);

const Placeholder = () => <span className={styles.placeholder}>-</span>;

export default function LogsLevel({ data }: Readonly<ILogsLevelProps>) {
  const { editedLevel, productAds, targeting, actionType, adItems } = data;
  let campaignName = data.campaignName;
  let adGroupName = data.adGroupName;
  if (actionType.type === ActionTypesEnum.NAME) {
    if (
      editedLevel === AmazonLevelEnum.CAMPAIGN_LEVEL ||
      WalmartLevelEnum.CAMPAIGN
    )
      campaignName = data.to;

    if (
      editedLevel === AmazonLevelEnum.AD_GROUP_LEVEL ||
      editedLevel === WalmartLevelEnum.AD_GROUP
    )
      adGroupName = data.to;
  }

  if (!campaignName) return <Placeholder />;

  const LevelContent = (level: PlatformLevel) => {
    switch (level) {
      case AmazonLevelEnum.CAMPAIGN_LEVEL:
      case WalmartLevelEnum.CAMPAIGN:
        return <CampaignLevel campaignName={campaignName} />;

      case AmazonLevelEnum.RULE:
      case WalmartLevelEnum.RULE:
        return <RuleLevel campaignName={campaignName} ruleId={data.ruleId} />;

      case AmazonLevelEnum.AD_GROUP_LEVEL:
      case WalmartLevelEnum.AD_GROUP:
        return adGroupName ? (
          <AdGroupLevel campaignName={campaignName} adGroupName={adGroupName} />
        ) : (
          <Placeholder />
        );

      case AmazonLevelEnum.PRODUCT_ADS:
      case WalmartLevelEnum.AD_ITEM:
        return productAds?.productName ? (
          <ProductAdsLevel
            productName={
              productAds.productName ?? productAds.asin ?? productAds.adId
            }
            campaignName={campaignName}
            adGroupName={adGroupName || ''}
          />
        ) : adItems?.name ? (
          <ProductAdsLevel
            productName={adItems.name ?? adItems.adItemId}
            campaignName={campaignName}
            adGroupName={adGroupName || ''}
          />
        ) : (
          <Placeholder />
        );

      case AmazonLevelEnum.KEYWORD_TARGETING:
      case AmazonLevelEnum.NEGATIVE_KEYWORD_TARGETING:
      case AmazonLevelEnum.NEGATIVE_PRODUCT_TARGETING:
      case AmazonLevelEnum.PRODUCT_TARGETING:
      case AmazonLevelEnum.TARGETING_LEVEL:
      case WalmartLevelEnum.KEYWORD:
        return targeting && adGroupName ? (
          <div className="flex flex-col">
            <div
              className={`${styles.container} ${styles.productTitle} commonCell`}
            >
              <TargetingLevel targeting={targeting} />
            </div>
            <SubHeading campaignName={campaignName} adGroupName={adGroupName} />
          </div>
        ) : (
          <Placeholder />
        );

      default:
        return <Placeholder />;
    }
  };

  return (
    <div className={styles.logsLevelContainer}>
      {LevelContent(editedLevel as PlatformLevel)}
    </div>
  );
}
