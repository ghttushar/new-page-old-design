import { MARKET_INTELLIGENCE_BASE_URL } from 'src/constants';
import { IBrandAnalyticsData } from 'src/interfaces/brand-analytics.interfaces';
import {
  IBrandAnalyticsFilter,
  IBrandMetrics,
  ISovFilter,
} from 'src/interfaces/serp.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const brandAnalyticsService = {
  getBrandAnalytics: (filters: IBrandAnalyticsFilter, marketplace: string) => {
    const params = {
      startDate: filters.range?.startDate,
      endDate: filters.range?.endDate,
      keyword: filters.keyword,
      position: filters.position,
      frequency: filters.frequency,
      marketplace: marketplace,
      range: filters.dateRange,
      countryCode: filters.countryCode,
    };
    return axiosInstance.get<IAPIResponse<IBrandAnalyticsData>>(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/serp/analytics/${filters.brandName}`,
      {
        params,
      }
    );
  },

  getBrandMetrics: async (
    filters: ISovFilter,
    brandName: string,
    marketplace: string
  ): Promise<IBrandMetrics> => {
    const params = {
      startDate: filters.range?.startDate,
      endDate: filters.range?.endDate,
      keyword: filters.keyword,
      position: filters.position,
      frequency: filters.frequency,
      range: filters.dateRange,
      brandName: brandName,
      marketplace: marketplace,
      countryCode: filters.countryCode,
    };
    const data = await axiosInstance.get<IAPIResponse<IBrandMetrics>>(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/serp/brand/metrics`,
      {
        params,
      }
    );

    return data.data.data;
  },
};

export default brandAnalyticsService;
