import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import { NAME_STRING_SPECIAL_CHARACTER_REGEX } from '@/constants/regex.constants';
import {
  ACTION_TYPE_NO_VALUE,
  ACTION_TYPE_PERCENTAGE,
  ACTION_TYPE_TITLE_MAPPING,
  ADJUSTMENT_TARGET_TITLE_MAPPING,
  BUDGET_METRIC_DISPLAY,
  CONDITION_OPERATOR_MAPPING,
  CONDITION_OPERATOR_TITLE_MAPPING,
  METRICS_ABBR_MAPPING,
  METRICS_TITLE_MAPPING,
  RULE_ENTITY_TYPE_MAP,
  RULES_WEEKDAY_MAPPING,
} from '@/constants/rules/rules.constants';
import {
  MetricsKeysEnum,
  PageTypeActualEnum,
  PlacementBids,
} from '@/enums/advertising.enums';
import {
  DayOfMonthEnum,
  DayOfWeekEnum,
  HoursEnum,
  MinutesEnum,
} from '@/enums/datetime.enums';
import { FilterDropdownValue, Filters } from '@/enums/filter.enums';
import { MetricInputTypeEnum } from '@/enums/index.enums';
import {
  AmazonRuleOperatorEnum,
  RuleActionTypeEnum,
  RuleAdjustmentTargetType,
  RuleAdjustmentTypeEnum,
  RuleCreationLookbackEnum,
  RuleEntityTableEnum,
  RuleEntityTypeIdEnum,
  RuleExecutionModeEnum,
  RuleStatusEnum,
  RuleTypeEnum,
  RuleValueTypeEnum,
} from '@/enums/rules.enum';
import {
  Frequency,
  FrequencyTypesEnum,
  MarketplaceEnum,
  MetricsTimeWindowUnitEnum,
  Range,
} from '@/enums/serp.enums';
import {
  IAdjustmentConstraints,
  IAdvancedSettings,
  IAppliedRuleResponse,
  IAuditWarning,
  IConflictResponse,
  ILinkableEntity,
  IRuleAction,
  IRuleActionParams,
  IRuleAdjustment,
  IRuleBasicDetails,
  IRuleCondition,
  IRuleConstraints,
  IRuleConstraintsDropdownOptions,
  IRuleCriteriaDetails,
  IRuleEntityLinksDetails,
  IRulesTemplateDetails,
  IRulesValidation,
  IRuleTypesFormattedResponse,
  TAuditResponse,
  TRuleValueType,
} from '@/interfaces/rules/rules.interfaces';
import { IFinalFilters } from '@/redux/slices/filters/filter.slice';
import { getCurrencySymbolByCountry } from '@/utils';
import {
  checkIsValidObject,
  formatDate,
  generateRandomID,
  getArrayOfEnums,
  getOnlyNonNegativeNumber,
  getSingleSelectionDropdownOptionsFromMapping,
  getTimeZoneByCountry,
} from '.';
import {
  checkIsEqual,
  checkIsNull,
  checkIsObjectEmpty,
  getAccountPayloadDetails,
} from './advertising.utils';
import { getTimezoneShort } from './datetime.utils';
import localStorageUtils from './local-storage/local-storage.utils';
import { numberFieldBasicValidation } from './validations.utils';

export const getBasicInfoInitialFilters = (
  fetchedDetails: IRuleBasicDetails | null,
  ruleType: RuleTypeEnum | null
): IRuleBasicDetails => {
  const id = fetchedDetails?.id || `${generateRandomID()}`;
  const marketplace = localStorageUtils.getLastSelectedMarketplace();
  const selectedMetaType = getAccountPayloadDetails().metaType;
  const accountId = getAccountPayloadDetails().accountId;
  const metaId = getAccountPayloadDetails().metaId;
  const initialAdvancedSettings: IAdvancedSettings | null =
    ruleType === RuleTypeEnum.BIDDER_RULE
      ? {
          minBid: NaN,
          maxBid: NaN,
          troas: NaN,
        }
      : null;
  const today = formatDate(Range.TODAY);

  if (!fetchedDetails)
    return {
      ruleName: '',
      status: RuleStatusEnum.ENABLED,
      metricsTimeWindow: {
        value: RuleCreationLookbackEnum.DAYS_7,
        unit: MetricsTimeWindowUnitEnum.DAYS,
      },
      executionSchedule: {
        frequency: Frequency.DAILY,
        time: `${HoursEnum.HOUR_0}:${MinutesEnum.MINUTE_0}`,
        daysOfWeek: [],
        daysOfMonth: [],
        startDate: today.startDate,
        endDate: today.endDate ?? '',
        timezone: getTimeZoneByCountry(),
      },
      ruleType: ruleType ?? RuleTypeEnum.INVENTORY_RULE,
      id,
      accountId: accountId ?? '',
      metaId: metaId ?? '',
      metaType: selectedMetaType,
      marketplace: marketplace as MarketplaceEnum,
      description: null,
      ruleExecutionMode: RuleExecutionModeEnum.APPLY_CHANGES,
      advancedSettings: initialAdvancedSettings,
    };

  return {
    ruleName: fetchedDetails.ruleName,
    status: fetchedDetails.status ?? RuleStatusEnum.ENABLED,
    metricsTimeWindow: {
      value:
        fetchedDetails.metricsTimeWindow?.value ??
        RuleCreationLookbackEnum.DAYS_7,
      unit:
        fetchedDetails.metricsTimeWindow?.unit ??
        MetricsTimeWindowUnitEnum.DAYS,
    },
    executionSchedule: {
      frequency: fetchedDetails.executionSchedule?.frequency ?? Frequency.DAILY,
      time:
        fetchedDetails.executionSchedule?.time ??
        `${HoursEnum.HOUR_0}:${MinutesEnum.MINUTE_0}`,
      daysOfWeek: fetchedDetails.executionSchedule?.daysOfWeek ?? [],
      daysOfMonth: fetchedDetails.executionSchedule?.daysOfMonth ?? [],
      startDate: fetchedDetails.executionSchedule?.startDate ?? today.startDate,
      endDate: fetchedDetails.executionSchedule?.endDate ?? today.endDate ?? '',
      timezone:
        fetchedDetails.executionSchedule?.timezone ?? getTimeZoneByCountry(),
    },
    ruleType:
      fetchedDetails.ruleType ?? ruleType ?? RuleTypeEnum.INVENTORY_RULE,
    id: fetchedDetails.id ?? id,
    accountId: fetchedDetails.accountId ?? accountId ?? '',
    metaId: fetchedDetails.metaId ?? metaId ?? '',
    metaType: fetchedDetails.metaType ?? selectedMetaType,
    marketplace: fetchedDetails.marketplace ?? (marketplace as MarketplaceEnum),
    description: fetchedDetails.description ?? null,
    ruleExecutionMode: RuleExecutionModeEnum.APPLY_CHANGES,
    advancedSettings:
      fetchedDetails.advancedSettings ?? initialAdvancedSettings,
  };
};

export const checkAnyCriteriaExists = (
  templateDetails: IRulesTemplateDetails
): boolean => {
  return (
    Object.keys(templateDetails).length > 0 &&
    templateDetails.criteriaSets &&
    templateDetails.criteriaSets.length > 0
  );
};

export const getConditionAbsoluteValue = (
  value: number | undefined | null,
  valueType: TRuleValueType
): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (valueType === RuleValueTypeEnum.ABSOLUTE) return 0;
  else return 1;
};

export const getCriteriaSetsMap = (
  templateDetails: IRulesTemplateDetails | null,
  marketplace: MarketplaceEnum = MarketplaceEnum.AMAZON
): Map<string, IRuleCriteriaDetails> | null => {
  if (templateDetails !== null && checkAnyCriteriaExists(templateDetails)) {
    const criteriaSetsMap = new Map<string, IRuleCriteriaDetails>();
    const ruleType = templateDetails.rule.ruleType;
    const resolvedMarketplace = templateDetails.rule.marketplace ?? marketplace;

    templateDetails.criteriaSets.forEach((criteria, idx) => {
      const formattedConditions = criteria.conditions.map((item) => {
        return {
          ...item,
          id: item.id || `${generateRandomID()}`,
          value: {
            ...item.value,
            absoluteValue: getConditionAbsoluteValue(
              item.value.absoluteValue,
              item.value.valueType
            ),
          },
        };
      });

      const isAdjustmentAction =
        criteria.action.actionType ===
          RuleActionTypeEnum.PLACEMENT_ADJUSTMENT ||
        criteria.action.actionType === RuleActionTypeEnum.PLATFORM_ADJUSTMENT ||
        ruleType === RuleTypeEnum.PLACEMENT_RULE ||
        ruleType === RuleTypeEnum.PLATFORM_RULE ||
        ruleType === RuleTypeEnum.PAGE_TYPE_RULE;

      const formattedActions: IRuleAction = isAdjustmentAction
        ? {
            ...criteria.action,
            actionType:
              ruleType === RuleTypeEnum.PLACEMENT_RULE ||
              ruleType === RuleTypeEnum.PAGE_TYPE_RULE
                ? RuleActionTypeEnum.PLACEMENT_ADJUSTMENT
                : ruleType === RuleTypeEnum.PLATFORM_RULE
                ? RuleActionTypeEnum.PLATFORM_ADJUSTMENT
                : criteria.action.actionType,
            adjustments:
              criteria.action.adjustments &&
              criteria.action.adjustments.length > 0
                ? criteria.action.adjustments.map((adjustment) => ({
                    ...adjustment,
                    id: adjustment.id || `${generateRandomID()}`,
                  }))
                : [getDefaultAdjustmentAction(ruleType, resolvedMarketplace)],
          }
        : criteria.action;

      const id = criteria.id || `${generateRandomID()}`;
      criteriaSetsMap.set(id, {
        ...criteria,
        id,
        criteriaOrder: criteria.criteriaOrder ?? idx + 1,
        conditions: [...formattedConditions],
        action: formattedActions,
      });
    });

    return criteriaSetsMap;
  } else {
    return null;
  }
};

export const getPriorityOptions = (
  criteriaSets: Array<IRuleCriteriaDetails>
): Array<IDropdownItem<number>> => {
  if (criteriaSets && criteriaSets.length) {
    const priorityOptions: Array<IDropdownItem<number>> = [];

    for (let i = 1; i <= criteriaSets.length; i++) {
      priorityOptions.push({
        value: i,
        label: `${i}`,
      });
    }

    return priorityOptions;
  } else return [];
};

export const getReOrderedCriteriaSetsWithDelete = (
  map: Map<string, IRuleCriteriaDetails>,
  deletedId: string
): Map<string, IRuleCriteriaDetails> => {
  const deletedCriteria = map.get(deletedId);
  if (!deletedCriteria) return map;

  const deletedOrder = deletedCriteria.criteriaOrder ?? 0;
  const next = new Map<string, IRuleCriteriaDetails>();

  for (const [id, item] of map) {
    if (id === deletedId) continue;

    next.set(id, {
      ...item,
      criteriaOrder:
        (item.criteriaOrder ?? 0) > deletedOrder
          ? getOnlyNonNegativeNumber((item.criteriaOrder ?? 0) - 1)
          : item.criteriaOrder ?? 0,
    });
  }

  return next;
};

export const getReOrderedCriteriaSetsWithDuplicate = (
  map: Map<string, IRuleCriteriaDetails>,
  originalId: string
): Map<string, IRuleCriteriaDetails> => {
  const original = map.get(originalId);
  if (!original) return map;

  const originalOrder = original.criteriaOrder ?? 0;
  const duplicateOrder = originalOrder + 1;
  const duplicateId = `${generateRandomID()}`;
  const next = new Map<string, IRuleCriteriaDetails>();

  for (const [id, item] of map) {
    if (id === originalId) {
      next.set(id, item);

      next.set(duplicateId, {
        ...original,
        id: duplicateId,
        criteriaOrder: duplicateOrder,
      });
      continue;
    }

    if ((item.criteriaOrder ?? 0) > originalOrder) {
      next.set(id, {
        ...item,
        criteriaOrder: (item.criteriaOrder ?? 0) + 1,
      });
    } else {
      next.set(id, item);
    }
  }

  next.set(duplicateId, {
    ...original,
    id: duplicateId,
    criteriaOrder: duplicateOrder,
  });

  return next;
};

export const updateCriteriaOrder = (
  map: Map<string, IRuleCriteriaDetails>,
  selectedCriteriaId: string,
  selectedCriteriaNewOrder: number
): Map<string, IRuleCriteriaDetails> => {
  const selected = map.get(selectedCriteriaId);
  if (!selected) return map;

  const selectedCurrOrder = selected.criteriaOrder ?? 0;
  let conflictingId: string | null = null;

  for (const [id, item] of map) {
    if (
      id !== selectedCriteriaId &&
      (item.criteriaOrder ?? 0) === selectedCriteriaNewOrder
    ) {
      conflictingId = id;
      break;
    }
  }

  const next = new Map<string, IRuleCriteriaDetails>();

  for (const [id, item] of map) {
    if (id === selectedCriteriaId) {
      next.set(id, {
        ...item,
        criteriaOrder: selectedCriteriaNewOrder,
      });
      continue;
    }

    if (id === conflictingId) {
      next.set(id, {
        ...item,
        criteriaOrder: selectedCurrOrder,
      });
      continue;
    }

    next.set(id, item);
  }

  return next;
};

export const getUnitPosition = (unit?: string): 'start' | 'end' =>
  unit && unit === getCurrencySymbolByCountry() ? 'start' : 'end';

export const getCompressedConditionText = (
  conditions: Array<IRuleCondition>
): string => {
  if (!conditions || !conditions.length) {
    return '';
  }

  const compressedConditions = conditions.reduce((acc, condition, idx) => {
    const metric = condition.metric;
    const operator = condition.operator;
    const valueType = condition.value.valueType;
    const absoluteValue = condition.value.absoluteValue;
    const metricForCalculation =
      condition.value.calculatedMetric ?? condition.value.derivedMetric;

    const separator = idx === conditions.length - 1 ? '' : ' | ';

    const metricText =
      METRICS_ABBR_MAPPING[metric] ?? METRICS_TITLE_MAPPING[metric] ?? metric;
    const operatorText = CONDITION_OPERATOR_MAPPING[operator] ?? operator;

    const metricDisplayConfig = BUDGET_METRIC_DISPLAY[metric];
    const unit =
      metricDisplayConfig?.unit &&
      metricDisplayConfig.inputType === MetricInputTypeEnum.NUMBER
        ? metricDisplayConfig.unit
        : '';

    let conditionString;
    if (valueType === RuleValueTypeEnum.ABSOLUTE) {
      const unitPrefix =
        getUnitPosition(metricDisplayConfig?.unit) === 'start' ? unit : '';
      const unitSuffix =
        getUnitPosition(metricDisplayConfig?.unit) === 'end' ? unit : '';
      conditionString = `${metricText} ${operatorText} ${unitPrefix}${absoluteValue}${unitSuffix}${separator}`;
      acc += conditionString;
    } else {
      const metricForCalcText =
        METRICS_ABBR_MAPPING[metricForCalculation ?? metric] ??
        METRICS_TITLE_MAPPING[metricForCalculation ?? metric] ??
        metricForCalculation;

      conditionString = `${metricText} ${operatorText} ${metricForCalcText}*${absoluteValue}${separator}`;
      acc += conditionString;
    }

    return acc;
  }, '');

  return compressedConditions.trim();
};

export const getActionValueSign = (actionType: RuleActionTypeEnum) => {
  return ACTION_TYPE_PERCENTAGE.includes(actionType) ? '%' : '';
};

export const getRuleActionValue = (action: IRuleAction): number | undefined => {
  return (
    action.params?.bidValue ??
    action.params?.bidPercentage ??
    action.params?.minBid ??
    action.params?.maxBid
  );
};

export const getCompressedCriteriaAction = (action: IRuleAction): string => {
  if (!action) return '';

  if (action.adjustments) {
    return action.adjustments
      .map((item) => {
        const actionTypeText =
          ACTION_TYPE_TITLE_MAPPING[item.valueType] ?? item.valueType;
        const sign = getActionValueSign(item.valueType);

        return `${item.target}: ${actionTypeText} ${
          item.value ?? ''
        } ${sign}`.trim();
      })
      .join(' | ');
  }

  const actionType = action.actionType;
  const actionValue = getRuleActionValue(action);

  const sign = getActionValueSign(actionType);

  const actionTypeText = ACTION_TYPE_TITLE_MAPPING[actionType] ?? actionType;

  return `${actionTypeText} ${actionValue ?? ''} ${sign}`.trim();
};

export const getDefaultConstraints = (
  ruleType: RuleTypeEnum | null,
  marketplace: MarketplaceEnum = MarketplaceEnum.AMAZON
): IRuleConstraints => {
  const adjustmentActions: IAdjustmentConstraints = {
    targets:
      ruleType === RuleTypeEnum.PLATFORM_RULE
        ? [
            FilterDropdownValue.DESKTOP,
            FilterDropdownValue.MOBILE,
            FilterDropdownValue.APP,
          ]
        : ruleType === RuleTypeEnum.PAGE_TYPE_RULE ||
          (ruleType === RuleTypeEnum.PLACEMENT_RULE &&
            marketplace === MarketplaceEnum.WALMART)
        ? [
            PageTypeActualEnum.ITEM,
            PageTypeActualEnum.SEARCH,
            PageTypeActualEnum.HOMEPAGE,
            PageTypeActualEnum.STOCK_UP,
          ]
        : ruleType === RuleTypeEnum.PLACEMENT_RULE
        ? getArrayOfEnums(PlacementBids)
        : [],
    adjustmentType:
      ruleType === RuleTypeEnum.PLATFORM_RULE
        ? RuleAdjustmentTypeEnum.PLATFORM
        : RuleAdjustmentTypeEnum.PLACEMENT,
    actions: getArrayOfEnums(RuleActionTypeEnum),
  };

  return {
    metrics: getArrayOfEnums(MetricsKeysEnum),
    operators: getArrayOfEnums(AmazonRuleOperatorEnum),
    metricsWithValueTypes: [
      {
        metric: RuleValueTypeEnum.ABSOLUTE,
        valueType: RuleValueTypeEnum.ABSOLUTE,
      },
    ],
    actions: getArrayOfEnums(RuleActionTypeEnum),
    ...(ruleType === RuleTypeEnum.PLATFORM_RULE ||
    ruleType === RuleTypeEnum.PLACEMENT_RULE ||
    ruleType === RuleTypeEnum.PAGE_TYPE_RULE
      ? { adjustmentActions: adjustmentActions }
      : {}),
  };
};

export const getDefaultConstraintsOptions = (
  ruleType: RuleTypeEnum | null,
  marketplace: MarketplaceEnum = MarketplaceEnum.AMAZON
): IRuleConstraintsDropdownOptions => {
  const defaultConstraints = getDefaultConstraints(ruleType, marketplace);

  const metricsOptions = getSingleSelectionDropdownOptionsFromMapping(
    defaultConstraints.metrics,
    METRICS_TITLE_MAPPING
  ) as IDropdownItem<MetricsKeysEnum>[];
  const operatorsOptions = getSingleSelectionDropdownOptionsFromMapping(
    defaultConstraints.operators,
    CONDITION_OPERATOR_TITLE_MAPPING
  ) as IDropdownItem<AmazonRuleOperatorEnum>[];
  const valueOptions = getSingleSelectionDropdownOptionsFromMapping(
    defaultConstraints.metricsWithValueTypes.map((item) => item.metric),
    METRICS_TITLE_MAPPING,
    [RuleValueTypeEnum.ABSOLUTE]
  ) as IDropdownItem<MetricsKeysEnum | RuleValueTypeEnum>[];
  const actionOptions = getSingleSelectionDropdownOptionsFromMapping(
    defaultConstraints.actions,
    ACTION_TYPE_TITLE_MAPPING
  ) as IDropdownItem<RuleActionTypeEnum>[];
  const adjustmentTargetOptions = getSingleSelectionDropdownOptionsFromMapping(
    defaultConstraints.adjustmentActions?.targets ?? [],
    ADJUSTMENT_TARGET_TITLE_MAPPING
  );

  return {
    metricsOptions,
    operatorsOptions,
    valueOptions,
    actionOptions,
    adjustmentTargetOptions,
  };
};

export const getTableTitleByRuleEntity = (
  ruleEntityType: RuleEntityTypeIdEnum | undefined
) => {
  switch (ruleEntityType) {
    case RuleEntityTypeIdEnum.CAMPAIGN_ID:
    case RuleEntityTypeIdEnum.PLACEMENT_CAMPAIGN_ID:
    case RuleEntityTypeIdEnum.PLATFORM_CAMPAIGN_ID:
      return RuleEntityTableEnum.CAMPAIGN;
    case RuleEntityTypeIdEnum.ADGROUP_ID:
      return RuleEntityTableEnum.AD_GROUP;
    case RuleEntityTypeIdEnum.KEYWORD_ID:
      return RuleEntityTableEnum.KEYWORD;
    case RuleEntityTypeIdEnum.ASIN:
    case RuleEntityTypeIdEnum.TARGET_ID:
    case RuleEntityTypeIdEnum.AD_ITEM_ID:
    case RuleEntityTypeIdEnum.ITEM_ID:
      return RuleEntityTableEnum.PRODUCT;
    case RuleEntityTypeIdEnum.SOURCE_TARGET_MAPPING_ID:
      return 'Source-Target Mappings';
    default:
      return RuleEntityTableEnum.CAMPAIGN;
  }
};

export const getCriteriaSetPayload = (
  criteriaSetMap: Map<string, IRuleCriteriaDetails> | null
): Array<IRuleCriteriaDetails> => {
  if (!criteriaSetMap) return [];

  const values = Array.from(criteriaSetMap.values()).map((criteria) => ({
    ...criteria,
    criteriaName: criteria.criteriaName.trim(),
  }));

  return values;
};

export const getRuleDetailsPayload = (
  criteriaSetMap: Map<string, IRuleCriteriaDetails> | null,
  basicInfoFilters: IRuleBasicDetails,
  entityLinks: Array<IRuleEntityLinksDetails>,
  overrideConflicts: boolean,
  isDraft: boolean
): IRulesTemplateDetails => {
  const criteriaSets = getCriteriaSetPayload(criteriaSetMap);
  const { executionSchedule, ...formattedBasicInfoFilters } = basicInfoFilters;

  let newExecutionSchedule: typeof executionSchedule = null;

  if (executionSchedule && Object.keys(executionSchedule).length > 0) {
    newExecutionSchedule = {
      ...executionSchedule,
      daysOfWeek:
        executionSchedule.frequency === Frequency.WEEKLY
          ? executionSchedule.daysOfWeek
          : undefined,
      daysOfMonth:
        executionSchedule?.frequency === Frequency.MONTHLY
          ? executionSchedule.daysOfMonth
          : undefined,
    };
  }

  if (newExecutionSchedule && Object.keys(newExecutionSchedule).length > 0) {
    const nonNullExecutionSchedule = { ...newExecutionSchedule };
    Object.keys(nonNullExecutionSchedule).forEach((key) => {
      if (
        nonNullExecutionSchedule[
          key as keyof typeof nonNullExecutionSchedule
        ] === undefined
      ) {
        delete nonNullExecutionSchedule[
          key as keyof typeof nonNullExecutionSchedule
        ];
      }
    });

    newExecutionSchedule = { ...nonNullExecutionSchedule };
  }

  return {
    rule: {
      ...formattedBasicInfoFilters,
      ruleName: formattedBasicInfoFilters.ruleName.trim(),
      executionSchedule: newExecutionSchedule,
      isDraft,
    },
    criteriaSets: criteriaSets,
    entityLinks,
    overrideConflicts,
  };
};

export const getNewCondition = (
  constraints: IRuleConstraints | null,
  ruleType: RuleTypeEnum | null
): IRuleCondition => {
  const defaultConstraints = getDefaultConstraints(ruleType);

  if (!constraints) {
    return {
      id: `${generateRandomID()}`,
      metric: defaultConstraints.metrics[0],
      operator: defaultConstraints.operators[0],
      value: {
        valueType: RuleValueTypeEnum.ABSOLUTE,
        absoluteValue: 1,
      },
    };
  }

  return {
    id: `${generateRandomID()}`,
    metric: constraints.metrics[0] ?? defaultConstraints.metrics[0],
    operator: constraints.operators[0] ?? defaultConstraints.operators[0],
    value: {
      valueType: RuleValueTypeEnum.ABSOLUTE,
      absoluteValue: 1,
    },
  };
};

export const getNewAdjustment = (
  nextAvailableTarget: RuleAdjustmentTargetType | undefined,
  constraints: IRuleConstraints | null,
  ruleType: RuleTypeEnum | null,
  marketplace: MarketplaceEnum = MarketplaceEnum.AMAZON
): IRuleAdjustment | null => {
  const defaultConstraints = getDefaultConstraints(ruleType, marketplace);

  if (defaultConstraints.adjustmentActions && nextAvailableTarget) {
    if (!constraints || !constraints.adjustmentActions) {
      return {
        id: `${generateRandomID()}`,
        target:
          nextAvailableTarget ||
          defaultConstraints.adjustmentActions?.targets[0],
        valueType:
          defaultConstraints.adjustmentActions?.actions[0] ||
          defaultConstraints.actions[0],
        value:
          getCriteriaDefaultValues(
            defaultConstraints.adjustmentActions?.actions[0] ||
              defaultConstraints.actions[0]
          ) ?? 0,
      };
    }

    return {
      id: `${generateRandomID()}`,
      target:
        nextAvailableTarget ||
        constraints.adjustmentActions?.targets[0] ||
        defaultConstraints.adjustmentActions?.targets[0],
      valueType:
        constraints.adjustmentActions?.actions[0] ||
        defaultConstraints.adjustmentActions?.actions[0] ||
        defaultConstraints.actions[0],
      value:
        getCriteriaDefaultValues(
          constraints.adjustmentActions?.actions[0] ||
            defaultConstraints.adjustmentActions?.actions[0] ||
            defaultConstraints.actions[0]
        ) ?? 0,
    };
  }

  return null;
};

const getDefaultRuleActionTypeEnum = (
  ruleType: RuleTypeEnum | undefined | null
) => {
  return ruleType === RuleTypeEnum.KEYWORD_HARVESTING_RULE
    ? RuleActionTypeEnum.KEYWORD_HARVESTING
    : ruleType === RuleTypeEnum.PLATFORM_RULE
    ? RuleActionTypeEnum.PLATFORM_ADJUSTMENT
    : ruleType === RuleTypeEnum.PLACEMENT_RULE ||
      ruleType === RuleTypeEnum.PAGE_TYPE_RULE
    ? RuleActionTypeEnum.PLACEMENT_ADJUSTMENT
    : RuleActionTypeEnum.PAUSE;
};

export const getDefaultAdjustmentAction = (
  ruleType: RuleTypeEnum | null,
  marketplace: MarketplaceEnum = MarketplaceEnum.AMAZON
): IRuleAdjustment => {
  return {
    id: `${generateRandomID()}`,
    target:
      ruleType === RuleTypeEnum.PLATFORM_RULE
        ? FilterDropdownValue.DESKTOP
        : ruleType === RuleTypeEnum.PAGE_TYPE_RULE ||
          (ruleType === RuleTypeEnum.PLACEMENT_RULE &&
            marketplace === MarketplaceEnum.WALMART)
        ? PageTypeActualEnum.ITEM
        : PlacementBids.TOP_OF_SEARCH,
    valueType: RuleActionTypeEnum.INCREASE_BY_VALUE,
    value: 0,
  };
};

export const getNewCriteria = (
  map: Map<string, IRuleCriteriaDetails> | null,
  newCriteriaSet: Array<IRuleCriteriaDetails> = [],
  ruleType: RuleTypeEnum | null,
  marketplace: MarketplaceEnum = MarketplaceEnum.AMAZON
): Map<string, IRuleCriteriaDetails> => {
  const next = new Map<string, IRuleCriteriaDetails>();

  if (newCriteriaSet.length > 0) {
    for (const criteria of newCriteriaSet) {
      const newId = `${generateRandomID()}`;
      next.set(newId, {
        ...criteria,
        id: newId,
      });
    }
    return next;
  }

  let maxOrder = 0;
  if (map) {
    for (const criteria of map.values()) {
      next.set(criteria.id, criteria);
      maxOrder = Math.max(maxOrder, criteria.criteriaOrder ?? 0);
    }
  }

  const newOrder = maxOrder + 1;
  const criteriaId = generateRandomID();

  const adjustments: IRuleAdjustment[] =
    ruleType === RuleTypeEnum.PLACEMENT_RULE ||
    ruleType === RuleTypeEnum.PLATFORM_RULE ||
    ruleType === RuleTypeEnum.PAGE_TYPE_RULE
      ? [getDefaultAdjustmentAction(ruleType, marketplace)]
      : [];

  const newCriteria: IRuleCriteriaDetails = {
    id: criteriaId,
    criteriaName: `Criteria ${newOrder}`,
    criteriaOrder: newOrder,
    conditions: [getNewCondition(null, ruleType)],
    action: {
      actionType: getDefaultRuleActionTypeEnum(ruleType),
      ...(adjustments.length > 0 ? { adjustments: adjustments } : {}),
    },
  };

  next.set(criteriaId, newCriteria);

  return next;
};

export const normalizeCriteria = (criteria: IRuleCriteriaDetails) => {
  const { id, ruleId, criteriaOrder, ...rest } = criteria;
  return rest;
};

export const areCriteriaEqual = (
  criteriaA: IRuleCriteriaDetails,
  criteriaB: IRuleCriteriaDetails
): boolean => {
  const normalizedA = normalizeCriteria(criteriaA);
  const normalizedB = normalizeCriteria(criteriaB);

  return checkIsEqual(normalizedA, normalizedB);
};

export const areCriteriaSetsEqual = (
  criteriaSetMap: Map<string, IRuleCriteriaDetails> | null,
  duplicateCriteriaSetMap: Map<string, IRuleCriteriaDetails> | null
): boolean => {
  if (criteriaSetMap === null && duplicateCriteriaSetMap === null) {
    return true;
  }

  if (!criteriaSetMap || !duplicateCriteriaSetMap) {
    return false;
  }

  if (criteriaSetMap.size !== duplicateCriteriaSetMap.size) {
    return false;
  }

  for (const [key, criteriaA] of criteriaSetMap) {
    const criteriaB = duplicateCriteriaSetMap.get(key);
    if (!criteriaB) return false;

    if (!areCriteriaEqual(criteriaA, criteriaB)) {
      return false;
    }
  }

  return true;
};

export const findDuplicateCriteriaIds = (
  criteriaMap: Map<string, IRuleCriteriaDetails> | null
): string[] => {
  if (!criteriaMap || criteriaMap.size < 2) return [];

  const entries = Array.from(criteriaMap.entries());
  const visited = new Set<string>();
  const duplicateIds = new Set<string>();

  for (let i = 0; i < entries.length; i++) {
    const [idA, criteriaA] = entries[i];

    if (visited.has(idA)) continue;

    for (let j = i + 1; j < entries.length; j++) {
      const [idB, criteriaB] = entries[j];

      if (areCriteriaEqual(criteriaA, criteriaB)) {
        duplicateIds.add(idA);
        duplicateIds.add(idB);
        visited.add(idB);
      }
    }

    if (duplicateIds.has(idA)) {
      visited.add(idA);
    }
  }

  return Array.from(duplicateIds);
};

export const normalizeCondition = (condition: IRuleCondition) => {
  const { id, ...rest } = condition;
  return rest;
};

export const findDuplicateConditionIds = (
  conditions: Array<IRuleCondition>
) => {
  if (!conditions || conditions.length < 2) return [];

  const visited = new Set<string>();
  const duplicateIds = new Set<string>();

  for (let i = 0; i < conditions.length; i++) {
    const conditionA = conditions[i];

    if (visited.has(conditionA.id)) continue;

    for (let j = i + 1; j < conditions.length; j++) {
      const conditionB = conditions[j];
      const normalizedA = normalizeCondition(conditionA);
      const normalizedB = normalizeCondition(conditionB);

      if (checkIsEqual(normalizedA, normalizedB)) {
        duplicateIds.add(conditionA.id);
        duplicateIds.add(conditionB.id);
        visited.add(conditionB.id);
      }
    }

    if (duplicateIds.has(conditionA.id)) {
      visited.add(conditionA.id);
    }
  }

  return Array.from(duplicateIds);
};

export const getFormattedRuleEntityLinksDetails = (
  selectedEntities: ILinkableEntity[],
  selectedEntityType: RuleEntityTypeIdEnum | null,
  ruleId: string | undefined
): IRuleEntityLinksDetails[] => {
  const formattedEntities = selectedEntities.map((entity) => {
    return {
      ruleId: ruleId ?? '',
      entityType: selectedEntityType ?? RuleEntityTypeIdEnum.CAMPAIGN_ID,
      entityId: entity.entityId,
      adType: entity.adType ?? null,
    };
  });

  return formattedEntities;
};

export const hasConflictProp = (obj: unknown): obj is IConflictResponse => {
  return checkIsValidObject(obj) && 'conflict' in obj;
};

export const getEntityTypesForRule = (
  ruleType: RuleTypeEnum | undefined,
  marketplace = MarketplaceEnum.AMAZON
): RuleEntityTypeIdEnum[] => {
  if (!ruleType) return [RuleEntityTypeIdEnum.CAMPAIGN_ID];

  if (ruleType === RuleTypeEnum.INVENTORY_RULE && marketplace) {
    if (marketplace === MarketplaceEnum.WALMART) {
      return [RuleEntityTypeIdEnum.ITEM_ID];
    } else {
      return [RuleEntityTypeIdEnum.ASIN];
    }
  }

  const entityTypes = RULE_ENTITY_TYPE_MAP[ruleType];

  return entityTypes ?? [RuleEntityTypeIdEnum.CAMPAIGN_ID];
};

export const getFilteredEntitiesList = (
  selectedEntities: ILinkableEntity[],
  initialData: ILinkableEntity[]
): ILinkableEntity[] => {
  const selectedIds = new Set(selectedEntities.map((e) => e.entityId));
  return initialData.filter(
    (entity) => !entity.entityId || !selectedIds.has(entity.entityId)
  );
};

export const hasAuditIssues = (
  auditResult: unknown
): auditResult is TAuditResponse => {
  const typedAuditResult = auditResult as TAuditResponse;

  if (checkIsNull(typedAuditResult)) return false;
  if (isAuditResponse(typedAuditResult) === false) return false;

  for (const ruleName of Object.keys(typedAuditResult)) {
    const { errors, warnings } = typedAuditResult[ruleName];
    if (errors.length > 0 || warnings.length > 0) {
      return true;
    }
  }
  return false;
};

export const isAuditResponse = (value: unknown): value is TAuditResponse => {
  if (checkIsNull(value) || value === null || checkIsObjectEmpty(value))
    return false;

  return (
    checkIsValidObject(value) &&
    Object.values(value).every(
      (entry) =>
        typeof entry === 'object' &&
        entry !== null &&
        'errors' in entry &&
        Array.isArray(entry.errors) &&
        entry.errors.every((e: unknown) => typeof e === 'string') &&
        'warnings' in entry &&
        Array.isArray(entry.warnings) &&
        entry.warnings.every((w: unknown) => typeof w === 'string')
    )
  );
};

export const hasAuditProp = (obj: unknown): obj is { audit: any } => {
  return checkIsValidObject(obj) && 'audit' in obj;
};

export const formatAuditResponse = (auditData: TAuditResponse) => {
  if (checkIsNull(auditData)) return [];
  const allWarnings: IAuditWarning[] = [];

  Object.entries(auditData).forEach(([criteriaName, result]) => {
    if (!result) return;

    if (result.errors) {
      result.errors.forEach((error, idx) => {
        allWarnings.push({
          criteriaId: `error-${criteriaName}-${idx}`,
          criteriaTitle: criteriaName,
          condition: error,
        });
      });
    }

    if (result.warnings) {
      result.warnings.forEach((warning, idx) => {
        allWarnings.push({
          criteriaId: `warning-${criteriaName}-${idx}`,
          criteriaTitle: criteriaName,
          condition: warning,
        });
      });
    }
  });

  return allWarnings;
};

export const getEntityIDNameByEntityType = (
  entityType: RuleEntityTypeIdEnum,
  marketplace: MarketplaceEnum
) => {
  switch (entityType) {
    case RuleEntityTypeIdEnum.CAMPAIGN_ID:
      return 'Campaign ID';
    case RuleEntityTypeIdEnum.ADGROUP_ID:
      return 'Ad Group ID';
    case RuleEntityTypeIdEnum.ASIN:
      return 'ASIN';
    case RuleEntityTypeIdEnum.KEYWORD_ID:
      return 'Keyword ID';
    case RuleEntityTypeIdEnum.TARGET_ID:
      return 'Target ID';
    case RuleEntityTypeIdEnum.AD_ITEM_ID:
      return 'Ad Item ID';
    case RuleEntityTypeIdEnum.ITEM_ID:
      return marketplace === MarketplaceEnum.AMAZON ? 'ASIN' : 'Item ID';
    case RuleEntityTypeIdEnum.SOURCE_TARGET_MAPPING_ID:
      return 'Mapping ID';
    default:
      return 'ID';
  }
};

export const getEntityNameByEntityType = (
  entityType: RuleEntityTypeIdEnum,
  marketplace?: MarketplaceEnum
) => {
  switch (entityType) {
    case RuleEntityTypeIdEnum.ADGROUP_ID:
      return 'Ad Group';
    case RuleEntityTypeIdEnum.AD_ITEM_ID:
    case RuleEntityTypeIdEnum.ASIN:
    case RuleEntityTypeIdEnum.ITEM_ID:
      if (marketplace === MarketplaceEnum.WALMART) {
        return 'Item';
      } else {
        return 'Product';
      }

    case RuleEntityTypeIdEnum.CAMPAIGN_ID:
      return 'Campaign';
    case RuleEntityTypeIdEnum.KEYWORD_ID:
      return 'Keyword';
    case RuleEntityTypeIdEnum.TARGET_ID:
      return 'Target';
    case RuleEntityTypeIdEnum.SOURCE_TARGET_MAPPING_ID:
      return 'Source-Target Mapping';
    default:
      return 'Entity';
  }
};

export const getRuleFrequencyResult = (
  frequency: FrequencyTypesEnum | undefined,
  selectedTime: string | undefined,
  timezone: string | undefined,
  selectedWeekdays?: Array<DayOfWeekEnum>,
  selectedDates?: Array<DayOfMonthEnum>
): string => {
  if (!frequency || !selectedTime) return 'Selected Frequency';

  const timezoneShort = getTimezoneShort(timezone ?? '');

  if (frequency === Frequency.DAILY) {
    return `Everyday at ${selectedTime} ${timezoneShort}`;
  }

  if (frequency === Frequency.WEEKLY) {
    if (!selectedWeekdays || !selectedWeekdays.length)
      return `Selected weekdays at ${selectedTime} ${timezoneShort}`;

    let dayText = '';
    let sortedSelectedWeekdays: Array<DayOfWeekEnum> = [];
    if (selectedWeekdays.length === 1)
      sortedSelectedWeekdays = [...selectedWeekdays];
    else
      sortedSelectedWeekdays = [
        ...Array.from(selectedWeekdays).sort((a, b) => a - b),
      ];

    if (sortedSelectedWeekdays.length >= 7) {
      dayText = 'All week';
    } else {
      sortedSelectedWeekdays.forEach((day, idx) => {
        dayText += `${RULES_WEEKDAY_MAPPING[day]}${
          idx === selectedWeekdays.length - 1 ? '' : ', '
        }`;
      });
    }

    return `${dayText} at ${selectedTime} ${timezoneShort}`;
  }

  if (frequency === Frequency.MONTHLY) {
    if (!selectedDates || !selectedDates.length)
      return `Selected dates at ${selectedTime} ${timezoneShort}`;

    return `${selectedDates.length} day${
      selectedDates.length > 1 ? 's' : ''
    } a month at ${selectedTime} ${timezoneShort}`;
  }

  return 'Selected Frequency';
};

export const isValidationErrorFree = (
  ruleValidations: IRulesValidation | null
): boolean => {
  if (!ruleValidations) return true;

  return Object.values(ruleValidations).every((value) => {
    if (typeof value === 'string') return false;

    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).length === 0;
    }

    return true;
  });
};

export const checkFinalValidationErrors = (
  criteriaSetMap: Map<string, IRuleCriteriaDetails> | null,
  basicInfoFilters: IRuleBasicDetails
): IRulesValidation | null => {
  const validationErrors: IRulesValidation = {};

  /* ───────────────────────── RULE NAME ───────────────────────── */

  const ruleName = basicInfoFilters.ruleName;

  if (!ruleName || !ruleName.length) {
    validationErrors.ruleName = 'Rule Name is required.';
  } else if (ruleName.length < 2) {
    validationErrors.ruleName = 'Rule Name must have at least 2 characters.';
  } else if (ruleName.length > 255) {
    validationErrors.ruleName = 'Rule Name must be less than 255 characters.';
  } else if (!NAME_STRING_SPECIAL_CHARACTER_REGEX.test(ruleName)) {
    validationErrors.ruleName = `Only letters, numbers, single spaces, commas (,), ., -, _, &, :, (, ), /, %, #, ', + are allowed. Rule Name must start with a letter or a number.`;
  }

  /* ───────────────────────── BIDDER FIELDS ───────────────────────── */

  if (
    basicInfoFilters.ruleType === RuleTypeEnum.BIDDER_RULE &&
    basicInfoFilters.advancedSettings
  ) {
    const { minBid, maxBid, troas } = basicInfoFilters.advancedSettings;

    const minBidErr = numberFieldBasicValidation(minBid, 'Min Bid');
    const maxBidErr = numberFieldBasicValidation(maxBid, 'Max Bid');
    const troasErr = numberFieldBasicValidation(troas, 'TROAS');

    if (minBidErr) validationErrors.minBid = minBidErr;
    if (maxBidErr) validationErrors.maxBid = maxBidErr;
    if (troasErr) validationErrors.troas = troasErr;

    if (
      typeof minBid === 'number' &&
      typeof maxBid === 'number' &&
      Number.isFinite(minBid) &&
      Number.isFinite(maxBid) &&
      minBid >= maxBid
    ) {
      validationErrors.minBid = 'Min bid should be lower than Max bid';
      validationErrors.maxBid = 'Max bid should be higher than Min bid';
    }
  }

  /* ───────────────────────── CRITERIA VALIDATIONS ───────────────────────── */

  const criteriaSets = getCriteriaSetPayload(criteriaSetMap);

  if (criteriaSets?.length) {
    const criteriaNameErrors: Record<string, string> = {};
    const criteriaActionErrors: Record<string, string> = {};
    const conditionAbsErrors: Record<string, string> = {};
    const adjustmentActionErrors: Record<string, string> = {};

    criteriaSets.forEach((criteria) => {
      const { id: criteriaId, criteriaName, conditions, action } = criteria;

      /* ───── Criteria Name ───── */

      let criteriaNameError: string | undefined;

      if (!criteriaName || !criteriaName.length) {
        criteriaNameError = 'Criteria Name is required.';
      } else if (criteriaName.length < 2) {
        criteriaNameError = 'Criteria Name must have at least 2 characters.';
      } else if (criteriaName.length > 255) {
        criteriaNameError = 'Criteria Name must be less than 255 characters.';
      } else if (!NAME_STRING_SPECIAL_CHARACTER_REGEX.test(criteriaName)) {
        criteriaNameError = `Only letters, numbers, single spaces, commas (,), ., -, _, &, :, (, ), /, %, #, ', + are allowed. Criteria Name must start with a letter or a number.`;
      }

      if (criteriaNameError) {
        criteriaNameErrors[criteriaId] = criteriaNameError;
      }

      /* ───── Criteria Action Value ───── */
      if (!action.adjustments || !action.adjustments.length) {
        const actionValue = getRuleActionValue(action);
        const isActionValueRequired = !ACTION_TYPE_NO_VALUE.includes(
          action?.actionType
        );

        if (isActionValueRequired === true) {
          const actionErr = numberFieldBasicValidation(
            actionValue,
            'Action Value'
          );

          if (actionErr) {
            criteriaActionErrors[criteriaId] = actionErr;
          }
        }
      }

      /* ───── Condition Absolute Values ───── */
      conditions.forEach((condition) => {
        const absErr = numberFieldBasicValidation(
          condition.value.absoluteValue,
          'Value'
        );

        if (absErr) {
          conditionAbsErrors[condition.id] = absErr;
        }
      });

      /* ───── Adjustment Action Values ───── */
      if (action.adjustments && action.adjustments.length) {
        action.adjustments.forEach((adjustment) => {
          const actionErr = numberFieldBasicValidation(
            adjustment.value,
            'Action Value'
          );

          if (actionErr) {
            adjustmentActionErrors[adjustment.id] = actionErr;
          }
        });
      }
    });

    if (Object.keys(criteriaNameErrors).length > 0) {
      validationErrors.criteriaName = criteriaNameErrors;
    }

    if (Object.keys(criteriaActionErrors).length > 0) {
      validationErrors.criteriaActionValue = criteriaActionErrors;
    }

    if (Object.keys(conditionAbsErrors).length > 0) {
      validationErrors.conditionAbsoluteValue = conditionAbsErrors;
    }

    if (Object.keys(adjustmentActionErrors).length > 0) {
      validationErrors.adjustmentActionValue = adjustmentActionErrors;
    }
  }

  /* ───────────────────────── FINAL NORMALIZATION ───────────────────────── */

  return Object.keys(validationErrors).length > 0 ? validationErrors : null;
};

export const getAllValidationErrorsWithMeta = (
  validations: IRulesValidation | null
): { field: string; id?: string; message: string }[] => {
  if (!validations) return [];

  const errors: { field: string; id?: string; message: string }[] = [];

  Object.entries(validations).forEach(([field, value]) => {
    if (typeof value === 'string') {
      errors.push({ field, message: value });
    } else if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([id, msg]) => {
        if (typeof msg === 'string') {
          errors.push({ field, id, message: msg });
        }
      });
    }
  });

  return errors;
};

export const getUniqueLinkableEntities = (entities: ILinkableEntity[]) => {
  const entityMap = new Map<string, ILinkableEntity>();
  entities.forEach((entity) => {
    entityMap.set(entity.entityId, entity);
  });

  return Array.from(entityMap.values());
};

export const getFormattedAppliedFiltersForAppliedRules = (
  appliedFilters: IFinalFilters[]
): IFinalFilters[] => {
  if (!appliedFilters || !appliedFilters.length) return [];

  return appliedFilters.map((filter) => {
    if (filter.filterKey === Filters.STATUS) {
      if (filter.filterValue === FilterDropdownValue.ACTIVE) {
        return {
          ...filter,
          filterValue: FilterDropdownValue.ENABLED,
          filterDropdownValue: FilterDropdownValue.ENABLED,
          filterName: FilterDropdownValue.ENABLED,
        };
      }
    }
    return filter;
  });
};

export const getRuleTypesByMarketplace = (
  ruleTypeDetails: IRuleTypesFormattedResponse,
  marketplace = MarketplaceEnum.AMAZON
) => {
  return ruleTypeDetails.rules.filter((ruleType) => {
    if (marketplace === MarketplaceEnum.AMAZON)
      return ruleType.ruleType !== RuleTypeEnum.PLATFORM_RULE;
    return ruleType.ruleType !== RuleTypeEnum.BIDDING_STRATEGY_RULE;
  });
};

export const getCriteriaDefaultValues = (actionType: RuleActionTypeEnum) => {
  if (ACTION_TYPE_NO_VALUE.includes(actionType)) return undefined;
  return ACTION_TYPE_PERCENTAGE.includes(actionType) ? 1 : 0;
};

export const getActionParams = (
  actionType: RuleActionTypeEnum,
  value?: number
): IRuleActionParams | undefined => {
  if (ACTION_TYPE_NO_VALUE.includes(actionType)) return undefined;

  const nextValue = value ?? getCriteriaDefaultValues(actionType);

  if (ACTION_TYPE_PERCENTAGE.includes(actionType)) {
    return {
      bidPercentage: nextValue,
    };
  }

  return {
    bidValue: nextValue,
  };
};

export const checkRuleIsDraftedOrEnded = (
  selectedRowIds: (string | number)[],
  appliedRulesById: Record<string, IAppliedRuleResponse> | null
): boolean => {
  return selectedRowIds.some((ruleId) => {
    const rule = appliedRulesById?.[ruleId as string];

    return (
      rule?.status === RuleStatusEnum.DRAFT ||
      rule?.status === RuleStatusEnum.ENDED ||
      rule?.isDraft === true
    );
  });
};
