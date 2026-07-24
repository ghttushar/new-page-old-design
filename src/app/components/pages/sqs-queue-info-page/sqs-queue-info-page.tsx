import { PageTitleEnum } from '@/enums/index.enums';
import {
  MonitoringTableTitlesEnum,
  SqsQueueNameEnum,
} from '@/enums/monitoring.enum';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { ISQSQueue } from '@/interfaces/monitoring.interface';
import { useAppSelector } from '@/redux/hooks';
import {
  invalidateQueries,
  useAppMutation,
  useAppQuery,
} from '@/redux/react-query-hooks';
import { selectUser } from '@/redux/slices/auth/auth.slice';
import { monitoringService } from '@/services/monitoring/monitoring.service';
import columnFilterUtils from '@/utils/column-filter.utils';
import {
  getFilterConfigByMarketplace,
  getFilteredTableData,
} from '@/utils/row-filter.utils';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { UPDATED_PAGINATION_MODEL } from 'src/constants';
import { sqsQueueColumns } from 'src/constants/table-columns/monitoring/sqs-queue-table-columns.constant';
import { selectSearchText } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import ConfirmationBox from '../../common/confirmation-box/confirmation-box';
import MonitoringFilterWrapper from '../../page-components/monitoring-components/monitoring-filter-wrapper/monitoring-filter-wrapper';
import styles from './sqs-queue-info-page.module.scss';

export default function SQSQueueInfoPage() {
  useSubHeader(PageTitleEnum.QUEUES_INFO, '');

  const queryClient = useQueryClient();
  const user = useAppSelector(selectUser);
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const searchText = useAppSelector(selectSearchText);

  const [pagination, setPagination] = useState<PaginationState>(
    UPDATED_PAGINATION_MODEL
  );
  const [sqsQueueName, setSqsQueueName] = useState(
    SqsQueueNameEnum.DUMMY_QUEUE
  );

  const [selectedColumns, setSelectedColumns] = useState<
    ColumnDef<ISQSQueue>[]
  >([]);

  const {
    isPending,
    isIdle,
    mutateAsync: purgeSQSQueue,
  } = useAppMutation({
    mutationFn: (queueUrl: string) => monitoringService.purgeSQSQueue(queueUrl),
    options: {
      onSettled: () => {
        setSqsQueueName(SqsQueueNameEnum.DUMMY_QUEUE);
        invalidateQueries(queryClient, [QueryKeyEnums.FETCH_SQS_QUEUES]);
      },
    },
  });

  const {
    data: queuesResponse,
    isLoading: isListLoading,
    isRefetching: isListRefetching,
    refetch,
  } = useAppQuery({
    queryKey: [QueryKeyEnums.FETCH_SQS_QUEUES],
    queryFn: monitoringService.getSQSQueues,
  });

  const queuesData = useMemo(() => {
    return getFilteredTableData(
      queuesResponse?.data.data ?? [],
      appliedFilters,
      searchText,
      ['queueName']
    );
  }, [appliedFilters, queuesResponse?.data?.data, searchText]);

  const isLoading = useMemo(
    () => isListLoading || isListRefetching,
    [isListLoading, isListRefetching]
  );

  const prevPaginationRef = useRef(pagination);
  if (prevPaginationRef.current !== pagination) {
    prevPaginationRef.current = pagination;
    localStorageUtils.setPaginationModel({
      page: pagination.pageIndex,
      pageSize: pagination.pageSize,
    });
  }

  const handleRefresh = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    refetch();
  }, [refetch]);

  const handlePaginationReset = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handlePurgeQueue = (queueName: SqsQueueNameEnum) => {
    setSqsQueueName(queueName);
  };

  const columns = useMemo(
    () =>
      sqsQueueColumns({
        handlePurgeQueue,
        canEdit: user?.isSuperAdmin ?? false,
      }),
    [user?.isSuperAdmin]
  );

  useEffect(() => {
    if (queuesResponse?.data?.data) {
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        MonitoringTableTitlesEnum.SQS_QUEUES,
        columns
      );
      setSelectedColumns(filteredColumns as ColumnDef<ISQSQueue>[]);
    }
  }, [queuesResponse?.data?.data, columns]);

  const handleSelectedColumns = useCallback((cols: ColumnDef<ISQSQueue>[]) => {
    columnFilterUtils.syncStoredColumnFilters(
      MonitoringTableTitlesEnum.SQS_QUEUES,
      cols
    );
    setSelectedColumns(cols);
  }, []);

  const handleDownload = useCallback(
    async (_isAllDownload: boolean): Promise<Record<string, unknown>[]> => {
      return queuesData as unknown as Record<string, unknown>[];
    },
    [queuesData]
  );

  const filterConfig = useMemo(() => {
    return getFilterConfigByMarketplace(
      columns,
      MarketplaceEnum.All,
      MonitoringTableTitlesEnum.SQS_QUEUES
    );
  }, [columns]);

  return (
    <div className={styles.pageContainer}>
      <ConfirmationBox
        title={'Confirm Purging Queue!'}
        description={`Are you sure you want to purge the ${sqsQueueName}? You might lose the messages`}
        openConfirmation={sqsQueueName !== SqsQueueNameEnum.DUMMY_QUEUE}
        handleConfirmationClose={() =>
          setSqsQueueName(SqsQueueNameEnum.DUMMY_QUEUE)
        }
        isLoading={isPending && isIdle === false}
        handleConfirmClick={() => purgeSQSQueue(sqsQueueName)}
        confirmButtonText="Purge"
        isConfirmButtonRequired={true}
        loadingText="Purging Queue!!!"
      />
      <MonitoringFilterWrapper
        title={MonitoringTableTitlesEnum.SQS_QUEUES}
        exportFileName="SQS_Queues"
        handleDownload={handleDownload}
        onSearchChangeAdditionalLogic={handlePaginationReset}
        isLoading={isLoading}
        handleSelectedColumns={handleSelectedColumns}
        selectedColumns={selectedColumns}
        initialColumns={columns}
        handleRefetch={handleRefresh}
        filterConfig={filterConfig}
        selectedNavTab={MonitoringTableTitlesEnum.SQS_QUEUES}
      />

      <CustomTableWrapper
        data={queuesData}
        columns={selectedColumns}
        width="100%"
        height={appliedFilters.length > 0 ? '76vh' : '84vh'}
        isLoading={isLoading}
        rowCount={queuesData.length}
        pagination={pagination}
        setPagination={setPagination}
        isFooterRequired={true}
        initialPinnedColumns={{ left: ['Queue Name'] }}
      />
    </div>
  );
}
