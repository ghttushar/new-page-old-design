import { LOGIN_URL, SELECT_ACCOUNT_URL } from '@/constants/urls.constants';
import { VersionEnum } from '@/enums/index.enums';
import { MessageExecutionModeEnum } from '@/enums/pub-sub.enums';
import requestUtils from '@/utils/request.utils';
import { checkErrorDetailsExist } from '@/utils/toast-message.utils';
import { Store } from '@reduxjs/toolkit';
import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import { TOAST_AUTO_CLEAR_TIME } from 'src/constants';
import {
  AMAZON_ADVERTISING_PROFILE_ID_HEADER_KEY,
  AMAZON_SP_PARTNER_ID,
  AMC_INSTANCE_ID,
  AUTHORIZATION_HEADER_ID,
  DSP_ADVERTISER_ID,
  MESSAGE_EXECUTION_MODE_HEADER_ID,
  VERSION_TYPE_BODY_KEY,
  WALMART_ADVERTISING_ID_HEADER_KEY,
  WALMART_PARTNER_ID_HEADER_KEY,
} from 'src/constants/auth.constants';
import responseMessages from 'src/constants/messages/response.messages';
import { TOAST_MESSAGE_TYPES } from 'src/enums/toast.enums';
import {
  IAPIResponse,
  IErrorResultDetails,
} from 'src/interfaces/service.interface';
import {
  IToastMessageState,
  showToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import { IRootState } from 'src/redux/store';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';

const AXIOS_TIMEOUT = 300000;
const NETWORK_ERROR_CODES = ['ERR_NETWORK', 'ECONNABORTED', 'ECONNREFUSED'];
const VALIDATION_ERROR_CODES = [400, 207];

interface ErrorMessageResult {
  title: string;
  description: string;
  errData: IErrorResultDetails | null;
}

class RequestInterceptor {
  private static addAuthHeaders(config: InternalAxiosRequestConfig): void {
    const authToken = localStorageUtils.getAuthToken();

    if (authToken) {
      config.headers[AUTHORIZATION_HEADER_ID] = `Bearer ${authToken}`;
    }
  }

  private static addExecutionModeBody(
    config: InternalAxiosRequestConfig
  ): void {
    if (!config?.data) return;

    if (config.data instanceof FormData) {
      if (!config.data.has(MESSAGE_EXECUTION_MODE_HEADER_ID)) {
        config.data.append(
          MESSAGE_EXECUTION_MODE_HEADER_ID,
          MessageExecutionModeEnum.PUBLISH
        );
      }
    } else {
      config.data = {
        ...config.data,
        [MESSAGE_EXECUTION_MODE_HEADER_ID]: MessageExecutionModeEnum.PUBLISH,
      };
    }
  }

  private static addVersionForProfitability(
    config: InternalAxiosRequestConfig
  ): void {
    if (!config?.data) return;
    if (!requestUtils.checkIsAmazonProfitability(config.url ?? '')) return;
    config.data = {
      ...config.data,
      [VERSION_TYPE_BODY_KEY]: VersionEnum.V1,
    };
  }

  private static addPlatformSpecificHeaders(
    config: InternalAxiosRequestConfig
  ): void {
    const selectedCatalogAccount =
      localStorageUtils.getSelectedCatalogAccount();
    const selectedAdvertisingAccount =
      localStorageUtils.getSelectedAdvertisingAccount();
    const selectedAMCInstance = localStorageUtils.getSelectedAMCInstance();
    const selectedDSPAccount = localStorageUtils.getSelectedDSPAccount();

    const url = config.url || '';

    if (
      requestUtils.checkIsWalmartUrl(url) ||
      requestUtils.checkIsWalmartCatalogUrl(url) ||
      requestUtils.checkIsRulesUrl(url)
    ) {
      if (!config.headers[WALMART_ADVERTISING_ID_HEADER_KEY]) {
        config.headers[WALMART_ADVERTISING_ID_HEADER_KEY] =
          selectedAdvertisingAccount?.advertising?.walmartAdvertiserId;
      }
    }

    if (
      requestUtils.checkIsAmazonUrl(url) ||
      requestUtils.checkIsAmazonDaypartingUrl(url) ||
      requestUtils.checkIsRulesUrl(url) ||
      requestUtils.checkIsAmazonCatalogUrl(url)
    ) {
      if (!config.headers[AMAZON_ADVERTISING_PROFILE_ID_HEADER_KEY]) {
        config.headers[AMAZON_ADVERTISING_PROFILE_ID_HEADER_KEY] =
          selectedAdvertisingAccount?.advertising?.amazonProfileId;
      }
    }

    if (requestUtils.checkIsWalmartCatalogUrl(url)) {
      config.headers[WALMART_PARTNER_ID_HEADER_KEY] =
        selectedCatalogAccount?.catalog?.partnerId;
    }

    if (requestUtils.checkIsAmcUrl(url)) {
      config.headers[AMC_INSTANCE_ID] = selectedAMCInstance?.value;
      config.headers[DSP_ADVERTISER_ID] = selectedDSPAccount?.advertiserId;
    }

    if (requestUtils.checkIsAmazonCatalogUrl(url)) {
      if (!config.headers[AMAZON_SP_PARTNER_ID])
        config.headers[AMAZON_SP_PARTNER_ID] =
          selectedCatalogAccount?.catalog?.partnerId;
    }
  }

  static handleRequest(
    config: InternalAxiosRequestConfig
  ): InternalAxiosRequestConfig {
    this.addAuthHeaders(config);
    this.addPlatformSpecificHeaders(config);
    this.addExecutionModeBody(config);
    this.addVersionForProfitability(config);
    return config;
  }
}

class ErrorHandler {
  private static getMessageByStatusCode(statusCode?: number | string) {
    if (!statusCode) return responseMessages.GENERIC;
    return responseMessages[statusCode] ?? responseMessages.GENERIC;
  }

  static getErrorMessage(
    error: AxiosError<IAPIResponse<null | IErrorResultDetails>>
  ): ErrorMessageResult {
    if (NETWORK_ERROR_CODES.includes(error.code ?? '')) {
      const message = this.getMessageByStatusCode(error.code);
      return {
        title: message.title,
        description: message.description,
        errData: null,
      };
    }

    if (!error.response) {
      const message = this.getMessageByStatusCode('');
      return {
        title: message.title,
        description: message.description,
        errData: null,
      };
    }

    if (VALIDATION_ERROR_CODES.includes(error.response.status)) {
      return {
        title: error.response.data.message || responseMessages.GENERIC.title,
        description: error.response.data.description || '',
        errData: error.response.data.data || null,
      };
    }

    const message = this.getMessageByStatusCode(error.response.status);
    return {
      title: message.title,
      description: message.description,
      errData: null,
    };
  }

  static createToastMessage(
    error: AxiosError<IAPIResponse<null | IErrorResultDetails>>
  ): IToastMessageState {
    const message = this.getErrorMessage(error);
    return {
      title: message.title,
      description: message.description,
      errData: message.errData,
      type: TOAST_MESSAGE_TYPES.ERROR,
      autoClear:
        checkErrorDetailsExist(message.errData) === true ? false : true,
      autoClearTime: checkErrorDetailsExist(message.errData)
        ? undefined
        : TOAST_AUTO_CLEAR_TIME,
    };
  }

  static handleUnauthorizedError(delay = 0): void {
    localStorageUtils.clearLocalStorage();
    setTimeout(() => {
      window.location.href = LOGIN_URL;
    }, delay);
  }

  static handleTokenInvalidation(delay = 0): void {
    setTimeout(() => {
      window.location.href = SELECT_ACCOUNT_URL;
    }, delay);
  }
}

class ResponseInterceptor {
  static handleSuccess(response: any) {
    return response;
  }

  static async handleError(
    error: AxiosError<IAPIResponse<null | IErrorResultDetails>>,
    store: Store<IRootState>
  ): Promise<any> {
    try {
      if (error.code === 'ERR_CANCELED') return;

      const toastMessage = ErrorHandler.createToastMessage(error);
      store.dispatch(showToastMessage(toastMessage));

      if (error.response?.status === 401) {
        ErrorHandler.handleUnauthorizedError(3000);
      }

      if (error.response?.status === 409) {
        ErrorHandler.handleTokenInvalidation(3000);
      }

      return Promise.reject(error);
    } catch (e) {
      console.error('Error while dispatching toast message:', e);
      return Promise.reject(error);
    }
  }
}

const createAxiosInstance = (store: Store<IRootState>): AxiosInstance => {
  const axiosInstance: AxiosInstance = axios.create({
    timeout: AXIOS_TIMEOUT,
    validateStatus: (status) => status < 300 && status !== 207,
  });

  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) =>
      RequestInterceptor.handleRequest(config),
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    ResponseInterceptor.handleSuccess,
    (error: AxiosError<IAPIResponse<null | IErrorResultDetails>>) =>
      ResponseInterceptor.handleError(error, store)
  );

  return axiosInstance;
};

export default createAxiosInstance;
