import { AmazonAccountType } from '@/enums/advertising.enums';
import {
  CatalogSearchColumnsEnum,
  CatalogTabTitlesEnum,
} from '@/enums/catalog.enums';
import { IAdvertisingFilter } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { SortingState } from '@tanstack/react-table';
import { getFormattedSortModel } from './advertising-columns.utils';

export const catalogUtils = {
  getAmazonCatalogServiceBody: (
    appliedFilters: any,
    searchText: string,
    filterPayload: IAdvertisingFilter,
    sorting?: SortingState,
    accountType?: AmazonAccountType
  ) => {
    const formattedSearchCols = [
      CatalogSearchColumnsEnum.ITEM_NAME,
      CatalogSearchColumnsEnum.ASIN,
      CatalogSearchColumnsEnum.UPC_CODE,
    ];
    if (accountType === AmazonAccountType.SELLER)
      formattedSearchCols.push(CatalogSearchColumnsEnum.SELLER_SKU);

    return {
      filters: appliedFilters,
      searchText,
      searchColumns: formattedSearchCols,
      sortCriteria: sorting
        ? getFormattedSortModel(CatalogTabTitlesEnum.AMAZON_CATALOG, sorting)
        : [],
      startDate: filterPayload.range?.startDate || '',
      endDate: filterPayload.range?.endDate || '',
      range: filterPayload.rangeType || '',
      isDownload: filterPayload.isDownload || false,
      downloadWithFilter: filterPayload.downloadWithFilter || false,
    };
  },
};
