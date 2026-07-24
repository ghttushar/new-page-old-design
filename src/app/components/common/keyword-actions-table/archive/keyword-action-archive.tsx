import { TargetingActionTypeEnum } from '@/enums/keyword-action.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import AmazonKeywordActionArchive from './keyword-action-archive-amazon';
import WalmartKeywordActionArchive from './keyword-action-archive-walmart';

interface KeywordActionArchiveProps {
  rowId: number;
  targetActionType?: TargetingActionTypeEnum;
}
const KeywordActionArchive = (props: KeywordActionArchiveProps) => {
  const { rowId, targetActionType } = props;
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = advertisingAccount.marketplace;

  if (marketplace === MarketplaceEnum.AMAZON) {
    return (
      <AmazonKeywordActionArchive
        rowId={Number(rowId)}
        targetActionType={targetActionType}
      />
    );
  } else {
    return <WalmartKeywordActionArchive rowId={Number(rowId)} />;
  }
};

export default KeywordActionArchive;
