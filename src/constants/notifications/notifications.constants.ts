import { NotificationCategory } from '@/interfaces/notifications/notification.interface';

/** In the Incoming preview state a notification arrives this often, so the arrival animation keeps playing. */
export const INCOMING_INTERVAL_MS = 4200;

/** How long the small preview card under the bell stays before it tucks away. */
export const NOTIFICATION_PEEK_MS = 3800;

/** Notifications made by the Incoming preview are trimmed to this many, so the list does not grow without end. */
export const LIVE_NOTIFICATIONS_MAX = 8;

/** How often the "N min ago" labels refresh. */
export const NOTIFICATION_CLOCK_MS = 30000;

/** The page lists this many first, then "Load more". */
export const NOTIFICATIONS_PAGE_SIZE = 20;

/** Above the app's menus and the chatbot panel, below the toast queue (100000). */
export const NOTIFICATION_Z_INDEX = { backdrop: 1400, drawer: 1401, popover: 1402 };

export const NOTIFICATION_CATEGORY_LABELS: Record<NotificationCategory, string> = {
  campaign: 'Campaigns',
  rule: 'Rules',
  report: 'Reports',
  account: 'Account',
};

export const NOTIFICATIONS_PAGE_URL = '/settings/notifications';
