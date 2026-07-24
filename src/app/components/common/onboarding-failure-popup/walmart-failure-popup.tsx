import { WALMART_CONNECT_ONBOARDING_GUIDE_LINK } from '@/constants/urls.constants';
import { MailIDEnum } from '@/enums/advertising.enums';
import { DialogTitle } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { WarningCircleIcon, XIcon } from '@phosphor-icons/react';
import PrimaryButton from '../primary-button/primary-button';
import styles from './walmart-failure-popup.module.scss';
interface IWalmartFailurePopupProps {
  openConfirmation: boolean;
  handleClose: () => void;
  handleRetry: () => void;
}

export default function WalmartFailurePopup({
  openConfirmation,
  handleClose,
  handleRetry,
}: IWalmartFailurePopupProps) {
  const handleCancel = () => {
    handleClose();
  };

  return (
    <Dialog
      open={openConfirmation}
      onClose={handleCancel}
      aria-labelledby="failure-popup-title"
      aria-describedby="failure-popup-description"
      sx={{
        '& .MuiDialog-paper': {
          margin: 0,
          height: '36rem',
          width: '42rem',
          overflow: 'hidden',
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
          Connection Failed
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
        <WarningCircleIcon color="#FF7878" size="9rem" weight="fill" />
        <span
          className={styles.description}
          style={{
            fontSize: '1.2rem',
          }}
        >
          We could not verify your Walmart Ads account details. This may be due
          to:
          <span
            style={{
              fontSize: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.2rem',
            }}
          >
            <li>Incorrect Advertiser ID or Seller ID</li>
            <li>API permission not granted properly</li>
          </span>
          <a
            href={WALMART_CONNECT_ONBOARDING_GUIDE_LINK}
            target="_blank"
            rel="noreferrer"
            style={{
              color: '#3385EA',
              textDecoration: 'underline',
            }}
          >
            View step-by-guide
          </a>
          <span>
            Please double-check your information and try again. If you're still
            facing issues,
            <a
              href={`mailto:${MailIDEnum.TECH},${MailIDEnum.SUNIL},${MailIDEnum.BHARATH}`}
              target="_blank"
              rel="noreferrer"
              style={{
                color: '#3385EA',
                marginLeft: '0.2rem',
              }}
            >
              contact us
            </a>
          </span>
        </span>

        <PrimaryButton
          buttonText={'Retry'}
          buttonFunction={handleRetry}
          disabled={false}
          width="100%"
        />
      </div>
    </Dialog>
  );
}
