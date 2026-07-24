import styles from '@/app/components/pages/settings-wrapper/configuration-page/source-target-mapping/source-target-mapping.module.scss';
import { defaultSelectedSourceTargetingOption } from '@/constants/configuration/configuration.constants';
import {
  ConfigurationSourceTargetingMetaDataConfigEnum,
  ConfigurationSourceTargetingSearchConfigEnum,
  ConfigurationTargetingTypeEnum,
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

interface TargetAdGroupCellProps {
  row: IGenerateSourceTargetMapping;
  isViewMode?: boolean;
}

export const TargetAdGroupCell = ({
  row,
  isViewMode = false,
}: TargetAdGroupCellProps) => {
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

  const sourceAdGroup = useMemo(
    () => adGroups.find((g) => g.adGroupId === row.sourceAdGroupId),
    [adGroups, row.sourceAdGroupId]
  );

  const initialSelected = useMemo(() => {
    const targetAdGroup = adGroups.find(
      (g) => g.adGroupId === row.targetAdGroupId
    );
    if (!targetAdGroup) {
      return defaultSelectedSourceTargetingOption;
    }

    return {
      label: targetAdGroup.adGroupName,
      value: targetAdGroup.adGroupId,
      data: targetAdGroup,
    };
  }, [adGroups, row.targetAdGroupId]);

  const options: Array<IFilterBasedCustomDropdownItem<IAdGroupResponse>> =
    useMemo(() => {
      if (!sourceAdGroup) return [];

      return adGroups
        .filter((g) => {
          if (g.adType !== sourceAdGroup.adType) return false;

          const sourceType = sourceAdGroup.targetingType;
          const targetType = g.targetingType;

          if (sourceType === ConfigurationTargetingTypeEnum.MANUAL) {
            return targetType === ConfigurationTargetingTypeEnum.MANUAL;
          }

          if (sourceType === ConfigurationTargetingTypeEnum.AUTO) {
            return (
              targetType === ConfigurationTargetingTypeEnum.MANUAL ||
              targetType === ConfigurationTargetingTypeEnum.AUTO ||
              targetType === ConfigurationTargetingTypeEnum.PCT
            );
          }

          if (sourceType === ConfigurationTargetingTypeEnum.PCT) {
            return targetType === ConfigurationTargetingTypeEnum.PCT;
          }

          return false;
        })
        .map((g) => ({ label: g.adGroupName, value: g.adGroupId, data: g }));
    }, [adGroups, sourceAdGroup]);

  const handleChange = (
    item: IFilterBasedCustomDropdownItem<IAdGroupResponse>
  ) => {
    const targetAdGroup = adGroups.find((g) => g.adGroupId === item.value);
    if (!targetAdGroup) {
      setSelected(defaultSelectedSourceTargetingOption);
      return;
    }

    dispatch(
      updateMappingRow({
        mappingId: row.mappingId as string,
        updates: {
          targetAdGroupId: item.value as string,
          targetAdGroupName: item.label,
          targetCampaignId: targetAdGroup.campaignId,
          targetCampaignTargetingType: targetAdGroup.targetingType,
          matchTypes: [],
          matchTypesToNegate: [],
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
