import {
  IEditAccessAutomationRulesUpdateBody,
  IEditAccessCreateWalmartAdItem,
  IEditAccessWalmartAdGroup,
  IEditAccessWalmartAdItem,
  IEditAccessWalmartBrandProfile,
  IEditAccessWalmartCampaign,
  IEditAccessWalmartCreateKeywordTargeting,
  IEditAccessWalmartKeywordTargetingUpdateBody,
} from '@/interfaces/edit-access/edit-access.interface';
import { WALMART_SB_EDIT_BASE_URL } from 'src/constants';
import {
  IAPIResponse,
  IErrorResultDetails,
} from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const walmartEditAccessSBServices = {
  updateWalmartSBCampaign: (body: IEditAccessWalmartCampaign[]) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SB_EDIT_BASE_URL}/campaign`,
      {
        payload: body,
      }
    );
  },

  updateWalmartSBAdItem: (body: IEditAccessWalmartAdItem[]) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SB_EDIT_BASE_URL}/ad-item`,
      {
        payload: body,
      }
    );
  },

  updateWalmartSBKeywordTargeting: async (
    body: IEditAccessWalmartKeywordTargetingUpdateBody
  ) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SB_EDIT_BASE_URL}/keyword`,
      body
    );
    return response;
  },

  // TODO: Enable these conditions when we have edit-access for page type and platform
  // updateWalmartSBPlatform: (body: IEditAccessWalmartPlatformType[]) => {
  //   return axiosInstance.put<
  //     IAPIResponse<IEditAccessWalmartPlatformTypeUpdateResponse>
  //   >(
  //     `${WALMART_ADVERTISING_BASE_URL}/sp/edit/multiplier/platform`,
  //     body
  //   );
  // },

  // updateWalmartSBPageType: (body: IEditAccessWalmartPageType[]) => {
  //   return axiosInstance.put<
  //     IAPIResponse<IEditAccessWalmartPageTypeUpdateResponse>
  //   >(
  //     `${WALMART_ADVERTISING_BASE_URL}/sp/edit/multiplier/page-type`,
  //     body
  //   );
  // },

  updateWalmartSBBrandProfile: (body: IEditAccessWalmartBrandProfile) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SB_EDIT_BASE_URL}/brand-profile`,
      {
        payload: body,
      }
    );
  },

  createWalmartSBAdItems: (body: IEditAccessCreateWalmartAdItem[]) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SB_EDIT_BASE_URL}/ad-item`,
      {
        payload: body,
      }
    );
  },

  createWalmartSBKeywordTargeting: (
    body: IEditAccessWalmartCreateKeywordTargeting[]
  ) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SB_EDIT_BASE_URL}/keyword`,
      {
        payload: body,
      }
    );
  },

  updateWalmartSBAdGroup: async (body: IEditAccessWalmartAdGroup[]) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SB_EDIT_BASE_URL}/ad-group`,
      {
        adGroups: body,
      }
    );
    return response;
  },

  updateWalmartSBAutomationRules: async (
    body: IEditAccessAutomationRulesUpdateBody
  ) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SB_EDIT_BASE_URL}/campaign-rules`,
      body
    );
    return response;
  },
};
