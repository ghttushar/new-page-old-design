import { ColumnDef } from '@tanstack/react-table';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';
import { BRAND_ANALYTICS_TOOLTIPS } from 'src/enums/tooltip-texts.enums';
import { IProductSOVTableData } from 'src/interfaces/product-sov.interface';
import { formatNum } from 'src/utils';
import { getProductUrl } from 'src/utils/advertising.utils';
import styles from '../../../common/sov-table/sov-table.module.scss';

export const productSovColumns = (
  title: string,
  marketplace: string
): Array<ColumnDef<IProductSOVTableData>> => {
  return [
    {
      accessorKey: 'asin',
      header: 'ASIN',
      minSize: 200,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return (
          <a
            className={styles.asinLink}
            href={`${getProductUrl(value, marketplace)}`}
            target="_blank"
            rel="noreferrer"
          >
            <p className={styles.asinText} title={value}>
              {title}
            </p>
          </a>
        );
      },
    },
    {
      accessorKey: 'keyword',
      header: 'Keyword',
      minSize: 200,
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return (
          <div className={styles.nameCell}>
            <p className={styles.nameText} title={value}>
              {value}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'label',
      minSize: 100,
      header: () => <div className={styles.header}>Label</div>,
    },
    {
      accessorKey: 'appearance',
      minSize: 160,
      cell: ({ getValue }) => `${formatNum(getValue<number>(), false)}%`,
      header: () => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          Appearance(%) <InfoIcon title={BRAND_ANALYTICS_TOOLTIPS.APPEARANCE} />
        </div>
      ),
    },
    {
      accessorKey: 'avgrank',
      minSize: 150,
      cell: ({ getValue }) => formatNum(getValue<number>(), false),
      header: () => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          Avg Rank <InfoIcon title={BRAND_ANALYTICS_TOOLTIPS.AVG_RANK} />
        </div>
      ),
    },
    {
      accessorKey: 'avgorganicrank',
      minSize: 160,
      cell: ({ getValue }) => formatNum(getValue<number>(), false),
      header: () => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          Avg Organic Rank{' '}
          <InfoIcon title={BRAND_ANALYTICS_TOOLTIPS.AVG_ORG_RANK} />
        </div>
      ),
    },
    {
      accessorKey: 'avgsponsoredrank',
      minSize: 180,
      cell: ({ getValue }) => formatNum(getValue<number>(), false),
      header: () => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          Avg Sponsored Rank{' '}
          <InfoIcon title={BRAND_ANALYTICS_TOOLTIPS.AVG_SP_RANK} />
        </div>
      ),
    },
  ];
};
