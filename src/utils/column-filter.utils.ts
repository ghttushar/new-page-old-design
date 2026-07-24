import {
  ProfitabilityTableTitlesEnum,
  ProfitabilityTableTypeEnum,
} from '@/enums/profitability.enums';
import {
  ColumnDef,
  ColumnDefResolved,
  SortingState,
} from '@tanstack/react-table';
import {
  defaultAdvertisingColumns,
  defaultCatalogColumns,
} from 'src/constants/column.constants';
import {
  AdvertisingTitlesEnum,
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
import { KeywordActionTabsEnum } from 'src/enums/keyword-action.enums';
import { ISortCriteria } from 'src/interfaces/advertising/advertising.interface';
import { getInitialColumnsByNavTitle } from './advertising-columns.utils';
import { getFormattedSortCriteria } from './advertising.utils';
import localStorageUtils from './local-storage/local-storage.utils';

const columnFilterUtils = {
  // NOTE: Not being used. Remove this comment if it is used anywhere
  flattenColumns: <T>(columns: ColumnDef<T>[]): ColumnDef<T>[] => {
    const flattenedColumns: ColumnDef<T>[] = [];

    const flattenColumns = (cols: ColumnDef<T>[]) => {
      cols.forEach((item) => {
        flattenedColumns.push(item);

        if ('columns' in item && Array.isArray(item.columns)) {
          flattenColumns(item.columns as ColumnDef<T>[]);
        }
      });
    };

    flattenColumns(columns);

    return flattenedColumns;
  },

  getSelectedColumns: <T>(
    initialColumns: ColumnDef<T>[],
    selectedColumnIds: Array<string>
  ): ColumnDef<T>[] => {
    const filteredColumns = initialColumns
      .map((column) => {
        if ('columns' in column && Array.isArray(column.columns)) {
          const updatedChildColumns = columnFilterUtils.getSelectedColumns(
            column.columns,
            selectedColumnIds
          );
          if (!updatedChildColumns.length) return null;
          return {
            ...column,
            columns: updatedChildColumns,
          };
        }

        const matchingConfig = selectedColumnIds.find((id) => id === column.id);
        if (matchingConfig) {
          return column;
        }

        return null;
      })
      .filter((col): col is ColumnDef<T> => col !== null);
    return filteredColumns;
  },

  syncStoredColumnFilters: <T>(
    selectedNavTab: AdvertisingTitlesEnum,
    selectedColumnFilters: Array<ColumnDef<T>>
  ) => {
    const selectedColumns = columnFilterUtils.getColumnIds(
      selectedColumnFilters
    );

    localStorageUtils.setSelectedColumnsByNavTab(
      selectedNavTab,
      selectedColumns
    );
  },

  getStoredColumnFilters: <T>(
    selectedNavTab: AdvertisingTitlesEnum,
    initialColumns: Array<ColumnDef<T>> = []
  ): Array<ColumnDef<T>> => {
    const storedColumnIds =
      localStorageUtils.getSelectedColumnsByNavTab(selectedNavTab);

    const fetchedInitialColumns =
      initialColumns && initialColumns.length > 0
        ? initialColumns
        : (getInitialColumnsByNavTitle(selectedNavTab) as Array<ColumnDef<T>>);

    const defaultColumns = columnFilterUtils.getDefaultColumnsBasedOnNavTab(
      selectedNavTab,
      fetchedInitialColumns
    );

    if (storedColumnIds && storedColumnIds.length) {
      return columnFilterUtils.getSelectedColumns(
        fetchedInitialColumns,
        storedColumnIds
      );
    }

    const defaultColumnIdsFromKeys =
      columnFilterUtils.getColumnIdsFromColumnKeys(
        fetchedInitialColumns,
        defaultColumns
      );
    return columnFilterUtils.getSelectedColumns(
      fetchedInitialColumns,
      defaultColumnIdsFromKeys
    );
  },

  convertToColumnDefResolved: <T>(columnArr: Array<ColumnDef<T>>) => {
    return columnArr as Array<ColumnDefResolved<T>>;
  },

  getColumnIdsFromColumnKeys: <T>(
    columns: Array<ColumnDef<T>>,
    columnKeys: string[]
  ): string[] => {
    const columnIds = columnFilterUtils
      .convertToColumnDefResolved(columns)
      .map((column) => {
        if ('columns' in column && Array.isArray(column.columns)) {
          const subColumnIds = columnFilterUtils.getColumnIdsFromColumnKeys(
            column.columns,
            columnKeys
          );
          if (!subColumnIds || !subColumnIds.length) return null;

          return [...subColumnIds];
        }

        const matchingColumn = columnKeys.find(
          (key) => key === column.accessorKey
        );
        if (matchingColumn) return column.id;

        return null;
      })
      .flat()
      .filter((key) => key !== null && key !== undefined);

    if (columnIds === null || columnIds === undefined) return [];
    return columnIds as string[];
  },

  getColumnKeysFromColumnIds: <T>(
    columns: Array<ColumnDef<T>>,
    columnIds: string[]
  ): string[] => {
    const columnKeys = columnFilterUtils
      .convertToColumnDefResolved(columns)
      .map((column) => {
        if ('columns' in column && Array.isArray(column.columns)) {
          const subColumnKeys = columnFilterUtils.getColumnKeysFromColumnIds(
            column.columns,
            columnIds
          );
          if (!subColumnKeys || !subColumnKeys.length) return null;

          return [...subColumnKeys];
        }

        const matchingColumn = columnIds.find((id) => id === column.id);
        if (matchingColumn) return column.accessorKey;

        return null;
      })
      .flat()
      .filter((id) => id !== null && id !== undefined);

    if (columnKeys === null || columnKeys === undefined) return [];
    return columnKeys as string[];
  },

  getFormattedSortModelBasedOnColumnKeys: <T>(
    columns: Array<ColumnDef<T>>,
    sortModel: SortingState
  ): Array<ISortCriteria> => {
    const formattedSortModel: SortingState = sortModel.map((sort) => {
      if (sort.id === 'Product Details') {
        return {
          id: 'productName',
          desc: sort.desc,
        };
      }
      return {
        id:
          columnFilterUtils.getColumnKeysFromColumnIds(
            columns as Array<ColumnDef<T>>,
            [sort.id]
          )[0] ?? 'adSales',
        desc: sort.desc,
      };
    });

    if (!formattedSortModel || !formattedSortModel.length) return [];
    return getFormattedSortCriteria(formattedSortModel);
  },

  getColumnIds: <T>(columns: Array<ColumnDef<T>>): string[] => {
    const columnIds = columns
      .map((column) => {
        if ('columns' in column && Array.isArray(column.columns)) {
          const subColumnIds = columnFilterUtils.getColumnIds(column.columns);
          if (subColumnIds && subColumnIds.length) return [...subColumnIds];
        }

        return column.id as string;
      })
      .flat();

    return columnIds;
  },

  getDefaultColumnsBasedOnNavTab: <T>(
    selectedNavTab: AdvertisingTitlesEnum,
    initialColumns: Array<ColumnDef<T>>
  ) => {
    switch (selectedNavTab) {
      case SpAccountLevelTitles.CAMPAIGNS:
      case SpAccountLevelTitles.AD_GROUPS:
      case SpCampaignLevelTitles.AD_GROUPS:
      case SpAccountLevelTitles.PRODUCT_ADS:
      case SpCampaignLevelTitles.PRODUCT_ADS:
      case SpAdGroupLevelTitles.PRODUCT_ADS:
      case SpAccountLevelTitles.KEYWORD_TARGETING:
      case SpCampaignLevelTitles.KEYWORD_TARGETING:
      case SpAccountLevelTitles.PRODUCT_TARGETING:
      case SpCampaignLevelTitles.PRODUCT_TARGETING:
      case SpAccountLevelTitles.AUTO_TARGETING:
      case SpAccountLevelTitles.PLACEMENT:
      case SpCampaignLevelTitles.AUTO_TARGETING:
      case SpCampaignLevelTitles.NEG_TARGETING_KEYWORD:
      case SpAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
      case SpCampaignLevelTitles.NEG_TARGETING_PRODUCT:
      case SpAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
      case SpAccountLevelTitles.SEARCH_TERM:
      case SpCampaignLevelTitles.SEARCH_TERM:
      case SpAdGroupLevelTitles.SEARCH_TERM:
      case SpCampaignLevelTitles.PLACEMENT:
      case SpCampaignLevelTitles.HISTORY:
      case SpAdGroupLevelTitles.TARGETING:
      case SpAdGroupLevelTitles.KEYWORD_TARGETING:
      case SpAdGroupLevelTitles.PRODUCT_TARGETING:
      case SpAdGroupLevelTitles.HISTORY:
      case SbAccountLevelTitles.CAMPAIGNS:
      case SbAccountLevelTitles.AD_GROUP:
      case SbCampaignLevelTitles.AD_GROUP:
      case SbAccountLevelTitles.PRODUCT_ADS:
      case SbCampaignLevelTitles.PRODUCT_ADS:
      case SbAdGroupLevelTitles.PRODUCT_ADS:
      case SbAccountLevelTitles.KEYWORD_TARGETING:
      case SbCampaignLevelTitles.KEYWORD_TARGETING:
      case SbAdGroupLevelTitles.KEYWORD_TARGETING:
      case SbAccountLevelTitles.PRODUCT_TARGETING:
      case SbCampaignLevelTitles.PRODUCT_TARGETING:
      case SbAdGroupLevelTitles.PRODUCT_TARGETING:
      case SbAccountLevelTitles.SEARCH_TERM:
      case SbCampaignLevelTitles.SEARCH_TERM_KEYWORD:
      case SbAdGroupLevelTitles.SEARCH_TERM_KEYWORD:
      case SbCampaignLevelTitles.NEG_TARGETING_KEYWORD:
      case SbAdGroupLevelTitles.NEG_TARGETING_KEYWORD:
      case SbCampaignLevelTitles.NEG_TARGETING_PRODUCT:
      case SbAdGroupLevelTitles.NEG_TARGETING_PRODUCT:
      case SbCampaignLevelTitles.HISTORY:
      case SdAccountLevelTitles.CAMPAIGN:
      case SdAccountLevelTitles.AD_GROUP:
      case SdCampaignLevelTitles.AD_GROUP:
      case SdAccountLevelTitles.PRODUCT_ADS:
      case SdCampaignLevelTitles.PRODUCT_ADS:
      case SdAdGroupLevelTitles.PRODUCT_ADS:
      case SdAccountLevelTitles.AUDIENCE:
      case SdAccountLevelTitles.CONTEXTUAL_TARGETING:
      case SdCampaignLevelTitles.TARGETING:
      case SdCampaignLevelTitles.HISTORY:
      case SdAdGroupLevelTitles.CREATIVE:
      case SdAdGroupLevelTitles.TARGETING:
      case SdAdGroupLevelTitles.HISTORY:
      case OverallAccountLevelTitles.CAMPAIGNS:
      case OverallAccountLevelTitles.AD_GROUPS:
      case OverallAccountLevelTitles.PRODUCT_ADS:
      case OverallAccountLevelTitles.KEYWORD_TARGETING:
      case OverallAccountLevelTitles.PRODUCT_TARGETING:
      case OverallAccountLevelTitles.SEARCH_TERM:
      case WalmartSPAccountLevelTitles.CAMPAIGNS:
      case WalmartSPAccountLevelTitles.AD_GROUPS:
      case WalmartSPAccountLevelTitles.AD_ITEMS:
      case WalmartSPAccountLevelTitles.KEYWORD_TARGETING:
      case WalmartSPAccountLevelTitles.SEARCH_TERM:
      case WalmartSPAccountLevelTitles.PAGE_TYPE:
      case WalmartSPAccountLevelTitles.PLATFORM:
      case WalmartSPCampaignLevelTitles.AD_GROUPS:
      case WalmartSPCampaignLevelTitles.AD_ITEMS:
      case WalmartSPCampaignLevelTitles.KEYWORD_TARGETING:
      case WalmartSPCampaignLevelTitles.SEARCH_TERM:
      case WalmartSPCampaignLevelTitles.PAGE_TYPE:
      case WalmartSPCampaignLevelTitles.PLATFORM:
      case WalmartSPAdGroupLevelTitles.AD_ITEMS:
      case WalmartSPAdGroupLevelTitles.KEYWORD_TARGETING:
      case WalmartSPAdGroupLevelTitles.SEARCH_TERM:
      case WalmartSBAccountLevelTitles.CAMPAIGNS:
      case WalmartSBAccountLevelTitles.AD_GROUPS:
      case WalmartSBCampaignLevelTitles.AD_GROUPS:
      case WalmartSBAccountLevelTitles.AD_ITEMS:
      case WalmartSBCampaignLevelTitles.AD_ITEMS:
      case WalmartSBAdGroupLevelTitles.AD_ITEMS:
      case WalmartSBAccountLevelTitles.KEYWORD_TARGETING:
      case WalmartSBCampaignLevelTitles.KEYWORD_TARGETING:
      case WalmartSBAdGroupLevelTitles.KEYWORD_TARGETING:
      case WalmartSBCampaignLevelTitles.PAGE_TYPE:
      case WalmartSBAccountLevelTitles.PAGE_TYPE:
      case WalmartSBCampaignLevelTitles.PLATFORM:
      case WalmartSBAccountLevelTitles.PLATFORM:
      case WalmartSVAccountLevelTitles.CAMPAIGNS:
      case WalmartSVAccountLevelTitles.AD_GROUPS:
      case WalmartSVCampaignLevelTitles.AD_GROUPS:
      case WalmartSVAccountLevelTitles.AD_ITEMS:
      case WalmartSVCampaignLevelTitles.AD_ITEMS:
      case WalmartSVAdGroupLevelTitles.AD_ITEMS:
      case WalmartSVAccountLevelTitles.KEYWORD_TARGETING:
      case WalmartSVCampaignLevelTitles.KEYWORD_TARGETING:
      case WalmartSVAdGroupLevelTitles.KEYWORD_TARGETING:
      case WalmartSVCampaignLevelTitles.PAGE_TYPE:
      case WalmartSVAccountLevelTitles.PAGE_TYPE:
      case WalmartSVAccountLevelTitles.PLATFORM:
      case WalmartSVCampaignLevelTitles.PLATFORM:
      case WalmartOverallAccountLevelTitles.CAMPAIGNS:
      case WalmartOverallAccountLevelTitles.AD_GROUPS:
      case WalmartOverallAccountLevelTitles.AD_ITEMS:
      case WalmartOverallAccountLevelTitles.KEYWORD_TARGETING:
      case WalmartOverallAccountLevelTitles.SEARCH_TERM:
      case WalmartOverallAccountLevelTitles.PAGE_TYPE:
      case WalmartOverallAccountLevelTitles.PLATFORM:
      case KeywordActionTabsEnum.KEYWORD_ADDITION_AMAZON:
      case KeywordActionTabsEnum.PRODUCT_ADDITION_AMAZON:
      case KeywordActionTabsEnum.KEYWORD_ADDITION_WALMART:
      case KeywordActionTabsEnum.KEYWORD_NEGATION_AMAZON:
      case KeywordActionTabsEnum.PRODUCT_NEGATION_AMAZON:
        return defaultAdvertisingColumns;

      case CatalogTabTitlesEnum.WALMART_CATALOG:
      case CatalogTabTitlesEnum.AMAZON_CATALOG:
        return defaultCatalogColumns;

      default:
        return columnFilterUtils
          .convertToColumnDefResolved(initialColumns)
          .map((col) => col.accessorKey ?? '');
    }
  },
  getDisabledColumnsByTableTitle: (selectedTableTitle: string) => {
    switch (selectedTableTitle) {
      case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_ORDERS:
      case ProfitabilityTableTitlesEnum.AMZ_PROFITABILITY_PNL_PRODUCTS:
      case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_ORDERS:
      case ProfitabilityTableTitlesEnum.PROFITABILITY_PNL_PRODUCTS:
      case ProfitabilityTableTypeEnum.AMAZON_ORDERS:
      case ProfitabilityTableTypeEnum.AMAZON_PRODUCTS:
      case ProfitabilityTableTypeEnum.ORDERS:
      case ProfitabilityTableTypeEnum.PRODUCTS:
        return [
          ColumnNameEnum.MORE_INFO,
          ColumnNameEnum.PROFITABILITY_PRODUCT_DETAILS,
          ColumnNameEnum.PROFITABILITY_ORDER_DETAILS,
        ];
      default:
        return [];
    }
  },
  checkIsColumnDisabledByTableTitle: (
    selectedTableTitle: string,
    columnName: string
  ) => {
    return columnFilterUtils
      .getDisabledColumnsByTableTitle(selectedTableTitle)
      .some((column) => column.toLowerCase() === columnName.toLowerCase());
  },
};

export default columnFilterUtils;
