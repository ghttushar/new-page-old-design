import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { Button, Typography } from '@mui/material';
import {
  WhatsappLogoIcon,
  LightningIcon,
  InfoIcon,
} from '@phosphor-icons/react';
import React, { useState } from 'react';
import WhatsAppConnectDialog from './whatsapp-connect-dialog';
import styles from './integrations-page.module.scss';

export default function IntegrationsPage() {
  useSubHeader(PageTitleEnum.INTEGRATIONS, PAGE_TITLE_TOOLTIPS.INTEGRATIONS);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [mcpDialogOpen, setMcpDialogOpen] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <Typography variant="h1" className={styles.pageTitle}>
            Integrations
          </Typography>
          <InfoIcon size={18} className={styles.infoIcon} />
        </div>
        <Typography variant="body1" className={styles.pageSubtitle}>
          Send Anarix alerts to the channels you actually check.
        </Typography>
      </div>

      <div className={styles.section}>
        <Typography variant="body2" className={styles.sectionLabel}>
          Available integrations
        </Typography>

        <div className={styles.card}>
          <div className={styles.cardLeft}>
            <div className={styles.cardIconWrap}>
              <WhatsappLogoIcon size={28} weight="fill" color="#25D366" />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardTitleRow}>
                <Typography variant="body1" className={styles.cardTitle}>
                  WhatsApp
                </Typography>
                <span className={styles.badgeAlerts}>ALERTS</span>
              </div>
              <Typography variant="body2" className={styles.cardDesc}>
                Receive Anarix alerts and notifications on WhatsApp. Choose
                which services and accounts trigger messages.
              </Typography>
              <Button
                variant="contained"
                disableTouchRipple
                className={styles.connectBtn}
                onClick={() => setWhatsappDialogOpen(true)}
              >
                Connect WhatsApp
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardLeft}>
            <div className={styles.cardIconWrap}>
              <LightningIcon size={28} weight="fill" color="#77469b" />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardTitleRow}>
                <Typography variant="body1" className={styles.cardTitle}>
                  MCP
                </Typography>
                <span className={styles.badgeTools}>TOOLS</span>
              </div>
              <Typography variant="body2" className={styles.cardDesc}>
                Connect AI assistants like Claude, Cursor, and VS Code to Anarix
                via the Model Context Protocol for agent-driven workflows.
              </Typography>
              <Button
                variant="contained"
                disableTouchRipple
                className={styles.learnMoreBtn}
                onClick={() => setMcpDialogOpen(true)}
              >
                Learn More
              </Button>
            </div>
          </div>
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
    </div>
  );
}
