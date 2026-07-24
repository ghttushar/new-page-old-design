import { ConnectAccountButton } from '@/app/components/pages/connect-account-static-page/connect-account-static-page';
import { IUser } from '@/interfaces/auth.interfaces';
import React from 'react';
import styles from './chat-welcome.module.scss';

interface ChatWelcomeProps {
  user: IUser | null;
  hasAdvertisingAccounts: boolean;
  samplePrompts: string[];
  onSelectPrompt: (prompt: string) => void;
  isExpanded: boolean;
}

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
