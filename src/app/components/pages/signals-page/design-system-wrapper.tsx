import useCatalogAccountSubHeader from '@/hooks/use-catalog-account-sub-header.hook';
import { PageTitleEnum } from '@/enums/index.enums';
import { DesignSystemPage } from '../../signals/design-system/design-system-page';

export default function DesignSystemWrapper() {
  useCatalogAccountSubHeader(PageTitleEnum.ALERTS, '');

  return <DesignSystemPage />;
}
