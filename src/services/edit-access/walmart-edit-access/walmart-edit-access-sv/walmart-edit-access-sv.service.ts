import { WALMART_SV_EDIT_BASE_URL } from '@/constants';
import {
  IEditAccessAutomationRulesUpdateBody,
  IEditAccessCreateWalmartAdItem,
  IEditAccessWalmartAdGroup,
  IEditAccessWalmartAdItem,
  IEditAccessWalmartCampaign,
  IEditAccessWalmartCreateKeywordTargeting,
  IEditAccessWalmartKeywordTargetingUpdateBody,
} from '@/interfaces/edit-access/edit-access.interface';
import {
  IAPIResponse,
  IErrorResultDetails,
} from '@/interfaces/service.interface';
import { axiosInstance } from '@/redux/store';

export const walmartEditAccessSVServices = {
  updateWalmartSVCampaign: (body: IEditAccessWalmartCampaign[]) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SV_EDIT_BASE_URL}/campaign`,
      {
        payload: body,
      }
    );
  },

  updateWalmartSVAdItem: (body: IEditAccessWalmartAdItem[]) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SV_EDIT_BASE_URL}/ad-item`,
      {
        adItems: body,
      }
    );
  },

  updateWalmartSVKeywordTargeting: async (
    body: IEditAccessWalmartKeywordTargetingUpdateBody
  ) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SV_EDIT_BASE_URL}/keyword`,
      body
    );
    return response;
  },

  // TODO: will have to create interfaces when these functionalities are in place.
  //   createWalmartSVCampaign: (body: IEditAccessWalmartCampaign[]) => {
  //     return axiosInstance.post<
  //       IAPIResponse<IEditAccessWalmartCampaignUpdateResponse>
  //     >(`${WALMART_SV_EDIT_BASE_URL}/campaign`, body);
  //   },

  //   createWalmartSVAdGroup: (body: IEditAccessWalmartAdGroup[]) => {
  //     return axiosInstance.post<
  //       IAPIResponse<IEditAccessWalmartAdGroupUpdateResponse>
  //     >(`${WALMART_SV_EDIT_BASE_URL}/ad-group`, body);
  //   },

  createWalmartSVAdItems: (body: IEditAccessCreateWalmartAdItem[]) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SV_EDIT_BASE_URL}/ad-item`,
      {
        payload: body,
      }
    );
  },

  createWalmartSVKeywordTargeting: (
    body: IEditAccessWalmartCreateKeywordTargeting[]
  ) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SV_EDIT_BASE_URL}/keyword`,
      {
        payload: body,
      }
    );
  },

  updateWalmartSVAdGroup: async (body: IEditAccessWalmartAdGroup[]) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SV_EDIT_BASE_URL}/ad-group`,
      {
        adGroups: body,
      }
    );
    return response;
  },

  updateWalmartSVAutomationRules: async (
    body: IEditAccessAutomationRulesUpdateBody
  ) => {
    const response = await axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_SV_EDIT_BASE_URL}/campaign-rules`,
      body
    );
    return response;
  },
};
