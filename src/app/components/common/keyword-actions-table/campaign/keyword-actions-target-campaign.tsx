import { MarketplaceEnum } from '@/enums/serp.enums';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import { ITargetCampaigns } from 'src/interfaces/keyword-actions.interface';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import {
  selectTargetCampaigns,
  setTargetAdGroups,
  setTargetCampaigns,
} from 'src/redux/slices/keyword-action/amazon/keyword-action.slice';
import {
  selectWalmartTargetCampaigns,
  setWalmartTargetAdGroups,
  setWalmartTargetCampaigns,
} from 'src/redux/slices/keyword-action/walmart/keyword-action.slice';
import MultiSelectDropdown from '../../dropdown/multi-select-dropdown';

interface IKeywordActionTargetCampaign {
  rowId: number;
  targetCampaigns: Array<ITargetCampaigns>;
}
const KeywordActionTargetCampaign = (props: IKeywordActionTargetCampaign) => {
  const { rowId, targetCampaigns } = props;
  const dispatch = useAppDispatch();
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = advertisingAccount;

  const selectedCampaigns = useAppSelector((rootState) => {
    if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
      return selectTargetCampaigns(rootState, Number(rowId.toString()));
    } else {
      return selectWalmartTargetCampaigns(rootState, Number(rowId.toString()));
    }
  });

  const handleCampaignsSelect = (
    selectedOptions: IMultiSelectDropdownItem[]
  ) => {
    const campaignPayload = {
      options: selectedOptions,
      rowId: Number(rowId.toString()),
    };
    if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
      dispatch(setTargetCampaigns(campaignPayload));
    } else {
      dispatch(setWalmartTargetCampaigns(campaignPayload));
    }

    const targetAdGroupsForRow: IMultiSelectDropdownItem[] = [];

    const isNoneSelected = selectedOptions.every(
      (option) => option.selected === false
    );
    if (isNoneSelected) return;

    selectedOptions.forEach((option, index) => {
      if (option.selected) {
        const partialTargetAdGroupsForRow = targetCampaigns[
          index
        ].targetAdGroups.map<IMultiSelectDropdownItem>((adGroup) => {
          return {
            selected: false,
            value: adGroup.targetAdGroupId,
            label: adGroup.targetAdGroupName,
          };
        });
        targetAdGroupsForRow.push(...partialTargetAdGroupsForRow);
      }
    });
    targetAdGroupsForRow[0].selected = true;
    const adGroupPayload = {
      options: targetAdGroupsForRow,
      rowId: Number(rowId.toString()),
    };
    if (marketplace.marketplace === MarketplaceEnum.AMAZON) {
      dispatch(setTargetAdGroups(adGroupPayload));
    } else {
      dispatch(setWalmartTargetAdGroups(adGroupPayload));
    }
  };

  if (!selectedCampaigns) return <div />;

  return (
    <div>
      <MultiSelectDropdown
        key={rowId}
        options={selectedCampaigns}
        label={''}
        onSelect={handleCampaignsSelect}
        width="25rem"
      />
    </div>
  );
};

export default KeywordActionTargetCampaign;
