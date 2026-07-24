import { MarketplaceEnum } from '@/enums/serp.enums';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from 'src/app/components/private-route/private-route';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingHeaderFilters } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import { getMarketplaceUrl } from 'src/utils/advertising.utils';
import AdvertisingRedirectionWrapper from '../advertising-redirection-wrapper';
import AdvertisingWalmartOverallRoutes from '../advertising-walmart/overall/wmt-overall-routes';
import AdvertisingWalmartSBRoutes from '../advertising-walmart/sb/wmt-sb-routes';
import AdvertisingWalmartSPRoutes from '../advertising-walmart/sp/wmt-sp-routes';
import AdvertisingWalmartSVRoutes from '../advertising-walmart/sv/wmt-sv-routes';

export default function AdvertisingWalmartWrapper() {
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (advertisingAccount.marketplace !== MarketplaceEnum.WALMART) {
      const url = getMarketplaceUrl(
        advertisingAccount.marketplace as string,
        advHeaderFilters.adType.value
      );
      setUrl(url);
    } else {
      setUrl('');
    }
  }, [advHeaderFilters.adType.value, advertisingAccount.marketplace, url]);

  if (url === '') {
    return (
      <Routes>
        <Route
          path="/all/*"
          element={
            <PrivateRoute component={<AdvertisingWalmartOverallRoutes />} />
          }
        />
        <Route
          path="/sp/*"
          element={<PrivateRoute component={<AdvertisingWalmartSPRoutes />} />}
        />
        <Route
          path="/sb/*"
          element={<PrivateRoute component={<AdvertisingWalmartSBRoutes />} />}
        />
        <Route
          path="/sv/*"
          element={<PrivateRoute component={<AdvertisingWalmartSVRoutes />} />}
        />
        <Route path="/*" element={<AdvertisingRedirectionWrapper />} />
      </Routes>
    );
  } else if (url) {
    return <Navigate to={url} replace />;
  } else {
    return <p>{/* Redirecting... */}</p>;
  }
}
