import IconButton from '@mui/material/IconButton';
import { TrashIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import ToggleSwitch from 'src/app/components/page-components/toggle-switch/toggle-switch';
import {
  AMCQueryExecutionType,
  AMCScheduleFrequency,
} from 'src/enums/amc.enums';
import { IAMCScheduleData } from 'src/interfaces/amc.interfaces';
import { getUTCTime } from 'src/utils';
import { navigateToQueryExecutionPage } from 'src/utils/amc.utils';
import styles from './schedule-page.module.scss';

export const amcExecutedQueriesColumns = (
  handleDeleteConfirmationToggle: (row: IAMCScheduleData) => void,
  handleUpdateSchedule: (value: boolean, row: IAMCScheduleData) => void
): ColumnDef<IAMCScheduleData>[] => [
  {
    accessorKey: 'workflowId',
    id: 'workflowId',
    size: 250,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Workflow ID
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      return (
        <div className={styles.nameCell} style={{ textAlign: 'center' }}>
          <p className={styles.executionId} title={value}>
            {value}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'scheduleName',
    id: 'scheduleName',
    size: 300,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Schedule Name
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;
      const { row } = props;

      return (
        <div className={styles.nameCell} style={{ textAlign: 'left' }}>
          <p
            className={styles.executedName}
            title={value}
            onClick={() =>
              navigateToQueryExecutionPage(
                row.original._id,
                row.original.workflowId,
                AMCQueryExecutionType.SCHEDULE
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
    accessorKey: 'scheduleFrequency',
    id: 'scheduleFrequency',
    size: 200,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Schedule Frequency
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      return (
        <div className={styles.nameCell} style={{ textAlign: 'center' }}>
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: 'timeDay',
    id: 'timeDay',
    size: 200,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Time/Day
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;
      const scheduleFrequency = row.original.scheduleFrequency;
      const scheduleTimeUTC = row.original.scheduleTimeUTC;
      const scheduleStartDay = row.original.scheduleStartDay;

      return (
        <div className={styles.nameCell} style={{ textAlign: 'center' }}>
          {scheduleFrequency.toLowerCase() ===
          AMCScheduleFrequency.DAILY.toLowerCase()
            ? `${getUTCTime(scheduleTimeUTC)}`
            : `${scheduleStartDay} - ${getUTCTime(scheduleTimeUTC)}`}
        </div>
      );
    },
  },
  {
    accessorKey: 'scheduleStatus',
    id: 'scheduleStatus',
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
      const status = props.getValue() as boolean;
      const { row } = props;

      const handleToggleEdit = (value: boolean) => {
        handleUpdateSchedule(value, row.original);
      };

      return (
        <ToggleSwitch
          isChecked={status}
          handleChange={(value) => handleToggleEdit(value)}
          isConfirmationRequired={true}
          confirmationBoxTitle="Update Schedule Status?"
          confirmationBoxDescription="Are you sure you want to update the schedule status?"
          confirmButtonText="Update"
        />
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
      const { row } = props;

      return (
        <IconButton
          disableRipple
          onClick={() => handleDeleteConfirmationToggle(row.original)}
        >
          <TrashIcon size={18} color="#77469B" weight="bold" />
        </IconButton>
      );
    },
  },
];
