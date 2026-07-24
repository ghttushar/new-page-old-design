import { IRulesValidation } from '@/interfaces/rules/rules.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectIsRuleArchived,
  selectIsRuleFormLoading,
  selectRuleBasicFilters,
  selectRulesValidation,
  setRuleBasicFilters,
  setRulesValidation,
} from '@/redux/slices/rules/rules.slice';
import { getValidNumber } from '@/utils';
import { numberFieldBasicValidation } from '@/utils/validations.utils';
import { OutlinedInput } from '@mui/material';
import { InfoIcon } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';
import { textboxNewStyles } from '../../rules-page-form-styles';
import styles from './rules-bidder-form.module.scss';

export default function RulesBidderPageForm() {
  const isMount = useRef(false);
  const isDirty = useRef(false);
  const dispatch = useAppDispatch();
  const selectedRuleBasicFilters = useAppSelector(selectRuleBasicFilters);
  const ruleValidations = useAppSelector(selectRulesValidation);
  const isRuleFormLoading = useAppSelector(selectIsRuleFormLoading);
  const isRuleArchived = useAppSelector(selectIsRuleArchived);

  // Reset dirty flag whenever a new template/rule starts loading — keeps it decoupled from the validation effect
  useEffect(() => {
    if (isRuleFormLoading) {
      isDirty.current = false;
    }
  }, [isRuleFormLoading]);

  useEffect(() => {
    if (!isMount.current) {
      isMount.current = true;
      return;
    }

    if (isRuleFormLoading) return;

    if (!isDirty.current) return; // don't validate until user has interacted with a field

    const advanced = selectedRuleBasicFilters.advancedSettings;
    if (!advanced) {
      if (ruleValidations) {
        const nextValidations: IRulesValidation = {
          ...ruleValidations,
          minBid: undefined,
          maxBid: undefined,
          troas: undefined,
        };

        const hasAnyError = Object.values(nextValidations).some(
          (val) => typeof val === 'string'
        );

        dispatch(setRulesValidation(hasAnyError ? nextValidations : null));
      }
      return;
    }

    const { minBid, maxBid, troas } = advanced;

    const bidderErrors: Pick<IRulesValidation, 'minBid' | 'maxBid' | 'troas'> =
      {};

    bidderErrors.minBid = numberFieldBasicValidation(minBid, 'Min Bid');
    bidderErrors.maxBid = numberFieldBasicValidation(maxBid, 'Max Bid');
    bidderErrors.troas = numberFieldBasicValidation(troas, 'TROAS');

    if (
      typeof minBid === 'number' &&
      typeof maxBid === 'number' &&
      Number.isFinite(minBid) &&
      Number.isFinite(maxBid) &&
      minBid >= maxBid
    ) {
      bidderErrors.minBid = 'Min bid should be lower than Max bid';
      bidderErrors.maxBid = 'Max bid should be higher than Min bid';
    }

    if (
      bidderErrors.minBid === undefined &&
      bidderErrors.maxBid === undefined &&
      bidderErrors.troas === undefined
    ) {
      if (ruleValidations) {
        const nextValidations: IRulesValidation = {
          ...ruleValidations,
          minBid: undefined,
          maxBid: undefined,
          troas: undefined,
        };

        const hasAnyError = Object.values(nextValidations).some(
          (val) => typeof val === 'string'
        );

        dispatch(setRulesValidation(hasAnyError ? nextValidations : null));
      }
    } else {
      const nextValidations: IRulesValidation = {
        ...ruleValidations,
        minBid: undefined,
        maxBid: undefined,
        troas: undefined,
        ...bidderErrors,
      };

      const hasAnyError = Object.values(nextValidations).some(
        (val) => typeof val === 'string'
      );

      dispatch(setRulesValidation(hasAnyError ? nextValidations : null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRuleBasicFilters.advancedSettings, dispatch]);

  const handleMinBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    isDirty.current = true;
    const minBid = getValidNumber(event.target.valueAsNumber);

    dispatch(
      setRuleBasicFilters({
        ...selectedRuleBasicFilters,
        advancedSettings: {
          ...selectedRuleBasicFilters.advancedSettings,
          minBid:
            typeof minBid === 'number' && Number.isFinite(minBid)
              ? minBid
              : NaN,
        },
      })
    );
  };
  const handleMaxBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    isDirty.current = true;
    const maxBid = getValidNumber(event.target.valueAsNumber);

    dispatch(
      setRuleBasicFilters({
        ...selectedRuleBasicFilters,
        advancedSettings: {
          ...selectedRuleBasicFilters.advancedSettings,
          maxBid:
            typeof maxBid === 'number' && Number.isFinite(maxBid)
              ? maxBid
              : NaN,
        },
      })
    );
  };
  const handleTroasChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    isDirty.current = true;
    const troas = getValidNumber(event.target.valueAsNumber);

    dispatch(
      setRuleBasicFilters({
        ...selectedRuleBasicFilters,
        advancedSettings: {
          ...selectedRuleBasicFilters.advancedSettings,
          troas:
            typeof troas === 'number' && Number.isFinite(troas) ? troas : NaN,
        },
      })
    );
  };

  return (
    <div className={styles.bidderSettingsContainer}>
      <p className={styles.infoContainerTitle}>Bidder Settings</p>

      <div className={styles.optionsAction}>
        <div className={styles.fieldContainer}>
          <p className={styles.fieldTitle}>Min Bid</p>
          <OutlinedInput
            type="number"
            onChange={handleMinBidChange}
            value={
              Number.isFinite(selectedRuleBasicFilters.advancedSettings?.minBid)
                ? selectedRuleBasicFilters.advancedSettings?.minBid
                : ''
            }
            placeholder="00"
            sx={{
              ...textboxNewStyles,
              height: '3.2rem',
              display: 'flex',
            }}
            slotProps={{
              input: {
                min: 0,
                step: 0.01,
                inputMode: 'decimal',
              },
            }}
            error={
              isRuleArchived === false &&
              ruleValidations !== null &&
              Boolean(ruleValidations?.minBid) === true
            }
            disabled={isRuleArchived}
          />
          {isRuleArchived === false &&
            ruleValidations !== null &&
            Boolean(ruleValidations?.minBid) === true && (
              <p className={styles.error}>{ruleValidations?.minBid ?? ''}</p>
            )}
        </div>

        <div className={styles.fieldContainer}>
          <p className={styles.fieldTitle}>Max Bid</p>
          <OutlinedInput
            type="number"
            onChange={handleMaxBidChange}
            value={
              Number.isFinite(selectedRuleBasicFilters.advancedSettings?.maxBid)
                ? selectedRuleBasicFilters.advancedSettings?.maxBid
                : ''
            }
            placeholder="00"
            sx={{
              ...textboxNewStyles,
              height: '3.2rem',
              display: 'flex',
            }}
            slotProps={{
              input: {
                min: 0,
                step: 0.01,
                inputMode: 'decimal',
              },
            }}
            error={
              isRuleArchived === false &&
              ruleValidations !== null &&
              Boolean(ruleValidations?.maxBid) === true
            }
            disabled={isRuleArchived}
          />
          {isRuleArchived === false &&
            ruleValidations !== null &&
            Boolean(ruleValidations?.maxBid) === true && (
              <p className={styles.error}>{ruleValidations?.maxBid ?? ''}</p>
            )}
        </div>

        <div className={styles.fieldContainer}>
          <p className={styles.fieldTitle}>TROAS</p>
          <OutlinedInput
            type="number"
            onChange={handleTroasChange}
            value={
              Number.isFinite(selectedRuleBasicFilters.advancedSettings?.troas)
                ? selectedRuleBasicFilters.advancedSettings?.troas
                : ''
            }
            placeholder="00"
            sx={{
              ...textboxNewStyles,
              height: '3.2rem',
              display: 'flex',
            }}
            slotProps={{
              input: {
                min: 0,
                step: 0.01,
                inputMode: 'decimal',
              },
            }}
            error={
              isRuleArchived === false &&
              ruleValidations !== null &&
              Boolean(ruleValidations?.troas) === true
            }
            disabled={isRuleArchived}
          />
          {isRuleArchived === false &&
            ruleValidations !== null &&
            Boolean(ruleValidations?.troas) === true && (
              <p className={styles.error}>{ruleValidations?.troas ?? ''}</p>
            )}
        </div>
      </div>

      <div className={styles.disclaimer}>
        <InfoIcon size={'0.8rem'} color="#3874ff" weight="bold" />
        {/* <p>Min bid, Max bid and TROAS are mandatory fields.</p> */}
        <p>All fields are mandatory.</p>
      </div>
    </div>
  );
}
