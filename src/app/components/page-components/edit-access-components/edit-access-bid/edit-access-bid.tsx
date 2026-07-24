import { AdType } from '@/enums/advertising.enums';
import {
  IOverallKeywordTargeting,
  IOverallProductTargeting,
} from '@/interfaces/advertising/amazon/overall-advertising.interface';
import {
  ISBKeywordTargeting,
  ISBProductTargeting,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import {
  IAutoTargeting,
  IKeywordTargeting,
  IProductTargeting,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditAccessValues } from 'src/enums/edit-access.enums';
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
  setEditStateRow,
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
  getAdvertisingTableMap,
  hasCostTypeProp,
  hasCreativeTypeProp,
} from 'src/utils/advertising.utils';
import { formHelperTextStyles } from '../edit-access-bidder/edit-access-bidder-styles';
import {
  bidCellStyle,
  bidFieldStyles,
  bidTextStyle,
} from './edit-access-bid-styles';

interface IEditAccessBidProps {
  id: string | number;
  bid: number;
  targetingType: string | undefined | null;
}

export default function EditAccessBid({
  id,
  bid,
  targetingType,
}: IEditAccessBidProps) {
  const [bidValue, setBidValue] = useState<number | typeof NaN>(bid);
  const [isBulkAction, setIsBulkAction] = useState<boolean>(false);
  const isMounted = useRef<boolean>(false);

  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const errMsgObj = useAppSelector(selectTableRowErrMessage);
  const initialState = useAppSelector(selectInitialState) as
    | IKeywordTargeting[]
    | IProductTargeting[]
    | IAutoTargeting[]
    | ISBKeywordTargeting[]
    | ISBProductTargeting[]
    | IOverallKeywordTargeting[]
    | IOverallProductTargeting[];
  const editState = useAppSelector(selectEditState) as
    | IKeywordTargeting[]
    | IProductTargeting[]
    | IAutoTargeting[]
    | ISBKeywordTargeting[]
    | ISBProductTargeting[]
    | IOverallKeywordTargeting[]
    | IOverallProductTargeting[];
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const limitErr = useAppSelector(selectBidLimitErr);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const isOpenBidDialog = useAppSelector(selectIsOpenBidDialog);
  const dispatch = useAppDispatch();

  const initialRowMap = useMemo(() => {
    return getAdvertisingTableMap(initialState) as Map<
      string,
      | IKeywordTargeting
      | IProductTargeting
      | IAutoTargeting
      | ISBKeywordTargeting
      | ISBProductTargeting
      | IOverallKeywordTargeting
      | IOverallProductTargeting
    >;
  }, [initialState]);

  const editRowMap = useMemo(() => {
    return getAdvertisingTableMap(editState) as Map<
      string,
      | IKeywordTargeting
      | IProductTargeting
      | IAutoTargeting
      | ISBKeywordTargeting
      | ISBProductTargeting
      | IOverallKeywordTargeting
      | IOverallProductTargeting
    >;
  }, [editState]);

  const initialBid = useMemo(() => {
    return initialRowMap.get(`${id}`)?.bid;
  }, [initialRowMap, id]);

  const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = getValidNumber(event.target.valueAsNumber) as number;
    setBidValue(value);

    const initialRowData = initialRowMap.get(`${id}`);
    const editRowData = editRowMap.get(`${id}`);
    let editedRow: typeof editRowData | null = null;

    if (initialRowData && editRowData) {
      const rowAdType =
        advHeaderFilters.adType.value === AdType.All
          ? initialRowData.adType
          : advHeaderFilters.adType.value;

      const costType = hasCostTypeProp(editRowData)
        ? editRowData.costType
        : undefined;

      const creativeType = hasCreativeTypeProp(editRowData)
        ? editRowData.creativeType
        : undefined;

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
        const errMsg: IRowErrorMessage = {
          id: id,
          message: 'Bid is unusually high. Verify to avoid overspending',
        };
        dispatch(setTableRowErrMessage(errMsg));
      } else {
        const errMsg: IRowErrorMessage = {
          id: id,
          message: '',
        };
        dispatch(setTableRowErrMessage(errMsg));
      }

      editedRow = {
        ...editRowData,
        bid: value,
      };
    }

    if (editedRow) {
      dispatch(
        setEditStateRow({
          id: `${id}`,
          row: editedRow,
        })
      );
    }

    //TODO: keeping this logic if in case the new logic doesn't work. Will delete eventually
    // const updatedTable = editState.map((row) => {
    //   if (row.id === id) {
    //     const rowAdType =
    //       advHeaderFilters.adType.value === AdType.All
    //         ? row.adType
    //         : advHeaderFilters.adType.value;

    //     const minLimitErrMsg = checkBidValueMinLimit(
    //       advertisingAccount.marketplace,
    //       rowAdType,
    //       targetingType,
    //       parseFloat(event.target.value)
    //     );

    //     const maxLimitErrMsg = checkBidValueMaxLimit(
    //       advertisingAccount.marketplace,
    //       rowAdType,
    //       targetingType,
    //       parseFloat(event.target.value)
    //     );

    //     if (minLimitErrMsg) {
    //       dispatch(
    //         setBidLimitErr({
    //           id: id,
    //           message: minLimitErrMsg,
    //         })
    //       );
    //     } else if (maxLimitErrMsg) {
    //       dispatch(
    //         setBidLimitErr({
    //           id: id,
    //           message: maxLimitErrMsg,
    //         })
    //       );
    //     } else if (isNaN(parseFloat(event.target.value))) {
    //       dispatch(
    //         setBidLimitErr({
    //           id: id,
    //           message: 'Bid cannot be empty.',
    //         })
    //       );
    //     } else {
    //       dispatch(
    //         setBidLimitErr({
    //           id: id,
    //           message: '',
    //         })
    //       );
    //     }

    //     if (parseFloat(event.target.value) >= 2) {
    //       const errMsg: IRowErrorMessage = {
    //         id: id,
    //         message: 'Bid is unusually high. Verify to avoid overspending',
    //       };
    //       dispatch(setTableRowErrMessage(errMsg));
    //     } else {
    //       const errMsg: IRowErrorMessage = {
    //         id: id,
    //         message: '',
    //       };
    //       dispatch(setTableRowErrMessage(errMsg));
    //     }

    //     return {
    //       ...row,
    //       bid: value,
    //     };
    //   }

    //   return row;
    // });

    // dispatch(setEditState(updatedTable as ISPAdvertisingData[]));
  };

  useEffect(() => {
    setBidValue(bid);
  }, [bid, editAccessFilters.editAccess.value]);

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

      selectedRowIds.forEach((selectedId) => {
        const editRowData = editRowMap.get(`${selectedId}`);

        if (editRowData) {
          const rowAdType =
            advHeaderFilters.adType.value === AdType.All
              ? editRowData.adType
              : advHeaderFilters.adType.value;

          const costType = hasCostTypeProp(editRowData)
            ? editRowData.costType
            : undefined;

          const creativeType = hasCreativeTypeProp(editRowData)
            ? editRowData.creativeType
            : undefined;

          const minLimitErrMsg = checkBidValueMinLimit(
            advertisingAccount.marketplace,
            rowAdType,
            targetingType,
            parseFloat(`${editRowData.bid}`),
            costType,
            creativeType
          );

          const maxLimitErrMsg = checkBidValueMaxLimit(
            advertisingAccount.marketplace,
            rowAdType,
            targetingType,
            parseFloat(`${editRowData.bid}`),
            costType,
            creativeType
          );

          if (minLimitErrMsg) {
            dispatch(
              setBidLimitErr({
                id: selectedId,
                message: minLimitErrMsg,
              })
            );
          } else if (maxLimitErrMsg) {
            dispatch(
              setBidLimitErr({
                id: selectedId,
                message: maxLimitErrMsg,
              })
            );
          } else if (isNaN(parseFloat(`${editRowData.bid}`))) {
            dispatch(
              setBidLimitErr({
                id: selectedId,
                message: 'Bid cannot be empty.',
              })
            );
          } else {
            dispatch(
              setBidLimitErr({
                id: selectedId,
                message: '',
              })
            );
          }

          if (parseFloat(`${editRowData.bid}`) >= 2) {
            const errMsg: IRowErrorMessage = {
              id: selectedId,
              message: 'Bid is unusually high. Verify to avoid overspending',
            };
            dispatch(setTableRowErrMessage(errMsg));
          } else {
            const errMsg: IRowErrorMessage = {
              id: selectedId,
              message: '',
            };
            dispatch(setTableRowErrMessage(errMsg));
          }
        }
      });

      //TODO: keeping this logic if in case the new logic doesn't work. Will delete eventually
      // editState.forEach((row) => {
      //   if (selectedRowIds.includes(id) && row.id === id) {
      //     const rowAdType =
      //       advHeaderFilters.adType.value === AdType.All
      //         ? row.adType
      //         : advHeaderFilters.adType.value;

      //     const minLimitErrMsg = checkBidValueMinLimit(
      //       advertisingAccount.marketplace,
      //       rowAdType,
      //       targetingType,
      //       parseFloat(`${row.bid}`)
      //     );

      //     const maxLimitErrMsg = checkBidValueMaxLimit(
      //       advertisingAccount.marketplace,
      //       rowAdType,
      //       targetingType,
      //       parseFloat(`${row.bid}`)
      //     );

      //     if (minLimitErrMsg) {
      //       dispatch(
      //         setBidLimitErr({
      //           id: id,
      //           message: minLimitErrMsg,
      //         })
      //       );
      //     } else if (maxLimitErrMsg) {
      //       dispatch(
      //         setBidLimitErr({
      //           id: id,
      //           message: maxLimitErrMsg,
      //         })
      //       );
      //     } else if (isNaN(parseFloat(`${row.bid}`))) {
      //       dispatch(
      //         setBidLimitErr({
      //           id: id,
      //           message: 'Bid cannot be empty.',
      //         })
      //       );
      //     } else {
      //       dispatch(
      //         setBidLimitErr({
      //           id: id,
      //           message: '',
      //         })
      //       );
      //     }

      //     if (parseFloat(`${row.bid}`) >= 2) {
      //       const errMsg: IRowErrorMessage = {
      //         id: id,
      //         message: 'Bid is unusually high. Verify to avoid overspending',
      //       };
      //       dispatch(setTableRowErrMessage(errMsg));
      //     } else {
      //       const errMsg: IRowErrorMessage = {
      //         id: id,
      //         message: '',
      //       };
      //       dispatch(setTableRowErrMessage(errMsg));
      //     }
      //   }
      // });
    }

    return () => {
      isMounted.current = false;
    };
  }, [
    advHeaderFilters.adType.value,
    advertisingAccount.marketplace,
    dispatch,
    // editState,
    // id,
    isBulkAction,
    selectedRowIds,
    targetingType,
    editRowMap,
  ]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return editAccessFilters.editAccess.value === EditAccessValues.View ? (
    <div style={bidCellStyle}>
      <span style={bidTextStyle}>{displayValue(formatNum(bid), false)}</span>
    </div>
  ) : (
    <TextField
      type="number"
      value={bidValue}
      sx={{
        ...bidFieldStyles,
        background: !checkIsEqual(initialBid, bidValue) ? '#FAEDFF' : '#fff',
        '& .MuiOutlinedInput-root': {
          borderRadius: '0',
          fontSize: '1.2rem',
          fontWeight: 500,
          paddingLeft: '0.5em',
          paddingTop: '0.1rem',
        },
      }}
      variant="outlined"
      onChange={handleBidChange}
      onKeyDown={handleInputKeyDown}
      InputProps={{
        inputProps: {
          inputMode: 'decimal',
          min: 0,
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
