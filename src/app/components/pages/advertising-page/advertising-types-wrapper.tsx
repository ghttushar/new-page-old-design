import { PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AdType } from 'src/enums/advertising.enums';
import { FeaturesEnum } from 'src/enums/auth.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectAdvertisingHeaderFilters,
  setAdvertisingHeaderFilters,
} from 'src/redux/slices/advertising/advertising-filter.slice';
import {
  getMarketplaceUrl,
  getSelectedAdTypeByMarketplace,
} from 'src/utils/advertising.utils';
import PrivateRoute from '../../private-route/private-route';
import AdvertisingAmazonWrapper from './advertising-marketplace-wrapper/advertising-amazon-wrapper';
import AdvertisingWalmartWrapper from './advertising-marketplace-wrapper/advertising-walmart-wrapper';
import styles from './advertising-page.module.scss';
import AdvertisingRedirectionWrapper from './advertising-redirection-wrapper';
export default function AdvertisingTypesWrapper() {
  const advertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.ADVERTISING,
    PAGE_TITLE_TOOLTIPS.ADVERTISING,
    true,
    getMarketplaceUrl
  );

  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const marketplace = advertisingAccount.marketplace as MarketplaceEnum;
    const urlPattern =
      /\/advertising\/campaign-manager\/(amazon|walmart)\/(sp|sb|sd|sv|all)/;
    const testUrl = location.pathname;
    const match = testUrl.match(urlPattern);
    if (match) {
      const marketplace = match[1];
      const adType = match[2];
      const payload = {
        marketplace: advertisingAccount,
        adType: getSelectedAdTypeByMarketplace(
          adType,
          advertisingAccount.marketplace as MarketplaceEnum
        ),
      };
      dispatch(setAdvertisingHeaderFilters(payload));
    } else {
      const payload = {
        marketplace: advertisingAccount,
        adType: getSelectedAdTypeByMarketplace(
          AdType.All,
          advertisingAccount.marketplace as MarketplaceEnum
        ),
      };
      dispatch(setAdvertisingHeaderFilters(payload));

      const url = getMarketplaceUrl(marketplace, AdType.All);
      navigate(url);
    }
  }, [advertisingAccount, dispatch, location.pathname, navigate]);

  // TODO: Remove
  if (advHeaderFilters.adType.value === AdType.NONE) {
    return <h1>Ad Type Not Selected</h1>;
  }

  return (
    <div className={styles.Container}>
      <div className={styles.Container}>
        <Routes>
          <Route
            path="/amazon/*"
            element={
              <PrivateRoute
                component={<AdvertisingAmazonWrapper />}
                feature={FeaturesEnum.ADVERTISING_AMAZON}
              />
            }
          />
          <Route
            path="/walmart/*"
            element={
              <PrivateRoute
                component={<AdvertisingWalmartWrapper />}
                feature={FeaturesEnum.ADVERTISING_WALMART}
              />
            }
          />
          <Route
            path="/*"
            element={
              <PrivateRoute component={<AdvertisingRedirectionWrapper />} />
            }
          />
        </Routes>
      </div>
    </div>
  );
}
