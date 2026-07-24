import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import moment from 'moment';
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  DATE_FORMAT_3,
  FALLBACK_DATE_FORMAT,
} from 'src/constants/datetime.constants';
import { IDateRange } from 'src/interfaces/serp.interface';
import { checkMomentDateValidity, getCurrentDateTime } from 'src/utils';
import styles from './date-picker.module.scss';

export interface IDateRangeModalProps {
  setCustomDateRange: (range: IDateRange) => void;
  closeModal: () => void;
  handleClickedOutsideModal: () => void;
  customDateRange: IDateRange;
  minDate?: string;
  maxDate?: string;
}

const disableStyle = {
  cursor: 'not-allowed',
  backgroundColor: 'rgba(0, 0, 0, 0.12)',
  pointerEvents: 'initial',
  color: '#ccc',
} as DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

const DateRangeModal: React.FC<IDateRangeModalProps> = ({
  setCustomDateRange,
  closeModal,
  handleClickedOutsideModal,
  customDateRange,
  minDate = '',
  maxDate = `${getCurrentDateTime().split('_')[0]}`,
}) => {
  const [dateRange, setDateRange] = useState<IDateRange>(customDateRange);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (
      event.target.name === 'startDate' &&
      dateRange.endDate &&
      event.target.value > dateRange.endDate
    ) {
      setDateRange({
        startDate: event.target.value,
        endDate: '',
      });
      return;
    }

    setDateRange({
      ...dateRange,
      [event.target.name]: event.target.value,
    });
  };

  const modalPopupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickedOutside = (event: MouseEvent) => {
      if (
        modalPopupRef.current &&
        !modalPopupRef.current.contains(event.target as Node)
      ) {
        handleClickedOutsideModal();
      }
    };

    document.body.addEventListener('click', handleClickedOutside);

    return () => {
      document.body.removeEventListener('click', handleClickedOutside);
    };
  }, [handleClickedOutsideModal]);

  const checkDateRangeValid = () => {
    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate || new Date(startDate) > new Date(endDate)) {
      return false;
    }
    return startDate.length > 0 && endDate.length > 0;
  };

  const onSelect = () => {
    if (!checkDateRangeValid()) {
      return;
    }
    const range: IDateRange = {
      startDate: checkMomentDateValidity(dateRange.startDate)
        ? moment(dateRange.startDate).format(DATE_FORMAT_3)
        : FALLBACK_DATE_FORMAT,
      endDate: checkMomentDateValidity(dateRange.endDate)
        ? moment(dateRange.endDate).format(DATE_FORMAT_3)
        : FALLBACK_DATE_FORMAT,
    };
    setCustomDateRange(range);
    closeModal();
  };

  return (
    <div className={styles.modalOverlay}>
      <div
        className={`${styles.modalContent} ${styles.dateRange}`}
        ref={modalPopupRef}
      >
        <div className={styles.inputWrapper}>
          <input
            aria-label="start-date"
            className={`${styles.modalInput}`}
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={onChangeHandler}
            min={minDate}
            max={maxDate}
          />

          <CompareArrowsIcon
            style={{
              margin: '0 1rem',
            }}
          />

          <input
            aria-label="end-date"
            className={`${styles.modalInput}`}
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={onChangeHandler}
            min={dateRange.startDate || ''}
            max={maxDate}
            disabled={!dateRange.startDate}
          />
        </div>
        <button
          className={`${styles.modalBtn} ${styles.btn}`}
          onClick={onSelect}
          style={checkDateRangeValid() ? {} : disableStyle}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default DateRangeModal;
