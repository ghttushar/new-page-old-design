import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import {
  selectAppliedProductActionFilters,
  selectProductActionFilters,
  selectProductActionOptions,
  selectProductActionTableData,
  selectUpdatedProductActionTableData,
  setAppliedProductActionFilters,
  setProductActionFilters,
  setProductActionTableData,
  setUpdatedProductActionTableData,
} from '@/redux/slices/keyword-action/amazon/product-action.slice';
import {
  selectAppliedProductNegationFilters,
  selectProductNegationFilters,
  selectProductNegationOptions,
  selectProductNegationTableData,
  selectUpdatedProductNegationTableData,
  setAppliedProductNegationFilters,
  setProductNegationFilters,
  setProductNegationTableData,
  setUpdatedProductNegationTableData,
} from '@/redux/slices/keyword-action/amazon/product-negation.slice';
import { getStoredLsFilters } from '@/utils/row-filter.utils';
import { useQueryClient } from '@tanstack/react-query';
import { PaginationState, SortingState } from '@tanstack/react-table';
import React, { useCallback, useEffect, useMemo } from 'react';
import ConfirmationBox from 'src/app/components/common/confirmation-box/confirmation-box';
import { KEYWORD_ARCHIVE_COLUMNS } from 'src/app/components/common/keyword-actions-table/archive/keyword-action-archive-column';
import KeywordHistoryTable from 'src/app/components/common/keyword-actions-table/history/keyword-history-table';
import { KEYWORD_HISTORY_COLUMNS } from 'src/app/components/common/keyword-actions-table/history/new-keyword-history-column';
import { UPDATED_PAGINATION_MODEL } from 'src/constants';
import { DEFAULT_ADVERTISING_SORT_CRITERIA } from 'src/constants/advertising-filter.constants';
import { DEFAULT_KEYWORD_ACTION_SORT_CRITERIA } from 'src/constants/keyword-action.constants';
import { AdType, Adjustments } from 'src/enums/advertising.enums';
import {
  KeywordActionPriority,
  KeywordActionTabsEnum,
  KeywordActionsAction,
  TargetingActionTypeEnum,
} from 'src/enums/keyword-action.enums';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import {
  IArchiveSearchTermsPayload,
  IGetArchiveSearchTermData,
  IGetArchiveSearchTermPayload,
  IKeywordActionFilterForm,
  IKeywordAdditionBody,
  IKeywordHistoryResponse,
  IKeywordNegationBody,
  IProductAdditionBody,
  IProductNegationBody,
  ISelectedMatchTypeForKeywordAddition,
  ISelectedMatchTypeForKeywordNegation,
  ISelectedMatchTypeForProductAddition,
  ISelectedSearchTermsToArchive,
} from 'src/interfaces/keyword-actions.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectAdvertisingHeaderFilters,
  selectSearchText,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import { selectAppliedFilters } from 'src/redux/slices/filters/filter.slice';
import {
  selectAppliedKeywordNegationFilters,
  selectKeywordNegationFilters,
  selectKeywordNegationOptions,
  selectKeywordNegationTableData,
  selectUpdatedKeywordNegationTableData,
  setAppliedKeywordNegationFilters,
  setKeywordNegationFilters,
  setKeywordNegationTableData,
  setUpdatedNegationTableData,
} from 'src/redux/slices/keyword-action/amazon/keyword-action-negation.slice';
import {
  initKeywordActionData,
  initialKeywordBid,
  selectAllKeywordBid,
  selectAllMatchTypeToAdd,
  selectAllTargetAdGroups,
  selectAllTargetCampaigns,
  selectAppliedKeywordActionFilters,
  selectKeywordActionFilters,
  selectKeywordActionOptions,
  selectKeywordActionSelectedRowIds,
  selectKeywordActionsTableData,
  selectSelectedColumns,
  selectSelectedTab,
  selectTrigger,
  selectUpdatedAdditionTableData,
  setAllKeywordBids,
  setAppliedKeywordActionFilters,
  setBidErrorMessage,
  setIsApplyBtnDisabled,
  setIsRowEdited,
  setKeywordActionFilters,
  setKeywordActionSelectedRowIds,
  setKeywordActionsTableData,
  setUpdatedAdditionTableData,
} from 'src/redux/slices/keyword-action/amazon/keyword-action.slice';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import { KeywordActionsAmazonService } from 'src/services/keyword-actions-amazon.service';
import {
  convertToLowerCase,
  genExportFileName,
  getAmzSPMaxBidLimitByCountry,
  getAmzSPMinBidLimitByCountry,
  getSelectedRowIds,
  getUpdatedPagination,
} from 'src/utils';
import {
  getCalculatedBudgetBid,
  getCurrentAdType,
} from 'src/utils/advertising.utils';
import columnFilterUtils from 'src/utils/column-filter.utils';
import keywordActionsUtils from 'src/utils/keyword-actions.utils';
import AddedFiltersTab from '../../../common/added-filters-tab/added-filters-tab';
import DownloadTableButton from '../../../common/download-button/download-table-button';
import { IDropdownItem } from '../../../common/dropdown/dropdown';
import { KeywordActionFilter } from '../../../common/filter/keyword-action-filter';
import KeywordArchiveTable from '../../../common/keyword-actions-table/archive/keyword-archive-table';
import KeywordActionTable from '../../../common/keyword-actions-table/keyword-action-table';
import ServerSearch from '../../../common/search/server-search';
import { KeywordActionSelectionTab } from '../../../page-components/keyword-action-selection-tab/keyword-action-selection-tab';
import { KeywordActionsTabs } from '../../../page-components/keyword-action-tabs/keyword-actions-tabs';
import styles from '../keyword-action-wrapper.module.scss';

export default function AmazonKeywordActionWrapper() {
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

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const keywordAdditionFilters = useAppSelector(selectKeywordActionFilters);
  const keywordNegationFilters = useAppSelector(selectKeywordNegationFilters);
  const productAdditionFilters = useAppSelector(selectProductActionFilters);
  const productNegationFilters = useAppSelector(selectProductNegationFilters);
  const additionOptions = useAppSelector(selectKeywordActionOptions);
  const productActionOptions = useAppSelector(selectProductActionOptions);
  const negationOptions = useAppSelector(selectKeywordNegationOptions);
  const productNegationOptions = useAppSelector(selectProductNegationOptions);
  const keywordAdditionAppliedFilters = useAppSelector(
    selectAppliedKeywordActionFilters
  );
  const selectedAdTypeFilter = useAppSelector(selectAdvertisingHeaderFilters);
  const keywordNegationAppliedFilters = useAppSelector(
    selectAppliedKeywordNegationFilters
  );
  const productAdditionAppliedFilters = useAppSelector(
    selectAppliedProductActionFilters
  );
  const productNegationAppliedFilters = useAppSelector(
    selectAppliedProductNegationFilters
  );

  const searchText = useAppSelector(selectSearchText);
  const allKeywordBids = useAppSelector(selectAllKeywordBid);
  const allTargetCampaigns = useAppSelector(selectAllTargetCampaigns);
  const allTargetAdGroups = useAppSelector(selectAllTargetAdGroups);
  const allTargetMatchTypes = useAppSelector(selectAllMatchTypeToAdd);
  const selectedRowIds = useAppSelector(selectKeywordActionSelectedRowIds);
  const trigger = useAppSelector(selectTrigger);
  const selectedTab = useAppSelector(selectSelectedTab);

  const initialKeywordAdditionData = useAppSelector(
    selectKeywordActionsTableData
  );
  const initialKeywordNegationData = useAppSelector(
    selectKeywordNegationTableData
  );
  const initialProductNegationData = useAppSelector(
    selectProductNegationTableData
  );
  const initialProductActionData = useAppSelector(selectProductActionTableData);
  const selectedColumns = useAppSelector(selectSelectedColumns);

  const updatedProductActionTableData = useAppSelector(
    selectUpdatedProductActionTableData
  );
  const updatedAdditionTableData = useAppSelector(
    selectUpdatedAdditionTableData
  );
  const updatedNegationTableData = useAppSelector(
    selectUpdatedKeywordNegationTableData
  );
  const updatedProductNegationTableData = useAppSelector(
    selectUpdatedProductNegationTableData
  );

  const appliedRowFilters = useAppSelector(selectAppliedFilters);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const advertiserId = useMemo(() => {
    return advertisingAccount.value;
  }, [advertisingAccount]);

  const optionMap = new Map()
    .set(KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON, additionOptions)
    .set(KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON, negationOptions)
    .set(KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON, productNegationOptions)
    .set(KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON, productActionOptions);

  const filterMap = new Map()
    .set(KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON, keywordAdditionFilters)
    .set(KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON, keywordNegationFilters)
    .set(KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON, productAdditionFilters)
    .set(KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON, productNegationFilters);

  const tableDataMap = new Map()
    .set(
      KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON,
      updatedAdditionTableData
    )
    .set(
      KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON,
      updatedNegationTableData
    )
    .set(
      KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON,
      updatedProductActionTableData
    )
    .set(
      KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON,
      updatedProductNegationTableData
    );

  const negationDataMap = new Map()
    .set(
      KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON,
      initialKeywordNegationData
    )
    .set(
      KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON,
      initialProductNegationData
    );

  // const isNegationDataLoadedMap = new Map()
  //   .set(
  //     KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON,
  //     isKeywordNegationDataLoaded
  //   )
  //   .set(
  //     KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON,
  //     isProductNegationDataLoaded
  //   );

  const handleSetFilters = (filters: IKeywordActionFilterForm) => {
    if (selectedTab === KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON) {
      dispatch(setKeywordActionFilters(filters));
    } else if (selectedTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON) {
      dispatch(setKeywordNegationFilters(filters));
    } else if (selectedTab === KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON) {
      dispatch(setProductActionFilters(filters));
    } else if (selectedTab === KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON) {
      dispatch(setProductNegationFilters(filters));
    }
  };

  const handleSetAppliedFilters = () => {
    if (selectedTab === KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON) {
      dispatch(setAppliedKeywordActionFilters(keywordAdditionFilters));
    } else if (selectedTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON) {
      dispatch(setAppliedKeywordNegationFilters(keywordNegationFilters));
    } else if (selectedTab === KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON) {
      dispatch(setAppliedProductActionFilters(productAdditionFilters));
    } else if (selectedTab === KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON) {
      dispatch(setAppliedProductNegationFilters(productNegationFilters));
    }
  };

  const fetchAmazonHistory = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_TARGET_ACTION_HISTORY_FETCH,
      {
        paginationModel,
        keywordHistorySortModel,
        searchText,
        trigger,
        advertiserId,
      },
    ],
    queryFn: () =>
      KeywordActionsAmazonService.getHistory({
        page: paginationModel.pageIndex + 1,
        pageSize: paginationModel.pageSize,
        sortCriteria: columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
          KEYWORD_HISTORY_COLUMNS,
          keywordHistorySortModel
        ),
        searchText: searchText,
      }),
    enabled: selectedTab === KeywordActionTabsEnum.HISTORY_AMAZON,
  });

  useEffect(() => {
    setHistoryData([]);

    if (fetchAmazonHistory.data) {
      let count = 0;
      const data = fetchAmazonHistory.data.data.data.data.map((item) => ({
        ...item,
        id: count++,
      }));
      setHistoryData(data);
      setTotalRowCount(
        fetchAmazonHistory.data.data.data.pagination.totalItems as number
      );
    }
  }, [fetchAmazonHistory.data]);

  const isHistoryDataUpdated = useMemo(
    () => fetchAmazonHistory.isFetching === false,
    [fetchAmazonHistory.isFetching]
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

  const fetchAmazonArchive = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_TARGET_ACTION_ARCHIVE_FETCH,
      getArchiveSearchTermPayloadNoDownload,
      trigger,
      advertiserId,
    ],
    queryFn: () =>
      KeywordActionsAmazonService.getArchiveSearchTerms(
        getArchiveSearchTermPayloadNoDownload
      ),
    enabled: selectedTab === KeywordActionTabsEnum.ARCHIVE_AMAZON,
  });

  useEffect(() => {
    setArchiveData([]);

    if (fetchAmazonArchive.data) {
      let count = 0;
      const data = fetchAmazonArchive.data.data.data.data.map((item) => ({
        ...item,
        id: count++,
      }));
      setArchiveData(data);
      setTotalRowCount(
        fetchAmazonArchive.data.data.data.pagination.totalItems as number
      );
    }
  }, [fetchAmazonArchive.data]);

  const isArchiveDataUpdated = useMemo(
    () => fetchAmazonArchive.isFetching === false,
    [fetchAmazonArchive.isFetching]
  );

  const getRecommendationPayload = useCallback(
    (isDownload: boolean, downloadWithFilter: boolean) => {
      if (selectedTab === KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON) {
        return {
          page: paginationModel.pageIndex + 1,
          pageSize: paginationModel.pageSize,
          actionType: keywordAdditionAppliedFilters.actionType?.value,
          dateRange: keywordAdditionAppliedFilters.dateRange?.value,
          priority: keywordAdditionAppliedFilters.priority?.value,
          action: KeywordActionsAction.ADDITION,
          filters: appliedRowFilters,
          searchText: searchText,
          targetingActionType: TargetingActionTypeEnum.KEYWORD_ACTIONS,
          sortCriteria:
            columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
              keywordActionsUtils.getKeywordActionInitColumns(
                KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON
              ),
              sortModel
            ),

          isDownload: isDownload,
          downloadWithFilter: downloadWithFilter,
          adType: convertToLowerCase(
            getCurrentAdType(AdType.SPONSORED_PRODUCTS)
          ),
        };
      }

      if (selectedTab === KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON) {
        return {
          page: paginationModel.pageIndex + 1,
          pageSize: paginationModel.pageSize,
          actionType: productAdditionAppliedFilters.actionType?.value,
          dateRange: productAdditionAppliedFilters.dateRange?.value,
          priority: productAdditionAppliedFilters.priority?.value,
          action: KeywordActionsAction.ADDITION,
          filters: appliedRowFilters,
          searchText: searchText,
          targetingActionType: TargetingActionTypeEnum.PRODUCT_ACTIONS,
          sortCriteria:
            columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
              keywordActionsUtils.getKeywordActionInitColumns(
                KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON
              ),
              sortModel
            ),
          isDownload: isDownload,
          downloadWithFilter: downloadWithFilter,
          adType: convertToLowerCase(
            getCurrentAdType(AdType.SPONSORED_PRODUCTS)
          ),
        };
      }

      if (selectedTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON) {
        return {
          page: paginationModel.pageIndex + 1,
          pageSize: paginationModel.pageSize,
          actionType: keywordNegationAppliedFilters.actionType?.value,
          dateRange: keywordNegationAppliedFilters.dateRange?.value,
          priority: KeywordActionPriority.HIGH,
          action: KeywordActionsAction.NEGATION,
          filters: appliedRowFilters,
          targetingActionType: TargetingActionTypeEnum.KEYWORD_ACTIONS,
          searchText: searchText,
          sortCriteria:
            columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
              keywordActionsUtils.getKeywordActionInitColumns(
                KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON
              ),
              sortModel
            ),
          isDownload,
          downloadWithFilter,
          adType: convertToLowerCase(
            getCurrentAdType(AdType.SPONSORED_PRODUCTS)
          ),
        };
      }

      if (selectedTab === KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON) {
        return {
          page: paginationModel.pageIndex + 1,
          pageSize: paginationModel.pageSize,
          actionType: productNegationAppliedFilters.actionType?.value,
          dateRange: productNegationAppliedFilters.dateRange?.value,
          priority: KeywordActionPriority.HIGH,
          action: KeywordActionsAction.NEGATION,
          filters: appliedRowFilters,
          targetingActionType: TargetingActionTypeEnum.PRODUCT_ACTIONS,
          searchText: searchText,
          sortCriteria:
            columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
              keywordActionsUtils.getKeywordActionInitColumns(
                KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON
              ),
              sortModel
            ),
          isDownload,
          downloadWithFilter,
          adType: convertToLowerCase(
            getCurrentAdType(AdType.SPONSORED_PRODUCTS)
          ),
        };
      }
    },
    [
      paginationModel,
      keywordAdditionAppliedFilters,
      productAdditionAppliedFilters,
      keywordNegationAppliedFilters,
      productNegationAppliedFilters,
      appliedRowFilters,
      searchText,
      sortModel,
      selectedTab,
    ]
  );

  const getRecommendationPayloadNoDownload = useMemo(() => {
    return getRecommendationPayload(false, false);
  }, [getRecommendationPayload]);

  /* Keyword Addition */
  const fetchKeywordAdditionRecommendation = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_KEYWORD_ADDITION_FETCH,
      getRecommendationPayloadNoDownload,
      trigger,
      advertiserId,
    ],
    queryFn: ({ signal }) => {
      dispatch(setKeywordActionSelectedRowIds({}));
      dispatch(setBidErrorMessage(null));

      return KeywordActionsAmazonService.getKeywordActionRecommendationData(
        getRecommendationPayloadNoDownload,
        signal
      );
    },
    enabled:
      selectedTab === KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON &&
      appliedRowFilters.length > 0,
  });

  const isKeywordAdditionDataLoaded = useMemo(
    () => fetchKeywordAdditionRecommendation.isFetching === false,
    [fetchKeywordAdditionRecommendation.isFetching]
  );
  useEffect(() => {
    dispatch(setKeywordActionsTableData([]));
    dispatch(setUpdatedAdditionTableData([]));

    if (fetchKeywordAdditionRecommendation.data) {
      const data = fetchKeywordAdditionRecommendation.data.data.data.data;
      setTotalRowCount(
        fetchKeywordAdditionRecommendation.data.data.data.pagination
          .totalItems as number
      );

      const adGroupMap =
        keywordActionsUtils.getTargetAdGroupIdCampaignIdMap(data);
      setTargetAdGroupIdCampaignIdMap(adGroupMap);

      const initPayload = keywordActionsUtils.getInitData(
        data,
        MarketplaceEnum.AMAZON
      );
      dispatch(initKeywordActionData(initPayload));
      dispatch(initialKeywordBid(initPayload.keywordBid));

      dispatch(setKeywordActionsTableData(data));
      dispatch(setUpdatedAdditionTableData(data));
    }
  }, [dispatch, fetchKeywordAdditionRecommendation.data]);

  /* Product Addition */
  const fetchProductAdditionRecommendation = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_PRODUCT_ADDITION_FETCH,
      getRecommendationPayloadNoDownload,
      trigger,
      advertiserId,
    ],
    queryFn: () => {
      dispatch(setKeywordActionSelectedRowIds({}));
      dispatch(setBidErrorMessage(null));

      return KeywordActionsAmazonService.getKeywordActionRecommendationData(
        getRecommendationPayloadNoDownload
      );
    },
    enabled:
      selectedTab === KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON &&
      appliedRowFilters.length > 0,
  });

  const isProductActionDataLoaded = useMemo(
    () => fetchProductAdditionRecommendation.isFetching === false,
    [fetchProductAdditionRecommendation.isFetching]
  );

  useEffect(() => {
    dispatch(setProductActionTableData([]));
    dispatch(setUpdatedProductActionTableData([]));

    if (fetchProductAdditionRecommendation.data) {
      const data = fetchProductAdditionRecommendation.data.data.data.data;
      setTotalRowCount(
        fetchProductAdditionRecommendation.data.data.data.pagination
          .totalItems as number
      );

      const adGroupMap =
        keywordActionsUtils.getTargetAdGroupIdCampaignIdMap(data);
      setTargetAdGroupIdCampaignIdMap(adGroupMap);

      const initPayload = keywordActionsUtils.getInitData(
        data,
        MarketplaceEnum.AMAZON
      );
      dispatch(initKeywordActionData(initPayload));
      dispatch(initialKeywordBid(initPayload.keywordBid));

      dispatch(setProductActionTableData(data));
      dispatch(setUpdatedProductActionTableData(data));
    }
  }, [dispatch, fetchProductAdditionRecommendation.data]);

  /* Keyword Negation */
  const fetchKeywordNegationRecommendation = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_KEYWORD_NEGATION_FETCH,
      getRecommendationPayloadNoDownload,
      trigger,
      advertiserId,
    ],
    queryFn: () => {
      dispatch(setKeywordActionSelectedRowIds({}));
      dispatch(setBidErrorMessage(null));

      return KeywordActionsAmazonService.getKeywordActionRecommendationData(
        getRecommendationPayloadNoDownload
      );
    },
    enabled:
      selectedTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON &&
      appliedRowFilters.length > 0,
  });

  const isKeywordNegationDataLoaded = useMemo(
    () => fetchKeywordNegationRecommendation.isFetching === false,
    [fetchKeywordNegationRecommendation.isFetching]
  );

  useEffect(() => {
    dispatch(setKeywordNegationTableData([]));
    dispatch(setUpdatedNegationTableData([]));

    if (fetchKeywordNegationRecommendation.data) {
      const data = fetchKeywordNegationRecommendation.data.data.data.data;
      setTotalRowCount(
        fetchKeywordNegationRecommendation.data.data.data.pagination
          .totalItems as number
      );

      const adGroupMap =
        keywordActionsUtils.getTargetAdGroupIdCampaignIdMap(data);
      setTargetAdGroupIdCampaignIdMap(adGroupMap);

      const initPayload = keywordActionsUtils.getInitData(
        data,
        MarketplaceEnum.AMAZON
      );
      dispatch(initKeywordActionData(initPayload));
      dispatch(initialKeywordBid(initPayload.keywordBid));

      dispatch(setKeywordNegationTableData(data));
      dispatch(setUpdatedNegationTableData(data));
    }
  }, [dispatch, fetchKeywordNegationRecommendation.data]);

  /* Product Negation */
  const fetchProductNegationRecommendation = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_PRODUCT_NEGATION_FETCH,
      getRecommendationPayloadNoDownload,
      trigger,
      advertiserId,
    ],
    queryFn: () => {
      dispatch(setKeywordActionSelectedRowIds({}));
      dispatch(setBidErrorMessage(null));

      return KeywordActionsAmazonService.getKeywordActionRecommendationData(
        getRecommendationPayloadNoDownload
      );
    },
    enabled:
      selectedTab === KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON &&
      appliedRowFilters.length > 0,
  });

  const isProductNegationDataLoaded = useMemo(
    () => fetchProductNegationRecommendation.isFetching === false,
    [fetchProductNegationRecommendation.isFetching]
  );

  useEffect(() => {
    dispatch(setProductNegationTableData([]));
    dispatch(setUpdatedProductNegationTableData([]));

    if (fetchProductNegationRecommendation.data) {
      const data = fetchProductNegationRecommendation.data.data.data.data;
      setTotalRowCount(
        fetchProductNegationRecommendation.data.data.data.pagination
          .totalItems as number
      );

      const adGroupMap =
        keywordActionsUtils.getTargetAdGroupIdCampaignIdMap(data);
      setTargetAdGroupIdCampaignIdMap(adGroupMap);

      const initPayload = keywordActionsUtils.getInitData(
        data,
        MarketplaceEnum.AMAZON
      );
      dispatch(initKeywordActionData(initPayload));
      dispatch(initialKeywordBid(initPayload.keywordBid));

      dispatch(setProductNegationTableData(data));
      dispatch(setUpdatedProductNegationTableData(data));
    }
  }, [dispatch, fetchProductNegationRecommendation.data]);

  const getRecommendationDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const res =
        KeywordActionsAmazonService.getKeywordActionRecommendationData(
          selectedTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON ||
            selectedTab === KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON
            ? getRecommendationPayload(true, isAllDownload)
            : getRecommendationPayload(true, !isAllDownload)
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
    [dispatch, getRecommendationPayload, selectedTab]
  );

  const handleArchiveDownload = useCallback(
    async (isAllDownload: boolean) => {
      dispatch(
        showSuccessToastMessage({
          title: 'Download Started',
          description: 'This may take a few seconds.',
        })
      );

      const payload: IGetArchiveSearchTermPayload = {
        page: paginationModel.pageIndex + 1,
        pageSize: paginationModel.pageSize,
        sortCriteria: columnFilterUtils.getFormattedSortModelBasedOnColumnKeys(
          KEYWORD_ARCHIVE_COLUMNS,
          archiveSortModel
        ),
        searchText: searchText,
        isDownload: true,
        downloadWithFilter: !isAllDownload,
      };

      const data = await KeywordActionsAmazonService.getArchiveSearchTerms(
        payload
      );
      dispatch(
        showSuccessToastMessage({
          title: 'Download Completed',
          description: 'Your file downloaded successfully.',
        })
      );
      return data.data.data.data as unknown as Record<string, unknown>[];
    },
    [dispatch, paginationModel, searchText, archiveSortModel]
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

                if (newBid < getAmzSPMinBidLimitByCountry()) {
                  setOpenInvalidModal(true);
                  setErrorTitle('Invalid Bids');
                  setErrorDescription(
                    `Some bids are lower than ${getAmzSPMinBidLimitByCountry()}, which is not permitted.`
                  );
                  return;
                }
                if (newBid > getAmzSPMaxBidLimitByCountry()) {
                  setOpenInvalidModal(true);
                  setErrorTitle('Invalid Bids');
                  setErrorDescription(
                    `Some bids are higher than ${getAmzSPMaxBidLimitByCountry()}, which is not permitted.`
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

    dispatch(setAllKeywordBids(updatedBids));
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
        return bids.some((bid) => bid < getAmzSPMinBidLimitByCountry());
      }
    );

    if (isBidsLesserThanMinBid) {
      setOpenInvalidModal(true);
      setErrorTitle('Invalid Bids');
      setErrorDescription(
        `Some bids are lower than ${getAmzSPMinBidLimitByCountry()}, which is not permitted.`
      );
      return true;
    }

    const isBidsGreaterThanMaxBid = getSelectedRowIds(selectedRowIds).some(
      (id) => {
        const bids = allKeywordBids[Number(id)];
        return bids.some((bid) => bid > getAmzSPMaxBidLimitByCountry());
      }
    );

    if (isBidsGreaterThanMaxBid) {
      setOpenInvalidModal(true);
      setErrorTitle('Invalid Bids');
      setErrorDescription(
        `Some bids are higher than ${getAmzSPMaxBidLimitByCountry}, which is not permitted.`
      );
      return true;
    }

    return false;
  };

  const checkInvalidPayload = (processedData: IKeywordAdditionBody[]) => {
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

  const checkProductActionPayload = (
    processedData: Array<IProductAdditionBody> | Array<IProductNegationBody>
  ) => {
    if (processedData.length === 0) {
      setOpenInvalidModal(true);
      setErrorTitle('Invalid Payload');
      setErrorDescription(
        `Some required fields are missing or incomplete. Please review and try again.`
      );
      return true;
    }
    const errors =
      keywordActionsUtils.validateProductActionPayload(processedData);
    if (errors.length > 0) {
      setOpenInvalidModal(true);
      setErrorTitle('Invalid Payload');
      setErrorDescription(errors[0]);
      return true;
    }
    return false;
  };

  /* Add Bulk Keyword Addition */
  const {
    mutateAsync: mutateAddBulkKeywords,
    isPending: isAddBulkKeywordsPending,
    isIdle: isAddBulkKeywordsIdle,
  } = useAppMutation({
    mutationFn: ({
      body,
      processedDataLength,
    }: {
      body: IKeywordAdditionBody[];
      processedDataLength: number;
    }) => {
      setShowConfirmationModal(false);
      return KeywordActionsAmazonService.addKeywords(body);
    },
    options: {
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_KEYWORD_ADDITION_FETCH],
        });

        const keywords = res.data;
        if (keywords.error) {
          dispatch(
            showErrorToastMessage({
              title: `Failed! ${keywords.data.errorCount}/${variables.processedDataLength} keyword(s) have failed to add.`,
            })
          );
        }
        if (keywords.success) {
          dispatch(
            showSuccessToastMessage({
              title: `Success! ${keywords.data.successCount}/${variables.processedDataLength} keyword(s) have been added.`,
            })
          );
        }
      },
      onSettled: () => {
        dispatch(setIsApplyBtnDisabled(false));
        dispatch(setIsRowEdited(false));
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
      keywordActionsUtils.createAmazonKeywordAdditionPayloadForSelectedRows(
        targetAdGroupIdCampaignIdMap,
        selectedKeywordsToAdd
      );

    const invalidPayload = checkInvalidPayload(processedData);
    if (invalidPayload) return;

    dispatch(setIsApplyBtnDisabled(true));
    const processedDataLength = processedData.length;

    await mutateAddBulkKeywords({ body: processedData, processedDataLength });
  };

  const isAddBulkKeywordsLoading = useMemo(
    () => isAddBulkKeywordsPending === true && isAddBulkKeywordsIdle === false,
    [isAddBulkKeywordsPending, isAddBulkKeywordsIdle]
  );

  /* Add Bulk Product Addition */
  const {
    mutateAsync: mutateAddBulkProducts,
    isPending: isAddBulkProductsPending,
    isIdle: isAddBulkProductsIdle,
  } = useAppMutation({
    mutationFn: ({
      body,
      processedDataLength,
    }: {
      body: IProductAdditionBody[];
      processedDataLength: number;
    }) => {
      setShowConfirmationModal(false);
      return KeywordActionsAmazonService.addProducts(body);
    },
    options: {
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_PRODUCT_ADDITION_FETCH],
        });

        const productsResponse = res.data;
        if (productsResponse.error) {
          dispatch(
            showErrorToastMessage({
              title: `Failed! ${productsResponse.data.errorCount}/${variables.processedDataLength} product(s) have failed to add.`,
            })
          );
        }
        if (productsResponse.success) {
          dispatch(
            showSuccessToastMessage({
              title: `Success! ${productsResponse.data.successCount}/${variables.processedDataLength} product(s) have been added.`,
            })
          );
        }
      },
      onSettled: () => {
        dispatch(setIsApplyBtnDisabled(false));
        dispatch(setIsRowEdited(false));
      },
    },
  });

  const addBulkProducts = async () => {
    const hasInvalidBids = checkForInvalidBids();
    if (hasInvalidBids) return;

    const selectedKeywordsToAdd: Array<
      Array<ISelectedMatchTypeForProductAddition>
    > = getSelectedRowIds(selectedRowIds).map((id) => {
      const matchTypes = allTargetMatchTypes[Number(id)];
      const bids = allKeywordBids[Number(id)];
      const adGroups = allTargetAdGroups[Number(id)].filter(
        (adGroup) => adGroup.selected
      );
      const campaigns = allTargetCampaigns[Number(id)].filter(
        (campaign) => campaign.selected
      );
      const searchTerm = updatedProductActionTableData[Number(id)].searchTerm;
      const data: Array<ISelectedMatchTypeForProductAddition> = [];

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
    });

    const processedData =
      keywordActionsUtils.createAmazonProductAdditionPayloadForSelectedRows(
        targetAdGroupIdCampaignIdMap,
        selectedKeywordsToAdd
      );

    const invalidPayload = checkProductActionPayload(processedData);
    if (invalidPayload) return;

    dispatch(setIsApplyBtnDisabled(true));
    const processedDataLength = processedData.length;

    await mutateAddBulkProducts({ body: processedData, processedDataLength });
  };

  const isAddBulkProductsLoading = useMemo(
    () => isAddBulkProductsPending === true && isAddBulkProductsIdle === false,
    [isAddBulkProductsPending, isAddBulkProductsIdle]
  );

  /* Negate Bulk Keyword */
  const {
    mutateAsync: mutateNegateBulkKeywords,
    isPending: isNegateBulkKeywordsPending,
    isIdle: isNegateBulkKeywordsIdle,
  } = useAppMutation({
    mutationFn: ({
      body,
      processedDataLength,
    }: {
      body: IKeywordNegationBody[];
      processedDataLength: number;
    }) => {
      setShowConfirmationModal(false);
      return KeywordActionsAmazonService.negateKeywords(body);
    },
    options: {
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_KEYWORD_NEGATION_FETCH],
        });

        const keywords = res.data;
        if (keywords.error) {
          dispatch(
            showErrorToastMessage({
              title: `Failed! ${keywords.data.errorCount}/${variables.processedDataLength} keyword(s) have failed to negate.`,
            })
          );
        }
        if (keywords.success) {
          dispatch(
            showSuccessToastMessage({
              title: `Success! ${keywords.data.successCount}/${variables.processedDataLength} keyword(s) have been negated.`,
            })
          );
        }
      },
      onSettled: () => {
        dispatch(setIsApplyBtnDisabled(false));
        dispatch(setIsRowEdited(false));
      },
    },
  });

  const negateBulkKeywords = async () => {
    const selectedKeywordsToNegate = getSelectedRowIds(selectedRowIds).map(
      (id) => {
        const matchTypes = allTargetMatchTypes[Number(id)];
        const adGroups = allTargetAdGroups[Number(id)].filter(
          (adGroup) => adGroup.selected
        );
        const campaigns = allTargetCampaigns[Number(id)].filter(
          (campaign) => campaign.selected
        );
        const searchTerm = updatedNegationTableData[Number(id)].searchTerm;

        const data: ISelectedMatchTypeForKeywordNegation[] = [];

        matchTypes.forEach((matchType) => {
          if (matchType.selected) {
            data.push({
              adGroups,
              campaigns,
              searchTerm,
              matchType,
            });
          }
        });
        return data;
      }
    );

    const processedData =
      keywordActionsUtils.createAmazonKeywordNegationPayloadForSelectedRows(
        targetAdGroupIdCampaignIdMap,
        selectedKeywordsToNegate
      );

    dispatch(setIsApplyBtnDisabled(true));
    const processedDataLength = processedData.length;

    await mutateNegateBulkKeywords({
      body: processedData,
      processedDataLength,
    });
  };

  const isNegateBulkKeywordsLoading = useMemo(
    () =>
      isNegateBulkKeywordsPending === true &&
      isNegateBulkKeywordsIdle === false,
    [isNegateBulkKeywordsPending, isNegateBulkKeywordsIdle]
  );

  /* Negate Bulk Product */
  const {
    mutateAsync: mutateNegateBulkProducts,
    isPending: isNegateBulkProductsPending,
    isIdle: isNegateBulkProductsIdle,
  } = useAppMutation({
    mutationFn: ({
      body,
      processedDataLength,
    }: {
      body: IProductNegationBody[];
      processedDataLength: number;
    }) => {
      setShowConfirmationModal(false);
      return KeywordActionsAmazonService.negateProducts(body);
    },
    options: {
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_KEYWORD_ADDITION_FETCH],
        });

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_PRODUCT_ADDITION_FETCH],
        });

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_KEYWORD_NEGATION_FETCH],
        });

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_PRODUCT_NEGATION_FETCH],
        });

        const productsResponse = res.data;
        if (productsResponse.error) {
          dispatch(
            showErrorToastMessage({
              title: `Failed! ${productsResponse.data.errorCount}/${variables.processedDataLength} product(s) have failed to negate.`,
            })
          );
        }
        if (productsResponse.success) {
          dispatch(
            showSuccessToastMessage({
              title: `Success! ${productsResponse.data.successCount}/${variables.processedDataLength} product(s) have been negated.`,
            })
          );
        }
      },
      onSettled: () => {
        dispatch(setIsApplyBtnDisabled(false));
        dispatch(setIsRowEdited(false));
      },
    },
  });

  const negateBulkProducts = async () => {
    const selectedProductsToNegate = getSelectedRowIds(selectedRowIds).map(
      (id) => {
        const matchTypes = allTargetMatchTypes[Number(id)];
        const adGroups = allTargetAdGroups[Number(id)].filter(
          (adGroup) => adGroup.selected
        );
        const campaigns = allTargetCampaigns[Number(id)].filter(
          (campaign) => campaign.selected
        );
        const searchTerm =
          updatedProductNegationTableData[Number(id)].searchTerm;

        const data: any[] = [];

        matchTypes.forEach((matchType) => {
          if (matchType.selected) {
            data.push({
              adGroups,
              campaigns,
              searchTerm,
              matchType,
            });
          }
        });
        return data;
      }
    );
    const processedData =
      keywordActionsUtils.createAmazonProductNegationPayloadForSelectedRows(
        targetAdGroupIdCampaignIdMap,
        selectedProductsToNegate
      );
    const invalidPayload = checkProductActionPayload(processedData);
    if (invalidPayload) return;

    dispatch(setIsApplyBtnDisabled(true));
    const processedDataLength = processedData.length;

    await mutateNegateBulkProducts({
      body: processedData,
      processedDataLength,
    });
  };

  const isNegateBulkProductsLoading = useMemo(
    () =>
      isNegateBulkProductsPending === true &&
      isNegateBulkProductsIdle === false,
    [isNegateBulkProductsPending, isNegateBulkProductsIdle]
  );

  /* Archive SearchTerm */
  const {
    mutateAsync: mutateArchiveSearchTerms,
    isPending: isArchivePending,
    isIdle: isArchiveIdle,
  } = useAppMutation({
    mutationFn: (body: IArchiveSearchTermsPayload[]) => {
      setShowArchiveModal(false);
      return KeywordActionsAmazonService.archiveSearchTerms(body);
    },
    options: {
      onSuccess: (res) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_KEYWORD_ADDITION_FETCH],
        });

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_PRODUCT_ADDITION_FETCH],
        });

        const result = res.data.data;
        dispatch(
          showSuccessToastMessage({
            title: `Success! ${result.count} Search Term(s) have been archived.`,
          })
        );
      },
      onSettled: () => {
        dispatch(setIsApplyBtnDisabled(false));
        dispatch(setIsRowEdited(false));
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
        const searchTerm = tableDataMap.get(selectedTab)[Number(id)].searchTerm;
        const data: ISelectedSearchTermsToArchive[] = [];

        matchTypes.forEach((matchType) => {
          if (matchType.selected) {
            data.push({
              adGroups,
              searchTerm,
              matchType,
              dateRange: keywordAdditionFilters.dateRange?.value,
            });
          }
        });
        return data;
      }
    );

    const processedData =
      keywordActionsUtils.createAmazonSearchTermArchivePayloadForSelectedRows(
        selectedKeywordsToArchive
      );

    dispatch(setIsApplyBtnDisabled(true));
    await mutateArchiveSearchTerms(processedData);
  };

  const isArchiveLoading = useMemo(
    () => isArchivePending === true && isArchiveIdle === false,
    [isArchivePending, isArchiveIdle]
  );

  const isActionLoading = useMemo(
    () =>
      isAddBulkKeywordsLoading === true ||
      isAddBulkProductsLoading === true ||
      isNegateBulkKeywordsLoading === true ||
      isNegateBulkProductsLoading === true ||
      isArchiveLoading === true,
    [
      isAddBulkKeywordsLoading,
      isAddBulkProductsLoading,
      isNegateBulkKeywordsLoading,
      isNegateBulkProductsLoading,
      isArchiveLoading,
    ]
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
          {selectedTab !== KeywordActionTabsEnum.HISTORY_AMAZON &&
          selectedTab !== KeywordActionTabsEnum.ARCHIVE_AMAZON ? (
            <React.Fragment>
              <KeywordActionFilter
                options={optionMap.get(selectedTab)}
                filters={filterMap.get(selectedTab)}
                setFilters={handleSetFilters}
                handleRefetchClick={handleSetAppliedFilters}
                selectedTab={selectedTab}
              />
              <KeywordActionSelectionTab
                addBulkKeywords={addBulkKeywords}
                addBulkProducts={addBulkProducts}
                negateBulkKeywords={negateBulkKeywords}
                negateBulkProducts={negateBulkProducts}
                archiveSearchTerms={archiveSearchTerms}
                selectedTab={selectedTab}
                handleConfirmationModalClose={handleConfirmationModalClose}
                setShowConfirmationModal={setShowConfirmationModal}
                showConfirmationModal={showConfirmationModal}
                totalRows={tableDataMap.get(selectedTab).length}
                title={'Keyword_Action'}
                isDataLoaded={
                  isProductNegationDataLoaded &&
                  isProductActionDataLoaded &&
                  isKeywordNegationDataLoaded &&
                  isKeywordAdditionDataLoaded &&
                  !isActionLoading
                }
                handleApplyCustomBid={applyCustomBidToRowData}
                handleDownload={getRecommendationDownload}
                showArchiveModal={showArchiveModal}
                setShowArchiveModal={setShowArchiveModal}
                initialKeywordAdditionData={
                  selectedTab === KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON
                    ? initialProductActionData
                    : initialKeywordAdditionData
                }
                initialKeywordNegationData={negationDataMap.get(selectedTab)}
                selectedRowIds={getSelectedRowIds(selectedRowIds)}
                handlePaginationReset={handlePaginationReset}
              />
              <AddedFiltersTab
                appliedFilters={getStoredLsFilters(selectedTab)}
                disableFilterConfig={keywordActionsUtils.getKeywordActionDisableFilterConfig(
                  selectedTab
                )}
                selectedAdvertisingNavTitle={selectedTab}
                isLoading={
                  (isProductNegationDataLoaded &&
                    isProductActionDataLoaded &&
                    isKeywordNegationDataLoaded &&
                    isKeywordAdditionDataLoaded === false) ||
                  isActionLoading
                }
              />
              <KeywordActionTable
                rows={tableDataMap.get(selectedTab)}
                selectedTab={selectedTab}
                totalRowCount={totalRowCount}
                paginationModel={paginationModel}
                setPaginationModel={setPaginationModel}
                sortModel={sortModel}
                setSortModel={setSortModel}
                selectedRowIds={selectedRowIds}
                isDataLoading={
                  (tableDataMap.get(selectedTab) !== null && isActionLoading) ||
                  (isProductNegationDataLoaded &&
                    isProductActionDataLoaded &&
                    isKeywordNegationDataLoaded &&
                    isKeywordAdditionDataLoaded) === false
                }
                selectedColumns={selectedColumns}
              />
            </React.Fragment>
          ) : selectedTab === KeywordActionTabsEnum.HISTORY_AMAZON ? (
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
                  filename={genExportFileName('amazon', 'archive-search-terms')}
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
