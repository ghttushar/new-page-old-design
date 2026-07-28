import useCatalogAccountSubHeader from '@/hooks/use-catalog-account-sub-header.hook';
import { PageTitleEnum } from '@/enums/index.enums';
import { SignalsPage } from './signals-page';

export default function SignalsPageWrapper() {
  useCatalogAccountSubHeader(PageTitleEnum.ALERTS, '');

  return <SignalsPage />;
}
