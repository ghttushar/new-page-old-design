import { Checkbox, FormControlLabel } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { CornersOutIcon } from '@phosphor-icons/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  IBrandLevelSovChartData,
  IBrandLevelSovChecks,
  ISOV,
  ISOVMinMaxDateRange,
  ISovChartData,
  ISovChartDataMapping,
  ISovFilter,
} from 'src/interfaces/serp.interface';
import { useAppSelector } from 'src/redux/hooks';
import { selectIsSidebarMenuOpen } from 'src/redux/slices/auth/auth.slice';
import { getFileNameDateTime, getFormattedRangeFreq } from 'src/utils';
import DownloadGraphButton from '../download-button/download-graph-button';
import GraphDialog from '../graph-dialog/graph-dialog';
import SkeletonComponent from '../skeleton/skeleton';
import SOVGraph from './sov-graph-component';
import styles from './sov-graph.module.scss';

interface ISOVGraphProps {
  sovChartData: ISovChartData;
  brandsToShow: string[];
  sovDataWithFrequency: ISOV[];
  filters: ISovFilter;
  isLoading: boolean;
  isHidden: boolean;
  handleToggleHide: () => void;
  comparedBrand: ISOV | null;
  comparedBrandSovData: IBrandLevelSovChartData | null;
  minMaxDateRange: ISOVMinMaxDateRange | null;
}

const SOVGraphWrapper: React.FC<ISOVGraphProps> = (props) => {
  const [chartDataMapping, setChartDataMapping] = useState({});
  const sponsoredSOVLineColor = '#00008B ';
  const organicSOVLineColor = '#8B0000';
  const totalSOVLineColor = '#008B8B';
  const {
    sovChartData,
    brandsToShow,
    sovDataWithFrequency,
    filters,
    isLoading,
    isHidden,
    handleToggleHide,
    comparedBrand,
    comparedBrandSovData,
    minMaxDateRange,
  } = props;
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [formattedRangeFreq, setFormattedRangeFreq] = useState<string>('');
  const [topBrandsChartData, setTopBrandsChartData] = useState<
    IBrandLevelSovChartData[]
  >([]);
  const [expandGraph, setExpandGraph] = useState<boolean>(false);
  const [isSovChecked, setIsSovChecked] = useState<IBrandLevelSovChecks>({
    total_sov: true,
    organic_sov: true,
    sponsored_sov: true,
  });

  const chartRef = useRef<HTMLDivElement | null>(null);

  const isSidebarMenuOpen = useAppSelector(selectIsSidebarMenuOpen);
  const chartLabel = useMemo(
    () => `market_intelligence_chart_${getFileNameDateTime(filters)}`,
    [filters]
  );

  const handleExpandOpen = () => setExpandGraph(true);
  const handleExpandClose = () => setExpandGraph(false);

  const handleSOVGraphChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSOVChecks = {
      ...isSovChecked,
      [event.target.name]: event.target.checked,
    };
    setIsSovChecked(updatedSOVChecks);
  };

  useEffect(() => {
    if (minMaxDateRange) {
      setFormattedRangeFreq(
        getFormattedRangeFreq(
          filters.frequency,
          filters.range,
          minMaxDateRange?.minDate,
          minMaxDateRange?.maxDate
        )
      );
    } else {
      setFormattedRangeFreq('-');
    }

    const sovChartDataMapping: ISovChartDataMapping = {};
    sovDataWithFrequency.forEach((item) => {
      const { brand, label } = item;
      if (!sovChartDataMapping[brand]) sovChartDataMapping[brand] = {};
      sovChartDataMapping[brand][label] = item;
    });
    setChartDataMapping(sovChartDataMapping);

    const topBrandsSovChartData = sovChartData.brandDataByLabel.filter(
      (brandLevelData: IBrandLevelSovChartData) =>
        brandsToShow.includes(brandLevelData.brand)
    );
    setTopBrandsChartData(topBrandsSovChartData);
    setIsLoaded(true);
  }, [
    sovChartData,
    brandsToShow,
    filters,
    comparedBrand,
    minMaxDateRange,
    sovDataWithFrequency,
  ]);

  return (
    <div
      data-test="sov-graph-wrapper"
      className={styles.graphContainer}
      style={{
        display: isHidden ? 'none' : 'flex',
        height: isHidden ? '0' : '50rem',
      }}
    >
      <div className={styles.graphHeader} data-test="sov-graph-header">
        <div className={styles.graphHeaderTitle}>
          <h5>
            Time range:{' '}
            {isLoaded && isLoading === false ? (
              formattedRangeFreq
            ) : (
              <div>
                <SkeletonComponent
                  animation="wave"
                  variant="text"
                  width="10rem"
                  height={15}
                />
              </div>
            )}
          </h5>
        </div>

        {comparedBrandSovData && (
          <div
            className={styles.trendHeader}
            data-test="sov-graph-trend-header"
          >
            <div className={styles.trendItem}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSovChecked.organic_sov}
                    onChange={handleSOVGraphChange}
                    name={'organic_sov'}
                    sx={{
                      padding: 0,
                      paddingRight: '5px',
                      color: '#77469B',
                      '&.Mui-checked': {
                        color: '#77469B',
                      },
                    }}
                  />
                }
                label={`Organic SOV ${comparedBrandSovData.brand}(${comparedBrand?.organic_sov}%)`}
                sx={{
                  margin: 0,
                  '& .MuiTypography-root': {
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  },
                }}
              />
              <span
                className={`${styles.trendColor}`}
                style={{
                  backgroundColor: organicSOVLineColor,
                }}
              ></span>
            </div>

            <div className={styles.trendItem}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSovChecked.sponsored_sov}
                    onChange={handleSOVGraphChange}
                    name={'sponsored_sov'}
                    sx={{
                      padding: 0,
                      paddingRight: '5px',
                      color: '#77469B',
                      '&.Mui-checked': {
                        color: '#77469B',
                      },
                    }}
                  />
                }
                label={`Sponsored SOV ${comparedBrandSovData.brand}(${comparedBrand?.sponsored_sov}%)`}
                sx={{
                  margin: 0,
                  minWidth: 0,
                  width: 'auto',
                  '& .MuiTypography-root': {
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  },
                }}
              />
              <span
                className={`${styles.trendColor}`}
                style={{
                  backgroundColor: sponsoredSOVLineColor,
                }}
              ></span>
            </div>

            <div className={styles.trendItem}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSovChecked.total_sov}
                    onChange={handleSOVGraphChange}
                    name={'total_sov'}
                    sx={{
                      padding: 0,
                      paddingRight: '5px',
                      color: '#77469B',
                      '&.Mui-checked': {
                        color: '#77469B',
                      },
                    }}
                  />
                }
                label={`Total SOV ${comparedBrandSovData.brand}(${comparedBrand?.total_sov}%)`}
                sx={{
                  margin: 0,
                  '& .MuiTypography-root': {
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  },
                }}
              />
              <span
                className={`${styles.trendColor}`}
                style={{
                  backgroundColor: totalSOVLineColor,
                }}
              ></span>
            </div>
          </div>
        )}

        <div
          className={styles.graphHeaderButton}
          data-test="sov-graph-header-button"
        >
          <Button
            className={styles.hideChartButton}
            disableRipple
            onClick={handleToggleHide}
          >
            Hide Chart
          </Button>

          <DownloadGraphButton
            chartData={topBrandsChartData}
            chartImageRef={chartRef}
            filename={chartLabel}
            downloadOptionsRequired={true}
            iconButton={false}
            frequency={filters?.frequency}
          />

          <IconButton
            className={styles.hideChartButton}
            disableRipple
            onClick={handleExpandOpen}
            title="Expand"
          >
            <CornersOutIcon size={18} color="#77469b" weight="bold" />
          </IconButton>
        </div>
      </div>
      <span
        className={styles.horizontalLine}
        data-test="sov-horizontal-line"
      ></span>

      <Box
        className={styles.graphBody}
        sx={{
          width: isSidebarMenuOpen ? 'calc(100% - 1rem)' : '100%',
          height: '90%',
        }}
        data-test="sov-graph-body"
      >
        {isLoaded && isLoading === false ? (
          <div ref={chartRef} className={styles.graphWrapper}>
            <SOVGraph
              sponsoredSOVLineColor={sponsoredSOVLineColor}
              organicSOVLineColor={organicSOVLineColor}
              totalSOVLineColor={totalSOVLineColor}
              labels={sovChartData.labels}
              topBrandsChartData={topBrandsChartData}
              chartDataMapping={chartDataMapping}
              formattedRangeFreq={formattedRangeFreq}
              comparedBrandData={comparedBrandSovData}
              isSovChecked={isSovChecked}
            />
          </div>
        ) : (
          <Box>
            <SkeletonComponent
              animation="wave"
              variant="rounded"
              width="100%"
              height="38rem"
            />
          </Box>
        )}
      </Box>

      {expandGraph === true && (
        <GraphDialog
          open={expandGraph}
          onClose={handleExpandClose}
          label={chartLabel}
          chartData={topBrandsChartData}
        >
          <SOVGraph
            sponsoredSOVLineColor={sponsoredSOVLineColor}
            organicSOVLineColor={organicSOVLineColor}
            totalSOVLineColor={totalSOVLineColor}
            labels={sovChartData.labels}
            topBrandsChartData={topBrandsChartData}
            chartDataMapping={chartDataMapping}
            formattedRangeFreq={formattedRangeFreq}
            comparedBrandData={comparedBrandSovData}
            isSovChecked={isSovChecked}
          />
        </GraphDialog>
      )}
    </div>
  );
};

export default SOVGraphWrapper;
