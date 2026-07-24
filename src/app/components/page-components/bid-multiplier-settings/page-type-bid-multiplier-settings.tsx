import { ICampaignPageType } from '@/interfaces/advertising/walmart/walmart-advertising.interface';
import { getWholeNumber } from '@/utils';
import { FormHelperText, InputLabel, TextField } from '@mui/material';
import React from 'react';
import { WALMART_BID_MULTIPLIER_MAX_LIMIT } from 'src/constants/advertising-filter.constants';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectBidLimitErr,
  selectTableRowErrMessage,
  setBidLimitErr,
  setTableRowErrMessage,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { isPageTypeMultiplierEditable } from 'src/utils/advertising.utils';
import InfoIcon from '../../common/info-icon/info-icon';
import { inputLabelStyles } from '../advertising-create-dialogs/advertising-create-dialogs-styles';
import { formHelperTextStyles } from '../edit-access-components/edit-access-bidder/edit-access-bidder-styles';
import {
  bidFieldBorderStyles,
  bidFieldStyles,
} from '../edit-access-components/edit-access-default-bid/edit-access-default-bid-styles';
import styles from './bid-multiplier-settings.module.scss';
import {
  getMultiplierValue,
  getPlaceHolderValue,
} from './platform-bid-multiplier-settings';

interface IPageTypeBidMultiplierSettingsProps {
  pageTypeBidMultiplierItems: ICampaignPageType[];
  handlePageTypeBidMultiplierChange: (
    updatedPageTypeBidMultiplier: ICampaignPageType[]
  ) => void;
  targetingType: string;
}

export const PageTypeBidMultiplierSettings = ({
  pageTypeBidMultiplierItems,
  handlePageTypeBidMultiplierChange,
  targetingType,
}: IPageTypeBidMultiplierSettingsProps) => {
  const dispatch = useAppDispatch();
  const limitErr = useAppSelector(selectBidLimitErr);
  const warnMsg = useAppSelector(selectTableRowErrMessage);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, valueAsNumber } = e.target;
    const value = getWholeNumber(valueAsNumber);
    const updatedValues = pageTypeBidMultiplierItems.map((item) => {
      if (item.pageType === name) {
        if (value > WALMART_BID_MULTIPLIER_MAX_LIMIT) {
          dispatch(
            setBidLimitErr({
              id: `${item.campaignId}-${name}`,
              message: `The placement bid% out of range.`,
            })
          );
        } else {
          dispatch(
            setBidLimitErr({
              id: `${item.campaignId}-${name}`,
              message: '',
            })
          );
        }

        if (value >= 100) {
          dispatch(
            setTableRowErrMessage({
              id: `${item.campaignId}-${name}`,
              message: `Placement Bid multiplier % is unusually high. Verify to avoid overspending.`,
            })
          );
        } else {
          dispatch(
            setTableRowErrMessage({
              id: `${item.campaignId}-${name}`,
              message: '',
            })
          );
        }

        return {
          ...item,
          pageTypeMultiplier: value,
        };
      }
      return item;
    });

    handlePageTypeBidMultiplierChange(updatedValues);
  };

  return (
    <div className={styles.bidMultiplierContainer}>
      {pageTypeBidMultiplierItems.map((item, index) => {
        return (
          <div
            className={styles.bidMultiplierItemContainer}
            key={`${item.campaignId}-${index}`}
            style={{
              display: isPageTypeMultiplierEditable(
                item?.pageType,
                targetingType
              )
                ? 'flex'
                : 'none',
            }}
          >
            {isPageTypeMultiplierEditable(item?.pageType, targetingType) ===
              true && (
              <React.Fragment>
                <InputLabel htmlFor={item.pageType} sx={inputLabelStyles}>
                  {item.pageType} <InfoIcon title={item.pageType} />
                </InputLabel>
                <TextField
                  type="number"
                  value={getMultiplierValue(item.pageTypeMultiplier)}
                  name={item.pageType}
                  id={item.pageType}
                  placeholder={getPlaceHolderValue(item.pageTypeMultiplier)}
                  variant="outlined"
                  sx={{
                    ...bidFieldStyles,
                    ...bidFieldBorderStyles,
                    '& .MuiOutlinedInput-input': {
                      padding: '0',
                      height: '2.5rem',
                      width: '6rem',
                    },
                  }}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: {
                      min: 0,
                      max: WALMART_BID_MULTIPLIER_MAX_LIMIT,
                      inputMode: 'decimal',
                    },
                    endAdornment: '%',
                  }}
                  error={
                    limitErr !== undefined &&
                    limitErr.hasOwnProperty(
                      `${item.campaignId}-${item.pageType}`
                    )
                  }
                  helperText={
                    limitErr !== undefined &&
                    limitErr[`${item.campaignId}-${item.pageType}`] ? (
                      <FormHelperText
                        sx={{
                          ...formHelperTextStyles,
                          fontWeight: 500,
                          maxWidth: '10rem',
                        }}
                      >
                        {limitErr[`${item.campaignId}-${item.pageType}`]
                          ?.message ?? ''}
                      </FormHelperText>
                    ) : warnMsg !== undefined &&
                      warnMsg[`${item.campaignId}-${item.pageType}`] ? (
                      <FormHelperText
                        sx={{
                          ...formHelperTextStyles,
                          color: 'orange',
                          fontWeight: 500,
                          maxWidth: '10rem',
                        }}
                      >
                        {warnMsg[`${item.campaignId}-${item.pageType}`]
                          ?.message ?? ''}
                      </FormHelperText>
                    ) : (
                      ''
                    )
                  }
                />
              </React.Fragment>
            )}
          </div>
        );
      })}
    </div>
  );
};
