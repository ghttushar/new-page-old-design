import { XIcon } from '@phosphor-icons/react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
import {
  ChatGptFlowerLogo,
  ClaudeLogo,
  SlackLogo,
} from '@/app/components/common/integration-logos/integration-logos';
import styles from './dashboard-banner.module.scss';

const BANNER_STORAGE_KEY = 'anarix_mcp_banner_dismissed';
/** How long each slide stays before the next one, unless the pointer or focus is on the banner. */
const AUTO_ADVANCE_MS = 7000;
const SLIDE_COUNT = 2;

/** The Slack slide's graphic: JIVA posting into a Slack channel — typing, then the message, then an Approve chip. */
function SlackMessageVisual() {
  return (
    <div className={styles.slackCluster} aria-hidden="true">
      <span className={styles.slackTile}>
        <SlackLogo size={20} />
      </span>
      <span className={styles.visualLink}>
        <span className={styles.signalDot} />
      </span>
      <div className={styles.msgCard}>
        <span className={styles.msgAvatar}>
          <DiamondMascot size={14} />
        </span>
        <div className={styles.msgBody}>
          <div className={styles.msgMeta}>
            <b>JIVA</b>
            <span className={styles.msgApp}>APP</span>
            <span className={styles.msgChannel}>#alerts</span>
          </div>
          <div className={styles.msgStage}>
            <span className={styles.msgTyping}>
              <i />
              <i />
              <i />
            </span>
            <span className={styles.msgText}>
              Profit down 12% · 14 ASINs
              <span className={styles.msgApprove}>Approve</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardBanner() {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dismissed = sessionStorage.getItem(BANNER_STORAGE_KEY);
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  // Rotate the slides, but never while the user is reading or using one, and not at all for reduced motion.
  useEffect(() => {
    if (!visible || paused) {
      return undefined;
    }
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDE_COUNT), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(t);
  }, [visible, paused, index]);

  const handleDismiss = () => {
    sessionStorage.setItem(BANNER_STORAGE_KEY, 'true');
    setVisible(false);
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

  const slideClass = (i: number) => `${styles.slide} ${i === index ? styles.slideActive : ''}`;

  return (
    <div
      ref={bannerRef}
      className={styles.banner}
      onPointerMove={handlePointerMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="What's new"
    >
      <span className={styles.shine} aria-hidden="true" />

      <div className={styles.track}>
        {/* Slide 1: MCP */}
        <div className={slideClass(0)} aria-hidden={index !== 0} role="group" aria-roledescription="slide" aria-label="1 of 2">
          <div className={styles.visualCluster} aria-hidden="true">
            <ClaudeLogo size={27} />
            <span className={styles.visualLink}>
              <span className={styles.signalDot} />
            </span>
            <DiamondMascot size={25} />
            <span className={styles.visualLink}>
              <span className={`${styles.signalDot} ${styles.signalDotOffset}`} />
            </span>
            <ChatGptFlowerLogo size={29} />
          </div>

          <div className={styles.textWrap}>
            <div className={styles.headlineRow}>
              <h2 className={styles.headline}>
                Connect Claude &amp; ChatGPT to JIVA
              </h2>
              <span className={styles.badgeNew}>New</span>
            </div>
            <p className={styles.subline}>
              Real marketplace intelligence through MCP. Available on Diamond and
              above.
            </p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.connectBtn}
              tabIndex={index === 0 ? 0 : -1}
              onClick={() => navigate('/settings/integrations')}
            >
              Connect MCP
            </button>
          </div>
        </div>

        {/* Slide 2: the workspace bot (Slack for now) */}
        <div className={slideClass(1)} aria-hidden={index !== 1} role="group" aria-roledescription="slide" aria-label="2 of 2">
          <SlackMessageVisual />

          <div className={styles.textWrap}>
            <div className={styles.headlineRow}>
              <h2 className={styles.headline}>Bring JIVA into Slack</h2>
              <span className={styles.badgeNew}>New</span>
            </div>
            <p className={styles.subline}>
              Alerts, answers and approvals right in your channels. Teams and
              Google Chat coming soon.
            </p>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.connectBtn}
              tabIndex={index === 1 ? 0 : -1}
              onClick={() => navigate('/settings/integrations', { state: { highlight: 'workspace' } })}
            >
              Connect
            </button>
          </div>
        </div>
      </div>

      <div className={styles.dots}>
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
            aria-label={`Show banner ${i + 1} of ${SLIDE_COUNT}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
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
