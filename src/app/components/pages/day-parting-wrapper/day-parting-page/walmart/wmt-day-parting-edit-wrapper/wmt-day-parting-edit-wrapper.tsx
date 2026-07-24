import { AD_TYPE_MAPPING } from '@/constants/advertising-filter.constants';
import { DATE_FORMAT_3 } from '@/constants/datetime.constants';
import { MultiSelectCustomOptions } from '@/constants/sov.filter.constants';
import { DAY_PARTING_PAGE_URL } from '@/constants/urls.constants';
import { AdType, AdTypeShort } from '@/enums/advertising.enums';
import { FeatureRoutes } from '@/enums/auth.enums';
import {
  DaypartingRecurrenceTypeEnum,
  DaypartingTabsEnum,
} from '@/enums/day-parting.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAdType } from '@/hooks/dayparting/use-ad-type.hook';
import { IMultiSelectCustomDropdownItem } from '@/interfaces/dropdown.interfaces';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import {
  resetDayPartingFilterStates,
  selectDayPartingAppliedFilters,
  selectDayPartingOptions,
  setDayPartingAppliedFilters,
  setDayPartingCampaignOptions,
  setDaypartingPayload,
  setEndDate,
  setHourOfDayType,
  setIsRunDisabled,
  setNewBid,
  setRecurrenceType,
  setRuleName,
  setSelectedAdjustment,
  setStartDate,
  setTimeRanges,
  setWeekDays,
} from '@/redux/slices/day-parting/day-parting.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import WalmartDayPartingService from '@/services/day-parting-wmt.service';
import { getSortedCampaignList } from '@/utils/advertising.utils';
import {
  getFormattedDateWithFormat,
  getTodayByTimeZone,
} from '@/utils/datetime.utils';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ICreateJobBody,
  IDaypartingCampaignList,
  IDaypartingJob,
  IWalmartDaypartingJob,
} from 'src/interfaces/day-parting.interfaces';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  getDayPartingRedirectUrlByTab,
  getSelectedDaypartingAdjustmentOptions,
  getSelectedDaypartingRecurrenceDayOptions,
  getSelectedDaypartingTimeRangesOptions,
  isCampaignStatusEnabled,
} from 'src/utils/day-parting.utils';
import DayPartingSetupBase from '../../amazon/amz-day-parting-setup-page/day-parting-setup-page';

export default function WmtDayPartingEditWrapper() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { jobId, adType } = useParams<{ jobId: string; adType: string }>();

  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const appliedFilters = useAppSelector(selectDayPartingAppliedFilters);

  const options = useAppSelector(selectDayPartingOptions);

  const [wmtCampaigns, setWmtCampaigns] = useState<IDaypartingCampaignList[]>(
    []
  );
  const [isEdit, setIsEdit] = useState(true);

  useAdType(
    adType,
    getDayPartingRedirectUrlByTab(
      DaypartingTabsEnum.EDIT_PAGE,
      advertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
      adType ?? AdType.All
    ),
    advertisingAccount.marketplace ?? MarketplaceEnum.WALMART
  );

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const {
    mutateAsync: updateCampaignDayPartingJob,
    isPending: isUpdatePending,
    isIdle: isUpdateCampaignDayPartingJobIdle,
  } = useAppMutation({
    mutationFn: (payload: ICreateJobBody) => {
      return WalmartDayPartingService.updateDayPartingJob(jobId ?? '', payload);
    },
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.FETCH_WALMART_DAYPARTING_CAMPAIGNS],
        });

        navigate(
          `${DAY_PARTING_PAGE_URL}/home/${FeatureRoutes.DAYPARTING_CAMPAIGNS}/${MarketplaceEnum.WALMART}`
        );

        dispatch(
          showSuccessToastMessage({
            title: data.data.message,
            description: data.data.description,
          })
        );
      },
    },
  });

  const fetchWalmartDayPartingCampaigns = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_WALMART_DAYPARTING_CAMPAIGNS,
      {
        advertisingAccount,
      },
    ],
    queryFn: ({ signal }) => {
      dispatch(resetDayPartingFilterStates());
      return WalmartDayPartingService.getWalmartCampaignData(signal, adType);
    },
    enabled: adType !== '',
    options: {
      refetchOnMount: 'always',
      staleTime: 0,
    },
  });

  const fetchJobByJobId = useAppQuery({
    queryFn: () =>
      WalmartDayPartingService.getWalmartDaypartingJobByJobID(jobId ?? ''),
    queryKey: [QueryKeyEnums.FETCH_WMT_DAYPARTING_JOB_BY_ID, jobId],
    enabled: Boolean(
      jobId &&
        fetchWalmartDayPartingCampaigns.isSuccess &&
        !fetchWalmartDayPartingCampaigns.isFetching &&
        fetchWalmartDayPartingCampaigns.data?.data.data
    ),
    options: {
      refetchOnMount: 'always',
      staleTime: 0,
    },
  });

  useEffect(() => {
    if (fetchWalmartDayPartingCampaigns.isSuccess) {
      const campaigns = fetchWalmartDayPartingCampaigns.data.data.data;

      setWmtCampaigns(campaigns);
      const spCampaigns: IMultiSelectCustomDropdownItem[] = campaigns.map(
        (campaign) => ({
          label: campaign.campaignName,
          value: campaign.campaignId,
          selected: false,
          isActive: isCampaignStatusEnabled(
            campaign.status,
            MarketplaceEnum.WALMART
          ),
          isDayParting: campaign.isPartOfDayparting,
        })
      );

      const campaignOptions: IMultiSelectCustomDropdownItem[] = [
        {
          label: MultiSelectCustomOptions[0].label,
          value: MultiSelectCustomOptions[0].value,
          selected: false,
          isActive: false,
          isDayParting: false,
        },
        ...spCampaigns,
      ];
      dispatch(setDayPartingCampaignOptions(campaignOptions));
    }
  }, [
    fetchWalmartDayPartingCampaigns.data?.data.data,
    fetchWalmartDayPartingCampaigns.isSuccess,
  ]);

  useEffect(() => {
    if (fetchJobByJobId.isSuccess && fetchJobByJobId.data?.data?.data) {
      const jobData = fetchJobByJobId.data.data.data;
      const camp = jobData.campaigns;
      const jobAdType = jobData.adType ?? AdTypeShort.All;

      if (
        AD_TYPE_MAPPING[jobAdType.toUpperCase()].toUpperCase() !==
        adType?.toUpperCase()
      ) {
        navigate(
          `${DAY_PARTING_PAGE_URL}/home/${MarketplaceEnum.WALMART}/${AdTypeShort.All}`
        );
        return;
      }
      if (options.campaigns.length > 0) {
        const availableCamp = options.campaigns.map((item) => ({
          ...item,
          selected: camp.includes(item.value),
        }));

        dispatch(setDayPartingCampaignOptions(availableCamp));
        dispatch(
          setDayPartingAppliedFilters({
            ...appliedFilters,
            campaigns: availableCamp,
          })
        );
        handleEditRuleClick(jobData);
      }
    }
  }, [fetchJobByJobId.isSuccess, fetchJobByJobId.data?.data.data, dispatch]);

  const isLoading = useMemo(
    () =>
      fetchWalmartDayPartingCampaigns.isRefetching ||
      fetchWalmartDayPartingCampaigns.isLoading ||
      fetchJobByJobId.isLoading ||
      fetchJobByJobId.isRefetching ||
      (isUpdatePending === true && isUpdateCampaignDayPartingJobIdle === false),
    [
      fetchWalmartDayPartingCampaigns.isRefetching,
      fetchWalmartDayPartingCampaigns.isLoading,
      fetchJobByJobId.isLoading,
      fetchJobByJobId.isRefetching,
      isUpdatePending,
      isUpdateCampaignDayPartingJobIdle,
    ]
  );

  const handleEditRuleClick = (job: IWalmartDaypartingJob | IDaypartingJob) => {
    navigate(`${DAY_PARTING_PAGE_URL}/home/edit/${job._id}/${adType}`);
    setIsEdit(true);

    if (job.startDate) dispatch(setStartDate(job.startDate));
    if (job.endDate) dispatch(setEndDate(job.endDate));
    if (job.title) dispatch(setRuleName(job.title));

    if (job.recurrence) {
      if (job.recurrence.type) dispatch(setRecurrenceType(job.recurrence.type));

      if (
        job.recurrence.type &&
        job.recurrence.type === DaypartingRecurrenceTypeEnum.WEEKLY &&
        job.recurrence.days
      )
        dispatch(
          setWeekDays(
            getSelectedDaypartingRecurrenceDayOptions(job.recurrence.days)
          )
        );
    }

    if (job.schedules) {
      if (job.schedules.type) dispatch(setHourOfDayType(job.schedules.type));

      if (job.schedules.timeRanges)
        dispatch(
          setTimeRanges(
            getSelectedDaypartingTimeRangesOptions(job.schedules.timeRanges)
          )
        );
    }

    if (job.bidChange) {
      if (job.bidChange.type)
        dispatch(
          setSelectedAdjustment(
            getSelectedDaypartingAdjustmentOptions(job.bidChange.type)
          )
        );

      if (job.bidChange.percentage) {
        dispatch(setNewBid(job.bidChange.percentage));
      }
      dispatch(setIsRunDisabled(true));
    }

    dispatch(
      setDaypartingPayload({
        bidChange: job.bidChange,
        title: job.title,
        campaigns: getSortedCampaignList([...job.campaigns]),
        recurrence: job.recurrence,
        startDate: getFormattedDateWithFormat(
          job.startDate !== ''
            ? job.startDate
            : getTodayByTimeZone().toDateString(),
          DATE_FORMAT_3
        ),
        endDate: getFormattedDateWithFormat(
          job.endDate !== ''
            ? job.endDate
            : getTodayByTimeZone().toDateString(),
          DATE_FORMAT_3
        ),
        timeZone: job.timeZone,
        schedules: job.schedules,
        adType: job.adType,
      })
    );
  };

  const handleRuleWrapper = async (payload: ICreateJobBody) => {
    await updateCampaignDayPartingJob(payload);
  };
  return (
    <DayPartingSetupBase
      daypartingCampaigns={wmtCampaigns}
      isLoading={isLoading}
      isEditMode={true}
      selectedJobId={jobId}
      handleRule={handleRuleWrapper}
      handleEditRuleClick={handleEditRuleClick}
      toggleEdit={toggleEdit}
      marketplace={MarketplaceEnum.WALMART}
    />
  );
}
