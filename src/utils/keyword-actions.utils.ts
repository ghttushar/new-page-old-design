import { MarketplaceEnum } from '@/enums/serp.enums';
import { ColumnPinningState } from '@tanstack/react-table';
import { IDropdownItem } from 'src/app/components/common/dropdown/dropdown';
import {
  ADGROUP_COUNT_COLUMN,
  ASIN_PRICE_COLUMN,
  ASIN_TITLE_COLUMN,
  BRAND_NAME_COLUMN,
  keywordActionAdditionColumns,
  keywordActionNegationColumns,
  productActionAdditionColumns,
  productNegationColumns,
  RATINGS_COLUMN,
  REVIEWS_COLUMN,
  TAG_COLUMN,
  walmartKeywordActionAdditionColumns,
} from 'src/app/components/common/keyword-actions-table/new-keyword-actions-column';
import {
  FILTER_DISABLE_CONFIG,
  IFilterSetting,
} from 'src/constants/filter.constants';
import {
  KeywordActionTaggingOptions,
  ProductActionsMatchTypeMap,
  ProductActionTaggingOptions,
  WALMART_MAX_BID,
  WALMART_MIN_BID,
} from 'src/constants/keyword-action.constants';
import { FilterDropdownValue, Filters } from 'src/enums/filter.enums';
import {
  KeywordActionActionType,
  KeywordActionKeywordTagEnum,
  KeywordActionPriority,
  KeywordActionTabsEnum,
  KeywordColumnEnum,
  KeywordState,
  WalmartKeywordState,
} from 'src/enums/keyword-action.enums';
import { IMultiSelectDropdownItem } from 'src/interfaces/dropdown.interfaces';
import {
  IArchiveSearchTermsPayload,
  IKeywordActionData,
  IKeywordAdditionBody,
  IKeywordNegationBody,
  IProductAdditionBody,
  IProductNegationBody,
  ISelectedMatchTypeForKeywordAddition,
  ISelectedMatchTypeForKeywordNegation,
  ISelectedMatchTypeForProductAddition,
  ISelectedSearchTermsToArchive,
  IWalmartKeywordAdditionBody,
} from 'src/interfaces/keyword-actions.interface';
import {
  formatNum,
  getAmzSPMaxBidLimitByCountry,
  getAmzSPMinBidLimitByCountry,
  parseNum,
} from 'src/utils';
import { rowFilters } from './row-filter.utils';

const keywordActionsUtils = {
  getFilterConfig: () => {
    return rowFilters.getFilterConfigByNewTableColumns([
      ...keywordActionAdditionColumns,
      TAG_COLUMN,
      ADGROUP_COUNT_COLUMN,
    ]);
  },

  getNegationFilterConfig: () => {
    const additionFilterConfig = keywordActionsUtils.getFilterConfig();
    const filterConfigClone: IFilterSetting[] = JSON.parse(
      JSON.stringify(additionFilterConfig)
    );
    return filterConfigClone
      .map((item) => {
        if (item.filterKey === Filters.MATCH_TYPE_ADD) {
          item.filterDropdownValue = [
            FilterDropdownValue.NEGATIVE_EXACT,
            FilterDropdownValue.NEGATIVE_PHRASE,
          ];
        }
        return item;
      })
      .filter((column) => column.filterKey !== Filters.BID);
  },

  getProductNegationFilterConfig: () => {
    const additionFilterConfig = rowFilters.getFilterConfigByNewTableColumns([
      ...keywordActionAdditionColumns,
      TAG_COLUMN,
      ADGROUP_COUNT_COLUMN,
      ASIN_TITLE_COLUMN,
      BRAND_NAME_COLUMN,
      ASIN_PRICE_COLUMN,
      RATINGS_COLUMN,
      REVIEWS_COLUMN,
    ]);

    const filterConfigClone: IFilterSetting[] = JSON.parse(
      JSON.stringify(additionFilterConfig)
    );

    return filterConfigClone
      .map((item) => {
        if (item.filterKey === Filters.MATCH_TYPE_ADD) {
          item.filterDropdownValue = [
            FilterDropdownValue.NEGATIVE_ASIN_SAME_AS,
          ];
        }
        return item;
      })
      .filter((column) => column.filterKey !== Filters.BID);
  },

  getProductActionFilterConfig: () => {
    const additionFilterConfig = rowFilters.getFilterConfigByNewTableColumns([
      ...keywordActionAdditionColumns,
      TAG_COLUMN,
      ADGROUP_COUNT_COLUMN,
      ASIN_TITLE_COLUMN,
      BRAND_NAME_COLUMN,
      ASIN_PRICE_COLUMN,
      RATINGS_COLUMN,
      REVIEWS_COLUMN,
    ]);

    const filterConfigClone: IFilterSetting[] = JSON.parse(
      JSON.stringify(additionFilterConfig)
    );

    return filterConfigClone.map((item) => {
      if (item.filterKey === Filters.MATCH_TYPE_ADD) {
        item.filterDropdownValue = [
          FilterDropdownValue.ASIN_SAME_AS,
          FilterDropdownValue.ASIN_EXPANDED_FROM,
        ];
      }
      return item;
    });
  },

  searchBySearchText: (searchText: string, data: IKeywordActionData[]) => {
    return data.filter(
      (row) =>
        row.searchTerm?.toLowerCase().includes(searchText.toLowerCase()) ||
        row.sourceAdGroupName
          ?.toLowerCase()
          .includes(searchText.toLowerCase()) ||
        row.sourceCampaignName?.toLowerCase().includes(searchText.toLowerCase())
    );
  },

  calculateWaterfallBidForMatchTypeByMarketplace: (
    customBid: number | string,
    matchType: FilterDropdownValue,
    marketplace: MarketplaceEnum
  ) => {
    if (marketplace === MarketplaceEnum.AMAZON) {
      const waterFallBid = Number(
        keywordActionsUtils.calculateWaterfallBidForMatchTypeAmazon(
          customBid,
          matchType
        )
      );
      if (waterFallBid < getAmzSPMinBidLimitByCountry()) {
        return getAmzSPMinBidLimitByCountry();
      } else if (waterFallBid > getAmzSPMaxBidLimitByCountry()) {
        return getAmzSPMaxBidLimitByCountry();
      }
      return waterFallBid;
    }
    const waterFallBid = parseNum(
      keywordActionsUtils.calculateWaterfallBidForMatchTypeWalmart(
        customBid,
        matchType
      )
    );
    if (waterFallBid < WALMART_MIN_BID) {
      return WALMART_MIN_BID;
    } else if (waterFallBid > WALMART_MAX_BID) {
      return WALMART_MAX_BID;
    }
    return waterFallBid;
  },

  calculateWaterfallBidForMatchTypeAmazon: (
    customBid: number | string,
    matchType: FilterDropdownValue
  ) => {
    switch (matchType) {
      case FilterDropdownValue.EXACT:
        return formatNum(parseNum(customBid));
      case FilterDropdownValue.PHRASE:
        return formatNum(parseNum(customBid) * 0.9); // 10% less than exact
      case FilterDropdownValue.BROAD:
        return formatNum(parseNum(customBid) * 0.8); // 20% less than exact
      case FilterDropdownValue.ASIN_SAME_AS:
        return formatNum(parseNum(customBid));
      case FilterDropdownValue.ASIN_EXPANDED_FROM:
        return formatNum(parseNum(customBid) * 0.9);
      default:
        return formatNum(parseNum(customBid));
    }
  },

  calculateWaterfallBidForMatchTypeWalmart: (
    customBid: number | string,
    matchType: FilterDropdownValue
  ) => {
    switch (matchType) {
      case FilterDropdownValue.EXACT:
        return formatNum(parseNum(customBid));
      case FilterDropdownValue.PHRASE:
        return formatNum(parseNum(customBid) * 0.9); // 10% less than exact
      case FilterDropdownValue.BROAD:
        return formatNum(parseNum(customBid) * 0.81); // 10% less than phrase
      default:
        return formatNum(parseNum(customBid));
    }
  },

  getTargetAdGroupIdCampaignIdMap: (data: IKeywordActionData[]) => {
    const targetAdGroupIdCampaignIdMap = new Map<string, string>();
    data.forEach((item) => {
      const targetCampaigns = item.targetCampaigns ?? [];
      targetCampaigns.forEach((targetCampaign) => {
        const { targetCampaignId } = targetCampaign;
        const targetAdgroups = targetCampaign.targetAdGroups ?? [];
        targetAdgroups.forEach((targetAdGroup) => {
          const { targetAdGroupId } = targetAdGroup;
          if (!targetAdGroupIdCampaignIdMap.has(targetAdGroupId))
            targetAdGroupIdCampaignIdMap.set(targetAdGroupId, targetCampaignId);
        });
      });
    });

    return targetAdGroupIdCampaignIdMap;
  },

  createAmazonKeywordAdditionPayloadForSelectedRows: (
    targetAdGroupIdCampaignIdMap: Map<string, string>,
    dataToProcess: ISelectedMatchTypeForKeywordAddition[][]
  ) => {
    const payload: IKeywordAdditionBody[] = [];
    dataToProcess.forEach((rowData) => {
      rowData.forEach((rowDataByMatchType) => {
        rowDataByMatchType.adGroups.forEach((adGroup) => {
          const adGroupId = adGroup.value;
          payload.push({
            adGroupId: adGroupId,
            campaignId: targetAdGroupIdCampaignIdMap.get(adGroupId) as string,
            matchType: rowDataByMatchType.matchType.value,
            bid: rowDataByMatchType.bid,
            state: KeywordState.ENABLED,
            keywordText: rowDataByMatchType.searchTerm,
          });
        });
      });
    });

    return payload;
  },

  createAmazonProductAdditionPayloadForSelectedRows: (
    targetAdGroupIdCampaignIdMap: Map<string, string>,
    dataToProcess: Array<Array<ISelectedMatchTypeForProductAddition>>
  ) => {
    const payload: Array<IProductAdditionBody> = [];
    dataToProcess.forEach((dataItem) => {
      dataItem.forEach((rowData) => {
        rowData.adGroups.forEach((adGroupId) => {
          payload.push({
            campaignId: targetAdGroupIdCampaignIdMap.get(adGroupId.value)
              ? targetAdGroupIdCampaignIdMap.get(adGroupId.value)
              : 'NO campaignId',
            adGroupId: adGroupId.value,
            state: KeywordState.ENABLED,
            bid: rowData.bid,
            expressionType: 'MANUAL',
            expression: [
              {
                type: rowData.matchType.value,
                value: rowData.searchTerm.toUpperCase(),
              },
            ],
          });
        });
      });
    });

    return payload;
  },

  createAmazonKeywordNegationPayloadForSelectedRows: (
    targetAdGroupIdCampaignIdMap: Map<string, string>,
    dataToProcess: ISelectedMatchTypeForKeywordNegation[][]
  ) => {
    const payload: IKeywordNegationBody[] = [];
    dataToProcess.forEach((rowData) => {
      rowData.forEach((rowDataByMatchType) => {
        rowDataByMatchType.adGroups.forEach((adGroup) => {
          const adGroupId = adGroup.value;
          payload.push({
            adGroupId: adGroupId,
            campaignId: targetAdGroupIdCampaignIdMap.get(adGroupId) as string,
            matchType: rowDataByMatchType.matchType.value,
            state: KeywordState.ENABLED,
            keywordText: rowDataByMatchType.searchTerm,
          });
        });
      });
    });

    return payload;
  },

  createAmazonProductNegationPayloadForSelectedRows: (
    targetAdGroupIdCampaignIdMap: Map<string, string>,
    dataToProcess: Array<Array<ISelectedMatchTypeForProductAddition>>
  ) => {
    const payload: Array<IProductNegationBody> = [];
    dataToProcess.forEach((dataItem) => {
      dataItem.forEach((rowData) => {
        rowData.adGroups.forEach((adGroupId) => {
          payload.push({
            campaignId: targetAdGroupIdCampaignIdMap.get(adGroupId.value)
              ? targetAdGroupIdCampaignIdMap.get(adGroupId.value)
              : 'NO campaignId',
            adGroupId: adGroupId.value,
            state: KeywordState.PAUSED,
            expression: [
              {
                type: 'ASIN_SAME_AS',
                value: rowData.searchTerm.toUpperCase(),
              },
            ],
          });
        });
      });
    });
    return payload;
  },

  createWalmartKeywordAdditionPayloadForSelectedRows: (
    targetAdGroupIdCampaignIdMap: Map<string, string>,
    dataToProcess: ISelectedMatchTypeForKeywordAddition[][]
  ) => {
    const payload: IWalmartKeywordAdditionBody[] = [];
    dataToProcess.forEach((rowData) => {
      rowData.forEach((rowDataByMatchType) => {
        rowDataByMatchType.adGroups.forEach((adGroup) => {
          const adGroupId = adGroup.value;
          payload.push({
            adGroupId: Number(adGroupId),
            campaignId: Number(targetAdGroupIdCampaignIdMap.get(adGroupId)),
            matchType: rowDataByMatchType.matchType.value.toLowerCase(),
            bid: rowDataByMatchType.bid,
            state: WalmartKeywordState.ENABLED,
            keywordText: rowDataByMatchType.searchTerm,
          });
        });
      });
    });

    return payload;
  },

  createAmazonSearchTermArchivePayloadForSelectedRows: (
    dataToProcess: ISelectedSearchTermsToArchive[][]
  ) => {
    const payload: IArchiveSearchTermsPayload[] = [];
    dataToProcess.forEach((rowData) => {
      rowData.forEach((rowDataByMatchType) => {
        rowDataByMatchType.adGroups.forEach((adGroup) => {
          payload.push({
            adGroupId: adGroup.value,
            matchType: rowDataByMatchType.matchType.value,
            searchTerm: rowDataByMatchType.searchTerm,
            dateRange: rowDataByMatchType?.dateRange,
          });
        });
      });
    });

    return payload;
  },

  createWalmartSearchTermArchivePayloadForSelectedRows: (
    dataToProcess: ISelectedSearchTermsToArchive[][]
  ) => {
    const payload: IArchiveSearchTermsPayload[] = [];
    dataToProcess.forEach((rowData) => {
      rowData.forEach((rowDataByMatchType) => {
        rowDataByMatchType.adGroups.forEach((adGroup) => {
          payload.push({
            adGroupId: adGroup.value,
            matchType: rowDataByMatchType.matchType.value.toLowerCase(),
            searchTerm: rowDataByMatchType.searchTerm,
            dateRange: rowDataByMatchType?.dateRange,
          });
        });
      });
    });

    return payload;
  },

  getInitData: (data: IKeywordActionData[], marketplace: MarketplaceEnum) => {
    const targetCampaignOptions: IMultiSelectDropdownItem[][] = [];
    const targetAdGroupOptions: IMultiSelectDropdownItem[][] = [];
    const matchTypeToAdd: IMultiSelectDropdownItem[][] = [];
    const keywordBid: number[][] = [];

    data.forEach((row) => {
      const targetCampaignOptionsForRow: IMultiSelectDropdownItem[] = [];
      const targetAdGroupOptionsForRow: IMultiSelectDropdownItem[] = [];
      const matchTypeToAddForRow: IMultiSelectDropdownItem[] = [];
      const keywordBidForRow: number[] = [];
      const matchTypesToAdd = row.matchTypeToAdd ?? [];
      const targetCampaigns = row.targetCampaigns ?? [];

      matchTypesToAdd.forEach((matchType) => {
        matchTypeToAddForRow.push({
          selected: true,
          value: matchType,
          label: ProductActionsMatchTypeMap.get(matchType) ?? matchType,
        });
      });

      matchTypesToAdd.forEach((matchType) => {
        keywordBidForRow.push(
          keywordActionsUtils.calculateWaterfallBidForMatchTypeByMarketplace(
            row.customBid,
            matchType as FilterDropdownValue,
            marketplace
          )
        );
      });

      targetCampaigns.forEach((campaign, campaignIndex) => {
        targetCampaignOptionsForRow.push({
          selected: campaignIndex === 0 ? true : false,
          value: campaign.targetCampaignId,
          label: campaign.targetCampaignName,
        });

        if (campaignIndex === 0) {
          const targetAdgroups = campaign.targetAdGroups ?? [];
          targetAdgroups.forEach((adGroup, adGroupIndex) => {
            targetAdGroupOptionsForRow.push({
              selected: adGroupIndex === 0 ? true : false,
              value: adGroup.targetAdGroupId,
              label: adGroup.targetAdGroupName,
            });
          });
        }
      });

      targetCampaignOptions.push(targetCampaignOptionsForRow);
      targetAdGroupOptions.push(targetAdGroupOptionsForRow);
      matchTypeToAdd.push(matchTypeToAddForRow);
      keywordBid.push(keywordBidForRow);
    });

    return {
      targetCampaignOptions,
      targetAdGroupOptions,
      matchTypeToAdd,
      keywordBid,
    };
  },

  getKeywordActionDisableFilterConfig: (
    activeTab: KeywordActionTabsEnum
  ): Filters[] => {
    if (
      activeTab === KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON ||
      activeTab === KeywordActionTabsEnum.KEYWORD_ADDITION_WALMART ||
      activeTab === KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON
    ) {
      return FILTER_DISABLE_CONFIG.keywordActionAddition;
    }
    if (activeTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON) {
      return FILTER_DISABLE_CONFIG.keywordActionNegation;
    }
    if (activeTab === KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON) {
      return FILTER_DISABLE_CONFIG.productNegation;
    }
    return [];
  },

  getKeywordActionInitColumns: (tab: KeywordActionTabsEnum) => {
    if (tab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON) {
      return keywordActionNegationColumns;
    } else if (tab === KeywordActionTabsEnum.KEYWORD_ADDITION_WALMART) {
      return walmartKeywordActionAdditionColumns;
    } else if (tab === KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON) {
      return productActionAdditionColumns;
    } else if (tab === KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON) {
      return productNegationColumns;
    } else {
      return keywordActionAdditionColumns;
    }
  },

  updatePriorityOptions: (
    priorityOptions: IDropdownItem<KeywordActionPriority>[],
    actionType: IDropdownItem<KeywordActionActionType>
  ) => {
    if (
      actionType.value === KeywordActionActionType.MANUAL_TO_MANUAL ||
      actionType.value === KeywordActionActionType.PCT_TO_PCT
    ) {
      return priorityOptions.map((option) => {
        if (option.value === KeywordActionPriority.HIGH) {
          return option;
        }
        return {
          ...option,
          isDisabled: true,
        };
      });
    }
    return priorityOptions;
  },

  getInitialPinnedColumns: (
    selectedTab: KeywordActionTabsEnum
  ): ColumnPinningState => {
    switch (selectedTab) {
      case KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON:
      case KeywordActionTabsEnum.KEYWORD_ADDITION_WALMART:
      case KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON:
      case KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON:
      case KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON:
        return {
          left: [KeywordColumnEnum.SEARCH_TERM],
          right: [],
        };

      case KeywordActionTabsEnum.HISTORY_AMAZON:
      case KeywordActionTabsEnum.HISTORY_WALMART:
        return {
          left: [KeywordColumnEnum.KEYWORD, KeywordColumnEnum.MATCH_TYPE],
          right: [],
        };

      case KeywordActionTabsEnum.ARCHIVE_AMAZON:
      case KeywordActionTabsEnum.ARCHIVE_WALMART:
        return {
          left: [KeywordColumnEnum.SEARCH_TERM, KeywordColumnEnum.MATCH_TYPE],
          right: [],
        };

      default:
        return {
          left: [],
          right: [],
        };
    }
  },

  getSelectedTag: (tag: KeywordActionKeywordTagEnum) => {
    const foundOption = KeywordActionTaggingOptions.find(
      (option) => option.value === tag
    );
    return foundOption ? foundOption : KeywordActionTaggingOptions[0];
  },
  getSelectedProductActionTag: (tag: KeywordActionKeywordTagEnum) => {
    const foundOption = ProductActionTaggingOptions.find(
      (option) => option.value === tag
    );
    return foundOption ? foundOption : ProductActionTaggingOptions[0];
  },

  validatePayload: (
    payload: IWalmartKeywordAdditionBody[] | IKeywordAdditionBody[]
  ) => {
    const errors: string[] = [];
    payload.forEach((item) => {
      if (!item.campaignId) {
        errors.push('Please select at least one campaign to proceed.');
      }
      if (!item.adGroupId) {
        errors.push('Please select at least one ad group to proceed.');
      }
      if (!item.matchType) {
        errors.push('Please select at least one match type to proceed.');
      }
    });
    return errors;
  },
  validateProductActionPayload: (
    payload: Array<IProductAdditionBody | IProductNegationBody>
  ) => {
    const errors: string[] = [];
    payload.forEach((item) => {
      if (!item.campaignId) {
        errors.push('Please select at least one campaign to proceed.');
      }
      if (!item.adGroupId) {
        errors.push('Please select at least one ad group to proceed.');
      }
      if (!item.expression) {
        errors.push('Please select at least one match type to proceed.');
      }
    });
    return errors;
  },

  getKeywordAdditionTab: (marketplace: IDropdownItem<string>) => {
    switch (marketplace.marketplace) {
      case MarketplaceEnum.AMAZON:
        return KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON;
      default:
        return KeywordActionTabsEnum.KEYWORD_ADDITION_WALMART;
    }
  },

  setTitleAndMessage: (
    selectedTab: KeywordActionTabsEnum,
    selectedRowIds: number[],
    isArchive = false
  ) => {
    if (isArchive) {
      return {
        title: 'Confirmation',
        message: `You've selected ${formatNum(
          selectedRowIds.length,
          false
        )} item(s). Are you sure you want to archive these Search Terms?`,
      };
    }

    if (selectedTab === KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON) {
      return {
        title: 'Confirmation',
        message: `You've selected ${formatNum(
          selectedRowIds.length,
          false
        )} item(s). Are you sure you want to negate these keywords?`,
      };
    }

    if (selectedTab === KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON) {
      return {
        title: 'Confirmation',
        message: `You've selected ${formatNum(
          selectedRowIds.length,
          false
        )} product(s). Are you sure you want to add these products?`,
      };
    }

    return {
      title: 'Confirmation',
      message: `You've selected ${formatNum(
        selectedRowIds.length,
        false
      )} item(s). Are you sure you want to add these keywords?`,
    };
  },
  getFormattedPriorities: (priority: KeywordActionPriority) => {
    if (priority !== KeywordActionPriority.LOW) return [priority];
    return [KeywordActionPriority.LOW, KeywordActionPriority.RELATED];
  },
};

export default keywordActionsUtils;
