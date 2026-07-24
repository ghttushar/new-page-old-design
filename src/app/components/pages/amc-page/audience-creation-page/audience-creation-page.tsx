import CustomDateRangePickerWrapper from '@/app/components/shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import { customRangeFilterOption } from '@/constants';
import { Range } from '@/enums/serp.enums';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AltPrimaryButton from 'src/app/components/common/alt-primary-button/alt-primary-button';
import Dropdown, {
  IDropdownItem,
} from 'src/app/components/common/dropdown/dropdown';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import PrimaryButton from 'src/app/components/common/primary-button/primary-button';
import {
  amcRange,
  amcTimezones,
  audienceAutoAdjustDates,
} from 'src/constants/amc.constants';
import { EXECUTION_NAME } from 'src/constants/regex.constants';
import {
  IAMCCreateAudienceBody,
  IAMCQueryData,
} from 'src/interfaces/amc.interfaces';
import { IDateRange } from 'src/interfaces/serp.interface';
import { useAppSelector } from 'src/redux/hooks';
import { selectSelectedInstance } from 'src/redux/slices/amc/amc.slice';
import { selectIsDemoAccount } from 'src/redux/slices/auth/auth.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { AMCAudienceServices } from 'src/services/amc/amc-audience.services';
import {
  labelStyles,
  radioButtonStyles,
  textFieldStyles,
} from './audience-creation-page-styles';
import styles from './audience-creation-page.module.scss';

export default function AudienceCreationPage() {
  const isMounted = useRef(false);
  const { queryId } = useParams();

  const [audienceName, setAudienceName] = useState<string>('');
  const [audienceNameError, setAudienceNameError] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [descriptionError, setDescriptionError] = useState<string>('');
  const [rangeOptions, setRangeOptions] =
    useState<IDropdownItem<Range>[]>(amcRange);
  const [dateRange, setDateRange] = useState<IDropdownItem<Range>>(amcRange[3]);
  const [customDateRange, setCustomDateRange] = useState<IDateRange>({
    startDate: '',
    endDate: '',
  });
  const [timezone, setTimezone] = useState<IDropdownItem<string>>(
    amcTimezones[0]
  );
  const [autoAdjustDate, setAutoAdjustDate] = useState<boolean>(
    audienceAutoAdjustDates[0].value
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [queryData, setQueryData] = useState<IAMCQueryData | null>(null);
  const [isQueryLoading, setIsQueryLoading] = useState<boolean>(false);

  const selectedInstance = useAppSelector(selectSelectedInstance);
  const isDemoAccount = useAppSelector(selectIsDemoAccount);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCreateAudience = () => {
    const body: IAMCCreateAudienceBody = {
      instanceId: selectedInstance?.value as string,
      queryId: queryId as string,
      dateRange: dateRange.value,
      startDate:
        dateRange.value === Range.CUSTOM_RANGE
          ? customDateRange.startDate
          : undefined,
      endDate:
        dateRange.value === Range.CUSTOM_RANGE
          ? customDateRange.endDate
          : undefined,
      timeWindowTimeZone: timezone.value,
      audienceName: audienceName,
      audienceDescription: description,
      isAutoAdjustDateEnabled: autoAdjustDate,
    };

    setIsLoading(true);
    AMCAudienceServices.createAudience(body)
      .then((res) => {
        dispatch(
          showSuccessToastMessage({
            title: res.data.message,
            description: res.data.description,
          })
        );
      })
      .finally(() => {
        setIsLoading(false);
        navigate('/amc/created-audience');
      });
  };

  const handleAudienceNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAudienceName(event.target.value);
  };

  const handleAudienceNameBlur = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    setAudienceNameError('');

    if (!audienceName) {
      setAudienceNameError('Required Audience Name');
      return;
    }

    if (!EXECUTION_NAME.test(audienceName)) {
      setAudienceNameError('Invalid Audience Name entered');
      return;
    }
  };

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleDescriptionBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setDescriptionError('');

    if (!description) {
      setDescriptionError('Required Description');
      return;
    }
  };

  const onRangeSelect = (value: IDropdownItem<Range>) => {
    setDateRange(value);
  };

  const onTimezoneChange = (value: IDropdownItem<string>) => {
    setTimezone(value);
  };

  const onAutoAdjustDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAutoAdjustDate(event.target.value === 'true');
  };

  const handleSetCustomDateRangeForModal = (dateRange: IDateRange) => {
    setCustomDateRange(dateRange);
  };

  const getQueryByQueryId = useCallback(() => {
    setIsQueryLoading(true);
    AMCAudienceServices.getQueryByQueryId(queryId as string)
      .then((res) => {
        setQueryData(res.data.data);
      })
      .finally(() => {
        setIsQueryLoading(false);
      });
  }, [queryId]);

  useEffect(() => {
    getQueryByQueryId();
  }, [getQueryByQueryId]);

  useEffect(() => {
    if (isMounted.current === false) {
      setRangeOptions((prev) => [...prev, customRangeFilterOption]);

      isMounted.current = true;
    }
  }, []);

  return (
    <div className={styles.conversionContainer}>
      {isLoading === true && <LoaderWrapper />}

      {isQueryLoading === true || queryData === null ? (
        <LoaderWrapper />
      ) : (
        <div className={styles.queryFormContainer}>
          <div className={styles.buttonContainer}>
            <AltPrimaryButton
              buttonText="Cancel"
              width="8rem"
              height="3rem"
              fontSize="1.2rem"
              fontWeight="600"
              buttonFunction={handleCancel}
              disabled={false}
            />
            <PrimaryButton
              buttonText="Create"
              width="8rem"
              height="3rem"
              fontSize="1.2rem"
              fontWeight="600"
              buttonFunction={handleCreateAudience}
              disabled={
                audienceNameError !== '' ||
                descriptionError !== '' ||
                !audienceName ||
                !description
              }
            />
          </div>

          <div className={styles.formContainer}>
            <div className={styles.headerContainer}>
              <Typography variant="h2" className={styles.header}>
                {queryData?.title}
              </Typography>
              <Typography variant="body1" className={styles.subHeader}>
                {queryData?.description}
              </Typography>
            </div>

            <div className={styles.dropdownContainer}>
              <CustomDateRangePickerWrapper
                title={'Dates'}
                handleDateChange={onRangeSelect}
                setCustomDateRange={handleSetCustomDateRangeForModal}
                isTooltipRequired
                labelTooltipTitle="Select the date range for which you want to create audience. You can select a predefined range or a custom range."
                rangeOptions={rangeOptions}
              />

              <Dropdown
                options={amcTimezones}
                label={'Time Zone*'}
                labelStyles={labelStyles}
                labelTooltipTitle="Select the time zone in which you want to create audience."
                onSelect={onTimezoneChange}
                selected={timezone}
                width="100%"
              />
            </div>

            <div className={styles.textFieldContainer}>
              <InputLabel
                htmlFor="audience-name"
                className={styles.fieldHeader}
              >
                Audience Name* <InfoIcon title="Audience Name" />
              </InputLabel>
              <TextField
                value={audienceName}
                required
                id="audience-name"
                variant="outlined"
                type="text"
                name="queryTitle"
                placeholder="Eg: Path-to-Conversation-Nov-2023"
                sx={textFieldStyles}
                onChange={handleAudienceNameChange}
                onBlur={handleAudienceNameBlur}
                error={audienceNameError !== ''}
                helperText={
                  audienceNameError
                    ? audienceNameError
                    : '*Only letters & numbers are allowed.'
                }
              />
            </div>

            <div className={styles.textFieldContainer}>
              <InputLabel htmlFor="description" className={styles.fieldHeader}>
                Description* <InfoIcon title="Audience Description" />
              </InputLabel>
              <TextField
                multiline
                rows={8}
                value={description}
                required
                id="description"
                variant="outlined"
                type="text"
                placeholder="Description of the audience created"
                sx={textFieldStyles}
                onChange={handleDescriptionChange}
                onBlur={handleDescriptionBlur}
                error={descriptionError !== ''}
                helperText={descriptionError ? descriptionError : ''}
              />
            </div>

            <div className={styles.executionTypeContainer}>
              <InputLabel
                htmlFor="auto-adjust-date"
                className={styles.fieldHeader}
              >
                Auto Adjust Date*{' '}
                <InfoIcon title="If yes, selected date range will be adjusted as per the date of execution." />
              </InputLabel>
              <FormControl sx={textFieldStyles} id="auto-adjust-date">
                <RadioGroup
                  row
                  name="autoAdjustDate"
                  value={autoAdjustDate}
                  onChange={onAutoAdjustDateChange}
                >
                  {audienceAutoAdjustDates.map((option) => (
                    <FormControlLabel
                      key={option.label}
                      value={option.value}
                      control={<Radio sx={radioButtonStyles} disableRipple />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
