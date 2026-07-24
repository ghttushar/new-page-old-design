import SkeletonComponent from '../skeleton/skeleton';
import styles from './graph-loading-state.module.scss';

interface IGraphLoadingStateProps {
  bars?: number;
  yAxisPoints?: number;
}

const yAxisLabels = (yAxisPoints?: number) => (
  <div className={styles.yAxisContainer}>
    {Array.from({ length: yAxisPoints ?? 10 }, (_, index) => (
      <SkeletonComponent
        key={index}
        className={styles.yAxisLabel}
        animation="wave"
        color="#f4f4f4"
      />
    ))}
  </div>
);
const GraphLoadingComponent = (props: IGraphLoadingStateProps) => {
  const { bars, yAxisPoints } = props;
  return (
    <div className={styles.container}>
      {yAxisLabels(yAxisPoints)}

      <div className={styles.chartArea}>
        <div className={styles.barsContainer}>
          {Array.from({ length: bars ?? 10 }, (_, index) => (
            <SkeletonComponent
              key={`bar-${index}`}
              height={330 + 5 * index * (index % 2 === 0 ? 1 : -1)}
              width={'2rem'}
              animation="wave"
              color="#f4f4f4"
            />
          ))}
        </div>
        <SkeletonComponent
          className={styles.xAxisContainer}
          animation="wave"
          color="#f4f4f4"
        />
      </div>
      {yAxisLabels(yAxisPoints)}
    </div>
  );
};

export default GraphLoadingComponent;
