import ImgComponent from '@/app/components/common/img-component/img-component';
import { imageUrls } from '@/constants/assets/images.constants';
import { Button, Typography } from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  OnboardingStep,
  selectIsAmazonAdvertisingConnected,
  setActiveStep,
  setFillIndex,
  setIsAmazonAdvertisingConnected,
} from 'src/redux/slices/onboarding/onboarding.slice';
import {
  connectButtonStyles,
  connectedButtonStyles,
} from './onboarding-page-styles';
import styles from './onboarding-page.module.scss';

interface IAmazonSellerCardProps {
  setIsAmazonConnected: React.Dispatch<React.SetStateAction<boolean>>;
}
const AmazonSellerCard: React.FC<IAmazonSellerCardProps> = ({
  setIsAmazonConnected,
}) => {
  const dispatch = useAppDispatch();
  const isAmazonAdvertisingConnected = useAppSelector(
    selectIsAmazonAdvertisingConnected
  );

  const handleButtonClick = () => {
    dispatch(setFillIndex(2));
    dispatch(setActiveStep(OnboardingStep.COMPLETED));
    dispatch(
      setIsAmazonAdvertisingConnected({
        ...isAmazonAdvertisingConnected,
        isSPDataConnected: true,
      })
    );
    setIsAmazonConnected(true);
  };
  return (
    <div className={styles.singleStepContainer}>
      <div className={styles.stepDetails}>
        <div className={styles.stepTexts}>
          <ImgComponent
            imageURL={imageUrls.amazonSellerImg}
            alt="Amazon Seller Logo"
            className={styles.stepLogoImg}
          />
          <Typography
            variant="h3"
            fontSize="2.2rem"
            fontWeight={700}
            lineHeight="25px"
          >
            Connect Your Seller/Vendor Accounts
          </Typography>
          <Typography
            variant="body2"
            fontSize="1.3rem"
            fontWeight={500}
            lineHeight="18px"
          >
            Once connected, you can automate your product review requests, track
            your financial data, monitor your products.
          </Typography>
        </div>

        <Button
          className={styles.enabled}
          disableRipple
          sx={{
            ...connectButtonStyles,
            ...(isAmazonAdvertisingConnected.isSPDataConnected
              ? connectedButtonStyles
              : {}),
          }}
          onClick={handleButtonClick}
        >
          {isAmazonAdvertisingConnected.isSPDataConnected
            ? 'Connected'
            : 'Connect'}
        </Button>
      </div>
    </div>
  );
};

export default AmazonSellerCard;
function dispatch(arg0: { payload: number; type: 'onboarding/setFillIndex' }) {
  throw new Error('Function not implemented.');
}
