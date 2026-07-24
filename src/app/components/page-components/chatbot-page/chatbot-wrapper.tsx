import { imageUrls } from '@/constants/assets/images.constants';
import { useAppSelector } from '@/redux/hooks';
import { selectIsChatbotOpen } from '@/redux/slices/auth/auth.slice';
import ImgComponent from '../../common/img-component/img-component';
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
      <ImgComponent
        onClick={isDisabled ? undefined : toggleChatbot}
        className={`${styles.chatbotButtonIcon} ${
          isChatbotOpen ? styles.active : styles.inactive
        }`}
        imageURL={
          isChatbotOpen ? imageUrls.botIcon : imageUrls.jivaInactiveIcon
        }
        alt="chatbot-icon"
        customStyles={{
          opacity: isDisabled ? 0.4 : 1,
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          filter: isDisabled ? 'grayscale(1)' : 'none',
        }}
      />
    </div>
  );
}
