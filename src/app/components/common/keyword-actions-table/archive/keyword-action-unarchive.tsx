import { imageUrls } from '@/constants/assets/images.constants';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import { IGetArchiveSearchTermData } from 'src/interfaces/keyword-actions.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  selectTrigger,
  setTrigger,
} from 'src/redux/slices/keyword-action/amazon/keyword-action.slice';
import {
  selectWalmartTrigger,
  setWalmartTrigger,
} from 'src/redux/slices/keyword-action/walmart/keyword-action.slice';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { KeywordActionsAmazonService } from 'src/services/keyword-actions-amazon.service';
import { KeywordActionsWalmartService } from 'src/services/keyword-actions-walmart.service';
import ImgComponent from '../../img-component/img-component';

interface KeywordActionUnArchiveProps {
  id: number;
  data: IGetArchiveSearchTermData;
}
const KeywordActionUnArchive = (props: KeywordActionUnArchiveProps) => {
  const { id, data } = props;

  const [isSearchTermAdding, setIsSearchTermAdding] = useState(false);
  const dispatch = useAppDispatch();
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = advertisingAccount.marketplace;
  const amazonTrigger = useAppSelector(selectTrigger);
  const walmartTrigger = useAppSelector(selectWalmartTrigger);

  const handleAmazonUnArchive = () => {
    setIsSearchTermAdding(true);
    const payload = [data];
    KeywordActionsAmazonService.unArchiveSearchTerm(payload)
      .then(() => {
        dispatch(
          showSuccessToastMessage({
            title: `Success! Search Terms have been removed from archive.`,
          })
        );
      })
      .finally(() => {
        dispatch(setTrigger(!amazonTrigger));
        setIsSearchTermAdding(false);
      });
  };

  const handleWalmartUnArchive = () => {
    setIsSearchTermAdding(true);
    const payload = [data];
    KeywordActionsWalmartService.unArchiveSearchTerm(payload)
      .then(() => {
        dispatch(
          showSuccessToastMessage({
            title: `Success! Search Terms have been removed from archive.`,
          })
        );
      })
      .finally(() => {
        dispatch(setWalmartTrigger(!walmartTrigger));
        setIsSearchTermAdding(false);
      });
  };

  if (isSearchTermAdding) {
    return <CircularProgress sx={{ color: '#77469b' }} />;
  } else {
    return (
      <ImgComponent
        key={id}
        imageURL={imageUrls.unArchiveIcon}
        alt="archive"
        onClick={
          marketplace === MarketplaceEnum.AMAZON
            ? handleAmazonUnArchive
            : handleWalmartUnArchive
        }
        customStyles={{
          cursor: 'pointer',
          width: '20px',
        }}
      />
    );
  }
};

export default KeywordActionUnArchive;
