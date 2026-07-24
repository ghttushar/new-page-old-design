import { CustomNumberFieldComponent } from '@/app/components/common/custom-text-field/custom-text-field';
import { defaultNumericFieldProps } from '@/app/components/common/custom-text-field/custom-text-field.constants';
import Dropdown from '@/app/components/common/dropdown/dropdown';
import InfoIcon from '@/app/components/common/info-icon/info-icon';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import RuleCriteriaInfo from '@/app/components/page-components/rules-page-components/rule-page-form-components/rule-criteria-info/rule-criteria-info';
import {
  fieldTitleNewStyles,
  textboxNewStyles,
} from '@/app/components/pages/rules-page/rules-page-features/rules-page-agents/rules-page-form/rules-page-form-styles';
import CustomEditLoader from '@/app/components/shared/custom-edit-loader/custom-edit-loader';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IMetricsConfiguration,
  MetricValueTypeEnum,
  TargetProfitMarginTypeEnum,
} from '@/interfaces/configurations.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import {
  selectEditMetricsConfiguration,
  selectMetricsConfiguration,
  setEditMetricsConfiguration,
  setMetricsConfiguration,
  updateMetricsConfiguration,
} from '@/redux/slices/configurations/configurations.slice';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from '@/redux/slices/notifications/toast-message.slice';
import ConfigurationsService from '@/services/settings/configurations.service';
import {
  displayValue,
  getCurrencySymbolByCountry,
  getSelectedFilterFromValue,
  getValidNumber,
} from '@/utils';
import { checkIsEqual } from '@/utils/advertising.utils';
import { InputAdornment, TextField } from '@mui/material';
import { FloppyDiskIcon } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { DEFAULT_METRICS, PROFIT_MARGIN_OPTIONS } from './metrics.constants';
import styles from './metrics.module.scss';

export default function Metrics() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const editMetrics = useAppSelector(selectEditMetricsConfiguration);
  const initialMetrics = useAppSelector(selectMetricsConfiguration);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount.marketplace]
  );

  const fetchMetricsConfig = useAppQuery({
    queryKey: [QueryKeyEnums.FETCH_METRICS_CONFIGURATION, marketplace],
    queryFn: ({ signal }) =>
      ConfigurationsService.getMetricsConfiguration(marketplace, signal),
    enabled: !!marketplace,
  });

  const {
    mutateAsync: saveMetricsConfig,
    isPending: isSavePending,
    isIdle: isSaveIdle,
  } = useAppMutation({
    mutationFn: (payload: IMetricsConfiguration) =>
      ConfigurationsService.saveMetricsConfiguration(marketplace, payload),
    options: {
      onSuccess: (response) => {
        if (response?.data?.success) {
          dispatch(
            showSuccessToastMessage({
              title: 'Success',
              description: 'Metrics configuration saved successfully',
            })
          );
          dispatch(setMetricsConfiguration(editMetrics));
          queryClient.invalidateQueries({
            queryKey: [QueryKeyEnums.FETCH_METRICS_CONFIGURATION],
          });
        }
      },
      onError: () => {
        dispatch(
          showErrorToastMessage({
            title: 'Error',
            description: 'Failed to save metrics configuration',
          })
        );
      },
    },
  });

  useEffect(() => {
    if (fetchMetricsConfig.isSuccess && fetchMetricsConfig.data.data.data) {
      const apiData = fetchMetricsConfig.data.data.data;
      const mappedData: IMetricsConfiguration = {
        budget: apiData.budget ? parseFloat(String(apiData.budget)) : 0,
        budgetType: apiData.budgetType ?? 'USD',
        tacosTargetValue: apiData.tacosTargetValue
          ? parseFloat(String(apiData.tacosTargetValue))
          : 0,
        tacosTargetType: apiData.tacosTargetType ?? 'percentage',
        roasTargetValue: apiData.roasTargetValue
          ? parseFloat(String(apiData.roasTargetValue))
          : 0,
        roasTargetType: apiData.roasTargetType,
        targetProfitMarginValue: apiData.targetProfitMarginValue
          ? parseFloat(String(apiData.targetProfitMarginValue))
          : 0,
        targetProfitMarginType:
          apiData.targetProfitMarginType ?? MetricValueTypeEnum.PERCENTAGE,
        targetProfitMarginCurrency: apiData.targetProfitMarginCurrency,
        targetRevenue: apiData.targetRevenue,
        targetRevenueType: apiData.targetRevenueType ?? 'USD',
      };
      dispatch(setEditMetricsConfiguration(mappedData));
      dispatch(setMetricsConfiguration(mappedData));
    } else {
      dispatch(setEditMetricsConfiguration(DEFAULT_METRICS));
      dispatch(setMetricsConfiguration(DEFAULT_METRICS));
    }
  }, [
    dispatch,
    fetchMetricsConfig.data?.data.data,
    fetchMetricsConfig.isSuccess,
  ]);

  const isLoading = useMemo(
    () =>
      fetchMetricsConfig.isFetching ||
      fetchMetricsConfig.isRefetching ||
      (isSavePending === true && isSaveIdle === false),
    [
      fetchMetricsConfig.isFetching,
      fetchMetricsConfig.isRefetching,
      isSaveIdle,
      isSavePending,
    ]
  );

  const handleSaveMetrics = async () => {
    if (!editMetrics) return;

    const payload: IMetricsConfiguration = {
      budget: editMetrics.budget,
      budgetType: editMetrics.budgetType ?? 'USD',
      tacosTargetValue: editMetrics.tacosTargetValue,
      tacosTargetType: 'percentage',
      roasTargetValue: editMetrics.roasTargetValue,
      roasTargetType: editMetrics.roasTargetType,
      targetProfitMarginValue: editMetrics.targetProfitMarginValue,
      targetProfitMarginType: editMetrics.targetProfitMarginType,
      targetProfitMarginCurrency:
        editMetrics.targetProfitMarginType === MetricValueTypeEnum.ABSOLUTE
          ? editMetrics.targetProfitMarginCurrency ?? 'USD'
          : undefined,
      targetRevenue: editMetrics.targetRevenue,
      targetRevenueType: editMetrics.targetRevenueType ?? 'USD',
    };

    await saveMetricsConfig(payload);
  };

  const handleFieldChange = (
    field: keyof IMetricsConfiguration,
    value: string | number
  ) => {
    dispatch(updateMetricsConfiguration({ [field]: value }));
  };

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = getValidNumber(event.target.valueAsNumber);
    dispatch(
      updateMetricsConfiguration({
        budget: newVal,
      })
    );
  };

  const handleTargetProfitMarginValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVal = getValidNumber(event.target.valueAsNumber);
    dispatch(
      updateMetricsConfiguration({
        targetProfitMarginValue: newVal,
      })
    );
  };

  const handleTacosTargetValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVal = getValidNumber(event.target.valueAsNumber);
    dispatch(
      updateMetricsConfiguration({
        tacosTargetValue: newVal,
      })
    );
  };
  const handleTargetRevenueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVal = getValidNumber(event.target.valueAsNumber);
    dispatch(
      updateMetricsConfiguration({
        targetRevenue: newVal,
      })
    );
  };

  const handleRoasTargetValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newVal = getValidNumber(event.target.valueAsNumber);
    dispatch(
      updateMetricsConfiguration({
        roasTargetValue: newVal,
      })
    );
  };

  const getTargetProfitMarginType = (): TargetProfitMarginTypeEnum => {
    if (editMetrics?.targetProfitMarginType === MetricValueTypeEnum.ABSOLUTE) {
      return TargetProfitMarginTypeEnum.ABSOLUTE_PROFIT;
    }
    return TargetProfitMarginTypeEnum.PROFIT_PERCENTAGE;
  };

  return (
    <div className={styles.container}>
      {isLoading && (
        <CustomEditLoader
          overlayText={
            checkIsEqual(editMetrics, initialMetrics)
              ? 'Loading Metrics'
              : 'Saving Metrics'
          }
        />
      )}
      <div className={styles.controlsRow}>
        <div className={styles.pageStepTitle}>Metrics Configuration</div>
      </div>
      <RuleCriteriaInfo
        title="Strategic Business Intent:"
        description="This goal helps align advertising decisions with your broader profitability objectives, ensuring optimization goes beyond just ROAS and revenue metrics."
        inline={true}
      />

      <div className={styles.configGrid}>
        <div className={styles.configCard}>
          <div className={styles.fieldBlock}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Budget</span>
              <InfoIcon title="The total budget available for optimization" />
            </div>
            <div className={styles.inputGroup}>
              <TextField
                value={
                  Number.isFinite(editMetrics?.budget)
                    ? editMetrics?.budget
                    : ''
                }
                onChange={handleBudgetChange}
                id="formatted-numberformat-input"
                variant="outlined"
                placeholder="0"
                sx={{ ...textboxNewStyles, width: '100%' }}
                inputProps={{
                  ...defaultNumericFieldProps,
                }}
                InputProps={{
                  inputComponent: CustomNumberFieldComponent as any,
                  startAdornment: (
                    <InputAdornment position="start">
                      {getCurrencySymbolByCountry()}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <p className={styles.subtitle}>
              This budget will be distributed across all active campaigns in
              this account.
            </p>
          </div>

          <div className={styles.verticalDivider} />

          <div className={styles.fieldBlock}>
            <div className={styles.labelRow}>
              <span className={styles.label}>Target Profit Margin</span>
              <InfoIcon title="Your desired profit margin target" />
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.dropdownWrapper}>
                <Dropdown
                  options={PROFIT_MARGIN_OPTIONS}
                  selected={getSelectedFilterFromValue(
                    PROFIT_MARGIN_OPTIONS,
                    getTargetProfitMarginType(),
                    PROFIT_MARGIN_OPTIONS[0]
                  )}
                  onSelect={(item) => {
                    const metricType =
                      item.value === TargetProfitMarginTypeEnum.ABSOLUTE_PROFIT
                        ? MetricValueTypeEnum.ABSOLUTE
                        : MetricValueTypeEnum.PERCENTAGE;
                    handleFieldChange('targetProfitMarginType', metricType);
                  }}
                  isNewDesign={true}
                  dropShadow={false}
                  labelStyles={fieldTitleNewStyles}
                  height="3.2rem"
                  width="100%"
                />
              </div>
              <div className={styles.divider} />

              <TextField
                value={
                  Number.isFinite(editMetrics?.targetProfitMarginValue)
                    ? editMetrics?.targetProfitMarginValue
                    : ''
                }
                onChange={handleTargetProfitMarginValueChange}
                id="target-profit-percentage-input"
                variant="outlined"
                placeholder="0"
                sx={{ ...textboxNewStyles, width: '100%' }}
                inputProps={{
                  ...defaultNumericFieldProps,
                }}
                InputProps={{
                  inputComponent: CustomNumberFieldComponent as any,
                  startAdornment: (
                    <InputAdornment position="start">
                      {getTargetProfitMarginType() ===
                      TargetProfitMarginTypeEnum.PROFIT_PERCENTAGE
                        ? displayValue('')
                        : getCurrencySymbolByCountry()}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <p className={styles.subtitle}>
              Enter your target profit margin as a percentage of revenue.
            </p>
          </div>
        </div>

        <div className={styles.configCard}>
          <div className={styles.fieldBlock}>
            <div className={styles.labelRow}>
              <span className={styles.label}>
                TACOS Target ({displayValue('')})
              </span>
              <InfoIcon title="Target Advertising Cost of Sale" />
            </div>
            <div className={styles.inputGroup}>
              <TextField
                value={
                  Number.isFinite(editMetrics?.tacosTargetValue)
                    ? editMetrics?.tacosTargetValue
                    : ''
                }
                onChange={handleTacosTargetValueChange}
                id="tacos-target-value-input"
                variant="outlined"
                placeholder="0"
                sx={{ ...textboxNewStyles, width: '100%' }}
                inputProps={{
                  ...defaultNumericFieldProps,
                }}
                InputProps={{
                  inputComponent: CustomNumberFieldComponent as any,
                  startAdornment: (
                    <InputAdornment position="start">
                      {displayValue('')}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <p className={styles.subtitle}>Recommended range: 5% - 15%</p>
          </div>

          <div className={styles.verticalDivider} />

          <div className={styles.fieldBlock}>
            <div className={styles.labelRow}>
              <span className={styles.label}>ROAS Target</span>
              <InfoIcon title="Return on Advertising Spend target" />
            </div>
            <div className={styles.inputGroup}>
              <TextField
                value={
                  Number.isFinite(editMetrics?.roasTargetValue)
                    ? editMetrics?.roasTargetValue
                    : ''
                }
                onChange={handleRoasTargetValueChange}
                id="roas-target-value-input"
                variant="outlined"
                placeholder="0"
                sx={{ ...textboxNewStyles, width: '100%' }}
                inputProps={{
                  ...defaultNumericFieldProps,
                }}
                InputProps={{
                  inputComponent: CustomNumberFieldComponent as any,
                  startAdornment: (
                    <InputAdornment position="start">
                      {getCurrencySymbolByCountry()}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <p className={styles.subtitle}>
              Enter your target as a multiplier (e.g., 4.0 = $4 return per $1
              spent).
            </p>
          </div>
        </div>
        <div className={styles.configCard}>
          <div className={styles.fieldBlock}>
            <div className={styles.labelRow}>
              <span className={styles.label}>
                Target Revenue ({displayValue('', false)})
              </span>
              <InfoIcon title="Target Revenue" />
            </div>
            <div className={styles.inputGroup}>
              <TextField
                value={
                  Number.isFinite(editMetrics?.tacosTargetValue)
                    ? editMetrics?.tacosTargetValue
                    : ''
                }
                onChange={handleTargetRevenueChange}
                id="tacos-target-value-input"
                variant="outlined"
                placeholder="0"
                sx={{ ...textboxNewStyles, width: '50%' }}
                inputProps={{
                  ...defaultNumericFieldProps,
                }}
                InputProps={{
                  inputComponent: CustomNumberFieldComponent as any,
                  startAdornment: (
                    <InputAdornment position="start">
                      {displayValue('', false)}
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <div className={styles.verticalDivider} />
        </div>
      </div>

      <div className={styles.footerBar} onClick={(e) => e.preventDefault()}>
        <div className={styles.bottomControls}>
          <PrimaryButton
            buttonText="Save Budget Config"
            buttonFunction={handleSaveMetrics}
            disabled={checkIsEqual(editMetrics, initialMetrics) || isLoading}
            height="3rem"
            width="18rem"
            fontSize="0.9rem"
            isNewDesign={true}
            isButtonIconRequired={true}
            stopPropagation={true}
            buttonIcon={<FloppyDiskIcon size={'2rem'} />}
          />
        </div>
      </div>
    </div>
  );
}
