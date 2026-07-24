import { ISortCriteria } from '@/interfaces/advertising/advertising.interface';
import { IFinalFilters } from '@/redux/slices/filters/filter.slice';

export interface IAmazonCatalogBody {
  filters: IFinalFilters[];
  searchText: string;
  searchColumns: string[];
  sortCriteria: ISortCriteria[];
  startDate: string;
  endDate: string;
  range: string;
  isDownload: boolean;
  downloadWithFilter: boolean;
}

export interface IAmazonCatalogItem {
  asin: string;
  primaryVariantInformation: string | null;
  sellerCode: string | null;
  upcCode: string | null;
  sellerSku: string | null;
  fulfillmentChannel: string | null;
  listPrice: number | null;
  brandName: string | null;
  itemName: string | null;
  image: string | null;
  advertised: string | null;
  adSpend: number | null;
  adSales: number | null;
  roas: number | null;
  tacos: number | null;
  impressions: number | null;
  clicks: number | null;
  ctr: number | null;
  adUnits: number | null;
  adOrders: number | null;
  cvr: number | null;
  avgCpc: number | null;
  acos: number | null;
  campaigns: number | null;
  totalSales: number | null;
  totalUnits: number | null;
  condition: string | null;
  totalOnHandQuantity: number | null;
  totalInboundQuantity: number | null;
  totalReservedQuantity: number | null;
  totalResearchingQuantity: number | null;
  totalUnfulfillableQuantity: number | null;
  futureSupplyBuyableQuantity: number | null;
  lastUpdatedTime: string | null;
  totalQuantity: number | null;
  inventoryBySku: Array<IAmazonCatalogItem>;
}

export interface IAmazonCOGSUploadBody {
  sku: string;
  asin: string;
  cogs: number;
}

export interface IDownloadCOGSData {
  name: string;
  asin: string;
  sku: string;
  price: string;
  cogs: string;
  promo: string;
  countryCode: string;
}
