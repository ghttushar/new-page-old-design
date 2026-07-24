import styles from './empty-state.module.scss';

interface EmptyStateProps {
  variant?: 'search' | 'needs_me' | 'none' | 'default';
}

export function EmptyState({ variant = 'default' }: EmptyStateProps) {
  const config: Record<string, { title: string; desc: string; icon: string }> = {
    search: { title: 'No results found', desc: 'Try adjusting your search or filters to find what you\'re looking for.', icon: '?' },
    needs_me: { title: 'All caught up!', desc: 'No signals need your attention right now. You\'re in good shape.', icon: '✓' },
    none: { title: 'Nothing here yet', desc: 'Signals will appear here as they are generated.', icon: '—' },
    default: { title: 'No signals to show', desc: 'Select a category to see relevant signals.', icon: '~' },
  };
  const c = config[variant] || config.default;
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>{c.icon}</div>
      <h3>{c.title}</h3>
      <p>{c.desc}</p>
    </div>
  );
}