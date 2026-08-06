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

const PARTICLE_COLOR = '#9551ab';

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
          viewBox="0 0 320 200"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="flowGradClaude" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97757" />
              <stop offset="100%" stopColor="#9551ab" />
            </linearGradient>
            <linearGradient id="flowGradGpt" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10a37f" />
              <stop offset="100%" stopColor="#9551ab" />
            </linearGradient>
            <radialGradient id="jivaGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(119,70,155,0.35)" />
              <stop offset="100%" stopColor="rgba(119,70,155,0)" />
            </radialGradient>
          </defs>

          <circle cx="160" cy="140" r="64" fill="url(#jivaGlow)" />

          <path
            id="pathClaude"
            d="M76 34 C 70 84, 106 116, 148 132"
            fill="none"
            stroke="url(#flowGradClaude)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            id="pathGpt"
            d="M244 34 C 250 84, 214 116, 172 132"
            fill="none"
            stroke="url(#flowGradGpt)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.55"
          />

          <circle r="3.2" fill={PARTICLE_COLOR}>
            <animateMotion
              dur="3.6s"
              repeatCount="indefinite"
              path="M76 34 C 70 84, 106 116, 148 132"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="3.6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2.4" fill="#d97757">
            <animateMotion
              dur="3.6s"
              begin="1.2s"
              repeatCount="indefinite"
              path="M76 34 C 70 84, 106 116, 148 132"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="3.6s"
              begin="1.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="3.2" fill={PARTICLE_COLOR}>
            <animateMotion
              dur="3.6s"
              repeatCount="indefinite"
              path="M244 34 C 250 84, 214 116, 172 132"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="3.6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle r="2.4" fill="#10a37f">
            <animateMotion
              dur="3.6s"
              begin="1.4s"
              repeatCount="indefinite"
              path="M244 34 C 250 84, 214 116, 172 132"
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
          <ClaudeLogo size={36} />
        </div>
        <div className={`${styles.node} ${styles.nodeGpt}`}>
          <GptLogo size={36} />
        </div>
        <div className={`${styles.node} ${styles.nodeJiva}`}>
          <JivaLogo size={72} />
        </div>

        <span className={`${styles.nodeLabel} ${styles.labelClaude}`}>Claude</span>
        <span className={`${styles.nodeLabel} ${styles.labelGpt}`}>ChatGPT</span>
      </div>

      <div className={styles.textWrap}>
        <h2 className={styles.headline}>
          Give Claude &amp; ChatGPT{' '}
          <span className={styles.headlineAccent}>Real Marketplace Intelligence.</span>
        </h2>
        <p className={styles.subline}>
          JIVA securely gives Claude and ChatGPT access to marketplace
          intelligence through MCP.
        </p>
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
    </div>
  );
}
