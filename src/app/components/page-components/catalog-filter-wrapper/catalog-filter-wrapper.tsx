import { AmazonAccountType } from '@/enums/advertising.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { WalmartAccountTypeEnum } from '@/enums/walmart.enums';
import { useAuthSelector } from '@/redux/auth-selector/auth-selector';
import { invalidateQueries } from '@/redux/react-query-hooks';
import {
  selectAdvertisingAccount,
  selectCatalogAccount,
} from '@/redux/slices/auth/auth.slice';
import { getSelectedAdvertisingAccountByDropdownValue } from '@/utils/advertising.utils';
import { parseAdvertisingAccount } from '@/utils/marketplace-logo.utils';
import accountUtils from '@/utils/settings/accounts/account.utils';
import {
  CloudArrowUpIcon,
  ColumnsIcon,
  FadersIcon,
} from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { CatalogDataTestIds } from 'cypress/enums/catalog';
import React, { useMemo, useRef, useState } from 'react';
import { CatalogTabTitlesEnum } from 'src/enums/catalog.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectShowFilterModal,
  setShowFilterModal,
} from 'src/redux/slices/filters/filter.slice';
import { rowFilters } from 'src/utils/row-filter.utils';
import DownloadTableButton from '../../common/download-button/download-table-button';
import Dropdown, { IDropdownItem } from '../../common/dropdown/dropdown';
import RowFilterWrapper from '../../common/row-filter/row-filter-wrapper';
import ServerSearch from '../../common/search/server-search';
import SecondaryButton from '../../common/secondary-button/secondary-button';
import UploadFile from '../../common/upload-file/upload-file';
import NewColumnFilterWrapper from '../column-filter/new-column-filter-wrapper';
import styles from './catalog-filter-wrapper.module.scss';

interface ICatalogFilterWrapperProps<T> {
  title: CatalogTabTitlesEnum;
  exportFileName: string;
  handleDownload: (
    isAllDownload: boolean
  ) => Promise<Record<string, unknown>[]>;
  onSearchChangeAdditionalLogic: () => void;
  isDataLoaded: boolean;
  handleSelectedColumns: (selectedColumns: ColumnDef<T>[]) => void;
  selectedColumns: ColumnDef<T>[];
  initialColumns: ColumnDef<T>[];
  accountType?: AmazonAccountType | WalmartAccountTypeEnum;
  onFilterApply: () => void;
}

export default function CatalogFilterWrapper<T>({
  title,
  exportFileName,
  handleDownload,
  onSearchChangeAdditionalLogic,
  handleSelectedColumns,
  isDataLoaded,
  selectedColumns,
  initialColumns,
  accountType,
  onFilterApply,
}: ICatalogFilterWrapperProps<T>) {
  const queryClient = useQueryClient();
  const authSelector = useAuthSelector();
  const catalogAccount = useAppSelector(selectCatalogAccount);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const dispatch = useAppDispatch();
  const showFilterModal = useAppSelector(selectShowFilterModal);

  const filterRef = useRef<HTMLDivElement>(null);
  const columnFilterRef = useRef<HTMLDivElement>(null);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showColumnFilter, setShowColumnFilter] =
    useState<boolean>(isDataLoaded);
  const [showUploadCogsModal, setShowUploadCogsModal] =
    useState<boolean>(false);
  const adsAccountOptions = useMemo(
    () => accountUtils.getAdsAccountOptionsByPartnerId(catalogAccount.value),
    [catalogAccount.value]
  );

  const toggleModal = () => {
    dispatch(setShowFilterModal(!showFilterModal));
    if (showColumnFilter) handleCloseColumnFilter();
  };

  const toggleUploadModal = () => {
    setShowUploadCogsModal(!showUploadCogsModal);
  };

  const handleCloseColumnFilter = () => {
    setShowColumnFilter(false);
    if (showFilterModal) toggleModal();
  };

  const handleSetAdsAccount = (account: IDropdownItem<string>) => {
    const selectedAdvertisingAccount =
      getSelectedAdvertisingAccountByDropdownValue(account.value);
    authSelector.setAdvertisingAccount(
      parseAdvertisingAccount(selectedAdvertisingAccount)
    );
    invalidateQueries(queryClient, [
      QueryKeyEnums.AMAZON_CATALOG_TABLE_FETCH,
      QueryKeyEnums.AMAZON_CATALOG_TOTAL_FETCH,
    ]);
  };

  const handleShowColumnFilter = () => {
    setShowColumnFilter(!showColumnFilter);
  };

  return (
    <div
      className={styles.filterContainer}
      data-test={CatalogDataTestIds.CATALOG_FILTER_WRAPPER}
    >
      <ServerSearch
        title={title}
        height="3rem"
        handleCustomSearchChange={onSearchChangeAdditionalLogic}
      />

      <div
        className={styles.actionContainer}
        data-test={CatalogDataTestIds.ACTION_CONTAINER}
      >
        {catalogAccount.marketplace === MarketplaceEnum.AMAZON && (
          <React.Fragment>
            <Dropdown
              options={adsAccountOptions}
              selected={advertisingAccount}
              flagElement={advertisingAccount.flagElement}
              prefixElement={advertisingAccount.prefixElement}
              onSelect={handleSetAdsAccount}
              dropShadow={false}
              disabled={
                adsAccountOptions.length === 1 &&
                adsAccountOptions[0].value === ''
              }
              height="3rem"
              label=""
              width="24rem"
              fontWeight="300"
              fontColor="#464646"
            />
            <span
              style={{
                width: '1px',
                height: '3rem',
                background: '#dadeeb',
              }}
            ></span>
          </React.Fragment>
        )}

        {showUploadCogsModal && (
          <UploadFile
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            title="Add/Update with file"
            handleUploadClose={() => setShowUploadCogsModal(false)}
            openUploadModal={showUploadCogsModal}
          />
        )}
        {title === CatalogTabTitlesEnum.WALMART_CATALOG && (
          <SecondaryButton
            buttonText={'Upload COGS'}
            buttonFunction={toggleUploadModal}
            disabled={false}
            buttonIcon={<CloudArrowUpIcon size={'1.6rem'} color="#464646" />}
            isButtonIconRequired={true}
            width="12rem"
            height="3rem"
          />
        )}
        <div
          style={{ position: 'relative' }}
          ref={filterRef}
          data-test={CatalogDataTestIds.CATALOG_FILTER}
        >
          {showFilterModal && (
            <RowFilterWrapper
              handleModalClose={toggleModal}
              filterConfig={rowFilters.getFilterConfigByNewTableColumns(
                initialColumns,
                title
              )}
              isDataLoaded={isDataLoaded}
              selectedAdvertisingNavTitle={title}
              onFilterApply={onFilterApply}
            />
          )}

          <div
            className={styles.rowFilter}
            style={{
              borderColor: showFilterModal ? '#77469b' : '',
            }}
            onClick={toggleModal}
          >
            <FadersIcon size={15} weight="fill" color="#464646" />
            <span>Filter</span>
          </div>
        </div>

        <div
          style={{ position: 'relative' }}
          ref={columnFilterRef}
          data-test={CatalogDataTestIds.CATALOG_COLUMN_FILTER}
        >
          {showColumnFilter && (
            <div className={styles.ColumnFilter}>
              <NewColumnFilterWrapper
                columns={initialColumns}
                getSelectedColumns={handleSelectedColumns}
                closeColumnFilter={handleCloseColumnFilter}
                _selectedColumns={selectedColumns}
                style={{ zIndex: 3 }}
                selectedTableTitle={title}
              />
            </div>
          )}
          <div
            className={styles.ColumnFilterContainer}
            style={{
              borderColor: showColumnFilter ? '#77469b' : '',
            }}
            onClick={handleShowColumnFilter}
          >
            <ColumnsIcon size={15} />
            Columns
          </div>
        </div>

        <DownloadTableButton
          hoverInfoText="Download CSV"
          data={[]}
          filename={exportFileName}
          squareDimension="3rem"
          enclosingCharacter='"'
          title={title}
          handleDownload={handleDownload}
          accountType={accountType}
        />
      </div>
    </div>
  );
}
