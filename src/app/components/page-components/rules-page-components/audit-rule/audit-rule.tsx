import BaseLottieAnimation from '@/app/components/common/loader/base-lottie-animation';
import { lottieFiles } from '@/constants/assets/lotties.utils';
import { AuditStatusEnum } from '@/enums/rules.enum';
import useContainerCollapseAnimation from '@/hooks/use-container-collapse-animation';
import { IAuditWarning } from '@/interfaces/rules/rules.interfaces';
import {
  CaretUpIcon,
  ShieldIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import styles from './audit-rule.module.scss';

interface IAuditRuleProps {
  onAuditClick?: () => void;
  auditStatus?: AuditStatusEnum;
  warnings?: IAuditWarning[];
  isDisabled?: boolean;
  hasTemplatesAbove?: boolean;
}

export default function AuditRule({
  onAuditClick,
  auditStatus = AuditStatusEnum.IDLE,
  warnings = [],
  isDisabled = false,
  hasTemplatesAbove = false,
}: IAuditRuleProps) {
  const [containerOpen, setContainerOpen] = useState<boolean>(false);

  const { containerRef, containerCollapseAnimationStyles } =
    useContainerCollapseAnimation(containerOpen, auditStatus);

  // Auto-open container when audit status changes from idle
  useEffect(() => {
    if (auditStatus !== AuditStatusEnum.IDLE) {
      setContainerOpen(true);
    }
  }, [auditStatus]);

  const handleContainerToggle = () => setContainerOpen(!containerOpen);

  const handleAuditClick = () => {
    if (onAuditClick) {
      onAuditClick();
    }
  };

  // Render different states
  const renderContent = () => {
    switch (auditStatus) {
      case AuditStatusEnum.PROCESSING:
        return (
          <div className={styles.statusContainer}>
            <div className={styles.statusBox} data-status="processing">
              <div className={styles.statusIcon}>
                <BaseLottieAnimation
                  lottieFile={lottieFiles.checkProgress}
                  style={{ height: '5.2rem', width: '5.2rem' }}
                  lottieOptions={{ loop: true, autoplay: true }}
                />
              </div>
              <p className={styles.statusMessage}>
                JiVA is auditing this rule for conflicts and performance
                risks...
              </p>
            </div>
          </div>
        );

      case AuditStatusEnum.SUCCESS:
        return (
          <div className={styles.statusContainer}>
            <div className={styles.statusBox} data-status="success">
              <div className={styles.statusIcon}>
                <BaseLottieAnimation
                  lottieFile={lottieFiles.checkSuccess}
                  style={{ height: '5.2rem', width: '5.2rem' }}
                  lottieOptions={{ loop: false, autoplay: true }}
                />
              </div>
              <p className={styles.statusMessage}>
                Everything looks good. Rule is ready to go.
              </p>
            </div>
          </div>
        );

      case AuditStatusEnum.WARNING:
        return (
          <div className={styles.warningContainer}>
            <div className={styles.warningList}>
              {warnings.map((warning, index) => (
                <div key={index} className={styles.warningItem}>
                  <div className={styles.warningIcon}>
                    <WarningCircleIcon size="1.5rem" color="#FFAF38" />
                  </div>
                  <div className={styles.warningContent}>
                    <p className={styles.warningTitle}>
                      <strong>{warning.criteriaTitle}:</strong>{' '}
                      {warning.condition}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`${styles.auditRuleContainer} ${
        hasTemplatesAbove ? styles.withTemplatesAbove : ''
      }`}
    >
      {/* Audit Button - Always visible */}
      <button
        className={styles.auditButton}
        onClick={handleAuditClick}
        disabled={isDisabled}
      >
        <ShieldIcon size="2rem" color="#464646" weight="regular" />
        <span>Audit Rule</span>
      </button>

      {/* Collapsible Container for Results - Separate Box */}
      {auditStatus !== AuditStatusEnum.IDLE && (
        <div
          className={`${styles.resultsBox} ${
            containerOpen ? styles.expanded : ''
          }`}
        >
          <div
            className={styles.headerContainer}
            onClick={handleContainerToggle}
          >
            <p className={styles.title}>
              {auditStatus === AuditStatusEnum.PROCESSING && 'Audit running'}
              {auditStatus === AuditStatusEnum.SUCCESS && 'Audit Result'}
              {auditStatus === AuditStatusEnum.WARNING && 'Audit Result'}
            </p>
            <CaretUpIcon
              className={`${styles.caretIcon} ${
                containerOpen ? styles.expanded : ''
              }`}
              size="1.4rem"
              color="#464646"
              weight="bold"
            />
          </div>

          <div
            className={styles.contentContainer}
            ref={containerRef}
            style={containerCollapseAnimationStyles}
          >
            <div className={styles.auditCard}>{renderContent()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
