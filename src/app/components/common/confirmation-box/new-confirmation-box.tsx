import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { WarningIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import AltPrimaryButton from '../alt-primary-button/alt-primary-button';
import PrimaryButton from '../primary-button/primary-button';
import {
  actionBoxStyles,
  confirmationBoxStyles,
} from './confirmation-box-styles';
import styles from './new-confirmation-box.module.scss';

interface INewConfirmationBoxProps {
  title: string;
  description: string;
  openConfirmation: boolean;
  handleConfirmationClose: () => void;
  handleConfirmClick?: () => void;
  confirmButtonText?: string;
  isConfirmButtonRequired: boolean;
  style?: any;
}

export default function NewConfirmationBox({
  title,
  description,
  openConfirmation,
  handleConfirmationClose,
  handleConfirmClick,
  confirmButtonText,
  isConfirmButtonRequired,
  style,
}: INewConfirmationBoxProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleCancel = () => {
    handleConfirmationClose();
    setIsLoading(false);
  };

  const handleConfirm = () => {
    if (isConfirmButtonRequired && handleConfirmClick) {
      handleConfirmClick();
      setIsLoading(true);
    }
  };

  const newConfirmationBoxStyles = {
    ...confirmationBoxStyles,
    '& .MuiDialog-paper': {
      margin: 0,
      padding: '2rem',
      paddingBottom: '1rem',
      width: '32rem',
      textAlign: 'center',
      color: '#464646',
      borderRadius: '0.5rem',
    },
  };

  return (
    <Dialog
      open={openConfirmation}
      onClose={handleCancel}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-description"
      className={styles.confirmationContainer}
      sx={newConfirmationBoxStyles}
    >
      <div className="flex items-center gap-[1rem] justify-center">
        <WarningIcon size={32} color="#f26e77" weight="bold" />
        <DialogTitle
          id="confirmation-title"
          className={styles.confirmationTitle}
        >
          {title}
        </DialogTitle>
      </div>

      <DialogContent>
        <DialogContentText
          id="confirmation-description"
          className={styles.confirmationDescription}
        >
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={actionBoxStyles}>
        <AltPrimaryButton
          buttonText="Cancel"
          buttonFunction={handleCancel}
          disabled={isLoading}
          height="3rem"
          fontSize="1.1rem"
          width="auto"
        />
        {isConfirmButtonRequired === true && (
          <PrimaryButton
            buttonText={confirmButtonText as string}
            buttonFunction={handleConfirm}
            height="3rem"
            fontSize="1.1rem"
            width="auto"
            disabled={isLoading}
          />
        )}
      </DialogActions>
    </Dialog>
  );
}
