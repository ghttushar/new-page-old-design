import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAmcSubHeader from '@/hooks/use-amc-sub-header.hook';
import { PaginationState } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import ConfirmationBox from 'src/app/components/common/confirmation-box/confirmation-box';
import SearchClear from 'src/app/components/common/search/search-clear';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS } from 'src/constants';
import {
  IAMCScheduleData,
  IAMCWorkflowQueryExecutionScheduleBody,
} from 'src/interfaces/amc.interfaces';
import { useAppDispatch } from 'src/redux/hooks';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { AMCQueryServices } from 'src/services/amc/amc-queries.services';
import searchUtils from 'src/utils/search.utils';
import { amcExecutedQueriesColumns } from './schedule-page-columns';
import styles from './schedule-page.module.scss';

export default function SchedulePage() {
  const amcFilters = useAmcSubHeader(
    PageTitleEnum.SCHEDULES,
    PAGE_TITLE_TOOLTIPS.SCHEDULES
  );
  const [scheduleExecutionData, setScheduleExecutionData] = useState<
    IAMCScheduleData[]
  >([]);
  const [searchedData, setSearchedData] = useState<IAMCScheduleData[]>([]);
  const [totalRowCount, setTotalRowCount] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IAMCScheduleData | null>(null);

  const dispatch = useAppDispatch();

  const handleSearchedQueries = (data: any[]) => setSearchedData(data);

  const handleDeleteConfirmationToggle = useCallback(
    (row: IAMCScheduleData) => {
      setOpenDeleteConfirmation((prevVal) => !prevVal);
      setSelectedRow(row);
      return;
    },
    []
  );

  const handleDeleteConfirmationClose = () => {
    setOpenDeleteConfirmation(false);
    setSelectedRow(null);
    return;
  };

  const handleDeleteSchedule = () => {
    if (selectedRow) {
      setIsLoading(true);
      AMCQueryServices.deleteWorkflowExecutionSchedules(selectedRow._id)
        .then((res) => {
          dispatch(
            showSuccessToastMessage({
              title: res.data.message,
              description: res.data.description,
            })
          );
        })
        .finally(() => {
          getWorkflowExecutionSchedules();
        });
      handleDeleteConfirmationClose();
    }
  };

  const handleUpdateSchedule = useCallback(
    (value: boolean, row: IAMCScheduleData) => {
      const body: IAMCWorkflowQueryExecutionScheduleBody = {
        ...row,
        scheduleStatus: value,
      };

      AMCQueryServices.updateWorkflowExecutionSchedule(row._id, body).then(
        (res) => {
          dispatch(
            showSuccessToastMessage({
              title: res.data.message,
              description: res.data.description,
            })
          );
        }
      );
    },
    [dispatch]
  );

  const getWorkflowExecutionSchedules = useCallback(() => {
    setIsLoading(true);
    AMCQueryServices.getWorkflowExecutionSchedules(
      amcFilters?.value as string,
      paginationModel.pageIndex + 1,
      paginationModel.pageSize
    )
      .then((res) => {
        const pagination = res.data.data.pagination;
        let data = res.data.data.data;
        let id = 0;
        data = data.map((schedule) => {
          id += 1;
          return {
            id,
            ...schedule,
          };
        });
        setScheduleExecutionData(data);
        setSearchedData(data);
        setTotalRowCount(pagination.totalItems as number);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    amcFilters?.value,
    paginationModel.pageIndex,
    paginationModel.pageSize,
  ]);

  useEffect(() => {
    getWorkflowExecutionSchedules();
  }, [getWorkflowExecutionSchedules]);

  // This useEffect is needed just in case if the totalRows count is undefined from server for some unknown reason.
  useEffect(() => {
    setTotalRowCount((prevTotalRows) =>
      totalRowCount !== undefined ? totalRowCount : prevTotalRows
    );
  }, [totalRowCount]);

  const customSearchHandler = (searchText: string) => {
    const searchedData = searchUtils.getSearchTableData(
      scheduleExecutionData,
      searchText,
      'AMC_ScheduledWorkflowExecutions'
    );
    setSearchedData(searchedData);
  };

  return (
    <div className={styles.executedQueryContainer}>
      <div className={styles.subContainer}>
        <div className={styles.tableHeader}>
          <SearchClear
            initialRows={scheduleExecutionData}
            title="AMC_ScheduledWorkflowExecutions"
            setUpdatedRows={handleSearchedQueries}
            height="2.8rem"
            customSearchHandler={customSearchHandler}
          />
        </div>

        <div className={styles.wrapper}>
          <CustomTableWrapper
            data={searchedData}
            columns={amcExecutedQueriesColumns(
              handleDeleteConfirmationToggle,
              handleUpdateSchedule
            )}
            width="100%"
            height="50rem"
            isLoading={isLoading}
            pageSizes={PAGE_SIZE_OPTIONS}
            rowCount={totalRowCount}
            manualPagination={true}
            pagination={paginationModel}
            setPagination={setPaginationModel}
          />
        </div>
      </div>
      {openDeleteConfirmation === true && (
        <ConfirmationBox
          title="Delete?"
          description="Are you sure you want to delete the scheduled Job? This action might
          result in the loss of data."
          openConfirmation={openDeleteConfirmation}
          handleConfirmationClose={handleDeleteConfirmationClose}
          handleConfirmClick={handleDeleteSchedule}
          confirmButtonText="Delete"
          isConfirmButtonRequired={true}
        />
      )}
    </div>
  );
}
