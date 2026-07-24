import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import { Dialog } from '@mui/material';
import CircularCountdown from './circular-countdown';
import styles from './session-timeout.module.scss';

interface SessionTimeoutProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  showLoginModal: () => void;
}

const SessionTimeoutModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  isOpen,
  showLoginModal,
}: SessionTimeoutProps) => {
  return (
    <Dialog
      open={isOpen}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '0.8rem',
          width: '42rem',
        },
      }}
    >
      <div className={styles.promptContainer}>
        <div className={styles.progressBarContainer}>
          <div
            style={{
              width: '40%',
            }}
          >
            <CircularCountdown
              duration={120}
              onTimeout={() => {
                onCancel();
                showLoginModal();
              }}
            />
          </div>
          <span className={styles.notificationContainer}>
            <span className={styles.headerContainer}>{title}</span>
            <span className={styles.textContainer}>{message} </span>
          </span>
        </div>

        <div className={styles.buttonContainer}>
          <SecondaryButton
            buttonText={'Log out now'}
            buttonFunction={onCancel}
            disabled={false}
            width="100%"
          />
          <PrimaryButton
            buttonText={'Continue Session'}
            buttonFunction={onConfirm}
            disabled={false}
            width="100%"
          />
        </div>
      </div>
    </Dialog>
  );
};

export default SessionTimeoutModal;
