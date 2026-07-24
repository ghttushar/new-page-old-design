import ReactMarkdown from 'react-markdown';
import { IThreadMessage } from 'src/interfaces/amc.interfaces';
import styles from './gpt-chat-modal.module.scss';

interface GPTMessageProps {
  conversation: IThreadMessage;
}
export const GPTMessage: React.FC<GPTMessageProps> = ({ conversation }) => {
  return (
    <div
      id={conversation.role}
      className={styles.chatMessageContainer}
      key={conversation.id}
    >
      <ReactMarkdown className={styles.chatText}>
        {conversation.content[0].text.value}
      </ReactMarkdown>
    </div>
  );
};
