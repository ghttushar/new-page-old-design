import { AdType } from '@/enums/advertising.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { useAppDispatch } from '@/redux/hooks';
import { setAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { getSelectedAdTypeByMarketplace } from '@/utils/advertising.utils';
import { getNewImpactAnalysisUrl } from '@/utils/analysis.utils';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AnalysisAmazonWrapper from './analysis-amazon/analysis-amazon-wrapper';
import AnalysisWalmartWrapper from './analysis-walmart/analysis-walmart-wrapper';

const AnalysisWrapper = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const advertisingAccount = useAdsAccountSubHeader(
    PageTitleEnum.IMPACT_ANALYSIS,
    PAGE_TITLE_TOOLTIPS.IMPACT_ANALYSIS,
    true,
    getNewImpactAnalysisUrl
  );
  useEffect(() => {
    const urlPattern =
      /\/advertising\/analysis\/(amazon|walmart)\/(sp|sb|sd|sv|all)\//;
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

      const url = getNewImpactAnalysisUrl(
        payload.marketplace.marketplace ?? MarketplaceEnum.AMAZON,
        payload.adType.value
      );
      navigate(url);
    }
  }, [advertisingAccount, dispatch, location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/amazon/*" element={<AnalysisAmazonWrapper />} />
      <Route path="/walmart/*" element={<AnalysisWalmartWrapper />} />
    </Routes>
  );
};

export default AnalysisWrapper;
