import CustomCircularProgress from '@/app/components/common/circular-progress/circular-progress-with-label';
import { ACCOUNTS_PAGE_URL } from '@/constants/urls.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { useAppQuery } from '@/redux/react-query-hooks';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import walmartMarketplaceOnboardingService from '@/services/onboarding/walmart-marketplace-onboarding.service';
import { updateProgress } from '@/utils';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'src/redux/hooks';
import AccountConnectionFailurePopup from './account-connection-status';
import styles from './amazon-sp-connecting-page.module.scss';
export default function WalmartAcctConnectingPage() {
  useSubHeader('', '');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  const code = searchParams.get('code') || '';
  const partnerId = searchParams.get('sellerId') || '';

  const isValidParams = useMemo(
    () =>
      Boolean(code && partnerId) &&
      code !== 'undefined' &&
      partnerId !== 'undefined',
    [code, partnerId]
  );
  const [open, setOpen] = useState(!isValidParams);
  const [value, setValue] = useState(1);

  const fetchCredentials = useAppQuery({
    queryKey: [QueryKeyEnums.WMT_ACCOUNT_ONBOARDING_CREATE_ACCOUNT],
    queryFn: () =>
      walmartMarketplaceOnboardingService.createAccount(code, partnerId),
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
  ]);

  return (
    <React.Fragment>
      <AccountConnectionFailurePopup
        title={'Walmart Product Catalog Connection Failed!!!'}
        openConfirmation={open}
        handleConfirmationClose={() => {
          setOpen(false);
          navigate(ACCOUNTS_PAGE_URL);
        }}
        description={
          'Connecting Your Walmart Product Catalog Account has failed. Please try again.'
        }
      />
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <span className={styles.title}>
            Integrating Walmart Product Catalog Data
          </span>
          <div className={styles.progressContainer}>
            <CustomCircularProgress value={value} />
          </div>
          <span className={styles.description}>
            Your product data sync is currently under progress. This might take
            a few seconds.
          </span>
        </div>
      </div>
    </React.Fragment>
  );
}
