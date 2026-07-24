import { QueryKeyEnums } from '@/enums/query.enums';
import { ISBNegativeTargetingKeyword } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { INegativeKeywordTargeting } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IAdvertisingCreateEntityDialogProps,
  ICreateKeyword,
} from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import {
  IEditAccessCreateNegKeywordTargeting,
  IEditAccessCreateNegKeywordTargetingBody,
} from '@/interfaces/edit-access/edit-access.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import {
  removeAddedKeyword,
  selectAddedKeywords,
  setAddedKeywords,
  updateAddedKeyword,
} from '@/redux/slices/advertising/advertising-create-entity.slice';
import { sbAdvertisingAdGroupLevelServices } from '@/services/advertising/amazon/sb-advertising.service';
import { spAdvertisingServices } from '@/services/advertising/amazon/sp-advertising.service';
import { EditAccessSBServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sb/amazon-edit-access-sb.services';
import { EditAccessSPServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sp/amazon-edit-access-sp.service';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AMAZON_SB_NEG_KT_MAX,
  AMAZON_SP_NEG_KT_MAX,
  keywordNegTargetingMatchTypeOptions,
  sbNegKeywordTargetingMatchTypeOptions,
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
import AdvertisingCreateDialogChipTemplate from '../advertising-create-dialog-templates/advertising-create-dialog-chip-template';
import {
  amazonSBCreateNegKeywordTargetsColumns,
  amazonSPCreateNegKeywordTargetsColumns,
} from '../create-dialog-table-columns';

export default function CreateNegTargetingKeywordDialog({
  openDialog,
  handleCloseDialog,
  selectedCampaignId,
  selectedAdGroupId,
  selectedTitle,
  selectedAdGroup,
}: IAdvertisingCreateEntityDialogProps) {
  const [initialAddedNegKeywordList, setInitialAddedNegKeywordList] = useState<
    INegativeKeywordTargeting[] | ISBNegativeTargetingKeyword[]
  >([]);
  const [initialAddedNegKeywordCount, setInitialAddedNegKeywordCount] =
    useState<number>(0);
  const [maxNegKeywordCount, setMaxNegKeywordCount] = useState<number>(0);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const addedKeywords = useAppSelector(selectAddedKeywords);

  const adTypeSpecificMatchTypeOptions = useMemo(() => {
    if (selectedTitle === SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD) {
      return keywordNegTargetingMatchTypeOptions;
    }

    if (selectedTitle === SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD) {
      return sbNegKeywordTargetingMatchTypeOptions;
    }

    return [];
  }, [selectedTitle]);

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
    },
    [dispatch]
  );

  const amazonMemoizedColumns = useMemo(() => {
    if (selectedTitle === SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD) {
      return amazonSBCreateNegKeywordTargetsColumns(handleRemoveKeywords);
    }

    return amazonSPCreateNegKeywordTargetsColumns(
      handleUpdateRow,
      handleRemoveKeywords
    );
  }, [handleRemoveKeywords, handleUpdateRow, selectedTitle]);

  const {
    mutateAsync: mutateAddAmazonSPNegKeyword,
    isPending: isAddAmazonSPNegKeywordPending,
    isIdle: isAddAmazonSPNegKeywordIdle,
  } = useAppMutation({
    mutationFn: async (body: IEditAccessCreateNegKeywordTargetingBody) =>
      await EditAccessSPServices.createSPNegKeywordTargeting(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SP_ADGROUP_LVL_NEG_KT_FETCH],
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
    mutateAsync: mutateAddAmazonSBNegKeyword,
    isPending: isAddAmazonSBNegKeywordPending,
    isIdle: isAddAmazonSBNegKeywordIdle,
  } = useAppMutation({
    mutationFn: async (body: IEditAccessCreateNegKeywordTargetingBody) =>
      await EditAccessSBServices.createSBNegKeywordTargeting(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SB_ADGROUP_LVL_NEG_KT_FETCH],
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

  const totalAddedNegKeywordCount = useMemo(
    () => initialAddedNegKeywordCount + addedKeywords.length,
    [addedKeywords, initialAddedNegKeywordCount]
  );

  const handleCreateAmazonNegKeywordTargets = async () => {
    if (totalAddedNegKeywordCount > maxNegKeywordCount) {
      return dispatch(
        showErrorToastMessage({
          title: 'Error!!!',
          description: `Max ${maxNegKeywordCount} keywords can be negated. You are about to exceed the maximum limit by ${
            totalAddedNegKeywordCount - maxNegKeywordCount
          }`,
        })
      );
    }

    const newNegKeywords: IEditAccessCreateNegKeywordTargeting[] = [];
    addedKeywords.forEach((keyword) => {
      const data: IEditAccessCreateNegKeywordTargeting = {
        campaignId: `${selectedCampaignId}`,
        adGroupId: `${selectedAdGroupId}`,
        entityName: keyword.entityName,
        state: keyword.status,
        keywordText: keyword.entityName,
        matchType: keyword.matchType?.value as string,
      };

      newNegKeywords.push(data);
    });

    const body: IEditAccessCreateNegKeywordTargetingBody = {
      negativeKeywords: newNegKeywords,
    };

    if (selectedTitle === SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD) {
      await mutateAddAmazonSPNegKeyword(body);
      handleCloseDialog();
      return;
    }

    if (selectedTitle === SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD) {
      await mutateAddAmazonSBNegKeyword(body);
      handleCloseDialog();
      return;
    }
  };

  const fetchAmazonSPAdGroupLevelNegKT = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SP_ADD_FUNC_GET_NEG_KT_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: async () =>
      await spAdvertisingServices.getNegativeKeywordTargeting(
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
      selectedTitle === SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD &&
      openDialog === true,
  });

  useEffect(() => {
    setInitialAddedNegKeywordList([]);
    setInitialAddedNegKeywordCount(0);
    setMaxNegKeywordCount(AMAZON_SP_NEG_KT_MAX);

    if (
      fetchAmazonSPAdGroupLevelNegKT.data &&
      fetchAmazonSPAdGroupLevelNegKT.data.data.data.data
    ) {
      setInitialAddedNegKeywordList(
        fetchAmazonSPAdGroupLevelNegKT.data.data.data.data
      );
      setInitialAddedNegKeywordCount(
        fetchAmazonSPAdGroupLevelNegKT.data.data.data.data.length
      );
    }
  }, [fetchAmazonSPAdGroupLevelNegKT.data]);

  const fetchAmazonSBAdGroupLevelNegKT = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SB_ADD_FUNC_GET_NEG_KT_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: async () =>
      await sbAdvertisingAdGroupLevelServices.getSBNegativeTargetingKeyword(
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
      selectedTitle === SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD &&
      openDialog === true,
  });

  useEffect(() => {
    setInitialAddedNegKeywordList([]);
    setInitialAddedNegKeywordCount(0);
    setMaxNegKeywordCount(AMAZON_SB_NEG_KT_MAX);

    if (
      fetchAmazonSBAdGroupLevelNegKT.data &&
      fetchAmazonSBAdGroupLevelNegKT.data.data.data.data
    ) {
      setInitialAddedNegKeywordList(
        fetchAmazonSBAdGroupLevelNegKT.data.data.data.data
      );
      setInitialAddedNegKeywordCount(
        fetchAmazonSBAdGroupLevelNegKT.data.data.data.data.length
      );
    }
  }, [fetchAmazonSBAdGroupLevelNegKT.data]);

  const isFetchingKeywordsLoading = useMemo(() => {
    return (
      fetchAmazonSPAdGroupLevelNegKT.isLoading ||
      fetchAmazonSPAdGroupLevelNegKT.isRefetching ||
      fetchAmazonSBAdGroupLevelNegKT.isLoading ||
      fetchAmazonSBAdGroupLevelNegKT.isRefetching
    );
  }, [
    fetchAmazonSPAdGroupLevelNegKT.isLoading,
    fetchAmazonSPAdGroupLevelNegKT.isRefetching,
    fetchAmazonSBAdGroupLevelNegKT.isLoading,
    fetchAmazonSBAdGroupLevelNegKT.isRefetching,
  ]);

  const isCreateKeywordsLoading = useMemo(
    () =>
      (isAddAmazonSPNegKeywordPending === true &&
        isAddAmazonSPNegKeywordIdle === false) ||
      (isAddAmazonSBNegKeywordPending === true &&
        isAddAmazonSBNegKeywordIdle === false),
    [
      isAddAmazonSPNegKeywordPending,
      isAddAmazonSPNegKeywordIdle,
      isAddAmazonSBNegKeywordPending,
      isAddAmazonSBNegKeywordIdle,
    ]
  );

  return (
    <AdvertisingCreateDialogChipTemplate
      entityType={AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_KEYWORD}
      initialKeywordList={initialAddedNegKeywordList}
      addedListTableData={addedKeywords}
      addedListTableColumns={amazonMemoizedColumns}
      selectedAdGroup={selectedAdGroup}
      selectedAdGroupId={selectedAdGroupId}
      selectedCampaignId={selectedCampaignId}
      openDialog={openDialog}
      handleCloseDialog={handleCloseDialog}
      handlePopulateAddedList={handleAddedKeywordListPopulate}
      initialAddedEntityCount={totalAddedNegKeywordCount}
      maxEntityCount={maxNegKeywordCount}
      isCustomBidRequired={false}
      areMatchTypeOptionsRequired={true}
      matchTypeRadioOptions={adTypeSpecificMatchTypeOptions}
      handleCreateEntity={handleCreateAmazonNegKeywordTargets}
      isCreateDisabled={addedKeywords.length < 1}
      isCreateLoading={isCreateKeywordsLoading}
      isInitialDataLoading={isFetchingKeywordsLoading}
      isAddedTableLoading={false}
      addedListCount={addedKeywords.length}
      selectedTitle={selectedTitle}
    />
  );
}
