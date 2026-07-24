import {
  getAccountTypeDetailsByMarketplace,
  getDisconnectTextByAccountType,
} from '@/utils/advertising.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { useState } from 'react';
import NewConfirmationBox from 'src/app/components/common/confirmation-box/new-confirmation-box';
import {
  CONNECT_BUTTON_DESC_ADVERTISING,
  CONNECT_BUTTON_DESC_CATALOG,
  DISCONNECT_ADVERTISING,
  DISCONNECT_CONFIRMATION_TEXT,
  DISCONNECT_CONFIRMATION_TITLE,
  DISCONNECT_PRODUCT_CATALOG,
} from 'src/constants/settings/settings.constants';
import { ISettingsAccount } from 'src/interfaces/settings.interface';
import { useAppDispatch } from 'src/redux/hooks';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { accountsServices } from 'src/services/settings/accounts.service';
import styles from './account-card.module.scss';
import AccountCardHeader from './accounts/account-card-header';
import AccountDetailsSections from './accounts/account-details-section';
import AccountTypeSection from './accounts/account-type-section';

interface ISettingsProfileComponentProps {
  accountData: ISettingsAccount;
  updateAccountData: (
    bidderJobId: string,
    bidderStatus: string,
    amazonProfileId: string,
    walmartAdvertiserId: string,
    bidderTypeLockUntil: string,
    lastBidderTypeChange: string
  ) => void;
  setTrigger: () => void;
}

const SettingsProfileComponent = ({
  accountData,
  updateAccountData,
  setTrigger,
}: ISettingsProfileComponentProps) => {
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    setOpenConfirmationModal(false);
  };

  const handleOpenModal = () => {
    setOpenConfirmationModal(true);
  };

  const handleSelectedOption = (option: string | null) => {
    setSelectedOption(option);
  };

  const handleConfirmationClick = () => {
    if (DISCONNECT_ADVERTISING === selectedOption) {
      accountsServices
        .deleteAmazonAccount(accountData.advertising?.amazonProfileId as string)
        .then(() => {
          dispatch(
            showSuccessToastMessage({
              title: `Successfully disconnected Amazon account`,
            })
          );
          localStorageUtils.removeAccountDetailsFromLocalStorage();
        })
        .finally(() => {
          handleCloseModal();
          setTrigger();
        });
    }
    if (DISCONNECT_PRODUCT_CATALOG === selectedOption) {
      accountsServices
        .deleteAmazonSPAccount(accountData.catalog?.partnerId as string)
        .then(() => {
          dispatch(
            showSuccessToastMessage({
              title: `Successfully disconnected Amazon SP account`,
            })
          );
          localStorageUtils.removeAccountDetailsFromLocalStorage();
        })
        .finally(() => {
          handleCloseModal();
          setTrigger();
        });
    }
  };

  return (
    <div className={styles.settingsProfileCard}>
      <AccountCardHeader
        accountData={accountData}
        handleSelectedOption={handleSelectedOption}
        handleOpenModal={handleOpenModal}
      />

      <div className={styles.accountInfo}>
        <AccountTypeSection
          accountType={accountData.accountType}
          marketplace={accountData.marketplace}
        />
        <div className={styles.verticalDivider} />
      </div>

      <div className={styles.dataSyncSection}>
        <span className={styles.dataSyncLabel}>Data Sync</span>
        <AccountDetailsSections
          accountData={accountData}
          accountType="Advertising"
          buttonDesc={CONNECT_BUTTON_DESC_ADVERTISING}
          advertisingId={accountData?.advertising?.amazonProfileId}
          disable={false}
        />
        <AccountDetailsSections
          accountData={accountData}
          accountType="Product Catalog"
          disable={false}
          buttonDesc={CONNECT_BUTTON_DESC_CATALOG}
        />
      </div>

      {openConfirmationModal === true && (
        <NewConfirmationBox
          title={DISCONNECT_CONFIRMATION_TITLE}
          description={
            selectedOption === DISCONNECT_ADVERTISING
              ? DISCONNECT_CONFIRMATION_TEXT
              : getDisconnectTextByAccountType(
                  getAccountTypeDetailsByMarketplace(
                    accountData.marketplace,
                    accountData.accountType
                  )[0]
                )
          }
          openConfirmation={openConfirmationModal}
          handleConfirmationClose={handleCloseModal}
          handleConfirmClick={handleConfirmationClick}
          isConfirmButtonRequired={true}
          confirmButtonText="Disconnect"
        />
      )}
    </div>
  );
};

export default SettingsProfileComponent;
