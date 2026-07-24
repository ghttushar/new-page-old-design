import { ColumnDef } from '@tanstack/react-table';
import { IAMCInstance } from 'src/interfaces/amc.interfaces';
import { getFormattedCurrTimeZoneDate } from 'src/utils/datetime.utils';
import styles from './instances-page.module.scss';

export const amcInstancesColumns: ColumnDef<IAMCInstance>[] = [
  {
    accessorKey: 'instanceName',
    id: 'instanceName',
    size: 200,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Instance Name
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      return (
        <div className={styles.cell} style={{ textAlign: 'left' }}>
          <p className={styles.instanceName}>{value}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'customerCanonicalName',
    id: 'customerCanonicalName',
    size: 250,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Account Name
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      return (
        <div className={styles.cell} style={{ textAlign: 'left' }}>
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: 'instanceId',
    id: 'instanceId',
    size: 180,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'left',
          }}
        >
          Instance ID
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      return (
        <div className={styles.cell} style={{ textAlign: 'left' }}>
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: 'creationDatetime',
    id: 'creationDatetime',
    size: 200,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Created Date
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      return (
        <div className={styles.cell} style={{ textAlign: 'center' }}>
          {getFormattedCurrTimeZoneDate(value)}
        </div>
      );
    },
  },
  {
    accessorKey: 'creationStatus',
    id: 'creationStatus',
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
      const value = props.getValue() as string;

      return (
        <div className={styles.cell} style={{ textAlign: 'center' }}>
          {value}
        </div>
      );
    },
  },
  {
    accessorKey: 'info',
    id: 'info',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.header}
          style={{
            textAlign: 'center',
          }}
        >
          Info
        </div>
      );
    },
    cell: (props) => {
      const value = props.getValue() as string;

      return (
        <div className={styles.cell}>
          <p className={styles.instanceInfo} style={{ textAlign: 'center' }}>
            More details
          </p>
        </div>
      );
    },
  },
];
