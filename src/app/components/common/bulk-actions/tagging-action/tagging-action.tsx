import { EditAccessValues } from '@/enums/edit-access.enums';
import { TooltipPlacement } from '@/enums/tooltip-texts.enums';
import { IOverallCampaign } from '@/interfaces/advertising/amazon/overall-advertising.interface';
import { ISBCampaign } from '@/interfaces/advertising/amazon/sb-advertising.interface';
import { ISDCampaign } from '@/interfaces/advertising/amazon/sd-advertising.interface';
import { ICampaign } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IWalmartCampaign } from '@/interfaces/advertising/walmart/walmart-sp-advertising.interface';
import { IEditBulkActionProp } from '@/interfaces/edit-access/edit-access.interface';
import { Nullable } from '@/interfaces/index.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectEditAccessFilters,
  selectEditState,
  selectIsOpenTagDialog,
  selectSelectedRowIds,
  setEditState,
  setIsOpenTagDialog,
} from '@/redux/slices/advertising/advertising-edit-access.slice';
import { selectTagsById } from '@/redux/slices/tagging/tagging.slice';
import Button from '@mui/material/Button';
import { TagIcon } from '@phosphor-icons/react';
import { TaggingTestIds } from 'cypress/enums/tagging';
import { useMemo, useState } from 'react';
import TaggingPopover from '../../column-tags/tagging-popover/tagging-popover';
import HoverInfoTooltip from '../../hover-info-tooltip/hover-info-tooltip';
import { newTextButtonStyles } from '../../text-button/text-button-styles';

type ITaggingActionProps = IEditBulkActionProp;

export default function TaggingAction({ setTableData }: ITaggingActionProps) {
  const [selectedTagId, setSelectedTagId] = useState<Nullable<string>>(null);

  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const editState = useAppSelector(selectEditState);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const isOpenBulkTag = useAppSelector(selectIsOpenTagDialog);
  const tagsById = useAppSelector(selectTagsById);
  const dispatch = useAppDispatch();

  const isEditMode = useMemo(
    () => editAccessFilters.editAccess.value === EditAccessValues.Edit,
    [editAccessFilters.editAccess.value]
  );

  const handleTaggingLogic = (tagId: string | null) => {
    setSelectedTagId(tagId);

    const updatedState = editState.map((row) => {
      if (selectedRowIds.includes(row.id as string | number)) {
        return {
          ...row,
          tagId: tagId,
        };
      }

      return row;
    });

    dispatch(
      setEditState(
        updatedState as
          | ICampaign[]
          | ISBCampaign[]
          | ISDCampaign[]
          | IOverallCampaign[]
          | IWalmartCampaign[]
      )
    );
    setTableData(
      updatedState as
        | ICampaign[]
        | ISBCampaign[]
        | ISDCampaign[]
        | IOverallCampaign[]
        | IWalmartCampaign[]
    );
  };

  const handleOpenTagPopup = (nextOpen: boolean) => {
    dispatch(setIsOpenTagDialog(nextOpen));
  };

  const customButton = (isDisabled = false, isSelected = false) => (
    <Button
      data-test={TaggingTestIds.TAG_BULK_TOGGLE_BUTTON}
      sx={{
        ...newTextButtonStyles(isDisabled, isSelected),
      }}
      disabled={isDisabled}
      disableRipple
      startIcon={<TagIcon />}
    >
      <span>Tag</span>
    </Button>
  );

  const selectedTag = useMemo(() => {
    if (!tagsById || !selectedTagId) return null;
    return tagsById[selectedTagId];
  }, [selectedTagId, tagsById]);

  return (
    <TaggingPopover
      isDisabled={!isEditMode}
      selectedTag={selectedTag}
      handleTagUpdateLogic={handleTaggingLogic}
      customOpenHandler={handleOpenTagPopup}
      customOpenState={isOpenBulkTag}
      alignPopup="end"
      isBulkEdit={true}
    >
      {selectedRowIds.length > 0 ? (
        customButton(false, isOpenBulkTag)
      ) : (
        <HoverInfoTooltip
          title="No row selected"
          position={TooltipPlacement.Bottom}
        >
          <span style={{ cursor: 'not-allowed' }}>
            {customButton(true, false)}
          </span>
        </HoverInfoTooltip>
      )}
    </TaggingPopover>
  );
}
