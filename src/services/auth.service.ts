import { AUTH_BASE_URL } from 'src/constants';
import {
  IAuthBody,
  IAuthResponse,
  IAuthenticateAPIResponse,
  IDeviceContextFromClient,
  IForgotPasswordPayload,
  IFormatPasswordEmailPayload,
  IGetAccount,
  IInviteDetails,
  IInviteListData,
  IInviteUserBody,
  IRegisterBody,
  IRegisterInvitedUserBody,
  IUpdateUserRoleBody,
  IUserAccountMapping,
  IUserAccountMappingUpdated,
  IUserListData,
} from 'src/interfaces/auth.interfaces';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';
const AuthServices = {
  verifyEmail: (token: string, context: IDeviceContextFromClient) => {
    return axiosInstance.get<IAPIResponse<IAuthResponse>>(
      `${AUTH_BASE_URL}/api/auth/user/verify/${token}`,
      {
        params: {
          ...context,
        },
      }
    );
  },

  authenticateUser: (authToken: string) => {
    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
    return axiosInstance.get<IAPIResponse<IAuthenticateAPIResponse>>(
      `${AUTH_BASE_URL}/api/auth/user/authenticate`,
      config
    );
  },

  loginUser: (body: IAuthBody) => {
    return axiosInstance.post<IAPIResponse<IAuthResponse>>(
      `${AUTH_BASE_URL}/api/auth/user/login`,
      body
    );
  },

  registerUser: (body: IRegisterBody) => {
    return axiosInstance.post<IAPIResponse<IAuthenticateAPIResponse>>(
      `${AUTH_BASE_URL}/api/auth/user/register`,
      body
    );
  },

  forgotPasswordEmail: (body: IFormatPasswordEmailPayload) => {
    return axiosInstance.post<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/user/forgot-password/email`,
      body
    );
  },

  forgotPassword: (token: string, body: IForgotPasswordPayload) => {
    return axiosInstance.post<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/user/forgot-password/${token}`,
      body
    );
  },

  getAccount: (accountId: string) => {
    return axiosInstance.get<IAPIResponse<IGetAccount>>(
      `${AUTH_BASE_URL}/api/auth/account/${accountId}`
    );
  },

  getUserAccountMappings: () => {
    return axiosInstance.get<IAPIResponse<IUserAccountMapping[]>>(
      `${AUTH_BASE_URL}/api/auth/user-account-mapping/`
    );
  },

  inviteUser: (body: IInviteUserBody) => {
    return axiosInstance.post<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/user/invite`,
      body
    );
  },

  registerInvitedUser: (token: string, body: IRegisterInvitedUserBody) => {
    return axiosInstance.post<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/user/register-invited/${token}`,
      body
    );
  },

  acceptInvite: (token: string) => {
    return axiosInstance.get<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/user/invite/accept/${token}`
    );
  },

  inviteDetails: (token: string) => {
    return axiosInstance.get<IAPIResponse<IInviteDetails>>(
      `${AUTH_BASE_URL}/api/auth/user/invite/details/${token}`
    );
  },

  getInviteList: () => {
    return axiosInstance.get<IAPIResponse<IInviteListData[]>>(
      `${AUTH_BASE_URL}/api/auth/user/invite/list`
    );
  },

  getUserList: () => {
    return axiosInstance.get<IAPIResponse<IUserListData[]>>(
      `${AUTH_BASE_URL}/api/auth/user/list`
    );
  },

  revokeAccessByUserId: (userId: string) => {
    return axiosInstance.delete<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/user/access/revoke/${userId}`
    );
  },

  deleteInviteByInviteId: (inviteId: string) => {
    return axiosInstance.delete<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/user/invite/${inviteId}`
    );
  },

  updateUserRole: (body: IUpdateUserRoleBody) => {
    return axiosInstance.put<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/account/user/role`,
      body
    );
  },

  updateIsPinned: (accountId: string, isPinned: boolean) => {
    return axiosInstance.put<IAPIResponse<IUserAccountMappingUpdated>>(
      `${AUTH_BASE_URL}/api/auth/user-account-mapping`,
      {
        isPinned: isPinned,
        accountId,
      }
    );
  },
};

export default AuthServices;
