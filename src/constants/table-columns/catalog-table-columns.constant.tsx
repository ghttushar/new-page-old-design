import ImgComponent from '@/app/components/common/img-component/img-component';
import TableFooterItem from '@/app/components/page-components/table-footer-item/table-footer-item';
import { imageUrls } from '@/constants/assets/images.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { ICatalogData } from '@/interfaces/catalog/walmart/walmart-catalog.interface';
import { ColumnDef } from '@tanstack/react-table';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';
import styles from 'src/app/components/page-components/catalog-table-wrapper/catalog-table-wrapper.module.scss';
import ProductDetails from 'src/app/components/pages/catalog-page/catalog-home/product-details/product-details';
import {
  CATALOG_METRICS_TOOLTIPS,
  TooltipPlacement,
} from 'src/enums/tooltip-texts.enums';
import { displayValue, formatNum } from 'src/utils';
import { CATALOG_PRIMARY_VARIANT_MAPPING } from '../advertising-walmart.constants';

export const PRODUCT_NAME: ColumnDef<ICatalogData> = {
  accessorKey: 'productName',
  id: 'Product Name',
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
        sku={row.original.sku}
        productName={row.original.productName}
        itemId={row.original.itemId}
        imageUrl={row.original.primaryImageUrl}
        getToggleExpandedHandler={row.getToggleExpandedHandler}
        canRowExpand={row.getCanExpand()}
        isRowExpanded={row.getIsExpanded()}
        marketplace={MarketplaceEnum.WALMART}
        depth={row.depth}
        fulfillmentType={row.original.fulfillmentType}
      />
    );
  },
};

export const IMPRESSIONS: ColumnDef<ICatalogData> = {
  accessorKey: 'impressions',
  id: 'Impressions',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Impressions{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.IMPRESSIONS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isUnit={true}
          isFraction={false}
          accessorKey={'impressions'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(row.original.impressions, false)}
      </div>
    );
  },
};

export const CLICKS: ColumnDef<ICatalogData> = {
  accessorKey: 'clicks',
  id: 'Clicks',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Clicks{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.CLICKS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isUnit={true}
          isFraction={false}
          accessorKey={'clicks'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(row.original.clicks, false)}
      </div>
    );
  },
};

export const CTR: ColumnDef<ICatalogData> = {
  accessorKey: 'ctr',
  id: 'CTR',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        CTR{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.CTR}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={true}
          isFraction={true}
          accessorKey={'ctr'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.ctr))}
      </div>
    );
  },
};

export const UNITS_SOLD: ColumnDef<ICatalogData> = {
  accessorKey: 'unitsSold',
  id: 'Ad Units',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Ad Units{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.AD_UNITS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isUnit={true}
          isFraction={false}
          accessorKey={'unitsSold'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(row.original.unitsSold, false)}
      </div>
    );
  },
};

export const AD_ORDERS: ColumnDef<ICatalogData> = {
  accessorKey: 'adOrders',
  id: 'Ad Orders',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Ad Orders{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.AD_ORDERS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isUnit={true}
          isFraction={false}
          accessorKey={'adOrders'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(row.original.adOrders, false)}
      </div>
    );
  },
};

export const CVR_UNITS: ColumnDef<ICatalogData> = {
  accessorKey: 'cvrUnitSoldBased',
  id: 'CVR (Units Based)',
  minSize: 200,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        CVR (Units Based){' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.CVR_UNITS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={true}
          isFraction={true}
          accessorKey={'cvrUnitSoldBased'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.cvrUnitSoldBased))}
      </div>
    );
  },
};

export const CVR_ORDERS: ColumnDef<ICatalogData> = {
  accessorKey: 'cvrOrderBased',
  id: 'CVR (Orders Based)',
  minSize: 200,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        CVR (Orders Based){' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.CVR_ORDERS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={true}
          isFraction={true}
          accessorKey={'cvrOrderBased'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.cvrOrderBased))}
      </div>
    );
  },
};

export const CPC: ColumnDef<ICatalogData> = {
  accessorKey: 'cpc',
  id: 'Avg. CPC',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Avg. CPC{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.CPC}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isFraction={true}
          accessorKey={'cpc'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.cpc), false)}
      </div>
    );
  },
};

export const AD_SPEND: ColumnDef<ICatalogData> = {
  accessorKey: 'adSpend',
  id: 'Ad Spend',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Ad Spend{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.AD_SPEND}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={false}
          accessorKey={'adSpend'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.adSpend), false)}
      </div>
    );
  },
};

export const AD_SALES: ColumnDef<ICatalogData> = {
  accessorKey: 'adSales',
  id: 'Ad Sales',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Ad Sales{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.AD_SALES}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={false}
          accessorKey={'adSales'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.adSales), false)}
      </div>
    );
  },
};

export const ROAS: ColumnDef<ICatalogData> = {
  accessorKey: 'roas',
  id: 'RoAS',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        RoAS{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.ROAS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={false}
          accessorKey={'roas'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.roas), false)}
      </div>
    );
  },
};

export const ACOS: ColumnDef<ICatalogData> = {
  accessorKey: 'acos',
  id: 'ACoS',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        ACoS{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.ACOS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isFraction={true}
          isPercentage={true}
          accessorKey={'acos'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.acos))}
      </div>
    );
  },
};

export const TACOS: ColumnDef<ICatalogData> = {
  accessorKey: 'tacos',
  id: 'TACoS',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        TACoS{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.TACOS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={true}
          isFraction={true}
          accessorKey={'tacos'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.tacos))}
      </div>
    );
  },
};

export const ADVERTISED: ColumnDef<ICatalogData> = {
  accessorKey: 'isAdvertised',
  id: 'Advertised (Yes/No)',
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
    if (!row.original.isAdvertised) return <div>-</div>;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {row.original.isAdvertised}
      </div>
    );
  },
};

export const CAMPAIGNS: ColumnDef<ICatalogData> = {
  accessorKey: 'campaigns',
  id: 'Campaigns',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Campaigns{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.CAMPAIGNS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    if (!row.original.campaigns) return <div>-</div>;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {row.original.campaigns}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isUnit={true}
          accessorKey={'campaigns'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const STATUS: ColumnDef<ICatalogData> = {
  accessorKey: 'publishStatus',
  id: 'Status',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Status{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.STATUS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },

  cell: (props) => {
    const { row } = props;

    if (!row.original.publishStatus) return <div>-</div>;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {row.original.publishStatus}
      </div>
    );
  },
};

export const REVIEWS_RATINGS: ColumnDef<ICatalogData> = {
  accessorKey: 'reviewsRatings',
  id: 'Reviews & Ratings',
  minSize: 200,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Reviews & Ratings{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.REVIEWS_RATINGS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left', gap: '1rem' }}
      >
        <TableFooterItem
          isUnit={true}
          accessorKey={'reviews'}
          totalData={footerData}
        />
        |
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <ImgComponent
            imageURL={imageUrls.starIcon}
            alt="star-icon"
            customStyles={{
              width: '1rem',
              height: '1rem',
              marginRight: '0.2rem',
            }}
          />{' '}
          <TableFooterItem
            isUnit={true}
            accessorKey={'ratings'}
            totalData={footerData}
          />
        </span>
      </div>
    );
  },

  enableSorting: false,
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(row.original.reviews, false)} |{' '}
        {row.original.ratings && (
          <ImgComponent
            imageURL={imageUrls.starIcon}
            alt="star-icon"
            customStyles={{
              width: '1rem',
              height: '1rem',
              marginRight: '0.2rem',
            }}
          />
        )}
        {formatNum(row.original.ratings, false)}
      </div>
    );
  },
};

export const BUY_BOX: ColumnDef<ICatalogData> = {
  accessorKey: 'buyBox ',
  id: 'Buy Box',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Buy Box{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.BUY_BOX}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },

  cell: (props) => {
    const { row } = props;

    if (!row.original.buyBox) return <div>-</div>;

    return (
      <div className={`commonCell ${styles.cell}`}>{row.original.buyBox}</div>
    );
  },
};

export const CATEGORY_PATH: ColumnDef<ICatalogData> = {
  accessorKey: 'categoryPath',
  id: 'Category Path',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Category Path{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.CATEGORY_PATH}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    if (!row.original.categoryPath)
      return <div className="no-data-view">-</div>;
    const parsedCategoryPath = JSON.parse(row.original.categoryPath);

    if (!parsedCategoryPath?.length)
      return <div className="no-data-view">-</div>;

    return (
      <div
        className={`commonCell ${styles.cell}`}
        style={{
          justifyContent: 'flex-start',
        }}
      >
        {parsedCategoryPath.join(' > ')}
      </div>
    );
  },
};

export const PRODUCT_SOV: ColumnDef<ICatalogData> = {
  accessorKey: 'productSov',
  id: 'Product SOV (Share of Voice)',
  minSize: 250,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Product SOV (Share of Voice){' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.PRODUCT_SOV}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.productSov))}
      </div>
    );
  },
};

export const LQS: ColumnDef<ICatalogData> = {
  accessorKey: 'lqs',
  id: 'LQS',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        LQS{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.LQS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(row.original.lqs)}
      </div>
    );
  },
};

export const PRICE: ColumnDef<ICatalogData> = {
  accessorKey: 'price',
  id: 'Price',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Price{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.PRICE}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },

  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.price), false)}
      </div>
    );
  },
};

export const WALMART_FEE: ColumnDef<ICatalogData> = {
  accessorKey: 'commission',
  id: 'Walmart Fee',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Walmart Fee{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.WALMART_FEE}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={false}
          accessorKey={'commission'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.commission), false)}
      </div>
    );
  },
};

export const COGS: ColumnDef<ICatalogData> = {
  accessorKey: 'cogs',
  id: 'COGS',
  minSize: 120,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        COGS{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.COGS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.cogs), false)}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={false}
          accessorKey={'cogs'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const GROSS_MARGIN: ColumnDef<ICatalogData> = {
  accessorKey: 'grossMargin',
  id: 'Gross Margin',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Gross Margin{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.GROSS_MARGIN}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.grossMargin), false)}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={false}
          accessorKey={'grossMargin'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const GROSS_MARGIN_PERCENTAGE: ColumnDef<ICatalogData> = {
  accessorKey: 'grossMarginPercentage',
  id: 'Gross Margin Percentage',
  minSize: 300,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Gross Margin Percentage{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.GROSS_MARGIN_PERCENTAGE}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.grossMarginPercentage), true)}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={true}
          accessorKey={'grossMarginPercentage'}
          totalData={footerData}
        />
      </div>
    );
  },
};
export const RETURNS: ColumnDef<ICatalogData> = {
  accessorKey: 'returns',
  id: 'Returns',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Returns{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.RETURNS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(row.original.returns, false)}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={false}
          accessorKey={'returns'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const IS_PRIMARY_VARIANT: ColumnDef<ICatalogData> = {
  accessorKey: 'primaryVariant',
  id: 'Primary Variant',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Primary Variant{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.PRIMARY_VARIANT}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const isPrimary = row.original.primaryVariant;

    if (!isPrimary) return <div className="no-data-view">-</div>;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {CATALOG_PRIMARY_VARIANT_MAPPING[isPrimary]}
      </div>
    );
  },
};

export const CANCELLED_SALES_PRICE: ColumnDef<ICatalogData> = {
  accessorKey: 'cancelledSalesPrice',
  id: 'Cancelled Sales',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Cancelled Sales{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.CANCELLED_SALES_PRICE}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={false}
          accessorKey={'cancelledSalesPrice'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.cancelledSalesPrice), false)}
      </div>
    );
  },
};

export const CANCELLED_UNITS: ColumnDef<ICatalogData> = {
  accessorKey: 'cancelledOrders',
  id: 'Cancelled Orders',
  minSize: 100,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Cancelled Units{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.CANCELLED_UNITS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isUnit={true}
          isFraction={false}
          accessorKey={'cancelledOrders'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.cancelledOrders;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(value, false)}
      </div>
    );
  },
};

export const PROMO_SPEND: ColumnDef<ICatalogData> = {
  accessorKey: 'promoSpend',
  id: 'Promo Spend',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Promo Spend{' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.PROMO_SPEND}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.promoSpend), false)}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isUnit={true}
          isFraction={false}
          accessorKey={'promoSpend'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const TOTAL_SALES: ColumnDef<ICatalogData> = {
  accessorKey: 'totalSales',
  id: 'Total Sales',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Total Sales
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.TOTAL_SALES}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={false}
          accessorKey={'totalSales'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.totalSales), false)}
      </div>
    );
  },
};

export const REFUND_SALES: ColumnDef<ICatalogData> = {
  accessorKey: 'refundSales',
  id: 'Refund Sales',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Refund Sales
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.REFUND_SALES}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem accessorKey={'refundSales'} totalData={footerData} />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const value = row.original.refundSales;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(value), false)}
      </div>
    );
  },
};

export const REFUND_UNITS: ColumnDef<ICatalogData> = {
  accessorKey: 'refundOrders',
  id: 'Refund Orders',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Refund Units
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.REFUND_UNITS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },

  cell: (props) => {
    const { row } = props;
    const value = row.original.refundOrders;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(value, false)}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isUnit={true}
          isFraction={false}
          accessorKey={'refundOrders'}
          totalData={footerData}
        />
      </div>
    );
  },
};
export const GROSS_SALES: ColumnDef<ICatalogData> = {
  accessorKey: 'grossSales',
  id: 'Gross Sales',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        GMV
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.GMV}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem accessorKey={'grossSales'} totalData={footerData} />
      </div>
    );
  },

  cell: (props) => {
    const { row } = props;
    const value = row.original.grossSales;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(value), false)}
      </div>
    );
  },
};
export const GROSS_UNITS: ColumnDef<ICatalogData> = {
  accessorKey: 'grossUnitsSold',
  id: 'Gross Units Sold',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Gross Units
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.GROSS_UNITS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },

  cell: (props) => {
    const { row } = props;
    const value = row.original.grossUnitsSold;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(value, false)}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isUnit={true}
          isFraction={false}
          accessorKey={'grossUnitsSold'}
          totalData={footerData}
        />
      </div>
    );
  },
};

export const TOTAL_UNITS: ColumnDef<ICatalogData> = {
  accessorKey: 'totalUnits',
  id: 'Total Units',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Total Units
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.TOTAL_UNITS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isUnit={true}
          isFraction={false}
          accessorKey={'totalUnits'}
          totalData={footerData}
        />
      </div>
    );
  },

  cell: (props) => {
    const { row } = props;
    const value = row.original.totalUnits;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(value, false)}
      </div>
    );
  },
};
export const INV_COUNT: ColumnDef<ICatalogData> = {
  accessorKey: 'availToSellQuantity',
  id: 'Inventory Count',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Inventory Count
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.INV_COUNT}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isUnit={true}
          isFraction={false}
          accessorKey={'availToSellQuantity'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(row.original.availToSellQuantity, false)}
      </div>
    );
  },
};
export const WFS_INV_COUNT: ColumnDef<ICatalogData> = {
  accessorKey: 'wfsInventory',
  id: 'WFS Inventory',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        WFS Inventory
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.WFS_INV_COUNT}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isUnit={true}
          isFraction={false}
          accessorKey={'wfsInventory'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(row.original.wfsInventory, false)}
      </div>
    );
  },
};
export const SELLER_INV_COUNT: ColumnDef<ICatalogData> = {
  accessorKey: 'sellerInventory',
  id: 'Seller Inventory',
  minSize: 150,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Seller Inventory
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.SELLER_INV_COUNT}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();

    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isUnit={true}
          isFraction={false}
          accessorKey={'sellerInventory'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {formatNum(row.original.sellerInventory, false)}
      </div>
    );
  },
};

export const INV_VALUE_COGS: ColumnDef<ICatalogData> = {
  accessorKey: 'inventoryValueCogs',
  id: 'Inventory Value (COGS)',
  minSize: 200,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Inventory Value (COGS){' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.INV_VALUE_COGS}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={false}
          accessorKey={'inventoryValueCogs'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.inventoryValueCogs), false)}
      </div>
    );
  },
};

export const INV_VALUE_RETAIL: ColumnDef<ICatalogData> = {
  accessorKey: 'inventoryValueRetail',
  id: 'Inventory Value (Retail)',
  minSize: 200,
  header: (props) => {
    return (
      <div className={`commonHeader ${styles.catalogHeader}`}>
        Inventory Value (Retail){' '}
        <InfoIcon
          title={CATALOG_METRICS_TOOLTIPS.INV_VALUE_RETAIL}
          position={TooltipPlacement.Top}
        />{' '}
      </div>
    );
  },
  footer: (props) => {
    const footerData = props.table.options.meta?.getFooterData();
    return (
      <div
        className={`commonHeader ${styles.productCountFooter}`}
        style={{ textAlign: 'left' }}
      >
        <TableFooterItem
          isPercentage={false}
          accessorKey={'inventoryValueRetail'}
          totalData={footerData}
        />
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;

    return (
      <div className={`commonCell ${styles.cell}`}>
        {displayValue(formatNum(row.original.inventoryValueRetail), false)}
      </div>
    );
  },
};
