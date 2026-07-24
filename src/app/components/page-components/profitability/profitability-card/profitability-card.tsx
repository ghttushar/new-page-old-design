import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import SkeletonComponent from '@/app/components/common/skeleton/skeleton';
import { getProfitabilityCardIconStyles } from '@/app/components/pages/profitability-page/profitability-styles';
import CustomDateRangePickerWrapper from '@/app/components/shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import { customRangeFilterOption } from '@/constants';
import { Range } from '@/enums/serp.enums';
import { IProfitabilityCardProps } from '@/interfaces/profitability/profitability.interface';
import { IDateRange } from '@/interfaces/serp.interface';
import { getTitleCaseString } from '@/utils';
import { CalendarIcon, CaretDoubleRightIcon } from '@phosphor-icons/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';
import React, { useState } from 'react';
import styles from './profitability-card.module.scss';

const ProfitabilityCard = ({
  isSelected,
  index,
  title,
  dateRange,
  metrics,
  setSelectedCard,
  isLoading = false,
  isExpanded,
  setIsExpanded,
  onCustomDateRangeChange,
  selectedCustomDateRange,
}: IProfitabilityCardProps) => {
  const [open, setOpen] = useState(false);

  const handleDateChange = (selectedRange: IDropdownItem<Range>) => {
    return;
  };

  const toggleCalendar = () => {
    setOpen((prev) => !prev);
  };

  const handleCustomDateRangeChange = (customRange: IDateRange) => {
    if (onCustomDateRangeChange) {
      onCustomDateRangeChange(customRange);
    }
    setOpen(false);
  };

  const toggleExpand = () => {
    if (isLoading || metrics === null) return;
    if (isSelected === false) {
      setIsExpanded(true, index);
    } else {
      setIsExpanded(!isExpanded, index);
    }
  };

  const handleClick = () => setSelectedCard(index);
  const handleCalendarClick = (e: React.MouseEvent) => {
    // e.stopPropagation();
    // if (isLoading) return;
    // toggleCalendar();
    // TODO: Need to fix the calendar popup
    return;
  };

  return (
    <div className={styles.cardContainer} onClick={handleClick}>
      <div
        className={`${styles.cardHeader} ${
          isSelected ? styles.activeCard : ''
        }`}
      >
        <div className={styles.headerContent}>
          <h3 className={styles.title}>{getTitleCaseString(title)}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Popover open={open}>
              <PopoverTrigger asChild>
                <CalendarIcon
                  size={'1.4rem'}
                  weight="regular"
                  style={{
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    color: isSelected ? '#fff' : '#666',
                  }}
                  onClick={handleCalendarClick}
                />
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="start"
                sideOffset={8}
                style={{
                  borderRadius: '0.8rem',
                  background: 'white',
                  padding: '0.4rem 0.2rem 0.2rem',
                  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
                  zIndex: 100,
                  minHeight: 'auto',
                  color: '#464646',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <CustomDateRangePickerWrapper
                  title={''}
                  handleDateChange={handleDateChange}
                  setCustomDateRange={handleCustomDateRangeChange}
                  rangeOptions={[]}
                  externalTrigger={true}
                  open={open}
                  onOpenChange={toggleCalendar}
                  selectedCustomDateRange={selectedCustomDateRange}
                  defaultPreset={customRangeFilterOption}
                />
              </PopoverContent>
            </Popover>
            <span className={styles.dateRange}>{dateRange}</span>
          </div>

          <div
            className={styles.viewMore}
            onClick={toggleExpand}
            style={{
              cursor: metrics === null || isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            <CaretDoubleRightIcon
              size={'1.2rem'}
              weight="bold"
              style={getProfitabilityCardIconStyles(isSelected, isExpanded)}
            />
            View More
          </div>
        </div>
      </div>

      <div
        className={`${styles.cardContent} ${
          isSelected ? styles.activeCardContent : ''
        }`}
      >
        <div className={styles.metricsGrid}>
          {metrics?.map((metric, metricIndex) => (
            <React.Fragment key={`${metric.key}-${metricIndex}`}>
              <div className={styles.metricItem}>
                <span className={styles.metricsHeader}>
                  <span className={styles.metricLabel}>{metric.label}</span>
                </span>
                <div className={styles.metricValue}>
                  {isLoading ? (
                    <SkeletonComponent
                      animation="wave"
                      variant="text"
                      width={'6rem'}
                      height={'3rem'}
                      color="#f4f4f4"
                    />
                  ) : (
                    <span
                      className={`${styles.amount} ${
                        isSelected ? styles.activeValue : ''
                      }`}
                    >
                      {metric.currValue}
                    </span>
                  )}
                </div>
              </div>
              <span className={styles.vl}></span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProfitabilityCard);
