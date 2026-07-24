import { QueryKeyEnums } from '@/enums/query.enums';
import { RuleEntityTypeIdEnum, RuleTypeEnum } from '@/enums/rules.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import {
  ILinkableEntity,
  IRuleEntityLinksDetails,
} from '@/interfaces/rules/rules.interfaces';
import { useAppSelector } from '@/redux/hooks';
import { useAppQuery } from '@/redux/react-query-hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import {
  selectSelectedEntities,
  selectSelectedEntityType,
  selectSelectedRuleType,
  setSelectedEntities,
} from '@/redux/slices/rules/rules.slice';
import rulesServices from '@/services/rules/rules.services';
import {
  getTableTitleByRuleEntity,
  getUniqueLinkableEntities,
} from '@/utils/rules.utils';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import RulesEntitySelectionComponent from '../rules-entity-selection/rules-entity-selection';

interface IRulesPageSelectComponentProps {
  onSelectionChange: (selected: ILinkableEntity[]) => void;
  initialEntityLinks: Array<IRuleEntityLinksDetails>;
}

export const RulesPageSelectComponent = ({
  onSelectionChange,
  initialEntityLinks,
}: IRulesPageSelectComponentProps) => {
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const selectedRuleType = useAppSelector(selectSelectedRuleType);
  const ruleEntityType = useAppSelector(selectSelectedEntityType);
  const selectedEntities = useAppSelector(selectSelectedEntities);

  const dispatch = useDispatch();

  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount.marketplace]
  );

  const selectAdvAccValue = useMemo(
    () => selectedAdvertisingAccount.value,
    [selectedAdvertisingAccount.value]
  );

  const [tableData, setTableData] = useState<ILinkableEntity[]>([]);

  const fetchLinkableData = useAppQuery({
    queryFn: () =>
      rulesServices.getLinkableTableData(
        selectedRuleType ?? RuleTypeEnum.INVENTORY_RULE,
        marketplace,
        selectAdvAccValue
      ),
    queryKey: [QueryKeyEnums.FETCH_LINKABLE_TABLE_DATA],
    enabled: !tableData.length,
  });

  useEffect(() => {
    if (fetchLinkableData.data?.data?.data) {
      const entityLinks = fetchLinkableData.data.data.data.entities;
      const entityLinksMap = new Map<string, ILinkableEntity>();
      const initialSelectedEntities: Array<ILinkableEntity> = [];

      entityLinks.forEach((entity) =>
        entityLinksMap.set(entity.entityId, entity)
      );

      initialEntityLinks.forEach((entity) => {
        const toAdd = entityLinksMap.get(entity.entityId);

        if (toAdd) {
          initialSelectedEntities.push(toAdd);
        }
      });

      setTableData(entityLinks);

      if (initialSelectedEntities.length > 0)
        dispatch(
          setSelectedEntities(
            getUniqueLinkableEntities([
              ...initialSelectedEntities,
              ...selectedEntities,
            ])
          )
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchLinkableData.data?.data.data, initialEntityLinks, dispatch]);

  const isLoading = useMemo(
    () => fetchLinkableData.isLoading || fetchLinkableData.isRefetching,
    [fetchLinkableData.isLoading, fetchLinkableData.isRefetching]
  );

  return (
    <RulesEntitySelectionComponent
      tableTitle={getTableTitleByRuleEntity(
        ruleEntityType ?? RuleEntityTypeIdEnum.CAMPAIGN_ID
      )}
      initialData={tableData}
      isLoading={isLoading}
      onSelectionChange={onSelectionChange}
      marketplace={marketplace}
      entityType={ruleEntityType ?? RuleEntityTypeIdEnum.CAMPAIGN_ID}
    />
  );
};
