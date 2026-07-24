import { FILTER_DISABLE_CONFIG } from '@/constants/filter.constants';
import { LogsTableColumns } from '@/constants/table-columns/logs-table-colmns.constant';
import { LogsTitlesEnum } from '@/enums/logs.enums';
import { Range } from '@/enums/serp.enums';
import { IDateRange } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { selectLogsHeaderFilters } from '@/redux/slices/logs/logs.slice';
import { FadersIcon } from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectShowFilterModal,
  setShowFilterModal,
} from 'src/redux/slices/filters/filter.slice';
import { rowFilters } from 'src/utils/row-filter.utils';
import DownloadTableButton from '../../common/download-button/download-table-button';
import { IDropdownItem } from '../../common/dropdown/dropdown';
import RowFilterWrapper from '../../common/row-filter/row-filter-wrapper';
import SecondaryButton from '../../common/secondary-button/secondary-button';
import CustomDateRangePickerWrapper from '../../shared/custom-daterange-picker/custom-date-range-picker-wrapper';
import styles from './logs-filter-wrapper.module.scss';

interface ICatalogFilterWrapperProps {
  title: string;
  onRangeSelect: (dateRange: IDropdownItem<Range>) => void;
  exportFileName: string;
  handleCustomDateRangeChange: (range: IDateRange) => void;
  handleDownload: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
  isDataLoaded: boolean;
  rangeOptions: IDropdownItem<string>[];
}

export default function LogsFilterWrapper({
  title,
  exportFileName,
  handleDownload,
  isDataLoaded,
  onRangeSelect,
  handleCustomDateRangeChange,
  rangeOptions,
}: ICatalogFilterWrapperProps) {
  const filterRef = useRef<HTMLDivElement>(null);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useAppDispatch();
  const showFilterModal = useAppSelector(selectShowFilterModal);
  const toggleModal = () => {
    dispatch(setShowFilterModal(!showFilterModal));
  };
  const color = disabled ? '#bfbfbf' : '#464646';
  const headerFilters = useAppSelector(selectLogsHeaderFilters);

  return (
    <div className={styles.filterContainer}>
      <div className={styles.actionContainer}>
        <CustomDateRangePickerWrapper
          title={'Date Range'}
          handleDateChange={onRangeSelect}
          setCustomDateRange={handleCustomDateRangeChange}
          rangeOptions={rangeOptions}
          dropShadow={true}
          defaultPreset={headerFilters.range}
          selectedCustomDateRange={headerFilters.customDateRange}
        />
        <div style={{ position: 'relative' }} ref={filterRef}>
          {showFilterModal && (
            <RowFilterWrapper
              handleModalClose={toggleModal}
              filterConfig={rowFilters.getFilterConfigByNewTableColumns(
                LogsTableColumns,
                LogsTitlesEnum.LOGS_HOME
              )}
              isDataLoaded={isDataLoaded}
              selectedAdvertisingNavTitle={LogsTitlesEnum.LOGS_HOME}
              disableFilterConfig={FILTER_DISABLE_CONFIG.LogsTable}
            />
          )}

          <SecondaryButton
            buttonText={'Filters'}
            isButtonIconRequired={true}
            buttonIcon={<FadersIcon size={15} weight="fill" color={color} />}
            buttonFunction={toggleModal}
            disabled={disabled}
            height="3rem"
          />
        </div>

        <DownloadTableButton
          hoverInfoText="Download CSV"
          data={[]}
          filename={exportFileName}
          squareDimension="3rem"
          enclosingCharacter='"'
          title={title}
          handleDownload={handleDownload}
        />
      </div>
    </div>
  );
}
