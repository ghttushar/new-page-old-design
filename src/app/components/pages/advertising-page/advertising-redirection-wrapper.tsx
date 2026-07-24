import { MarketplaceEnum } from '@/enums/serp.enums';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingHeaderFilters } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import { getMarketplaceUrl } from 'src/utils/advertising.utils';

const AdvertisingRedirectionWrapper = () => {
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const navigate = useNavigate();
  useEffect(() => {
    const url = getMarketplaceUrl(
      advertisingAccount.marketplace as MarketplaceEnum,
      advHeaderFilters.adType.value
    );
    navigate(url);
  }, [advHeaderFilters.adType.value, advertisingAccount.marketplace, navigate]);

  return <p>{/* Redirecting... */}</p>;
};

export default AdvertisingRedirectionWrapper;
