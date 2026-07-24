import { TOAST_MESSAGE_BORDER_COLOR_MAPPING } from '@/constants/advertising-filter.constants';
import { useAppDispatch } from '@/redux/hooks';
import { checkErrorDetailsExist } from '@/utils/toast-message.utils';
import { Button, IconButton } from '@mui/material';
import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
  XIcon,
} from '@phosphor-icons/react';
import React, { useState } from 'react';
import { TOAST_MESSAGE_TYPES } from 'src/enums/toast.enums';
import {
  IToastMessageState,
  resetToastMessageAutoClearTimer,
} from 'src/redux/slices/notifications/toast-message.slice';
import ToastErrorPopup from './toast-error-popup';
import { errorButtonStyles } from './toast-message-styles';
import styles from './toast-message.module.scss';

export interface IToastMessageProps extends IToastMessageState {
  closeToast: () => void;
  totalCount: number;
  currentIndex: number;
  style?: React.CSSProperties;
  'data-index': number;
  hovered: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
  areControlsDisabled: boolean;
  setAreControlsDisabled: (areControlsDisabled: boolean) => void;
}

const ToastMessage: React.FC<IToastMessageProps> = ({
  closeToast,
  title,
  description,
  errData,
  type,
  totalCount,
  currentIndex,
  hovered,
  style,
  'data-index': dataIndex,
  handleMouseEnter,
  handleMouseLeave,
  areControlsDisabled,
  setAreControlsDisabled,
}) => {
  const [openError, setOpenError] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleErrorToggle = () => {
    if (openError) handleCloseError();
    else handleOpenError();
  };
  const handleOpenError = () => {
    setOpenError(true);
    handleMouseEnter();
    setAreControlsDisabled(true);
  };
  const handleCloseError = () => {
    setOpenError(false);
    handleMouseLeave();
    setAreControlsDisabled(false);
    dispatch(resetToastMessageAutoClearTimer({ index: dataIndex }));
  };

  const toastIcon = (): React.ReactNode => {
    if (type === TOAST_MESSAGE_TYPES.SUCCESS) {
      return <CheckCircleIcon color="#26C26F" size={32} weight="fill" />;
    } else if (type === TOAST_MESSAGE_TYPES.ERROR) {
      return <WarningCircleIcon color="#FF848C" size={32} weight="fill" />;
    } else if (type === TOAST_MESSAGE_TYPES.WARNING) {
      return <InfoIcon color="#5D9EFF" size={32} weight="fill" />;
    } else if (type === TOAST_MESSAGE_TYPES.INFO) {
      return <WarningIcon color="#FFAF38" size={32} weight="fill" />;
    }
    return null;
  };

  return (
    <div
      className={styles.toastContainer}
      style={{
        borderTopColor:
          TOAST_MESSAGE_BORDER_COLOR_MAPPING[type as TOAST_MESSAGE_TYPES],
        ...style,
      }}
      data-index={dataIndex}
    >
      <span className={styles.toastContainer__wrapper}>
        <div className={styles.toastContainer__content}>
          <IconButton
            disableRipple
            disabled={areControlsDisabled}
            onClick={closeToast}
            sx={{
              visibility: totalCount > 0 ? 'visible' : 'hidden',
              opacity: hovered ? '1' : '0',
              background: '#fff',
              position: 'absolute',
              top: '-1rem',
              padding: '0.3rem',
              left: '-0.5rem',
              boxShadow: '0 0 0.2rem 0 rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease-in-out',
              '&:active': {
                background: '#d4d4d4',
              },

              '&.Mui-disabled': {
                background: '#d9d9d9',
                cursor: 'not-allowed !important',
              },
            }}
          >
            <XIcon size={10} weight="bold" color="#000" />
          </IconButton>
          <span className={styles.toastMessageTitle}>
            <span className={styles.toastContainer__iconWrapper}>
              {toastIcon()}
            </span>
            <span className={styles.toastContainer__titleContent}>
              <span>{title} </span>
              <span
                className={styles.toastContainer__counter}
                style={{
                  opacity: totalCount > 1 ? 1 : 0,
                }}
              >
                {currentIndex}/{totalCount}
              </span>
            </span>
          </span>
        </div>

        {description !== '' || checkErrorDetailsExist(errData) === true ? (
          <div className={styles.toastContainer__description}>
            <span
              className={`${styles.toastContainer__description__text} ${styles.child}`}
            >
              {description}
            </span>
            {checkErrorDetailsExist(errData) === true && (
              <Button
                className={`${styles.toastContainer__description__button} ${styles.child}`}
                variant="contained"
                disableRipple
                sx={errorButtonStyles}
                onClick={handleErrorToggle}
              >
                View Errors
              </Button>
            )}
          </div>
        ) : null}

        {openError === true && errData && (
          <ToastErrorPopup
            openDialog={openError}
            handleCloseDialog={handleCloseError}
            errData={errData}
          />
        )}
      </span>
    </div>
  );
};

export default ToastMessage;
