import { IDropdownItem } from '@/app/components/common/dropdown/dropdown';
import LoaderWrapper from '@/app/components/common/loader-wrapper/loader-wrapper';
import {
  ACTION_TYPE_TITLE_MAPPING,
  ADJUSTMENT_TARGET_TITLE_MAPPING,
  CONDITION_OPERATOR_TITLE_MAPPING,
  METRICS_TITLE_MAPPING,
} from '@/constants/rules/rules.constants';
import { QueryKeyEnums } from '@/enums/query.enums';
import {
  RuleAdjustmentTargetType,
  RuleTypeEnum,
  RuleValueTypeEnum,
} from '@/enums/rules.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IRuleConstraints,
  IRuleConstraintsDropdownOptions,
} from '@/interfaces/rules/rules.interfaces';
import { useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { selectSelectedRuleType } from '@/redux/slices/rules/rules.slice';
import rulesServices from '@/services/rules/rules.services';
import { getSingleSelectionDropdownOptionsFromMapping } from '@/utils';
import {
  getDefaultConstraints,
  getDefaultConstraintsOptions,
} from '@/utils/rules.utils';
import { useEffect, useMemo, useState } from 'react';
import RulesBidderPageForm from './rules-page-form-components/rule-bidder-form/rules-bidder-form';
import RulesPageFormBasic from './rules-page-form-components/rules-page-form-basic/rules-page-form-basic';
import RulesPageFormCriteria from './rules-page-form-components/rules-page-form-criteria/rules-page-form-criteria';
import styles from './rules-page-form.module.scss';

interface IRulesPageFormCreationProps {
  isTemplateLoading: boolean;
}

export default function RulesPageFormCreation({
  isTemplateLoading,
}: IRulesPageFormCreationProps) {
  const selectedRuleType = useAppSelector(selectSelectedRuleType);
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount.marketplace]
  );

  const [constraints, setConstraints] = useState<IRuleConstraints>(
    getDefaultConstraints(selectedRuleType, marketplace)
  );
  const [constraintsOptions, setConstraintsOptions] =
    useState<IRuleConstraintsDropdownOptions>(
      getDefaultConstraintsOptions(selectedRuleType, marketplace)
    );

  const fetchRuleConstraintsByRuleType = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_RULE_CONSTRAINTS_BY_RULE_TYPE,
      {
        selectedRuleType,
      },
    ],
    queryFn: async () => {
      if (selectedRuleType)
        return await rulesServices.getRuleConstraintsByRuleType(
          selectedRuleType,
          marketplace
        );
    },
    enabled: selectedRuleType !== null,
    options: {
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: 'always',
      refetchOnWindowFocus: false,
    },
  });

  useEffect(() => {
    if (fetchRuleConstraintsByRuleType.data) {
      const resData = fetchRuleConstraintsByRuleType.data.data.data;

      if (resData) {
        const metricsOptions = getSingleSelectionDropdownOptionsFromMapping(
          resData.metrics,
          METRICS_TITLE_MAPPING
        );
        const operatorsOptions = getSingleSelectionDropdownOptionsFromMapping(
          resData.operators,
          CONDITION_OPERATOR_TITLE_MAPPING
        );
        const valueOptions = getSingleSelectionDropdownOptionsFromMapping(
          resData.metricsWithValueTypes.map((item) => item.metric),
          METRICS_TITLE_MAPPING,
          [RuleValueTypeEnum.ABSOLUTE]
        );

        let actionOptions = getSingleSelectionDropdownOptionsFromMapping(
          resData.actions,
          ACTION_TYPE_TITLE_MAPPING
        );

        let adjustmentTargetOptions: IDropdownItem<RuleAdjustmentTargetType>[] =
          [];

        if (resData.adjustmentActions) {
          const { targets, actions } = resData.adjustmentActions;

          actionOptions = getSingleSelectionDropdownOptionsFromMapping(
            actions,
            ACTION_TYPE_TITLE_MAPPING
          );

          adjustmentTargetOptions =
            getSingleSelectionDropdownOptionsFromMapping(
              targets,
              ADJUSTMENT_TARGET_TITLE_MAPPING
            );
        }

        setConstraints(resData);
        setConstraintsOptions({
          metricsOptions: metricsOptions,
          operatorsOptions: operatorsOptions,
          valueOptions: valueOptions,
          actionOptions: actionOptions,
          adjustmentTargetOptions: adjustmentTargetOptions,
        });
      }
    }
  }, [fetchRuleConstraintsByRuleType.data]);

  const isRuleConstraintsLoading = useMemo(
    () =>
      fetchRuleConstraintsByRuleType.isLoading ||
      fetchRuleConstraintsByRuleType.isRefetching,
    [
      fetchRuleConstraintsByRuleType.isLoading,
      fetchRuleConstraintsByRuleType.isRefetching,
    ]
  );

  if (isTemplateLoading === true || isRuleConstraintsLoading === true) {
    return <LoaderWrapper />;
  }

  return (
    <div className={styles.formSubContainer}>
      <RulesPageFormBasic />

      {selectedRuleType !== null &&
        selectedRuleType === RuleTypeEnum.BIDDER_RULE && (
          <RulesBidderPageForm />
        )}

      <RulesPageFormCriteria
        constraints={constraints}
        constraintsOptions={constraintsOptions}
      />
    </div>
  );
}
