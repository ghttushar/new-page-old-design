import ReusableDialogPopupSkeleton from '@/app/components/common/reusable-dialog-popup-skeleton/reusable-dialog-popup-skeleton';
import TextButton from '@/app/components/common/text-button/text-button';
import SourceTargetMapping from '@/app/components/pages/settings-wrapper/configuration-page/source-target-mapping/source-target-mapping';
import CustomTableWrapper from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import { SL_NO_COLUMN } from '@/constants/table-columns/new-column-names.constants';
import { RULES_SOURCE_TABLE_COLUMNS } from '@/constants/table-columns/rules-columns/rule-select-table-columns/rules-select-table-columns.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import { RuleEntityTypeIdEnum } from '@/enums/rules.enum';
import { ILinkableEntity } from '@/interfaces/rules/rules.interfaces';
import { useAppDispatch } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { setSourceTargetMappings } from '@/redux/slices/configurations/configurations.slice';
import rulesServices from '@/services/rules/rules.services';
import { getEntityNameByEntityType } from '@/utils/rules.utils';
import React, { useEffect, useMemo, useState } from 'react';
import { appliedRulesPopupCustomTableStyles } from './applied-rules-count-popup-styles';
import styles from './applied-rules-count-popup.module.scss';

interface IAppliedRulesCountPopupProps {
  entitiesCount: string | number;
  entityType: RuleEntityTypeIdEnum;
  ruleId: string;
  ruleName: string;
}

export default function AppliedRulesCountPopup({
  entitiesCount,
  entityType,
  ruleId,
  ruleName,
}: IAppliedRulesCountPopupProps) {
  const dispatch = useAppDispatch();
  const [openEntityPopup, setOpenEntityPopup] = useState<boolean>(false);
  const [entityList, setEntityList] = useState<Array<ILinkableEntity>>([]);
  const [fetchEntityList, setFetchEntityList] = useState<boolean>(false);

  const handleOpenEntityPopup = () => {
    if (!entitiesCount) return;
    setOpenEntityPopup(true);
    setFetchEntityList(true);
  };
  const handleCloseEntityPopup = () => {
    setOpenEntityPopup(false);
    setFetchEntityList(false);
  };

  const tableColumns = useMemo(
    () => [
      SL_NO_COLUMN<ILinkableEntity>(),
      ...RULES_SOURCE_TABLE_COLUMNS(entityType, true),
    ],
    [entityType]
  );

  const fetchAppliedRulesEntityList = useAppQuery({
    queryKey: [QueryKeyEnums.FETCH_APPLIED_RULES_ENTITY_LIST, ruleId],
    queryFn: async ({ signal }) => {
      setEntityList([]);
      return await rulesServices.getRuleEntities(ruleId, signal);
    },
    enabled: !(!fetchEntityList || !ruleId),

    options: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (fetchAppliedRulesEntityList.data) {
      const resData = fetchAppliedRulesEntityList.data.data.data;
      if (Array.isArray(resData)) dispatch(setSourceTargetMappings(resData));
      else setEntityList(resData.entities);
      setFetchEntityList(false);
    }
  }, [dispatch, fetchAppliedRulesEntityList.data]);

  const isLoading = useMemo(
    () =>
      fetchAppliedRulesEntityList.isLoading ||
      fetchAppliedRulesEntityList.isRefetching,
    [
      fetchAppliedRulesEntityList.isLoading,
      fetchAppliedRulesEntityList.isRefetching,
    ]
  );

  return (
    <React.Fragment>
      <TextButton
        label={`${entitiesCount} ${getEntityNameByEntityType(entityType)}(s)`}
        handleClick={handleOpenEntityPopup}
      />

      <ReusableDialogPopupSkeleton
        dialogMaxWidth="md"
        open={openEntityPopup}
        onClose={handleCloseEntityPopup}
        needTitleBox={true}
        needConfirmActionButton={false}
        needCancelActionButton={false}
        isLoading={false}
      >
        <div className={styles.popupContainer}>
          <p className={styles.popupRuleName}>
            <b>Rule Name:</b> {ruleName}
          </p>
          <div className={styles.tableContainer}>
            {entityType === RuleEntityTypeIdEnum.SOURCE_TARGET_MAPPING_ID ? (
              <SourceTargetMapping
                isViewMode={true}
                fixedHeight={true}
                isDataLoading={isLoading}
              />
            ) : (
              <CustomTableWrapper
                data={entityList}
                columns={tableColumns}
                getRowId={(row: ILinkableEntity) => row.entityId}
                width="100%"
                borderRadius="0.8rem"
                height={'30rem'}
                isLoading={isLoading}
                customStyles={appliedRulesPopupCustomTableStyles}
                manualSorting={false}
                isPaginationRequired={false}
                fixedHeight={true}
                isNewDesign={true}
              />
            )}
          </div>
        </div>
      </ReusableDialogPopupSkeleton>
    </React.Fragment>
  );
}
