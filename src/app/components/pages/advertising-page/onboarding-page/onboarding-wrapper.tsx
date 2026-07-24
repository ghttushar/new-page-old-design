import { amazonCards } from '@/constants/onboarding/amazon-onboarding.constants';
import { walmartCards } from '@/constants/onboarding/walmart-onboarding.constants';
import {
  AmazonOnboardingEnum,
  WalmartOnboardingEnum,
} from '@/enums/onboarding.enums';
import { Route, Routes } from 'react-router-dom';
import AccountOnboardingPage from './account-onboarding-page';
import AmazonAdsConnectingPage from './amazon-ads-connecting-page';
import AmazonSpConnectingPage from './amazon-sp-connecting-page';
import WalmartConnectConnectingPage from './walmart-connect-connecting-page';
import WalmartOnboardingConnecting from './walmart-onboarding-connecting';
import WalmartSupplierConnectingPage from './walmart-supplier-onboarding-connecting';

const OnboardingWrapper = () => {
  return (
    <Routes>
      <Route
        path="/connecting/walmart"
        element={<WalmartOnboardingConnecting />}
      />
      <Route
        path="/connecting/walmart-supplier"
        element={<WalmartSupplierConnectingPage />}
      />

      <Route
        path="/connecting/walmart-connect/:advertiserId"
        element={<WalmartConnectConnectingPage />}
      />
      <Route path="/connecting/amazon" element={<AmazonAdsConnectingPage />} />
      <Route
        path="/connecting/amazon-sp"
        element={<AmazonSpConnectingPage />}
      />

      <Route
        path="/walmart"
        element={
          <AccountOnboardingPage
            title={WalmartOnboardingEnum.TITLE}
            subtitle={WalmartOnboardingEnum.SUBTITLE}
            accountCards={walmartCards}
          />
        }
      />
      <Route
        path="/amazon"
        element={
          <AccountOnboardingPage
            title={AmazonOnboardingEnum.TITLE}
            subtitle={AmazonOnboardingEnum.SUBTITLE}
            accountCards={amazonCards}
          />
        }
      />
    </Routes>
  );
};

export default OnboardingWrapper;
