import {
  AMAZON_SB_NEG_PT_MAX,
  AMAZON_SP_NEG_PT_MAX,
} from '@/constants/advertising-filter.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import { ISBNegativeTargetingProduct } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { INegativeProductTargeting } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IAdvertisingCreateEntityDialogProps,
  ICreateKeyword,
} from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import {
  IEditAccessCreateNegProductTargeting,
  IEditAccessCreateNegProductTargetingBody,
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
  AmazonAdvertisingTableTypesEnum,
  SbAdGroupLevelTitles,
  SbNegativeTargetingProductMatchTypesEnum,
  SortOrderEnum,
  SpAdGroupLevelTitles,
  SpNegativeTargetingProductMatchTypesEnum,
} from 'src/enums/advertising.enums';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import AdvertisingCreateDialogChipTemplate from '../advertising-create-dialog-templates/advertising-create-dialog-chip-template';
import {
  amazonSBCreateNegProductTargetsColumns,
  amazonSPCreateNegProductTargetsColumns,
} from '../create-dialog-table-columns';

export default function CreateNegTargetingProductDialog({
  openDialog,
  handleCloseDialog,
  selectedCampaignId,
  selectedAdGroupId,
  selectedTitle,
  selectedAdGroup,
}: IAdvertisingCreateEntityDialogProps) {
  const [initialAddedNegProductList, setInitialAddedNegProductList] = useState<
    INegativeProductTargeting[] | ISBNegativeTargetingProduct[]
  >([]);
  const [initialAddedNegProductCount, setAddedInitialNegProductCount] =
    useState<number>(0);
  const [maxNegProductCount, setMaxNegProductCount] = useState<number>(0);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const addedNegAsins = useAppSelector(selectAddedKeywords);

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
    if (selectedTitle === SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT) {
      return amazonSBCreateNegProductTargetsColumns(handleRemoveKeywords);
    }

    return amazonSPCreateNegProductTargetsColumns(
      handleUpdateRow,
      handleRemoveKeywords
    );
  }, [handleRemoveKeywords, handleUpdateRow, selectedTitle]);

  const {
    mutateAsync: mutateAddAmazonSPNegProducts,
    isPending: isAddAmazonSPNegProductsPending,
    isIdle: isAddAmazonSPNegProductsIdle,
  } = useAppMutation({
    mutationFn: async (body: IEditAccessCreateNegProductTargetingBody) =>
      await EditAccessSPServices.createSPNegProductTargeting(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SP_ADGROUP_LVL_NEG_PT_FETCH],
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
    mutateAsync: mutateAddAmazonSBNegProducts,
    isPending: isAddAmazonSBNegProductsPending,
    isIdle: isAddAmazonSBNegProductsIdle,
  } = useAppMutation({
    mutationFn: async (body: IEditAccessCreateNegProductTargetingBody) =>
      await EditAccessSBServices.createSBNegProductTargeting(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SB_ADGROUP_LVL_NEG_PT_FETCH],
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

  const totalAddedNegProductCount = useMemo(
    () => initialAddedNegProductCount + addedNegAsins.length,
    [initialAddedNegProductCount, addedNegAsins]
  );

  const handleCreateAmazonNegProductTargets = async () => {
    if (totalAddedNegProductCount > maxNegProductCount) {
      return dispatch(
        showErrorToastMessage({
          title: 'Error!!!',
          description: `Max ${maxNegProductCount} asins can be negated. You are about to exceed the maximum limit by ${
            totalAddedNegProductCount - maxNegProductCount
          }`,
        })
      );
    }

    const newNegProducts: IEditAccessCreateNegProductTargeting[] = [];
    addedNegAsins.forEach((asin) => {
      const data: IEditAccessCreateNegProductTargeting = {
        campaignId: `${selectedCampaignId}`,
        adGroupId: `${selectedAdGroupId}`,
        entityName: asin.entityName,
        state: asin.status,
        expression: [
          {
            type:
              selectedTitle === SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT
                ? SbNegativeTargetingProductMatchTypesEnum.EXACT
                : SpNegativeTargetingProductMatchTypesEnum.EXACT,
            value: asin.entityName,
          },
        ],
      };

      newNegProducts.push(data);
    });

    const body: IEditAccessCreateNegProductTargetingBody = {
      negativeProducts: newNegProducts,
    };

    if (selectedTitle === SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT) {
      await mutateAddAmazonSPNegProducts(body);
      handleCloseDialog();
      return;
    }

    if (selectedTitle === SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT) {
      await mutateAddAmazonSBNegProducts(body);
      handleCloseDialog();
      return;
    }
  };

  const fetchAmazonSPAdGroupLevelNegPT = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SP_ADD_FUNC_GET_NEG_PT_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: async () =>
      await spAdvertisingServices.getNegativeProductTargeting(
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
      selectedTitle === SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT &&
      openDialog === true,
  });

  useEffect(() => {
    setInitialAddedNegProductList([]);
    setAddedInitialNegProductCount(0);
    setMaxNegProductCount(AMAZON_SP_NEG_PT_MAX);

    if (
      fetchAmazonSPAdGroupLevelNegPT.data &&
      fetchAmazonSPAdGroupLevelNegPT.data.data.data.data
    ) {
      setInitialAddedNegProductList(
        fetchAmazonSPAdGroupLevelNegPT.data.data.data.data
      );
      setAddedInitialNegProductCount(
        fetchAmazonSPAdGroupLevelNegPT.data.data.data.data.length
      );
    }
  }, [fetchAmazonSPAdGroupLevelNegPT.data]);

  const fetchAmazonSBAdGroupLevelNegPT = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SB_ADD_FUNC_GET_NEG_PT_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: async () =>
      await sbAdvertisingAdGroupLevelServices.getSBNegativeTargetingProduct(
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
      selectedTitle === SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT &&
      openDialog === true,
  });

  useEffect(() => {
    setInitialAddedNegProductList([]);
    setAddedInitialNegProductCount(0);
    setMaxNegProductCount(AMAZON_SB_NEG_PT_MAX);

    if (
      fetchAmazonSBAdGroupLevelNegPT.data &&
      fetchAmazonSBAdGroupLevelNegPT.data.data.data.data
    ) {
      setInitialAddedNegProductList(
        fetchAmazonSBAdGroupLevelNegPT.data.data.data.data
      );
      setAddedInitialNegProductCount(
        fetchAmazonSBAdGroupLevelNegPT.data.data.data.data.length
      );
    }
  }, [fetchAmazonSBAdGroupLevelNegPT.data]);

  const isFetchingKeywordsLoading = useMemo(() => {
    return (
      fetchAmazonSPAdGroupLevelNegPT.isLoading ||
      fetchAmazonSPAdGroupLevelNegPT.isRefetching ||
      fetchAmazonSBAdGroupLevelNegPT.isLoading ||
      fetchAmazonSBAdGroupLevelNegPT.isRefetching
    );
  }, [
    fetchAmazonSPAdGroupLevelNegPT.isLoading,
    fetchAmazonSPAdGroupLevelNegPT.isRefetching,
    fetchAmazonSBAdGroupLevelNegPT.isLoading,
    fetchAmazonSBAdGroupLevelNegPT.isRefetching,
  ]);

  const isCreateKeywordsLoading = useMemo(
    () =>
      (isAddAmazonSPNegProductsPending === true &&
        isAddAmazonSPNegProductsIdle === false) ||
      (isAddAmazonSBNegProductsPending === true &&
        isAddAmazonSBNegProductsIdle === false),
    [
      isAddAmazonSPNegProductsPending,
      isAddAmazonSPNegProductsIdle,
      isAddAmazonSBNegProductsPending,
      isAddAmazonSBNegProductsIdle,
    ]
  );

  return (
    <AdvertisingCreateDialogChipTemplate
      entityType={AmazonAdvertisingTableTypesEnum.NEGATIVE_TARGETING_PRODUCT}
      initialKeywordList={initialAddedNegProductList}
      addedListTableData={addedNegAsins}
      addedListTableColumns={amazonMemoizedColumns}
      selectedAdGroup={selectedAdGroup}
      selectedAdGroupId={selectedAdGroupId}
      selectedCampaignId={selectedCampaignId}
      openDialog={openDialog}
      handleCloseDialog={handleCloseDialog}
      handlePopulateAddedList={handleAddedKeywordListPopulate}
      initialAddedEntityCount={totalAddedNegProductCount}
      maxEntityCount={maxNegProductCount}
      isCustomBidRequired={false}
      areMatchTypeOptionsRequired={false}
      handleCreateEntity={handleCreateAmazonNegProductTargets}
      isCreateDisabled={addedNegAsins.length < 1}
      isCreateLoading={isCreateKeywordsLoading}
      isInitialDataLoading={isFetchingKeywordsLoading}
      isAddedTableLoading={false}
      addedListCount={addedNegAsins.length}
      selectedTitle={selectedTitle}
    />
  );
}
