import {
  NOTIFICATION_CLOCK_MS,
  NOTIFICATION_Z_INDEX,
} from '@/constants/notifications/notifications.constants';
import useNow from '@/hooks/use-now.hook';
import { NotificationTab } from '@/interfaces/notifications/notification.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  NotificationPreviewState,
  selectLastNotificationArrival,
  selectNotificationPreview,
  setNotificationPreview,
} from '@/redux/slices/notifications/notification-center.slice';
import { notificationDayBounds } from '@/utils/notification-range.utils';
import { XIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import NotificationDayPicker from './notification-day-picker';
import NotificationEmpty from './notification-empty';
import NotificationRow from './notification-row';
import styles from './notifications.module.scss';
import useNotificationFeed from './use-notification-feed';

interface INotificationDrawerProps {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const PREVIEW_OPTIONS: { id: NotificationPreviewState; label: string }[] = [
  { id: 'empty', label: 'Empty' },
  { id: 'normal', label: 'Normal' },
  { id: 'incoming', label: 'Incoming' },
];

function DrawerBody({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const now = useNow(NOTIFICATION_CLOCK_MS);
  const reduceMotion = useReducedMotion();
  const arrival = useAppSelector(selectLastNotificationArrival);
  const preview = useAppSelector(selectNotificationPreview);
  const [tab, setTab] = useState<NotificationTab>('all');
  const [day, setDay] = useState('');
  const dayBounds = useMemo(() => notificationDayBounds(day), [day]);
  const { visible, unreadCount, markRead, dismiss, markAllRead } = useNotificationFeed(tab, { range: tab === 'all' ? dayBounds : null }, true);
  const panelRef = useRef<HTMLElement>(null);

  // Focus moves into the panel when it opens; Tab stays inside it; Escape closes it.
  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab' || !panelRef.current) return;
    const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  const spring = reduceMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 320, damping: 34 };

  return (
    <>
      <motion.div
        className={styles.backdrop}
        style={{ zIndex: NOTIFICATION_Z_INDEX.backdrop }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2 }}
        onMouseDown={onClose}
        aria-hidden
      />
      <motion.aside
        ref={panelRef}
        className={styles.drawer}
        style={{ zIndex: NOTIFICATION_Z_INDEX.drawer }}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
        tabIndex={-1}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={spring}
        onKeyDown={onKeyDown}
      >
        <div className={styles.drawerHead}>
          <h2 className={styles.drawerTitle}>Notifications</h2>
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close notifications">
            <XIcon size={16} />
          </button>
        </div>

        {/* Forces what this panel shows, so each state can be looked at. */}
        <div className={styles.previewBar} role="radiogroup" aria-label="Preview state">
          {PREVIEW_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={preview === option.id}
              className={styles.previewOption}
              onClick={() => dispatch(setNotificationPreview(option.id))}
            >
              {preview === option.id ? (
                <motion.span layoutId="notification-preview-pill" className={styles.previewPill} transition={spring} />
              ) : null}
              <span className={styles.previewLabel}>{option.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.tabsRow}>
          <div className={styles.tabs} role="tablist" aria-label="Notification filter">
            {(['all', 'unread'] as NotificationTab[]).map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className={styles.tab}
                onClick={() => setTab(id)}
              >
                {id === 'all' ? 'All' : 'Unread'}
                {id === 'unread' && unreadCount > 0 ? <span className={styles.tabCount}>{unreadCount}</span> : null}
                {tab === id ? (
                  <motion.span layoutId="notification-tab-underline" className={styles.tabUnderline} transition={spring} />
                ) : null}
              </button>
            ))}
          </div>
          {/* The date range belongs to All; Unread only offers "Mark all as read". */}
          {tab === 'unread' ? (
            <button type="button" className={styles.textButton} disabled={unreadCount === 0} onClick={markAllRead}>
              Mark all as read
            </button>
          ) : (
            <div className={styles.dayPicker}>
              <NotificationDayPicker value={day} onChange={setDay} />
            </div>
          )}
        </div>

        <div className={styles.list} role="tabpanel">
          {visible.length === 0 ? (
            <NotificationEmpty tab={tab} filtered={tab === 'all' && Boolean(day)} />
          ) : (
            <ul className={styles.group}>
              <AnimatePresence initial={false}>
              {visible.map((item) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  now={now}
                  isNew={arrival?.id === item.id && Date.now() - arrival.at < 2500}
                  onRead={markRead}
                  onDismiss={dismiss}
                  onNavigate={go}
                />
              ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </motion.aside>
    </>
  );
}

/** The right-hand panel: full height, over a blurred page. Mounted only while open so its state resets each time. */
export default function NotificationDrawer({ open, onClose }: INotificationDrawerProps) {
  return createPortal(
    <AnimatePresence>{open ? <DrawerBody key="notification-drawer" onClose={onClose} /> : null}</AnimatePresence>,
    document.body
  );
}
