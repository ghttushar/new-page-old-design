import { MagnifyingGlass, CheckCircle, Minus, ArrowsClockwise } from '@phosphor-icons/react';
import styles from './empty-state.module.scss';

interface EmptyStateProps {
  variant?: 'search' | 'needs_me' | 'none' | 'default';
}

const iconMap: Record<string, React.ReactNode> = {
  search: <MagnifyingGlass size={48} weight="thin" />,
  needs_me: <CheckCircle size={48} weight="thin" />,
  none: <Minus size={48} weight="thin" />,
  default: <ArrowsClockwise size={48} weight="thin" />,
};

const bgColors: Record<string, string> = {
  search: 'rgba(119,70,155,0.06)',
  needs_me: 'rgba(56,142,60,0.06)',
  none: 'rgba(0,0,0,0.04)',
  default: 'rgba(119,70,155,0.06)',
};

const bgStrokes: Record<string, string> = {
  search: 'rgba(119,70,155,0.12)',
  needs_me: 'rgba(56,142,60,0.12)',
  none: 'rgba(0,0,0,0.08)',
  default: 'rgba(119,70,155,0.12)',
};

export function EmptyState({ variant = 'default' }: EmptyStateProps) {
  const config: Record<string, { title: string; desc: string }> = {
    search: { title: 'No results found', desc: 'Try adjusting your search or filters to find what you\'re looking for.' },
    needs_me: { title: 'All caught up!', desc: 'No signals need your attention right now. You\'re in good shape.' },
    none: { title: 'Nothing here yet', desc: 'Signals will appear here as they are generated.' },
    default: { title: 'No signals to show', desc: 'Select a category to see relevant signals.' },
  };
  const c = config[variant] || config.default;

  return (
    <div className={styles.emptyState}>
      <div className={styles.iconWrap}>
        <svg
          className={styles.bgIllustration}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="60" cy="60" r="56" fill={bgColors[variant]} stroke={bgStrokes[variant]} strokeWidth="1" />
          <path
            d="M40 60 C40 35, 60 20, 80 40 C100 60, 85 90, 60 85 C35 80, 40 85, 40 60Z"
            fill={bgStrokes[variant]}
          />
        </svg>
        <div className={styles.icon}>{iconMap[variant]}</div>
      </div>
      <h3>{c.title}</h3>
      <p>{c.desc}</p>
    </div>
  );
}
