import styles from '@/app/components/pages/settings-wrapper/configuration-page/source-target-mapping/source-target-mapping.module.scss';
import { defaultSelectedSourceTargetingOption } from '@/constants/configuration/configuration.constants';
import {
  ConfigurationSourceTargetingMetaDataConfigEnum,
  ConfigurationSourceTargetingSearchConfigEnum,
} from '@/enums/configurations.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IAdGroupResponse,
  IGenerateSourceTargetMapping,
} from '@/interfaces/configurations.interface';
import { IFilterBasedCustomDropdownItem } from '@/interfaces/dropdown.interfaces';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectIsChatbotOpen } from '@/redux/slices/auth/auth.slice';
import {
  selectAdGroups,
  updateMappingRow,
} from '@/redux/slices/configurations/configurations.slice';
import localStorageUtils from '@/utils/local-storage/local-storage.utils';
import { configurationUtils } from '@/utils/settings/configuration.utils';
import { useEffect, useMemo, useState } from 'react';
import SingleSelectCustomOptionsDropdown from '../../common/dropdown/single-select-custom-filter-dropdown/single-select-custom-filter-dropdown';

interface SourceAdGroupCellProps {
  row: IGenerateSourceTargetMapping;
  isViewMode?: boolean;
}

export const SourceAdGroupCell = ({
  row,
  isViewMode = false,
}: SourceAdGroupCellProps) => {
  const dispatch = useAppDispatch();
  const adGroups = useAppSelector(selectAdGroups);
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);
  const selectedAdvertisingAccount =
    localStorageUtils.getSelectedAdvertisingAccount();

  const [selected, setSelected] = useState<
    IFilterBasedCustomDropdownItem<IAdGroupResponse>
  >(defaultSelectedSourceTargetingOption);

  const marketplace = useMemo(
    () => selectedAdvertisingAccount?.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount?.marketplace]
  );

  const checkboxFilterConfig = useMemo(
    () => configurationUtils.getCheckboxFilterConfig(marketplace),
    [marketplace]
  );

  const initialSelected = useMemo(() => {
    const sourceAdGroup = adGroups.find(
      (g) => g.adGroupId === row.sourceAdGroupId
    );
    if (!sourceAdGroup) {
      return defaultSelectedSourceTargetingOption;
    }

    return {
      label: sourceAdGroup.adGroupName,
      value: sourceAdGroup.adGroupId,
      data: sourceAdGroup,
    };
  }, [adGroups, row.sourceAdGroupId]);

  const options: Array<IFilterBasedCustomDropdownItem<IAdGroupResponse>> =
    useMemo(
      () =>
        adGroups.map((g) => ({
          label: g.adGroupName,
          value: g.adGroupId,
          data: g,
        })),
      [adGroups]
    );

  const handleChange = (
    item: IFilterBasedCustomDropdownItem<IAdGroupResponse>
  ) => {
    const sourceAdGroup = adGroups.find((g) => g.adGroupId === item.value);
    if (!sourceAdGroup) {
      setSelected(defaultSelectedSourceTargetingOption);
      return;
    }

    dispatch(
      updateMappingRow({
        mappingId: row.mappingId as string,
        updates: {
          sourceAdGroupId: item.value as string,
          sourceAdGroupName: item.label,
          sourceCampaignId: sourceAdGroup.campaignId,
          adType: sourceAdGroup.adType,
          sourceCampaignTargetingType: sourceAdGroup.targetingType,
          targetAdGroupId: '',
          targetAdGroupName: '',
          targetCampaignId: '',
          targetCampaignTargetingType: undefined,
          matchTypes: [],
          matchTypesToNegate: [],
          mappingId: row.mappingId as string,
        },
      })
    );

    setSelected(item);
  };

  useEffect(() => {
    setSelected(initialSelected);
  }, [initialSelected]);

  return (
    <div className={styles.selectContainer}>
      <SingleSelectCustomOptionsDropdown
        selected={selected}
        options={options}
        onSelect={handleChange}
        searchConfig={{
          keys: [
            ConfigurationSourceTargetingSearchConfigEnum.ADGROUP_ID,
            ConfigurationSourceTargetingSearchConfigEnum.ADGROUP_NAME,
          ],
        }}
        checkboxFilterConfig={checkboxFilterConfig}
        optionMetaDataConfig={{
          keys: [
            ConfigurationSourceTargetingMetaDataConfigEnum.AD_TYPE,
            ConfigurationSourceTargetingMetaDataConfigEnum.TARGETING_TYPE,
          ],
        }}
        activeOptionStatusKey={
          ConfigurationSourceTargetingMetaDataConfigEnum.ADGROUP_STATUS
        }
        isDisabled={isViewMode}
        width={isChatbotOpen ? '20rem' : '30rem'}
        height="2.3rem"
      />
    </div>
  );
};
