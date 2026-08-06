import { PageTitleEnum } from '@/enums/index.enums';
import { PAGE_TITLE_TOOLTIPS } from '@/enums/tooltip-texts.enums';
import useSubHeader from '@/hooks/use-sub-header.hook';
import { Typography } from '@mui/material';
import { SpinnerGapIcon } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import {
  ClaudeLogo,
  GptLogo,
  JivaLogo,
  WhatsappLogo,
} from '@/app/components/common/integration-logos/integration-logos';
import { getMcpConnected, subscribeMcpConnected } from './mcp-connection';
import McpConnectDialog from './mcp-connect-dialog';
import WhatsAppConnectDialog from './whatsapp-connect-dialog';
import styles from './integrations-page.module.scss';

function McpIllustration() {
  return (
    <div className={styles.netIllustration} aria-hidden="true">
      <svg className={styles.netSvg} viewBox="0 0 100 94">
        <defs>
          <linearGradient
            id="netGradClaude"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#d97757" />
            <stop offset="100%" stopColor="#9551ab" />
          </linearGradient>
          <linearGradient id="netGradGpt" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10a37f" />
            <stop offset="100%" stopColor="#9551ab" />
          </linearGradient>
          <radialGradient id="netGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(119,70,155,0.2)" />
            <stop offset="100%" stopColor="rgba(119,70,155,0)" />
          </radialGradient>
        </defs>

        <circle cx="50" cy="47" r="34" fill="url(#netGlow)" />

        <path
          id="netPathClaude"
          d="M50 24 C 28 33, 28 40, 50 44"
          fill="none"
          stroke="url(#netGradClaude)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          id="netPathGpt"
          d="M50 70 C 72 61, 72 54, 50 50"
          fill="none"
          stroke="url(#netGradGpt)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.55"
        />

        <circle r="2" fill="#9551ab">
          <animateMotion
            dur="3.6s"
            repeatCount="indefinite"
            path="M50 24 C 28 33, 28 40, 50 44"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="3.6s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      <div className={`${styles.netNode} ${styles.netNodeClaude}`}>
        <ClaudeLogo size={22} />
      </div>
      <div className={`${styles.netNode} ${styles.netNodeJiva}`}>
        <JivaLogo size={40} />
      </div>
      <div className={`${styles.netNode} ${styles.netNodeGpt}`}>
        <GptLogo size={22} />
      </div>
    </div>
  );
}

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

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <McpIllustration />
            <div className={styles.cardInfo}>
              <div className={styles.cardTitleRow}>
                <Typography variant="body1" className={styles.cardTitle}>
                  MCP
                </Typography>
                {mcpConnected ? (
                  <span className={styles.badgeConnected}>CONNECTED</span>
                ) : (
                  <span className={styles.badgeBeta}>BETA</span>
                )}
              </div>
              <Typography variant="body2" className={styles.cardDesc}>
                Connect Claude or ChatGPT to JIVA and unlock AI-powered
                marketplace intelligence.
              </Typography>
            </div>
          </div>
          <div className={styles.cardFooter}>
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
        </div>

        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.cardLogoWrap}>
              <WhatsappLogo size={22} />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardTitleRow}>
                <Typography variant="body1" className={styles.cardTitle}>
                  WhatsApp
                </Typography>
                <span className={styles.badgeNeutral}>AVAILABLE</span>
                <span className={styles.badgeConnected}>ALERTS</span>
              </div>
              <Typography variant="body2" className={styles.cardDesc}>
                Receive Anarix alerts and notifications on WhatsApp.
              </Typography>
            </div>
          </div>
          <div className={styles.cardFooter}>
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
