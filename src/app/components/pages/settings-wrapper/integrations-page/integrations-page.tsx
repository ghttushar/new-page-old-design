import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { CircularProgress, Typography } from '@mui/material';
import { WhatsappLogoIcon, LightningIcon } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { getMcpConnected, subscribeMcpConnected } from './mcp-connection';
import McpConnectDialog from './mcp-connect-dialog';
import WhatsAppConnectDialog from './whatsapp-connect-dialog';
import styles from './integrations-page.module.scss';

export default function IntegrationsPage() {
  useSubHeader(PageTitleEnum.INTEGRATIONS, PAGE_TITLE_TOOLTIPS.INTEGRATIONS);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [mcpDialogOpen, setMcpDialogOpen] = useState(false);
  const [mcpConnected, setMcpConnected] = useState(getMcpConnected);

  useEffect(() => {
    const unsubscribe = subscribeMcpConnected(setMcpConnected);
    return unsubscribe;
  }, []);

  return (
    <div className={styles.page}>
      <Typography variant="body1" className={styles.pageSubtitle}>
        Send Anarix alerts to the channels you actually check.
      </Typography>

      <div className={styles.section}>
        <Typography variant="body2" className={styles.sectionLabel}>
          Available integrations
        </Typography>

        <div className={styles.card}>
          <div className={`${styles.cardIconWrap} ${styles.cardIconWhatsapp}`}>
            <WhatsappLogoIcon size={22} weight="fill" color="#25D366" />
          </div>
          <div className={styles.cardInfo}>
            <div className={styles.cardTitleRow}>
              <Typography variant="body1" className={styles.cardTitle}>
                WhatsApp
              </Typography>
              <span className={styles.badgeAlerts}>ALERTS</span>
            </div>
            <Typography variant="body2" className={styles.cardDesc}>
              Receive Anarix alerts and notifications on WhatsApp. Choose which
              services and accounts trigger messages.
            </Typography>
          </div>
          <div className={styles.cardActions}>
            <button
              type="button"
              className={styles.cardBtn}
              onClick={() => setWhatsappDialogOpen(true)}
            >
              Connect WhatsApp
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIconWrap}>
            <LightningIcon size={22} weight="fill" color="#77469b" />
          </div>
          <div className={styles.cardInfo}>
            <div className={styles.cardTitleRow}>
              <Typography variant="body1" className={styles.cardTitle}>
                MCP
              </Typography>
              {mcpConnected ? (
                <span className={styles.badgeAlerts}>ACTIVE</span>
              ) : (
                <span className={styles.badgeTools}>TOOLS</span>
              )}
            </div>
            <Typography variant="body2" className={styles.cardDesc}>
              Connect AI assistants like Claude, Cursor, and VS Code to Anarix
              via the Model Context Protocol for agent-driven workflows.
            </Typography>
          </div>
          <div className={styles.cardActions}>
            <button
              type="button"
              className={styles.cardBtn}
              onClick={() => setMcpDialogOpen(true)}
            >
              Connect MCP
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <Typography variant="body2" className={styles.sectionLabel}>
          Your connections
        </Typography>

        {mcpConnected ? (
          <div className={styles.card}>
            <div className={styles.cardIconWrap}>
              <LightningIcon size={22} weight="fill" color="#77469b" />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardTitleRow}>
                <Typography variant="body1" className={styles.cardTitle}>
                  MCP
                </Typography>
                <span className={styles.badgeAlerts}>ACTIVE</span>
              </div>
              <Typography variant="body2" className={styles.cardDesc}>
                AI assistants can access your Anarix marketplace intelligence.
              </Typography>
            </div>
            <div className={styles.cardActions}>
              <button
                type="button"
                className={styles.cardBtn}
                onClick={() => setMcpDialogOpen(true)}
              >
                Manage
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.emptyCard}>
            <CircularProgress size={30} className={styles.spinner} />
          </div>
        )}
      </div>

      <WhatsAppConnectDialog
        open={whatsappDialogOpen}
        onClose={() => setWhatsappDialogOpen(false)}
      />

      <McpConnectDialog
        open={mcpDialogOpen}
        onClose={() => setMcpDialogOpen(false)}
      />
    </div>
  );
}
