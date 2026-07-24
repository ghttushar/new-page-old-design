import { Frequency } from '@/enums/serp.enums';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { CornersOutIcon } from '@phosphor-icons/react';
import {
  CategoryScale,
  ChartData,
  ChartDataset,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { IBrandAnalyticsProductData } from 'src/interfaces/brand-analytics.interfaces';
import { ISOVMinMaxDateRange } from 'src/interfaces/serp.interface';
import { useAppSelector } from 'src/redux/hooks';
import { selectIsSidebarMenuOpen } from 'src/redux/slices/auth/auth.slice';
import { selectAppliedSovFilters } from 'src/redux/slices/market-intelligence/sov-filter.slice';
import {
  getFileNameDateTime,
  getFormattedCompactNumbers,
  getFormattedRangeFreq,
  hexToRGBA,
  randomColorGenerator,
} from 'src/utils';
import serpUtils from 'src/utils/serp.utils';
import DownloadGraphButton from '../../common/download-button/download-graph-button';
import GraphDialog from '../../common/graph-dialog/graph-dialog';
import SkeletonComponent from '../../common/skeleton/skeleton';
import styles from './brand-sov-graph.module.scss';

interface IProductsAnalysisChartProps {
  data: IBrandAnalyticsProductData[];
  isLoading: boolean;
  isHidden: boolean;
  handleToggleHide: () => void;
  topAsins: string[];
  brand: string;
  minMaxDateRange: ISOVMinMaxDateRange | null;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function BrandSOVGraph(props: IProductsAnalysisChartProps) {
  const {
    data,
    isLoading,
    isHidden,
    handleToggleHide,
    topAsins,
    brand,
    minMaxDateRange,
  } = props;
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const [formattedRangeFreq, setFormattedRangeFreq] = useState<string>('');
  const [expandGraph, setExpandGraph] = useState<boolean>(false);

  const appliedSovFilters = useAppSelector(selectAppliedSovFilters);
  const isSidebarMenuOpen = useAppSelector(selectIsSidebarMenuOpen);
  const chartRef = useRef<HTMLDivElement | null>(null);

  const chartTitle = useMemo(
    () => `brand_${brand}_chart_${getFileNameDateTime(appliedSovFilters)}`,
    [appliedSovFilters, brand]
  );

  const handleExpandOpen = () => setExpandGraph(true);
  const handleExpandClose = () => setExpandGraph(false);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: formattedRangeFreq,
          color: '#000000',
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        display: true,
        title: {
          display: true,
          text: 'SOV',
          color: '#000000',
        },
        ticks: {
          stepSize: 20,
          callback(tickValue) {
            return getFormattedCompactNumbers(Number(tickValue));
          },
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 15,
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: 'nearest',
        intersect: false,
        backgroundColor: 'rgba(245, 245, 235, 0.95)',
        titleColor: '#000000',
        bodyColor: '#000000',
        bodySpacing: 5,
        cornerRadius: 5,
        padding: 10,
        titleAlign: 'center',
        bodyAlign: 'center',
        bodyFont: {
          size: 14,
        },
        callbacks: {
          title: () => {
            return `SOV - ${formattedRangeFreq}`;
          },
          afterTitle: (context) => {
            const _formattedRangeFreq = formattedRangeFreq.split('(');
            const frequency = _formattedRangeFreq[
              _formattedRangeFreq.length - 1
            ]
              .split(')')[0]
              .toLowerCase();
            let _frequency = '';
            switch (frequency) {
              case Frequency.HOURLY:
                _frequency = 'Hour';
                break;
              case Frequency.WEEKLY:
                _frequency = 'Week';
                break;
              case Frequency.DAILY:
                _frequency = 'Day';
                break;
              default:
                break;
            }
            return `${_frequency}: ${context[0].label}`;
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y}`;
          },
        },
      },
      title: {
        display: true,
        text: 'Top 10 Products based on SOVs',
        font: {
          size: 16,
          weight: '400',
        },
        color: '#000000',
      },
    },
    // TODO: find a logic for onHover
    // onHover: (event: ChartEvent, elements: ActiveElement[]) => {
    //   setIsGraphHovering(elements.length > 0);
    // },
  };

  useEffect(() => {
    const labels: string[] = [];
    data.forEach((row) => {
      if (labels.includes(row.label)) return;
      labels.push(row.label);
    });

    const sortedLabels =
      labels.length > 0 &&
      serpUtils.sortChartLabelsByFrequency(
        labels,
        appliedSovFilters.frequency as Frequency
      );

    const datasets: ChartDataset<'line'>[] = [];
    topAsins.forEach((asin) => {
      datasets.push({
        ...getGraphData(asin, sortedLabels as string[]),
        cubicInterpolationMode: 'monotone',
      });
    });

    setChartData({
      labels: sortedLabels as string[],
      datasets,
    });

    if (minMaxDateRange) {
      setFormattedRangeFreq(
        getFormattedRangeFreq(
          appliedSovFilters.frequency,
          appliedSovFilters.range,
          minMaxDateRange?.minDate,
          minMaxDateRange?.maxDate
        )
      );
    } else {
      setFormattedRangeFreq('-');
    }
  }, [data, isLoading, minMaxDateRange, topAsins]);

  const getGraphData = (productId: string, labels: string[]) => {
    const filteredData = data.filter((row) => row.product_id === productId);

    const formattedData: number[] = [];
    labels.forEach((label) => {
      const matchingData = filteredData.find((row) => row.label === label);
      formattedData.push(matchingData ? matchingData.avg_rank : 0);
    });

    const color = randomColorGenerator();

    return {
      label: productId,
      data: formattedData,
      borderColor: color,
      backgroundColor: hexToRGBA(color, 0.1),
      fill: true,
      pointStyle: 'circle',
      pointRadius: 3,
    };
  };

  return (
    <div
      className={styles.brandGraphContainer}
      style={{
        display: isHidden ? 'none' : 'flex',
        height: isHidden ? '10rem' : '50rem',
      }}
      data-test="brand-graph-container"
    >
      <div className={styles.brandGraphHeader}>
        <Typography
          variant="h5"
          fontSize="1.2rem"
          fontWeight={700}
          sx={{
            display: 'flex',
            minWidth: '20rem',
          }}
        >
          Time range:{' '}
          {isLoading ? (
            <SkeletonComponent
              animation="wave"
              variant="text"
              width="10rem"
              height={15}
            />
          ) : (
            formattedRangeFreq
          )}
        </Typography>

        <div
          className={styles.brandGraphButtons}
          data-test="brand-graph-container-button"
        >
          <Button
            className={styles.hideChartButton}
            disableRipple
            onClick={handleToggleHide}
          >
            Hide Chart
          </Button>

          <DownloadGraphButton
            chartData={data}
            chartImageRef={chartRef}
            filename={chartTitle}
            downloadOptionsRequired={true}
            iconButton={false}
            frequency={appliedSovFilters.frequency}
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
      <Divider />

      <Box
        className={styles.brandGraph}
        sx={{
          width: isSidebarMenuOpen ? 'calc(100% - 1rem)' : '100%',
          height: '90%',
        }}
        data-test="product-graph-body"
      >
        {chartData !== null && isLoading === false ? (
          <div ref={chartRef} className={styles.graph}>
            <Line
              data={chartData}
              options={options}
              className={styles.lineGraph}
            />
          </div>
        ) : (
          <Box>
            <SkeletonComponent
              animation="wave"
              variant="rounded"
              width="100%"
              height="40rem"
            />
          </Box>
        )}
      </Box>

      {expandGraph === true && chartData !== null && (
        <GraphDialog
          open={expandGraph}
          onClose={handleExpandClose}
          label={chartTitle}
          chartData={data}
        >
          <Line
            data={chartData}
            options={options}
            className={styles.lineGraph}
          />
        </GraphDialog>
      )}
    </div>
  );
}
