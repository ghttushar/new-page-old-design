import { CalendarBlank, Users, ArrowRight } from '@phosphor-icons/react';
import type { Decision } from '@/constants/signals/decisions.constants';
import { formatValue } from '@/utils/signals/valueFormat';
import { MOCK_MEETING_BUNDLES } from '@/constants/signals/mockMeetings';
import styles from './meeting-card.module.scss';

interface Props {
  bundleId: string;
  title: string;
  signals: Decision[];
  selected: boolean;
  onSelect: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const hr = diff / 3_600_000;
  if (hr < 1) return `${Math.max(1, Math.round(diff / 60_000))}m ago`;
  if (hr < 24) return `${Math.round(hr)}h ago`;
  return `${Math.round(hr / 24)}d ago`;
}

export function MeetingCard({ bundleId, title, signals, selected, onSelect }: Props) {
  const total = signals.reduce((n, d) => n + (d.valueKind === 'info' ? 0 : Math.abs(d.valueCents)), 0);
  const totalStr = total > 0 ? formatValue({ cents: total, kind: 'gain' }).text : null;
  const earliest = Math.min(...signals.map((d) => d.sourceRef.ts));

  const meetingBundle = MOCK_MEETING_BUNDLES.find((b) => b.id === bundleId);
  const host = meetingBundle?.attendees[0]?.name || title;
  const attendees = meetingBundle?.attendees || [];

  return (
    <div
      className={`${styles.meetingCard} ${selected ? styles.selected : ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
    >
      {selected && <span className={styles.selectedBar} />}
      <span className={styles.icon}>
        <CalendarBlank size={16} />
      </span>
      <div className={styles.content}>
        <div className={styles.topRow}>
          <div className={styles.titleGroup}>
            <h3 className={styles.hostName}>{host}</h3>
            {attendees.length > 1 && (
              <span
                className={styles.attendeeBadge}
                onMouseEnter={(e) => {
                  const tooltip = document.createElement('div');
                  tooltip.className = styles.tooltipContent;
                  tooltip.innerHTML = attendees
                    .map((a) => `<div class="${styles.attendeeRow}"><span>${a.name}</span><span class="${styles.attendeeRole}">${a.role || ''}</span></div>`)
                    .join('');
                  document.body.appendChild(tooltip);
                  const rect = e.currentTarget.getBoundingClientRect();
                  tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                  tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
                  (e.currentTarget as any)._tooltip = tooltip;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as any)._tooltip?.remove();
                }}
              >
                <Users size={12} />
              </span>
            )}
          </div>
          <span className={styles.time}>{timeAgo(earliest)}</span>
        </div>
        <div className={styles.meta}>
          <span><span className={styles.metaValue}>{signals.length}</span> signal{signals.length === 1 ? '' : 's'}</span>
          {totalStr && <span><span className={styles.metaValueGreen}>{totalStr}</span> aggregate impact</span>}
        </div>
      </div>
      <button
        className={`${styles.openBtn} ${selected ? styles.openBtnActive : ''}`}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
      >
        Open <ArrowRight size={12} />
      </button>
    </div>
  );
}
