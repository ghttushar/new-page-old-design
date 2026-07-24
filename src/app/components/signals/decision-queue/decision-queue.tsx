import { useState, useMemo } from 'react';
import styles from './decision-queue.module.scss';
import { DecisionCard } from '../decision-card/decision-card';
import { EmptyState } from '../empty-state/empty-state';
import type { Decision } from '@/constants/signals/decisions.constants';

interface DecisionQueueProps {
  decisions: Decision[];
  activeTab: string;
  searchQuery: string;
  onTabChange: (tab: string) => void;
  onSearchChange: (q: string) => void;
  selectedId: string | null;
  onSelectDecision: (id: string) => void;
  onApproveDecision: (id: string) => void;
  isMeetingsTab: boolean;
}

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'needs_me', label: 'Needs me' },
  { key: 'in_flight', label: 'In flight' },
  { key: 'done', label: 'Done' },
  { key: 'meetings', label: 'Meetings' },
];

function filterDecisions(decisions: Decision[], tab: string, query: string): Decision[] {
  const q = query.trim().toLowerCase();
  let pool = decisions;

  if (tab === 'needs_me') pool = pool.filter((d) => d.status === 'open');
  else if (tab === 'in_flight') pool = pool.filter((d) => d.status === 'in_flight' || d.status === 'with_aan');
  else if (tab === 'done') pool = pool.filter((d) => d.status === 'completed' || d.status === 'rejected');
  else if (tab === 'meetings') pool = pool.filter((d) => d.meetingRef);

  if (q) {
    pool = pool.filter((d) =>
      `${d.insight} ${d.domain} ${d.sourceRef.label}`.toLowerCase().includes(q)
    );
  }

  return pool.sort((a, b) => b.createdAt - a.createdAt);
}

export function DecisionQueue({
  decisions, activeTab, searchQuery, onTabChange, onSearchChange,
  selectedId, onSelectDecision, onApproveDecision, isMeetingsTab,
}: DecisionQueueProps) {
  const filtered = useMemo(() => filterDecisions(decisions, activeTab, searchQuery), [decisions, activeTab, searchQuery]);
  const counts = useMemo(() => {
    const all = decisions.length;
    const needsMe = decisions.filter((d) => d.status === 'open').length;
    const inFlight = decisions.filter((d) => d.status === 'in_flight' || d.status === 'with_aan').length;
    const done = decisions.filter((d) => d.status === 'completed' || d.status === 'rejected').length;
    const meetings = decisions.filter((d) => d.meetingRef).length;
    return { all, needs_me: needsMe, in_flight: inFlight, done, meetings };
  }, [decisions]);

  return (
    <div className={styles.decisionQueue}>
      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="Search signals..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.active : ''}`}
              onClick={() => onTabChange(tab.key)}
            >
              {tab.label}
              <span className={styles.count}>{counts[tab.key as keyof typeof counts] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.scrollArea}>
        {filtered.length === 0 ? (
          <EmptyState variant={searchQuery ? 'search' : 'default'} />
        ) : (
          filtered.map((d) => (
            <DecisionCard
              key={d.id}
              decision={d}
              selected={selectedId === d.id}
              onSelect={() => onSelectDecision(d.id)}
              onApprove={onApproveDecision}
            />
          ))
        )}
      </div>
    </div>
  );
}