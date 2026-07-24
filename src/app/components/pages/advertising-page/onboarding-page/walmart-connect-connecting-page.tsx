import CustomCircularProgress from '@/app/components/common/circular-progress/circular-progress-with-label';
import WalmartFailurePopup from '@/app/components/common/onboarding-failure-popup/walmart-failure-popup';
import OnboardingSuccessPopup from '@/app/components/common/onboarding-successfull-popup.tsx/onboarding-success-popup';
import { ACCOUNTS_PAGE_URL } from '@/constants/urls.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  WalmartReportTypeEnum,
  WalmartSnapshotReportStatusEnum,
} from '@/enums/walmart.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { useAppQuery } from '@/redux/react-query-hooks';
import walmartAccountService from '@/services/advertising/walmart/walmart-account.service';
import walmartMarketplaceOnboardingService from '@/services/onboarding/walmart-marketplace-onboarding.service';
import { updateProgress } from '@/utils';
import {
  checkIsWalmartAdsConnected,
  getCreateWalmartPayload,
} from '@/utils/advertising.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './amazon-sp-connecting-page.module.scss';

export default function WalmartConnectConnectingPage() {
  useSubHeader('', '');
  const navigate = useNavigate();

  const accountId = localStorageUtils.getAccountId();

  const [value, setValue] = useState(1);
  const [isSecondApiEnabled, setIsSecondApiEnabled] = useState(false);

  const { advertiserId } = useParams<{
    advertiserId: string;
  }>();

  const {
    isSuccess: snapShotDataSuccess,
    isError: snapShotDataError,
    isLoading: snapShotDataLoading,
  } = useAppQuery({
    queryKey: [QueryKeyEnums.WMT_CONNECT_CREATE_REPORT_SNAPSHOT, advertiserId],
    queryFn: () =>
      walmartMarketplaceOnboardingService.createAdvertiserAttributesReportSnapShot(
        advertiserId ?? '',
        WalmartReportTypeEnum.ADVERTISER_ATTRIBUTES
      ),
  });

  const navigateToAccounts = () => {
    navigate(ACCOUNTS_PAGE_URL);
  };

  const handleRetry = () => {
    navigate(`${ACCOUNTS_PAGE_URL}/onboarding-page/walmart`);
  };

  const {
    data: reportData,
    isSuccess: reportDataSuccess,
    isError: reportDataError,
    isLoading: reportDataLoading,
  } = useAppQuery({
    queryKey: [QueryKeyEnums.WMT_CONNECT_FETCH_REPORT_SNAPSHOT, advertiserId],
    queryFn: () =>
      walmartMarketplaceOnboardingService.getAdvertiserAttributesReportSnapShot(
        advertiserId ?? ''
      ),
    enabled: snapShotDataSuccess && isSecondApiEnabled,
    options: {
      refetchInterval: (query) => {
        const data = query.state.data;
        return data?.jobStatus !== WalmartSnapshotReportStatusEnum.DONE
          ? 5000
          : false;
      },
      refetchIntervalInBackground: true,
    },
  });
  useEffect(() => {
    if (snapShotDataLoading) {
      updateProgress(0, 60, 50000, setValue);
    }
    if (snapShotDataSuccess && !isSecondApiEnabled) {
      const timer = setTimeout(() => {
        setIsSecondApiEnabled(true);
      }, 40 * 1000);
      return () => {
        clearTimeout(timer);
      };
    }
    if (snapShotDataError) {
      updateProgress(50, 0, 1000, setValue);
      return;
    }
  }, [
    snapShotDataLoading,
    snapShotDataError,
    snapShotDataSuccess,
    isSecondApiEnabled,
  ]);

  useEffect(() => {
    if (isSecondApiEnabled && reportDataLoading) {
      updateProgress(60, 75, 5000, setValue);
      return;
    }

    if (reportDataSuccess && reportData) {
      if (reportData.jobStatus === WalmartSnapshotReportStatusEnum.DONE) {
        const timer = setTimeout(() => {
          if (
            reportData.data &&
            checkIsWalmartAdsConnected(reportData?.data, advertiserId)
          )
            updateProgress(75, 110, 1000, setValue);
        }, 1 * 1000);
        return () => {
          clearTimeout(timer);
        };
      }
    }
    if (reportDataError) {
      updateProgress(50, 0, 1000, setValue);
      return;
    }
  }, [
    reportDataLoading,
    reportDataError,
    reportDataSuccess,
    reportData,
    isSecondApiEnabled,
    advertiserId,
  ]);

  const createWalmartAccount = useAppQuery({
    queryKey: [
      QueryKeyEnums.WMT_CONNECT_ACCOUNT_ONBOARDING_CREATE_ACCOUNT,
      advertiserId,
    ],
    queryFn: () =>
      walmartAccountService.createWalmartAccount(
        getCreateWalmartPayload(accountId, reportData?.data)
      ),
    enabled: Boolean(
      reportData?.data?.advertiserId &&
        checkIsWalmartAdsConnected(reportData?.data, advertiserId)
    ),
  });
  return (
    <div className={styles.container}>
      <WalmartFailurePopup
        openConfirmation={
          snapShotDataError === true ||
          reportDataError === true ||
          (isSecondApiEnabled &&
            reportData?.jobStatus === WalmartSnapshotReportStatusEnum.DONE &&
            !reportDataLoading &&
            (!reportData?.data ||
              !checkIsWalmartAdsConnected(reportData.data, advertiserId)))
        }
        handleClose={navigateToAccounts}
        handleRetry={handleRetry}
      />

      <OnboardingSuccessPopup
        title={`You're All Set`}
        description={
          'Your Walmart Ads account has been successfully connected.'
        }
        openConfirmation={
          value === 110 &&
          isSecondApiEnabled &&
          checkIsWalmartAdsConnected(reportData?.data, advertiserId)
        }
        handleConfirmationClose={navigateToAccounts}
      />
      <div className={styles.subContainer}>
        <span className={styles.title}>Verifying Your Connection</span>
        <div className={styles.progressContainer}>
          <CustomCircularProgress value={value} />
        </div>
        <span className={styles.description}>
          We're verifying your account details and this process may take a few
          minutes. Please do not close this tab.
        </span>
      </div>
    </div>
  );
}
