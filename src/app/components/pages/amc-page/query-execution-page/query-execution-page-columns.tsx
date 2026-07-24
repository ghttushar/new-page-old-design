import IconButton from '@mui/material/IconButton';
import { TrashIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { IAMCIncludedCampaignsTable } from 'src/interfaces/amc.interfaces';
import styles from './query-execution-page.module.scss';

export const includedCampaignsColumns = (
  handleDeleteCampaign: (id: number) => void
): ColumnDef<IAMCIncludedCampaignsTable>[] => [
  {
    accessorKey: 'campaignType',
    id: 'campaignType',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.tableHeader}
          style={{
            textAlign: 'left',
          }}
        >
          Campaign Type
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      return (
        <div className={styles.cell} style={{ textAlign: 'left' }}>
          <p
            className={styles.tableCellStyle}
            title={row.original.campaignType.label}
          >
            {row.original.campaignType.label}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'campaignName',
    id: 'campaignName',
    size: 350,
    header: (props) => {
      return (
        <div
          className={styles.tableHeader}
          style={{
            textAlign: 'left',
          }}
        >
          Campaign Name
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      return (
        <div className={styles.cell} style={{ textAlign: 'left' }}>
          <p
            className={styles.tableCellStyle}
            title={row.original.campaignName.label}
          >
            {row.original.campaignName.label}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'campaignGroup',
    id: 'campaignGroup',
    size: 150,
    header: (props) => {
      return (
        <div
          className={styles.tableHeader}
          style={{
            textAlign: 'left',
          }}
        >
          Group
        </div>
      );
    },
    cell: (props) => {
      const { row } = props;

      return (
        <div className={styles.cell} style={{ textAlign: 'left' }}>
          <p
            className={styles.tableCellStyle}
            title={row.original.campaignGroup.label}
          >
            {row.original.campaignGroup.label}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'action',
    id: 'action',
    size: 110,
    enableSorting: false,
    header: (props) => {
      return (
        <div
          className={styles.tableHeader}
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
        <div className={styles.cell} style={{ textAlign: 'center' }}>
          <IconButton
            disableRipple
            onClick={() => handleDeleteCampaign(row.original.id as number)}
          >
            <TrashIcon size={18} color="#77469b" weight="bold" />
          </IconButton>
        </div>
      );
    },
  },
];
