import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppQuery } from '@/redux/react-query-hooks';
import React, { Fragment } from 'react';
import { BRAND_METRICS_TOOLTIPS } from 'src/enums/tooltip-texts.enums';
import { useAppSelector } from 'src/redux/hooks';
import { selectAppliedSovFilters } from 'src/redux/slices/market-intelligence/sov-filter.slice';
import brandAnalyticsService from 'src/services/market-intelligence/brand-analytics.services';
import { formatNum, isPositive } from 'src/utils';

import { imageUrls } from '@/constants/assets/images.constants';
import HoverInfoTooltip from '../hover-info-tooltip/hover-info-tooltip';
import ImgComponent from '../img-component/img-component';
import SkeletonComponent from '../skeleton/skeleton';
import {
  iconStyle,
  percentBar,
  percentContainer,
} from './brand-metrics-styles';
import styles from './brand-metrics.module.scss';

interface IBrandMetricsProps {
  brand: string;
  marketplace: MarketplaceEnum;
  countryCode?: string;
}

export default function BrandMetrics({
  brand,
  marketplace,
  countryCode,
}: IBrandMetricsProps) {
  const appliedSovFilters = useAppSelector(selectAppliedSovFilters);
  const fetchBrandMetrics = useAppQuery({
    queryKey: [
      QueryKeyEnums.MI_FETCH_BRAND_METRICS,
      brand,
      marketplace,
      appliedSovFilters,
      countryCode,
    ],

    queryFn: () =>
      brandAnalyticsService.getBrandMetrics(
        {
          ...appliedSovFilters,
          countryCode,
        },
        brand,
        marketplace
      ),
    options: {
      refetchOnMount: false,
    },
  });

  if (
    fetchBrandMetrics.isLoading ||
    fetchBrandMetrics.isRefetching ||
    !fetchBrandMetrics.data
  )
    return (
      <div className={styles.resultContainer} data-test="brand-metrics">
        <div className={styles.Skeleton}>
          {[0, 0, 0, 0, 0].map((value, index) => (
            <SkeletonComponent
              key={`${value}-${index}`}
              animation="wave"
              variant="rounded"
              width={150}
              height={50}
            />
          ))}
        </div>{' '}
      </div>
    );
  else
    return (
      <div className={styles.resultContainer} data-test="brand-metrics">
        <div className={styles.brandContainer}>
          <p>Your Brand</p>
          <h5 className={styles.brandTitle} data-test="brand-title">
            {fetchBrandMetrics.data?.brand}&nbsp;(
            {fetchBrandMetrics.data?.totalSov?.current}%)
          </h5>
        </div>
        <BrandMetricsItem
          title="Organic SOV (%)"
          tooltip={BRAND_METRICS_TOOLTIPS.ORG_SOV}
          current={`${formatNum(
            fetchBrandMetrics.data.organicSov.current,
            false
          )}%`}
          previous={`${formatNum(
            fetchBrandMetrics.data.organicSov.previous,
            false
          )}%`}
          previousDateRangeText={
            fetchBrandMetrics.data.organicSov.previousDateRangeText
          }
          changePercentage={fetchBrandMetrics.data.organicSov.changePercentage}
        />
        <BrandMetricsItem
          title="Sponsored SOV (%)"
          tooltip={BRAND_METRICS_TOOLTIPS.SP_SOV}
          current={`${formatNum(
            fetchBrandMetrics.data.sponsoredSov.current,
            false
          )}%`}
          previous={`${formatNum(
            fetchBrandMetrics.data.sponsoredSov.previous,
            false
          )}%`}
          previousDateRangeText={
            fetchBrandMetrics.data.sponsoredSov.previousDateRangeText
          }
          changePercentage={
            fetchBrandMetrics.data.sponsoredSov.changePercentage
          }
        />
        <BrandMetricsItem
          title="Total SOV (%)"
          tooltip={BRAND_METRICS_TOOLTIPS.TOTAL_SOV}
          current={`${formatNum(
            fetchBrandMetrics.data.totalSov.current,
            false
          )}%`}
          previous={`${formatNum(
            fetchBrandMetrics.data.totalSov.previous,
            false
          )}%`}
          previousDateRangeText={
            fetchBrandMetrics.data.totalSov.previousDateRangeText
          }
          changePercentage={fetchBrandMetrics.data.totalSov.changePercentage}
        />
        <BrandMetricsItem
          title="Product Count (Unique)"
          tooltip={BRAND_METRICS_TOOLTIPS.PROD_COUNT}
          current={`${formatNum(
            fetchBrandMetrics.data.uniqueProductCount.current,
            false
          )}`}
          previous={`${formatNum(
            fetchBrandMetrics.data.uniqueProductCount.previous,
            false
          )}`}
          previousDateRangeText={
            fetchBrandMetrics.data.uniqueProductCount.previousDateRangeText
          }
          changePercentage={
            fetchBrandMetrics.data.uniqueProductCount.changePercentage
          }
        />
      </div>
    );
}

interface IBrandMetricsItemProps {
  tooltip: string;
  changePercentage: number;
  previousDateRangeText: string;
  previous: string;
  title: string;
  current: string;
}
const BrandMetricsItem: React.FC<IBrandMetricsItemProps> = ({
  tooltip,
  title,
  current,
  previous,
  previousDateRangeText,
  changePercentage,
}) => {
  return (
    <Fragment>
      <span className={styles.vl}></span>
      <HoverInfoTooltip title={tooltip}>
        <div data-test={`metrice-data-${title}`} className={styles.metrics}>
          <div style={iconStyle}>
            <p>{title}</p>
          </div>
          <div style={percentContainer}>
            <h5>{current}</h5>
            <span
              style={percentBar}
              className={
                changePercentage === 0
                  ? styles.noChangeTrend
                  : isPositive(changePercentage)
                  ? styles.positiveTrend
                  : styles.negativeTrend
              }
            >
              {changePercentage === 0 ? (
                <span className={styles.noChangeLogo}>-</span>
              ) : (
                <ImgComponent
                  imageURL={
                    isPositive(changePercentage)
                      ? imageUrls.upTrendImg
                      : imageUrls.downTrendImg
                  }
                  alt={
                    isPositive(changePercentage)
                      ? 'upward-trend'
                      : 'downward-trend'
                  }
                />
              )}
              <h6>{formatNum(changePercentage, false)}%</h6>
            </span>
          </div>
          <p>
            {previousDateRangeText}: {previous}
          </p>
        </div>
      </HoverInfoTooltip>
    </Fragment>
  );
};
