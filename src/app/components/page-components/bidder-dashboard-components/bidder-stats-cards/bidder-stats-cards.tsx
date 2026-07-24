import SkeletonComponent from '@/app/components/common/skeleton/skeleton';
import { getBidderStatCards } from '@/constants/bidder-dashboard.constants';
import { IBidderDashboardStats } from '@/interfaces/bidder-dashboard.interface';
import { formatNum } from '@/utils';
import React from 'react';
import styles from './bidder-stats-cards.module.scss';

interface IBidderStatsCardsProps {
  stats: IBidderDashboardStats;
  isLoading: boolean;
}

const BidderStatsCards: React.FC<IBidderStatsCardsProps> = ({
  stats,
  isLoading,
}) => {
  const statCards = getBidderStatCards(stats);

  if (isLoading) {
    return (
      <div className={styles.statsContainer}>
        {Array.from({ length: statCards.length }).map((_, index) => (
          <SkeletonComponent height={'14rem'} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.statsContainer}>
      {statCards.map((card, index) => {
        const Icon = card.Icon;
        return (
          <div
            key={index}
            className={styles.statCard}
            style={{ backgroundColor: card.bgColor }}
          >
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper} style={{ color: card.color }}>
                <Icon size={24} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardSubtitle}>{card.subtitle}</p>
              </div>
            </div>
            <div className={styles.cardValue}>
              <span style={{ color: card.color }}>
                {formatNum(card.getValue(stats), false)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BidderStatsCards;
