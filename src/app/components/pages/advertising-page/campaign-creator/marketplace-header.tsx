import { useEffect, useState } from 'react';
import type { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import CountryFlagLogo from '@/app/components/pages/advertising-page/country-flag-logo-icon';
import { CountryCodeEnum } from '@/enums/advertising.enums';
import { DropdownLabelEnum, PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setSubheaderOptions } from '@/redux/slices/advertising/sub-header.slice';
import { selectAdvertisingAccountOptions } from '@/redux/slices/auth/auth.slice';
import { getPrefixElementByMarketplace } from '@/utils/marketplace-logo.utils';
import type { Marketplace } from './campaign-creator.types';

type OnMarketplace = (marketplace: Marketplace) => void;

const asMarketplace = (m?: string): Marketplace | null => (m === 'amazon' || m === 'walmart' ? m : null);

/** The real accounts: the same Marketplace dropdown and account switching as Campaign Manager. */
function AccountsHeader({ onMarketplace }: { onMarketplace: OnMarketplace }) {
  const account = useAdsAccountSubHeader(PageTitleEnum.CAMPAIGN_CREATOR, PAGE_TITLE_TOOLTIPS.CAMPAIGN_CREATOR, false);
  const marketplace = asMarketplace(account?.marketplace);
  useEffect(() => {
    if (marketplace) onMarketplace(marketplace);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marketplace]);
  return null;
}

const mockAccount = (label: string, value: string, marketplace: MarketplaceEnum): IDropdownItem<string> => ({
  label,
  value,
  marketplace,
  prefixElement: getPrefixElementByMarketplace(marketplace),
  flagElement: <CountryFlagLogo countryCode={CountryCodeEnum.UnitedStates} />,
});

/** Stand-in accounts for the prototype, used when the signed-in user has no advertising accounts. */
const MOCK_ACCOUNTS: IDropdownItem<string>[] = [
  mockAccount('Boldfit Nutrition (Seller)', 'mock-amazon-boldfit', MarketplaceEnum.AMAZON),
  mockAccount('Northline Outdoors (Seller)', 'mock-walmart-northline', MarketplaceEnum.WALMART),
];

/** The same Marketplace dropdown, filled with one Amazon and one Walmart stand-in account. */
function MockAccountsHeader({ value, onMarketplace }: { value: Marketplace | null; onMarketplace: OnMarketplace }) {
  const dispatch = useAppDispatch();
  // Starts on the marketplace the creator already has, so coming back to this page keeps the choice.
  const [selected, setSelected] = useState(() => MOCK_ACCOUNTS.find((a) => a.marketplace === value) ?? MOCK_ACCOUNTS[0]);

  useEffect(() => {
    dispatch(setSubheaderOptions({
      title: PageTitleEnum.CAMPAIGN_CREATOR,
      titleTooltip: PAGE_TITLE_TOOLTIPS.CAMPAIGN_CREATOR,
      isDropdownRequired: true,
      goBackButton: false,
      dropdownOptions: [{
        selectedItem: selected,
        setSelectedItem: setSelected,
        label: DropdownLabelEnum.MARKETPLACE,
        options: MOCK_ACCOUNTS,
        prefixElement: selected.prefixElement,
        flagElement: selected.flagElement,
      }],
    }));
    const marketplace = asMarketplace(selected.marketplace);
    if (marketplace) onMarketplace(marketplace);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, selected]);

  return null;
}

/**
 * The Marketplace dropdown in the page header, as on Campaign Manager. Shown while choosing the ad format; the account
 * picked there decides which marketplace's products the creator works with.
 */
export default function MarketplaceHeader({ value, onMarketplace }: { value: Marketplace | null; onMarketplace: OnMarketplace }) {
  const accounts = useAppSelector(selectAdvertisingAccountOptions);
  return accounts && accounts.length > 0
    ? <AccountsHeader onMarketplace={onMarketplace} />
    : <MockAccountsHeader value={value} onMarketplace={onMarketplace} />;
}
