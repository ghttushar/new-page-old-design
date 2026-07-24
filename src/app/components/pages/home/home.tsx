import accessControlUtils from '@/utils/access-control/access-control.utils';
import navigationUtils from '@/utils/navigation/navigation.utils';
import { Navigate } from 'react-router-dom';
import { FeatureRoutesMap } from 'src/constants/navigation/navigation.constants';
import {
  ADVERTISING_ACCOUNT_URL,
  MARKET_INTELLIGENCE_URL,
} from 'src/constants/urls.constants';
import { FeaturesEnum } from 'src/enums/auth.enums';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';

export function Home() {
  const accountDetails = localStorageUtils.getAccountDetails();
  const selectedUserAccountMapping =
    localStorageUtils.getSelectedUserAccountMapping();
  if (
    navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.ADVERTISING
    )
  ) {
    return <Navigate to={ADVERTISING_ACCOUNT_URL} />;
  } else if (
    navigationUtils.canAccessFeature(
      accountDetails,
      selectedUserAccountMapping,
      FeaturesEnum.MARKET_INTELLIGENCE
    )
  ) {
    return <Navigate to={MARKET_INTELLIGENCE_URL} />;
  }

  const feature = accessControlUtils.hasAccessToAnyMainFeatures(
    accountDetails,
    selectedUserAccountMapping
  );

  if (feature) {
    const featureRoute = FeatureRoutesMap[feature];
    return <Navigate to={featureRoute} />;
  } else {
    return <Navigate to="/page-not-found" />;
  }
}

export default Home;
