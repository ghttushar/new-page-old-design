import MultiSelectDropdown from '@/app/components/common/dropdown/multi-select-dropdown';
import { ConfigurationTargetingTypeEnum } from '@/enums/configurations.enum';
import { IGenerateSourceTargetMapping } from '@/interfaces/configurations.interface';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  selectIsChatbotOpen,
  selectIsSidebarMenuOpen,
} from '@/redux/slices/auth/auth.slice';
import { updateMappingRow } from '@/redux/slices/configurations/configurations.slice';
import { useMemo } from 'react';
import ColumnTags from '../../common/column-tags/column-tags';
import {
  AllMatchTypes,
  getAvailableMatchTypes,
  MATCH_TYPE_LABELS,
} from './match-type-helpers';

interface MatchTypeCellProps {
  row: IGenerateSourceTargetMapping;
  isViewMode?: boolean;
}

export const MatchTypeCell = ({
  row,
  isViewMode = false,
}: MatchTypeCellProps) => {
  const dispatch = useAppDispatch();
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);
  const isSidebarMenuOpen = useAppSelector(selectIsSidebarMenuOpen);

  const availableMatchTypes = useMemo(
    () =>
      getAvailableMatchTypes(
        row.sourceCampaignTargetingType as ConfigurationTargetingTypeEnum,
        row.targetCampaignTargetingType as ConfigurationTargetingTypeEnum
      ),
    [row.sourceCampaignTargetingType, row.targetCampaignTargetingType]
  );

  const options = useMemo(
    () =>
      availableMatchTypes.map((type) => ({
        value: type,
        label: MATCH_TYPE_LABELS[type],
        selected: (row.matchTypes ?? []).includes(type),
        isDisabled: false,
      })),
    [availableMatchTypes, row.matchTypes]
  );

  const handleChange = (
    selectedOptions: { value: string; selected: boolean }[]
  ) => {
    const selectedValues = selectedOptions
      .filter((o) => o.selected)
      .map((o) => o.value as AllMatchTypes);

    dispatch(
      updateMappingRow({
        mappingId: row.mappingId as string,
        updates: { matchTypes: selectedValues },
      })
    );
  };

  return (
    <MultiSelectDropdown
      options={options}
      onSelect={handleChange}
      label=""
      width={isChatbotOpen || isSidebarMenuOpen ? '20rem' : '30rem'}
      height="2.3rem"
      fontWeight="400"
      isNewDesign={true}
      horizontalDisplay={true}
      disabled={!row.targetAdGroupId || isViewMode}
    />
  );
};

export const MatchTypeViewCell = ({
  matchTypes,
}: {
  matchTypes: AllMatchTypes[];
}) => {
  return (
    <div
      style={{
        display: 'flex',
        maxWidth: '80rem',
        justifyContent: 'center',
        width: 'max-content',
        flexWrap: 'wrap',
      }}
    >
      <ColumnTags
        tagArray={[...matchTypes.map((type) => MATCH_TYPE_LABELS[type])]}
      />
    </div>
  );
};
