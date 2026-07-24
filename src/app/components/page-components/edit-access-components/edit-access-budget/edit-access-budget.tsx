import { MarketplaceEnum } from '@/enums/serp.enums';
import { IOverallCampaign } from '@/interfaces/advertising/amazon/overall-advertising.interface';
import { ISBCampaign } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDCampaign } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { ICampaign } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  checkAmazonBudgetLimit,
  checkIsCampaignActiveForEdit,
  checkIsEqual,
  getAdvertisingTableMap,
  hasAmazonSPBudgetProp,
  hasBudgetProp,
} from '@/utils/advertising.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { FormHelperText } from '@mui/material';
import TextField from '@mui/material/TextField';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { EditAccessValues } from 'src/enums/edit-access.enums';
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
import { selectAdvertisingHeaderFilters } from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  displayValue,
  formatNum,
  getCurrencySymbolByCountry,
  getValidNumber,
} from 'src/utils';
import { formHelperTextStyles } from '../edit-access-bidder/edit-access-bidder-styles';
import { budgetFieldStyles } from './edit-access-budget-styles';
import styles from './edit-access-budget.module.scss';

interface IEditAccessBudgetProps {
  id: string | number;
  budget: number;
  endDate: string;
  budgetType: string;
}

export default function EditAccessBudget({
  id,
  budget,
  endDate,
  budgetType,
}: IEditAccessBudgetProps) {
  const [budgetValue, setBudgetValue] = useState<number | typeof NaN>(budget);
  const [isBulkAction, setIsBulkAction] = useState<boolean>(false);
  const isMounted = useRef<boolean>(false);

  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const initialState = useAppSelector(selectInitialState) as
    | ICampaign[]
    | ISBCampaign[]
    | ISDCampaign[]
    | IOverallCampaign[];
  const editState = useAppSelector(selectEditState) as
    | ICampaign[]
    | ISBCampaign[]
    | ISDCampaign[]
    | IOverallCampaign[];
  const errMsgObj = useAppSelector(selectDailyBudgetErrMessage);
  const limitErr = useAppSelector(selectDailyBudgetLimitErr);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const isOpenBudgetDialog = useAppSelector(selectIsOpenBudgetDialog);
  const dispatch = useAppDispatch();

  const selectedAdvertisingAccount =
    localStorageUtils.getSelectedAdvertisingAccount();
  const selectedAccountType = useMemo(() => {
    if (
      selectedAdvertisingAccount &&
      selectedAdvertisingAccount.marketplace === MarketplaceEnum.AMAZON
    ) {
      return selectedAdvertisingAccount.accountType;
    } else {
      return undefined;
    }
  }, [selectedAdvertisingAccount]);

  const initialRowData = useMemo(() => {
    const initialStateMap = getAdvertisingTableMap(initialState) as Map<
      string,
      ICampaign | ISBCampaign | ISDCampaign | IOverallCampaign
    >;

    return initialStateMap.get(`${id}`);
  }, [initialState, id]);

  const initialBudget = useMemo(() => {
    if (initialRowData) {
      if (hasAmazonSPBudgetProp(initialRowData))
        return initialRowData.budget.budget;

      if (hasBudgetProp(initialRowData)) return initialRowData.budget;
    }
  }, [initialRowData]);

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = getValidNumber(event.target.valueAsNumber) as number;
    setBudgetValue(value);

    const updatedTable = editState.map((row) => {
      if (row.campaignId === id) {
        const budgetLimitErr = checkAmazonBudgetLimit(
          value,
          advHeaderFilters.adType.value,
          selectedAccountType,
          budgetType,
          MarketplaceEnum.AMAZON
        );

        if (budgetLimitErr) {
          dispatch(
            setDailyBudgetLimitErr({
              id: id,
              message: budgetLimitErr,
            })
          );
        } else if (isNaN(value)) {
          dispatch(
            setDailyBudgetLimitErr({
              id: id,
              message: 'Budget cannot be empty',
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

        if (value >= 10000) {
          const errMsg: IRowErrorMessage = {
            id: id,
            message: 'Budget is unusually high. Verify to avoid overspending.',
          };
          dispatch(setDailyBudgetErrMessage(errMsg));
        } else {
          const errMsg: IRowErrorMessage = {
            id: id,
            message: '',
          };
          dispatch(setDailyBudgetErrMessage(errMsg));
        }

        return {
          ...row,
          budget: hasAmazonSPBudgetProp(row)
            ? {
                budgetType: row.budget.budgetType,
                budget: getValidNumber(event.target.valueAsNumber),
              }
            : getValidNumber(event.target.valueAsNumber),
        };
      }

      return row;
    });

    dispatch(setEditState(updatedTable as ICampaign[]));
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
        const editRowBudget = hasAmazonSPBudgetProp(row)
          ? row.budget.budget
          : row.budget;

        if (selectedRowIds.includes(id) && row.campaignId === id) {
          const budgetLimitErr = checkAmazonBudgetLimit(
            parseFloat(`${editRowBudget}`),
            advHeaderFilters.adType.value,
            selectedAccountType,
            budgetType,
            MarketplaceEnum.AMAZON
          );

          if (budgetLimitErr) {
            dispatch(
              setDailyBudgetLimitErr({
                id: id,
                message: budgetLimitErr,
              })
            );
          } else if (isNaN(parseFloat(`${editRowBudget}`))) {
            dispatch(
              setDailyBudgetLimitErr({
                id: id,
                message: 'Budget cannot be empty',
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

          if (parseFloat(`${editRowBudget}`) >= 10000) {
            const errMsg: IRowErrorMessage = {
              id: id,
              message:
                'Budget is unusually high. Verify to avoid overspending.',
            };
            dispatch(setDailyBudgetErrMessage(errMsg));
          } else {
            const errMsg: IRowErrorMessage = {
              id: id,
              message: '',
            };
            dispatch(setDailyBudgetErrMessage(errMsg));
          }
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [
    advHeaderFilters.adType.value,
    budgetType,
    dispatch,
    editState,
    id,
    isBulkAction,
    selectedAccountType,
  ]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return editAccessFilters.editAccess.value === EditAccessValues.View ||
    checkIsCampaignActiveForEdit(endDate) === false ? (
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
          background: !checkIsEqual(initialBudget, budgetValue)
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
  );
}
