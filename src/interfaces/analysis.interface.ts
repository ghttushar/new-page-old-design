export interface IDateRange {
  startDate: string;
  endDate?: string;
}

export interface IAnalysisFilter {
  impactRangeType: string;
  impactRange?: IDateRange;
  frequency: string;
  range?: IDateRange;
  rangeType: string;
  campaignId: string;
  adGroupId: string;
}

export interface IAnalysis {
  isNegative: boolean;
  percentage: number;
}

interface IAnalysisMetricsData {
  average: number;
  impact: IAnalysis;
  actual: number;
}

interface IImpactedGroupData {
  roas: IAnalysisMetricsData;
  clicks: IAnalysisMetricsData;
  impressions: IAnalysisMetricsData;
  ctr: IAnalysisMetricsData;
  cpc: IAnalysisMetricsData;
  cvr: IAnalysisMetricsData;
  unitsSold: IAnalysisMetricsData;
  acos: IAnalysisMetricsData;
  adSales: IAnalysisMetricsData;
  adSpend: IAnalysisMetricsData;
  totalSales: IAnalysisMetricsData;
  totalUnits: IAnalysisMetricsData;
  inventoryCount: IAnalysisMetricsData;
}

export interface IImpactedCampaignData extends IImpactedGroupData {
  campaignId: number | string;
  campaignName: string;
}

export interface IImpactedAdGroupData extends IImpactedGroupData {
  adgroupId: number | string;
  campaignName: string;
  adGroupName: string;
}

export interface IImpactedProductData extends IImpactedGroupData {
  productId: number | string;
  productName: string;
  campaignName: string;
  adGroupName: string;
}

export interface IImpactedKeywordData extends IImpactedGroupData {
  keywordId: number | string;
  keywordName: string;
  campaignName: string;
  adGroupName: string;
  matchType: string;
}

export interface IImpactedSearchTermData extends IImpactedKeywordData {
  searchTerm: string;
}

export interface IImpactAnalysisDate {
  startDate: string;
  endDate: string;
  impactStartDate: string;
  impactEndDate: string;
}

export interface IAnalysisCampaignData extends IImpactAnalysisDate {
  data: IImpactedCampaignData[];
}

export interface IAnalysisAdGroupData extends IImpactAnalysisDate {
  data: IImpactedAdGroupData[];
}

export interface IAnalysisProductData extends IImpactAnalysisDate {
  data: IImpactedProductData[];
}

export interface IAnalysisKeywordData extends IImpactAnalysisDate {
  data: IImpactedKeywordData[];
}

export interface IAnalysisSearchTermData extends IImpactAnalysisDate {
  data: IImpactedSearchTermData[];
}

export interface IImpactAnalysisData extends IAnalysis {
  campaignId: string;
  campaignName: string;
  adGroupId: string;
  adGroupName: string;
  keywordId: number;
  keywordName: string;
  productId: string;
  productName: string;
  searchTerm: string;
}

export interface IImpactGraphResponse {
  topData: IImpactAnalysisData[];
  bottomData: IImpactAnalysisData[];
}

export interface IImpactGraphSortedResponse {
  roasImpact: IImpactGraphResponse;
  clicksImpact: IImpactGraphResponse;
  impressionsImpact: IImpactGraphResponse;
  ctrImpact: IImpactGraphResponse;
  cpcImpact: IImpactGraphResponse;
  cvrImpact: IImpactGraphResponse;
  unitsSoldImpact: IImpactGraphResponse;
  acosImpact: IImpactGraphResponse;
  adSalesImpact: IImpactGraphResponse;
  adSpendImpact: IImpactGraphResponse;
}

export interface IImpactDates {
  prevStartDate: string;
  prevEndDate: string;
  dateOfImpact: string;
}

export type TImpactAnalysisDataList = Record<
  string,
  IImpactGraphSortedResponse
>;

export interface IExportData {
  ROAS_Average: number;
  ROAS_Impact: number;
  ROAS_Impact_Percentage: number;
  AdSpend_Average: number;
  AdSpend_Impact: number;
  AdSpend_Impact_Percentage: number;
  Clicks_Average: number;
  Clicks_Impact: number;
  Clicks_Impact_Percentage: number;
  Impressions_Average: number;
  Impressions_Impact: number;
  Impressions_Impact_Percentage: number;
  CTR_Average: number;
  CTR_Impact: number;
  CTR_Impact_Percentage: number;
  CPC_Average: number;
  CPC_Impact: number;
  CPC_Impact_Percentage: number;
  CVR_Average: number;
  CVR_Impact: number;
  CVR_Impact_Percentage: number;
  AdUnits_Average: number;
  AdUnits_Impact: number;
  AdUnits_Impact_Percentage: number;
  ACOS_Average: number;
  ACOS_Impact: number;
  ACOS_Impact_Percentage: number;
  AdSales_Average: number;
  AdSales_Impact: number;
  AdSales_Impact_Percentage: number;
}

export interface IExportCampaignTableData extends IExportData {
  campaignId: number | string;
  campaignName: string;
}

export interface IExportAdGroupTableData extends IExportData {
  adgroupId: number | string;
  campaignName: string;
  adGroupName: string;
}

export interface IExportProductTableData extends IExportData {
  productId: number | string;
  productName: string;
  campaignName: string;
  adGroupName: string;
}

export interface IExportKeywordTableData extends IExportData {
  keywordId: number | string;
  keywordName: string;
  campaignName: string;
  adGroupName: string;
}

export type IAnalysisArrayData =
  | IImpactedCampaignData[]
  | IImpactedAdGroupData[]
  | IImpactedProductData[]
  | IImpactedKeywordData[]
  | IImpactedSearchTermData[];

export type IAnalysisExportData =
  | IExportCampaignTableData
  | IExportAdGroupTableData
  | IExportProductTableData
  | IExportKeywordTableData;

export type IAnalysisColData =
  | IImpactedCampaignData
  | IImpactedAdGroupData
  | IImpactedProductData
  | IImpactedKeywordData
  | IImpactedSearchTermData;

export type IAnalysisTableData =
  | IAnalysisCampaignData
  | IAnalysisAdGroupData
  | IAnalysisProductData
  | IAnalysisKeywordData
  | IAnalysisSearchTermData;
