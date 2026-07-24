import AddedFiltersTab from '@/app/components/common/added-filters-tab/added-filters-tab';
import { AntSwitch } from '@/app/components/common/ant-switch/ant-switch';
import DownloadTableButton from '@/app/components/common/download-button/download-table-button';
import UploadFile from '@/app/components/common/upload-file/upload-file';
import { IFilterSetting } from '@/constants/filter.constants';
import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { getTitleCaseString } from '@/utils';
import {
  CloudArrowUpIcon,
  ColumnsIcon,
  FadersIcon,
} from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectAppliedFilters,
  selectShowFilterModal,
  setShowFilterModal,
} from 'src/redux/slices/filters/filter.slice';
import RowFilterWrapper from '../../../common/row-filter/row-filter-wrapper';
import ServerSearch from '../../../common/search/server-search';
import SecondaryButton from '../../../common/secondary-button/secondary-button';
import NewColumnFilterWrapper from '../../column-filter/new-column-filter-wrapper';
import styles from './profitability-table-header.module.scss';

interface IProfitabilityTableHeaderProps<T> {
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
  filterConfig: IFilterSetting[];
  isOrdersTable: boolean;
  handleTableSwitch: () => void;
  isPnL?: boolean;
}

export default function ProfitabilityTableHeader<T>({
  title,
  exportFileName,
  handleDownload,
  onSearchChangeAdditionalLogic,
  handleSelectedColumns,
  isLoading,
  selectedColumns,
  initialColumns,
  filterConfig,
  isOrdersTable,
  handleTableSwitch,
  isPnL,
}: Readonly<IProfitabilityTableHeaderProps<T>>) {
  const filterRef = useRef<HTMLDivElement>(null);
  const columnFilterRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const showFilterModal = useAppSelector(selectShowFilterModal);

  const [showColumnFilter, setShowColumnFilter] = useState<boolean>(false);
  const [showCOGSUploadModal, setShowUploadCogsModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const toggleModal = () => {
    dispatch(setShowFilterModal(!showFilterModal));
    if (showColumnFilter) handleToggleColumnFilter();
  };

  const handleToggleColumnFilter = () => {
    setShowColumnFilter(!showColumnFilter);
    if (showFilterModal) toggleModal();
  };

  const handleUploadModalOpen = () => {
    setShowUploadCogsModal(true);
  };

  const handleUploadModalClose = () => {
    setShowUploadCogsModal(false);
  };

  return (
    <div className={styles.tableHeader}>
      <div className="flex w-full justify-between">
        <span className={styles.title}>{getTitleCaseString(title)}</span>
        <div className={styles.subHeader}>
          <ServerSearch
            title={title}
            height="3rem"
            handleCustomSearchChange={onSearchChangeAdditionalLogic}
          />
          <span className={styles.toggleContainer}>
            Products
            <AntSwitch
              disabled={isLoading}
              checked={isOrdersTable}
              inputProps={{ 'aria-label': 'ant design' }}
              sx={{
                '&:hover': { cursor: 'pointer' },
                '&.MuiSwitch-root .MuiSwitch-track': {
                  background: '#77469b',
                },
              }}
              onChange={handleTableSwitch}
            />
            Orders
          </span>
          <div className={styles.rowFilter} ref={filterRef}>
            <SecondaryButton
              buttonText={'Filters'}
              buttonFunction={toggleModal}
              disabled={isLoading}
              buttonIcon={<FadersIcon size={'1.6rem'} />}
              isButtonIconRequired={true}
              isHoverTooltipEnabled={isLoading}
              tooltipText="Please wait till data is fetched"
              tooltipPosition={TooltipPlacement.Top}
              height="3rem"
            />

            {showFilterModal && (
              <RowFilterWrapper
                handleModalClose={toggleModal}
                selectedAdvertisingNavTitle={title}
                filterConfig={filterConfig}
                isDataLoaded={!isLoading}
                onFilterApply={onSearchChangeAdditionalLogic}
              />
            )}
          </div>
          {isPnL === false && (
            <SecondaryButton
              buttonText={'Upload COGS'}
              isButtonIconRequired
              buttonIcon={<CloudArrowUpIcon size={'1.6rem'} />}
              disabled={false}
              isHoverTooltipEnabled={true}
              height="3rem"
              buttonFunction={handleUploadModalOpen}
              width="12rem"
            />
          )}

          {showCOGSUploadModal && (
            <UploadFile
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              title="Add/Update with file"
              handleUploadClose={handleUploadModalClose}
              openUploadModal={showCOGSUploadModal}
            />
          )}
          <SecondaryButton
            buttonText={'Columns'}
            isButtonIconRequired
            buttonIcon={<ColumnsIcon size={'1.6rem'} />}
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
                  selectedTableTitle={title}
                />
              </div>
            )}
          </div>
          <span className={styles.downloadBtn}>
            <DownloadTableButton
              hoverInfoText="Download CSV"
              data={[]}
              filename={exportFileName}
              squareDimension="3rem"
              handleDownload={handleDownload}
              title={title}
            />
          </span>
        </div>
      </div>
      <AddedFiltersTab
        appliedFilters={appliedFilters}
        isLoading={isLoading}
        selectedAdvertisingNavTitle={title}
      />
    </div>
  );
}
