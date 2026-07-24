import DualTableWrapper from '@/app/components/shared/dual-table-wrapper/dual-table-wrapper';
import { RULES_SOURCE_TABLE_COLUMNS } from '@/constants/table-columns/rules-columns/rule-select-table-columns/rules-select-table-columns.constants';
import { RuleEntityTypeIdEnum, RulesSearchColumns } from '@/enums/rules.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { ILinkableEntity } from '@/interfaces/rules/rules.interfaces';
import { useAppSelector } from '@/redux/hooks';
import { getTableTitle } from '@/utils';
import {
  getEntityIDNameByEntityType,
  getEntityNameByEntityType,
  getFilteredEntitiesList,
} from '@/utils/rules.utils';
import { RowSelectionState } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import {
  selectRuleTemplateDetails,
  selectSelectedEntities,
} from 'src/redux/slices/rules/rules.slice';

const searchColumnKeys: Array<keyof ILinkableEntity> = [
  RulesSearchColumns.NAME,
  RulesSearchColumns.ENTITY_ID,
];

interface IRulesEntitySelectionComponentProps {
  tableTitle: string;
  initialData: ILinkableEntity[];
  marketplace: MarketplaceEnum;
  isLoading?: boolean;
  onSelectionChange?: (selected: ILinkableEntity[]) => void;
  entityType: RuleEntityTypeIdEnum;
}

export default function RulesEntitySelectionComponent({
  initialData,
  isLoading = false,
  onSelectionChange,
  tableTitle,
  marketplace,
  entityType,
}: IRulesEntitySelectionComponentProps) {
  const selectedEntities = useAppSelector(selectSelectedEntities);
  const selectedRuleDetails = useAppSelector(selectRuleTemplateDetails);

  const [sourceList, setSourceList] = useState<ILinkableEntity[]>(initialData);
  const [selectedList, setSelectedList] = useState<ILinkableEntity[]>([]);
  const [sourceRowSelection, setSourceRowSelection] =
    useState<RowSelectionState>({});
  const [selectedRowSelection, setSelectedRowSelection] =
    useState<RowSelectionState>({});

  useEffect(() => {
    if (selectedEntities.length > 0) {
      setSelectedList(selectedEntities);
      setSourceList(getFilteredEntitiesList(selectedEntities, initialData));
    } else {
      setSourceList(initialData);
    }
  }, [selectedEntities, initialData]);

  const handleAddToSelected = useCallback(() => {
    const selectedIds = new Set(Object.keys(sourceRowSelection));

    const itemsToAdd = sourceList.filter(
      (entity) => entity.entityId && selectedIds.has(entity.entityId)
    );
    const newSelectedList = [...selectedList, ...itemsToAdd];
    const newSourceList = getFilteredEntitiesList(itemsToAdd, sourceList);

    setSelectedList(newSelectedList);
    setSourceList(newSourceList);
    setSourceRowSelection({});
    onSelectionChange?.(newSelectedList);
  }, [sourceList, selectedList, sourceRowSelection, onSelectionChange]);

  const handleRemoveFromSelected = useCallback(() => {
    const selectedIds = new Set(Object.keys(selectedRowSelection));

    const itemsToRemove = selectedList.filter(
      (entity) => entity.entityId && selectedIds.has(entity.entityId)
    );
    const newSelectedList = getFilteredEntitiesList(
      itemsToRemove,
      selectedList
    );
    const newSourceList = [...sourceList, ...itemsToRemove];

    setSelectedList(newSelectedList);
    setSourceList(newSourceList);
    setSelectedRowSelection({});
    onSelectionChange?.(newSelectedList);
  }, [sourceList, selectedList, selectedRowSelection, onSelectionChange]);

  const getRowId = useCallback((row: ILinkableEntity) => row.entityId, []);

  const getSelectedTableTitle = useCallback(
    (isSourceTable: boolean) => {
      const ruleId = selectedRuleDetails?.rule?.id;
      const title = ruleId ? `${tableTitle}_${ruleId}` : tableTitle;
      return getTableTitle(title, isSourceTable);
    },
    [selectedRuleDetails?.rule?.id, tableTitle]
  );

  const tableColumns = useCallback(
    (isEntityLinkStatusRequired: boolean) =>
      RULES_SOURCE_TABLE_COLUMNS(entityType, isEntityLinkStatusRequired),
    [entityType]
  );

  return (
    <DualTableWrapper
      tableTitle={tableTitle}
      sourceTableData={sourceList}
      sourceTableColumns={tableColumns(false)}
      sourceTableRowSelection={sourceRowSelection}
      sourceTableSetRowSelection={setSourceRowSelection}
      sourceTableActionLabel="Add"
      sourceTableActionDisabled={!Object.keys(sourceRowSelection).length}
      onFirstTableAction={handleAddToSelected}
      isFirstTableLoading={isLoading}
      selectedRowTableData={selectedList}
      selectedRowTableColumns={tableColumns(true)}
      selectedRowTableRowSelection={selectedRowSelection}
      selectedRowTableSetRowSelection={setSelectedRowSelection}
      selectedRowTableActionLabel="Remove"
      selectedRowTableActionDisabled={!Object.keys(selectedRowSelection).length}
      onSecondTableAction={handleRemoveFromSelected}
      tableHeight="56vh"
      getRowId={getRowId}
      marketplace={marketplace}
      getSelectedTableTitle={getSelectedTableTitle}
      placeholder={`Search by ${getEntityNameByEntityType(
        entityType
      )} name/${getEntityIDNameByEntityType(entityType, marketplace)}`}
      sourceTableSearchKeyList={searchColumnKeys}
      selectedTableSearchKeyList={searchColumnKeys}
    />
  );
}
