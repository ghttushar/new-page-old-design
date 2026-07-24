import styles from './thinking-indicator.module.scss';

interface ThinkingIndicatorProps {
  statusText?: string;
}

export const ThinkingIndicator = ({
  statusText = 'Thinking...',
}: ThinkingIndicatorProps) => {
  return (
    <div className={styles.thinkingIndicator}>
      <div className={styles.thinkingDots}>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
        <span className={styles.dot}></span>
      </div>
      <span className={styles.thinkingText}>{statusText}</span>
    </div>
  );
};

export default ThinkingIndicator;
