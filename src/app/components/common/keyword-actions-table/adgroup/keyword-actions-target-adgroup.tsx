import { MarketplaceEnum } from '@/enums/serp.enums';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  selectTargetAdGroups,
  setTargetAdGroups,
} from 'src/redux/slices/keyword-action/amazon/keyword-action.slice';
import {
  selectWalmartTargetAdGroups,
  setWalmartTargetAdGroups,
} from 'src/redux/slices/keyword-action/walmart/keyword-action.slice';
import MultiSelectDropdown from '../../dropdown/multi-select-dropdown';

interface IKeywordActionTargetAdGroup {
  rowId: number;
}
const KeywordActionTargetAdGroup = (props: IKeywordActionTargetAdGroup) => {
  const { rowId } = props;
  const dispatch = useAppDispatch();
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = advertisingAccount;

  const selectedAdGroups = useAppSelector((root) => {
    if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
      return selectTargetAdGroups(root, Number(rowId.toString()));
    } else {
      return selectWalmartTargetAdGroups(root, Number(rowId.toString()));
    }
  });
  const handleAdGroupsSelect = (
    selectedOptions: IMultiSelectDropdownItem[]
  ) => {
    if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
      dispatch(
        setTargetAdGroups({
          rowId: Number(rowId.toString()),
          options: selectedOptions,
        })
      );
    } else {
      dispatch(
        setWalmartTargetAdGroups({
          rowId: Number(rowId.toString()),
          options: selectedOptions,
        })
      );
    }
  };

  if (!selectedAdGroups) return <div />;

  return (
    <div>
      <MultiSelectDropdown
        key={rowId}
        options={selectedAdGroups}
        label={''}
        onSelect={handleAdGroupsSelect}
        width="25rem"
      />
    </div>
  );
};

export default KeywordActionTargetAdGroup;
