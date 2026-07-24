import { lottieFiles } from '@/constants/assets/lotties.utils';
import { PageTitleEnum } from '@/enums/index.enums';
import { MarketplaceEnum } from '@/enums/serp.enums';
import useMarketplaceSubheader from '@/hooks/use-marketplace-sub-header.hook';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import EmptyState from 'src/app/components/common/empty-state/empty-state';
import { IReportConfigItem } from 'src/interfaces/reports.interfaces';
import reportsService from 'src/services/reports.service';
import {
  getReportsBaseUrl,
  getReportsViewUrl,
  getReportTabLabel,
  normalizeReportsMarketplace,
} from 'src/utils/reports.utils';
import styles from './reports-wrapper.module.scss';

const reportsUnavailableEmptyState = {
  emptyTitle: 'No Reports Available',
  emptyDescription:
    'There are no reports configured yet for the selected marketplace.',
  lottieFile: lottieFiles.emptyStateLottie,
  emptyLottieOptions: {
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  },
  isButtonRequired: false,
};

const ReportsHomePage = () => {
  const { marketplace: marketplaceParam } = useParams();
  const normalizedMarketplace = marketplaceParam
    ? normalizeReportsMarketplace(marketplaceParam)
    : MarketplaceEnum.All;
  const getMarketplaceUrl = useCallback(
    (nextMarketplace: string) => getReportsBaseUrl(nextMarketplace),
    []
  );

  useMarketplaceSubheader(
    PageTitleEnum.REPORTS,
    getMarketplaceUrl,
    normalizedMarketplace
  );

  const [reportConfigs, setReportConfigs] = useState<IReportConfigItem[]>([]);
  const [isLoadingConfigs, setIsLoadingConfigs] = useState(false);

  useEffect(() => {
    setIsLoadingConfigs(true);

    reportsService
      .getReportConfigs()
      .then((res) => {
        setReportConfigs(res.data.data ?? []);
      })
      .finally(() => {
        setIsLoadingConfigs(false);
      });
  }, []);

  const reportCards = useMemo(
    () =>
      reportConfigs
        .filter(
          (reportConfig) =>
            (normalizedMarketplace === MarketplaceEnum.All ||
              reportConfig.channel === normalizedMarketplace) &&
            reportConfig.isActive
        )
        .map((reportConfig) => ({
          reportConfigId: reportConfig._id,
          marketplace: reportConfig.channel,
          typeLabel: getReportTabLabel(reportConfig.reportKind),
        })),
    [normalizedMarketplace, reportConfigs]
  );

  if (!marketplaceParam) {
    return <Navigate to={getReportsBaseUrl(MarketplaceEnum.All)} replace />;
  }

  const hasReports = reportCards.length > 0;

  return (
    <div className={styles.container}>
      {hasReports ? (
        <div className={styles.cardsGrid}>
          {reportCards.map((reportCard) => {
            const reportUrl = getReportsViewUrl(
              reportCard.marketplace,
              reportCard.reportConfigId
            );
            const marketplaceLabel =
              reportCard.marketplace === MarketplaceEnum.All
                ? ''
                : `${
                    reportCard.marketplace.charAt(0).toUpperCase() +
                    reportCard.marketplace.slice(1).toLowerCase()
                  } `;

            return (
              <div
                key={reportCard.reportConfigId}
                className={styles.reportCard}
              >
                <div className={styles.cardAccent} />
                <div className={styles.cardContent}>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>
                      {`${marketplaceLabel}${reportCard.typeLabel}`}
                    </h3>
                  </div>

                  <a
                    className={styles.cardAction}
                    href={reportUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Report
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {!hasReports && !isLoadingConfigs ? (
        <EmptyState {...reportsUnavailableEmptyState} />
      ) : null}
    </div>
  );
};

export default ReportsHomePage;
