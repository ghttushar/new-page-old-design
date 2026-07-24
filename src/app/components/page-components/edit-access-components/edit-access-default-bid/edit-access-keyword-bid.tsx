import { AdType } from '@/enums/advertising.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import {
  IWalmartKeywords,
  IWalmartSPAdvertisingData,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  IRowErrorMessage,
  selectBidLimitErr,
  selectEditAccessFilters,
  selectEditState,
  selectInitialState,
  selectIsOpenBidDialog,
  selectSelectedRowIds,
  selectTableRowErrMessage,
  setBidLimitErr,
  setEditState,
  setTableRowErrMessage,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { selectAdvertisingHeaderFilters } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  displayValue,
  formatNum,
  getCurrencySymbolByCountry,
  getValidNumber,
} from 'src/utils';
import {
  checkBidValueMaxLimit,
  checkBidValueMinLimit,
  checkIsEditDisableByReviewStatus,
  checkIsEqual,
} from 'src/utils/advertising.utils';
import { formHelperTextStyles } from '../edit-access-bidder/edit-access-bidder-styles';
import {
  bidCellStyle,
  bidTextStyle,
  walmartBidFieldStyles,
} from './edit-access-default-bid-styles';

interface IEditAccessKeywordBidProps {
  id: string | number;
  keywordBid: number;
  targetingType: string | undefined | null;
}

export default function EditAccessKeywordBid({
  id,
  keywordBid,
  targetingType,
}: IEditAccessKeywordBidProps) {
  const [bidValue, setBidValue] = useState<number | string>(keywordBid);
  const [isBulkAction, setIsBulkAction] = useState<boolean>(false);
  const isMounted = useRef<boolean>(false);

  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const initialState = useAppSelector(selectInitialState) as IWalmartKeywords[];
  const editState = useAppSelector(selectEditState) as IWalmartKeywords[];
  const errMsgObj = useAppSelector(selectTableRowErrMessage);
  const limitErr = useAppSelector(selectBidLimitErr);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const isOpenBidDialog = useAppSelector(selectIsOpenBidDialog);
  const dispatch = useAppDispatch();

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );

  const initialRowData = initialState.find((row) => row.id === id);

  const isEditDisabledByReviewStatus: boolean = useMemo(() => {
    if (selectedMarketplace === MarketplaceEnum.WALMART && initialRowData) {
      return checkIsEditDisableByReviewStatus(initialRowData);
    }

    return false;
  }, [initialRowData, selectedMarketplace]);

  const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = getValidNumber(event.target.valueAsNumber) as number;
    setBidValue(value);

    const updatedTable = editState.map((row) => {
      if (row.id === id) {
        const rowAdType =
          advHeaderFilters.adType.value === AdType.All
            ? row.adType
            : advHeaderFilters.adType.value;

        const minLimitErrMsg = checkBidValueMinLimit(
          advertisingAccount.marketplace,
          rowAdType,
          targetingType,
          parseFloat(event.target.value)
        );

        const maxLimitErrMsg = checkBidValueMaxLimit(
          advertisingAccount.marketplace,
          rowAdType,
          targetingType,
          parseFloat(event.target.value)
        );

        if (minLimitErrMsg) {
          dispatch(
            setBidLimitErr({
              id: id,
              message: `Keyword ${minLimitErrMsg}`,
            })
          );
        } else if (maxLimitErrMsg) {
          dispatch(
            setBidLimitErr({
              id: id,
              message: `Keyword ${maxLimitErrMsg}`,
            })
          );
        } else if (isNaN(parseFloat(event.target.value))) {
          dispatch(
            setBidLimitErr({
              id: id,
              message: 'Keyword Bid cannot be empty.',
            })
          );
        } else {
          dispatch(
            setBidLimitErr({
              id: id,
              message: '',
            })
          );
        }

        if (parseFloat(event.target.value) >= 4) {
          const errMsg: IRowErrorMessage = {
            id: id,
            message:
              'Keyword Bid is unusually high. Verify to avoid overspending',
          };
          dispatch(setTableRowErrMessage(errMsg));
        } else {
          dispatch(setTableRowErrMessage({ id: id, message: '' }));
        }

        return {
          ...row,
          bid: value,
        };
      }

      return row;
    });

    dispatch(setEditState(updatedTable as IWalmartSPAdvertisingData[]));
  };

  useEffect(() => {
    setBidValue(keywordBid);
  }, [keywordBid, editAccessFilters.editAccess.value]);

  useEffect(() => {
    if (
      editAccessFilters.editAccess.value === EditAccessValues.Edit &&
      isOpenBidDialog
    ) {
      setIsBulkAction(true);
    }

    return () => setIsBulkAction(false);
  }, [isOpenBidDialog, editAccessFilters.editAccess.value]);

  useEffect(() => {
    if (isBulkAction) {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }

      editState.forEach((row) => {
        if (selectedRowIds.includes(id) && row.id === id) {
          const rowAdType =
            advHeaderFilters.adType.value === AdType.All
              ? row.adType
              : advHeaderFilters.adType.value;

          const minLimitErrMsg = checkBidValueMinLimit(
            advertisingAccount.marketplace,
            rowAdType,
            targetingType,
            parseFloat(`${row.bid}`)
          );

          const maxLimitErrMsg = checkBidValueMaxLimit(
            advertisingAccount.marketplace,
            rowAdType,
            targetingType,
            parseFloat(`${row.bid}`)
          );

          if (minLimitErrMsg) {
            dispatch(
              setBidLimitErr({
                id: id,
                message: `Keyword ${minLimitErrMsg}`,
              })
            );
          } else if (maxLimitErrMsg) {
            dispatch(
              setBidLimitErr({
                id: id,
                message: `Keyword ${maxLimitErrMsg}`,
              })
            );
          } else if (isNaN(parseFloat(`${row.bid}`))) {
            dispatch(
              setBidLimitErr({
                id: id,
                message: 'Keyword Bid cannot be empty.',
              })
            );
          } else {
            dispatch(
              setBidLimitErr({
                id: id,
                message: '',
              })
            );
          }

          if (parseFloat(`${row.bid}`) >= 4) {
            const errMsg: IRowErrorMessage = {
              id: id,
              message:
                'Keyword Bid is unusually high. Verify to avoid overspending',
            };
            dispatch(setTableRowErrMessage(errMsg));
          } else {
            dispatch(setTableRowErrMessage({ id: id, message: '' }));
          }
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [
    advHeaderFilters.adType.value,
    advertisingAccount.marketplace,
    dispatch,
    editState,
    id,
    isBulkAction,
    targetingType,
    selectedRowIds,
  ]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return editAccessFilters.editAccess.value === EditAccessValues.View ||
    isEditDisabledByReviewStatus === true ? (
    <div style={bidCellStyle}>
      <span style={bidTextStyle}>
        {displayValue(formatNum(keywordBid), false)}
      </span>
    </div>
  ) : (
    <div style={{ ...bidCellStyle, flexDirection: 'column' }}>
      <TextField
        type="number"
        value={bidValue}
        sx={{
          ...walmartBidFieldStyles,
          background: !checkIsEqual(initialRowData?.bid, bidValue)
            ? '#FAEDFF'
            : '#fff',
        }}
        variant="outlined"
        onChange={handleBidChange}
        onKeyDown={handleInputKeyDown}
        InputProps={{
          inputProps: {
            min: 0,
            step: 0.01,
            inputMode: 'decimal',
          },
          startAdornment: getCurrencySymbolByCountry(),
        }}
        helperText={
          limitErr !== undefined && limitErr[id] ? (
            <FormHelperText
              sx={{
                ...formHelperTextStyles,
              }}
            >
              {limitErr[id]?.message ?? ''}
            </FormHelperText>
          ) : errMsgObj !== undefined && errMsgObj[id] ? (
            <FormHelperText
              sx={{
                ...formHelperTextStyles,
                color: 'orange',
              }}
            >
              {errMsgObj[id]?.message ?? ''}
            </FormHelperText>
          ) : (
            ''
          )
        }
      />
    </div>
  );
}
