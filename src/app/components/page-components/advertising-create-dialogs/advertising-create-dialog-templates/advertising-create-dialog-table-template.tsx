import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IAdvertisingCreateEntityDialogProps,
  ICreateProductAds,
  IEntityTypes,
} from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import { useAppSelector } from '@/redux/hooks';
import { selectAddedProductAds } from '@/redux/slices/advertising/advertising-create-entity.slice';
import { selectBidLimitErr } from '@/redux/slices/advertising/advertising-edit-access.slice';
import { checkIsObjectEmpty } from '@/utils/advertising.utils';
import { ColumnDef } from '@tanstack/react-table';
import CreateDialogBaseComponent from './template-components/create-dialog-base-component';
import CreateTableTemplate from './template-components/create-table-template';

interface IAdvertisingCreateDialogTableTemplateProps
  extends IAdvertisingCreateEntityDialogProps {
  handleAdditionalClearAll: () => void;
  initialAddedEntityCount: number;
  maxEntityCount: number;
  handleCreateEntity: () => void;
  isCreateLoading: boolean;
  isInitialProductAdsListLoading: boolean;
  initialProductAdsList: Array<ICreateProductAds>;
  setInitialProductAdsList: React.Dispatch<
    React.SetStateAction<ICreateProductAds[]>
  >;
  addedListTableColumns: Array<ColumnDef<ICreateProductAds>>;
  entityType: IEntityTypes;
  marketplace: MarketplaceEnum;
  addedListCount: number;
}

export default function AdvertisingCreateDialogTableTemplate({
  openDialog,
  handleCloseDialog,
  selectedCampaignId,
  selectedAdGroupId,
  selectedAdGroup,
  selectedTitle,
  walmartTargeting,
  handleAdditionalClearAll,
  initialAddedEntityCount,
  maxEntityCount,
  handleCreateEntity,
  isCreateLoading,
  isInitialProductAdsListLoading,
  initialProductAdsList,
  setInitialProductAdsList,
  addedListTableColumns,
  entityType,
  marketplace,
  addedListCount,
}: IAdvertisingCreateDialogTableTemplateProps) {
  const addedProductAds = useAppSelector(selectAddedProductAds);
  const bidLimitErr = useAppSelector(selectBidLimitErr);

  return (
    <CreateDialogBaseComponent
      handleAdditionalClear={handleAdditionalClearAll}
      openDialog={openDialog}
      handleCloseDialog={handleCloseDialog}
      initialAddedEntityCount={initialAddedEntityCount}
      maxEntityCount={maxEntityCount}
      handleCreateEntity={handleCreateEntity}
      isCreateDisabled={
        addedProductAds.length < 1 || !checkIsObjectEmpty(bidLimitErr)
      }
      isCreateLoading={isCreateLoading}
      addedListTableData={addedProductAds}
      addedListTableColumns={addedListTableColumns}
      entityType={entityType}
      isAddedTableLoading={false}
      addedListCount={addedListCount}
    >
      <CreateTableTemplate
        marketplace={marketplace}
        initialProductAdsList={initialProductAdsList}
        setInitialProductAdsList={setInitialProductAdsList}
        isInitialDataLoading={isInitialProductAdsListLoading}
      />
    </CreateDialogBaseComponent>
  );
}
