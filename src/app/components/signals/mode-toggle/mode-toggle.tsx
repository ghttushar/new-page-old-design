import styles from './mode-toggle.module.scss';

interface ModeToggleProps {
  liveMode: boolean;
  onToggle: () => void;
}

export function ModeToggle({ liveMode, onToggle }: ModeToggleProps) {
  return (
    <div className={styles.modeToggle}>
      <button
        className={`${styles.option} ${!liveMode ? styles.active : ''}`}
        onClick={() => { if (liveMode) onToggle(); }}
      >
        ○ Assisted
      </button>
      <button
        className={`${styles.option} ${liveMode ? styles.active : ''}`}
        onClick={() => { if (!liveMode) onToggle(); }}
      >
        ● Live
      </button>
    </div>
  );
}