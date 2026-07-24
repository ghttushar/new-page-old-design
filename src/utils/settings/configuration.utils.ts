import { ConfigurationPageRouteEnum } from '@/app/components/pages/settings-wrapper/configuration-page/configuration-page.constants';
import {
  CONFIGURATION_SOURCE_TARGETING_AMAZON_FILTER_OPTIONS,
  CONFIGURATION_SOURCE_TARGETING_WALMART_FILTER_OPTIONS,
} from '@/constants/configuration/configuration.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IAdGroupResponse,
  IGenerateSourceTargetMapping,
} from '@/interfaces/configurations.interface';
import { getDiff } from '@/utils/advertising.utils';
import { v5 as uuidv5 } from 'uuid';

const isEmptyObject = (object: Record<string, unknown>): boolean => {
  return Object.keys(object).length === 0;
};

const hasValidMappingId = (mappingId?: string): boolean => {
  return typeof mappingId === 'string' && mappingId.includes('-');
};

export const configurationUtils = {
  createMappingUuid: (
    sourceAdGroupId: string,
    targetAdGroupId: string
  ): string => {
    const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
    const key = `${sourceAdGroupId}-${targetAdGroupId}`;
    return uuidv5(key, NAMESPACE);
  },

  getConfigurationRoute: (route: ConfigurationPageRouteEnum): string => {
    return `/settings/configuration/${route}`;
  },

  validateSourceTargetMappings: (
    editSourceTargetMappings: IGenerateSourceTargetMapping[],
    initialSourceTargetMappings: IGenerateSourceTargetMapping[]
  ): {
    isValid: boolean;
    hasDuplicates: boolean;
    hasInvalidIds: boolean;
    hasMissingMatchTypes: boolean;
    hasChanges: boolean;
  } => {
    const mappingIds = editSourceTargetMappings
      .map((row) => row.mappingId)
      .filter(Boolean);
    const hasDuplicates = mappingIds.length !== new Set(mappingIds).size;

    const hasInvalidIds = editSourceTargetMappings.some(
      (row) => !row.mappingId?.includes('-')
    );

    const hasMissingMatchTypes = editSourceTargetMappings.some(
      (row) => !row.matchTypes || row.matchTypes.length === 0
    );

    const diffRows = configurationUtils.getSourceTargetMappingDiff(
      initialSourceTargetMappings,
      editSourceTargetMappings
    );
    const deletedRows = configurationUtils.getDeletedMappings(
      initialSourceTargetMappings,
      editSourceTargetMappings
    );
    const hasChanges = diffRows.length > 0 || deletedRows.length > 0;

    const isValid =
      !hasDuplicates && !hasInvalidIds && !hasMissingMatchTypes && hasChanges;

    return {
      isValid,
      hasDuplicates,
      hasInvalidIds,
      hasMissingMatchTypes,
      hasChanges,
    };
  },

  getSourceTargetMappingDiff: (
    initialMappings: IGenerateSourceTargetMapping[],
    editMappings: IGenerateSourceTargetMapping[]
  ): IGenerateSourceTargetMapping[] => {
    const initialMap = new Map(
      initialMappings
        .filter((r) => hasValidMappingId(r.mappingId))
        .map((r) => [r.mappingId!, r])
    );

    return editMappings.filter((row) => {
      if (!hasValidMappingId(row.mappingId)) return false;

      const initial = initialMap.get(row.mappingId!);
      if (!initial) return true;
      if (initial === row) return false;

      return !isEmptyObject(
        getDiff(
          initial as unknown as Record<string, unknown>,
          row as unknown as Record<string, unknown>
        )
      );
    });
  },

  getDeletedMappings: (
    initialMappings: IGenerateSourceTargetMapping[],
    editMappings: IGenerateSourceTargetMapping[]
  ): IGenerateSourceTargetMapping[] => {
    const editIds = new Set(
      editMappings
        .filter((r) => hasValidMappingId(r.mappingId))
        .map((r) => r.mappingId!)
    );
    return initialMappings.filter(
      (r) => hasValidMappingId(r.mappingId) && !editIds.has(r.mappingId!)
    );
  },

  isMappingRowComplete: (mapping: IGenerateSourceTargetMapping): boolean => {
    return !!(
      mapping.sourceAdGroupId &&
      mapping.targetAdGroupId &&
      mapping.mappingId?.includes('-') &&
      mapping.matchTypes &&
      mapping.matchTypes.length > 0
    );
  },

  canAddNewMapping: (mappings: IGenerateSourceTargetMapping[]): boolean => {
    if (mappings.length === 0) return true;
    return mappings.every((mapping) =>
      configurationUtils.isMappingRowComplete(mapping)
    );
  },
  getMappedConfigurationData: (
    adGroups: IAdGroupResponse[],
    sourceTargetMappings: IGenerateSourceTargetMapping[]
  ): IGenerateSourceTargetMapping[] => {
    const adGroupNameById = new Map(
      adGroups.map((group) => [group.adGroupId, group.adGroupName])
    );

    return sourceTargetMappings.map((row) => ({
      ...row,
      sourceAdGroupName:
        row.sourceAdGroupName || adGroupNameById.get(row.sourceAdGroupId) || '',
      targetAdGroupName:
        row.targetAdGroupName || adGroupNameById.get(row.targetAdGroupId) || '',
    }));
  },
  getCheckboxFilterConfig: (marketplace: MarketplaceEnum) => {
    return marketplace === MarketplaceEnum.AMAZON
      ? CONFIGURATION_SOURCE_TARGETING_AMAZON_FILTER_OPTIONS
      : CONFIGURATION_SOURCE_TARGETING_WALMART_FILTER_OPTIONS;
  },
};
