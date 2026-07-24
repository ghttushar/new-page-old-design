import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import {
  ISubHeaderDataItem,
  ISubHeaderProps,
} from '@/app/components/common/sub-header/sub-header';
import {
  AmazonRegionDropdownOptions,
  CountryCodeShortMap,
} from '@/constants/advertising-amazon-region.constants';
import {
  marketplaceAllOption,
  marketplaceOptions,
} from '@/constants/market-intelligence.constants';
import { CountryCodeEnum } from '@/enums/advertising.enums';
import { DropdownLabelEnum, PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAuthSelector } from '@/redux/auth-selector/auth-selector';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSubheaderOptions } from '@/redux/slices/advertising/sub-header.slice';
import {
  selectAdvertisingAccount,
  setSelectedMarketplace,
} from '@/redux/slices/auth/auth.slice';
import { getTitleCaseString } from '@/utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import {
  getPrefixElementByMarketplace,
  parseAdvertisingAccount,
} from '@/utils/marketplace-logo.utils';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdsFirstMarketplaceAccount,
  getLastSelectedAccountByMarketplace,
  sortDropdownOptions,
} from 'src/utils/advertising.utils';

const useMarketplaceSubheader = (
  title: string,
  getUrl?: (marketplace: string) => string,
  initialMarketplace?: string
) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { setAdvertisingAccount } = useAuthSelector();

  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const selectedMarketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace,
    [selectedAdvertisingAccount]
  );

  const activeMarketplace = useMemo(
    () =>
      getLastSelectedAccountByMarketplace(
        selectedMarketplace as MarketplaceEnum
      ),
    [selectedMarketplace]
  );

  const [marketplace, setMarketplace] = useState<string>(
    `${
      initialMarketplace
        ? initialMarketplace
        : title === PageTitleEnum.ACCOUNTS
        ? MarketplaceEnum.All
        : activeMarketplace?.marketplace
        ? activeMarketplace?.marketplace
        : localStorageUtils.getLastSelectedMarketplace()
    }`
  );

  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    marketplace === MarketplaceEnum.WALMART
      ? CountryCodeEnum.UnitedStates
      : localStorageUtils.getMIAccountCountryCode() ??
          localStorageUtils.getAccountCountryCode()
  );

  const formattedMarketplaceOptions =
    title === PageTitleEnum.ACCOUNTS ||
    title === PageTitleEnum.KEYWORD_TRACKER ||
    title === PageTitleEnum.REPORTS
      ? [marketplaceAllOption, ...marketplaceOptions]
      : marketplaceOptions;

  const handleRegionChange = (value: IDropdownItem<string>) => {
    setSelectedCountryCode(value.value);
    localStorageUtils.setMIAccountCountryCode(value.value);
  };

  useEffect(() => {
    if (!initialMarketplace || initialMarketplace === marketplace) return;

    setMarketplace(initialMarketplace);
  }, [initialMarketplace, marketplace]);

  const handleMarketplaceChange = (value: IDropdownItem<string>) => {
    if (value.value === MarketplaceEnum.WALMART)
      setSelectedCountryCode(CountryCodeEnum.UnitedStates);
    setMarketplace(value.value);
    if (getUrl) {
      const newUrl = getUrl(value.value);
      navigate(newUrl);
    }
    dispatch(setSelectedMarketplace(value));

    const lastSelectedAccount =
      getLastSelectedAccountByMarketplace(value.value as MarketplaceEnum) ??
      getAdsFirstMarketplaceAccount(value.value);

    if (lastSelectedAccount)
      setAdvertisingAccount(parseAdvertisingAccount(lastSelectedAccount));
    else
      localStorageUtils.setLastSelectedMarketplace({
        accountType: '',
        marketplace: value.value as MarketplaceEnum,
      });
  };

  useEffect(() => {
    const subHeaderDropdownOptions: Array<ISubHeaderDataItem> = [
      {
        selectedItem: {
          label: getTitleCaseString(marketplace),
          value: marketplace,
        },
        setSelectedItem: handleMarketplaceChange,
        label: DropdownLabelEnum.MARKETPLACE,
        options: formattedMarketplaceOptions,
        prefixElement: getPrefixElementByMarketplace(marketplace),
      },
    ];

    if (
      title === PageTitleEnum.BRAND_ANALYTICS ||
      title === PageTitleEnum.PRODUCT_SOV ||
      title === PageTitleEnum.KEYWORD_SOV ||
      title === PageTitleEnum.BRAND_SOV ||
      title === PageTitleEnum.KEYWORD_TRACKER
    ) {
      const options = [...AmazonRegionDropdownOptions];
      if (title === PageTitleEnum.KEYWORD_TRACKER) {
        options.push({
          value: CountryCodeEnum.ALL,
          label: CountryCodeShortMap[CountryCodeEnum.ALL],
        });
      }
      const regionSubHeaderOption: ISubHeaderDataItem = {
        selectedItem: {
          value: selectedCountryCode,
          label: CountryCodeShortMap[selectedCountryCode],
        },
        setSelectedItem: handleRegionChange,
        label: DropdownLabelEnum.REGION,
        options: sortDropdownOptions(options),
        disabled: marketplace === MarketplaceEnum.WALMART,
      };
      subHeaderDropdownOptions.unshift(regionSubHeaderOption);
    }
    dispatch(
      setSubheaderOptions({
        title,
        isDropdownRequired: true,
        dropdownOptions: subHeaderDropdownOptions,
        goBackButton: false,
      } as ISubHeaderProps)
    );

    // Navigate to the specified URL if the marketplace changes
    if (getUrl) {
      const url = getUrl(marketplace);
      if (window.location.pathname !== url) {
        navigate(url);
      }
    }
  }, [
    dispatch,
    getUrl,
    navigate,
    activeMarketplace,
    title,
    marketplace,
    selectedCountryCode,
  ]);

  return [marketplace, selectedCountryCode];
};

export default useMarketplaceSubheader;
