import { Range } from '@/enums/serp.enums';
import { IDateRange } from '@/interfaces/serp.interface';

const DAY = 24 * 60 * 60 * 1000;

const startOfDay = (t: number | Date) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};
const endOfDay = (t: number | Date) => startOfDay(t) + DAY - 1;

/** A "YYYY-MM-DD" date from the picker, read as that day in local time. */
const parseDay = (value: string | undefined): number | null => {
  if (!value) return null;
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d).getTime();
};

export type NotificationRangeBounds = { from: number; to: number } | null;

/** The start and end (in ms) a date range choice stands for, or null for "all time". */
export function notificationRangeBounds(
  preset: string,
  custom: IDateRange | undefined,
  now = Date.now()
): NotificationRangeBounds {
  const today = new Date(now);
  const lastDays = (n: number) => ({ from: startOfDay(now - (n - 1) * DAY), to: endOfDay(now) });

  switch (preset) {
    case Range.TODAY:
      return { from: startOfDay(now), to: endOfDay(now) };
    case Range.YESTERDAY:
      return { from: startOfDay(now - DAY), to: endOfDay(now - DAY) };
    case Range.LAST_7_DAYS:
      return lastDays(7);
    case Range.LAST_14_DAYS:
      return lastDays(14);
    case Range.LAST_30_DAYS:
      return lastDays(30);
    case Range.THIS_MONTH:
      return { from: new Date(today.getFullYear(), today.getMonth(), 1).getTime(), to: endOfDay(now) };
    case Range.LAST_MONTH:
      return {
        from: new Date(today.getFullYear(), today.getMonth() - 1, 1).getTime(),
        to: endOfDay(new Date(today.getFullYear(), today.getMonth(), 0)),
      };
    case Range.LAST_3_MONTHS:
      return { from: new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()).getTime(), to: endOfDay(now) };
    case Range.THIS_YEAR:
      return { from: new Date(today.getFullYear(), 0, 1).getTime(), to: endOfDay(now) };
    case Range.LAST_YEAR:
      return {
        from: new Date(today.getFullYear() - 1, 0, 1).getTime(),
        to: endOfDay(new Date(today.getFullYear() - 1, 11, 31)),
      };
    case Range.CUSTOM_RANGE: {
      const from = parseDay(custom?.startDate);
      if (from === null) return null;
      const end = parseDay(custom?.endDate);
      return { from, to: end === null ? endOfDay(now) : endOfDay(end) };
    }
    default:
      return null;
  }
}

/** The start and end (in ms) of one day picked as "YYYY-MM-DD", or null when no day is picked. */
export function notificationDayBounds(value: string): NotificationRangeBounds {
  const day = parseDay(value);
  return day === null ? null : { from: day, to: endOfDay(day) };
}
