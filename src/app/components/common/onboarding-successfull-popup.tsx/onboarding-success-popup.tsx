import { animationFiles } from '@/constants/assets/animations.constants';
import { imageUrls } from '@/constants/assets/images.constants';
import { DialogTitle } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { XIcon } from '@phosphor-icons/react';
import CanvasConfetti from '../canvas-confetti-comp/confetti-component';
import ImgComponent from '../img-component/img-component';
import styles from './onboarding-success-popup.module.scss';
interface IOnboardingSuccessPopupProps {
  title: string;
  description: string;
  openConfirmation: boolean;
  handleConfirmationClose: () => void;
}

export default function OnboardingSuccessPopup({
  title,
  description,
  openConfirmation,
  handleConfirmationClose,
}: IOnboardingSuccessPopupProps) {
  const handleCancel = () => {
    handleConfirmationClose();
  };

  return (
    <Dialog
      open={openConfirmation}
      onClose={handleCancel}
      aria-labelledby="success-popup-title"
      aria-describedby="success-popup-description"
      sx={{
        '& .MuiDialog-paper': {
          margin: 0,
          height: '30rem',
          width: '40rem',
          overflow: 'hidden',
          zIndex: '100000',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: '#77469b',
          padding: '1rem',
        }}
      >
        <div className={styles.titleContainer}>
          {title}
          <XIcon
            size={'1.6rem'}
            weight="bold"
            color="white"
            style={{
              cursor: 'pointer',
            }}
            onClick={handleCancel}
          />
        </div>
      </DialogTitle>
      <div className={styles.subContainer}>
        <ImgComponent
          imageURL={animationFiles.successGif}
          alt="success-gif"
          customStyles={{ width: '16rem' }}
        />
        <span className={styles.congratulations}>Congratulations!!!</span>
        <div className={styles.description}>
          <span>{description}</span>
          <span
            style={{
              display: 'flex',
              gap: '0.6rem',
              fontSize: '1.2rem',
              alignItems: 'center',
            }}
          >
            {' '}
            <ImgComponent imageURL={imageUrls.syncIcon} alt="sync-icon" />
            Your data is now syncing. This may take up to 24 hours.
          </span>
        </div>
      </div>
      <CanvasConfetti />
    </Dialog>
  );
}
