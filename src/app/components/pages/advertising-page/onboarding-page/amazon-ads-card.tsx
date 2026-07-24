import ImgComponent from '@/app/components/common/img-component/img-component';
import { imageUrls } from '@/constants/assets/images.constants';
import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';
import React from 'react';
import { useAppSelector } from 'src/redux/hooks';
import { selectIsAmazonAdvertisingConnected } from 'src/redux/slices/onboarding/onboarding.slice';
import {
  connectButtonStyles,
  connectedButtonStyles,
} from './onboarding-page-styles';
import styles from './onboarding-page.module.scss';

interface AmazonAdsCardProps {
  grantURL: string;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AmazonAdsCard: React.FC<AmazonAdsCardProps> = ({
  setLoading,
  grantURL,
  loading,
}) => {
  const isAmazonAdvertisingConnected = useAppSelector(
    selectIsAmazonAdvertisingConnected
  );
  const handleConnect = () => {
    if (isAmazonAdvertisingConnected.isAdvertisingConnected) return;
    setLoading(true);
    window.location.href = grantURL;
  };

  return (
    <div className={styles.singleStepContainer}>
      <div className={styles.stepDetails}>
        <div className={styles.stepTexts}>
          <ImgComponent
            imageURL={imageUrls.amazonAdsImg}
            alt="Amazon Ads Logo"
            className={styles.stepLogoImg}
          />
          <Typography
            variant="h3"
            fontSize="2.2rem"
            fontWeight={700}
            lineHeight="25px"
          >
            Connect your Amazon Ads Account
          </Typography>
          <Typography
            variant="body2"
            fontSize="1.3rem"
            fontWeight={500}
            lineHeight="18px"
          >
            With Anarix's, unlock detailed analytics for your campaigns & take
            command of your advertising strategy.
          </Typography>
        </div>

        <LoadingButton
          className={styles.enabled}
          sx={{
            ...connectButtonStyles,
            ...(isAmazonAdvertisingConnected.isAdvertisingConnected
              ? connectedButtonStyles
              : {}),
          }}
          onClick={handleConnect}
          disabled={isAmazonAdvertisingConnected.isAdvertisingConnected}
          loading={loading}
        >
          {isAmazonAdvertisingConnected.isAdvertisingConnected
            ? `Connected`
            : `Connect`}
        </LoadingButton>
      </div>
    </div>
  );
};

export default AmazonAdsCard;
