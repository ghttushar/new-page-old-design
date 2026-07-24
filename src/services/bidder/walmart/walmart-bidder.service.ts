import { BIDDER_BASE_URL } from 'src/constants';
import {
  ICreateBidderJob,
  ICreateBidderJobBody,
} from 'src/interfaces/edit-access/bidder.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import {
  ISettingsAccountUpdateResponse,
  IWalmartSettingsAccountUpdateBody,
} from 'src/interfaces/settings.interface';
import { axiosInstance } from 'src/redux/store';

const walmartBidderService = {
  getWalmartBidderJobById: (jobId: string, walmartAdvertiserId: string) => {
    return axiosInstance.get<IAPIResponse<ISettingsAccountUpdateResponse>>(
      `${BIDDER_BASE_URL}/walmart/job/${jobId}`,
      {
        headers: {
          walmartAdvertiserId: walmartAdvertiserId,
        },
      }
    );
  },

  createWalmartBidderJob: (
    body: ICreateBidderJobBody,
    walmartAdvertiserId: string
  ) => {
    return axiosInstance.post<IAPIResponse<ICreateBidderJob>>(
      `${BIDDER_BASE_URL}/walmart/job`,
      body,
      {
        headers: {
          walmartAdvertiserId: walmartAdvertiserId,
        },
      }
    );
  },

  updateWalmartBidderJobStatus: (
    body: IWalmartSettingsAccountUpdateBody,
    jobId: string
  ) => {
    return axiosInstance.put<IAPIResponse<ISettingsAccountUpdateResponse>>(
      `${BIDDER_BASE_URL}/walmart/job/${jobId}`,
      body,
      {
        headers: {
          walmartAdvertiserId: body.walmartAdvertiserId,
        },
      }
    );
  },
};

export default walmartBidderService;
