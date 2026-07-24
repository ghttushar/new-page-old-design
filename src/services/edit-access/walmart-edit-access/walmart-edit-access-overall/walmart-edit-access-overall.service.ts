import {
  IEditAccessCreateWalmartAdItem,
  IEditAccessWalmartAdGroup,
  IEditAccessWalmartAdItem,
  IEditAccessWalmartCampaign,
  IEditAccessWalmartCreateKeywordTargeting,
  IEditAccessWalmartKeywordTargeting,
  IEditAccessWalmartPageType,
  IEditAccessWalmartPlatform,
} from '@/interfaces/edit-access/edit-access.interface';
import { WALMART_OVERALL_EDIT_BASE_URL } from 'src/constants';
import {
  IAPIResponse,
  IErrorResultDetails,
} from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const walmartEditAccessOverallServices = {
  updateWalmartOverallCampaign: (body: IEditAccessWalmartCampaign[]) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_OVERALL_EDIT_BASE_URL}/campaign`,
      {
        payload: body,
      }
    );
  },

  updateWalmartOverallAdGroup: (body: IEditAccessWalmartAdGroup[]) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_OVERALL_EDIT_BASE_URL}/ad-group`,
      {
        payload: body,
      }
    );
  },

  updateWalmartOverallAdItem: (body: IEditAccessWalmartAdItem[]) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_OVERALL_EDIT_BASE_URL}/ad-item`,
      {
        payload: body,
      }
    );
  },

  updateWalmartOverallKeywordTargeting: (
    body: IEditAccessWalmartKeywordTargeting[]
  ) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_OVERALL_EDIT_BASE_URL}/keyword`,
      {
        payload: body,
      }
    );
  },

  updateWalmartOverallPlatform: (body: IEditAccessWalmartPlatform[]) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_OVERALL_EDIT_BASE_URL}/platform`,
      {
        payload: body,
      }
    );
  },

  updateWalmartOverallPageType: (body: IEditAccessWalmartPageType[]) => {
    return axiosInstance.put<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_OVERALL_EDIT_BASE_URL}/page-type`,
      {
        payload: body,
      }
    );
  },

  createWalmartOverallAdItems: (body: IEditAccessCreateWalmartAdItem[]) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_OVERALL_EDIT_BASE_URL}/ad-item`,
      {
        payload: body,
      }
    );
  },

  createWalmartOverallKeywordTargeting: (
    body: IEditAccessWalmartCreateKeywordTargeting[]
  ) => {
    return axiosInstance.post<IAPIResponse<IErrorResultDetails>>(
      `${WALMART_OVERALL_EDIT_BASE_URL}/keyword`,
      {
        payload: body,
      }
    );
  },
};
