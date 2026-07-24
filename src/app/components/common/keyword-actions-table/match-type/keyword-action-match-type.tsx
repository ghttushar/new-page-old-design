import { MarketplaceEnum } from '@/enums/serp.enums';
import { Checkbox, ListItemText, MenuItem } from '@mui/material';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  selectMatchTypeToAdd,
  setMatchTypeToAdd,
} from 'src/redux/slices/keyword-action/amazon/keyword-action.slice';
import {
  selectWalmartMatchTypeToAdd,
  setWalmartMatchTypeToAdd,
} from 'src/redux/slices/keyword-action/walmart/keyword-action.slice';
import {
  checkBoxMenuItemStyles,
  checkboxStyles,
  listItemTextStyles,
} from '../../dropdown/dropdown-styles';

interface IMatchType {
  rowId: number;
}
const KeywordActionMatchType = (props: IMatchType) => {
  const { rowId } = props;

  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = advertisingAccount;
  const dispatch = useAppDispatch();

  const selectedMatchTypeToAdd = useAppSelector((root) => {
    if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
      return selectMatchTypeToAdd(root, Number(rowId.toString()));
    } else {
      return selectWalmartMatchTypeToAdd(root, Number(rowId.toString()));
    }
  });
  const handleAdGroupsSelect = (
    selectedOptions: IMultiSelectDropdownItem,
    index: number
  ) => {
    const payload = [...selectedMatchTypeToAdd].map((option) => {
      if (index === selectedMatchTypeToAdd.indexOf(option)) {
        return { ...selectedOptions, selected: !option.selected };
      }
      return { ...option };
    });

    if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
      dispatch(
        setMatchTypeToAdd({
          rowId: Number(rowId.toString()),
          options: payload,
        })
      );
    } else {
      dispatch(
        setWalmartMatchTypeToAdd({
          rowId: Number(rowId.toString()),
          options: payload,
        })
      );
    }
  };

  if (!selectedMatchTypeToAdd) return <div />;

  return selectedMatchTypeToAdd.map((matchType, index) => (
    <MenuItem
      key={`${matchType.value}-${index}`}
      value={matchType.value}
      sx={checkBoxMenuItemStyles}
      onClick={() => handleAdGroupsSelect(matchType, index)}
      disableRipple
    >
      <Checkbox
        checked={matchType.selected}
        sx={checkboxStyles}
        disableRipple
      />
      <ListItemText
        primary={matchType.label}
        sx={{
          ...listItemTextStyles,
          width: 'auto',
          '& .MuiTypography-body1': {
            fontWeight: '500',
            fontSize: '1.2rem',
          },
        }}
      />
    </MenuItem>
  ));
};

export default KeywordActionMatchType;
