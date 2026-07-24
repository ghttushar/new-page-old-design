import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { WALMART_INDEFINITE_END_DATE } from '@/constants/advertising-walmart.constants';
import { DATE_FORMAT_3 } from '@/constants/datetime.constants';
import {
  dayPartingBidAdjustmentOptions,
  dayPartingHourOfDayOptions,
  dayPartingRecurrenceDaysOptions,
  dayPartingRecurrenceOptions,
  dayPartingTimeOptions,
} from '@/constants/day-parting.constants';
import { defaultTimeRange } from '@/constants/dayparting.constants';
import { DAY_PARTING_PAGE_URL } from '@/constants/urls.constants';
import {
  DaypartingBidChangeTypeEnum,
  DaypartingRecurrenceDaysEnum,
  DaypartingRecurrenceTypeEnum,
  DaypartingTimeRangeTypeEnum,
  DaypartingTimeTypeEnum,
} from '@/enums/day-parting.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  ICreateJobBody,
  IDaypartingCampaignList,
  IDaypartingTimeRange,
  IExistingCampaigns,
  ITimeRangeDropdownFormat,
} from '@/interfaces/day-parting.interfaces';
import { IMultiSelectCustomDropdownItem } from '@/interfaces/dropdown.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery, UseAppQueryProps } from '@/redux/react-query-hooks';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import {
  selectCreatePayload,
  selectDayPartingAppliedFilters,
  selectDayPartingFilters,
  selectDayPartingOptions,
  selectEndDate,
  selectHourOfDayType,
  selectNewBid,
  selectRecurrenceType,
  selectRuleName,
  selectSelectedAdjustment,
  selectStartDate,
  selectTimeRanges,
  selectWeekDays,
  setDayPartingAppliedFilters,
  setDayPartingCampaignOptions,
  setEndDate,
  setHourOfDayType,
  setIsFormOpen,
  setNewBid,
  setRecurrenceType,
  setRuleName,
  setSelectedAdjustment,
  setStartDate,
  setTimeRanges,
  setWeekDays,
} from '@/redux/slices/day-parting/day-parting.slice';
import WalmartDayPartingService from '@/services/day-parting-wmt.service';
import DayPartingService from '@/services/day-parting.service';
import { getTimeZoneByCountry, getValidNumber, parseNum } from '@/utils';
import { checkIsEqual } from '@/utils/advertising.utils';
import {
  checkIsIndefiniteDate,
  getFormattedCurrTimeZoneDate,
} from '@/utils/datetime.utils';
import {
  checkDaypartingTimeRangeAllPopulated,
  checkTimeRangeOverlap,
  getDaypartingTimeRange,
  getFormattedAdType,
  getIsInvalidEndDate,
  getWalmartCampaignsArray,
  isInvalidDateRange,
  rangeContainsSelectedWeekdays,
} from '@/utils/day-parting.utils';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DayPartingFormUI from './day-parting-form-ui';

const dayPartingTimeOptionsClone: IDropdownItem<string>[] = JSON.parse(
  JSON.stringify(dayPartingTimeOptions)
);

interface DayPartingWmtFormProps {
  campaigns: IDaypartingCampaignList[];
  isEdit: boolean;
  toggleEdit: () => void;
  isLoading: boolean;
  selectedJobId: string;
  handleRule: (
    payload: ICreateJobBody,
    campaignsToRemove?: string[]
  ) => Promise<void>;
  marketplace: MarketplaceEnum;
}

export default function DayPartingForm({
  campaigns,
  isEdit,
  toggleEdit,
  isLoading,
  selectedJobId,
  handleRule,
  marketplace,
}: DayPartingWmtFormProps) {
  const filters = useAppSelector(selectDayPartingFilters);
  const [weekDayError, setWeekDayError] = useState<boolean>(false);
  const [isInvalidWeekDay, setIsInvalidWeekDay] = useState(false);
  const [timeRangeError, setTimeRangeError] = useState<string>('');
  const [bidError, setBidError] = useState<string>('');
  const [ruleNameError, setRuleNameError] = useState<string>('');
  const [isApplyDisabled, setIsApplyDisabled] = useState<boolean>(false);
  const [isIndefiniteChecked, setIsIndefiniteChecked] = useState(false);
  const [isStartCalOpen, setIsStartCalOpen] = useState(false);
  const [isEndCalOpen, setIsEndCalOpen] = useState(false);
  const [openConflictPopup, setOpenConflictPopup] = useState(false);
  const [payload, setPayload] = useState<ICreateJobBody>();
  const [campaignsInDayParting, setCampaignsInDayParting] = useState<
    IExistingCampaigns[]
  >([]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const appliedFilters = useAppSelector(selectDayPartingAppliedFilters);
  const options = useAppSelector(selectDayPartingOptions);
  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);
  const recurrenceType = useAppSelector(selectRecurrenceType);
  const weekDays = useAppSelector(selectWeekDays);
  const hourOfDayType = useAppSelector(selectHourOfDayType);
  const timeRanges = useAppSelector(selectTimeRanges);
  const selectedAdjustment = useAppSelector(selectSelectedAdjustment);
  const newBid = useAppSelector(selectNewBid);
  const ruleName = useAppSelector(selectRuleName);
  const jobData = useAppSelector(selectCreatePayload);
  const selectedAdTypeFilter = useAppSelector(selectAdvertisingHeaderFilters);

  const isLastTimeRange = useMemo(() => timeRanges.length === 1, [timeRanges]);

  const isTimeRangeLimitReached = useMemo(
    () => timeRanges.length === 24,
    [timeRanges]
  );

  const selectedCampaigns = useMemo(
    () =>
      campaigns.filter((item) => {
        return appliedFilters.campaigns
          .filter((item) => item.selected)
          .map((option) => option.value)
          .includes(item.campaignId);
      }),
    [campaigns, appliedFilters]
  );

  const handleEditCancel = () => {
    if (isEdit === true) {
      toggleEdit();
      navigate(DAY_PARTING_PAGE_URL);
    }
  };

  const handleCancel = () => {
    setIsIndefiniteChecked(false);
    setRuleNameError('');
    setBidError('');
    clearAllFields();
    setWeekDayError(false);
    dispatch(setIsFormOpen(false));
  };

  const handleFormCancel = () => {
    handleCancel();
    handleEditCancel();
  };

  const clearAllFields = () => {
    dispatch(setNewBid(0));
    dispatch(setRuleName(''));
    dispatch(setStartDate(''));
    dispatch(setEndDate(''));
    dispatch(
      setRecurrenceType(
        dayPartingRecurrenceOptions[0].value as DaypartingRecurrenceTypeEnum
      )
    );
    dispatch(setWeekDays(dayPartingRecurrenceDaysOptions));
    dispatch(
      setHourOfDayType(
        dayPartingHourOfDayOptions[0].value as DaypartingTimeRangeTypeEnum
      )
    );
    dispatch(
      setTimeRanges([
        {
          startTime: dayPartingTimeOptionsClone[0],
          endTime: dayPartingTimeOptionsClone[0],
          errorText: '',
        },
      ])
    );
    setTimeRangeError('');
    dispatch(setSelectedAdjustment(dayPartingBidAdjustmentOptions[0]));
  };

  const handleRun = () => {
    dispatch(
      setDayPartingAppliedFilters({
        ...appliedFilters,
        campaigns: options.campaigns,
      })
    );
  };

  const getQueryOptionsByMarketplace = (
    marketplace: MarketplaceEnum
  ): UseAppQueryProps<any, any> => {
    if (marketplace === MarketplaceEnum.WALMART) {
      return {
        queryFn: () => {
          return WalmartDayPartingService.getCampaignsAlreadyInDayParting(
            selectedAdTypeFilter.adType.value,
            payload ? payload.campaigns : []
          );
        },
        queryKey: [
          QueryKeyEnums.FETCH_WALMART_CAMPAIGNS_ALREADY_IN_DAYPARTING,
          { payload },
        ],
        enabled: Boolean(
          payload?.campaigns &&
            isApplyDisabled &&
            marketplace === MarketplaceEnum.WALMART
        ),
      };
    } else {
      return {
        queryFn: () =>
          DayPartingService.checkIsAlreadyPartOfDayParting(
            payload ? payload.campaigns : []
          ),
        queryKey: [
          QueryKeyEnums.FETCH_AMZ_CAMPAIGNS_ALREADY_IN_DAYPARTING,
          { payload },
        ],
        enabled: Boolean(
          payload?.campaigns &&
            isApplyDisabled &&
            marketplace === MarketplaceEnum.AMAZON
        ),
      };
    }
  };

  const fetchCampaignsAlreadyInDayParting = useAppQuery(
    getQueryOptionsByMarketplace(marketplace)
  );

  useEffect(() => {
    if (fetchCampaignsAlreadyInDayParting.isSuccess) {
      const existingCampaigns: IExistingCampaigns[] =
        fetchCampaignsAlreadyInDayParting?.data?.data.data;

      const campaigns = existingCampaigns?.filter((item) => {
        if (selectedJobId === '') return true;
        else return item.jobId !== selectedJobId;
      });

      setCampaignsInDayParting(campaigns);

      if (campaigns.length > 0) {
        setOpenConflictPopup(true);
      } else {
        handleConfirmApply();
      }
    }
  }, [
    fetchCampaignsAlreadyInDayParting?.data?.data.data,
    fetchCampaignsAlreadyInDayParting.isSuccess,
  ]);

  const handleApply = () => {
    setIsApplyDisabled(true);

    const formattedTimeRanges: IDaypartingTimeRange[] = timeRanges.map(
      (range) => {
        return {
          startTime: range.startTime.value as DaypartingTimeTypeEnum,
          endTime: range.endTime.value as DaypartingTimeTypeEnum,
        };
      }
    );

    const body: ICreateJobBody = {
      title: ruleName,
      startDate: getFormattedCurrTimeZoneDate(startDate, DATE_FORMAT_3),
      endDate: getFormattedCurrTimeZoneDate(endDate, DATE_FORMAT_3),
      recurrence: {
        type: recurrenceType,
        days:
          recurrenceType === DaypartingRecurrenceTypeEnum.DAILY
            ? []
            : (weekDays
                .filter((day) => day.selected === true)
                .map((day) => day.value) as DaypartingRecurrenceDaysEnum[]),
      },
      schedules: {
        type: hourOfDayType,
        timeRanges:
          hourOfDayType === DaypartingTimeRangeTypeEnum.ALL_DAY
            ? []
            : formattedTimeRanges,
      },
      bidChange: {
        type: selectedAdjustment.value,
        percentage: newBid,
      },
      campaigns: getWalmartCampaignsArray(appliedFilters),
      timeZone: getTimeZoneByCountry(),
      adType: getFormattedAdType(selectedAdTypeFilter.adType.value),
    };

    setPayload(body);
  };

  const handleConfirmApply = async () => {
    if (!payload) return;

    try {
      const campaignsToRemove = isEdit
        ? payload.campaigns
        : campaignsInDayParting.length > 0
        ? campaignsInDayParting.flatMap((item) =>
            item.campaigns.map((val) => val.campaignId)
          )
        : [];

      await handleRule(payload, campaignsToRemove);

      handleCancel();
    } catch (error) {
      console.error('Error applying dayparting rule:', error);
    } finally {
      setIsApplyDisabled(false);
      setOpenConflictPopup(false);
      setPayload(undefined);
    }
  };

  const handleStartDateChange = (date: string) => {
    dispatch(setStartDate(date));
  };

  const handleEndDateChange = (date: string) => {
    dispatch(setEndDate(date));
  };

  const onRecurrenceTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      setRecurrenceType(event.target.value as DaypartingRecurrenceTypeEnum)
    );
    setWeekDayError(false);
  };

  const handleWeekDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedWeekDays = weekDays.map((type) => {
      if (type.value === event.target.name) {
        return {
          ...type,
          selected: event.target.checked,
        };
      }

      return type;
    });

    dispatch(setWeekDays(updatedWeekDays));
  };

  const onHourOfDayTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setTimeRanges(defaultTimeRange));

    dispatch(
      setHourOfDayType(event.target.value as DaypartingTimeRangeTypeEnum)
    );
  };

  const handleAddTimeRange = () => {
    if (isTimeRangeLimitReached) {
      setTimeRangeError('Time Range Limit Reached.');
      return;
    }
    const newTimeRange: ITimeRangeDropdownFormat<string> = {
      startTime: dayPartingTimeOptionsClone[0],
      endTime: dayPartingTimeOptionsClone[0],
      errorText: '',
    };

    dispatch(setTimeRanges([...timeRanges, newTimeRange]));
  };

  const handleCancelTimeRange = (currIndex: number) => {
    if (hourOfDayType === DaypartingTimeRangeTypeEnum.ALL_DAY) return;

    if (isLastTimeRange) {
      setTimeRangeError('Time Range cannot be empty');
      return;
    }

    const updatedTimeRanges = timeRanges.filter(
      (range, index) => index !== currIndex
    );

    dispatch(setTimeRanges(updatedTimeRanges));
  };

  const onStartTimeChange = (
    value: IDropdownItem<string>,
    currIndex: number
  ) => {
    let rangeError = '';
    let updatedTimeRanges = timeRanges.map((range, index) => {
      if (currIndex === index) {
        const newRange: ITimeRangeDropdownFormat<string> = {
          ...range,
          startTime: value,
        };
        const calculatedRange = getDaypartingTimeRange(newRange);
        rangeError =
          calculatedRange <= 0
            ? 'End Time should be greater than Start Time'
            : '';

        return {
          ...range,
          startTime: value,
          errorText: rangeError,
        };
      }

      return range;
    });

    if (!rangeError) {
      const _timeRanges = [...updatedTimeRanges];
      const overlapError = checkTimeRangeOverlap(_timeRanges)
        ? 'Time Ranges cannot overlap'
        : '';

      updatedTimeRanges = updatedTimeRanges.map((range) => {
        return {
          ...range,
          errorText: overlapError,
        };
      });
    }

    dispatch(setTimeRanges(updatedTimeRanges));
  };

  const onEndTimeChange = (value: IDropdownItem<string>, currIndex: number) => {
    let rangeError = '';
    let updatedTimeRanges = timeRanges.map((range, index) => {
      if (currIndex === index) {
        const newRange: ITimeRangeDropdownFormat<string> = {
          ...range,
          endTime: value,
        };
        const calculatedRange = getDaypartingTimeRange(newRange);
        rangeError =
          calculatedRange <= 0
            ? 'End Time should be greater than Start Time'
            : '';

        return {
          ...range,
          endTime: value,
          errorText: rangeError,
        };
      }

      return range;
    });

    if (!rangeError) {
      const _timeRanges = [...updatedTimeRanges];
      const overlapError = checkTimeRangeOverlap(_timeRanges)
        ? 'Time Ranges cannot overlap'
        : '';

      updatedTimeRanges = updatedTimeRanges.map((range) => {
        return {
          ...range,
          errorText: overlapError,
        };
      });
    }

    dispatch(setTimeRanges(updatedTimeRanges));
  };

  const handleAdjustmentOptionChange = (
    value: IDropdownItem<DaypartingBidChangeTypeEnum>
  ) => {
    dispatch(setSelectedAdjustment(value));
  };

  const handleBidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.valueAsNumber;

    const formattedValue = getValidNumber(value) ?? value;
    if (!parseNum(formattedValue)) {
      setBidError('Bid cannot be 0 or negative');
      dispatch(setNewBid(formattedValue));
      return;
    }
    dispatch(setNewBid(formattedValue));
    setBidError('');
  };

  const handleRuleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRuleName(event.target.value));
    setRuleNameError('');

    if (!event.target.value) {
      setRuleNameError('Required Rule Name');
      return;
    }
  };

  const onCampaignSelect = (
    selectedOptions: IMultiSelectCustomDropdownItem[]
  ) => {
    dispatch(setDayPartingCampaignOptions(selectedOptions));
  };

  const handleRuleNameBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setRuleNameError('');

    if (!ruleName) {
      setRuleNameError('Required Rule Name');
      return;
    }
  };

  const handleCampaignRemoval = (campId: string) => {
    const newCampaigns = options.campaigns.map((item) => {
      return {
        ...item,
        selected: item.value === campId ? false : item.selected,
      };
    });

    dispatch(
      setDayPartingAppliedFilters({
        ...appliedFilters,
        campaigns: newCampaigns,
      })
    );
    dispatch(setDayPartingCampaignOptions(newCampaigns));
  };

  const handleCancelClick = () => {
    setOpenConflictPopup(false);
    setIsApplyDisabled(false);
    setPayload(undefined);
  };

  useEffect(() => {
    if (recurrenceType === DaypartingRecurrenceTypeEnum.WEEKLY) {
      const selectedLength = weekDays.filter(
        (type) => type.selected === true
      ).length;
      setWeekDayError(selectedLength < 1);
    }
  }, [recurrenceType, weekDays]);

  useEffect(() => {
    let error = '';

    timeRanges.forEach((range) => {
      if (range.errorText) {
        error = range.errorText;
        return;
      }
    });

    setTimeRangeError(isLastTimeRange ? '' : error);
  }, [timeRanges]);

  useEffect(() => {
    const isDateRangeError =
      isEdit === true
        ? getIsInvalidEndDate(endDate)
        : isInvalidDateRange(startDate, endDate);

    const isRecurrenceError =
      recurrenceType === DaypartingRecurrenceTypeEnum.WEEKLY &&
      (weekDays.filter((day) => day.selected === true).length < 1 ||
        weekDayError === true);

    const isHourOfDayError =
      hourOfDayType === DaypartingTimeRangeTypeEnum.CUSTOM_TIME_RANGE &&
      (!checkDaypartingTimeRangeAllPopulated(timeRanges) ||
        timeRangeError !== '');

    const isRuleNameError = ruleNameError !== '' || ruleName === '';

    const isBidError = newBid === 0 || bidError !== '';
    const campErr =
      appliedFilters.campaigns.filter(
        (item) => item.selected && item.value !== ''
      ).length === 0;

    const dateDayErr =
      recurrenceType === DaypartingRecurrenceTypeEnum.WEEKLY &&
      !rangeContainsSelectedWeekdays(weekDays, startDate, endDate);

    setIsInvalidWeekDay(dateDayErr);

    if (
      !moment(new Date(endDate)).isSame(
        moment(new Date(WALMART_INDEFINITE_END_DATE))
      )
    ) {
      setIsIndefiniteChecked(false);
    }

    const formattedTimeRanges: IDaypartingTimeRange[] = timeRanges.map(
      (range) => {
        return {
          startTime: range.startTime.value as DaypartingTimeTypeEnum,
          endTime: range.endTime.value as DaypartingTimeTypeEnum,
        };
      }
    );

    const body: ICreateJobBody = {
      title: ruleName,
      startDate: getFormattedCurrTimeZoneDate(startDate, DATE_FORMAT_3),
      endDate: checkIsIndefiniteDate(endDate)
        ? WALMART_INDEFINITE_END_DATE
        : getFormattedCurrTimeZoneDate(endDate, DATE_FORMAT_3),
      recurrence: {
        type: recurrenceType,
        days:
          recurrenceType === DaypartingRecurrenceTypeEnum.DAILY
            ? []
            : (weekDays
                .filter((day) => day.selected === true)
                .map((day) => day.value) as DaypartingRecurrenceDaysEnum[]),
      },
      schedules: {
        type: hourOfDayType,
        timeRanges:
          hourOfDayType === DaypartingTimeRangeTypeEnum.ALL_DAY
            ? []
            : formattedTimeRanges,
      },
      bidChange: {
        type: selectedAdjustment.value,
        percentage: newBid,
      },
      campaigns: getWalmartCampaignsArray(appliedFilters),
      timeZone: getTimeZoneByCountry(),
      adType: getFormattedAdType(selectedAdTypeFilter.adType.value),
    };

    setIsApplyDisabled(
      isDateRangeError ||
        isRecurrenceError ||
        isHourOfDayError ||
        isRuleNameError ||
        isBidError ||
        campErr ||
        dateDayErr ||
        checkIsEqual(jobData, body)
    );
  }, [
    endDate,
    hourOfDayType,
    recurrenceType,
    ruleName,
    ruleNameError,
    startDate,
    timeRangeError,
    weekDayError,
    weekDays,
    timeRanges,
    bidError,
    newBid,
    appliedFilters,
    filters,
    selectedAdjustment,
  ]);
  const isFormLoading = useMemo(
    () =>
      fetchCampaignsAlreadyInDayParting.isLoading ||
      fetchCampaignsAlreadyInDayParting.isRefetching ||
      isLoading,
    [
      fetchCampaignsAlreadyInDayParting.isLoading,
      fetchCampaignsAlreadyInDayParting.isRefetching,
      isLoading,
    ]
  );

  return (
    <DayPartingFormUI
      bidError={bidError}
      isApplyDisabled={isApplyDisabled}
      weekDayError={weekDayError}
      isInvalidWeekDay={isInvalidWeekDay}
      timeRangeError={timeRangeError}
      ruleNameError={ruleNameError}
      handleCancel={handleFormCancel}
      handleApply={handleApply}
      removeCampaign={handleCampaignRemoval}
      handleStartDateChange={handleStartDateChange}
      handleEndDateChange={handleEndDateChange}
      onRecurrenceTypeChange={onRecurrenceTypeChange}
      handleWeekDaysChange={handleWeekDaysChange}
      onHourOfDayTypeChange={onHourOfDayTypeChange}
      handleAddTimeRange={handleAddTimeRange}
      handleAdjustmentOptionChange={handleAdjustmentOptionChange}
      onStartTimeChange={onStartTimeChange}
      onEndTimeChange={onEndTimeChange}
      handleCancelTimeRange={handleCancelTimeRange}
      handleBidChange={handleBidChange}
      handleRuleNameChange={handleRuleNameChange}
      handleRuleNameBlur={handleRuleNameBlur}
      isLastTimeRange={isLastTimeRange}
      isTimeRangeLimitReached={isTimeRangeLimitReached}
      selectedCampaigns={selectedCampaigns}
      isStartCalOpen={isStartCalOpen}
      setIsStartCalOpen={setIsStartCalOpen}
      isEndCalOpen={isEndCalOpen}
      setIsEndCalOpen={setIsEndCalOpen}
      isIndefiniteChecked={isIndefiniteChecked}
      setIsIndefiniteChecked={setIsIndefiniteChecked}
      onCampaignSelect={onCampaignSelect}
      handleUpdate={handleRun}
      campaignsInDayParting={campaignsInDayParting}
      openConflictPopup={openConflictPopup}
      handleCancelClick={handleCancelClick}
      handleConfirmApply={handleConfirmApply}
      isEdit={isEdit}
      isLoading={isFormLoading}
    />
  );
}
