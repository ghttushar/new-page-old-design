import { AdType } from '@/enums/advertising.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import { TargetingTypeEnum } from 'src/enums/walmart.enums';
import {
  IWalmartAdItem,
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

interface IEditAccessProductBidProps {
  id: string | number;
  productBid: number;
  targetingType: string;
}

export default function EditAccessProductBid({
  id,
  productBid,
  targetingType,
}: IEditAccessProductBidProps) {
  const [bidValue, setBidValue] = useState<number | string>(productBid);
  const [isBulkAction, setIsBulkAction] = useState<boolean>(false);
  const isMounted = useRef<boolean>(false);

  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const initialState = useAppSelector(selectInitialState) as IWalmartAdItem[];
  const editState = useAppSelector(selectEditState) as IWalmartAdItem[];
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
      if (row.id === id && targetingType === TargetingTypeEnum.AUTO) {
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
              message: `Product ${minLimitErrMsg}`,
            })
          );
        } else if (maxLimitErrMsg) {
          dispatch(
            setBidLimitErr({
              id: id,
              message: `Product ${maxLimitErrMsg}`,
            })
          );
        } else if (isNaN(parseFloat(event.target.value))) {
          dispatch(
            setBidLimitErr({
              id: id,
              message: 'Product Bid cannot be empty.',
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

        if (parseFloat(event.target.value) >= 2) {
          const errMsg: IRowErrorMessage = {
            id: id,
            message:
              'Product Bid is unusually high. Verify to avoid overspending.',
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
    setBidValue(productBid);
  }, [productBid, editAccessFilters.editAccess.value]);

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
        if (
          selectedRowIds.includes(id) &&
          row.id === `${id}` &&
          targetingType === TargetingTypeEnum.AUTO
        ) {
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
                message: `Product ${minLimitErrMsg}`,
              })
            );
          } else if (maxLimitErrMsg) {
            dispatch(
              setBidLimitErr({
                id: id,
                message: `Product ${maxLimitErrMsg}`,
              })
            );
          } else if (isNaN(parseFloat(`${row.bid}`))) {
            dispatch(
              setBidLimitErr({
                id: id,
                message: 'Product Bid cannot be empty.',
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

          if (parseFloat(`${row.bid}`) >= 2) {
            const errMsg: IRowErrorMessage = {
              id: id,
              message:
                'Product Bid is unusually high. Verify to avoid overspending.',
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
    selectedRowIds,
    targetingType,
  ]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return editAccessFilters.editAccess.value === EditAccessValues.View ||
    targetingType === TargetingTypeEnum.MANUAL ||
    isEditDisabledByReviewStatus === true ? (
    <div style={bidCellStyle}>
      <span
        style={{
          ...bidTextStyle,
          textDecoration:
            targetingType === TargetingTypeEnum.MANUAL ? 'unset' : 'underline',
        }}
      >
        {displayValue(formatNum(productBid), false)}
      </span>
    </div>
  ) : (
    <div style={{ ...bidCellStyle, flexDirection: 'column', gap: '0.5rem' }}>
      <TextField
        type="number"
        value={bidValue}
        sx={{
          ...walmartBidFieldStyles,
          '& .MuiOutlinedInput-root': {
            borderRadius: '0',
            fontSize: '1.2rem',
            fontWeight: 500,
            paddingLeft: '0.5em',
            background: !checkIsEqual(initialRowData?.bid, bidValue)
              ? '#FAEDFF'
              : '#fff',
          },
        }}
        variant="outlined"
        onChange={handleBidChange}
        onKeyDown={handleInputKeyDown}
        InputProps={{
          inputProps: {
            min: 0,
            inputMode: 'decimal',
            step: 0.01,
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
