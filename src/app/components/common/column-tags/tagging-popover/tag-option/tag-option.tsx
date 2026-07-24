import { outlinedTextBoxAltStyles } from '@/assets/styles/variables/common-new-ui/common-new-ui.styles';
import { DynamicFilterKeys } from '@/enums/filter.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { Nullable } from '@/interfaces/index.interface';
import {
  IAPIResponse,
  IErrorResultDetails,
} from '@/interfaces/service.interface';
import {
  ITagDetails,
  IUpdateTagPayload,
} from '@/interfaces/tagging/tagging.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppMutation } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { setDynamicFilterValuesByFilterKey } from '@/redux/slices/filters/filter.slice';
import { showErrorToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import {
  selectTagsArray,
  setAddUpdateTag,
  setDeleteTag,
} from '@/redux/slices/tagging/tagging.slice';
import { TaggingServices } from '@/services/tagging/tagging.services';
import { setOperations } from '@/utils';
import { checkIsEqual } from '@/utils/advertising.utils';
import { TaggingUtils } from '@/utils/tagging.utils';
import CircularProgress from '@mui/material/CircularProgress';
import OutlinedInput from '@mui/material/OutlinedInput';
import {
  KeyReturnIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
} from '@phosphor-icons/react';
import { TaggingTestIds } from 'cypress/enums/tagging';
import { useEffect, useMemo, useState } from 'react';
import ConfirmationBox from '../../../confirmation-box/confirmation-box';
import PrimaryIconButton from '../../../primary-icon-button/primary-icon-button';
import TextCharacterCounter from '../../../text-character-counter/text-character-counter';
import styles from './tag-option.module.scss';

interface ITagOptionProps {
  tagItem: ITagDetails;
  currentEditId: Nullable<string>;
  handleSetEditId: (id: string | null) => void;
  setHoverId: React.Dispatch<React.SetStateAction<string | null>>;
  isHovering: boolean;
  isSelected: boolean;
  handleTagUpdateLogic: (tagId: string | null) => void;
  handleTableUpdateTagDelete?: (tagId: string) => void;
  isBulkEdit?: boolean;
}

export default function TagOption({
  tagItem,
  currentEditId,
  handleSetEditId,
  setHoverId,
  isHovering,
  isSelected,
  handleTagUpdateLogic,
  handleTableUpdateTagDelete,
  isBulkEdit = false,
}: ITagOptionProps) {
  const [editTagName, setEditTagName] = useState<string>(
    tagItem?.tagName ?? ''
  );
  const [error, setError] = useState<string>('');
  const [openDeleteConfirmation, setOpenDeleteConfirmation] =
    useState<boolean>(false);

  const tagsArray = useAppSelector(selectTagsArray);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const dispatch = useAppDispatch();

  const metaId = useMemo(
    () => advertisingAccount?.value,
    [advertisingAccount?.value]
  );
  const marketplace = useMemo(
    () => advertisingAccount?.marketplace ?? MarketplaceEnum.AMAZON,
    [advertisingAccount?.marketplace]
  );

  const normalizedTagNameSet = useMemo(
    () =>
      setOperations.getSetFromArray(tagsArray, (item) =>
        item.tagName?.toLowerCase()
      ),
    [tagsArray]
  );

  const isTagEditEnabled = useMemo(
    () => checkIsEqual(tagItem?.tagId ?? '', currentEditId),
    [tagItem?.tagId, currentEditId]
  );

  const getTagEditError = () => {
    const searchError = TaggingUtils.checkTagNameError(editTagName);

    if (searchError) {
      return searchError;
    } else if (normalizedTagNameSet.has(editTagName?.toLowerCase())) {
      return 'Tag already exists.';
    } else {
      return '';
    }
  };

  const {
    mutateAsync: editTagMutate,
    isIdle: isEditIdle,
    isPending: isEditPending,
  } = useAppMutation({
    mutationFn: (body: IUpdateTagPayload) =>
      TaggingServices.updateTag(metaId, tagItem?.tagId, body),
    options: {
      onSuccess: (data, variables) => {
        dispatch(
          setAddUpdateTag({
            key: tagItem?.tagId,
            value: {
              ...tagItem,
              tagName: variables.tagName,
            },
          })
        );

        handleSetEditId(null);
      },
      onError(error) {
        if (error && error.response) {
          const resErrorData = error.response.data as
            | IAPIResponse<IErrorResultDetails>
            | undefined;

          dispatch(
            showErrorToastMessage({
              title: resErrorData?.message ?? '',
              description: resErrorData?.description,
            })
          );
        }
      },
    },
  });

  const {
    mutateAsync: deleteTagMutate,
    isIdle: isDeleteIdle,
    isPending: isDeletePending,
  } = useAppMutation({
    mutationFn: () =>
      TaggingServices.deleteTag(metaId, tagItem?.tagId, marketplace),
    options: {
      onSuccess: (data) => {
        dispatch(
          setDeleteTag({
            key: tagItem?.tagId,
          })
        );

        if (handleTableUpdateTagDelete)
          handleTableUpdateTagDelete(tagItem?.tagId);
        handleDeleteClickClose();
      },
      onError(error) {
        if (error && error.response) {
          const resErrorData = error.response.data as
            | IAPIResponse<IErrorResultDetails>
            | undefined;

          dispatch(
            showErrorToastMessage({
              title: resErrorData?.message ?? '',
              description: resErrorData?.description,
            })
          );
        }
      },
    },
  });

  const handleEditClick = () => {
    setEditTagName(tagItem?.tagName ?? '');
    handleSetEditId(tagItem?.tagId ?? '');
    setError('');
  };

  const handleTagEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value || '';
    setEditTagName(newValue);
    setError('');
  };

  const handleEditEnterClick = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      const err = getTagEditError();

      if (err) {
        setError(err);
        return;
      } else {
        setError('');
      }

      const payload: IUpdateTagPayload = {
        tagName: editTagName,
        marketplace,
      };

      await editTagMutate(payload);
    }
  };

  const handleDeleteClickOpen = () => {
    handleOpenDeleteConfirmation(true);
  };

  const handleDeleteClickClose = () => {
    handleOpenDeleteConfirmation(false);
  };

  const handleOpenDeleteConfirmation = (open: boolean) =>
    setOpenDeleteConfirmation(open);

  const handleDeleteTag = async () => {
    await deleteTagMutate();
  };

  const handleTagClick = (tagId: string) => {
    if (isTagEditEnabled || openDeleteConfirmation) return;

    if (isSelected && !isBulkEdit) handleTagUpdateLogic(null);
    else handleTagUpdateLogic(tagId);
  };

  const isEditLoading = useMemo(
    () => isEditPending === true && isEditIdle === false,
    [isEditPending, isEditIdle]
  );

  const isDeleteLoading = useMemo(
    () => isDeletePending === true && isDeleteIdle === false,
    [isDeletePending, isDeleteIdle]
  );

  useEffect(() => {
    dispatch(
      setDynamicFilterValuesByFilterKey({
        [DynamicFilterKeys.TAG_NAME]: tagsArray.map((item) => item.tagName),
      })
    );
  }, [dispatch, tagsArray]);

  useEffect(() => {
    const err = getTagEditError();
    if (err) {
      setError(err);
    } else {
      setError('');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalizedTagNameSet]);

  return (
    <div
      data-test={TaggingTestIds.TAG_OPTION_COMPONENT}
      className={styles.tagActionContainerWrapper}
      onMouseEnter={() => setHoverId(tagItem?.tagId)}
      onMouseLeave={() => setHoverId(null)}
      onClick={() => handleTagClick(tagItem?.tagId)}
      style={{
        backgroundColor: isHovering
          ? '#f6f6f6'
          : isSelected
          ? '#f2f2f2'
          : 'initial',
      }}
    >
      <div className={styles.tagActionContainer}>
        {isTagEditEnabled === true ? (
          <div className={styles.editTagContainer}>
            <OutlinedInput
              data-test={TaggingTestIds.TAG_OPTION_EDIT_FIELD}
              value={editTagName}
              title={editTagName}
              onChange={handleTagEditChange}
              onKeyDown={handleEditEnterClick}
              sx={{
                ...outlinedTextBoxAltStyles(),
                height: '1.8rem',
                fontSize: '0.8rem',
                borderRadius: '0.4rem',
                '.MuiCircularProgress-root': {
                  display: 'flex',
                },
              }}
              error={Boolean(error)}
              endAdornment={
                isEditLoading ? (
                  <CircularProgress size={'1.3rem'} sx={{ color: '#acacac' }} />
                ) : (
                  <KeyReturnIcon
                    size={'1.5rem'}
                    color="#acacac"
                    weight="light"
                  />
                )
              }
              disabled={isEditLoading}
            />
            {Boolean(error) === true && <p className={styles.error}>{error}</p>}
          </div>
        ) : (
          <div className={styles.tagLoaderContainer}>
            <span
              className={styles.tagBoxContainer}
              title={tagItem?.tagName ?? ''}
              style={{
                backgroundColor: tagItem?.tagColor ?? 'initial',
              }}
            >
              {tagItem?.tagName ?? ''}
            </span>

            {isSelected === true && isHovering === true && !isBulkEdit && (
              <XIcon size={'1rem'} fill="#acacac" weight="bold" />
            )}

            {isDeleteLoading === true && (
              <CircularProgress size={'1.5rem'} sx={{ color: '#acacac' }} />
            )}
          </div>
        )}

        <div
          className={styles.actions}
          style={{ visibility: isHovering ? 'visible' : 'hidden' }}
        >
          {isTagEditEnabled === true && (
            <TextCharacterCounter textStr={editTagName} />
          )}

          <PrimaryIconButton
            data-test={TaggingTestIds.TAG_OPTION_EDIT_BUTTON}
            width={'1.8rem'}
            height={'1.8rem'}
            buttonFunction={handleEditClick}
            disabled={false}
            buttonIcon={
              <PencilIcon size={'1.1rem'} color="#acacac" weight="light" />
            }
            isHoverTooltipEnabled={true}
            tooltipText="Edit tag"
            borderRadius="0.4rem"
            hoverColor="#000000"
            customStyles={{
              padding: '0.1rem',
            }}
          />

          <PrimaryIconButton
            data-test={TaggingTestIds.TAG_OPTION_DELETE_BUTTON}
            width={'1.8rem'}
            height={'1.8rem'}
            buttonFunction={handleDeleteClickOpen}
            disabled={false}
            buttonIcon={
              <TrashIcon size={'1.1rem'} color="#acacac" weight="light" />
            }
            isHoverTooltipEnabled={true}
            tooltipText="Delete tag"
            borderRadius="0.4rem"
            hoverColor="#ff0000"
            customStyles={{
              padding: '0.1rem',
            }}
          />

          <ConfirmationBox
            title="Delete Tag"
            description={
              <p className={styles.popupDescription}>
                Are you sure you want to delete the <b>{tagItem?.tagName}</b>{' '}
                tag from database?
              </p>
            }
            openConfirmation={openDeleteConfirmation}
            handleConfirmationClose={handleDeleteClickClose}
            isConfirmButtonRequired={true}
            handleConfirmClick={handleDeleteTag}
            isLoading={isDeleteLoading}
            confirmButtonText="Delete"
            loadingText="Please wait..."
            titleStartIcon={
              <div className={styles.popupTitleIcon}>
                <TrashIcon size={'1.5rem'} color="#ff0000" weight="light" />
              </div>
            }
            confirmButtonColor="#F26E77"
            maxWidth="xs"
            isNewDesign={true}
            fullWidthActionButtons={true}
          />
        </div>
      </div>
    </div>
  );
}
