import { MarketplaceEnum } from '@/enums/serp.enums';
import { INudgeMessage } from '@/interfaces/column.interface';
import { Nullable } from '@/interfaces/index.interface';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AdType, AdTypeShort } from 'src/enums/advertising.enums';
import { WalmartAdTypeEnum } from 'src/enums/walmart.enums';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  getAdTypePath,
  getCampaignUrl,
  getMarketplacePath,
} from 'src/utils/advertising.utils';
import AdvertisingCampaignNameView from '../../advertising-name-view/advertising-campaign-name-view';

interface IAdvertisingOverallCampaignViewProps {
  campaignName: string;
  campaignId: string;
  adType: string;
  targetingType: string;
  messages: INudgeMessage[] | null;
  isCampaign: boolean;
  tagId: Nullable<string>;
}

export default function AdvertisingOverallCampaignView({
  campaignName,
  campaignId,
  adType,
  targetingType,
  messages,
  isCampaign = false,
  tagId,
}: IAdvertisingOverallCampaignViewProps) {
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const location = useLocation();

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
        pathName = getCampaignUrl(
          campaignId,
          getAdTypePath(AdType.SPONSORED_PRODUCTS),
          getMarketplacePath(MarketplaceEnum.AMAZON)
        );
      } else if (
        adType?.toUpperCase() === AdTypeShort.SPONSORED_BRANDS ||
        adType === AdType.SPONSORED_BRANDS
      ) {
        pathName = getCampaignUrl(
          campaignId,
          getAdTypePath(AdType.SPONSORED_BRANDS),
          getMarketplacePath(MarketplaceEnum.AMAZON)
        );
      } else if (
        adType?.toUpperCase() === AdTypeShort.SPONSORED_DISPLAY ||
        adType === AdType.SPONSORED_DISPLAY
      ) {
        pathName = getCampaignUrl(
          campaignId,
          getAdTypePath(AdType.SPONSORED_DISPLAY),
          getMarketplacePath(MarketplaceEnum.AMAZON)
        );
      } else {
        pathName = location.pathname;
      }
    } else if (selectedMarketplace === MarketplaceEnum.WALMART) {
      if (adType === WalmartAdTypeEnum.SPONSORED_PRODUCTS) {
        pathName = getCampaignUrl(
          campaignId,
          getAdTypePath(AdType.SPONSORED_PRODUCTS),
          getMarketplacePath(MarketplaceEnum.WALMART)
        );
      } else if (adType === WalmartAdTypeEnum.SPONSORED_BRANDS) {
        pathName = getCampaignUrl(
          campaignId,
          getAdTypePath(AdType.SPONSORED_BRANDS),
          getMarketplacePath(MarketplaceEnum.WALMART)
        );
      } else if (adType === WalmartAdTypeEnum.SPONSORED_VIDEO) {
        pathName = getCampaignUrl(
          campaignId,
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
  }, [adType, campaignId, location.pathname, selectedMarketplace]);

  return (
    <AdvertisingCampaignNameView
      campaignId={campaignId}
      campaignName={campaignName}
      messages={isCampaign ? messages : []}
      formattedPathName={formattedPathName}
      targetingType={targetingType}
      adType={adType}
      tagId={tagId}
    />
  );
}
