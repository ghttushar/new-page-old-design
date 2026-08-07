import { XIcon } from '@phosphor-icons/react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChatGptFlowerLogo,
  ClaudeLogo,
  JivaJLogo,
} from '@/app/components/common/integration-logos/integration-logos';
import styles from './dashboard-banner.module.scss';

const BANNER_STORAGE_KEY = 'anarix_mcp_banner_dismissed';

export default function DashboardBanner() {
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);
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

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = bannerRef.current;
    if (!el) {
      return;
    }
    const rect = el.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    el.style.setProperty('--mx', nx.toFixed(3));
    el.style.setProperty('--my', ny.toFixed(3));
    el.style.setProperty('--sx', `${((nx + 1) * 50).toFixed(1)}%`);
    el.style.setProperty('--sy', `${((ny + 1) * 50).toFixed(1)}%`);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      ref={bannerRef}
      className={styles.banner}
      onPointerMove={handlePointerMove}
    >
      <span className={styles.shine} aria-hidden="true" />

      <div className={styles.visualCluster} aria-hidden="true">
        <ClaudeLogo size={36} />
        <span className={styles.visualLink}>
          <span className={styles.signalDot} />
        </span>
        <JivaJLogo size={33} />
        <span className={styles.visualLink}>
          <span className={`${styles.signalDot} ${styles.signalDotOffset}`} />
        </span>
        <ChatGptFlowerLogo size={39} />
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