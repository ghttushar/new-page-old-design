import { WrenchIcon } from '@phosphor-icons/react';
import React from 'react';
import styles from './maintenance-page.module.scss';

const MaintenancePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.particles}>
        {[...Array(20)].map((_, i) => (
          <div key={i} className={styles.particle} style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }} />
        ))}
      </div>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <WrenchIcon size={48} weight="fill" className={styles.icon} />
        </div>
        <h1 className={styles.title}>Website Under Maintenance</h1>
        <p className={styles.description}>
          We're sprucing things up behind the scenes.<br />
          Please try again in some time.
        </p>
        <a href="/" className={styles.refreshLink} onClick={(e) => { e.preventDefault(); window.location.reload(); }}>
          Refresh Page
        </a>
      </div>
    </div>
  );
};

export default MaintenancePage;
