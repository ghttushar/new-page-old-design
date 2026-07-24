import { AD_TYPE_MAPPING } from '@/constants/advertising-filter.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppDispatch } from '@/redux/hooks';
import { setAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { getSelectedAdTypeByMarketplace } from '@/utils/advertising.utils';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdType = (
  adType: string | undefined,
  redirectUrl: string,
  marketplace: MarketplaceEnum
) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      adType === undefined ||
      AD_TYPE_MAPPING[adType?.toUpperCase() ?? ''] === undefined
    ) {
      navigate(redirectUrl);
      return;
    } else
      dispatch(
        setAdvertisingHeaderFilters({
          adType: getSelectedAdTypeByMarketplace(adType, marketplace),
        })
      );
  }, [adType, dispatch, marketplace, navigate, redirectUrl]);
};
