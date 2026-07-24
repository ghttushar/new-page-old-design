import ImgComponent from '@/app/components/common/img-component/img-component';
import { imageUrls } from '@/constants/assets/images.constants';
import { Avatar } from '@mui/material';
import { useEffect } from 'react';
import { avatarStyle } from 'src/app/components/layout/header/header-styles';
import { IUser } from 'src/interfaces/auth.interfaces';
import { useAppSelector } from 'src/redux/hooks';
import {
  selectConversations,
  selectIsConversationLoading,
} from 'src/redux/slices/amc/amc.slice';
import styles from './gpt-chat-modal.module.scss';
import { GPTLoader } from './gpt-loader';
import { GPTMessage } from './gpt-message';
import { GPTMessageTime } from './gpt-msg-time';

interface ChatWrapperProps {
  user: IUser | null;
}
export const ChatWrapper: React.FC<ChatWrapperProps> = ({ user }) => {
  const conversations = useAppSelector(selectConversations);
  const loading = useAppSelector(selectIsConversationLoading);

  useEffect(() => {
    const element = document.getElementById('gpt-chat-wrapper');
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }, [conversations.length]);

  return (
    <div id="gpt-chat-wrapper" className={styles.chatWrapper}>
      {conversations.map((conversation, index) => {
        return (
          <div
            className={styles.chatMessageWrapper}
            key={`${conversation.id}-${index}`}
          >
            {conversation.role === 'user' ? (
              <div
                className={styles.chatBlock}
                style={{
                  justifySelf: 'flex-end',
                }}
              >
                <div className={styles.chatHeader}>
                  <Avatar
                    sx={{
                      ...avatarStyle,
                      height: '3.2rem',
                      width: '3.2rem',
                      fontSize: '1.4rem',
                      marginRight: '0.3rem',
                    }}
                    alt={`${user?.firstName} ${user?.lastName}`}
                    children={`${user?.firstName[0].toUpperCase()}${user?.lastName[0].toUpperCase()}`}
                  />
                  <h5>{user?.firstName}</h5>
                </div>
                <GPTMessage conversation={conversation} />
                <GPTMessageTime role={conversation.role} />
              </div>
            ) : (
              <div
                className={styles.chatBlock}
                style={{
                  justifySelf: 'flex-start',
                }}
              >
                <div
                  className={styles.chatHeader}
                  style={{
                    justifyContent: 'flex-start',
                  }}
                >
                  <ImgComponent
                    imageURL={imageUrls.headerLogo}
                    alt="header-logo"
                    customStyles={{ marginRight: '0.3rem' }}
                  />
                  <h5>GPT</h5>
                </div>
                <GPTMessage conversation={conversation} />
                <GPTMessageTime role={conversation.role} />
              </div>
            )}
          </div>
        );
      })}
      {loading && <GPTLoader />}
    </div>
  );
};
