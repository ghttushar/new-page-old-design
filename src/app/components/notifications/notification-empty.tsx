import { NotificationTab } from '@/interfaces/notifications/notification.interface';
import styles from './notifications.module.scss';

interface INotificationEmptyProps {
  tab: NotificationTab;
  /** True when a search or type filter is what emptied the list. */
  filtered?: boolean;
}

const COPY = {
  none: {
    title: 'All quiet',
    text: 'Your bell is catching some Zs. We will wake it up when something happens.',
  },
  caughtUp: {
    title: 'Inbox zero, hero',
    text: 'You have read everything. Go stare at a chart for fun.',
  },
  noMatch: {
    title: 'Not a single match',
    text: 'Try another word or type. Even the bell is squinting.',
  },
};

/** One large, quiet outline bell. No box, no motion. */
function EmptyBell() {
  return (
    <span className={styles.emptyMark} aria-hidden>
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9.5a6 6 0 0 1 12 0c0 4.2 1.3 5.6 2 6.5H4c.7-.9 2-2.3 2-6.5Z" />
        <path d="M10 19.5a2.2 2.2 0 0 0 4 0" />
      </svg>
    </span>
  );
}

export default function NotificationEmpty({ tab, filtered }: INotificationEmptyProps) {
  const copy = filtered ? COPY.noMatch : tab === 'unread' ? COPY.caughtUp : COPY.none;
  return (
    <div className={styles.empty}>
      <EmptyBell />
      <p className={styles.emptyTitle}>{copy.title}</p>
      <p className={styles.emptyText}>{copy.text}</p>
    </div>
  );
}
