import { MARKET_INTELLIGENCE_BASE_URL } from 'src/constants';
import {
  IKeywordSOVData,
  IKeywordSOVFilterBody,
} from 'src/interfaces/keyword-sov.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const KeywordSovService = {
  getKeywordSOVData: (body: IKeywordSOVFilterBody) => {
    return axiosInstance.post<IAPIResponse<IKeywordSOVData | null>>(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/serp/keyword-sov`,
      body
    );
  },
};

export default KeywordSovService;
