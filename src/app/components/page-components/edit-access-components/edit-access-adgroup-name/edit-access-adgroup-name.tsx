import { MarketplaceEnum } from '@/enums/serp.enums';
import { IOverallAdvertisingData } from '@/interfaces/advertising/amazon/overall-advertising.interface';
import { ISBAdvertisingData } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDAdvertisingData } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { ISPAdvertisingData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartOverallAdvertisingData } from '@/interfaces/advertising/walmart/walmart-overall-advertising.interface';
import { IWalmartSBAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import { IWalmartSPAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { useMemo } from 'react';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectEditAccessFilters,
  selectEditState,
  setEditState,
  setNameErr,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  checkIsEditDisableByReviewStatus,
  checkNameError,
} from 'src/utils/advertising.utils';
import AdvertisingNameEdit from '../../advertising-name-edit/advertising-name-edit';
import AdvertisingAdGroupNameView from '../../advertising-name-view/advertising-adgroup-name-view';

interface IEditAccessAdGroupNameProps {
  adgroupId: string;
  adgroupName: string;
  campaignId: string;
  adGroupType: string | undefined;
}

export default function EditAccessAdGroupName({
  adgroupId,
  adgroupName,
  campaignId,
  adGroupType,
}: IEditAccessAdGroupNameProps) {
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const editState = useAppSelector(selectEditState);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const dispatch = useAppDispatch();

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as MarketplaceEnum,
    [advertisingAccount]
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
      if (`${element.id}` === adgroupId) {
        initialData = element;
        break;
      }
    }

    return initialData;
  }, [editState, adgroupId]);

  const isEditDisabledByReviewStatus: boolean = useMemo(() => {
    if (selectedMarketplace === MarketplaceEnum.WALMART && currentRowData) {
      return checkIsEditDisableByReviewStatus(currentRowData);
    }

    return false;
  }, [currentRowData, selectedMarketplace]);

  const handleAdGroupNameChange = (updatedAdgroupName: string) => {
    const updatedTable = editState.map((row) => {
      if (row.id === adgroupId) {
        const nameErr = checkNameError(
          advertisingAccount.marketplace,
          'adGroup',
          updatedAdgroupName
        );

        if (nameErr) {
          dispatch(
            setNameErr({
              id: adgroupId,
              message: nameErr,
            })
          );
        } else {
          dispatch(
            setNameErr({
              id: adgroupId,
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

    dispatch(setEditState(updatedTable as ISPAdvertisingData[]));
  };

  return editAccessFilters.editAccess.value === EditAccessValues.View ||
    isEditDisabledByReviewStatus === true ? (
    <AdvertisingAdGroupNameView
      campaignId={campaignId}
      adgroupId={adgroupId}
      adgroupName={adgroupName}
      adGroupType={adGroupType}
    />
  ) : (
    <AdvertisingNameEdit
      handleNameUpdateLogic={handleAdGroupNameChange}
      originalName={adgroupName}
      id={adgroupId}
      isTaggingRequired={false}
      tagId={null}
    />
  );
}
