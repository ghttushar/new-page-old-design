export type NotificationCategory = 'campaign' | 'rule' | 'report' | 'account';

/** Decides the glyph in the row's icon tile. Colour is never used for severity. */
export type NotificationTone = 'info' | 'success' | 'warning';

export interface INotificationFact {
  label: string;
  value: string;
}

export interface INotificationCta {
  label: string;
  /** App route the button navigates to. */
  path: string;
}

export interface INotificationItem {
  id: string;
  category: NotificationCategory;
  tone: NotificationTone;
  title: string;
  /** One line shown under the title. */
  preview: string;
  /** Longer text shown when the row is expanded. Rows with details or facts can be expanded. */
  details?: string;
  facts?: INotificationFact[];
  cta?: INotificationCta;
  /** Milliseconds since the epoch. */
  createdAt: number;
  read: boolean;
}

export type NotificationTab = 'all' | 'unread';
