import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingHeaderFilters } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import { getUrlWithQuery } from 'src/utils';
import {
  getAdGroupUrl,
  getAdTypePath,
  getMarketplacePath,
} from 'src/utils/advertising.utils';
import ColumnTags from '../../common/column-tags/column-tags';
import { textWrappingStyles } from '../../common/keyword-actions-table/keyword-actions-table-styles';
import styles from './advertising-name-view.module.scss';

interface IAdvertisingCampaignNameViewProps {
  campaignId: string;
  adgroupId: string;
  adgroupName: string;
  adGroupType: string | undefined;
  formattedPathName?: string;
}

export default function AdvertisingAdGroupNameView({
  campaignId,
  adgroupId,
  adgroupName,
  adGroupType,
  formattedPathName,
}: IAdvertisingCampaignNameViewProps) {
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );
  return (
    <div className={styles.infoDiv}>
      <Link
        className={styles.titleContainer}
        to={getUrlWithQuery(
          formattedPathName ||
            getAdGroupUrl(
              campaignId,
              adgroupId,
              getAdTypePath(advHeaderFilters.adType.value),
              getMarketplacePath(selectedMarketplace)
            )
        )}
        style={
          {
            ...textWrappingStyles,
            textAlign: 'left',
            color: '#77469B',
          } as React.CSSProperties
        }
      >
        <p className={styles.titleName} title={adgroupName}>
          {adgroupName}
        </p>
      </Link>
      <ColumnTags tagArray={[adGroupType]} />
    </div>
  );
}
