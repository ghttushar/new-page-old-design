import DayPartingCampaignListView from '@/app/components/page-components/day-parting-components/day-parting-list-view/day-parting-campaign-list-view';
import {
  DaypartingJobStatusEnum,
  DaypartingJobTypeEnum,
} from '@/enums/day-parting.enums';
import {
  getColorByDayPartingJobStatus,
  getDayPartingJobStatusStyles,
} from '@/utils/day-parting.utils';
import { ColumnDef } from '@tanstack/react-table';
import {
  IDaypartingHistory,
  IJobCampaign,
} from 'src/interfaces/day-parting.interfaces';
import { getFormattedCurrTimeZoneDate } from 'src/utils/datetime.utils';
import { HistoryActions } from './history-page-amazon/history-page-amazon';
import styles from './history-page.module.scss';

export const dayPartingHistoryColumns: ColumnDef<IDaypartingHistory>[] = [
  {
    accessorKey: 'jobId',
    id: 'jobId',
    size: 250,
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
    accessorKey: 'title',
    id: 'title',
    size: 250,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Title
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      if (!value) return <div className="no-date-view">-</div>;

      return <div className={styles.cell}>{value}</div>;
    },
  },
  {
    accessorKey: 'daypartingJobType',
    id: 'daypartingJobType',
    size: 100,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Job Type
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as DaypartingJobTypeEnum;

      if (!value) return <div className="no-data-view">-</div>;

      return (
        <div style={getDayPartingJobStatusStyles('#77469b')}>
          {value.toUpperCase()}
        </div>
      );
    },
  },
  {
    accessorKey: 'campaigns',
    id: 'campaigns',
    size: 200,
    sortingFn: (a, b) => {
      if (a.original.campaigns.length < b.original.campaigns.length) return -1;
      else if (a.original.campaigns.length > b.original.campaigns.length)
        return 1;
      else return 0;
    },
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
      const { row } = props;

      return (
        <div
          className={styles.cell}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DayPartingCampaignListView
            campaigns={row.original.campaigns.map((item) => item.campaignId)}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    id: 'status',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Status
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as DaypartingJobStatusEnum;
      const color = getColorByDayPartingJobStatus(value);

      if (!value) return <div className="no-data-view">-</div>;

      return (
        <div style={getDayPartingJobStatusStyles(color)}>
          {value.toUpperCase()}
        </div>
      );
    },
  },

  {
    accessorKey: 'createdAt',
    id: 'createdAt',
    size: 250,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Created At
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
    accessorKey: 'updatedAt',
    id: 'updatedAt',
    size: 250,

    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Updated At
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
    accessorKey: 'triggeredAt',
    id: 'triggeredAt',
    size: 250,

    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Triggered At
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
    accessorKey: 'actions',
    id: 'actions',
    size: 100,
    enableSorting: false,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Actions
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      return (
        <div
          className={styles.cell}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <HistoryActions id={row.original._id} />
        </div>
      );
    },
  },
];

export const historyCampaignsColumn: ColumnDef<IJobCampaign>[] = [
  {
    accessorKey: 'campaignId',
    id: 'campaignId',
    size: 250,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Campaign ID
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;
      return <div className={styles.cell}>{value}</div>;
    },
  },
  {
    accessorKey: 'changeInPercentage',
    id: 'changeInPercentage',
    size: 250,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Change In Percentage ( % )
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;
      return <div className={styles.cell}>{value}</div>;
    },
  },
];
