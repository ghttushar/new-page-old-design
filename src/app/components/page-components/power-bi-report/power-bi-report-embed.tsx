import { useAppSelector } from '@/redux/hooks';
import { selectIsChatbotOpen } from '@/redux/slices/auth/auth.slice';
import { Embed, models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
import { useEffect, useState } from 'react';
import { reportsNotConfiguredForMarketplace } from 'src/constants/empty-state.constants';
import { IPowerBIReportEmbedConfig } from 'src/interfaces/reports.interfaces';
import { IPowerBIReport } from 'src/interfaces/settings.interface';
import EmptyState from '../../common/empty-state/empty-state';
import LoaderWrapper from '../../common/loader-wrapper/loader-wrapper';
import styles from './power-bi-report.module.scss';

interface IPowerBIReportEmbedProps {
  reportDetails: IPowerBIReport | null;
  accessToken?: string | null;
  isLoading?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

const PowerBIReportEmbed = ({
  reportDetails,
  accessToken,
  isLoading = false,
  emptyStateTitle,
  emptyStateDescription,
}: IPowerBIReportEmbedProps) => {
  const [reportConfig, setReportConfig] =
    useState<IPowerBIReportEmbedConfig | null>(null);
  const isChatbotOpen = useAppSelector(selectIsChatbotOpen);

  useEffect(() => {
    if (!reportDetails || !accessToken) {
      setReportConfig(null);
      return;
    }

    const { powerBiGroupId, powerBiReportId } = reportDetails;
    setReportConfig({
      reportId: powerBiReportId,
      groupId: powerBiGroupId,
      accessToken,
      embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${powerBiReportId}&groupId=${powerBiGroupId}`,
    });
  }, [accessToken, reportDetails]);

  if (isLoading) {
    return (
      <div>
        <LoaderWrapper />
      </div>
    );
  }

  if (!reportDetails || !reportConfig) {
    return (
      <div>
        <EmptyState
          {...reportsNotConfiguredForMarketplace}
          emptyTitle={
            emptyStateTitle ?? reportsNotConfiguredForMarketplace.emptyTitle
          }
          emptyDescription={
            emptyStateDescription ??
            reportsNotConfiguredForMarketplace.emptyDescription
          }
        />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: isChatbotOpen ? '0 1rem 0 0.6rem' : 0,
        transition: 'all 0.1s ease-in-out',
      }}
    >
      <PowerBIEmbed
        embedConfig={{
          type: 'report',
          id: reportConfig.reportId,
          embedUrl: reportConfig.embedUrl,
          accessToken: reportConfig.accessToken,
          tokenType: models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: false,
              },
            },
            customLayout: {
              displayOption: models.DisplayOption.FitToWidth,
            },
            zoomLevel: 0.45,
          },
        }}
        cssClassName={styles.report}
        getEmbeddedComponent={(embeddedReport) => {
          embeddedReport as Embed;
        }}
      />
    </div>
  );
};

export default PowerBIReportEmbed;
