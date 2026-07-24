import { Range } from '@/enums/serp.enums';
import { IDateRange } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import React from 'react';
import { isCustomDateRangeSet } from 'src/utils/datetime.utils';
import DateRangeModal from '../date-picker/date-picker';
import { IDropdownItem, IDropdownProps } from '../dropdown/dropdown';

interface IDateRangePickerWrapperProps<T> {
  children: React.ReactElement<IDropdownProps<T>>;
  rangeFilter: IDropdownItem<T>;
  previousRangeState: IDropdownItem<T> | null;
  fallbackRangeState: IDropdownItem<T>;
  customDateRange: IDateRange;
  showDateRangeModal: boolean;
  setShowDateRangeModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetCustomDateRangeForModal: (dateRange: IDateRange) => void;
  handleRangeChange: (value: IDropdownItem<T>) => void;
  minDateForDateRange?: string;
  maxDateForDateRange?: string;
}

export default function DateRangePickerWrapper<T>({
  children,
  rangeFilter,
  previousRangeState,
  fallbackRangeState,
  customDateRange,
  showDateRangeModal = true,
  setShowDateRangeModal,
  handleSetCustomDateRangeForModal,
  handleRangeChange,
  minDateForDateRange,
  maxDateForDateRange,
}: IDateRangePickerWrapperProps<T>) {
  const handleCloseModal = () => {
    setShowDateRangeModal(false);
  };

  const handleClickedOutsideModal = () => {
    if (
      rangeFilter.value === Range.CUSTOM_RANGE &&
      previousRangeState !== null &&
      !isCustomDateRangeSet(customDateRange)
    ) {
      handleRangeChange(previousRangeState);
    } else {
      handleRangeChange(fallbackRangeState);
    }

    handleCloseModal();
  };

  return (
    <React.Fragment>
      {children}

      {showDateRangeModal && (
        <DateRangeModal
          customDateRange={customDateRange}
          closeModal={handleCloseModal}
          handleClickedOutsideModal={handleClickedOutsideModal}
          setCustomDateRange={(dateRange) =>
            handleSetCustomDateRangeForModal(dateRange)
          }
          minDate={minDateForDateRange}
          maxDate={maxDateForDateRange}
        />
      )}
    </React.Fragment>
  );
}
