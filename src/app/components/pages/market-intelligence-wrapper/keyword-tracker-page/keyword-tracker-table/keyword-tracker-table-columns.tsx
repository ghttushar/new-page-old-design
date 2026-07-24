import { CountryListWrapper } from '@/app/components/page-components/keyword-tracker-components/country-list-comp/country-list-comp';
import { ColumnDef } from '@tanstack/react-table';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';
import MarketplaceIconList from 'src/app/components/common/marketplace-icon-list/marketplace-icon-list';
import DeleteKeyword from 'src/app/components/page-components/keyword-tracker-components/delete-keyword/delete-keyword';
import { DATE_FORMAT_20 } from 'src/constants/datetime.constants';
import { KEYWORD_TRACKER_TOOLTIPS } from 'src/enums/tooltip-texts.enums';
import { IChannel, ISerpKeyword } from 'src/interfaces/serp.interface';
import { getFormattedCurrTimeZoneDate } from 'src/utils/datetime.utils';
import ToggleStatus from '../../../../page-components/keyword-tracker-components/toggle-status/toggle-status';
import styles from './keyword-tracker-table.module.scss';

export const keywordTrackerColumns = (
  selectedMarketplace: string,
  countryCode?: string
): ColumnDef<ISerpKeyword>[] => [
  {
    accessorKey: 'keyword',
    id: 'keyword',
    size: 350,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{ display: 'flex', alignItems: 'flex-start' }}
        >
          Keyword
          <InfoIcon title={KEYWORD_TRACKER_TOOLTIPS.KEYWORD} />
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            fontWeight: '500',
          }}
        >
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    size: 200,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          Added At
          <InfoIcon title={KEYWORD_TRACKER_TOOLTIPS.CREATED_AT} />
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '500',
          }}
        >
          {getFormattedCurrTimeZoneDate(value, DATE_FORMAT_20, countryCode)}
        </div>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    size: 200,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          Updated At
          <InfoIcon title={KEYWORD_TRACKER_TOOLTIPS.UPDATED_AT} />
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '500',
          }}
        >
          {getFormattedCurrTimeZoneDate(value, DATE_FORMAT_20, countryCode)}
        </div>
      );
    },
  },
  {
    accessorKey: 'channels',
    id: 'countryCode',
    size: 200,
    enableSorting: false,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          Region
          <InfoIcon title={KEYWORD_TRACKER_TOOLTIPS.REGION} />
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as IChannel[];

      const countryCodes = value.flatMap((item) => item.countryCodes);

      if (value === null || value === undefined)
        return <div className={styles.noDataView}>-</div>;

      return <CountryListWrapper countryCodes={countryCodes} />;
    },
  },
  {
    accessorKey: 'channels',
    id: 'channels',
    size: 180,
    sortingFn: (v1, v2) => {
      if (v1.original.channels.length > v2.original.channels.length) {
        return 1;
      } else if (v1.original.channels.length < v2.original.channels.length) {
        return -1;
      } else {
        if (v1 > v2) {
          return 1;
        } else if (v1 < v2) {
          return -1;
        }
      }
      return 0;
    },
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          Channels
          <InfoIcon title={KEYWORD_TRACKER_TOOLTIPS.CHANNELS} />
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue();

      if (value === null || value === undefined || value === '-')
        return <div className={styles.noDataView}>-</div>;

      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MarketplaceIconList
            channels={value as IChannel[]}
            selectedMarketplace={selectedMarketplace}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    id: 'isActive',
    size: 100,
    enableSorting: false,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          Status
          <InfoIcon title={KEYWORD_TRACKER_TOOLTIPS.STATUS} />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '500',
          }}
        >
          <ToggleStatus rowData={row.original} />
        </div>
      );
    },
  },
  {
    accessorKey: 'actions',
    id: 'actions',
    size: 100,
    enableSorting: false,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          Action
          <InfoIcon title={KEYWORD_TRACKER_TOOLTIPS.ACTIONS} />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const rowIndex = row.index;

      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '500',
          }}
        >
          <DeleteKeyword rowData={row.original} countryCode={countryCode} />
        </div>
      );
    },
  },
];
