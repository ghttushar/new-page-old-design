import LoaderWrapper from '@/app/components/common/loader-wrapper/loader-wrapper';
import MultiselectDropdownContent from '@/app/components/common/multi-select-custom-option-box/multi-select-custom-option-dropdown';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import { SingleCalendarWrapper } from '@/app/components/shared/custom-daterange-picker/custom-single-calendar';
import { WALMART_INDEFINITE_END_DATE } from '@/constants/advertising-walmart.constants';
import {
  IDaypartingCampaignList,
  IExistingCampaigns,
} from '@/interfaces/day-parting.interfaces';
import { IMultiSelectCustomDropdownItem } from '@/interfaces/dropdown.interfaces';
import {
  selectDayPartingAppliedFilters,
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
  setDayPartingCampaignOptions,
} from '@/redux/slices/day-parting/day-parting.slice';
import {
  checkIsIndefiniteDate,
  getIsDateBefore,
  getTimeInUnitFromMs,
  getTodayByTimeZone,
} from '@/utils/datetime.utils';
import {
  Checkbox,
  Dialog,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import {
  ClockCountdownIcon,
  PlusCircleIcon,
  XIcon,
} from '@phosphor-icons/react';
import React, { useEffect, useRef, useState } from 'react';
import Dropdown, {
  IDropdownItem,
} from 'src/app/components/common/dropdown/dropdown';
import {
  dayPartingBidAdjustmentOptions,
  dayPartingHourOfDayOptions,
  dayPartingRecurrenceOptions,
  dayPartingTimeOptions,
} from 'src/constants/day-parting.constants';
import {
  DaypartingBidChangeTypeEnum,
  DaypartingRecurrenceTypeEnum,
  DaypartingTimeRangeTypeEnum,
} from 'src/enums/day-parting.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectIsChatbotOpen,
  selectIsSidebarMenuOpen,
} from 'src/redux/slices/auth/auth.slice';
import {
  disableDayPartingTimeOptionsClone,
  getDaypartingTimeRange,
} from 'src/utils/day-parting.utils';
import RuleConflictPopup from '../walmart/day-parting-conflict-popup/day-parting-rule-conflict-popup';
import {
  checkboxStyles,
  radioButtonStyles,
  textFieldStyles,
  timeLabelStyles,
} from './day-parting-form-styles';
import styles from './day-parting-form.module.scss';

const dayPartingTimeOptionsClone: IDropdownItem<string>[] = JSON.parse(
  JSON.stringify(dayPartingTimeOptions)
);
interface IDaypartingFormUI {
  bidError: string;
  isApplyDisabled: boolean;
  timeRangeError: string;
  weekDayError: boolean;
  isInvalidWeekDay: boolean;
  ruleNameError: string;
  handleCancel: () => void;
  handleApply: () => void;
  handleStartDateChange: (date: string) => void;
  handleEndDateChange: (date: string) => void;
  onRecurrenceTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleWeekDaysChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onHourOfDayTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddTimeRange: () => void;
  handleAdjustmentOptionChange: (
    value: IDropdownItem<DaypartingBidChangeTypeEnum>
  ) => void;
  onStartTimeChange: (value: IDropdownItem<string>, currIndex: number) => void;
  onEndTimeChange: (value: IDropdownItem<string>, currIndex: number) => void;
  handleCancelTimeRange: (currIndex: number) => void;
  handleBidChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRuleNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRuleNameBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  isLastTimeRange: boolean;
  isTimeRangeLimitReached: boolean;
  selectedCampaigns: IDaypartingCampaignList[];
  isStartCalOpen: boolean;
  setIsStartCalOpen: (val: boolean) => void;
  isEndCalOpen: boolean;
  setIsEndCalOpen: (val: boolean) => void;
  isIndefiniteChecked: boolean;
  setIsIndefiniteChecked: (val: boolean) => void;
  onCampaignSelect: (selectedOptions: IMultiSelectCustomDropdownItem[]) => void;
  handleUpdate: () => void;
  campaignsInDayParting: IExistingCampaigns[];
  openConflictPopup: boolean;
  handleCancelClick: () => void;
  handleConfirmApply: () => void;
  isEdit: boolean;
  isLoading: boolean;
  removeCampaign: (campId: string) => void;
}

export default function DayPartingFormUI(props: IDaypartingFormUI) {
  const {
    bidError,
    isApplyDisabled,
    weekDayError,
    isInvalidWeekDay,
    timeRangeError,
    ruleNameError,
    handleCancel,
    handleApply,
    handleStartDateChange,
    handleEndDateChange,
    onRecurrenceTypeChange,
    handleWeekDaysChange,
    onHourOfDayTypeChange,
    handleAddTimeRange,
    handleAdjustmentOptionChange,
    onStartTimeChange,
    onEndTimeChange,
    handleCancelTimeRange,
    handleBidChange,
    handleRuleNameChange,
    handleRuleNameBlur,
    isLastTimeRange,
    isTimeRangeLimitReached,
    selectedCampaigns,
    isEndCalOpen,
    isIndefiniteChecked,
    isStartCalOpen,
    setIsEndCalOpen,
    setIsIndefiniteChecked,
    setIsStartCalOpen,
    onCampaignSelect,
    handleUpdate,
    campaignsInDayParting,
    openConflictPopup,
    handleCancelClick,
    handleConfirmApply,
    isEdit,
    isLoading,
    removeCampaign,
  } = props;

  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);
  const recurrenceType = useAppSelector(selectRecurrenceType);
  const isChatBotOpen = useAppSelector(selectIsChatbotOpen);
  const isSideBarMenuOpen = useAppSelector(selectIsSidebarMenuOpen);
  const weeklyDays = useAppSelector(selectWeekDays);
  const hourOfDayType = useAppSelector(selectHourOfDayType);
  const timeRanges = useAppSelector(selectTimeRanges);
  const selectedAdjustment = useAppSelector(selectSelectedAdjustment);
  const newBid = useAppSelector(selectNewBid);
  const ruleName = useAppSelector(selectRuleName);
  const dispatch = useAppDispatch();
  const appliedFilters = useAppSelector(selectDayPartingAppliedFilters);
  const options = useAppSelector(selectDayPartingOptions);

  const rangeContainerRef = useRef<HTMLDivElement>(null);

  const [openEdit, setOpenEdit] = useState(false);

  const onEndDateChange = (date: string) => {
    handleEndDateChange(date);
    setIsEndCalOpen(false);
  };

  const handleCancelUpdate = () => {
    setOpenEdit(!openEdit);
    dispatch(setDayPartingCampaignOptions(appliedFilters.campaigns));
  };

  const handleConfirmUpdate = () => {
    handleUpdate();
    setOpenEdit(false);
  };

  const onStartDateChange = (date: string) => {
    handleStartDateChange(date);
    setIsStartCalOpen(false);
  };

  useEffect(() => {
    if (rangeContainerRef.current) {
      rangeContainerRef.current.scrollTo({
        left: rangeContainerRef.current.scrollWidth,
        behavior: 'smooth',
      });
    }
  }, [timeRanges]);

  return (
    <div className={styles.formContainer} id="day-parting-form">
      {isLoading === true && <LoaderWrapper />}
      <div className={styles.formBoxContainer}>
        <RuleConflictPopup
          isOpen={openConflictPopup && !isLoading}
          campaignsList={campaignsInDayParting}
          handleConfirm={handleConfirmApply}
          handleCancel={handleCancelClick}
        />

        <p className={styles.filterText}>Campaigns </p>
        <div className={styles.addedFiltersTab}>
          <div className={styles.addedFilterContainer}>
            {selectedCampaigns.length > 0 ? (
              selectedCampaigns.map((item, index) => (
                <div key={index} className={styles.singleFilterContainer}>
                  <IconButton
                    disableRipple
                    onClick={() => removeCampaign(item.campaignId)}
                    sx={{
                      background: 'white !important',
                      position: 'absolute',
                      top: '-0.8rem',
                      cursor: 'pointer',
                      right: '-0.6rem',
                      padding: '0.3rem',
                      boxShadow: '0 0 0.2rem 0 rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <XIcon size={'0.8rem'} weight="bold" color="#000" />
                  </IconButton>
                  <Typography
                    fontSize="1rem"
                    fontWeight={400}
                    noWrap
                    color={'#464646'}
                  >
                    {item.campaignName}
                  </Typography>
                </div>
              ))
            ) : (
              <span
                style={{
                  opacity: '0.3',
                  fontSize: '1.1rem',
                  marginTop: '-0.4rem',
                }}
              >
                Please select campaigns from the dropdown above to view them
                here
              </span>
            )}
          </div>
          <span className={styles.vl}></span>

          <div className={styles.editButton}>
            <Dialog
              open={openEdit}
              sx={{
                '& .MuiDialog-paper': {
                  margin: 0,
                  width: '50rem',
                },
              }}
            >
              <MultiselectDropdownContent
                options={options.campaigns}
                onSelect={onCampaignSelect}
                emptyOptionListMessage={'No Campaigns'}
                isHorizontalScroll={false}
                width="50rem"
                isModal={true}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'end',
                  gap: '1rem',
                  margin: '2.4rem 1.4rem 1.4rem 0',
                }}
              >
                <SecondaryButton
                  buttonText={'Close'}
                  width="5.4rem"
                  buttonFunction={handleCancelUpdate}
                  disabled={false}
                />
                <PrimaryButton
                  buttonText={'Update'}
                  width="5.4rem"
                  buttonFunction={handleConfirmUpdate}
                  disabled={false}
                />
              </div>
            </Dialog>
            <SecondaryButton
              buttonText={'Edit'}
              width="5.4rem"
              buttonFunction={() => setOpenEdit(!openEdit)}
              disabled={false}
            />
          </div>
        </div>

        <div className={styles.fieldsContainer}>
          <Divider
            sx={{
              marginTop: '1rem',
            }}
          />

          <div className={styles.subContainer1}>
            <div className={styles.ruleNameContainer} id="rule-name">
              <InputLabel htmlFor="rule-name" className={styles.fieldHeader}>
                Rule Name
              </InputLabel>
              <span
                style={{
                  marginBottom: '0.8rem',
                  color: '#A7A7A7',
                }}
              ></span>

              <TextField
                value={ruleName}
                id="rule-name"
                variant="outlined"
                type="text"
                name="ruleName"
                sx={textFieldStyles}
                placeholder="Ex: Weekend Dayparting"
                onChange={handleRuleNameChange}
                onBlur={handleRuleNameBlur}
                error={ruleNameError ? true : false}
              />

              {ruleNameError !== '' && (
                <FormHelperText
                  sx={{
                    position: 'absolute',
                    bottom: '-0.6rem',
                    fontSize: '1.1rem',
                    color: '#F00',
                  }}
                >
                  <sup>*</sup>
                  {ruleNameError}
                </FormHelperText>
              )}
            </div>
            <div className={styles.dateRangeContainer}>
              <InputLabel htmlFor="rule-name" className={styles.fieldHeader}>
                Date Range
              </InputLabel>

              <div className={styles.dateRangeSubContainer}>
                <SingleCalendarWrapper
                  value={startDate}
                  label="Start Date"
                  isOpen={isStartCalOpen}
                  onOpenChange={setIsStartCalOpen}
                  onDateSelect={onStartDateChange}
                  width={isChatBotOpen ? '10rem' : '14rem'}
                  height="3.2rem"
                  minDate={getTodayByTimeZone()}
                  disabled={isEdit}
                />

                <SingleCalendarWrapper
                  value={endDate}
                  label="End Date"
                  isOpen={isEndCalOpen}
                  onOpenChange={setIsEndCalOpen}
                  onDateSelect={onEndDateChange}
                  width={isChatBotOpen ? '10rem' : '14rem'}
                  height="3.2rem"
                  minDate={
                    getIsDateBefore(
                      startDate,
                      getTodayByTimeZone().toDateString()
                    )
                      ? getTodayByTimeZone()
                      : new Date(startDate)
                  }
                  disabled={startDate === ''}
                  isChecked={
                    isIndefiniteChecked || checkIsIndefiniteDate(endDate)
                  }
                />

                <div className={styles.noEndDate}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={checkboxStyles}
                        size="medium"
                        checked={
                          isIndefiniteChecked || checkIsIndefiniteDate(endDate)
                        }
                        onChange={(e, checked) => {
                          if (checked === false) {
                            handleEndDateChange(
                              getTodayByTimeZone().toDateString()
                            );
                          } else {
                            handleEndDateChange(WALMART_INDEFINITE_END_DATE);
                          }
                          setIsIndefiniteChecked(checked);
                        }}
                      />
                    }
                    label={'No End Date'}
                    sx={{
                      '& .MuiTypography-root': {
                        fontSize: '1.2rem',
                        fontWeight: 400,
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div className={styles.subContainer2}>
            <div className={styles.recurrenceContainer}>
              <InputLabel htmlFor="recurrence" className={styles.fieldHeader}>
                Recurrence
              </InputLabel>
              <FormControl sx={textFieldStyles} id="recurrence">
                <RadioGroup
                  row
                  name="recurrence"
                  value={recurrenceType}
                  onChange={onRecurrenceTypeChange}
                  style={{
                    display: 'flex',
                    gap: '1.1rem',
                  }}
                >
                  {dayPartingRecurrenceOptions.map((type) => (
                    <FormControlLabel
                      key={type.value}
                      value={type.value}
                      control={<Radio sx={radioButtonStyles} disableRipple />}
                      label={type.label}
                      sx={{
                        '& .MuiTypography-root': {
                          fontSize: '1.2rem',
                          fontWeight: '300 !important',
                          color: '#464646',
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

              <FormControl
                required
                error={weekDayError || isInvalidWeekDay}
                component="fieldset"
                sx={{
                  display: 'flex',
                  flexWrap: 'nowrap',
                  m: 0,
                  mt: '-2.8rem',
                  ml: '-1.2rem',
                }}
                variant="standard"
              >
                <FormGroup
                  row
                  sx={{
                    position: 'relative',
                  }}
                >
                  {weeklyDays.length > 0 &&
                    weeklyDays.map((option) => (
                      <FormControlLabel
                        key={option.value}
                        style={{
                          cursor:
                            recurrenceType !==
                            DaypartingRecurrenceTypeEnum.WEEKLY
                              ? 'not-allowed'
                              : 'pointer',
                        }}
                        control={
                          <Checkbox
                            checked={
                              (option.selected &&
                                recurrenceType ===
                                  DaypartingRecurrenceTypeEnum.WEEKLY) ||
                              recurrenceType ===
                                DaypartingRecurrenceTypeEnum.DAILY
                            }
                            onChange={handleWeekDaysChange}
                            disabled={
                              recurrenceType !==
                              DaypartingRecurrenceTypeEnum.WEEKLY
                            }
                            name={option.value}
                            sx={checkboxStyles}
                          />
                        }
                        label={option.label}
                        sx={{
                          margin: '0 0 0 0.2rem',
                          '& .MuiTypography-root': {
                            fontSize: '1.2rem',
                            fontWeight: '400 !important',
                          },
                        }}
                      />
                    ))}
                </FormGroup>

                {(weekDayError === true || isInvalidWeekDay === true) && (
                  <FormHelperText
                    sx={{
                      position: 'absolute',
                      bottom: '-2rem',
                      fontSize: '1.1rem',
                      color: '#f00 !important',
                    }}
                  >
                    <sup>*</sup>{' '}
                    {weekDayError === true
                      ? `At least one day must be selected for Weekly
                    recurrence`
                      : isInvalidWeekDay === true
                      ? `Selected Day(s) is out of selected date range`
                      : ''}
                  </FormHelperText>
                )}
              </FormControl>
            </div>

            <div
              className={styles.bidAdjustmentContainer}
              style={{
                width: '100%',
                gap: '3rem',
              }}
            >
              <InputLabel
                htmlFor="bidAdjustment"
                className={styles.fieldHeader}
              >
                Bid Adjustment
              </InputLabel>

              <span
                style={{
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <Dropdown
                  options={dayPartingBidAdjustmentOptions}
                  selected={selectedAdjustment}
                  onSelect={handleAdjustmentOptionChange}
                  width="13rem"
                  height="3.45rem"
                  variant="unset"
                />

                <TextField
                  value={newBid}
                  id="rule-name"
                  variant="outlined"
                  type="number"
                  name="bidAdjustment"
                  sx={{
                    ...textFieldStyles,
                    '& > :not(style)': {
                      marginTop: '0.2rem',
                      width: '40%',
                      height: '3.44rem',
                      fontSize: '1.3rem',
                    },
                  }}
                  onChange={handleBidChange}
                  error={bidError ? true : false}
                />
              </span>

              {bidError !== '' && (
                <FormHelperText
                  sx={{
                    position: 'absolute',
                    bottom: '-2.2rem',
                    fontSize: '1.1rem',
                    color: '#F00',
                  }}
                >
                  <sup>*</sup>
                  {bidError}
                </FormHelperText>
              )}
            </div>
          </div>

          <Divider />

          <div className={styles.hourContainer}>
            <InputLabel htmlFor="hourOfDay" className={styles.fieldHeader}>
              Hour of Day
            </InputLabel>
            <FormControl sx={textFieldStyles} id="hourOfDay">
              <RadioGroup
                row
                name="hourOfDay"
                value={hourOfDayType}
                onChange={onHourOfDayTypeChange}
              >
                {dayPartingHourOfDayOptions.map((type) => (
                  <FormControlLabel
                    key={type.value}
                    value={type.value}
                    control={<Radio sx={radioButtonStyles} disableRipple />}
                    label={type.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                maxWidth: '100%',
                marginTop: '-2rem',
                gap: '1rem',
              }}
            >
              <div className={styles.rangeContainer} ref={rangeContainerRef}>
                {timeRanges.length > 0 &&
                  timeRanges.map((timeRange, index) => (
                    <div
                      className={styles.timeRangeContainer}
                      key={index}
                      style={{
                        cursor:
                          hourOfDayType !==
                          DaypartingTimeRangeTypeEnum.CUSTOM_TIME_RANGE
                            ? 'not-allowed'
                            : 'initial',
                      }}
                    >
                      <span className="flex justify-between item-center gap-[2rem]">
                        <Dropdown
                          options={disableDayPartingTimeOptionsClone(
                            dayPartingTimeOptionsClone,
                            timeRanges
                          ).slice(0, -1)}
                          label={'Start Time'}
                          labelStyles={timeLabelStyles}
                          labelTooltipTitle="Select a start time for the dayparting job to start."
                          onSelect={(selected) =>
                            onStartTimeChange(selected, index)
                          }
                          selected={timeRange.startTime}
                          error={timeRange.errorText !== ''}
                          width="8rem"
                          disabled={
                            hourOfDayType !==
                            DaypartingTimeRangeTypeEnum.CUSTOM_TIME_RANGE
                          }
                        />
                        <Dropdown
                          options={disableDayPartingTimeOptionsClone(
                            dayPartingTimeOptionsClone,
                            timeRanges
                          )}
                          label={'End Time'}
                          labelStyles={timeLabelStyles}
                          labelTooltipTitle="Select an end time for the dayparting job to end."
                          onSelect={(selected) =>
                            onEndTimeChange(selected, index)
                          }
                          selected={timeRange.endTime}
                          error={timeRange.errorText !== ''}
                          width="8rem"
                          disabled={
                            hourOfDayType !==
                            DaypartingTimeRangeTypeEnum.CUSTOM_TIME_RANGE
                          }
                        />
                      </span>

                      <span className={styles.timeRangeText}>
                        <ClockCountdownIcon size={'1.4rem'} /> Time Range Set
                        for:{' '}
                        {getDaypartingTimeRange(timeRange) === 0
                          ? '0hr'
                          : getTimeInUnitFromMs(
                              getDaypartingTimeRange(timeRange)
                            )}
                      </span>
                      <IconButton
                        disableRipple
                        onClick={() => handleCancelTimeRange(index)}
                        sx={{
                          background: 'white !important',
                          position: 'absolute',
                          top: '-0.8rem',
                          cursor:
                            hourOfDayType !==
                              DaypartingTimeRangeTypeEnum.CUSTOM_TIME_RANGE ||
                            isLastTimeRange === true
                              ? 'not-allowed'
                              : 'pointer',
                          right: '-0.5rem',
                          zIndex: '1000',
                          padding: '0.3rem',
                          boxShadow: '0 0 0.2rem 0 rgba(0, 0, 0, 0.3)',
                          '&:active': {
                            background: '#d4d4d4',
                          },
                        }}
                      >
                        <XIcon
                          size={10}
                          weight="bold"
                          color="#000"
                          style={{}}
                        />
                      </IconButton>
                    </div>
                  ))}
              </div>
              <SecondaryButton
                width="16rem"
                buttonIcon={<PlusCircleIcon size={'1.6rem'} />}
                isButtonIconRequired
                buttonText={'Add Time Range'}
                buttonFunction={handleAddTimeRange}
                isHoverTooltipEnabled
                tooltipText={isTimeRangeLimitReached ? timeRangeError : ''}
                disabled={
                  hourOfDayType !==
                    DaypartingTimeRangeTypeEnum.CUSTOM_TIME_RANGE ||
                  isTimeRangeLimitReached
                }
              />
            </div>
            {
              <p
                className={styles.error}
                style={{
                  visibility: timeRangeError !== '' ? 'visible' : 'hidden',
                }}
              >
                <sup>*</sup>
                {timeRangeError}
              </p>
            }
          </div>

          <Divider />

          <div className={styles.buttonContainer}>
            <SecondaryButton
              buttonText="Cancel"
              width="8rem"
              height="3.2rem"
              fontSize="1.2rem"
              fontWeight="600"
              buttonFunction={handleCancel}
              disabled={false}
            />
            <PrimaryButton
              buttonText={
                isEdit ? 'Update Day Parting Rule' : 'Apply Day Parting Rule'
              }
              width="auto"
              height="3.2rem"
              fontSize="1.1rem"
              fontWeight="600"
              buttonFunction={handleApply}
              disabled={isApplyDisabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
