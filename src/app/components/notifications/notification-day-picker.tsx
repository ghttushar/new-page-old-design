import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { NOTIFICATION_Z_INDEX } from '@/constants/notifications/notifications.constants';
import { CalendarBlankIcon, CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import styles from './notifications.module.scss';

interface INotificationDayPickerProps {
  /** The picked day as "YYYY-MM-DD", or an empty string when no day is picked. */
  value: string;
  onChange: (value: string) => void;
}

const toValue = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const fromValue = (value: string): Date | undefined => {
  if (!value) return undefined;
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
};

const CALENDAR_CLASSES = {
  day: 'h-12 w-12 p-0 font-normal rounded-lg aria-selected:opacity-100 hover:bg-[#f0f0f0]',
  day_selected: 'bg-[#77469b] hover:bg-[#77469b] focus:bg-[#77469b] !text-[white] !font-medium',
  day_today: 'text-[#77469b] font-bold rounded-lg',
};

/**
 * One day to look at. Closed it is just a calendar icon; once a day is picked it shows that day.
 * "Today" in the calendar drops the pick and goes back to the current month.
 */
export default function NotificationDayPicker({ value, onChange }: INotificationDayPickerProps) {
  const [open, setOpen] = useState(false);
  const selected = fromValue(value);
  const [month, setMonth] = useState<Date>(selected ?? new Date());

  const onOpenChange = (next: boolean) => {
    if (next) setMonth(selected ?? new Date());
    setOpen(next);
  };

  const shiftMonth = (by: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + by, 1));

  const goToToday = () => {
    onChange('');
    setMonth(new Date());
    setOpen(false);
  };

  const label = selected ? selected.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : null;
  const nextDisabled =
    month.getFullYear() === new Date().getFullYear() && month.getMonth() === new Date().getMonth();

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`${styles.dayTrigger}${selected ? ` ${styles.dayTriggerSet}` : ''}`}
          aria-label={label ? `Showing ${label}. Change day` : 'Pick a day'}
        >
          <CalendarBlankIcon size={16} weight={selected ? 'fill' : 'regular'} />
          {label ? <span>{label}</span> : null}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        style={{ zIndex: NOTIFICATION_Z_INDEX.popover, width: 'auto', minWidth: 0 }}
        // The calendar renders outside the panel; keep its keys from reaching the panel's Escape and Tab handling.
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className={styles.dayCalendar}>
          <div className={styles.dayCaption}>
            <button type="button" className={styles.dayNav} onClick={() => shiftMonth(-1)} aria-label="Previous month">
              <CaretLeftIcon size={14} weight="bold" />
            </button>
            <span className={styles.dayMonth}>
              {month.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              className={styles.dayNav}
              onClick={() => shiftMonth(1)}
              disabled={nextDisabled}
              aria-label="Next month"
            >
              <CaretRightIcon size={14} weight="bold" />
            </button>
          </div>
          <Calendar
            mode="single"
            selected={selected}
            month={month}
            onMonthChange={setMonth}
            onSelect={(day) => {
              if (!day) return;
              onChange(toValue(day));
              setOpen(false);
            }}
            disabled={{ after: new Date() }}
            showOutsideDays={false}
            classNames={CALENDAR_CLASSES}
            components={{ Caption: () => null }}
            className="!p-0"
          />
          <div className={styles.dayFooter}>
            <button type="button" className={styles.dayToday} onClick={goToToday}>
              Today
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
