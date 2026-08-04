import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { Box, Button, Typography } from '@mui/material';
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
          <div className={styles.cardIconWrap}>
            <WhatsappLogoIcon size={24} weight="fill" color="#25D366" />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardTitleRow}>
              <Typography variant="body1" className={styles.cardTitle}>
                WhatsApp
              </Typography>
              <span className={styles.badge}>ALERTS</span>
            </div>
            <Typography variant="body2" className={styles.cardDesc}>
              Receive Anarix alerts and notifications on WhatsApp. Choose which
              services and accounts trigger messages.
            </Typography>
          </div>
          <Box sx={{ display: 'flex', alignItems: 'flex-end', flexShrink: 0 }}>
            <Box
              component="button"
              onClick={() => setWhatsappDialogOpen(true)}
              sx={{
                bgcolor: '#77469b',
                color: '#fff',
                border: 'none',
                borderRadius: '0.8rem',
                px: '1.6rem',
                py: '0.7rem',
                fontSize: '1.2rem',
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                textTransform: 'none',
                transition: 'background 0.15s',
                '&:hover': { bgcolor: '#9551ab' },
              }}
            >
              Connect WhatsApp
            </Box>
          </Box>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIconWrap}>
            <LightningIcon size={24} weight="fill" color="#77469b" />
          </div>
          <div className={styles.cardBody}>
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
          <Box sx={{ display: 'flex', alignItems: 'flex-end', flexShrink: 0 }}>
            <Box
              component="button"
              onClick={() => setMcpDialogOpen(true)}
              sx={{
                bgcolor: '#77469b',
                color: '#fff',
                border: 'none',
                borderRadius: '0.8rem',
                px: '1.6rem',
                py: '0.7rem',
                fontSize: '1.2rem',
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
                textTransform: 'none',
                transition: 'background 0.15s',
                '&:hover': { bgcolor: '#9551ab' },
              }}
            >
              Connect MCP
            </Box>
          </Box>
        </div>
      </div>

      <div className={styles.section}>
        <Typography variant="body2" className={styles.sectionLabel}>
          Your connections
        </Typography>

        <div className={styles.emptyCard}>
          <Typography variant="body1" className={styles.emptyTitle}>
            No integrations yet
          </Typography>
          <Typography variant="body2" className={styles.emptyDesc}>
            Connect WhatsApp or MCP to receive operational alerts — ACoS
            spikes, stockouts, rule triggers — for the accounts and services
            you care about.
          </Typography>
        </div>
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
