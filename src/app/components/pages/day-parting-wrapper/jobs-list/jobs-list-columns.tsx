import { ColumnDef } from '@tanstack/react-table';
import CampaignsList from 'src/app/components/page-components/campaigns-list/campaigns-list';
import { IJobCampaign, IJobs } from 'src/interfaces/day-parting.interfaces';
import { getFormattedCurrTimeZoneDate } from 'src/utils/datetime.utils';
import styles from './jobs-list.module.scss';

export const jobsListColumns: ColumnDef<IJobs>[] = [
  {
    accessorKey: '_id',
    id: '_id',
    size: 290,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Job ID
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      return <div className={styles.cell}>{value}</div>;
    },
  },
  {
    accessorKey: 'runAt',
    id: 'runAt',
    size: 250,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Started Date
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-data-view">-</div>;

      return (
        <div className={styles.cell} style={{ textAlign: 'center' }}>
          {getFormattedCurrTimeZoneDate(value)}
        </div>
      );
    },
  },
  {
    accessorKey: 'accountId',
    id: 'accountId',
    size: 250,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Account
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      return (
        <div
          className={styles.cell}
          style={{
            textAlign: 'center',
          }}
        >
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: 'isRecurring',
    id: 'isRecurring',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Recurring
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (value === null || value === undefined)
        return <div className="no-data-view">-</div>;

      return (
        <div
          className={styles.cell}
          style={{
            textAlign: 'center',
          }}
        >
          {value ? 'Yes' : 'No'}
        </div>
      );
    },
  },
  {
    accessorKey: 'campaigns',
    id: 'campaigns',
    size: 200,
    enableSorting: false,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Campaigns
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as IJobCampaign[];

      return (
        <div
          className={styles.cell}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CampaignsList campaigns={value} />
        </div>
      );
    },
  },
];
