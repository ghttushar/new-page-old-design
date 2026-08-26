import { useState, type MouseEvent as ReactMouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, MenuItem } from '@mui/material';
import {
  ArrowRight,
  WarningCircle,
  DotsThree,
  ShareNetwork,
  Clock,
  Prohibit,
  Link as LinkIcon,
  SlackLogo,
  MicrosoftTeamsLogo,
  Envelope,
  Check,
  CaretLeft,
  Timer,
} from '@phosphor-icons/react';
import styles from './decision-card.module.scss';
import type { Decision } from '@/constants/signals/decisions.constants';
import { formatValue } from '@/utils/signals/valueFormat';
import { timeAgo } from '@/utils/signals/timeAgo';
import { SourcePill } from '../chips/source-pill';
import { snoozeDecision, rejectDecision } from '@/redux/slices/signals/signals.slice';

interface DecisionCardProps {
  decision: Decision;
  selected: boolean;
  onSelect: () => void;
}

const SNOOZE_MS: Record<string, number> = {
  '1h': 3600000,
  tomorrow: 72000000,
  next_week: 604800000,
};

function actionDays(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return (Math.abs(h) % 4) + 1;
}

const SEVERITY_CLASS: Record<string, string> = {
  critical: styles.severityCritical,
  opportunity: styles.severityOpportunity,
  fyi: styles.severityFyi,
};

const VALUE_KIND_CLASS: Record<string, string> = {
  at_risk: styles.valueAtRisk,
  gain: styles.valueGain,
  cost: styles.valueCost,
  info: styles.valueInfo,
};

export function DecisionCard({ decision: d, selected, onSelect }: DecisionCardProps) {
  const dispatch = useDispatch();
  const isDone = d.status === 'completed' || d.status === 'rejected' || d.status === 'in_flight' || d.status === 'with_aan';
  const f = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuView, setMenuView] = useState<'root' | 'share' | 'snooze'>('root');
  const [copied, setCopied] = useState(false);

  const openMenu = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMenuView('root');
    setCopied(false);
    setMenuAnchor(e.currentTarget);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setCopied(false);
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const snooze = (ms: number) => {
    dispatch(snoozeDecision({ id: d.id, until: Date.now() + ms }));
    closeMenu();
  };

  const dismiss = () => {
    dispatch(rejectDecision(d.id));
    closeMenu();
  };

  return (
    <div
      className={`${styles.decisionCard} ${selected ? styles.selected : ''} ${isDone ? styles.done : ''} ${SEVERITY_CLASS[d.severity] || ''}`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
    >
      {selected && <span className={styles.selectedBar} />}
      <div className={styles.cardBody}>
        <div className={`${styles.valueHeadline} ${VALUE_KIND_CLASS[d.valueKind] || ''}`}>{f.text}</div>
        <div className={styles.valueCaption}>{d.valueCaption}</div>
        <div className={styles.actionDeadline}><Timer size={10} /> Take action within {actionDays(d.id)} days</div>
        <div className={styles.insight}>{d.insight}</div>
        <div className={styles.chipsRow}>
          <SourcePill decision={d} size="sm" />
          {d.severity === 'critical' && (
            <span className={styles.criticalBadge}>
              <WarningCircle size={10} weight="fill" /> Critical
            </span>
          )}
        </div>
      </div>
      <div className={styles.cardActions}>
        <button className={styles.reviewBtn} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          Review <ArrowRight size={12} weight="bold" />
        </button>
        <div className={styles.cardBottomRow}>
          <span className={styles.cardTime}>{timeAgo(d.createdAt)}</span>
          <button className={styles.menuBtn} onClick={openMenu} aria-label="More actions">
            <DotsThree size={16} weight="bold" />
          </button>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={closeMenu}
            slotProps={{ paper: { sx: { width: 200, mt: 0.5 } } }}
          >
            {menuView === 'share' ? (
              <>
                <MenuItem onClick={() => setMenuView('root')} sx={{ gap: 1.5, fontSize: '1.2rem', color: '#9a9a9a' }}>
                  <CaretLeft size={16} /> Back
                </MenuItem>
                <MenuItem onClick={copyLink} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
                  {copied ? <Check size={16} color="#429488" /> : <LinkIcon size={16} />}
                  {copied ? 'Copied!' : 'Copy link'}
                </MenuItem>
                <MenuItem onClick={closeMenu} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
                  <SlackLogo size={16} /> Slack
                </MenuItem>
                <MenuItem onClick={closeMenu} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
                  <MicrosoftTeamsLogo size={16} /> Teams
                </MenuItem>
                <MenuItem onClick={closeMenu} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
                  <Envelope size={16} /> Email
                </MenuItem>
              </>
            ) : menuView === 'snooze' ? (
              <>
                <MenuItem onClick={() => setMenuView('root')} sx={{ gap: 1.5, fontSize: '1.2rem', color: '#9a9a9a' }}>
                  <CaretLeft size={16} /> Back
                </MenuItem>
                <MenuItem onClick={() => snooze(SNOOZE_MS['1h'])} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
                  <Clock size={16} /> 1 hour
                </MenuItem>
                <MenuItem onClick={() => snooze(SNOOZE_MS.tomorrow)} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
                  <Clock size={16} /> Tomorrow
                </MenuItem>
                <MenuItem onClick={() => snooze(SNOOZE_MS.next_week)} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
                  <Clock size={16} /> Next week
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => setMenuView('share')} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
                  <ShareNetwork size={16} /> Share
                </MenuItem>
                <MenuItem onClick={() => setMenuView('snooze')} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
                  <Clock size={16} /> Snooze
                </MenuItem>
                <MenuItem onClick={dismiss} sx={{ gap: 1.5, fontSize: '1.2rem' }}>
                  <Prohibit size={16} /> Dismiss
                </MenuItem>
              </>
            )}
          </Menu>
        </div>
      </div>
    </div>
  );
}
