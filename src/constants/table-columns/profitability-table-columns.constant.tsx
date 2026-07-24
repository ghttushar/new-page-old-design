import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import ImgComponent from '@/app/components/common/img-component/img-component';
import SkeletonComponent from '@/app/components/common/skeleton/skeleton';
import { IProfitabilityTrendsTableRow } from '@/app/components/page-components/profitability/profitability-trends-table/profitability-trends-table';
import TableFooterItem from '@/app/components/page-components/table-footer-item/table-footer-item';
import MoreInfo from '@/app/components/pages/profitability-page/more-info-details/more-info-details';
import OrderDetails from '@/app/components/pages/profitability-page/orders-details/order-details';
import ProfitabilityProductDetails from '@/app/components/pages/profitability-page/product-details/profitability-product-details';
import { getExpandToggleStyles } from '@/app/components/pages/profitability-page/profitability-styles';
import { ColumnNameEnum } from '@/enums/advertising.enums';
import { ProfitabilityOrdersMetricsKeyEnums } from '@/enums/profitability.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IAmazonProfitabilityOrder,
  IAmazonProfitabilityProductData,
  IAmazonProfitabilityTableData,
} from '@/interfaces/profitability/amazon-profitability.interface';
import {
  IFlatRowData,
  IProfitabilityOrdersData,
  IProfitabilityProductsData,
  IProfitabilityTableData,
} from '@/interfaces/profitability/profitability.interface';
import { displayValue, formatNum, getNumberFromString } from '@/utils';
import {
  checkIsNull,
  getFooterDisplayText,
  getFormattedMetrics,
} from '@/utils/advertising.utils';
import { profitabilityUtils } from '@/utils/profitability.utils';
import { CaretDoubleRightIcon, CaretRightIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import pnlStyles from 'src/app/components/page-components/profitability/profitability-pnl-table/profitability-pnl-table.module.scss';
import {
  textCenterStyles,
  textStartStyles,
} from './new-column-names.constants';

export const PURCHASE_ORDER_PRODUCT_DETAILS = (
  isHome: boolean
): ColumnDef<IProfitabilityOrdersData> => {
  return {
    accessorKey: ProfitabilityOrdersMetricsKeyEnums.PURCHASE_ORDER_ID,
    id: ColumnNameEnum.PROFITABILITY_ORDER_DETAILS,
    size: 100,
    meta: { columnSkeleton: true },
    header: (props) => {
      const expandToggler = props.table.getToggleAllRowsExpandedHandler();

      return (
        <div
          className={`commonHeader`}
          style={{
            ...textCenterStyles,
            justifyContent: 'start',
            gap: '0.4rem',
            cursor: 'pointer',
          }}
          onClick={expandToggler}
        >
          <CaretRightIcon
            key={props.header.index}
            size={'1.4rem'}
            weight="bold"
            onClick={expandToggler}
            style={{
              rotate: props.table.getIsAllRowsExpanded() ? '90deg' : '0deg',
              transition: 'all 0.2s ease-in',
              cursor: 'pointer',
            }}
          />
          Order Details
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const isLoading = props.table.options.meta?.isLoading ?? false;
      const imgUrl = row.original.purchaseOrderItemImage;
      const value = row.original.purchaseOrderId;

      if (checkIsNull(value) && isLoading === false)
        return <div className="no-data-view">-</div>;
      return (
        <div
          className={`commonCell`}
          style={{
            ...textCenterStyles,
            justifyContent: 'start',
            margin: 0,
            marginTop: '-1rem',
            marginBottom: '-1rem',
          }}
        >
          <ImgComponent
            imageURL={imgUrl ?? ''}
            alt="pre-load"
            isProduct={true}
            customStyles={{
              display: 'none',
            }}
          />
          {isLoading === true ? (
            <SkeletonComponent
              width={'43rem'}
              height={'4rem'}
              color="#f4f4f4"
            />
          ) : (
            <div
              style={{
                width: 'max-content',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <OrderDetails
                orderId={row.original.purchaseOrderId}
                isLoading={isLoading}
                productName={row.original.purchaseOrderProductName}
                sku={row.original.purchaseOrderSku}
                orderDate={row.original.orderDateLabel}
                imgUrl={row.original.purchaseOrderItemImage}
                productId={row.original.purchaseOrderItemId}
                purchaseStatus={row.original.purchaseStatus}
                productPrice={row.original.productPrice}
                cogs={row.original.cogsPerUnit}
                canExpand={row.getCanExpand()}
                isExpanded={row.getIsExpanded()}
                getToggleExpandedHandler={row.getToggleExpandedHandler}
              />
            </div>
          )}
        </div>
      );
    },
    footer(props) {
      const totalData = props.table.options.meta?.getFooterData();
      return (
        <div className={`commonHeader`} style={textStartStyles}>
          {totalData !== undefined
            ? getFooterDisplayText(
                props,
                'Order',
                totalData['totalOrdersCount']
              )
            : '-'}
        </div>
      );
    },
  };
};

export const PRODUCT_DETAILS = (
  isHome: boolean
): ColumnDef<IProfitabilityOrdersData | IProfitabilityProductsData> => {
  return {
    accessorKey: 'purchaseOrderProductName',
    id: ColumnNameEnum.PROFITABILITY_PRODUCT_DETAILS,
    size: 100,
    meta: { columnSkeleton: true },
    header: (props) => {
      return (
        <div
          className={`commonHeader`}
          style={{ ...textCenterStyles, justifyContent: 'start' }}
        >
          Product Details
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const isLoading = props.table.options.meta?.isLoading ?? false;

      return (
        <div
          className={`commonCell`}
          style={{
            ...textCenterStyles,
            justifyContent: 'start',
            marginTop: '-1.4rem',
            marginBottom: '-1.4rem',
          }}
        >
          <ProfitabilityProductDetails
            isLoading={isLoading}
            name={row.original.purchaseOrderProductName ?? ''}
            sku={row.original.purchaseOrderSku ?? ''}
            imgUrl={row.original.purchaseOrderItemImage ?? ''}
            itemId={row.original.purchaseOrderItemId ?? ''}
            productPrice={row.original.productPrice ?? 0}
            itemInventory={
              (row.original as IProfitabilityProductsData).itemInventory ?? 0
            }
            cogs={row.original.cogsPerUnit}
            isHome={isHome}
          />
        </div>
      );
    },
    footer(props) {
      return (
        <div
          className="commonHeader"
          style={{
            display: 'flex',
            justifyContent: 'start',
          }}
        >
          {getFooterDisplayText(props, 'Product')}
        </div>
      );
    },
  };
};

export const TOTAL_UNITS_COLUMN: ColumnDef<IProfitabilityOrdersData> = {
  accessorKey: 'totalUnitsSold',
  id: ColumnNameEnum.TOTAL_UNITS_SOLD,
  size: 100,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Units
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.totalUnitsSold;
    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {value}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isUnit={true}
          accessorKey={'totalUnitsSold'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const COGS = (isOrders = false): ColumnDef<IProfitabilityOrdersData> => {
  return {
    accessorKey: 'cogs',
    id: ColumnNameEnum.COGS,
    size: 100,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          COGS
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.cogs;

      if (checkIsNull(value)) return <div className="no-data-view">-</div>;
      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value), false)}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isFraction={true}
            isPercentage={false}
            accessorKey={isOrders ? 'totalCogs' : 'totalCogsForOrderedUnit'}
            totalData={footerData}
          />
        </div>
      );
    },
  };
};

export const PRODUCT_TABLE_ORDER_COUNT_COLUMN: ColumnDef<IProfitabilityProductsData> =
  {
    accessorKey: 'orderCount',
    id: ColumnNameEnum.ORDER_COUNT,
    size: 100,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Orders
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.orderCount ?? 0;

      if (checkIsNull(value)) return <div className="no-data-view">-</div>;
      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {value}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'totalOrderCount'}
            totalData={footerData}
          />
        </div>
      );
    },
  };

export const REFUND_UNITS_COLUMN: ColumnDef<IProfitabilityOrdersData> = {
  accessorKey: 'refundUnits',
  id: ColumnNameEnum.REFUND_UNITS,
  size: 100,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Refund Units
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.refundUnits;
    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {value}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isUnit={true}
          accessorKey={'totalRefundUnits'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const CANCELLED_UNITS_COLUMN: ColumnDef<IProfitabilityOrdersData> = {
  accessorKey: 'cancelledUnits',
  id: ColumnNameEnum.CANCELLED_UNITS_TABLE,
  size: 100,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Cancelled Units
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.cancelledUnits;
    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {value}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isUnit={true}
          accessorKey={'totalCancelledUnits'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const TOTAL_SALES_COLUMN: ColumnDef<IProfitabilityOrdersData> = {
  accessorKey: 'totalSales',
  id: ColumnNameEnum.GMV_COLUMN,
  size: 100,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        GMV
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.totalSales;
    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {displayValue(formatNum(value), false)}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalSales'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const AD_SPEND_COLUMN: ColumnDef<IProfitabilityOrdersData> = {
  accessorKey: 'overallAdSpend',
  id: ColumnNameEnum.TOTAL_AD_SPEND,
  size: 100,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Ad Spend
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.overallAdSpend;
    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {displayValue(formatNum(value), false)}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalOverallAdSpend'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const NET_PROFIT: ColumnDef<IProfitabilityOrdersData> = {
  accessorKey: 'netProfit',
  id: ColumnNameEnum.NET_PROFIT,
  size: 100,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Net Profit
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.netProfit;
    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {displayValue(formatNum(value), false)}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalNetProfit'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const ADDITIONAL_FEES: ColumnDef<IProfitabilityOrdersData> = {
  accessorKey: 'additionalFee',
  id: ColumnNameEnum.ADDITIONAL_FEES,
  size: 100,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Additional Fee
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.additionalFee;
    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {displayValue(formatNum(value), false)}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalAdditionalFee'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const AUTH_SALES_COLUMN: ColumnDef<IProfitabilityOrdersData> = {
  accessorKey: 'orderSales',
  id: ColumnNameEnum.AUTH_SALES,
  size: 100,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Auth Sales
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.orderSales;
    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {displayValue(formatNum(value), false)}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalOrderSales'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const REFUND_SALES_COLUMN: ColumnDef<IProfitabilityOrdersData> = {
  accessorKey: 'refundSales',
  id: ColumnNameEnum.REFUND_SALES,
  size: 100,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Refund Sales
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.refundSales;
    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {displayValue(formatNum(value), false)}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalRefundSales'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const CANCELLED_SALES_COLUMN: ColumnDef<IProfitabilityOrdersData> = {
  accessorKey: 'cancelledSales',
  id: ColumnNameEnum.CANCELLED_SALES_TABLE,
  size: 100,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Cancelled Sales
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.cancelledSales;
    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {displayValue(formatNum(value), false)}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalCancelledSales'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const COMMISSION_ON_PRODUCT_COLUMN: ColumnDef<IProfitabilityOrdersData> =
  {
    accessorKey: 'commissionOnProduct',
    id: ColumnNameEnum.COMMISSION_ON_PRODUCT_TABLE,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Commission on Product
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.commissionOnProduct;

      if (checkIsNull(value)) return <div className="no-data-view">-</div>;
      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value), false)}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'totalCommissionOnProduct'}
            totalData={footerData}
          />
        </div>
      );
    },
  };

export const COMMISSION_ON_SHIPPING_COLUMN: ColumnDef<IProfitabilityOrdersData> =
  {
    accessorKey: 'commissionOnShipping',
    id: ColumnNameEnum.COMMISSION_ON_SHIPPING_TABLE,
    size: 150,
    header: (props) => {
      return (
        <div className={`commonHeader`} style={textCenterStyles}>
          Commission on Shipping
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.commissionOnShipping;
      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value), false)}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'totalCommissionOnShipping'}
            totalData={footerData}
          />
        </div>
      );
    },
  };

export const WFS_FULFILLMENT_FEE_COLUMN: ColumnDef<IProfitabilityOrdersData> = {
  accessorKey: 'wfsFulfillmentFee',
  id: ColumnNameEnum.WFS_FULFILLMENT_FEE_TABLE,
  size: 160,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        WFS Fulfillment Fee
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.wfsFulfillmentFee;
    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {displayValue(formatNum(value), false)}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalWfsFulfillmentFee'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const SHIPPING_COLUMN: ColumnDef<IProfitabilityOrdersData> = {
  accessorKey: 'shipping',
  id: ColumnNameEnum.SHIPPING_TABLE,
  size: 100,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Shipping Fees
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.shipping;
    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {displayValue(formatNum(value), false)}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalShipping'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const MORE_INFO_COLUMN: ColumnDef<
  IProfitabilityTableData | IAmazonProfitabilityTableData
> = {
  accessorKey: 'moreInfo',
  id: ColumnNameEnum.MORE_INFO,
  size: 80,
  enableSorting: false,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Info
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <MoreInfo row={row} />
      </div>
    );
  },
};

export const PNL_PARAMETER: ColumnDef<IFlatRowData> = {
  id: ColumnNameEnum.PNL_PARAMETER,
  maxSize: 270,
  header: ({ table }) => {
    const handleToggleAll = table.getToggleAllRowsExpandedHandler();
    const isAllExpanded = table.getIsAllRowsExpanded();
    const hasData = table.getRowModel().rows.length > 0;

    return (
      <div
        className={pnlStyles.parameterHeaderContent}
        onClick={hasData ? handleToggleAll : undefined}
      >
        <CaretDoubleRightIcon
          size="1.2rem"
          weight="bold"
          className={pnlStyles.caretIcon}
          color={!hasData ? '#888888' : undefined}
          style={{
            transform: isAllExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            cursor: !hasData ? 'not-allowed' : 'pointer',
          }}
        />
        <span className={pnlStyles.parameterLabel}>Parameter / Date</span>
      </div>
    );
  },
  cell: ({ row, table }) => {
    const rowData = row.original;
    const isExpanded = row.getIsExpanded();
    const hasChildren = rowData.hasChildren;
    const value = rowData.label;
    const canExpand = value !== '' && row.original.value !== '-';

    const handleToggleRow = () => {
      if (hasChildren && canExpand) {
        row.toggleExpanded();
      }
    };

    if (checkIsNull(value) || value === undefined)
      return <div className="no-data-view">-</div>;

    return (
      <div
        className={`${pnlStyles.parameterContent} ${
          hasChildren ? pnlStyles.expandable : ''
        }`}
        onClick={handleToggleRow}
        style={{
          paddingLeft: `${rowData.level * 1}rem`,
          width: '100%',
          cursor: !canExpand ? 'not-allowed' : 'pointer',
        }}
      >
        <CaretRightIcon
          size="1.2rem"
          weight="bold"
          className={pnlStyles.caretIcon}
          color={
            !hasChildren || !value
              ? '#888888'
              : isExpanded === true
              ? '#77469b'
              : undefined
          }
          style={{
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            visibility: hasChildren ? 'visible' : 'hidden',
            marginLeft: '1rem',
            cursor: !hasChildren || !canExpand ? 'not-allowed' : 'pointer',
          }}
        />
        <span className={pnlStyles.parameterLabel}>
          <HoverInfoTooltip title={value}>
            <span>{value}</span>
          </HoverInfoTooltip>
        </span>
      </div>
    );
  },
};

export const PNL_TOTAL: ColumnDef<IFlatRowData> = {
  id: ColumnNameEnum.PNL_TOTAL,

  header: () => <div className={pnlStyles.totalHeaderContent}>Total</div>,
  cell: ({ row, table }) => {
    const value = row.original.value;

    if (checkIsNull(value) || value === undefined)
      return <div className="no-data-view">-</div>;

    return <div className={pnlStyles.totalCellContent}>{value}</div>;
  },
};

export const TRENDS_PRODUCT_DETAILS = (
  marketplace: MarketplaceEnum
): ColumnDef<IProfitabilityTrendsTableRow> => {
  return {
    id: ColumnNameEnum.TRENDS_PRODUCT,
    accessorKey: 'productName',
    size: 100,
    maxSize: 200,
    meta: { columnSkeleton: true },
    header: () => (
      <span className="w-full text-start text-[1.2rem]">Product Details</span>
    ),
    footer: (props) => (
      <div className={'commonHeader w-full'}>
        {getFooterDisplayText(props, 'Product')}
      </div>
    ),
    cell: ({ row, table }) => {
      const rowData = row.original;
      const isLoading = table.options.meta?.isLoading === true;

      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'start',
            width: '100%',
            marginBottom: '-1rem',
            marginTop: '-1rem',
          }}
        >
          <ProfitabilityProductDetails
            isLoading={isLoading}
            name={row.original.productName ?? ''}
            sku={row.original.sku}
            imgUrl={row.original.imageUrl ?? ''}
            itemId={rowData.id ?? ''}
            productPrice={row.original.productPrice}
            isTrends={true}
            marketplace={marketplace}
          />
        </div>
      );
    },
  };
};

export const TRENDS_TOTAL: ColumnDef<IProfitabilityTrendsTableRow> = {
  id: ColumnNameEnum.TRENDS_TOTAL,
  size: 100,
  enableSorting: true,
  accessorKey: 'totalValue',
  sortingFn: (rowA, rowB) => {
    if (
      checkIsNull(rowA.original.totalValue) ||
      checkIsNull(rowB.original.totalValue)
    )
      return 0;
    const valueA = getNumberFromString(rowA.original?.totalValue);
    const valueB = getNumberFromString(rowB.original?.totalValue);

    if (valueA === null && valueB === null) return 0;
    if (valueA === null) return 1;
    if (valueB === null) return -1;

    return valueA - valueB;
  },
  header: () => <div className={pnlStyles.totalHeaderContent}>Total</div>,
  cell: ({ row, table }) => {
    const value = row.original.totalValue;
    const selectedTrendsMetric = row.original.metricKey;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;

    return (
      <span
        style={{
          fontWeight: '600',
        }}
      >
        {getFormattedMetrics(selectedTrendsMetric, parseFloat(value))}
      </span>
    );
  },
};

export const profitabilityOrdersColumns = (isHome: boolean) => {
  return [
    PURCHASE_ORDER_PRODUCT_DETAILS(isHome),
    NET_PROFIT,
    TOTAL_SALES_COLUMN,
    TOTAL_UNITS_COLUMN,
    COGS(true),
    WFS_FULFILLMENT_FEE_COLUMN,
    SHIPPING_COLUMN,
    COMMISSION_ON_PRODUCT_COLUMN,
    COMMISSION_ON_SHIPPING_COLUMN,
    ADDITIONAL_FEES,
    REFUND_UNITS_COLUMN,
    CANCELLED_UNITS_COLUMN,
    REFUND_SALES_COLUMN,
    CANCELLED_SALES_COLUMN,
    AUTH_SALES_COLUMN,
    MORE_INFO_COLUMN as ColumnDef<IProfitabilityTableData>,
  ] as ColumnDef<IProfitabilityTableData>[];
};

export const profitabilityProductsColumns = (isHome: boolean) => {
  return [
    PRODUCT_DETAILS(isHome) as ColumnDef<IProfitabilityTableData>,
    // PRODUCT_TABLE_ORDER_COUNT_COLUMN,
    NET_PROFIT,
    TOTAL_SALES_COLUMN,
    TOTAL_UNITS_COLUMN,
    COGS(false),
    AD_SPEND_COLUMN,
    WFS_FULFILLMENT_FEE_COLUMN,
    SHIPPING_COLUMN,
    COMMISSION_ON_PRODUCT_COLUMN,
    COMMISSION_ON_SHIPPING_COLUMN,
    ADDITIONAL_FEES,
    REFUND_UNITS_COLUMN,
    CANCELLED_UNITS_COLUMN,
    REFUND_SALES_COLUMN,
    CANCELLED_SALES_COLUMN,
    AUTH_SALES_COLUMN,
    MORE_INFO_COLUMN as ColumnDef<IProfitabilityTableData>,
  ] as ColumnDef<IProfitabilityTableData>[];
};

export const getAllProfitabilityColumns = (
  isOrdersTable: boolean,
  isHome: boolean
) => {
  if (isOrdersTable === true) return profitabilityOrdersColumns(isHome);
  return profitabilityProductsColumns(isHome);
};

// Amazon Profitability Columns

export const AMAZON_ORDER_ID_COLUMN: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'orderId',
  id: ColumnNameEnum.PROFITABILITY_ORDER_DETAILS,
  size: 400,
  meta: { columnSkeleton: true },
  header: (props) => {
    const expandToggler = props.table.getToggleAllRowsExpandedHandler();

    return (
      <div
        className={`commonHeader`}
        style={{
          ...textCenterStyles,
          justifyContent: 'start',
          gap: '0.4rem',
          cursor: 'pointer',
        }}
        onClick={expandToggler}
      >
        <CaretRightIcon
          key={props.header.index}
          size={'1.4rem'}
          weight="bold"
          onClick={expandToggler}
          style={{
            rotate: props.table.getIsAllRowsExpanded() ? '90deg' : '0deg',
            transition: 'all 0.2s ease-in',
            cursor: 'pointer',
          }}
        />
        Order Details
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const isLoading = props.table.options.meta?.isLoading ?? false;
    const imgUrl = row.original.itemImgUrl;

    return (
      <div
        className={`commonCell`}
        style={{
          ...textCenterStyles,
          justifyContent: 'start',
          margin: 0,
          marginTop: '-1rem',
          marginBottom: '-1rem',
        }}
      >
        <ImgComponent
          imageURL={imgUrl ?? ''}
          alt="pre-load"
          isProduct={true}
          customStyles={{
            display: 'none',
          }}
        />
        {isLoading === true ? (
          <SkeletonComponent width={'43rem'} height={'4rem'} color="#f4f4f4" />
        ) : (
          <div
            style={{
              width: 'max-content',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <OrderDetails
              orderId={row.original.orderId}
              isLoading={isLoading}
              productName={
                row.original.sellingPartnerId ? null : row.original.productName
              }
              sku={row.original.sku}
              orderDate={row.original.orderDate}
              imgUrl={imgUrl}
              productId={row.original.asin}
              purchaseStatus={row.original.orderStatus}
              productPrice={
                row.original.sellingPartnerId
                  ? row.original.totalPrincipalAmount
                  : row.original.principalAmount
              }
              cogs={row.original.cogs}
              canExpand={row.getCanExpand()}
              isExpanded={row.getIsExpanded()}
              getToggleExpandedHandler={row.getToggleExpandedHandler}
              countryCode={row.original.countryCode}
              marketplace={MarketplaceEnum.AMAZON}
            />
          </div>
        )}
      </div>
    );
  },
  footer(props) {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {getFooterDisplayText(props, 'Order')}
      </div>
    );
  },
};

export const AMAZON_PRODUCT_DETAILS = (
  isHome: boolean
): ColumnDef<IAmazonProfitabilityTableData> => {
  return {
    accessorKey: 'itemName',
    id: ColumnNameEnum.PROFITABILITY_PRODUCT_DETAILS,
    size: 100,
    meta: { columnSkeleton: true },
    header: (props) => {
      const expandToggler = props.table.getToggleAllRowsExpandedHandler();

      return (
        <div
          className={`commonHeader`}
          style={{
            ...textCenterStyles,
            justifyContent: 'start',
            gap: '0.4rem',
            cursor: 'pointer',
          }}
          onClick={expandToggler}
        >
          <CaretRightIcon
            key={props.header.index}
            size={'1.4rem'}
            weight="bold"
            onClick={expandToggler}
            style={{
              rotate: props.table.getIsAllRowsExpanded() ? '90deg' : '0deg',
              transition: 'all 0.2s ease-in',
              cursor: 'pointer',
            }}
          />
          Product Details
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const isLoading = props.table.options.meta?.isLoading ?? false;
      const canExpand = props.row.getCanExpand();
      const isExpanded = props.row.getIsExpanded();
      const getToggleExpandedHandler = props.row.getToggleExpandedHandler;

      return (
        <div
          className={`commonCell`}
          style={{
            ...textCenterStyles,
            justifyContent: 'start',
            marginTop: '-1.4rem',
            marginBottom: '-1.4rem',
          }}
        >
          {canExpand === true && (
            <span onClick={getToggleExpandedHandler()}>
              <CaretRightIcon
                weight="bold"
                style={getExpandToggleStyles(isExpanded)}
              />
            </span>
          )}
          {isLoading && (
            <ProfitabilityProductDetails
              isLoading={isLoading}
              name={''}
              sku={''}
              imgUrl={''}
              itemId={''}
              productPrice={0}
              isHome={false}
            />
          )}
          {profitabilityUtils.isAmazonOrdersData(row.original) && (
            <ProfitabilityProductDetails
              isLoading={isLoading}
              name={row.original.productName}
              sku={row.original.sku}
              imgUrl={row.original.itemImgUrl}
              itemId={row.original.orderItemId}
              productPrice={row.original.principalAmount}
              isHome={isHome}
              marketplace={MarketplaceEnum.AMAZON}
            />
          )}
          {profitabilityUtils.isAmazonProductsData(row.original) && (
            <span
              className={row.original.sku ? '!ml-[1.4rem]' : '!ml-[0.4rem]'}
            >
              <ProfitabilityProductDetails
                isLoading={isLoading}
                name={row.original.itemName ?? ''}
                sku={row.original.sku}
                imgUrl={row.original.imageUrl ?? ''}
                itemId={row.original.asin ?? ''}
                productPrice={row.original.itemPrice}
                isHome={isHome}
                cogs={row.original.cogs}
                marketplace={MarketplaceEnum.AMAZON}
              />
            </span>
          )}
        </div>
      );
    },
    footer(props) {
      return (
        <div
          className="commonHeader"
          style={{
            display: 'flex',
            justifyContent: 'start',
          }}
        >
          {getFooterDisplayText(props, 'Product')}
        </div>
      );
    },
  };
};
export const AMAZON_TOTAL_ORDER_UNITS: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'totalOrderUnits',
  id: 'Order Units',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      Total Units
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.sellingPartnerId
      ? row.original.totalOrderUnits
      : row.original.orderUnits;
    if (checkIsNull(value)) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {formatNum(value, false)}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isUnit={true}
          accessorKey={'totalOrderUnits'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const AMAZON_TOTAL_SALES: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'totalPrincipalAmount',
  id: 'Total Sales',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      Total Sales
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.sellingPartnerId
      ? row.original.totalPrincipalAmount
      : row.original.principalAmount;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), false)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalPrincipalAmount'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const AMAZON_RETURN_PRODUCTS_UNITS: ColumnDef<IAmazonProfitabilityOrder> =
  {
    accessorKey: 'totalReturns',
    id: 'Total Return Units',
    size: 80,
    header: () => (
      <div className={`commonHeader`} style={textCenterStyles}>
        Return Units
      </div>
    ),
    cell: ({ row, table }) => {
      const value = row.original.totalReturns;

      if (checkIsNull(value)) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'totalReturns'}
            totalData={footerData}
          />
        </div>
      );
    },
  };
export const AMAZON_RETURN_ORDER_UNITS: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'totalReturnUnits',
  id: 'Total Return Units',
  size: 80,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      Return Units
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.sellingPartnerId
      ? row.original.totalReturnUnits
      : row.original.returnUnits;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {formatNum(value, false)}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isUnit={true}
          accessorKey={'totalReturnUnits'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const AMAZON_RETURN_AMOUNT: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'totalReturnPrincipalAmount',
  id: 'Return Principal Amount',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      Return Amount
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.sellingPartnerId
      ? row.original.totalReturnPrincipalAmount
      : row.original.returnPrincipalAmount;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), false)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalReturnPrincipalAmount'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const AMAZON_REFUND_FEE: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'totalRefundFees',
  id: 'Return Fees',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      Return Fees
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.sellingPartnerId
      ? row.original.totalRefundFees
      : row.original.settlementDetails?.totalRefundFees;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), false)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalRefundFees'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const AMAZON_COGS_COLUMN = (
  isOrdersTable: boolean
): ColumnDef<IAmazonProfitabilityOrder> => {
  return {
    accessorKey: 'totalCogs',
    id: 'COGS',
    size: 80,
    header: () => (
      <div className={`commonHeader`} style={textCenterStyles}>
        COGS
      </div>
    ),
    cell: ({ row, table }) => {
      const value = profitabilityUtils.getCogsByTable(isOrdersTable, row);

      if (checkIsNull(value)) return <div className="no-data-view">-</div>;
      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value), false)}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'totalCogs'}
            totalData={footerData}
          />
        </div>
      );
    },
  };
};
export const AMAZON_FEES_COLUMN: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'totalAmazonFees',
  id: 'Amazon Fees',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      Amazon Fees
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.sellingPartnerId
      ? row.original.totalAmazonFees
      : row.original.settlementDetails?.totalAmazonFees;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), false)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalAmazonFees'}
          totalData={footerData}
        />
      </div>
    );
  },
};
export const MARGIN_COLUMN: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'margin',
  id: 'Margin',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      Margin
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.margin;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), true)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={true}
          isFraction={true}
          accessorKey={'totalMargin'}
          totalData={footerData}
        />
      </div>
    );
  },
};
export const EST_PAYOUT: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'estimatedPayout',
  id: 'Est. Payout',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      Est. Payout
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.estimatedPayout;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), false)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalEstimatedPayout'}
          totalData={footerData}
        />
      </div>
    );
  },
};
export const AMAZON_NET_PROFIT_COLUMN: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'netProfit',
  id: 'Net Profit',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      Net Profit
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.netProfit;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), false)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalNetProfit'}
          totalData={footerData}
        />
      </div>
    );
  },
};
export const ROI_COLUMN: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'roi',
  id: 'ROI',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      ROI
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.roi;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), true)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={true}
          isFraction={true}
          accessorKey={'totalRoi'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const ORDER_MARGIN_COLUMN: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'margin',
  id: 'Margin',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      Margin
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.sellingPartnerId
      ? row.original.margin
      : row.original.settlementDetails?.margin;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), true)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={true}
          isFraction={true}
          accessorKey={'totalMargin'}
          totalData={footerData}
        />
      </div>
    );
  },
};
export const ORDER_EST_PAYOUT: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'estimatedPayout',
  id: 'Est. Payout',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      Est. Payout
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.sellingPartnerId
      ? row.original.estimatedPayout
      : row.original.settlementDetails?.estimatedPayout;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), false)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalEstimatedPayout'}
          totalData={footerData}
        />
      </div>
    );
  },
};
export const ORDER_NET_PROFIT_COLUMN: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'netProfit',
  id: 'Net Profit',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      Net Profit
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.sellingPartnerId
      ? row.original.netProfit
      : row.original.settlementDetails?.netProfit;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), false)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalNetProfit'}
          totalData={footerData}
        />
      </div>
    );
  },
};
export const ORDER_ROI_COLUMN: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'roi',
  id: 'ROI',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      ROI
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.sellingPartnerId
      ? row.original.roi
      : row.original.settlementDetails?.roi;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), true)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={true}
          isFraction={true}
          accessorKey={'totalRoi'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const AMAZON_FBA_FEES_COLUMN: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'totalOrdersFbaFulfillmentFees',
  id: 'Orders Fba Fulfillment Fees',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      FBA Fees
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.sellingPartnerId
      ? row.original.totalOrdersFbaFulfillmentFees
      : row.original.fbaFulfillmentFees;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), false)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalFbaFulfillmentFees'}
          totalData={footerData}
        />
      </div>
    );
  },
};

// Amazon Product Table Columns

export const AMAZON_PRODUCT_TOTAL_ORDERS_COLUMN: ColumnDef<IAmazonProfitabilityProductData> =
  {
    accessorKey: 'totalOrders',
    id: 'Orders',
    size: 100,
    header: () => (
      <div className={`commonHeader`} style={textCenterStyles}>
        Total Orders
      </div>
    ),
    cell: ({ row, table }) => {
      const value = row.original.totalOrders;

      if (checkIsNull(value)) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'totalOrders'}
            totalData={footerData}
          />
        </div>
      );
    },
  };

export const AMAZON_PRODUCT_TOTAL_SALES_COLUMN: ColumnDef<IAmazonProfitabilityProductData> =
  {
    accessorKey: 'totalSales',
    id: 'Sales',
    size: 100,
    header: () => (
      <div className={`commonHeader`} style={textCenterStyles}>
        Total Sales
      </div>
    ),
    cell: ({ row, table }) => {
      const value = row.original.totalSales;

      if (checkIsNull(value)) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {checkIsNull(value) === false
            ? displayValue(formatNum(value), false)
            : '-'}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'totalSales'}
            totalData={footerData}
          />
        </div>
      );
    },
  };

export const AMAZON_PRODUCT_TOTAL_UNITS_SOLD_COLUMN: ColumnDef<IAmazonProfitabilityProductData> =
  {
    accessorKey: 'totalUnitsSold',
    id: 'Units Sold',
    size: 100,
    header: () => (
      <div className={`commonHeader`} style={textCenterStyles}>
        Units Sold
      </div>
    ),
    cell: ({ row, table }) => {
      const value = row.original.totalUnitsSold;

      if (checkIsNull(value)) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {formatNum(value, false)}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isUnit={true}
            accessorKey={'totalUnitsSold'}
            totalData={footerData}
          />
        </div>
      );
    },
  };

export const AMAZON_PRODUCT_RETURN_PERCETANGE_COLUMN: ColumnDef<IAmazonProfitabilityProductData> =
  {
    accessorKey: 'refundPercentage',
    id: '% Returns',
    size: 100,
    header: () => (
      <div className={`commonHeader`} style={textCenterStyles}>
        % Returns
      </div>
    ),
    cell: ({ row, table }) => {
      const value = row.original.refundPercentage;

      if (checkIsNull(value)) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {displayValue(formatNum(value), true)}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={true}
            isFraction={true}
            accessorKey={'totalRefundPercentage'}
            totalData={footerData}
          />
        </div>
      );
    },
  };

export const AMAZON_PRODUCT_TOTAL_RETURN_FEES_COLUMN: ColumnDef<IAmazonProfitabilityProductData> =
  {
    accessorKey: 'totalRefundFees',
    id: 'Return Fees',
    size: 100,
    header: () => (
      <div className={`commonHeader`} style={textCenterStyles}>
        Return Fees
      </div>
    ),
    cell: ({ row, table }) => {
      const value = row.original.totalReturnSales;

      if (checkIsNull(value)) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {checkIsNull(value) === false
            ? displayValue(formatNum(value), false)
            : '-'}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'totalRefundFees'}
            totalData={footerData}
          />
        </div>
      );
    },
  };

export const AMAZON_PRODUCT_OVERALL_AD_SPEND_COLUMN: ColumnDef<IAmazonProfitabilityProductData> =
  {
    accessorKey: 'overallAdSpend',
    id: 'Overall Ad Spend',
    size: 100,
    header: () => (
      <div className={`commonHeader`} style={textCenterStyles}>
        Overall Ad Spend
      </div>
    ),
    cell: ({ row, table }) => {
      const value = row.original.overallAdSpend;

      if (checkIsNull(value)) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {checkIsNull(value) === false
            ? displayValue(formatNum(value), false)
            : '-'}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'overallAdSpend'}
            totalData={footerData}
          />
        </div>
      );
    },
  };

export const AMAZON_PRODUCT_OVERALL_SP_AD_SPEND_COLUMN: ColumnDef<IAmazonProfitabilityProductData> =
  {
    accessorKey: 'overallSpAdSpend',
    id: 'overallSpAdSpend',
    size: 100,
    header: () => (
      <div className={`commonHeader`} style={textCenterStyles}>
        SP Ad Spend
      </div>
    ),
    cell: ({ row, table }) => {
      const value = row.original.overallSpAdSpend;

      if (checkIsNull(value)) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {checkIsNull(value) === false
            ? displayValue(formatNum(value), false)
            : '-'}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'overallSpAdSpend'}
            totalData={footerData}
          />
        </div>
      );
    },
  };

export const AMAZON_PRODUCT_OVERALL_SB_AD_SPEND_COLUMN: ColumnDef<IAmazonProfitabilityProductData> =
  {
    accessorKey: 'overallSbAdSpend',
    id: 'overallSbAdSpend',
    size: 100,
    header: () => (
      <div className={`commonHeader`} style={textCenterStyles}>
        SB Ad Spend
      </div>
    ),
    cell: ({ row, table }) => {
      const value = row.original.overallSbAdSpend;
      if (checkIsNull(value)) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {checkIsNull(value) === false
            ? displayValue(formatNum(value), false)
            : '-'}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'overallSbAdSpend'}
            totalData={footerData}
          />
        </div>
      );
    },
  };

export const AMAZON_PRODUCT_OVERALL_SD_AD_SPEND_COLUMN: ColumnDef<IAmazonProfitabilityProductData> =
  {
    accessorKey: 'overallSdAdSpend',
    id: 'overallSdAdSpend',
    size: 100,
    header: () => (
      <div className={`commonHeader`} style={textCenterStyles}>
        SD Ad Spend
      </div>
    ),
    cell: ({ row, table }) => {
      const value = row.original.overallSdAdSpend;
      if (checkIsNull(value)) return <div className="no-data-view">-</div>;

      return (
        <div className={`commonCell`} style={textCenterStyles}>
          {checkIsNull(value) === false
            ? displayValue(formatNum(value), false)
            : '-'}
        </div>
      );
    },
    footer(props) {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <div className="commonFooter">
          <TableFooterItem
            isPercentage={false}
            isFraction={true}
            accessorKey={'overallSdAdSpend'}
            totalData={footerData}
          />
        </div>
      );
    },
  };

export const AMAZON_PROMOTION_COLUMN: ColumnDef<IAmazonProfitabilityOrder> = {
  accessorKey: 'promotion',
  id: 'Promotion',
  size: 100,
  header: () => (
    <div className={`commonHeader`} style={textCenterStyles}>
      Promotion
    </div>
  ),
  cell: ({ row, table }) => {
    const value = row.original.promotion;

    if (checkIsNull(value)) return <div className="no-data-view">-</div>;
    return (
      <div className={`commonCell`} style={textCenterStyles}>
        {checkIsNull(value) === false
          ? displayValue(formatNum(value), false)
          : '-'}
      </div>
    );
  },
  footer(props) {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div className="commonFooter">
        <TableFooterItem
          isPercentage={false}
          isFraction={true}
          accessorKey={'totalPromotion'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const amazonProfitabilityColumns = (
  isOrdersTable: boolean,
  isHome: boolean
): ColumnDef<IAmazonProfitabilityTableData>[] => {
  return isOrdersTable
    ? ([
        AMAZON_ORDER_ID_COLUMN,
        AMAZON_TOTAL_ORDER_UNITS,
        AMAZON_TOTAL_SALES,
        AMAZON_RETURN_ORDER_UNITS,
        AMAZON_COGS_COLUMN(true),
        AMAZON_FEES_COLUMN,
        AMAZON_REFUND_FEE,
        AMAZON_PROMOTION_COLUMN,
        ORDER_NET_PROFIT_COLUMN,
        ORDER_EST_PAYOUT,
        ORDER_ROI_COLUMN,
        ORDER_MARGIN_COLUMN,
        MORE_INFO_COLUMN as ColumnDef<IAmazonProfitabilityTableData>,
      ] as ColumnDef<IAmazonProfitabilityTableData>[])
    : ([
        AMAZON_PRODUCT_DETAILS(isHome),
        AMAZON_PRODUCT_OVERALL_AD_SPEND_COLUMN,
        AMAZON_PRODUCT_TOTAL_SALES_COLUMN,
        AMAZON_PRODUCT_TOTAL_UNITS_SOLD_COLUMN,
        AMAZON_RETURN_PRODUCTS_UNITS,
        AMAZON_PRODUCT_RETURN_PERCETANGE_COLUMN,
        AMAZON_COGS_COLUMN(false),
        AMAZON_FEES_COLUMN,
        AMAZON_PRODUCT_TOTAL_RETURN_FEES_COLUMN,
        AMAZON_PROMOTION_COLUMN,
        AMAZON_NET_PROFIT_COLUMN,
        EST_PAYOUT,
        ROI_COLUMN,
        MARGIN_COLUMN,
        MORE_INFO_COLUMN as ColumnDef<IAmazonProfitabilityTableData>,
      ] as ColumnDef<IAmazonProfitabilityTableData>[]);
};
