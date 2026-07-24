import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import { Dialog } from '@mui/material';
import { WarningCircleIcon } from '@phosphor-icons/react';
import styles from './session-timeout-login-modal.module.scss';

interface SessionTimeoutProps {
  isOpen: boolean;
  onConfirm: () => void;
}

const SessionTimoutLoginModal = ({
  onConfirm,
  isOpen,
}: SessionTimeoutProps) => {
  return (
    <Dialog
      open={isOpen}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '0.8rem',
        },
      }}
    >
      <div className={styles.promptContainer}>
        <div className={styles.progressBarContainer}>
          <span className={styles.notificationContainer}>
            <span className={styles.headerContainer}>
              <WarningCircleIcon weight="fill" color="#FF7878" size={'5rem'} />
              <span className={styles.headerContainer}>Session Time Out!</span>
            </span>
            <span className={styles.textContainer}>
              You have been logged out due to inactivity of 60 minutes.{' '}
            </span>
          </span>
        </div>

        <div className={styles.buttonContainer}>
          <PrimaryButton
            buttonText={'Login'}
            buttonFunction={onConfirm}
            disabled={false}
            width="100%"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default SessionTimoutLoginModal;
