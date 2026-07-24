import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import { QueryKeyEnums } from '@/enums/query.enums';
import useContainerCollapseAnimation from '@/hooks/use-container-collapse-animation';
import {
  IRuleCriteriaDetails,
  IRulesTemplateDetails,
  IRuleTypesTemplatesDetails,
} from '@/interfaces/rules/rules.interfaces';
import { useAppQuery } from '@/redux/react-query-hooks';
import rulesServices from '@/services/rules/rules.services';
import { checkIsEqual } from '@/utils/advertising.utils';
import {
  getCompressedConditionText,
  getCompressedCriteriaAction,
} from '@/utils/rules.utils';
import {
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
} from '@phosphor-icons/react';
import { useEffect, useMemo, useState } from 'react';
import styles from './suggested-templates.module.scss';

interface ISuggestedTemplatesProps {
  templates: IRuleTypesTemplatesDetails[];
  onApplyTemplate?: (templateId: string) => void;
  isApplyDisabled?: boolean;
  applyTooltipText?: string;
  currentCriteriaMap?: Map<string, IRuleCriteriaDetails> | null;
}

export default function SuggestedTemplates({
  templates,
  onApplyTemplate,
  isApplyDisabled = false,
  applyTooltipText = '',
  currentCriteriaMap,
}: ISuggestedTemplatesProps) {
  const [containerOpen, setContainerOpen] = useState<boolean>(false);
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState<number>(0);
  const [showCriteria, setShowCriteria] = useState<boolean>(false);
  const [templateDetails, setTemplateDetails] =
    useState<IRulesTemplateDetails | null>(null);

  const { containerRef, containerCollapseAnimationStyles } =
    useContainerCollapseAnimation(containerOpen, showCriteria);

  const currentTemplate = templates[currentTemplateIndex];

  // Fetch template details with criteria
  const { data: templateDetailsData, isLoading: isTemplateDetailsLoading } =
    useAppQuery({
      queryKey: [
        QueryKeyEnums.FETCH_TEMPLATE_BY_TEMPLATE_ID,
        currentTemplate?.id ?? '',
      ],
      queryFn: ({ signal }) => {
        return rulesServices.getTemplateByTemplateId(currentTemplate.id);
      },
      enabled: !!currentTemplate?.id && templates.length > 0,
      options: {
        refetchOnMount: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    });

  // Update template details when data is fetched
  useEffect(() => {
    if (templateDetailsData?.data?.data) {
      setTemplateDetails(templateDetailsData.data.data);
    }
  }, [templateDetailsData]);

  const isTemplateApplied = useMemo(() => {
    if (!templateDetails?.criteriaSets || !currentCriteriaMap) return false;

    if (templateDetails.criteriaSets.length !== currentCriteriaMap.size)
      return false;

    const normalize = (list: IRuleCriteriaDetails[]) => {
      return list.map((item) => {
        // Remove IDs and rule specific fields used for tracking
        const { id, ruleId, criteriaOrder, conditions, ...rest } = item;
        const normConditions = conditions.map((c) => {
          const { id, ...cRest } = c;
          return cRest;
        });
        return { ...rest, conditions: normConditions };
      });
    };

    const templateData = normalize(templateDetails.criteriaSets);
    const currentData = normalize(Array.from(currentCriteriaMap.values()));

    return checkIsEqual(templateData, currentData);
  }, [templateDetails, currentCriteriaMap]);

  const handleContainerToggle = () => setContainerOpen(!containerOpen);

  const handleNext = () => {
    setCurrentTemplateIndex((prev) =>
      prev < templates.length - 1 ? prev + 1 : prev
    );
    setShowCriteria(false);
  };

  const handlePrev = () => {
    setCurrentTemplateIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setShowCriteria(false);
  };

  const handleToggleCriteria = () => setShowCriteria(!showCriteria);

  const handleApply = () => {
    if (onApplyTemplate && currentTemplate) {
      onApplyTemplate(currentTemplate.id);
    }
  };

  // Helper function to format criteria for display
  const formatCriteriaForDisplay = (
    criteria: IRuleCriteriaDetails
  ): { title: string; condition: string; action: string } => {
    return {
      title: criteria.criteriaName,
      condition: getCompressedConditionText(criteria.conditions),
      action: getCompressedCriteriaAction(criteria.action),
    };
  };

  if (templates.length === 0) {
    return null;
  }

  return (
    <div
      className={`${styles.suggestedTemplatesContainer} ${
        containerOpen ? styles.expanded : ''
      }`}
    >
      <div className={styles.headerContainer} onClick={handleContainerToggle}>
        <p
          className={`${styles.title} ${!containerOpen ? styles.noMargin : ''}`}
        >
          Suggested Templates
        </p>

        <CaretUpIcon
          className={`${styles.caretIcon} ${
            containerOpen ? styles.expanded : ''
          }`}
          size={'1.4rem'}
          color="#464646"
          weight="bold"
        />
      </div>

      <div
        className={styles.contentContainer}
        ref={containerRef}
        style={containerCollapseAnimationStyles}
      >
        {currentTemplate && (
          <div className={styles.templateCard}>
            {/* Carousel Header with Navigation */}
            <div className={styles.carouselHeader}>
              <button
                className={styles.navButton}
                onClick={handlePrev}
                disabled={currentTemplateIndex === 0}
              >
                <CaretLeftIcon size={'1.5rem'} color="#464646" />
              </button>

              <p className={styles.templateTitle}>
                {currentTemplate.ruleTypeName}
              </p>

              <button
                className={styles.navButton}
                onClick={handleNext}
                disabled={currentTemplateIndex === templates.length - 1}
              >
                <CaretRightIcon size={'1.5rem'} color="#464646" />
              </button>
            </div>

            {/* Template Description */}
            <p className={styles.templateDescription}>
              {currentTemplate.description}
            </p>

            {/* Criteria Cards - Only show when showCriteria is true and template details are loaded */}
            {showCriteria && templateDetails?.criteriaSets && (
              <div className={styles.criteriaContainer}>
                {templateDetails.criteriaSets.map((criteria, index: number) => {
                  const formattedCriteria = formatCriteriaForDisplay(criteria);
                  return (
                    <div key={index} className={styles.criteriaCard}>
                      <p className={styles.criteriaTitle}>
                        {formattedCriteria.title}
                      </p>
                      <p className={styles.criteriaLabel}>Condition:</p>
                      <p className={styles.criteriaValue}>
                        {formattedCriteria.condition}
                      </p>
                      <p className={styles.criteriaLabel}>Action:</p>
                      <p className={styles.criteriaValue}>
                        {formattedCriteria.action}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer with View/Hide Criteria and Apply Button */}
            <div className={styles.footerContainer}>
              <span
                className={styles.showLessLink}
                onClick={handleToggleCriteria}
              >
                {showCriteria ? 'Show less' : 'View criteria'}
              </span>

              <PrimaryButton
                buttonText={isTemplateApplied ? 'Applied' : 'Apply'}
                buttonFunction={handleApply}
                disabled={isApplyDisabled || isTemplateApplied}
                width="6rem"
                height="2.4rem"
                fontSize="1rem"
                fontWeight="600"
                bgColor="linear-gradient(99.66deg, #894DB5 4.22%, #6205A7 89%);"
                isHoverTooltipEnabled={isApplyDisabled}
                tooltipText={applyTooltipText}
              />
            </div>

            {/* Carousel Dots */}
            <div className={styles.dotsContainer}>
              {templates.map((_, index) => (
                <div
                  key={index}
                  className={styles.dot}
                  style={{
                    width: index === currentTemplateIndex ? '32px' : '6px',
                    background:
                      index === currentTemplateIndex
                        ? 'linear-gradient(99.66deg, #6205A7 6.77%, #894DB5 97.21%)'
                        : '#D9D9D9',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
