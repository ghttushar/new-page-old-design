import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { CheckCircleIcon, SpinnerGapIcon } from '@phosphor-icons/react';
import React, { useState } from 'react';
import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
import {
  ChatGptFlowerLogo,
  ClaudeLogo,
  WhatsappLogo,
} from '@/app/components/common/integration-logos/integration-logos';
import McpConnectDialog from './mcp-connect-dialog';
import WhatsAppConnectDialog from './whatsapp-connect-dialog';
import styles from './integrations-page.module.scss';

const CONNECT_DELAY_MS = 450;

type ConnectKind = '' | 'whatsapp' | 'mcp';

export default function IntegrationsPage() {
  useSubHeader(PageTitleEnum.INTEGRATIONS, PAGE_TITLE_TOOLTIPS.INTEGRATIONS);

  const [mcpDialogOpen, setMcpDialogOpen] = useState(false);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [connecting, setConnecting] = useState<ConnectKind>('');
  const [mcpConnected, setMcpConnected] = useState(false);
  const [whatsappConnected, setWhatsappConnected] = useState(false);

  const handleConnect = (kind: Exclude<ConnectKind, ''>) => {
    if (connecting) {
      return;
    }
    setConnecting(kind);
    window.setTimeout(() => {
      setConnecting('');
      if (kind === 'mcp') {
        setMcpDialogOpen(true);
      } else {
        setWhatsappDialogOpen(true);
      }
    }, CONNECT_DELAY_MS);
  };

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={`${styles.cardLogoTile} ${styles.tileJiva}`}>
              <DiamondMascot size={22} />
            </span>
            <div className={styles.cardHeading}>
              <h2 className={styles.cardTitle}>MCP</h2>
              {!mcpConnected && <span className={styles.newPill}>NEW</span>}
            </div>
          </div>
          <p className={styles.cardDesc}>
            Connect Claude or ChatGPT to JIVA and unlock AI-powered
            marketplace intelligence.
          </p>
          {mcpConnected && (
            <span className={styles.connectedPill}>
              <ClaudeLogo size={14} />
              <ChatGptFlowerLogo size={14} />
              Connected
            </span>
          )}
          <button
            type="button"
            className={styles.cardBtn}
            onClick={() => handleConnect('mcp')}
            disabled={connecting === 'mcp'}
          >
            {connecting === 'mcp' ? (
              <SpinnerGapIcon size={16} className={styles.spin} />
            ) : mcpConnected ? (
              'Connected'
            ) : (
              'Connect'
            )}
          </button>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={`${styles.cardLogoTile} ${styles.tileWhatsapp}`}>
              <WhatsappLogo size={22} />
            </span>
            <div className={styles.cardHeading}>
              <h2 className={styles.cardTitle}>WhatsApp</h2>
            </div>
          </div>
          <p className={styles.cardDesc}>
            Receive Anarix alerts and notifications on WhatsApp.
          </p>
          {whatsappConnected && (
            <span className={styles.connectedPill}>
              <CheckCircleIcon size={12} weight="fill" />
              Connected
            </span>
          )}
          <button
            type="button"
            className={styles.cardBtn}
            onClick={() => handleConnect('whatsapp')}
            disabled={connecting === 'whatsapp'}
          >
            {connecting === 'whatsapp' ? (
              <SpinnerGapIcon size={16} className={styles.spin} />
            ) : whatsappConnected ? (
              'Connected'
            ) : (
              'Connect'
            )}
          </button>
        </div>
      </div>

      <McpConnectDialog
        open={mcpDialogOpen}
        onClose={() => setMcpDialogOpen(false)}
        onConnected={() => setMcpConnected(true)}
      />

      <WhatsAppConnectDialog
        open={whatsappDialogOpen}
        onClose={() => setWhatsappDialogOpen(false)}
        onConnected={() => setWhatsappConnected(true)}
      />
    </div>
  );
}
