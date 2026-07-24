import { RulesSearchColumns, RuleTypeEnum } from '@/enums/rules.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IPaginatedResponse,
  ISortCriteria,
} from '@/interfaces/advertising/advertising.interface';
import { IGenerateSourceTargetMapping } from '@/interfaces/configurations.interface';
import {
  IAppliedRuleResponse,
  IAppliedRulesUpdatePayload,
  IAppliedRulesUpdateResponse,
  IConflictResponse,
  IDeleteByEntityIdPayload,
  ILinkableEntitiesResponse,
  INewAuditResponse,
  IRuleConstraints,
  IRulesEntitiesResponse,
  IRulesTemplateDetails,
  IRuleTypesPayload,
  IRuleTypesResponse,
  IRuleTypesTemplatesDetails,
  ISearchRecognitionPayload,
  TAuditResponse,
} from '@/interfaces/rules/rules.interfaces';
import { IFinalFilters } from '@/redux/slices/filters/filter.slice';
import { RULES_API_BASE_URL } from 'src/constants';
import { IAPIResponse } from 'src/interfaces/service.interface';
import { axiosInstance } from 'src/redux/store';

const rulesServices = {
  getTemplateFromPrompt: (
    payload: ISearchRecognitionPayload,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IRulesTemplateDetails | null>>(
      `${RULES_API_BASE_URL}/search-recog`,
      payload,
      {
        signal,
      }
    );
  },
  getRuleTypes: (payload: IRuleTypesPayload, signal?: AbortSignal) => {
    return axiosInstance.post<IAPIResponse<IRuleTypesResponse | null>>(
      `${RULES_API_BASE_URL}/types`,
      payload,
      {
        signal,
      }
    );
  },
  getTemplatesByRuleType: (ruleType: RuleTypeEnum, signal?: AbortSignal) => {
    return axiosInstance.get<IAPIResponse<Array<IRuleTypesTemplatesDetails>>>(
      `${RULES_API_BASE_URL}/templates/${ruleType}`,
      {
        signal,
      }
    );
  },
  getTemplateByTemplateId: (templateId: string, signal?: AbortSignal) => {
    return axiosInstance.get<IAPIResponse<IRulesTemplateDetails>>(
      `${RULES_API_BASE_URL}/template/${templateId}`,
      {
        signal,
      }
    );
  },
  getLinkableTableData: (
    ruleType: RuleTypeEnum,
    marketplace: MarketplaceEnum,
    id: string,
    signal?: AbortSignal
  ) => {
    return axiosInstance.get<IAPIResponse<ILinkableEntitiesResponse>>(
      `${RULES_API_BASE_URL}/linkable-entities/${ruleType}?metaId=${id}&marketplace=${marketplace}`,
      {
        signal,
      }
    );
  },
  getRuleConstraintsByRuleType: (
    ruleType: RuleTypeEnum,
    marketplace: MarketplaceEnum,
    signal?: AbortSignal
  ) => {
    return axiosInstance.get<IAPIResponse<IRuleConstraints>>(
      `${RULES_API_BASE_URL}/constraints/${ruleType}?marketplace=${marketplace}`,
      {
        signal,
      }
    );
  },
  auditRule: (payload: IRulesTemplateDetails, signal?: AbortSignal) => {
    return axiosInstance.post<IAPIResponse<TAuditResponse>>(
      `${RULES_API_BASE_URL}/audit`,
      payload,
      {
        signal,
      }
    );
  },
  createRule: (payload: IRulesTemplateDetails | null, signal?: AbortSignal) => {
    return axiosInstance.post<
      IAPIResponse<
        IRulesTemplateDetails | IConflictResponse | INewAuditResponse
      >
    >(`${RULES_API_BASE_URL}/`, payload, {
      signal,
    });
  },
  postDraft: (
    payload: Partial<IRulesTemplateDetails>,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<IRulesTemplateDetails | null>>(
      `${RULES_API_BASE_URL}/draft`,
      payload,
      {
        signal,
      }
    );
  },
  postFetchAppliedRules: (
    metaId: string,
    marketplace: string,
    filters: IFinalFilters[],
    page: number,
    pageSize: number,
    sortCriteria: Array<ISortCriteria>,
    searchText = '',
    isDownload: boolean,
    downloadWithFilter: boolean,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<
      IAPIResponse<IPaginatedResponse<Array<IAppliedRuleResponse>>>
    >(
      `${RULES_API_BASE_URL}/applied-rules?metaId=${metaId}&marketplace=${marketplace}&page=${page}&pageSize=${pageSize}`,
      {
        filters,
        sortCriteria,
        searchText,
        searchColumns: [
          RulesSearchColumns.RULE_NAME,
          RulesSearchColumns.RULE_ID,
          RulesSearchColumns.RULE_TYPE,
        ],
        isDownload,
        downloadWithFilter,
      },
      {
        signal,
      }
    );
  },
  getRuleEntities: (ruleId: string, signal?: AbortSignal) => {
    return axiosInstance.get<
      IAPIResponse<IRulesEntitiesResponse | Array<IGenerateSourceTargetMapping>>
    >(`${RULES_API_BASE_URL}/${ruleId}/entities`, {
      signal,
    });
  },
  getRulesById: (ruleId: string, signal?: AbortSignal) => {
    return axiosInstance.get<IAPIResponse<Array<IRulesTemplateDetails>>>(
      `${RULES_API_BASE_URL}/?ruleId=${ruleId}`,
      {
        signal,
      }
    );
  },
  putUpdateRule: (
    ruleId: string,
    payload: IRulesTemplateDetails,
    signal?: AbortSignal
  ) => {
    return axiosInstance.put<
      IAPIResponse<
        IRulesTemplateDetails | IConflictResponse | INewAuditResponse
      >
    >(`${RULES_API_BASE_URL}/${ruleId}`, payload, {
      signal,
    });
  },
  deleteByEntityIds: (
    payload: IDeleteByEntityIdPayload,
    signal?: AbortSignal
  ) => {
    return axiosInstance.post<IAPIResponse<null>>(
      `${RULES_API_BASE_URL}/delete-by-ids`,
      payload,
      {
        signal,
      }
    );
  },
  patchUpdateAppliedRule: (
    payload: IAppliedRulesUpdatePayload,
    signal?: AbortSignal
  ) => {
    return axiosInstance.patch<IAPIResponse<IAppliedRulesUpdateResponse>>(
      `${RULES_API_BASE_URL}/bulk-rule-edit`,
      payload,
      {
        signal,
      }
    );
  },
};

export default rulesServices;
