import CustomDateRangePickerWrapper from '@/app/components/shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import { Range } from '@/enums/serp.enums';
import {
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import { CaretDownIcon, CaretUpIcon } from '@phosphor-icons/react';
import React, { useCallback } from 'react';
import AltPrimaryButton from 'src/app/components/common/alt-primary-button/alt-primary-button';
import Dropdown, {
  IDropdownItem,
} from 'src/app/components/common/dropdown/dropdown';
import MultiSelectSearchableDropdown from 'src/app/components/common/dropdown/multi-select-searchable-dropdown';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';
import PrimaryButton from 'src/app/components/common/primary-button/primary-button';
import CustomTableWrapper from 'src/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { PAGE_SIZE_OPTIONS, PAGINATION_MODEL } from 'src/constants';
import {
  amcScheduleFrequency,
  amcTimezones,
  executionDaysOptions,
  executionTimeOptions,
  queryExecutionTypes,
} from 'src/constants/amc.constants';
import {
  AMCCampaignTypes,
  AMCExecutionDays,
  AMCExecutionTime,
  AMCQueryExecutionType,
  AMCScheduleFrequency,
} from 'src/enums/amc.enums';
import {
  IAMCIncludedCampaignsTable,
  IAccountQueryMapping,
} from 'src/interfaces/amc.interfaces';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { IDateRange } from 'src/interfaces/serp.interface';
import { checkIsTagPresent, isPTC } from 'src/utils/amc.utils';
import { includedCampaignsColumns } from './query-execution-page-columns';
import {
  labelStyles,
  radioButtonStyles,
  textFieldStyles,
} from './query-execution-page-styles';
import styles from './query-execution-page.module.scss';

interface IQueryExecutionFormProps {
  handleCancel: () => void;
  handleExecute: () => void;
  onCampaignTypeChange: (value: IDropdownItem<string>) => void;
  onCampaignNameOptionChange: (value: IMultiSelectDropdownItem[]) => void;
  workflowData: IAccountQueryMapping;
  campaignType: IDropdownItem<string>;
  campaignNameOptions: IMultiSelectDropdownItem[];
  campaignTypeOptions: IDropdownItem<string>[];
  campaignGroupOptions: IDropdownItem<string>[];
  onCampaignGroupChange: (value: IDropdownItem<string>) => void;
  handleAddCampaigns: () => void;
  campaignGroup: IDropdownItem<string>;
  includedCampaignTable: IAMCIncludedCampaignsTable[];
  handleDeleteCampaign: (id: number) => void;
  executionName: string;
  handleExecutionNameChange: (
    event: React.ChangeEvent<HTMLInputElement>
  ) => void;
  handleExecutionNameBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  executionNameError: string;
  executionType: string;
  onExecutionTypeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rangeOptions: IDropdownItem<Range>[];
  dateRange: IDropdownItem<Range>;
  onRangeSelect: (value: IDropdownItem<Range>) => void;
  customDateRange: IDateRange;
  onFrequencyChange: (value: IDropdownItem<AMCScheduleFrequency>) => void;
  scheduleFrequency: IDropdownItem<AMCScheduleFrequency>;
  onDayChange: (value: IDropdownItem<AMCExecutionDays>) => void;
  scheduleDay: IDropdownItem<AMCExecutionDays>;
  onTimeChange: (value: IDropdownItem<AMCExecutionTime>) => void;
  scheduleTime: IDropdownItem<AMCExecutionTime>;
  timezone: IDropdownItem<string>;
  onTimezoneChange: (value: IDropdownItem<string>) => void;
  settingToggle: boolean;
  setSettingToggle: React.Dispatch<React.SetStateAction<boolean>>;
  disableExecuteButton: boolean;
  previousRangeState: IDropdownItem<Range> | null;
  showDateRangeModal: boolean;
  setShowDateRangeModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetCustomDateRangeForModal: (dateRange: IDateRange) => void;
}
const QueryExecutionForm: React.FC<IQueryExecutionFormProps> = (props) => {
  const handleDisableAddButton = useCallback(() => {
    let areCampaignsSame = true;
    const selectedCampaigns = props.campaignNameOptions.filter(
      (campaign) => campaign.selected === true
    );
    const includedCampaignIds = new Set(
      props.includedCampaignTable.map((item) => item.id)
    );

    selectedCampaigns.forEach((campaign) => {
      if (!includedCampaignIds.has(Number(campaign.value))) {
        areCampaignsSame = false;
        return;
      }
    });

    return areCampaignsSame;
  }, [props.campaignNameOptions, props.includedCampaignTable]);

  const handleCustomFilterOptions = (
    options: IMultiSelectDropdownItem[],
    inputValue: string
  ) => {
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.value.toString().includes(inputValue)
    );
  };

  return (
    <div className={styles.queryFormContainer}>
      <div className={styles.buttonContainer}>
        <AltPrimaryButton
          buttonText="Cancel"
          width="8rem"
          height="3rem"
          fontSize="1.2rem"
          fontWeight="600"
          buttonFunction={props.handleCancel}
          disabled={false}
        />
        <PrimaryButton
          buttonText="Execute"
          width="8rem"
          height="3rem"
          fontSize="1.2rem"
          fontWeight="600"
          buttonFunction={props.handleExecute}
          disabled={props.disableExecuteButton}
        />
      </div>

      <div className={styles.formContainer}>
        <div className={styles.headerContainer}>
          <Typography variant="h2" className={styles.header}>
            {props.workflowData?.queryId?.title}
          </Typography>
          <Typography variant="body1" className={styles.subHeader}>
            {props.workflowData?.queryId.description}
          </Typography>
        </div>

        <div className={styles.executionNameContainer}>
          <InputLabel htmlFor="execution-name" className={styles.fieldHeader}>
            Execution Name <InfoIcon title="Execution Name" />
          </InputLabel>
          <TextField
            value={props.executionName}
            required
            id="execution-name"
            variant="outlined"
            type="text"
            name="queryTitle"
            placeholder="Eg: Path to Conversation Nov 2023"
            sx={textFieldStyles}
            onChange={props.handleExecutionNameChange}
            onBlur={props.handleExecutionNameBlur}
            helperText={
              props.executionNameError
                ? props.executionNameError
                : '*Only letters & numbers are allowed.'
            }
            error={props.executionNameError ? true : false}
          />
        </div>

        <div className={styles.executionTypeContainer}>
          <InputLabel htmlFor="execution-type" className={styles.fieldHeader}>
            Execution Type <InfoIcon title="Execution Type" />
          </InputLabel>
          <FormControl sx={textFieldStyles} id="execution-type">
            <RadioGroup
              row
              name="executionType"
              value={props.executionType}
              onChange={props.onExecutionTypeChange}
            >
              {queryExecutionTypes.map((type) => (
                <FormControlLabel
                  key={type.value}
                  value={type.value}
                  control={<Radio sx={radioButtonStyles} disableRipple />}
                  label={type.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </div>

        <div className={styles.dropdownContainer}>
          {props.executionType === AMCQueryExecutionType.ONCE && (
            <CustomDateRangePickerWrapper
              title={'Dates'}
              handleDateChange={props.onRangeSelect}
              setCustomDateRange={props.handleSetCustomDateRangeForModal}
              rangeOptions={props.rangeOptions}
              dropShadow={false}
              isTooltipRequired={true}
              labelStyles={labelStyles}
              labelTooltipTitle={
                'Select the date range for which you want to run the query. You can select a predefined range or a custom range.'
              }
              width="32rem"
            />
          )}

          {props.executionType === AMCQueryExecutionType.SCHEDULE && (
            <React.Fragment>
              <Dropdown
                options={amcScheduleFrequency}
                label={'Schedule'}
                labelStyles={labelStyles}
                labelTooltipTitle="Select the frequency at which you want to run the query"
                onSelect={props.onFrequencyChange}
                selected={props.scheduleFrequency}
                width="100%"
              />

              {props.scheduleFrequency.value ===
                AMCScheduleFrequency.WEEKLY && (
                <Dropdown
                  options={executionDaysOptions}
                  label={'Day'}
                  labelStyles={labelStyles}
                  labelTooltipTitle="Select a day to schedule the query"
                  onSelect={props.onDayChange}
                  selected={props.scheduleDay}
                  width="100%"
                />
              )}
              <Dropdown
                options={executionTimeOptions}
                label={'Time'}
                labelStyles={labelStyles}
                labelTooltipTitle="Select a time of the day to schedule the query"
                onSelect={props.onTimeChange}
                selected={props.scheduleTime}
                width="100%"
              />
            </React.Fragment>
          )}

          <Dropdown
            options={amcTimezones}
            label={'Time Zone'}
            labelStyles={labelStyles}
            labelTooltipTitle="Select the time zone in which you want to run the query"
            onSelect={props.onTimezoneChange}
            selected={props.timezone}
            width="100%"
          />
        </div>

        <div className={styles.advanceSettingsContainer}>
          <Typography variant="h3" className={styles.header}>
            Advance Settings{' '}
            <IconButton
              sx={{
                padding: '0.5rem',
              }}
              onClick={() => props.setSettingToggle(!props.settingToggle)}
            >
              {props.settingToggle === true ? (
                <CaretUpIcon size={20} color="#a1a2a1" weight="bold" />
              ) : (
                <CaretDownIcon size={20} color="#a1a2a1" weight="bold" />
              )}
            </IconButton>
          </Typography>

          <div
            className={styles.advanceSettingsActions}
            style={{
              display: props.settingToggle ? 'flex' : 'none',
            }}
          >
            <div className={styles.advanceFilters}>
              <Dropdown
                options={props.campaignTypeOptions}
                label={'Campaign Type'}
                labelStyles={labelStyles}
                labelTooltipTitle="Campaign Type"
                onSelect={props.onCampaignTypeChange}
                selected={props.campaignType}
                width="100%"
              />

              <MultiSelectSearchableDropdown
                label={'Campaign ID/Name'}
                placeholder="Select Campaigns"
                options={props.campaignNameOptions}
                onSelect={props.onCampaignNameOptionChange}
                width="100%"
                stopPropagation={true}
                customFilterOptions={handleCustomFilterOptions}
              />

              {props.workflowData !== null &&
                checkIsTagPresent(
                  props.workflowData?.queryId.tags as string[],
                  AMCCampaignTypes.DSP
                ) === true &&
                isPTC(props.workflowData.workflowId as string) && (
                  <Dropdown
                    options={props.campaignGroupOptions}
                    label={'Group'}
                    labelStyles={labelStyles}
                    labelTooltipTitle="Campaign Group"
                    onSelect={props.onCampaignGroupChange}
                    selected={props.campaignGroup}
                    width="100%"
                  />
                )}

              <PrimaryButton
                buttonText="Add"
                height="3rem"
                fontSize="1.2rem"
                fontWeight="600"
                buttonFunction={props.handleAddCampaigns}
                disabled={
                  !props.campaignType ||
                  !props.campaignGroup ||
                  handleDisableAddButton()
                }
              />
            </div>

            <div className={styles.tableHeading}>
              <Typography variant="h3" className={styles.header}>
                Included Campaigns
              </Typography>
              <Typography variant="body1" className={styles.subHeader}>
                The query for the path to conversion will execute for the
                specified campaigns and subsequently filter the results based on
                the designated groups.
              </Typography>
            </div>

            <div className={styles.tableWrapper}>
              <CustomTableWrapper
                data={props.includedCampaignTable}
                columns={includedCampaignsColumns(props.handleDeleteCampaign)}
                width="100%"
                height="30rem"
                pageSizes={PAGE_SIZE_OPTIONS}
                initialPagination={{
                  pageIndex: PAGINATION_MODEL.page,
                  pageSize: PAGINATION_MODEL.pageSize,
                }}
                noResultsOverlay={
                  <div className={styles.noDataOverlay}>
                    All Campaigns Included.
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryExecutionForm;
