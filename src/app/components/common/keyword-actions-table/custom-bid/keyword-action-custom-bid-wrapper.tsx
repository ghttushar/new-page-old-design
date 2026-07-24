import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  displayValue,
  formatNum,
  getAmzSPMaxBidLimitByCountry,
  getAmzSPMinBidLimitByCountry,
} from '@/utils';
import { RowSelectionState } from '@tanstack/react-table';
import { useState } from 'react';
import {
  WALMART_MAX_BID,
  WALMART_MIN_BID,
} from 'src/constants/keyword-action.constants';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  selectInitialKeywordBid,
  selectKeywordActionSelectedRowIds,
  selectKeywordBid,
  setBidErrorMessage,
  setIsRowEdited,
  setKeywordActionSelectedRowIds,
  setKeywordBid,
} from 'src/redux/slices/keyword-action/amazon/keyword-action.slice';
import {
  selectWalmartInitialKeywordBid,
  selectWalmartKeywordActionSelectedRowIds,
  selectWalmartKeywordBid,
  setIsWalmartRowEdited,
  setWalmartBidErrorMessage,
  setWalmartKeywordActionSelectedRowIds,
  setWalmartKeywordBid,
} from 'src/redux/slices/keyword-action/walmart/keyword-action.slice';
import CustomBidInput from './custom-bid-input';

interface ICustomBid {
  rowId: number;
  matchTypes: string[];
}

const KeywordActionCustomBid = (props: ICustomBid) => {
  const { rowId, matchTypes } = props;

  const [invalidIdx, setInvalidIdx] = useState<number | null>(null);

  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = advertisingAccount;
  const dispatch = useAppDispatch();

  const keywordBids = useAppSelector((root) => {
    if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
      return selectKeywordBid(root, Number(rowId.toString()));
    } else {
      return selectWalmartKeywordBid(root, Number(rowId.toString()));
    }
  });
  const initialKeywordBids = useAppSelector((root) => {
    if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
      return selectInitialKeywordBid(root, Number(rowId.toString()));
    } else {
      return selectWalmartInitialKeywordBid(root, Number(rowId.toString()));
    }
  });
  const amazonSelectedRowIds = useAppSelector(
    selectKeywordActionSelectedRowIds
  );
  const walmartSelectedRowIds = useAppSelector(
    selectWalmartKeywordActionSelectedRowIds
  );

  const validateBid = (bid: number, idx: number) => {
    if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
      if (bid < getAmzSPMinBidLimitByCountry()) {
        dispatch(
          setBidErrorMessage(
            `Minimum should be ${displayValue(
              formatNum(getAmzSPMinBidLimitByCountry()),
              false
            )} cents.`
          )
        );
        setInvalidIdx(idx);
      } else if (bid > getAmzSPMaxBidLimitByCountry()) {
        dispatch(
          setBidErrorMessage(
            `Bid is unusually high. Verify to avoid overspending.`
          )
        );
        setInvalidIdx(idx);
      } else {
        dispatch(setBidErrorMessage(null));
        setInvalidIdx(null);
      }
    } else {
      if (bid < WALMART_MIN_BID) {
        dispatch(
          setWalmartBidErrorMessage(
            `Minimum should be ${displayValue(
              formatNum(WALMART_MIN_BID),
              false
            )} cents.`
          )
        );
        setInvalidIdx(idx);
      } else if (bid > WALMART_MAX_BID) {
        dispatch(
          setWalmartBidErrorMessage(
            `Bid is unusually high. Verify to avoid overspending.`
          )
        );
        setInvalidIdx(idx);
      } else {
        dispatch(setWalmartBidErrorMessage(null));
        setInvalidIdx(null);
      }
    }
  };

  const onBidChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const bid = parseFloat(e.target.value);
    if (bid < 0) return;
    validateBid(bid, index);

    const payload = keywordBids.map((item, idx) => {
      if (idx === index) {
        return Number(bid.toFixed(2));
      }
      return item;
    });

    // This is to check if the row is edited or not
    // if edited then add the rowId to selectedRowIds
    if (JSON.stringify(payload) !== JSON.stringify(initialKeywordBids)) {
      const id = rowId.toString();
      if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
        const newSelectedRowIds: RowSelectionState = {
          ...amazonSelectedRowIds,
        };
        newSelectedRowIds[id] = true;
        dispatch(setKeywordActionSelectedRowIds(newSelectedRowIds));
        dispatch(setIsRowEdited(true));
      } else {
        const newSelectedRowIds: RowSelectionState = {
          ...walmartSelectedRowIds,
        };
        newSelectedRowIds[id] = true;
        dispatch(setWalmartKeywordActionSelectedRowIds(newSelectedRowIds));
        dispatch(setIsWalmartRowEdited(true));
      }
    } else {
      const id = rowId.toString();
      if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
        const newSelectedRowIds: RowSelectionState = {
          ...amazonSelectedRowIds,
        };
        delete newSelectedRowIds[id];
        dispatch(setKeywordActionSelectedRowIds(newSelectedRowIds));
        dispatch(setIsRowEdited(Object.keys(newSelectedRowIds).length > 0));
      } else {
        const newSelectedRowIds: RowSelectionState = {
          ...walmartSelectedRowIds,
        };
        delete newSelectedRowIds[id.toString()];
        dispatch(setWalmartKeywordActionSelectedRowIds(newSelectedRowIds));
        dispatch(
          setIsWalmartRowEdited(Object.keys(newSelectedRowIds).length > 0)
        );
      }
    }

    if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
      dispatch(
        setKeywordBid({
          rowId: Number(rowId.toString()),
          bids: payload,
        })
      );
    } else {
      dispatch(
        setWalmartKeywordBid({
          rowId: Number(rowId.toString()),
          bids: payload,
        })
      );
    }
  };

  if (!keywordBids) return <div />;

  return keywordBids.map((item, idx) => {
    return (
      <CustomBidInput
        key={idx}
        rowId={Number(rowId)}
        itemId={idx}
        customBid={item}
        onBidChange={onBidChange}
        invalidIdx={invalidIdx}
      />
    );
  });
};

export default KeywordActionCustomBid;
