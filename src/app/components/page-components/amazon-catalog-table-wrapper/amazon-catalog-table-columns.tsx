import TableFooterItem from '@/app/components/page-components/table-footer-item/table-footer-item';
import { AmazonCatalogColumnIdsEnum } from '@/enums/catalog.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IAmazonCatalogItem } from '@/interfaces/catalog/amazon/amazon-catalog.interface';
import {
  CoinsIcon,
  MegaphoneSimpleIcon,
  PackageIcon,
} from '@phosphor-icons/react';
import { ColumnDef, GroupColumnDef } from '@tanstack/react-table';

import { getMappedAmazonTableItemCondition } from '@/utils/advertising.utils';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';
import styles from 'src/app/components/page-components/catalog-table-wrapper/catalog-table-wrapper.module.scss';
import {
  CATALOG_METRICS_TOOLTIPS,
  TooltipPlacement,
} from 'src/enums/tooltip-texts.enums';
import { displayValue, formatNum } from 'src/utils';
import ProductDetails from '../../pages/catalog-page/catalog-home/product-details/product-details';

export const AMAZON_PRODUCT_NAME: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'itemName',
  id: AmazonCatalogColumnIdsEnum.PRODUCT_NAME,
  size: 500,
  enableSorting: false,
  header: (props) => {
    return <div></div>;
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div
        className={`commonHeader ${styles.productCountFooter} ${styles.totalProduct}`}
        style={{ textAlign: 'left' }}
      >
        <div>
          {' '}
          <div className={styles.totalProductHeading}>
            Total Products
            <InfoIcon
              title={CATALOG_METRICS_TOOLTIPS.TOTAL_PRODUCT}
              position={TooltipPlacement.Top}
            />
          </div>
          <TableFooterItem
            isUnit={true}
            isFraction={false}
            className={styles.productCount}
            accessorKey="totalProducts"
            totalData={footerData}
          />
        </div>
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const canSomeRowsExpand = props.table.getCanSomeRowsExpand();
    return (
      <ProductDetails
        canSomeRowsExpand={canSomeRowsExpand}
        sku={row.original.sellerSku}
        productName={row.original.itemName}
        itemId={row.original.asin}
        imageUrl={row.original.image}
        getToggleExpandedHandler={row.getToggleExpandedHandler}
        canRowExpand={row.getCanExpand()}
        isRowExpanded={row.getIsExpanded()}
        marketplace={MarketplaceEnum.AMAZON}
        depth={row.depth}
        fulfillmentType={row.original.fulfillmentChannel}
        upcCode={row.original.upcCode}
      />
    );
  },
};

export const AMAZON_LIST_PRICE: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'listPrice',
  id: AmazonCatalogColumnIdsEnum.LIST_PRICE,
  size: 100,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>List Price</span>
      <InfoIcon title={'Product list price'} position={TooltipPlacement.Top} />
    </div>
  ),
  cell: ({ row }) => {
    const listPrice = row.original.listPrice;
    if (listPrice == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(listPrice), false)}
      </div>
    );
  },
};

export const AMAZON_AD_SPEND: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'adSpend',
  id: AmazonCatalogColumnIdsEnum.AD_SPEND,
  size: 220,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader} whitespace-pre`}>
      <span>Ad Spend </span>
      <InfoIcon title={'Ad Spend'} position={TooltipPlacement.Top} />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isUnit={false}
        isFraction={false}
        accessorKey="adSpend"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const adSpend = row.original.adSpend;
    if (adSpend == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(adSpend), false)}
      </div>
    );
  },
};

export const AMAZON_AD_SALES: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'adSales',
  id: AmazonCatalogColumnIdsEnum.AD_SALES,
  size: 120,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Ad Sales</span>
      <InfoIcon title={'Ad Sales'} position={TooltipPlacement.Top} />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isUnit={false}
        isFraction={false}
        accessorKey="adSales"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const adSales = row.original.adSales;
    if (adSales == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(adSales), false)}
      </div>
    );
  },
};

export const AMAZON_ROAS: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'roas',
  id: AmazonCatalogColumnIdsEnum.ROAS,
  size: 100,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>ROAS</span>
      <InfoIcon
        title={'Return on advertising spend'}
        position={TooltipPlacement.Top}
      />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isFraction={false}
        accessorKey="roas"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const roas = row.original.roas;
    if (roas == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(roas), false)}
      </div>
    );
  },
};

export const AMAZON_ACOS: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'acos',
  id: AmazonCatalogColumnIdsEnum.ACOS,
  size: 100,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>ACoS</span>
      <InfoIcon
        title={'Advertising cost of sales'}
        position={TooltipPlacement.Top}
      />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isPercentage={true}
        accessorKey="acos"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const acos = row.original.acos;
    if (acos == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(acos))}
      </div>
    );
  },
};

export const AMAZON_TOTAL_SALES: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'totalSales',
  id: AmazonCatalogColumnIdsEnum.TOTAL_SALES,
  size: 100,
  header: () => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Total Sales</span>
      <InfoIcon title={'Total Sales'} position={TooltipPlacement.Top} />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isPercentage={false}
        accessorKey="totalSales"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const value = row.original.totalSales;
    if (value == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(value), false)}
      </div>
    );
  },
};
export const AMAZON_TOTAL_UNITS: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'totalUnits',
  id: AmazonCatalogColumnIdsEnum.TOTAL_UNITS,
  size: 100,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Total Units</span>
      <InfoIcon title={'Total Units'} position={TooltipPlacement.Top} />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isUnit={true}
        accessorKey="totalUnits"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const value = row.original.totalUnits;
    if (value == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(value, false)}
      </div>
    );
  },
};
export const AMAZON_TACOS: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'tacos',
  id: AmazonCatalogColumnIdsEnum.TACOS,
  size: 100,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>TACoS</span>
      <InfoIcon
        title={'Total advertising cost of sales'}
        position={TooltipPlacement.Top}
      />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isPercentage={true}
        accessorKey="tacos"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const tacos = row.original.tacos;
    if (tacos == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(tacos))}
      </div>
    );
  },
};

export const AMAZON_IMPRESSIONS: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'impressions',
  id: AmazonCatalogColumnIdsEnum.IMPRESSIONS,
  size: 200,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Impressions</span>
      <InfoIcon title={'Impressions'} position={TooltipPlacement.Top} />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isUnit={true}
        accessorKey="impressions"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const impressions = row.original.impressions;
    if (impressions == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(impressions, false)}
      </div>
    );
  },
};

export const AMAZON_CLICKS: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'clicks',
  id: AmazonCatalogColumnIdsEnum.CLICKS,
  size: 100,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Clicks</span>
      <InfoIcon title={'Clicks'} position={TooltipPlacement.Top} />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isUnit={true}
        accessorKey="clicks"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const clicks = row.original.clicks;
    if (clicks == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(clicks, false)}
      </div>
    );
  },
};

export const AMAZON_CTR: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'ctr',
  id: AmazonCatalogColumnIdsEnum.CTR,
  size: 100,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>CTR</span>
      <InfoIcon title={'Click-through rate'} position={TooltipPlacement.Top} />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isPercentage={true}
        accessorKey="ctr"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const ctr = row.original.ctr;
    if (ctr == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(ctr))}
      </div>
    );
  },
};

export const AMAZON_AVG_CPC: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'avgCpc',
  id: AmazonCatalogColumnIdsEnum.AVG_CPC,
  size: 120,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Avg CPC</span>
      <InfoIcon
        title={'Average cost per click'}
        position={TooltipPlacement.Top}
      />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isUnit={false}
        isFraction={false}
        accessorKey="avgCpc"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const avgCpc = row.original.avgCpc;
    if (avgCpc == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(avgCpc), false)}
      </div>
    );
  },
};

export const ADVERTISED: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'advertised',
  id: AmazonCatalogColumnIdsEnum.ADVERTISED,
  minSize: 200,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Advertised (Yes/No){' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.ADVERTISED}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },

  cell: (props) => {
    const { row } = props;
    const advertised = row.original.advertised;
    if (!advertised) {
      return <div className="no-data-view">-</div>;
    }

    return <div className={`commonCell ${styles.cell}`}>{advertised}</div>;
  },
};
export const CAMPAIGNS_COUNT: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'campaigns',
  id: AmazonCatalogColumnIdsEnum.CAMPAIGNS,
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Campaigns{' '}
        <InfoIcon title={'Campaigns'} position={TooltipPlacement.Top} />{' '}
      </div>
    );
  },

  cell: (props) => {
    const { row } = props;
    const value = row.original.campaigns;
    if (!value) {
      return <div className="no-data-view">-</div>;
    }

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(value, false)}
      </div>
    );
  },
};

export const AMAZON_CONDITION: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'condition',
  id: AmazonCatalogColumnIdsEnum.CONDITION,
  size: 120,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Condition</span>
      <InfoIcon title={'Product condition'} position={TooltipPlacement.Top} />
    </div>
  ),
  cell: ({ row }) => {
    const condition = row.original.condition;
    if (!condition) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {getMappedAmazonTableItemCondition(condition)}
      </div>
    );
  },
};

export const AMAZON_ON_HAND_QUANTITY: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'totalOnHandQuantity',
  id: AmazonCatalogColumnIdsEnum.TOTAL_ON_HAND_QUANTITY,
  size: 180,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>On Hand Quantity</span>
      <InfoIcon title={'On Hand Quantity'} position={TooltipPlacement.Top} />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isUnit={true}
        isFraction={false}
        accessorKey="totalOnHandQuantity"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const quantity = row.original.totalOnHandQuantity;
    if (quantity == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(quantity, false)}
      </div>
    );
  },
};

export const AMAZON_TOTAL_QUANTITY: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'totalQuantity',
  id: AmazonCatalogColumnIdsEnum.TOTAL_QUANTITY,
  size: 150,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Total Qty</span>
      <InfoIcon title={'Total quantity'} position={TooltipPlacement.Top} />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isUnit={true}
        isFraction={false}
        accessorKey="totalQuantity"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const quantity = row.original.totalQuantity;
    if (quantity == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(quantity, false)}
      </div>
    );
  },
};

export const AMAZON_TOTAL_INBOUND_QUANTITY: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'totalInboundQuantity',
  id: AmazonCatalogColumnIdsEnum.TOTAL_INBOUND,
  size: 150,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Inbound Quantity</span>
      <InfoIcon
        title={'Inbound inventory being processed'}
        position={TooltipPlacement.Top}
      />
    </div>
  ),
  cell: ({ row }) => {
    const quantity = row.original.totalInboundQuantity;
    if (quantity == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(quantity, false)}
      </div>
    );
  },
};

export const AMAZON_TOTAL_RESERVED_QUANTITY: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'totalReservedQuantity',
  id: AmazonCatalogColumnIdsEnum.RESERVED_QUANTITY,
  size: 160,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Reserved Qty</span>
      <InfoIcon title={'Reserved quantity'} position={TooltipPlacement.Top} />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isUnit={true}
        isFraction={false}
        accessorKey="totalReservedQuantity"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const quantity = row.original.totalReservedQuantity;
    if (quantity == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(quantity, false)}
      </div>
    );
  },
};

export const AMAZON_TOTAL_UNFULFILLABLE_QUANTITY: ColumnDef<IAmazonCatalogItem> =
  {
    accessorKey: 'totalUnfulfillableQuantity',
    id: AmazonCatalogColumnIdsEnum.UNFULFILLABLE_QUANTITY,
    size: 180,
    header: ({ column }) => (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        <span>Unfulfillable Qty</span>
        <InfoIcon
          title={'Unfulfillable quantity'}
          position={TooltipPlacement.Top}
        />
      </div>
    ),
    footer: (props) => {
      const footerData = props.table.options.meta?.getFooterData();
      return (
        <TableFooterItem
          isUnit={true}
          isFraction={false}
          accessorKey="totalUnfulfillableQuantity"
          totalData={footerData}
        />
      );
    },
    cell: ({ row }) => {
      const quantity = row.original.totalUnfulfillableQuantity;
      if (quantity == null) {
        return <div className="no-data-view">-</div>;
      }
      return (
        <div className={`commonCell ${styles.cell}`}>
          {formatNum(quantity, false)}
        </div>
      );
    },
  };

export const AMAZON_LAST_UPDATED_TIME: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'lastUpdatedTime',
  id: AmazonCatalogColumnIdsEnum.LAST_UPDATED,
  size: 150,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Last Updated</span>
      <InfoIcon
        title={'Last inventory update time'}
        position={TooltipPlacement.Top}
      />
    </div>
  ),
  cell: ({ row }) => {
    const lastUpdated = row.original.lastUpdatedTime;
    if (!lastUpdated) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {new Date(lastUpdated).toLocaleDateString()}
      </div>
    );
  },
};

export const AMAZON_FULFILLMENT_CHANNEL: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'fulfillmentChannel',
  id: AmazonCatalogColumnIdsEnum.FULFILLMENT_CHANNEL,
  size: 140,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Fulfillment</span>
      <InfoIcon
        title={'Fulfillment channel (FBA/FBM)'}
        position={TooltipPlacement.Top}
      />
    </div>
  ),
  cell: ({ row }) => {
    const channel = row.original.fulfillmentChannel;
    if (!channel) {
      return <div className="no-data-view">-</div>;
    }
    return <div className={`commonCell ${styles.cell}`}>{channel}</div>;
  },
};

export const AMAZON_AD_UNITS: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'adUnits',
  id: AmazonCatalogColumnIdsEnum.AD_UNITS,
  size: 120,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Ad Units</span>
      <InfoIcon
        title={'Units sold from advertising'}
        position={TooltipPlacement.Top}
      />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isUnit={true}
        accessorKey="adUnits"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const adUnits = row.original.adUnits;
    if (adUnits == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(adUnits, false)}
      </div>
    );
  },
};

export const AMAZON_AD_ORDERS: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'adOrders',
  id: AmazonCatalogColumnIdsEnum.AD_ORDERS,
  size: 120,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Ad Orders</span>
      <InfoIcon
        title={'Orders generated from advertising'}
        position={TooltipPlacement.Top}
      />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isUnit={true}
        accessorKey="adOrders"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const adOrders = row.original.adOrders;
    if (adOrders == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(adOrders, false)}
      </div>
    );
  },
};

export const AMAZON_CVR: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'cvr',
  id: AmazonCatalogColumnIdsEnum.CVR,
  size: 100,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>CVR</span>
      <InfoIcon title={'Conversion rate'} position={TooltipPlacement.Top} />
    </div>
  ),
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <TableFooterItem
        isPercentage={true}
        accessorKey="cvr"
        totalData={footerData}
      />
    );
  },
  cell: ({ row }) => {
    const cvr = row.original.cvr;
    if (cvr == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(cvr))}
      </div>
    );
  },
};

// Additional Detailed Inventory Columns

export const AMAZON_TOTAL_RESEARCHING_QUANTITY: ColumnDef<IAmazonCatalogItem> =
  {
    accessorKey: 'totalResearchingQuantity',
    id: AmazonCatalogColumnIdsEnum.TOTAL_RESEARCHING,
    size: 150,
    header: ({ column }) => (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        <span>Researching Qty</span>
        <InfoIcon
          title={'Researching quantity'}
          position={TooltipPlacement.Top}
        />
      </div>
    ),
    cell: ({ row }) => {
      const quantity = row.original.totalResearchingQuantity;
      if (quantity == null) {
        return <div className="no-data-view">-</div>;
      }
      return (
        <div className={`commonCell ${styles.cell}`}>
          {formatNum(quantity, false)}
        </div>
      );
    },
  };

export const AMAZON_FUTURE_SUPPLY_BUYABLE: ColumnDef<IAmazonCatalogItem> = {
  accessorKey: 'futureSupplyBuyableQuantity',
  id: AmazonCatalogColumnIdsEnum.FUTURE_SUPPLY_BUYABLE,
  size: 170,
  header: ({ column }) => (
    <div className={`commonHeader ${styles.catalogHeader}`}>
      <span>Future Buyable</span>
      <InfoIcon
        title={'Future supply buyable quantity'}
        position={TooltipPlacement.Top}
      />
    </div>
  ),
  cell: ({ row }) => {
    const quantity = row.original.futureSupplyBuyableQuantity;
    if (quantity == null) {
      return <div className="no-data-view">-</div>;
    }
    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(quantity, false)}
      </div>
    );
  },
};

export const amazonCatalogColumns: Array<ColumnDef<IAmazonCatalogItem>> = [
  {
    accessorKey: 'itemName',
    id: AmazonCatalogColumnIdsEnum.PRODUCT_DETAILS,
    header: () => {
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
    columns: [AMAZON_PRODUCT_NAME],
  } as GroupColumnDef<IAmazonCatalogItem>,
  {
    accessorKey: 'revenueCost',
    id: AmazonCatalogColumnIdsEnum.REVENUE_COST,
    header: () => {
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
    columns: [AMAZON_LIST_PRICE],
  } as GroupColumnDef<IAmazonCatalogItem>,
  {
    accessorKey: 'ads',
    id: AmazonCatalogColumnIdsEnum.ADS,
    header: () => {
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
      AMAZON_AD_SPEND,
      AMAZON_AD_SALES,
      AMAZON_AD_UNITS,
      AMAZON_AD_ORDERS,
      AMAZON_ROAS,
      AMAZON_ACOS,
      AMAZON_TACOS,
      AMAZON_TOTAL_SALES,
      AMAZON_TOTAL_UNITS,
      AMAZON_IMPRESSIONS,
      AMAZON_CLICKS,
      AMAZON_CTR,
      AMAZON_CVR,
      AMAZON_AVG_CPC,
      CAMPAIGNS_COUNT,
    ],
  } as GroupColumnDef<IAmazonCatalogItem>,
  {
    accessorKey: 'inventory',
    id: AmazonCatalogColumnIdsEnum.INVENTORY,
    header: () => {
      return (
        <div
          className={`commonHeader ${styles.groupHeader}`}
          style={{ textAlign: 'center' }}
        >
          <PackageIcon size={16} color="#444444" />
          Inventory
        </div>
      );
    },
    enableSorting: false,
    columns: [
      AMAZON_CONDITION,
      AMAZON_ON_HAND_QUANTITY,
      AMAZON_TOTAL_INBOUND_QUANTITY,
      AMAZON_TOTAL_RESERVED_QUANTITY,
      AMAZON_TOTAL_RESEARCHING_QUANTITY,
      AMAZON_TOTAL_UNFULFILLABLE_QUANTITY,
      AMAZON_LAST_UPDATED_TIME,
      AMAZON_FUTURE_SUPPLY_BUYABLE,
      AMAZON_TOTAL_QUANTITY,
    ],
  } as GroupColumnDef<IAmazonCatalogItem>,
];
