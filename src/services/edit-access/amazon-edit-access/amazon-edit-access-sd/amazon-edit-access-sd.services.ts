import {
  IEditAccessAdProductUpdateBody,
  IEditAccessAutomationRulesUpdateBody,
  IEditAccessCampaignUpdateBody,
  IEditAccessCreateAdProductBody,
  IEditAccessSDAdGroupUpdateBody,
} from '@/interfaces/edit-access/edit-access.interface';
import { AMAZON_SD_EDIT_BASE_URL } from 'src/constants';
import {
  IAPIResponse,
  IErrorResultDetails,
} from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const EditAccessSDServices = {
  updateSDCampaign: (body: IEditAccessCampaignUpdateBody) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SD_EDIT_BASE_URL}/campaign`,
      body
    );
  },

  updateSDProductAd: (body: IEditAccessAdProductUpdateBody) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SD_EDIT_BASE_URL}/product/ad`,
      body
    );
  },

  createSDAdProduct: (body: IEditAccessCreateAdProductBody) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SD_EDIT_BASE_URL}/product/ad`,
      body
    );
  },

  updateSDAdGroup: async (body: IEditAccessSDAdGroupUpdateBody) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SD_EDIT_BASE_URL}/adgroup`,
      body
    );
    return response;
  },

  updateSDAutomationRules: async (
    body: IEditAccessAutomationRulesUpdateBody
  ) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SD_EDIT_BASE_URL}/campaign-rules`,
      body
    );
    return response;
  },
};
