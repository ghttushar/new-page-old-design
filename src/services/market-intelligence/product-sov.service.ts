import { MARKET_INTELLIGENCE_BASE_URL } from 'src/constants';
import {
  IProductSOVData,
  IProductSOVFilterBody,
  IProducts,
} from 'src/interfaces/product-sov.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const ProductSovService = {
  getProducts: (marketplace: string, brandName: string) => {
    const params = {
      marketplace: marketplace,
      brandName,
    };
    return axiosInstance.get<IAPIResponse<IProducts[]>>(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/serp/products`,
      {
        params,
      }
    );
  },
  getProductSOVData: (body: IProductSOVFilterBody) => {
    return axiosInstance.post<IAPIResponse<IProductSOVData>>(
      `${MARKET_INTELLIGENCE_BASE_URL}/api/market-intelligence/serp/product-sov`,
      body
    );
  },
};

export default ProductSovService;
