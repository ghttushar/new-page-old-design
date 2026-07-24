import { useCallback, useEffect, useState } from 'react';

import { PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import useMarketplaceSubheader from '@/hooks/use-marketplace-sub-header.hook';
import { settingsServices } from '@/services/settings/settings.service';
import { getSelectedMarketplaceAccounts } from '@/utils/advertising.utils';
import { useNavigate } from 'react-router-dom';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import PrimaryButton from 'src/app/components/common/primary-button/primary-button';
import { BidderStatusEnum } from 'src/enums/advertising.enums';
import { ISettingsAccount } from 'src/interfaces/settings.interface';
import { useAuthSelector } from 'src/redux/auth-selector/auth-selector';
import localStorageUtils from 'src/utils/local-storage/local-storage.utils';
import OnboardingSelectMarketplace from '../../advertising-page/onboarding-page/onboarding-select-account-modal';
import ConnectAccountStaticPage from '../../connect-account-static-page/connect-account-static-page';
import AmazonSettingsProfileComponent from './amazon-setting-profile';
import styles from './settings.module.scss';
import WalmartSettingsProfileComponent from './walmart-setting-profile';

export default function SettingsPage() {
  const [marketplace, countryCode] = useMarketplaceSubheader(
    PageTitleEnum.ACCOUNTS
  );
  const navigate = useNavigate();
  const authSelector = useAuthSelector();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountData, setAccountData] =
    useState<Array<ISettingsAccount> | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [trigger, setTrigger] = useState<boolean>(true);

  const handleClick = (marketplace: MarketplaceEnum) => {
    navigate(`onboarding-page/${marketplace}`);
  };

  const updateAccountData = (
    bidderJobId: string,
    bidderStatus: string,
    amazonProfileId: string,
    walmartAdvertiserId: string,
    bidderTypeLockUntil: string,
    lastBidderTypeChange: string
  ) => {
    if (accountData !== null && accountData.length > 0) {
      const updatedAccountDetails: Array<ISettingsAccount> = [];

      accountData.forEach((account) => {
        if (
          account?.advertising?.amazonProfileId === amazonProfileId &&
          account?.advertising?.walmartAdvertiserId === walmartAdvertiserId
        ) {
          updatedAccountDetails.push({
            ...account,
            advertising: {
              ...account?.advertising,
              bidderJobId: bidderJobId,
              bidderStatus: bidderStatus as BidderStatusEnum,
              bidderTypeLockUntil,
              lastBidderTypeChange,
            },
          });
          return;
        }

        return updatedAccountDetails.push(account);
      });

      setAccountData(updatedAccountDetails);
    }
  };

  const handleTrigger = () => {
    setTrigger((prev) => !prev);
  };

  const getSettingsAccount = useCallback(() => {
    setIsLoading(true);
    settingsServices
      .getSettingsAccount(MarketplaceEnum.All)
      .then((res) => {
        const availableAccounts = res.data.data;
        setAccountData(
          getSelectedMarketplaceAccounts(availableAccounts, marketplace)
        );
        localStorageUtils.setAvailableAccounts(availableAccounts);
        authSelector.setInitialAdvertisingAccount();
        authSelector.setInitialCatalogAccount();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    getSettingsAccount();
  }, [getSettingsAccount, trigger]);

  // TODO: need to update the logic to the below one and remove the accounts api above
  // useEffect(() => {
  //   localStorageUtils.removeAccountDetailsFromLocalStorage();

  //   const availableAccounts = localStorageUtils.getAvailableAccounts();
  //   setAccountData(
  //     getSelectedMarketplaceAccounts(availableAccounts, marketplace)
  //   );
  //   localStorageUtils.setAvailableAccounts(availableAccounts);
  //   authSelector.setInitialAdvertisingAccount();
  //   authSelector.setInitialCatalogAccount();
  // }, []);

  useEffect(() => {
    const availableAccounts = localStorageUtils.getAvailableAccounts();

    setAccountData(
      getSelectedMarketplaceAccounts(availableAccounts, marketplace)
    );
  }, [marketplace]);

  const hasAccounts = !!localStorageUtils.getAvailableAccounts().length;

  if (isLoading) return <LoaderWrapper />;
  else {
    if (!hasAccounts) {
      return <ConnectAccountStaticPage />;
    }

    return (
      <div className={styles.settingsComponent}>
        <OnboardingSelectMarketplace
          title={'Select Marketplace'}
          openConfirmation={openModal}
          handleConfirmationClose={() => setOpenModal(false)}
          handleMarketplaceClick={handleClick}
        />

        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginBottom: '0.6rem',
            marginRight: '1.2rem',
          }}
        >
          <PrimaryButton
            buttonText="Add Account"
            width="auto"
            height="3rem"
            buttonFunction={() => {
              setOpenModal(true);
            }}
            isButtonIconRequired={false}
            disabled={false}
          />
        </div>

        <div className={styles.settingsSubContainer}>
          {accountData !== null &&
            accountData.map((settingsAccount, index) => {
              if (settingsAccount.marketplace === MarketplaceEnum.AMAZON) {
                return (
                  <AmazonSettingsProfileComponent
                    key={index}
                    accountData={settingsAccount}
                    updateAccountData={updateAccountData}
                    setTrigger={handleTrigger}
                  />
                );
              } else {
                return (
                  <WalmartSettingsProfileComponent
                    key={index}
                    accountData={settingsAccount}
                    updateAccountData={updateAccountData}
                    setTrigger={handleTrigger}
                  />
                );
              }
            })}
        </div>
      </div>
    );
  }
}
