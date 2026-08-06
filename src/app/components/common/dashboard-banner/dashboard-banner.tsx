import { ArrowRightIcon, XIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClaudeLogo,
  GptLogo,
  JivaLogo,
} from '@/app/components/common/integration-logos/integration-logos';
import styles from './dashboard-banner.module.scss';

const BANNER_STORAGE_KEY = 'anarix_mcp_banner_dismissed';

export default function DashboardBanner() {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const dismissed = sessionStorage.getItem(BANNER_STORAGE_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(BANNER_STORAGE_KEY, 'true');
    setVisible(false);
  };

  const handleConnect = () => {
    navigate('/settings/integrations');
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={handleDismiss}
        aria-label="Dismiss banner"
      >
        <XIcon size={18} />
      </button>

      <div className={styles.network} aria-hidden="true">
        <svg
          className={styles.networkSvg}
          viewBox="0 0 260 150"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient
              id="flowGradClaude"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#d97757" />
              <stop offset="100%" stopColor="#9551ab" />
            </linearGradient>
            <linearGradient
              id="flowGradGpt"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10a37f" />
              <stop offset="100%" stopColor="#9551ab" />
            </linearGradient>
            <radialGradient id="jivaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(119,70,155,0.25)" />
              <stop offset="100%" stopColor="rgba(119,70,155,0)" />
            </radialGradient>
          </defs>

          <circle cx="130" cy="112" r="48" fill="url(#jivaGlow)" />

          <path
            id="bannerPathClaude"
            d="M74 40 C 78 84, 106 100, 124 106"
            fill="none"
            stroke="url(#flowGradClaude)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            id="bannerPathGpt"
            d="M186 40 C 182 84, 154 100, 136 106"
            fill="none"
            stroke="url(#flowGradGpt)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.55"
          />

          <circle r="2.5" fill="#9551ab">
            <animateMotion
              dur="3.6s"
              repeatCount="indefinite"
              path="M74 40 C 78 84, 106 100, 124 106"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="3.6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2.5" fill="#10a37f">
            <animateMotion
              dur="3.6s"
              begin="1.4s"
              repeatCount="indefinite"
              path="M186 40 C 182 84, 154 100, 136 106"
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

        <div className={`${styles.node} ${styles.nodeClaude}`}>
          <ClaudeLogo size={20} />
        </div>
        <div className={`${styles.node} ${styles.nodeGpt}`}>
          <GptLogo size={20} />
        </div>
        <div className={`${styles.node} ${styles.nodeJiva}`}>
          <JivaLogo size={44} />
        </div>
      </div>

      <div className={styles.textWrap}>
        <h2 className={styles.headline}>
          Give Claude &amp; ChatGPT{' '}
          <span className={styles.headlineAccent}>
            Real Marketplace Intelligence.
          </span>
        </h2>
        <p className={styles.subline}>
          JIVA securely gives Claude and ChatGPT access to marketplace
          intelligence through MCP.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.connectBtn}
          onClick={handleConnect}
        >
          Connect MCP
        </button>
        <button
          type="button"
          className={styles.learnBtn}
          onClick={handleConnect}
        >
          Learn How It Works
          <ArrowRightIcon size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}
