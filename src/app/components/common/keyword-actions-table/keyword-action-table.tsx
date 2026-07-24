import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  RowSelectionState,
  SortingState,
} from '@tanstack/react-table';
import { useMemo } from 'react';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import { DEFAULT_ADVERTISING_SORT_CRITERIA } from 'src/constants/advertising-filter.constants';
import { KeywordActionTabsEnum } from 'src/enums/keyword-action.enums';
import { IKeywordActionData } from 'src/interfaces/keyword-actions.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import { setKeywordActionSelectedRowIds } from 'src/redux/slices/keyword-action/amazon/keyword-action.slice';
import { setWalmartKeywordActionSelectedRowIds } from 'src/redux/slices/keyword-action/walmart/keyword-action.slice';
import keywordActionsUtils from 'src/utils/keyword-actions.utils';
import CustomTableWrapper from '../../shared/custom-table-wrapper/custom-table-wrapper';
import styles from './keyword-action-table.module.scss';

interface IKeywordActionTableProps {
  selectedTab: KeywordActionTabsEnum;
  rows: IKeywordActionData[];
  totalRowCount: number;
  paginationModel: PaginationState;
  setPaginationModel: React.Dispatch<React.SetStateAction<PaginationState>>;
  sortModel: SortingState;
  setSortModel: React.Dispatch<React.SetStateAction<SortingState>>;
  selectedRowIds: RowSelectionState;
  isDataLoading: boolean;
  selectedColumns: ColumnDef<IKeywordActionData>[];
}

const KeywordActionTable: React.FC<IKeywordActionTableProps> = ({
  rows,
  sortModel,
  selectedTab,
  setSortModel,
  totalRowCount,
  selectedRowIds,
  paginationModel,
  selectedColumns,
  setPaginationModel,
  isDataLoading,
}) => {
  const dispatch = useAppDispatch();
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const marketplace = useMemo(
    () => advertisingAccount.marketplace,
    [advertisingAccount]
  );

  const KEYWORD_ADDITION_TAB =
    marketplace === MarketplaceEnum.AMAZON
      ? KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON
      : KeywordActionTabsEnum.KEYWORD_ADDITION_WALMART;

  const handleSetSortModel: OnChangeFn<SortingState> = (updaterOrValue) => {
    if (!setSortModel) return;

    let latestSortModel: SortingState;

    if (typeof updaterOrValue === 'function') {
      latestSortModel = updaterOrValue(
        sortModel || DEFAULT_ADVERTISING_SORT_CRITERIA
      );
    } else {
      latestSortModel = updaterOrValue;
    }
    if (latestSortModel.length > 0) {
      setSortModel(latestSortModel);
    } else setSortModel(DEFAULT_ADVERTISING_SORT_CRITERIA);

    setPaginationModel({
      pageIndex: 0,
      pageSize: paginationModel.pageSize,
    });
  };

  const handleSetRowSelection: OnChangeFn<RowSelectionState> = (
    updaterOrValue
  ) => {
    let newSelection: RowSelectionState;

    if (typeof updaterOrValue === 'function') {
      newSelection = updaterOrValue(selectedRowIds || {});
    } else {
      newSelection = updaterOrValue;
    }

    if (marketplace === MarketplaceEnum.AMAZON) {
      dispatch(setKeywordActionSelectedRowIds(newSelection));
    } else {
      dispatch(setWalmartKeywordActionSelectedRowIds(newSelection));
    }
  };

  if (
    selectedTab === KEYWORD_ADDITION_TAB ||
    selectedTab === KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON
  ) {
    return (
      <div
        id="loader"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {
          <div className={styles.tableContainer}>
            <CustomTableWrapper
              data={rows}
              columns={selectedColumns}
              getRowId={(originalRow) => (originalRow as any)?.id as string}
              width="100%"
              height="60rem"
              isLoading={isDataLoading}
              enableRowSelection={true}
              rowSelection={selectedRowIds}
              setRowSelection={handleSetRowSelection}
              pageSizes={PAGE_SIZE_OPTIONS}
              rowCount={totalRowCount}
              manualPagination={true}
              pagination={paginationModel}
              setPagination={setPaginationModel}
              manualSorting={true}
              sorting={sortModel}
              setSorting={handleSetSortModel}
              disableUndefinedSorting={true}
              pinnedColumns={keywordActionsUtils.getInitialPinnedColumns(
                selectedTab
              )}
              customStyles={{
                tbody: {
                  tr: {
                    td: {
                      className: styles.TableRow,
                    },
                  },
                },
              }}
            />
          </div>
        }
      </div>
    );
  } else if (
    selectedTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON ||
    selectedTab === KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON
  ) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {
          <div className={styles.tableContainer}>
            <CustomTableWrapper
              data={rows}
              columns={selectedColumns}
              getRowId={(originalRow) => (originalRow as any)?.id as string}
              width="100%"
              height="60rem"
              isLoading={isDataLoading}
              enableRowSelection={true}
              rowSelection={selectedRowIds}
              setRowSelection={handleSetRowSelection}
              pageSizes={PAGE_SIZE_OPTIONS}
              rowCount={totalRowCount}
              manualPagination={true}
              pagination={paginationModel}
              setPagination={setPaginationModel}
              manualSorting={true}
              sorting={sortModel}
              setSorting={handleSetSortModel}
              disableUndefinedSorting={true}
              pinnedColumns={keywordActionsUtils.getInitialPinnedColumns(
                selectedTab
              )}
              customStyles={{
                tbody: {
                  tr: {
                    td: {
                      className: styles.TableRow,
                    },
                  },
                },
              }}
            />
          </div>
        }
      </div>
    );
  } else {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      ></div>
    );
  }
};

export default KeywordActionTable;
