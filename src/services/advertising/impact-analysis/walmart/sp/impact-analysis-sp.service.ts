import {
  AdTypeShort,
  WalmartAdvertisingTableTypeEnum,
} from '@/enums/advertising.enums';
import { Frequency } from '@/enums/serp.enums';
import {
  IPaginatedResponse,
  ISortCriteria,
} from '@/interfaces/advertising/advertising.interface';
import { IAdvertisingFilter } from '@/interfaces/advertising/amazon/sp-advertising.interface';
import { IFinalFilters } from '@/redux/slices/filters/filter.slice';
import { getWalmartSearchColumnsByTableType } from '@/utils/advertising.utils';
import { getWalmartAdvTableFromAnalysisTableType } from '@/utils/analysis.utils';
import { WALMART_IMPACT_ANALYSIS_SP_ADVERTISING_BASE_URL } from 'src/constants';
import {
  IAnalysisFilter,
  IAnalysisTableData,
  TImpactAnalysisDataList,
} from 'src/interfaces/analysis.interface';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

export const WalmartAnalysisSPService = {
  getImpactAnalysis: (
    filters: IAdvertisingFilter,
    table = WalmartAdvertisingTableTypeEnum.CAMPAIGN,
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
      `${WALMART_IMPACT_ANALYSIS_SP_ADVERTISING_BASE_URL}/graph`,
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
    sortCriteria?: ISortCriteria[]
  ) => {
    const bodyData = {
      table: getWalmartAdvTableFromAnalysisTableType(table),
      startDate: filters.range?.startDate,
      endDate: filters.range?.endDate,
      frequency: Frequency.DAILY,
      range: filters.rangeType,
      impactRange: filters.impactRangeType,
      impactStartDate: filters.impactRange?.startDate,
      impactEndDate: filters.impactRange?.endDate,
      searchColumns: getWalmartSearchColumnsByTableType(
        AdTypeShort.SPONSORED_PRODUCTS,
        getWalmartAdvTableFromAnalysisTableType(table)
      ),
      searchText,
      filters: appliedFilter,
      sortCriteria,
    };
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<IAnalysisTableData>>
    >(
      `${WALMART_IMPACT_ANALYSIS_SP_ADVERTISING_BASE_URL}/table?page=${page}&pageSize=${pageSize}`,
      bodyData
    );
  },
};
