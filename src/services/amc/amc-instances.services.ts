import { AMAZON_AMC_URL } from 'src/constants';
import {
  IAMCCreateInstanceRequestResponse,
  IAMCGetInstanceRequestResponse,
  IAMCInstance,
} from 'src/interfaces/amc.interfaces';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const amcInstanceService = {
  createRequest: () => {
    return axiosInstance.post<IAPIResponse<IAMCCreateInstanceRequestResponse>>(
      `${AMAZON_AMC_URL}/instances/request`,
      {}
    );
  },
  getRequest: () => {
    return axiosInstance.get<
      IAPIResponse<IAMCGetInstanceRequestResponse | null>
    >(`${AMAZON_AMC_URL}/instances/request`);
  },
  getAllInstances: () => {
    return axiosInstance.get<IAPIResponse<IAMCInstance[]>>(
      `${AMAZON_AMC_URL}/instances`
    );
  },
};
