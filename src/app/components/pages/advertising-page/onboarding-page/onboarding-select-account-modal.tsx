import { confirmationBoxStyles } from '@/app/components/common/confirmation-box/confirmation-box-styles';

import ImgComponent from '@/app/components/common/img-component/img-component';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import { imageUrls } from '@/constants/assets/images.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppDispatch } from '@/redux/hooks';
import { setIsChatbotOpen } from '@/redux/slices/auth/auth.slice';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { XIcon } from '@phosphor-icons/react';
import { useRef } from 'react';
import styles from './onboarding-select-account.module.scss';

interface IOnboardingSelectMarketplaceProps {
  title: string;
  openConfirmation: boolean;
  handleConfirmationClose: () => void;
  handleMarketplaceClick: (marketplace: MarketplaceEnum) => void;
}

export default function OnboardingSelectMarketplace({
  title,
  openConfirmation,
  handleConfirmationClose,
  handleMarketplaceClick,
}: IOnboardingSelectMarketplaceProps) {
  const modalPopupRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

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
        className={`${styles.confirmationTitle} flex justify-between items-center`}
      >
        {title}
        <XIcon
          style={{ cursor: 'pointer' }}
          onClick={handleConfirmationClose}
        />
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="confirmation-description"
          className={styles.confirmationDescription}
        >
          <div className={styles.accountContainer}>
            <div className={styles.accountHeader}>
              <span className={styles.imgContainer}>
                <ImgComponent
                  imageURL={imageUrls.amazonAdsImg}
                  customStyles={{
                    height: 'auto',
                    width: '17rem',
                    cursor: 'pointer',
                  }}
                  alt="amazon-logo"
                />
              </span>
              <span className={styles.marketplace}>Amazon</span>
              <span className={styles.description}>
                Select Amazon Marketplace to get your campaign data.
              </span>
            </div>
            <span className={styles.vl}></span>
            <div className={styles.buttonContainer}>
              <SecondaryButton
                buttonText={'Connect Account'}
                buttonFunction={() => {
                  handleMarketplaceClick(MarketplaceEnum.AMAZON);
                  dispatch(setIsChatbotOpen(false));
                }}
                disabled={false}
                height="3.2rem"
                width="13rem"
              />
            </div>
          </div>
          <div className={styles.accountContainer}>
            <div className={styles.accountHeader}>
              <span className={styles.imgContainer}>
                <ImgComponent
                  imageURL={imageUrls.walmartMarketplaceImg}
                  customStyles={{
                    cursor: 'pointer',
                    height: 'auto',
                    width: '16rem',
                  }}
                  alt="walmart-logo"
                />
              </span>
              <span className={styles.marketplace}>Walmart</span>
              <span className={styles.description}>
                Select Walmart Marketplace to get your campaign data.
              </span>
            </div>
            <span className={styles.vl}></span>

            <div className={styles.buttonContainer}>
              <SecondaryButton
                buttonText={'Connect Account'}
                buttonFunction={() => {
                  handleMarketplaceClick(MarketplaceEnum.WALMART);
                  dispatch(setIsChatbotOpen(false));
                }}
                disabled={false}
                height="3.2rem"
                width="13rem"
              />
            </div>
          </div>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
