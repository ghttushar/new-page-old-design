import { MarketplaceEnum } from '@/enums/serp.enums';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AdType, AdTypeShort } from 'src/enums/advertising.enums';
import { WalmartAdTypeEnum } from 'src/enums/walmart.enums';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  getAdGroupUrl,
  getAdTypePath,
  getMarketplacePath,
} from 'src/utils/advertising.utils';
import AdvertisingAdGroupNameView from '../../advertising-name-view/advertising-adgroup-name-view';

interface IAdvertisingOverallAdGroupViewProps {
  campaignId: string;
  adGroupName: string;
  adGroupId: string;
  adType: string;
  adGroupType: string | undefined;
}

export default function AdvertisingOverallAdGroupView({
  campaignId,
  adGroupName,
  adGroupId,
  adType,
  adGroupType,
}: IAdvertisingOverallAdGroupViewProps) {
  const location = useLocation();

  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );

  const formattedPathName: string = useMemo(() => {
    let pathName = '';

    if (selectedMarketplace === MarketplaceEnum.AMAZON) {
      if (
        adType?.toUpperCase() === AdTypeShort.SPONSORED_PRODUCTS ||
        adType === AdType.SPONSORED_PRODUCTS
      ) {
        pathName = getAdGroupUrl(
          campaignId,
          adGroupId,
          getAdTypePath(AdType.SPONSORED_PRODUCTS),
          getMarketplacePath(MarketplaceEnum.AMAZON)
        );
      } else if (
        adType?.toUpperCase() === AdTypeShort.SPONSORED_BRANDS ||
        adType === AdType.SPONSORED_BRANDS
      ) {
        pathName = getAdGroupUrl(
          campaignId,
          adGroupId,
          getAdTypePath(AdType.SPONSORED_BRANDS),
          getMarketplacePath(MarketplaceEnum.AMAZON)
        );
      } else if (
        adType?.toUpperCase() === AdTypeShort.SPONSORED_DISPLAY ||
        adType === AdType.SPONSORED_DISPLAY
      ) {
        pathName = getAdGroupUrl(
          campaignId,
          adGroupId,
          getAdTypePath(AdType.SPONSORED_DISPLAY),
          getMarketplacePath(MarketplaceEnum.AMAZON)
        );
      } else {
        pathName = location.pathname;
      }
    } else if (selectedMarketplace === MarketplaceEnum.WALMART) {
      if (adType === WalmartAdTypeEnum.SPONSORED_PRODUCTS) {
        pathName = getAdGroupUrl(
          campaignId,
          adGroupId,
          getAdTypePath(AdType.SPONSORED_PRODUCTS),
          getMarketplacePath(MarketplaceEnum.WALMART)
        );
      } else if (adType === WalmartAdTypeEnum.SPONSORED_BRANDS) {
        pathName = getAdGroupUrl(
          campaignId,
          adGroupId,
          getAdTypePath(AdType.SPONSORED_BRANDS),
          getMarketplacePath(MarketplaceEnum.WALMART)
        );
      } else if (adType === WalmartAdTypeEnum.SPONSORED_VIDEO) {
        pathName = getAdGroupUrl(
          campaignId,
          adGroupId,
          getAdTypePath(AdType.SPONSORED_VIDEO),
          getMarketplacePath(MarketplaceEnum.WALMART)
        );
      } else {
        pathName = location.pathname;
      }
    } else {
      pathName = location.pathname;
    }

    return pathName;
  }, [adGroupId, adType, campaignId, location.pathname, selectedMarketplace]);

  return (
    <AdvertisingAdGroupNameView
      campaignId={campaignId}
      adgroupId={adGroupId}
      adgroupName={adGroupName}
      adGroupType={adGroupType}
      formattedPathName={formattedPathName}
    />
  );
}
