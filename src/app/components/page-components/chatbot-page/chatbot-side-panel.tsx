import { ArrowSquareOutIcon, XIcon } from '@phosphor-icons/react';
import React from 'react';
import styles from './chatbot-side-panel.module.scss';

interface ChatbotSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  height?: string;
  width?: string;
  url?: string | null;
}

export const ChatbotSidePanel: React.FC<ChatbotSidePanelProps> = ({
  isOpen,
  onClose,
  title = 'Report Preview',
  children,
  height = '',
  width = '',
  url = '',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className={styles.sidePanel}
      style={{
        height,
        width,
      }}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>
          {title}
          <a
            href={url ?? ''}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            <ArrowSquareOutIcon weight="light" size={'1.6rem'} />
          </a>
        </h3>
        <button className={styles.closeButton} onClick={onClose}>
          <XIcon size={'2rem'} cursor={'pointer'} />
        </button>
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
};

export default ChatbotSidePanel;
