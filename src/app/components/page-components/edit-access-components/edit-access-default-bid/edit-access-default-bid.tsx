import { AdType } from '@/enums/advertising.enums';
import { ISDAdGroup } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import {
  IAdGroup,
  ISPAdvertisingData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect, useRef, useState } from 'react';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
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
  checkIsEqual,
  hasCostTypeProp,
  hasCreativeTypeProp,
} from 'src/utils/advertising.utils';
import { formHelperTextStyles } from '../edit-access-bidder/edit-access-bidder-styles';
import {
  bidCellStyle,
  bidFieldStyles,
  bidTextStyle,
} from './edit-access-default-bid-styles';

interface IEditAccessDefaultBidProps {
  id: string | number;
  defaultBid: number;
  targetingType: string | undefined | null;
}

export default function EditAccessDefaultBid({
  id,
  defaultBid,
  targetingType,
}: IEditAccessDefaultBidProps) {
  const [bidValue, setBidValue] = useState<number | typeof NaN>(defaultBid);
  const [isBulkAction, setIsBulkAction] = useState<boolean>(false);
  const isMounted = useRef<boolean>(false);

  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const initialState = useAppSelector(selectInitialState) as
    | IAdGroup[]
    | ISDAdGroup[];
  const editState = useAppSelector(selectEditState) as
    | IAdGroup[]
    | ISDAdGroup[];
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const errMsgObj = useAppSelector(selectTableRowErrMessage);
  const limitErr = useAppSelector(selectBidLimitErr);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const isOpenBidDialog = useAppSelector(selectIsOpenBidDialog);
  const dispatch = useAppDispatch();

  // TODO: to solve build issue
  // const initialRowData = initialState.filter(
  //   (row) => Number(row.id) === Number(id)
  // )[0];
  let initialRowData;
  for (let i = 0; i < initialState.length; i++) {
    initialRowData = initialState[i];
    if (initialRowData.id === id) break;
  }

  const handleDefaultBidChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = getValidNumber(event.target.valueAsNumber) as number;
    setBidValue(value);

    const updatedTable = editState.map((row) => {
      if (row.id === id) {
        const rowAdType =
          advHeaderFilters.adType.value === AdType.All
            ? row.adType
            : advHeaderFilters.adType.value;

        const costType = row && hasCostTypeProp(row) ? row.costType : undefined;

        const creativeType =
          row && hasCreativeTypeProp(row) ? row.creativeType : undefined;

        const minLimitErrMsg = checkBidValueMinLimit(
          advertisingAccount.marketplace,
          rowAdType,
          targetingType,
          parseFloat(event.target.value),
          costType,
          creativeType
        );

        const maxLimitErrMsg = checkBidValueMaxLimit(
          advertisingAccount.marketplace,
          rowAdType,
          targetingType,
          parseFloat(event.target.value),
          costType,
          creativeType
        );

        if (minLimitErrMsg) {
          dispatch(
            setBidLimitErr({
              id: id,
              message: minLimitErrMsg,
            })
          );
        } else if (maxLimitErrMsg) {
          dispatch(
            setBidLimitErr({
              id: id,
              message: maxLimitErrMsg,
            })
          );
        } else if (isNaN(parseFloat(event.target.value))) {
          dispatch(
            setBidLimitErr({
              id: id,
              message: 'Bid cannot be empty.',
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
          dispatch(
            setTableRowErrMessage({
              id: id,
              message: 'Bid is unusually high. Verify to avoid overspending.',
            })
          );
        } else {
          dispatch(
            setTableRowErrMessage({
              id: id,
              message: '',
            })
          );
        }

        return {
          ...row,
          defaultBid: value,
        };
      }

      return row;
    });

    dispatch(setEditState(updatedTable as ISPAdvertisingData[]));
  };

  useEffect(() => {
    setBidValue(defaultBid);
  }, [defaultBid, editAccessFilters.editAccess.value]);

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

      editState.forEach((row: IAdGroup | ISDAdGroup) => {
        if (selectedRowIds.includes(id) && row.id === id) {
          const rowAdType =
            advHeaderFilters.adType.value === AdType.All
              ? row.adType
              : advHeaderFilters.adType.value;

          const costType =
            row && hasCostTypeProp(row) ? row.costType : undefined;

          const creativeType =
            row && hasCreativeTypeProp(row) ? row.creativeType : undefined;

          const minLimitErrMsg = checkBidValueMinLimit(
            advertisingAccount.marketplace,
            rowAdType,
            targetingType,
            parseFloat(`${row.defaultBid}`),
            costType,
            creativeType
          );

          const maxLimitErrMsg = checkBidValueMaxLimit(
            advertisingAccount.marketplace,
            rowAdType,
            targetingType,
            parseFloat(`${row.defaultBid}`),
            costType,
            creativeType
          );

          if (minLimitErrMsg) {
            dispatch(
              setBidLimitErr({
                id: id,
                message: minLimitErrMsg,
              })
            );
          } else if (maxLimitErrMsg) {
            dispatch(
              setBidLimitErr({
                id: id,
                message: maxLimitErrMsg,
              })
            );
          } else if (isNaN(parseFloat(`${row.defaultBid}`))) {
            dispatch(
              setBidLimitErr({
                id: id,
                message: 'Bid cannot be empty.',
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

          if (parseFloat(`${row.defaultBid}`) >= 2) {
            dispatch(
              setTableRowErrMessage({
                id: id,
                message: 'Bid is unusually high. Verify to avoid overspending.',
              })
            );
          } else {
            dispatch(
              setTableRowErrMessage({
                id: id,
                message: '',
              })
            );
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
    targetingType,
    isBulkAction,
  ]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return editAccessFilters.editAccess.value === EditAccessValues.View ? (
    <div style={bidCellStyle}>
      <span style={bidTextStyle}>
        {displayValue(formatNum(defaultBid), false)}
      </span>
    </div>
  ) : (
    <TextField
      type="number"
      value={bidValue}
      sx={{
        ...bidFieldStyles,
        background:
          Number(initialRowData?.defaultBid) !== Number(bidValue)
            ? '#FAEDFF'
            : '#fff',
        '& .MuiOutlinedInput-root': {
          borderRadius: '0',
          fontSize: '1.2rem',
          fontWeight: 500,
          paddingLeft: '0.5em',
          background: !checkIsEqual(initialRowData?.defaultBid, bidValue)
            ? '#FAEDFF'
            : '#fff',
        },
      }}
      variant="outlined"
      onChange={handleDefaultBidChange}
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
  );
}
