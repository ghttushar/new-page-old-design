import { BIDDER_BASE_URL } from 'src/constants';
import { AMAZON_ADVERTISING_PROFILE_ID_HEADER_KEY } from 'src/constants/auth.constants';
import {
  ICreateBidderJob,
  ICreateBidderJobBody,
} from 'src/interfaces/edit-access/bidder.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import {
  ISettingsAccountUpdateBody,
  ISettingsAccountUpdateResponse,
} from 'src/interfaces/settings.interface';
import { axiosInstance } from 'src/redux/store';

const amazonBidderService = {
  getAmazonBidderJobById: (jobId: string, amazonProfileId: string) => {
    return axiosInstance.get<IAPIResponse<ISettingsAccountUpdateResponse>>(
      `${BIDDER_BASE_URL}/amazon/job/${jobId}`,
      {
        headers: {
          [AMAZON_ADVERTISING_PROFILE_ID_HEADER_KEY]: amazonProfileId,
        },
      }
    );
  },

  createAmazonBidderJob: (
    body: ICreateBidderJobBody,
    amazonProfileId: string
  ) => {
    return axiosInstance.post<IAPIResponse<ICreateBidderJob>>(
      `${BIDDER_BASE_URL}/amazon/job`,
      body,
      {
        headers: {
          [AMAZON_ADVERTISING_PROFILE_ID_HEADER_KEY]: amazonProfileId,
        },
      }
    );
  },

  updateAmazonBidderJobStatus: (
    body: ISettingsAccountUpdateBody,
    jobId: string,
    amazonProfileId: string
  ) => {
    return axiosInstance.put<IAPIResponse<ISettingsAccountUpdateResponse>>(
      `${BIDDER_BASE_URL}/amazon/job/${jobId}`,
      body,
      {
        headers: {
          [AMAZON_ADVERTISING_PROFILE_ID_HEADER_KEY]: amazonProfileId,
        },
      }
    );
  },
};

export default amazonBidderService;