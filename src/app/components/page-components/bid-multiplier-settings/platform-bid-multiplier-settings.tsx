import { ICampaignPlatform } from '@/interfaces/advertising/walmart/walmart-advertising.interface';
import { getWholeNumber } from '@/utils';
import { FormHelperText, InputLabel, TextField } from '@mui/material';
import { WALMART_BID_MULTIPLIER_MAX_LIMIT } from 'src/constants/advertising-filter.constants';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectBidLimitErr,
  selectTableRowErrMessage,
  setBidLimitErr,
  setTableRowErrMessage,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import InfoIcon from '../../common/info-icon/info-icon';
import { inputLabelStyles } from '../advertising-create-dialogs/advertising-create-dialogs-styles';
import { formHelperTextStyles } from '../edit-access-components/edit-access-bidder/edit-access-bidder-styles';
import {
  bidFieldBorderStyles,
  bidFieldStyles,
} from '../edit-access-components/edit-access-default-bid/edit-access-default-bid-styles';
import styles from './bid-multiplier-settings.module.scss';

interface IPlatformBidMultiplierSettingsProps {
  platformBidMultiplierItems: ICampaignPlatform[];
  handlePlatformBidMultiplierChange: (
    updatedPlatformBidMultiplier: ICampaignPlatform[]
  ) => void;
}

export const isMultiplierLessThanZero = (multiplier: number | string) =>
  Number(multiplier) < 0;

export const getPlaceHolderValue = (multiplier: number | string) =>
  isMultiplierLessThanZero(multiplier) ||
  multiplier === undefined ||
  isNaN(Number(multiplier))
    ? '0'
    : '';

export const getMultiplierValue = (multiplier: number | string) =>
  isMultiplierLessThanZero(multiplier) || isNaN(Number(multiplier))
    ? ''
    : multiplier;

export const PlatformBidMultiplierSettings = ({
  platformBidMultiplierItems,
  handlePlatformBidMultiplierChange,
}: IPlatformBidMultiplierSettingsProps) => {
  const dispatch = useAppDispatch();
  const limitErr = useAppSelector(selectBidLimitErr);
  const warnMsg = useAppSelector(selectTableRowErrMessage);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, valueAsNumber } = e.target;
    const value = getWholeNumber(valueAsNumber);
    const updatedValues = platformBidMultiplierItems.map((item) => {
      if (item.platform === name) {
        if (value > WALMART_BID_MULTIPLIER_MAX_LIMIT) {
          dispatch(
            setBidLimitErr({
              id: `${item.campaignId}-${name}`,
              message: `The platform bid% out of range.`,
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
              message: `Platform Bid multiplier % is unusually high. Verify to avoid overspending.`,
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
          platformMultiplier: value,
        };
      }
      return item;
    });

    handlePlatformBidMultiplierChange(updatedValues);
  };

  return (
    <div className={styles.bidMultiplierContainer}>
      {platformBidMultiplierItems.map((item, index) => (
        <div
          className={styles.bidMultiplierItemContainer}
          key={`${item.campaignId}-${index}`}
        >
          <InputLabel htmlFor={item.platform} sx={inputLabelStyles}>
            {item.platform} <InfoIcon title={item.platform} />
          </InputLabel>
          <TextField
            value={getMultiplierValue(item.platformMultiplier)}
            name={item.platform}
            type="number"
            id={item.platform}
            placeholder={getPlaceHolderValue(item.platformMultiplier)}
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
                inputMode: 'decimal',
                min: 0,
                max: WALMART_BID_MULTIPLIER_MAX_LIMIT,
              },
              endAdornment: '%',
            }}
            error={
              limitErr !== undefined &&
              limitErr.hasOwnProperty(`${item.campaignId}-${item.platform}`)
            }
            helperText={
              limitErr !== undefined &&
              limitErr[`${item.campaignId}-${item.platform}`] ? (
                <FormHelperText
                  sx={{
                    ...formHelperTextStyles,
                    fontWeight: 500,
                    maxWidth: '10rem',
                  }}
                >
                  {limitErr[`${item.campaignId}-${item.platform}`]?.message ??
                    ''}
                </FormHelperText>
              ) : warnMsg !== undefined &&
                warnMsg[`${item.campaignId}-${item.platform}`] ? (
                <FormHelperText
                  sx={{
                    ...formHelperTextStyles,
                    color: 'orange',
                    fontWeight: 500,
                    maxWidth: '10rem',
                  }}
                >
                  {warnMsg[`${item.campaignId}-${item.platform}`]?.message ??
                    ''}
                </FormHelperText>
              ) : (
                ''
              )
            }
          />
        </div>
      ))}
    </div>
  );
};
