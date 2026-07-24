import {
  IEditAccessAutomationRulesUpdateBody,
  IEditAccessCreateWalmartAdItem,
  IEditAccessWalmartAdGroup,
  IEditAccessWalmartAdItemUpdateBody,
  IEditAccessWalmartCampaign,
  IEditAccessWalmartCreateKeywordTargeting,
  IEditAccessWalmartKeywordTargetingUpdateBody,
  IEditAccessWalmartPageType,
  IEditAccessWalmartPlatform,
} from '@/interfaces/edit-access/edit-access.interface';
import { WALMART_SP_EDIT_BASE_URL } from 'src/constants';
import {
  IAPIResponse,
  IErrorResultDetails,
} from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const walmartEditAccessSPServices = {
  updateWalmartSPCampaign: (body: IEditAccessWalmartCampaign[]) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SP_EDIT_BASE_URL}/campaign`,
      {
        payload: body,
      }
    );
  },

  updateWalmartSPAdItem: async (body: IEditAccessWalmartAdItemUpdateBody) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SP_EDIT_BASE_URL}/ad-item`,
      body
    );
    return response;
  },

  updateWalmartSPKeywordTargeting: (
    body: IEditAccessWalmartKeywordTargetingUpdateBody
  ) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SP_EDIT_BASE_URL}/keyword`,
      body
    );
  },

  updateWalmartSPPlatform: (body: IEditAccessWalmartPlatform[]) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SP_EDIT_BASE_URL}/multiplier/platform`,
      {
        payload: body,
      }
    );
  },

  updateWalmartSPPageType: (body: IEditAccessWalmartPageType[]) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SP_EDIT_BASE_URL}/multiplier/page-type`,
      {
        payload: body,
      }
    );
  },

  updateWalmartSPAutomationRules: async (
    body: IEditAccessAutomationRulesUpdateBody
  ) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SP_EDIT_BASE_URL}/campaign-rules`,
      body
    );
    return response;
  },

  createWalmartSPAdItems: (body: IEditAccessCreateWalmartAdItem[]) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SP_EDIT_BASE_URL}/ad-item`,
      {
        payload: body,
      }
    );
  },

  createWalmartSPKeywordTargeting: (
    body: IEditAccessWalmartCreateKeywordTargeting[]
  ) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SP_EDIT_BASE_URL}/keyword`,
      {
        payload: body,
      }
    );
  },

  updateWalmartSPAdGroup: async (body: IEditAccessWalmartAdGroup[]) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SP_EDIT_BASE_URL}/ad-group`,
      { payload: body }
    );
    return response;
  },
};
