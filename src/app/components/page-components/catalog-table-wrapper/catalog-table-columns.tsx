import { ICatalogData } from '@/interfaces/catalog/walmart/walmart-catalog.interface';
import {
  CoinsIcon,
  MegaphoneSimpleIcon,
  PackageIcon,
  ShoppingCartIcon,
} from '@phosphor-icons/react';
import { ColumnDef, GroupColumnDef } from '@tanstack/react-table';
import {
  ACOS,
  AD_ORDERS,
  AD_SALES,
  AD_SPEND,
  ADVERTISED,
  BUY_BOX,
  CAMPAIGNS,
  CANCELLED_SALES_PRICE,
  CANCELLED_UNITS,
  CATEGORY_PATH,
  CLICKS,
  COGS,
  CPC,
  CTR,
  CVR_ORDERS,
  CVR_UNITS,
  GROSS_MARGIN,
  GROSS_MARGIN_PERCENTAGE,
  GROSS_SALES,
  GROSS_UNITS,
  IMPRESSIONS,
  INV_COUNT,
  INV_VALUE_COGS,
  INV_VALUE_RETAIL,
  IS_PRIMARY_VARIANT,
  LQS,
  PRICE,
  PRODUCT_NAME,
  PRODUCT_SOV,
  PROMO_SPEND,
  REFUND_SALES,
  REFUND_UNITS,
  RETURNS,
  REVIEWS_RATINGS,
  ROAS,
  SELLER_INV_COUNT,
  STATUS,
  TACOS,
  TOTAL_SALES,
  TOTAL_UNITS,
  UNITS_SOLD,
  WALMART_FEE,
  WFS_INV_COUNT,
} from 'src/constants/table-columns/catalog-table-columns.constant';
import styles from './catalog-table-wrapper.module.scss';

export const catalogColumns: Array<ColumnDef<ICatalogData>> = [
  {
    accessorKey: 'productDetail',
    id: 'Product Details',
    enablePinning: true,
    header: (props) => {
      return (
        <div
          className={`commonHeader ${styles.groupHeader}`}
          style={{ textAlign: 'center' }}
        >
          <span style={{ color: '#444444' }}>Product Details</span>
        </div>
      );
    },
    enableSorting: true,
    columns: [PRODUCT_NAME],
  } as GroupColumnDef<ICatalogData>,
  {
    accessorKey: 'productPerformance',
    id: 'Product Performance',
    header: (props) => {
      return (
        <div
          className={`commonHeader ${styles.groupHeader}`}
          style={{ textAlign: 'center' }}
        >
          <PackageIcon size={16} color="#444444" />
          Product Performance
        </div>
      );
    },
    enableSorting: false,

    columns: [
      STATUS,
      IS_PRIMARY_VARIANT,
      BUY_BOX,
      LQS,
      REVIEWS_RATINGS,
      CATEGORY_PATH,
      PRODUCT_SOV,
    ],
  } as GroupColumnDef<ICatalogData>,
  {
    accessorKey: 'inventory',
    id: 'Inventory',
    header: (props) => {
      return (
        <div
          className={`commonHeader ${styles.groupHeader}`}
          style={{ textAlign: 'center' }}
        >
          <ShoppingCartIcon size={16} color="#444444" />
          Inventory
        </div>
      );
    },
    enableSorting: false,

    columns: [
      WFS_INV_COUNT,
      SELLER_INV_COUNT,
      INV_COUNT,
      INV_VALUE_COGS,
      INV_VALUE_RETAIL,
    ],
  } as GroupColumnDef<ICatalogData>,
  {
    accessorKey: 'revenueCost',
    id: 'Revenue & Cost',
    header: (props) => {
      return (
        <div
          className={`commonHeader ${styles.groupHeader}`}
          style={{ textAlign: 'center' }}
        >
          <CoinsIcon size={16} color="#444444" />
          Revenue & Cost
        </div>
      );
    },
    enableSorting: false,

    columns: [
      PRICE,
      COGS,
      TOTAL_SALES,
      GROSS_MARGIN,
      GROSS_MARGIN_PERCENTAGE,
      GROSS_SALES,
      TOTAL_UNITS,
      GROSS_UNITS,
      REFUND_UNITS,
      REFUND_SALES,
      CANCELLED_UNITS,
      CANCELLED_SALES_PRICE,
      WALMART_FEE,
      RETURNS,
      PROMO_SPEND,
    ],
  } as GroupColumnDef<ICatalogData>,
  {
    accessorKey: 'ads',
    id: 'Ads',
    header: (props) => {
      return (
        <div
          className={`commonHeader ${styles.groupHeader}`}
          style={{ textAlign: 'center' }}
        >
          <MegaphoneSimpleIcon size={16} color="#444444" />
          Ads
        </div>
      );
    },
    enableSorting: false,

    columns: [
      ADVERTISED,
      AD_SPEND,
      AD_SALES,
      ROAS,
      TACOS,
      IMPRESSIONS,
      CLICKS,
      CTR,
      UNITS_SOLD,
      AD_ORDERS,
      CVR_UNITS,
      CVR_ORDERS,
      CPC,
      ACOS,
      CAMPAIGNS,
    ],
  } as GroupColumnDef<ICatalogData>,
];
