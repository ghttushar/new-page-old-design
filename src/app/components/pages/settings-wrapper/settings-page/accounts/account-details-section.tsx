import PrimaryIconButton from '@/app/components/common/primary-icon-button/primary-icon-button';
import CustomLinearProgress from '@/app/components/common/progress-bar/progress-bar';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import SkeletonComponent from '@/app/components/common/skeleton/skeleton';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { setIsWmtConnectFormOpen } from '@/redux/slices/onboarding/onboarding.slice';
import { monitoringService } from '@/services/monitoring/monitoring.service';
import { Box, Typography } from '@mui/material';
import {
  ArrowCounterClockwiseIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';
import PrimaryButton from 'src/app/components/common/primary-button/primary-button';
import { SYNC_TEXT } from 'src/constants/settings/settings.constants';
import {
  WalmartAccountTypeEnum,
  WalmartClientTypeEnum,
} from 'src/enums/walmart.enums';
import { ISettingsAccount } from 'src/interfaces/settings.interface';
import { useAppDispatch } from 'src/redux/hooks';
import {
  getRedirectURLByWMTClientType,
  handleOnboardingConnect,
} from 'src/utils';
import accountUtils from 'src/utils/settings/accounts/account.utils';
import styles from './walmart-advertising-styles.module.scss';
interface IAccountDetailsSectionsProps {
  accountData: ISettingsAccount;
  accountType?: string;
  buttonDesc?: string;
  advertisingId?: string | null;
  disable: boolean;
}
interface SyncProps {
  isSyncing: boolean;
  lastSync?: string;
  value?: number;
  isSyncAllowed?: boolean;
  retryMessage?: string | null;
  masterSync?: () => void;
  isLoading?: boolean;
  fetchSyncProgress?: () => void;
}

const AccountDetailsSections = ({
  accountData,
  accountType,
  buttonDesc,
  advertisingId,
  disable,
}: IAccountDetailsSectionsProps) => {
  const color = disable ? '#bfbfbf' : '';
  return (
    <div
      className={styles.advertisingWrapper}
      style={{
        color: color,
        cursor: disable ? 'not-allowed' : '',
      }}
    >
      <Typography
        className={styles.title}
        style={{
          color: disable ? '#bfbfbf' : '',

          marginTop: '-0.4rem',
        }}
      >
        {accountType ? (
          <React.Fragment>
            {accountType} <InfoIcon title={accountType} />
          </React.Fragment>
        ) : null}
      </Typography>

      {accountType === 'Advertising' ? (
        <AdvertisingAccountDetailsSections
          accountData={accountData}
          buttonDesc={buttonDesc}
          advertisingId={advertisingId}
          disable={disable}
        />
      ) : (
        <CatalogAccountDetailsSection
          accountData={accountData}
          buttonDesc={buttonDesc}
          advertisingId={advertisingId}
          disable={disable}
        />
      )}
    </div>
  );
};

export default AccountDetailsSections;

const Sync = ({
  isSyncing,
  lastSync,
  value,
  isSyncAllowed,
  retryMessage,
  masterSync,
  isLoading,
  fetchSyncProgress,
}: SyncProps) => {
  const handleRefetch = () => {
    if (fetchSyncProgress) fetchSyncProgress();
  };
  if (isSyncing && value !== undefined && value < 100) {
    return (
      <React.Fragment>
        <Box className={styles.syncContainer}>
          {isLoading === true ? (
            <span
              style={{
                marginBottom: '-0.5rem',
              }}
            >
              <SkeletonComponent width={'22.5rem'} height={'3.2rem'} />
            </span>
          ) : (
            <CustomLinearProgress value={value ?? 0} label="Sync in Progress" />
          )}

          <PrimaryIconButton
            buttonFunction={handleRefetch}
            disabled={isLoading ?? false}
            buttonIcon={
              <ArrowCounterClockwiseIcon size={'2rem'} color="#464646" />
            }
            height="2rem"
            width="2rem"
            customStyles={{
              padding: '0.2rem',
            }}
          />
        </Box>

        <div className={styles.syncingMessage}>{SYNC_TEXT}</div>
      </React.Fragment>
    );
  }

  if (isLoading === true)
    return (
      <span
        style={{
          marginTop: '0.4rem',
        }}
      >
        <SkeletonComponent height={'3.4rem'} width={'12rem'} />
      </span>
    );

  return (
    <LastSynced
      lastSync={lastSync}
      isSyncAllowed={isSyncAllowed}
      retryMessage={retryMessage}
      masterSync={masterSync}
      isLoading={isLoading}
    />
  );
};
const LastSynced = (props: {
  lastSync?: string;
  isSyncAllowed?: boolean;
  retryMessage?: string | null;
  masterSync?: () => void;
  isLoading?: boolean;
}) => {
  return (
    <div className={styles.lastSyncContainer}>
      <Typography className={styles.lastSyncInfo}>
        Last Sync
        <div className={styles.syncDivider}></div>
        {props.lastSync || '-'}
        {/* <ImgComponent alt="verified-icon" src={verified} className={styles.verifiedIcon} /> */}
      </Typography>

      <SecondaryButton
        buttonText={'Sync now'}
        buttonFunction={() => props.masterSync && props.masterSync()}
        disabled={props.isLoading || !props.isSyncAllowed}
        isHoverTooltipEnabled={true}
        tooltipText={
          (props.isLoading ? 'Sync is not allowed' : props.retryMessage) ||
          'Sync is not allowed'
        }
        tooltipPosition={TooltipPlacement.Top}
        height="2rem"
        fontSize="0.8rem"
      />
    </div>
  );
};

const NextTriggerAt = ({ nextTriggerAt }: { nextTriggerAt: string | null }) => {
  if (!nextTriggerAt) return null;

  const formattedDate = new Date(nextTriggerAt).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Typography className={styles.lastSyncInfo}>
      Bidder Next Trigger
      <div className={styles.syncDivider}></div>
      {formattedDate || '-'}
    </Typography>
  );
};

const AdvertisingAccountDetailsSections = (
  props: IAccountDetailsSectionsProps
) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isSyncAllowed, setIsSyncAllowed] = useState<boolean>(false);
  const [retryMessage, setRetryMessage] = useState<string>('');
  const [syncProgress, setSyncProgress] = useState(0);

  const { accountData, disable } = props;
  const displayItems = useMemo(
    () => accountUtils.getIdAndLabel(accountData),
    [accountData]
  );

  const { marketplace, metaId } =
    accountUtils.getMarketplaceAndMetaId(accountData);

  const fetchSyncStatus = useAppQuery({
    queryKey: [QueryKeyEnums.IS_MASTER_SYNC_ALLOWED, metaId, marketplace],
    queryFn: () =>
      monitoringService.isMasterSyncAllowed(String(metaId), marketplace),
    enabled: !!metaId,
    options: {
      refetchOnWindowFocus: true,
    },
  });

  const fetchSyncProgress = useAppQuery({
    queryKey: [QueryKeyEnums.FETCH_SYNC_PROGRESS, metaId, marketplace],
    queryFn: () =>
      monitoringService.getSyncProgress(String(metaId), marketplace),
    enabled: !!metaId,
    options: {
      refetchOnWindowFocus: true,
    },
  });

  useEffect(() => {
    if (fetchSyncProgress.isSuccess) {
      setSyncProgress(fetchSyncProgress.data.data.data);
    }
  }, [fetchSyncProgress.data?.data.data, fetchSyncProgress.isSuccess]);

  useEffect(() => {
    if (fetchSyncStatus.isSuccess) {
      setIsSyncAllowed(fetchSyncStatus.data.data.data[0]);
      setRetryMessage(fetchSyncStatus.data.data.data[1]);
    }
  }, [fetchSyncStatus.data, fetchSyncStatus.isSuccess]);

  const {
    mutateAsync: triggerSync,
    isPending,
    isIdle,
  } = useAppMutation({
    mutationFn: ({
      metaId,
      marketplace,
    }: {
      metaId: string;
      marketplace: MarketplaceEnum;
    }) => monitoringService.masterSyncTrigger(metaId, marketplace),
    options: {
      onSettled() {
        fetchSyncStatus.refetch();
        handleFetchSyncProgress();
      },
    },
  });

  const triggerMasterSync = () => {
    triggerSync({
      marketplace: accountData.marketplace,
      metaId: String(metaId),
    });
  };

  const handleFetchSyncProgress = () => {
    fetchSyncProgress.refetch();
  };

  const isSyncLoading = useMemo(
    () =>
      (isPending === true && isIdle === false) ||
      fetchSyncStatus.isLoading ||
      fetchSyncStatus.isRefetching ||
      fetchSyncProgress.isLoading ||
      fetchSyncProgress.isRefetching,
    [
      fetchSyncProgress.isLoading,
      fetchSyncProgress.isRefetching,
      fetchSyncStatus.isLoading,
      fetchSyncStatus.isRefetching,
      isIdle,
      isPending,
    ]
  );
  const handleAdsConnect = () => {
    if (accountData.marketplace === MarketplaceEnum.WALMART)
      dispatch(setIsWmtConnectFormOpen(true));
    navigate(`onboarding-page/${accountData.marketplace}`);
  };
  return (
    <React.Fragment>
      <div
        style={{
          color: disable ? '#bfbfbf' : '',
          cursor: disable ? 'not-allowed' : '',
          width: '100%',
        }}
        className={styles.idSection}
      >
        <span className={styles.idLabel}>{displayItems.label}</span>
        <div className={styles.divider} />
        {displayItems.value ? (
          <span className={styles.idValue}>{displayItems.value}</span>
        ) : (
          <p>--</p>
        )}
      </div>
      {accountData.advertising && !disable ? (
        <React.Fragment>
          <Sync
            isSyncing={
              fetchSyncProgress.data?.data.data !== undefined &&
              !Number.isNaN(fetchSyncProgress.data?.data.data)
            }
            lastSync={accountData.advertising?.lastSyncTimeAdvertising}
            value={syncProgress}
            isSyncAllowed={isSyncAllowed}
            retryMessage={retryMessage}
            masterSync={triggerMasterSync}
            isLoading={isSyncLoading}
            fetchSyncProgress={handleFetchSyncProgress}
          />
          {/* <NextTriggerAt
            nextTriggerAt={accountData.advertising?.bidderNextTriggerAt}
          /> */}
        </React.Fragment>
      ) : (
        <Connect
          buttonDesc={props.buttonDesc}
          handleSyncingData={handleAdsConnect}
          isDisabled={props.disable}
        />
      )}
    </React.Fragment>
  );
};
const CatalogAccountDetailsSection = (props: IAccountDetailsSectionsProps) => {
  const isSyncing = false; //TODO: change when catalog sync in available
  const { accountData, disable } = props;
  const { marketplace } = accountData;

  const navigate = useNavigate();
  const partnerId = accountData.catalog?.partnerId;
  const partnerStoreId = accountData.catalog?.partnerStoreId;

  const handleCatalogConnect = () => {
    if (
      marketplace === MarketplaceEnum.WALMART &&
      accountData.accountType === WalmartAccountTypeEnum.THIRD_PARTY
    ) {
      handleOnboardingConnect(
        getRedirectURLByWMTClientType(WalmartClientTypeEnum.SELLER)
      );
      return;
    }
    if (
      marketplace === MarketplaceEnum.WALMART &&
      accountData.accountType === WalmartAccountTypeEnum.FIRST_PARTY
    ) {
      handleOnboardingConnect(
        getRedirectURLByWMTClientType(
          WalmartClientTypeEnum.SUPPLIER,
          accountData.advertising?.walmartAdvertiserId
        )
      );
      return;
    }
    navigate(`onboarding-page/${marketplace}`);

    // TODO: Define for the rest of the cases, Amazon 1p, Amazon 3p, Walmart 1p
  };

  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <div
        className={styles.partnerSection}
        style={{
          color: disable ? '#bfbfbf' : '',
        }}
      >
        {marketplace === MarketplaceEnum.AMAZON ? (
          <React.Fragment>
            <span className={styles.idLabel}>Partner ID</span>
            <div className={styles.divider} />
            {partnerId && !disable ? (
              <span className={styles.idValue}>{partnerId}</span>
            ) : (
              <p className={`${styles.idValue} ${styles.empty}`}>--</p>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <span className={styles.idLabel}>Partner ID</span>
            <div className={styles.divider} />

            {partnerId && !disable ? (
              <span className={styles.idValue}>{partnerId}</span>
            ) : (
              <p className={`${styles.idValue} ${styles.empty}`}>--</p>
            )}

            <div
              className={styles.divider}
              style={{
                height: '1.3rem',
              }}
            />

            <span className={styles.idLabel}>Store ID</span>
            <div className={styles.divider} />
            {partnerStoreId && !disable ? (
              <span className={styles.idValue}>{partnerStoreId}</span>
            ) : (
              <p className={`${styles.idValue} ${styles.empty}`}>--</p>
            )}
          </React.Fragment>
        )}
      </div>
      {accountData.catalog ? (
        <Sync
          isSyncing={isSyncing}
          lastSync={accountData.advertising?.lastSyncTimeAdvertising}
          value={35}
        />
      ) : (
        <Connect
          buttonDesc={props.buttonDesc}
          handleSyncingData={handleCatalogConnect}
          isDisabled={props.disable}
        />
      )}
    </div>
  );
};

const Connect = (props: {
  buttonDesc?: string;
  handleSyncingData: () => void;
  isDisabled: boolean;
}) => {
  const { buttonDesc, handleSyncingData, isDisabled } = props;
  const color = isDisabled ? '#bfbfbf' : '#F26E77';
  return (
    <div
      className={styles.connectSection}
      style={{
        cursor: isDisabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '0.4rem',
          width: '64%',
        }}
      >
        {' '}
        <WarningCircleIcon
          size={13}
          className={styles.warningIcon}
          color={color}
        />
        {buttonDesc}
      </span>

      <PrimaryButton
        fontWeight="100"
        width="auto"
        buttonText={'Connect'}
        buttonFunction={handleSyncingData}
        disabled={isDisabled}
      ></PrimaryButton>
    </div>
  );
};
