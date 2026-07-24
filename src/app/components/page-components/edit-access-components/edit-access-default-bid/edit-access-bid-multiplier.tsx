import { WalmartAdTypeEnum } from '@/enums/walmart.enums';
import { FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { WALMART_BID_MULTIPLIER_MAX_LIMIT } from 'src/constants/advertising-filter.constants';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import {
  IWalmartPageType,
  IWalmartPlatform,
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
import { displayValue, getWholeNumber } from 'src/utils';
import {
  checkIsEqual,
  isPageTypeMultiplierEditable,
} from 'src/utils/advertising.utils';
import { formHelperTextStyles } from '../edit-access-bidder/edit-access-bidder-styles';
import {
  bidCellStyle,
  bidFieldStyles,
  bidTextStyle,
} from './edit-access-default-bid-styles';

interface IEditAccessBidMultiplierProps {
  id: string | number;
  bidMultiplier: number;
  targetingType: string;
  pageType: string;
  isPageType: boolean;
  adType: string;
}

export default function EditAccessBidMultiplier({
  id,
  bidMultiplier,
  targetingType,
  pageType,
  isPageType,
  adType,
}: IEditAccessBidMultiplierProps) {
  const [bidValue, setBidValue] = useState<string | typeof NaN>(bidMultiplier);
  const [isBulkAction, setIsBulkAction] = useState<boolean>(false);
  const isMounted = useRef<boolean>(false);

  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const errMsgObj = useAppSelector(selectTableRowErrMessage);
  const limitErr = useAppSelector(selectBidLimitErr);
  const initialState = useAppSelector(selectInitialState) as
    | IWalmartPageType[]
    | IWalmartPlatform[];
  const editState = useAppSelector(selectEditState) as
    | IWalmartPageType[]
    | IWalmartPlatform[];
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const isOpenBidDialog = useAppSelector(selectIsOpenBidDialog);
  const dispatch = useAppDispatch();

  let initialRowData;
  for (let i = 0; i < initialState.length; i++) {
    initialRowData = initialState[i];
    if (initialRowData.id === id) break;
  }

  const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = getWholeNumber(event.target.valueAsNumber);
    setBidValue(value);

    const updatedTable = editState.map((row) => {
      if (row.id === id) {
        if (value > WALMART_BID_MULTIPLIER_MAX_LIMIT) {
          const errMsg: IRowErrorMessage = {
            id: id,
            message: `The ${
              isPageType ? 'placement' : 'platform'
            } bid% out of range.`,
          };
          dispatch(setBidLimitErr(errMsg));
        } else {
          const errMsg: IRowErrorMessage = {
            id: id,
            message: '',
          };
          dispatch(setBidLimitErr(errMsg));
        }

        if (value >= 100) {
          const errMsg: IRowErrorMessage = {
            id: id,
            message: `${
              isPageType ? 'Placement' : 'Platform'
            } Bid multiplier % is unusually high. Verify to avoid overspending.`,
          };
          dispatch(setTableRowErrMessage(errMsg));
        } else {
          const errMsg: IRowErrorMessage = {
            id: id,
            message: '',
          };
          dispatch(setTableRowErrMessage(errMsg));
        }
        return {
          ...row,
          multiplier: value,
        };
      }

      return row;
    });

    dispatch(
      setEditState(updatedTable as IWalmartPageType[] | IWalmartPlatform[])
    );
  };

  useEffect(() => {
    setBidValue(bidMultiplier);
  }, [bidMultiplier, editAccessFilters.editAccess.value]);

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
          if (
            parseFloat(`${row.multiplier}`) > WALMART_BID_MULTIPLIER_MAX_LIMIT
          ) {
            const errMsg: IRowErrorMessage = {
              id: id,
              message: `The ${
                isPageType ? 'placement' : 'platform'
              } bid% out of range.`,
            };
            dispatch(setBidLimitErr(errMsg));
          } else {
            const errMsg: IRowErrorMessage = {
              id: id,
              message: '',
            };
            dispatch(setBidLimitErr(errMsg));
          }

          if (parseFloat(`${row.multiplier}`) >= 100) {
            const errMsg: IRowErrorMessage = {
              id: id,
              message: `${
                isPageType ? 'Placement' : 'Platform'
              } Bid multiplier % is unusually high. Verify to avoid overspending.`,
            };
            dispatch(setTableRowErrMessage(errMsg));
          } else {
            const errMsg: IRowErrorMessage = {
              id: id,
              message: '',
            };
            dispatch(setTableRowErrMessage(errMsg));
          }
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [dispatch, editState, id, isBulkAction, isPageType, selectedRowIds]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  const isMultiplierEditable = useMemo(() => {
    return (
      isPageType === false ||
      (isPageType === true &&
        isPageTypeMultiplierEditable(pageType, targetingType))
    );
  }, [isPageType, pageType, targetingType]);

  return !isMultiplierEditable ||
    adType === WalmartAdTypeEnum.SPONSORED_BRANDS ||
    adType === WalmartAdTypeEnum.SPONSORED_VIDEO ? (
    <div style={bidCellStyle}>
      <span
        style={{
          ...bidTextStyle,
        }}
      >
        -
      </span>
    </div>
  ) : editAccessFilters.editAccess.value === EditAccessValues.View ? (
    <div style={bidCellStyle}>
      <span
        style={{
          ...bidTextStyle,
        }}
      >
        {displayValue(bidMultiplier)}
      </span>
    </div>
  ) : (
    <TextField
      type="number"
      value={bidValue}
      sx={{
        ...bidFieldStyles,

        '& .MuiOutlinedInput-root': {
          borderRadius: '0',
          fontSize: '1.2rem',
          fontWeight: 500,
          paddingLeft: '0.5em',
          paddingTop: '0.1rem',
          backgroundColor:
            initialRowData?.multiplier !== null &&
            initialRowData?.multiplier !== undefined &&
            !checkIsEqual(initialRowData?.multiplier, bidValue)
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
          step: 1,
        },
        startAdornment: '%',
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
  );
}
