import { MarketplaceEnum } from '@/enums/serp.enums';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import customTableUtils from '@/utils/custom-table.utils';
import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import {
  CampaignStateEnum,
  SpAccountLevelTitles,
  SpCampaignLevelTitles,
  WalmartOverallAccountLevelTitles,
  WalmartSBAccountLevelTitles,
  WalmartSBCampaignLevelTitles,
  WalmartSPAccountLevelTitles,
  WalmartSPAdGroupLevelTitles,
  WalmartSPCampaignLevelTitles,
  WalmartSVAccountLevelTitles,
} from 'src/enums/advertising.enums';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import {
  WalmartAdTypeEnum,
  WalmartCampaignStatusEnum,
} from 'src/enums/walmart.enums';
import { ITableFooterData } from 'src/interfaces/advertising/advertising.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectEditAccessFilters,
  selectInitialState,
  selectSelectedRows,
  setSelectedRows,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { selectSelectedAdvertisingNavTitle } from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  checkIsEditDisableByReviewStatus,
  checkIsLOGOItem,
  getInitialPinnedColumns,
  getPlacementTypeByName,
  isPageTypeMultiplierEditable,
} from 'src/utils/advertising.utils';
import CustomTableWrapper from '../../shared/custom-table-wrapper/custom-table-wrapper';
import styles from './performance-table.module.scss';

interface IPerformanceTableProps<T> {
  rows: Array<T>;
  columns: Array<ColumnDef<T>>;
  isLoading: boolean;
  totalRowCount: number;
  paginationModel: PaginationState;
  setPaginationModel: (paginationModel: PaginationState) => void;
  sortModel?: SortingState;
  setSortModel?: (sortModel: SortingState) => void;
  isFooterRequired?: boolean;
  footerData?: ITableFooterData;
}

export default function PerformanceTable<T>({
  rows,
  columns,
  isLoading,
  sortModel,
  setSortModel,
  totalRowCount,
  paginationModel,
  setPaginationModel,
  isFooterRequired = false,
  footerData,
}: IPerformanceTableProps<T>) {
  const selectedRows = useAppSelector(selectSelectedRows);
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const initialState = useAppSelector(selectInitialState);
  const dispatch = useAppDispatch();

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );

  const handleSetSortModel: OnChangeFn<SortingState> = (updaterOrValue) => {
    if (!setSortModel) return;

    const sortingState = customTableUtils.handleManualSorting(
      updaterOrValue,
      sortModel
    );

    setSortModel(sortingState);

    setPaginationModel({
      pageIndex: 0,
      pageSize: paginationModel.pageSize,
    });
  };

  const handleSetPaginationModel: OnChangeFn<PaginationState> = (
    updaterOrValue
  ) => {
    const paginationState = customTableUtils.handleManualPagination(
      updaterOrValue,
      paginationModel
    );

    setPaginationModel(paginationState);
  };

  const isRowSelectableHandler = (row: Row<any>): boolean => {
    const status = (row.original as any).status;
    let initialRow: any = null;

    for (const iRow of initialState) {
      if ((iRow as any).status?.toLowerCase() === status?.toLowerCase()) {
        initialRow = iRow;
        break;
      }
    }

    if (checkIsLOGOItem(row.original)) return false;

    if (
      selectedAdvertisingNavTitle === WalmartSPAccountLevelTitles.PAGE_TYPE ||
      selectedAdvertisingNavTitle === WalmartSPCampaignLevelTitles.PAGE_TYPE
    ) {
      return (
        editAccessFilters.editAccess.value === EditAccessValues.Edit &&
        isPageTypeMultiplierEditable(
          (row.original as any).pageType,
          (row.original as any).targetingType
        )
      );
    }

    if (
      selectedAdvertisingNavTitle === WalmartOverallAccountLevelTitles.PAGE_TYPE
    ) {
      return (
        editAccessFilters.editAccess.value === EditAccessValues.Edit &&
        isPageTypeMultiplierEditable(
          (row.original as any).pageType,
          (row.original as any).targetingType
        ) &&
        (row.original as any).adType === WalmartAdTypeEnum.SPONSORED_PRODUCTS
      );
    }
    if (
      selectedAdvertisingNavTitle === WalmartOverallAccountLevelTitles.PLATFORM
    ) {
      return (
        editAccessFilters.editAccess.value === EditAccessValues.Edit &&
        (row.original as any).adType === WalmartAdTypeEnum.SPONSORED_PRODUCTS
      );
    }

    if (
      selectedAdvertisingNavTitle === WalmartSPAccountLevelTitles.AD_ITEMS ||
      selectedAdvertisingNavTitle === WalmartSPCampaignLevelTitles.AD_ITEMS ||
      selectedAdvertisingNavTitle === WalmartSPAdGroupLevelTitles.AD_ITEMS
    ) {
      return editAccessFilters.editAccess.value === EditAccessValues.Edit;
    }

    if (
      selectedAdvertisingNavTitle === WalmartSBAccountLevelTitles.PAGE_TYPE ||
      selectedAdvertisingNavTitle === WalmartSBCampaignLevelTitles.PAGE_TYPE ||
      selectedAdvertisingNavTitle === WalmartSVAccountLevelTitles.PAGE_TYPE ||
      selectedAdvertisingNavTitle === WalmartSBCampaignLevelTitles.PAGE_TYPE
    ) {
      return false;
    }

    if (
      selectedAdvertisingNavTitle === SpAccountLevelTitles.PLACEMENT ||
      selectedAdvertisingNavTitle === SpCampaignLevelTitles.PLACEMENT
    ) {
      const bidValue = getPlacementTypeByName(
        (row.original as any).placement,
        (row.original as any).dynamicBidding?.placementBidding
      );

      return (
        editAccessFilters.editAccess.value === EditAccessValues.Edit &&
        !(
          (row.original as any).placement === null ||
          (row.original as any).placement === undefined
        ) &&
        !(bidValue === null || bidValue === undefined)
      );
    }

    if (
      selectedMarketplace === MarketplaceEnum.WALMART &&
      checkIsEditDisableByReviewStatus(row.original)
    ) {
      return false;
    }

    return (
      initialRow?.status !== CampaignStateEnum.ARCHIVED &&
      initialRow?.status !== WalmartCampaignStatusEnum.COMPLETED &&
      editAccessFilters.editAccess.value === EditAccessValues.Edit
    );
  };

  const handleSetRowSelection: OnChangeFn<RowSelectionState> = (
    updaterOrValue
  ) => {
    const rowSelectionState = customTableUtils.handleManualRowSelection(
      updaterOrValue,
      selectedRows
    );

    dispatch(setSelectedRows(rowSelectionState));
  };

  return (
    <div
      className={styles.wrapper}
      style={{
        height: 'auto',
        maxHeight: '60rem',
      }}
    >
      <CustomTableWrapper
        data={rows}
        columns={columns}
        getRowId={(originalRow) => (originalRow as any)?.id as string}
        width="100%"
        height="60rem"
        isLoading={isLoading}
        enableRowSelection={(row) => {
          return (
            editAccessFilters.editAccess.value === EditAccessValues.Edit &&
            isRowSelectableHandler(row)
          );
        }}
        rowSelection={selectedRows}
        setRowSelection={handleSetRowSelection}
        pageSizes={PAGE_SIZE_OPTIONS}
        rowCount={totalRowCount}
        manualPagination={true}
        pagination={paginationModel}
        setPagination={handleSetPaginationModel}
        manualSorting={true}
        sorting={sortModel}
        setSorting={handleSetSortModel}
        disableUndefinedSorting={true}
        pinnedColumns={getInitialPinnedColumns(selectedAdvertisingNavTitle)}
        isFooterRequired={isFooterRequired}
        totalData={footerData}
        enableVirtualization={false}
        overscan={
          editAccessFilters.editAccess.value === EditAccessValues.Edit
            ? 30
            : undefined
        }
      />
    </div>
  );
}
