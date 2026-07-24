import { Range } from '@/enums/serp.enums';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import LoaderWrapper from 'src/app/components/common/loader-wrapper/loader-wrapper';
import { ALL_LABEL, ALL_VALUE, customRangeFilterOption } from 'src/constants';
import {
  amcCampaignTypes,
  amcRange,
  amcScheduleFrequency,
  amcTimezones,
  dspGroups,
  executionDaysOptions,
  executionTimeOptions,
  queryExecutionTypes,
  sbGroups,
  sdGroups,
  spGroups,
} from 'src/constants/amc.constants';
import { EXECUTION_NAME } from 'src/constants/regex.constants';
import {
  AMCCampaignTypes,
  AMCExecutionDays,
  AMCExecutionTime,
  AMCQueryExecutionType,
  AMCScheduleFrequency,
  AMCTypeWindowTypes,
} from 'src/enums/amc.enums';
import {
  IAMCIncludedCampaignsTable,
  IAMCWorkflowQueryExecutionBody,
  IAMCWorkflowQueryExecutionFilterForm,
  IAMCWorkflowQueryExecutionScheduleBody,
  IAccountQueryMapping,
  IAllCampaign,
  IAllCampaignData,
} from 'src/interfaces/amc.interfaces';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { IDateRange } from 'src/interfaces/serp.interface';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { AMCQueryServices } from 'src/services/amc/amc-queries.services';
import {
  checkIsTagPresent,
  getAMCScheduleDayOption,
  getAMCScheduleFrequencyOption,
  getAMCScheduleTimeOption,
  getAMCTimezoneOption,
  getAdsTableData,
  getDSPTableData,
  getFormattedCampaignsForQueryExecution,
  isPTC,
} from 'src/utils/amc.utils';
import { getFormattedTimezoneDate } from 'src/utils/datetime.utils';
import QueryExecutionForm from './query-execution-form';
import styles from './query-execution-page.module.scss';

export default function QueryExecutionPage() {
  const isMounted = useRef(false);
  const { instanceId, workflowId } = useParams();
  const [searchParams] = useSearchParams();

  const [executionName, setExecutionName] = useState<string>('');
  const [executionNameError, setExecutionNameError] = useState<string>('');
  const [rangeOptions, setRangeOptions] =
    useState<IDropdownItem<Range>[]>(amcRange);
  const [dateRange, setDateRange] = useState<IDropdownItem<Range>>(amcRange[3]);
  const [showDateRangeModal, setShowDateRangeModal] = useState<boolean>(false);
  const [prevRange, setPrevRange] = useState<IDropdownItem<Range> | null>(null);
  const [customDateRange, setCustomDateRange] = useState<IDateRange>({
    startDate: '',
    endDate: '',
  });
  const [scheduleFrequency, setScheduleFrequency] = useState<
    IDropdownItem<AMCScheduleFrequency>
  >(amcScheduleFrequency[0]);
  const [scheduleDay, setScheduleDay] = useState<
    IDropdownItem<AMCExecutionDays>
  >(executionDaysOptions[0]);
  const [scheduleTime, setScheduleTime] = useState<
    IDropdownItem<AMCExecutionTime>
  >(executionTimeOptions[0]);
  const [timezone, setTimezone] = useState<IDropdownItem<string>>(
    amcTimezones[0]
  );
  const [campaignTypeOptions, setCampaignTypeOptions] =
    useState<IDropdownItem<string>[]>(amcCampaignTypes);
  const [campaignType, setCampaignType] = useState<IDropdownItem<string>>(
    amcCampaignTypes[0]
  );
  const [campaignGroupOptions, setCampaignGroupOptions] = useState<
    IDropdownItem<string>[]
  >([]);
  const [campaignGroup, setCampaignGroup] = useState<IDropdownItem<string>>(
    spGroups[0]
  );
  const [isGroupLoading, setIsGroupLoading] = useState<boolean>(false);
  const [campaignNameOptions, setCampaignNameOptions] = useState<
    IMultiSelectDropdownItem[]
  >([]);
  const [campaigns, setCampaigns] = useState<IAllCampaignData | null>(null);
  const [filteredCampaigns, setFilteredCampaigns] = useState<IAllCampaign[]>(
    []
  );
  const [isCampaignOptionsLoading, setIsCampaignOptionsLoading] =
    useState<boolean>(false);
  const [includedCampaignTable, setIncludedCampaignTable] = useState<
    IAMCIncludedCampaignsTable[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [workflowData, setWorkflowData] = useState<IAccountQueryMapping | null>(
    null
  );
  const [isWorkflowLoading, setIsWorkflowLoading] = useState<boolean>(false);
  const [executionType, setExecutionType] = useState<string>(
    queryExecutionTypes[0].value
  );
  const [settingToggle, setSettingToggle] = useState<boolean>(false);

  const handleExecutionNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExecutionName(event.target.value);
  };
  const handleExecutionNameBlur = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    setExecutionNameError('');

    if (!executionName) {
      setExecutionNameError('Required Execution Name');
      return;
    }

    if (!EXECUTION_NAME.test(executionName)) {
      setExecutionNameError('Invalid Execution Name entered');
      return;
    }
  };
  const onRangeSelect = (value: IDropdownItem<Range>) => {
    setPrevRange(dateRange);
    setDateRange(value);
  };
  const onFrequencyChange = (value: IDropdownItem<AMCScheduleFrequency>) => {
    setScheduleFrequency(value);
  };
  const onDayChange = (value: IDropdownItem<AMCExecutionDays>) => {
    setScheduleDay(value);
  };
  const onTimeChange = (value: IDropdownItem<AMCExecutionTime>) => {
    setScheduleTime(value);
  };
  const onTimezoneChange = (value: IDropdownItem<string>) => {
    setTimezone(value);
  };
  const onExecutionTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setExecutionType(event.target.value);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getFilters = useCallback(
    (
      _filterData: IAMCWorkflowQueryExecutionFilterForm
    ):
      | IAMCWorkflowQueryExecutionBody
      | IAMCWorkflowQueryExecutionScheduleBody => {
      const segregatedCampaigns = getFormattedCampaignsForQueryExecution(
        _filterData.includedCampaigns,
        isPTC(workflowId as string)
      );

      if (executionType === AMCQueryExecutionType.ONCE) {
        const filters: IAMCWorkflowQueryExecutionBody = {
          instanceId: instanceId as string,
          workflowId: workflowId as string,
          executionName: _filterData.executionName,
          startDate:
            _filterData.dateRange?.value === Range.CUSTOM_RANGE
              ? customDateRange.startDate
              : undefined,
          endDate:
            _filterData.dateRange?.value === Range.CUSTOM_RANGE
              ? customDateRange.endDate
              : undefined,
          dateRange: _filterData.dateRange?.value as Range,
          timeWindowType: AMCTypeWindowTypes.EXPLICIT,
          timeWindowTimeZone: _filterData.timezone?.value as string,
          ...segregatedCampaigns,
        };

        return filters;
      } else {
        const filters: IAMCWorkflowQueryExecutionScheduleBody = {
          instanceId: instanceId as string,
          workflowId: workflowId as string,
          scheduleName: _filterData.executionName,
          scheduleStatus: true,
          scheduleFrequency: _filterData.scheduleFrequency
            ?.value as AMCScheduleFrequency,
          scheduleTime: _filterData.scheduleTime.value,
          scheduleStartDay:
            _filterData.scheduleFrequency?.value === AMCScheduleFrequency.WEEKLY
              ? (_filterData.scheduleDay?.value as string)
              : undefined,
          scheduleTimezone: _filterData.timezone?.value as string,
          timeWindowType: AMCTypeWindowTypes.EXPLICIT,
          ...segregatedCampaigns,
        };

        return filters;
      }
    },
    [customDateRange, instanceId, workflowId, executionType]
  );

  const handleCancel = () => {
    navigate(-1);
  };

  const handleExecute = () => {
    const filters: IAMCWorkflowQueryExecutionFilterForm = {
      executionName,
      dateRange,
      scheduleFrequency: scheduleFrequency,
      timezone: timezone,
      scheduleTime: scheduleTime,
      scheduleDay: scheduleDay,
      includedCampaigns: includedCampaignTable,
    };

    if (executionType === AMCQueryExecutionType.ONCE) {
      setIsLoading(true);
      AMCQueryServices.createWorkflowQueryExecution(
        getFilters(filters) as IAMCWorkflowQueryExecutionBody
      )
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
          navigate('/amc/executed-queries');
        });
    } else {
      setIsLoading(true);
      AMCQueryServices.createWorkflowQueryExecutionSchedule(
        getFilters(filters) as IAMCWorkflowQueryExecutionScheduleBody
      )
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
          navigate('/amc/scheduled-workflow-execution');
        });
    }
  };

  const handleSetCustomDateRangeForModal = (dateRange: IDateRange) => {
    onRangeSelect(customRangeFilterOption);
    setCustomDateRange(dateRange);
  };

  const onCampaignTypeChange = (value: IDropdownItem<string>) => {
    setCampaignType(value);
  };

  const onCampaignGroupChange = (value: IDropdownItem<string>) => {
    setCampaignGroup(value);
  };

  const onCampaignNameOptionsChange = (value: IMultiSelectDropdownItem[]) => {
    setCampaignNameOptions(value);
  };

  const handleAddCampaigns = () => {
    const _selectedCampaigns = campaignNameOptions.filter(
      (campaign) => campaign.selected === true && campaign.value !== ALL_VALUE
    );

    const includedCampaignIds = new Set(
      includedCampaignTable.map((item) => item.id)
    );

    const uniqueCampaigns: IAMCIncludedCampaignsTable[] = _selectedCampaigns
      .filter((_campaign) => !includedCampaignIds.has(Number(_campaign.value)))
      .map((campaign) => {
        return {
          id: Number(campaign.value),
          campaignType: campaignType,
          campaignGroup: campaignGroup,
          campaignName: campaign as IDropdownItem<string>,
        };
      });

    setIncludedCampaignTable([...includedCampaignTable, ...uniqueCampaigns]);
  };

  const handleDeleteCampaign = (id: number) => {
    const updatedCampaign: IAMCIncludedCampaignsTable[] =
      includedCampaignTable.filter((campaign) => campaign.id !== id);

    const updatedCampaignNameOptions: IMultiSelectDropdownItem[] =
      campaignNameOptions.map((campaign) => {
        if (Number(campaign.value) === id || campaign.value === ALL_VALUE) {
          return {
            ...campaign,
            selected: false,
          };
        }
        return campaign;
      });

    setIncludedCampaignTable(updatedCampaign);
    setCampaignNameOptions(updatedCampaignNameOptions);
  };

  const getWorkflowByWorkflowId = useCallback(() => {
    AMCQueryServices.getWorkflowByWorkflowId(
      instanceId as string,
      workflowId as string
    ).then((res) => {
      setWorkflowData(res.data.data);
      setExecutionName(res.data.data.queryId?.title);
    });
  }, [instanceId, workflowId]);

  const getSponsoredAdsDSPCampaigns = useCallback(() => {
    AMCQueryServices.getSponsoredAdsDSPCampaigns().then((res) => {
      setCampaigns(res.data.data);
    });
  }, []);

  useEffect(() => {
    setIsWorkflowLoading(true);
    getWorkflowByWorkflowId();
    getSponsoredAdsDSPCampaigns();
    setIsWorkflowLoading(false);
  }, [getWorkflowByWorkflowId, getSponsoredAdsDSPCampaigns]);

  useEffect(() => {
    if (workflowData !== null) {
      const tags = workflowData.queryId.tags;
      if (!tags?.length) return;
      const _campaignTypeOptions = amcCampaignTypes.filter((type) =>
        checkIsTagPresent(tags, type.value)
      );

      setCampaignTypeOptions(_campaignTypeOptions);
      setCampaignType(_campaignTypeOptions[0]);
    }
  }, [workflowData]);

  useEffect(() => {
    setIsGroupLoading(true);
    if (campaignType.value === AMCCampaignTypes.SP) {
      setCampaignGroupOptions(spGroups);
      setCampaignGroup(spGroups[0]);
      campaigns !== null && setFilteredCampaigns(campaigns?.SP);
    } else if (campaignType.value === AMCCampaignTypes.SB) {
      setCampaignGroupOptions(sbGroups);
      setCampaignGroup(sbGroups[0]);
      campaigns !== null && setFilteredCampaigns(campaigns?.SB);
    } else if (campaignType.value === AMCCampaignTypes.SD) {
      setCampaignGroupOptions(sdGroups);
      setCampaignGroup(sdGroups[0]);
      campaigns !== null && setFilteredCampaigns(campaigns?.SD);
    } else if (campaignType.value === AMCCampaignTypes.DSP) {
      setCampaignGroupOptions(dspGroups);
      setCampaignGroup(dspGroups[0]);
      campaigns !== null && setFilteredCampaigns(campaigns?.DSP);
    }
    setIsGroupLoading(false);
  }, [campaignType, campaigns]);

  useEffect(() => {
    setIsCampaignOptionsLoading(true);
    const _campaignNames: IMultiSelectDropdownItem[] = filteredCampaigns.map(
      (campaign) => {
        return {
          value: campaign.campaignId,
          label: campaign.campaignName,
          selected: false,
        };
      }
    );

    setCampaignNameOptions([
      { label: ALL_LABEL, value: ALL_VALUE, selected: false },
      ..._campaignNames,
    ]);
    setIsCampaignOptionsLoading(false);
  }, [filteredCampaigns]);

  useEffect(() => {
    if (isMounted.current === false) {
      setRangeOptions((prev) => [...prev, customRangeFilterOption]);

      isMounted.current = true;
    }
  }, []);

  const executionId = searchParams.get('executionId');
  const type = searchParams.get('executionType');

  useEffect(() => {
    if (!executionId || !instanceId || !type) return;
    setIsLoading(true);

    if (type === AMCQueryExecutionType.ONCE) {
      AMCQueryServices.getWorkflowExecutionByExecutionId(
        instanceId,
        executionId
      )
        .then((res) => {
          const executionData = res.data.data;
          setExecutionName(executionData.executionName);
          setExecutionType(type);
          setCustomDateRange({
            startDate: getFormattedTimezoneDate(
              executionData.timeWindowStart,
              executionData.timeWindowTimeZone
            ).split(' ')[0],
            endDate: getFormattedTimezoneDate(
              executionData.timeWindowEnd,
              executionData.timeWindowTimeZone
            ).split(' ')[0],
          });
          setDateRange(customRangeFilterOption);
          setTimezone(getAMCTimezoneOption(executionData.timeWindowTimeZone));
          const adsTableData = getAdsTableData(executionData, campaigns);
          setIncludedCampaignTable(adsTableData);
          const dspTableData = getDSPTableData(executionData, campaigns);
          setIncludedCampaignTable((prev) => [...prev, ...dspTableData]);

          if (adsTableData.length > 0 || dspTableData.length > 0) {
            setSettingToggle(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (type === AMCQueryExecutionType.SCHEDULE) {
      AMCQueryServices.getWorkflowExecutionScheduleById(instanceId, executionId)
        .then((res) => {
          const executionData = res.data.data;
          setExecutionName(executionData.scheduleName);
          setExecutionType(type);
          setTimezone(getAMCTimezoneOption(executionData.scheduleTimezone));
          setScheduleFrequency(
            getAMCScheduleFrequencyOption(executionData.scheduleFrequency)
          );
          setScheduleDay(
            getAMCScheduleDayOption(executionData.scheduleStartDay)
          );
          setScheduleTime(getAMCScheduleTimeOption(executionData.scheduleTime));
          const adsTableData = getAdsTableData(executionData, campaigns);
          setIncludedCampaignTable(adsTableData);
          const dspTableData = getDSPTableData(executionData, campaigns);
          setIncludedCampaignTable((prev) => [...prev, ...dspTableData]);

          if (adsTableData.length > 0 || dspTableData.length > 0) {
            setSettingToggle(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [instanceId, executionId, type, campaigns]);

  return (
    <div className={styles.conversionContainer}>
      {(isGroupLoading === true ||
        isLoading === true ||
        isCampaignOptionsLoading === true) && <LoaderWrapper />}

      {isWorkflowLoading === true ||
      workflowData === null ||
      workflowData.queryId === null ||
      campaigns === null ? (
        <LoaderWrapper />
      ) : (
        <QueryExecutionForm
          workflowData={workflowData}
          handleExecute={handleExecute}
          handleCancel={handleCancel}
          campaignTypeOptions={campaignTypeOptions}
          onCampaignTypeChange={onCampaignTypeChange}
          campaignType={campaignType}
          campaignNameOptions={campaignNameOptions}
          onCampaignNameOptionChange={onCampaignNameOptionsChange}
          campaignGroupOptions={campaignGroupOptions}
          onCampaignGroupChange={onCampaignGroupChange}
          handleAddCampaigns={handleAddCampaigns}
          campaignGroup={campaignGroup}
          includedCampaignTable={includedCampaignTable}
          handleDeleteCampaign={handleDeleteCampaign}
          executionName={executionName}
          handleExecutionNameChange={handleExecutionNameChange}
          handleExecutionNameBlur={handleExecutionNameBlur}
          executionNameError={executionNameError}
          executionType={executionType}
          onExecutionTypeChange={onExecutionTypeChange}
          rangeOptions={rangeOptions}
          dateRange={dateRange}
          onRangeSelect={onRangeSelect}
          customDateRange={customDateRange}
          onFrequencyChange={onFrequencyChange}
          scheduleFrequency={scheduleFrequency}
          onDayChange={onDayChange}
          scheduleDay={scheduleDay}
          onTimeChange={onTimeChange}
          scheduleTime={scheduleTime}
          timezone={timezone}
          onTimezoneChange={onTimezoneChange}
          settingToggle={settingToggle}
          setSettingToggle={setSettingToggle}
          disableExecuteButton={
            executionNameError !== '' || !executionName || !executionType
          }
          previousRangeState={prevRange}
          showDateRangeModal={showDateRangeModal}
          setShowDateRangeModal={setShowDateRangeModal}
          handleSetCustomDateRangeForModal={handleSetCustomDateRangeForModal}
        />
      )}
    </div>
  );
}
