import { WALMART_INDEFINITE_END_DATE } from '@/constants/advertising-walmart.constants';
import { DATE_FORMAT_3 } from '@/constants/datetime.constants';
import { defaultTimeRange } from '@/constants/dayparting.constants';
import { Range } from '@/enums/serp.enums';
import {
  ICreateJobBody,
  IDaypartingTimeRange,
  ITimeRanges,
} from '@/interfaces/day-parting.interfaces';
import {
  checkIsIndefiniteDate,
  getFormattedDateWithFormat,
  getTodayByTimeZone,
} from '@/utils/datetime.utils';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  dayPartingBidAdjustmentOptions,
  dayPartingHourOfDayOptions,
  dayPartingMetricOptions,
  dayPartingPlacementOptions,
  dayPartingRangeOptions,
  dayPartingRecurrenceDaysOptions,
  dayPartingRecurrenceOptions,
} from 'src/constants/day-parting.constants';
import { MultiSelectCustomOptions } from 'src/constants/sov.filter.constants';
import {
  DaypartingBidChangeTypeEnum,
  DaypartingRecurrenceTypeEnum,
  DaypartingTimeRangeTypeEnum,
} from 'src/enums/day-parting.enums';
import {
  IMultiSelectCustomDropdownItem,
  IMultiSelectDropdownItem,
} from 'src/interfaces/dropdown.interfaces';
import { IDateRange } from 'src/interfaces/serp.interface';
import { getCurrentDateTime } from 'src/utils';
import { IRootState } from '../../store';

export interface IDayPartingFilterForm {
  campaigns: IMultiSelectCustomDropdownItem[];
  placement: IDropdownItem<string>[];
  metric: IDropdownItem<string>;
  range: IDropdownItem<Range>;
  customDateRange: IDateRange;
}

export interface IDayPartingFilterOptions {
  campaigns: IMultiSelectCustomDropdownItem[];
  placement: IMultiSelectDropdownItem[];
  metric: IDropdownItem<string>[];
  range: IDropdownItem<string>[];
}

export interface IDayPartingFilterState {
  filters: IDayPartingFilterForm;
  appliedFilters: IDayPartingFilterForm;
  options: IDayPartingFilterOptions;
  triggerFetch: boolean;
}

export interface IWalmartDayPartingTimeRange extends IDaypartingTimeRange {
  errorText: string;
}

export interface IDaypartingState extends IDayPartingFilterState {
  startDate: string;
  endDate: string;
  recurrenceType: DaypartingRecurrenceTypeEnum;
  weekDays: IDropdownItem<string>[];
  hourOfDayType: DaypartingTimeRangeTypeEnum;
  timeRanges: ITimeRanges[];
  isRunDisabled: boolean;
  selectedAdjustment: IDropdownItem<DaypartingBidChangeTypeEnum>;
  newBid: number;
  ruleName: string;
  isFormOpen: boolean;
  createPayload: ICreateJobBody | null;
}

const initialDayPartingFilters: IDayPartingFilterForm = {
  campaigns: [],
  placement: dayPartingPlacementOptions,
  metric: dayPartingMetricOptions[0],
  range: dayPartingRangeOptions[0],
  customDateRange: {
    startDate: getCurrentDateTime().split('_')[0],
    endDate: getCurrentDateTime().split('_')[0],
  },
};

const initialDayPartingOptions: IDayPartingFilterOptions = {
  campaigns: MultiSelectCustomOptions,
  placement: dayPartingPlacementOptions,
  metric: dayPartingMetricOptions,
  range: dayPartingRangeOptions,
};

const daypartingFormInitialState = {
  startDate: getFormattedDateWithFormat(
    getTodayByTimeZone().toString(),
    DATE_FORMAT_3
  ),
  endDate: getFormattedDateWithFormat(
    getTodayByTimeZone().toString(),
    DATE_FORMAT_3
  ),
  recurrenceType: dayPartingRecurrenceOptions[0]
    .value as DaypartingRecurrenceTypeEnum,
  weekDays: dayPartingRecurrenceDaysOptions,
  hourOfDayType: dayPartingHourOfDayOptions[0]
    .value as DaypartingTimeRangeTypeEnum,

  timeRanges: defaultTimeRange,
  selectedAdjustment: dayPartingBidAdjustmentOptions[0],
  newBid: 0,
  ruleName: '',
  isFormOpen: false,
  isRunDisabled: true,
};

const initialState: IDaypartingState = {
  filters: initialDayPartingFilters,
  appliedFilters: initialDayPartingFilters,
  options: initialDayPartingOptions,
  triggerFetch: false,
  createPayload: null,

  ...daypartingFormInitialState,
};

export const dayPartingFilterSlice = createSlice({
  name: 'dayPartingFilter',
  initialState,
  reducers: {
    resetDayPartingFilterStates: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },

    resetDayPartingFilters: (state, action: PayloadAction) => {
      Object.assign(state.filters, initialDayPartingFilters);
      Object.assign(state.appliedFilters, initialDayPartingFilters);
    },

    setDayPartingFilters: (
      state,
      action: PayloadAction<IDayPartingFilterForm>
    ) => {
      state.filters = { ...action.payload };
    },

    setDayPartingAppliedFilters: (
      state,
      action: PayloadAction<IDayPartingFilterForm>
    ) => {
      state.appliedFilters = { ...action.payload };
    },

    setDayPartingRangeOption: (
      state,
      action: PayloadAction<IDropdownItem<string>>
    ) => {
      const _rangeOptions = JSON.parse(JSON.stringify(dayPartingRangeOptions));
      _rangeOptions.push(action.payload);
      state.options.range = _rangeOptions;
    },

    setDayPartingCampaignOptions: (
      state,
      action: PayloadAction<IMultiSelectCustomDropdownItem[]>
    ) => {
      state.options.campaigns = action.payload;

      state.filters.campaigns = action.payload.filter((item) => item.selected);
    },

    setDayPartingPlacementOptions: (
      state,
      action: PayloadAction<IMultiSelectDropdownItem[]>
    ) => {
      state.options.placement = action.payload;

      state.filters.placement = action.payload.filter((item) => item.selected);
    },
    setTriggerFetch: (state, action: PayloadAction<boolean>) => {
      state.triggerFetch = action.payload;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = getFormattedDateWithFormat(
        action.payload !== ''
          ? action.payload
          : getTodayByTimeZone().toDateString(),
        DATE_FORMAT_3
      );
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = getFormattedDateWithFormat(
        action.payload !== ''
          ? action.payload
          : getTodayByTimeZone().toDateString(),
        DATE_FORMAT_3
      );
    },
    setRecurrenceType: (
      state,
      action: PayloadAction<DaypartingRecurrenceTypeEnum>
    ) => {
      state.recurrenceType = action.payload;
    },
    setWeekDays: (state, action: PayloadAction<IDropdownItem<string>[]>) => {
      state.weekDays = action.payload;
    },
    setHourOfDayType: (
      state,
      action: PayloadAction<DaypartingTimeRangeTypeEnum>
    ) => {
      state.hourOfDayType = action.payload;
    },
    setTimeRanges: (
      state,
      action: PayloadAction<
        {
          startTime: IDropdownItem<string>;
          endTime: IDropdownItem<string>;
          errorText: string;
        }[]
      >
    ) => {
      state.timeRanges = action.payload;
    },

    setSelectedAdjustment: (
      state,
      action: PayloadAction<IDropdownItem<DaypartingBidChangeTypeEnum>>
    ) => {
      state.selectedAdjustment = action.payload;
    },
    setNewBid: (state, action: PayloadAction<number>) => {
      state.newBid = action.payload;
    },
    setRuleName: (state, action: PayloadAction<string>) => {
      state.ruleName = action.payload;
    },
    setIsFormOpen: (state, action: PayloadAction<boolean>) => {
      state.isFormOpen = action.payload;
    },
    setIsRunDisabled: (state, action: PayloadAction<boolean>) => {
      state.isRunDisabled = action.payload;
    },
    setDaypartingPayload: (state, action: PayloadAction<ICreateJobBody>) => {
      state.createPayload = {
        ...action.payload,
        endDate: checkIsIndefiniteDate(action.payload.endDate)
          ? WALMART_INDEFINITE_END_DATE
          : action.payload.endDate,
      };
    },
  },
});

export const {
  resetDayPartingFilterStates,
  resetDayPartingFilters,
  setDayPartingFilters,
  setDayPartingAppliedFilters,
  setDayPartingRangeOption,
  setDayPartingCampaignOptions,
  setDayPartingPlacementOptions,
  setIsRunDisabled,
  setTriggerFetch,
  setStartDate,
  setEndDate,
  setRecurrenceType,
  setWeekDays,
  setHourOfDayType,
  setTimeRanges,
  setSelectedAdjustment,
  setNewBid,
  setRuleName,
  setIsFormOpen,
  setDaypartingPayload,
} = dayPartingFilterSlice.actions;

export const selectDayPartingFilters = (state: IRootState) =>
  state.dayparting.filters;
export const selectDayPartingAppliedFilters = (state: IRootState) =>
  state.dayparting.appliedFilters;
export const selectDayPartingOptions = (state: IRootState) =>
  state.dayparting.options;
export const selectTriggerFetch = (state: IRootState) =>
  state.dayparting.triggerFetch;
export const selectStartDate = (state: IRootState) =>
  state.dayparting.startDate;
export const selectEndDate = (state: IRootState) => state.dayparting.endDate;
export const selectRecurrenceType = (state: IRootState) =>
  state.dayparting.recurrenceType;
export const selectWeekDays = (state: IRootState) => state.dayparting.weekDays;
export const selectHourOfDayType = (state: IRootState) =>
  state.dayparting.hourOfDayType;
export const selectTimeRanges = (state: IRootState) =>
  state.dayparting.timeRanges;
export const selectSelectedAdjustment = (state: IRootState) =>
  state.dayparting.selectedAdjustment;
export const selectNewBid = (state: IRootState) => state.dayparting.newBid;
export const selectRuleName = (state: IRootState) => state.dayparting.ruleName;
export const selectIsFormOpen = (state: IRootState) =>
  state.dayparting.isFormOpen;
export const selectIsRunDisabled = (state: IRootState) =>
  state.dayparting.isRunDisabled;
export const selectCreatePayload = (state: IRootState) =>
  state.dayparting.createPayload;

const dayPartingFilterReducer = dayPartingFilterSlice.reducer;
export default dayPartingFilterReducer;
