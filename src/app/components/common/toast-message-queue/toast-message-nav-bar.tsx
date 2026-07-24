import { TOAST_MESSAGE_TYPES } from '@/enums/toast.enums';
import { IconButton } from '@mui/material';
import {
  CaretLeftIcon,
  CaretRightIcon,
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
} from '@phosphor-icons/react';
import React from 'react';
import { IToastMessageState } from 'src/redux/slices/notifications/toast-message.slice';
import styles from './toast-message-queue.module.scss';

interface ToastMessageQueueControlsProps {
  totalCount: number;
  messages: IToastMessageState[];
  onPrevious: () => void;
  onNext: () => void;
  onCloseAll: () => void;
  areControlsDisabled: boolean;
}

const ToastMessageQueueControls: React.FC<ToastMessageQueueControlsProps> = ({
  totalCount,
  messages,
  onPrevious,
  onNext,
  onCloseAll,
  areControlsDisabled,
}) => {
  const toastIcons = (messages: IToastMessageState[]) => {
    const uniqueMessageTypes = [
      ...new Set(messages.map((message) => message.type)),
    ];
    return uniqueMessageTypes.map((type, index) => {
      switch (type) {
        case TOAST_MESSAGE_TYPES.SUCCESS:
          return (
            <CheckCircleIcon
              key={`${type}-${index}`}
              color="#26C26F"
              size={12}
              weight="fill"
            />
          );
        case TOAST_MESSAGE_TYPES.ERROR:
          return (
            <WarningCircleIcon
              key={`${type}-${index}`}
              color="#ff848c"
              size={12}
              weight="fill"
            />
          );
        case TOAST_MESSAGE_TYPES.WARNING:
          return (
            <WarningIcon
              key={`${type}-${index}`}
              color="#5D9EFF"
              size={12}
              weight="fill"
            />
          );
        case TOAST_MESSAGE_TYPES.INFO:
          return (
            <InfoIcon
              key={`${type}-${index}`}
              color="#FFAF38"
              size={12}
              weight="fill"
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <span
      className={styles.controlbar}
      style={{
        opacity: totalCount > 1 ? 1 : 0,
      }}
    >
      <div className={styles.messageCounter}>
        <span className={styles.messageCounter__icons}>
          {toastIcons(messages)}
        </span>
        <span>{totalCount}</span>
      </div>
      <div className={styles.controls}>
        <IconButton
          disableRipple
          className={styles.controls__button}
          onClick={onPrevious}
          style={{ padding: '0.3rem' }}
          sx={{
            '&.Mui-disabled': {
              background: '#d9d9d9',
              cursor: 'not-allowed !important',
            },
          }}
          disabled={areControlsDisabled}
        >
          <CaretLeftIcon size={12} color="#464646" weight="bold" />
        </IconButton>

        <IconButton
          disableRipple
          className={styles.controls__button}
          onClick={onNext}
          style={{ padding: '0.3rem' }}
          disabled={areControlsDisabled}
          sx={{
            '&.Mui-disabled': {
              background: '#d9d9d9',
              cursor: 'not-allowed !important',
            },
          }}
        >
          <CaretRightIcon size={12} color="#464646" weight="bold" />
        </IconButton>
        <div
          className={styles.controls__button}
          style={{
            width: 'auto',
            borderRadius: '0.8rem',
            padding: '0.6rem',
            textAlign: 'center',
            fontSize: '1rem',
            background: areControlsDisabled === true ? '#d9d9d9' : 'white',
            cursor: areControlsDisabled === true ? 'not-allowed' : 'pointer',
          }}
          onClick={() => {
            if (areControlsDisabled) return;

            onCloseAll();
          }}
        >
          Close All
        </div>
      </div>
    </span>
  );
};

export default ToastMessageQueueControls;
