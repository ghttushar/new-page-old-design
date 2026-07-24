import DownloadTableButton from '@/app/components/common/download-button/download-table-button';
import SearchableDropdown from '@/app/components/common/dropdown/searchable-dropdown';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import ProfitMarginScatterPlot from '@/app/components/page-components/profitability/profit-margin-scatter-plot/profit-margin-scatter-plot';
import ProfitabilityProductSearchDropdown from '@/app/components/page-components/profitability/profitability-product-search-dropdown/profitability-product-search-dropdown';
import ProfitabilityTrendsTable, {
  IProfitabilityTrendsTableRow,
} from '@/app/components/page-components/profitability/profitability-trends-table/profitability-trends-table';
import CustomDateRangePickerWrapper from '@/app/components/shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import { ProfitabilityPnLFrequency } from '@/constants/profitability/profitability.constants';
import { ProfitabilityTableTitlesEnum } from '@/enums/profitability.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IProfitabilityOrdersData,
  IProfitabilityTrendsPageViewProps,
  ITrendsTotal,
} from '@/interfaces/profitability/profitability.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectProfitabilityHeaderFilters,
  selectSelectedTrendsMetric,
  setSelectedProducts,
} from '@/redux/slices/profitability/profitability.slice';
import { formatStringToTitleCase, remToPx } from '@/utils';
import {
  generateExportFileName,
  getSearchPlaceholder,
} from '@/utils/advertising.utils';
import { RowModel } from '@tanstack/react-table';
import { useCallback, useState } from 'react';
import styles from '../../profitability-page/profitability-trends-page/profitability-trends-page.module.scss';

function ProfitabilityTrendsPageView<
  T extends IProfitabilityTrendsTableRow = IProfitabilityTrendsTableRow,
  G extends object = IProfitabilityOrdersData,
  P = ITrendsTotal
>(props: IProfitabilityTrendsPageViewProps<T, G, P>) {
  const {
    selectedMetric,
    trendsData,
    processedChartData,
    trendsTotalData,
    uniqueDates,
    isDataLoading,
    isApplyDisabled,
    metricOptions,
    rangeOptions,
    onRangeSelect,
    onCustomDateRangeChange,
    onMetricSelect,
    onApply,
    onDownload,
    metricKey,
    setSelectedFrequency,
    onProductSelect,
    marketplace,
    productInfo,
    isProductDataLoading,
  } = props;

  const filters = useAppSelector(selectProfitabilityHeaderFilters);
  const selectedTrendsMetric = useAppSelector(selectSelectedTrendsMetric);
  const dispatch = useAppDispatch();
  const handleAllClear = () => dispatch(setSelectedProducts([]));
  const [exportData, setExportData] = useState<T[]>([]);

  const getTrendsData = useCallback((data: RowModel<T>) => {
    const formattedData = data.rows.map((row) => row.original);
    setExportData(formattedData);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.trendsControls}>
        <span>
          <ProfitabilityProductSearchDropdown
            options={productInfo ?? []}
            onSelect={onProductSelect}
            handleClearAllOption={handleAllClear}
            placeholder={getSearchPlaceholder(
              marketplace === MarketplaceEnum.AMAZON
                ? ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_TRENDS
                : ProfitabilityTableTitlesEnum.PROFITABILITY_TRENDS
            )}
            width="46rem"
            height="3rem"
            isLoading={isProductDataLoading}
            marketplace={marketplace}
          />
        </span>
        <span className="flex items-end gap-[1rem]">
          <CustomDateRangePickerWrapper
            title="Date Range"
            labelStyles={{
              fontSize: '1.1rem',
            }}
            handleDateChange={onRangeSelect}
            setCustomDateRange={onCustomDateRangeChange}
            setFrequency={setSelectedFrequency}
            rangeOptions={rangeOptions}
            frequencyOptions={ProfitabilityPnLFrequency}
            defaultPreset={filters.range}
            selectedCustomDateRange={filters.customDateRange}
            selectedFrequency={filters.frequency}
            isProfitability={true}
          />

          <SearchableDropdown
            options={metricOptions}
            selected={selectedMetric}
            label="Metrics"
            width="auto"
            onSelect={onMetricSelect}
          />

          <PrimaryButton
            buttonText={'Run'}
            buttonFunction={onApply}
            disabled={isApplyDisabled}
            height="2.95rem"
          />

          <DownloadTableButton
            hoverInfoText="Download CSV"
            data={exportData}
            filename={generateExportFileName(
              `${
                ProfitabilityTableTitlesEnum.PROFITABILITY_TRENDS
              }_${formatStringToTitleCase(metricKey)}`
            )}
            squareDimension="3rem"
            downloadOptionsRequired={false}
            title={ProfitabilityTableTitlesEnum.PROFITABILITY_TRENDS}
            isDisabled={isDataLoading || trendsData === null}
            marketPlace={marketplace}
          />
        </span>
      </div>
      <ProfitMarginScatterPlot
        processedChartData={processedChartData}
        isLoading={isDataLoading || trendsData === null || isProductDataLoading}
        height={remToPx(45)}
        metricLabel={selectedTrendsMetric.label}
      />
      <ProfitabilityTrendsTable
        data={trendsData}
        uniqueDates={uniqueDates}
        isLoading={isDataLoading || trendsData === null || isProductDataLoading}
        metricKey={metricKey}
        trendsTotalData={trendsTotalData}
        marketplace={marketplace}
        getTrendsData={getTrendsData}
      />
    </div>
  );
}

export default ProfitabilityTrendsPageView;
