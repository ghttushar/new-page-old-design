import { PageTitleEnum } from '@/enums/index.enums';
import { Frequency, MarketplaceEnum } from '@/enums/serp.enums';
import useMarketplaceSubheader from '@/hooks/use-marketplace-sub-header.hook';
import marketIntelligenceUtils from '@/utils/market-intelligence/market-intelligence.utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import BrandMetrics from 'src/app/components/common/brand-metrics/brand-metrics';
import EmptyState from 'src/app/components/common/empty-state/empty-state';
import Filter from 'src/app/components/common/filter/filter';
import SOVGraphWrapper from 'src/app/components/common/sov-graph/sov-graph';
import SOVTable from 'src/app/components/common/sov-table/sov-table';
import TableHeader from 'src/app/components/common/table-header/table-header';
import {
  marketIntelligenceEmptyStateConf,
  marketIntelligenceNoKeywords,
} from 'src/constants/empty-state.constants';
import {
  IBrandLevelSovChartData,
  ISOV,
  ISOVMinMaxDateRange,
  ISOVWithRank,
  ISovChartData,
  ISovFilter,
} from 'src/interfaces/serp.interface';
import { useAppSelector } from 'src/redux/hooks';
import { selectAppliedSovFilters } from 'src/redux/slices/market-intelligence/sov-filter.slice';
import SerpService from 'src/services/market-intelligence/serp.service';
import serpUtils from 'src/utils/serp.utils';
import styles from './market-intelligence-page.module.scss';

function MarketIntelligencePage() {
  const [marketplace, countryCode] = useMarketplaceSubheader(
    PageTitleEnum.BRAND_SOV,
    marketIntelligenceUtils.getBrandSovUrl
  );
  const keywordCount = useRef<number | undefined>(undefined);
  const appliedSovFilters = useAppSelector(selectAppliedSovFilters);
  const [comparedBrand, setComparedBrand] = useState<ISOV | null>(null);
  const [comparedBrandSovData, setComparedBrandSovData] =
    useState<IBrandLevelSovChartData | null>(null);
  const [minMaxDates, setMinMaxDates] = useState<ISOVMinMaxDateRange | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [sovAggregatedData, setSovAggregatedData] = useState<ISOVWithRank[]>(
    []
  );
  const [chartData, setChartData] = useState<ISOV[]>([]);
  const [sovChartData, setSovChartData] = useState<ISovChartData>({
    labels: [],
    brandDataByLabel: [],
  });
  const [topBrands, setTopBrands] = useState<string[]>([]);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const fetchSOVData = useCallback(
    (sovFilters: ISovFilter, marketplace: MarketplaceEnum) => {
      setIsLoading(true);
      keywordCount.current = undefined; // Reset keyword count
      SerpService.getSOV(
        {
          ...sovFilters,
          countryCode,
        },
        marketplace
      )
        .then((res) => {
          const data = res.data.data;
          setSovAggregatedData(data.aggData);
          setTopBrands(serpUtils.getTopBrands(data.aggData, 10));
          setChartData(data.chartData);
          setSovChartData(
            serpUtils.getSovChartData(
              data.chartData,
              sovFilters.frequency as Frequency
            )
          );
          setMinMaxDates(data.minMaxDate);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [SerpService, serpUtils, countryCode]
  );

  const handleToggleHide = () => {
    setIsHidden(!isHidden);
  };

  const onKeywordFetchComplete = (count: number | undefined) => {
    keywordCount.current = count ?? 0; // Default to 0 if count is undefined
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    if (
      !appliedSovFilters ||
      !appliedSovFilters.brandName ||
      appliedSovFilters.keyword === undefined
    )
      return;

    fetchSOVData(
      { ...appliedSovFilters, countryCode: countryCode },
      marketplace as MarketplaceEnum
    );
  }, [appliedSovFilters, fetchSOVData, marketplace, countryCode]);

  useEffect(() => {
    if (comparedBrand !== null) {
      const comparedBrandData = sovChartData.brandDataByLabel.filter(
        (item) => item.brand === comparedBrand?.brand
      );
      if (comparedBrandData.length > 0) {
        setComparedBrandSovData(comparedBrandData[0]);
      } else {
        setComparedBrandSovData(null); // Reset if no data found
      }
    }
  }, [sovChartData, comparedBrand]);

  return (
    <div id="graph-container" className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        <Filter
          onKeywordFetchComplete={onKeywordFetchComplete}
          marketplace={marketplace}
          countryCode={countryCode}
          setIsLoading={setIsLoading}
        />
        <div className={styles.contentContainer}>
          {sovAggregatedData.length <= 0 &&
          chartData.length <= 0 &&
          isLoading === false ? (
            <EmptyState
              {...(keywordCount.current === 0
                ? marketIntelligenceNoKeywords
                : marketIntelligenceEmptyStateConf)}
              height="100%"
            />
          ) : (
            <React.Fragment>
              <BrandMetrics
                brand={appliedSovFilters.brandName}
                marketplace={marketplace as MarketplaceEnum}
                countryCode={countryCode}
              />
              <SOVGraphWrapper
                sovChartData={sovChartData}
                brandsToShow={topBrands}
                sovDataWithFrequency={chartData}
                filters={appliedSovFilters}
                isLoading={isLoading}
                isHidden={isHidden}
                handleToggleHide={handleToggleHide}
                comparedBrand={comparedBrand}
                comparedBrandSovData={comparedBrandSovData}
                minMaxDateRange={minMaxDates}
              />
              <TableHeader
                sovData={sovAggregatedData}
                filters={appliedSovFilters}
                isHidden={isHidden}
                handleToggleHide={handleToggleHide}
              />
              <SOVTable
                data={sovAggregatedData}
                isLoading={isLoading}
                comparedBrand={comparedBrand}
                setComparedBrand={setComparedBrand}
                setComparedBrandSovData={setComparedBrandSovData}
                marketplace={marketplace as MarketplaceEnum}
              />
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketIntelligencePage;
