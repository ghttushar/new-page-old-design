import { ArrowRightIcon, LightningIcon, XIcon } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleLearnMore = () => {
    navigate('/settings/integrations');
  };

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.banner}>
      <div className={styles.iconWrap}>
        <LightningIcon size={18} weight="fill" />
      </div>
      <div className={styles.textWrap}>
        <div className={styles.title}>Connect MCP to enable AI-powered workflows</div>
        <div className={styles.subtitle}>
          Let your AI assistant access your marketplace intelligence.
        </div>
      </div>
      <button
        type="button"
        className={styles.learnMore}
        onClick={handleLearnMore}
      >
        Learn More
        <ArrowRightIcon size={14} weight="bold" />
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
  );
}