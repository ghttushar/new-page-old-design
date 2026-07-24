import { MARKET_INTELLIGENCE_URL } from '@/constants/urls.constants';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { Navigate, Route, Routes } from 'react-router-dom';
import { marketIntelligenceAccessDenied } from 'src/constants/empty-state.constants';
import { FeaturesEnum } from 'src/enums/auth.enums';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import EmptyState from '../../common/empty-state/empty-state';
import PrivateRoute from '../../private-route/private-route';
import BrandPage from './brand-page/brand-page';
import KeywordSOV from './keyword-sov/keyword-sov';
import KeywordTrackerPage from './keyword-tracker-page/keyword-tracker-page';
import MarketIntelligencePage from './market-intelligence-page/market-intelligence-page';
import styles from './market-intelligence-wrapper.module.scss';
import ProductSov from './product-sov/product-sov';

export default function   MarketIntelligenceWrapper() {
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();
  const accountDetails = localStorageUtils.getAccountDetails();

  if (
    !navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.MARKET_INTELLIGENCE
    )
  )
    return (
      <div className="center-wrapper">
        <EmptyState {...marketIntelligenceAccessDenied} />;
      </div>
    );

  return (
    <div className={styles.wrapperContainer}>
      <Routes>
        <Route
          path="/keyword-tracker/*"
          element={
            <PrivateRoute
              component={<KeywordTrackerPage />}
              feature={FeaturesEnum.MARKET_INTELLIGENCE_KEYWORD_TRACKER}
            />
          }
        />

        <Route
          path="/brand-sov/brand-analytics/:brand/*"
          element={<PrivateRoute component={<BrandPage />} />}
        />
        <Route
          path="/brand-sov/*"
          element={
            <PrivateRoute
              component={<MarketIntelligencePage />}
              feature={FeaturesEnum.MARKET_INTELLIGENCE_BRAND_SOV}
            />
          }
        ></Route>
        <Route
          path="/product-sov/*"
          element={
            <PrivateRoute
              component={<ProductSov />}
              feature={FeaturesEnum.MARKET_INTELLIGENCE_PRODUCT_SOV}
            />
          }
        />
        <Route
          path="/keyword-sov/*"
          element={
            <PrivateRoute
              component={<KeywordSOV />}
              feature={FeaturesEnum.MARKET_INTELLIGENCE_KEYWORD_SOV}
            />
          }
        />
        <Route
          path="*"
          element={
            <Navigate to={`${MARKET_INTELLIGENCE_URL}/brand-sov/amazon`} />
          }
        />
      </Routes>
    </div>
  );
}
