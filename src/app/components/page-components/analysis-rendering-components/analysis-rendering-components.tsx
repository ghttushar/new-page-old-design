import AddedFiltersTab from '@/app/components/common/added-filters-tab/added-filters-tab';
import AdvertisingNavigationBar from '@/app/components/page-components/advertising-navigation-bar/advertising-navigation-bar';
import { DEFAULT_ADVERTISING_SORT_CRITERIA } from '@/constants/advertising-filter.constants';
import { AdvertisingTitlesEnum } from '@/enums/advertising.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IAdvertisingNavigationBarOption,
  IMinMaxDateRange,
  IPerformanceGraphData,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IMultiSelectDropdownItem } from '@/interfaces/dropdown.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectAdvertisingHeaderFilters,
  setPaginationModel,
  setSearchText,
} from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import {
  selectAppliedFilters,
  setAppliedFilters,
} from '@/redux/slices/filters/filter.slice';
import {
  resetAnalysisFilters,
  selectAnalysisFilter,
  setSelectedAnalysisNavTitle,
  setSelectedMetric,
} from '@/redux/slices/impact-analysis/impact-analysis.slice';
import { handleTableEmptyResetUtils } from '@/utils/advertising.utils';
import {
  getImpactAnalysisUrl,
  getNewImpactAnalysisUrl,
} from '@/utils/analysis.utils';
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableEmptyState from 'src/app/components/common/table-empty-state/table-empty-state';
import TableHeader from 'src/app/components/page-components/advertising-table-header/advertising-table-header';
import AnalysisGraphWrapper from 'src/app/components/page-components/analysis-graph/analysis-graph-wrapper';
import ImpactAnalysisFilters from 'src/app/components/page-components/impact-analysis-components/impact-analysis-filters/impact-analysis-filters';
import ImpactAnalysisTable from 'src/app/components/page-components/impact-analysis-components/impact-analysis-table/impact-analysis-table';
import {
  IAnalysisArrayData,
  IAnalysisColData,
  IAnalysisExportData,
  IAnalysisFilter,
} from 'src/interfaces/analysis.interface';
import { IDropdownItem } from '../../common/dropdown/dropdown';
import styles from './analysis-rendering-components.module.scss';

interface IAnalysisRenderingComponentsProps {
  analysisGraphData: IPerformanceGraphData[];
  metricsFilter: IMultiSelectDropdownItem[];
  analysisFilters: IAnalysisFilter;
  minMaxDates: IMinMaxDateRange;
  isAnalysisGraphLoading: boolean;
  chartLabel: string;
  performanceNavigationTabOptions: IAdvertisingNavigationBarOption[];
  selectedAnalysisNavTab: IAdvertisingNavigationBarOption;
  handleSelectedOption: (option: IAdvertisingNavigationBarOption) => void;
  isTableLoading: boolean;
  selectedAnalysisNavTitle: string;
  exportData: IAnalysisExportData[];
  initialFormattedRows: IAnalysisArrayData;
  formattedRows: IAnalysisArrayData;
  handleSetUpdatedRows: (data: any[]) => void;
  formattedColumns: Array<ColumnDef<IAnalysisColData>>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  totalCount: number;
}

export default function AnalysisRenderingComponents({
  analysisGraphData,
  metricsFilter,
  analysisFilters,
  minMaxDates,
  isAnalysisGraphLoading,
  chartLabel,
  performanceNavigationTabOptions,
  selectedAnalysisNavTab,
  handleSelectedOption,
  isTableLoading,
  selectedAnalysisNavTitle,
  exportData,
  initialFormattedRows,
  formattedRows,
  handleSetUpdatedRows,
  formattedColumns,
  sorting,
  setSorting,
  pagination,
  setPagination,
  totalCount,
}: IAnalysisRenderingComponentsProps) {
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const filters = useAppSelector(selectAnalysisFilter);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace || MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount]
  );

  const [hideGraph, setHideGraph] = useState<boolean>(false);
  const [expandGraph, setExpandGraph] = useState<boolean>(false);

  const getExportFileName = useCallback(() => {
    const metricsPart = filters.selectedMetric.value.toLowerCase();
    return `impact_analysis_${metricsPart}_${selectedAnalysisNavTitle}.csv`;
  }, [filters.selectedMetric, selectedAnalysisNavTitle]);

  const handleTableEmptyReset = useCallback(() => {
    dispatch(resetAnalysisFilters());
    dispatch(setSearchText(''));
    dispatch(setAppliedFilters([]));
    navigate(
      getImpactAnalysisUrl(
        selectedAnalysisNavTitle,
        marketplace,
        advHeaderFilters.adType.value
      )
    );
    handleTableEmptyResetUtils(setSorting, setPaginationModel);
  }, [dispatch]);

  const handleHideGraph = () => setHideGraph(true);
  const handleShowGraph = () => setHideGraph(false);

  const handleExpandOpen = () => setExpandGraph(true);
  const handleExpandClose = () => setExpandGraph(false);

  const metricDropdownData = useMemo(() => {
    return {
      metricFilter: filters.selectedMetric,
      metricOptions: filters.selectedAnalysisMetrics,
    };
  }, [filters.selectedMetric]);

  const onMetricDropdownChange = useCallback(
    (value: IDropdownItem<string>) =>
      dispatch(setSelectedMetric(value as IMultiSelectDropdownItem)),
    [dispatch]
  );

  const handleTitle = useCallback(
    (value: string) => {
      if (selectedAnalysisNavTitle === '' || selectedAnalysisNavTitle === value)
        return;

      dispatch(setSelectedAnalysisNavTitle(value));
      dispatch(setSearchText(''));
      handleTableEmptyResetUtils(
        setSorting,
        setPagination,
        DEFAULT_ADVERTISING_SORT_CRITERIA,
        {
          ...pagination,
          pageIndex: 0,
        }
      );

      navigate(
        `${getNewImpactAnalysisUrl(
          marketplace,
          advHeaderFilters.adType.value
        )}${value}`
      );
    },
    [
      selectedAnalysisNavTitle,
      dispatch,
      pagination,
      navigate,
      marketplace,
      advHeaderFilters.adType.value,
    ]
  );

  return (
    <div className={styles.analysisContainer}>
      <div className={styles.analysisMainContainer}>
        <ImpactAnalysisFilters />

        <AnalysisGraphWrapper
          data={analysisGraphData}
          metricsFilter={metricsFilter}
          filters={analysisFilters}
          maxMinDates={minMaxDates}
          handleHideGraph={handleHideGraph}
          isGraphLoading={isAnalysisGraphLoading}
          expandGraph={expandGraph}
          handleExpandOpen={handleExpandOpen}
          handleExpandClose={handleExpandClose}
          chartLabel={chartLabel}
        />

        <AdvertisingNavigationBar
          data={performanceNavigationTabOptions}
          selectedOption={selectedAnalysisNavTab}
          handleSelectedOption={handleSelectedOption}
          isTableLoading={isTableLoading}
        />

        <div className={styles.tableHeader}>
          <TableHeader
            selectedNavTab={selectedAnalysisNavTab}
            handleSelectedAdvertisingNavTitle={handleTitle}
            hideGraph={hideGraph}
            handleShowGraph={handleShowGraph}
            exportData={exportData}
            isMetricDropdownRequired={true}
            metricDropdownData={metricDropdownData}
            onMetricDropdownChange={onMetricDropdownChange}
            exportFileTitle={getExportFileName()}
            initialRows={initialFormattedRows}
            isTableDataLoading={isTableLoading}
            selectedAdvertisingNavTitle={selectedAnalysisNavTitle}
            setUpdatedRows={handleSetUpdatedRows}
            selectedAdGroup={null}
            columnsToFilter={formattedColumns}
            _selectedColumns={formattedColumns}
            showColumnFilterComp={false}
            setSelectedColumns={(selectedColumns) => {
              //
            }}
          />
          <div className="mt-[0rem] my-[1rem]">
            <AddedFiltersTab
              appliedFilters={appliedFilters}
              isLoading={false}
              selectedAdvertisingNavTitle={
                selectedAnalysisNavTitle as AdvertisingTitlesEnum
              }
            />
          </div>
        </div>

        {!isTableLoading && !formattedRows.length && (
          <TableEmptyState handleReset={handleTableEmptyReset} />
        )}

        <ImpactAnalysisTable
          columns={formattedColumns}
          rows={formattedRows}
          isTableLoading={isTableLoading}
          title={selectedAnalysisNavTitle}
          sorting={sorting}
          setSorting={setSorting}
          pagination={pagination}
          setPagination={setPagination}
          totalCount={totalCount}
        />
      </div>
    </div>
  );
}
