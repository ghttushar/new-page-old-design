import {
  INotificationItem,
  NotificationCategory,
  NotificationTab,
} from '@/interfaces/notifications/notification.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  markAllNotificationsRead,
  markNotificationRead,
  removeNotification,
  selectNotificationPreview,
  selectNotifications,
} from '@/redux/slices/notifications/notification-center.slice';
import { useEffect, useMemo, useState } from 'react';

interface IFeedFilter {
  category?: NotificationCategory | 'all';
  query?: string;
  /** Only notifications between these two times (ms). Null or left out means all time. */
  range?: { from: number; to: number } | null;
}

/**
 * The notifications a list shows for a tab, newest first, plus what the list can do to them.
 * On the Unread tab a notification you just read stays in the list until the tab changes, so rows
 * do not jump away while you are still scanning.
 */
export default function useNotificationFeed(
  tab: NotificationTab,
  filter: IFeedFilter = {},
  /** The mini center follows the preview state (Empty shows nothing); the Settings page always shows everything. */
  followPreview = false
) {
  const dispatch = useAppDispatch();
  const allItems = useAppSelector(selectNotifications);
  const preview = useAppSelector(selectNotificationPreview);
  const items = useMemo(() => (followPreview && preview === 'empty' ? [] : allItems), [allItems, followPreview, preview]);
  const [kept, setKept] = useState<Set<string>>(new Set());

  useEffect(() => {
    setKept(new Set());
  }, [tab]);

  const unreadCount = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const { category = 'all', query = '', range = null } = filter;
  const from = range?.from;
  const to = range?.to;
  const visible = useMemo<INotificationItem[]>(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((n) => tab === 'all' || !n.read || kept.has(n.id))
      .filter((n) => category === 'all' || n.category === category)
      .filter((n) => !q || `${n.title} ${n.preview}`.toLowerCase().includes(q))
      .filter((n) => from === undefined || to === undefined || (n.createdAt >= from && n.createdAt <= to))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [items, tab, kept, category, query, from, to]);

  const markRead = (id: string) => {
    if (tab === 'unread') setKept((prev) => new Set(prev).add(id));
    dispatch(markNotificationRead(id));
  };
  const dismiss = (id: string) => {
    setKept((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    dispatch(removeNotification(id));
  };
  const markAllRead = () => {
    setKept(new Set());
    dispatch(markAllNotificationsRead());
  };

  return { visible, unreadCount, markRead, dismiss, markAllRead };
}
