import { INotificationItem } from '@/interfaces/notifications/notification.interface';
import { relativeTimeAgo } from '@/utils/relative-time.utils';
import {
  ArrowRightIcon,
  AtomIcon,
  CaretDownIcon,
  ChartBarIcon,
  MegaphoneSimpleIcon,
  UserCircleGearIcon,
  XIcon,
} from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import styles from './notifications.module.scss';

// Only icons from the left navigation: Advertising, Rules, Reports and Settings.
const CATEGORY_ICON = {
  campaign: MegaphoneSimpleIcon,
  rule: AtomIcon,
  report: ChartBarIcon,
  account: UserCircleGearIcon,
};

interface INotificationRowProps {
  item: INotificationItem;
  now: number;
  /** True for a notification that has just arrived: it slides in and its background fades from a light tint. */
  isNew?: boolean;
  onRead: (id: string) => void;
  /** The X in the top right corner: removes the notification. */
  onDismiss: (id: string) => void;
  onNavigate: (path: string) => void;
}

export default function NotificationRow({ item, now, isNew, onRead, onDismiss, onNavigate }: INotificationRowProps) {
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  // Only notifications with more to say can be opened; the rest show their text as they are.
  const expandable = Boolean(item.details || (item.facts && item.facts.length > 0));
  const Icon = CATEGORY_ICON[item.category];
  const time = relativeTimeAgo(item.createdAt, now);

  const open = () => {
    if (!item.read) onRead(item.id);
    if (expandable) setExpanded((v) => !v);
  };

  const cta = item.cta && (
    <button type="button" className={styles.cta} onClick={() => { onRead(item.id); onNavigate(item.cta!.path); }}>
      {item.cta.label}
      <ArrowRightIcon size={14} weight="bold" />
    </button>
  );

  return (
    <motion.li
      className={`${styles.row}${item.read ? '' : ` ${styles.rowUnread}`}${isNew ? ` ${styles.rowNew}` : ''}`}
      layout={reduceMotion ? false : 'position'}
      initial={isNew && !reduceMotion ? { opacity: 0, y: -12 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
    >
      <button
        type="button"
        className={styles.rowMain}
        onClick={open}
        aria-expanded={expandable ? expanded : undefined}
      >
        <span className={styles.iconTile} aria-hidden>
          <Icon size={20} />
          {item.read ? null : <span className={styles.iconDot} />}
        </span>
        <span className={styles.text}>
          <span className={`${styles.title}${item.read ? '' : ` ${styles.titleUnread}`}`}>
            {item.read ? null : <span className={styles.srOnly}>Unread. </span>}
            {item.title}
          </span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expandable && expanded && (
          <motion.div
            className={styles.expand}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.expandInner}>
              {/* The subtext shows only when the notification is opened; folded up it is just the title. */}
              <p className={styles.details}>{item.preview}</p>
              {item.details ? <p className={styles.details}>{item.details}</p> : null}
              {item.facts && item.facts.length > 0 ? (
                <dl className={styles.facts}>
                  {item.facts.map((fact) => (
                    <div key={fact.label} className={styles.fact}>
                      <dt>{fact.label}</dt>
                      <dd>{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              {cta}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom row: the time on the right, with the arrow when the notification opens. A notification that does not open has its action here, right after the title. */}
      <div className={styles.foot}>
        <span>{expandable ? null : cta}</span>
        {expandable ? (
          <button
            type="button"
            className={`${styles.meta}${item.read ? '' : ` ${styles.metaUnread}`}`}
            onClick={open}
            aria-expanded={expanded}
            aria-label={`${time}. ${expanded ? 'Show less' : 'Show more'}`}
          >
            {time}
            <span className={`${styles.chevron}${expanded ? ` ${styles.chevronOpen}` : ''}`} aria-hidden>
              <CaretDownIcon size={12} weight="bold" />
            </span>
          </button>
        ) : (
          <span className={`${styles.meta}${item.read ? '' : ` ${styles.metaUnread}`}`}>{time}</span>
        )}
      </div>

      <button type="button" className={styles.dismiss} onClick={() => onDismiss(item.id)} aria-label={`Remove notification: ${item.title}`} title="Remove">
        <XIcon size={14} weight="bold" />
      </button>
    </motion.li>
  );
}
