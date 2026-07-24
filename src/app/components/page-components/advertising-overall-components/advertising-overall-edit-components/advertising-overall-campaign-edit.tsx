import { EditAccessValues } from '@/enums/edit-access.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IEditAccessArrayData } from '@/interfaces/advertising/advertising.interface';
import { IOverallAdvertisingData } from '@/interfaces/advertising/amazon/overall-advertising.interface';
import { ISBAdvertisingData } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDAdvertisingData } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import {
  ICampaign,
  ISPAdvertisingData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartOverallAdvertisingData } from '@/interfaces/advertising/walmart/walmart-overall-advertising.interface';
import { IWalmartSBAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import { IWalmartSPAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { INudgeMessage } from '@/interfaces/column.interface';
import {
  selectEditAccessFilters,
  selectEditState,
  selectInitialState,
  setEditState,
  setEditStateRow,
  setInitialState,
  setNameErr,
} from '@/redux/slices/advertising/advertising-edit-access.slice';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { AdType, AdTypeShort } from 'src/enums/advertising.enums';
import { WalmartAdTypeEnum } from 'src/enums/walmart.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  checkIsCampaignActiveForEdit,
  checkIsEditDisableByReviewStatus,
  checkIsEqual,
  checkNameError,
  getAdTypePath,
  getCampaignUrl,
  getMarketplacePath,
} from 'src/utils/advertising.utils';
import AdvertisingNameEdit from '../../advertising-name-edit/advertising-name-edit';
import AdvertisingCampaignNameView from '../../advertising-name-view/advertising-campaign-name-view';

interface IAdvertisingOverallCampaignEditProps {
  campaignName: string;
  campaignId: string;
  adType: string;
  targetingType: string;
  endDate?: string;
  messages: INudgeMessage[] | null;
}

export default function AdvertisingOverallCampaignEdit({
  campaignName,
  campaignId,
  adType,
  targetingType,
  endDate,
  messages,
}: IAdvertisingOverallCampaignEditProps) {
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const editState = useAppSelector(selectEditState) as ICampaign[];
  const initialState = useAppSelector(selectInitialState) as ICampaign[];
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
      if (`${element.id}` === campaignId) {
        initialData = element;
        break;
      }
    }

    return initialData;
  }, [editState, campaignId]);

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

  const handleCampaignNameChange = (updatedCampaignName: string) => {
    const updatedTable = editState.map((row) => {
      if (`${row.id}` === campaignId) {
        const nameErr = checkNameError(
          advertisingAccount.marketplace,
          'campaign',
          updatedCampaignName
        );

        if (nameErr) {
          dispatch(
            setNameErr({
              id: campaignId,
              message: nameErr,
            })
          );
        } else {
          dispatch(
            setNameErr({
              id: campaignId,
              message: '',
            })
          );
        }

        return {
          ...row,
          campaignName: updatedCampaignName,
        };
      }

      return row;
    });

    dispatch(setEditState(updatedTable as IEditAccessArrayData));
  };

  const handleTagUpdateLogic = (tagId: string | null) => {
    if (!currentRowData) return;
    const updatedRow = {
      ...currentRowData,
      tagId,
    };

    dispatch(
      setEditStateRow({
        id: campaignId,
        row: updatedRow as typeof currentRowData,
      })
    );
  };

  const handleTagDelete = (tagId: string) => {
    if (!tagId) return;

    const updatedEditState = editState.map((row) => {
      if (checkIsEqual(tagId, row.tagId))
        return {
          ...row,
          tagId: null,
        };

      return row;
    });

    const updatedInitialState = initialState.map((row) => {
      if (checkIsEqual(tagId, row.tagId))
        return {
          ...row,
          tagId: null,
        };

      return row;
    });

    dispatch(setEditState(updatedEditState as ICampaign[]));

    dispatch(setInitialState(updatedInitialState as ICampaign[]));
  };

  return editAccessFilters.editAccess.value === EditAccessValues.View ||
    checkIsCampaignActiveForEdit(endDate) === false ||
    isEditDisabledByReviewStatus === true ? (
    <AdvertisingCampaignNameView
      campaignId={campaignId}
      campaignName={campaignName}
      messages={messages}
      formattedPathName={formattedPathName}
      targetingType={targetingType}
      adType={adType}
      tagId={currentRowData?.tagId ?? null}
      handleTagUpdateLogic={handleTagUpdateLogic}
      handleTableUpdateTagDelete={handleTagDelete}
    />
  ) : (
    <AdvertisingNameEdit
      handleNameUpdateLogic={handleCampaignNameChange}
      originalName={campaignName}
      id={campaignId}
      adType={adType}
      targetingType={targetingType}
      isTaggingRequired={true}
      tagId={currentRowData?.tagId ?? null}
      handleTagUpdateLogic={handleTagUpdateLogic}
      handleTableUpdateTagDelete={handleTagDelete}
    />
  );
}
