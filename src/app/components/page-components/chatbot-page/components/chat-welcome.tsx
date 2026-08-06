import { ACCOUNTS_PAGE_URL } from '@/constants/urls.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IUser } from '@/interfaces/auth.interfaces';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../../common/primary-button/primary-button';
import OnboardingSelectMarketplace from '../../../pages/advertising-page/onboarding-page/onboarding-select-account-modal';
import styles from './chat-welcome.module.scss';

interface ChatWelcomeProps {
  user: IUser | null;
  hasAdvertisingAccounts: boolean;
  samplePrompts: string[];
  onSelectPrompt: (prompt: string) => void;
  isExpanded: boolean;
}

const ConnectAccountButton = () => {
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
        title="Select Marketplace"
        openConfirmation={openModal}
        handleConfirmationClose={handleClose}
        handleMarketplaceClick={handleClick}
      />
    </React.Fragment>
  );
};

export const ChatWelcome: React.FC<ChatWelcomeProps> = ({
  user,
  hasAdvertisingAccounts,
  samplePrompts,
  onSelectPrompt,
  isExpanded,
}) => {
  const handlePromptClick = (prompt: string) => {
    onSelectPrompt(prompt);
  };

  return (
    <div className={styles.chatbotContainer}>
      <span className={styles.welcomeMsg}>
        Hey {user?.firstName}, how can I help with your business today?
      </span>
      <span className={styles.subWelcomeMSG}>
        Start a conversation with "JIVA" by typing a message below.
      </span>
      {hasAdvertisingAccounts ? (
        <div
          className={`${styles.promptCardContainer} ${
            isExpanded ? styles.expanded : styles.compact
          }`}
        >
          {samplePrompts.map((prompt) => (
            <div
              key={prompt}
              className={styles.promptCard}
              onClick={() => handlePromptClick(prompt)}
            >
              {prompt}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.staticPageContainer}>
          <p>Unlock AI-powered analysis and recommendations.</p>
          <ConnectAccountButton />
        </div>
      )}
    </div>
  );
};
