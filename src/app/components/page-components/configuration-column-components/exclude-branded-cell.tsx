import CustomCheckbox from '@/app/components/common/custom-checkbox/custom-checkbox';
import styles from '@/app/components/pages/settings-wrapper/configuration-page/source-target-mapping/source-target-mapping.module.scss';
import { SpNegTargetingKeywordMatchTypes } from '@/enums/advertising.enums';
import { ConfigurationTargetingTypeEnum } from '@/enums/configurations.enum';
import { IGenerateSourceTargetMapping } from '@/interfaces/configurations.interface';
import { useAppDispatch } from '@/redux/hooks';
import { updateMappingRow } from '@/redux/slices/configurations/configurations.slice';

interface ExcludeBrandedCellProps {
  row: IGenerateSourceTargetMapping;
  isViewMode?: boolean;
}

export const ExcludeBrandedCell = ({
  row,
  isViewMode = false,
}: ExcludeBrandedCellProps) => {
  const dispatch = useAppDispatch();

  const isAutoToAuto =
    row.sourceCampaignTargetingType === ConfigurationTargetingTypeEnum.AUTO &&
    row.targetCampaignTargetingType === ConfigurationTargetingTypeEnum.AUTO;

  const isDisabled = !isAutoToAuto && (row.matchTypes?.length ?? 0) === 0;
  const isChecked = isAutoToAuto || row.brandedKeywordExcluded === true;

  const toggle = () => {
    if (isDisabled || isAutoToAuto) return;

    dispatch(
      updateMappingRow({
        mappingId: row.mappingId as string,
        updates: {
          brandedKeywordExcluded: !isChecked,
          matchTypesToNegate: !isChecked
            ? [
                SpNegTargetingKeywordMatchTypes.NEG_EXACT,
                SpNegTargetingKeywordMatchTypes.NEG_PHRASE,
              ]
            : [],
        },
      })
    );
  };

  return (
    <div
      className={styles.excludeBrandedLabel}
      style={{ cursor: isDisabled || isAutoToAuto ? 'not-allowed' : 'pointer' }}
      onClick={(e) => {
        e.preventDefault();
        if (!isViewMode) toggle();
      }}
    >
      {isViewMode ? (
        isChecked ? (
          'Yes'
        ) : (
          'No'
        )
      ) : (
        <CustomCheckbox
          checked={isChecked}
          size="medium"
          disabled={isDisabled || isAutoToAuto}
          checkboxColor="#464646"
          checkedColor="#6205A7"
        />
      )}
    </div>
  );
};
