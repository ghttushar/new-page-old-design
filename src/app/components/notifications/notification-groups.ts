import { INotificationItem } from '@/interfaces/notifications/notification.interface';
import { dayGroupLabel } from '@/utils/relative-time.utils';

export interface INotificationGroup {
  label: 'Today' | 'Yesterday' | 'Earlier';
  items: INotificationItem[];
}

/** Splits a newest-first list into Today, Yesterday and Earlier, leaving out empty groups. */
export function groupNotifications(items: INotificationItem[], now: number): INotificationGroup[] {
  const groups: INotificationGroup[] = [
    { label: 'Today', items: [] },
    { label: 'Yesterday', items: [] },
    { label: 'Earlier', items: [] },
  ];
  items.forEach((item) => {
    const label = dayGroupLabel(item.createdAt, now);
    groups.find((g) => g.label === label)?.items.push(item);
  });
  return groups.filter((g) => g.items.length > 0);
}
