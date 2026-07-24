import {
  OnChangeFn,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import { DEFAULT_ADVERTISING_SORT_CRITERIA } from 'src/constants/advertising-filter.constants';
import { KeywordActionTabsEnum } from 'src/enums/keyword-action.enums';
import { IGetArchiveSearchTermData } from 'src/interfaces/keyword-actions.interface';
import keywordActionsUtils from 'src/utils/keyword-actions.utils';
import styles from '../keyword-action-table.module.scss';
import { KEYWORD_ARCHIVE_COLUMNS } from './keyword-action-archive-column';

interface KeywordArchiveTableProps {
  isArchiveDataUpdated: boolean;
  rows: IGetArchiveSearchTermData[];
  totalRowCount: number;
  paginationModel: PaginationState;
  setPaginationModel: React.Dispatch<React.SetStateAction<PaginationState>>;
  sortModel: SortingState;
  setSortModel: React.Dispatch<React.SetStateAction<SortingState>>;
  selectedTab: KeywordActionTabsEnum;
}
const KeywordArchiveTable: React.FC<KeywordArchiveTableProps> = ({
  isArchiveDataUpdated,
  rows,
  totalRowCount,
  setPaginationModel,
  paginationModel,
  sortModel,
  setSortModel,
  selectedTab,
}) => {
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className={styles.tableContainer}>
        <CustomTableWrapper
          data={rows}
          columns={KEYWORD_ARCHIVE_COLUMNS}
          getRowId={(originalRow) => (originalRow as any)?.id as string}
          width="100%"
          height="60rem"
          isLoading={!isArchiveDataUpdated}
          enableRowSelection={false}
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
    </div>
  );
};

export default KeywordArchiveTable;
