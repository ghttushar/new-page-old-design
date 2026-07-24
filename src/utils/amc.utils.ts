import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import { IThreadData } from 'src/app/components/pages/amc-page/amc-report-page/amc-report-page';
import {
  amcScheduleFrequency,
  amcTimezones,
  dspGroups,
  executionCategoryOptions,
  executionDaysOptions,
  executionTimeOptions,
  ptcIdentifier,
  sbGroups,
  sdGroups,
  spGroups,
} from 'src/constants/amc.constants';
import {
  AMCCampaignGroupTypes,
  AMCCampaignTypes,
  AMCExecutionDays,
  AMCExecutionTime,
  AMCQueryExecutionType,
  AMCScheduleFrequency,
} from 'src/enums/amc.enums';
import {
  IAMCIncludedCampaignsTable,
  IAMCInstance,
  IAMCQueryExecutionCampaigns,
  IAMCScheduleData,
  IAMCWorkflowExecution,
  IAllCampaignData,
  IPrompt,
  IThreadMessage,
} from 'src/interfaces/amc.interfaces';
import localStorageUtils from './local-storage/local-storage.utils';

export const checkIsTagPresent = (tagsArr: string[], tag: string) => {
  const _tagsArr = tagsArr.map((tag) => tag.toLowerCase());

  return _tagsArr.includes(tag.toLowerCase());
};

export const genInstanceOptions = (instanceList: IAMCInstance[]) => {
  return instanceList.map<IDropdownItem<string>>((instance) => {
    return {
      value: instance.instanceId,
      label: instance.instanceName,
      selected: instance.isPrimary,
    };
  });
};

export const appendGPTPrompt = (
  prompt: string,
  conversations: IThreadMessage[],
  threadData: IThreadData,
  assistantId: string
) => {
  return [
    ...conversations,
    {
      id: `${conversations.length + 1}`,
      object: 'thread.message',
      created_at: getUNIXTimestamp(),
      thread_id: threadData.threadId,
      role: 'user',
      content: [
        {
          type: 'text',
          text: {
            value: prompt,
            annotations: [],
          },
        },
      ],
      file_ids: [threadData.fileId],
      assistant_id: assistantId,
      run_id: '',
      metadata: {},
    },
  ];
};

export const getUNIXTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

export const getPromptByTitle = (title: string, builtInPrompts: IPrompt[]) => {
  const _title = title.toLowerCase();
  return builtInPrompts.find((prompt) => prompt.title.toLowerCase() === _title);
};

export const getPromptByDescription = (
  description: string,
  builtInPrompts: IPrompt[]
) => {
  const _description = description.toLowerCase();
  return builtInPrompts.find(
    (prompt) => prompt.description.toLowerCase() === _description
  );
};

export const replaceGPTResponseToBuiltInPrompt = (
  response: IThreadMessage[],
  builtInPrompts: IPrompt[]
) => {
  const updatedResponse = response.map((message) => {
    const prompt = getPromptByDescription(
      message.content[0].text.value,
      builtInPrompts
    );
    if (prompt) {
      return {
        ...message,
        content: [
          {
            ...message.content[0],
            text: {
              ...message.content[0].text,
              value: prompt.title,
            },
          },
        ],
      };
    }
    return message;
  });

  return updatedResponse;
};

export const getQueryName = (id: string) => {
  const idValues = id.split('_');
  const isAnarix = idValues[0] === 'anarix';
  const queryName = idValues
    .slice(isAnarix ? 1 : 0, idValues.length - 1)
    .map((value) => {
      return `${value[0].toUpperCase()}${value.slice(1)}`;
    })
    .join(' ');

  return queryName;
};

export const getExecutionCategory = (value: string) => {
  const executionCategory = executionCategoryOptions.filter(
    (option) => option.value === value
  )[0];
  return executionCategory;
};

export const isPTC = (workflowId: string) =>
  workflowId.toLowerCase().includes(ptcIdentifier.toLowerCase());

export const getSponsoredAdsCampaignNames = (
  includedCampaigns: IAMCIncludedCampaignsTable[],
  isPTCQuery: boolean
) => {
  const campaigns = includedCampaigns
    .filter((campaign) => campaign.campaignType.value !== AMCCampaignTypes.DSP)
    .map((campaign) => campaign.campaignName.label.toString());
  return isPTCQuery ? undefined : campaigns;
};

export const getDspCampaignIds = (
  includedCampaigns: IAMCIncludedCampaignsTable[]
) => {
  return includedCampaigns
    .filter(
      (campaign) =>
        campaign.campaignType.value === AMCCampaignTypes.DSP &&
        campaign.campaignGroup.value === AMCCampaignGroupTypes.DSP
    )
    .map((campaign) => campaign.campaignName.value.toString());
};

export const getSpCampaignIds = (
  includedCampaigns: IAMCIncludedCampaignsTable[],
  isPTCQuery: boolean
) => {
  const campaigns = includedCampaigns
    .filter(
      (campaign) => campaign.campaignGroup.value === AMCCampaignGroupTypes.SP
    )
    .map((campaign) => campaign.campaignName.value.toString());
  return isPTCQuery ? campaigns : [];
};

export const getSbCampaignIds = (
  includedCampaigns: IAMCIncludedCampaignsTable[],
  isPTCQuery: boolean
) => {
  const campaigns = includedCampaigns
    .filter(
      (campaign) => campaign.campaignGroup.value === AMCCampaignGroupTypes.SB
    )
    .map((campaign) => campaign.campaignName.value.toString());

  return isPTCQuery ? campaigns : [];
};

export const getSdCampaignIds = (
  includedCampaigns: IAMCIncludedCampaignsTable[],
  isPTCQuery: boolean
) => {
  const campaigns = includedCampaigns
    .filter(
      (campaign) => campaign.campaignGroup.value === AMCCampaignGroupTypes.SD
    )
    .map((campaign) => campaign.campaignName.value.toString());
  return isPTCQuery ? campaigns : [];
};

export const getOlvCampaignIds = (
  includedCampaigns: IAMCIncludedCampaignsTable[],
  isPTCQuery: boolean
) => {
  const campaigns = includedCampaigns
    .filter(
      (campaign) =>
        campaign.campaignType.value === AMCCampaignTypes.DSP &&
        campaign.campaignGroup.value === AMCCampaignGroupTypes.OLV
    )
    .map((campaign) => campaign.campaignName.value.toString());
  return isPTCQuery ? campaigns : [];
};

export const getStvCampaignIds = (
  includedCampaigns: IAMCIncludedCampaignsTable[],
  isPTCQuery: boolean
) => {
  const campaigns = includedCampaigns
    .filter(
      (campaign) =>
        campaign.campaignType.value === AMCCampaignTypes.DSP &&
        campaign.campaignGroup.value === AMCCampaignGroupTypes.STV
    )
    .map((campaign) => campaign.campaignName.value.toString());
  return isPTCQuery ? campaigns : [];
};

export const getFormattedCampaignsForQueryExecution = (
  includedCampaigns: IAMCIncludedCampaignsTable[],
  isPTCQuery: boolean
): IAMCQueryExecutionCampaigns => {
  return {
    sponsoredAdsCampaignNames: getSponsoredAdsCampaignNames(
      includedCampaigns,
      isPTCQuery
    ),
    dspCampaignIds: getDspCampaignIds(includedCampaigns),
    stvCampaignIds: getStvCampaignIds(includedCampaigns, isPTCQuery),
    olvCampaignIds: getOlvCampaignIds(includedCampaigns, isPTCQuery),
    spCampaignIds: getSpCampaignIds(includedCampaigns, isPTCQuery),
    sbCampaignIds: getSbCampaignIds(includedCampaigns, isPTCQuery),
    sdCampaignIds: getSdCampaignIds(includedCampaigns, isPTCQuery),
  };
};

export const getAdsTableData = (
  execution: IAMCWorkflowExecution | IAMCScheduleData,
  campaigns: IAllCampaignData | null
): IAMCIncludedCampaignsTable[] => {
  const includedCampaigns: IAMCIncludedCampaignsTable[] = [];
  execution.sponsoredAdsCampaignNames?.forEach((item) => {
    campaigns?.SP.forEach((campaign) => {
      if (campaign.campaignName === item) {
        includedCampaigns.push({
          id: parseInt(campaign.campaignId),
          campaignType: {
            label: AMCCampaignTypes.SP,
            value: AMCCampaignTypes.SP,
          },
          campaignGroup: {
            label: spGroups[0].label,
            value: spGroups[0].value,
          },
          campaignName: {
            label: campaign.campaignName,
            value: campaign.campaignId.toString(),
          },
        });
      }
    });
  });
  execution.sbCampaignIds?.forEach((item) => {
    campaigns?.SB.forEach((campaign) => {
      if (campaign.campaignId.toString() === item) {
        includedCampaigns.push({
          id: parseInt(campaign.campaignId),
          campaignType: {
            label: AMCCampaignTypes.SB,
            value: AMCCampaignTypes.SB,
          },
          campaignGroup: {
            label: sbGroups[0].label,
            value: sbGroups[0].value,
          },
          campaignName: {
            label: campaign.campaignName,
            value: campaign.campaignId.toString(),
          },
        });
      }
    });
  });
  execution.sdCampaignIds?.forEach((item) => {
    campaigns?.SD.forEach((campaign) => {
      if (campaign.campaignId.toString() === item) {
        includedCampaigns.push({
          id: parseInt(campaign.campaignId),
          campaignType: {
            label: AMCCampaignTypes.SD,
            value: AMCCampaignTypes.SD,
          },
          campaignGroup: {
            label: sdGroups[0].label,
            value: sdGroups[0].value,
          },
          campaignName: {
            label: campaign.campaignName,
            value: campaign.campaignId.toString(),
          },
        });
      }
    });
  });
  execution.spCampaignIds?.forEach((item) => {
    campaigns?.SP.forEach((campaign) => {
      if (campaign.campaignId.toString() === item) {
        includedCampaigns.push({
          id: parseInt(campaign.campaignId),
          campaignType: {
            label: AMCCampaignTypes.SP,
            value: AMCCampaignTypes.SP,
          },
          campaignGroup: {
            label: spGroups[0].label,
            value: spGroups[0].value,
          },
          campaignName: {
            label: campaign.campaignName,
            value: campaign.campaignId.toString(),
          },
        });
      }
    });
  });

  return includedCampaigns;
};

export const getDSPTableData = (
  execution: IAMCWorkflowExecution | IAMCScheduleData,
  campaigns: IAllCampaignData | null
): IAMCIncludedCampaignsTable[] => {
  const includedDSPCampaigns: IAMCIncludedCampaignsTable[] = [];
  execution.dspCampaignIds?.forEach((item) => {
    campaigns?.DSP.forEach((campaign) => {
      if (campaign.campaignId.toString() === item) {
        includedDSPCampaigns.push({
          id: parseInt(campaign.campaignId),
          campaignType: {
            label: AMCCampaignTypes.DSP,
            value: AMCCampaignTypes.DSP,
          },
          campaignGroup: {
            label: dspGroups[0].label,
            value: dspGroups[0].value,
          },
          campaignName: {
            label: campaign.campaignName,
            value: campaign.campaignId.toString(),
          },
        });
      }
    });
  });
  execution.olvCampaignIds?.forEach((item) => {
    campaigns?.DSP.forEach((campaign) => {
      if (campaign.campaignId.toString() === item) {
        includedDSPCampaigns.push({
          id: parseInt(campaign.campaignId),
          campaignType: {
            label: AMCCampaignTypes.DSP,
            value: AMCCampaignTypes.DSP,
          },
          campaignGroup: {
            label: dspGroups[1].label,
            value: dspGroups[1].value,
          },
          campaignName: {
            label: campaign.campaignName,
            value: campaign.campaignId.toString(),
          },
        });
      }
    });
  });
  execution.stvCampaignIds?.forEach((item) => {
    campaigns?.DSP.forEach((campaign) => {
      if (campaign.campaignId.toString() === item) {
        includedDSPCampaigns.push({
          id: parseInt(campaign.campaignId),
          campaignType: {
            label: AMCCampaignTypes.DSP,
            value: AMCCampaignTypes.DSP,
          },
          campaignGroup: {
            label: dspGroups[2].label,
            value: dspGroups[2].value,
          },
          campaignName: {
            label: campaign.campaignName,
            value: campaign.campaignId.toString(),
          },
        });
      }
    });
  });

  return includedDSPCampaigns;
};

export const navigateToQueryExecutionPage = (
  executionId: string,
  workflowId: string,
  executionType: AMCQueryExecutionType
) => {
  const selectedInstance = localStorageUtils.getSelectedAMCInstance()?.value;
  const url = `amc/query-execution/instance/${selectedInstance}/workflow/${workflowId}?executionId=${executionId}&executionType=${executionType}`;
  window.open(url, '_blank');
};

export const getAMCTimezoneOption = (
  timezone: string
): IDropdownItem<string> => {
  const selectedTimezone = amcTimezones.filter(
    (amcTimezone) => amcTimezone.value === timezone
  );
  return selectedTimezone.length > 0 ? selectedTimezone[0] : amcTimezones[0];
};

export const getAMCScheduleFrequencyOption = (
  scheduleFrequency: string
): IDropdownItem<AMCScheduleFrequency> => {
  const selectedFrequency = amcScheduleFrequency.filter(
    (frequency) => frequency.value === scheduleFrequency
  );
  return selectedFrequency.length > 0
    ? selectedFrequency[0]
    : amcScheduleFrequency[0];
};

export const getAMCScheduleDayOption = (
  scheduleDay: string | undefined
): IDropdownItem<AMCExecutionDays> => {
  const selectedDay = executionDaysOptions.filter(
    (day) => day.value === scheduleDay
  );
  return selectedDay.length > 0 ? selectedDay[0] : executionDaysOptions[0];
};

export const getAMCScheduleTimeOption = (
  scheduleTime: number
): IDropdownItem<AMCExecutionTime> => {
  const selectedTime = executionTimeOptions.filter(
    (time) => time.value === scheduleTime
  );
  return selectedTime.length > 0 ? selectedTime[0] : executionTimeOptions[0];
};
