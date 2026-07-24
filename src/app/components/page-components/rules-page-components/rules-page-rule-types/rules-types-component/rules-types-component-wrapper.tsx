import ReusableDialogPopupSkeleton from '@/app/components/common/reusable-dialog-popup-skeleton/reusable-dialog-popup-skeleton';
import { RULE_TYPE_CATEGORY_MAPPINGS } from '@/constants/rules/rules.constants';
import { JIVAViewTypeEnum } from '@/enums/chatbot.enums';
import { QueryKeyEnums } from '@/enums/query.enums';
import { RuleTypeEnum } from '@/enums/rules.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { IRuleTypesFormattedResponse } from '@/interfaces/rules/rules.interfaces';
import { setViewType } from '@/redux/chatbot/chatbot.slice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import {
  selectRuleTemplateDetails,
  selectSelectedRuleType,
  setRuleTypeTemplates,
  setSelectedEntityType,
  setSelectedRuleType,
} from '@/redux/slices/rules/rules.slice';
import rulesServices from '@/services/rules/rules.services';
import { getEntityTypesForRule } from '@/utils/rules.utils';
import React, { useEffect, useMemo, useState } from 'react';
import RulesTemplatesDialogPopup from '../../../rules-dialog-popup/rules-templates-dialog-popup/rules-templates-dialog-popup';
import RulesPageTypeComponent from './rules-types-component';

interface IRulesTypesComponentWrapperProps {
  ruleTypeDetails: IRuleTypesFormattedResponse;
}

export default function RulesTypesComponentWrapper({
  ruleTypeDetails,
}: IRulesTypesComponentWrapperProps) {
  const dispatch = useAppDispatch();
  const selectedRuleType = useAppSelector(selectSelectedRuleType);
  const ruleDetails = useAppSelector(selectRuleTemplateDetails);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount.marketplace]
  );

  const [selectedRuleTypeName, setSelectedRuleTypeName] = useState<
    string | null
  >(null);

  const ruleTypeTitleDetails = useMemo(() => {
    return RULE_TYPE_CATEGORY_MAPPINGS[ruleTypeDetails.category];
  }, [ruleTypeDetails.category]);

  const handleClickRuleType = (value: string, name: string) => {
    const ruleType = value as RuleTypeEnum;
    dispatch(setSelectedRuleType(ruleType));
    // Set the entity type based on the rule type
    dispatch(
      setSelectedEntityType(getEntityTypesForRule(ruleType, marketplace)[0])
    );
    setSelectedRuleTypeName(name);
  };

  const fetchTemplatesByRuleType = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_RULE_TEMPLATES_BY_RULE_TYPE,
      {
        selectedRuleType,
      },
    ],
    queryFn: async () => {
      if (selectedRuleType)
        return await rulesServices.getTemplatesByRuleType(selectedRuleType);
    },
    enabled: selectedRuleType !== null && ruleDetails === null,
    options: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    dispatch(setRuleTypeTemplates([]));

    if (fetchTemplatesByRuleType.data) {
      const resData = fetchTemplatesByRuleType.data.data.data;

      dispatch(setRuleTypeTemplates(resData));
    }
  }, [dispatch, fetchTemplatesByRuleType.data]);

  const isRuleTypesLoading = useMemo(
    () =>
      fetchTemplatesByRuleType.isLoading ||
      fetchTemplatesByRuleType.isRefetching,
    [fetchTemplatesByRuleType.isLoading, fetchTemplatesByRuleType.isRefetching]
  );

  const handleClosePopup = () => {
    dispatch(setSelectedRuleType(null));
    setSelectedRuleTypeName(null);
    dispatch(setRuleTypeTemplates([]));
    dispatch(setViewType(JIVAViewTypeEnum.CHATBOT));
  };

  return (
    <React.Fragment>
      <RulesPageTypeComponent
        ruleTypeTitleDetails={ruleTypeTitleDetails}
        ruleTypeDetails={ruleTypeDetails}
        onRuleTypeCardClick={handleClickRuleType}
      />

      <ReusableDialogPopupSkeleton
        dialogMaxWidth="md"
        open={selectedRuleType !== null && ruleDetails === null}
        onClose={handleClosePopup}
        needTitleBox={true}
        title={`Choose Template for ${selectedRuleTypeName ?? 'Selected Rule'}`}
        needConfirmActionButton={false}
        needCancelActionButton={false}
        isLoading={isRuleTypesLoading}
      >
        <RulesTemplatesDialogPopup isLoading={isRuleTypesLoading} />
      </ReusableDialogPopupSkeleton>
    </React.Fragment>
  );
}
