import NotificationEmpty from '@/app/components/notifications/notification-empty';
import { groupNotifications } from '@/app/components/notifications/notification-groups';
import NotificationRow from '@/app/components/notifications/notification-row';
import styles from '@/app/components/notifications/notifications.module.scss';
import useNotificationFeed from '@/app/components/notifications/use-notification-feed';
import {
  NOTIFICATIONS_PAGE_SIZE,
  NOTIFICATION_CATEGORY_LABELS,
  NOTIFICATION_CLOCK_MS,
} from '@/constants/notifications/notifications.constants';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useNow from '@/hooks/use-now.hook';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { CustomDateRangePickerWrapper } from '@/app/components/shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import { range as dateRangeOptions } from '@/constants/advertising-filter.constants';
import { customRangeFilterOption } from '@/constants';
import { Range } from '@/enums/serp.enums';
import { NotificationCategory, NotificationTab } from '@/interfaces/notifications/notification.interface';
import { IDateRange } from '@/interfaces/serp.interface';
import { notificationRangeBounds } from '@/utils/notification-range.utils';
import { useAppSelector } from '@/redux/hooks';
import { selectLastNotificationArrival } from '@/redux/slices/notifications/notification-center.slice';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// The date picker offers the app's usual presets and starts on the last 30 days.
const DEFAULT_RANGE: IDropdownItem<string> = dateRangeOptions.find((o) => o.value === Range.LAST_30_DAYS) ?? dateRangeOptions[0];

export default function NotificationsPage() {
  useSubHeader(PageTitleEnum.NOTIFICATIONS, PAGE_TITLE_TOOLTIPS.NOTIFICATIONS);
  const navigate = useNavigate();
  const now = useNow(NOTIFICATION_CLOCK_MS);
  const arrival = useAppSelector(selectLastNotificationArrival);
  const [tab, setTab] = useState<NotificationTab>('all');
  const [rangeItem, setRangeItem] = useState<IDropdownItem<string>>(DEFAULT_RANGE);
  const [customRange, setCustomRange] = useState<IDateRange | undefined>();
  const [category, setCategory] = useState<NotificationCategory | 'all'>('all');
  const [shown, setShown] = useState(NOTIFICATIONS_PAGE_SIZE);
  const bounds = useMemo(
    () => notificationRangeBounds(rangeItem.value, customRange),
    [rangeItem.value, customRange]
  );
  const { visible, unreadCount, markRead, dismiss, markAllRead } = useNotificationFeed(tab, { category, range: bounds });

  useEffect(() => {
    setShown(NOTIFICATIONS_PAGE_SIZE);
  }, [tab, rangeItem.value, customRange, category]);

  const page = visible.slice(0, shown);
  const groups = useMemo(() => groupNotifications(page, now), [page, now]);
  const filtered = rangeItem.value !== DEFAULT_RANGE.value || category !== 'all';

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value as NotificationCategory | 'all')}
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          {(Object.keys(NOTIFICATION_CATEGORY_LABELS) as NotificationCategory[]).map((key) => (
            <option key={key} value={key}>
              {NOTIFICATION_CATEGORY_LABELS[key]}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.pageCard}>
        <div className={styles.pageCardTabs}>
          <LayoutGroup id="notification-page-tabs">
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
                    <motion.span
                      layoutId="notification-page-underline"
                      className={styles.tabUnderline}
                      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </LayoutGroup>
          <div className={styles.tabsTools}>
            {tab === 'unread' ? (
              <button type="button" className={styles.textButton} disabled={unreadCount === 0} onClick={markAllRead}>
                Mark all as read
              </button>
            ) : null}
  
            <CustomDateRangePickerWrapper
              title=""
              rangeOptions={dateRangeOptions}
              defaultPreset={rangeItem}
              selectedCustomDateRange={customRange}
              handleDateChange={(item) => {
                setRangeItem(item);
                if (item.value !== Range.CUSTOM_RANGE) setCustomRange(undefined);
              }}
              setCustomDateRange={(value) => {
                setCustomRange(value);
                setRangeItem(customRangeFilterOption);
              }}
              height="3.4rem"
              dropShadow={false}
            />
          </div>
        </div>

        {groups.length === 0 ? (
          <NotificationEmpty tab={tab} filtered={filtered} />
        ) : (
          <div role="tabpanel" className={styles.pageBody}>
            {groups.map((group) => (
              <section key={group.label}>
                <h3 className={styles.groupLabel}>{group.label}</h3>
                <ul className={styles.group}>
                  <AnimatePresence initial={false}>
                  {group.items.map((item) => (
                    <NotificationRow
                      key={item.id}
                      item={item}
                      now={now}
                      isNew={arrival?.id === item.id && Date.now() - arrival.at < 2500}
                      onRead={markRead}
                      onDismiss={dismiss}
                      onNavigate={navigate}
                    />
                  ))}
                  </AnimatePresence>
                </ul>
              </section>
            ))}
            {visible.length > shown ? (
              <button type="button" className={styles.loadMore} onClick={() => setShown((n) => n + NOTIFICATIONS_PAGE_SIZE)}>
                Load more
              </button>
            ) : (
              <div style={{ height: 12 }} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
