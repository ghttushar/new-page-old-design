import DayPartingFilter from '@/app/components/page-components/day-parting-components/day-parting-filter/day-parting-filter';
import DaypartingGraphHeader from '@/app/components/page-components/day-parting-components/dayparting-heat-map/dayparting-graph-header';
import DaypartingLineGraph from '@/app/components/page-components/day-parting-components/dayparting-heat-map/dayparting-line-graph';
import { selectDayPartingAppliedFilters } from '@/redux/slices/day-parting/day-parting.slice';
import DayPartingService from '@/services/day-parting.service';
import { useEffect, useMemo, useState } from 'react';
import Grid from 'src/app/components/common/grid/grid';

import DayPartingForm from '@/app/components/page-components/day-parting-components/day-parting-form/day-parting-form';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { selectIsFormOpen } from '@/redux/slices/day-parting/day-parting.slice';
import { generateNItems, parseNum } from '@/utils';
import { WEEKDAYS } from 'src/constants/dayparting.constants';
import {
  ICreateJobBody,
  IDaypartingCampaignList,
  IDaypartingJob,
  IDaypartingMetricsData,
  IDaypartingMetricsPayload,
  IWalmartDaypartingJob,
} from 'src/interfaces/day-parting.interfaces';
import { IDateRange } from 'src/interfaces/serp.interface';
import { useAppSelector } from 'src/redux/hooks';
import {
  getGridData,
  getMetricsPayload,
  getXLabels,
} from 'src/utils/day-parting.utils';
import styles from './day-parting-setup-page.module.scss';

interface DayPartingSetupBaseProps {
  daypartingCampaigns: IDaypartingCampaignList[];
  isLoading: boolean;
  isEditMode: boolean;
  selectedJobId?: string;
  handleRule: (
    payload: ICreateJobBody,
    campaignsToRemove?: string[]
  ) => Promise<void>;
  handleEditRuleClick?: (job: IWalmartDaypartingJob | IDaypartingJob) => void;
  marketplace: MarketplaceEnum;
  toggleEdit?: () => void;
}
export default function DayPartingSetupBase({
  daypartingCampaigns,
  isLoading,
  isEditMode,
  selectedJobId = '',
  handleRule,
  handleEditRuleClick,
  toggleEdit,
  marketplace,
}: DayPartingSetupBaseProps) {
  const [customDateRange, setCustomDateRange] = useState<IDateRange>({
    startDate: '',
    endDate: '',
  });
  const [data, setData] = useState<IDaypartingMetricsData[]>([]);
  const [hourlyTotalData, setHourlyTotalData] = useState<
    IDaypartingMetricsData[]
  >([]);
  const [dailyTotalData, setDailyTotalData] = useState<
    IDaypartingMetricsData[]
  >([]);
  const [showLineChart, setShowLineChart] = useState<boolean>(false);

  const isFormOpen = useAppSelector(selectIsFormOpen);

  const appliedFilters = useAppSelector(selectDayPartingAppliedFilters);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const fetchAmazonMetricsData = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_AMZ_METRICS_DATA,
      { appliedFilters, selectedAdvertisingAccount },
    ],
    queryFn: () => {
      setData([]);
      setDailyTotalData([]);
      setHourlyTotalData([]);
      const payload = getMetricsPayload(
        appliedFilters
      ) as IDaypartingMetricsPayload;
      return DayPartingService.getMetricsData(payload);
    },
    enabled:
      marketplace === MarketplaceEnum.AMAZON &&
      appliedFilters.campaigns.length > 0,
  });

  useEffect(() => {
    if (fetchAmazonMetricsData.isSuccess) {
      const responseData = fetchAmazonMetricsData.data.data.data;
      setData(responseData.metricsData);
      setHourlyTotalData(responseData.hourlyMetricsData);
      setDailyTotalData(responseData.dailyMetricsData);
    }
  }, [
    fetchAmazonMetricsData?.data?.data.data,
    fetchAmazonMetricsData.isSuccess,
  ]);

  const isMetricsLoading = useMemo(
    () =>
      fetchAmazonMetricsData.isLoading || fetchAmazonMetricsData.isRefetching,
    [fetchAmazonMetricsData.isLoading, fetchAmazonMetricsData.isRefetching]
  );

  useEffect(() => {
    if (isFormOpen) {
      document.getElementById('day-parting-form')?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [isFormOpen]);

  const handleAntSwitchChange = () => {
    setShowLineChart((prev) => !prev);
  };

  const handleEditClick = (job: IWalmartDaypartingJob | IDaypartingJob) => {
    if (handleEditRuleClick) handleEditRuleClick(job);
  };

  const handleToggleEdit = () => {
    if (toggleEdit) toggleEdit();
  };

  const metric = appliedFilters.metric;

  const yLabels = WEEKDAYS.map((day, index) => {
    if (index === WEEKDAYS.length - 1) return day;
    else return day.slice(0, 3);
  });

  return (
    <div className={styles.hourlyContainer}>
      <DayPartingFilter
        customDateRange={customDateRange}
        setCustomDateRange={setCustomDateRange}
        campaigns={daypartingCampaigns}
        handleEditRuleClick={handleEditClick}
        isEdit={isEditMode}
        marketplace={marketplace}
      />

      <div className={styles.hourlyContainer}>
        {marketplace === MarketplaceEnum.AMAZON && (
          <div
            className={styles.chartWrapper}
            style={{
              justifyContent: !data.length ? 'center' : 'flex-start',
            }}
          >
            <DaypartingGraphHeader
              isChecked={showLineChart}
              handleAntSwitchChange={handleAntSwitchChange}
            />
            {showLineChart ? (
              <DaypartingLineGraph
                data={data}
                metric={metric}
                isLoading={isMetricsLoading || isLoading}
              />
            ) : (
              <Grid
                metric={metric.value}
                xLabels={getXLabels()}
                yLabels={yLabels}
                data={getGridData(data, metric.value)}
                isLoading={isMetricsLoading || isLoading}
                dailyTotalArray={WEEKDAYS.map((day) =>
                  parseNum(
                    dailyTotalData.find((d) => d.weekDay === day)?.value ?? 0
                  )
                )}
                hourlyTotalArray={generateNItems(24, 0).map((hour, index) =>
                  parseNum(
                    hourlyTotalData.find((d) => parseNum(d.hour) === index)
                      ?.value ?? 0
                  )
                )}
              />
            )}
          </div>
        )}
        {(marketplace === MarketplaceEnum.WALMART || isFormOpen) && (
          <DayPartingForm
            campaigns={daypartingCampaigns}
            isEdit={isEditMode}
            toggleEdit={handleToggleEdit}
            isLoading={isLoading}
            selectedJobId={selectedJobId}
            handleRule={handleRule}
            marketplace={marketplace}
          />
        )}
      </div>
    </div>
  );
}
