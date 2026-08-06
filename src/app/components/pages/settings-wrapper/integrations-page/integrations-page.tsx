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

const NET_PARTICLE = '#9551ab';

function McpIllustration() {
  return (
    <div className={styles.netIllustration} aria-hidden="true">
      <svg className={styles.netSvg} viewBox="0 0 120 100">
        <defs>
          <linearGradient id="netGradClaude" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d97757" />
            <stop offset="100%" stopColor="#9551ab" />
          </linearGradient>
          <linearGradient id="netGradGpt" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10a37f" />
            <stop offset="100%" stopColor="#9551ab" />
          </linearGradient>
          <radialGradient id="netGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(119,70,155,0.28)" />
            <stop offset="100%" stopColor="rgba(119,70,155,0)" />
          </radialGradient>
        </defs>

        <circle cx="60" cy="50" r="40" fill="url(#netGlow)" />

        <path
          id="netPathClaude"
          d="M60 26 C 34 36, 34 44, 58 48"
          fill="none"
          stroke="url(#netGradClaude)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          id="netPathGpt"
          d="M60 74 C 86 64, 86 56, 62 52"
          fill="none"
          stroke="url(#netGradGpt)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />

        <circle r="2.6" fill={NET_PARTICLE}>
          <animateMotion
            dur="3.6s"
            repeatCount="indefinite"
            path="M60 26 C 34 36, 34 44, 58 48"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="3.6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle r="2.6" fill="#10a37f">
          <animateMotion
            dur="3.6s"
            begin="1.4s"
            repeatCount="indefinite"
            path="M60 74 C 86 64, 86 56, 62 52"
          />
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur="3.6s"
            begin="1.4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      <div className={`${styles.netNode} ${styles.netNodeClaude}`}>
        <ClaudeLogo size={24} />
      </div>
      <div className={`${styles.netNode} ${styles.netNodeJiva}`}>
        <JivaLogo size={44} />
      </div>
      <div className={`${styles.netNode} ${styles.netNodeGpt}`}>
        <GptLogo size={24} />
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
                  <span className={styles.badgeAlerts}>CONNECTED</span>
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
                <SpinnerGapIcon size={18} className={styles.spin} />
              ) : (
                'Connect'
              )}
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardTop}>
            <div className={styles.cardLogoWrap}>
              <WhatsappLogo size={40} />
            </div>
            <div className={styles.cardInfo}>
              <div className={styles.cardTitleRow}>
                <Typography variant="body1" className={styles.cardTitle}>
                  WhatsApp
                </Typography>
                <span className={styles.badgeNeutral}>AVAILABLE</span>
                <span className={styles.badgeAlerts}>ALERTS</span>
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
                <SpinnerGapIcon size={18} className={styles.spin} />
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
