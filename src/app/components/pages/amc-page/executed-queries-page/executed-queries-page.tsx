import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAmcSubHeader from '@/hooks/use-amc-sub-header.hook';
import { debounce } from '@mui/material';
import Button from '@mui/material/Button';
import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react';
import { PaginationState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { clearButtonStyles } from 'src/app/components/common/bulk-actions/bulk-actions-styles';
import SearchText from 'src/app/components/common/search/debounce-search';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import { IAMCWorkflowExecutionBaseExtended } from 'src/interfaces/amc.interfaces';
import { AMCQueryServices } from 'src/services/amc/amc-queries.services';
import { getSearchPlaceholder } from 'src/utils/advertising.utils';
import { amcExecutedQueriesColumns } from './executed-queries-page-columns';
import styles from './executed-queries-page.module.scss';

export default function ExecutedQueriesPage() {
  const amcFilters = useAmcSubHeader(
    PageTitleEnum.EXECUTED_QUERIES,
    PAGE_TITLE_TOOLTIPS.EXECUTED_QUERIES
  );

  const [executedQueriesData, setExecutedQueriesData] = useState<
    IAMCWorkflowExecutionBaseExtended[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [searchText, setSearchText] = useState<string>('');

  const getAllWorkflowExecutions = useCallback(
    (searchText: string) => {
      setExecutedQueriesData([]);
      setTotalRowCount(0);
      setIsLoading(true);
      AMCQueryServices.getAllWorkflowExecutions(
        amcFilters?.value as string,
        paginationModel.pageIndex + 1,
        paginationModel.pageSize,
        searchText
      )
        .then((res) => {
          const pagination = res.data.data.pagination;
          let data = res.data.data.data;
          let id = 0;
          data = data.map((execution) => {
            id += 1;
            return {
              id,
              ...execution,
            };
          });
          setExecutedQueriesData(data);
          setTotalRowCount(pagination.totalItems as number);
        })
        .catch(() => {
          setExecutedQueriesData([]);
          setTotalRowCount(0);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [paginationModel.pageIndex, paginationModel.pageSize, amcFilters?.value]
  );

  // This useEffect is needed just in case if the totalRows count is undefined from server for some unknown reason.
  useEffect(() => {
    setTotalRowCount((prevTotalRows) =>
      totalRowCount !== undefined ? totalRowCount : prevTotalRows
    );
  }, [totalRowCount]);

  const handleDebouncedChange = useMemo(
    () => debounce(getAllWorkflowExecutions, 800),
    [getAllWorkflowExecutions]
  );

  useEffect(() => {
    getAllWorkflowExecutions('');
  }, [getAllWorkflowExecutions]);

  const handleSearch = (searchText: string) => {
    setSearchText(searchText);
    handleDebouncedChange(searchText);
  };

  return (
    <div className={styles.executedQueryContainer}>
      <div className={styles.subContainer}>
        <div className={styles.tableHeader}>
          <Button
            disableRipple
            startIcon={
              <ArrowCounterClockwiseIcon
                size={14}
                color="#77469B"
                weight="bold"
              />
            }
            sx={clearButtonStyles}
            onClick={() => getAllWorkflowExecutions(searchText)}
          >
            Refresh
          </Button>
          <SearchText
            placeholder={getSearchPlaceholder('AMC_ExecutedQueries')}
            height="2.8rem"
            searchText={searchText}
            setSearchText={handleSearch}
          />
        </div>

        <div className={styles.wrapper}>
          <CustomTableWrapper
            data={executedQueriesData}
            columns={amcExecutedQueriesColumns}
            width="100%"
            height="60rem"
            isLoading={isLoading}
            pageSizes={PAGE_SIZE_OPTIONS}
            rowCount={totalRowCount}
            manualPagination={true}
            pagination={paginationModel}
            setPagination={setPaginationModel}
            initialPinnedColumns={{
              left: [
                amcExecutedQueriesColumns[0].id as string,
                amcExecutedQueriesColumns[1].id as string,
              ],
              right: [],
            }}
          />
        </div>
      </div>
    </div>
  );
}
