import { AdvertisingTitlesEnum } from '@/enums/advertising.enums';
import { EditAccessValues } from '@/enums/edit-access.enums';
import { TargetingTypeEnum } from '@/enums/walmart.enums';
import { Nullable } from '@/interfaces/index.interface';
import { useAppSelector } from '@/redux/hooks';
import {
  selectEditAccessFilters,
  selectNameErr,
} from '@/redux/slices/advertising/advertising-edit-access.slice';
import { selectSelectedAdvertisingNavTitle } from '@/redux/slices/advertising/advertising-filter.slice';
import { checkIsEqual, getIsTaggingEditable } from '@/utils/advertising.utils';
import { TextField } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import ColumnTags from '../../common/column-tags/column-tags';
import { editNameFieldStyles } from './advertising-name-edit-styles';
import styles from './advertising-name-edit.module.scss';

interface IAdvertisingNameEditProps {
  handleNameUpdateLogic: (updatedValue: string) => void;
  handleTagUpdateLogic?: (updatedValue: string | null) => void;
  handleTableUpdateTagDelete?: (tagId: string) => void;
  originalName: string;
  id: string;
  adType?: string;
  targetingType?: string;
  isTaggingRequired: boolean;
  tagId: Nullable<string>;
}

export default function AdvertisingNameEdit({
  handleNameUpdateLogic,
  handleTagUpdateLogic,
  handleTableUpdateTagDelete,
  originalName,
  id,
  adType,
  targetingType,
  isTaggingRequired,
  tagId,
}: IAdvertisingNameEditProps) {
  const nameErrMsg = useAppSelector(selectNameErr);
  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const selectedAdvertisingNavTitle = useAppSelector(
    selectSelectedAdvertisingNavTitle
  );

  const [value, setValue] = useState<string>(originalName);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(value);
    handleNameUpdateLogic(value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
  };

  const isError = useMemo(
    () => nameErrMsg !== undefined && Boolean(nameErrMsg[id]),
    [nameErrMsg, id]
  );

  const isTaggingEditable = useMemo(
    () =>
      getIsTaggingEditable(
        selectedAdvertisingNavTitle as AdvertisingTitlesEnum
      ),
    [selectedAdvertisingNavTitle]
  );

  useEffect(() => {
    if (editAccessFilters.editAccess.value === EditAccessValues.View) {
      setValue(originalName);
    }
  }, [editAccessFilters.editAccess, originalName]);

  return (
    <div className={styles.infoContainer}>
      <div className={styles.nameFieldContainer}>
        <TextField
          variant="outlined"
          value={value}
          onChange={handleNameChange}
          onKeyDown={handleInputKeyDown}
          sx={{
            ...editNameFieldStyles,
            background: !checkIsEqual(originalName, value) ? '#FAEDFF' : '#fff',
            ...(isError && { border: '0.5px solid #ff0000' }),
          }}
          error={isError}
        />
        {isError === true && nameErrMsg !== undefined && (
          <p className={styles.error}>{nameErrMsg[id]?.message ?? ''}</p>
        )}
      </div>

      <ColumnTags
        tagArray={[targetingType || TargetingTypeEnum.MANUAL, adType]}
        isTaggingRequired={isTaggingRequired}
        isTaggingEditable={isTaggingEditable}
        tagId={tagId}
        handleTagUpdateLogic={handleTagUpdateLogic}
        handleTableUpdateTagDelete={handleTableUpdateTagDelete}
      />
    </div>
  );
}
