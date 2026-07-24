import { imageUrls } from '@/constants/assets/images.constants';
import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import { ISelectedSearchTermsToArchive } from 'src/interfaces/keyword-actions.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectWalmartKeywordActionFilters,
  selectWalmartKeywordActionSelectedRowIds,
  selectWalmartMatchTypeToAdd,
  selectWalmartTargetAdGroups,
  selectWalmartTrigger,
  selectWalmartUpdatedAdditionTableData,
  setWalmartTrigger,
} from 'src/redux/slices/keyword-action/walmart/keyword-action.slice';
import {
  showErrorToastMessage,
  showSuccessToastMessage,
} from 'src/redux/slices/notifications/toast-message.slice';
import { KeywordActionsWalmartService } from 'src/services/keyword-actions-walmart.service';
import keywordActionsUtils from 'src/utils/keyword-actions.utils';
import ImgComponent from '../../img-component/img-component';

interface KeywordActionArchiveProps {
  rowId: number;
}
const WalmartKeywordActionArchive = (props: KeywordActionArchiveProps) => {
  const { rowId } = props;

  const [isSearchTermAdding, setIsSearchTermAdding] = useState(false);

  const dispatch = useAppDispatch();
  const selectedRowIds = useAppSelector(
    selectWalmartKeywordActionSelectedRowIds
  );
  const trigger = useAppSelector(selectWalmartTrigger);
  const selectedAdGroups = useAppSelector((root) =>
    selectWalmartTargetAdGroups(root, rowId)
  );
  const selectMatchTypes = useAppSelector((root) =>
    selectWalmartMatchTypeToAdd(root, rowId)
  );
  const updatedAdditionTableData = useAppSelector(
    selectWalmartUpdatedAdditionTableData
  );
  const actionTypeFilters = useAppSelector(selectWalmartKeywordActionFilters);

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
      keywordActionsUtils.createWalmartSearchTermArchivePayloadForSelectedRows([
        data,
      ]);

    KeywordActionsWalmartService.archiveSearchTerms(processedData)
      .then((res) => {
        dispatch(
          showSuccessToastMessage({
            title: `Success! Search Terms have been archived.`,
          })
        );
      })
      .finally(() => {
        dispatch(setWalmartTrigger(!trigger));
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

export default WalmartKeywordActionArchive;
