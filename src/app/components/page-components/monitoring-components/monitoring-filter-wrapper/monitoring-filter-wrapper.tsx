import DownloadTableButton from '@/app/components/common/download-button/download-table-button';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import { IFilterSetting } from '@/constants/filter.constants';
import { CronDefinitionsTableTitlesEnum } from '@/enums/cron/cron-definitions.enum';
import { MonitoringTableTitlesEnum } from '@/enums/monitoring.enum';
import { formatStringToTitleCase } from '@/utils';
import { getDynamicValuesFilterSettings } from '@/utils/row-filter.utils';
import {
  ArrowCounterClockwiseIcon,
  ColumnsIcon,
  FadersIcon,
} from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import React, { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectAppliedFilters,
  selectDynamicFilterValuesByFilterKey,
  selectShowFilterModal,
  setShowFilterModal,
} from 'src/redux/slices/filters/filter.slice';
import AddedFiltersTab from '../../../common/added-filters-tab/added-filters-tab';
import PrimaryIconButton from '../../../common/primary-icon-button/primary-icon-button';
import RowFilterWrapper from '../../../common/row-filter/row-filter-wrapper';
import ServerSearch from '../../../common/search/server-search';
import SecondaryButton from '../../../common/secondary-button/secondary-button';
import NewColumnFilterWrapper from '../../column-filter/new-column-filter-wrapper';
import styles from './monitoring-filter-wrapper.module.scss';

interface IMonitoringFilterWrapperProps<T> {
  title: string;
  exportFileName: string;
  handleDownload: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
  onSearchChangeAdditionalLogic: () => void;
  isLoading: boolean;
  handleSelectedColumns: (selectedColumns: Array<ColumnDef<T>>) => void;
  selectedColumns: ColumnDef<T>[];
  initialColumns: ColumnDef<T>[];
  handleRefetch: (isSync?: boolean) => void;
  filterConfig: IFilterSetting[];
  selectedNavTab: MonitoringTableTitlesEnum;
}

export default function MonitoringFilterWrapper<T>({
  title,
  exportFileName,
  handleDownload,
  onSearchChangeAdditionalLogic,
  handleSelectedColumns,
  isLoading,
  selectedColumns,
  initialColumns,
  handleRefetch,
  filterConfig,
  selectedNavTab,
}: Readonly<IMonitoringFilterWrapperProps<T>>) {
  const filterRef = useRef<HTMLDivElement>(null);
  const columnFilterRef = useRef<HTMLDivElement>(null);
  const dynamicFilters = useAppSelector(selectDynamicFilterValuesByFilterKey);

  const dispatch = useAppDispatch();
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const showFilterModal = useAppSelector(selectShowFilterModal);

  const [showColumnFilter, setShowColumnFilter] = useState<boolean>(false);

  const toggleModal = () => {
    dispatch(setShowFilterModal(!showFilterModal));
    if (showColumnFilter) handleToggleColumnFilter();
  };

  const handleToggleColumnFilter = () => {
    setShowColumnFilter(!showColumnFilter);
    if (showFilterModal) toggleModal();
  };

  return (
    <React.Fragment>
      <div className={styles.tableHeader}>
        <PrimaryIconButton
          buttonFunction={() => handleRefetch(false)}
          disabled={isLoading}
          buttonIcon={
            <ArrowCounterClockwiseIcon size={'2.8rem'} color="#464646" />
          }
          height="3rem"
          width="3rem"
        />

        <ServerSearch
          title={selectedNavTab}
          handleCustomSearchChange={onSearchChangeAdditionalLogic}
        />

        <div className={styles.rowFilter} ref={filterRef}>
          <SecondaryButton
            buttonText={'Filters'}
            buttonFunction={toggleModal}
            disabled={isLoading}
            buttonIcon={<FadersIcon />}
            isButtonIconRequired={true}
            height="3rem"
          />

          {showFilterModal && (
            <RowFilterWrapper
              handleModalClose={toggleModal}
              selectedAdvertisingNavTitle={selectedNavTab}
              filterConfig={[
                ...filterConfig,
                ...getDynamicValuesFilterSettings(
                  dynamicFilters,
                  formatStringToTitleCase
                ),
              ]}
              isDataLoaded={!isLoading}
              onFilterApply={onSearchChangeAdditionalLogic}
            />
          )}
        </div>
        <div style={{ position: 'relative' }} ref={columnFilterRef}>
          {showColumnFilter && (
            <div className={styles.ColumnFilter}>
              <NewColumnFilterWrapper
                columns={initialColumns}
                getSelectedColumns={handleSelectedColumns}
                closeColumnFilter={handleToggleColumnFilter}
                _selectedColumns={selectedColumns}
                style={{ zIndex: 3 }}
                selectedTableTitle={title}
              />
            </div>
          )}
          <SecondaryButton
            buttonText={'Columns'}
            isButtonIconRequired
            buttonIcon={<ColumnsIcon />}
            buttonFunction={handleToggleColumnFilter}
            disabled={isLoading}
            height="3rem"
          />
        </div>
        <DownloadTableButton
          hoverInfoText="Download CSV"
          data={[]}
          filename={title}
          squareDimension="3rem"
          title={title}
          handleDownload={handleDownload}
        />
        {title === CronDefinitionsTableTitlesEnum.CRON_DEFINITIONS && (
          <PrimaryButton
            buttonText="Sync Definitions"
            buttonFunction={() => {
              handleRefetch(true);
            }}
            disabled={isLoading}
            buttonIcon={
              <ArrowCounterClockwiseIcon size={'2.8rem'} color="#464646" />
            }
            height="3rem"
            width="auto"
          />
        )}
      </div>
      <AddedFiltersTab
        appliedFilters={appliedFilters}
        isLoading={isLoading}
        selectedAdvertisingNavTitle={selectedNavTab}
      />
    </React.Fragment>
  );
}
