import { AdType } from '@/enums/advertising.enums';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { useEffect, useMemo, useState } from 'react';
import { ADVERTISING_ACCOUNT_URL } from 'src/constants/urls.constants';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingHeaderFilters } from 'src/redux/slices/advertising/advertising-filter.slice';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  getAdGroupUrl,
  getAdTypePath,
  getAdvertisingUrl,
  getCampaignUrl,
  getCurrentAdType,
  getMarketplacePath,
} from 'src/utils/advertising.utils';
import BreadCrumbItem from './breadcrumb-item';

export interface IPathItem {
  label: string;
  link: string;
}

interface ICustomBreadcrumbsProps {
  campaignId: number | string;
  campaignName: string;
  adGroupId?: number | string;
  adgroupName?: string;
}

const CustomBreadcrumbs: React.FC<ICustomBreadcrumbsProps> = ({
  campaignId,
  campaignName,
  adGroupId,
  adgroupName,
}) => {
  const [paths, setPaths] = useState<IPathItem[]>([]);
  const advHeaderFilters = useAppSelector(selectAdvertisingHeaderFilters);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const selectedMarketplace = useMemo(
    () => advertisingAccount.marketplace as string,
    [advertisingAccount.marketplace]
  );

  useEffect(() => {
    if (campaignId && campaignName) {
      const _paths: IPathItem[] = [
        {
          label: 'Advertising',
          link: ADVERTISING_ACCOUNT_URL,
        },
        {
          label: getCurrentAdType(advHeaderFilters.adType.value),
          link: getAdvertisingUrl(
            getMarketplacePath(selectedMarketplace),
            getAdTypePath(advHeaderFilters.adType.value)
          ),
        },
      ];

      _paths.push({
        label: campaignName,
        link: getCampaignUrl(
          campaignId,
          getAdTypePath(advHeaderFilters.adType.value),
          getMarketplacePath(selectedMarketplace)
        ),
      });

      if (adGroupId && adgroupName) {
        _paths.push({
          label: adgroupName,
          link: getAdGroupUrl(
            campaignId,
            adGroupId,
            getAdTypePath(advHeaderFilters.adType.value),
            getMarketplacePath(selectedMarketplace)
          ),
        });
      }
      setPaths(_paths);
    }
  }, [
    campaignId,
    campaignName,
    adGroupId,
    adgroupName,
    advHeaderFilters.adType.value,
    selectedMarketplace,
  ]);

  if (
    !(
      advHeaderFilters.adType.value === AdType.All ||
      advHeaderFilters.adType.value === AdType.NONE
    ) &&
    paths.length > 0
  )
    return (
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="large" sx={{ mx: '-1rem' }} />}
        aria-label="breadcrumb"
        sx={{ marginBottom: '1rem' }}
      >
        {paths.map((path, index) => (
          <BreadCrumbItem
            key={`${path.label}-${index}`}
            label={path.label}
            link={path.link}
            isLastSegment={index === paths.length - 1}
          />
        ))}
      </Breadcrumbs>
    );
};

export default CustomBreadcrumbs;
