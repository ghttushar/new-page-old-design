import { AD_TYPE_MAPPING } from '@/constants/advertising-filter.constants';
import { DATE_FORMAT_3 } from '@/constants/datetime.constants';
import { MultiSelectCustomOptions } from '@/constants/sov.filter.constants';
import { DAY_PARTING_PAGE_URL } from '@/constants/urls.constants';
import { AdTypeShort } from '@/enums/advertising.enums';
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
  setIsFormOpen,
  setNewBid,
  setRecurrenceType,
  setRuleName,
  setSelectedAdjustment,
  setStartDate,
  setTimeRanges,
  setWeekDays,
} from '@/redux/slices/day-parting/day-parting.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import DayPartingService from '@/services/day-parting.service';
import { getSortedCampaignList } from '@/utils/advertising.utils';
import {
  convertUtcToTimezoneDate,
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
import DayPartingSetupBase from '../amz-day-parting-setup-page/day-parting-setup-page';

export default function AmzDayPartingEditWrapper() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { jobId } = useParams<{ jobId: string }>();

  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const appliedFilters = useAppSelector(selectDayPartingAppliedFilters);
  const options = useAppSelector(selectDayPartingOptions);

  useAdType(
    AdTypeShort.SPONSORED_PRODUCTS,
    getDayPartingRedirectUrlByTab(
      DaypartingTabsEnum.DAYPARTING_SETUP,
      advertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
      AdTypeShort.SPONSORED_PRODUCTS
    ),
    advertisingAccount.marketplace ?? MarketplaceEnum.AMAZON
  );

  const [wmtCampaigns, setWmtCampaigns] = useState<IDaypartingCampaignList[]>(
    []
  );
  const [isEdit, setIsEdit] = useState(true);

  const toggleEdit = () => {
    setIsEdit(!isEdit);
  };

  const {
    mutateAsync: updateCampaignDayPartingJob,
    isPending: isUpdatePending,
    isIdle: isUpdateCampaignDayPartingJobIdle,
  } = useAppMutation({
    mutationFn: (payload: ICreateJobBody) => {
      return DayPartingService.updateJobById(jobId ?? '', payload);
    },
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.DAYPARTING_CAMPAIGNS_LIST],
        });

        navigate(
          `${DAY_PARTING_PAGE_URL}/home/${FeatureRoutes.DAYPARTING_CAMPAIGNS}/${MarketplaceEnum.AMAZON}`
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

  const fetchDayPartingCampaigns = useAppQuery({
    queryKey: [QueryKeyEnums.DAYPARTING_CAMPAIGNS_LIST, { advertisingAccount }],
    queryFn: ({ signal }) => {
      dispatch(resetDayPartingFilterStates());
      return DayPartingService.getCampaignData(signal);
    },
    options: {
      refetchOnMount: 'always',
      staleTime: 0,
    },
  });

  useEffect(() => {
    dispatch(setIsFormOpen(true));
    document.getElementById('day-parting-form')?.scrollIntoView({
      behavior: 'smooth',
    });
    if (fetchDayPartingCampaigns.isSuccess) {
      const campaigns = fetchDayPartingCampaigns.data.data.data;

      setWmtCampaigns(campaigns);
      const spCampaigns: IMultiSelectCustomDropdownItem[] = campaigns.map(
        (campaign) => ({
          label: campaign.campaignName,
          value: campaign.campaignId,
          selected: false,
          isActive: isCampaignStatusEnabled(
            campaign.status,
            MarketplaceEnum.AMAZON
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
    fetchDayPartingCampaigns.data?.data.data,
    fetchDayPartingCampaigns.isSuccess,
  ]);

  const fetchJobByJobId = useAppQuery({
    queryFn: () => DayPartingService.getJobById(jobId ?? ''),
    queryKey: [QueryKeyEnums.FETCH_AMZ_DAYPARTING_JOB_BY_ID, jobId],
    enabled: Boolean(
      jobId &&
        fetchDayPartingCampaigns.isSuccess &&
        !fetchDayPartingCampaigns.isFetching &&
        fetchDayPartingCampaigns.data?.data.data
    ),
    options: {
      refetchOnMount: 'always',
      staleTime: 0,
    },
  });

  useEffect(() => {
    if (fetchJobByJobId.isSuccess && fetchJobByJobId.data?.data?.data) {
      const jobData = fetchJobByJobId.data.data.data;

      const camp = jobData.campaigns;

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
      handleEditRuleClick(jobData as IDaypartingJob);
    }
  }, [fetchJobByJobId.isSuccess, fetchJobByJobId.data?.data?.data]);

  const isLoading = useMemo(
    () =>
      fetchDayPartingCampaigns.isRefetching ||
      fetchDayPartingCampaigns.isLoading ||
      fetchJobByJobId.isLoading ||
      fetchJobByJobId.isRefetching ||
      (isUpdatePending === true && isUpdateCampaignDayPartingJobIdle === false),
    [
      fetchDayPartingCampaigns.isRefetching,
      fetchDayPartingCampaigns.isLoading,
      fetchJobByJobId.isLoading,
      fetchJobByJobId.isRefetching,
      isUpdatePending,
      isUpdateCampaignDayPartingJobIdle,
    ]
  );
  const handleEditRuleClick = (job: IWalmartDaypartingJob | IDaypartingJob) => {
    navigate(
      `${DAY_PARTING_PAGE_URL}/home/edit/${job._id}/${AD_TYPE_MAPPING[
        AdTypeShort.SPONSORED_PRODUCTS
      ].toLowerCase()}`
    );
    setIsEdit(true);
    if (job.startDate)
      dispatch(
        setStartDate(convertUtcToTimezoneDate(job.startDate, DATE_FORMAT_3))
      );

    if (job.endDate)
      dispatch(
        setEndDate(convertUtcToTimezoneDate(job.endDate, DATE_FORMAT_3))
      );
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
    }
    dispatch(
      setDaypartingPayload({
        bidChange: job.bidChange,
        title: job.title,
        campaigns: getSortedCampaignList([...job.campaigns]),
        recurrence: job.recurrence,
        startDate: convertUtcToTimezoneDate(
          job.startDate !== ''
            ? job.startDate
            : getTodayByTimeZone().toDateString(),
          DATE_FORMAT_3
        ),
        endDate: convertUtcToTimezoneDate(
          job.endDate !== ''
            ? job.endDate
            : getTodayByTimeZone().toDateString(),
          DATE_FORMAT_3
        ),
        timeZone: job.timeZone,
        schedules: job.schedules,
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
      marketplace={MarketplaceEnum.AMAZON}
    />
  );
}
