import { ADVERTISING_BASE_URL_V2 } from '@/constants';
import { IAPIResponse } from '@/interfaces/service.interface';
import { axiosInstance } from '@/redux/store';

export const dummyTestingServices = {
  getDummyToast: (statusCode: number) => {
    return axiosInstance.get<IAPIResponse<null>>(
      `${ADVERTISING_BASE_URL_V2}/dummy/toast/${statusCode}`
    );
  },
};
