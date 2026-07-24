import { MARKET_INTELLIGENCE_BASE_URL } from 'src/constants';
import { IDeleteKeyword } from 'src/interfaces/keyword-tracker.interfaces';
import { IKeywordBody, ISerpKeyword } from 'src/interfaces/serp.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const KeywordTrackerService = {
  addKeyword: (body: IKeywordBody) => {
    return axiosInstance.post<IAPIResponse<ISerpKeyword>>(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/serp/keywords`,
      body
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
  updateKeyword: (payload: ISerpKeyword) => {
    return axiosInstance.put<IAPIResponse<ISerpKeyword>>(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/serp/keywords/${payload._id}`,
      payload
    );
  },
  deleteKeyword: (id: string, payload: IDeleteKeyword) => {
    return axiosInstance.post<IAPIResponse<ISerpKeyword>>(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/serp/keywords/delete/${id}`,
      payload
    );
  },
};

export default KeywordTrackerService;
