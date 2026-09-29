import styles from './campaign-creator-stepper.module.scss';

export interface CcStepMeta {
  id: string;
  label: string;
}

export function CampaignCreatorStepper({
  steps, activeStepId, furthestIndex, onSelect,
}: {
  steps: CcStepMeta[]; activeStepId: string; furthestIndex: number; onSelect: (id: string) => void;
}) {
  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => {
        const isCompleted = index < furthestIndex;
        const isActive = step.id === activeStepId;
        const isClickable = index <= furthestIndex;
        return (
          <div key={step.id} className={styles.stepRow}>
            <div className={styles.stepIndicatorColumn}>
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onSelect(step.id)}
                className={`${styles.stepDot} ${isActive ? styles.stepDotActive : ''} ${isCompleted ? styles.stepDotCompleted : ''}`}
              >
                {isCompleted ? '✓' : index}
              </button>
              {index < steps.length - 1 && <div className={`${styles.stepLine} ${isCompleted ? styles.stepLineFilled : ''}`} />}
            </div>
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onSelect(step.id)}
              className={`${styles.stepLabel} ${isActive ? styles.stepLabelActive : ''}`}
            >
              {step.label}
            </button>
          </div>
        );
      })}
    </div>
  );
}
