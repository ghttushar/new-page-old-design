import { PageTitleEnum } from '@/enums/index.enums';
import { Frequency, MarketplaceEnum, Range } from '@/enums/serp.enums';
import useMarketplaceSubheader from '@/hooks/use-marketplace-sub-header.hook';
import marketIntelligenceUtils from '@/utils/market-intelligence/market-intelligence.utils';
import { ColumnDef } from '@tanstack/react-table';
import React, { useCallback, useEffect, useState } from 'react';
import EmptyState from 'src/app/components/common/empty-state/empty-state';
import ProductSOVFilter from 'src/app/components/common/filter/product-sov-filter';
import TableEmptyState from 'src/app/components/common/table-empty-state/table-empty-state';
import KeywordSovTableHeader from 'src/app/components/page-components/keyword-sov-table/keyword-sov-table-header';
import ProductSovGraphWrapper from 'src/app/components/page-components/product-sov-graph/product-sov-graph-wrapper';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import { productSOVEmptyStateConf } from 'src/constants/empty-state.constants';
import {
  IProductSOVFilter,
  IProductSOVFilterBody,
  IProductSOVGraphData,
  IProductSOVTableData,
} from 'src/interfaces/product-sov.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  IProductSovFilterForm,
  resetProductSovFilters,
  selectAppliedProductSovFilter,
} from 'src/redux/slices/market-intelligence/product-sov-filter.slice';
import ProductSovService from 'src/services/market-intelligence/product-sov.service';
import { getFileNameDateTime, getFormattedRangeFreq } from 'src/utils';
import serpUtils from 'src/utils/serp.utils';
import { productSovColumns } from './product-sov-columns';
import styles from './product-sov.module.scss';

export default function ProductSov() {
  const [marketplace, countryCode] = useMarketplaceSubheader(
    PageTitleEnum.PRODUCT_SOV,
    marketIntelligenceUtils.getProductSovUrl
  );

  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<IProductSOVTableData[]>([]);
  const [tableColumns, setTableColumns] = useState<
    Array<ColumnDef<IProductSOVTableData>>
  >([]);
  const [graphData, setGraphData] = useState<IProductSOVGraphData[]>([]);
  const [isGraphHidden, setIsGraphHidden] = useState<boolean>(false);
  const [formattedRangeFreq, setFormattedRangeFreq] = useState<string>('');
  const [expandGraph, setExpandGraph] = useState<boolean>(false);
  const [formattedFilters, setFormattedFilters] =
    useState<IProductSOVFilter | null>(null);

  const dispatch = useAppDispatch();

  const appliedProductSovFilter = useAppSelector(selectAppliedProductSovFilter);

  const handleExpandOpen = () => setExpandGraph(true);
  const handleExpandClose = () => setExpandGraph(false);
  const handleHideGraph = () => setIsGraphHidden(true);
  const handleShowGraph = () => setIsGraphHidden(false);

  const handleTableEmptyReset = () => {
    dispatch(resetProductSovFilters());
  };

  const getProductSOVData = useCallback(
    (filters: IProductSovFilterForm) => {
      if (!filters.product.value) return;
      setIsLoading(true);

      const filterData: IProductSOVFilter = {
        products: [filters.product.value],
        range: filters.customDateRange,
        frequency: filters.frequency.value,
        dateRange: filters.range.value,
        brandName: filters.brandName?.value as string,
        countryCode,
      };

      const _filterData: IProductSOVFilter =
        serpUtils.getProductSovFilters(filterData);
      setFormattedFilters(_filterData);

      const body: IProductSOVFilterBody = {
        startDate: _filterData.range?.startDate as string,
        endDate: _filterData.range?.endDate as string,
        frequency: _filterData.frequency as string,
        marketplace: marketplace,
        asins: _filterData.products,
        brandName: _filterData.brandName,
        range: _filterData.dateRange as Range,
        countryCode: _filterData.countryCode,
      };

      ProductSovService.getProductSOVData(body)
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
            setTableColumns(
              productSovColumns(filters.product.label, marketplace)
            );
            setGraphData(res.data.data.chartData);

            const minMaxDates = res.data.data.minMaxDate;

            if (minMaxDates && minMaxDates.minDate && minMaxDates.maxDate) {
              setFormattedRangeFreq(
                getFormattedRangeFreq(
                  _filterData.frequency,
                  _filterData.range,
                  minMaxDates.minDate,
                  minMaxDates.maxDate
                )
              );
            } else {
              setFormattedRangeFreq('-');
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [marketplace, countryCode]
  );

  useEffect(() => {
    setTableData([]);
    setGraphData([]);
    if (appliedProductSovFilter.brandName !== null) {
      getProductSOVData(appliedProductSovFilter);
    }
  }, [appliedProductSovFilter, getProductSOVData]);

  return (
    <div className={styles.productSovPage}>
      <div className={styles.productSovContainer}>
        <ProductSOVFilter
          marketplace={marketplace as MarketplaceEnum}
          setIsLoading={setIsLoading}
        />

        {!tableData.length && !graphData.length && isLoading === false ? (
          <EmptyState {...productSOVEmptyStateConf} height="100%" />
        ) : (
          <React.Fragment>
            <ProductSovGraphWrapper
              graphData={graphData}
              filters={formattedFilters as IProductSOVFilter}
              tooltipRange={appliedProductSovFilter.range}
              isGraphHidden={isGraphHidden}
              handleHideGraph={handleHideGraph}
              isGraphLoading={isLoading}
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
                appliedProductSovFilter.brandName?.value
              }_product-sov_${getFileNameDateTime(
                formattedFilters as IProductSOVFilter
              )}.csv`}
            />

            {isLoading === false && !tableData.length && (
              <TableEmptyState handleReset={handleTableEmptyReset} />
            )}

            <CustomTableWrapper
              data={tableData}
              columns={tableColumns}
              width="100%"
              height="60rem"
              isLoading={isLoading}
              pageSizes={PAGE_SIZE_OPTIONS}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
