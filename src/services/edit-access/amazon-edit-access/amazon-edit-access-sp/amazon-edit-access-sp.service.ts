import {
  IEditAccessAdGroupUpdateBody,
  IEditAccessAdProductUpdateBody,
  IEditAccessAutomationRulesUpdateBody,
  IEditAccessCampaignUpdateBody,
  IEditAccessCreateAdProductBody,
  IEditAccessCreateKeywordTargetingBody,
  IEditAccessCreateNegKeywordTargetingBody,
  IEditAccessCreateNegProductTargetingBody,
  IEditAccessCreateProductTargetingBody,
  IEditAccessKeywordTargetingUpdateBody,
  IEditAccessNegKeywordTargetingUpdateBody,
  IEditAccessNegProductTargetingUpdateBody,
  IEditAccessProductTargetingUpdateBody,
} from '@/interfaces/edit-access/edit-access.interface';
import { AMAZON_SP_EDIT_BASE_URL } from 'src/constants';
import {
  IAPIResponse,
  IErrorResultDetails,
} from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const EditAccessSPServices = {
  updateSPCampaign: (body: IEditAccessCampaignUpdateBody) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SP_EDIT_BASE_URL}/campaign`,
      body
    );
  },

  updateSPAdGroup: async (body: IEditAccessAdGroupUpdateBody) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SP_EDIT_BASE_URL}/adgroup`,
      body
    );
    return response;
  },

  updateSPAdProduct: (body: IEditAccessAdProductUpdateBody) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SP_EDIT_BASE_URL}/product/ad`,
      body
    );
  },

  updateSPKeywordTargeting: async (
    body: IEditAccessKeywordTargetingUpdateBody
  ) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SP_EDIT_BASE_URL}/keyword`,
      body
    );
    return response;
  },

  updateSPProductTargeting: async (
    body: IEditAccessProductTargetingUpdateBody
  ) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SP_EDIT_BASE_URL}/product`,
      body
    );
  },

  updateSPAutomationRules: async (
    body: IEditAccessAutomationRulesUpdateBody
  ) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SP_EDIT_BASE_URL}/campaign-rules`,
      body
    );
    return response;
  },

  createSPAdProduct: (body: IEditAccessCreateAdProductBody) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SP_EDIT_BASE_URL}/product/ad`,
      body
    );
  },

  createSPKeywordTargeting: (body: IEditAccessCreateKeywordTargetingBody) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SP_EDIT_BASE_URL}/keyword`,
      body
    );
  },

  createSPProductTargeting: (body: IEditAccessCreateProductTargetingBody) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SP_EDIT_BASE_URL}/product/targeting`,
      body
    );
  },

  updateSPNegProductTargeting: (
    body: IEditAccessNegProductTargetingUpdateBody
  ) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SP_EDIT_BASE_URL}/negative-product`,
      body
    );
  },

  createSPNegProductTargeting: (
    body: IEditAccessCreateNegProductTargetingBody
  ) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SP_EDIT_BASE_URL}/negative-product`,
      body
    );
  },

  updateSPNegKeywordTargeting: (
    body: IEditAccessNegKeywordTargetingUpdateBody
  ) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SP_EDIT_BASE_URL}/negative-keyword`,
      body
    );
  },

  createSPNegKeywordTargeting: (
    body: IEditAccessCreateNegKeywordTargetingBody
  ) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SP_EDIT_BASE_URL}/negative-keyword`,
      body
    );
  },
};
