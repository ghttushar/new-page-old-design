import { TrendUpIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import AltPrimaryButton from 'src/app/components/common/alt-primary-button/alt-primary-button';
import AMCExecutedStatusBox from 'src/app/components/common/amc-executed-status-box/amc-executed-status-box';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';
import { AMCQueryExecutionType } from 'src/enums/amc.enums';
import { IAMCWorkflowExecutionBaseExtended } from 'src/interfaces/amc.interfaces';
import {
  getExecutionCategory,
  navigateToQueryExecutionPage,
} from 'src/utils/amc.utils';
import {
  getFormattedTimezoneDateRange,
  getFormattedTimezoneDateTimeNoTimestamp,
} from 'src/utils/datetime.utils';
import styles from './executed-queries-page.module.scss';

export const amcExecutedQueriesColumns: ColumnDef<IAMCWorkflowExecutionBaseExtended>[] =
  [
    {
      accessorKey: 'executionName',
      id: 'executionName',
      size: 300,
      header: (props) => {
        return (
          <div
            className={styles.header}
            style={{
              textAlign: 'left',
            }}
          >
            Execution Name
          </div>
        );
      },
      cell: (props) => {
        const value = props.getValue() as string;
        const { row } = props;

        return (
          <div className={styles.nameCell}>
            <p
              className={styles.executedName}
              title={value}
              onClick={() =>
                navigateToQueryExecutionPage(
                  row.original.executionId,
                  row.original.workflowId,
                  AMCQueryExecutionType.ONCE
                )
              }
            >
              {value}
            </p>
          </div>
        );
      },
    },
    {
      accessorKey: 'query',
      id: 'query',
      size: 300,
      header: (props) => {
        return (
          <div
            className={styles.header}
            style={{
              textAlign: 'left',
            }}
          >
            Query Name
          </div>
        );
      },
      cell: (props) => {
        const { row } = props;

        return (
          <div className={styles.nameCell}>
            <p className={styles.workflowName} title={row.original.query.title}>
              {row.original.query.title}
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
      accessorKey: 'executionCategory',
      id: 'executionCategory',
      size: 150,
      header: (props) => {
        return (
          <div
            className={styles.header}
            style={{
              textAlign: 'center',
            }}
          >
            Execution Category
          </div>
        );
      },
      cell: (props) => {
        const value = props.getValue() as string;
        const executionCategoryData = getExecutionCategory(value);

        return (
          <div
            className={`${styles.nameCell} ${styles.categoryContainer}`}
            style={{ textAlign: 'center' }}
          >
            <p className={styles.categoryLabel}>
              {executionCategoryData.label}
            </p>
            <span style={{ marginTop: '0.2rem' }}>
              <InfoIcon title={executionCategoryData.tooltipText as string} />
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      id: 'status',
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
        const { row } = props;

        return (
          <div className={styles.nameCell} style={{ textAlign: 'center' }}>
            <AMCExecutedStatusBox
              status={value}
              statusReason={row.original.statusReason}
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'actions',
      id: 'actions',
      size: 150,
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
        const value = props.getValue() as string;
        const { row } = props;

        const navigateToReport = (
          executionId: string,
          executionName: string
        ) => {
          const url = `${window.location.pathname}/report/${executionId}/${executionName}`;
          window.open(url, '_blank');
        };

        return (
          <AltPrimaryButton
            buttonText={`View Report`}
            width="10rem"
            buttonFunction={() =>
              navigateToReport(
                row.original.executionId,
                row.original.executionName
              )
            }
            isButtonIconRequired={true}
            buttonIcon={
              <TrendUpIcon
                size={16}
                weight="bold"
                style={{ color: 'inherit' }}
              />
            }
            disabled={
              row.original.status.toLowerCase() !== 'completed' &&
              row.original.status.toLowerCase() !== 'success' &&
              row.original.status.toLowerCase() !== 'succeeded'
            }
          />
        );
      },
    },
  ];
