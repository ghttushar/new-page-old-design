import { PageTitleEnum } from '@/enums/index.enums';
import { getDisclaimerByPageTitle } from '@/utils';
import { WarningIcon } from '@phosphor-icons/react';
import styles from './page-disclaimer.module.scss';

interface IPageDisclaimerProps {
  pageTitle: PageTitleEnum;
}
function PageDisclaimer({ pageTitle }: IPageDisclaimerProps) {
  const text = getDisclaimerByPageTitle(pageTitle);
  return (
    <div
      className={styles.container}
      style={{
        display: text === '' ? 'none' : 'flex',
      }}
    >
      <WarningIcon size={'1.2rem'} />
      <b>Disclaimer:</b> {getDisclaimerByPageTitle(pageTitle)}
    </div>
  );
}

export default PageDisclaimer;
