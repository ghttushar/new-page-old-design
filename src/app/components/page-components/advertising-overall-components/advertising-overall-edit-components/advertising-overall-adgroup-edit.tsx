import { EditAccessValues } from '@/enums/edit-access.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IEditAccessArrayData } from '@/interfaces/advertising/advertising.interface';
import { IOverallAdvertisingData } from '@/interfaces/advertising/amazon/overall-advertising.interface';
import { ISBAdvertisingData } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDAdvertisingData } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { ISPAdvertisingData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartOverallAdvertisingData } from '@/interfaces/advertising/walmart/walmart-overall-advertising.interface';
import { IWalmartSBAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import { IWalmartSPAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import {
  selectEditAccessFilters,
  selectEditState,
  setEditState,
  setNameErr,
} from '@/redux/slices/advertising/advertising-edit-access.slice';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AdType, AdTypeShort } from 'src/enums/advertising.enums';
import { WalmartAdTypeEnum } from 'src/enums/walmart.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  checkIsEditDisableByReviewStatus,
  checkNameError,
  getAdGroupUrl,
  getAdTypePath,
  getMarketplacePath,
} from 'src/utils/advertising.utils';
import AdvertisingNameEdit from '../../advertising-name-edit/advertising-name-edit';
import AdvertisingAdGroupNameView from '../../advertising-name-view/advertising-adgroup-name-view';

interface IAdvertisingOverallAdGroupEditProps {
  campaignId: string;
  adGroupName: string;
  adGroupId: string;
  adType: string;
  adGroupType: string | undefined;
}

export default function AdvertisingOverallAdGroupEdit({
  campaignId,
  adGroupName,
  adGroupId,
  adType,
  adGroupType,
}: IAdvertisingOverallAdGroupEditProps) {
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const editState = useAppSelector(selectEditState);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const dispatch = useAppDispatch();
  const location = useLocation();

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );

  const currentRowData = useMemo(() => {
    let initialData:
      | ISPAdvertisingData
      | ISBAdvertisingData
      | ISDAdvertisingData
      | IOverallAdvertisingData
      | IWalmartSPAdvertisingData
      | IWalmartSBAdvertisingData
      | IWalmartSVAdvertisingData
      | IWalmartOverallAdvertisingData
      | null = null;
    for (const element of editState) {
      if (`${element.id}` === adGroupId) {
        initialData = element;
        break;
      }
    }

    return initialData;
  }, [editState, adGroupId]);

  const isEditDisabledByReviewStatus: boolean = useMemo(() => {
    if (selectedMarketplace === MarketplaceEnum.WALMART && currentRowData) {
      return checkIsEditDisableByReviewStatus(currentRowData);
    }

    return false;
  }, [currentRowData, selectedMarketplace]);

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

  const handleAdGroupNameChange = (updatedAdgroupName: string) => {
    const updatedTable = editState.map((row) => {
      if (row.id === adGroupId) {
        const nameErr = checkNameError(
          advertisingAccount.marketplace,
          'adGroup',
          updatedAdgroupName
        );

        if (nameErr) {
          dispatch(
            setNameErr({
              id: adGroupId,
              message: nameErr,
            })
          );
        } else {
          dispatch(
            setNameErr({
              id: adGroupId,
              message: '',
            })
          );
        }

        return {
          ...row,
          adGroupName: updatedAdgroupName,
        };
      }

      return row;
    });

    dispatch(setEditState(updatedTable as IEditAccessArrayData));
  };

  return editAccessFilters.editAccess.value === EditAccessValues.View ||
    isEditDisabledByReviewStatus === true ? (
    <AdvertisingAdGroupNameView
      campaignId={campaignId}
      adgroupId={adGroupId}
      adgroupName={adGroupName}
      adGroupType={adGroupType}
      formattedPathName={formattedPathName}
    />
  ) : (
    <AdvertisingNameEdit
      handleNameUpdateLogic={handleAdGroupNameChange}
      originalName={adGroupName}
      id={adGroupId}
      isTaggingRequired={false}
      tagId={null}
    />
  );
}
