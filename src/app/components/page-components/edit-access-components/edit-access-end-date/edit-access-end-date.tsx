import { MarketplaceEnum } from '@/enums/serp.enums';
import { IOverallCampaign } from '@/interfaces/advertising/amazon/overall-advertising.interface';
import { ISBCampaign } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDCampaign } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { ICampaign } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  checkIsEditDisableByReviewStatus,
  getAdvertisingTableMap,
} from '@/utils/advertising.utils';
import React, { useEffect, useMemo, useState } from 'react';
import SingleDatePicker from 'src/app/components/common/single-date-picker/single-date-picker';
import { WALMART_INDEFINITE_END_DATE } from 'src/constants/advertising-walmart.constants';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import { IWalmartCampaign } from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectEditAccessFilters,
  selectEditState,
  selectInitialState,
  setEditState,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import { getCurrentDateTime } from 'src/utils';
import { getUSFormatDate } from 'src/utils/datetime.utils';
import styles from './edit-access-end-date.module.scss';

interface IEditAccessEndDateProps {
  id: string | number;
  endDate: string;
  status?: string;
}

export default function EditAccessEndDate({
  id,
  endDate,
  status,
}: IEditAccessEndDateProps) {
  const [endDateValue, setEndDateValue] = useState<string>(endDate);

  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const initialState = useAppSelector(selectInitialState) as
    | ICampaign[]
    | ISBCampaign[]
    | ISDCampaign[]
    | IOverallCampaign[]
    | IWalmartCampaign[];
  const editState = useAppSelector(selectEditState) as
    | ICampaign[]
    | ISBCampaign[]
    | ISDCampaign[]
    | IOverallCampaign[]
    | IWalmartCampaign[];
  const dispatch = useAppDispatch();
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );

  // const initialRowData = useMemo(() => {
  //   let initialData:
  //     | ISPAdvertisingData
  //     | ISBAdvertisingData
  //     | ISDAdvertisingData
  //     | IOverallAdvertisingData
  //     | IWalmartSPAdvertisingData
  //     | IWalmartSBAdvertisingData
  //     | IWalmartSVAdvertisingData
  //     | IWalmartOverallAdvertisingData
  //     | null = null;
  //   for (const element of initialState) {
  //     if (element.id === id) {
  //       initialData = element;
  //       break;
  //     }
  //   }

  //   return initialData;
  // }, [initialState, id]);

  const initialRowData = useMemo(() => {
    const initialStateMap = getAdvertisingTableMap(initialState) as Map<
      string,
      | ICampaign
      | ISBCampaign
      | ISDCampaign
      | IOverallCampaign
      | IWalmartCampaign
    >;

    return initialStateMap.get(`${id}`);
  }, [initialState, id]);

  const initialEndDate = useMemo(() => {
    if (initialRowData) {
      return initialRowData.endDate ?? '';
    }
  }, [initialRowData]);

  const isEditDisabledByReviewStatus: boolean = useMemo(() => {
    if (selectedMarketplace === MarketplaceEnum.WALMART && initialRowData) {
      return checkIsEditDisableByReviewStatus(initialRowData);
    }

    return false;
  }, [initialRowData, selectedMarketplace]);

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDateValue(event.target.value);

    const updatedTable = editState.map((row) => {
      if (row.campaignId === id) {
        return {
          ...row,
          endDate: event.target.value,
        };
      }

      return row;
    });

    dispatch(
      setEditState(
        updatedTable as
          | ICampaign[]
          | ISBCampaign[]
          | ISDCampaign[]
          | IOverallCampaign[]
          | IWalmartCampaign[]
      )
    );
  };

  const isArchived =
    status?.toUpperCase() === 'ARCHIVED' ||
    status?.toUpperCase() === 'COMPLETED';

  useEffect(() => {
    setEndDateValue(endDate);
  }, [endDate, editAccessFilters.editAccess.value]);

  return editAccessFilters.editAccess.value === EditAccessValues.View ||
    isEditDisabledByReviewStatus === true ? (
    <p className={styles.endDateView}>
      {endDate
        ? selectedMarketplace === MarketplaceEnum.WALMART
          ? new Date(endDate).getTime() <
            new Date(WALMART_INDEFINITE_END_DATE).getTime()
            ? getUSFormatDate(endDate)
            : 'Not set'
          : getUSFormatDate(endDate)
        : 'Not set'}
    </p>
  ) : (
    <div className={styles.endDateEditContainer}>
      <SingleDatePicker
        label=""
        value={endDateValue as string}
        onChange={handleEndDateChange}
        isMaxDateRequired={false}
        minDate={getCurrentDateTime().split('_')[0]}
        customStyles={{
          background: endDateValue !== initialEndDate ? '#FAEDFF' : '#fff',
        }}
        isDisabled={isArchived}
      />
    </div>
  );
}
