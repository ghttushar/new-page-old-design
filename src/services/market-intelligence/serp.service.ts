import { MARKET_INTELLIGENCE_BASE_URL } from 'src/constants';
import {
  IGetSOV,
  ISerpKeyword,
  ISovFilter,
} from 'src/interfaces/serp.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const SerpService = {
  addKeyword: (payload: ISerpKeyword) => {
    return axiosInstance.post<IAPIResponse<ISerpKeyword>>(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/serp/keywords`,
      payload
    );
  },
  bulkUploadKeyword: (file: File) => {
    const data = new FormData();
    data.append('file', file);
    return axiosInstance.post(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/serp/keywords/bulk-upload`,
      data
    );
  },

  getSOV: (filters: ISovFilter, marketplace: string) => {
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
    return axiosInstance.get<IAPIResponse<IGetSOV>>(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/serp/sov`,
      {
        params,
      }
    );
  },

  getKeywords: (
    marketplace: string,
    includeInactive = false,
    countryCode?: string
  ) => {
    const params = {
      marketplace: marketplace,
      includeInactive,
      countryCode,
    };
    return axiosInstance.get<IAPIResponse<ISerpKeyword[]>>(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/serp/keywords`,
      {
        params,
      }
    );
  },
  updateKeyword: (payload: ISerpKeyword) => {
    return axiosInstance.put<IAPIResponse<ISerpKeyword>>(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/serp/keywords/${payload.keyword}`,
      payload
    );
  },
};

export default SerpService;
