import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  WalmartAdGroupStatusEnum,
  WalmartCampaignStatusEnum,
} from '@/enums/walmart.enums';
import { ISPAdvertisingData } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartOverallAdvertisingData } from '@/interfaces/advertising/walmart/walmart-overall-advertising.interface';
import { IWalmartSBAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import { IWalmartSPAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { IEditBulkActionProp } from '@/interfaces/edit-access/edit-access.interface';
import { PauseCircleIcon } from '@phosphor-icons/react';
import { CampaignStateEnum } from 'src/enums/advertising.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectEditState,
  selectInitialState,
  selectSelectedRowIds,
  setEditState,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { showErrorToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import TextButton from '../../text-button/text-button';

interface IAdvertisingPauseActionProps extends IEditBulkActionProp {
  marketplace: string;
  isWalmartKT: boolean;
}

export default function AdvertisingPauseAction({
  setTableData,
  marketplace,
  isWalmartKT,
}: IAdvertisingPauseActionProps) {
  const dispatch = useAppDispatch();

  const initialState = useAppSelector(selectInitialState);
  const editState = useAppSelector(selectEditState);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);

  const getPauseActionByMarketplace = (
    marketplace: string,
    initialStatus: string
  ) => {
    const formattedStatus = initialStatus.toLowerCase();

    if (marketplace === MarketplaceEnum.AMAZON) {
      return CampaignStateEnum.PAUSED;
    }

    if (
      formattedStatus === WalmartCampaignStatusEnum.ENDED.toLowerCase() ||
      formattedStatus === WalmartCampaignStatusEnum.PAUSED.toLowerCase() ||
      formattedStatus === WalmartAdGroupStatusEnum.DISABLED.toLowerCase()
    )
      return initialStatus;

    if (formattedStatus === WalmartCampaignStatusEnum.LIVE.toLowerCase())
      return WalmartCampaignStatusEnum.PAUSED;

    if (formattedStatus === WalmartAdGroupStatusEnum.ENABLED) {
      return isWalmartKT
        ? WalmartAdGroupStatusEnum.PAUSED
        : WalmartAdGroupStatusEnum.DISABLED;
    }
  };

  const handlePauseClick = () => {
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

        return {
          ...row,
          status: getPauseActionByMarketplace(marketplace, initialData.status),
        };
      }

      return row;
    });
    dispatch(
      setEditState(
        updatedState as
          | ISPAdvertisingData[]
          | IWalmartSPAdvertisingData[]
          | IWalmartSBAdvertisingData[]
          | IWalmartSVAdvertisingData[]
          | IWalmartOverallAdvertisingData[]
      )
    );

    setTableData(
      updatedState as
        | ISPAdvertisingData[]
        | IWalmartSPAdvertisingData[]
        | IWalmartSBAdvertisingData[]
        | IWalmartSVAdvertisingData[]
        | IWalmartOverallAdvertisingData[]
    );
  };

  return (
    <TextButton
      label="Pause"
      handleClick={handlePauseClick}
      isVisible={true}
      buttonStartIcon={
        <PauseCircleIcon size={16} color="#77469B" weight="bold" />
      }
      customStyles={{ fontSize: '1rem' }}
      isDisabled={!selectedRowIds.length}
      disableReason="No row selected"
      isNewDesign={true}
    />
  );
}
