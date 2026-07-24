export enum CatalogSearchColumnsEnum {
  PRODUCT_NAME = 'productName',
  SKU = 'sku',
  ITEM_ID = 'itemId',
  SELLER_SKU = 'sellerSku',
  ASIN = 'asin',
  ITEM_NAME = 'itemName',
  UPC_CODE = 'upcCode',
}

export enum CatalogTabTitlesEnum {
  WALMART_CATALOG = 'Catalog_Walmart_Home_Page',
  AMAZON_CATALOG = 'Catalog_Amazon_Home_Page',
}

export enum WalmartFulfillmentTypeEnum {
  WFS_ELIGIBLE = 'WFS Eligible',
  SELLER_FULFILLED = 'Seller Fulfilled',
  WALMART_FULFILLED = 'Walmart Fulfilled',
}

export enum ProductVariantTypeEnum {
  PRIMARY_VARIANT = 'Y',
  NON_PRIMARY_VARIANT = 'N',
}

export enum AmazonFulfillmentTypeEnum {
  AMAZON_NA = 'AMAZON_NA',
  DEFAULT = 'DEFAULT',
  AMAZON_NA_MAPPED = 'Amazon Fulfilled',
  DEFAULT_MAPPED = 'Merchant Fulfilled',
}

export enum ItemConditionEnum {
  NEW_ITEM = 'NewItem',
  REFURBISHED = 'Refurbished',
  USED_VERY_GOOD = 'UsedVeryGood',
  USED_ACCEPTABLE = 'UsedAcceptable',
  USED_POOR = 'UsedPoor',
  USED_LIKE_NEW = 'UsedLikeNew',
  COLLECTIBLE_LIKE_NEW = 'CollectibleLikeNew',
}

export enum ItemConditionDisplayEnum {
  NEW = 'New',
  REFURBISHED = 'Refurbished',
  USED_VERY_GOOD = 'Used Very Good',
  USED_ACCEPTABLE = 'Used Acceptable',
  USED_POOR = 'Used Poor',
  USED_LIKE_NEW = 'Used Like New',
  COLLECTIBLE_LIKE_NEW = 'Collectible Like New',
}

export enum AmazonCatalogColumnIdsEnum {
  PRODUCT_NAME = 'Product Name',
  LIST_PRICE = 'List Price',
  AD_SPEND = 'Ad Spend',
  AD_SALES = 'Ad Sales',
  ROAS = 'ROAS',
  ACOS = 'ACoS',
  TACOS = 'TACoS',
  IMPRESSIONS = 'Impressions',
  CLICKS = 'Clicks',
  CTR = 'CTR',
  AVG_CPC = 'Avg CPC',
  ADVERTISED = 'Advertised (Yes/No)',
  CAMPAIGNS = 'Campaigns',
  CONDITION = 'Condition',
  TOTAL_ON_HAND_QUANTITY = 'On Hand Quantity',
  TOTAL_QUANTITY = 'Total Quantity',
  TOTAL_INBOUND = 'Inbound Quantity',
  RESERVED_QUANTITY = 'Reserved Quantity',
  UNFULFILLABLE_QUANTITY = 'Unfulfillable Quantity',
  LAST_UPDATED = 'Last Updated',
  STORES = 'Stores',
  FULFILLMENT_CHANNEL = 'Fulfillment Channel',
  AD_UNITS = 'Ad Units',
  AD_ORDERS = 'Ad Orders',
  CVR = 'CVR',
  TOTAL_RESEARCHING = 'Total Researching',
  FUTURE_SUPPLY_BUYABLE = 'Future Supply Buyable',
  PRODUCT_DETAILS = 'Product Details',
  REVENUE_COST = 'Revenue & Cost',
  ADS = 'Ads',
  INVENTORY = 'Inventory',
  TOTAL_SALES = 'Total Sales',
  TOTAL_UNITS = 'Total Units',
}
