import { ITimeRanges } from '@/interfaces/day-parting.interfaces';
import { dayPartingTimeOptions } from './day-parting.constants';

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
  'Hourly Total',
];

export const LOADING_TEXTS = [
  `"Hang tight! We're gathering your data now."`,
  `"Just a moment... your information is on its way!"`,
  `"Almost there! Fetching your data shortly."`,
];

export const defaultTimeRange: ITimeRanges[] = [
  {
    startTime: dayPartingTimeOptions[0],
    endTime: dayPartingTimeOptions[0],
    errorText: '',
  },
];
