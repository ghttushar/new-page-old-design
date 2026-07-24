import { AD_TYPE_MAPPING } from '@/constants/advertising-filter.constants';
import { MultiSelectCustomOptions } from '@/constants/sov.filter.constants';
import { DAY_PARTING_PAGE_URL } from '@/constants/urls.constants';
import { AdType } from '@/enums/advertising.enums';
import { FeatureRoutes } from '@/enums/auth.enums';
import { DaypartingTabsEnum } from '@/enums/day-parting.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAdType } from '@/hooks/dayparting/use-ad-type.hook';
import { IMultiSelectCustomDropdownItem } from '@/interfaces/dropdown.interfaces';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import {
  resetDayPartingFilterStates,
  selectDayPartingAppliedFilters,
  setDayPartingAppliedFilters,
  setDayPartingCampaignOptions,
} from '@/redux/slices/day-parting/day-parting.slice';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import WalmartDayPartingService from '@/services/day-parting-wmt.service';
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
  isCampaignStatusEnabled,
} from 'src/utils/day-parting.utils';
import DayPartingSetupBase from '../../amazon/amz-day-parting-setup-page/day-parting-setup-page';

export default function WmtDayPartingCreateWrapper() {
  const { adType } = useParams<{ adType: string }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);

  useAdType(
    adType,
    getDayPartingRedirectUrlByTab(
      DaypartingTabsEnum.EDIT_PAGE,
      advertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
      adType ?? AdType.All
    ),
    advertisingAccount.marketplace ?? MarketplaceEnum.WALMART
  );
  const appliedFilters = useAppSelector(selectDayPartingAppliedFilters);
  const [wmtCampaigns, setWmtCampaigns] = useState<IDaypartingCampaignList[]>(
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
      return WalmartDayPartingService.upsertDayPartingJob({
        payload,
        campaignsToRemove,
      });
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

  const fetchWalmartDayPartingCampaigns = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_WALMART_DAYPARTING_CAMPAIGNS,
      advertisingAccount,
      adType,
    ],
    queryFn: ({ signal }) => {
      dispatch(resetDayPartingFilterStates());
      return WalmartDayPartingService.getWalmartCampaignData(signal, adType);
    },
    enabled: adType !== '',
  });

  useEffect(() => {
    if (fetchWalmartDayPartingCampaigns.isSuccess) {
      const campaigns = fetchWalmartDayPartingCampaigns.data.data.data;

      setWmtCampaigns(campaigns);
      const spCampaigns: IMultiSelectCustomDropdownItem[] = campaigns.map(
        (campaign) => ({
          label: campaign.campaignName,
          value: campaign.campaignId,
          selected: isCampaignStatusEnabled(
            campaign.status,
            MarketplaceEnum.WALMART
          ),
          isActive: isCampaignStatusEnabled(
            campaign.status,
            MarketplaceEnum.WALMART
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

      dispatch(
        setDayPartingAppliedFilters({
          ...appliedFilters,
          campaigns: campaignOptions,
        })
      );

      dispatch(setDayPartingCampaignOptions(campaignOptions));
    }
  }, [
    dispatch,
    fetchWalmartDayPartingCampaigns.data?.data.data,
    fetchWalmartDayPartingCampaigns.isSuccess,
  ]);

  const isLoading = useMemo(
    () =>
      fetchWalmartDayPartingCampaigns.isLoading ||
      fetchWalmartDayPartingCampaigns.isRefetching ||
      (isUpsertPending === true && isUpsertCampaignDayPartingJobIdle === false),
    [
      fetchWalmartDayPartingCampaigns.isLoading,
      fetchWalmartDayPartingCampaigns.isRefetching,
      isUpsertCampaignDayPartingJobIdle,
      isUpsertPending,
    ]
  );

  const handleEditRuleClick = (job: IWalmartDaypartingJob | IDaypartingJob) => {
    navigate(
      `${DAY_PARTING_PAGE_URL}/home/edit/${job._id}/${AD_TYPE_MAPPING[
        advHeaderFilters.adType.value
      ].toLowerCase()}`
    );
  };

  return (
    <DayPartingSetupBase
      daypartingCampaigns={wmtCampaigns}
      isLoading={isLoading}
      isEditMode={false}
      handleRule={handleCreateRule}
      handleEditRuleClick={handleEditRuleClick}
      marketplace={MarketplaceEnum.WALMART}
    />
  );
}
