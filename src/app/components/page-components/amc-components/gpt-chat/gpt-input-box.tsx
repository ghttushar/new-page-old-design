import { PaperPlaneRightIcon } from '@phosphor-icons/react';
import styles from './gpt-chat-modal.module.scss';

export const GPTInputBox: React.FC = () => {
  return (
    <div className={styles.inputPromptContainer}>
      <input type="text" />
      <PaperPlaneRightIcon
        size={28}
        color="#77469b"
        weight="fill"
        className={styles.chatSendButton}
      />
    </div>
  );
};
