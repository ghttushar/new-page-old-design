import {
  ISubHeaderDataItem,
  ISubHeaderProps,
} from '@/app/components/common/sub-header/sub-header';
import { advertisingOptionAdTypeAmazon } from '@/constants/advertising-filter.constants';
import { customRangeFilterOption } from '@/constants';
import { AdType } from '@/enums/advertising.enums';
import { DropdownLabelEnum, PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAuthSelector } from '@/redux/auth-selector/auth-selector';
import { resetChatbotState } from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { resetAdvEditAccess } from '@/redux/slices/advertising/advertising-edit-access.slice';
import {
  resetAdvertisingHeaderOptions,
  resetPaginationModel,
  selectAdvertisingHeaderFilterOptions,
  selectAdvertisingHeaderFilters,
  setAdvertisingHeaderFilters,
  setAdvertisingRangeCustomOption,
} from '@/redux/slices/advertising/advertising-filter.slice';
import { setSubheaderOptions } from '@/redux/slices/advertising/sub-header.slice';
import {
  selectAdvertisingAccount,
  selectAdvertisingAccountOptions,
} from '@/redux/slices/auth/auth.slice';
import { handleQueryCancellation } from '@/utils';
import chatbotUtils from '@/utils/chatbot.utils';
import accountUtils from '@/utils/settings/accounts/account.utils';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { checkIsNull } from 'src/utils/advertising.utils';

const useAdsAccountSubHeader = (
  title: string,
  titleTooltip: string,
  showAdTypeDropdown: boolean,
  getUrl?: (marketplace: MarketplaceEnum, adType: AdType) => string,
  onChange?: (marketplace: MarketplaceEnum, adType: AdType) => string
) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authSelector = useAuthSelector();
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const selectedAdTypeFilter = useAppSelector(selectAdvertisingHeaderFilters);
  const queryClient = useQueryClient();

  const advertisingAccountOptions = useAppSelector(
    selectAdvertisingAccountOptions
  );
  const adTypeFilterOptions = useAppSelector(
    selectAdvertisingHeaderFilterOptions
  );

  const handleSetAdsAccount = useCallback(
    (account: IDropdownItem<string>) => {
      authSelector.setAdvertisingAccount(account);
      const catalogAccount = accountUtils.getCatalogAccountOptionsByAdsAccount(
        account.value
      )[0];
      authSelector.selectCatalogAccount(catalogAccount);

      dispatch(resetPaginationModel());
      dispatch(resetChatbotState());
      dispatch(resetAdvEditAccess());
      dispatch(resetAdvertisingHeaderOptions());
      chatbotUtils.newSession();

      if (getUrl) {
        const url = getUrl(account.marketplace as MarketplaceEnum, AdType.All);
        navigate(url);
      }
      if (onChange) {
        const url = onChange(
          account.marketplace as MarketplaceEnum,
          selectedAdTypeFilter.adType.value as AdType
        );
        navigate(url);
      }

      handleQueryCancellation(queryClient);
    },
    [dispatch, getUrl, navigate, onChange, selectedAdTypeFilter.adType.value]
  );

  const handleSetAdTypeFilter = useCallback(
    (value: IDropdownItem<string>) => {
      dispatch(
        setAdvertisingHeaderFilters({
          adType: value,
        })
      );

      dispatch(resetPaginationModel());
      handleQueryCancellation(queryClient);

      if (getUrl) {
        const url = getUrl(
          selectedAdvertisingAccount.marketplace as MarketplaceEnum,
          value.value as AdType
        );
        navigate(url);
      }
      if (onChange) {
        const url = onChange(
          selectedAdvertisingAccount.marketplace as MarketplaceEnum,
          value.value as AdType
        );
        navigate(url);
      }
    },
    [
      dispatch,
      queryClient,
      getUrl,
      onChange,
      selectedAdvertisingAccount.marketplace,
      navigate,
    ]
  );

  useEffect(() => {
    dispatch(resetAdvertisingHeaderOptions());
    dispatch(setAdvertisingRangeCustomOption(customRangeFilterOption));
    if (
      (title === PageTitleEnum.DAY_PARTING ||
        title === PageTitleEnum.SCHEDULED_JOBS ||
        title === PageTitleEnum.HISTORY) &&
      selectedAdvertisingAccount.marketplace === MarketplaceEnum.AMAZON
    ) {
      dispatch(
        setAdvertisingHeaderFilters({
          adType: advertisingOptionAdTypeAmazon[1],
        })
      );
    }

    const dropdownOptions: Array<ISubHeaderDataItem> = [
      {
        selectedItem: selectedAdvertisingAccount,
        setSelectedItem: handleSetAdsAccount,
        label: DropdownLabelEnum.MARKETPLACE,
        options: accountUtils.getAdsAccountOptionsByTitle(
          title,
          advertisingAccountOptions
        ),
        prefixElement: selectedAdvertisingAccount.prefixElement,
        flagElement: selectedAdvertisingAccount.flagElement,
        disabled: title === PageTitleEnum.RULES_CREATION,
      },
    ];
    if (showAdTypeDropdown) {
      dropdownOptions.push({
        selectedItem: selectedAdTypeFilter.adType,
        setSelectedItem: handleSetAdTypeFilter,
        label: DropdownLabelEnum.AD_TYPE,
        options: adTypeFilterOptions.adType,
        disabled:
          (title === PageTitleEnum.DAY_PARTING ||
            title === PageTitleEnum.SCHEDULED_JOBS ||
            title === PageTitleEnum.HISTORY) &&
          selectedAdvertisingAccount.marketplace === MarketplaceEnum.AMAZON,
      });
    }
    const subHeaderOptions: ISubHeaderProps = {
      title: title,
      titleTooltip: titleTooltip,
      isDropdownRequired: true,
      goBackButton: false,
      dropdownOptions:
        checkIsNull(selectedAdvertisingAccount) ||
        (showAdTypeDropdown === true &&
          checkIsNull(selectedAdTypeFilter.adType))
          ? []
          : dropdownOptions,
    };
    dispatch(setSubheaderOptions(subHeaderOptions));
  }, [
    adTypeFilterOptions.adType,
    selectedAdTypeFilter.adType,
    selectedAdvertisingAccount,
    advertisingAccountOptions,
    dispatch,
    handleSetAdTypeFilter,
    handleSetAdsAccount,
    title,
    titleTooltip,
    showAdTypeDropdown,
  ]);

  return selectedAdvertisingAccount;
};

export default useAdsAccountSubHeader;
