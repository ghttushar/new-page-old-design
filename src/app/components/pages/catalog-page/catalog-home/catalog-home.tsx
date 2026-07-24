import { QueryKeyEnums } from '@/enums/query.enums';
import { IAdvertisingFilter } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { ICatalogData } from '@/interfaces/catalog/walmart/walmart-catalog.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectCatalogAccount } from '@/redux/slices/auth/auth.slice';
import { selectAppliedFilters } from '@/redux/slices/filters/filter.slice';
import { walmartCatalogService } from '@/services/catalog/walmart/walmart-catalog.service';
import { getFormattedSortModel } from '@/utils/advertising-columns.utils';
import {
  ColumnDef,
  ExpandedState,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import AddedFiltersTab from 'src/app/components/common/added-filters-tab/added-filters-tab';
import CatalogFilterWrapper from 'src/app/components/page-components/catalog-filter-wrapper/catalog-filter-wrapper';
import { catalogColumns } from 'src/app/components/page-components/catalog-table-wrapper/catalog-table-columns';
import CatalogTableWrapper from 'src/app/components/page-components/catalog-table-wrapper/catalog-table-wrapper';
import {
  CatalogTabTitlesEnum,
  ProductVariantTypeEnum,
} from 'src/enums/catalog.enums';
import { ITableFooterData } from 'src/interfaces/advertising/advertising.interface';
import { selectIsCatalogDataSyncing } from 'src/redux/slices/catalog/catalog.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { genExportFileName, getUpdatedPagination } from 'src/utils';
import { showFooter } from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';
import styles from './catalog-home.module.scss';

interface ICatalogHomeProps {
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  pagination: PaginationState;
  getFilterPayload: (
    isDownload: boolean,
    isAllDownload: boolean
  ) => IAdvertisingFilter;
  getFilterPayloadNoDownload: IAdvertisingFilter;
}

const CatalogHome = (props: ICatalogHomeProps) => {
  const {
    setPagination,
    pagination,
    getFilterPayload,
    getFilterPayloadNoDownload,
  } = props;

  const dispatch = useAppDispatch();
  const catalogAccount = useAppSelector(selectCatalogAccount);
  const searchText = useAppSelector(selectSearchText);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const isSyncing = useAppSelector(selectIsCatalogDataSyncing);

  const filteredColumns = columnFilterUtils.getStoredColumnFilters(
    CatalogTabTitlesEnum.WALMART_CATALOG
  );

  const [selectedColumns, setSelectedColumns] = useState<
    Array<ColumnDef<ICatalogData>>
  >(filteredColumns as Array<ColumnDef<ICatalogData>>);
  const [totalTableItemsCount, setTotalTableItemsCount] = useState<
    number | string
  >(0);
  const [catalogTotalData, setCatalogTotalData] = useState<ITableFooterData>();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'Total Sales',
      desc: true,
    },
  ]);
  const [catalogTableData, setCatalogTableData] = useState<ICatalogData[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [expandedState, setExpandedState] = useState<ExpandedState>({});
  const enableExpanding = false; // flag to enable/disable expanding rows

  const groupCatalogProducts = (productList: Array<ICatalogData>) => {
    const parentProductsMap: Map<string, ICatalogData> = new Map();
    productList.forEach((product) => {
      if (!product.variantGroupId) return;

      if (product.primaryVariant === ProductVariantTypeEnum.PRIMARY_VARIANT) {
        parentProductsMap.set(product.variantGroupId, product);
      }
    });
    productList.forEach((product) => {
      if (product.primaryVariant === ProductVariantTypeEnum.PRIMARY_VARIANT)
        return;
      if (!product.variantGroupId) {
        parentProductsMap.set(product.itemId || '', product);
        return;
      }

      const parentProduct = parentProductsMap.get(product.variantGroupId);
      if (!parentProduct) {
        parentProductsMap.set(product.itemId || '', product);
        return;
      }

      if (!parentProduct.variants) parentProduct.variants = [];
      parentProduct.variants.push(product);
      parentProductsMap.set(product.variantGroupId, parentProduct);
    });
    return Array.from(parentProductsMap.values());
  };

  const handleCustomSearchChange = () => {
    setPagination({
      ...pagination,
      pageIndex: 0,
    });
  };

  const resetPagination = () => setPagination(getUpdatedPagination);

  const setSelectedColumnsHandler = (
    selectedColumns: Array<ColumnDef<ICatalogData>>
  ) => {
    columnFilterUtils.syncStoredColumnFilters(
      CatalogTabTitlesEnum.WALMART_CATALOG,
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
      const catalogResponse = walmartCatalogService
        .getWalmartCatalogData(
          appliedFilters,
          getFilterPayload(isDownload, isAllDownload),
          pagination.pageIndex,
          pagination.pageSize,
          getFormattedSortModel(CatalogTabTitlesEnum.WALMART_CATALOG, sorting),
          searchText
        )
        .then((res) => {
          const data = res.data.data.data;

          if (isDownload) {
            dispatch(
              showSuccessToastMessage({
                title: 'Downloaded Successfully',
                description: 'Campaigns downloaded successfully.',
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

  const fetchCatalogTableData = useAppQuery({
    queryKey: [
      QueryKeyEnums.CATALOG_TABLE_FETCH,
      {
        appliedFilters,
        getFilterPayloadNoDownload,
        pagination,
        sorting,
        searchText,
        account: catalogAccount.value,
      },
    ],
    queryFn: ({ signal }) =>
      walmartCatalogService.getWalmartCatalogData(
        appliedFilters,
        getFilterPayloadNoDownload,
        pagination.pageIndex + 1,
        pagination.pageSize,
        getFormattedSortModel(CatalogTabTitlesEnum.WALMART_CATALOG, sorting),
        searchText,
        signal
      ),
  });

  const fetchCatalogTotalData = useAppQuery({
    queryKey: [
      QueryKeyEnums.CATALOG_TOTAL_FETCH,
      {
        appliedFilters,
        getFilterPayloadNoDownload,
        searchText,
        account: catalogAccount.value,
      },
    ],
    queryFn: ({ signal }) =>
      walmartCatalogService.getWalmartCatalogTotalData(
        appliedFilters,
        getFilterPayloadNoDownload,
        searchText,
        signal
      ),
  });

  useEffect(() => {
    setCatalogTableData([]);
    setExpandedState({});
    setIsDataLoaded(false);

    if (fetchCatalogTableData.data) {
      const data = fetchCatalogTableData.data.data.data.data;
      const catalogData = enableExpanding ? groupCatalogProducts(data) : data;

      const pagination = fetchCatalogTableData.data.data.data.pagination;

      setSelectedColumns(filteredColumns as Array<ColumnDef<ICatalogData>>);
      setCatalogTableData(catalogData);
      setTotalTableItemsCount(pagination.totalItems);
      setIsDataLoaded(true);
    }
  }, [dispatch, enableExpanding, fetchCatalogTableData.data]);

  useEffect(() => {
    if (fetchCatalogTotalData.data) {
      const data = fetchCatalogTotalData.data.data.data;
      setCatalogTotalData(data);
    }
  }, [dispatch, fetchCatalogTotalData.data]);

  const isTableLoading = useMemo(() => {
    return (
      fetchCatalogTableData.isLoading ||
      fetchCatalogTableData.isRefetching ||
      fetchCatalogTotalData.isLoading ||
      fetchCatalogTotalData.isRefetching
    );
  }, [
    fetchCatalogTableData.isLoading,
    fetchCatalogTableData.isRefetching,
    fetchCatalogTotalData.isLoading,
    fetchCatalogTotalData.isRefetching,
  ]);

  const getSubRows = (row: ICatalogData) => {
    if (row.variants) {
      return row.variants;
    }
    return [];
  };

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
        title={CatalogTabTitlesEnum.WALMART_CATALOG}
        exportFileName={genExportFileName(
          catalogAccount.value,
          CatalogTabTitlesEnum.WALMART_CATALOG
        )}
        handleDownload={handleDownload}
        onSearchChangeAdditionalLogic={handleCustomSearchChange}
        isDataLoaded={isDataLoaded}
        handleSelectedColumns={setSelectedColumnsHandler}
        selectedColumns={selectedColumns}
        initialColumns={catalogColumns}
        onFilterApply={resetPagination}
      />

      <AddedFiltersTab
        appliedFilters={appliedFilters}
        isLoading={!isDataLoaded || isTableLoading}
        selectedAdvertisingNavTitle={CatalogTabTitlesEnum.WALMART_CATALOG}
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
        getSubRows={getSubRows}
        isSyncing={isSyncing}
        totalData={catalogTotalData}
        isFooterRequired={showFooter(CatalogTabTitlesEnum.WALMART_CATALOG)}
        expandedState={expandedState}
        setExpandedState={setExpandedState}
        enableExpanding={enableExpanding}
      />
    </div>
  );
};

export default CatalogHome;
