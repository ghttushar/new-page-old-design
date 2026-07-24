import { ICustomizablePopupDetails } from '@/app/components/common/customizable-dialog/customizable-popup';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import useAdsReviewTrigger from '@/hooks/use-ads-review-trigger.hook';
import {
  IAdvertisingCreateEntityDialogProps,
  ICreateProductAds,
} from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import {
  IWalmartAdGroup,
  IWalmartAdItem,
} from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IWalmartSVAdGroup } from '@/interfaces/advertising/walmart/walmart-sv-advertising.interface';
import { IEditAccessCreateWalmartAdItem } from '@/interfaces/edit-access/edit-access.interface';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import {
  removeAddedProductAds,
  selectAddedProductAds,
  setAddedProductAds,
  updateAddedProductAds,
} from '@/redux/slices/advertising/advertising-create-entity.slice';
import { walmartSvAdvertisingServices } from '@/services/advertising/walmart/walmart-sv-advertising.service';
import { walmartEditAccessSVServices } from '@/services/edit-access/walmart-edit-access/walmart-edit-access-sv/walmart-edit-access-sv.service';
import { displayValue, getCurrencySymbolByCountry } from '@/utils';
import { useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  WALMART_SB_AD_ITEMS_MAX,
  WALMART_SP_AD_ITEMS_MAX,
  WALMART_SV_AD_ITEMS_MAX,
} from 'src/constants/advertising-walmart.constants';
import {
  AdType,
  AdTypeShort,
  SortOrderEnum,
  WalmartAdvertisingTableTypeEnum,
  WalmartSBAdGroupLevelTitles,
  WalmartSPAdGroupLevelTitles,
  WalmartSVAdGroupLevelTitles,
} from 'src/enums/advertising.enums';
import {
  TargetingTypeEnum,
  WalmartAdGroupStatusEnum,
  WalmartCampaignStatusEnum,
} from 'src/enums/walmart.enums';
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
  checkItemIsPresentInProductAdsMapWalmart,
  getWalmartAdGroupStatus,
} from 'src/utils/advertising.utils';
import AdvertisingCreateDialogTableTemplate from '../advertising-create-dialog-templates/advertising-create-dialog-table-template';
import {
  walmartAutoProductAdsAddedListColumns,
  walmartManualProductAdsAddedListColumns,
} from '../create-dialog-table-columns';

const WalmartAddProductsDialog = ({
  openDialog,
  handleCloseDialog,
  selectedCampaignId,
  selectedAdGroupId,
  selectedTitle,
  selectedAdGroup,
  walmartTargeting,
}: IAdvertisingCreateEntityDialogProps) => {
  const [initialProductAdsList, setInitialProductAdsList] = useState<
    ICreateProductAds[]
  >([]);
  const [initialProductAdsWorkingList, setInitialProductAdsWorkingList] =
    useState<ICreateProductAds[]>([]);
  const [initialAddedProductAds, setInitialAddedProductAds] = useState<
    IWalmartAdItem[]
  >([]);
  const [maxProductAdsCount, setMaxProductAdsCount] = useState<number>(0);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const addedProductAds = useAppSelector(selectAddedProductAds);

  const {
    handlePopupOpen,
    handlePopupClose,
    PopupComponent,
    updatePopupLoading,
  } = useAdsReviewTrigger();

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

  const handleRemoveProductAds = useCallback(
    (id: string | number) => {
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
    },
    [dispatch]
  );

  const handleClearAll = () => {
    setInitialProductAdsWorkingList(initialProductAdsList);
    dispatch(setAddedProductAds([]));
  };

  const walmartMemoizedColumns = useMemo(() => {
    if (walmartTargeting && walmartTargeting === TargetingTypeEnum.AUTO) {
      return walmartAutoProductAdsAddedListColumns(
        selectedAdGroup as IWalmartAdGroup | IWalmartSVAdGroup,
        handleUpdateRow,
        handleRemoveProductAds
      );
    }

    return walmartManualProductAdsAddedListColumns(
      handleUpdateRow,
      handleRemoveProductAds
    );
  }, [
    walmartTargeting,
    selectedAdGroup,
    handleUpdateRow,
    handleRemoveProductAds,
  ]);

  const {
    mutateAsync: mutateAddWalmartSPAdItems,
    isPending: isWalmartSPAdItemsPending,
    isIdle: isWalmartSPAdItemsIdle,
  } = useAppMutation({
    mutationFn: (newAdItems: IEditAccessCreateWalmartAdItem[]) =>
      walmartEditAccessSPServices.createWalmartSPAdItems(newAdItems),
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.WMT_SP_ADGROUP_LVL_PRODUCT_ADS_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: 'Products added successfully',
          })
        );

        dispatch(setAddedProductAds([]));
      },
    },
  });

  const {
    mutateAsync: mutateAddWalmartSBAdItems,
    isPending: isWalmartSBAdItemsPending,
    isIdle: isWalmartSBAdItemsIdle,
  } = useAppMutation({
    mutationFn: ({
      newAdItems,
      isReview,
    }: {
      newAdItems: IEditAccessCreateWalmartAdItem[];
      isReview: boolean;
    }) => walmartEditAccessSBServices.createWalmartSBAdItems(newAdItems),
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
          queryKey: [QueryKeyEnums.WMT_SB_ADGROUP_LVL_PRODUCT_ADS_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: 'Products added successfully',
          })
        );

        dispatch(setAddedProductAds([]));
      },
    },
  });

  const {
    mutateAsync: mutateAddWalmartSVAdItems,
    isPending: isWalmartSVAdItemsPending,
    isIdle: isWalmartSVAdItemsIdle,
  } = useAppMutation({
    mutationFn: ({
      newAdItems,
      isReview,
    }: {
      newAdItems: IEditAccessCreateWalmartAdItem[];
      isReview: boolean;
    }) => walmartEditAccessSVServices.createWalmartSVAdItems(newAdItems),
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
          queryKey: [QueryKeyEnums.WMT_SV_ADGROUP_LVL_PRODUCT_ADS_FETCH],
        });

        dispatch(
          showSuccessToastMessage({
            title: 'Products added successfully',
          })
        );

        dispatch(setAddedProductAds([]));
      },
    },
  });

  const addedProductAdsCount = useMemo(
    () =>
      addedProductAds.filter(
        (item) =>
          item.status.toLowerCase() ===
          WalmartCampaignStatusEnum.ENABLED.toLowerCase()
      ).length,
    [addedProductAds]
  );

  const totalAddedProductAdsCount = useMemo(
    () => initialAddedProductAds.length + addedProductAdsCount,
    [addedProductAdsCount, initialAddedProductAds]
  );

  const handleCreateProductAds = async () => {
    if (totalAddedProductAdsCount > maxProductAdsCount) {
      return dispatch(
        showErrorToastMessage({
          title: 'Error!!!',
          description: `Max ${maxProductAdsCount} keywords can be added. You are about to exceed the maximum limit by ${
            totalAddedProductAdsCount - maxProductAdsCount
          }`,
        })
      );
    }

    const newAdItems: IEditAccessCreateWalmartAdItem[] = [];
    addedProductAds.forEach((product) => {
      const newAdItem: IEditAccessCreateWalmartAdItem = {
        adGroupId: `${selectedAdGroupId}`,
        campaignId: `${selectedCampaignId}`,
        entityName: product.itemName || product.item,
        itemId: product.item as string,
        status: getWalmartAdGroupStatus(
          product.status as unknown as WalmartAdGroupStatusEnum
        ),
      };

      if (
        product.customBid !== undefined &&
        walmartTargeting === TargetingTypeEnum.AUTO
      ) {
        newAdItem.bid = product.customBid;
      }

      newAdItems.push(newAdItem);
    });

    if (selectedTitle === WalmartSPAdGroupLevelTitles.AD_ITEMS) {
      if (walmartTargeting === TargetingTypeEnum.AUTO) {
        let minProductBid = '';
        let maxProductBid = '';

        for (const product of newAdItems) {
          if (product.bid !== undefined) {
            minProductBid = checkBidValueMinLimit(
              MarketplaceEnum.WALMART,
              AdType.SPONSORED_PRODUCTS,
              TargetingTypeEnum.AUTO,
              parseFloat(`${product.bid}`)
            );

            maxProductBid = checkBidValueMaxLimit(
              MarketplaceEnum.WALMART,
              AdType.SPONSORED_PRODUCTS,
              TargetingTypeEnum.AUTO,
              parseFloat(`${product.bid}`)
            );

            if (minProductBid || maxProductBid) break;
          }
        }

        if (maxProductBid) {
          return dispatch(
            showErrorToastMessage({
              title: 'Invalid Bid.',
              description: `Some bids are exceeding ${displayValue(
                maxProductBid.split(getCurrencySymbolByCountry())[1],
                false
              )},which is not allowed.`,
            })
          );
        }

        if (minProductBid) {
          return dispatch(
            showErrorToastMessage({
              title: 'Invalid Bid.',
              description: `Some bids are lower than ${displayValue(
                maxProductBid.split(getCurrencySymbolByCountry())[1],
                false
              )} which is not allowed.`,
            })
          );
        }
      }

      await mutateAddWalmartSPAdItems(newAdItems);
      handleAdditionalCloseDialog();
    } else {
      const isReview = newAdItems.some(
        (item) =>
          item.status === WalmartCampaignStatusEnum.ENABLED.toLowerCase()
      );

      const confirmationClick = async () =>
        await handleReviewConfirmationClick(newAdItems, isReview);

      if (isReview) {
        if (selectedTitle === WalmartSBAdGroupLevelTitles.AD_ITEMS) {
          const popupParams: ICustomizablePopupDetails = {
            description: [
              {
                content: `<b>Please note: </b> Adding a new product to an SB campaign will trigger a review process by Walmart's team. This process may take up to 24-48 hours during which the campaign will stop serving ads.`,
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

        if (selectedTitle === WalmartSVAdGroupLevelTitles.AD_ITEMS) {
          const popupParams: ICustomizablePopupDetails = {
            description: [
              {
                content: `<b>Please note: </b> Adding a new product to an SV campaign will trigger a review process by Walmart's team. This process may take up to 24-48 hours during which the campaign will stop serving ads.`,
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
    newAdItems: IEditAccessCreateWalmartAdItem[],
    isReview: boolean
  ) => {
    if (selectedTitle === WalmartSBAdGroupLevelTitles.AD_ITEMS) {
      await mutateAddWalmartSBAdItems({ newAdItems, isReview });
    }

    if (selectedTitle === WalmartSVAdGroupLevelTitles.AD_ITEMS) {
      await mutateAddWalmartSVAdItems({ newAdItems, isReview });
    }

    handlePopupClose();
    handleAdditionalCloseDialog();
  };

  useEffect(() => {
    updatePopupLoading(
      (isWalmartSBAdItemsPending === true &&
        isWalmartSBAdItemsIdle === false) ||
        (isWalmartSVAdItemsPending === true && isWalmartSVAdItemsIdle === false)
    );
  }, [
    isWalmartSBAdItemsPending,
    isWalmartSBAdItemsIdle,
    isWalmartSVAdItemsPending,
    isWalmartSVAdItemsIdle,
    updatePopupLoading,
  ]);

  const fetchWalmartSPAdGroupLevelAdItems = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SP_ADD_FUNC_GET_AD_ITEMS_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: async () => {
      setInitialAddedProductAds([]);
      setInitialProductAdsList([]);
      setInitialProductAdsWorkingList([]);
      setMaxProductAdsCount(WALMART_SP_AD_ITEMS_MAX);

      const resAccountAds = await walmartEntityServices.getProducts(
        MarketplaceEnum.WALMART,
        AdTypeShort.SPONSORED_PRODUCTS
      );
      let resAccountAdsList = resAccountAds?.data?.data ?? [];

      if (!resAccountAdsList.length) return;

      const resAdGroupAds = await walmartSpAdvertisingServices.getAdItems(
        [],
        {
          campaignId: `${selectedCampaignId}`,
          adGroupId: `${selectedAdGroupId}`,
          isDownload: true,
        },
        0,
        WALMART_SP_AD_ITEMS_MAX,
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
              !checkItemIsPresentInProductAdsMapWalmart(
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

        setInitialAddedProductAds(
          resAdGroupLevelProductAdsList.filter(
            (item) =>
              item.status.toLowerCase() ===
              WalmartCampaignStatusEnum.ENABLED.toLowerCase()
          )
        );
      }

      setInitialProductAdsList(resAccountAdsList);
      setInitialProductAdsWorkingList(resAccountAdsList);
    },
    enabled:
      selectedTitle === WalmartSPAdGroupLevelTitles.AD_ITEMS &&
      openDialog === true,
  });

  const fetchWalmartSBAdGroupLevelAdItems = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SB_ADD_FUNC_GET_AD_ITEMS_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: async () => {
      setInitialAddedProductAds([]);
      setInitialProductAdsList([]);
      setInitialProductAdsWorkingList([]);
      setMaxProductAdsCount(WALMART_SB_AD_ITEMS_MAX);

      const resAccountAds = await walmartEntityServices.getProducts(
        MarketplaceEnum.WALMART,
        AdTypeShort.SPONSORED_BRANDS
      );
      let resAccountAdsList = resAccountAds?.data?.data ?? [];

      if (!resAccountAdsList.length) return;

      const resAdGroupAds = await walmartSbAdvertisingServices.getSBAdItems(
        [],
        {
          campaignId: `${selectedCampaignId}`,
          adGroupId: `${selectedAdGroupId}`,
          isDownload: true,
        },
        0,
        WALMART_SB_AD_ITEMS_MAX,
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
              !checkItemIsPresentInProductAdsMapWalmart(
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

        setInitialAddedProductAds(
          resAdGroupLevelProductAdsList.filter(
            (item) =>
              item.status.toLowerCase() ===
              WalmartCampaignStatusEnum.ENABLED.toLowerCase()
          )
        );
      }

      setInitialProductAdsList(resAccountAdsList);
      setInitialProductAdsWorkingList(resAccountAdsList);
    },
    enabled:
      selectedTitle === WalmartSBAdGroupLevelTitles.AD_ITEMS &&
      openDialog === true,
  });

  const fetchWalmartSVAdGroupLevelAdItems = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_SV_ADD_FUNC_GET_AD_ITEMS_FETCH,
      {
        selectedCampaignId,
        selectedAdGroupId,
      },
    ],
    queryFn: async () => {
      setInitialAddedProductAds([]);
      setInitialProductAdsList([]);
      setInitialProductAdsWorkingList([]);
      setMaxProductAdsCount(WALMART_SV_AD_ITEMS_MAX);

      const resAccountAds = await walmartEntityServices.getProducts(
        MarketplaceEnum.WALMART,
        AdTypeShort.SPONSORED_VIDEO
      );
      let resAccountAdsList = resAccountAds?.data?.data ?? [];

      if (!resAccountAdsList.length) return;

      const resAdGroupAds = await walmartSvAdvertisingServices.getSVAdItems(
        [],
        {
          campaignId: `${selectedCampaignId}`,
          adGroupId: `${selectedAdGroupId}`,
          isDownload: true,
        },
        0,
        WALMART_SV_AD_ITEMS_MAX,
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
              !checkItemIsPresentInProductAdsMapWalmart(
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

        setInitialAddedProductAds(
          resAdGroupLevelProductAdsList.filter(
            (item) =>
              item.status.toLowerCase() ===
              WalmartCampaignStatusEnum.ENABLED.toLowerCase()
          )
        );
      }

      setInitialProductAdsList(resAccountAdsList);
      setInitialProductAdsWorkingList(resAccountAdsList);
    },
    enabled:
      selectedTitle === WalmartSVAdGroupLevelTitles.AD_ITEMS &&
      openDialog === true,
  });

  const isFetchingProductAdsLoading = useMemo(() => {
    return (
      fetchWalmartSPAdGroupLevelAdItems.isLoading ||
      fetchWalmartSPAdGroupLevelAdItems.isRefetching ||
      fetchWalmartSBAdGroupLevelAdItems.isLoading ||
      fetchWalmartSBAdGroupLevelAdItems.isRefetching ||
      fetchWalmartSVAdGroupLevelAdItems.isLoading ||
      fetchWalmartSVAdGroupLevelAdItems.isRefetching
    );
  }, [
    fetchWalmartSPAdGroupLevelAdItems.isLoading,
    fetchWalmartSPAdGroupLevelAdItems.isRefetching,
    fetchWalmartSBAdGroupLevelAdItems.isLoading,
    fetchWalmartSBAdGroupLevelAdItems.isRefetching,
    fetchWalmartSVAdGroupLevelAdItems.isLoading,
    fetchWalmartSVAdGroupLevelAdItems.isRefetching,
  ]);

  const isCreateProductAdsLoading = useMemo(
    () =>
      (isWalmartSPAdItemsPending === true &&
        isWalmartSPAdItemsIdle === false) ||
      (isWalmartSBAdItemsPending === true &&
        isWalmartSBAdItemsIdle === false) ||
      (isWalmartSVAdItemsPending === true && isWalmartSVAdItemsIdle === false),
    [
      isWalmartSPAdItemsPending,
      isWalmartSPAdItemsIdle,
      isWalmartSBAdItemsPending,
      isWalmartSBAdItemsIdle,
      isWalmartSVAdItemsPending,
      isWalmartSVAdItemsIdle,
    ]
  );

  return (
    <React.Fragment>
      <AdvertisingCreateDialogTableTemplate
        openDialog={openDialog}
        handleCloseDialog={handleAdditionalCloseDialog}
        selectedCampaignId={selectedCampaignId}
        selectedAdGroupId={selectedAdGroupId}
        selectedAdGroup={selectedAdGroup}
        selectedTitle={selectedTitle}
        handleAdditionalClearAll={handleClearAll}
        initialAddedEntityCount={totalAddedProductAdsCount}
        maxEntityCount={maxProductAdsCount}
        handleCreateEntity={handleCreateProductAds}
        isCreateLoading={isCreateProductAdsLoading}
        isInitialProductAdsListLoading={isFetchingProductAdsLoading}
        initialProductAdsList={initialProductAdsWorkingList}
        setInitialProductAdsList={setInitialProductAdsWorkingList}
        addedListTableColumns={walmartMemoizedColumns}
        addedListCount={addedProductAdsCount}
        entityType={WalmartAdvertisingTableTypeEnum.AD_ITEM}
        marketplace={MarketplaceEnum.AMAZON}
      />

      {PopupComponent !== null && PopupComponent}
    </React.Fragment>
  );
};

export default WalmartAddProductsDialog;
