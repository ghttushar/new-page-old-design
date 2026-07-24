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
  IEditAccessNegKeywordTargetingUpdateBody,
  IEditAccessNegProductTargetingUpdateBody,
  IEditAccessSBKeywordTargetingUpdateBody,
  IEditAccessSBProductTargetingUpdateBody,
} from '@/interfaces/edit-access/edit-access.interface';
import { AMAZON_SB_EDIT_BASE_URL } from 'src/constants';
import {
  IAPIResponse,
  IErrorResultDetails,
} from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const EditAccessSBServices = {
  updateSBCampaign: (body: IEditAccessCampaignUpdateBody) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SB_EDIT_BASE_URL}/campaign`,
      body
    );
  },

  updateSBAdGroup: (body: IEditAccessAdGroupUpdateBody) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SB_EDIT_BASE_URL}/adgroup`,
      body
    );
  },

  updateSBProductAd: (body: IEditAccessAdProductUpdateBody) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SB_EDIT_BASE_URL}/product/ad`,
      body
    );
  },

  updateSBKeywordTargeting: (body: IEditAccessSBKeywordTargetingUpdateBody) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SB_EDIT_BASE_URL}/keyword`,
      { keywordTargets: body.keywords }
    );
  },

  updateSBProductTargeting: (body: IEditAccessSBProductTargetingUpdateBody) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SB_EDIT_BASE_URL}/product/targeting`,
      body
    );
  },

  updateSBNegProductTargeting: (
    body: IEditAccessNegProductTargetingUpdateBody
  ) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SB_EDIT_BASE_URL}/negative-product`,
      body
    );
  },

  updateSBNegKeywordTargeting: (
    body: IEditAccessNegKeywordTargetingUpdateBody
  ) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SB_EDIT_BASE_URL}/negative-keyword`,
      body
    );
  },

  updateSBAutomationRules: async (
    body: IEditAccessAutomationRulesUpdateBody
  ) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SB_EDIT_BASE_URL}/campaign-rules`,
      body
    );
    return response;
  },

  createSBAdProduct: (body: IEditAccessCreateAdProductBody) => {
    return axiosInstance.post<IAPIResponse<unknown>>(
      `${AMAZON_SB_EDIT_BASE_URL}/product/ad`,
      body
    );
  },

  createSBKeywordTargeting: (body: IEditAccessCreateKeywordTargetingBody) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SB_EDIT_BASE_URL}/keyword`,
      body
    );
  },

  createSBProductTargeting: (body: IEditAccessCreateProductTargetingBody) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SB_EDIT_BASE_URL}/product/targeting`,
      body
    );
  },

  createSBNegProductTargeting: (
    body: IEditAccessCreateNegProductTargetingBody
  ) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SB_EDIT_BASE_URL}/negative-product`,
      body
    );
  },

  createSBNegKeywordTargeting: (
    body: IEditAccessCreateNegKeywordTargetingBody
  ) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${AMAZON_SB_EDIT_BASE_URL}/negative-keyword`,
      body
    );
  },
};
