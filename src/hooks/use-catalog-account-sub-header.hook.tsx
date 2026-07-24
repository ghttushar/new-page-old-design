import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import {
  ISubHeaderDataItem,
  ISubHeaderProps,
} from '@/app/components/common/sub-header/sub-header';
import { customRangeFilterOption } from '@/constants';
import { emptyDateRange } from '@/constants/profitability/profitability.constants';
import { DropdownLabelEnum, PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IDateRange } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useAuthSelector } from '@/redux/auth-selector/auth-selector';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSubheaderOptions } from '@/redux/slices/advertising/sub-header.slice';
import {
  selectAdvertisingAccount,
  selectCatalogAccount,
  selectCatalogAccountOptions,
} from '@/redux/slices/auth/auth.slice';
import {
  ICatalogHeaderFilterForm,
  selectCatalogHeaderFilterOptions,
  selectCatalogHeaderFilters,
  setCatalogHeaderFilters,
  setCatalogHeaderFiltersCustomRange,
  setCatalogHeaderFiltersRange,
} from '@/redux/slices/catalog/catalog.slice';
import { handleQueryCancellation } from '@/utils';
import {
  checkIsNull,
  getSelectedAdvertisingAccountByDropdownValue,
} from '@/utils/advertising.utils';
import { parseAdvertisingAccount } from '@/utils/marketplace-logo.utils';
import accountUtils from '@/utils/settings/accounts/account.utils';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

const useCatalogAccountSubHeader = (
  title: string,
  titleTooltip: string,
  onChange?: () => void
) => {
  const dispatch = useAppDispatch();
  const authSelector = useAuthSelector();
  const queryClient = useQueryClient();
  const catalogAccount = useAppSelector(selectCatalogAccount);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const catalogAccountOptions = useAppSelector(selectCatalogAccountOptions);
  const headerFilters = useAppSelector(selectCatalogHeaderFilters);
  const headerFilterOptions = useAppSelector(selectCatalogHeaderFilterOptions);

  const [showDateRangeModal, setShowDateRangeModal] = useState<boolean>(false);
  const [prevRange, setPrevRange] = useState<IDropdownItem<string> | null>(
    null
  );

  const adsAccountOptions = useMemo(
    () => accountUtils.getAdsAccountOptionsByPartnerId(catalogAccount.value),
    [catalogAccount.value]
  );

  const setFilters = useCallback(
    (filters: ICatalogHeaderFilterForm) =>
      dispatch(setCatalogHeaderFilters(filters)),
    [dispatch]
  );

  const handleSetCustomDateRangeForModal = (dateRange: IDateRange) => {
    if (onChange) onChange();
    const newFilters = {
      ...headerFilters,
      customDateRange: dateRange,
      range: customRangeFilterOption,
    };
    setFilters(newFilters);
  };

  const handleDateRangeFilterChange = (value: IDropdownItem<string>) => {
    if (onChange) onChange();
    setPrevRange(headerFilters.range);
    dispatch(setCatalogHeaderFiltersRange(value));
    dispatch(setCatalogHeaderFiltersCustomRange(emptyDateRange));
  };

  const handleMarketplaceFilterChange = useCallback(
    (account: IDropdownItem<string>) => {
      if (onChange) onChange();

      authSelector.selectCatalogAccount(account);
      const selectedAdvertisingAccount =
        getSelectedAdvertisingAccountByDropdownValue(
          accountUtils.getAdsAccountOptionsByPartnerId(account.value)[0].value
        );
      authSelector.setAdvertisingAccount(
        parseAdvertisingAccount(selectedAdvertisingAccount)
      );
      handleQueryCancellation(queryClient);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authSelector, dispatch]
  );

  const handleSetAdsAccount = (account: IDropdownItem<string>) => {
    const selectedAdvertisingAccount =
      getSelectedAdvertisingAccountByDropdownValue(account.value);

    authSelector.setAdvertisingAccount(
      parseAdvertisingAccount(selectedAdvertisingAccount)
    );
  };
  useEffect(() => {
    const dropdownOptions: ISubHeaderDataItem[] = [
      {
        selectedItem: catalogAccount,
        setSelectedItem: handleMarketplaceFilterChange,
        label: DropdownLabelEnum.ACCOUNT,
        options: accountUtils.getAdsAccountOptionsByTitle(
          title,
          catalogAccountOptions
        ),
        prefixElement: catalogAccount.prefixElement,
        flagElement: catalogAccount.flagElement,
      },
    ];

    if (title === PageTitleEnum.CATALOG_HOME)
      dropdownOptions.unshift({
        selectedItem: headerFilters.range,
        setSelectedItem: handleDateRangeFilterChange,
        label: DropdownLabelEnum.DATE_RANGE,
        options: headerFilterOptions.range,
        previousRangeState: prevRange,
        fallbackRangeState: headerFilterOptions.range[0],
        customDateRange: headerFilters.customDateRange,
        showDateRangeModal: showDateRangeModal,
        setShowDateRangeModal: setShowDateRangeModal,
        handleSetCustomDateRangeForModal: handleSetCustomDateRangeForModal,
      });

    if (
      (title === PageTitleEnum.PROFITABILITY_DASHBOARD ||
        title === PageTitleEnum.PROFITABILITY_PROFIT_N_LOSS ||
        title === PageTitleEnum.PROFITABILITY_TRENDS) &&
      catalogAccount.marketplace === MarketplaceEnum.AMAZON
    ) {
      dropdownOptions.unshift({
        selectedItem: advertisingAccount,
        setSelectedItem: handleSetAdsAccount,
        label: DropdownLabelEnum.MARKETPLACE,
        options: adsAccountOptions,
        prefixElement: advertisingAccount.prefixElement,
        flagElement: advertisingAccount.flagElement,
      });
    }

    const subHeaderOptions: ISubHeaderProps = {
      title: title,
      titleTooltip: titleTooltip,
      isDropdownRequired: true,
      dropdownOptions:
        checkIsNull(catalogAccount) || checkIsNull(headerFilters)
          ? []
          : dropdownOptions,
      defaultPreset: headerFilters.range,
      selectedCustomDateRange: headerFilters.customDateRange,
      goBackButton: false,
    };
    dispatch(setSubheaderOptions(subHeaderOptions));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    catalogAccount,
    catalogAccountOptions,
    dispatch,
    headerFilterOptions.range,
    headerFilters,
    headerFilters.customDateRange,
    headerFilters.range,
    prevRange,
    advertisingAccount,
    showDateRangeModal,
    title,
    titleTooltip,
  ]);

  return catalogAccount;
};

export default useCatalogAccountSubHeader;
