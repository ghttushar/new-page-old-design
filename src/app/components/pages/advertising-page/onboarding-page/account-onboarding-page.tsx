import LoaderWrapper from '@/app/components/common/loader-wrapper/loader-wrapper';
import { PRIVACY_POLICY_URL } from '@/constants/urls.constants';
import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { IOnboardingPage } from '@/interfaces/onboarding.interface';
import { ShieldWarningIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import MarketplaceCard from './marketplace-connect-card';
import styles from './onboarding-page.module.scss';

export default function AccountOnboardingPage({
  title,
  subtitle,
  accountCards,
}: IOnboardingPage) {
  useSubHeader(PageTitleEnum.ONBOARDING, PAGE_TITLE_TOOLTIPS.ONBOARDING);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return isLoading ? (
    <LoaderWrapper />
  ) : (
    <div>
      <div className={styles.onboardingContainer}>
        <div className={styles.onboardingHeaderContainer}>
          <span className={styles.title}>{title}</span>
          <span className={styles.subTitle}>{subtitle}</span>
        </div>
        <div className={styles.onboardingWrapper}>
          {accountCards.length > 0 &&
            accountCards.map((account, index) => (
              <MarketplaceCard
                key={`${account.description}-${index}`}
                isDisabled={account.isDisabled}
                description={account.description}
                marketplace={account.marketplace}
                iconPath={account.iconPath}
                iconSize={account.iconSize}
                buttonFunction={account.buttonFunction}
                buttonText={account.buttonText}
                redirectLink={account.redirectLink}
                onboardingType={account.onboardingType}
              />
            ))}
        </div>
        <div className={styles.warningCard}>
          <ShieldWarningIcon size={25} weight="fill" color="#59BF82" />
          <span
            style={{
              fontSize: '1.2rem',
            }}
          >
            By continuing, you agree to Anarix's{' '}
            <a
              href={PRIVACY_POLICY_URL}
              target="_blank"
              rel="noreferrer"
              style={{
                color: '#3385EA',
                textDecoration: 'underline',
              }}
            >
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a
              href={PRIVACY_POLICY_URL}
              target="_blank"
              rel="noreferrer"
              style={{
                color: '#3385EA',
                textDecoration: 'underline',
              }}
            >
              Privacy Policy
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
