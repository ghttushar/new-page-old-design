import { imageUrls } from '@/constants/assets/images.constants';
import { TargetingActionTypeEnum } from '@/enums/keyword-action.enums';
import { selectUpdatedProductActionTableData } from '@/redux/slices/keyword-action/amazon/product-action.slice';
import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import { ISelectedSearchTermsToArchive } from 'src/interfaces/keyword-actions.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectKeywordActionFilters,
  selectKeywordActionSelectedRowIds,
  selectMatchTypeToAdd,
  selectTargetAdGroups,
  selectTrigger,
  selectUpdatedAdditionTableData,
  setTrigger,
} from 'src/redux/slices/keyword-action/amazon/keyword-action.slice';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import { KeywordActionsAmazonService } from 'src/services/keyword-actions-amazon.service';
import keywordActionsUtils from 'src/utils/keyword-actions.utils';
import ImgComponent from '../../img-component/img-component';

interface KeywordActionArchiveProps {
  rowId: number;
  targetActionType?: TargetingActionTypeEnum;
}
const AmazonKeywordActionArchive = (props: KeywordActionArchiveProps) => {
  const { rowId, targetActionType } = props;

  const [isSearchTermAdding, setIsSearchTermAdding] = useState(false);

  const dispatch = useAppDispatch();
  const selectedRowIds = useAppSelector(selectKeywordActionSelectedRowIds);
  const trigger = useAppSelector(selectTrigger);
  const selectedAdGroups = useAppSelector((root) =>
    selectTargetAdGroups(root, rowId)
  );
  const selectMatchTypes = useAppSelector((root) =>
    selectMatchTypeToAdd(root, rowId)
  );

  const updatedAdditionTableData = useAppSelector(
    targetActionType === TargetingActionTypeEnum.PRODUCT_ACTIONS
      ? selectUpdatedProductActionTableData
      : selectUpdatedAdditionTableData
  );
  const actionTypeFilters = useAppSelector(selectKeywordActionFilters);

  const handleArchiveClick = () => {
    const isMatchTypeSelected = selectMatchTypes.some(
      (matchType) => matchType.selected
    );
    if (!isMatchTypeSelected) {
      dispatch(
        showErrorToastMessage({
          title: `Select Match Type to Archive`,
        })
      );
      return;
    }

    setIsSearchTermAdding(true);
    const searchTerm = updatedAdditionTableData[rowId].searchTerm;
    const data: ISelectedSearchTermsToArchive[] = [];
    selectMatchTypes.forEach((matchType) => {
      const isMatchTypeSelected = matchType.selected;
      selectedAdGroups.forEach((adGroup) => {
        const isAdGroupSelected = adGroup.selected;
        if (isMatchTypeSelected && isAdGroupSelected) {
          data.push({
            adGroups: [adGroup],
            searchTerm,
            matchType,
            dateRange: actionTypeFilters.dateRange.value,
          });
        }
      });
    });

    const processedData =
      keywordActionsUtils.createAmazonSearchTermArchivePayloadForSelectedRows([
        data,
      ]);

    KeywordActionsAmazonService.archiveSearchTerms(processedData)
      .then((res) => {
        dispatch(
          showSuccessToastMessage({
            title: `Success! Search Terms have been archived.`,
          })
        );
      })
      .finally(() => {
        dispatch(setTrigger(!trigger));
        setIsSearchTermAdding(false);
      });
  };

  if (isSearchTermAdding) {
    return <CircularProgress sx={{ color: '#77469b' }} />;
  } else {
    return (
      <ImgComponent
        key={rowId}
        imageURL={imageUrls.archiveIcon}
        alt="archive"
        onClick={handleArchiveClick}
        customStyles={{
          cursor: 'pointer',
        }}
      />
    );
  }
};

export default AmazonKeywordActionArchive;
