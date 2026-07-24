import CustomCircularProgress from '@/app/components/common/circular-progress/circular-progress-with-label';
import { ACCOUNTS_PAGE_URL } from '@/constants/urls.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { IAdvertisingProfiles } from '@/interfaces/onboarding.interface';
import { useAppQuery } from '@/redux/react-query-hooks';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import { formatSelectedProfiles, updateProgress } from '@/utils';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'src/redux/hooks';
import onboardingService from 'src/services/onboarding.service';
import AccountConnectionFailurePopup from './account-connection-status';
import SelectAmazonAdsProfiles from './amazon-ads-profile-selection-modal';
import styles from './amazon-sp-connecting-page.module.scss';

export default function AmazonAdsConnectingPage() {
  useSubHeader('', '');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [progressValue, setProgressValue] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profiles, setProfiles] = useState<IAdvertisingProfiles[]>();

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  const code = searchParams.get('code') || '';
  const region = searchParams.get('region') || '';

  const handleSelectModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      navigate(ACCOUNTS_PAGE_URL);
    }, 1500);
  };

  const isValidParams = useMemo(
    () =>
      Boolean(code && region) && code !== 'undefined' && region !== 'undefined',
    [code, region]
  );

  const [isOpen, setIsOpen] = useState(!isValidParams);

  const handleConfirmationClose = () => {
    setIsOpen(false);
    navigate(`${ACCOUNTS_PAGE_URL}/onboarding-page/amazon`);
  };

  const handleRegionModalClose = () => {
    handleSelectModalClose();
    updateProgress(75, 0, 500, setProgressValue);
  };

  const onComplete = () => {
    handleSelectModalClose();
    sendProfilesQuery.refetch();
    updateProgress(75, 100, 500, setProgressValue);
  };

  const fetchProfilesQuery = useAppQuery({
    queryKey: [QueryKeyEnums.AMZ_ADS_ONBOARDING_PROFILES_FETCH],
    queryFn: () => onboardingService.getProfiles(code, region),
    enabled: isValidParams,
  });

  const sendProfilesQuery = useAppQuery({
    queryKey: [QueryKeyEnums.SEND_SELECTED_PROFILES],
    queryFn: () => onboardingService.sendSelectedProfiles(profiles),
    enabled: false,
  });

  useEffect(() => {
    if (fetchProfilesQuery.isLoading) {
      updateProgress(0, 50, 5500, setProgressValue);
      return;
    }
    if (fetchProfilesQuery.isSuccess) {
      updateProgress(50, 75, 1000, setProgressValue);
      const redirectTimer = setTimeout(() => {
        setIsModalOpen(true);
      }, 1200);

      dispatch(
        showSuccessToastMessage({
          title:
            fetchProfilesQuery.data.data.message ||
            'Profiles Retrieved Successfully',
          description: fetchProfilesQuery.data.data.description,
        })
      );
      return () => clearTimeout(redirectTimer);
    }
    if (fetchProfilesQuery.isError) {
      updateProgress(25, 0, 1000, setProgressValue);
    }
  }, [
    dispatch,
    fetchProfilesQuery.isLoading,
    fetchProfilesQuery.isSuccess,
    fetchProfilesQuery.isError,
    fetchProfilesQuery.data,
  ]);

  useEffect(() => {
    if (fetchProfilesQuery.isSuccess === false) return;

    if (sendProfilesQuery.isSuccess) {
      updateProgress(75, 100, 1000, setProgressValue);

      dispatch(
        showSuccessToastMessage({
          title: sendProfilesQuery.data.data.message,
          description: sendProfilesQuery.data.data.description ?? '',
        })
      );
    }
    if (sendProfilesQuery.isError) {
      setIsOpen(true);
      updateProgress(50, 0, 1000, setProgressValue);
      return;
    }
  }, [
    profiles,
    dispatch,
    sendProfilesQuery.isLoading,
    sendProfilesQuery.isSuccess,
    sendProfilesQuery.isError,
    fetchProfilesQuery.isSuccess,
    sendProfilesQuery.data?.data,
  ]);

  return (
    <div>
      <AccountConnectionFailurePopup
        title="Amazon Advertising Account Connection Failed!"
        openConfirmation={isOpen}
        handleConfirmationClose={handleConfirmationClose}
        description="Connecting Your Amazon Ads Account has failed. Please try again."
      />
      {fetchProfilesQuery.data?.data.data &&
        fetchProfilesQuery.data?.data.data.length > 0 && (
          <SelectAmazonAdsProfiles
            amazonProfiles={formatSelectedProfiles(
              fetchProfilesQuery.data.data.data
            )}
            isOpen={Boolean(fetchProfilesQuery.data?.data.data && isModalOpen)}
            setAmazonProfiles={setProfiles}
            handleModalClose={handleRegionModalClose}
            onComplete={onComplete}
          />
        )}
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <span className={styles.title}>Integrating Amazon Ads Accounts</span>
          <div className={styles.progressContainer}>
            <CustomCircularProgress value={progressValue} />
          </div>
          <span className={styles.description}>
            Your Amazon Ads Accounts syncing is in progress. It will take a few
            seconds...
          </span>
        </div>
      </div>
    </div>
  );
}
