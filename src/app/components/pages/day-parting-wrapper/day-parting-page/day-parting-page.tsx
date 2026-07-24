import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import { AdType, AdTypeShort } from '@/enums/advertising.enums';
import { PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useAdsAccountSubHeader from '@/hooks/use-ads-account-sub-header.hook';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectAdvertisingHeaderFilters } from '@/redux/slices/advertising/advertising-filter.slice';
import {
  selectIsFormOpen,
  setIsFormOpen,
} from '@/redux/slices/day-parting/day-parting.slice';
import {
  getDayPartingUrl,
  getIsAIBidderEnabled,
  getSelectedTabByURL,
  getTabDataByMarketplace,
} from '@/utils/day-parting.utils';
import { ClockCountdownIcon } from '@phosphor-icons/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import TabsSelect from 'src/app/components/common/tabs-select/tabs-select';
import { DaypartingTabsEnum } from 'src/enums/day-parting.enums';
import DayPartingCampaignsWrapper from '../day-parting-campaigns-wrapper/day-parting-campaigns-wrapper';
import AmzDayPartingCreateWrapper from './amazon/amz-day-parting-create-wrapper/amz-day-parting-create-wrapper';
import AmzDayPartingEditWrapper from './amazon/amz-day-parting-edit-wrapper/amz-day-parting-edit-wrapper';
import styles from './day-parting-page.module.scss';
import WmtDayPartingCreateWrapper from './walmart/wmt-day-parting-create-wrapper/wmt-day-parting-create-wrapper';
import WmtDayPartingEditWrapper from './walmart/wmt-day-parting-edit-wrapper/wmt-day-parting-edit-wrapper';

export default function DayPartingPage() {
  const getUrl = useCallback((mkt: MarketplaceEnum, _: AdType) => {
    return getDayPartingUrl(DaypartingTabsEnum.DAYPARTING_SETUP, mkt, _);
  }, []);

  const dispatch = useAppDispatch();
  const isFormOpen = useAppSelector(selectIsFormOpen);

  const [tabValue, setTabValue] = useState<DaypartingTabsEnum>(
    DaypartingTabsEnum.HOURLY_TRENDS
  );
  const onAdTypeChange = useCallback(
    (mkt: MarketplaceEnum, adType: AdType) => {
      return getDayPartingUrl(tabValue, mkt, adType);
    },
    [tabValue]
  );

  const isAIBidderEnabled = getIsAIBidderEnabled();
  const selectedAdType = useAppSelector(selectAdvertisingHeaderFilters);

  const selectedAccount = useAdsAccountSubHeader(
    PageTitleEnum.DAY_PARTING,
    PAGE_TITLE_TOOLTIPS.DAY_PARTING,
    true,
    getUrl,
    onAdTypeChange
  );

  const marketplace = useMemo(
    () => selectedAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAccount]
  );

  const navigate = useNavigate();

  const handleTabChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setTabValue(value as DaypartingTabsEnum);

    navigate(getDayPartingUrl(value, marketplace, selectedAdType.adType.value));
  };

  const handleCreateDayParting = () => {
    dispatch(setIsFormOpen(true));
  };

  useEffect(() => {
    const selectedTab = getSelectedTabByURL(
      window.location.pathname
    ).toLowerCase() as DaypartingTabsEnum;
    setTabValue(selectedTab);
  }, [window.location.pathname]);

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <div className="flex items-center w-full  justify-between">
          <TabsSelect
            tabValue={tabValue}
            handleTabChange={handleTabChange}
            tabsWithIndicator={true}
            tabData={getTabDataByMarketplace(marketplace)}
            singleTabStyles={{
              fontSize: '1.6rem !important',
              fontWeight: '600 !important',
            }}
          />
          {marketplace === MarketplaceEnum.AMAZON &&
            tabValue !== DaypartingTabsEnum.DAYPARTING_CAMPAIGNS && (
              <PrimaryButton
                buttonText={'Create DayParting Rule'}
                buttonFunction={handleCreateDayParting}
                disabled={isFormOpen || isAIBidderEnabled}
                width="20rem"
                isHoverTooltipEnabled
                tooltipText={
                  isAIBidderEnabled === true
                    ? 'Disable AI Bidder to Enable Rule Creation'
                    : ''
                }
                isButtonIconRequired={true}
                buttonIcon={
                  <ClockCountdownIcon
                    size={'2rem'}
                    style={{
                      margin: '0 0.4rem 0 -0.4rem',
                    }}
                  />
                }
              />
            )}
        </div>
        <div>
          <Routes>
            <Route
              path="/amazon/:adType"
              element={<AmzDayPartingCreateWrapper />}
            />

            <Route
              path="/walmart/:adType"
              element={<WmtDayPartingCreateWrapper />}
            />

            <Route
              path="/edit/:jobId/:adType"
              element={<DaypartingRuleEditWrapper marketplace={marketplace} />}
            />

            <Route
              path="/campaigns/*"
              element={<DayPartingCampaignsWrapper marketplace={marketplace} />}
            />

            <Route
              path="*"
              element={
                <Navigate
                  to={
                    marketplace === MarketplaceEnum.WALMART
                      ? `${
                          MarketplaceEnum.WALMART
                        }/${AdTypeShort.All.toLowerCase()}`
                      : `${
                          MarketplaceEnum.AMAZON
                        }/${AdTypeShort.SPONSORED_PRODUCTS.toLowerCase()}`
                  }
                />
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

interface IDaypartingRuleCreationProps {
  marketplace: MarketplaceEnum;
}

const DaypartingRuleEditWrapper: React.FC<IDaypartingRuleCreationProps> = (
  props
) => {
  const { marketplace } = props;

  if (marketplace === MarketplaceEnum.AMAZON) {
    return <AmzDayPartingEditWrapper />;
  }
  if (marketplace === MarketplaceEnum.WALMART) {
    return <WmtDayPartingEditWrapper />;
  }
};
