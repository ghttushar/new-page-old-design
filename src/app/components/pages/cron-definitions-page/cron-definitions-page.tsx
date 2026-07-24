import { ACTIVE_ENV } from '@/constants/env/env.orchestrator';
import { DialogTypeEnum } from '@/enums/cron/cron-definitions.enum';
import { PageTitleEnum } from '@/enums/index.enums';
import { MonitoringTableTitlesEnum } from '@/enums/monitoring.enum';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import {
  ICronDefinition,
  ICronDefinitionsInsert,
} from '@/interfaces/cron/cron-definitions.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  invalidateQueries,
  useAppMutation,
  useAppQuery,
} from '@/redux/react-query-hooks';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from '@/redux/slices/notifications/toast-message.slice';
import { cronDefinitionsService } from '@/services/monitoring/cron/cron-definitions.service';
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
import { cronDefinitionsColumns } from 'src/constants/table-columns/cron/cron-definitions-table-columns.constant';
import { selectSearchText } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import CronDefinitionsCreateDialog from '../../page-components/cron-definitions-components/cron-definitions-create-dialog/cron-definitions-create-dialog';
import CronDefinitionsViewDialog from '../../page-components/cron-definitions-components/cron-definitions-view-dialog/cron-definitions-view-dialog';
import MonitoringFilterWrapper from '../../page-components/monitoring-components/monitoring-filter-wrapper/monitoring-filter-wrapper';
import styles from './cron-definitions-page.module.scss';

export default function CronDefinitionsPage() {
  useSubHeader(PageTitleEnum.MONITORING_CRON_DEFINITIONS, '');

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const appliedFilters = useAppSelector(selectAppliedFilters);
  const searchText = useAppSelector(selectSearchText);

  const [pagination, setPagination] = useState<PaginationState>(
    UPDATED_PAGINATION_MODEL
  );

  const [dialogType, setDialogType] = useState<DialogTypeEnum | null>(null);
  const [selectedDefinition, setSelectedDefinition] =
    useState<ICronDefinition | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState<
    ColumnDef<ICronDefinition>[]
  >([]);

  const invalidateCronDefinitions = () =>
    invalidateQueries(queryClient, [QueryKeyEnums.FETCH_CRON_DEFINITIONS]);

  const {
    data: definitionsResponse,
    isLoading: isListLoading,
    isRefetching: isListRefetching,
    refetch,
  } = useAppQuery({
    queryKey: [QueryKeyEnums.FETCH_CRON_DEFINITIONS],
    queryFn: cronDefinitionsService.find,
  });

  const definitionsData = useMemo(() => {
    return getFilteredTableData(
      definitionsResponse?.data.data ?? [],
      appliedFilters,
      searchText,
      ['taskType']
    );
  }, [appliedFilters, definitionsResponse?.data?.data, searchText]);

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

  const handleCloseDialog = useCallback(() => {
    setDialogType(null);
    setSelectedDefinition(null);
  }, []);

  const toggleMutation = useAppMutation({
    mutationFn: ({
      taskType,
      enabled,
    }: {
      taskType: string;
      enabled: boolean;
    }) => cronDefinitionsService.update(taskType, { enabled }),
    options: {
      onSuccess: (res) => {
        dispatch(
          showSuccessToastMessage({
            title: res.data.message || 'Status updated successfully',
            description: res.data.description,
          })
        );
      },
      onError: () => {
        dispatch(
          showErrorToastMessage({
            title: 'Failed to update status',
            description: 'Please try again later.',
          })
        );
      },
      onSettled: invalidateCronDefinitions,
    },
  });

  const createMutation = useAppMutation({
    mutationFn: (data: ICronDefinitionsInsert) =>
      cronDefinitionsService.create(data),
    options: {
      onSuccess: (res) => {
        dispatch(
          showSuccessToastMessage({
            title: res.data.message || 'Definition created successfully',
            description: res.data.description,
          })
        );
        handleCloseDialog();
      },
      onError: () => {
        dispatch(
          showErrorToastMessage({
            title: 'Failed to create definition',
            description: 'Please try again later.',
          })
        );
      },
      onSettled: invalidateCronDefinitions,
    },
  });

  const updateMutation = useAppMutation({
    mutationFn: ({
      taskType,
      data,
    }: {
      taskType: string;
      data: Partial<ICronDefinitionsInsert>;
    }) => cronDefinitionsService.update(taskType, data),
    options: {
      onSuccess: (res) => {
        dispatch(
          showSuccessToastMessage({
            title: res.data.message || 'Definition updated successfully',
            description: res.data.description,
          })
        );
        handleCloseDialog();
      },
      onError: () => {
        dispatch(
          showErrorToastMessage({
            title: 'Failed to update definition',
            description: 'Please try again later.',
          })
        );
      },
      onSettled: invalidateCronDefinitions,
    },
  });

  const isMutating = useMemo(
    () =>
      createMutation.isPending ||
      updateMutation.isPending ||
      toggleMutation.isPending,
    [
      createMutation.isPending,
      updateMutation.isPending,
      toggleMutation.isPending,
    ]
  );

  const handleEdit = useCallback((def: ICronDefinition) => {
    setSelectedDefinition(def);
    setDialogType(DialogTypeEnum.EDIT);
  }, []);

  const handleView = useCallback((def: ICronDefinition) => {
    setSelectedDefinition(def);
    setIsViewDialogOpen(true);
  }, []);

  const handleToggleStatus = useCallback(
    (def: ICronDefinition) => {
      toggleMutation.mutate({ taskType: def.taskType, enabled: !def.enabled });
    },
    [toggleMutation]
  );

  const handleFormSubmit = useCallback(
    (data: ICronDefinitionsInsert) => {
      if (dialogType === 'edit' && selectedDefinition) {
        updateMutation.mutate({ taskType: selectedDefinition.taskType, data });
      } else {
        createMutation.mutate(data);
      }
    },
    [dialogType, selectedDefinition, updateMutation, createMutation]
  );
  const { mutate: syncCronDefinitions, isPending } = useAppMutation({
    mutationFn: () => cronDefinitionsService.migrateFromConfig(ACTIVE_ENV),
    options: {
      onSuccess: (res) => {
        dispatch(
          showSuccessToastMessage({
            title: res.data.message || 'Definitions Synced successfully',
            description: res.data.description,
          })
        );
      },
      onError: () => {
        dispatch(
          showErrorToastMessage({
            title: 'Failed to sync definitions',
            description: 'Please try again later.',
          })
        );
      },
      onSettled: invalidateCronDefinitions,
    },
  });

  const handleRefresh = useCallback(
    (a?: boolean) => {
      if (!a) {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        refetch();
      } else syncCronDefinitions();
    },
    [refetch, syncCronDefinitions]
  );

  const handlePaginationReset = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const columns = useMemo(
    () =>
      cronDefinitionsColumns({
        onView: handleView,
        onEdit: handleEdit,
        onToggleStatus: handleToggleStatus,
        totalRowCount: 0,
      }),
    [handleView, handleEdit, handleToggleStatus]
  );

  useEffect(() => {
    if (definitionsResponse?.data?.data) {
      const filteredColumns = columnFilterUtils.getStoredColumnFilters(
        MonitoringTableTitlesEnum.CRON_DEFINITIONS,
        columns
      );
      setSelectedColumns(filteredColumns as ColumnDef<ICronDefinition>[]);
    }
  }, [definitionsResponse?.data?.data]);

  const handleSelectedColumns = useCallback(
    (cols: ColumnDef<ICronDefinition>[]) => {
      columnFilterUtils.syncStoredColumnFilters(
        MonitoringTableTitlesEnum.CRON_DEFINITIONS,
        cols
      );
      setSelectedColumns(cols);
    },
    []
  );

  const handleDownload = useCallback(
    async (_isAllDownload: boolean): Promise<Record<string, unknown>[]> => {
      return definitionsData as unknown as Record<string, unknown>[];
    },
    [definitionsData]
  );

  return (
    <div className={styles.pageContainer}>
      <MonitoringFilterWrapper
        title={MonitoringTableTitlesEnum.CRON_DEFINITIONS}
        exportFileName="Cron_Definitions"
        handleDownload={handleDownload}
        onSearchChangeAdditionalLogic={handlePaginationReset}
        isLoading={isLoading || isPending}
        handleSelectedColumns={handleSelectedColumns}
        selectedColumns={selectedColumns}
        initialColumns={columns}
        handleRefetch={handleRefresh}
        filterConfig={getFilterConfigByMarketplace(
          columns,
          MarketplaceEnum.All,
          MonitoringTableTitlesEnum.CRON_DEFINITIONS
        )}
        selectedNavTab={MonitoringTableTitlesEnum.CRON_DEFINITIONS}
      />

      <CustomTableWrapper
        data={definitionsData}
        columns={selectedColumns}
        width="100%"
        height={appliedFilters.length > 0 ? '76vh' : '84vh'}
        isLoading={isLoading || isMutating || isPending}
        rowCount={definitionsData.length}
        pagination={pagination}
        setPagination={setPagination}
      />

      {dialogType !== null && (
        <CronDefinitionsCreateDialog
          open
          onClose={handleCloseDialog}
          onSubmit={handleFormSubmit}
          editData={selectedDefinition}
          isEditMode={dialogType === DialogTypeEnum.EDIT}
          isLoading={isMutating}
        />
      )}
      {isViewDialogOpen && (
        <CronDefinitionsViewDialog
          open={isViewDialogOpen}
          onClose={() => {
            setIsViewDialogOpen(false);
            setSelectedDefinition(null);
          }}
          definition={selectedDefinition}
        />
      )}
    </div>
  );
}
