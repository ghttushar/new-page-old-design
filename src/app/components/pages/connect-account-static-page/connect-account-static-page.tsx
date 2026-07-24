import { imageUrls } from '@/constants/assets/images.constants';
import { ACCOUNTS_PAGE_URL } from '@/constants/urls.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { useAppSelector } from '@/redux/hooks';
import { selectUser } from '@/redux/slices/auth/auth.slice';
import { getTitleCaseString } from '@/utils';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../common/primary-button/primary-button';
import OnboardingSelectMarketplace from '../advertising-page/onboarding-page/onboarding-select-account-modal';
import styles from './connect-account-static-page.module.scss';

interface IConnectAccountStaticPageProps {
  marketplaceSpecific?: MarketplaceEnum;
  isCatalogRequired?: boolean;
  customContent?: string;
}

export default function ConnectAccountStaticPage({
  marketplaceSpecific = undefined,
  isCatalogRequired = undefined,
  customContent = undefined,
}: IConnectAccountStaticPageProps) {
  useSubHeader('', '', true);
  const user = useAppSelector(selectUser);

  return (
    <div className={styles.staticPageContainer}>
      <div className={styles.staticPageContent}>
        <pre className={styles.staticPageMessage}>
          <h1>
            Welcome to Anarix, <span>{user?.firstName || 'User'}</span>
          </h1>
          <h3>
            {customContent
              ? customContent
              : `Connect your ${
                  !marketplaceSpecific ||
                  marketplaceSpecific === MarketplaceEnum.All
                    ? 'Amazon or Walmart'
                    : getTitleCaseString(marketplaceSpecific)
                }${
                  isCatalogRequired === true ? ' Catalog' : ''
                } account to get started.`}
          </h3>
        </pre>
        <ConnectAccountButton />
      </div>

      <img
        className={styles.staticPageImg}
        src={imageUrls.welcomeImg}
        alt="Static page"
        loading="eager"
        decoding="async"
        role="presentation"
      />
    </div>
  );
}

export const ConnectAccountButton = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleClose = () => setOpenModal(false);

  const handleClick = (marketplace: MarketplaceEnum) => {
    navigate(`${ACCOUNTS_PAGE_URL}/onboarding-page/${marketplace}`);
    handleClose();
  };

  return (
    <React.Fragment>
      <PrimaryButton
        buttonText="Connect Account"
        buttonFunction={() => setOpenModal(true)}
        disabled={false}
        width="auto"
      />

      <OnboardingSelectMarketplace
        title={'Select Marketplace'}
        openConfirmation={openModal}
        handleConfirmationClose={handleClose}
        handleMarketplaceClick={handleClick}
      />
    </React.Fragment>
  );
};
