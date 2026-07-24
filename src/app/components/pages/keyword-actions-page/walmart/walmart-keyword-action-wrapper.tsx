import React, { useCallback, useEffect, useMemo } from 'react';
import ConfirmationBox from 'src/app/components/common/confirmation-box/confirmation-box';
import { UPDATED_PAGINATION_MODEL } from 'src/constants';
import { Adjustments } from 'src/enums/advertising.enums';
import { Filters } from 'src/enums/filter.enums';
import {
  KeywordActionsAction,
  KeywordActionTabsEnum,
} from 'src/enums/keyword-action.enums';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import {
  IArchiveSearchTermsPayload,
  IGetArchiveSearchTermData,
  IGetArchiveSearchTermPayload,
  IKeywordActionData,
  IKeywordHistoryResponse,
  ISelectedMatchTypeForKeywordAddition,
  ISelectedSearchTermsToArchive,
  IWalmartKeywordAdditionBody,
} from 'src/interfaces/keyword-actions.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectSearchText } from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  IFinalFilters,
  selectAppliedFilters,
} from 'src/redux/slices/filters/filter.slice';

import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { useQueryClient } from '@tanstack/react-query';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { KeywordActionWalmartFilter } from 'src/app/components/common/filter/keyword-action-filter-walmart';
import { KEYWORD_ARCHIVE_COLUMNS } from 'src/app/components/common/keyword-actions-table/archive/keyword-action-archive-column';
import KeywordHistoryTable from 'src/app/components/common/keyword-actions-table/history/keyword-history-table';
import { KEYWORD_HISTORY_COLUMNS } from 'src/app/components/common/keyword-actions-table/history/new-keyword-history-column';
import { DEFAULT_ADVERTISING_SORT_CRITERIA } from 'src/constants/advertising-filter.constants';
import {
  DEFAULT_KEYWORD_ACTION_SORT_CRITERIA,
  WALMART_MAX_BID,
  WALMART_MIN_BID,
} from 'src/constants/keyword-action.constants';
import {
  selectAllWalmartKeywordBid,
  selectAllWalmartMatchTypeToAdd,
  selectAllWalmartTargetAdGroups,
  selectAllWalmartTargetCampaigns,
  selectWalmartAppliedKeywordActionFilters,
  selectWalmartKeywordActionSelectedRowIds,
  selectWalmartKeywordActionsTableData,
  selectWalmartSelectedColumns,
  selectWalmartSelectedTab,
  selectWalmartTrigger,
  selectWalmartUpdatedAdditionTableData,
  setInitialWalmartKeywordBid,
  setInitWalmartKeywordActionData,
  setIsWmtApplyBtnDisabled,
  setWalmartAllKeywordBids,
  setWalmartBidErrorMessage,
  setWalmartKeywordActionSelectedRowIds,
  setWalmartKeywordActionsTableData,
  setWalmartUpdatedAdditionTableData,
} from 'src/redux/slices/keyword-action/walmart/keyword-action.slice';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import { KeywordActionsWalmartService } from 'src/services/keyword-actions-walmart.service';
import {
  genExportFileName,
  getSelectedRowIds,
  getUpdatedPagination,
} from 'src/utils';
import { getCalculatedBudgetBid } from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';
import keywordActionsUtils from 'src/utils/keyword-actions.utils';
import AddedFiltersTab from '../../../common/added-filters-tab/added-filters-tab';
import DownloadTableButton from '../../../common/download-button/download-table-button';
import { IDropdownItem } from '../../../common/dropdown/dropdown';
import KeywordArchiveTable from '../../../common/keyword-actions-table/archive/keyword-archive-table';
import KeywordActionTable from '../../../common/keyword-actions-table/keyword-action-table';
import ServerSearch from '../../../common/search/server-search';
import { KeywordActionSelectionTab } from '../../../page-components/keyword-action-selection-tab/keyword-action-selection-tab';
import { KeywordActionsTabs } from '../../../page-components/keyword-action-tabs/keyword-actions-tabs';
import styles from '../keyword-action-wrapper.module.scss';

export default function WalmartKeywordActionWrapper() {
  const [historyData, setHistoryData] = React.useState<
    IKeywordHistoryResponse[]
  >([]);
  const [archiveData, setArchiveData] = React.useState<
    IGetArchiveSearchTermData[]
  >([]);
  const [paginationModel, setPaginationModel] = React.useState<PaginationState>(
    UPDATED_PAGINATION_MODEL
  );
  const [sortModel, setSortModel] = React.useState<SortingState>(
    DEFAULT_ADVERTISING_SORT_CRITERIA
  );
  const [archiveSortModel, setArchiveSortModel] = React.useState<SortingState>(
    DEFAULT_KEYWORD_ACTION_SORT_CRITERIA
  );
  const [keywordHistorySortModel, setKeywordHistorySortModel] =
    React.useState<SortingState>(DEFAULT_KEYWORD_ACTION_SORT_CRITERIA);
  const [totalRowCount, setTotalRowCount] = React.useState<number>(0);
  const [showConfirmationModal, setShowConfirmationModal] =
    React.useState(false);
  const [showArchiveModal, setShowArchiveModal] = React.useState(false);
  const [targetAdGroupIdCampaignIdMap, setTargetAdGroupIdCampaignIdMap] =
    React.useState<Map<string, string>>(new Map<string, string>());
  const [openInvalidModal, setOpenInvalidModal] =
    React.useState<boolean>(false);
  const [errorTitle, setErrorTitle] = React.useState<string>('');
  const [errorDescription, setErrorDescription] = React.useState<string>('');

  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const appliedAdditionActionTypeFilters = useAppSelector(
    selectWalmartAppliedKeywordActionFilters
  );

  const searchText = useAppSelector(selectSearchText);
  const allKeywordBids = useAppSelector(selectAllWalmartKeywordBid);
  const allTargetCampaigns = useAppSelector(selectAllWalmartTargetCampaigns);
  const allTargetAdGroups = useAppSelector(selectAllWalmartTargetAdGroups);
  const allTargetMatchTypes = useAppSelector(selectAllWalmartMatchTypeToAdd);
  const selectedRowIds = useAppSelector(
    selectWalmartKeywordActionSelectedRowIds
  );
  const trigger = useAppSelector(selectWalmartTrigger);
  const selectedTab = useAppSelector(selectWalmartSelectedTab);
  const selectedColumns = useAppSelector(selectWalmartSelectedColumns);
  const updatedAdditionTableData = useAppSelector(
    selectWalmartUpdatedAdditionTableData
  );
  const appliedRowFilters = useAppSelector(selectAppliedFilters);
  const initialKeywordAdditionData = useAppSelector(
    selectWalmartKeywordActionsTableData
  );
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const advertiserId = useMemo(() => {
    return advertisingAccount.value;
  }, [advertisingAccount]);

  const fetchWalmartHistory = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_TARGET_ACTION_HISTORY_FETCH,
      {
        paginationModel,
        keywordHistorySortModel,
        searchText,
        trigger,
        advertiserId,
      },
    ],
    queryFn: () =>
      KeywordActionsWalmartService.getHistory({
        page: paginationModel.pageIndex + 1,
        pageSize: paginationModel.pageSize,
        sortCriteria: columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
          KEYWORD_HISTORY_COLUMNS,
          keywordHistorySortModel
        ),
        searchText: searchText,
      }),
    enabled: selectedTab === KeywordActionTabsEnum.HISTORY_WALMART,
  });

  useEffect(() => {
    setHistoryData([]);

    if (fetchWalmartHistory.data) {
      let count = 0;
      const data = fetchWalmartHistory.data.data.data.data.map((item) => ({
        ...item,
        id: count++,
      }));
      setHistoryData(data);
      setTotalRowCount(
        fetchWalmartHistory.data.data.data.pagination.totalItems as number
      );
    }
  }, [fetchWalmartHistory.data]);

  const isHistoryDataUpdated = useMemo(
    () => fetchWalmartHistory.isFetching === false,
    [fetchWalmartHistory.isFetching]
  );

  const getArchiveSearchTermPayload = useCallback(
    (
      isDownload: boolean,
      isAllDownload: boolean
    ): IGetArchiveSearchTermPayload => {
      return {
        page: paginationModel.pageIndex + 1,
        pageSize: paginationModel.pageSize,
        sortCriteria: columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
          KEYWORD_ARCHIVE_COLUMNS,
          archiveSortModel
        ),
        searchText: searchText,
        isDownload: isDownload,
        downloadWithFilter: isAllDownload,
      };
    },
    [paginationModel, archiveSortModel, searchText]
  );

  const getArchiveSearchTermPayloadNoDownload = useMemo(
    () => getArchiveSearchTermPayload(false, false),
    [getArchiveSearchTermPayload]
  );

  const fetchWalmartArchive = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_TARGET_ACTION_ARCHIVE_FETCH,
      getArchiveSearchTermPayloadNoDownload,
      trigger,
      advertiserId,
    ],
    queryFn: () =>
      KeywordActionsWalmartService.getArchiveSearchTerms(
        getArchiveSearchTermPayloadNoDownload
      ),
    enabled: selectedTab === KeywordActionTabsEnum.ARCHIVE_WALMART,
  });

  useEffect(() => {
    setArchiveData([]);

    if (fetchWalmartArchive.data) {
      let count = 0;
      const data = fetchWalmartArchive.data.data.data.data.map((item) => ({
        ...item,
        id: count++,
      }));
      setArchiveData(data);
      setTotalRowCount(
        fetchWalmartArchive.data.data.data.pagination.totalItems as number
      );
    }
  }, [fetchWalmartArchive.data]);

  const isArchiveDataUpdated = useMemo(
    () => fetchWalmartArchive.isFetching === false,
    [fetchWalmartArchive.isFetching]
  );

  const convertMatchTypeToAddToLowerCase = useCallback(
    (finalFilter: IFinalFilters[]): IFinalFilters[] => {
      return finalFilter.map((filter) => {
        if (
          Array.isArray(filter.filterValue) &&
          filter.filterKey === Filters.MATCH_TYPE_ADD
        ) {
          return {
            ...filter,
            filterValue: filter.filterValue.map((value) => value.toLowerCase()),
          };
        }
        return filter;
      });
    },
    []
  );

  const convertMatchTypeToAddToUpperCase = useCallback(
    (data: IKeywordActionData[]): IKeywordActionData[] => {
      return data.map((row) => {
        return {
          ...row,
          matchTypeToAdd: row.matchTypeToAdd.map((matchType) =>
            matchType.toUpperCase()
          ),
        };
      });
    },
    []
  );

  const getWalmartKeywordActionPayload = useCallback(
    (isDownload: boolean, isAllDownload: boolean) => {
      return {
        page: paginationModel.pageIndex + 1,
        pageSize: paginationModel.pageSize,
        actionType: appliedAdditionActionTypeFilters.actionType?.value,
        dateRange: appliedAdditionActionTypeFilters.dateRange?.value,
        priority: appliedAdditionActionTypeFilters.priority?.value,
        action: KeywordActionsAction.ADDITION,
        filters: convertMatchTypeToAddToLowerCase(appliedRowFilters),
        searchText: searchText,
        sortCriteria: columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
          keywordActionsUtils.getKeywordActionInitColumns(selectedTab),
          sortModel
        ),
        isDownload,
        downloadWithFilter: isAllDownload,
      };
    },
    [
      paginationModel,
      appliedAdditionActionTypeFilters,
      convertMatchTypeToAddToLowerCase,
      searchText,
      selectedTab,
      sortModel,
      appliedRowFilters,
    ]
  );

  const getWalmartKeywordActionPayloadNoDownload = useMemo(
    () => getWalmartKeywordActionPayload(false, false),
    [getWalmartKeywordActionPayload]
  );

  const fetchWalmartKeywordAddition = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_KEYWORD_ADDITION_FETCH,
      getWalmartKeywordActionPayloadNoDownload,
      trigger,
      advertiserId,
    ],
    queryFn: ({ signal }) => {
      dispatch(setWalmartKeywordActionSelectedRowIds({}));
      dispatch(setWalmartBidErrorMessage(null));

      return KeywordActionsWalmartService.getKeywordActionRecommendationData(
        getWalmartKeywordActionPayloadNoDownload,
        signal
      );
    },
    enabled:
      appliedRowFilters.length > 0 &&
      selectedTab !== KeywordActionTabsEnum.HISTORY_WALMART &&
      selectedTab !== KeywordActionTabsEnum.ARCHIVE_WALMART,
  });

  const isKeywordAdditionDataLoaded = useMemo(
    () => fetchWalmartKeywordAddition.isFetching === false,
    [fetchWalmartKeywordAddition.isFetching]
  );

  const isWalmartDataLoading = useMemo(
    () => fetchWalmartKeywordAddition.isFetching === true,
    [fetchWalmartKeywordAddition.isFetching]
  );
  useEffect(() => {
    dispatch(setWalmartKeywordActionsTableData([]));
    dispatch(setWalmartUpdatedAdditionTableData([]));

    if (fetchWalmartKeywordAddition.data) {
      const tableData = fetchWalmartKeywordAddition.data.data.data.data;
      const paginationDetails =
        fetchWalmartKeywordAddition.data.data.data.pagination;

      const data = convertMatchTypeToAddToUpperCase(tableData);
      setTotalRowCount(paginationDetails.totalItems as number);

      const adGroupMap =
        keywordActionsUtils.getTargetAdGroupIdCampaignIdMap(data);
      setTargetAdGroupIdCampaignIdMap(adGroupMap);

      const initPayload = keywordActionsUtils.getInitData(
        data,
        MarketplaceEnum.WALMART
      );
      dispatch(setInitWalmartKeywordActionData(initPayload));
      dispatch(setInitialWalmartKeywordBid(initPayload.keywordBid));

      dispatch(setWalmartKeywordActionsTableData(data));
      dispatch(setWalmartUpdatedAdditionTableData(data));
    }
  }, [
    convertMatchTypeToAddToUpperCase,
    dispatch,
    fetchWalmartKeywordAddition.data,
  ]);

  const getRecommendationDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const res =
        await KeywordActionsWalmartService.getKeywordActionRecommendationData(
          getWalmartKeywordActionPayload(true, !isAllDownload)
        ).then((res) => {
          dispatch(
            showSuccessToastMessage({
              title: 'Download Completed',
              description: 'Your file downloaded successfully.',
            })
          );

          return res.data.data.data as unknown as Record<string, unknown>[];
        });

      return res;
    },
    [getWalmartKeywordActionPayload, dispatch]
  );

  const handleArchiveDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const data = await KeywordActionsWalmartService.getArchiveSearchTerms(
        getArchiveSearchTermPayload(true, !isAllDownload)
      ).then((res) => {
        dispatch(
          showSuccessToastMessage({
            title: 'Download Completed',
            description: 'Your file downloaded successfully.',
          })
        );

        return res.data.data.data as unknown as Record<string, unknown>[];
      });

      return data;
    },
    [dispatch, getArchiveSearchTermPayload]
  );

  const applyCustomBidToRowData = (
    customBid: number,
    adjustment: IDropdownItem<Adjustments>
  ) => {
    if (!customBid) return;

    const keywordBidsClone = allKeywordBids.map((row) => [...row]);
    const updatedBids = keywordBidsClone.map(
      (row: number[], bidRowId: number) => {
        if (getSelectedRowIds(selectedRowIds).includes(bidRowId)) {
          allTargetMatchTypes[bidRowId].forEach(
            (matchType: IMultiSelectDropdownItem, idx: number) => {
              if (matchType.selected) {
                const prevBid = row[idx];
                const newBid = getCalculatedBudgetBid(
                  Number(prevBid),
                  customBid,
                  adjustment.value
                );

                if (newBid < WALMART_MIN_BID) {
                  setOpenInvalidModal(true);
                  setErrorTitle('Invalid Bids');
                  setErrorDescription(
                    `Some bids are lower than ${WALMART_MIN_BID}, which is not permitted.`
                  );
                  return;
                }
                if (newBid > WALMART_MAX_BID) {
                  setOpenInvalidModal(true);
                  setErrorTitle('Invalid Bids');
                  setErrorDescription(
                    `Some bids are higher than ${WALMART_MAX_BID}, which is not permitted.`
                  );
                  return;
                }
                row[idx] = Number(newBid.toFixed(2));
              }
            }
          );
        }
        return row;
      }
    );

    dispatch(setWalmartAllKeywordBids(updatedBids));
  };

  const handleConfirmationModalClose = () => {
    setShowConfirmationModal(false);
  };

  const handleClose = () => {
    setOpenInvalidModal(false);
  };

  const checkForInvalidBids = () => {
    const isBidsLesserThanMinBid = getSelectedRowIds(selectedRowIds).some(
      (id) => {
        const bids = allKeywordBids[Number(id)];
        return bids.some((bid) => bid < WALMART_MIN_BID);
      }
    );

    if (isBidsLesserThanMinBid) {
      setOpenInvalidModal(true);
      setErrorTitle('Invalid Bids');
      setErrorDescription(
        `Some bids are lower than ${WALMART_MIN_BID}, which is not permitted.`
      );
      return true;
    }

    const isBidsGreaterThanMaxBid = getSelectedRowIds(selectedRowIds).some(
      (id) => {
        const bids = allKeywordBids[Number(id)];
        return bids.some((bid) => bid > WALMART_MAX_BID);
      }
    );

    if (isBidsGreaterThanMaxBid) {
      setOpenInvalidModal(true);
      setErrorTitle('Invalid Bids');
      setErrorDescription(
        `Some bids are higher than ${WALMART_MAX_BID}, which is not permitted.`
      );
      return true;
    }

    return false;
  };

  const checkInvalidPayload = (
    processedData: IWalmartKeywordAdditionBody[]
  ) => {
    if (processedData.length === 0) {
      setOpenInvalidModal(true);
      setErrorTitle('Invalid Payload');
      setErrorDescription(
        `Some required fields are missing or incomplete. Please review and try again.`
      );
      return true;
    }

    const errors = keywordActionsUtils.validatePayload(processedData);
    if (errors.length > 0) {
      setOpenInvalidModal(true);
      setErrorTitle('Invalid Payload');
      setErrorDescription(errors[0]);
      return true;
    }

    return false;
  };

  const {
    mutateAsync: mutateAddBulkKeywords,
    isPending: isAddBulkKeywordsPending,
    isIdle: isAddBulkKeywordsIdle,
  } = useAppMutation({
    mutationFn: ({
      body,
      processedDataLength,
    }: {
      body: IWalmartKeywordAdditionBody[];
      processedDataLength: number;
    }) => {
      setShowConfirmationModal(false);
      return KeywordActionsWalmartService.addKeywords(body);
    },

    options: {
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_KEYWORD_ADDITION_FETCH],
        });

        const keywords = res.data;
        const processedDataLength = variables.processedDataLength;

        if (keywords.error) {
          dispatch(
            showErrorToastMessage({
              title: `Failed! ${keywords.data.errorCount}/${processedDataLength} keyword(s) have failed to add.`,
            })
          );
        }
        if (keywords.success) {
          dispatch(
            showSuccessToastMessage({
              title: `Success! ${keywords.data.successCount}/${processedDataLength} keyword(s) have been added.`,
            })
          );
        }
      },
      onSettled() {
        dispatch(setIsWmtApplyBtnDisabled(false));
      },
    },
  });

  const addBulkKeywords = async () => {
    const hasInvalidBids = checkForInvalidBids();
    if (hasInvalidBids) return;

    const selectedKeywordsToAdd = getSelectedRowIds(selectedRowIds).map(
      (id) => {
        const matchTypes = allTargetMatchTypes[Number(id)];
        const bids = allKeywordBids[Number(id)];
        const adGroups = allTargetAdGroups[Number(id)].filter(
          (adGroup) => adGroup.selected
        );
        const campaigns = allTargetCampaigns[Number(id)].filter(
          (campaign) => campaign.selected
        );
        const searchTerm = updatedAdditionTableData[Number(id)].searchTerm;
        const data: ISelectedMatchTypeForKeywordAddition[] = [];

        matchTypes.forEach((_, index) => {
          const matchType = matchTypes[index];
          const bid = bids[index];
          if (matchType.selected) {
            data.push({
              bid,
              adGroups,
              matchType,
              campaigns,
              searchTerm,
            });
          }
        });
        return data;
      }
    );

    const processedData =
      keywordActionsUtils.createWalmartKeywordAdditionPayloadForSelectedRows(
        targetAdGroupIdCampaignIdMap,
        selectedKeywordsToAdd
      );

    const invalidPayload = checkInvalidPayload(processedData);
    if (invalidPayload) return;

    const processedDataLength = processedData.length;
    dispatch(setIsWmtApplyBtnDisabled(true));
    await mutateAddBulkKeywords({ body: processedData, processedDataLength });
  };

  const isAddBulkKeywordsLoading = useMemo(
    () => isAddBulkKeywordsPending === true && isAddBulkKeywordsIdle === false,
    [isAddBulkKeywordsPending, isAddBulkKeywordsIdle]
  );

  const {
    mutateAsync: mutateArchiveSearchTerms,
    isPending: isArchivePending,
    isIdle: isArchiveIdle,
  } = useAppMutation({
    mutationFn: (body: IArchiveSearchTermsPayload[]) => {
      setShowArchiveModal(false);
      return KeywordActionsWalmartService.archiveSearchTerms(body);
    },
    options: {
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_KEYWORD_ADDITION_FETCH],
        });

        const result = res.data.data;
        dispatch(
          showSuccessToastMessage({
            title: `Success! ${result.count} Search Term(s) have been archived.`,
          })
        );
      },
      onSettled() {
        dispatch(setIsWmtApplyBtnDisabled(false));
      },
    },
  });

  const archiveSearchTerms = async () => {
    const selectedKeywordsToArchive = getSelectedRowIds(selectedRowIds).map(
      (id) => {
        const matchTypes = allTargetMatchTypes[Number(id)];
        const adGroups = allTargetAdGroups[Number(id)].filter(
          (adGroup) => adGroup.selected
        );
        const searchTerm = updatedAdditionTableData[Number(id)].searchTerm;
        const data: ISelectedSearchTermsToArchive[] = [];

        matchTypes.forEach((matchType) => {
          if (matchType.selected) {
            data.push({
              adGroups,
              searchTerm,
              matchType,
              dateRange: appliedAdditionActionTypeFilters.dateRange?.value,
            });
          }
        });
        return data;
      }
    );

    const processedData =
      keywordActionsUtils.createWalmartSearchTermArchivePayloadForSelectedRows(
        selectedKeywordsToArchive
      );

    dispatch(setIsWmtApplyBtnDisabled(true));
    await mutateArchiveSearchTerms(processedData);
  };

  const isArchiveLoading = useMemo(
    () => isArchivePending === true && isArchiveIdle === false,
    [isArchivePending, isArchiveIdle]
  );

  const handlePaginationReset = useCallback(
    () => setPaginationModel(getUpdatedPagination),
    []
  );

  return (
    <React.Fragment>
      <div className={styles.keywordActionWrapperContainer}>
        <KeywordActionsTabs activeTab={selectedTab} />
        <div className={styles.keywordActionTableContainer}>
          {selectedTab !== KeywordActionTabsEnum.HISTORY_WALMART &&
          selectedTab !== KeywordActionTabsEnum.ARCHIVE_WALMART ? (
            <React.Fragment>
              <KeywordActionWalmartFilter />
              <KeywordActionSelectionTab
                addBulkKeywords={addBulkKeywords}
                archiveSearchTerms={archiveSearchTerms}
                selectedTab={selectedTab}
                handleConfirmationModalClose={handleConfirmationModalClose}
                setShowConfirmationModal={setShowConfirmationModal}
                showConfirmationModal={showConfirmationModal}
                totalRows={updatedAdditionTableData.length}
                title={'Keyword_Action'}
                isDataLoaded={
                  isKeywordAdditionDataLoaded &&
                  !isAddBulkKeywordsLoading &&
                  !isArchiveLoading
                }
                handleApplyCustomBid={applyCustomBidToRowData}
                handleDownload={getRecommendationDownload}
                showArchiveModal={showArchiveModal}
                setShowArchiveModal={setShowArchiveModal}
                initialKeywordAdditionData={initialKeywordAdditionData}
                initialKeywordNegationData={[]}
                selectedRowIds={getSelectedRowIds(selectedRowIds)}
                handlePaginationReset={handlePaginationReset}
              />
              <AddedFiltersTab
                appliedFilters={appliedRowFilters}
                disableFilterConfig={keywordActionsUtils.getKeywordActionDisableFilterConfig(
                  selectedTab
                )}
                selectedAdvertisingNavTitle={selectedTab}
                isLoading={
                  !isKeywordAdditionDataLoaded ||
                  isAddBulkKeywordsLoading ||
                  isArchiveLoading
                }
              />
              <KeywordActionTable
                rows={updatedAdditionTableData}
                selectedTab={selectedTab}
                totalRowCount={totalRowCount}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                sortModel={sortModel}
                setSortModel={setSortModel}
                selectedRowIds={selectedRowIds}
                isDataLoading={
                  !isKeywordAdditionDataLoaded ||
                  isAddBulkKeywordsLoading ||
                  isArchiveLoading
                }
                selectedColumns={selectedColumns}
              />
            </React.Fragment>
          ) : selectedTab === KeywordActionTabsEnum.HISTORY_WALMART ? (
            <div className={styles.tabContainer}>
              <div className={styles.tabSearch}>
                <ServerSearch
                  title={'Search Keywords in history'}
                  height="3rem"
                  handleCustomSearchChange={handlePaginationReset}
                />
              </div>
              <KeywordHistoryTable
                rows={historyData}
                isHistoryDataUpdated={isHistoryDataUpdated}
                totalRowCount={totalRowCount}
                setPaginationModel={setPaginationModel}
                paginationModel={paginationModel}
                sortModel={keywordHistorySortModel}
                setSortModel={setKeywordHistorySortModel}
                selectedTab={selectedTab}
              />
            </div>
          ) : (
            <div className={styles.tabContainer}>
              <div className={styles.tabSearch}>
                <ServerSearch
                  title={'Search Keywords in archive table'}
                  height="3rem"
                  handleCustomSearchChange={handlePaginationReset}
                />
                <DownloadTableButton
                  hoverInfoText="Download Archive Keywords"
                  data={[]}
                  filename={genExportFileName(
                    'walmart',
                    'archive-search-terms'
                  )}
                  squareDimension="3rem"
                  enclosingCharacter='"'
                  title={'archive-search-terms'}
                  handleDownload={handleArchiveDownload}
                />
              </div>
              <KeywordArchiveTable
                rows={archiveData}
                isArchiveDataUpdated={isArchiveDataUpdated}
                totalRowCount={totalRowCount}
                setPaginationModel={setPaginationModel}
                paginationModel={paginationModel}
                sortModel={archiveSortModel}
                setSortModel={setArchiveSortModel}
                selectedTab={selectedTab}
              />
            </div>
          )}
        </div>
      </div>

      {openInvalidModal === true && (
        <ConfirmationBox
          title={errorTitle}
          description={errorDescription}
          openConfirmation={openInvalidModal}
          handleConfirmationClose={handleClose}
          isConfirmButtonRequired={false}
        />
      )}
    </React.Fragment>
  );
}
