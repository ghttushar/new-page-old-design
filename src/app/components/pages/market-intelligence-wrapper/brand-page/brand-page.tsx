import DownloadTableButton from '@/app/components/common/download-button/download-table-button';
import { PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import useMarketplaceSubheader from '@/hooks/use-marketplace-sub-header.hook';
import marketIntelligenceUtils from '@/utils/market-intelligence/market-intelligence.utils';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import BrandMetrics from 'src/app/components/common/brand-metrics/brand-metrics';
import MICustomBreadcrumbs from 'src/app/components/common/breadcrumb/mi-breadcrumb';
import EmptyState from 'src/app/components/common/empty-state/empty-state';
import Filter from 'src/app/components/common/filter/filter';
import BrandSOVGraph from 'src/app/components/page-components/brand-sov-graph/brand-sov-graph';
import BrandSOVTable from 'src/app/components/page-components/brand-sov-table/brand-sov-table';
import { brandAnalyticsEmptyStateConf } from 'src/constants/empty-state.constants';
import { IBrandAnalyticsProductData } from 'src/interfaces/brand-analytics.interfaces';
import {
  IBrandAnalyticsFilter,
  ISOVMinMaxDateRange,
  ISovFilter,
} from 'src/interfaces/serp.interface';
import { useAppSelector } from 'src/redux/hooks';
import { selectAppliedSovFilters } from 'src/redux/slices/market-intelligence/sov-filter.slice';
import brandAnalyticsService from 'src/services/market-intelligence/brand-analytics.services';
import { formatNum, getFileNameDateTime } from 'src/utils';
import styles from './brand-page.module.scss';

function BrandPage() {
  const { brand } = useParams();
  const getUrl = useCallback(
    (marketplace: string) =>
      marketIntelligenceUtils.getBrandAnalyticsUrl(
        brand as string,
        marketplace
      ),
    [brand]
  );

  const [marketplace, countryCode] = useMarketplaceSubheader(
    `${PageTitleEnum.BRAND_ANALYTICS}(${brand})`,
    getUrl
  );

  const appliedSovFilters = useAppSelector(selectAppliedSovFilters);
  const [brandData, setBrandData] = useState<IBrandAnalyticsProductData[]>([]);
  const [aggregatedBrandData, setAggregatedBrandData] = useState<
    IBrandAnalyticsProductData[]
  >([]);
  const [minMaxDates, setMinMaxDates] = useState<ISOVMinMaxDateRange | null>(
    null
  );
  const keywordCount = useRef<undefined | number>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [topAsins, setTopAsins] = useState<string[]>([]);
  const isMounted = useRef(false);

  const getBrandAnalyticsData = useCallback(
    (filters: ISovFilter, brandName: string) => {
      const brandFilters: IBrandAnalyticsFilter = {
        ...filters,
        brandName,
      };

      setBrandData([]);
      setTopAsins([]);
      setAggregatedBrandData([]);
      setIsLoading(true);
      brandAnalyticsService
        .getBrandAnalytics(brandFilters, marketplace)
        .then((res) => {
          if (res.data?.success) {
            const data = res.data.data;
            setBrandData(data.response);
            setMinMaxDates(data.minMaxDate);

            const dataByBrand: Record<string, IBrandAnalyticsProductData[]> =
              {};
            data.response.forEach((item) => {
              const { product_id } = item;
              if (!dataByBrand[product_id]) dataByBrand[product_id] = [];
              dataByBrand[product_id].push(item);
            });

            const temp: IBrandAnalyticsProductData[] = Object.values(
              dataByBrand
            ).map((brandData) => {
              let avgRankSum = 0;
              let avgOrganicRankSum = 0;
              let avgSponsoredRankSum = 0;
              let organicCount = 0;
              let sponsoredCount = 0;
              brandData.forEach((item) => {
                avgRankSum += item.avg_rank;
                avgOrganicRankSum += item.avg_organic_rank;
                avgSponsoredRankSum += item.avg_sponsored_rank;
                if (item.avg_organic_rank) organicCount++;
                if (item.avg_sponsored_rank) sponsoredCount++;
              });
              const avgRank = formatNum(
                Math.round(avgRankSum / brandData.length),
                false
              );
              const avgOrganicRank = formatNum(
                Math.round(avgOrganicRankSum / organicCount),
                false
              );
              const avgSponsoredRank = formatNum(
                Math.round(avgSponsoredRankSum / sponsoredCount),
                false
              );

              return {
                id: Number(brandData[0].id),
                title: brandData[0].title,
                product_id: brandData[0].product_id,
                appearance: brandData[0].appearance,
                latest_sale_price: brandData[0].latest_sale_price,
                avg_rank: Number(avgRank),
                avg_organic_rank: Number(avgOrganicRank),
                avg_sponsored_rank: Number(avgSponsoredRank),
                label: brandData[0].label,
                latest_stars: brandData[0].latest_stars,
                latest_rating_count: brandData[0].latest_rating_count,
              };
            });
            temp.sort((a, b) => a.avg_rank - b.avg_rank);
            setTopAsins(temp.slice(0, 10).map((item) => item.product_id));
            setAggregatedBrandData(temp);
          }
        })
        .finally(() => setIsLoading(false));
    },
    [marketplace, countryCode]
  );

  const handleToggleHide = () => {
    setIsHidden(!isHidden);
  };

  const isEmpty = () => {
    return !brandData.length && !topAsins.length && !aggregatedBrandData.length;
  };

  useEffect(() => {
    if (!brand || appliedSovFilters.keyword === undefined) return;
    getBrandAnalyticsData(
      {
        ...appliedSovFilters,
        countryCode,
      },
      brand
    );
  }, [appliedSovFilters, getBrandAnalyticsData, brand, countryCode]);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = false;
    setIsLoading(true);
  }, [marketplace]);
  const onKeywordFetchComplete = (count: number) => {
    keywordCount.current = count;
    if (count === 0) {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        <MICustomBreadcrumbs
          brand={brand as string}
          marketplace={marketplace}
        />
        <Filter
          hideBrandDropdown={true}
          onKeywordFetchComplete={onKeywordFetchComplete}
          marketplace={marketplace}
          countryCode={countryCode}
        />

        {isEmpty() && isLoading === false ? (
          <EmptyState
            {...brandAnalyticsEmptyStateConf(
              brand as string,
              keywordCount.current
            )}
            height="100%"
          />
        ) : (
          <React.Fragment>
            <BrandMetrics
              brand={brand as string}
              marketplace={marketplace as MarketplaceEnum}
              countryCode={countryCode}
            />
            <BrandSOVGraph
              data={brandData}
              isLoading={isLoading}
              isHidden={isHidden}
              handleToggleHide={handleToggleHide}
              topAsins={topAsins}
              brand={brand as string}
              minMaxDateRange={minMaxDates}
            />

            <div className={styles.tableHeader} data-test="table-header">
              <Typography variant="h4" fontWeight={700} fontSize="1.7rem">
                All Products
              </Typography>
              <div className={styles.buttonContainer}>
                {isHidden === true && (
                  <Button
                    className={styles.showChartButton}
                    disableRipple
                    onClick={handleToggleHide}
                  >
                    Show Chart
                  </Button>
                )}

                <DownloadTableButton
                  data={aggregatedBrandData}
                  filename={`${brand as string}-sov-data_${getFileNameDateTime(
                    appliedSovFilters
                  )}.csv`}
                  squareDimension={`2.5rem`}
                  enclosingCharacter='"'
                />
              </div>
            </div>

            <BrandSOVTable
              data={aggregatedBrandData}
              isLoading={isLoading}
              marketplace={marketplace as MarketplaceEnum}
            />
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default BrandPage;
