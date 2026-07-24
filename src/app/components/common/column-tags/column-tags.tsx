import { COLUMN_TAG_MAPPING } from '@/constants/advertising-filter.constants';
import { EditAccessValues } from '@/enums/edit-access.enums';
import { DynamicFilterKeys } from '@/enums/filter.enums';
import { Nullable } from '@/interfaces/index.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectEditAccessFilters } from '@/redux/slices/advertising/advertising-edit-access.slice';
import { setDynamicFilterValuesByFilterKey } from '@/redux/slices/filters/filter.slice';
import {
  selectTagsArray,
  selectTagsById,
} from '@/redux/slices/tagging/tagging.slice';
import { TagIcon, XIcon } from '@phosphor-icons/react';
import { TaggingTestIds } from 'cypress/enums/tagging';
import { useEffect, useMemo, useState } from 'react';
import styles from './column-tags.module.scss';
import TaggingPopover from './tagging-popover/tagging-popover';

interface IColumnTagsProps {
  tagArray: Array<string | number | null | undefined>;
  horizontalAlign?: 'start' | 'end';
  isTaggingRequired?: boolean;
  isTaggingEditable?: boolean;
  tagId?: Nullable<string>;
  handleTagUpdateLogic?: (updatedValue: string | null) => void;
  handleTableUpdateTagDelete?: (tagId: string) => void;
}

export default function ColumnTags({
  tagArray,
  horizontalAlign = 'start',
  isTaggingRequired = false,
  isTaggingEditable = false,
  tagId,
  handleTagUpdateLogic,
  handleTableUpdateTagDelete,
}: IColumnTagsProps) {
  const [openTag, setOpenTag] = useState<boolean>(false);

  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const tagsById = useAppSelector(selectTagsById);
  const tagsArray = useAppSelector(selectTagsArray);
  const dispatch = useAppDispatch();

  const formattedTagArray = useMemo(
    () =>
      tagArray
        ? tagArray
            .map((tag) => {
              if (tag != null) return COLUMN_TAG_MAPPING[tag] ?? tag;
              return tag;
            })
            .filter((tag) => Boolean(tag))
        : [],
    [tagArray]
  );

  const isEditMode = useMemo(
    () =>
      editAccessFilters.editAccess.value === EditAccessValues.Edit &&
      isTaggingEditable,
    [editAccessFilters.editAccess.value, isTaggingEditable]
  );

  const selectedTag = useMemo(() => {
    if (!tagsById || !tagId) return null;
    return tagsById[tagId];
  }, [tagId, tagsById]);

  const handleTaggingLogic = (updatedValue: string | null) => {
    if (handleTagUpdateLogic) handleTagUpdateLogic(updatedValue);
    return;
  };

  const handleTagRemove = (event: React.MouseEvent) => {
    event.preventDefault();
    handleTaggingLogic(null);
  };

  useEffect(() => {
    if (isTaggingRequired) {
      dispatch(
        setDynamicFilterValuesByFilterKey({
          [DynamicFilterKeys.TAG_NAME]: tagsArray.map((item) => item.tagName),
        })
      );
    }
  }, [dispatch, tagsArray, isTaggingRequired]);

  if (formattedTagArray.length > 0 || isTaggingRequired === true)
    return (
      <div
        className={styles.tagContainer}
        style={{ justifyContent: horizontalAlign }}
      >
        {formattedTagArray.length > 0 &&
          formattedTagArray.map((tag, index) => (
            <span key={index} className={styles.tag}>
              {tag}
            </span>
          ))}

        {formattedTagArray.length > 0 && isTaggingRequired === true && (
          <div className={styles.vl}>
            <span>t</span>
          </div>
        )}

        {isTaggingRequired === true && (
          <TaggingPopover
            isDisabled={!isEditMode}
            selectedTag={selectedTag}
            handleTagUpdateLogic={handleTaggingLogic}
            handleTableUpdateTagDelete={handleTableUpdateTagDelete}
            customOpenHandler={setOpenTag}
            customOpenState={openTag}
          >
            {Boolean(selectedTag) === true ? (
              <div
                className={`${styles.tag} ${styles.tagButton} ${
                  isEditMode ? styles.editMode : ''
                } ${openTag ? styles.tagOpen : ''}`}
                style={{
                  backgroundColor: selectedTag?.tagColor ?? '#fff',
                }}
                data-test={TaggingTestIds.TAG_ROW_TOGGLE_BUTTON}
              >
                <TagIcon
                  size={'1rem'}
                  color="#464646"
                  className={styles.tagIcon}
                />

                <span
                  className={styles.tagButtonText}
                  title={selectedTag?.tagName}
                >
                  {selectedTag?.tagName}
                </span>

                <div
                  className={styles.tagButtonClose}
                  onClick={handleTagRemove}
                  style={{ backgroundColor: selectedTag?.tagColor ?? '#fff' }}
                  data-test={TaggingTestIds.TAG_REMOVE_BUTTON}
                >
                  <XIcon size={'1rem'} color="#acacac" weight="bold" />
                </div>
              </div>
            ) : (
              <div
                className={`${styles.tag} ${styles.noTagButton} ${
                  isEditMode ? styles.editMode : ''
                } ${openTag ? styles.tagOpen : ''}`}
              >
                <TagIcon size={'1rem'} color="#acacac" /> Tag
              </div>
            )}
          </TaggingPopover>
        )}
      </div>
    );
}
