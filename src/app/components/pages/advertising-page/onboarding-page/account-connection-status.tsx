import { confirmationBoxStyles } from '@/app/components/common/confirmation-box/confirmation-box-styles';

import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { XIcon } from '@phosphor-icons/react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './account-connection-status.module.scss';

interface IAccountConnectionFailurePopupProps {
  title: string;
  description?: string;
  openConfirmation: boolean;
  handleConfirmationClose: () => void;
}

export default function AccountConnectionFailurePopup({
  title,
  description,
  openConfirmation,
  handleConfirmationClose,
}: IAccountConnectionFailurePopupProps) {
  const navigate = useNavigate();

  const modalPopupRef = useRef<HTMLDivElement | null>(null);

  return (
    <Dialog
      ref={modalPopupRef}
      open={openConfirmation}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-description"
      className={styles.confirmationContainer}
      sx={confirmationBoxStyles}
    >
      <DialogTitle
        id="confirmation-title"
        className={`${styles.confirmationTitle} flex justify-between  items-start w-[35rem]`}
      >
        <span
          style={{
            maxWidth: '30rem',
          }}
        >
          {title}
        </span>
        <XIcon
          style={{ cursor: 'pointer', marginTop: '0.4rem' }}
          onClick={handleConfirmationClose}
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="confirmation-description"
          className={styles.confirmationDescription}
        >
          {description}
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
