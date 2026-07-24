import { MarketplaceEnum } from '@/enums/serp.enums';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from 'src/app/components/private-route/private-route';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingHeaderFilters } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import { getMarketplaceUrl } from 'src/utils/advertising.utils';
import AdvertisingOverallRoutes from '../advertising-amazon/overall/amz-overall-routes';
import AdvertisingSBRoutes from '../advertising-amazon/sb/amz-sb-routes';
import AdvertisingSDRoutes from '../advertising-amazon/sd/amz-sd-routes';
import AdvertisingSPRoutes from '../advertising-amazon/sp/amz-sp-routes';
import AdvertisingRedirectionWrapper from '../advertising-redirection-wrapper';

export default function AdvertisingAmazonWrapper() {
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (advertisingAccount.marketplace !== MarketplaceEnum.AMAZON) {
      const _url = getMarketplaceUrl(
        advertisingAccount.marketplace as string,
        advHeaderFilters.adType.value
      );
      setUrl(_url);
    } else {
      setUrl('');
    }
  }, [advHeaderFilters.adType.value, advertisingAccount.marketplace]);

  if (url === '') {
    return (
      <Routes>
        <Route
          path="/all/*"
          element={<PrivateRoute component={<AdvertisingOverallRoutes />} />}
        />
        <Route
          path="/sp/*"
          element={<PrivateRoute component={<AdvertisingSPRoutes />} />}
        />
        <Route
          path="/sb/*"
          element={<PrivateRoute component={<AdvertisingSBRoutes />} />}
        />
        <Route
          path="/sd/*"
          element={<PrivateRoute component={<AdvertisingSDRoutes />} />}
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
