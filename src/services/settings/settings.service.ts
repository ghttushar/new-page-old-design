import { AUTH_BASE_URL } from 'src/constants';
import { IAPIResponse } from 'src/interfaces/service.interface';
import {
  IDSPAdvertiserAccount,
  ISettingsAccount,
} from 'src/interfaces/settings.interface';
import { axiosInstance } from 'src/redux/store';

export const settingsServices = {
  getSettingsAccount: (marketplace: string) => {
    return axiosInstance.get<IAPIResponse<Array<ISettingsAccount>>>(
      `${AUTH_BASE_URL}/api/auth/settings/account?marketplace=${marketplace}`
    );
  },
  getDSPAccount: () => {
    return axiosInstance.get<IAPIResponse<Array<IDSPAdvertiserAccount>>>(
      `${AUTH_BASE_URL}/api/auth/account/amazon/dsp/account`
    );
  },
};
