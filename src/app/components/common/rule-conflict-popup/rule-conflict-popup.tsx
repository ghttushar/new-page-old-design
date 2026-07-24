import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import CustomEditLoader from '@/app/components/shared/custom-edit-loader/custom-edit-loader';
import { Dialog } from '@mui/material';
import { WarningIcon } from '@phosphor-icons/react';
import AltPrimaryButton from '../alt-primary-button/alt-primary-button';
import styles from './rule-conflict-popup.module.scss';

interface ConflictPopupProps {
  isOpen: boolean;
  handlePopupClose: () => void;
  handleConfirm: () => void;
  handleCancel: () => void;
  isLoading: boolean;
  children: React.ReactNode;
  title?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  loadingText?: string;
  isNewDesign: boolean;
  isCancelButtonDisabled?: boolean;
  cancelButtonDisabledTooltip?: string;
  isConfirmButtonDisabled?: boolean;
  confirmButtonDisabledTooltip?: string;
}

const ConflictPopup = ({
  handlePopupClose,
  handleCancel,
  handleConfirm,
  isOpen,
  isLoading,
  cancelButtonText = 'Cancel',
  children,
  confirmButtonText = 'Yes, Go Ahead ',
  loadingText = 'Overriding Rule Conflicts',
  title = 'Rule Conflict Warning',
  isNewDesign = false,
  isCancelButtonDisabled = false,
  cancelButtonDisabledTooltip,
  isConfirmButtonDisabled = false,
  confirmButtonDisabledTooltip,
}: ConflictPopupProps) => {
  return (
    <Dialog
      open={isOpen}
      onClose={handlePopupClose}
      maxWidth="lg"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: '0.8rem',
          width: '54rem',
          padding: '1.6rem',
        },
      }}
    >
      <div className={styles.container}>
        {isLoading && <CustomEditLoader overlayText={loadingText} />}

        <span className={styles.header}>
          <WarningIcon weight="fill" color="#FFAF38" size={'2.2rem'} />
          <span className={styles.warningText}>{title}</span>
        </span>

        {children}

        <div className={styles.buttonContainer}>
          <AltPrimaryButton
            buttonText={cancelButtonText}
            buttonFunction={handleCancel}
            disabled={isCancelButtonDisabled}
            isHoverTooltipEnabled={Boolean(cancelButtonDisabledTooltip)}
            tooltipText={cancelButtonDisabledTooltip}
            width="auto"
            height="3rem"
            isNewDesign={isNewDesign}
          />
          <PrimaryButton
            buttonText={confirmButtonText}
            buttonFunction={handleConfirm}
            disabled={isConfirmButtonDisabled}
            isHoverTooltipEnabled={Boolean(confirmButtonDisabledTooltip)}
            tooltipText={confirmButtonDisabledTooltip}
            width="auto"
            height="3rem"
            isNewDesign={isNewDesign}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default ConflictPopup;
