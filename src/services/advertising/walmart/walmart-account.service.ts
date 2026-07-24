import {
  IWalmartAccount,
  IWalmartCreateAccount,
} from '@/interfaces/advertising/walmart/walmart-advertising.interface';
import { WALMART_AUTH_BASE_URL } from 'src/constants';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const walmartAccountService = {
  createWalmartAccount: (payload: IWalmartCreateAccount | null) => {
    return axiosInstance.post<IAPIResponse<IWalmartCreateAccount>>(
      `${WALMART_AUTH_BASE_URL}`,
      payload
    );
  },
  getWalmartAccounts: () => {
    return axiosInstance.get<IAPIResponse<IWalmartAccount[]>>(
      `${WALMART_AUTH_BASE_URL}`
    );
  },
  getWalmartAdsAccountByAdvertiserId: (walmartAdvertiserId: string) => {
    return axiosInstance.get<IAPIResponse<string>>(
      `${WALMART_AUTH_BASE_URL}/check-account/${walmartAdvertiserId}`
    );
  },
};

export default walmartAccountService;
