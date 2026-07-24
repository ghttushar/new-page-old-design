import { ICampaign } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { useEffect, useState } from 'react';
import BiddingStrategyView from 'src/app/components/common/bidding-strategy-view/bidding-strategy-view';
import Dropdown, {
  IDropdownItem,
} from 'src/app/components/common/dropdown/dropdown';
import { biddingStrategyOptions } from 'src/constants/advertising-filter.constants';
import { BiddingStrategy } from 'src/enums/advertising.enums';
import { EditAccessValues } from 'src/enums/edit-access.enums';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  selectEditAccessFilters,
  selectEditState,
  selectInitialState,
  selectSelectedRows,
  setEditState,
  setSelectedRows,
} from 'src/redux/slices/advertising/advertising-edit-access.slice';
import {
  checkIsCampaignActiveForEdit,
  getSPBiddingStrategy,
} from 'src/utils/advertising.utils';

interface IEditAccessBiddingStrategyProps {
  id: string | number;
  strategy: string;
  endDate: string;
}

export default function EditAccessBiddingStrategy({
  id,
  strategy,
  endDate,
}: IEditAccessBiddingStrategyProps) {
  const [selectedBidding, setSelectedBidding] = useState<
    IDropdownItem<BiddingStrategy>
  >(getSPBiddingStrategy(strategy) as IDropdownItem<BiddingStrategy>);

  const editAccessFilters = useAppSelector(selectEditAccessFilters);
  const initialState = useAppSelector(selectInitialState) as ICampaign[];
  const editState = useAppSelector(selectEditState) as ICampaign[];
  const selectedRows = useAppSelector(selectSelectedRows);
  const dispatch = useAppDispatch();

  const initialRowData = initialState.filter((row) => row.id === id)[0];

  const handleBiddingOptionChange = (value: IDropdownItem<BiddingStrategy>) => {
    setSelectedBidding(value);

    const updatedTable = editState.map((row) => {
      if (row.campaignId === id) {
        return {
          ...row,
          dynamicBidding: {
            ...row.dynamicBidding,
            strategy: value.value,
          },
        };
      }

      return row;
    });

    dispatch(setSelectedRows({ ...selectedRows, [id]: true }));
    dispatch(setEditState(updatedTable));
  };

  useEffect(() => {
    setSelectedBidding(
      getSPBiddingStrategy(strategy) as IDropdownItem<BiddingStrategy>
    );
  }, [strategy, editAccessFilters.editAccess.value]);

  return editAccessFilters.editAccess.value === EditAccessValues.View ||
    checkIsCampaignActiveForEdit(endDate) === false ? (
    <BiddingStrategyView strategy={strategy} />
  ) : (
    <Dropdown
      options={biddingStrategyOptions}
      selected={selectedBidding}
      label=""
      onSelect={handleBiddingOptionChange}
      width="100%"
      fontColor="#77469B"
      background={
        initialRowData.dynamicBidding.strategy !== selectedBidding.value
          ? '#FAEDFF'
          : '#fff'
      }
    />
  );
}
