import { FeaturesEnum } from '@/enums/auth.enums';
import { IMenuItem } from '@/interfaces/side-bar/sidebar.interfaces';
import {} from '@/utils/advertising.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { useMemo } from 'react';

const useIsMenuItemDisabled = (item: IMenuItem) => {
  const accountDetails = localStorageUtils.getAccountDetails();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();

  const isDisabled = useMemo(() => {
    return !navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      item.feature
    );
  }, [accountDetails, selectedUserAccountMapping, item.feature]);

  const disabledItem = useMemo(() => {
    const disabledFeaturesForNoConnectedAccount = [
      FeaturesEnum.MARKET_INTELLIGENCE_KEYWORD_SOV,
      FeaturesEnum.MARKET_INTELLIGENCE_PRODUCT_SOV,
      FeaturesEnum.SETTINGS_LOGS,
    ];
    const hasAccounts = !!localStorageUtils.getAvailableAccounts().length;

    return (
      isDisabled ||
      navigationUtils.isDisabledForMarketplace(item.feature) ||
      (!hasAccounts &&
        disabledFeaturesForNoConnectedAccount.includes(item.feature))
    );
  }, [isDisabled, item.key]);

  return disabledItem;
};

export default useIsMenuItemDisabled;
