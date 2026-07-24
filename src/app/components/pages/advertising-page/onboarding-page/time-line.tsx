import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  OnboardingStep,
  selectActiveStep,
  selectFillIndex,
  selectIsAmazonAdvertisingConnected,
  selectStepsData,
} from 'src/redux/slices/onboarding/onboarding.slice';
import styles from './time-line.module.scss';
const TimeLine = () => {
  const stepsData = useAppSelector(selectStepsData);
  const fillIndex = useAppSelector(selectFillIndex);
  const activeStep = useAppSelector(selectActiveStep);
  const isAmazonAdvertisingConnected = useAppSelector(
    selectIsAmazonAdvertisingConnected
  );
  const dispatch = useAppDispatch();

  const getLeftPercentage = (index: number) => {
    return (index / (stepsData.length - 1)) * 100;
  };

  const getCompletedFillStyle = (index: number) => {
    if (
      isAmazonAdvertisingConnected.isAdvertisingConnected &&
      index < fillIndex
    ) {
      return styles.completedDot;
    } else if (
      isAmazonAdvertisingConnected.isSPDataConnected &&
      index < fillIndex
    ) {
      return styles.completedDot;
    } else if (
      isAmazonAdvertisingConnected.isAdvertisingConnected &&
      isAmazonAdvertisingConnected.isSPDataConnected
    ) {
      return styles.completedDot;
    } else {
      return '';
    }
  };

  const getActiveFillStyle = (id: string) => {
    if (activeStep === OnboardingStep.COMPLETED) return styles.completedDot;
    return activeStep === id ? styles.activeDot : '';
  };

  const getCursorStyle = (id: string) => {
    if (activeStep === OnboardingStep.COMPLETED) return 'default';
    return activeStep === id ? 'pointer' : 'default';
  };

  return (
    <div className={styles.timeLineContainer}>
      <div
        className={styles.timeLineLine}
        style={{
          background: `linear-gradient(to right, #77469b 0%, #77469b ${getLeftPercentage(
            fillIndex
          )}%, #dadeeb ${getLeftPercentage(fillIndex)}%, #dadeeb 100%)`,
        }}
      >
        {stepsData.map((step, index) => (
          <div key={index}>
            {' '}
            <div
              className={`
              ${styles.timeLineDot} 
              ${getActiveFillStyle(step.id)} 
              ${getCompletedFillStyle(index)}`}
              style={{
                left: `${getLeftPercentage(index)}%`,
                cursor: getCursorStyle(step.id),
              }}
            ></div>
            <div
              className={styles.timeLineStepText}
              style={{
                left: `${getLeftPercentage(index)}%`,
              }}
            >
              {step.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TimeLine;
