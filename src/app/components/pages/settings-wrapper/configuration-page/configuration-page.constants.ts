import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';

export enum ConfigurationPageRouteEnum {
  METRICS = 'metrics',
  HERO_ITEM = 'hero-item',
  COGS = 'cogs',
  SOURCE_TARGET_MAPPING = 'source-and-target-mapping',
}

export const DEFAULT_CONFIGURATION_ROUTE = ConfigurationPageRouteEnum.METRICS;

export const CONFIGURATION_STEP_OPTIONS: IDropdownItem<ConfigurationPageRouteEnum>[] =
  [
    {
      label: 'Metrics',
      value: ConfigurationPageRouteEnum.METRICS,
      isDisabled: false,
    },
    {
      label: 'Hero Item',
      value: ConfigurationPageRouteEnum.HERO_ITEM,
      isDisabled: false,
    },
    // TODO: enable this option when page is ready
    // {
    //   label: 'COGs',
    //   value: ConfigurationPageRouteEnum.COGS,
    // },
    {
      label: 'Source & Target Mapping',
      value: ConfigurationPageRouteEnum.SOURCE_TARGET_MAPPING,
      isDisabled: false,
    },
  ];
