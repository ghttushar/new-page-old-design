import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { CheckCircleIcon, SpinnerGapIcon } from '@phosphor-icons/react';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
import {
  ChatGptFlowerLogo,
  ClaudeLogo,
  WhatsappLogo,
} from '@/app/components/common/integration-logos/integration-logos';
import McpConnectDialog from './mcp-connect-dialog';
import WhatsAppConnectDialog from './whatsapp-connect-dialog';
import WorkspaceConnectDialog, { WORKSPACE_APPS, WorkspaceStack } from './workspace-connect-dialog';
import styles from './integrations-page.module.scss';

const CONNECT_DELAY_MS = 450;

type ConnectKind = '' | 'whatsapp' | 'mcp' | 'workspace';

export default function IntegrationsPage() {
  useSubHeader(PageTitleEnum.INTEGRATIONS, PAGE_TITLE_TOOLTIPS.INTEGRATIONS);

  const [mcpDialogOpen, setMcpDialogOpen] = useState(false);
  const [whatsappDialogOpen, setWhatsappDialogOpen] = useState(false);
  const [connecting, setConnecting] = useState<ConnectKind>('');
  const [mcpConnected, setMcpConnected] = useState(false);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [workspaceDialogOpen, setWorkspaceDialogOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Set<string>>(() => new Set());
  const connectedApps = WORKSPACE_APPS.filter((a) => workspaces.has(a.id));

  // Arriving from the dashboard banner's Slack slide: bring the Workspace AI card into view and flash it once.
  const location = useLocation();
  const workspaceCardRef = useRef<HTMLDivElement | null>(null);
  const [flashWorkspace, setFlashWorkspace] = useState(false);
  useEffect(() => {
    if ((location.state as { highlight?: string } | null)?.highlight !== 'workspace') {
      return undefined;
    }
    workspaceCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setFlashWorkspace(true);
    const t = window.setTimeout(() => setFlashWorkspace(false), 1600);
    return () => window.clearTimeout(t);
  }, [location.key, location.state]);

  const handleConnect = (kind: Exclude<ConnectKind, ''>) => {
    if (connecting) {
      return;
    }
    setConnecting(kind);
    window.setTimeout(() => {
      setConnecting('');
      if (kind === 'mcp') {
        setMcpDialogOpen(true);
      } else if (kind === 'workspace') {
        setWorkspaceDialogOpen(true);
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
              {!mcpConnected && <span className={styles.newPill}>New</span>}
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
            ) : (
              'Connect'
            )}
          </button>
        </div>

        <div ref={workspaceCardRef} className={`${styles.card} ${flashWorkspace ? styles.cardFlash : ''}`}>
          <div className={styles.cardHeader}>
            <span className={`${styles.cardLogoTile} ${styles.tileWorkspace}`}>
              <WorkspaceStack size={11} />
            </span>
            <div className={styles.cardHeading}>
              <h2 className={styles.cardTitle}>Workspace AI</h2>
              {connectedApps.length === 0 && <span className={styles.newPill}>New</span>}
            </div>
          </div>
          <p className={styles.cardDesc}>
            Chat with JIVA where your team works: alerts, answers and approvals
            in Slack, Teams or Google Chat.
          </p>
          {connectedApps.length > 0 && (
            <span className={styles.connectedPill}>
              {connectedApps.map(({ id, Logo }) => <Logo key={id} size={12} />)}
              Connected
            </span>
          )}
          <button
            type="button"
            className={styles.cardBtn}
            onClick={() => handleConnect('workspace')}
            disabled={connecting === 'workspace'}
          >
            {connecting === 'workspace' ? (
              <SpinnerGapIcon size={16} className={styles.spin} />
            ) : connectedApps.length > 0 ? (
              'Manage'
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

      <WorkspaceConnectDialog
        open={workspaceDialogOpen}
        onClose={() => setWorkspaceDialogOpen(false)}
        connected={workspaces}
        onChange={setWorkspaces}
      />
    </div>
  );
}
