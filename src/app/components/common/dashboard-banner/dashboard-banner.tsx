import {
  ArrowRightIcon,
  ChatCircleDotsIcon,
  LightningIcon,
  SparkleIcon,
  XIcon,
} from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './dashboard-banner.module.scss';

const BANNER_STORAGE_KEY = 'anarix_mcp_banner_dismissed';

const AGENT_CHAIN = [
  {
    key: 'jiva',
    name: 'JIVA',
    icon: ChatCircleDotsIcon,
    color: '#ffffff',
    bg: '#77469b',
  },
  {
    key: 'claude',
    name: 'Claude',
    icon: ChatCircleDotsIcon,
    color: '#ffffff',
    bg: '#d97706',
  },
  {
    key: 'codex',
    name: 'Codex',
    icon: SparkleIcon,
    color: '#ffffff',
    bg: '#10a37f',
  },
  {
    key: 'anarix',
    name: 'Anarix',
    icon: LightningIcon,
    color: '#ffffff',
    bg: '#2563eb',
  },
];

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

  const handleLearnMore = () => {
    navigate('/settings/integrations');
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <div className={styles.iconChain}>
        {AGENT_CHAIN.map((agent, i) => {
          const AgentIcon = agent.icon;
          return (
            <div className={styles.chainItem} key={agent.key}>
              <div
                className={styles.chainIcon}
                style={{ background: agent.bg, color: agent.color }}
                title={agent.name}
              >
                <AgentIcon size={16} weight="fill" />
              </div>
              {i < AGENT_CHAIN.length - 1 && (
                <div className={styles.chainConnector}>
                  <span className={styles.chainConnectorLine} />
                  <ArrowRightIcon
                    size={10}
                    weight="bold"
                    className={styles.chainConnectorArrow}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.textWrap}>
        <div className={styles.title}>
          Connect MCP via JIVA
          <span className={styles.newBadge}>NEW</span>
        </div>
        <div className={styles.subtitle}>
          Connect Claude or ChatGPT to access your marketplace intelligence.
        </div>
      </div>
      <div className={styles.rightActions}>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={handleLearnMore}
        >
          See How It Works
        </button>
        <button
          type="button"
          className={styles.connectBtn}
          onClick={handleLearnMore}
        >
          Connect MCP
        </button>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleDismiss}
          aria-label="Dismiss banner"
        >
          <XIcon size={16} />
        </button>
      </div>
    </div>
  );
}
