import { IFilterSetting } from '@/constants/filter.constants';
import { BidderDashboardTableTitlesEnum } from '@/enums/bidder-dashboard.enum';
import { IBidderDashboard } from '@/interfaces/bidder-dashboard.interface';
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
  selectShowFilterModal,
  setShowFilterModal,
} from 'src/redux/slices/filters/filter.slice';
import AddedFiltersTab from '../../../common/added-filters-tab/added-filters-tab';
import PrimaryIconButton from '../../../common/primary-icon-button/primary-icon-button';
import RowFilterWrapper from '../../../common/row-filter/row-filter-wrapper';
import SecondaryButton from '../../../common/secondary-button/secondary-button';
import NewColumnFilterWrapper from '../../column-filter/new-column-filter-wrapper';
import styles from './bidder-dashboard-filter-wrapper.module.scss';

interface IBidderDashboardFilterWrapperProps {
  title: string;
  exportFileName: string;
  handleDownload: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
  onSearchChangeAdditionalLogic: () => void;
  isLoading: boolean;
  handleSelectedColumns: (
    selectedColumns: Array<ColumnDef<IBidderDashboard>>
  ) => void;
  selectedColumns: ColumnDef<IBidderDashboard>[];
  initialColumns: ColumnDef<IBidderDashboard>[];
  handleRefetch: () => void;
  filterConfig: IFilterSetting[];
  selectedNavTab: BidderDashboardTableTitlesEnum;
}

export default function BidderDashboardFilterWrapper({
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
}: Readonly<IBidderDashboardFilterWrapperProps>) {
  const filterRef = useRef<HTMLDivElement>(null);
  const columnFilterRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const showFilterModal = useAppSelector(selectShowFilterModal);

  const [showColumnFilter, setShowColumnFilter] = useState<boolean>(false);

  const toggleModal = () => {
    dispatch(setShowFilterModal(!showFilterModal));
  };

  const handleToggleColumnFilter = () => {
    setShowColumnFilter(!showColumnFilter);
  };

  return (
    <React.Fragment>
      <div className={styles.tableHeader}>
        <PrimaryIconButton
          buttonFunction={handleRefetch}
          disabled={isLoading}
          buttonIcon={
            <ArrowCounterClockwiseIcon size={'2.8rem'} color="#464646" />
          }
          height="3rem"
          width="3rem"
        />

        <div className={styles.advancedFilters}>
          <div className={styles.rowFilter} ref={filterRef}>
            <SecondaryButton
              buttonText={'Filters'}
              buttonFunction={toggleModal}
              disabled={isLoading}
              buttonIcon={<FadersIcon size={'2rem'} />}
              isButtonIconRequired={true}
              height="3rem"
            />

            {showFilterModal && (
              <RowFilterWrapper
                handleModalClose={toggleModal}
                selectedAdvertisingNavTitle={selectedNavTab as any}
                filterConfig={filterConfig}
                isDataLoaded={!isLoading}
              />
            )}
          </div>

          <SecondaryButton
            buttonText={'Columns'}
            isButtonIconRequired
            buttonIcon={<ColumnsIcon size={'2rem'} />}
            buttonFunction={handleToggleColumnFilter}
            disabled={isLoading}
            height="3rem"
          />

          <div className={styles.columnFilterContainer} ref={columnFilterRef}>
            {showColumnFilter && (
              <div className={styles.columnFilter}>
                <NewColumnFilterWrapper
                  columns={initialColumns}
                  getSelectedColumns={handleSelectedColumns}
                  closeColumnFilter={handleToggleColumnFilter}
                  _selectedColumns={selectedColumns}
                  style={{ zIndex: 3 }}
                  selectedTableTitle={selectedNavTab}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <AddedFiltersTab
        appliedFilters={appliedFilters}
        isLoading={isLoading}
        selectedAdvertisingNavTitle={selectedNavTab}
      />
    </React.Fragment>
  );
}
