import { OLD_WALMART_ADVERTISING_BASE_URL } from '@/constants';
import { IIsAdvertisingConnected } from '@/interfaces/onboarding.interface';
import { IAPIResponse } from '@/interfaces/service.interface';
import { axiosInstance } from '@/redux/store';

export const walmartSupplierOnboardingService = {
  createAccount: (code: string, partnerId: string, advertiserId: string) => {
    return axiosInstance.post<IAPIResponse<IIsAdvertisingConnected>>(
      `${OLD_WALMART_ADVERTISING_BASE_URL}/supplier/account`,
      {
        code,
        partnerId,
        advertiserId,
      }
    );
  },
};
