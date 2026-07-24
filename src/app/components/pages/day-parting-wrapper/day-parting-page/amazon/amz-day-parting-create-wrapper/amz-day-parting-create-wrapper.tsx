import { AD_TYPE_MAPPING } from '@/constants/advertising-filter.constants';
import { MultiSelectCustomOptions } from '@/constants/sov.filter.constants';
import { DAY_PARTING_PAGE_URL } from '@/constants/urls.constants';
import { AdTypeShort } from '@/enums/advertising.enums';
import { FeatureRoutes } from '@/enums/auth.enums';
import { DaypartingTabsEnum } from '@/enums/day-parting.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAdType } from '@/hooks/dayparting/use-ad-type.hook';
import { IMultiSelectCustomDropdownItem } from '@/interfaces/dropdown.interfaces';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import {
  resetDayPartingFilterStates,
  selectDayPartingAppliedFilters,
  setDayPartingAppliedFilters,
  setDayPartingCampaignOptions,
} from '@/redux/slices/day-parting/day-parting.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import DayPartingService from '@/services/day-parting.service';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ICreateJobBody,
  IDaypartingCampaignList,
  IDaypartingJob,
  IWalmartDaypartingJob,
} from 'src/interfaces/day-parting.interfaces';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  getDayPartingRedirectUrlByTab,
  isCampaignStatusEnabled,
} from 'src/utils/day-parting.utils';
import DayPartingSetupBase from '../amz-day-parting-setup-page/day-parting-setup-page';

export default function AmzDayPartingCreateWrapper() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const appliedFilters = useAppSelector(selectDayPartingAppliedFilters);

  useAdType(
    AdTypeShort.SPONSORED_PRODUCTS,
    getDayPartingRedirectUrlByTab(
      DaypartingTabsEnum.DAYPARTING_SETUP,
      advertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
      AdTypeShort.SPONSORED_PRODUCTS
    ),
    advertisingAccount.marketplace ?? MarketplaceEnum.AMAZON
  );

  const [amzCampaigns, setAmzCampaigns] = useState<IDaypartingCampaignList[]>(
    []
  );

  const {
    mutateAsync: upsertCampaignDayPartingJob,
    isPending: isUpsertPending,
    isIdle: isUpsertCampaignDayPartingJobIdle,
  } = useAppMutation({
    mutationFn: ({
      payload,
      campaignsToRemove,
    }: {
      payload: ICreateJobBody;
      campaignsToRemove: string[];
    }) => {
      return DayPartingService.upsertJob({
        payload,
        campaignsToRemove,
      });
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
            title: 'Job Created Successfully',
            description: data.data.description,
          })
        );
      },
    },
  });

  const handleCreateRule = async (
    payload: ICreateJobBody,
    campaignsToRemove: string[] = []
  ) => {
    await upsertCampaignDayPartingJob({ payload, campaignsToRemove });
  };

  const fetchDayPartingCampaigns = useAppQuery({
    queryKey: [QueryKeyEnums.DAYPARTING_CAMPAIGNS_LIST, advertisingAccount],
    queryFn: ({ signal }) => {
      dispatch(resetDayPartingFilterStates());
      return DayPartingService.getCampaignData(signal);
    },
  });

  useEffect(() => {
    if (fetchDayPartingCampaigns.isSuccess) {
      const campaigns = fetchDayPartingCampaigns.data.data.data;

      setAmzCampaigns(campaigns);
      const spCampaigns: IMultiSelectCustomDropdownItem[] = campaigns.map(
        (campaign) => ({
          label: campaign.campaignName,
          value: campaign.campaignId,
          selected: isCampaignStatusEnabled(
            campaign.status,
            MarketplaceEnum.AMAZON
          ),
          isActive: isCampaignStatusEnabled(
            campaign.status,
            MarketplaceEnum.AMAZON
          ),
          isDayParting: campaign.isPartOfDayparting,
        })
      );

      const campaignOptions: IMultiSelectCustomDropdownItem[] = [
        {
          ...MultiSelectCustomOptions[0],
        },
        ...spCampaigns,
      ];

      dispatch(setDayPartingCampaignOptions(campaignOptions));
      dispatch(
        setDayPartingAppliedFilters({
          ...appliedFilters,
          campaigns: campaignOptions,
        })
      );
    }
  }, [
    dispatch,
    fetchDayPartingCampaigns.data?.data.data,
    fetchDayPartingCampaigns.isSuccess,
  ]);

  const isLoading = useMemo(
    () =>
      fetchDayPartingCampaigns.isLoading ||
      fetchDayPartingCampaigns.isRefetching ||
      (isUpsertPending === true && isUpsertCampaignDayPartingJobIdle === false),
    [
      fetchDayPartingCampaigns.isLoading,
      fetchDayPartingCampaigns.isRefetching,
      isUpsertCampaignDayPartingJobIdle,
      isUpsertPending,
    ]
  );

  const handleEditRuleClick = (job: IWalmartDaypartingJob | IDaypartingJob) => {
    navigate(
      `${DAY_PARTING_PAGE_URL}/home/edit/${job._id}/${AD_TYPE_MAPPING[
        AdTypeShort.SPONSORED_PRODUCTS
      ].toLowerCase()}`
    );
  };

  return (
    <DayPartingSetupBase
      daypartingCampaigns={amzCampaigns}
      isLoading={isLoading}
      isEditMode={false}
      handleRule={handleCreateRule}
      handleEditRuleClick={handleEditRuleClick}
      marketplace={MarketplaceEnum.AMAZON}
    />
  );
}
