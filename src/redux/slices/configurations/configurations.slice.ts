import {
  IAdGroupResponse,
  IGenerateSourceTargetMapping,
  IMetricsConfiguration,
} from '@/interfaces/configurations.interface';
import { ILinkableEntity } from '@/interfaces/rules/rules.interfaces';
import { configurationUtils } from '@/utils/settings/configuration.utils';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IRootState } from '../../store';

export interface IConfigurationsSlice {
  sourceTargetMappings: IGenerateSourceTargetMapping[];
  initialSourceTargetMappings: IGenerateSourceTargetMapping[];
  editSourceTargetMappings: IGenerateSourceTargetMapping[];
  adGroups: IAdGroupResponse[];
  metricsConfiguration: IMetricsConfiguration | null;
  editMetricsConfiguration: IMetricsConfiguration | null;
  heroItems: ILinkableEntity[];
  initialHeroItems: ILinkableEntity[];
  editHeroItems: ILinkableEntity[];
  isLoading: boolean;
  rulesSourceTargetContextKey: string | null;
}

const initialState: IConfigurationsSlice = {
  sourceTargetMappings: [],
  initialSourceTargetMappings: [],
  editSourceTargetMappings: [],
  adGroups: [],
  metricsConfiguration: null,
  editMetricsConfiguration: null,
  heroItems: [],
  initialHeroItems: [],
  editHeroItems: [],
  isLoading: false,
  rulesSourceTargetContextKey: null,
};

export const configurationsSlice = createSlice({
  name: 'configurations',
  initialState,
  reducers: {
    setSourceTargetMappings: (
      state,
      action: PayloadAction<IGenerateSourceTargetMapping[]>
    ) => {
      state.sourceTargetMappings = action.payload;
    },
    setInitialSourceTargetMappings: (
      state,
      action: PayloadAction<IGenerateSourceTargetMapping[]>
    ) => {
      state.initialSourceTargetMappings = action.payload;
    },
    setEditSourceTargetMappings: (
      state,
      action: PayloadAction<IGenerateSourceTargetMapping[]>
    ) => {
      state.editSourceTargetMappings = action.payload;
    },
    setAdGroups: (state, action: PayloadAction<IAdGroupResponse[]>) => {
      state.adGroups = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setRulesSourceTargetContextKey: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.rulesSourceTargetContextKey = action.payload;
    },
    updateMappingRow: (
      state,
      action: PayloadAction<{
        mappingId: string;
        updates: Partial<IGenerateSourceTargetMapping>;
      }>
    ) => {
      const { mappingId, updates } = action.payload;
      const index = state.editSourceTargetMappings.findIndex(
        (row) => row.mappingId === mappingId
      );

      if (index === -1) return;

      const updatedRow = {
        ...state.editSourceTargetMappings[index],
        ...updates,
      };

      if (updatedRow.sourceAdGroupId && updatedRow.targetAdGroupId) {
        updatedRow.mappingId = configurationUtils.createMappingUuid(
          updatedRow.sourceAdGroupId,
          updatedRow.targetAdGroupId
        );
      }

      state.editSourceTargetMappings[index] = updatedRow;
      state.sourceTargetMappings[index] = updatedRow;
    },
    setMetricsConfiguration: (
      state,
      action: PayloadAction<IMetricsConfiguration | null>
    ) => {
      state.metricsConfiguration = action.payload;
    },
    setEditMetricsConfiguration: (
      state,
      action: PayloadAction<IMetricsConfiguration | null>
    ) => {
      state.editMetricsConfiguration = action.payload;
    },
    updateMetricsConfiguration: (
      state,
      action: PayloadAction<Partial<IMetricsConfiguration>>
    ) => {
      if (state.editMetricsConfiguration) {
        state.editMetricsConfiguration = {
          ...state.editMetricsConfiguration,
          ...action.payload,
        };
      }
    },
    setHeroItems: (state, action: PayloadAction<ILinkableEntity[]>) => {
      state.heroItems = action.payload;
    },
    setInitialHeroItems: (state, action: PayloadAction<ILinkableEntity[]>) => {
      state.initialHeroItems = action.payload;
    },
    setEditHeroItems: (state, action: PayloadAction<ILinkableEntity[]>) => {
      state.editHeroItems = action.payload;
    },
    resetConfigurations: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSourceTargetMappings,
  setInitialSourceTargetMappings,
  setEditSourceTargetMappings,
  setAdGroups,
  setIsLoading,
  setRulesSourceTargetContextKey,
  resetConfigurations,
  updateMappingRow,
  setMetricsConfiguration,
  setEditMetricsConfiguration,
  updateMetricsConfiguration,
  setHeroItems,
  setInitialHeroItems,
  setEditHeroItems,
} = configurationsSlice.actions;

export const selectSourceTargetMappings = (state: IRootState) =>
  state.configurations.sourceTargetMappings;
export const selectInitialSourceTargetMappings = (state: IRootState) =>
  state.configurations.initialSourceTargetMappings;
export const selectEditSourceTargetMappings = (state: IRootState) =>
  state.configurations.editSourceTargetMappings;
export const selectAdGroups = (state: IRootState) =>
  state.configurations.adGroups;
export const selectIsLoading = (state: IRootState) =>
  state.configurations.isLoading;
export const selectRulesSourceTargetContextKey = (state: IRootState) =>
  state.configurations.rulesSourceTargetContextKey;
export const selectMetricsConfiguration = (state: IRootState) =>
  state.configurations.metricsConfiguration;
export const selectEditMetricsConfiguration = (state: IRootState) =>
  state.configurations.editMetricsConfiguration;
export const selectHeroItems = (state: IRootState) =>
  state.configurations.heroItems;
export const selectInitialHeroItems = (state: IRootState) =>
  state.configurations.initialHeroItems;
export const selectEditHeroItems = (state: IRootState) =>
  state.configurations.editHeroItems;

const configurationsReducer = configurationsSlice.reducer;
export default configurationsReducer;
