import { FILTER_DISABLE_CONFIG } from '@/constants/filter.constants';
import { LogsTableColumns } from '@/constants/table-columns/logs-table-colmns.constant';
import { LogsTitlesEnum } from '@/enums/logs.enums';
import { FadersIcon } from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectShowFilterModal,
  setShowFilterModal,
} from 'src/redux/slices/filters/filter.slice';
import { rowFilters } from 'src/utils/row-filter.utils';
import DownloadTableButton from '../../common/download-button/download-table-button';
import RowFilterWrapper from '../../common/row-filter/row-filter-wrapper';
import SearchText from '../../common/search/debounce-search';
import SecondaryButton from '../../common/secondary-button/secondary-button';
import styles from './logs-filter-wrapper.module.scss';

interface ICatalogFilterWrapperProps {
  title: string;
  exportFileName: string;
  handleDownload: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
  isDataLoaded: boolean;
  searchText: string;
  setSearchText: (value: string) => void;
}

export default function LogsFilterWrapper({
  title,
  exportFileName,
  handleDownload,
  isDataLoaded,
  searchText,
  setSearchText,
}: ICatalogFilterWrapperProps) {
  const filterRef = useRef<HTMLDivElement>(null);
  const [disabled, setDisabled] = useState(false);
  const dispatch = useAppDispatch();
  const showFilterModal = useAppSelector(selectShowFilterModal);
  const toggleModal = () => {
    dispatch(setShowFilterModal(!showFilterModal));
  };
  const color = disabled ? '#bfbfbf' : '#464646';

  return (
    <div className={styles.filterContainer}>
      <div className={styles.actionContainer}>
        <SearchText
          placeholder="Search logs"
          height="3rem"
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <div className={styles.filterAnchor} ref={filterRef}>
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
      </div>
      <div className={styles.actionContainer}>
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
