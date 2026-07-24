import ColumnTags from '@/app/components/common/column-tags/column-tags';
import DayPartingActions from '@/app/components/page-components/day-parting-components/day-parting-actions/day-parting-actions';
import DayPartingStatus from '@/app/components/page-components/day-parting-components/day-parting-actions/day-parting-status';
import DayPartingCampaignListView from '@/app/components/page-components/day-parting-components/day-parting-list-view/day-parting-campaign-list-view';
import DayPartingTimeRangeListView from '@/app/components/page-components/day-parting-components/day-parting-list-view/day-parting-time-range-list-view';
import { AD_TYPE_MAPPING } from '@/constants/advertising-filter.constants';
import { AdTypeShort } from '@/enums/advertising.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { ColumnDef } from '@tanstack/react-table';
import {
  DATE_FORMAT_15,
  DATE_FORMAT_2,
  DATE_FORMAT_3,
} from 'src/constants/datetime.constants';
import {
  DaypartingBidChangeTypeEnum,
  DaypartingRecurrenceDaysEnum,
  DaypartingRecurrenceTypeEnum,
} from 'src/enums/day-parting.enums';
import {
  IDayPartingCampaignsList,
  IDaypartingJob,
  IDaypartingTimeRange,
} from 'src/interfaces/day-parting.interfaces';
import {
  convertUtcToTimezoneDate,
  getFormattedDay,
  getFormattedTimezoneTimeRange,
} from 'src/utils/datetime.utils';
import styles from './day-parting-campaigns-page.module.scss';
//

const headerStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const JOB_STATUS_COLUMN: ColumnDef<IDaypartingJob> = {
  accessorKey: 'jobStatus',
  id: 'Job Status',
  size: 110,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={headerStyles}>
        Job Status
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return (
      <DayPartingStatus
        originalStatus={row.original.jobStatus}
        id={row.original._id}
      />
    );
  },
};

export const TITLE_COLUMN: ColumnDef<IDaypartingJob> = {
  accessorKey: 'title',
  id: 'Rule Name',
  size: 300,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={headerStyles}>
        Rule Name
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const adType =
      AD_TYPE_MAPPING[row.original.adType?.toUpperCase() ?? AdTypeShort.All];

    const marketplace =
      localStorageUtils.getSelectedAdvertisingAccount()?.marketplace;
    return (
      <div className={styles.titleContainer}>
        <p className={styles.titleName} title={row.original.title}>
          {row.original.title}
        </p>
        {marketplace === MarketplaceEnum.WALMART && (
          <ColumnTags tagArray={[adType?.toUpperCase()]} />
        )}
      </div>
    );
  },
};

export const CAMPAIGNS_COLUMN: ColumnDef<IDaypartingJob> = {
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
    return (
      <div className={`commonHeader`} style={headerStyles}>
        Selected Campaigns
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return <DayPartingCampaignListView campaigns={row.original.campaigns} />;
  },
};

export const CREATED_AT_COLUMN: ColumnDef<IDaypartingJob> = {
  accessorKey: 'createdAt',
  id: 'Date Created',
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={headerStyles}>
        Date Created
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return `${convertUtcToTimezoneDate(
      row.original.createdAt,
      DATE_FORMAT_15
    )}`;
  },
};

export const CAMPAIGN_NUMBER_COLUMN: ColumnDef<IDayPartingCampaignsList> = {
  accessorKey: 'serialNumber',
  id: 'S.No.',
  size: 100,
  maxSize: 100,
  enableSorting: false,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={headerStyles}>
        S.No.
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return row.index + 1;
  },
};

export const DP_CAMPAIGN_NAME_COLUMN: ColumnDef<IDayPartingCampaignsList> = {
  accessorKey: 'campaignName',
  id: 'Campaign Name',
  size: 250,
  enableSorting: true,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={headerStyles}>
        Campaign Name
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return <div style={headerStyles}>{row.original.campaignName}</div>;
  },
};

export const CAMPAIGN_ID_COLUMN: ColumnDef<IDayPartingCampaignsList> = {
  accessorKey: 'campaignId',
  id: 'Campaign Id',
  size: 100,
  enableSorting: true,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={headerStyles}>
        Campaign ID
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    return row.original.campaignId;
  },
};

export const START_DATE_COLUMN: ColumnDef<IDaypartingJob> = {
  accessorKey: 'startDate',
  id: 'Date Range',
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={headerStyles}>
        Date Range
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const startDate = row.original.startDate;
    const endDate = row.original.endDate;
    return `${getFormattedTimezoneTimeRange(
      startDate,
      endDate,
      DATE_FORMAT_3,
      DATE_FORMAT_2
    )}`;
  },
};

export const RECURRENCE_COLUMN: ColumnDef<IDaypartingJob> = {
  accessorKey: 'recurrence',
  id: 'Recurrence',
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={headerStyles}>
        Recurrence
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const type = row.original.recurrence.type;
    const days: DaypartingRecurrenceDaysEnum[] =
      row.original.recurrence.days ?? [];

    if (type === DaypartingRecurrenceTypeEnum.DAILY) {
      return 'Daily';
    } else if (
      type === DaypartingRecurrenceTypeEnum.WEEKLY &&
      days.length > 0
    ) {
      return `${days.map((day) => getFormattedDay(day)).join(', ')}`;
    } else {
      return <p className={styles.noDataView}>-</p>;
    }
  },
};

export const TIME_RANGE_COLUMN: ColumnDef<IDaypartingJob> = {
  accessorKey: 'timeRange',
  id: 'Hours of Day',
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={headerStyles}>
        Hours of Day
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const type = row.original.recurrence.type;
    const timeRangeType = row.original.schedules.type;
    const timeRanges: IDaypartingTimeRange[] =
      row.original.schedules.timeRanges.map((range: IDaypartingTimeRange) => {
        return {
          startTime: range.startTime,
          endTime: range.endTime,
        };
      });

    return (
      <DayPartingTimeRangeListView
        type={type}
        ranges={timeRanges}
        timeRangeType={timeRangeType}
      />
    );
  },
};

export const BID_CHANGE_COLUMN: ColumnDef<IDaypartingJob> = {
  accessorKey: 'bidChange',
  id: 'Bid Adjustment',
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={headerStyles}>
        Bid Adjustment
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const type = row.original.bidChange.type;
    const percentage = row.original.bidChange.percentage;
    const typeLabel =
      type === DaypartingBidChangeTypeEnum.INCREASE
        ? 'Increase by'
        : 'Decrease by';

    return `${typeLabel} ${percentage}%`;
  },
};

export const ACTION_COLUMN: ColumnDef<IDaypartingJob> = {
  accessorKey: 'actions',
  id: 'Action',
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={headerStyles}>
        Action
      </div>
    );
  },
  cell: (props) => {
    const { row } = props;
    const adType = row.original.adType as AdTypeShort;
    return (
      <DayPartingActions
        id={row.original._id}
        jobStatus={row.original.jobStatus}
        adType={adType ?? AdTypeShort.SPONSORED_PRODUCTS}
      />
    );
  },
};

export const newDaypartingCampaignColumns: ColumnDef<IDaypartingJob>[] = [
  JOB_STATUS_COLUMN,
  TITLE_COLUMN,
  CAMPAIGNS_COLUMN,
  CREATED_AT_COLUMN,
  START_DATE_COLUMN,
  RECURRENCE_COLUMN,
  TIME_RANGE_COLUMN,
  BID_CHANGE_COLUMN,
  ACTION_COLUMN,
];
