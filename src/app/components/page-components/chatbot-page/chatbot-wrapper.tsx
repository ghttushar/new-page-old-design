import { useAppSelector } from '@/redux/hooks';
import { selectIsChatbotOpen } from '@/redux/slices/auth/auth.slice';
import DiamondMascot from '../../common/diamond-mascot/diamond-mascot';
import styles from './chatbot-wrapper.module.scss';

interface IChatbotWrapperProps {
  toggleChatbot: () => void;
  isDisabled?: boolean;
}

export default function ChatbotWrapper({
  toggleChatbot,
  isDisabled = false,
}: IChatbotWrapperProps) {
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);

  return (
    <div className={styles.chatbotButtonContainer}>
      <DiamondMascot
        onClick={isDisabled ? undefined : toggleChatbot}
        size={32}
        className={`${styles.chatbotButtonIcon} ${
          isChatbotOpen ? styles.active : styles.inactive
        }`}
        style={{
          opacity: isDisabled ? 0.4 : 1,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          filter: isDisabled ? 'grayscale(1)' : 'none',
        }}
      />
    </div>
  );
}
