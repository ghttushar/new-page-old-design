import Dropdown from '@/app/components/common/dropdown/dropdown';
import MultiSelectDropdown from '@/app/components/common/dropdown/multi-select-dropdown';
import GraphLoadingComponent from '@/app/components/common/graph-loading-state/graph-loading-state';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import ProfitabilityTableContainer from '@/app/components/common/profitability-table-container/profitability-table-container';
import ProfitabilityAccordion from '@/app/components/page-components/profitability/profitability-accordion/profitability-accordion';
import ProfitabilityCard from '@/app/components/page-components/profitability/profitability-card/profitability-card';
import ProfitabilityGraph from '@/app/components/page-components/profitability/profitability-graph/profitability-graph';
import CustomDateRangePickerWrapper from '@/app/components/shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import { ProfitabilityFrequency } from '@/constants/profitability/profitability.constants';
import { ProfitabilityHomePageViewProps } from '@/interfaces/profitability/profitability.interface';
import { IDateRange } from '@/interfaces/serp.interface';
import { useAppSelector } from '@/redux/hooks';
import { selectIsChatbotOpen } from '@/redux/slices/auth/auth.slice';
import {
  selectProfitabilityHeaderFilterOptions,
  selectProfitabilityHeaderFilters,
} from '@/redux/slices/profitability/profitability.slice';
import { checkIsEqual } from '@/utils/advertising.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { useCallback, useMemo } from 'react';
import styles from './profitability-home-page.module.scss';

function ProfitabilityHomePageView<T, G>(
  props: ProfitabilityHomePageViewProps<T, G>
) {
  const {
    headerFilters,
    totalData,
    chartData,
    tableData,
    transformedPerformanceData,
    selectedMetricsData,
    totalExpandableItems,
    activePerformanceBox,
    isOrdersTable,
    isExpanded,
    expandedItems,
    tableAccordionExpandedItems,
    totalRowCount,
    pagination,
    expandedState,
    selectedColumns,
    allTableColumns,
    sorting,
    isGraphLoading,
    isPerformanceLoading,
    isTableLoading,
    currentTable,
    onRangeSelect,
    setCustomDateRange,
    handleApply,
    setSelectedBox,
    onMetricsSelect,
    onFrequencySelect,
    setSelectedColumnsHandler,
    handleTableTypeSwitch,
    onAccordionMetricsExpand,
    onTableAccordionMetricsExpand,
    handleTableDownload,
    setPagination,
    setSorting,
    setExpandedState,
    setIsExpanded,
    formattedRangeFreq: getFormattedRangeFreq,
    performanceCalculatedMetrics,
    tableCalculatedMetrics,
    accordionData,
    marketplace,
    onCustomDateRangeChange,
  } = props;

  const filters = useAppSelector(selectProfitabilityHeaderFilters);
  const options = useAppSelector(selectProfitabilityHeaderFilterOptions);
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);

  const cardDateHandlers = useMemo(
    () =>
      Array.from(
        { length: transformedPerformanceData.length },
        (_, i) => (range: IDateRange) => onCustomDateRangeChange(i, range)
      ),

    [onCustomDateRangeChange, transformedPerformanceData.length]
  );

  const onViewMoreClick = useCallback(
    (expand: boolean, index: number) => {
      setIsExpanded(expand);
      setSelectedBox(index);
    },
    [setIsExpanded, setSelectedBox]
  );

  const isApplyDisabled =
    checkIsEqual(
      headerFilters.range,
      profitabilityUtils.getCustomRangeOption(filters.range)
    ) && checkIsEqual(headerFilters.customDateRange, filters.customDateRange);

  return (
    <div id="tabs" className={styles.container}>
      <div className={styles.dateRangeContainer}>
        <CustomDateRangePickerWrapper
          title="Date Range"
          labelStyles={{
            fontSize: '1.1rem',
          }}
          handleDateChange={onRangeSelect}
          setCustomDateRange={setCustomDateRange}
          rangeOptions={options.range}
          isProfitability={true}
          defaultPreset={profitabilityUtils.getCustomRangeOption(
            headerFilters.range
          )}
          selectedCustomDateRange={headerFilters.customDateRange}
          width="30rem"
        />
        <PrimaryButton
          buttonText={'Run'}
          disabled={isApplyDisabled}
          height="2.95rem"
          width="auto"
          buttonFunction={handleApply}
        />
      </div>

      <div id="subContainer" className={styles.subContainer}>
        <div id="card-component" className={styles.cardWrapper}>
          <div id="card-component" className={styles.cardInnerWrapper}>
            {transformedPerformanceData.map((metrics, index) => {
              return (
                <ProfitabilityCard
                  key={index}
                  index={index}
                  isSelected={index === activePerformanceBox}
                  title={profitabilityUtils.getCardTitle(filters, index)}
                  dateRange={profitabilityUtils.getDateRange(
                    filters,
                    index,
                    marketplace
                  )}
                  metrics={metrics ?? []}
                  setSelectedCard={setSelectedBox}
                  isLoading={isPerformanceLoading}
                  isExpanded={isExpanded}
                  setIsExpanded={onViewMoreClick}
                  onCustomDateRangeChange={cardDateHandlers[index]}
                  selectedCustomDateRange={filters.customDateRanges?.[index]}
                />
              );
            })}
          </div>
          {isExpanded === true ? (
            <ProfitabilityAccordion
              handleClose={() => setIsExpanded(false)}
              expandedItems={expandedItems}
              setExpandedItems={onAccordionMetricsExpand}
              isLoading={isPerformanceLoading}
              activeCardNumber={activePerformanceBox}
              totalExpandableItems={totalExpandableItems}
              accordionData={accordionData}
              calculatedMetrics={performanceCalculatedMetrics}
            />
          ) : (
            <div
              className={styles.chartComponent}
              style={{
                maxWidth: isChatbotOpen === true ? '34rem' : '48rem',
              }}
            >
              <span className="flex gap-[1rem] justify-end">
                <span>
                  <Dropdown
                    options={ProfitabilityFrequency}
                    selected={ProfitabilityFrequency[0]}
                    onSelect={onFrequencySelect}
                    width="10rem"
                    label="Frequency"
                  />
                </span>
                <span>
                  <MultiSelectDropdown
                    options={options.metrics}
                    onSelect={onMetricsSelect}
                    label="Metrics"
                    background="white"
                    maxLimit={4}
                    width="18rem"
                    minLimit={1}
                  />
                </span>
              </span>
              {isGraphLoading === true ? (
                <div className={styles.graphLoadingContainer}>
                  <GraphLoadingComponent
                    bars={isChatbotOpen === true ? 8 : undefined}
                    yAxisPoints={5}
                  />
                </div>
              ) : (
                <div className={styles.graphContainer}>
                  <ProfitabilityGraph
                    chartData={chartData}
                    formattedXAxisText={getFormattedRangeFreq}
                    expandGraph={false}
                    handleExpandClose={function (): void {
                      throw new Error('Function not implemented.');
                    }}
                    chartTitle={''}
                    handleTableEmptyReset={function (): void {
                      throw new Error('Function not implemented.');
                    }}
                    selectedMetricsData={selectedMetricsData}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ProfitabilityTableContainer
        currentTable={currentTable}
        isLoading={isTableLoading}
        isOrdersTable={isOrdersTable}
        handleTableSwitch={handleTableTypeSwitch}
        handleSelectedColumns={setSelectedColumnsHandler}
        selectedColumns={selectedColumns}
        allTableColumns={allTableColumns}
        handleDownload={handleTableDownload}
        tableAccordionExpandedItems={tableAccordionExpandedItems}
        onTableAccordionMetricsExpand={onTableAccordionMetricsExpand}
        tableData={tableData}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        expandedState={expandedState}
        setExpandedState={setExpandedState}
        totalData={totalData ?? undefined}
        totalRowCount={totalRowCount}
        tableCalculatedMetrics={tableCalculatedMetrics}
        marketplace={marketplace}
      />
    </div>
  );
}

export default ProfitabilityHomePageView;
