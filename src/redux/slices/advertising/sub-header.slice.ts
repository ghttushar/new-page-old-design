import {
  ISubHeaderDataItem,
  ISubHeaderProps,
} from '@/app/components/common/sub-header/sub-header';
import { range } from '@/constants/advertising-filter.constants';
import { IRootState } from '@/redux/store';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: ISubHeaderProps = {
  title: '',
  titleTooltip: '',
  isDropdownRequired: true,
  dropdownOptions: [],
  height: '',
  subTitle: '',
  isSettingsPage: false,
  goBackButton: false,
  defaultPreset: range[0],
};

export const subHeaderOptionsSlice = createSlice({
  name: 'subHeaderOptions',
  initialState,
  reducers: {
    resetSubHeaderOptions: () => initialState,
    setSubheaderOptions: (state, action: PayloadAction<ISubHeaderProps>) => {
      return { ...state, ...action.payload };
    },
    setSubHeaderTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setSubHeaderDropdownOptions: (
      state,
      action: PayloadAction<Array<ISubHeaderDataItem>>
    ) => {
      state.dropdownOptions = action.payload;
    },
  },
});
export const {
  setSubheaderOptions,
  resetSubHeaderOptions,
  setSubHeaderTitle,
  setSubHeaderDropdownOptions,
} = subHeaderOptionsSlice.actions;

export const selectSubHeaderOptions = (state: IRootState) =>
  state.subHeaderOptions;

const subHeaderOptionReducer = subHeaderOptionsSlice.reducer;
export default subHeaderOptionReducer;
