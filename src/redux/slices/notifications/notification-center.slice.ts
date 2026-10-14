import { getMockNotifications } from '@/constants/notifications/notifications-mock';
import { LIVE_NOTIFICATIONS_MAX } from '@/constants/notifications/notifications.constants';
import { INotificationItem } from '@/interfaces/notifications/notification.interface';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IRootState } from '../../store';

/** Forces what the mini notification center shows, for previewing: nothing, the real list, or notifications that keep arriving. */
export type NotificationPreviewState = 'empty' | 'normal' | 'incoming';

export interface INotificationCenterSlice {
  preview: NotificationPreviewState;
  items: INotificationItem[];
  /** The last notification to arrive while the app was open, so the bell and list can react to it. */
  lastArrival: { id: string; at: number } | null;
}

const initialState: INotificationCenterSlice = {
  preview: 'normal',
  items: getMockNotifications(),
  lastArrival: null,
};

export const notificationCenterSlice = createSlice({
  name: 'notificationCenter',
  initialState,
  reducers: {
    markNotificationRead: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.read = true;
    },
    markNotificationUnread: (state, action: PayloadAction<string>) => {
      const item = state.items.find((n) => n.id === action.payload);
      if (item) item.read = false;
    },
    markAllNotificationsRead: (state) => {
      state.items.forEach((n) => {
        n.read = true;
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    },
    setNotificationPreview: (state, action: PayloadAction<NotificationPreviewState>) => {
      state.preview = action.payload;
    },
    addNotification: (state, action: PayloadAction<INotificationItem>) => {
      state.items.unshift(action.payload);
      // Only the newest few made by the Incoming preview are kept.
      let live = 0;
      state.items = state.items.filter((n) => !n.id.startsWith('live-') || (live += 1) <= LIVE_NOTIFICATIONS_MAX);
      state.lastArrival = { id: action.payload.id, at: action.payload.createdAt };
    },
  },
});

export const {
  markNotificationRead,
  markNotificationUnread,
  markAllNotificationsRead,
  addNotification,
  removeNotification,
  setNotificationPreview,
} = notificationCenterSlice.actions;

export const selectNotifications = (state: IRootState) =>
  state.notificationCenter.items;
export const selectNotificationPreview = (state: IRootState) =>
  state.notificationCenter.preview;
export const selectLastNotificationArrival = (state: IRootState) =>
  state.notificationCenter.lastArrival;

const notificationCenterReducer = notificationCenterSlice.reducer;
export default notificationCenterReducer;
