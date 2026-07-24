import { MarketplaceEnum } from '@/enums/serp.enums';
import { getAccountTypeDetailsByMarketplace } from '@/utils/advertising.utils';
import { useMemo } from 'react';
import InfoIcon from 'src/app/components/common/info-icon/info-icon';
import styles from '../account-card.module.scss';

interface IAccountTypeSectionProps {
  accountType: string;
  marketplace: MarketplaceEnum;
}
const AccountTypeSection = (props: IAccountTypeSectionProps) => {
  const { accountType, marketplace } = props;

  const accountTypeText = useMemo(
    () => getAccountTypeDetailsByMarketplace(marketplace, accountType),
    [accountType, marketplace]
  );

  return (
    <div className={styles.accountTypeSection}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
          whiteSpace: 'nowrap',
          gap: '0.3rem',
        }}
      >
        <span>Account Type:</span>
        <InfoIcon title={'Account Type'} />
        <span className={styles.accountTypeValue}>
          {accountTypeText[0]} | {accountTypeText[1]}
        </span>
      </div>
    </div>
  );
};
export default AccountTypeSection;
