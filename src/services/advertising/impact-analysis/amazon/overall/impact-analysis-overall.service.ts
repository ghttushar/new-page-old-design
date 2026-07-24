import {
  AdTypeShort,
  AmazonAdvertisingTableTypesEnum,
} from '@/enums/advertising.enums';
import { Frequency } from '@/enums/serp.enums';
import {
  IPaginatedResponse,
  ISortCriteria,
} from '@/interfaces/advertising/advertising.interface';
import { IAdvertisingFilter } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IFinalFilters } from '@/redux/slices/filters/filter.slice';
import { getAmazonSearchColumnsByTableType } from '@/utils/advertising.utils';
import { AMAZON_IMPACT_ANALYSIS_OVERALL_ADVERTISING_BASE_URL } from 'src/constants';
import {
  IAnalysisFilter,
  IAnalysisTableData,
  TImpactAnalysisDataList,
} from 'src/interfaces/analysis.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const AnalysisOverallService = {
  getImpactAnalysis: (
    filters: IAdvertisingFilter,
    table = AmazonAdvertisingTableTypesEnum.CAMPAIGN,
    signal?: AbortSignal
  ) => {
    const body = {
      startDate: filters.range?.startDate,
      endDate: filters.range?.endDate,
      frequency: filters.frequency,
      range: filters.rangeType,
      table,
    };
    return axiosInstance.post<IAPIResponse<TImpactAnalysisDataList>>(
      `${AMAZON_IMPACT_ANALYSIS_OVERALL_ADVERTISING_BASE_URL}/graph`,
      body,
      {
        signal,
      }
    );
  },
  getImpactAnalysisTable: (
    appliedFilter: IFinalFilters[],
    filters: IAnalysisFilter,
    table: string,
    page: number,
    pageSize: number,
    searchText: string,
    sortCriteria?: ISortCriteria[],
    signal?: AbortSignal
  ) => {
    const bodyData = {
      table,
      startDate: filters.range?.startDate,
      endDate: filters.range?.endDate,
      frequency: Frequency.DAILY,
      range: filters.rangeType,
      impactRange: filters.impactRangeType,
      impactStartDate: filters.impactRange?.startDate,
      impactEndDate: filters.impactRange?.endDate,
      searchColumns: getAmazonSearchColumnsByTableType(
        AdTypeShort.All,
        table as AmazonAdvertisingTableTypesEnum
      ),
      searchText,
      filters: appliedFilter,
      sortCriteria,
    };
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IAnalysisTableData>>
    >(
      `${AMAZON_IMPACT_ANALYSIS_OVERALL_ADVERTISING_BASE_URL}/table?page=${page}&pageSize=${pageSize}`,
      bodyData,
      { signal }
    );
  },
};
