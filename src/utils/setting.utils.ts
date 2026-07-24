import { COUNTRY_MAPPING } from 'src/constants/settings/settings.constants';

const settingUtils = {
  getCountryAndCountryCode: (marketplaceId: string | undefined) => {
    if (!marketplaceId) return { country: '-', countryCode: '-' };
    return COUNTRY_MAPPING.get(marketplaceId);
  },
};

export default settingUtils;
