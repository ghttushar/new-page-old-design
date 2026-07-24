import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import { primaryColor } from '@/app/components/layout/side-bar/menu-item-component-styles';
import { SqsQueueNameEnum } from '@/enums/monitoring.enum';
import { ISQSQueue } from '@/interfaces/monitoring.interface';
import { formatNum, getSumOfTableArray } from '@/utils';
import { getFooterDisplayText } from '@/utils/advertising.utils';
import { ArrowSquareInIcon } from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router-dom';
import styles from 'src/app/components/pages/sqs-queue-info-page/sqs-queue-info-page.module.scss';

export const sqsQueueColumns = (props: {
  handlePurgeQueue: (queueUrl: SqsQueueNameEnum) => void;
  canEdit: boolean;
}): ColumnDef<ISQSQueue>[] => {
  const { handlePurgeQueue, canEdit } = props;

  return [
    {
      accessorKey: 'queueName',
      id: 'Queue Name',
      size: 200,
      header: () => (
        <div
          className={styles.tableHeader}
          style={{ textAlign: 'left', marginLeft: '1.6rem' }}
        >
          Queue Name
        </div>
      ),
      cell: ({ row }) => (
        <div
          className={styles.tableCell}
          style={{ wordBreak: 'break-all', justifyContent: 'start' }}
        >
          {row.original.queueName.replace(/_/g, ' ')}
          <Link target={'_blank'} to={row.original.sqsQueueConsoleUrl}>
            <HoverInfoTooltip title={'Go to AWS SQS'}>
              <ArrowSquareInIcon size={'1.8rem'} color={primaryColor} />
            </HoverInfoTooltip>
          </Link>
        </div>
      ),
      footer(props) {
        return (
          <div className={styles.tableCell} style={{ justifyContent: 'start' }}>
            {getFooterDisplayText(props, 'Queue')}
          </div>
        );
      },
    },

    {
      accessorKey: 'availableMessages',
      id: 'Available Messages',
      header: () => (
        <div className={styles.tableHeader} style={{ textAlign: 'center' }}>
          Available Messages
        </div>
      ),
      cell: ({ row }) => (
        <div className={styles.tableCell} style={{ textAlign: 'center' }}>
          {formatNum(row.original.availableMessages)}
        </div>
      ),
      footer: ({ table }) => {
        const total = getSumOfTableArray(
          table.getPrePaginationRowModel().rows,
          'availableMessages'
        );
        return (
          <div className={styles.tableCell} style={{ textAlign: 'center' }}>
            {formatNum(total)}
          </div>
        );
      },
    },
    {
      accessorKey: 'inFlightMessages',
      id: 'In-Flight Messages',
      header: () => (
        <div className={styles.tableHeader} style={{ textAlign: 'center' }}>
          In-Flight Messages
        </div>
      ),
      cell: ({ row }) => (
        <div className={styles.tableCell} style={{ textAlign: 'center' }}>
          {formatNum(row.original.inFlightMessages)}
        </div>
      ),
      footer: ({ table }) => {
        const total = getSumOfTableArray(
          table.getPrePaginationRowModel().rows,
          'inFlightMessages'
        );
        return (
          <div className={styles.tableCell} style={{ textAlign: 'center' }}>
            {formatNum(total)}
          </div>
        );
      },
    },
    {
      accessorKey: 'deduplicatedMessages',
      id: 'Deduplicated Messages',
      header: () => (
        <div className={styles.tableHeader} style={{ textAlign: 'center' }}>
          Deduplicated Messages
        </div>
      ),
      cell: ({ row }) => (
        <div className={styles.tableCell} style={{ textAlign: 'center' }}>
          {formatNum(row.original.deduplicatedMessages)}
        </div>
      ),
      footer: ({ table }) => {
        const total = getSumOfTableArray(
          table.getPrePaginationRowModel().rows,
          'deduplicatedMessages'
        );
        return (
          <div className={styles.tableCell} style={{ textAlign: 'center' }}>
            {formatNum(total)}
          </div>
        );
      },
    },
    {
      accessorKey: 'purge',
      id: 'Purge Queue',
      header: () => (
        <div className={styles.tableHeader} style={{ textAlign: 'center' }}>
          Purge
        </div>
      ),
      cell: ({ row }) => {
        return (
          <div className={styles.tableCell} style={{ textAlign: 'center' }}>
            <PrimaryButton
              buttonText={'Purge Queue'}
              buttonFunction={() => handlePurgeQueue(row.original.queueName)}
              disabled={!canEdit}
              width="auto"
              tooltipText={
                canEdit
                  ? 'Purge the Queue'
                  : 'Only Super Admins can purge the queue'
              }
              isHoverTooltipEnabled
            />
          </div>
        );
      },
    },
  ];
};
