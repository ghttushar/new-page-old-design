import { MarketplaceEnum } from '@/enums/serp.enums';
import { IKeywordActionData } from '@/interfaces/keyword-actions.interface';
import { useMemo } from 'react';
import { KeywordActionKeywordTagEnum } from 'src/enums/keyword-action.enums';
import { useAppSelector } from 'src/redux/hooks';
import { selectAdvertisingAccount } from 'src/redux/slices/auth/auth.slice';
import KeywordActionSearchTermAmazon from './keyword-action-search-term-amazon';
import KeywordActionSearchTermWalmart from './keyword-action-search-term-walmart';

export interface IKeywordActionSearchTermWrapperProps {
  id: number;
  tag: KeywordActionKeywordTagEnum;
  searchTerm: string;
  adGroupCount: number;
}

const KeywordActionSearchTermWrapper = (props: IKeywordActionData) => {
  const { searchTerm, adGroupCount, tag, id } = props;
  const advertisingAccount = useAppSelector(selectAdvertisingAccount);

  const marketplace = useMemo(
    () => advertisingAccount.marketplace,
    [advertisingAccount]
  );

  if (marketplace === MarketplaceEnum.AMAZON) {
    return (
      <KeywordActionSearchTermAmazon
        searchTerm={searchTerm}
        adGroupCount={adGroupCount}
        tag={tag}
        id={id}
      />
    );
  } else {
    return (
      <KeywordActionSearchTermWalmart
        searchTerm={searchTerm}
        adGroupCount={adGroupCount}
        tag={tag}
        id={id}
      />
    );
  }
};

export default KeywordActionSearchTermWrapper;
