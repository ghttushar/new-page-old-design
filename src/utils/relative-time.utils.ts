const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const plural = (n: number, unit: string) => `${n} ${unit}${n === 1 ? '' : 's'}`;

/** "just now", "12 min ago", "3 hr ago", "2 days ago", "3 weeks ago". */
export function relativeTimeAgo(createdAt: number, now: number): string {
  const diff = Math.max(0, now - createdAt);
  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} min ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} hr ago`;
  const days = Math.floor(diff / DAY);
  if (days < 7) return `${plural(days, 'day')} ago`;
  return `${plural(Math.floor(days / 7), 'week')} ago`;
}

/** The group a notification sits in on the list. */
export function dayGroupLabel(createdAt: number, now: number): 'Today' | 'Yesterday' | 'Earlier' {
  const startOfDay = (t: number) => {
    const d = new Date(t);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  const days = Math.round((startOfDay(now) - startOfDay(createdAt)) / DAY);
  if (days <= 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return 'Earlier';
}
