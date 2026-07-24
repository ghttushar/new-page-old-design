import { Location } from 'react-router-dom';
import {
  AccessScopeEnum,
  ClientTypeEnum,
  FeaturesEnum,
  UserTypeEnum,
} from 'src/enums/auth.enums';
import { Channel } from 'src/enums/marketplace.enums';

export interface IAuthenticateAPIResponse {
  isAuthenticated: boolean;
  user: IUser;
}

export interface IAuthResponse {
  user: IUser;
  authToken: string;
}

export interface IHasAccess {
  type: FeaturesEnum;
  scope: AccessScopeEnum;
}

export interface IUser {
  email: string;
  _id: string;
  isSuperAdmin: boolean;
  firstName: string;
  lastName: string;
  shouldLogout: boolean;
  hasAccess: IHasAccess[];
  userType: UserTypeEnum;
}
export interface IDeviceContextFromServer {
  ipAddress: string | null;
  country: string | null;
  city: string | null;
}
export interface IDeviceContextFromClient {
  userAgent: string | null;
  deviceName: string | null;
  clientType: ClientTypeEnum;
  deviceId: string | null;
}

export interface IAuthBody extends IDeviceContextFromClient {
  email: string;
  password: string;
  mcpSessionId?: string;
}

export interface IFormatPasswordEmailPayload {
  email: string;
}

export interface IForgotPasswordPayload {
  password: string;
}

export interface ILoginForm {
  email: string;
  password: string;
}

export interface IRegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  brandName: string;
  password: string;
}

export interface IRegisterForm extends IRegisterBody {
  confirmPassword: string;
}

export interface IBrandNameVariation {
  brandName: string;
  channels: Array<Channel>;
  isPrimary: boolean;
}

export interface IAccount {
  _id: string;
  brandName: string;
  anarixId: string;
  powerBiGroupId: string;
  powerBiReportId: string;
  brandNameVariations: IBrandNameVariation[];
  isDemoAccount: boolean;
  enabledFeatures: Array<FeaturesEnum>;
  disabledFeatures: Array<FeaturesEnum>;
  isSuperAdmin?: boolean;
}

export interface IGetAccount {
  _id: string;
  brandName: string;
}

export interface IUserAccountMapping {
  _id: string;
  userId: string;
  accountId: IAccount;
  roles: string[];
  permissions: string[];
  enabledFeatures: FeaturesEnum[];
  disabledFeatures: FeaturesEnum[];
  featuresUnderMaintenance: FeaturesEnum[];
  isPinned: boolean;
}

export interface IUserAccountMappingUpdated {
  _id: string;
  userId: string;
  accountId: string;
  roles: string[];
  permissions: string[];
  enabledFeatures: FeaturesEnum[];
  disabledFeatures: FeaturesEnum[];
  isPinned: boolean;
}

export interface IInviteUserBody {
  email: string;
  role: string;
}

export interface IRegisterInvitedUserBody {
  firstName: string;
  lastName: string;
  password: string;
}

export interface IRegisterInvitedUserForm extends IRegisterInvitedUserBody {
  confirmPassword: string;
}

export interface IInviteDetails {
  _id: string;
  email: string;
  token: string;
  status: string;
  role: string;
  inviterId: string;
  accountId: IAccount;
  existingUser: boolean;
}

export interface IInviteListData {
  _id: string;
  email: string;
  status: string;
  role: string;
}

export interface IUserListData {
  _id: string;
  userId: IUser;
  accountId: string | IAccount;
  roles: string[];
  permissions: string[];
}

export interface IUpdateUserRoleBody {
  userId: string;
  role: string;
}

export interface IUpdateMappedAccountsPinning {
  accountId: string;
  updatedPinValue: boolean;
}

export interface ILocation extends Location {
  state: ICallbackUrl;
}

export interface ICallbackUrl {
  callbackUrl?: string;
}
