import { IWalmartOnboardingResponse } from '@/interfaces/advertising/walmart/walmart-advertising.interface';
import {
  OLD_WALMART_ADVERTISING_BASE_URL,
  WALMART_CONNECT_BASE_URL,
} from 'src/constants';
import { IIsAdvertisingConnected } from 'src/interfaces/onboarding.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const walmartMarketplaceOnboardingService = {
  createAccount: (code: string, partnerId: string) => {
    return axiosInstance.post<IAPIResponse<IIsAdvertisingConnected>>(
      `${OLD_WALMART_ADVERTISING_BASE_URL}/marketplace/account`,
      {
        code,
        partnerId,
      }
    );
  },

  createAdvertiserAttributesReportSnapShot: (
    advertiserId: string,
    reportType: string
  ) => {
    return axiosInstance.post<IAPIResponse<null>>(
      `${WALMART_CONNECT_BASE_URL}/advertiser-attributes/create/report/snapshot`,
      {
        advertiserId,
        reportType,
      }
    );
  },

  getAdvertiserAttributesReportSnapShot: async (
    advertiserId: string
  ): Promise<IWalmartOnboardingResponse> => {
    const data = await axiosInstance.get<
      IAPIResponse<IWalmartOnboardingResponse>
    >(
      `${WALMART_CONNECT_BASE_URL}/advertiser-attributes/report/snapshot?advertiserId=${advertiserId}`
    );
    return data.data.data;
  },
};

export default walmartMarketplaceOnboardingService;
