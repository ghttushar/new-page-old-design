import { AUTH_BASE_URL } from 'src/constants';
import { IAmazonAccount } from 'src/interfaces/advertising/amazon/amazon-advertising.interfaces';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const amazonAccountService = {
  getAmazonAccounts: () => {
    return axiosInstance.get<IAPIResponse<IAmazonAccount[]>>(
      `${AUTH_BASE_URL}/api/auth/account/amazon`
    );
  },
};

export default amazonAccountService;
