import {
  AMAZON_SD_ADS_MAX,
  AMAZON_SP_AUTO_ADS_MAX,
  AMAZON_SP_MANUAL_ADS_MAX,
} from '@/constants/advertising-filter.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { ISDProductAds } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { IProductAds } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import {
  IAdvertisingCreateEntityDialogProps,
  ICreateProductAds,
} from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import {
  IEditAccessCreateAdProduct,
  IEditAccessCreateAdProductBody,
} from '@/interfaces/edit-access/edit-access.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import {
  removeAddedProductAds,
  selectAddedProductAds,
  setAddedProductAds,
  updateAddedProductAds,
} from '@/redux/slices/advertising/advertising-create-entity.slice';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { sdAdvertisingServicesAdGroupLevel } from '@/services/advertising/amazon/sd-advertising.service';
import { EditAccessSDServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sd/amazon-edit-access-sd.services';
import { EditAccessSPServices } from '@/services/edit-access/amazon-edit-access/amazon-edit-access-sp/amazon-edit-access-sp.service';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import {
  AdType,
  AmazonAccountType,
  AmazonAdvertisingTableTypesEnum,
  SdAdGroupLevelTitles,
  SortOrderEnum,
  SpAdGroupLevelTitles,
  SpCampaignTargetingTypes,
} from 'src/enums/advertising.enums';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import {
  amazonEntityServices,
  spAdvertisingServices,
} from 'src/services/advertising/amazon/sp-advertising.service';
import { checkItemIsPresentInProductAdsMapAmazon } from 'src/utils/advertising.utils';
import AdvertisingCreateDialogTableTemplate from '../advertising-create-dialog-templates/advertising-create-dialog-table-template';
import { amazonProductAdsAddedListColumns } from '../create-dialog-table-columns';

export default function AddAdsProductDialog({
  openDialog,
  handleCloseDialog,
  selectedCampaignId,
  selectedAdGroupId,
  selectedTitle,
  selectedAdGroup,
}: IAdvertisingCreateEntityDialogProps) {
  const adType = useAppSelector(selectAdvertisingHeaderFilters);

  const maxCountLimit = useMemo(() => {
    if (selectedTitle === SpAdGroupLevelTitles.PRODUCT_ADS) {
      if (selectedAdGroup.targetingType === SpCampaignTargetingTypes.AUTO)
        return AMAZON_SP_AUTO_ADS_MAX;
      else return AMAZON_SP_MANUAL_ADS_MAX;
    }

    if (selectedTitle === SdAdGroupLevelTitles.PRODUCT_ADS) {
      return AMAZON_SD_ADS_MAX;
    }

    return 0;
  }, [selectedAdGroup, selectedTitle]);

  const [initialProductAdsList, setInitialProductAdsList] = useState<
    ICreateProductAds[]
  >([]);
  const [initialProductAdsWorkingList, setInitialProductAdsWorkingList] =
    useState<ICreateProductAds[]>([]);
  const [initialAddedProductAds, setInitialAddedProductAds] = useState<
    IProductAds[] | ISDProductAds[]
  >([]);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const addedProductAds = useAppSelector(selectAddedProductAds);
  const selectedAccount = localStorageUtils.getSelectedAdvertisingAccount();

  const handleAdditionalCloseDialog = () => {
    setInitialAddedProductAds([]);
    setInitialProductAdsList([]);
    setInitialProductAdsWorkingList([]);
    dispatch(setAddedProductAds([]));
    handleCloseDialog();
  };

  const handleUpdateRow = useCallback(
    (
      id: string | number,
      customBid: number | typeof NaN | undefined = undefined,
      status: string | undefined = undefined
    ) => {
      dispatch(updateAddedProductAds({ id: `${id}`, customBid, status }));
    },
    [dispatch]
  );

  const handleRemoveProductAds = (id: string | number) => {
    const idx = addedProductAds.findIndex(
      (product) => product.id?.toString() === id
    );

    if (idx !== -1) {
      setInitialProductAdsWorkingList((prev) => [
        addedProductAds[idx],
        ...prev,
      ]);
      dispatch(removeAddedProductAds({ id: id?.toString() }));
    }
  };

  const handleClearAll = () => {
    setInitialProductAdsWorkingList(initialProductAdsList);
    dispatch(setAddedProductAds([]));
  };

  const {
    mutateAsync: mutateAddAmazonSPProducts,
    isPending: isAddAmazonSPProductsPending,
    isIdle: isAddAmazonSPProductsIdle,
  } = useAppMutation({
    mutationFn: (body: IEditAccessCreateAdProductBody) =>
      EditAccessSPServices.createSPAdProduct(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SP_ADGROUP_LVL_PRODUCT_ADS_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
          })
        );

        dispatch(setAddedProductAds([]));
      },
    },
  });

  const {
    mutateAsync: mutateAddAmazonSDProducts,
    isPending: isAddAmazonSDProductsPending,
    isIdle: isAddAmazonSDProductsIdle,
  } = useAppMutation({
    mutationFn: (body: IEditAccessCreateAdProductBody) =>
      EditAccessSDServices.createSDAdProduct(body),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.AMZ_SD_ADGROUP_LVL_PRODUCT_ADS_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
          })
        );

        dispatch(setAddedProductAds([]));
      },
    },
  });

  const totalProductAdsCount = useMemo(
    () => initialAddedProductAds.length + addedProductAds.length,
    [initialAddedProductAds, addedProductAds]
  );

  const handleCreateProductAds = async () => {
    if (totalProductAdsCount > maxCountLimit) {
      return dispatch(
        showErrorToastMessage({
          title: 'Error!!!',
          description: `Max ${maxCountLimit} keywords can be added. You are about to exceed the maximum limit by ${
            totalProductAdsCount - maxCountLimit
          }`,
        })
      );
    }

    const newAdProducts: IEditAccessCreateAdProduct[] = [];
    addedProductAds.forEach((product) => {
      const data: IEditAccessCreateAdProduct = {
        campaignId: `${selectedCampaignId}`,
        adGroupId: `${selectedAdGroupId}`,
        state: product.status,
        entityName: product.itemName || product.item,
      };

      if (
        selectedAccount?.accountType === AmazonAccountType.SELLER &&
        adType.adType.value !== AdType.SPONSORED_PRODUCTS &&
        product.sku !== null
      )
        data.sku = product.sku;
      else {
        data.sku = product.sku;
        data.asin = product.item;
      }

      newAdProducts.push(data);
    });

    const body: IEditAccessCreateAdProductBody = {
      productAds: newAdProducts,
    };

    if (selectedTitle === SpAdGroupLevelTitles.PRODUCT_ADS) {
      await mutateAddAmazonSPProducts(body);
      handleAdditionalCloseDialog();
    }

    if (selectedTitle === SdAdGroupLevelTitles.PRODUCT_ADS) {
      await mutateAddAmazonSDProducts(body);
      handleAdditionalCloseDialog();
    }
  };

  const fetchAmazonSPAdGroupLevelProductAds = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SP_ADD_FUNC_GET_PRODUCT_ADS_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: async () => {
      setInitialAddedProductAds([]);
      setInitialProductAdsList([]);
      setInitialProductAdsWorkingList([]);

      const resAccountAds = await amazonEntityServices.getProducts(
        MarketplaceEnum.AMAZON
      );
      let resAccountAdsList = resAccountAds?.data?.data ?? [];

      if (!resAccountAdsList.length) return;

      const resAdGroupAds = await spAdvertisingServices.getProductAds(
        [],
        {
          campaignId: `${selectedCampaignId}`,
          adGroupId: `${selectedAdGroupId}`,
          isDownload: true,
        },
        0,
        10,
        [
          {
            columnName: 'adSales',
            sortOrder: SortOrderEnum.DESC,
          },
        ],
        ''
      );

      const resAdGroupLevelProductAdsList =
        resAdGroupAds?.data?.data?.data ?? [];

      if (resAdGroupLevelProductAdsList.length) {
        resAccountAdsList = resAccountAdsList
          .filter(
            (row) =>
              !checkItemIsPresentInProductAdsMapAmazon(
                row.item,
                resAdGroupLevelProductAdsList
              )
          )
          .map((row) => {
            return {
              id: row.item,
              ...row,
            };
          });

        setInitialAddedProductAds(resAdGroupLevelProductAdsList);
      }

      setInitialProductAdsList(resAccountAdsList);
      setInitialProductAdsWorkingList(resAccountAdsList);
    },
    enabled:
      selectedTitle === SpAdGroupLevelTitles.PRODUCT_ADS && openDialog === true,
  });

  const fetchAmazonSDAdGroupLevelProductAds = useAppQuery({
    queryKey: [
      QueryKeyEnums.AMZ_SD_ADD_FUNC_GET_PRODUCT_ADS_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: async () => {
      setInitialAddedProductAds([]);
      setInitialProductAdsList([]);
      setInitialProductAdsWorkingList([]);

      const resAccountAds = await amazonEntityServices.getProducts(
        MarketplaceEnum.AMAZON
      );
      let resAccountAdsList = resAccountAds?.data?.data ?? [];

      if (!resAccountAdsList.length) return;

      const resAdGroupAds =
        await sdAdvertisingServicesAdGroupLevel.getSDProductAdsData(
          [],
          {
            campaignId: `${selectedCampaignId}`,
            adGroupId: `${selectedAdGroupId}`,
            isDownload: true,
          },
          0,
          10,
          [
            {
              columnName: 'adSales',
              sortOrder: SortOrderEnum.DESC,
            },
          ],
          ''
        );

      const resAdGroupLevelProductAdsList =
        resAdGroupAds?.data?.data?.data ?? [];

      if (resAdGroupLevelProductAdsList.length) {
        resAccountAdsList = resAccountAdsList
          .filter(
            (row) =>
              !checkItemIsPresentInProductAdsMapAmazon(
                row.item,
                resAdGroupLevelProductAdsList
              )
          )
          .map((row) => {
            return {
              id: row.item,
              ...row,
            };
          });

        setInitialAddedProductAds(resAdGroupLevelProductAdsList);
      }

      setInitialProductAdsList(resAccountAdsList);
      setInitialProductAdsWorkingList(resAccountAdsList);
    },
    enabled:
      selectedTitle === SdAdGroupLevelTitles.PRODUCT_ADS && openDialog === true,
  });

  const isFetchingProductAdsLoading = useMemo(() => {
    return (
      fetchAmazonSPAdGroupLevelProductAds.isLoading ||
      fetchAmazonSPAdGroupLevelProductAds.isRefetching ||
      fetchAmazonSDAdGroupLevelProductAds.isLoading ||
      fetchAmazonSDAdGroupLevelProductAds.isRefetching
    );
  }, [
    fetchAmazonSPAdGroupLevelProductAds.isLoading,
    fetchAmazonSPAdGroupLevelProductAds.isRefetching,
    fetchAmazonSDAdGroupLevelProductAds.isLoading,
    fetchAmazonSDAdGroupLevelProductAds.isRefetching,
  ]);

  const isCreateProductAdsLoading = useMemo(
    () =>
      (isAddAmazonSPProductsPending === true &&
        isAddAmazonSPProductsIdle === false) ||
      (isAddAmazonSDProductsPending === true &&
        isAddAmazonSDProductsIdle === false),
    [
      isAddAmazonSPProductsPending,
      isAddAmazonSPProductsIdle,
      isAddAmazonSDProductsPending,
      isAddAmazonSDProductsIdle,
    ]
  );

  return (
    <AdvertisingCreateDialogTableTemplate
      openDialog={openDialog}
      handleCloseDialog={handleAdditionalCloseDialog}
      selectedCampaignId={selectedCampaignId}
      selectedAdGroupId={selectedAdGroupId}
      selectedAdGroup={selectedAdGroup}
      selectedTitle={selectedTitle}
      handleAdditionalClearAll={handleClearAll}
      initialAddedEntityCount={totalProductAdsCount}
      maxEntityCount={maxCountLimit}
      handleCreateEntity={handleCreateProductAds}
      isCreateLoading={isCreateProductAdsLoading}
      isInitialProductAdsListLoading={isFetchingProductAdsLoading}
      initialProductAdsList={initialProductAdsWorkingList}
      setInitialProductAdsList={setInitialProductAdsWorkingList}
      addedListTableColumns={amazonProductAdsAddedListColumns(
        handleUpdateRow,
        handleRemoveProductAds
      )}
      addedListCount={addedProductAds.length}
      entityType={AmazonAdvertisingTableTypesEnum.PRODUCT_ADS}
      marketplace={MarketplaceEnum.AMAZON}
    />
  );
}
