import { RuleEntityColumnTags } from '@/app/components/pages/rules-page/rules-page-features/rules-page-agents/rules-page-form/rules-page-form-components/rules-entity-selection/rules-entity-selection-column-components/rule-entity-column-tags/rule-entity-column-tags';
import RuleEntityLinkStatusColumn from '@/app/components/pages/rules-page/rules-page-features/rules-page-agents/rules-page-form/rules-page-form-components/rules-entity-selection/rules-entity-selection-column-components/rule-entity-link-status/rule-entity-link-status';
import { RuleEntityColumn } from '@/app/components/pages/rules-page/rules-page-features/rules-page-agents/rules-page-form/rules-page-form-components/rules-entity-selection/rules-entity-selection-column-components/rule-entity-name-column/rules-entity-column';
import { AUTOMATION_STATUS_ORDER } from '@/constants/rules/rules.constants';
import { RuleEntityTypeIdEnum } from '@/enums/rules.enum';
import { ILinkableEntity } from '@/interfaces/rules/rules.interfaces';
import { getEntityNameByEntityType } from '@/utils/rules.utils';
import { ColumnDef, Row } from '@tanstack/react-table';
import styles from './rules-select-table-columns.module.scss';

const RULE_ENTITY_LINK_STATUS_COLUMN: ColumnDef<ILinkableEntity> = {
  accessorKey: 'ruleEntityLinkStatus',
  id: 'Automation Status',
  size: 100,
  header: (props) => {
    return <div className={styles.headerCenter}>Automation Status</div>;
  },
  cell: (props) => {
    const { ruleEntityLinkStatus } = props.row.original;

    return (
      <RuleEntityLinkStatusColumn ruleEntityLinkStatus={ruleEntityLinkStatus} />
    );
  },
  sortUndefined: false,
  sortingFn: (rowA, rowB, columnId) => {
    const a = rowA.getValue(columnId) as string | null | undefined;
    const b = rowB.getValue(columnId) as string | null | undefined;

    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;

    const orderA =
      AUTOMATION_STATUS_ORDER[a as keyof typeof AUTOMATION_STATUS_ORDER] ?? 99;
    const orderB =
      AUTOMATION_STATUS_ORDER[b as keyof typeof AUTOMATION_STATUS_ORDER] ?? 99;

    return orderA - orderB;
  },
};

const NAME_COLUMN = (
  entityType: RuleEntityTypeIdEnum
): ColumnDef<ILinkableEntity> => {
  return {
    accessorKey: 'entityName',
    id: 'Info',
    size: 300,
    header: (props) => {
      return (
        <div className={styles.header}>
          {`${getEntityNameByEntityType(entityType)}s`}
        </div>
      );
    },
    cell: (props) => {
      return <RuleEntityColumn props={props} entityType={entityType} />;
    },
    sortUndefined: false,
    sortingFn: (rowA, rowB) => {
      const getValue = (row: Row<ILinkableEntity>) =>
        (row.original.name ?? row.original.entityId ?? '')
          .toString()
          .toLowerCase();

      return getValue(rowA).localeCompare(getValue(rowB), undefined, {
        sensitivity: 'base',
      });
    },
  };
};
const COLUMN_TAGS = (
  entityType: RuleEntityTypeIdEnum
): ColumnDef<ILinkableEntity> => {
  return {
    accessorKey: 'columnTags',
    id: 'Column Tags',
    enableSorting: false,
    header: (props) => {
      return null;
    },
    cell: (props) => {
      return <RuleEntityColumnTags props={props} entityType={entityType} />;
    },
  };
};

export const RULES_SOURCE_TABLE_COLUMNS = (
  entityType: RuleEntityTypeIdEnum,
  isEntityLinkStatusRequired: boolean
): Array<ColumnDef<ILinkableEntity>> => {
  if (isEntityLinkStatusRequired)
    return [
      RULE_ENTITY_LINK_STATUS_COLUMN,
      NAME_COLUMN(entityType),
      COLUMN_TAGS(entityType),
    ];
  else return [NAME_COLUMN(entityType), COLUMN_TAGS(entityType)];
};
