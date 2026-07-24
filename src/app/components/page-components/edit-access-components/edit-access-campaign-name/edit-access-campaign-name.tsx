import { MarketplaceEnum } from '@/enums/serp.enums';
import { IOverallCampaign } from '@/interfaces/advertising/amazon/overall-advertising.interface';
import { ISBCampaign } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDCampaign } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { ICampaign } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartCampaign } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { INudgeMessage } from '@/interfaces/column.interface';
import { useMemo } from 'react';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectEditAccessFilters,
  selectEditState,
  selectInitialState,
  setEditState,
  setEditStateRow,
  setInitialState,
  setNameErr,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  checkIsCampaignActiveForEdit,
  checkIsEditDisableByReviewStatus,
  checkIsEqual,
  checkNameError,
  getAdvertisingTableMap,
} from 'src/utils/advertising.utils';
import AdvertisingNameEdit from '../../advertising-name-edit/advertising-name-edit';
import AdvertisingCampaignNameView from '../../advertising-name-view/advertising-campaign-name-view';

interface IEditAccessCampaignNameProps {
  campaignId: string;
  campaignName: string;
  endDate?: string;
  messages: INudgeMessage[] | null;
  adType: string;
  targetingType: string;
}

export default function EditAccessCampaignName({
  campaignId,
  campaignName,
  endDate,
  messages,
  adType,
  targetingType,
}: IEditAccessCampaignNameProps) {
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const editState = useAppSelector(selectEditState) as
    | ICampaign[]
    | ISBCampaign[]
    | ISDCampaign[]
    | IOverallCampaign[]
    | IWalmartCampaign[];
  const initialState = useAppSelector(selectInitialState) as
    | ICampaign[]
    | ISBCampaign[]
    | ISDCampaign[]
    | IOverallCampaign[]
    | IWalmartCampaign[];
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const dispatch = useAppDispatch();

  const editRowMap = useMemo(() => {
    return getAdvertisingTableMap(editState) as Map<
      string,
      | ICampaign
      | ISBCampaign
      | ISDCampaign
      | IOverallCampaign
      | IWalmartCampaign
    >;
  }, [editState]);

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as MarketplaceEnum,
    [advertisingAccount]
  );

  const currentRowData = useMemo(
    () => editRowMap.get(campaignId),
    [editRowMap, campaignId]
  );

  const isEditDisabledByReviewStatus: boolean = useMemo(() => {
    if (selectedMarketplace === MarketplaceEnum.WALMART && currentRowData) {
      return checkIsEditDisableByReviewStatus(currentRowData);
    }

    return false;
  }, [currentRowData, selectedMarketplace]);

  const handleCampaignNameChange = (updatedCampaignName: string) => {
    let editedRow: typeof currentRowData;

    if (currentRowData) {
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

      editedRow = {
        ...currentRowData,
        campaignName: updatedCampaignName,
      };
    }

    if (editedRow) {
      dispatch(
        setEditStateRow({
          id: `${campaignId}`,
          row: editedRow,
        })
      );
    }

    //TODO: keeping this logic if in case the new logic doesn't work. Will delete eventually
    // const updatedTable = editState.map((row) => {
    //   if (row.id === campaignId) {
    //     const nameErr = checkNameError(
    //       advertisingAccount.marketplace,
    //       'campaign',
    //       updatedCampaignName
    //     );

    //     if (nameErr) {
    //       dispatch(
    //         setNameErr({
    //           id: campaignId,
    //           message: nameErr,
    //         })
    //       );
    //     } else {
    //       dispatch(
    //         setNameErr({
    //           id: campaignId,
    //           message: '',
    //         })
    //       );
    //     }

    //     return {
    //       ...row,
    //       campaignName: updatedCampaignName,
    //     };
    //   }

    //   return row;
    // });

    // dispatch(setEditState(updatedTable as ISPAdvertisingData[]));
  };

  const handleTagChange = (tagId: string | null) => {
    let editedRow: typeof currentRowData;

    if (currentRowData) {
      editedRow = {
        ...currentRowData,
        tagId: tagId,
      };
    }

    if (editedRow) {
      dispatch(
        setEditStateRow({
          id: `${campaignId}`,
          row: editedRow,
        })
      );
    }
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

    dispatch(
      setEditState(
        updatedEditState as
          | ICampaign[]
          | ISBCampaign[]
          | ISDCampaign[]
          | IOverallCampaign[]
          | IWalmartCampaign[]
      )
    );

    dispatch(
      setInitialState(
        updatedInitialState as
          | ICampaign[]
          | ISBCampaign[]
          | ISDCampaign[]
          | IOverallCampaign[]
          | IWalmartCampaign[]
      )
    );
  };

  return editAccessFilters.editAccess.value === EditAccessValues.View ||
    checkIsCampaignActiveForEdit(endDate) === false ||
    isEditDisabledByReviewStatus === true ? (
    <AdvertisingCampaignNameView
      campaignId={campaignId}
      campaignName={campaignName}
      messages={messages}
      targetingType={targetingType}
      adType={adType}
      tagId={currentRowData?.tagId ?? null}
      handleTagUpdateLogic={handleTagChange}
      handleTableUpdateTagDelete={handleTagDelete}
    />
  ) : (
    <AdvertisingNameEdit
      handleNameUpdateLogic={handleCampaignNameChange}
      handleTagUpdateLogic={handleTagChange}
      originalName={campaignName}
      id={campaignId}
      adType={adType}
      targetingType={targetingType}
      isTaggingRequired={true}
      tagId={currentRowData?.tagId ?? null}
      handleTableUpdateTagDelete={handleTagDelete}
    />
  );
}
