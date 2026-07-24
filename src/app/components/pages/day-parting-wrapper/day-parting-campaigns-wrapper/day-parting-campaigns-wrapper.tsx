import { AD_TYPE_MAPPING } from '@/constants/advertising-filter.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppSelector } from '@/redux/hooks';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { getAdTypeUrl } from '@/utils/day-parting.utils';
import { Navigate, Route, Routes } from 'react-router-dom';
import DayPartingCampaignsPage from '../day-parting-campaigns-page/day-parting-campaigns-page';
import DayPartingWmtCampaignsPage from '../day-parting-campaigns-page/day-parting-campaigns-wmt-page';

export default function DayPartingCampaignsWrapper(props: {
  marketplace: MarketplaceEnum;
}) {
  const selectedAdTypeFilter = useAppSelector(selectAdvertisingHeaderFilters);

  return (
    <div>
      <Routes>
        <Route path="/amazon/:adType" element={<DayPartingCampaignsPage />} />
        <Route
          path="/walmart/:adType"
          element={<DayPartingWmtCampaignsPage />}
        />
        <Route
          path="*"
          element={
            <Navigate
              to={getAdTypeUrl(
                props.marketplace,
                AD_TYPE_MAPPING[
                  selectedAdTypeFilter.adType.value
                ]?.toLowerCase()
              )}
            />
          }
        />
      </Routes>
    </div>
  );
}
