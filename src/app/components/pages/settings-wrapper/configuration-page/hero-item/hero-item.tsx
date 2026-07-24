import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import RuleCriteriaInfo from '@/app/components/page-components/rules-page-components/rule-page-form-components/rule-criteria-info/rule-criteria-info';
import DualTableWrapper from '@/app/components/shared/dual-table-wrapper/dual-table-wrapper';
import { RULES_SOURCE_TABLE_COLUMNS } from '@/constants/table-columns/rules-columns/rule-select-table-columns/rules-select-table-columns.constants';
import { ConfigurationEnum } from '@/enums/configurations.enum';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  RuleEntityTypeIdEnum,
  RulesSearchColumns,
  RuleTypeEnum,
} from '@/enums/rules.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IHeroItemsPayload } from '@/interfaces/configurations.interface';
import { ILinkableEntity } from '@/interfaces/rules/rules.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppMutation, useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import {
  resetConfigurations,
  selectEditHeroItems,
  selectInitialHeroItems,
  setEditHeroItems,
  setInitialHeroItems,
} from '@/redux/slices/configurations/configurations.slice';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from '@/redux/slices/notifications/toast-message.slice';
import rulesServices from '@/services/rules/rules.services';
import ConfigurationsService from '@/services/settings/configurations.service';
import { getTableTitle } from '@/utils';
import { getFilteredEntitiesList } from '@/utils/rules.utils';
import { FloppyDiskIcon } from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { RowSelectionState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import styles from './hero-item.module.scss';

const searchColumnKeys: Array<keyof ILinkableEntity> = [
  RulesSearchColumns.NAME,
  RulesSearchColumns.ENTITY_ID,
];

export default function HeroItem() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const initialHeroItems = useAppSelector(selectInitialHeroItems);
  const editHeroItems = useAppSelector(selectEditHeroItems);

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount.marketplace]
  );

  const selectAdvAccValue = useMemo(
    () => selectedAdvertisingAccount.value,
    [selectedAdvertisingAccount.value]
  );

  const [sourceRowSelection, setSourceRowSelection] =
    useState<RowSelectionState>({});
  const [selectedRowSelection, setSelectedRowSelection] =
    useState<RowSelectionState>({});

  const fetchAvailableEntities = useAppQuery({
    queryFn: () =>
      rulesServices.getLinkableTableData(
        RuleTypeEnum.INVENTORY_RULE,
        marketplace,
        selectAdvAccValue
      ),
    queryKey: [
      QueryKeyEnums.FETCH_LINKABLE_TABLE_DATA,
      { marketplace: marketplace, selectAdvAccValue },
    ],
    enabled: !!selectAdvAccValue,
  });

  const availableEntities = useMemo(() => {
    return fetchAvailableEntities.data?.data?.data?.entities ?? [];
  }, [fetchAvailableEntities.data]);

  const fetchHeroItems = useAppQuery({
    queryKey: [QueryKeyEnums.FETCH_HERO_ITEMS, { marketplace: marketplace }],
    queryFn: ({ signal }) =>
      ConfigurationsService.getHeroItems(marketplace, signal),
    enabled: !!marketplace,
  });

  useEffect(() => {
    const apiHeroItems = fetchHeroItems.data?.data?.data;
    if (!fetchHeroItems.isSuccess || !Array.isArray(apiHeroItems)) return;

    const mappedHeroItems: ILinkableEntity[] = apiHeroItems.map((item) => {
      const entityId = item.itemId || item.asin || '';
      const name = item.productName || item.entityName || entityId;
      return {
        entityId,
        name,
        status: 'ENABLED',
        existingRules: [],
        itemImageUrl: item.itemImageUrl,
      };
    });

    dispatch(setInitialHeroItems(mappedHeroItems));
    dispatch(setEditHeroItems(mappedHeroItems));
  }, [fetchHeroItems.isSuccess, fetchHeroItems.data, dispatch]);

  const { mutateAsync: saveHeroItems, isPending: isSavePending } =
    useAppMutation({
      mutationFn: (payload: IHeroItemsPayload) =>
        ConfigurationsService.saveHeroItems(marketplace, payload),
      options: {
        onSuccess: (response) => {
          const message =
            response?.data?.message || 'Hero items saved successfully';
          dispatch(
            showSuccessToastMessage({
              title: 'Success',
              description: message,
            })
          );
          dispatch(setInitialHeroItems(editHeroItems));
          queryClient.invalidateQueries({
            queryKey: [
              QueryKeyEnums.FETCH_HERO_ITEMS,
              { marketplace: marketplace },
            ],
          });
        },
        onError: () => {
          dispatch(
            showErrorToastMessage({
              title: 'Error',
              description: 'Failed to save hero items',
            })
          );
        },
      },
    });

  const sourceList = useMemo(
    () => getFilteredEntitiesList(editHeroItems, availableEntities),
    [editHeroItems, availableEntities]
  );

  const handleAddToSelected = () => {
    const selectedIds = new Set(Object.keys(sourceRowSelection));
    const itemsToAdd = sourceList.filter(
      (entity) => entity.entityId && selectedIds.has(entity.entityId)
    );
    const newSelectedList = [...editHeroItems, ...itemsToAdd];
    dispatch(setEditHeroItems(newSelectedList));
    setSourceRowSelection({});
  };

  const handleRemoveFromSelected = () => {
    const selectedIds = new Set(Object.keys(selectedRowSelection));
    const newSelectedList = editHeroItems.filter(
      (entity) => !entity.entityId || !selectedIds.has(entity.entityId)
    );
    dispatch(setEditHeroItems(newSelectedList));
    setSelectedRowSelection({});
  };

  const initialIds = useMemo(
    () =>
      new Set(
        initialHeroItems
          .map((item) => item.entityId)
          .filter((id): id is string => !!id)
      ),
    [initialHeroItems]
  );

  const editIds = useMemo(
    () =>
      new Set(
        editHeroItems
          .map((item) => item.entityId)
          .filter((id): id is string => !!id)
      ),
    [editHeroItems]
  );

  const handleSaveHeroItems = async () => {
    const idsToInsert = editHeroItems
      .filter((item) => item.entityId && !initialIds.has(item.entityId))
      .map((item) => item.entityId)
      .filter((id): id is string => !!id);

    const idsToDelete = initialHeroItems
      .filter((item) => item.entityId && !editIds.has(item.entityId))
      .map((item) => item.entityId)
      .filter((id): id is string => !!id);

    const payload: IHeroItemsPayload = {
      insert: idsToInsert,
      delete: idsToDelete,
    };

    await saveHeroItems(payload);
  };

  const isSaveEnabled = useMemo(() => {
    if (editHeroItems.length !== initialHeroItems.length) return true;
    return !editHeroItems.every((item) => initialIds.has(item.entityId));
  }, [editHeroItems, initialHeroItems, initialIds]);

  const tableColumns = useMemo(
    () =>
      RULES_SOURCE_TABLE_COLUMNS(
        marketplace === MarketplaceEnum.AMAZON
          ? RuleEntityTypeIdEnum.ASIN
          : RuleEntityTypeIdEnum.ITEM_ID,
        false
      ),
    [marketplace]
  );

  const isLoading =
    fetchAvailableEntities.isLoading ||
    fetchHeroItems.isLoading ||
    isSavePending;

  useEffect(() => {
    return () => {
      dispatch(resetConfigurations());
    };
  }, [dispatch]);

  const getSelectedTableTitle = (isSourceTable: boolean) =>
    getTableTitle(ConfigurationEnum.HERO_ITEMS, isSourceTable);

  return (
    <div className={styles.container}>
      <div className={styles.pageTitle}>
        {ConfigurationEnum.HERO_ITEMS} Configuration
      </div>

      <div className={styles.infoSection}>
        <RuleCriteriaInfo
          title="Strategic Business Intent:"
          inline={true}
          description="This goal helps align advertising decisions with your broader profitability objectives, ensuring optimization goes beyond just ROAS and revenue metrics."
        />
      </div>

      <DualTableWrapper
        tableTitle={ConfigurationEnum.HERO_ITEMS}
        sourceTableData={sourceList}
        sourceTableColumns={tableColumns}
        sourceTableRowSelection={sourceRowSelection}
        sourceTableSetRowSelection={setSourceRowSelection}
        sourceTableActionLabel="Add"
        sourceTableActionDisabled={!Object.keys(sourceRowSelection).length}
        onFirstTableAction={handleAddToSelected}
        isFirstTableLoading={isLoading}
        selectedRowTableData={editHeroItems}
        selectedRowTableColumns={tableColumns}
        selectedRowTableRowSelection={selectedRowSelection}
        selectedRowTableSetRowSelection={setSelectedRowSelection}
        selectedRowTableActionLabel="Remove"
        selectedRowTableActionDisabled={
          !Object.keys(selectedRowSelection).length
        }
        onSecondTableAction={handleRemoveFromSelected}
        tableHeight="30rem"
        getRowId={(row) => row.entityId}
        marketplace={marketplace}
        getSelectedTableTitle={getSelectedTableTitle}
        placeholder="Search products by name/ID/SKU here"
        sourceTableSearchKeyList={searchColumnKeys}
        selectedTableSearchKeyList={searchColumnKeys}
      />

      <div className={styles.footerBar}>
        <div className={styles.bottomControls}>
          <PrimaryButton
            buttonText="Save Hero Items"
            buttonFunction={handleSaveHeroItems}
            disabled={!isSaveEnabled || isSavePending}
            height="3rem"
            width="18rem"
            fontSize="0.9rem"
            isNewDesign={true}
            isButtonIconRequired={true}
            buttonIcon={<FloppyDiskIcon size={20} />}
          />
        </div>
      </div>
    </div>
  );
}
