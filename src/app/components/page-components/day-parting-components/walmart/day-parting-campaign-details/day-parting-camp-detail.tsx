import { DATE_FORMAT_13 } from '@/constants/datetime.constants';
import { IDaypartingCampaignList } from '@/interfaces/day-parting.interfaces';
import { getFormattedTimezoneTimeRange } from '@/utils/datetime.utils';
import {
  getBidAdjustmentValueToDisplay,
  getHourOfDayToDisplay,
  getRecurrenceDataToDisplay,
} from '@/utils/day-parting.utils';
import styles from './day-parting-camp-details.module.scss';
export interface IDayPartingCampaignDetailsProps {
  campaign: IDaypartingCampaignList | null | undefined;
}
export default function DayPartingCampaignDetails(
  props: IDayPartingCampaignDetailsProps
) {
  const campaign = props.campaign;
  if (!campaign || campaign === null) return null;
  const job = campaign.associatedJobs[0];
  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <span className={styles.title}>Campaign Name:</span>
        <span
          style={{
            color: '#77469b',
          }}
        >
          {campaign.campaignName}
        </span>
      </div>

      <span className={styles.subContainer}>
        <span className={styles.title}>Rule Name:</span>

        <span
          style={{
            color: '#77469b',
          }}
        >
          {job.title !== undefined ? job.title : ''}
        </span>
      </span>

      <span className={styles.subContainer}>
        <span className={styles.title}>Bid Adjustment:</span>
        <span
          style={{
            color: '#77469b',
          }}
        >
          {getBidAdjustmentValueToDisplay(
            job.bidChange.type,
            job.bidChange.percentage
          )}
        </span>
      </span>

      <span className={styles.subContainer}>
        <span className={styles.title}>Date Range:</span>
        {getFormattedTimezoneTimeRange(
          job.startDate,
          job.endDate,
          '',
          DATE_FORMAT_13
        )}
      </span>

      <span className={styles.subContainer}>
        <span className={styles.title}>Recurrence:</span>
        {getRecurrenceDataToDisplay(job.recurrence.type, job.recurrence.days)}
      </span>

      <span className={styles.subContainer}>
        <span className={styles.title}>Hour of Day:</span>
        <span className={styles.hourOfDay}>
          {getHourOfDayToDisplay(job.schedules.timeRanges, job.schedules.type)}
        </span>
      </span>
    </div>
  );
}
