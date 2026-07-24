import { ApexOptions } from 'apexcharts';
import { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { IDaypartingMetricsData } from 'src/interfaces/day-parting.interfaces';
import { useAppSelector } from 'src/redux/hooks';
import { selectIsSidebarMenuOpen } from 'src/redux/slices/auth/auth.slice';
import { getHeatMapSeries } from 'src/utils/day-parting.utils';
import styles from './dayparting-graph.module.scss';

interface IHeatMapProps {
  data: IDaypartingMetricsData[];
  metric: string;
}

const HeatMap = (props: IHeatMapProps) => {
  const { data, metric } = props;
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      height: '100%',
      width: '100%',
      type: 'heatmap',
    },
    dataLabels: {
      enabled: false,
    },
    colors: ['#77469B', '#6B3494'],
  });

  const isSidebarMenuOpen = useAppSelector(selectIsSidebarMenuOpen);

  return (
    <div
      id="heatmap"
      className={styles.heatmap}
      style={{
        width: isSidebarMenuOpen ? 'calc(100% - 1rem)' : '100%',
      }}
    >
      <ReactApexChart
        options={options}
        series={getHeatMapSeries(data, metric)}
        type="heatmap"
        height={'100%'}
        min-width={0}
        width={'100%'}
      />
    </div>
  );
};

export default HeatMap;
