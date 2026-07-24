import { imageUrls } from '@/constants/assets/images.constants';
import { useAppMutation } from '@/redux/react-query-hooks';
import { useMemo } from 'react';
import { KeywordActionTaggingOptions } from 'src/constants/keyword-action.constants';
import { KeywordActionKeywordTagEnum } from 'src/enums/keyword-action.enums';
import { IUpdateTaggingPayload } from 'src/interfaces/keyword-actions.interface';
import { useAppDispatch } from 'src/redux/hooks';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { KeywordActionsAmazonService } from 'src/services/keyword-actions-amazon.service';
import keywordActionsUtils from 'src/utils/keyword-actions.utils';
import Dropdown, { IDropdownItem } from '../../dropdown/dropdown';
import ImgComponent from '../../img-component/img-component';
import InfoIcon from '../../info-icon/info-icon';
import styles from '../keyword-action-table.module.scss';
import {
  adGroupCountStyles,
  keywordActionSearchTermKeywordStyles,
} from '../keyword-actions-table-styles';
import { IKeywordActionSearchTermWrapperProps } from './keyword-action-search-term-wrapper';

const KeywordActionSearchTermAmazon = (
  props: IKeywordActionSearchTermWrapperProps
) => {
  const { searchTerm, adGroupCount, tag, id } = props;

  const dispatch = useAppDispatch();

  const title = `This Keyword is already present in ${adGroupCount} AdGroups.`;

  const handleSetTagClick = (
    selectedOption: IDropdownItem<KeywordActionKeywordTagEnum>
  ) => {
    const payload: IUpdateTaggingPayload = {
      searchTerm,
      tag: selectedOption.value,
    };
    updateTag(payload);
  };

  const {
    mutateAsync: updateTag,
    isIdle,
    isPending,
  } = useAppMutation({
    mutationFn: (payload: IUpdateTaggingPayload) =>
      KeywordActionsAmazonService.updateTagging(payload),
    options: {
      onSuccess() {
        dispatch(
          showSuccessToastMessage({
            title: `Success! Tag for the keyword has been updated.`,
          })
        );
      },
    },
  });

  const isTaggingLoading = useMemo(
    () => isIdle === false && isPending === true,
    [isIdle, isPending]
  );

  return (
    <div className={styles.searchTermContainer}>
      {adGroupCount > 0 && (
        <div style={adGroupCountStyles}>
          {adGroupCount} Adgroups <InfoIcon title={title} />
        </div>
      )}
      <div style={keywordActionSearchTermKeywordStyles}>
        <span style={{ fontWeight: 500 }}>{searchTerm}</span>
        {adGroupCount === 0 && (
          <ImgComponent imageURL={imageUrls.newKeywordTag} alt="new-keyword" />
        )}
      </div>
      <Dropdown
        options={KeywordActionTaggingOptions}
        selected={keywordActionsUtils.getSelectedTag(tag)}
        label=""
        onSelect={handleSetTagClick}
        stopPropagation={true}
        width="100%"
        disabled={isTaggingLoading}
        height="3.2rem"
      />
    </div>
  );
};

export default KeywordActionSearchTermAmazon;
