import {
  ConfigurationSourceTargetingFilterValueEnum,
  ConfigurationTargetingTypeEnum,
} from '@/enums/configurations.enum';
import { WalmartAdGroupStatusEnum } from '@/enums/walmart.enums';
import { IAdGroupResponse } from '@/interfaces/configurations.interface';
import { ICustomDropdownFilterOption } from '@/interfaces/dropdown.interfaces';

export const CONFIGURATION_SOURCE_TARGETING_AMAZON_FILTER_OPTIONS: Array<
  ICustomDropdownFilterOption<IAdGroupResponse>
> = [
  {
    label: 'Active',
    key: ConfigurationSourceTargetingFilterValueEnum.ADGROUP_STATUS,
    value: WalmartAdGroupStatusEnum.ENABLED,
  },
  {
    label: 'Auto',
    key: ConfigurationSourceTargetingFilterValueEnum.TARGETING_TYPE,
    value: ConfigurationTargetingTypeEnum.AUTO,
  },
  {
    label: 'Manual',
    key: ConfigurationSourceTargetingFilterValueEnum.TARGETING_TYPE,
    value: ConfigurationTargetingTypeEnum.MANUAL,
  },
  {
    label: 'PCT',
    key: ConfigurationSourceTargetingFilterValueEnum.TARGETING_TYPE,
    value: ConfigurationTargetingTypeEnum.PCT,
  },
];

export const CONFIGURATION_SOURCE_TARGETING_WALMART_FILTER_OPTIONS: Array<
  ICustomDropdownFilterOption<IAdGroupResponse>
> = [
  {
    label: 'Active',
    key: ConfigurationSourceTargetingFilterValueEnum.ADGROUP_STATUS,
    value: WalmartAdGroupStatusEnum.ENABLED,
  },
  {
    label: 'Auto',
    key: ConfigurationSourceTargetingFilterValueEnum.TARGETING_TYPE,
    value: ConfigurationTargetingTypeEnum.AUTO,
  },
  {
    label: 'Manual',
    key: ConfigurationSourceTargetingFilterValueEnum.TARGETING_TYPE,
    value: ConfigurationTargetingTypeEnum.MANUAL,
  },
];

export const defaultSelectedSourceTargetingOption = {
  label: 'Select AdGroup',
  value: '',
  data: null,
};
