import ImgComponent from '@/app/components/common/img-component/img-component';
import {
  imageStyles,
  itemNameContainerStyles,
} from '@/app/components/pages/advertising-page/advertising-amazon/overall/account-level/amz-overall-account-level-styles';
import { textStartStyles } from '@/constants/table-columns/new-column-names.constants';
import { RuleEntityTypeIdEnum } from '@/enums/rules.enum';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { ILinkableEntity } from '@/interfaces/rules/rules.interfaces';
import { useAppSelector } from '@/redux/hooks';
import { selectAdvertisingAccount } from '@/redux/slices/auth/auth.slice';
import { getProductImgUrl, getProductUrl } from '@/utils/advertising.utils';
import { getEntityIDNameByEntityType } from '@/utils/rules.utils';
import { CellContext } from '@tanstack/react-table';
import { useMemo } from 'react';
import styles from './rules-entity-column.module.scss';

interface IRuleEntityColumnProps {
  props: CellContext<ILinkableEntity, unknown>;
  entityType: RuleEntityTypeIdEnum;
}

export const RuleEntityColumn = ({
  entityType,
  props,
}: IRuleEntityColumnProps) => {
  const { row } = props;
  const value = row.original.name;
  const entityID = row.original.entityId;
  const imgUrl = row.original.itemImageUrl;
  const pageUrl = row.original.itemPageUrl;
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const marketplace = useMemo(
    () => selectedAdvertisingAccount.marketplace ?? MarketplaceEnum.AMAZON,
    [selectedAdvertisingAccount.marketplace]
  );

  return (
    <div className={`commonCell ${styles.container}`}>
      {entityType === RuleEntityTypeIdEnum.ASIN ||
      entityType === RuleEntityTypeIdEnum.AD_ITEM_ID ||
      entityType === RuleEntityTypeIdEnum.ITEM_ID ? (
        ASIN_COMPONENT()
      ) : (
        <p className={styles.textContainer} title={value}>
          <span className={styles.textTitle}>{value}</span>
          <span className={styles.entityID}>
            {getEntityIDNameByEntityType(entityType, marketplace)}: {entityID}
          </span>
        </p>
      )}
    </div>
  );

  function ASIN_COMPONENT() {
    return (
      <div
        className={`commonCell ${styles.asinContainer}`}
        style={textStartStyles}
      >
        <div style={itemNameContainerStyles}>
          <ImgComponent
            alt={`${entityID ?? 'product'}`}
            imageURL={imgUrl ?? getProductImgUrl(entityID ?? '')}
            customStyles={imageStyles}
            isProduct={true}
            className={styles.productImage}
          />

          <div>
            <a
              href={
                pageUrl ??
                getProductUrl(
                  entityID ?? '',
                  entityType === RuleEntityTypeIdEnum.ASIN
                    ? MarketplaceEnum.AMAZON
                    : MarketplaceEnum.WALMART
                )
              }
              target="_blank"
              rel="noreferrer"
            >
              <p className={styles.linkText} title={value}>
                {value ?? entityID}
              </p>
            </a>
            <span className={styles.entityID}>
              {getEntityIDNameByEntityType(entityType, marketplace)}: {entityID}
            </span>
          </div>
        </div>
      </div>
    );
  }
};
