import { MarketplaceEnum } from '@/enums/serp.enums';
import { IWalmartOverallAdvertisingData } from '@/interfaces/advertising/walmart/walmart-overall-advertising.interface';
import { IWalmartSBAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sb-advertising.interface';
import { IWalmartSVAdvertisingData } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import { WalmartBudgetTypeEnum } from 'src/enums/walmart.enums';
import {
  IWalmartCampaign,
  IWalmartSPAdvertisingData,
} from 'src/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  IRowErrorMessage,
  selectDailyBudgetErrMessage,
  selectDailyBudgetLimitErr,
  selectEditAccessFilters,
  selectEditState,
  selectInitialState,
  selectIsOpenBudgetDialog,
  selectSelectedRowIds,
  setDailyBudgetErrMessage,
  setDailyBudgetLimitErr,
  setEditState,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import {
  displayValue,
  formatNum,
  getCurrencySymbolByCountry,
  getValidNumber,
} from 'src/utils';
import {
  checkIsEditDisableByReviewStatus,
  checkIsEqual,
  checkWalmartDailyBudgetLimit,
} from 'src/utils/advertising.utils';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import { formHelperTextStyles } from '../edit-access-bidder/edit-access-bidder-styles';
import { budgetFieldStyles } from './edit-access-budget-styles';
import styles from './edit-access-budget.module.scss';

interface IEditAccessBudgetProps {
  id: string | number;
  budget: number;
  budgetType: string;
}

export default function EditAccessDailyBudget({
  id,
  budget,
  budgetType,
}: IEditAccessBudgetProps) {
  const [budgetValue, setBudgetValue] = useState<number | typeof NaN>(budget);
  const [isBulkAction, setIsBulkAction] = useState<boolean>(false);
  const isMounted = useRef<boolean>(false);
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const initialState = useAppSelector(selectInitialState) as IWalmartCampaign[];
  const editState = useAppSelector(selectEditState) as IWalmartCampaign[];
  const errMsgObj = useAppSelector(selectDailyBudgetErrMessage);
  const limitErr = useAppSelector(selectDailyBudgetLimitErr);
  const isOpenBudgetDialog = useAppSelector(selectIsOpenBudgetDialog);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const dispatch = useAppDispatch();

  const marketplace = localStorageUtils.getAdvertisingMarketplace();
  const walmartAccount = localStorageUtils.getSelectedAdvertisingAccount();

  const initialRowData = useMemo(() => {
    let initialData:
      | IWalmartSPAdvertisingData
      | IWalmartSBAdvertisingData
      | IWalmartSVAdvertisingData
      | IWalmartOverallAdvertisingData
      | null = null;
    for (const element of initialState) {
      if (element.id === id) {
        initialData = element;
        break;
      }
    }

    return initialData;
  }, [initialState, id]);

  const isEditDisabledByReviewStatus: boolean = useMemo(() => {
    if (initialRowData) {
      return checkIsEditDisableByReviewStatus(initialRowData);
    }

    return false;
  }, [initialRowData]);

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = getValidNumber(event.target.valueAsNumber) as number;
    setBudgetValue(value);

    const updatedTable = editState.map((row) => {
      if (row.campaignId === id) {
        const dailyBudgetLimitErr = checkWalmartDailyBudgetLimit(
          marketplace as MarketplaceEnum,
          walmartAccount?.accountType,
          value
        );

        if (dailyBudgetLimitErr) {
          dispatch(
            setDailyBudgetLimitErr({
              id: id,
              message: dailyBudgetLimitErr,
            })
          );
        } else if (isNaN(value)) {
          dispatch(
            setDailyBudgetLimitErr({
              id: id,
              message: 'Daily Budget cannot be empty',
            })
          );
        } else if (
          row.totalBudget !== null &&
          row.totalBudget !== undefined &&
          value > parseFloat(`${row.totalBudget}`)
        ) {
          dispatch(
            setDailyBudgetLimitErr({
              id: id,
              message: 'Daily Budget should be lower than Total Budget.',
            })
          );
        } else {
          dispatch(
            setDailyBudgetLimitErr({
              id: id,
              message: '',
            })
          );
        }

        if (value >= 1000) {
          const errMsg: IRowErrorMessage = {
            id: id,
            message:
              'Daily Budget is unusually high. Verify to avoid overspending.',
          };

          dispatch(setDailyBudgetErrMessage(errMsg));
        } else {
          dispatch(
            setDailyBudgetErrMessage({
              id: id,
              message: '',
            })
          );
        }

        return {
          ...row,
          budgetType: row.budgetType,
          dailyBudget: value,
        };
      }

      return row;
    });

    dispatch(setEditState(updatedTable as IWalmartCampaign[]));
  };

  useEffect(() => {
    setBudgetValue(budget);
  }, [budget, editAccessFilters.editAccess.value]);

  useEffect(() => {
    if (
      editAccessFilters.editAccess.value === EditAccessValues.Edit &&
      isOpenBudgetDialog
    ) {
      setIsBulkAction(true);
    }

    return () => setIsBulkAction(false);
  }, [isOpenBudgetDialog, editAccessFilters.editAccess.value]);

  useEffect(() => {
    if (isBulkAction) {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }

      editState.forEach((row) => {
        if (selectedRowIds.includes(id) && row.id === id) {
          const dailyBudgetLimitErr = checkWalmartDailyBudgetLimit(
            marketplace as MarketplaceEnum,
            walmartAccount?.accountType,
            parseFloat(`${row.dailyBudget}`)
          );

          if (dailyBudgetLimitErr) {
            dispatch(
              setDailyBudgetLimitErr({
                id: id,
                message: dailyBudgetLimitErr,
              })
            );
          } else if (isNaN(parseFloat(`${row.dailyBudget}`))) {
            dispatch(
              setDailyBudgetLimitErr({
                id: id,
                message: 'Daily Budget cannot be empty',
              })
            );
          } else if (
            row.totalBudget !== null &&
            row.totalBudget !== undefined &&
            parseFloat(`${row.dailyBudget}`) > parseFloat(`${row.totalBudget}`)
          ) {
            dispatch(
              setDailyBudgetLimitErr({
                id: id,
                message: 'Daily Budget should be lower than Total Budget.',
              })
            );
          } else {
            dispatch(
              setDailyBudgetLimitErr({
                id: id,
                message: '',
              })
            );
          }

          if (parseFloat(`${row.dailyBudget}`) >= 1000) {
            const errMsg: IRowErrorMessage = {
              id: id,
              message:
                'Daily Budget is unusually high. Verify to avoid overspending.',
            };

            dispatch(setDailyBudgetErrMessage(errMsg));
          } else {
            dispatch(
              setDailyBudgetErrMessage({
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
    dispatch,
    editState,
    id,
    isBulkAction,
    marketplace,
    walmartAccount?.accountType,
  ]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return editAccessFilters.editAccess.value === EditAccessValues.View ||
    budgetType === WalmartBudgetTypeEnum.TOTAL ||
    isEditDisabledByReviewStatus === true ? (
    <p className={styles.budgetView}>
      {displayValue(formatNum(budget), false)}
    </p>
  ) : (
    <TextField
      type="number"
      value={budgetValue}
      sx={{
        ...budgetFieldStyles,
        '& .MuiOutlinedInput-root': {
          borderRadius: '0',
          fontSize: '1.2rem',
          fontWeight: 500,
          paddingLeft: '0.5em',
          background: !checkIsEqual(initialRowData?.dailyBudget, budgetValue)
            ? '#FAEDFF'
            : '#fff',
        },
      }}
      variant="outlined"
      onChange={handleBudgetChange}
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
