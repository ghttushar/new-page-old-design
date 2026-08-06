import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { Typography } from '@mui/material';
import { SpinnerGapIcon } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import {
  ClaudeLogo,
  GptLogo,
  JivaJLogo,
  WhatsappLogo,
} from '@/app/components/common/integration-logos/integration-logos';
import { getMcpConnected, subscribeMcpConnected } from './mcp-connection';
import McpConnectDialog from './mcp-connect-dialog';
import WhatsAppConnectDialog from './whatsapp-connect-dialog';
import styles from './integrations-page.module.scss';

export default function IntegrationsPage() {
  useSubHeader(PageTitleEnum.INTEGRATIONS, PAGE_TITLE_TOOLTIPS.INTEGRATIONS);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [mcpDialogOpen, setMcpDialogOpen] = useState(false);
  const [mcpConnected, setMcpConnected] = useState(getMcpConnected);
  const [connecting, setConnecting] = useState<'' | 'whatsapp' | 'mcp'>('');

  useEffect(() => {
    const unsubscribe = subscribeMcpConnected(setMcpConnected);
    return unsubscribe;
  }, []);

  const handleConnect = (kind: 'whatsapp' | 'mcp') => {
    if (connecting) {
      return;
    }
    setConnecting(kind);
    window.setTimeout(() => {
      setConnecting('');
      if (kind === 'whatsapp') {
        setWhatsappDialogOpen(true);
      } else {
        setMcpDialogOpen(true);
      }
    }, 450);
  };

  return (
    <div className={styles.page}>
      <Typography variant="body1" className={styles.pageSubtitle}>
        Connect external services to extend JIVA.
      </Typography>

      {mcpConnected && (
        <div className={styles.connectedSection}>
          <span className={styles.connectedLabel}>Connected</span>
          <div className={styles.connectedIcons}>
            <span className={styles.connectedIconWrap}>
              <ClaudeLogo size={20} />
            </span>
            <span className={styles.connectedIconWrap}>
              <GptLogo size={20} />
            </span>
          </div>
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <span className={`${styles.cardLogoWrap} ${styles.cardLogoJiva}`}>
              <JivaJLogo size={20} />
            </span>
            <Typography variant="body1" className={styles.cardTitle}>
              MCP
            </Typography>
            <span className={styles.badgeNew}>NEW</span>
          </div>
          <Typography variant="body2" className={styles.cardDesc}>
            Connect Claude or ChatGPT to JIVA and unlock AI-powered
            marketplace intelligence.
          </Typography>
          <button
            type="button"
            className={styles.cardBtn}
            onClick={() => handleConnect('mcp')}
            disabled={connecting === 'mcp'}
          >
            {connecting === 'mcp' ? (
              <SpinnerGapIcon size={16} className={styles.spin} />
            ) : (
              'Connect'
            )}
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <span className={`${styles.cardLogoWrap} ${styles.cardLogoWa}`}>
              <WhatsappLogo size={18} />
            </span>
            <Typography variant="body1" className={styles.cardTitle}>
              WhatsApp
            </Typography>
          </div>
          <Typography variant="body2" className={styles.cardDesc}>
            Receive Anarix alerts and notifications on WhatsApp.
          </Typography>
          <button
            type="button"
            className={styles.cardBtn}
            onClick={() => handleConnect('whatsapp')}
            disabled={connecting === 'whatsapp'}
          >
            {connecting === 'whatsapp' ? (
              <SpinnerGapIcon size={16} className={styles.spin} />
            ) : (
              'Connect'
            )}
          </button>
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
