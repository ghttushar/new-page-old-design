import { IAmazonSPAccount } from '@/interfaces/advertising/amazon/amazon-advertising.interfaces';
import {
  AMAZON_ONBOARDING_BASE_URL,
  AMAZON_SP_ONBOARDING_BASE_URL,
} from 'src/constants';
import {
  IAdvertisingProfiles,
  IAmazonSPOnboardingTaskPayload,
  IIsAdvertisingConnected,
} from 'src/interfaces/onboarding.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const onboardingService = {
  createOnboardingTask: (payload: IAmazonSPOnboardingTaskPayload) => {
    return axiosInstance.post<IAPIResponse<any>>(
      `${AMAZON_SP_ONBOARDING_BASE_URL}/create-onboarding-task`,
      payload
    );
  },
  getGrantURL: () => {
    return axiosInstance.get<IAPIResponse<string>>(
      `${AMAZON_ONBOARDING_BASE_URL}/grant-url`
    );
  },
  getProfiles: (code: string, region: string) => {
    return axiosInstance.get<IAPIResponse<IAdvertisingProfiles[]>>(
      `${AMAZON_ONBOARDING_BASE_URL}/profiles?code=${code}&region=${region}`
    );
  },

  sendSelectedProfiles: (profiles?: IAdvertisingProfiles[]) => {
    return axiosInstance.post<IAPIResponse<string>>(
      `${AMAZON_ONBOARDING_BASE_URL}/selected-profiles`,
      {
        profiles,
      }
    );
  },
  getSPCredentials: (
    code: string,
    partnerId: string,
    accountType: string,
    region: string,
    state: string
  ) => {
    return axiosInstance.post<IAPIResponse<IAdvertisingProfiles[]>>(
      `${AMAZON_SP_ONBOARDING_BASE_URL}/sp-credentials`,
      {
        code,
        partnerId,
        accountType,
        region,
        state,
      }
    );
  },

  convertAmazonToSPAccounts: () => {
    return axiosInstance.get<IAPIResponse<IAmazonSPAccount[]>>(
      `${AMAZON_SP_ONBOARDING_BASE_URL}/convertToSp`
    );
  },

  isAmazonAdvertisingConnected: () => {
    return axiosInstance.get<IAPIResponse<IIsAdvertisingConnected>>(
      `${AMAZON_ONBOARDING_BASE_URL}/connection/status`
    );
  },
};

export default onboardingService;
