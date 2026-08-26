import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MOCK_DECISIONS, type Decision, type DecisionStatus } from '@/constants/signals/decisions.constants';
import type { IRootState } from '../../store';

const UNDO_MS = 30_000;

export type SnoozeChoice = '1h' | 'tomorrow' | 'next_week';

const SNOOZE_MS: Record<SnoozeChoice, number> = {
  '1h': 60 * 60 * 1000,
  tomorrow: 20 * 60 * 60 * 1000,
  next_week: 7 * 24 * 60 * 60 * 1000,
};

export interface SignalsState {
  decisions: Decision[];
  liveMode: boolean;
  selectedDecisionId: string | null;
  selectedMeetingId: string | null;
  activeTab: string;
  searchQuery: string;
  activeCategoryKey: string | null;
  selectedIds: string[];
  filterSources: string[];
  filterDomains: string[];
  filterPriorities: string[];
  filterWindow: 'any' | 'today' | 'yesterday' | 'week';
  /** Undo bookkeeping — remembers previous status so we can roll back within 30s. */
  _undoMap: Record<string, { prevStatus: DecisionStatus; timerId: ReturnType<typeof setTimeout> }>;
}

const initialState: SignalsState = {
  decisions: MOCK_DECISIONS,
  liveMode: false,
  selectedDecisionId: null,
  selectedMeetingId: null,
  activeTab: 'all',
  searchQuery: '',
  activeCategoryKey: null,
  selectedIds: [],
  filterSources: [],
  filterDomains: [],
  filterPriorities: [],
  filterWindow: 'any',
  _undoMap: {},
};

export const SignalsSlice = createSlice({
  name: 'signals',
  initialState,
  reducers: {
    setLiveMode: (state, action: PayloadAction<boolean>) => {
      state.liveMode = action.payload;
      if (!action.payload) {
        state.selectedDecisionId = 'critical-b0csh8tcc6';
      } else {
        state.selectedDecisionId = null;
      }
    },
    toggleLiveMode: (state) => {
      state.liveMode = !state.liveMode;
      if (!state.liveMode) {
        state.selectedDecisionId = 'critical-b0csh8tcc6';
      } else {
        state.selectedDecisionId = null;
      }
    },
    setSelectedDecision: (state, action: PayloadAction<string | null>) => {
      state.selectedDecisionId = action.payload;
      state.selectedMeetingId = null;
    },
    setSelectedMeeting: (state, action: PayloadAction<string | null>) => {
      state.selectedMeetingId = action.payload;
      state.selectedDecisionId = null;
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTab = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setActiveCategoryKey: (state, action: PayloadAction<string | null>) => {
      state.activeCategoryKey = action.payload;
    },
    toggleSelect: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const idx = state.selectedIds.indexOf(id);
      if (idx >= 0) state.selectedIds.splice(idx, 1);
      else state.selectedIds.push(id);
    },
    selectAll: (state, action: PayloadAction<string[]>) => {
      state.selectedIds = action.payload;
    },
    clearSelection: (state) => {
      state.selectedIds = [];
    },
    setFilterSources: (state, action: PayloadAction<string[]>) => {
      state.filterSources = action.payload;
    },
    setFilterDomains: (state, action: PayloadAction<string[]>) => {
      state.filterDomains = action.payload;
    },
    setFilterPriorities: (state, action: PayloadAction<string[]>) => {
      state.filterPriorities = action.payload;
    },
    setFilterWindow: (state, action: PayloadAction<'any' | 'today' | 'yesterday' | 'week'>) => {
      state.filterWindow = action.payload;
    },
    approveDecision: (state, action: PayloadAction<string>) => {
      const d = state.decisions.find((x) => x.id === action.payload);
      if (d && d.status === 'open') {
        d.status = 'in_flight';
        d.updatedAt = Date.now();
      }
    },
    rejectDecision: (state, action: PayloadAction<string>) => {
      const d = state.decisions.find((x) => x.id === action.payload);
      if (d && d.status === 'open') {
        d.status = 'rejected';
        d.updatedAt = Date.now();
      }
    },
    delegateToAan: (state, action: PayloadAction<string>) => {
      const d = state.decisions.find((x) => x.id === action.payload);
      if (d && d.status === 'open') {
        d.status = 'with_aan';
        d.updatedAt = Date.now();
      }
    },
    snoozeDecision: (state, action: PayloadAction<{ id: string; until: number }>) => {
      const d = state.decisions.find((x) => x.id === action.payload.id);
      if (d) {
        d.status = 'snoozed';
        d.snoozedUntil = action.payload.until;
        d.updatedAt = Date.now();
      }
    },
    bulkApprove: (state, action: PayloadAction<string[]>) => {
      for (const id of action.payload) {
        const d = state.decisions.find((x) => x.id === id);
        if (d && d.status === 'open') {
          d.status = 'in_flight';
          d.updatedAt = Date.now();
        }
      }
    },
    rollbackDecision: (state, action: PayloadAction<string>) => {
      const d = state.decisions.find((x) => x.id === action.payload);
      if (d) {
        d.status = 'open';
        d.updatedAt = Date.now();
      }
    },
    resetSignals: () => initialState,
  },
});

export const {
  setLiveMode,
  toggleLiveMode,
  setSelectedDecision,
  setSelectedMeeting,
  setActiveTab,
  setSearchQuery,
  setActiveCategoryKey,
  toggleSelect,
  selectAll,
  clearSelection,
  setFilterSources,
  setFilterDomains,
  setFilterPriorities,
  setFilterWindow,
  approveDecision,
  rejectDecision,
  delegateToAan,
  snoozeDecision,
  bulkApprove,
  rollbackDecision,
  resetSignals,
} = SignalsSlice.actions;

export const selectSignals = (state: IRootState) => state.signals;
export const selectDecisions = (state: IRootState) => state.signals.decisions;
export const selectLiveMode = (state: IRootState) => state.signals.liveMode;
export const selectSelectedDecisionId = (state: IRootState) => state.signals.selectedDecisionId;
export const selectSelectedMeetingId = (state: IRootState) => state.signals.selectedMeetingId;
export const selectActiveTab = (state: IRootState) => state.signals.activeTab;
export const selectSearchQuery = (state: IRootState) => state.signals.searchQuery;
export const selectActiveCategoryKey = (state: IRootState) => state.signals.activeCategoryKey;
export const selectSelectedIds = (state: IRootState) => state.signals.selectedIds;
export const selectFilterSources = (state: IRootState) => state.signals.filterSources;
export const selectFilterDomains = (state: IRootState) => state.signals.filterDomains;
export const selectFilterPriorities = (state: IRootState) => state.signals.filterPriorities;
export const selectFilterWindow = (state: IRootState) => state.signals.filterWindow;

const signalsReducer = SignalsSlice.reducer;
export default signalsReducer;
