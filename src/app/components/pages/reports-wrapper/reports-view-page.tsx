import { reportsNotConfiguredForMarketplace } from '@/constants/empty-state.constants';
import { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import EmptyState from 'src/app/components/common/empty-state/empty-state';
import PowerBIReportEmbed from 'src/app/components/page-components/power-bi-report/power-bi-report-embed';
import { IReportConfigItem } from 'src/interfaces/reports.interfaces';
import reportsService from 'src/services/reports.service';
import {
  getReportsBaseUrl,
  normalizeReportsMarketplace,
} from 'src/utils/reports.utils';
import styles from './reports-wrapper.module.scss';

export default function ReportsViewPage() {
  const { marketplace: marketplaceParam, reportConfigId } = useParams();
  const normalizedMarketplace = normalizeReportsMarketplace(marketplaceParam);
  const [selectedReportConfig, setSelectedReportConfig] =
    useState<IReportConfigItem | null>(null);
  const [embedToken, setEmbedToken] = useState<string | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);

  useEffect(() => {
    if (!reportConfigId) {
      setSelectedReportConfig(null);
      setEmbedToken(null);
      return;
    }

    setIsLoadingReport(true);
    reportsService
      .getReportConfigById(reportConfigId)
      .then((res) => {
        const { reportConfig, embedToken: nextEmbedToken } = res.data.data;
        const isValidMarketplace = reportConfig.channel === normalizedMarketplace;

        setSelectedReportConfig(isValidMarketplace ? reportConfig : null);
        setEmbedToken(isValidMarketplace ? nextEmbedToken : null);
      })
      .finally(() => {
        setIsLoadingReport(false);
      });
  }, [normalizedMarketplace, reportConfigId]);

  if (!marketplaceParam) {
    return <Navigate to={getReportsBaseUrl(normalizedMarketplace)} replace />;
  }

  if (!reportConfigId) {
    return <Navigate to={getReportsBaseUrl(normalizedMarketplace)} replace />;
  }

  if (!isLoadingReport && !selectedReportConfig) {
    return (
      <div className={styles.viewerContainer}>
        <EmptyState {...reportsNotConfiguredForMarketplace} />
      </div>
    );
  }

  return (
    <div className={styles.viewerContainer}>
      <PowerBIReportEmbed
        isLoading={isLoadingReport}
        accessToken={embedToken}
        reportDetails={
          selectedReportConfig
            ? {
                powerBiGroupId: selectedReportConfig.externalGroupId,
                powerBiReportId: selectedReportConfig.externalReportId,
              }
            : null
        }
      />
    </div>
  );
}
