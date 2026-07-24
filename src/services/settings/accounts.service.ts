import {
  AMAZON_ADVERTISING_PROFILE_ID_HEADER_KEY,
  AMAZON_SP_PARTNER_ID,
  WALMART_ADVERTISING_ID_HEADER_KEY,
  WALMART_PARTNER_ID_HEADER_KEY,
  WALMART_SUPPLIER_ID_HEADER_KEY,
} from '@/constants/auth.constants';
import { WalmartAccountTypeEnum } from '@/enums/walmart.enums';
import {
  AUTH_BASE_URL,
  WMT_MARKETPLACE_AUTH_BASE_URL,
  WMT_SUPPLIER_AUTH_BASE_URL,
} from 'src/constants';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const accountsServices = {
  deleteAmazonAccount: (amazonProfileId: string) => {
    return axiosInstance.delete<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/account/amazon`,
      {
        headers: {
          [AMAZON_ADVERTISING_PROFILE_ID_HEADER_KEY]: amazonProfileId,
        },
      }
    );
  },
  deleteAmazonSPAccount: (sellingPartnerId: string) => {
    return axiosInstance.delete<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/account/amazon/sp`,
      {
        headers: {
          [AMAZON_SP_PARTNER_ID]: sellingPartnerId,
        },
      }
    );
  },
  deleteWalmartAccount: (walmartAdvertiserId: string) => {
    return axiosInstance.delete<IAPIResponse<null>>(
      `${AUTH_BASE_URL}/api/auth/account/walmart`,
      {
        headers: {
          [WALMART_ADVERTISING_ID_HEADER_KEY]: walmartAdvertiserId,
        },
      }
    );
  },
  deleteWalmartMarketplaceAccount: (partnerId: string) => {
    return axiosInstance.delete<IAPIResponse<null>>(
      `${WMT_MARKETPLACE_AUTH_BASE_URL}`,
      {
        headers: {
          [WALMART_PARTNER_ID_HEADER_KEY]: partnerId,
        },
      }
    );
  },
  deleteWalmartSupplierAccount: (supplierId: string) => {
    return axiosInstance.delete<IAPIResponse<null>>(
      `${WMT_SUPPLIER_AUTH_BASE_URL}`,
      {
        headers: {
          [WALMART_SUPPLIER_ID_HEADER_KEY]: supplierId,
        },
      }
    );
  },
  deleteWalmartCatalogAccount: async (
    metaId: string,
    accountType: WalmartAccountTypeEnum
  ) => {
    if (accountType === WalmartAccountTypeEnum.FIRST_PARTY)
      return await accountsServices.deleteWalmartSupplierAccount(metaId);
    return await accountsServices.deleteWalmartMarketplaceAccount(metaId);
  },
};
