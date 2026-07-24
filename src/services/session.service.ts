import { AUTH_BASE_URL } from 'src/constants';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const SessionServices = {
  switchAccount: (accountId: string) => {
    return axiosInstance.post<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/sessions/switch-account`,
      {
        accountId,
      }
    );
  },
  leaveAccount: () => {
    return axiosInstance.post<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/sessions/leave-account`
    );
  },
  logout: () => {
    return axiosInstance.post<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/sessions/logout`
    );
  },
};

export default SessionServices;
