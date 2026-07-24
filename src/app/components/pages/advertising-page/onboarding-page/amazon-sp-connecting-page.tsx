import CustomCircularProgress from '@/app/components/common/circular-progress/circular-progress-with-label';
import { ACCOUNTS_PAGE_URL } from '@/constants/urls.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { useAppQuery } from '@/redux/react-query-hooks';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import { updateProgress } from '@/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'src/redux/hooks';
import onboardingService from 'src/services/onboarding.service';
import AccountConnectionFailurePopup from './account-connection-status';
import styles from './amazon-sp-connecting-page.module.scss';
export default function AmazonSpConnectingPage() {
  useSubHeader('', '');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  const code = searchParams.get('code') || '';
  const partnerId = searchParams.get('partnerId') || '';
  const accountType = searchParams.get('accountType') || '';
  const region = searchParams.get('region') || '';
  const state = searchParams.get('state') || '';

  const isValidParams = useMemo(
    () =>
      Boolean(code && partnerId && accountType && region) &&
      code !== 'undefined' &&
      partnerId !== 'undefined' &&
      accountType !== 'undefined' &&
      region !== 'undefined' &&
      state !== 'undefined',
    [accountType, code, partnerId, region, state]
  );

  const [value, setValue] = useState(1);
  const [open, setOpen] = useState(!isValidParams);

  const handleConfirmationClose = () => {
    setOpen(false);
    navigate(ACCOUNTS_PAGE_URL);
  };

  const fetchCredentials = useAppQuery({
    queryKey: [QueryKeyEnums.AMZ_SP_ONBOARDING_CREDENTIALS_FETCH],
    queryFn: () =>
      onboardingService.getSPCredentials(
        code,
        partnerId,
        accountType.toLowerCase(),
        region,
        state
      ),
    enabled: isValidParams,
  });

  useEffect(() => {
    if (fetchCredentials.isLoading) {
      updateProgress(0, 50, 500, setValue);
      return;
    }
    if (fetchCredentials.isSuccess) {
      updateProgress(50, 100, 1000, setValue);
      dispatch(
        showSuccessToastMessage({
          title: fetchCredentials?.data.data.message,
          description: fetchCredentials.data?.data?.description,
        })
      );
      const redirectTimer = setTimeout(() => {
        navigate(ACCOUNTS_PAGE_URL);
      }, 1500);
      return () => clearTimeout(redirectTimer);
    }
    if (fetchCredentials.isError) {
      setOpen(true);
      updateProgress(50, 0, 1000, setValue);

      const redirectTimer = setTimeout(() => {
        navigate(ACCOUNTS_PAGE_URL);
      }, 1500);
      return () => clearTimeout(redirectTimer);
    }
  }, [
    dispatch,
    fetchCredentials.data?.data,
    fetchCredentials.isError,
    fetchCredentials.isLoading,
    fetchCredentials.isSuccess,
    navigate,
  ]);

  return (
    <React.Fragment>
      <AccountConnectionFailurePopup
        title={'Amazon SP Account Connection Failed!!!'}
        openConfirmation={open}
        handleConfirmationClose={handleConfirmationClose}
        description={
          'Connecting Your Amazon SP Account has failed. Please try again.'
        }
      />
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <span className={styles.title}>Integrating Amazon SP Accounts</span>
          <div className={styles.progressContainer}>
            <CustomCircularProgress value={value} />
          </div>
          <span className={styles.description}>
            Your Amazon SP Accounts syncing is under process. It will take few
            seconds...
          </span>
        </div>
      </div>
    </React.Fragment>
  );
}
