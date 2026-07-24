import { PageTitleEnum } from '@/enums/index.enums';
import { Frequency, MarketplaceEnum } from '@/enums/serp.enums';
import useMarketplaceSubheader from '@/hooks/use-marketplace-sub-header.hook';
import marketIntelligenceUtils from '@/utils/market-intelligence/market-intelligence.utils';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useState } from 'react';
import EmptyState from 'src/app/components/common/empty-state/empty-state';
import KeywordSOVFilter from 'src/app/components/common/filter/keyword-sov-filter';
import TableEmptyState from 'src/app/components/common/table-empty-state/table-empty-state';
import KeywordSovGraphWrapper from 'src/app/components/page-components/keyword-sov-graph/keyword-sov-graph-wrapper';
import KeywordSovTableHeader from 'src/app/components/page-components/keyword-sov-table/keyword-sov-table-header';
import KeywordSovTableWrapper from 'src/app/components/page-components/keyword-sov-table/keyword-sov-table-wrapper';
import { keywordSOVEmptyStateConf } from 'src/constants/empty-state.constants';
import {
  IKeywordSOVFilter,
  IKeywordSOVFilterBody,
  IKeywordSOVGraph,
  IKeywordSOVTable,
} from 'src/interfaces/keyword-sov.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  IKeywordSovFilterForm,
  resetKeywordSovFilters,
  selectAppliedKeywordSovFilter,
  selectKeywordSovFilter,
  selectKeywordSovOptions,
  setAppliedKeywordSovFilters,
  setKeywordSovKeywordOptions,
} from 'src/redux/slices/market-intelligence/keyword-sov-filter.slice';
import KeywordSovService from 'src/services/market-intelligence/keyword-sov.service';
import { getFileNameDateTime, getFormattedRangeFreq } from 'src/utils';
import serpUtils from 'src/utils/serp.utils';
import { newKeywordSovColumns } from './keyword-sov-columns';
import styles from './keyword-sov.module.scss';

export default function KeywordSOV() {
  const [marketplace, countryCode] = useMarketplaceSubheader(
    PageTitleEnum.KEYWORD_SOV,
    marketIntelligenceUtils.getKeywordSovUrl
  );
  const [isTableLoading, setIsTableLoading] = useState<boolean>(false);
  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<IKeywordSOVTable[]>([]);
  const [tableColumns, setTableColumns] = useState<
    ColumnDef<IKeywordSOVTable>[]
  >([]);
  const [graphData, setGraphData] = useState<IKeywordSOVGraph[]>([]);
  const [isGraphHidden, setIsGraphHidden] = useState<boolean>(false);
  const [formattedRangeFreq, setFormattedRangeFreq] = useState<string>('');
  const [expandGraph, setExpandGraph] = useState<boolean>(false);
  const [formattedFilters, setFormattedFilters] =
    useState<IKeywordSOVFilter | null>(null);
  const [isDataUpdated, setIsDataUpdated] = useState<boolean>(false);

  const handleExpandOpen = () => setExpandGraph(true);
  const handleExpandClose = () => setExpandGraph(false);
  const handleHideGraph = () => setIsGraphHidden(true);
  const handleShowGraph = () => setIsGraphHidden(false);

  const dispatch = useAppDispatch();

  const appliedKeywordSovFilter = useAppSelector(selectAppliedKeywordSovFilter);
  const filters = useAppSelector(selectKeywordSovFilter);
  const options = useAppSelector(selectKeywordSovOptions);

  const handleTableEmptyReset = () => {
    dispatch(resetKeywordSovFilters());
  };

  const getKeywordSOVData = useCallback(
    (filters: IKeywordSovFilterForm) => {
      if (!filters.brandName.value) return;
      setIsTableLoading(true);
      setIsGraphLoading(true);

      const filterData: IKeywordSOVFilter = {
        keywords: filters.keywords.map((keyword) => keyword.value),
        range: filters.customDateRange,
        position: '',
        frequency: filters.frequency.value,
        dateRange: filters.range.value,
        brandName: filters.brandName.value,
      };

      const _filterData: IKeywordSOVFilter =
        serpUtils.getKeywordSovFilters(filterData);
      setFormattedFilters(_filterData);

      const body: IKeywordSOVFilterBody = {
        startDate: _filterData.range?.startDate,
        endDate: _filterData.range?.endDate,
        position: _filterData.position,
        frequency: _filterData.frequency,
        marketplace: marketplace,
        keywords: _filterData.keywords,
        brandName: _filterData.brandName,
        range: _filterData.dateRange,
        countryCode,
      };

      KeywordSovService.getKeywordSOVData(body)
        .then((res) => {
          if (res.data.data !== null) {
            let _tableData = res.data.data.tableData;
            let id = 0;
            _tableData = _tableData.map((row) => {
              id += 1;
              return {
                id,
                ...row,
              };
            });

            _tableData.sort((a, b) => {
              if (body.frequency === Frequency.DAILY) {
                const label1 = serpUtils.parseDateFromString(a.label);
                const label2 = serpUtils.parseDateFromString(b.label);
                return label1.getTime() - label2.getTime();
              }
              return parseInt(a.label) - parseInt(b.label);
            });

            setTableData(_tableData);
            setTableColumns(newKeywordSovColumns);
            setGraphData(res.data.data.chartData);
            setFormattedRangeFreq(
              getFormattedRangeFreq(_filterData.frequency, _filterData.range)
            );
            setIsDataUpdated(true);
          }
        })
        .finally(() => {
          setIsTableLoading(false);
          setIsGraphLoading(false);
        });
    },
    [marketplace, countryCode]
  );

  const handleClearFilter = () => {
    const unSelectedKeywords = options.keywords.map((item) => {
      return {
        ...item,
        selected: false,
      };
    });

    dispatch(setKeywordSovKeywordOptions(unSelectedKeywords));

    dispatch(
      setAppliedKeywordSovFilters({
        ...filters,
        keywords: [],
      })
    );
  };

  useEffect(() => {
    setTableData([]);
    setGraphData([]);
    getKeywordSOVData(appliedKeywordSovFilter);
  }, [appliedKeywordSovFilter, getKeywordSOVData]);

  useEffect(() => {
    if (isDataUpdated) {
      setTimeout(() => {
        setIsDataUpdated(false);
      }, 3000);
    }
  }, [isDataUpdated]);

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        <KeywordSOVFilter
          marketplace={marketplace as MarketplaceEnum}
          countryCode={countryCode}
        />

        {!tableData.length &&
        !graphData.length &&
        (isTableLoading === false || isGraphLoading === false) ? (
          <EmptyState {...keywordSOVEmptyStateConf} height="100%" />
        ) : (
          <React.Fragment>
            <KeywordSovGraphWrapper
              graphData={graphData}
              filters={formattedFilters as IKeywordSOVFilter}
              tooltipRange={appliedKeywordSovFilter.range}
              isGraphHidden={isGraphHidden}
              handleHideGraph={handleHideGraph}
              isGraphLoading={isGraphLoading}
              expandGraph={expandGraph}
              handleExpandOpen={handleExpandOpen}
              handleExpandClose={handleExpandClose}
              formattedRangeFreq={formattedRangeFreq}
            />

            <KeywordSovTableHeader
              exportData={tableData}
              isGraphHidden={isGraphHidden}
              handleShowGraph={handleShowGraph}
              exportFileName={`${
                appliedKeywordSovFilter.brandName.value
              }_keyword-sov-data_${getFileNameDateTime(
                formattedFilters as IKeywordSOVFilter
              )}.csv`}
            />

            {isTableLoading === false && !tableData.length && (
              <TableEmptyState handleReset={handleTableEmptyReset} />
            )}

            <KeywordSovTableWrapper
              tableData={tableData}
              tableColumns={tableColumns}
              isTableLoading={isTableLoading}
              isDataUpdated={isDataUpdated}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
