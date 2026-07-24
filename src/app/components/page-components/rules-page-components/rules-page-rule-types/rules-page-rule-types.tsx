import LoaderWrapper from '@/app/components/common/loader-wrapper/loader-wrapper';
import { QueryKeyEnums } from '@/enums/query.enums';
import { RuleTypeCategoryEnum } from '@/enums/rules.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  IRuleTypesFormattedResponse,
  IRuleTypesPayload,
  IRuleTypesTemplatesDetails,
} from '@/interfaces/rules/rules.interfaces';
import { useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import rulesServices from '@/services/rules/rules.services';
import { useEffect, useMemo, useState } from 'react';
import styles from './rules-page-rule-types.module.scss';
import RulesTypesComponentWrapper from './rules-types-component/rules-types-component-wrapper';

export default function RulesPageRuleTypes() {
  const [ruleTypes, setRuleTypes] = useState<
    Array<IRuleTypesFormattedResponse>
  >([]);

  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);

  const fetchRuleTypes = useAppQuery({
    queryKey: [
      QueryKeyEnums.FETCH_RULE_TYPES,
      {
        selectedAdvertisingAccount,
      },
    ],
    queryFn: async () => {
      const payload: IRuleTypesPayload = {
        marketplace:
          selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
      };

      return await rulesServices.getRuleTypes(payload);
    },
    enabled: selectedAdvertisingAccount.marketplace !== undefined,
  });

  useEffect(() => {
    setRuleTypes([]);

    if (fetchRuleTypes.data) {
      const resData = fetchRuleTypes.data.data.data;

      if (!resData) {
        setRuleTypes([]);
        return;
      }

      const resArray = Object.entries(resData);
      const formattedRuleTypes: Array<IRuleTypesFormattedResponse> =
        resArray.map((res) => ({
          category: res[0] as RuleTypeCategoryEnum,
          rules: (res[1] as Array<IRuleTypesTemplatesDetails>).map((res) => ({
            ...res,
            id: res.id || res.ruleType,
          })),
        }));

      setRuleTypes(formattedRuleTypes);
    }
  }, [fetchRuleTypes.data]);

  const isRuleTypesLoading = useMemo(
    () => fetchRuleTypes.isLoading || fetchRuleTypes.isRefetching,
    [fetchRuleTypes.isLoading, fetchRuleTypes.isRefetching]
  );

  if (isRuleTypesLoading === true) return <LoaderWrapper />;

  return (
    <div className={styles.ruleContainer}>
      {ruleTypes.length > 0 &&
        ruleTypes.map((rule, i) => (
          <RulesTypesComponentWrapper
            key={rule.category}
            ruleTypeDetails={rule}
          />
        ))}
    </div>
  );
}
