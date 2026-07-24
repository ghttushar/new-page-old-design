import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import CustomTableWrapper from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { CampaignStateEnum } from '@/enums/advertising.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { WalmartCampaignStatusEnum } from '@/enums/walmart.enums';
import { ICreateProductAds } from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectAddedProductAds,
  setAddedProductAds,
} from '@/redux/slices/advertising/advertising-create-entity.slice';
import { formatNum } from '@/utils';
import { getFilteredTableData } from '@/utils/row-filter.utils';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { NoteIcon, PlusCircleIcon } from '@phosphor-icons/react';
import { RowSelectionState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { searchFieldStyles } from '../../advertising-create-dialogs-styles';
import styles from '../../advertising-create-dialogs.module.scss';
import { initialProductAdsListColumns } from '../../create-dialog-table-columns';

interface ICreateTableTemplateProps {
  marketplace: MarketplaceEnum;
  initialProductAdsList: Array<ICreateProductAds>;
  setInitialProductAdsList: React.Dispatch<
    React.SetStateAction<ICreateProductAds[]>
  >;
  isInitialDataLoading: boolean;
}

export default function CreateTableTemplate({
  marketplace,
  initialProductAdsList,
  setInitialProductAdsList,
  isInitialDataLoading,
}: ICreateTableTemplateProps) {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<RowSelectionState>({});

  const dispatch = useAppDispatch();
  const addedProductAds = useAppSelector(selectAddedProductAds);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filteredList = useMemo(() => {
    if (!searchText) return initialProductAdsList;
    return getFilteredTableData(initialProductAdsList, [], searchText, [
      'item',
      'itemName',
      'sku',
    ]);
  }, [initialProductAdsList, searchText]);

  const handleItemAdd = (id: string | number) => {
    const idx = initialProductAdsList.findIndex((product) => product.id === id);

    if (idx !== -1) {
      const addedInitialProduct: ICreateProductAds = {
        ...initialProductAdsList[idx],
        status:
          marketplace === MarketplaceEnum.WALMART
            ? WalmartCampaignStatusEnum.ENABLED
            : CampaignStateEnum.ENABLED,
      };
      dispatch(setAddedProductAds([...addedProductAds, addedInitialProduct]));
      setInitialProductAdsList((prev) => [
        ...prev.slice(0, idx),
        ...prev.slice(idx + 1),
      ]);
    }
  };

  const handleBulkItemsAdd = () => {
    const tempInitialList: ICreateProductAds[] = [];
    const tempAddedProductAds = addedProductAds.slice();

    for (const row of initialProductAdsList) {
      if (row.id && selectedRows[`${row.id}`]) {
        tempAddedProductAds.push({
          ...row,
          status:
            marketplace === MarketplaceEnum.WALMART
              ? WalmartCampaignStatusEnum.ENABLED
              : CampaignStateEnum.ENABLED,
        });
      } else {
        tempInitialList.push(row);
      }
    }

    dispatch(setAddedProductAds(tempAddedProductAds));
    setInitialProductAdsList(tempInitialList);
    setSelectedRows({});
  };

  return (
    <div className={styles.componentsContainer}>
      <div className={styles.searchContainer}>
        <TextField
          sx={searchFieldStyles}
          fullWidth
          value={searchText}
          onChange={handleSearch}
          placeholder={`Search by Title/${
            marketplace === MarketplaceEnum.WALMART ? 'Item Id' : 'ASIN'
          }/SKU`}
        />

        <Typography
          fontSize="1.2rem"
          fontWeight={700}
          color="#464646"
          sx={{ my: '0.5rem' }}
        >
          Total Products (
          <span style={{ fontWeight: 400 }}>
            {formatNum(initialProductAdsList.length, false) ?? 0}
          </span>
          )
        </Typography>

        <div className={styles.filteredListContainer}>
          <CustomTableWrapper
            data={filteredList}
            columns={initialProductAdsListColumns(marketplace, handleItemAdd)}
            getRowId={(row) => `${(row as any)?.id}`}
            width="100%"
            height="100%"
            borderRadius="8px"
            isLoading={isInitialDataLoading}
            disableSorting={true}
            enableRowSelection={true}
            rowSelection={selectedRows}
            setRowSelection={setSelectedRows}
            isPaginationRequired={false}
            pagination={{ pageIndex: 0, pageSize: filteredList.length }}
            noResultsOverlay={
              <div
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#8b8b8b',
                }}
              >
                <NoteIcon size={'2rem'} color="#8b8b8b" weight="fill" />
                <p>There isn't any product in the list to add.</p>
              </div>
            }
          />
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <PrimaryButton
          buttonText="Add"
          height="3.2rem"
          buttonFunction={handleBulkItemsAdd}
          disabled={!Object.keys(selectedRows).length}
          isButtonIconRequired={true}
          buttonIcon={<PlusCircleIcon size={'2rem'} color="#fff" />}
        />
      </div>
    </div>
  );
}
