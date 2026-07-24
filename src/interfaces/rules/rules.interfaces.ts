import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { MetricsKeysEnum } from '@/enums/advertising.enums';
import { DayOfMonthEnum, DayOfWeekEnum } from '@/enums/datetime.enums';
import { MetricInputTypeEnum } from '@/enums/index.enums';
import { MetaTypeEnum } from '@/enums/monitoring.enum';
import {
  AmazonRuleOperatorEnum,
  MetricValueConstraintType,
  RuleActionTypeEnum,
  RuleAdjustmentTargetType,
  RuleAdjustmentTypeEnum,
  RuleEntityTypeIdEnum,
  RuleExecutionModeEnum,
  RuleStatusEnum,
  RuleTypeCategoryEnum,
  RuleTypeCategoryNameEnum,
  RuleTypeEnum,
  RuleValueTypeEnum,
} from '@/enums/rules.enum';
import {
  FrequencyTypesEnum,
  MarketplaceEnum,
  MetricsTimeWindowUnitEnum,
} from '@/enums/serp.enums';

export interface ISearchRecognitionPayload {
  searchText: string;
  marketplace: MarketplaceEnum;
}

export interface IExecutionSchedule {
  frequency: FrequencyTypesEnum;
  time: string;
  daysOfWeek?: DayOfWeekEnum[];
  daysOfMonth?: DayOfMonthEnum[];
  startDate: string;
  endDate: string;
  timezone: string;
}

export interface IMetricsTimeWindow {
  value: number;
  unit: MetricsTimeWindowUnitEnum;
}

export interface IAdvancedSettings {
  excludeOn?: string[];
  minBid?: number;
  maxBid?: number;
  troas?: number;
}

export interface IRuleBasicDetails {
  ruleName: string;
  metricsTimeWindow?: IMetricsTimeWindow | null;
  ruleType: RuleTypeEnum;
  id?: string;
  accountId: string;
  metaId: string;
  metaType: MetaTypeEnum;
  marketplace: MarketplaceEnum;
  description: string | null;
  status: RuleStatusEnum;
  executionSchedule: IExecutionSchedule | null;
  ruleExecutionMode: RuleExecutionModeEnum;
  advancedSettings: IAdvancedSettings | null;
  isDraft?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRuleEntityLinksDetails {
  ruleId: string;
  entityType: RuleEntityTypeIdEnum;
  entityId: string;
  adType: string | null;
}

export interface IRuleConditionValue {
  valueType: TRuleValueType;
  absoluteValue: number;
  calculatedMetric?: MetricsKeysEnum;
  derivedMetric?: MetricsKeysEnum;
}

export interface IRuleCondition {
  id: string;
  metric: MetricsKeysEnum;
  operator: AmazonRuleOperatorEnum;
  value: IRuleConditionValue;
}

export interface IRuleActionParams {
  bidValue?: number;
  bidPercentage?: number;
  minBid?: number;
  maxBid?: number;
  customParams?: Record<string, unknown>;
}

export interface IRuleAction {
  actionType: RuleActionTypeEnum;
  params?: IRuleActionParams;
  adjustments?: Array<IRuleAdjustment>;
}

export interface IRuleAdjustment {
  id: string;
  target: RuleAdjustmentTargetType;
  valueType: RuleActionTypeEnum;
  value: number;
}

export interface IRuleCriteriaDetails {
  criteriaName: string;
  conditions: Array<IRuleCondition>;
  action: IRuleAction;
  id: string;
  ruleId?: string;
  criteriaOrder: number;
}

export interface IRulesTemplateDetails {
  rule: IRuleBasicDetails;
  entityLinks: Array<IRuleEntityLinksDetails>;
  criteriaSets: Array<IRuleCriteriaDetails>;
  overrideConflicts?: boolean;
}

export interface IRuleTypesTemplatesDetails {
  id: string;
  ruleType: RuleTypeEnum;
  ruleTypeName: string;
  description: string;
}

export interface IRuleTypesResponse {
  campaignRule: Array<IRuleTypesTemplatesDetails>;
  targetingRule: Array<IRuleTypesTemplatesDetails>;
}

export interface IRuleTypesFormattedResponse {
  category: RuleTypeCategoryEnum;
  rules: Array<IRuleTypesTemplatesDetails>;
}

export interface IRuleTypeCategoryMapping {
  name: RuleTypeCategoryNameEnum;
  icon: JSX.Element;
}

export interface IRuleTypesPayload {
  marketplace: MarketplaceEnum;
}

export interface IExistingRuleSummary {
  ruleName: string;
  ruleType: RuleTypeEnum;
  status: RuleStatusEnum;
  executionSchedule?: IExecutionSchedule;
}

export interface ILinkableEntity {
  entityId: string;
  name: string;
  status: string;
  adType?: string;
  targetingType?: string;
  existingRules: IExistingRuleSummary[];
  itemImageUrl?: string;
  itemPageUrl?: string;
  ruleEntityLinkStatus?: string | null;
}

export interface ILinkableEntitiesResponse {
  entityType: RuleEntityTypeIdEnum;
  entities: ILinkableEntity[];
}

export interface IMetricsWithValueTypes {
  metric: MetricValueConstraintType;
  valueType: TRuleValueType;
}

export interface IAdjustmentConstraints {
  targets: Array<RuleAdjustmentTargetType>;
  adjustmentType: RuleAdjustmentTypeEnum;
  actions: Array<RuleActionTypeEnum>;
}

export interface IRuleConstraints {
  metrics: Array<MetricsKeysEnum>;
  operators: Array<AmazonRuleOperatorEnum>;
  metricsWithValueTypes: Array<IMetricsWithValueTypes>;
  actions: Array<RuleActionTypeEnum>;
  adjustmentActions?: IAdjustmentConstraints;
}

export interface IRuleConstraintsDropdownOptions {
  metricsOptions: Array<IDropdownItem<MetricsKeysEnum>>;
  operatorsOptions: Array<IDropdownItem<AmazonRuleOperatorEnum>>;
  valueOptions: Array<IDropdownItem<MetricValueConstraintType>>;
  actionOptions: Array<IDropdownItem<RuleActionTypeEnum>>;
  adjustmentTargetOptions: Array<IDropdownItem<RuleAdjustmentTargetType>>;
}

export type TRuleValueType =
  | RuleValueTypeEnum.ABSOLUTE
  | RuleValueTypeEnum.CALCULATED
  | RuleValueTypeEnum.DERIVED;

export type TAuditResponse = Record<
  string,
  { errors: string[]; warnings: string[] }
> | null;

export interface INewAuditResponse {
  audit: TAuditResponse;
}

export interface IRuleEntityLink {
  id: string;
  ruleId: string;
  entityType: RuleEntityTypeIdEnum;
  entityId: string;
}

export interface IConflictDetectionResult {
  isConflict: boolean;
  conflicts: IEntityConflict[];
}

export interface IConflictResponse {
  conflict: IConflictDetectionResult;
}

export interface IEntityConflict {
  entityId: string;
  entityType: RuleEntityTypeIdEnum;
  conflictingRules: IConflictingRule[];
}

export interface IConflictingRule {
  ruleId: string;
  ruleName: string;
  ruleType: RuleTypeEnum;
}

export interface IAuditWarning {
  criteriaId: string;
  criteriaTitle: string;
  condition: string;
  action?: string;
  warningMessage?: string;
}

export interface IRulesValidation {
  maxBid?: string;
  minBid?: string;
  troas?: string;
  ruleName?: string;
  criteriaName?: { [criteriaId: string]: string };
  criteriaActionValue?: { [criteriaId: string]: string };
  conditionAbsoluteValue?: { [conditionId: string]: string };
  adjustmentActionValue?: { [adjustmentId: string]: string };
}

export interface IAppliedRuleResponse {
  ruleId: string;
  ruleName: string;
  ruleType: RuleTypeEnum;
  entityType: RuleEntityTypeIdEnum;
  entitiesCount: string | number;
  frequency: FrequencyTypesEnum;
  time: string;
  timezone: string;
  runFrom: string | null;
  runTo: string | null;
  lastRun: string | null;
  status: RuleStatusEnum;
  isDraft: boolean;
  createdAt: string | null;
  nextTriggerAt: string | null;
}

export interface IRulesEntitiesResponse extends ILinkableEntitiesResponse {
  ruleId: string;
  ruleName: string;
}

export interface IDeleteByEntityIdPayload {
  entityIds: string[];
}

export interface IAppliedRulesSingleUpdateBody {
  ruleId: string;
  status: RuleStatusEnum;
}

export interface IAppliedRulesUpdatePayload {
  updates: Array<IAppliedRulesSingleUpdateBody>;
}

export interface IAppliedRulesUpdateResponse {
  ruleId: string;
  status: RuleStatusEnum;
  ruleName: string;
}
export interface IBudgetMetricDisplay {
  inputType: MetricInputTypeEnum;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  dropdownOptions?: IDropdownItem<string>[];
  forceAbsolute?: boolean;
  allowedOperators?: AmazonRuleOperatorEnum[];
}
