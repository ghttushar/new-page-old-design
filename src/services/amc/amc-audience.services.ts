import { AMAZON_AMC_URL } from 'src/constants';
import {
  IAMCCreateAudience,
  IAMCCreateAudienceBody,
  IAMCCustomQueryData,
  IAMCQueryData,
  IAccountQueryMapping,
} from 'src/interfaces/amc.interfaces';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const AMCAudienceServices = {
  getDefaultAudience: (instanceId: string) => {
    return axiosInstance.get<IAPIResponse<IAccountQueryMapping[]>>(
      `${AMAZON_AMC_URL}/audience/${instanceId}/default`
    );
  },
  getCustomAudience: (instanceId: string) => {
    return axiosInstance.get<IAPIResponse<IAMCCustomQueryData>>(
      `${AMAZON_AMC_URL}/audience/${instanceId}/custom`
    );
  },
  getQueryByQueryId: (queryId: string) => {
    return axiosInstance.get<IAPIResponse<IAMCQueryData>>(
      `${AMAZON_AMC_URL}/query/query/${queryId}`
    );
  },
  createAudience: (body: IAMCCreateAudienceBody) => {
    return axiosInstance.post<IAPIResponse<IAMCCreateAudience>>(
      `${AMAZON_AMC_URL}/audience/create`,
      body
    );
  },
};
