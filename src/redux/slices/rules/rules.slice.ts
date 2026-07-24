import { SortOrderEnum } from '@/enums/advertising.enums';
import {
  AuditStatusEnum,
  RuleEntityTypeIdEnum,
  RulesSearchColumns,
  RuleStatusEnum,
  RuleTypeEnum,
} from '@/enums/rules.enum';
import {
  IAppliedRuleResponse,
  IAuditWarning,
  ILinkableEntity,
  IRuleBasicDetails,
  IRuleCriteriaDetails,
  IRulesTemplateDetails,
  IRulesValidation,
  IRuleTypesTemplatesDetails,
} from '@/interfaces/rules/rules.interfaces';
import { recordOperations } from '@/utils';
import {
  getBasicInfoInitialFilters,
  getCriteriaSetsMap,
} from '@/utils/rules.utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IRootState } from 'src/redux/store';

interface IRulesState {
  selectedRuleType: RuleTypeEnum | null;
  ruleTemplates: Array<IRuleTypesTemplatesDetails>;
  ruleDetails: IRulesTemplateDetails | null;
  ruleBasicFilters: IRuleBasicDetails;
  ruleCriteriaSetsMap: Map<string, IRuleCriteriaDetails> | null;
  selectedEntities: ILinkableEntity[];
  appliedEntities: ILinkableEntity[];
  selectedEntityType: RuleEntityTypeIdEnum | null;
  duplicateRuleCriteriaSetsMap: Map<string, IRuleCriteriaDetails> | null;
  isEditModeOn: boolean;
  isSelectCampaignPage: boolean;
  auditStatus: AuditStatusEnum;
  auditWarnings: Array<IAuditWarning>;
  rulesValidation: IRulesValidation | null;
  appliedRules: Array<IAppliedRuleResponse>;
  appliedRulesById: Record<string, IAppliedRuleResponse> | null;
  isRuleFormLoading: boolean;
  isRuleArchived: boolean;
}

export const initialState: IRulesState = {
  selectedRuleType: null,
  ruleTemplates: [],
  ruleDetails: null,
  ruleBasicFilters: getBasicInfoInitialFilters(null, null),
  ruleCriteriaSetsMap: null,
  selectedEntities: [],
  appliedEntities: [],
  selectedEntityType: null,
  duplicateRuleCriteriaSetsMap: null,
  isEditModeOn: false,
  isSelectCampaignPage: false,
  auditStatus: AuditStatusEnum.IDLE,
  auditWarnings: [],
  rulesValidation: null,
  appliedRules: [],
  appliedRulesById: null,
  isRuleFormLoading: false,
  isRuleArchived: false,
};

export const ruleSlice = createSlice({
  name: 'rules',
  initialState,
  reducers: {
    resetRuleState: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setSelectedRuleType: (
      state,
      action: PayloadAction<RuleTypeEnum | null>
    ) => {
      state.selectedRuleType = action.payload;
    },
    setSelectedEntityType: (
      state,
      action: PayloadAction<RuleEntityTypeIdEnum | null>
    ) => {
      state.selectedEntityType = action.payload;
    },
    setRuleTypeTemplates: (
      state,
      action: PayloadAction<Array<IRuleTypesTemplatesDetails>>
    ) => {
      state.ruleTemplates = [...action.payload];
    },
    setRuleTemplateDetails: (
      state,
      action: PayloadAction<IRulesTemplateDetails | null>
    ) => {
      state.isRuleFormLoading = action.payload === null;
      state.ruleDetails = action.payload;

      const formattedBasicFilters = getBasicInfoInitialFilters(
        action.payload?.rule ?? null,
        action.payload?.rule?.ruleType ?? state.selectedRuleType
      );
      state.ruleBasicFilters = formattedBasicFilters;

      const criteriaSetsMap = getCriteriaSetsMap(action.payload);
      state.ruleCriteriaSetsMap = criteriaSetsMap;
      state.duplicateRuleCriteriaSetsMap = null;
      state.isRuleArchived =
        formattedBasicFilters.status === RuleStatusEnum.ARCHIVED;
    },
    setRuleBasicFilters: (state, action: PayloadAction<IRuleBasicDetails>) => {
      state.ruleBasicFilters = action.payload;
      state.isRuleArchived = action.payload.status === RuleStatusEnum.ARCHIVED;
    },
    setRuleCriteriaSetsMap: (
      state,
      action: PayloadAction<Map<string, IRuleCriteriaDetails> | null>
    ) => {
      state.ruleCriteriaSetsMap = action.payload;
    },
    setDuplicateRuleCriteriaSetsMap: (
      state,
      action: PayloadAction<Map<string, IRuleCriteriaDetails> | null>
    ) => {
      state.duplicateRuleCriteriaSetsMap = action.payload;
    },
    setIsEditModeOn: (state, action: PayloadAction<boolean>) => {
      state.isEditModeOn = action.payload;
    },
    setIsSelectCampaignPage: (state, action: PayloadAction<boolean>) => {
      state.isSelectCampaignPage = action.payload;
    },
    setSelectedEntities: (state, action: PayloadAction<ILinkableEntity[]>) => {
      state.selectedEntities = action.payload;
    },
    setAppliedEntities: (state, action: PayloadAction<ILinkableEntity[]>) => {
      state.appliedEntities = action.payload;
    },
    setAuditStatus: (state, action: PayloadAction<AuditStatusEnum>) => {
      state.auditStatus = action.payload;
    },
    setAuditWarnings: (state, action: PayloadAction<Array<IAuditWarning>>) => {
      state.auditWarnings = action.payload;
    },
    setRulesValidation: (
      state,
      action: PayloadAction<IRulesValidation | null>
    ) => {
      state.rulesValidation = action.payload;
    },
    setIsRuleFormLoading: (state, action: PayloadAction<boolean>) => {
      state.isRuleFormLoading = action.payload;
    },
    setAppliedRules: (
      state,
      action: PayloadAction<Array<IAppliedRuleResponse>>
    ) => {
      state.appliedRules = action.payload;
      state.appliedRulesById = action.payload.length
        ? recordOperations.getRecordFromArray(
            action.payload,
            (item) => item.ruleId
          )
        : null;
    },
    setUpdateAppliedRules: (
      state,
      action: PayloadAction<{
        ruleIdKey: string;
        value: IAppliedRuleResponse;
      }>
    ) => {
      const newRecord = recordOperations.addUpdateToRecord(
        state.appliedRulesById,
        action.payload.ruleIdKey,
        action.payload.value
      );

      const newArray = recordOperations.getArrayFromRecord(
        newRecord,
        RulesSearchColumns.RULE_NAME,
        SortOrderEnum.ASC
      );

      state.appliedRulesById = newRecord;
      state.appliedRules = newArray;
    },
    setBulkUpdateAppliedRules: (
      state,
      action: PayloadAction<{
        ruleIdKeys: string[];
        changes: Partial<IAppliedRuleResponse>;
      }>
    ) => {
      let newRecord = state.appliedRulesById;

      action.payload.ruleIdKeys.forEach((ruleIdKey) => {
        const existingRule = newRecord?.[ruleIdKey];
        if (!existingRule) return;

        newRecord = recordOperations.addUpdateToRecord(newRecord, ruleIdKey, {
          ...existingRule,
          ...action.payload.changes,
        });
      });

      const newArray = recordOperations.getArrayFromRecord(
        newRecord,
        RulesSearchColumns.RULE_NAME,
        SortOrderEnum.ASC
      );

      state.appliedRulesById = newRecord;
      state.appliedRules = newArray;
    },
  },
});

export const {
  resetRuleState,
  setSelectedRuleType,
  setSelectedEntityType,
  setRuleTypeTemplates,
  setRuleTemplateDetails,
  setIsRuleFormLoading,
  setRuleBasicFilters,
  setRuleCriteriaSetsMap,
  setSelectedEntities,
  setAppliedEntities,
  setIsEditModeOn,
  setIsSelectCampaignPage,
  setDuplicateRuleCriteriaSetsMap,
  setAuditStatus,
  setAuditWarnings,
  setRulesValidation,
  setAppliedRules,
  setUpdateAppliedRules,
  setBulkUpdateAppliedRules,
} = ruleSlice.actions;

export const selectSelectedRuleType = (state: IRootState) => {
  return state.rule.selectedRuleType;
};
export const selectRuleTypeTemplates = (state: IRootState) => {
  return state.rule.ruleTemplates;
};
export const selectRuleTemplateDetails = (state: IRootState) => {
  return state.rule.ruleDetails;
};
export const selectRuleBasicFilters = (state: IRootState) => {
  return state.rule.ruleBasicFilters;
};
export const selectRuleCriteriaSetsMap = (state: IRootState) => {
  return state.rule.ruleCriteriaSetsMap;
};
export const selectSelectedEntities = (state: IRootState) => {
  return state.rule.selectedEntities;
};
export const selectAppliedEntities = (state: IRootState) => {
  return state.rule.appliedEntities;
};
export const selectSelectedEntityType = (state: IRootState) => {
  return state.rule.selectedEntityType;
};
export const selectDuplicateRuleCriteriaSetsMap = (state: IRootState) => {
  return state.rule.duplicateRuleCriteriaSetsMap;
};
export const selectIsEditModeOn = (state: IRootState) => {
  return state.rule.isEditModeOn;
};
export const selectIsRuleArchived = (state: IRootState) => {
  return state.rule.isRuleArchived;
};
export const selectIsSelectCampaignPage = (state: IRootState) => {
  return state.rule.isSelectCampaignPage;
};
export const selectAuditStatus = (state: IRootState) => {
  return state.rule.auditStatus;
};
export const selectAuditWarnings = (state: IRootState) => {
  return state.rule.auditWarnings;
};
export const selectRulesValidation = (state: IRootState) => {
  return state.rule.rulesValidation;
};
export const selectAppliedRules = (state: IRootState) => {
  return state.rule.appliedRules;
};
export const selectAppliedRulesById = (state: IRootState) => {
  return state.rule.appliedRulesById;
};

export const selectIsRuleFormLoading = (state: IRootState) =>
  state.rule.isRuleFormLoading;

const ruleReducer = ruleSlice.reducer;
export default ruleReducer;
