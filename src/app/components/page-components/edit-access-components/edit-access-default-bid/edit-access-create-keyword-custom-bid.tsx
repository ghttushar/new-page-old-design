import { ISBAdGroup } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDAdGroup } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { IAdGroup } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartAdGroup } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVAdGroup } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import {
  checkBidValueMaxLimit,
  checkBidValueMinLimit,
  hasCostTypeProp,
  hasCreativeTypeProp,
} from '@/utils/advertising.utils';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import React, { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  IRowErrorMessage,
  selectBidLimitErr,
  selectTableRowErrMessage,
  setBidLimitErr,
  setTableRowErrMessage,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { getCurrencySymbolByCountry, getValidNumber } from 'src/utils';
import { formHelperTextStyles } from '../edit-access-bidder/edit-access-bidder-styles';
import { bidFieldStyles } from './edit-access-default-bid-styles';

interface ICreateKeywordCustomBidProps {
  id: string | number;
  bid: number;
  selectedAdGroup:
    | IWalmartAdGroup
    | IAdGroup
    | ISBAdGroup
    | ISDAdGroup
    | IWalmartSVAdGroup
    | null;
  updateFunction: (
    id: string | number,
    customBid: number | typeof NaN | undefined,
    status: string | undefined
  ) => void;
}

export default function CreateKeywordCustomBid({
  id,
  bid,
  selectedAdGroup,
  updateFunction,
}: ICreateKeywordCustomBidProps) {
  const [bidValue, setBidValue] = useState<number | typeof NaN>(bid);

  const errMsgObj = useAppSelector(selectTableRowErrMessage);
  const limitErr = useAppSelector(selectBidLimitErr);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const dispatch = useAppDispatch();

  const adType = useMemo(
    () => advHeaderFilters.adType.value,
    [advHeaderFilters.adType.value]
  );

  const costType = useMemo(() => {
    if (selectedAdGroup && hasCostTypeProp(selectedAdGroup))
      return selectedAdGroup.costType;
    else return undefined;
  }, [selectedAdGroup]);

  const creativeType = useMemo(() => {
    if (selectedAdGroup && hasCreativeTypeProp(selectedAdGroup))
      return selectedAdGroup.creativeType;
    else return undefined;
  }, [selectedAdGroup]);

  const targetingType = useMemo(() => {
    if (selectedAdGroup) return selectedAdGroup.targetingType;
    else return undefined;
  }, [selectedAdGroup]);

  const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = getValidNumber(event.target.valueAsNumber) as number;
    setBidValue(value);

    const minLimitErrMsg = checkBidValueMinLimit(
      advertisingAccount.marketplace,
      adType,
      targetingType,
      parseFloat(event.target.value),
      costType,
      creativeType
    );

    const maxLimitErrMsg = checkBidValueMaxLimit(
      advertisingAccount.marketplace,
      adType,
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
    updateFunction(`${id}`, value, undefined);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  return (
    <TextField
      type="number"
      value={bidValue}
      sx={{
        ...bidFieldStyles,
        width: '8rem',
        'input[type=number]': {
          marginLeft: 0,
        },
        '& .MuiOutlinedInput-input': {
          padding: '0 0 0 5px',
          height: '3rem',
        },
      }}
      variant="outlined"
      onChange={handleBidChange}
      onKeyDown={handleInputKeyDown}
      InputProps={{
        startAdornment: getCurrencySymbolByCountry(),
        inputMode: 'decimal',
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
