import { outlinedTextBoxAltStyles } from '@/assets/styles/variables/common-new-ui/common-new-ui.styles';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MarketplaceEnum } from '@/enums/serp.enums';
import useDebounce from '@/hooks/use-debounce.hook';
import { Nullable } from '@/interfaces/index.interface';
import {
  IAPIResponse,
  IErrorResultDetails,
} from '@/interfaces/service.interface';
import {
  ICreateTagPayload,
  ITagDetails,
} from '@/interfaces/tagging/tagging.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppMutation } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { showErrorToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import {
  selectIsTagListLoading,
  selectTagsArray,
  setAddUpdateTag,
} from '@/redux/slices/tagging/tagging.slice';
import { TaggingServices } from '@/services/tagging/tagging.services';
import { checkIsEqual } from '@/utils/advertising.utils';
import { TaggingUtils } from '@/utils/tagging.utils';
import { Button, CircularProgress, OutlinedInput } from '@mui/material';
import { KeyReturnIcon } from '@phosphor-icons/react';
import { TaggingTestIds } from 'cypress/enums/tagging';
import { useMemo, useState } from 'react';
import { newTextButtonStyles } from '../../text-button/text-button-styles';
import TextCharacterCounter from '../../text-character-counter/text-character-counter';
import TagOption from './tag-option/tag-option';
import styles from './tagging-popover.module.scss';

const DEBOUNCE_DELAY = 500;

interface ITaggingPopoverProps {
  children: React.ReactNode;
  isDisabled: boolean;
  selectedTag: Nullable<ITagDetails> | undefined;
  handleTagUpdateLogic: (updatedValue: string | null) => void;
  handleTableUpdateTagDelete?: (tagId: string) => void;
  customOpenHandler: (nextOpen: boolean) => void;
  customOpenState: boolean;
  alignPopup?: 'center' | 'end' | 'start';
  isBulkEdit?: boolean;
}

export default function TaggingPopover({
  children,
  isDisabled,
  selectedTag,
  handleTagUpdateLogic,
  handleTableUpdateTagDelete,
  customOpenHandler,
  customOpenState,
  alignPopup = 'start',
  isBulkEdit = false,
}: ITaggingPopoverProps) {
  const [tagSearchText, setTagSearchText] = useState<string>('');
  const [searchTextError, setSearchTextError] = useState<string>('');
  const [selectedTagEditId, setSelectedTagEditId] = useState<string | null>(
    null
  );
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [exactMatchTagId, setExactMatchTagId] = useState<string | null>(null);

  const tagsArray = useAppSelector(selectTagsArray);
  const isTagListLoading = useAppSelector(selectIsTagListLoading);
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);
  const dispatch = useAppDispatch();

  const debouncedSearchText = useDebounce(
    tagSearchText?.trim()?.toLowerCase(),
    DEBOUNCE_DELAY
  );

  const metaId = useMemo(
    () => advertisingAccount?.value,
    [advertisingAccount?.value]
  );

  const marketplace = useMemo(
    () => advertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [advertisingAccount.marketplace]
  );

  const normalizedTagNameArray = useMemo(
    () =>
      tagsArray.map((tag) => ({
        ...tag,
        tagNameLowercase: tag.tagName?.toLowerCase(),
      })),
    [tagsArray]
  );

  const filteredList = useMemo(() => {
    if (!debouncedSearchText) return normalizedTagNameArray;

    let exactMatchId: string | null = null;

    const filtered = normalizedTagNameArray.filter((tag) => {
      if (checkIsEqual(tag.tagNameLowercase, debouncedSearchText)) {
        exactMatchId = tag.tagId;
      }

      return tag.tagNameLowercase.includes(debouncedSearchText);
    });

    setExactMatchTagId(exactMatchId);
    return filtered;
  }, [normalizedTagNameArray, debouncedSearchText]);

  const {
    mutateAsync: createTagMutate,
    isIdle: isCreateIdle,
    isPending: isCreatePending,
  } = useAppMutation({
    mutationFn: async (body: ICreateTagPayload) => {
      const filtered = normalizedTagNameArray.filter((tag) => {
        return checkIsEqual(tag.tagNameLowercase, body.tagName?.toLowerCase());
      });

      if (filtered.length > 0) return null;
      return await TaggingServices.createTag(metaId, body);
    },
    options: {
      onSuccess: (data) => {
        if (!data) return;
        const response = data.data.data;

        if (response !== null) {
          dispatch(
            setAddUpdateTag({
              key: response?.tagId ?? '',
              value: response,
            })
          );

          handleTagUpdateLogic(response?.tagId);
        }
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

  const isCreateLoading = useMemo(
    () => isCreatePending === true && isCreateIdle === false,
    [isCreatePending, isCreateIdle]
  );

  const handleEditTag = (id: string | null) => {
    if (id !== selectedTagEditId) setSelectedTagEditId(id);
    else setSelectedTagEditId(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isDisabled) return;
    setTagSearchText('');
    setSearchTextError('');
    setSelectedTagEditId(null);
    customOpenHandler(nextOpen);
  };

  const handleTagUpdate = (tagId: string | null) => {
    handleTagUpdateLogic(tagId);
  };

  const handleTagSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value || '';
    setTagSearchText(newValue);
    setSearchTextError('');
  };

  const handleEnterClick = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      const searchError = TaggingUtils.checkTagNameError(tagSearchText);

      if (searchError) {
        setSearchTextError(searchError);
        return;
      } else {
        setSearchTextError('');
      }

      if (exactMatchTagId) {
        handleTagUpdate(exactMatchTagId);
        return;
      }

      const payload: ICreateTagPayload = {
        tagName: tagSearchText?.trim() ?? '',
        tagColor: '#ffffff',
        marketplace,
      };

      setTagSearchText('');
      await createTagMutate(payload);
    }
  };

  return (
    <Popover
      open={customOpenState}
      onOpenChange={handleOpenChange}
      data-test={TaggingTestIds.TAG_POPUP}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align={alignPopup} hideWhenDetached sticky="always">
        <div className={styles.taggingContainer}>
          <div className={styles.searchContainer}>
            <div className={styles.textBoxContainer}>
              <OutlinedInput
                data-test={TaggingTestIds.TAG_SEARCH_CREATE_FIELD}
                value={tagSearchText}
                title={tagSearchText}
                onChange={handleTagSearchChange}
                onKeyDown={handleEnterClick}
                sx={{
                  ...outlinedTextBoxAltStyles('0.9rem'),
                  height: '3rem',
                  fontSize: '1rem',
                  '.MuiCircularProgress-root': {
                    display: 'flex',
                  },
                }}
                error={Boolean(searchTextError)}
                placeholder="Search or Type to create a tag"
                endAdornment={
                  isCreateLoading === true ? (
                    <CircularProgress
                      size={'1.3rem'}
                      sx={{ color: '#acacac' }}
                    />
                  ) : (
                    <TextCharacterCounter textStr={tagSearchText} />
                  )
                }
                disabled={isCreateLoading}
              />
              {Boolean(searchTextError) === true && (
                <p className={styles.error}>{searchTextError}</p>
              )}
            </div>

            {isBulkEdit === true && (
              <div className={styles.removeContainer}>
                <Button
                  data-test={TaggingTestIds.TAG_BULK_REMOVE_BUTTON}
                  sx={{
                    ...newTextButtonStyles(),
                    padding: '0',
                    fontSize: '0.8rem',
                    width: 'auto',
                    height: 'auto',
                    lineHeight: '100%',

                    '&:hover': {
                      color: '#ff0000',
                      fontSize: '0.8rem',
                      background: 'transparent',
                    },
                  }}
                  disableRipple
                  onClick={() => handleTagUpdate(null)}
                >
                  Remove Tag
                </Button>
              </div>
            )}
          </div>

          <div className={styles.listContainer}>
            {Boolean(tagSearchText) === true &&
              Boolean(exactMatchTagId) === false && (
                <div
                  className={styles.tagCreatePrompt}
                  data-test={TaggingTestIds.TAG_CREATE_PROMPT}
                >
                  <span className={styles.createPrompt}>
                    Create &nbsp;
                    <span
                      className={styles.tagBoxContainer}
                      title={tagSearchText}
                    >
                      {tagSearchText}
                    </span>
                  </span>
                  <span
                    className={`${styles.createPrompt} ${styles.promptEndAlign}`}
                  >
                    Press enter&nbsp;
                    <KeyReturnIcon
                      size={'1rem'}
                      color="#acacac"
                      weight="light"
                    />
                  </span>
                </div>
              )}

            {isTagListLoading === true ? (
              <CircularProgress
                size={'2rem'}
                sx={{ color: '#acacac', m: '1rem' }}
              />
            ) : Boolean(filteredList.length) === false ? (
              <p
                className={styles.noTagMessage}
                data-test={TaggingTestIds.TAG_EMPTY_LIST_MSG}
              >
                No Tags have been created yet.
              </p>
            ) : (
              <div
                className={styles.listActionContainer}
                data-test={TaggingTestIds.TAG_LIST}
              >
                {filteredList.map((tagItem) => (
                  <TagOption
                    key={tagItem.tagId}
                    tagItem={tagItem}
                    currentEditId={selectedTagEditId}
                    handleSetEditId={handleEditTag}
                    setHoverId={setHoverId}
                    isHovering={checkIsEqual(tagItem.tagId, hoverId)}
                    isSelected={checkIsEqual(tagItem.tagId, selectedTag?.tagId)}
                    handleTagUpdateLogic={handleTagUpdate}
                    handleTableUpdateTagDelete={handleTableUpdateTagDelete}
                    isBulkEdit={isBulkEdit}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
