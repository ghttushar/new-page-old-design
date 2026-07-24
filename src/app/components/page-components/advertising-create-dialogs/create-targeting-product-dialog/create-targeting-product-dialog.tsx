import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { TargetingTypeEnum } from '@/enums/walmart.enums';
import { IRadioSelect } from '@/interfaces/advertising/advertising.interface';
import {
  ISBAdGroup,
  ISBProductTargeting,
} from '@/interfaces/advertising/amazon/sb-advertising.interface';
import {
  IAdGroup,
  IProductTargeting,
} from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IAdvertisingCreateEntityDialogProps,
  ICreateKeyword,
} from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import {
  IEditAccessCreateProductTargeting,
  IEditAccessCreateProductTargetingBody,
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
  AMAZON_SB_PT_MAX,
  AMAZON_SP_PT_MAX,
  productTargetingMatchTypeOptions,
} from 'src/constants/advertising-filter.constants';
import {
  AmazonAdvertisingTableTypesEnum,
  SbAdGroupLevelTitles,
  SbTargetingProductMatchTypesEnum,
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
  amazonSBCreateProductTargetsColumns,
  amazonSPCreateProductTargetsColumns,
} from '../create-dialog-table-columns';

export default function CreateTargetingProductDialog({
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
  const addedAsins = useAppSelector(selectAddedKeywords);

  const [initialAddedProductTargetList, setInitialAddedProductTargetList] =
    useState<IProductTargeting[] | ISBProductTargeting[]>([]);
  const [initialAddedProductCount, setInitialAddedProductCount] =
    useState<number>(0);
  const [maxProductCount, setMaxProductCount] = useState<number>(0);

  const adTypeSpecificMatchTypeOptions: IRadioSelect<string>[] = useMemo(() => {
    if (selectedTitle === SpAdGroupLevelTitles.PRODUCT_TARGETING) {
      return productTargetingMatchTypeOptions;
    }

    if (selectedTitle === SbAdGroupLevelTitles.PRODUCT_TARGETING) {
      return [];
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
    if (selectedTitle === SbAdGroupLevelTitles.PRODUCT_TARGETING) {
      return amazonSBCreateProductTargetsColumns(
        selectedAdGroup as IAdGroup | ISBAdGroup,
        handleUpdateRow,
        handleRemoveKeywords
      );
    }

    return amazonSPCreateProductTargetsColumns(
      selectedAdGroup as IAdGroup | ISBAdGroup,
      handleUpdateRow,
      handleRemoveKeywords
    );
  }, [handleRemoveKeywords, handleUpdateRow, selectedAdGroup, selectedTitle]);

  const {
    mutateAsync: mutateAddAmazonSPProductTargeting,
    isPending: isAddAmazonSPProductTargetingPending,
    isIdle: isAddAmazonSPProductTargetingIdle,
  } = useAppMutation({
    mutationFn: (body: IEditAccessCreateProductTargetingBody) =>
      EditAccessSPServices.createSPProductTargeting(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SP_ADGROUP_LVL_PT_FETCH],
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
    mutateAsync: mutateAddAmazonSBProductTargeting,
    isPending: isAddAmazonSBProductTargetingPending,
    isIdle: isAddAmazonSBProductTargetingIdle,
  } = useAppMutation({
    mutationFn: (body: IEditAccessCreateProductTargetingBody) =>
      EditAccessSBServices.createSBProductTargeting(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SB_ADGROUP_LVL_PT_FETCH],
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

  const totalAddedProductCount = useMemo(
    () => initialAddedProductCount + addedAsins.length,
    [initialAddedProductCount, addedAsins]
  );

  const handleCreateAmazonProductTargets = async () => {
    if (totalAddedProductCount > maxProductCount) {
      return dispatch(
        showErrorToastMessage({
          title: 'Error!!!',
          description: `Max ${maxProductCount} asins can be added. You are about to exceed the maximum limit by ${
            totalAddedProductCount - maxProductCount
          }`,
        })
      );
    }

    let minProductBidErr = '';
    let maxProductBidErr = '';

    for (const product of addedAsins) {
      minProductBidErr = checkBidValueMinLimit(
        MarketplaceEnum.AMAZON,
        advHeaderFilters.adType.value,
        TargetingTypeEnum.MANUAL,
        parseFloat(`${product.customBid}`),
        costType,
        creativeType
      );

      maxProductBidErr = checkBidValueMaxLimit(
        MarketplaceEnum.AMAZON,
        advHeaderFilters.adType.value,
        TargetingTypeEnum.MANUAL,
        parseFloat(`${product.customBid}`),
        costType,
        creativeType
      );

      if (minProductBidErr || maxProductBidErr) break;
    }

    if (maxProductBidErr) {
      dispatch(
        showErrorToastMessage({
          title: 'Invalid Bid.',
          description: `Some bids are exceeding ${displayValue(
            maxProductBidErr.split(getCurrencySymbolByCountry())[1],
            false
          )}, which is not allowed.`,
        })
      );
      return;
    }

    if (minProductBidErr) {
      dispatch(
        showErrorToastMessage({
          title: 'Invalid Bid.',
          description: `Some bids are lower than${displayValue(
            minProductBidErr.split(getCurrencySymbolByCountry())[1],
            false
          )} which is not allowed.`,
        })
      );
      return;
    }

    const newProductTargets: IEditAccessCreateProductTargeting[] = [];
    addedAsins.forEach((product) => {
      const data: IEditAccessCreateProductTargeting = {
        campaignId: `${selectedCampaignId}`,
        adGroupId: `${selectedAdGroupId}`,
        entityName: product.entityName,
        expressionType: 'MANUAL',
        state: product.status,
        bid: product.customBid as number,
        expression: [
          {
            type:
              selectedTitle === SbAdGroupLevelTitles.PRODUCT_TARGETING
                ? SbTargetingProductMatchTypesEnum.EXACT
                : (product.matchType?.value as string),
            value: product.entityName,
          },
        ],
      };

      newProductTargets.push(data);
    });

    const body: IEditAccessCreateProductTargetingBody = {
      productTargets: newProductTargets,
    };

    if (selectedTitle === SpAdGroupLevelTitles.PRODUCT_TARGETING) {
      await mutateAddAmazonSPProductTargeting(body);
    }

    if (selectedTitle === SbAdGroupLevelTitles.PRODUCT_TARGETING) {
      await mutateAddAmazonSBProductTargeting(body);
    }
    handleCloseDialog();
  };

  const fetchAmazonSPAdGroupLevelPT = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SP_ADD_FUNC_GET_PT_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: () =>
      spAdvertisingServices.getProductTargeting(
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
      selectedTitle === SpAdGroupLevelTitles.PRODUCT_TARGETING &&
      openDialog === true,
  });

  useEffect(() => {
    setInitialAddedProductTargetList([]);
    setInitialAddedProductCount(0);
    setMaxProductCount(AMAZON_SP_PT_MAX);

    if (
      fetchAmazonSPAdGroupLevelPT.data &&
      fetchAmazonSPAdGroupLevelPT.data.data.data.data
    ) {
      setInitialAddedProductTargetList(
        fetchAmazonSPAdGroupLevelPT.data.data.data.data
      );
      setInitialAddedProductCount(
        fetchAmazonSPAdGroupLevelPT.data.data.data.data.length
      );
    }
  }, [fetchAmazonSPAdGroupLevelPT.data]);

  const fetchAmazonSBAdGroupLevelPT = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SB_ADD_FUNC_GET_PT_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: () =>
      sbAdvertisingAdGroupLevelServices.getSBProductTargeting(
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
      selectedTitle === SbAdGroupLevelTitles.PRODUCT_TARGETING &&
      openDialog === true,
  });

  useEffect(() => {
    setInitialAddedProductTargetList([]);
    setInitialAddedProductCount(0);
    setMaxProductCount(AMAZON_SB_PT_MAX);

    if (
      fetchAmazonSBAdGroupLevelPT.data &&
      fetchAmazonSBAdGroupLevelPT.data.data.data.data
    ) {
      setInitialAddedProductTargetList(
        fetchAmazonSBAdGroupLevelPT.data.data.data.data
      );
      setInitialAddedProductCount(
        fetchAmazonSBAdGroupLevelPT.data.data.data.data.length
      );
    }
  }, [fetchAmazonSBAdGroupLevelPT.data]);

  const isFetchingKeywordsLoading = useMemo(() => {
    return (
      fetchAmazonSPAdGroupLevelPT.isLoading ||
      fetchAmazonSPAdGroupLevelPT.isRefetching ||
      fetchAmazonSBAdGroupLevelPT.isLoading ||
      fetchAmazonSBAdGroupLevelPT.isRefetching
    );
  }, [
    fetchAmazonSPAdGroupLevelPT.isLoading,
    fetchAmazonSPAdGroupLevelPT.isRefetching,
    fetchAmazonSBAdGroupLevelPT.isLoading,
    fetchAmazonSBAdGroupLevelPT.isRefetching,
  ]);

  const isCreateKeywordsLoading = useMemo(
    () =>
      (isAddAmazonSPProductTargetingPending === true &&
        isAddAmazonSPProductTargetingIdle === false) ||
      (isAddAmazonSBProductTargetingPending === true &&
        isAddAmazonSBProductTargetingIdle === false),
    [
      isAddAmazonSPProductTargetingPending,
      isAddAmazonSPProductTargetingIdle,
      isAddAmazonSBProductTargetingPending,
      isAddAmazonSBProductTargetingIdle,
    ]
  );

  return (
    <AdvertisingCreateDialogChipTemplate
      entityType={AmazonAdvertisingTableTypesEnum.PRODUCT_TARGETING}
      initialKeywordList={initialAddedProductTargetList}
      addedListTableData={addedAsins}
      addedListTableColumns={amazonMemoizedColumns}
      selectedAdGroup={selectedAdGroup}
      selectedAdGroupId={selectedAdGroupId}
      selectedCampaignId={selectedCampaignId}
      openDialog={openDialog}
      handleCloseDialog={handleCloseDialog}
      handlePopulateAddedList={handleAddedKeywordListPopulate}
      initialAddedEntityCount={totalAddedProductCount}
      maxEntityCount={maxProductCount}
      isCustomBidRequired={true}
      minBidLimit={minBidLimit}
      areMatchTypeOptionsRequired={
        selectedTitle === SbAdGroupLevelTitles.PRODUCT_TARGETING ? false : true
      }
      matchTypeRadioOptions={adTypeSpecificMatchTypeOptions}
      handleCreateEntity={handleCreateAmazonProductTargets}
      isCreateDisabled={
        addedAsins.length < 1 || !checkIsObjectEmpty(bidLimitErr)
      }
      isCreateLoading={isCreateKeywordsLoading}
      isInitialDataLoading={isFetchingKeywordsLoading}
      isAddedTableLoading={false}
      addedListCount={addedAsins.length}
      selectedTitle={selectedTitle}
    />
  );
}
