import useSubHeader from '@/hooks/use-sub-header.hook';
import { PageTitleEnum } from '@/enums/index.enums';
import { SignalsPage } from './signals-page';

export default function SignalsPageWrapper() {
  useSubHeader(PageTitleEnum.ALERTS, '');

  return <SignalsPage />;
}
