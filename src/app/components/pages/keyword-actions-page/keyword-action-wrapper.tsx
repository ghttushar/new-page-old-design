import { PageTitleEnum } from '@/enums/index.enums';
import { KeywordActionTabsEnum } from '@/enums/keyword-action.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { useAppDispatch } from '@/redux/hooks';
import { setSelectedTab } from '@/redux/slices/keyword-action/amazon/keyword-action.slice';
import { setWalmartSelectedTab } from '@/redux/slices/keyword-action/walmart/keyword-action.slice';
import { useCallback, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AdType } from 'src/enums/advertising.enums';
import { FeaturesEnum } from 'src/enums/auth.enums';
import { getKeywordActionMarketplaceUrl } from 'src/utils/advertising.utils';
import PrivateRoute from '../../private-route/private-route';
import AmazonKeywordActionWrapper from './amazon/amazon-keyword-action-wrapper';
import styles from './keyword-action-wrapper.module.scss';
import WalmartKeywordActionWrapper from './walmart/walmart-keyword-action-wrapper';

export default function KeywordActionWrapper() {
  const getUrl = useCallback((mkt: MarketplaceEnum, _: AdType) => {
    return getKeywordActionMarketplaceUrl(mkt);
  }, []);
  const advertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.TARGETING_ACTIONS,
    PAGE_TITLE_TOOLTIPS.TARGETING_ACTIONS,
    false,
    getUrl
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const marketplace = advertisingAccount.marketplace as MarketplaceEnum;
    const url = getKeywordActionMarketplaceUrl(marketplace);
    if (location.pathname !== url) {
      navigate(url);
    }

    dispatch(setSelectedTab(KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON));
    dispatch(
      setWalmartSelectedTab(KeywordActionTabsEnum.KEYWORD_ADDITION_WALMART)
    );
  }, [advertisingAccount.marketplace, location.pathname, navigate, dispatch]);

  return (
    <div className={styles.keywordActionPage}>
      <Routes>
        <Route
          path="/amazon"
          element={
            <PrivateRoute
              component={<AmazonKeywordActionWrapper />}
              feature={FeaturesEnum.ADVERTISING_TARGETING_ACTIONS_AMAZON}
            />
          }
        />
        <Route
          path="/walmart"
          element={
            <PrivateRoute
              component={<WalmartKeywordActionWrapper />}
              feature={FeaturesEnum.ADVERTISING_TARGETING_ACTIONS_WALMART}
            />
          }
        />
      </Routes>
    </div>
  );
}
