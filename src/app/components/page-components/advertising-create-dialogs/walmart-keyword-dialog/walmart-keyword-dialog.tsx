import { ICustomizablePopupDetails } from '@/app/components/common/customizable-dialog/customizable-popup';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import useAdsReviewTrigger from '@/hooks/use-ads-review-trigger.hook';
import {
  IAdvertisingCreateEntityDialogProps,
  ICreateKeyword,
} from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import {
  IWalmartAdGroup,
  IWalmartKeywords,
} from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import {
  IWalmartSVAdGroup,
  IWalmartSVKeywords,
} from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { IEditAccessWalmartCreateKeywordTargeting } from '@/interfaces/edit-access/edit-access.interface';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import {
  removeAddedKeyword,
  selectAddedKeywords,
  setAddedKeywords,
  updateAddedKeyword,
} from '@/redux/slices/advertising/advertising-create-entity.slice';
import {
  selectBidLimitErr,
  setBidLimitErr,
  setTableRowErrMessage,
} from '@/redux/slices/advertising/advertising-edit-access.slice';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { walmartSvAdvertisingServices } from '@/services/advertising/walmart/walmart-sv-advertising.service';
import { walmartEditAccessSVServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sv/walmart-edit-access-sv.service';
import { displayValue, getCurrencySymbolByCountry } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  WALMART_MANUAL_SB_BID_MIN_LIMIT,
  WALMART_MANUAL_SP_BID_MIN_LIMIT,
  WALMART_MANUAL_SV_BID_MIN_LIMIT,
  keywordTargetingMatchTypeOptions,
} from 'src/constants/advertising-filter.constants';
import {
  WALMART_SB_KEYWORDS_MAX,
  WALMART_SP_KEYWORDS_MAX,
  WALMART_SV_KEYWORDS_MAX,
} from 'src/constants/advertising-walmart.constants';
import {
  SortOrderEnum,
  WalmartAdvertisingTableTypeEnum,
  WalmartSBAdGroupLevelTitles,
  WalmartSPAdGroupLevelTitles,
  WalmartSVAdGroupLevelTitles,
} from 'src/enums/advertising.enums';
import {
  TargetingTypeEnum,
  WalmartCampaignStatusEnum,
} from 'src/enums/walmart.enums';
import { IMatchType } from 'src/interfaces/column.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import { walmartSbAdvertisingServices } from 'src/services/advertising/walmart/walmart-sb-advertising.service';
import {
  walmartEntityServices,
  walmartSpAdvertisingServices,
} from 'src/services/advertising/walmart/walmart-sp-advertising.service';
import { walmartEditAccessSBServices } from 'src/services/edit-access/walmart-edit-access/walmart-edit-access-sb/walmart-edit-access-sb.service';
import { walmartEditAccessSPServices } from 'src/services/edit-access/walmart-edit-access/walmart-edit-access-sp/walmart-edit-access-sp.service';
import {
  checkBidValueMaxLimit,
  checkBidValueMinLimit,
  checkIsObjectEmpty,
} from 'src/utils/advertising.utils';
import AdvertisingCreateDialogChipTemplate from '../advertising-create-dialog-templates/advertising-create-dialog-chip-template';
import { walmartCreateKeywordColumns } from '../create-dialog-table-columns';

export interface IWalmartCreateAddedKeywords extends IMatchType {
  id: string;
  keyword: string;
  status: WalmartCampaignStatusEnum;
  suggestedBid: number | string;
  bid: number;
  normalizedKeyword: string;
}

const WalmartAddKeywordsDialog = (
  props: IAdvertisingCreateEntityDialogProps
) => {
  const {
    openDialog,
    handleCloseDialog,
    selectedCampaignId,
    selectedAdGroupId,
    selectedTitle,
    selectedAdGroup,
  } = props;
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const bidLimitErr = useAppSelector(selectBidLimitErr);
  const addedKeywords = useAppSelector(selectAddedKeywords);

  const [initialAddedKeywordList, setInitialAddedKeywordList] = useState<
    IWalmartKeywords[] | IWalmartSVKeywords[]
  >([]);
  const [initialAddedKeywordCount, setInitialAddedKeywordCount] =
    useState<number>(0);
  const [maxKeywordCount, setMaxKeywordCount] = useState<number>(0);

  const minBidLimit = useMemo(
    () =>
      selectedTitle === WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING
        ? WALMART_MANUAL_SB_BID_MIN_LIMIT
        : selectedTitle === WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING
        ? WALMART_MANUAL_SV_BID_MIN_LIMIT
        : WALMART_MANUAL_SP_BID_MIN_LIMIT,
    [selectedTitle]
  );

  const {
    handlePopupOpen,
    handlePopupClose,
    PopupComponent,
    updatePopupLoading,
  } = useAdsReviewTrigger();

  const handleAddedKeywordListPopulate = useCallback(
    (newList: Array<ICreateKeyword>) => {
      dispatch(setAddedKeywords(newList));
    },
    [dispatch]
  );

  const handleUpdateRow = useCallback(
    (
      id: string | number,
      customBid: number | typeof NaN | undefined = undefined,
      status: string | undefined = undefined
    ) => {
      dispatch(updateAddedKeyword({ id: `${id}`, customBid, status }));
    },
    [dispatch]
  );

  const handleRemoveKeywords = useCallback(
    (id: string | number) => {
      dispatch(removeAddedKeyword({ id: id?.toString() }));

      const emptyMsg = {
        id: id as string | number,
        message: '',
      };
      dispatch(setBidLimitErr(emptyMsg));
      dispatch(setTableRowErrMessage(emptyMsg));
    },
    [dispatch]
  );

  const walmartMemoizedColumns = useMemo(
    () =>
      walmartCreateKeywordColumns(
        selectedAdGroup as IWalmartAdGroup | IWalmartSVAdGroup,
        handleUpdateRow,
        handleRemoveKeywords
      ),
    [handleRemoveKeywords, handleUpdateRow, selectedAdGroup]
  );

  const {
    mutateAsync: mutateAddWalmartSPKeyword,
    isPending: isWalmartSPKeywordPending,
    isIdle: isWalmartSPKeywordIdle,
  } = useAppMutation({
    mutationFn: (newKeywords: IEditAccessWalmartCreateKeywordTargeting[]) =>
      walmartEditAccessSPServices.createWalmartSPKeywordTargeting(newKeywords),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SP_ADGROUP_LVL_KT_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message || 'Keywords added successfully',
            description: data.data.description || '',
          })
        );

        handleAddedKeywordListPopulate([]);
      },
    },
  });

  const {
    mutateAsync: mutateAddWalmartSBKeyword,
    isPending: isWalmartSBKeywordPending,
    isIdle: isWalmartSBKeywordIdle,
  } = useAppMutation({
    mutationFn: ({
      newKeywords,
      isReview,
    }: {
      newKeywords: IEditAccessWalmartCreateKeywordTargeting[];
      isReview: boolean;
    }) =>
      walmartEditAccessSBServices.createWalmartSBKeywordTargeting(newKeywords),
    options: {
      onSuccess: (data, variables) => {
        if (variables.isReview === true) {
          queryClient.invalidateQueries({
            queryKey: [QueryKeyEnums.WMT_SB_CAMPAIGN_LVL_FETCH],
          });

          queryClient.invalidateQueries({
            queryKey: [QueryKeyEnums.WMT_SB_ADGROUP_LVL_FETCH],
          });
        }

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SB_ADGROUP_LVL_KT_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message || 'Keywords added successfully',
            description: data.data.description || '',
          })
        );

        handleAddedKeywordListPopulate([]);
      },
    },
  });

  const {
    mutateAsync: mutateAddWalmartSVKeyword,
    isPending: isWalmartSVKeywordPending,
    isIdle: isWalmartSVKeywordIdle,
  } = useAppMutation({
    mutationFn: ({
      newKeywords,
      isReview,
    }: {
      newKeywords: IEditAccessWalmartCreateKeywordTargeting[];
      isReview: boolean;
    }) =>
      walmartEditAccessSVServices.createWalmartSVKeywordTargeting(newKeywords),
    options: {
      onSuccess: (data, variables) => {
        if (variables.isReview) {
          queryClient.invalidateQueries({
            queryKey: [QueryKeyEnums.WMT_SV_CAMPAIGN_LVL_FETCH],
          });

          queryClient.invalidateQueries({
            queryKey: [QueryKeyEnums.WMT_SV_ADGROUP_LVL_FETCH],
          });
        }

        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SV_ADGROUP_LVL_KT_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message || 'Keywords added successfully',
            description: data.data.description || '',
          })
        );

        handleAddedKeywordListPopulate([]);
      },
    },
  });

  const addedKeywordListCount = useMemo(
    () =>
      addedKeywords.filter(
        (item) =>
          item.status.toLowerCase() ===
          WalmartCampaignStatusEnum.ENABLED.toLowerCase()
      ).length,
    [addedKeywords]
  );

  const totalAddedKeywordCount = useMemo(
    () => initialAddedKeywordCount + addedKeywordListCount,
    [initialAddedKeywordCount, addedKeywordListCount]
  );

  const handleCreateWalmartKeywordTargets = async () => {
    if (totalAddedKeywordCount > maxKeywordCount) {
      return dispatch(
        showErrorToastMessage({
          title: 'Error!!!',
          description: `Max ${maxKeywordCount} keywords can be added. You are about to exceed the maximum limit by ${
            addedKeywordListCount - maxKeywordCount
          } keyword(s).`,
        })
      );
    }

    let minKeywordBid = '';
    let maxKeywordBid = '';

    for (const keyword of addedKeywords) {
      minKeywordBid = checkBidValueMinLimit(
        MarketplaceEnum.WALMART,
        advHeaderFilters.adType.value,
        TargetingTypeEnum.MANUAL,
        parseFloat(`${keyword.customBid}`)
      );

      maxKeywordBid = checkBidValueMaxLimit(
        MarketplaceEnum.WALMART,
        advHeaderFilters.adType.value,
        TargetingTypeEnum.MANUAL,
        parseFloat(`${keyword.customBid}`)
      );

      if (minKeywordBid || maxKeywordBid) break;
    }

    if (maxKeywordBid) {
      return dispatch(
        showErrorToastMessage({
          title: 'Invalid Bid.',
          description: `Some bids are exceeding ${displayValue(
            maxKeywordBid.split(getCurrencySymbolByCountry())[1],
            false
          )},which is not allowed.`,
        })
      );
    }

    if (minKeywordBid) {
      return dispatch(
        showErrorToastMessage({
          title: 'Invalid Bid.',
          description: `Some bids are lower than ${displayValue(
            minKeywordBid.split(getCurrencySymbolByCountry())[1],
            false
          )} which is not allowed.`,
        })
      );
    }

    const newKeywords: IEditAccessWalmartCreateKeywordTargeting[] = [];
    addedKeywords.forEach((keyword) => {
      newKeywords.push({
        campaignId: `${selectedCampaignId}`,
        adGroupId: `${selectedAdGroupId}`,
        state: keyword.status.toLowerCase(),
        keywordText: keyword.entityName,
        entityName: keyword.entityName,
        matchType: keyword.matchType?.value.toLowerCase() as string,
        bid: (keyword.customBid as number) ?? minBidLimit,
      });
    });

    if (selectedTitle === WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING) {
      await mutateAddWalmartSPKeyword(newKeywords);
      handleCloseDialog();
    } else {
      const isReview = newKeywords.find(
        (item) => item.state === WalmartCampaignStatusEnum.ENABLED.toLowerCase()
      )
        ? true
        : false;

      const confirmationClick = async () =>
        await handleReviewConfirmationClick(isReview, newKeywords);

      if (isReview) {
        if (selectedTitle === WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING) {
          const popupParams: ICustomizablePopupDetails = {
            description: [
              {
                content: `<b>Please note: </b> Adding a new keyword to an SB campaign will trigger a review process by Walmart's team. This process may take 24-48 hours during which the campaign will stop serving ads.`,
                isHeading: false,
              },
              {
                content: 'Do you want to continue?',
                isHeading: false,
              },
            ],
            wantBodyDivider: false,
            wantGutters: true,
            minWidth: 'xs',
          };

          handlePopupOpen(popupParams, confirmationClick);
        }

        if (selectedTitle === WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING) {
          const popupParams: ICustomizablePopupDetails = {
            description: [
              {
                content: `<b>Please note: </b> Adding a new keyword to an SV campaign will trigger a review process by Walmart's team. This process may take 24-48 hours during which the campaign will stop serving ads.`,
                isHeading: false,
              },
              {
                content: 'Do you want to continue?',
                isHeading: false,
              },
            ],
            wantBodyDivider: false,
            wantGutters: true,
            minWidth: 'xs',
          };

          handlePopupOpen(popupParams, confirmationClick);
        }
      } else {
        confirmationClick();
      }
    }
  };

  const handleReviewConfirmationClick = async (
    isReview: boolean,
    newKeywords: IEditAccessWalmartCreateKeywordTargeting[]
  ) => {
    if (selectedTitle === WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING) {
      await mutateAddWalmartSBKeyword({ newKeywords, isReview });
    }

    if (selectedTitle === WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING) {
      await mutateAddWalmartSVKeyword({ newKeywords, isReview });
    }

    handlePopupClose();
    handleCloseDialog();
  };

  useEffect(() => {
    updatePopupLoading(
      (isWalmartSBKeywordPending === true &&
        isWalmartSBKeywordIdle === false) ||
        (isWalmartSVKeywordPending === true && isWalmartSVKeywordIdle === false)
    );
  }, [
    isWalmartSBKeywordPending,
    isWalmartSBKeywordIdle,
    isWalmartSVKeywordPending,
    isWalmartSVKeywordIdle,
    updatePopupLoading,
  ]);

  const {
    mutateAsync: mutateGetNormalizedKeywords,
    isPending: isGetNormalizedKeywordsPending,
    isIdle: isGetNormalizedKeywordsIdle,
  } = useAppMutation({
    mutationFn: (intermediateKeywords: IWalmartCreateAddedKeywords[]) =>
      walmartEntityServices.getNormalizedKeywordData(intermediateKeywords),
    options: {
      onSuccess: (data) => {
        const formattedNormalizedKeywords: ICreateKeyword[] =
          data.data.data.map((item) => ({
            id: item.id,
            status: item.status,
            entityName: item.keyword,
            normalizedKeyword: item.normalizedKeyword,
            matchType: keywordTargetingMatchTypeOptions.find(
              (matchType) =>
                matchType.value.toLowerCase() === item.matchType.toLowerCase()
            ),
            suggestedBid: item.suggestedBid,
            customBid: item.bid,
          }));
        handleAddedKeywordListPopulate(formattedNormalizedKeywords);
      },
    },
  });

  const handleTriggerGetNormalizedKeywords = async (
    addedKeywords: ICreateKeyword[]
  ) => {
    const formattedList: IWalmartCreateAddedKeywords[] = addedKeywords.map(
      (keyword) => ({
        id: `${keyword.id}`,
        status: keyword.status as WalmartCampaignStatusEnum,
        keyword: keyword.entityName,
        normalizedKeyword: keyword.normalizedKeyword ?? 'UNAVAILABLE',
        matchType: keyword.matchType?.value ?? '',
        suggestedBid: keyword.suggestedBid ?? '-',
        bid: keyword.customBid ?? 0,
      })
    );
    await mutateGetNormalizedKeywords(formattedList);
  };

  const fetchWalmartSPKeywords = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SP_ADD_FUNC_GET_KEYWORDS_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: () =>
      walmartSpAdvertisingServices.getKeywords(
        [],
        {
          campaignId: `${selectedCampaignId}`,
          adGroupId: `${selectedAdGroupId}`,
          isDownload: true,
        },
        0,
        WALMART_SP_KEYWORDS_MAX,
        [
          {
            columnName: 'adSales',
            sortOrder: SortOrderEnum.DESC,
          },
        ],
        ''
      ),
    enabled:
      selectedTitle === WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING &&
      openDialog === true,
  });

  const fetchWalmartSBKeywords = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SB_ADD_FUNC_GET_KEYWORDS_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: () =>
      walmartSbAdvertisingServices.getSBKeywordTargeting(
        [],
        {
          campaignId: `${selectedCampaignId}`,
          adGroupId: `${selectedAdGroupId}`,
          isDownload: true,
        },
        0,
        WALMART_SB_KEYWORDS_MAX,
        [
          {
            columnName: 'adSales',
            sortOrder: SortOrderEnum.DESC,
          },
        ],
        ''
      ),
    enabled:
      selectedTitle === WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING &&
      openDialog === true,
  });

  const fetchWalmartSVKeywords = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SV_ADD_FUNC_GET_KEYWORDS_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: () =>
      walmartSvAdvertisingServices.getSVKeywordTargeting(
        [],
        {
          campaignId: `${selectedCampaignId}`,
          adGroupId: `${selectedAdGroupId}`,
          isDownload: true,
        },
        0,
        WALMART_SV_KEYWORDS_MAX,
        [
          {
            columnName: 'adSales',
            sortOrder: SortOrderEnum.DESC,
          },
        ],
        ''
      ),
    enabled:
      selectedTitle === WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING &&
      openDialog === true,
  });

  useEffect(() => {
    setInitialAddedKeywordList([]);
    setInitialAddedKeywordCount(0);
    setMaxKeywordCount(WALMART_SP_KEYWORDS_MAX);

    if (
      fetchWalmartSPKeywords.data &&
      fetchWalmartSPKeywords.data.data.data.data
    ) {
      const data = fetchWalmartSPKeywords.data.data.data.data;
      const liveDataCount = data.reduce(
        (count, item) =>
          count +
          (item.status.toLowerCase() ===
          WalmartCampaignStatusEnum.ENABLED.toLowerCase()
            ? 1
            : 0),
        0
      );

      setInitialAddedKeywordList(data);
      setInitialAddedKeywordCount(liveDataCount);
    }
  }, [fetchWalmartSPKeywords.data]);

  useEffect(() => {
    setInitialAddedKeywordList([]);
    setInitialAddedKeywordCount(0);
    setMaxKeywordCount(WALMART_SB_KEYWORDS_MAX);

    if (
      fetchWalmartSBKeywords.data &&
      fetchWalmartSBKeywords.data.data.data.data
    ) {
      const data = fetchWalmartSBKeywords.data.data.data.data;
      const liveDataCount = data.reduce(
        (count, item) =>
          count +
          (item.status.toLowerCase() ===
          WalmartCampaignStatusEnum.ENABLED.toLowerCase()
            ? 1
            : 0),
        0
      );

      setInitialAddedKeywordList(data);
      setInitialAddedKeywordCount(liveDataCount);
    }
  }, [fetchWalmartSBKeywords.data]);

  useEffect(() => {
    setInitialAddedKeywordList([]);
    setInitialAddedKeywordCount(0);
    setMaxKeywordCount(WALMART_SV_KEYWORDS_MAX);

    if (
      fetchWalmartSVKeywords.data &&
      fetchWalmartSVKeywords.data.data.data.data
    ) {
      const data = fetchWalmartSVKeywords.data.data.data.data;
      const liveDataCount = data.reduce(
        (count, item) =>
          count +
          (item.status.toLowerCase() ===
          WalmartCampaignStatusEnum.ENABLED.toLowerCase()
            ? 1
            : 0),
        0
      );

      setInitialAddedKeywordList(data);
      setInitialAddedKeywordCount(liveDataCount);
    }
  }, [fetchWalmartSVKeywords.data]);

  const isCreateLoading = useMemo(() => {
    return (
      (isWalmartSPKeywordPending === true &&
        isWalmartSPKeywordIdle === false) ||
      (isWalmartSBKeywordPending === true &&
        isWalmartSBKeywordIdle === false) ||
      (isWalmartSVKeywordPending === true && isWalmartSVKeywordIdle === false)
    );
  }, [
    isWalmartSPKeywordPending,
    isWalmartSPKeywordIdle,
    isWalmartSBKeywordPending,
    isWalmartSBKeywordIdle,
    isWalmartSVKeywordPending,
    isWalmartSVKeywordIdle,
  ]);

  const isInitialDataLoading = useMemo(
    () =>
      fetchWalmartSPKeywords.isLoading ||
      fetchWalmartSPKeywords.isRefetching ||
      fetchWalmartSBKeywords.isLoading ||
      fetchWalmartSBKeywords.isRefetching ||
      fetchWalmartSVKeywords.isLoading ||
      fetchWalmartSVKeywords.isRefetching,
    [
      fetchWalmartSPKeywords.isLoading,
      fetchWalmartSPKeywords.isRefetching,
      fetchWalmartSBKeywords.isLoading,
      fetchWalmartSBKeywords.isRefetching,
      fetchWalmartSVKeywords.isLoading,
      fetchWalmartSVKeywords.isRefetching,
    ]
  );

  return (
    <React.Fragment>
      <AdvertisingCreateDialogChipTemplate
        entityType={WalmartAdvertisingTableTypeEnum.KEYWORD}
        initialKeywordList={initialAddedKeywordList}
        addedListTableData={addedKeywords}
        addedListTableColumns={walmartMemoizedColumns}
        selectedAdGroup={selectedAdGroup}
        selectedAdGroupId={selectedAdGroupId}
        selectedCampaignId={selectedCampaignId}
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        handlePopulateAddedList={handleAddedKeywordListPopulate}
        initialAddedEntityCount={totalAddedKeywordCount}
        maxEntityCount={maxKeywordCount}
        isCustomBidRequired={true}
        minBidLimit={minBidLimit}
        areMatchTypeOptionsRequired={true}
        matchTypeRadioOptions={keywordTargetingMatchTypeOptions}
        handleCreateEntity={handleCreateWalmartKeywordTargets}
        isCreateDisabled={
          addedKeywords.length < 1 || !checkIsObjectEmpty(bidLimitErr)
        }
        isCreateLoading={isCreateLoading}
        isInitialDataLoading={isInitialDataLoading}
        isAddedTableLoading={
          isGetNormalizedKeywordsPending === true &&
          isGetNormalizedKeywordsIdle === false
        }
        addedListCount={addedKeywordListCount}
        handleTriggerGetNormalizedKeywords={handleTriggerGetNormalizedKeywords}
        selectedTitle={selectedTitle}
      />

      {PopupComponent !== null && PopupComponent}
    </React.Fragment>
  );
};

export default WalmartAddKeywordsDialog;
