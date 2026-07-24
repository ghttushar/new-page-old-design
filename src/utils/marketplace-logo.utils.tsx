import ImgComponent from '@/app/components/common/img-component/img-component';
import CountryFlagLogo from '@/app/components/pages/advertising-page/country-flag-logo-icon';
import { EMPTY_ACCOUNT } from '@/constants';
import { CountryCodeEnum } from '@/enums/advertising.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import React from 'react';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import MarketplaceLogo from 'src/app/components/pages/advertising-page/marketplace-logo';
import {
  IDSPAdvertiserAccount,
  ISettingsAccount,
} from 'src/interfaces/settings.interface';
import { getCountryFlagIcon } from '.';
import { getAccountType } from './advertising.utils';
import localStorageUtils from './local-storage/local-storage.utils';

const marketPlaceLogoStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.2rem',
};
export const parseAdvertisingAccount = (
  account: ISettingsAccount | undefined | null
): IDropdownItem<string> => {
  if (account === undefined || account === null) return EMPTY_ACCOUNT;
  const marketplace = account?.advertising?.amazonProfileId
    ? MarketplaceEnum.AMAZON
    : MarketplaceEnum.WALMART;
  return {
    label: `${account?.advertising?.brandName} (${getAccountType(
      account.accountType
    )})`.trim(),
    value: account?.advertising?.amazonProfileId
      ? (account?.advertising?.amazonProfileId as string)
      : (account?.advertising?.walmartAdvertiserId as string),
    marketplace: marketplace,
    prefixElement: getPrefixElementByMarketplace(marketplace),
    flagElement: (
      <ImgComponent
        alt=""
        customStyles={{
          width: '1.8rem',
        }}
        imageURL={getCountryFlagIcon(
          account.advertising?.countryCode ?? account.catalog?.countryCode ?? ''
        )}
      />
    ),
  };
};
export const parseDSPAccount = (
  account: IDSPAdvertiserAccount | undefined | null
): IDropdownItem<string> => {
  if (account === undefined || account === null) return EMPTY_ACCOUNT;

  return {
    label: account.name ?? account.advertiserId,
    value: account.advertiserId,
    marketplace: MarketplaceEnum.AMAZON,
    prefixElement: getPrefixElementByMarketplace(MarketplaceEnum.AMAZON),
    flagElement: (
      <CountryFlagLogo
        countryCode={account.country ?? CountryCodeEnum.UnitedStates}
      />
    ),
  };
};
export const getSelectedMarketplaceAccountOptions = (
  advertisingOptions: IDropdownItem<string>[],
  marketplace: string
): IDropdownItem<string>[] => {
  if (marketplace === MarketplaceEnum.All) return advertisingOptions;
  const options = advertisingOptions.filter(
    (option) => option.marketplace === marketplace
  );
  return options;
};
export const parseCatalogAccount = (
  account: ISettingsAccount | undefined | null
): IDropdownItem<string> => {
  if (account === undefined || account === null) return EMPTY_ACCOUNT;
  const marketplace = account.marketplace;

  return {
    label: `${account?.catalog?.partnerDisplayName}(${getAccountType(
      account.accountType
    )})`.trim(),
    value: genCatalogAccountOptionValue(account),
    marketplace: marketplace,
    prefixElement: getPrefixElementByMarketplace(marketplace),
    flagElement: (
      <CountryFlagLogo
        countryCode={
          account.catalog?.countryCode ??
          account.advertising?.countryCode ??
          CountryCodeEnum.UnitedStates
        }
      />
    ),
  };
};

export const genCatalogAccountOptionValue = (account: ISettingsAccount) => {
  const partnerId =
    account?.catalog?.partnerId ?? account?.catalog?.partnerStoreId ?? '';
  return partnerId;
};

export const getAdvertisingAccountOptions = () => {
  const availableAccounts = localStorageUtils.getAvailableAccounts();
  const options: IDropdownItem<string>[] = availableAccounts
    .filter((account) => account.advertising)
    .map((account) => {
      return parseAdvertisingAccount(account);
    });
  return options;
};

export const getPrefixElementByMarketplace = (marketplace: string) => {
  if (marketplace === MarketplaceEnum.All)
    return (
      <div style={marketPlaceLogoStyles}>
        <MarketplaceLogo marketplace={MarketplaceEnum.AMAZON} />
        <span
          style={{
            paddingBottom: '0.3rem',
          }}
        >
          <MarketplaceLogo marketplace={MarketplaceEnum.WALMART} />
        </span>
      </div>
    );

  return <MarketplaceLogo marketplace={marketplace} />;
};
