import { ProductActionTaggingOptions } from '@/constants/keyword-action.constants';
import { KeywordActionKeywordTagEnum } from '@/enums/keyword-action.enums';
import {
  IProductActionsData,
  IUpdateTaggingPayload,
} from '@/interfaces/keyword-actions.interface';
import { useAppDispatch } from '@/redux/hooks';
import { useAppMutation } from '@/redux/react-query-hooks';
import { showSuccessToastMessage } from '@/redux/slices/notifications/toast-message.slice';
import { KeywordActionsAmazonService } from '@/services/keyword-actions-amazon.service';
import keywordActionsUtils from '@/utils/keyword-actions.utils';
import { useMemo } from 'react';
import Dropdown, { IDropdownItem } from '../../dropdown/dropdown';
import { ProductActionDetails } from '../product-actions-details/product-actions-details';
import styles from '../product-actions-details/product-actions-details.module.scss';

export function ProductActionTargetingOpportunitiesAmazon(
  props: IProductActionsData
) {
  const {
    searchTerm,
    adGroupCount,
    tag,
    brandName,
    price,
    ratings,
    reviews,
    title,
  } = props;
  const dispatch = useAppDispatch();

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
    <div>
      <ProductActionDetails
        searchTerm={searchTerm}
        title={title}
        brandName={brandName}
        price={price}
        ratings={ratings}
        reviews={reviews}
      />
      <div className={styles.searchTermContainer}>
        <Dropdown
          options={ProductActionTaggingOptions}
          selected={keywordActionsUtils.getSelectedProductActionTag(tag)}
          label=""
          onSelect={handleSetTagClick}
          stopPropagation={true}
          width="100%"
          disabled={isTaggingLoading}
          height="3.2rem"
        />
      </div>
    </div>
  );
}
