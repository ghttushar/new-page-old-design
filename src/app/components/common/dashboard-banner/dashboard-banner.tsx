import { LinkIcon, XIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClaudeLogo,
  GptLogo,
  JivaJLogo,
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
      <div className={styles.logoChain} aria-hidden="true">
        <div className={styles.logoItem}>
          <JivaJLogo size={24} />
        </div>
        <LinkIcon size={14} className={styles.chainLink} />
        <div className={styles.logoItem}>
          <ClaudeLogo size={26} />
        </div>
        <span className={styles.chainLine} />
        <div className={styles.logoItem}>
          <GptLogo size={28} />
        </div>
      </div>

      <div className={styles.textWrap}>
        <div className={styles.headlineRow}>
          <h2 className={styles.headline}>
            Connect Claude &amp; ChatGPT to JIVA
          </h2>
          <span className={styles.badgeNew}>NEW</span>
        </div>
        <p className={styles.subline}>
          Real marketplace intelligence through MCP. Available on Diamond and
          above.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.learnBtn}
          onClick={handleConnect}
        >
          See How It Works
        </button>
        <button
          type="button"
          className={styles.connectBtn}
          onClick={handleConnect}
        >
          Connect MCP
        </button>
      </div>

      <button
        type="button"
        className={styles.closeBtn}
        onClick={handleDismiss}
        aria-label="Dismiss banner"
      >
        <XIcon size={14} />
      </button>
    </div>
  );
}
