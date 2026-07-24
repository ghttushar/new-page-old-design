import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { TargetingTypeEnum } from '@/enums/walmart.enums';
import { IRadioSelect } from '@/interfaces/advertising/advertising.interface';
import {
  ISBAdGroup,
  ISBKeywordTargeting,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDAdGroup } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import {
  IAdGroup,
  IKeywordTargeting,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IAdvertisingCreateEntityDialogProps,
  ICreateKeyword,
} from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import {
  IEditAccessCreateKeywordTargeting,
  IEditAccessCreateKeywordTargetingBody,
} from '@/interfaces/edit-access/edit-access.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
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
import { sbAdvertisingAdGroupLevelServices } from '@/services/advertising/amazon/sb-advertising.service';
import { EditAccessSBServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sb/amazon-edit-access-sb.services';
import { EditAccessSPServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sp/amazon-edit-access-sp.service';
import { displayValue, getCurrencySymbolByCountry } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AMAZON_SB_KT_MAX,
  AMAZON_SP_KT_MAX,
  keywordTargetingMatchTypeOptions,
  sbKeywordTargetingMatchTypeOptions,
} from 'src/constants/advertising-filter.constants';
import {
  AmazonAdvertisingTableTypesEnum,
  SbAdGroupLevelTitles,
  SortOrderEnum,
  SpAdGroupLevelTitles,
} from 'src/enums/advertising.enums';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import { spAdvertisingServices } from 'src/services/advertising/amazon/sp-advertising.service';
import {
  checkBidValueMaxLimit,
  checkBidValueMinLimit,
  checkIsObjectEmpty,
  getAmazonMinBidLimitValue,
  hasCostTypeProp,
  hasCreativeTypeProp,
} from 'src/utils/advertising.utils';
import AdvertisingCreateDialogChipTemplate from '../advertising-create-dialog-templates/advertising-create-dialog-chip-template';
import {
  amazonSBCreateKeywordColumns,
  amazonSPCreateKeywordColumns,
} from '../create-dialog-table-columns';

export default function CreateAmazonKeywordTargetsDialog({
  openDialog,
  handleCloseDialog,
  selectedCampaignId,
  selectedAdGroupId,
  selectedTitle,
  selectedAdGroup,
}: IAdvertisingCreateEntityDialogProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const bidLimitErr = useAppSelector(selectBidLimitErr);
  const addedKeywords = useAppSelector(selectAddedKeywords);

  const [initialAddedKeywordList, setInitialAddedKeywordList] = useState<
    IKeywordTargeting[] | ISBKeywordTargeting[]
  >([]);
  const [initialAddedKeywordCount, setInitialAddedKeywordCount] =
    useState<number>(0);
  const [maxKeywordCount, setMaxKeywordCount] = useState<number>(0);

  const adTypeSpecificMatchTypeOptions: IRadioSelect<string>[] = useMemo(() => {
    if (selectedTitle === SpAdGroupLevelTitles.KEYWORD_TARGETING) {
      return keywordTargetingMatchTypeOptions;
    }

    if (selectedTitle === SbAdGroupLevelTitles.KEYWORD_TARGETING) {
      return sbKeywordTargetingMatchTypeOptions;
    }

    return [];
  }, [selectedTitle]);

  const costType = useMemo(
    () =>
      selectedAdGroup && hasCostTypeProp(selectedAdGroup)
        ? selectedAdGroup.costType
        : undefined,
    [selectedAdGroup]
  );

  const creativeType = useMemo(
    () =>
      selectedAdGroup && hasCreativeTypeProp(selectedAdGroup)
        ? selectedAdGroup.creativeType
        : undefined,
    [selectedAdGroup]
  );

  const minBidLimit = useMemo(
    () =>
      getAmazonMinBidLimitValue(
        advHeaderFilters.adType.value,
        costType,
        creativeType,
        MarketplaceEnum.AMAZON
      ) ?? 0,
    [advHeaderFilters.adType.value, costType, creativeType]
  );

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

  const amazonMemoizedColumns = useMemo(() => {
    if (selectedTitle === SbAdGroupLevelTitles.KEYWORD_TARGETING) {
      return amazonSBCreateKeywordColumns(
        selectedAdGroup as IAdGroup | ISBAdGroup | ISDAdGroup,
        handleUpdateRow,
        handleRemoveKeywords
      );
    }

    return amazonSPCreateKeywordColumns(
      selectedAdGroup as IAdGroup | ISBAdGroup | ISDAdGroup,
      handleUpdateRow,
      handleRemoveKeywords
    );
  }, [handleRemoveKeywords, handleUpdateRow, selectedAdGroup, selectedTitle]);

  const {
    mutateAsync: mutateAddAmazonSPKeyword,
    isPending: isAddAmazonSPKeywordPending,
    isIdle: isAddAmazonSPKeywordIdle,
  } = useAppMutation({
    mutationFn: async (body: IEditAccessCreateKeywordTargetingBody) =>
      await EditAccessSPServices.createSPKeywordTargeting(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SP_ADGROUP_LVL_KT_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
          })
        );
        handleAddedKeywordListPopulate([]);
      },
    },
  });

  const {
    mutateAsync: mutateAddAmazonSBKeyword,
    isPending: isAddAmazonSBKeywordPending,
    isIdle: isAddAmazonSBKeywordIdle,
  } = useAppMutation({
    mutationFn: async (body: IEditAccessCreateKeywordTargetingBody) =>
      await EditAccessSBServices.createSBKeywordTargeting(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SB_ADGROUP_LVL_KT_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
          })
        );
        handleAddedKeywordListPopulate([]);
      },
    },
  });

  const totalAddedKeywordCount = useMemo(
    () => initialAddedKeywordCount + addedKeywords.length,
    [initialAddedKeywordCount, addedKeywords]
  );

  const handleCreateAmazonKeywordTargets = async () => {
    if (totalAddedKeywordCount > maxKeywordCount) {
      return dispatch(
        showErrorToastMessage({
          title: 'Error!!!',
          description: `Max ${maxKeywordCount} keywords can be added. You are about to exceed the maximum limit by ${
            totalAddedKeywordCount - maxKeywordCount
          }`,
        })
      );
    }

    let minKeywordBidErr = '';
    let maxKeywordBidErr = '';

    for (const keyword of addedKeywords) {
      minKeywordBidErr = checkBidValueMinLimit(
        MarketplaceEnum.AMAZON,
        advHeaderFilters.adType.value,
        TargetingTypeEnum.MANUAL,
        parseFloat(`${keyword.customBid}`),
        costType,
        creativeType
      );

      maxKeywordBidErr = checkBidValueMaxLimit(
        MarketplaceEnum.AMAZON,
        advHeaderFilters.adType.value,
        TargetingTypeEnum.MANUAL,
        parseFloat(`${keyword.customBid}`),
        costType,
        creativeType
      );

      if (minKeywordBidErr || maxKeywordBidErr) break;
    }

    if (maxKeywordBidErr) {
      dispatch(
        showErrorToastMessage({
          title: 'Invalid Bid.',
          description: `Some bids are exceeding
          ${displayValue(
            maxKeywordBidErr.split(getCurrencySymbolByCountry())[1],
            false
          )},
            which is not allowed.`,
        })
      );
      return;
    }

    if (minKeywordBidErr) {
      dispatch(
        showErrorToastMessage({
          title: 'Invalid Bid.',
          description: `Some bids are lower than${displayValue(
            minKeywordBidErr.split(getCurrencySymbolByCountry())[1],
            false
          )}, which is not allowed.`,
        })
      );
      return;
    }

    const newKeywordTargets: IEditAccessCreateKeywordTargeting[] = [];
    addedKeywords.forEach((keyword) => {
      const data: IEditAccessCreateKeywordTargeting = {
        campaignId: `${selectedCampaignId}`,
        adGroupId: `${selectedAdGroupId}`,
        state: keyword.status,
        keywordText: keyword.entityName,
        entityName: keyword.entityName,
        matchType: keyword.matchType?.value as string,
        bid: keyword.customBid as number,
      };

      newKeywordTargets.push(data);
    });

    const body: IEditAccessCreateKeywordTargetingBody = {
      keywordTargets: newKeywordTargets,
    };

    if (selectedTitle === SpAdGroupLevelTitles.KEYWORD_TARGETING) {
      await mutateAddAmazonSPKeyword(body);
      handleCloseDialog();
      return;
    }

    if (selectedTitle === SbAdGroupLevelTitles.KEYWORD_TARGETING) {
      await mutateAddAmazonSBKeyword(body);
      handleCloseDialog();
      return;
    }
  };

  const fetchAmazonSPAdGroupLevelKT = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SP_ADD_FUNC_GET_KT_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: async () =>
      await spAdvertisingServices.getKeywordTargeting(
        [],
        {
          campaignId: `${selectedCampaignId}`,
          adGroupId: `${selectedAdGroupId}`,
          isDownload: true,
        },
        0,
        1,
        [
          {
            columnName: 'adSales',
            sortOrder: SortOrderEnum.DESC,
          },
        ],
        ''
      ),
    enabled:
      selectedTitle === SpAdGroupLevelTitles.KEYWORD_TARGETING &&
      openDialog === true,
  });

  useEffect(() => {
    setInitialAddedKeywordList([]);
    setInitialAddedKeywordCount(0);
    setMaxKeywordCount(AMAZON_SP_KT_MAX);

    if (
      fetchAmazonSPAdGroupLevelKT.data &&
      fetchAmazonSPAdGroupLevelKT.data.data.data.data
    ) {
      setInitialAddedKeywordList(
        fetchAmazonSPAdGroupLevelKT.data.data.data.data
      );
      setInitialAddedKeywordCount(
        fetchAmazonSPAdGroupLevelKT.data.data.data.data.length
      );
    }
  }, [fetchAmazonSPAdGroupLevelKT.data]);

  const fetchAmazonSBAdGroupLevelKT = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SB_ADD_FUNC_GET_KT_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: async () =>
      await sbAdvertisingAdGroupLevelServices.getSBKeywordTargeting(
        [],
        {
          campaignId: `${selectedCampaignId}`,
          adGroupId: `${selectedAdGroupId}`,
          isDownload: true,
        },
        0,
        1,
        [
          {
            columnName: 'adSales',
            sortOrder: SortOrderEnum.DESC,
          },
        ],
        ''
      ),
    enabled:
      selectedTitle === SbAdGroupLevelTitles.KEYWORD_TARGETING &&
      openDialog === true,
  });

  useEffect(() => {
    setInitialAddedKeywordList([]);
    setInitialAddedKeywordCount(0);
    setMaxKeywordCount(AMAZON_SB_KT_MAX);

    if (
      fetchAmazonSBAdGroupLevelKT.data &&
      fetchAmazonSBAdGroupLevelKT.data.data.data.data
    ) {
      setInitialAddedKeywordList(
        fetchAmazonSBAdGroupLevelKT.data.data.data.data
      );
      setInitialAddedKeywordCount(
        fetchAmazonSBAdGroupLevelKT.data.data.data.data.length
      );
    }
  }, [fetchAmazonSBAdGroupLevelKT.data]);

  const isFetchingKeywordsLoading = useMemo(() => {
    return (
      fetchAmazonSPAdGroupLevelKT.isLoading ||
      fetchAmazonSPAdGroupLevelKT.isRefetching ||
      fetchAmazonSBAdGroupLevelKT.isLoading ||
      fetchAmazonSBAdGroupLevelKT.isRefetching
    );
  }, [
    fetchAmazonSPAdGroupLevelKT.isLoading,
    fetchAmazonSPAdGroupLevelKT.isRefetching,
    fetchAmazonSBAdGroupLevelKT.isLoading,
    fetchAmazonSBAdGroupLevelKT.isRefetching,
  ]);

  const isCreateKeywordsLoading = useMemo(
    () =>
      (isAddAmazonSPKeywordPending === true &&
        isAddAmazonSPKeywordIdle === false) ||
      (isAddAmazonSBKeywordPending === true &&
        isAddAmazonSBKeywordIdle === false),
    [
      isAddAmazonSPKeywordPending,
      isAddAmazonSPKeywordIdle,
      isAddAmazonSBKeywordPending,
      isAddAmazonSBKeywordIdle,
    ]
  );

  return (
    <AdvertisingCreateDialogChipTemplate
      entityType={AmazonAdvertisingTableTypesEnum.KEYWORD_TARGETING}
      initialKeywordList={initialAddedKeywordList}
      addedListTableData={addedKeywords}
      addedListTableColumns={amazonMemoizedColumns}
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
      matchTypeRadioOptions={adTypeSpecificMatchTypeOptions}
      handleCreateEntity={handleCreateAmazonKeywordTargets}
      isCreateDisabled={
        addedKeywords.length < 1 || !checkIsObjectEmpty(bidLimitErr)
      }
      isCreateLoading={isCreateKeywordsLoading}
      isInitialDataLoading={isFetchingKeywordsLoading}
      isAddedTableLoading={false}
      addedListCount={addedKeywords.length}
      selectedTitle={selectedTitle}
    />
  );
}
