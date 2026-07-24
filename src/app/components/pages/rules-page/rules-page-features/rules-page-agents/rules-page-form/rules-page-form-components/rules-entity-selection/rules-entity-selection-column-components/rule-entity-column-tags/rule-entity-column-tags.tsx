import ColumnTags from '@/app/components/common/column-tags/column-tags';
import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RuleEntityTypeIdEnum } from '@/enums/rules.enum';
import { WalmartCampaignStatusEnum } from '@/enums/walmart.enums';
import { ILinkableEntity } from '@/interfaces/rules/rules.interfaces';
import { convertToLowerCase, getTitleCaseString } from '@/utils';
import {
  CaretLeftIcon,
  CaretRightIcon,
  CircleIcon,
  MegaphoneSimpleIcon,
} from '@phosphor-icons/react';
import { CellContext } from '@tanstack/react-table';
import React, { useState } from 'react';
import styles from './rule-entity-column-tags.module.scss';

interface IRuleEntityColumnTagsProps {
  props: CellContext<ILinkableEntity, unknown>;
  entityType: RuleEntityTypeIdEnum;
}

export const RuleEntityColumnTags = ({
  props,
  entityType,
}: IRuleEntityColumnTagsProps) => {
  const status = props.row.original.status;
  const row = props.row;
  const existingRules = props.row.original.existingRules;

  const [currentRuleIndex, setCurrentRuleIndex] = useState(0);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleNext = () => {
    if (existingRules) {
      setCurrentRuleIndex((prev) =>
        prev < existingRules.length - 1 ? prev + 1 : 0
      );
    }
  };

  const handlePrev = () => {
    if (existingRules) {
      setCurrentRuleIndex((prev) =>
        prev > 0 ? prev - 1 : existingRules.length - 1
      );
    }
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentRuleIndex(index);
  };

  const handleMouseEnter = () => setIsPopoverOpen(true);
  const handleMouseLeave = () => setIsPopoverOpen(false);

  return (
    <span className={styles.columnTags}>
      <span>
        <ColumnTags
          tagArray={[row.original.adType, row.original.targetingType]}
        />
      </span>
      {(convertToLowerCase(status) ===
        WalmartCampaignStatusEnum.LIVE.toLowerCase() ||
        convertToLowerCase(status) ===
          WalmartCampaignStatusEnum.ENABLED.toLowerCase()) && (
        <HoverInfoTooltip title={getTitleCaseString(status)}>
          <CircleIcon color="#0AAE57" weight="fill" size={'1.4rem'} />
        </HoverInfoTooltip>
      )}
      {existingRules && existingRules.length > 0 && (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <MegaphoneSimpleIcon
                size={'1.6rem'}
                color="#77469b"
                className={styles.existingRulesIcon}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="center"
            sideOffset={-1}
            className={styles.popoverContent}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ zIndex: isPopoverOpen ? 1201 : 'initial' }}
          >
            <div className={styles.tooltipContent}>
              <div className={styles.carouselContainer}>
                {existingRules.map((rule, index) => (
                  <div
                    key={index}
                    className={`${styles.carouselSlide} ${
                      index === currentRuleIndex ? styles.active : ''
                    }`}
                  >
                    <span className={styles.ruleTitle}>
                      Existing Rule Information:
                    </span>
                    <br />
                    <span className={styles.label}>Rule Name: </span>
                    {rule.ruleName}
                    <br />
                    <span className={styles.label}>Type: </span>
                    {getTitleCaseString(rule.ruleType)} <br />
                    <span className={styles.label}>Rule Status: </span>
                    {getTitleCaseString(rule.status)}
                    <br />
                    <span className={styles.label}>Frequency: </span>
                    {getTitleCaseString(rule.executionSchedule?.frequency)}
                    <br />
                  </div>
                ))}
              </div>

              {existingRules.length > 1 && (
                <React.Fragment>
                  <div className={styles.carouselNavigation}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handlePrev();
                      }}
                      aria-label="Previous rule"
                    >
                      <CaretLeftIcon size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleNext();
                      }}
                      aria-label="Next rule"
                    >
                      <CaretRightIcon size={14} />
                    </button>
                  </div>

                  <div className={styles.carouselIndicators}>
                    {existingRules.map((_, index) => (
                      <div
                        key={index}
                        className={`${styles.indicator} ${
                          index === currentRuleIndex ? styles.active : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleIndicatorClick(index);
                        }}
                      />
                    ))}
                  </div>
                </React.Fragment>
              )}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </span>
  );
};
