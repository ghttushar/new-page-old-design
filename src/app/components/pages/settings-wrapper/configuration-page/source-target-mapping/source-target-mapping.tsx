import AddedFiltersTab from '@/app/components/common/added-filters-tab/added-filters-tab';
import AltPrimaryButton from '@/app/components/common/alt-primary-button/alt-primary-button';
import PrimaryButton from '@/app/components/common/primary-button/primary-button';
import RowFilterWrapper from '@/app/components/common/row-filter/row-filter-wrapper';
import ServerSearch from '@/app/components/common/search/server-search';
import SecondaryButton from '@/app/components/common/secondary-button/secondary-button';
import RuleCriteriaInfo from '@/app/components/page-components/rules-page-components/rule-page-form-components/rule-criteria-info/rule-criteria-info';
import CustomTableWrapper from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { UPDATED_PAGINATION_MODEL } from '@/constants';
import { CONFIGURATION_TABLE_FILTER_CONFIG } from '@/constants/filter.constants';
import { CONFIGURATION_COLUMNS } from '@/constants/table-columns/configuration-columns/configuration-columns.constants';
import {
  CONFIGURATION_PAGE_URL,
  SETTINGS_HOME_PAGE_URL,
} from '@/constants/urls.constants';
import {
  ConfigurationAdTypeEnum,
  ConfigurationTableTitlesEnum,
  ConfigurationTargetingTypeEnum,
} from '@/enums/configurations.enum';
import { QueryKeyEnums } from '@/enums/query.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  AllMatchTypes,
  IGenerateSourceTargetMapping,
} from '@/interfaces/configurations.interface';
import { ICustomTableStyles } from '@/interfaces/custom-table/custom-table.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  invalidateQueries,
  useAppMutation,
  useAppQuery,
} from '@/redux/react-query-hooks';
import { selectSearchText } from '@/redux/slices/advertising/advertising-filter.slice';
import { selectAccountId } from '@/redux/slices/auth/auth.slice';
import {
  resetConfigurations,
  selectAdGroups,
  selectEditSourceTargetMappings,
  selectInitialSourceTargetMappings,
  selectSourceTargetMappings,
  setAdGroups,
  setEditSourceTargetMappings,
  setInitialSourceTargetMappings,
  setRulesSourceTargetContextKey,
  setSourceTargetMappings,
} from '@/redux/slices/configurations/configurations.slice';
import {
  selectAppliedFilters,
  selectShowFilterModal,
  setShowFilterModal,
} from '@/redux/slices/filters/filter.slice';
import {
  showErrorToastMessage,
  showInfoToastMessage,
  showSuccessToastMessage,
} from '@/redux/slices/notifications/toast-message.slice';
import rulesServices from '@/services/rules/rules.services';
import ConfigurationsService from '@/services/settings/configurations.service';
import { getUpdatedPagination, remToPx } from '@/utils';
import { convertToUpperCase } from '@/utils/advertising.utils';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { getFilteredTableData } from '@/utils/row-filter.utils';
import { configurationUtils } from '@/utils/settings/configuration.utils';
import {
  FadersIcon,
  FloppyDiskIcon,
  FunnelIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import { useQueryClient } from '@tanstack/react-query';
import { RowSelectionState, SortingState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConfigurationPageRouteEnum } from '../configuration-page.constants';
import styles from './source-target-mapping.module.scss';

const createEmptyMapping = (
  sourceTargetMappings: IGenerateSourceTargetMapping[]
): IGenerateSourceTargetMapping => ({
  sourceCampaignId: '',
  sourceAdGroupId: '',
  sourceAdGroupName: '',
  targetCampaignId: '',
  targetAdGroupId: '',
  targetAdGroupName: '',
  matchTypes: [],
  sourceCampaignTargetingType: ConfigurationTargetingTypeEnum.MANUAL,
  targetCampaignTargetingType: ConfigurationTargetingTypeEnum.MANUAL,
  adType: ConfigurationAdTypeEnum.SP,
  mappingId: `${sourceTargetMappings.length}`,
});

interface SourceTargetMappingProps {
  isRulesPage?: boolean;
  onApplyRules?: (overrideConflicts: boolean) => void;
  fixedHeight?: boolean;
  height?: string;
  isViewMode?: boolean;
  isRuleEdit?: boolean;
  initialSelectedMappingIds?: string[];
  onRowSelectionChange?: (selectedMappingIds: string[]) => void;
  isDataLoading?: boolean;
}

export default function SourceTargetMapping({
  isRulesPage = false,
  onApplyRules,
  fixedHeight = false,
  height = '37rem',
  isViewMode = false,
  isRuleEdit = false,
  initialSelectedMappingIds = [],
  onRowSelectionChange,
  isDataLoading = false,
}: SourceTargetMappingProps) {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const accountId = useAppSelector(selectAccountId);
  const sourceTargetMappings = useAppSelector(selectSourceTargetMappings);
  const adGroups = useAppSelector(selectAdGroups);

  const initialSourceTargetMappings = useAppSelector(
    selectInitialSourceTargetMappings
  );
  const editSourceTargetMappings = useAppSelector(
    selectEditSourceTargetMappings
  );
  const appliedFilters = useAppSelector(selectAppliedFilters);
  const searchText = useAppSelector(selectSearchText);
  const showFilterModal = useAppSelector(selectShowFilterModal);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState(UPDATED_PAGINATION_MODEL);
  const isRuleEditMode = isViewMode && isRuleEdit;

  const handleResetPagination = () => {
    setPagination(getUpdatedPagination);
  };

  const customTableStyles: ICustomTableStyles = {
    thead: {
      className: styles.tableHead,
      tr: {
        className: styles.tableHeadRow,
        th: {
          className: styles.tableHeaderCell,
          wrapper: `${styles.tableHeaderWrapper} !border-r-0`,
        },
      },
    },
    tbody: {
      tr: {
        className: styles.tableRow,
        selectedClassName: styles.tableSelectedRow,
        td: {
          tdDiv: styles.tableTdDiv,
          wrapper: styles.tableTdWrapper,
        },
      },
    },
  };

  const tableColumns = useMemo(
    () => CONFIGURATION_COLUMNS(isViewMode),
    [isViewMode]
  );

  const hasMinTwoRows = sourceTargetMappings.length >= 2;
  const hasSelectedRows = Object.keys(rowSelection).length > 0;

  const selectedAdvertisingAccount =
    localStorageUtils.getSelectedAdvertisingAccount();
  const profileId =
    selectedAdvertisingAccount?.advertising?.amazonProfileId ||
    selectedAdvertisingAccount?.advertising?.walmartAdvertiserId;
  const marketplace = useMemo(
    () => selectedAdvertisingAccount?.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount?.marketplace]
  );
  const sourceTargetContextKey = useMemo(
    () => `${accountId ?? ''}-${profileId ?? ''}-${marketplace}`,
    [accountId, profileId, marketplace]
  );

  const fetchSourceTargetMapping = useAppQuery({
    queryKey: [QueryKeyEnums.FETCH_SOURCE_TARGET_MAPPING],
    queryFn: ({ signal }) =>
      ConfigurationsService.getSourceTargetMapping(marketplace, signal),
  });

  const fetchAdGroups = useAppQuery({
    queryKey: [QueryKeyEnums.FETCH_CONFIGURATION_DATA, marketplace],
    queryFn: ({ signal }) =>
      ConfigurationsService.getAdGroups(marketplace, signal),
  });

  useEffect(() => {
    if (fetchAdGroups.isSuccess) {
      const normalizedAdGroups = fetchAdGroups.data.data.data.map(
        (adGroup) => ({
          ...adGroup,
          targetingType: convertToUpperCase(
            adGroup.targetingType
          ) as ConfigurationTargetingTypeEnum,
        })
      );
      dispatch(setAdGroups(normalizedAdGroups));
    }
  }, [fetchAdGroups.isSuccess, dispatch, fetchAdGroups.data]);

  useEffect(() => {
    if (fetchSourceTargetMapping.isSuccess && fetchSourceTargetMapping.data) {
      const apiData = fetchSourceTargetMapping.data.data.data;
      const mappedData = apiData
        .filter((item) => item.mappingId?.includes('-'))
        .map((item) => ({
          ...item,
          matchTypes: (item.matchTypes ?? []).map(
            (type) => convertToUpperCase(type) as AllMatchTypes
          ),
          brandedKeywordExcluded:
            item.brandedKeywordExcluded ??
            (item.matchTypesToNegate && item.matchTypesToNegate.length > 0),
          sourceCampaignTargetingType: convertToUpperCase(
            item.sourceCampaignTargetingType
          ),
          targetCampaignTargetingType: convertToUpperCase(
            item.targetCampaignTargetingType
          ),
        }));

      dispatch(setSourceTargetMappings(mappedData));
      dispatch(setEditSourceTargetMappings(mappedData));
      dispatch(setInitialSourceTargetMappings(mappedData));
      if (isRulesPage) {
        dispatch(setRulesSourceTargetContextKey(sourceTargetContextKey));
      }
    }
  }, [
    dispatch,
    fetchSourceTargetMapping.data,
    fetchSourceTargetMapping.isSuccess,
    isRulesPage,
    sourceTargetContextKey,
  ]);

  const generateMappingQuery = useAppQuery({
    queryKey: [QueryKeyEnums.GENERATE_SOURCE_TARGET_MAPPING, marketplace],
    queryFn: ({ signal }) =>
      ConfigurationsService.generateSourceTargetMapping(marketplace, signal),
    enabled: false,
  });

  const handleGenerateMapping = () => generateMappingQuery.refetch();

  useEffect(() => {
    if (generateMappingQuery.isSuccess && generateMappingQuery.data) {
      const apiData = generateMappingQuery.data.data.data;
      if (apiData.length === 0) {
        dispatch(
          showInfoToastMessage({
            title: 'No mappings available to generate',
            description: 'Check your Targeting Action',
          })
        );
        return;
      }
      const validUserMappings = sourceTargetMappings.filter((row) =>
        row.mappingId?.includes('-')
      );
      const userMap = new Map<string, IGenerateSourceTargetMapping>();
      validUserMappings.forEach((row) => {
        if (row.mappingId) {
          userMap.set(row.mappingId, row);
        }
      });
      apiData.forEach((apiRow: IGenerateSourceTargetMapping) => {
        if (apiRow.mappingId?.includes('-') && !userMap.has(apiRow.mappingId)) {
          // Normalize match types and targeting types to uppercase
          const normalizedRow = {
            ...apiRow,
            matchTypes: (apiRow.matchTypes ?? []).map(
              (type) => type?.toUpperCase() as AllMatchTypes
            ),
            sourceCampaignTargetingType: convertToUpperCase(
              apiRow.sourceCampaignTargetingType
            ),
            targetCampaignTargetingType: convertToUpperCase(
              apiRow.targetCampaignTargetingType
            ),
          };
          userMap.set(apiRow.mappingId, normalizedRow);
        }
      });
      const mergedData = [...userMap.values()];

      dispatch(setSourceTargetMappings(mergedData));
      dispatch(setEditSourceTargetMappings(mergedData));
    }
  }, [dispatch, generateMappingQuery.data, generateMappingQuery.isSuccess]);

  const {
    mutateAsync: saveSourceTargetMapping,
    isPending: isSaveMappingPending,
    isIdle: isSaveMappingIdle,
  } = useAppMutation({
    mutationFn: (payload: {
      upsert: IGenerateSourceTargetMapping[];
      delete: string[];
    }) => ConfigurationsService.upsertSourceTargetMapping(marketplace, payload),
    options: {
      onSuccess: (response) => {
        if (response?.data?.success) {
          dispatch(resetConfigurations());
          dispatch(
            showSuccessToastMessage({
              title: 'Success',
              description: 'Source & Target Mapping saved successfully',
            })
          );

          invalidateQueries(queryClient, [
            QueryKeyEnums.FETCH_CONFIGURATION_DATA,
            QueryKeyEnums.FETCH_SOURCE_TARGET_MAPPING,
          ]);
        }
      },
      onError: (error) => {
        dispatch(
          showErrorToastMessage({
            title: 'Error',
            description: 'Failed to save Source & Target Mapping',
          })
        );
      },
    },
  });

  const {
    mutateAsync: deleteByEntityId,
    isPending: isDeleteByEntityIdPending,
    isIdle: isDeleteByEntityIdIdle,
  } = useAppMutation({
    mutationFn: (payload: { entityIds: string[] }) =>
      rulesServices.deleteByEntityIds(payload),
    options: {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [QueryKeyEnums.FETCH_SOURCE_TARGET_MAPPING],
        });
      },
      onError: () => {
        dispatch(
          showErrorToastMessage({
            title: 'Error',
            description: 'Failed to delete mapping entity links',
          })
        );
      },
    },
  });

  const isLoading = useMemo(
    () =>
      fetchAdGroups.isLoading ||
      fetchAdGroups.isRefetching ||
      fetchSourceTargetMapping.isLoading ||
      fetchSourceTargetMapping.isRefetching ||
      generateMappingQuery.isLoading ||
      generateMappingQuery.isRefetching ||
      (isSaveMappingPending === true && isSaveMappingIdle === false) ||
      (isDeleteByEntityIdPending === true && isDeleteByEntityIdIdle === false),
    [
      fetchAdGroups.isLoading,
      fetchAdGroups.isRefetching,
      fetchSourceTargetMapping.isLoading,
      fetchSourceTargetMapping.isRefetching,
      generateMappingQuery.isLoading,
      generateMappingQuery.isRefetching,
      isSaveMappingPending,
      isSaveMappingIdle,
      isDeleteByEntityIdPending,
      isDeleteByEntityIdIdle,
    ]
  );

  const handleSaveMapping = async () => {
    const filteredMappingIds = new Set(
      filteredData.map((row) => row.mappingId)
    );
    const filteredEditMappings = editSourceTargetMappings.filter((row) =>
      filteredMappingIds.has(row.mappingId)
    );

    const diffRows = configurationUtils.getSourceTargetMappingDiff(
      initialSourceTargetMappings,
      filteredEditMappings
    );
    const deletedRows = configurationUtils.getDeletedMappings(
      initialSourceTargetMappings,
      filteredEditMappings
    );

    if (diffRows.length === 0 && deletedRows.length === 0) {
      return;
    }

    const payload = {
      upsert: diffRows,
      delete: deletedRows
        .map((row) => row.mappingId)
        .filter(Boolean) as string[],
    };

    await saveSourceTargetMapping(payload);

    if (payload.delete.length > 0) {
      await deleteByEntityId({
        entityIds: payload.delete,
      });
    }
  };

  const addMappingRow = () => {
    const emptyMapping = createEmptyMapping(sourceTargetMappings);
    const newMappingId =
      emptyMapping.sourceAdGroupId && emptyMapping.targetAdGroupId
        ? configurationUtils.createMappingUuid(
            emptyMapping.sourceAdGroupId,
            emptyMapping.targetAdGroupId
          )
        : `${sourceTargetMappings.length}`;
    const newMapping = { ...emptyMapping, mappingId: newMappingId };
    dispatch(setSourceTargetMappings([newMapping, ...sourceTargetMappings]));
    dispatch(
      setEditSourceTargetMappings([newMapping, ...editSourceTargetMappings])
    );
  };

  const handleFilterModalClose = () => {
    if (isViewMode === true && !filteredData.length) return;

    dispatch(setShowFilterModal(!showFilterModal));
  };

  const handleRemove = () => {
    const selectedIds = Object.keys(rowSelection);
    const updatedMappings = sourceTargetMappings.filter(
      (row, index) => !selectedIds.includes(row.mappingId || index.toString())
    );
    const updatedEditMappings = editSourceTargetMappings.filter(
      (row, index) => !selectedIds.includes(row.mappingId || index.toString())
    );
    dispatch(setSourceTargetMappings(updatedMappings));
    dispatch(setEditSourceTargetMappings(updatedEditMappings));
    setRowSelection({});
  };

  const adGroupNameById = useMemo(
    () =>
      new Map(adGroups.map((group) => [group.adGroupId, group.adGroupName])),
    [adGroups]
  );

  const filteredData = useMemo(() => {
    const mappingsWithResolvedNames = sourceTargetMappings.map((row) => ({
      ...row,
      sourceAdGroupName:
        row.sourceAdGroupName || adGroupNameById.get(row.sourceAdGroupId) || '',
      targetAdGroupName:
        row.targetAdGroupName || adGroupNameById.get(row.targetAdGroupId) || '',
    }));

    return getFilteredTableData(
      mappingsWithResolvedNames,
      appliedFilters,
      searchText,
      [
        'sourceAdGroupName',
        'targetAdGroupName',
        'sourceAdGroupId',
        'targetAdGroupId',
      ]
    );
  }, [sourceTargetMappings, appliedFilters, searchText, adGroupNameById]);

  const isSaveEnabled = useMemo(() => {
    const validation = configurationUtils.validateSourceTargetMappings(
      editSourceTargetMappings,
      initialSourceTargetMappings
    );
    return validation.isValid;
  }, [editSourceTargetMappings, initialSourceTargetMappings]);

  const canAddMapping = useMemo(() => {
    return configurationUtils.canAddNewMapping(sourceTargetMappings);
  }, [sourceTargetMappings]);

  useEffect(() => {
    if (!isRuleEditMode) {
      onRowSelectionChange?.([]);
      return;
    }

    const selectedMappingIds = Object.keys(rowSelection).filter(
      (rowId) =>
        Boolean(rowSelection[rowId]) &&
        sourceTargetMappings.some((mapping) => mapping.mappingId === rowId)
    );

    onRowSelectionChange?.(selectedMappingIds);
  }, [isRuleEditMode, rowSelection, sourceTargetMappings]);

  useEffect(() => {
    if (!isRuleEditMode) return;
    if (!initialSelectedMappingIds.length) {
      setRowSelection({});
      return;
    }

    const validMappingIds = new Set(
      sourceTargetMappings
        .map((mapping) => mapping.mappingId)
        .filter((mappingId): mappingId is string => Boolean(mappingId))
    );

    const nextRowSelection =
      initialSelectedMappingIds.reduce<RowSelectionState>((acc, mappingId) => {
        if (validMappingIds.has(mappingId)) acc[mappingId] = true;
        return acc;
      }, {});

    setRowSelection(nextRowSelection);
  }, [initialSelectedMappingIds, isRuleEditMode, sourceTargetMappings]);

  const getRowID = (row: IGenerateSourceTargetMapping, index: number) =>
    row.mappingId || `empty-${index}-${Date.now()}`;

  return (
    <div
      className={`${styles.container} ${
        isRulesPage ? styles.rulesPageContainer : ''
      }`}
      style={{
        padding: isViewMode ? '0' : '',
        backgroundColor: isViewMode ? '' : '#fff',
        boxShadow: isViewMode ? '' : '0 2px 4px rgba(0, 0, 0, 0.05)',
      }}
    >
      {!isViewMode && (
        <div className={styles.controlsRow}>
          <div className={styles.pageStepTitle}>Source & Target Mapping</div>
          <div className={styles.controls}>
            <PrimaryButton
              buttonText="Generate Mapping"
              buttonFunction={handleGenerateMapping}
              disabled={isLoading}
              height="3rem"
              width="10.4rem"
              fontSize="0.9rem"
              bgColor="linear-gradient(99.66deg, #894DB5 4.22%, #6205A7 89%);"
              borderRadius="0.4rem"
            />
            <SecondaryButton
              buttonText="Filter"
              buttonFunction={handleFilterModalClose}
              disabled={!hasMinTwoRows || isLoading}
              height="3rem"
              fontSize="0.9rem"
              isButtonIconRequired={true}
              buttonIcon={<FadersIcon size={20} />}
            />
            <SecondaryButton
              buttonText="Remove"
              buttonFunction={handleRemove}
              disabled={!hasSelectedRows || isLoading}
              height="3rem"
              fontSize="0.9rem"
              isButtonIconRequired={true}
              buttonIcon={<TrashIcon size={20} />}
            />
          </div>
        </div>
      )}

      {(!isViewMode || isRulesPage) && (
        <RuleCriteriaInfo
          title={isRulesPage ? 'Empty Table?' : 'Flow:'}
          inline={true}
          description={
            isRulesPage ? (
              <p>
                Please navigate to&nbsp;
                <Link
                  target="_blank"
                  rel="noreferrer"
                  to={`${SETTINGS_HOME_PAGE_URL}${CONFIGURATION_PAGE_URL}/${ConfigurationPageRouteEnum.SOURCE_TARGET_MAPPING}`}
                  className="underline text-[blue]"
                >
                  configurations
                </Link>
                &nbsp;page to generate mappings for the account.
              </p>
            ) : (
              'This goal helps align advertising decisions with your broader profitability objectives, ensuring optimization goes beyond just ROAS and revenue metrics.'
            )
          }
        />
      )}

      {isViewMode === true && (
        <div className={styles.selectPageSourceTargetingActionsContainer}>
          <ServerSearch
            title={ConfigurationTableTitlesEnum.SOURCE_TARGET_MAPPING}
            height="3rem"
            width="50rem"
            handleCustomSearchChange={handleResetPagination}
            isNewDesign={true}
          />

          <Popover open={showFilterModal} onOpenChange={handleFilterModalClose}>
            <PopoverTrigger>
              <AltPrimaryButton
                buttonText="Filter"
                height="3rem"
                width="auto"
                buttonFunction={handleFilterModalClose}
                isButtonIconRequired={true}
                buttonIcon={<FunnelIcon size={'1.5rem'} color="#464646" />}
                disabled={filteredData.length === 0}
                isNewDesign={true}
              />
            </PopoverTrigger>
            <PopoverContent
              style={{
                position: 'absolute',
                right: remToPx(-3.5),
                top: remToPx(-3),
                height: '100%',
                background: 'transparent',
                boxShadow: 'none',
                border: 'none',
              }}
            >
              <RowFilterWrapper
                handleModalClose={handleFilterModalClose}
                filterConfig={
                  CONFIGURATION_TABLE_FILTER_CONFIG[
                    ConfigurationTableTitlesEnum.SOURCE_TARGET_MAPPING
                  ]
                }
                selectedAdvertisingNavTitle={
                  ConfigurationTableTitlesEnum.SOURCE_TARGET_MAPPING
                }
                isDataLoaded={true}
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {showFilterModal && !isViewMode && (
        <div
          style={{
            position: 'absolute',
            top: '0.7rem',
            right: '-0.2rem',
            zIndex: 1000,
          }}
        >
          <RowFilterWrapper
            handleModalClose={handleFilterModalClose}
            filterConfig={
              CONFIGURATION_TABLE_FILTER_CONFIG[
                ConfigurationTableTitlesEnum.SOURCE_TARGET_MAPPING
              ]
            }
            selectedAdvertisingNavTitle={
              ConfigurationTableTitlesEnum.SOURCE_TARGET_MAPPING
            }
            isDataLoaded={true}
          />
        </div>
      )}

      <div className={styles.tableSection}>
        <AddedFiltersTab
          appliedFilters={appliedFilters}
          isLoading={false}
          selectedAdvertisingNavTitle={
            ConfigurationTableTitlesEnum.SOURCE_TARGET_MAPPING
          }
        />

        {sourceTargetMappings.length > 0 ? (
          <div className={styles.tableContainer}>
            <CustomTableWrapper
              data={filteredData}
              columns={tableColumns}
              getRowId={getRowID}
              width="100%"
              height={height}
              isLoading={isLoading || isDataLoading}
              pagination={pagination}
              setPagination={setPagination}
              enableRowSelection={!isViewMode || isRuleEditMode}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              sorting={sorting}
              setSorting={setSorting}
              manualSorting={false}
              customStyles={customTableStyles}
              overscan={50}
              fixedHeight={fixedHeight}
              isNewDesign={true}
              noResultsOverlay={
                <div className={styles.emptyStateContainer}>
                  <p className={styles.emptyStateTitle}>No matching results</p>
                  <p className={styles.emptyStateSubtitle}>
                    Try adjusting your filters to find what you're looking for
                  </p>
                </div>
              }
            />
          </div>
        ) : (
          <div className={styles.emptyStateContainer}>
            <p className={styles.emptyStateTitle}>No mapping configured yet</p>
            <p className={styles.emptyStateSubtitle}>
              Click the button below to add your first mapping
            </p>
          </div>
        )}
      </div>
      {!isViewMode && (
        <div
          className={`${styles.addMappingRow} ${
            isLoading || !canAddMapping ? styles.disabled : ''
          }`}
          onClick={isLoading || !canAddMapping ? undefined : addMappingRow}
        >
          + Add Mapping
        </div>
      )}
      {!isRulesPage && !isViewMode && (
        <div className={styles.footerBar}>
          <div className={styles.bottomControls}>
            <PrimaryButton
              buttonText="Save Source & Target Mapping"
              buttonFunction={handleSaveMapping}
              disabled={!isSaveEnabled || isLoading}
              height="3rem"
              width="18rem"
              fontSize="0.9rem"
              isNewDesign={true}
              isButtonIconRequired={true}
              buttonIcon={<FloppyDiskIcon size={20} />}
            />
          </div>
        </div>
      )}
    </div>
  );
}
