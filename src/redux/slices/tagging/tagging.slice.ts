import { SortOrderEnum } from '@/enums/advertising.enums';
import { ITagDetails } from '@/interfaces/tagging/tagging.interfaces';
import { IRootState } from '@/redux/store';
import { recordOperations } from '@/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ITaggingState {
  tagsArray: Array<ITagDetails>;
  tagsById: Record<string, ITagDetails> | null;
  isListLoading: boolean;
}

export const initialState: ITaggingState = {
  tagsArray: [],
  tagsById: null,
  isListLoading: false,
};

export const taggingSlice = createSlice({
  name: 'tagging',
  initialState,
  reducers: {
    resetTaggingState: (state, action: PayloadAction) => {
      Object.assign(state, initialState);
    },
    setTags: (state, action: PayloadAction<Array<ITagDetails>>) => {
      state.tagsArray = action.payload;
      state.tagsById = action.payload.length
        ? recordOperations.getRecordFromArray(
            action.payload,
            (item) => item.tagId
          )
        : null;
    },
    setIsTagListLoading: (state, action: PayloadAction<boolean>) => {
      state.isListLoading = action.payload;
    },
    setAddUpdateTag: (
      state,
      action: PayloadAction<{
        key: string;
        value: ITagDetails;
      }>
    ) => {
      const newRecord = recordOperations.addUpdateToRecord(
        state.tagsById,
        action.payload.key,
        action.payload.value
      );

      state.tagsById = newRecord;
      state.tagsArray = recordOperations.getArrayFromRecord(
        newRecord,
        'updatedAt',
        SortOrderEnum.DESC
      );
    },
    setDeleteTag: (
      state,
      action: PayloadAction<{
        key: string;
      }>
    ) => {
      if (state.tagsById && Object.keys(state.tagsById).length > 0) {
        const newRecord = recordOperations.deleteFromRecord(
          state.tagsById,
          action.payload.key
        );

        state.tagsById = newRecord;
        state.tagsArray = recordOperations.getArrayFromRecord(
          newRecord,
          'updatedAt',
          SortOrderEnum.DESC
        );
      }
    },
  },
});

export const {
  resetTaggingState,
  setTags,
  setIsTagListLoading,
  setAddUpdateTag,
  setDeleteTag,
} = taggingSlice.actions;

export const selectTagsArray = (state: IRootState) => {
  return state.tagging.tagsArray;
};
export const selectTagsById = (state: IRootState) => {
  return state.tagging.tagsById;
};
export const selectIsTagListLoading = (state: IRootState) => {
  return state.tagging.isListLoading;
};

const taggingReducer = taggingSlice.reducer;
export default taggingReducer;
