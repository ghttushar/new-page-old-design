import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  WalmartAdGroupStatusEnum,
  WalmartCampaignStatusEnum,
} from '@/enums/walmart.enums';
import { ISPAdvertisingData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IEditBulkActionProp } from '@/interfaces/edit-access/edit-access.interface';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import {
  checkIsEditDisabledByReviewStatus,
  checkIsStatusUnchecked,
  checkReviewCampaignFlagEnabled,
} from '@/utils/advertising.utils';
import { PlayCircleIcon } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { CampaignStateEnum } from 'src/enums/advertising.enums';
import { IWalmartSPAdvertisingData } from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectEditState,
  selectInitialState,
  selectSelectedRowIds,
  setEditState,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { showErrorToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import TextButton from '../../text-button/text-button';

interface IAdvertisingActiveActionProps extends IEditBulkActionProp {
  isWalmartCampaign: boolean;
  marketplace: string;
}

export default function AdvertisingActiveAction({
  setTableData,
  isWalmartCampaign,
  marketplace,
}: IAdvertisingActiveActionProps) {
  const dispatch = useAppDispatch();
  const initialState = useAppSelector(selectInitialState);
  const editState = useAppSelector(selectEditState);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);

  const isReviewFlagEnabled = useMemo(
    () =>
      checkReviewCampaignFlagEnabled(
        advHeaderFilters.adType.value,
        marketplace
      ),
    [advHeaderFilters.adType.value, marketplace]
  );

  const getActiveActionByMarketplace = (
    marketplace: string,
    initialStatus: string
  ) => {
    const formattedStatus = initialStatus.toLowerCase();
    if (marketplace === MarketplaceEnum.AMAZON) {
      return CampaignStateEnum.ENABLED;
    }

    if (formattedStatus === WalmartCampaignStatusEnum.LIVE.toLowerCase()) {
      return WalmartCampaignStatusEnum.LIVE;
    } else {
      return isWalmartCampaign
        ? WalmartCampaignStatusEnum.ENABLED
        : WalmartAdGroupStatusEnum.ENABLED;
    }
  };
  const handleActiveClick = () => {
    let isAnyArchived = false;
    initialState.forEach((row: any) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        if (row.status === CampaignStateEnum.ARCHIVED) {
          isAnyArchived = true;
          return;
        }
      }
    });

    if (isAnyArchived) {
      return dispatch(
        showErrorToastMessage({
          title: 'Error!!!',
          description: `Status can't be changed once it is Archived.`,
        })
      );
    }

    const updatedState = editState.map((row) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        let initialData: any;
        for (const element of initialState) {
          if (element.id === row.id) {
            initialData = element;
            break;
          }
        }

        const isEntityPaused = checkIsStatusUnchecked(initialData);
        const isEntityReviewFlagEnabled = checkReviewCampaignFlagEnabled(
          initialData.adType,
          marketplace
        );

        if (
          isEntityPaused &&
          (isEntityReviewFlagEnabled === false ||
            checkIsEditDisabledByReviewStatus(
              marketplace,
              initialData,
              isWalmartCampaign
            ))
        )
          return row;

        return {
          ...row,
          status: getActiveActionByMarketplace(marketplace, initialData.status),
        };
      }

      return row;
    });
    dispatch(
      setEditState(
        updatedState as ISPAdvertisingData[] | IWalmartSPAdvertisingData[]
      )
    );
    setTableData(
      updatedState as ISPAdvertisingData[] | IWalmartSPAdvertisingData[]
    );
  };

  return (
    <TextButton
      label="Active"
      handleClick={handleActiveClick}
      isVisible={true}
      buttonStartIcon={
        <PlayCircleIcon size={16} color="#77469B" weight="bold" />
      }
      customStyles={{ fontSize: '1rem' }}
      isDisabled={isReviewFlagEnabled === false || !selectedRowIds.length}
      disableReason={
        isReviewFlagEnabled === false
          ? 'Review triggering edit is not available'
          : !selectedRowIds.length
          ? 'No row selected'
          : ''
      }
      isNewDesign={true}
    />
  );
}
