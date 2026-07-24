import InfoIcon from '@/app/components/common/info-icon/info-icon';
import DayPartingCampaignListView from '@/app/components/page-components/day-parting-components/day-parting-list-view/day-parting-campaign-list-view';
import { DayPartingTooltipEnum } from '@/enums/day-parting.enums';
import { ColumnDef } from '@tanstack/react-table';
import { IDaypartingTrigger } from 'src/interfaces/day-parting.interfaces';
import { getFormattedCurrTimeZoneDate } from 'src/utils/datetime.utils';
import styles from './scheduled-jobs-page.module.scss';

export const scheduledJobsColumns: ColumnDef<IDaypartingTrigger>[] = [
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
      const { row } = props;
      const value = row.original.jobId;

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
      const { row } = props;
      const value = row.original.title;

      return <div className={styles.cell}>{value}</div>;
    },
  },
  {
    accessorKey: 'campaigns',
    id: 'Selected Campaigns',
    size: 200,
    sortingFn: (a, b) => {
      if (a.original.campaigns.length < b.original.campaigns.length) return -1;
      else if (a.original.campaigns.length > b.original.campaigns.length)
        return 1;
      else return 0;
    },
    header: (props) => {
      return <div className={`commonHeader`}>Selected Campaigns</div>;
    },
    cell: (props) => {
      const { row } = props;
      return <DayPartingCampaignListView campaigns={row.original.campaigns} />;
    },
  },
  {
    accessorKey: 'nextChangeScheduled',
    id: 'nextChangeScheduled',
    size: 250,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
            display: 'flex',
          }}
        >
          Next Change Scheduled At
          <InfoIcon title={DayPartingTooltipEnum.NEXT_CHANGE_SCHEDULED} />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.nextChangeScheduled;

      return (
        <div className={styles.cell}>{getFormattedCurrTimeZoneDate(value)}</div>
      );
    },
  },
  {
    accessorKey: 'nextRevertScheduled',
    id: 'nextRevertScheduled',
    size: 250,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
            display: 'flex',
          }}
        >
          Next Revert Scheduled At
          <InfoIcon title={DayPartingTooltipEnum.NEXT_REVERT_SCHEDULED} />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.nextRevertScheduled;

      return (
        <div className={styles.cell}>{getFormattedCurrTimeZoneDate(value)}</div>
      );
    },
  },
  {
    accessorKey: 'currentChangeTriggerStatus',
    id: 'currentChangeTriggerStatus',
    size: 250,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
            display: 'flex',
          }}
        >
          Current Change Trigger Status
          <InfoIcon
            title={DayPartingTooltipEnum.CURRENT_CHANGE_TRIGGER_STATUS}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.currentChangeTriggerStatus;

      return <div className={styles.cell}>{value}</div>;
    },
  },

  {
    accessorKey: 'currentRevertTriggerStatus',
    id: 'currentRevertTriggerStatus',
    size: 250,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
            display: 'flex',
          }}
        >
          Current Revert Trigger Status
          <InfoIcon
            title={DayPartingTooltipEnum.CURRENT_REVERT_TRIGGER_STATUS}
          />
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const value = row.original.currentRevertTriggerStatus;
      return <div className={styles.cell}>{value}</div>;
    },
  },
];
