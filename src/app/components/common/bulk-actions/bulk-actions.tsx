import { padZeroToNumbers } from '@/utils';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  ArrowCounterClockwiseIcon,
  DotsSixVerticalIcon,
} from '@phosphor-icons/react';
import React from 'react';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import { IBulkAction } from 'src/interfaces/bulk-action.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectEditAccessFilters,
  selectSelectedRowIds,
  setSelectedRows,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import { clearButtonStyles } from './bulk-actions-styles';
import styles from './bulk-actions.module.scss';

interface IBulkActionsProps {
  isVisible: boolean;
  actions: IBulkAction[];
  hideClearAll?: boolean;
  totalItems: number | string;
}

export default function BulkActions({
  isVisible,
  actions,
  hideClearAll = false,
  totalItems,
}: IBulkActionsProps) {
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const dispatch = useAppDispatch();

  const handleClearAllClick = () => {
    dispatch(setSelectedRows({}));
  };

  return (
    editAccessFilters.editAccess.value === EditAccessValues.Edit &&
    isVisible && (
      <div className={styles.container}>
        <div className={styles.countContainer}>
          <Typography className={styles.countText}>
            <span className={styles.countNumber}>
              {padZeroToNumbers(selectedRowIds.length, true)}
            </span>{' '}
            {totalItems ? `of ${totalItems}` : ''} rows Selected
          </Typography>

          {hideClearAll === false && (
            <Button
              disableRipple
              startIcon={
                <ArrowCounterClockwiseIcon
                  size={14}
                  color="#77469B"
                  weight="bold"
                />
              }
              sx={clearButtonStyles}
              onClick={handleClearAllClick}
            >
              Clear All
            </Button>
          )}
        </div>

        <div className={styles.bulkActions}>
          <Typography className={styles.bulkActionsText}>
            Bulk Actions:
          </Typography>

          {actions.map((action, index) => (
            <React.Fragment key={action.key}>
              {index > 0 && (
                <DotsSixVerticalIcon size={14} color="#a7a7a7" weight="bold" />
              )}

              {action.node}
            </React.Fragment>
          ))}
        </div>
      </div>
    )
  );
}
