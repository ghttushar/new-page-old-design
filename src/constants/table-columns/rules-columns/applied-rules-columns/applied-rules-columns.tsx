import EditAccessRuleStatus from '@/app/components/page-components/edit-access-components/edit-access-status/edit-access-rule-status';
import AppliedRulesActionsWrapper from '@/app/components/page-components/rules-page-components/applied-rules-components/applied-rules-actions-wrapper/applied-rules-actions-wrapper';
import AppliedRulesCountPopup from '@/app/components/page-components/rules-page-components/applied-rules-components/applied-rules-count-component/applied-rules-count-popup';
import {
  RULE_TYPE_LABEL_MAPPING,
  RULES_FREQUENCY_TAB_OPTIONS,
  RULES_STATUS_MAPPING,
} from '@/constants/rules/rules.constants';
import { AppliedRulesColumnIds, RuleStatusEnum } from '@/enums/rules.enum';
import { IAppliedRuleResponse } from '@/interfaces/rules/rules.interfaces';
import { isIndefiniteDate } from '@/utils';
import {
  getFormattedTimezoneDateTimeNoTimestamp,
  getUSFormatDate,
} from '@/utils/datetime.utils';
import { ColumnDef } from '@tanstack/react-table';
import {
  textCenterStyles,
  textStartStyles,
} from '../../new-column-names.constants';
import styles from './applied-rules-columns.module.scss';

const RULE_NAME_COLUMN: ColumnDef<IAppliedRuleResponse> = {
  accessorKey: 'ruleName',
  id: AppliedRulesColumnIds.RULE_NAME,
  size: 280,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {AppliedRulesColumnIds.RULE_NAME}
      </div>
    );
  },
  cell: (props) => {
    const ruleName = props.row.original.ruleName;

    if (!ruleName) return <p className={`no-data-view`}>--</p>;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        {ruleName}
      </div>
    );
  },
};

const RULE_TYPE_COLUMN: ColumnDef<IAppliedRuleResponse> = {
  accessorKey: 'ruleType',
  id: AppliedRulesColumnIds.RULE_TYPE,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {AppliedRulesColumnIds.RULE_TYPE}
      </div>
    );
  },
  cell: (props) => {
    const ruleType = props.row.original.ruleType;

    if (!ruleType) return <p className={`no-data-view`}>--</p>;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        {RULE_TYPE_LABEL_MAPPING[ruleType] ?? ruleType}
      </div>
    );
  },
};

const RULE_ENTITY_COUNT_COLUMN: ColumnDef<IAppliedRuleResponse> = {
  accessorKey: 'entitiesCount',
  id: AppliedRulesColumnIds.ENTITIES_COUNT,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {AppliedRulesColumnIds.ENTITIES_COUNT}
      </div>
    );
  },
  cell: (props) => {
    const entitiesCount = props.row.original.entitiesCount;
    const entityType = props.row.original.entityType;
    const ruleId = props.row.original.ruleId;
    const ruleName = props.row.original.ruleName || '-';

    return (
      <div
        className={`commonCell ${styles.entityCountStyles}`}
        style={textStartStyles}
      >
        <AppliedRulesCountPopup
          entitiesCount={entitiesCount}
          entityType={entityType}
          ruleId={ruleId}
          ruleName={ruleName}
        />
      </div>
    );
  },
};

const RULE_FREQUENCY_COLUMN: ColumnDef<IAppliedRuleResponse> = {
  accessorKey: 'frequency',
  id: AppliedRulesColumnIds.FREQUENCY,
  size: 120,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {AppliedRulesColumnIds.FREQUENCY}
      </div>
    );
  },
  cell: (props) => {
    const frequency = props.row.original.frequency;

    if (!frequency) return <p className={`no-data-view`}>--</p>;

    const selectedFreqItem = RULES_FREQUENCY_TAB_OPTIONS.find(
      (freq) => freq.value === frequency
    );

    return (
      <div className={`commonCell`} style={textStartStyles}>
        {selectedFreqItem?.label ?? frequency}
      </div>
    );
  },
};

const RULE_LAST_RUN_COLUMN: ColumnDef<IAppliedRuleResponse> = {
  accessorKey: 'lastRun',
  id: AppliedRulesColumnIds.LAST_RUN,
  size: 180,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {AppliedRulesColumnIds.LAST_RUN}
      </div>
    );
  },
  cell: (props) => {
    const lastRun = props.row.original.lastRun;

    if (!lastRun) return <p className={`no-data-view`}>--</p>;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        {getFormattedTimezoneDateTimeNoTimestamp(lastRun)}
      </div>
    );
  },
};

const RULE_NEXT_TRIGGER_COLUMN: ColumnDef<IAppliedRuleResponse> = {
  accessorKey: 'nextTriggerAt',
  id: AppliedRulesColumnIds.NEXT_TRIGGER,
  size: 180,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {AppliedRulesColumnIds.NEXT_TRIGGER}
      </div>
    );
  },
  cell: (props) => {
    const nextTriggerAt = props.row.original.nextTriggerAt;

    if (!nextTriggerAt) return <p className={`no-data-view`}>--</p>;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        {getFormattedTimezoneDateTimeNoTimestamp(nextTriggerAt)}
      </div>
    );
  },
};

const RULE_DATE_CREATED_COLUMN: ColumnDef<IAppliedRuleResponse> = {
  accessorKey: 'createdAt',
  id: AppliedRulesColumnIds.DATE_CREATED,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {AppliedRulesColumnIds.DATE_CREATED}
      </div>
    );
  },
  cell: (props) => {
    const createdAt = props.row.original.createdAt;

    if (!createdAt) return <p className={`no-data-view`}>--</p>;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        {getUSFormatDate(createdAt)}
      </div>
    );
  },
};

const RULE_RUN_BETWEEN_COLUMN: ColumnDef<IAppliedRuleResponse> = {
  accessorKey: 'runFrom',
  id: AppliedRulesColumnIds.RUN_BETWEEN,
  size: 200,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {AppliedRulesColumnIds.RUN_BETWEEN}
      </div>
    );
  },
  cell: (props) => {
    const runFrom = props.row.original.runFrom;
    const runTo = props.row.original.runTo;

    if (!runFrom || !runTo) return <p className={`no-data-view`}>--</p>;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        {getUSFormatDate(runFrom)} -{' '}
        {isIndefiniteDate(runTo) ? 'No End Date' : getUSFormatDate(runTo)}
      </div>
    );
  },
};

const RULE_STATUS_TOGGLE_COLUMN: ColumnDef<IAppliedRuleResponse> = {
  accessorKey: 'status',
  id: AppliedRulesColumnIds.STATUS_TOGGLE,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        {AppliedRulesColumnIds.STATUS_TOGGLE}
      </div>
    );
  },
  cell: (props) => {
    const status = props.row.original.status;
    const isDraft = props.row.original.isDraft;
    const ruleId = props.row.original.ruleId;

    if (!status || status?.toUpperCase() === RuleStatusEnum.ARCHIVED)
      return <p className="no-data-view">--</p>;

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <EditAccessRuleStatus
          status={status}
          ruleId={ruleId}
          isDraft={isDraft}
        />
      </div>
    );
  },
};

const RULE_STATUS_COLUMN: ColumnDef<IAppliedRuleResponse> = {
  accessorKey: 'status',
  id: AppliedRulesColumnIds.RULE_STATUS,
  size: 150,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textStartStyles}>
        {AppliedRulesColumnIds.RULE_STATUS}
      </div>
    );
  },
  cell: (props) => {
    const status = props.row.original.status;

    if (!status) return <p className="no-data-view">--</p>;

    return (
      <div className={`commonCell`} style={textStartStyles}>
        {RULES_STATUS_MAPPING[(status?.toUpperCase() ?? '') as RuleStatusEnum]}
      </div>
    );
  },
};

const RULE_ACTIONS_COLUMN: ColumnDef<IAppliedRuleResponse> = {
  accessorKey: 'actions',
  id: 'Actions',
  size: 80,
  enableSorting: false,
  header: (props) => {
    return (
      <div className={`commonHeader`} style={textCenterStyles}>
        Actions
      </div>
    );
  },
  cell: (props) => {
    const ruleId = props.row.original.ruleId;
    const ruleName = props.row.original.ruleName || '-';

    return (
      <div className={`commonCell`} style={textCenterStyles}>
        <AppliedRulesActionsWrapper ruleId={ruleId} ruleName={ruleName} />
      </div>
    );
  },
};

export const appliedRulesColumns: Array<ColumnDef<IAppliedRuleResponse>> = [
  RULE_STATUS_TOGGLE_COLUMN,
  RULE_STATUS_COLUMN,
  RULE_NAME_COLUMN,
  RULE_TYPE_COLUMN,
  RULE_DATE_CREATED_COLUMN,
  RULE_ENTITY_COUNT_COLUMN,
  RULE_RUN_BETWEEN_COLUMN,
  RULE_FREQUENCY_COLUMN,
  RULE_LAST_RUN_COLUMN,
  RULE_NEXT_TRIGGER_COLUMN,
  RULE_ACTIONS_COLUMN,
];
