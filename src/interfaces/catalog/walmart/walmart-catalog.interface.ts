import { WalmartFulfillmentTypeEnum } from 'src/enums/catalog.enums';

export interface ICatalogCommonMetrics {
  price: number | null;
  inputQuantity: number | null;
  availToSellQuantity: number | null;
  impressions: number | null;
  clicks: number | null;
  adSales: number | null;
  unitsSold: number | null;
  adSpend: number | null;
  adOrders: number | null;
  ctr: number | null;
  cpc: number | null;
  cvrOrderBased: number | null;
  cvrUnitSoldBased: number | null;
  roas: number | null;
  acos: number | null;
  buyBox: number | null;
  productSov: number | null;
  lqs: number | null;
  commission: number | null;
  cogs: number | null;
  wfs: number | null;
  grossMargin: number | null;
  grossMarginPercentage: number | null;
  returns: number | null;
  cancelledOrders: number | null;
  cancelledSalesPrice: number | null;
  promoSpend: number | null;
  wfsInventory: number | null;
  sellerInventory: number | null;
  inventoryValueCogs: number | null;
  inventoryValueRetail: number | null;
  totalSales: number | null;
  tacos: number | null;
  fulfillmentType: WalmartFulfillmentTypeEnum | null;
  refundOrders: number | null;
  refundSales: number | null;
  grossSales: number | null;
  grossUnitsSold: number | null;
  totalUnits: number | null;
}

export interface ICatalogData extends ICatalogCommonMetrics {
  productName: string | null;
  sku: string | null;
  itemId: string | null;
  primaryImageUrl: string | null;
  variantGroupId: string | null;
  primaryVariant: string | null;
  isAdvertised: string | null;
  categoryPath: string | null;
  campaigns: Array<string>;
  publishStatus: string | null;
  reviews: number | null;
  ratings: number | null;
  variants?: ICatalogData[] | null;
}

export interface IUpdateCOGSPayload {
  itemId: string;
  cogs: string;
}
