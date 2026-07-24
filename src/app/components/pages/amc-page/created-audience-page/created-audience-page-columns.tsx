import { ColumnDef } from '@tanstack/react-table';
import AMCExecutedStatusBox from 'src/app/components/common/amc-executed-status-box/amc-executed-status-box';
import { IAMCCreatedAudienceData } from 'src/interfaces/amc.interfaces';
import { formatNum } from 'src/utils';
import {
  getFormattedTimezoneDateRange,
  getFormattedTimezoneDateTimeNoTimestamp,
} from 'src/utils/datetime.utils';
import styles from './created-audience-page.module.scss';

export const amcExecutedAudienceColumns: ColumnDef<IAMCCreatedAudienceData>[] =
  [
    {
      accessorKey: 'queryId.title',
      id: 'queryId.title',
      size: 300,
      header: (props) => {
        return (
          <div
            className={styles.header}
            style={{
              textAlign: 'left',
            }}
          >
            Audience Query
          </div>
        );
      },
      cell: (props) => {
        const { row } = props;

        return (
          <div className={styles.nameCell} style={{ textAlign: 'left' }}>
            <p
              className={styles.executedName}
              title={row.original.queryId?.title}
            >
              {row.original.queryId?.title}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'audienceExecutionName',
      id: 'audienceExecutionName',
      size: 250,
      header: (props) => {
        return (
          <div
            className={styles.header}
            style={{
              textAlign: 'left',
            }}
          >
            Audience Name
          </div>
        );
      },
      cell: (props) => {
        const value = props.getValue() as string;

        return (
          <div className={styles.nameCell} style={{ textAlign: 'left' }}>
            <p className={styles.executedName} title={value}>
              {value}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'dateRange',
      id: 'dateRange',
      size: 250,
      header: (props) => {
        return (
          <div
            className={styles.header}
            style={{
              textAlign: 'center',
            }}
          >
            Date Range
          </div>
        );
      },
      cell: (props) => {
        const { row } = props;
        const startDate = row.original.timeWindowStart;
        const endDate = row.original.timeWindowEnd;

        return (
          <div className={styles.nameCell} style={{ textAlign: 'center' }}>
            {getFormattedTimezoneDateRange(startDate, endDate)}
          </div>
        );
      },
    },
    {
      accessorKey: 'creationTime',
      id: 'creationTime',
      size: 200,
      header: (props) => {
        return (
          <div
            className={styles.header}
            style={{
              textAlign: 'center',
            }}
          >
            Submitted Date
          </div>
        );
      },
      cell: (props) => {
        const value = props.getValue() as string;

        return (
          <div className={styles.nameCell} style={{ textAlign: 'center' }}>
            {getFormattedTimezoneDateTimeNoTimestamp(value)}
          </div>
        );
      },
    },
    {
      accessorKey: 'audienceCount',
      id: 'audienceCount',
      size: 200,
      header: (props) => {
        return (
          <div
            className={styles.header}
            style={{
              textAlign: 'center',
            }}
          >
            Audience Size
          </div>
        );
      },
      cell: (props) => {
        const value = props.getValue() as string;

        return (
          <div className={styles.nameCell} style={{ textAlign: 'center' }}>
            {value ? `~${formatNum(value, false)}` : '~'}
          </div>
        );
      },
    },
    {
      accessorKey: 'audienceExecutionStatus',
      id: 'audienceExecutionStatus',
      size: 100,
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
        const value = props.getValue() as string;

        return (
          <div className={styles.nameCell} style={{ textAlign: 'center' }}>
            <AMCExecutedStatusBox status={value} />
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
            style={{
              textAlign: 'center',
            }}
          >
            Last Refreshed
          </div>
        );
      },
      cell: (props) => {
        const value = props.getValue() as string;

        return (
          <div className={styles.nameCell} style={{ textAlign: 'center' }}>
            {getFormattedTimezoneDateTimeNoTimestamp(value)}
          </div>
        );
      },
    },
  ];
