import styles from '@/app/components/pages/settings-wrapper/configuration-page/source-target-mapping/source-target-mapping.module.scss';
import { ConfigurationColumnNameEnum } from '@/enums/configurations.enum';
import { IGenerateSourceTargetMapping } from '@/interfaces/configurations.interface';

import HoverInfoTooltip from '@/app/components/common/hover-info-tooltip/hover-info-tooltip';
import { MatchTypeViewCell } from '@/app/components/page-components/configuration-column-components/match-type-cell';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import {
  ExcludeBrandedCell,
  MatchTypeCell,
  SourceAdGroupCell,
  TargetAdGroupCell,
} from '../../../app/components/page-components/configuration-column-components';

const textCenterStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
};
// TODO: REFACTOR CODE
export const CONFIGURATION_COLUMNS = (
  isViewMode: boolean
): ColumnDef<IGenerateSourceTargetMapping>[] => [
  {
    id: ConfigurationColumnNameEnum.SOURCE_AD_GROUP,
    accessorKey: 'sourceAdGroupName',
    header: () => (
      <div className="commonHeader" style={textCenterStyles}>
        Source AdGroup
      </div>
    ),
    cell: ({ row }) => {
      if (isViewMode)
        return (
          <HoverInfoTooltip title={row.original.sourceAdGroupName}>
            <span className={styles.nameViewColumn}>
              <p>{row.original.sourceAdGroupName}</p>
            </span>
          </HoverInfoTooltip>
        );
      return <SourceAdGroupCell row={row.original} isViewMode={isViewMode} />;
    },
  },
  {
    id: ConfigurationColumnNameEnum.TARGET_AD_GROUP,
    accessorKey: 'targetAdGroupName',
    header: () => (
      <div className="commonHeader" style={textCenterStyles}>
        Target AdGroup
      </div>
    ),
    cell: ({ row }) => {
      if (isViewMode)
        return (
          <HoverInfoTooltip title={row.original.sourceAdGroupName}>
            <span className={styles.nameViewColumn}>
              <p>{row.original.targetAdGroupName}</p>
            </span>
          </HoverInfoTooltip>
        );
      return <TargetAdGroupCell row={row.original} isViewMode={isViewMode} />;
    },
  },
  {
    id: ConfigurationColumnNameEnum.MATCH_TYPE,
    accessorKey: 'matchTypes',
    header: () => (
      <div className="commonHeader" style={textCenterStyles}>
        Match Type
      </div>
    ),
    cell: ({ row }) => {
      if (isViewMode) {
        return <MatchTypeViewCell matchTypes={row.original.matchTypes} />;
      }
      return <MatchTypeCell row={row.original} isViewMode={isViewMode} />;
    },
  },
  {
    id: ConfigurationColumnNameEnum.EXCLUDE_BRANDED,
    accessorKey: 'matchTypesToNegate',
    header: () => (
      <div className="commonHeader" style={textCenterStyles}>
        Exclude Branded
      </div>
    ),
    cell: ({ row }) => (
      <ExcludeBrandedCell row={row.original} isViewMode={isViewMode} />
    ),
  },
];
