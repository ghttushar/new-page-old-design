import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
import { IAmcTableInfo } from 'src/interfaces/amc.interfaces';
import { IPowerBIReportEmbedConfig } from 'src/interfaces/reports.interfaces';
import styles from '../../../page-components/power-bi-report/power-bi-report.module.scss';
interface IAMCPowerBIReportProps {
  reportConfig: IPowerBIReportEmbedConfig | null;
  workflowExecutionId: string;
  amcTableInfo: IAmcTableInfo;
}

const AMCPowerBIReport: React.FC<IAMCPowerBIReportProps> = ({
  reportConfig,
  workflowExecutionId,
  amcTableInfo,
}) => {
  // const tableName = 'SA_and_DSP_Overlap';
  // TODO: Table has to be dynamic based on query
  const tableName = `${amcTableInfo.schemaName} ${amcTableInfo.tableName}`;
  const columnName = 'execution_id';

  if (reportConfig)
    return (
      <PowerBIEmbed
        embedConfig={{
          pageView: 'fitToWidth',
          type: 'report',
          id: reportConfig.reportId,
          embedUrl: reportConfig.embedUrl,
          accessToken: reportConfig.accessToken,
          tokenType: models.TokenType.Embed,
          permissions: 0,
          slicers: [
            {
              selector: {
                target: {
                  table: tableName,
                  column: columnName,
                },
                $schema:
                  'http://powerbi.com/product/schema#slicerTargetSelector',
              },
              state: {
                filters: [
                  {
                    target: {
                      table: tableName,
                      column: columnName,
                    },
                    $schema: 'http://powerbi.com/product/schema#basic',
                    operator: 'In',
                    values: [workflowExecutionId],
                    filterType: 1,
                    requireSingleSelection: true,
                  },
                ],
              },
            },
          ],
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
            background: models.BackgroundType.Transparent,
            zoomLevel: 0.45,
          },
        }}
        cssClassName={styles.report}
      />
    );
};

export default AMCPowerBIReport;
