import { IRadioSelect } from '@/interfaces/advertising/advertising.interface';
import {
  IAdvertisingCreateEntityDialogProps,
  IChipBasedEntityTypes,
  ICreateKeyword,
  IEntityTypes,
} from '@/interfaces/advertising/create-dialog/create-dialog.interface';
import { ColumnDef } from '@tanstack/react-table';
import CreateChipTemplate from './template-components/create-chip-template';
import CreateDialogBaseComponent from './template-components/create-dialog-base-component';

interface IAdvertisingCreateDialogChipTemplateProps
  extends IAdvertisingCreateEntityDialogProps {
  handlePopulateAddedList: (newList: Array<ICreateKeyword>) => void;
  initialAddedEntityCount: number;
  maxEntityCount: number;
  isCustomBidRequired: boolean;
  minBidLimit?: number;
  areMatchTypeOptionsRequired: boolean;
  matchTypeRadioOptions?: IRadioSelect<string>[];
  handleCreateEntity: () => void;
  isCreateDisabled: boolean;
  isCreateLoading: boolean;
  isInitialDataLoading: boolean;
  initialKeywordList: Array<IChipBasedEntityTypes>;
  addedListTableData: Array<ICreateKeyword>;
  addedListCount: number;
  addedListTableColumns: Array<ColumnDef<ICreateKeyword>>;
  entityType: IEntityTypes;
  isAddedTableLoading: boolean;
  handleTriggerGetNormalizedKeywords?: (
    addedKeywords: ICreateKeyword[]
  ) => void;
}

export default function AdvertisingCreateDialogChipTemplate<T>({
  openDialog,
  handleCloseDialog,
  selectedAdGroup,
  handlePopulateAddedList,
  initialAddedEntityCount,
  maxEntityCount,
  isCustomBidRequired,
  minBidLimit,
  areMatchTypeOptionsRequired,
  matchTypeRadioOptions,
  handleCreateEntity,
  isCreateDisabled,
  isCreateLoading,
  isInitialDataLoading,
  initialKeywordList,
  addedListTableData,
  addedListTableColumns,
  entityType,
  isAddedTableLoading,
  addedListCount,
  handleTriggerGetNormalizedKeywords,
  selectedAdGroupId,
  selectedCampaignId,
  selectedTitle,
}: IAdvertisingCreateDialogChipTemplateProps) {
  return (
    <CreateDialogBaseComponent
      handleAdditionalClear={() => handlePopulateAddedList([])}
      openDialog={openDialog}
      handleCloseDialog={handleCloseDialog}
      initialAddedEntityCount={initialAddedEntityCount}
      maxEntityCount={maxEntityCount}
      handleCreateEntity={handleCreateEntity}
      isCreateDisabled={isCreateDisabled}
      isCreateLoading={isCreateLoading}
      isInitialDataLoading={isInitialDataLoading}
      addedListTableData={addedListTableData}
      addedListTableColumns={addedListTableColumns}
      entityType={entityType}
      isAddedTableLoading={isAddedTableLoading}
      addedListCount={addedListCount}
    >
      <CreateChipTemplate
        selectedAdGroup={selectedAdGroup}
        handlePopulateAddedList={handlePopulateAddedList}
        isCustomBidRequired={isCustomBidRequired}
        minBidLimit={minBidLimit}
        areMatchTypeOptionsRequired={areMatchTypeOptionsRequired}
        matchTypeRadioOptions={matchTypeRadioOptions}
        initialKeywordList={initialKeywordList}
        addedListTableData={addedListTableData}
        entityType={entityType}
        handleTriggerGetNormalizedKeywords={handleTriggerGetNormalizedKeywords}
      />
    </CreateDialogBaseComponent>
  );
}
