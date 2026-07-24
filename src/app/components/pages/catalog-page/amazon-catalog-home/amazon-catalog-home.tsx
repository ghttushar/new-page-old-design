import CatalogTableWrapper from '@/app/components/page-components/catalog-table-wrapper/catalog-table-wrapper';
import { AMAZON_CATALOG_3P_COLUMNS } from '@/constants/catalog/catalog.constants';
import { AmazonAccountType, ColumnNameEnum } from '@/enums/advertising.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IAdvertisingFilter } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IAmazonCatalogItem } from '@/interfaces/catalog/amazon/amazon-catalog.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import { amazonCatalogService } from '@/services/catalog/amazon/amazon-catalog.service';
import { getInitialColumnsByNavTitle } from '@/utils/advertising-columns.utils';
import { catalogUtils } from '@/utils/catalog.utils';
import {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AddedFiltersTab from 'src/app/components/common/added-filters-tab/added-filters-tab';
import CatalogFilterWrapper from 'src/app/components/page-components/catalog-filter-wrapper/catalog-filter-wrapper';
import { CatalogTabTitlesEnum } from 'src/enums/catalog.enums';
import { ITableFooterData } from 'src/interfaces/advertising/advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectSearchText } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { genExportFileName, getUpdatedPagination } from 'src/utils';
import { removeUnwantedColumns, showFooter } from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';
import styles from './amazon-catalog-home.module.scss';

interface IAmazonCatalogHomeProps {
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  pagination: PaginationState;
  getFilterPayload: (
    isDownload: boolean,
    isAllDownload: boolean
  ) => IAdvertisingFilter;
  getFilterPayloadNoDownload: IAdvertisingFilter;
  accountType?: AmazonAccountType;
}

const AmazonCatalogHome = (props: IAmazonCatalogHomeProps) => {
  const {
    setPagination,
    pagination,
    getFilterPayload,
    getFilterPayloadNoDownload,
    accountType,
  } = props;
  const dispatch = useAppDispatch();
  const searchText = useAppSelector(selectSearchText);
  const appliedFilters = useAppSelector(selectAppliedFilters);

  const _tempInitialColumns = getInitialColumnsByNavTitle(
    CatalogTabTitlesEnum.AMAZON_CATALOG
  );

  const storedColumns = columnFilterUtils.getStoredColumnFilters(
    CatalogTabTitlesEnum.AMAZON_CATALOG,
    _tempInitialColumns as Array<ColumnDef<IAmazonCatalogItem>>
  );
  const [selectedColumns, setSelectedColumns] =
    useState<Array<ColumnDef<IAmazonCatalogItem>>>(storedColumns);
  const [initialColumns, setInitialColumns] =
    useState<Array<ColumnDef<IAmazonCatalogItem>>>(storedColumns);
  const [totalTableItemsCount, setTotalTableItemsCount] = useState<
    number | string
  >(0);
  const [catalogTotalData, setCatalogTotalData] = useState<ITableFooterData>();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: ColumnNameEnum.AD_SALES,
      desc: true,
    },
  ]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [catalogTableData, setCatalogTableData] = useState<
    IAmazonCatalogItem[]
  >([]);

  const handleCustomSearchChange = () => {
    setPagination({
      ...pagination,
      pageIndex: 0,
    });
  };

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<IAmazonCatalogItem>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      CatalogTabTitlesEnum.AMAZON_CATALOG,
      selectedColumns
    );
    setSelectedColumns(selectedColumns);
  };

  const getCatalogDataDownload = useCallback(
    async (isDownload = false, isAllDownload = false) => {
      if (!isDownload) {
        setCatalogTableData([]);
        setIsDataLoaded(false);
      }

      const filterPayload = getFilterPayload(isDownload, isAllDownload);

      const catalogResponse = amazonCatalogService
        .getCatalogItems(
          catalogUtils.getAmazonCatalogServiceBody(
            appliedFilters,
            searchText,
            filterPayload,
            sorting
          ),
          pagination.pageIndex,
          pagination.pageSize
        )
        .then((res) => {
          const data = res.data.data.data;

          if (isDownload) {
            dispatch(
              showSuccessToastMessage({
                title: 'Downloaded Successfully',
                description: 'Amazon catalog downloaded successfully.',
              })
            );
            return data;
          }
        });

      return catalogResponse;
    },
    [
      dispatch,
      searchText,
      pagination,
      appliedFilters,
      sorting,
      getFilterPayload,
    ]
  );

  const fetchAmazonCatalogTableData = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMAZON_CATALOG_TABLE_FETCH,
      {
        appliedFilters,
        getFilterPayloadNoDownload,
        pagination,
        sorting,
        searchText,
      },
    ],
    queryFn: ({ signal }) => {
      return amazonCatalogService.getCatalogItems(
        catalogUtils.getAmazonCatalogServiceBody(
          appliedFilters,
          searchText,
          getFilterPayloadNoDownload,
          sorting,
          accountType
        ),
        pagination.pageIndex + 1,
        pagination.pageSize,
        signal
      );
    },
  });

  const fetchAmazonCatalogTotalData = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMAZON_CATALOG_TOTAL_FETCH,
      {
        appliedFilters,
        getFilterPayloadNoDownload,
        searchText,
      },
    ],
    queryFn: ({ signal }) => {
      return amazonCatalogService.getAggregatedData(
        catalogUtils.getAmazonCatalogServiceBody(
          appliedFilters,
          searchText,
          getFilterPayloadNoDownload,
          undefined,
          accountType
        ),
        signal
      );
    },
  });

  const resetPagination = () => {
    setPagination(getUpdatedPagination);
  };

  useEffect(() => {
    setCatalogTableData([]);
    setIsDataLoaded(false);

    if (fetchAmazonCatalogTableData.data) {
      const data = fetchAmazonCatalogTableData.data.data.data.data;
      const pagination = fetchAmazonCatalogTableData.data.data.data.pagination;

      const tempInitialColumns = [..._tempInitialColumns];

      if (
        accountType !== undefined &&
        accountType === AmazonAccountType.VENDOR
      ) {
        removeUnwantedColumns(
          tempInitialColumns as Array<ColumnDef<IAmazonCatalogItem>>,
          AMAZON_CATALOG_3P_COLUMNS
        );
      }

      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        CatalogTabTitlesEnum.AMAZON_CATALOG,
        tempInitialColumns as Array<ColumnDef<IAmazonCatalogItem>>
      );

      setInitialColumns(
        tempInitialColumns as Array<ColumnDef<IAmazonCatalogItem>>
      );

      setSelectedColumns(
        filteredColumns as Array<ColumnDef<IAmazonCatalogItem>>
      );
      setCatalogTableData(data);
      setTotalTableItemsCount(pagination.totalItems);
      setIsDataLoaded(true);
    }
  }, [dispatch, fetchAmazonCatalogTableData.data]);

  useEffect(() => {
    if (fetchAmazonCatalogTotalData.data) {
      const data = fetchAmazonCatalogTotalData.data.data.data;
      setCatalogTotalData(data as ITableFooterData);
    }
  }, [dispatch, fetchAmazonCatalogTotalData.data]);

  const isTableLoading = useMemo(() => {
    return (
      fetchAmazonCatalogTableData.isLoading ||
      fetchAmazonCatalogTableData.isRefetching ||
      fetchAmazonCatalogTotalData.isLoading ||
      fetchAmazonCatalogTotalData.isRefetching
    );
  }, [
    fetchAmazonCatalogTableData.isLoading,
    fetchAmazonCatalogTableData.isRefetching,
    fetchAmazonCatalogTotalData.isLoading,
    fetchAmazonCatalogTotalData.isRefetching,
  ]);

  const handleDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const data: Record<string, unknown>[] = (await getCatalogDataDownload(
        true,
        isAllDownload
      )) as unknown as Record<string, unknown>[];

      return data;
    },
    [dispatch, getCatalogDataDownload]
  );

  return (
    <div className={styles.subContainer}>
      <CatalogFilterWrapper
        title={CatalogTabTitlesEnum.AMAZON_CATALOG}
        exportFileName={genExportFileName(
          MarketplaceEnum.AMAZON,
          CatalogTabTitlesEnum.AMAZON_CATALOG
        )}
        handleDownload={handleDownload}
        onSearchChangeAdditionalLogic={handleCustomSearchChange}
        isDataLoaded={isDataLoaded}
        handleSelectedColumns={setSelectedColumnsHandler as any}
        selectedColumns={selectedColumns}
        initialColumns={initialColumns}
        accountType={accountType}
        onFilterApply={resetPagination}
      />

      <AddedFiltersTab
        appliedFilters={appliedFilters}
        isLoading={!isDataLoaded || isTableLoading}
        selectedAdvertisingNavTitle={CatalogTabTitlesEnum.AMAZON_CATALOG}
      />

      <CatalogTableWrapper
        tableData={catalogTableData}
        tableColumns={selectedColumns}
        isTableLoading={isTableLoading}
        pagination={pagination}
        setPagination={setPagination}
        totalDataCount={totalTableItemsCount}
        sorting={sorting}
        setSorting={setSorting}
        totalData={catalogTotalData}
        isFooterRequired={showFooter(CatalogTabTitlesEnum.AMAZON_CATALOG)}
      />
    </div>
  );
};

export default AmazonCatalogHome;
