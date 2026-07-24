import { ProductActionsMatchTypeMap } from '@/constants/keyword-action.constants';
import {
  ConfigurationEnum,
  ConfigurationTableTitlesEnum,
} from '@/enums/configurations.enum';
import { ImpactAnalysisTableTitles } from '@/enums/impact-analysis.enums';
import {
  ProfitabilityOrdersMetricsLabelEnums,
  ProfitabilityTableTitlesEnum,
  ProfitabilityTableTypeEnum,
} from '@/enums/profitability.enums';
import { IFilterRange } from '@/interfaces/index.interface';
import { ColumnDef, ColumnDefResolved } from '@tanstack/react-table';

import { DATE_FORMAT_3 } from '@/constants/datetime.constants';
import { RuleEntityTableEnum, RulesPageTitleEnum } from '@/enums/rules.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  FILTER_CONFIG,
  FILTER_CONFIG_MAP,
  IFilterSetting,
  nonPerformanceMetricsOptions,
  performanceOptions,
} from 'src/constants/filter.constants';
import {
  ColumnNameEnum,
  OverallAccountLevelTitles,
  SbAccountLevelTitles,
  SbAdGroupLevelTitles,
  SbCampaignLevelTitles,
  SdAccountLevelTitles,
  SdAdGroupLevelTitles,
  SdCampaignLevelTitles,
  SpAccountLevelTitles,
  SpAdGroupLevelTitles,
  SpCampaignLevelTitles,
  WalmartOverallAccountLevelTitles,
  WalmartSBAccountLevelTitles,
  WalmartSBAdGroupLevelTitles,
  WalmartSBCampaignLevelTitles,
  WalmartSPAccountLevelTitles,
  WalmartSPAdGroupLevelTitles,
  WalmartSPCampaignLevelTitles,
  WalmartSVAccountLevelTitles,
  WalmartSVAdGroupLevelTitles,
  WalmartSVCampaignLevelTitles,
} from 'src/enums/advertising.enums';
import { CatalogTabTitlesEnum } from 'src/enums/catalog.enums';
import {
  FilterDropdownValue,
  FilterOptions,
  FilterValueType,
  Filters,
} from 'src/enums/filter.enums';
import { KeywordActionTabsEnum } from 'src/enums/keyword-action.enums';
import {
  IFilterValue,
  IFinalFilters,
} from 'src/redux/slices/filters/filter.slice';
import {
  checkIsValidObject,
  checkMomentDateValidity,
  convertToDateFormat,
  formatNum,
  formatStringToTitleCase,
  getTableTitle,
  hasProperty,
  parseNum,
  splitStringByDelimiters,
} from '.';
import {
  checkIsEqual,
  checkIsNull,
  checkIsObjectEmpty,
  getMappedAdsEligibility,
  getMappedAmazonFulfillmentType,
  getMappedAmazonItemCondition,
  getMappedBiddingStrategy,
  getMappedCatalogPrimary,
  getMappedPageTypeSearchText,
  getMappedWalmartAdType,
} from './advertising.utils';
import {
  getFormattedDateWithFormat,
  isDateAfter,
  isDateBefore,
  isDateBetween,
  isDateSame,
  isInvalidDateRange,
  isValidISO8601Date,
} from './datetime.utils';
import localStorageUtils from './local-storage/local-storage.utils';
import { profitabilityUtils } from './profitability.utils';

export const rowFilters = {
  getTrashIconStyles: (
    filterKey: Filters,
    disableFilterConfig: Filters[] | undefined
  ) => ({
    color: isDisabledFilter(filterKey, disableFilterConfig)
      ? 'gray'
      : '#464646',
    cursor: isDisabledFilter(filterKey, disableFilterConfig)
      ? 'not-allowed'
      : 'pointer',
  }),

  getFilterConfigByNewTableColumns: <T>(
    initialColumns: ColumnDef<T>[],
    selectedAdvertisingNavTitle?: string,
    dynamicValuesFilterSettings?: IFilterSetting[]
  ) => {
    const uniqueFiltersMap = new Map<string, IFilterSetting>();

    initialColumns.forEach((column) => {
      if ('columns' in column && Array.isArray(column.columns)) {
        const finalFilterSettings = rowFilters.getFilterConfigByNewTableColumns(
          column.columns,
          selectedAdvertisingNavTitle
        );
        finalFilterSettings.forEach((filter) => {
          uniqueFiltersMap.set(filter.filterKey, filter);
        });
      } else {
        const formattedColumn = column as ColumnDefResolved<T>;

        const columnFilterSetting = FILTER_CONFIG.find(
          (configColumn) =>
            formattedColumn.accessorKey === configColumn.filterKey
        );

        if (!columnFilterSetting) return;

        uniqueFiltersMap.set(columnFilterSetting.filterKey, {
          ...columnFilterSetting,
          filterLabel:
            formattedColumn.meta?.filterLabel ||
            columnFilterSetting.filterLabel,
        });
      }
    });

    if (!selectedAdvertisingNavTitle)
      return Array.from(uniqueFiltersMap.values());

    const extraFilters = getNoColumnFiltersByTableTitle(
      selectedAdvertisingNavTitle
    );
    if (isImpactTables(selectedAdvertisingNavTitle)) uniqueFiltersMap.clear();
    if (!extraFilters) return Array.from(uniqueFiltersMap.values());

    extraFilters.forEach((extraFilterKey) => {
      if (uniqueFiltersMap.has(extraFilterKey)) return;

      const extraFilterSetting = FILTER_CONFIG.find(
        (configColumn) => configColumn.filterKey === extraFilterKey
      );
      if (!extraFilterSetting) return;

      uniqueFiltersMap.set(extraFilterKey, extraFilterSetting);
    });

    if (dynamicValuesFilterSettings && dynamicValuesFilterSettings.length > 0) {
      dynamicValuesFilterSettings.forEach((dynamicFilter) => {
        if (uniqueFiltersMap.has(dynamicFilter.filterKey)) return;

        uniqueFiltersMap.set(dynamicFilter.filterKey, dynamicFilter);
      });
    }

    return Array.from(uniqueFiltersMap.values());
  },
  getFilterValue: (
    value: IFilterValue,
    filterKey: Filters,
    dynamicFilterKeys: string[] = []
  ) => {
    if (checkIsNull(value)) return '';

    if (typeof value === 'boolean' && filterKey === Filters.ENABLED)
      return formatStringToTitleCase(
        value ? FilterDropdownValue.ACTIVE : FilterDropdownValue.INACTIVE
      );

    if (Array.isArray(value)) {
      return value
        .map((val) => ProductActionsMatchTypeMap.get(val) ?? val)
        .join(', ');
    }

    if (typeof value === 'string') {
      if (checkMomentDateValidity(value)) {
        return convertToDateFormat(value);
      }

      if (!Number.isNaN(Number(value))) {
        return formatNum(value);
      }

      return rowFilters.getFilterValueForDropdownFilters(
        value,
        filterKey,
        dynamicFilterKeys
      );
    }

    if (typeof value === 'object' && !checkIsObjectEmpty(value)) {
      if (!value.from && !value.to) return '';

      const isDateRange =
        checkMomentDateValidity(`${value.from}`) &&
        checkMomentDateValidity(`${value.to}`);

      return isDateRange
        ? `${convertToDateFormat(value.from)} - ${convertToDateFormat(
            value.to
          )}`
        : `${formatNum(value.from)} - ${formatNum(value.to)}`;
    }

    return value;
  },
  getFilterValueForDropdownFilters: (
    filterValue: IFilterValue,
    filterKey: Filters,
    dynamicFilterKeys: string[]
  ) => {
    const filterValueType = FILTER_CONFIG_MAP[filterKey]?.filterValueType;
    if (
      typeof filterValue === 'string' &&
      (filterValueType === FilterValueType.DROPDOWN ||
        filterValueType === FilterValueType.MULTI_SELECT_DROPDOWN) &&
      !dynamicFilterKeys.includes(filterKey)
    )
      return formatStringToTitleCase(filterValue);
    return filterValue;
  },
};

export const filterDropdownValueByFilters = (
  selectedKey: string,
  filters: IFinalFilters[],
  options: IDropdownItem<FilterDropdownValue>[]
) => {
  if (!options) return [];
  // return options which are not in filters
  const filter = options?.filter((option) => {
    return !filters.some(
      (filter) =>
        filter.filterName === option.value && filter.filterKey === selectedKey
    );
  });
  return filter;
};

export const filterFiltersBySelectedFilters = (
  filters: IFinalFilters[],
  FILTER_CONFIG: IFilterSetting[]
) => {
  return FILTER_CONFIG.filter((config) => {
    return !filters.some((filter) => filter.filterKey === config.filterKey);
  });
};

export const getFilterConfigByMarketplace = <T>(
  columns: Array<ColumnDef<T>>,
  marketplace: string,
  selectedAdvertisingNavTitle: string,
  dynamicValuesFilterSettings: IFilterSetting[] = []
): Array<IFilterSetting> => {
  if (!columns || !marketplace) return [];
  const filterConfigByColumns = rowFilters.getFilterConfigByNewTableColumns(
    columns,
    selectedAdvertisingNavTitle,
    dynamicValuesFilterSettings
  );

  return filterConfigByColumns?.map((filter) => {
    if (
      selectedAdvertisingNavTitle === ProfitabilityTableTypeEnum.ORDERS ||
      selectedAdvertisingNavTitle === ProfitabilityTableTypeEnum.PRODUCTS
    ) {
      return {
        ...filter,
        filterLabel:
          filter.filterKey === Filters.TOTAL_SALES
            ? ColumnNameEnum.GMV_COLUMN
            : filter.filterLabel,
        filterValueType:
          filter.filterValueType === FilterValueType.NUMBER
            ? FilterValueType.NEGATIVE_NUMBER
            : filter.filterValueType,
      };
    }
    if (
      selectedAdvertisingNavTitle ===
        ProfitabilityTableTypeEnum.AMAZON_ORDERS ||
      selectedAdvertisingNavTitle ===
        ProfitabilityTableTypeEnum.AMAZON_PRODUCTS ||
      selectedAdvertisingNavTitle ===
        ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_ORDERS ||
      selectedAdvertisingNavTitle ===
        ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_PRODUCTS
    ) {
      return {
        ...filter,
        filterLabel:
          filter.filterKey === Filters.PRODUCT_AD
            ? ProfitabilityOrdersMetricsLabelEnums.PURCHASE_ORDER_PRODUCT_NAME
            : filter.filterLabel,
        filterValueType:
          filter.filterValueType === FilterValueType.NUMBER
            ? FilterValueType.NEGATIVE_NUMBER
            : filter.filterValueType,
      };
    }
    if (
      (selectedAdvertisingNavTitle ===
        getTableTitle(RuleEntityTableEnum.CAMPAIGN, true) ||
        selectedAdvertisingNavTitle ===
          getTableTitle(RuleEntityTableEnum.CAMPAIGN, false)) &&
      filter.filterKey === Filters.ENTITY_ID
    ) {
      return {
        ...filter,
        filterLabel: 'Campaign ID',
      };
    }
    if (
      (selectedAdvertisingNavTitle ===
        getTableTitle(ConfigurationEnum.HERO_ITEMS, true) ||
        selectedAdvertisingNavTitle ===
          getTableTitle(ConfigurationEnum.HERO_ITEMS, false)) &&
      filter.filterKey === Filters.ENTITY_ID
    ) {
      return {
        ...filter,
        filterLabel:
          marketplace === MarketplaceEnum.AMAZON ? 'ASIN' : 'Item Id',
      };
    }
    if (
      (selectedAdvertisingNavTitle ===
        getTableTitle(RuleEntityTableEnum.AD_GROUP, true) ||
        selectedAdvertisingNavTitle ===
          getTableTitle(RuleEntityTableEnum.AD_GROUP, false)) &&
      filter.filterKey === Filters.ENTITY_ID
    ) {
      return {
        ...filter,
        filterLabel: 'Ad Group ID',
      };
    }
    if (
      (selectedAdvertisingNavTitle ===
        getTableTitle(RuleEntityTableEnum.KEYWORD, true) ||
        selectedAdvertisingNavTitle ===
          getTableTitle(RuleEntityTableEnum.KEYWORD, false)) &&
      filter.filterKey === Filters.ENTITY_ID
    ) {
      return {
        ...filter,
        filterLabel: 'Keyword ID',
      };
    }
    if (
      (selectedAdvertisingNavTitle ===
        getTableTitle(RuleEntityTableEnum.PRODUCT, true) ||
        selectedAdvertisingNavTitle ===
          getTableTitle(RuleEntityTableEnum.PRODUCT, false)) &&
      filter.filterKey === Filters.ENTITY_ID
    ) {
      return {
        ...filter,
        filterLabel:
          marketplace === MarketplaceEnum.AMAZON ? 'ASIN' : 'Item Id',
      };
    }

    if (
      (selectedAdvertisingNavTitle ===
        getTableTitle(RuleEntityTableEnum.CAMPAIGN, true) ||
        selectedAdvertisingNavTitle ===
          getTableTitle(RuleEntityTableEnum.CAMPAIGN, false)) &&
      filter.filterKey === Filters.CAMPAIGN_NAME
    ) {
      return {
        ...filter,
        filterLabel: 'Campaign Name',
        filterKey: Filters.PRODUCT_NAME_1,
      };
    }
    if (
      (selectedAdvertisingNavTitle ===
        getTableTitle(RuleEntityTableEnum.AD_GROUP, true) ||
        selectedAdvertisingNavTitle ===
          getTableTitle(RuleEntityTableEnum.AD_GROUP, false)) &&
      filter.filterKey === Filters.ADGROUP_NAME
    ) {
      return {
        ...filter,
        filterLabel: 'Ad Group Name',
        filterKey: Filters.PRODUCT_NAME_1,
      };
    }
    if (
      (selectedAdvertisingNavTitle ===
        getTableTitle(RuleEntityTableEnum.KEYWORD, true) ||
        selectedAdvertisingNavTitle ===
          getTableTitle(RuleEntityTableEnum.KEYWORD, false)) &&
      filter.filterKey === Filters.KEYWORD
    ) {
      return {
        ...filter,
        filterLabel: 'Keyword Name',
        filterKey: Filters.PRODUCT_NAME_1,
      };
    }
    if (
      (selectedAdvertisingNavTitle ===
        getTableTitle(RuleEntityTableEnum.PRODUCT, true) ||
        selectedAdvertisingNavTitle ===
          getTableTitle(RuleEntityTableEnum.PRODUCT, false)) &&
      filter.filterKey === Filters.PRODUCT_AD
    ) {
      return {
        ...filter,
        filterLabel: 'Product Name',
        filterKey: Filters.PRODUCT_NAME_1,
      };
    }

    if (filter.filterKey === Filters.STATUS) {
      if (marketplace === MarketplaceEnum.WALMART) {
        if (
          selectedAdvertisingNavTitle ===
            WalmartSPAccountLevelTitles.CAMPAIGNS ||
          selectedAdvertisingNavTitle ===
            WalmartSBAccountLevelTitles.CAMPAIGNS ||
          selectedAdvertisingNavTitle ===
            WalmartSVAccountLevelTitles.CAMPAIGNS ||
          selectedAdvertisingNavTitle ===
            WalmartOverallAccountLevelTitles.CAMPAIGNS ||
          selectedAdvertisingNavTitle ===
            getTableTitle(RuleEntityTableEnum.CAMPAIGN, true) ||
          selectedAdvertisingNavTitle ===
            getTableTitle(RuleEntityTableEnum.CAMPAIGN, false)
        ) {
          return {
            ...filter,
            filterDropdownValue: [
              FilterDropdownValue.LIVE,
              FilterDropdownValue.PAUSED,
              FilterDropdownValue.SCHEDULED,
              FilterDropdownValue.ENDED,
              FilterDropdownValue.RESCHEDULED,
              FilterDropdownValue.PROPOSAL,
            ],
          };
        } else if (
          selectedAdvertisingNavTitle ===
            WalmartSPAccountLevelTitles.AD_GROUPS ||
          selectedAdvertisingNavTitle ===
            WalmartSPCampaignLevelTitles.AD_GROUPS ||
          selectedAdvertisingNavTitle ===
            WalmartSBAccountLevelTitles.AD_GROUPS ||
          selectedAdvertisingNavTitle ===
            WalmartSBCampaignLevelTitles.AD_GROUPS ||
          selectedAdvertisingNavTitle ===
            WalmartSVAccountLevelTitles.AD_GROUPS ||
          selectedAdvertisingNavTitle ===
            WalmartSVCampaignLevelTitles.AD_GROUPS ||
          selectedAdvertisingNavTitle ===
            WalmartOverallAccountLevelTitles.AD_GROUPS ||
          selectedAdvertisingNavTitle ===
            getTableTitle(RuleEntityTableEnum.AD_GROUP, true) ||
          selectedAdvertisingNavTitle ===
            getTableTitle(RuleEntityTableEnum.AD_GROUP, false)
        ) {
          return {
            ...filter,
            filterDropdownValue: [
              FilterDropdownValue.ENABLED,
              FilterDropdownValue.DISABLED,
            ],
          };
        } else if (
          selectedAdvertisingNavTitle ===
            WalmartSPAccountLevelTitles.AD_ITEMS ||
          selectedAdvertisingNavTitle ===
            WalmartSPCampaignLevelTitles.AD_ITEMS ||
          selectedAdvertisingNavTitle ===
            WalmartSPAdGroupLevelTitles.AD_ITEMS ||
          selectedAdvertisingNavTitle ===
            WalmartSBAccountLevelTitles.AD_ITEMS ||
          selectedAdvertisingNavTitle ===
            WalmartSBCampaignLevelTitles.AD_ITEMS ||
          selectedAdvertisingNavTitle ===
            WalmartSBAdGroupLevelTitles.AD_ITEMS ||
          selectedAdvertisingNavTitle ===
            WalmartSVAccountLevelTitles.AD_ITEMS ||
          selectedAdvertisingNavTitle ===
            WalmartSVCampaignLevelTitles.AD_ITEMS ||
          selectedAdvertisingNavTitle ===
            WalmartSVAdGroupLevelTitles.AD_ITEMS ||
          selectedAdvertisingNavTitle ===
            WalmartOverallAccountLevelTitles.AD_ITEMS ||
          selectedAdvertisingNavTitle ===
            getTableTitle(RuleEntityTableEnum.PRODUCT, true) ||
          selectedAdvertisingNavTitle ===
            getTableTitle(RuleEntityTableEnum.PRODUCT, false) ||
          selectedAdvertisingNavTitle ===
            getTableTitle(ConfigurationEnum.HERO_ITEMS, true) ||
          selectedAdvertisingNavTitle ===
            getTableTitle(ConfigurationEnum.HERO_ITEMS, false)
        ) {
          return {
            ...filter,
            filterDropdownValue: [
              FilterDropdownValue.ENABLED,
              FilterDropdownValue.DISABLED,
            ],
          };
        } else if (
          selectedAdvertisingNavTitle ===
            WalmartSPAccountLevelTitles.KEYWORD_TARGETING ||
          selectedAdvertisingNavTitle ===
            WalmartSPCampaignLevelTitles.KEYWORD_TARGETING ||
          selectedAdvertisingNavTitle ===
            WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING ||
          selectedAdvertisingNavTitle ===
            WalmartSBAccountLevelTitles.KEYWORD_TARGETING ||
          selectedAdvertisingNavTitle ===
            WalmartSBCampaignLevelTitles.KEYWORD_TARGETING ||
          selectedAdvertisingNavTitle ===
            WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING ||
          selectedAdvertisingNavTitle ===
            WalmartSVAccountLevelTitles.KEYWORD_TARGETING ||
          selectedAdvertisingNavTitle ===
            WalmartSVCampaignLevelTitles.KEYWORD_TARGETING ||
          selectedAdvertisingNavTitle ===
            WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING ||
          selectedAdvertisingNavTitle ===
            WalmartOverallAccountLevelTitles.KEYWORD_TARGETING ||
          selectedAdvertisingNavTitle ===
            getTableTitle(RuleEntityTableEnum.KEYWORD, true) ||
          selectedAdvertisingNavTitle ===
            getTableTitle(RuleEntityTableEnum.KEYWORD, false)
        ) {
          return {
            ...filter,
            filterDropdownValue: [
              FilterDropdownValue.ENABLED,
              FilterDropdownValue.PAUSED,
            ],
          };
        } else {
          return {
            ...filter,
            filterDropdownValue: [
              FilterDropdownValue.LIVE,
              FilterDropdownValue.PAUSED,
              FilterDropdownValue.SCHEDULED,
              FilterDropdownValue.COMPLETED,
              FilterDropdownValue.RESCHEDULED,
              FilterDropdownValue.PROPOSAL,
            ],
          };
        }
      } else {
        return {
          ...filter,
          filterDropdownValue: [
            FilterDropdownValue.ENABLED,
            FilterDropdownValue.PAUSED,
            FilterDropdownValue.ARCHIVED,
          ],
        };
      }
    }

    if (filter.filterKey === Filters.CAMPAIGN_STATUS) {
      if (marketplace === MarketplaceEnum.WALMART) {
        return {
          ...filter,
          filterDropdownValue: [
            FilterDropdownValue.LIVE,
            FilterDropdownValue.PAUSED,
            FilterDropdownValue.SCHEDULED,
            FilterDropdownValue.COMPLETED,
            FilterDropdownValue.RESCHEDULED,
            FilterDropdownValue.PROPOSAL,
          ],
        };
      } else {
        return {
          ...filter,
          filterDropdownValue: [
            FilterDropdownValue.ENABLED,
            FilterDropdownValue.PAUSED,
            FilterDropdownValue.ARCHIVED,
          ],
        };
      }
    }

    if (filter.filterKey === Filters.ADGROUP_STATUS) {
      if (marketplace === MarketplaceEnum.WALMART) {
        return {
          ...filter,
          filterDropdownValue: [
            FilterDropdownValue.ENABLED,
            FilterDropdownValue.DISABLED,
          ],
        };
      } else {
        return {
          ...filter,
          filterDropdownValue: [
            FilterDropdownValue.ENABLED,
            FilterDropdownValue.PAUSED,
            FilterDropdownValue.ARCHIVED,
          ],
        };
      }
    }

    if (filter.filterKey === Filters.MATCH_TYPE) {
      if (
        selectedAdvertisingNavTitle ===
          SpCampaignLevelTitles.NEG_TARGETING_KEYWORD ||
        selectedAdvertisingNavTitle ===
          SpCampaignLevelTitles.NEG_TARGETING_PRODUCT ||
        selectedAdvertisingNavTitle ===
          SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD ||
        selectedAdvertisingNavTitle ===
          SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT ||
        selectedAdvertisingNavTitle ===
          SbCampaignLevelTitles.NEG_TARGETING_KEYWORD ||
        selectedAdvertisingNavTitle ===
          SbCampaignLevelTitles.NEG_TARGETING_PRODUCT ||
        selectedAdvertisingNavTitle ===
          SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD ||
        selectedAdvertisingNavTitle ===
          SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT
      ) {
        return {
          ...filter,
          filterDropdownValue: [
            FilterDropdownValue.NEGATIVE_EXACT,
            FilterDropdownValue.NEGATIVE_PHRASE,
          ],
        };
      } else if (
        selectedAdvertisingNavTitle === OverallAccountLevelTitles.SEARCH_TERM ||
        selectedAdvertisingNavTitle === SpAccountLevelTitles.SEARCH_TERM ||
        selectedAdvertisingNavTitle === SbAccountLevelTitles.SEARCH_TERM
      ) {
        return {
          ...filter,
          filterDropdownValue: [
            FilterDropdownValue.BROAD,
            FilterDropdownValue.EXACT,
            FilterDropdownValue.PHRASE,
            FilterDropdownValue.TARGETING_EXPRESSION,
            FilterDropdownValue.PREDEFINED,
          ],
        };
      }
      // TODO: Will enable this when this is up from backend.
      // else if (
      //   selectedAdvertisingNavTitle ===
      //     SpAccountLevelTitles.KEYWORD_TARGETING ||
      //   selectedAdvertisingNavTitle ===
      //     SpCampaignLevelTitles.KEYWORD_TARGETING ||
      //   selectedAdvertisingNavTitle ===
      //     SpAdGroupLevelTitles.KEYWORD_TARGETING ||
      //   selectedAdvertisingNavTitle ===
      //     OverallAccountLevelTitles.KEYWORD_TARGETING
      // ) {
      //   return {
      //     ...filter,
      //     filterDropdownValue: [
      //       FilterDropdownValue.BROAD,
      //       FilterDropdownValue.EXACT,
      //       FilterDropdownValue.PHRASE,
      //       FilterDropdownValue.TARGETING_EXPRESSION,
      //     ],
      //   };
      // }
      else {
        return {
          ...filter,
          filterDropdownValue: [
            FilterDropdownValue.BROAD,
            FilterDropdownValue.EXACT,
            FilterDropdownValue.PHRASE,
          ],
        };
      }
    }

    if (filter.filterKey === Filters.AD_TYPE) {
      if (marketplace === MarketplaceEnum.WALMART) {
        return {
          ...filter,
          filterDropdownValue: [
            FilterDropdownValue.SP,
            FilterDropdownValue.SB,
            FilterDropdownValue.SV,
          ],
        };
      } else {
        return {
          ...filter,
          filterDropdownValue: [
            FilterDropdownValue.SP,
            FilterDropdownValue.SB,
            FilterDropdownValue.SD,
          ],
        };
      }
    }

    return filter;
  });
};

// update this util function as per requirement for other fields.
export const getMappedValuesForFilters = (
  filters: IFinalFilters[],
  marketplace: string
) => {
  if (!filters || !filters.length) return filters;

  return filters.map((filter) => {
    if (filter.filterKey === Filters.ENABLED) {
      return {
        ...filter,
        filterValue: filter.filterValue === FilterDropdownValue.ACTIVE,
      };
    } else if (filter.filterKey === Filters.PRIMARY) {
      return {
        ...filter,
        filterDropdownValue: getMappedCatalogPrimary(
          filter.filterDropdownValue as string
        ),
        filterValue: getMappedCatalogPrimary(filter.filterValue as string),
      };
    } else if (
      filter.filterKey === Filters.STRATEGY ||
      filter.filterKey === Filters.BIDDING_STRATEGY
    ) {
      return {
        ...filter,
        filterDropdownValue: getMappedBiddingStrategy(
          filter.filterDropdownValue as string
        ),
        filterValue: getMappedBiddingStrategy(filter.filterValue as string),
      };
    } else if (filter.filterKey === Filters.ADS_ELIGIBILITY) {
      return {
        ...filter,
        filterDropdownValue: getMappedAdsEligibility(
          filter.filterDropdownValue as string
        ),
        filterValue: getMappedAdsEligibility(
          filter.filterDropdownValue as string
        ),
      };
    } else if (
      (filter.filterType === FilterOptions.IS_ON ||
        filter.filterType === FilterOptions.IS_AFTER ||
        filter.filterType === FilterOptions.IS_BEFORE) &&
      typeof filter.filterValue === 'string'
    ) {
      return {
        ...filter,
        filterValue: getFormattedDateWithFormat(
          filter.filterValue,
          DATE_FORMAT_3
        ),
      };
    } else if (filter.filterKey === Filters.PAGE_TYPE) {
      return {
        ...filter,
        filterDropdownValue: getMappedPageTypeSearchText(
          filter.filterDropdownValue as string
        ),
        filterValue: getMappedPageTypeSearchText(filter.filterValue as string),
      };
    } else if (
      filter.filterKey === Filters.AD_TYPE &&
      marketplace === MarketplaceEnum.WALMART
    ) {
      return {
        ...filter,
        filterDropdownValue: getMappedWalmartAdType(
          filter.filterDropdownValue as string
        ),
        filterValue: getMappedWalmartAdType(filter.filterValue as string),
      };
    } else if (filter.filterKey === Filters.PURCHASE_STATUS) {
      return {
        ...filter,
        filterDropdownValue: profitabilityUtils.getMappedPurchaseOrder(
          filter.filterDropdownValue as FilterDropdownValue
        ),
        filterValue: profitabilityUtils.getMappedPurchaseOrder(
          filter.filterValue as string
        ),
      };
    } else if (filter.filterKey === Filters.AMAZON_FULFILLMENT) {
      return {
        ...filter,
        filterDropdownValue: getMappedAmazonFulfillmentType(
          filter.filterValue as string
        ),
        filterValue: getMappedAmazonFulfillmentType(
          filter.filterValue as string
        ),
      };
    } else if (filter.filterKey === Filters.CONDITION) {
      return {
        ...filter,
        filterValue: getMappedAmazonItemCondition(filter.filterValue as string),
        filterDropdownValue: getMappedAmazonItemCondition(
          filter.filterDropdownValue as string
        ),
      };
    } else if (
      filter.filterKey === Filters.AUTOMATION_STATUS &&
      filter.filterDropdownValue === FilterDropdownValue.NONE
    ) {
      return {
        ...filter,
        filterValue: null,
        filterDropdownValue: null,
      };
    }

    return filter;
  });
};
export const getInitialFiltersByNavTab = (selectedNavTab: string) => {
  const statusFilter = {
    filterKey: Filters.STATUS,
    filterType: FilterOptions.IS,
    filterValue: FilterDropdownValue.ENABLED,
    filterDropdownValue: FilterDropdownValue.ENABLED,
    filterName: FilterDropdownValue.ENABLED,
  };
  const amazonCampaignFilter = {
    filterKey: Filters.CAMPAIGN_STATUS,
    filterType: FilterOptions.IS,
    filterValue: FilterDropdownValue.ENABLED,
    filterDropdownValue: FilterDropdownValue.ENABLED,
    filterName: FilterDropdownValue.ENABLED,
    filterLabel: `${ColumnNameEnum.CAMPAIGN} Status`,
  };
  const walmartCampaignFilter = {
    filterKey: Filters.CAMPAIGN_STATUS,
    filterType: FilterOptions.IS,
    filterValue: FilterDropdownValue.LIVE,
    filterDropdownValue: FilterDropdownValue.LIVE,
    filterName: FilterDropdownValue.LIVE,
    filterLabel: `${ColumnNameEnum.CAMPAIGN} Status`,
  };
  const adGroupStatusFilter = {
    filterKey: Filters.ADGROUP_STATUS,
    filterType: FilterOptions.IS,
    filterValue: FilterDropdownValue.ENABLED,
    filterDropdownValue: FilterDropdownValue.ENABLED,
    filterName: FilterDropdownValue.ENABLED,
    filterLabel: `${ColumnNameEnum.ADGROUP} Status`,
  };

  switch (selectedNavTab) {
    //default filters for amazon
    case SpAccountLevelTitles.CAMPAIGNS:
    case SdAccountLevelTitles.CAMPAIGN:
    case SbAccountLevelTitles.CAMPAIGNS: //account level campaigns
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.CAMPAIGN} Status` },
      ];

    case OverallAccountLevelTitles.AD_GROUPS: //account level ad groups
    case SpAccountLevelTitles.AD_GROUPS:
    case SdAccountLevelTitles.AD_GROUP:
    case SbAccountLevelTitles.AD_GROUP:
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.ADGROUP} Status` },
        amazonCampaignFilter,
      ];

    case SpCampaignLevelTitles.AD_GROUPS:
    case SbCampaignLevelTitles.AD_GROUP:
    case SdCampaignLevelTitles.AD_GROUP: //campaign level ad groups
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.ADGROUP} Status` },
      ];

    case OverallAccountLevelTitles.PRODUCT_ADS: //overall-account level product ads
    case SpAccountLevelTitles.PRODUCT_ADS:
    case SdAccountLevelTitles.PRODUCT_ADS:
    case SbAccountLevelTitles.PRODUCT_ADS:
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.PRODUCT_AD} Status` },
        adGroupStatusFilter,
        amazonCampaignFilter,
      ];

    case OverallAccountLevelTitles.KEYWORD_TARGETING: //overall-account level keyword targeting
    case SpAccountLevelTitles.KEYWORD_TARGETING:
    case SbAccountLevelTitles.KEYWORD_TARGETING:
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.KEYWORD} Status` },
        adGroupStatusFilter,
        amazonCampaignFilter,
      ];

    case OverallAccountLevelTitles.PRODUCT_TARGETING: //overall-account level product targeting
    case SbAccountLevelTitles.PRODUCT_TARGETING:
    case SpAccountLevelTitles.PRODUCT_TARGETING:
    case SpAccountLevelTitles.AUTO_TARGETING: //account level auto targeting
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.TARGETING} Status` },
        adGroupStatusFilter,
        amazonCampaignFilter,
      ];

    case SpCampaignLevelTitles.PRODUCT_ADS:
    case SbCampaignLevelTitles.PRODUCT_ADS:
    case SdCampaignLevelTitles.PRODUCT_ADS: //campaign level product ads
    case SpAdGroupLevelTitles.PRODUCT_ADS:
    case SbAdGroupLevelTitles.PRODUCT_ADS:
    case SdAdGroupLevelTitles.PRODUCT_ADS: //ad group level product ads
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.PRODUCT_AD} Status` },
      ];

    case SpCampaignLevelTitles.KEYWORD_TARGETING:
    case SbCampaignLevelTitles.KEYWORD_TARGETING: //campaign level keyword targeting
    case SpAdGroupLevelTitles.KEYWORD_TARGETING:
    case SbAdGroupLevelTitles.KEYWORD_TARGETING: //ad group level keyword targeting
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.KEYWORD} Status` },
      ];

    case SpCampaignLevelTitles.PRODUCT_TARGETING:
    case SbCampaignLevelTitles.PRODUCT_TARGETING: //campaign level product targeting
    case SpAdGroupLevelTitles.PRODUCT_TARGETING:
    case SbAdGroupLevelTitles.PRODUCT_TARGETING: //ad group level product targeting
    case SpAdGroupLevelTitles.TARGETING:
    case SdAdGroupLevelTitles.TARGETING:
    case SbAdGroupLevelTitles.TARGETING: //ad group level targeting
    case SpCampaignLevelTitles.AUTO_TARGETING:
    case SbCampaignLevelTitles.TARGETING:
    case SdCampaignLevelTitles.TARGETING: //campaign level targeting
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.TARGETING} Status` },
      ];

    //default filters for walmart
    case WalmartSPAccountLevelTitles.CAMPAIGNS:
    case WalmartSBAccountLevelTitles.CAMPAIGNS:
    case WalmartSVAccountLevelTitles.CAMPAIGNS: //account level campaigns
      return [
        {
          filterKey: Filters.STATUS,
          filterType: FilterOptions.IS,
          filterValue: FilterDropdownValue.LIVE,
          filterDropdownValue: FilterDropdownValue.LIVE,
          filterName: FilterDropdownValue.LIVE,
          filterLabel: `${ColumnNameEnum.CAMPAIGN} Status`,
        },
      ];

    case WalmartOverallAccountLevelTitles.AD_GROUPS:
    case WalmartSBAccountLevelTitles.AD_GROUPS:
    case WalmartSVAccountLevelTitles.AD_GROUPS: //account level ad groups
    case WalmartSPAccountLevelTitles.AD_GROUPS:
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.ADGROUP} Status` },
        walmartCampaignFilter,
      ];

    case WalmartSPCampaignLevelTitles.AD_GROUPS:
    case WalmartSBCampaignLevelTitles.AD_GROUPS:
    case WalmartSVCampaignLevelTitles.AD_GROUPS: //campaign level ad groups
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.ADGROUP} Status` },
      ];

    case WalmartOverallAccountLevelTitles.AD_ITEMS:
    case WalmartSPAccountLevelTitles.AD_ITEMS:
    case WalmartSBAccountLevelTitles.AD_ITEMS:
    case WalmartSVAccountLevelTitles.AD_ITEMS: //account level ad items
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.PRODUCT_AD} Status` },
        walmartCampaignFilter,
        adGroupStatusFilter,
      ];

    case WalmartOverallAccountLevelTitles.KEYWORD_TARGETING: //account level keyword targeting
    case WalmartSPAccountLevelTitles.KEYWORD_TARGETING:
    case WalmartSBAccountLevelTitles.KEYWORD_TARGETING:
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.KEYWORD} Status` },
        walmartCampaignFilter,
        adGroupStatusFilter,
      ];

    case WalmartSPCampaignLevelTitles.AD_ITEMS:
    case WalmartSBCampaignLevelTitles.AD_ITEMS:
    case WalmartSVCampaignLevelTitles.AD_ITEMS: //campaign level ad items
    case WalmartSPAdGroupLevelTitles.AD_ITEMS:
    case WalmartSVAdGroupLevelTitles.AD_ITEMS: //ad group level ad items
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.PRODUCT_AD} Status` },
      ];

    case WalmartSPCampaignLevelTitles.KEYWORD_TARGETING:
    case WalmartSBCampaignLevelTitles.KEYWORD_TARGETING: //campaign level keyword targeting
    case WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING:
    case WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING: //ad group level keyword targeting
      return [
        { ...statusFilter, filterLabel: `${ColumnNameEnum.KEYWORD} Status` },
      ];

    case WalmartOverallAccountLevelTitles.PAGE_TYPE:
    case WalmartOverallAccountLevelTitles.PLATFORM:
    case WalmartSPAccountLevelTitles.PAGE_TYPE:
    case WalmartSBAccountLevelTitles.PAGE_TYPE:
    case WalmartSVAccountLevelTitles.PAGE_TYPE: //account level page type
    case WalmartSBAccountLevelTitles.PLATFORM:
    case WalmartSPAccountLevelTitles.PLATFORM:
    case WalmartSVAccountLevelTitles.PLATFORM: //account level platform
      return [walmartCampaignFilter];

    case KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON:
      return [
        {
          filterKey: Filters.MATCH_TYPE_ADD,
          filterType: FilterOptions.IS,
          filterValue: [
            FilterDropdownValue.NEGATIVE_EXACT,
            FilterDropdownValue.NEGATIVE_PHRASE,
          ],
          filterDropdownValue: [
            FilterDropdownValue.NEGATIVE_EXACT,
            FilterDropdownValue.NEGATIVE_PHRASE,
          ],
          filterName: [
            FilterDropdownValue.NEGATIVE_EXACT,
            FilterDropdownValue.NEGATIVE_PHRASE,
          ],
          filterLabel: 'Match Type To Add',
        },
        {
          filterKey: Filters.AD_SALES,
          filterType: FilterOptions.IS_EQUAL_TO,
          filterValue: 0,
          filterName: 0,
          filterLabel: 'Ad Sales',
        },
        {
          filterKey: Filters.CLICKS,
          filterType: FilterOptions.IS_GREATER_THAN_EQUAL_TO,
          filterValue: 30,
          filterName: 30,
          filterLabel: 'Clicks',
        },
        {
          filterKey: Filters.AD_SPEND,
          filterType: FilterOptions.IS_GREATER_THAN_EQUAL_TO,
          filterValue: 30,
          filterName: 30,
          filterLabel: 'Ad Spend',
        },
      ];

    case KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON:
      return [
        {
          filterKey: Filters.MATCH_TYPE_ADD,
          filterType: FilterOptions.IS,
          filterValue: [FilterDropdownValue.NEGATIVE_ASIN_SAME_AS],
          filterDropdownValue: [FilterDropdownValue.NEGATIVE_ASIN_SAME_AS],
          filterName: [FilterDropdownValue.NEGATIVE_ASIN_SAME_AS],
          filterLabel: 'Match Type To Add',
        },
        {
          filterKey: Filters.AD_SALES,
          filterType: FilterOptions.IS_EQUAL_TO,
          filterValue: 0,
          filterName: 0,
          filterLabel: 'Ad Sales',
        },
        {
          filterKey: Filters.CLICKS,
          filterType: FilterOptions.IS_GREATER_THAN_EQUAL_TO,
          filterValue: 30,
          filterName: 30,
          filterLabel: 'Clicks',
        },
        {
          filterKey: Filters.AD_SPEND,
          filterType: FilterOptions.IS_GREATER_THAN_EQUAL_TO,
          filterValue: 30,
          filterName: 30,
          filterLabel: 'Ad Spend',
        },
      ];

    case KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON:
      return [
        {
          filterKey: Filters.MATCH_TYPE_ADD,
          filterType: FilterOptions.IS,
          filterValue: [
            FilterDropdownValue.ASIN_SAME_AS,
            FilterDropdownValue.ASIN_EXPANDED_FROM,
          ],
          filterDropdownValue: [
            FilterDropdownValue.ASIN_SAME_AS,
            FilterDropdownValue.ASIN_EXPANDED_FROM,
          ],
          filterName: [
            FilterDropdownValue.ASIN_SAME_AS,
            FilterDropdownValue.ASIN_EXPANDED_FROM,
          ],
          filterLabel: 'Match Type To Add',
        },
        {
          filterKey: Filters.ACOS,
          filterType: FilterOptions.IS_LESS_THAN,
          filterValue: 50,
          filterName: 50,
          filterLabel: 'ACOS',
        },
        {
          filterKey: Filters.UNITS_SOLD,
          filterType: FilterOptions.IS_GREATER_THAN_EQUAL_TO,
          filterValue: 2,
          filterName: 2,
          filterLabel: 'Ad Units',
        },
      ];

    case KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON:
    case KeywordActionTabsEnum.KEYWORD_ADDITION_WALMART:
      return [
        {
          filterKey: Filters.MATCH_TYPE_ADD,
          filterType: FilterOptions.IS,
          filterValue: [
            FilterDropdownValue.BROAD,
            FilterDropdownValue.EXACT,
            FilterDropdownValue.PHRASE,
          ],
          filterDropdownValue: [
            FilterDropdownValue.BROAD,
            FilterDropdownValue.EXACT,
            FilterDropdownValue.PHRASE,
          ],
          filterName: [
            FilterDropdownValue.BROAD,
            FilterDropdownValue.EXACT,
            FilterDropdownValue.PHRASE,
          ],
          filterLabel: 'Match Type To Add',
        },
        {
          filterKey: Filters.ACOS,
          filterType: FilterOptions.IS_LESS_THAN,
          filterValue: 50,
          filterName: 50,
          filterLabel: 'ACOS',
        },
        {
          filterKey: Filters.UNITS_SOLD,
          filterType: FilterOptions.IS_GREATER_THAN_EQUAL_TO,
          filterValue: 2,
          filterName: 2,
          filterLabel: 'Ad Units',
        },
      ];

    case CatalogTabTitlesEnum.WALMART_CATALOG:
      return [
        {
          filterKey: Filters.PUBLISH_STATUS,
          filterType: FilterOptions.IS,
          filterValue: FilterDropdownValue.PUBLISHED,
          filterDropdownValue: FilterDropdownValue.PUBLISHED,
          filterName: FilterDropdownValue.PUBLISHED,
          filterLabel: 'Status',
        },
      ];

    case RulesPageTitleEnum.APPLIED_RULES:
      return [
        {
          filterKey: Filters.STATUS,
          filterLabel: 'Status',
          filterType: FilterOptions.IS_NOT,
          filterValue: FilterDropdownValue.ARCHIVED,
          filterDropdownValue: FilterDropdownValue.ARCHIVED,
          filterName: FilterDropdownValue.ARCHIVED,
        },
      ];

    default:
      return [];
  }
};
export const getStoredLsFilters = (selectedNavTitle: string) => {
  const storedFilters =
    localStorageUtils.getLsFiltersByNavTitle(selectedNavTitle);
  if (storedFilters) {
    return storedFilters;
  }
  const defaultFilters = getInitialFiltersByNavTab(selectedNavTitle);
  return defaultFilters;
};

export const syncStoredLsFilters = (
  selectedNavTitle: string,
  selectedFilters: Array<IFinalFilters>
) => {
  localStorageUtils.setLsFiltersByNavTitle(selectedNavTitle, selectedFilters);
};

export const isDisabledFilter = (
  selectedFilter: Filters,
  config?: Filters[]
) => {
  if (!selectedFilter) return false;
  if (!config) return false;

  const filter = config.find((filter) => filter === selectedFilter);
  return filter ? true : false;
};

export const getCategoryWiseFilters = <T>(
  filterOptions: IDropdownItem<T>[]
) => {
  const detailsFilters: Filters[] = [];
  const performanceFilters: Filters[] = [];

  filterOptions.forEach((option) => {
    if (nonPerformanceMetricsOptions.includes(option.value as Filters))
      detailsFilters.push(option.value as Filters);
    if (performanceOptions.includes(option.value as Filters))
      performanceFilters.push(option.value as Filters);
  });

  return { detailsFilters, performanceFilters };
};

export const isNullFilter = (filter: IFinalFilters) => {
  return (
    filter.filterValue === null || filter.filterValue?.toString().trim() === ''
  );
};

export const isInvalidFilterRangeValue = (
  filter: IFinalFilters,
  filterConfig: IFilterSetting[]
) => {
  if (filter.filterType !== FilterOptions.IN_BETWEEN) return false;
  const rangeFilterValue = filter.filterValue as IFilterRange;
  if (
    rangeFilterValue.from === '' ||
    rangeFilterValue.to === '' ||
    rangeFilterValue.from === null ||
    rangeFilterValue.to === null
  )
    return true;

  const filterValueType = filterConfig.filter(
    (f) => f.filterKey === filter.filterKey
  )[0].filterValueType;

  if (filterValueType === FilterValueType.DATE) {
    return isInvalidDateRange(rangeFilterValue.from, rangeFilterValue.to);
  }

  return Number(rangeFilterValue.from) >= Number(rangeFilterValue.to);
};

export const isInvalidArrayFilter = (filter: IFinalFilters) => {
  return (
    Array.isArray(filter.filterValue) &&
    !filter.filterValue.length &&
    Array.isArray(filter.filterDropdownValue) &&
    !filter.filterDropdownValue.length
  );
};

export const getDynamicValuesFilterSettings = <
  T extends Record<string, Array<string>>,
  K extends string
>(
  dynamicFiltersByFilterKey: T,
  filterKeyLabelFormatter: ((key: keyof T) => K) | string,
  filterValueType = FilterValueType.MULTI_SELECT_DROPDOWN
): IFilterSetting[] => {
  if (
    !dynamicFiltersByFilterKey ||
    !Object.keys(dynamicFiltersByFilterKey).length
  )
    return [];

  const keys = Object.keys(dynamicFiltersByFilterKey) as (keyof T)[];

  return keys.map((key) => {
    const filter = {
      filterKey: key as Filters,
      filterLabel:
        typeof filterKeyLabelFormatter === 'function'
          ? filterKeyLabelFormatter(key)
          : filterKeyLabelFormatter,
      filterValueType,
      filterDropdownValue: dynamicFiltersByFilterKey[
        key
      ] as unknown as FilterDropdownValue[],
    };
    FILTER_CONFIG_MAP[key as Filters] = filter;
    return filter;
  });
};

export const getNoColumnFiltersByTableTitle = (selectedTitle: string) => {
  switch (selectedTitle) {
    case CatalogTabTitlesEnum.WALMART_CATALOG:
      return [Filters.FULFILLMENT_TYPE];

    case SpAccountLevelTitles.PRODUCT_ADS:
    case SbAccountLevelTitles.PRODUCT_ADS:
    case SdAccountLevelTitles.PRODUCT_ADS:
    case OverallAccountLevelTitles.PRODUCT_ADS:
    case SpCampaignLevelTitles.PRODUCT_ADS:
    case SbCampaignLevelTitles.PRODUCT_ADS:
    case SdCampaignLevelTitles.PRODUCT_ADS:
    case SpAdGroupLevelTitles.PRODUCT_ADS:
    case SbAdGroupLevelTitles.PRODUCT_ADS:
    case SdAdGroupLevelTitles.PRODUCT_ADS:
      return [Filters.ADS_ELIGIBILITY, Filters.PRODUCT_AD_ASIN];

    case CatalogTabTitlesEnum.AMAZON_CATALOG:
      return [
        Filters.SELLER_SKU,
        Filters.PRODUCT_AD_ASIN,
        Filters.AMAZON_FULFILLMENT,
        Filters.UPC_CODE,
      ];

    case ProfitabilityTableTypeEnum.ORDERS:
    case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_ORDERS:
      return [
        Filters.PURCHASE_STATUS,
        Filters.ORDER_DATE_LABEL,
        Filters.PURCHASE_ORDER_ITEM_ID,
        Filters.PURCHASE_ORDER_ID,
        Filters.PURCHASE_ORDER_SKU,
      ];

    case ProfitabilityTableTypeEnum.PRODUCTS:
    case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_PRODUCTS:
      return [Filters.PURCHASE_ORDER_SKU, Filters.PRODUCT_PRICE];

    case ProfitabilityTableTypeEnum.AMAZON_PRODUCTS:
    case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_PRODUCTS:
      return [
        Filters.PRODUCT_CHILD_PARENT_ASIN,
        Filters.PRODUCT_CHILD_PARENT_SKU,
      ];
    case ProfitabilityTableTypeEnum.AMAZON_ORDERS:
    case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_ORDERS:
      return [
        Filters.ORDER_CHILD_ASIN,
        Filters.ORDER_STATUS,
        Filters.ORDER_CHILD_SKU,
      ];

    case ImpactAnalysisTableTitles.CAMPAIGN:
      return [Filters.CAMPAIGN_NAME];
    case ImpactAnalysisTableTitles.AD_GROUP:
      return [Filters.ADGROUP_NAME, Filters.CAMPAIGN_NAME];
    case ImpactAnalysisTableTitles.PRODUCT_ADS:
      return [
        Filters.PRODUCT_NAME,
        Filters.CAMPAIGN_NAME,
        Filters.ADGROUP_NAME,
        Filters.ANALYSIS_PRODUCT_ID,
      ];
    case ImpactAnalysisTableTitles.KEYWORDS:
      return [
        Filters.ANALYSIS_KEYWORD_NAME,
        Filters.CAMPAIGN_NAME,
        Filters.ADGROUP_NAME,
      ];
    case ImpactAnalysisTableTitles.SEARCH_TERM:
      return [
        Filters.SEARCH_TERM,
        Filters.CAMPAIGN_NAME,
        Filters.ADGROUP_NAME,
        Filters.ANALYSIS_KEYWORD_NAME,
      ];
    case getTableTitle(RuleEntityTableEnum.AD_GROUP, true):
    case getTableTitle(RuleEntityTableEnum.AD_GROUP, false):
      return [
        Filters.ADGROUP_NAME,
        Filters.ENTITY_ID,
        Filters.STATUS,
        Filters.AD_TYPE,
      ];
    case getTableTitle(RuleEntityTableEnum.KEYWORD, true):
    case getTableTitle(RuleEntityTableEnum.KEYWORD, false):
      return [
        Filters.KEYWORD,
        Filters.ENTITY_ID,
        Filters.STATUS,
        Filters.AD_TYPE,
      ];
    case getTableTitle(RuleEntityTableEnum.PRODUCT, true):
    case getTableTitle(RuleEntityTableEnum.PRODUCT, false):
      return [
        Filters.PRODUCT_AD,
        Filters.ENTITY_ID,
        Filters.STATUS,
        Filters.AD_TYPE,
      ];
    case getTableTitle(RuleEntityTableEnum.CAMPAIGN, true):
    case getTableTitle(RuleEntityTableEnum.CAMPAIGN, false):
      return [
        Filters.CAMPAIGN_NAME,
        Filters.ENTITY_ID,
        Filters.STATUS,
        Filters.TARGETING_TYPE,
        Filters.AD_TYPE,
      ];
    case ConfigurationTableTitlesEnum.SOURCE_TARGET_MAPPING:
      return [
        Filters.SOURCE_ADGROUP,
        Filters.TARGET_ADGROUP,
        Filters.MATCH_TYPES,
      ];
    case ConfigurationTableTitlesEnum.HERO_ITEMS:
    case getTableTitle(ConfigurationEnum.HERO_ITEMS, true):
    case getTableTitle(ConfigurationEnum.HERO_ITEMS, false):
      return [
        Filters.STATUS,
        Filters.PRODUCT_NAME_1,
        Filters.ENTITY_ID,
        Filters.AD_TYPE,
      ];

    default:
      return [];
  }
};

export const getFormattedFilter = (filter: IFinalFilters): IFinalFilters => {
  return {
    filterLabel: filter.filterLabel.trim(),
    filterKey: filter.filterKey.trim() as Filters,
    filterType: filter.filterType.trim() as FilterOptions,
    filterValue:
      typeof filter.filterValue === 'boolean' ||
      isNaN(Number(filter.filterValue))
        ? filter.filterValue
        : parseNum(filter.filterValue),
    filterDropdownValue: `${filter.filterDropdownValue}`.trim(),
    filterName: `${filter.filterName}`.trim(),
  };
};

export const isImpactTables = (title: string) => {
  return Object.values(ImpactAnalysisTableTitles).includes(
    title as ImpactAnalysisTableTitles
  );
};

export const getFilteredTableData = <T>(
  data: T[],
  filters: IFinalFilters[],
  searchText: string,
  searchKeys: Array<keyof T>
): T[] => {
  if (checkIsNull(data)) return [];
  if (
    checkIsNull(filters) &&
    (!searchText || checkIsNull(searchText) || searchText.trim() === '')
  )
    return data;

  let filteredData = [...data];

  if (searchText && !checkIsNull(searchText) && searchText.trim() !== '') {
    const queryList = splitStringByDelimiters(searchText.toLowerCase()).filter(
      Boolean
    );

    if (queryList.length) {
      filteredData = filteredData.filter((item) => {
        if (!item) return false;

        return queryList.some((query) =>
          searchKeys.some((key) => {
            const value = item?.[key];

            return String(value ?? '')
              .toLowerCase()
              .includes(query);
          })
        );
      });
    }
  }

  if (!checkIsNull(filters)) {
    filteredData = filteredData.filter((item) => {
      return filters.every((filter) => {
        if (
          checkIsValidObject(item) &&
          hasProperty(item, filter.filterKey) === false
        )
          return false;
        const itemValue =
          checkIsValidObject(item) && hasProperty(item, filter.filterKey)
            ? (item[filter.filterKey] as IFilterValue)
            : 0;
        const { filterType, filterValue } = filter;

        if (checkIsNull(itemValue)) return false;

        if (typeof itemValue === 'string') {
          switch (filterType) {
            case FilterOptions.IS:
              return checkIsEqual(
                itemValue.toLowerCase(),
                String(filterValue).toLowerCase()
              );

            case FilterOptions.IS_NOT:
              return !checkIsEqual(
                itemValue.toLowerCase(),
                String(filterValue).toLowerCase()
              );

            case FilterOptions.CONTAINS:
              return itemValue
                .toLowerCase()
                .includes(String(filterValue).toLowerCase());

            case FilterOptions.DOES_NOT_CONTAIN:
              return !itemValue
                .toLowerCase()
                .includes(String(filterValue).toLowerCase());

            case FilterOptions.STARTS_WITH:
              return itemValue
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase());

            case FilterOptions.ENDS_WITH:
              return itemValue
                .toLowerCase()
                .endsWith(String(filterValue).toLowerCase());

            case FilterOptions.IS_ON:
              return isDateSame(itemValue, filterValue as string);

            case FilterOptions.IS_AFTER:
              return isDateAfter(itemValue, filterValue as string);

            case FilterOptions.IS_BEFORE:
              return isDateBefore(itemValue, filterValue as string);

            case FilterOptions.IN_BETWEEN: {
              const range = filterValue as IFilterRange;
              const _from = range.from;
              const _to = range.to;

              if (isValidISO8601Date(itemValue)) {
                return isDateBetween(itemValue, _from, _to);
              }
              return false;
            }

            case FilterOptions.IN:
              if (Array.isArray(filterValue)) {
                return (filterValue as unknown[]).some((val) =>
                  checkIsEqual(String(val), itemValue)
                );
              }
              return false;

            case FilterOptions.NOT_IN:
              if (Array.isArray(filterValue)) {
                return !(filterValue as unknown[]).some((val) =>
                  checkIsEqual(String(val), itemValue)
                );
              }
              return true;

            default:
              return false;
          }
        } else if (typeof itemValue === 'number') {
          switch (filterType) {
            case FilterOptions.IS_EQUAL_TO:
              return checkIsEqual(itemValue, Number(filterValue));

            case FilterOptions.IS_GREATER_THAN:
              return itemValue > Number(filterValue);

            case FilterOptions.IS_LESS_THAN:
              return itemValue < Number(filterValue);

            case FilterOptions.IS_GREATER_THAN_EQUAL_TO:
              return itemValue >= Number(filterValue);

            case FilterOptions.IS_LESS_THAN_EQUAL_TO:
              return itemValue <= Number(filterValue);

            case FilterOptions.IN_BETWEEN: {
              const range = filterValue as IFilterRange;
              const _from = Number(range.from);
              const _to = Number(range.to);
              return itemValue >= _from && itemValue <= _to;
            }

            case FilterOptions.IN:
              if (Array.isArray(filterValue)) {
                return (filterValue as unknown[]).some((val) =>
                  checkIsEqual(Number(val), itemValue)
                );
              }
              return false;

            case FilterOptions.NOT_IN:
              if (Array.isArray(filterValue)) {
                return !(filterValue as unknown[]).some((val) =>
                  checkIsEqual(Number(val), itemValue)
                );
              }
              return true;

            default:
              return false;
          }
        } else if (itemValue instanceof Date) {
          switch (filterType) {
            case FilterOptions.IS_ON:
              return isDateSame(itemValue, filterValue as string);

            case FilterOptions.IS_AFTER:
              return isDateAfter(itemValue, filterValue as string);

            case FilterOptions.IS_BEFORE:
              return isDateBefore(itemValue, filterValue as string);

            case FilterOptions.IN_BETWEEN: {
              const range = filterValue as IFilterRange;
              const _from = range.from;
              const _to = range.to;
              return isDateBetween(itemValue, _from, _to);
            }

            default:
              return false;
          }
        } else if (
          Array.isArray(itemValue) &&
          (typeof filterValue === 'string' || Array.isArray(filterValue))
        ) {
          const filterArr = Array.isArray(filterValue)
            ? filterValue
            : filterValue.split(',');
          switch (filterType) {
            case FilterOptions.IN:
              if (Array.isArray(filterArr)) {
                return filterArr.some((val) =>
                  itemValue.some((item) =>
                    checkIsEqual(String(item), String(val))
                  )
                );
              }
              return false;

            case FilterOptions.NOT_IN:
              if (Array.isArray(filterArr)) {
                return !filterArr.some((val) =>
                  itemValue.some((item) =>
                    checkIsEqual(String(item), String(val))
                  )
                );
              }
              return true;

            default:
              return false;
          }
        } else if (typeof itemValue === 'boolean')
          return itemValue === filter.filterValue;
        else return false;
      });
    });
  }

  return filteredData;
};
