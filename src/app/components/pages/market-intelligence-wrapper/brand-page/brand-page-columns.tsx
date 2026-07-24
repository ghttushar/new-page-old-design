import ImgComponent from '@/app/components/common/img-component/img-component';
import { imageUrls } from '@/constants/assets/images.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import Typography from '@mui/material/Typography';
import { ColumnDef } from '@tanstack/react-table';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';
import { BRAND_ANALYTICS_TOOLTIPS } from 'src/enums/tooltip-texts.enums';
import { IBrandAnalyticsProductData } from 'src/interfaces/brand-analytics.interfaces';
import { formatNum, getCurrencySymbolByCountry } from 'src/utils';
import { getProductImgUrl, getProductUrl } from 'src/utils/advertising.utils';
import styles from '../../../page-components/brand-sov-table/brand-sov-table.module.scss';

export const brandColumns = (
  marketplace: string
): ColumnDef<IBrandAnalyticsProductData>[] => [
  {
    accessorKey: 'title',
    id: 'title',
    size: 250,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{ display: 'flex', alignItems: 'flex-start' }}
        >
          Product
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = props.getValue();

      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            fontWeight: 'bold',
          }}
        >
          <ImgComponent
            imageURL={getProductImgUrl(row.original.product_id)}
            alt="bed-icon"
            className={styles.imageStyles}
            isProduct={true}
          />
          <div className={styles.productNameContainer}>
            <a
              className={styles.productTitle}
              href={getProductUrl(row.original.product_id, marketplace)}
              target="_blank"
              rel="noreferrer"
              data-test="product-name-product-sov"
            >
              <p title={`${value ?? row.original.product_id}`}>{`${
                value ?? row.original.product_id
              }`}</p>
            </a>
            <Typography
              variant="subtitle1"
              fontSize="1rem"
              fontWeight={400}
              className={styles.productSubtitle}
            >
              {marketplace === MarketplaceEnum.AMAZON ? 'ASIN' : 'Product ID'}:{' '}
              {row.original.product_id}
            </Typography>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'appearance',
    id: 'appearance',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'normal',
            lineHeight: '1.2',
          }}
        >
          Appearance(%)
          <InfoIcon title={BRAND_ANALYTICS_TOOLTIPS.APPEARANCE} />
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          {formatNum(value, false)}%
        </div>
      );
    },
  },
  {
    accessorKey: 'latest_sale_price',
    id: 'latest_sale_price',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'normal',
            lineHeight: '1.2',
          }}
        >
          Price({getCurrencySymbolByCountry()})
          <InfoIcon title={BRAND_ANALYTICS_TOOLTIPS.PRICE} />
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          ${formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'latest_stars',
    id: 'latest_stars',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'normal',
            lineHeight: '1.2',
          }}
        >
          Rating & Reviews
          <InfoIcon title={BRAND_ANALYTICS_TOOLTIPS.RATING_REVIEW} />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
          }}
        >
          <ImgComponent
            imageURL={imageUrls.starIcon}
            alt="star-icon"
            customStyles={{
              width: '1rem',
              height: '1rem',
              marginRight: '0.2rem',
            }}
          />
          {formatNum(row.original.latest_stars, false)} |{' '}
          {formatNum(row.original.latest_rating_count, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'avg_rank',
    id: 'avg_rank',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'normal',
            lineHeight: '1.2',
          }}
        >
          Avg Rank
          <InfoIcon title={BRAND_ANALYTICS_TOOLTIPS.AVG_RANK} />
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'avg_organic_rank',
    id: 'avg_organic_rank',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'normal',
            lineHeight: '1.2',
          }}
        >
          Avg Org Rank
          <InfoIcon title={BRAND_ANALYTICS_TOOLTIPS.AVG_ORG_RANK} />
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
  {
    accessorKey: 'avg_sponsored_rank',
    id: 'avg_sponsored_rank',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'normal',
            lineHeight: '1.2',
          }}
        >
          Avg Sponsored Rank
          <InfoIcon title={BRAND_ANALYTICS_TOOLTIPS.AVG_SP_RANK} />
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      return (
        <div style={{ width: '100%', textAlign: 'center' }}>
          {formatNum(value, false)}
        </div>
      );
    },
  },
];
