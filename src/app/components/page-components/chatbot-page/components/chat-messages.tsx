import { FeedBackEnum } from '@/enums/chatbot.enums';
import { IParsedChatHistoryResponse } from '@/interfaces/chatbot.interface';
import CircularProgress from '@mui/material/CircularProgress';
import React, { useEffect } from 'react';
import HistoryConversation from '../chatbot-history-conversation';
import styles from './chat-messages.module.scss';

interface ChatMessagesProps {
  messages: IParsedChatHistoryResponse[];
  isLoading: boolean;
  isExpanded: boolean;
  isHistorySession: boolean;
  sessionId: string;
  isChatbotLoading: boolean;
  updateFeedback: (message_id: string, value: FeedBackEnum) => void;
  sendUserMessage: (message: string) => void;
  isSidePanelOpen: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  isExpanded,
  isHistorySession,
  sessionId,
  isChatbotLoading,
  updateFeedback,
  sendUserMessage,
  isSidePanelOpen,
}) => {
  useEffect(() => {
    const lastIdx = messages.length - 1;
    if (lastIdx >= 0) {
      const element = document.getElementById(String(lastIdx));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages.length, isLoading]);

  return (
    <div className={styles.chatContainer}>
      {isLoading ? (
        <div className={styles.loadingContainer}>
          <CircularProgress size={'5rem'} sx={{ color: '#77469b' }} />
        </div>
      ) : messages.length === 0 ? (
        <div className={styles.noData}>
          <h1>No conversation history found</h1>
        </div>
      ) : (
        <div
          className={styles.conversationContainer}
          style={{
            width: isExpanded === false ? '100%' : '',
          }}
        >
          <div className={styles.messageWrapper}>
            <HistoryConversation
              historyChatData={messages}
              isHistoryLoading={isLoading}
              isChatbotLoading={isChatbotLoading}
              isExpanded={isExpanded}
              sessionId={sessionId}
              isHistorySession={isHistorySession}
              updateFeedback={updateFeedback}
              sendUserMessage={sendUserMessage}
            />
          </div>
        </div>
      )}
    </div>
  );
};
