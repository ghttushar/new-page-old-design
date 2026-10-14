import {
  INCOMING_INTERVAL_MS,
  NOTIFICATION_PEEK_MS,
} from '@/constants/notifications/notifications.constants';
import { SIMULATED_NOTIFICATIONS } from '@/constants/notifications/notifications-mock';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addNotification,
  selectLastNotificationArrival,
  selectNotificationPreview,
  selectNotifications,
} from '@/redux/slices/notifications/notification-center.slice';
import { BellSimpleIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import NotificationDrawer from './notification-drawer';
import useModalLock from './use-modal-lock';
import styles from './notifications.module.scss';

/** While the Incoming preview is on, a new notification arrives every few seconds so the arrival animation keeps playing. */
function useIncomingArrivals(active: boolean) {
  const dispatch = useAppDispatch();
  const next = useRef(0);

  useEffect(() => {
    if (!active) return undefined;
    const push = () => {
      const template = SIMULATED_NOTIFICATIONS[next.current % SIMULATED_NOTIFICATIONS.length];
      next.current += 1;
      const createdAt = Date.now();
      dispatch(addNotification({ ...template, id: `live-${createdAt}`, createdAt, read: false }));
    };
    push();
    const interval = window.setInterval(push, INCOMING_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [active, dispatch]);
}

interface IPeek {
  id: string;
  title: string;
  preview: string;
}

export default function NotificationBell() {
  const allItems = useAppSelector(selectNotifications);
  const preview = useAppSelector(selectNotificationPreview);
  const arrival = useAppSelector(selectLastNotificationArrival);
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [ring, setRing] = useState(0);
  const [peek, setPeek] = useState<IPeek | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const peekTimer = useRef<number>();

  useIncomingArrivals(preview === 'incoming');
  // With the panel open the page behind it cannot scroll, be clicked or be tabbed into.
  useModalLock(open);

  // The Empty preview shows no notifications at all, so there is no badge either.
  const items = preview === 'empty' ? [] : allItems;
  const unread = items.filter((n) => !n.read).length;

  // A notification arrives while the app is open: the bell shakes and sends out ripples, the badge pops, a small card
  // under the bell names the new notification, and screen readers hear it. Only a fresh arrival counts, so remounting
  // the header on another page does not replay it.
  useEffect(() => {
    if (!arrival || Date.now() - arrival.at > 2500) return;
    const item = allItems.find((n) => n.id === arrival.id);
    setRing((r) => r + 1);
    setAnnouncement(item ? `New notification: ${item.title}` : '');
    if (item) {
      setPeek({ id: item.id, title: item.title, preview: item.preview });
      window.clearTimeout(peekTimer.current);
      peekTimer.current = window.setTimeout(() => setPeek(null), NOTIFICATION_PEEK_MS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrival?.at]);

  useEffect(() => () => window.clearTimeout(peekTimer.current), []);

  // Opening the panel takes the card away; closing it returns focus to the bell.
  useEffect(() => {
    if (open) setPeek(null);
    if (wasOpen.current && !open) buttonRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  const badge = unread > 9 ? '9+' : String(unread);
  const animated = ring > 0 && !reduceMotion;

  return (
    <div className={styles.bellWrap}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.bellButton}
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {animated ? (
          <motion.span
            key={`glow-${ring}`}
            className={styles.bellGlow}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            aria-hidden
          />
        ) : null}
        {animated
          ? [0, 0.2].map((delay) => (
              <motion.span
                key={`ripple-${ring}-${delay}`}
                className={styles.bellPulse}
                initial={{ opacity: 0.55, scale: 1 }}
                animate={{ opacity: 0, scale: 2.6 }}
                transition={{ duration: 1.1, delay, ease: 'easeOut' }}
                aria-hidden
              />
            ))
          : null}
        <motion.span
          key={`ring-${ring}`}
          className={styles.bellIcon}
          initial={{ rotate: 0, scale: 1 }}
          animate={animated ? { rotate: [0, -24, 20, -16, 12, -8, 4, 0], scale: [1, 1.22, 1.22, 1.14, 1.08, 1.04, 1] } : { rotate: 0, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <BellSimpleIcon size={24} weight={unread > 0 ? 'fill' : 'regular'} />
        </motion.span>
        <AnimatePresence>
          {unread > 0 ? (
            <motion.span
              key="badge"
              className={styles.badge}
              initial={reduceMotion ? false : { scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 520, damping: 22 }}
              aria-hidden
            >
              {animated ? (
                <motion.span
                  key={`badge-ring-${ring}`}
                  className={styles.badgeRing}
                  initial={{ opacity: 0.7, scale: 1 }}
                  animate={{ opacity: 0, scale: 2.2 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              ) : null}
              <motion.span
                key={badge}
                style={{ display: 'inline-block' }}
                initial={reduceMotion ? false : { scale: 1.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 460, damping: 12 }}
              >
                {badge}
              </motion.span>
            </motion.span>
          ) : null}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {peek && !open ? (
          <motion.button
            key={peek.id}
            type="button"
            className={styles.peek}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            onClick={() => setOpen(true)}
            aria-label={`Open notifications: ${peek.title}`}
          >
            <span className={styles.peekTop}>
              <span className={styles.peekDot} aria-hidden />
              <span className={styles.peekTitle}>{peek.title}</span>
              <span className={styles.peekTime}>just now</span>
            </span>
            <span className={styles.peekText}>{peek.preview}</span>
          </motion.button>
        ) : null}
      </AnimatePresence>

      <span className={styles.srOnly} role="status" aria-live="polite">
        {announcement}
      </span>
      <NotificationDrawer open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
