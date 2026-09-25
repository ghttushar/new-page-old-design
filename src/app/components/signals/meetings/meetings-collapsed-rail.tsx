import { ChevronDownIcon } from '../alerts/icons';
import motion from '../alerts/motion.module.scss';

/** Meetings' collapsed design: a rotated sideways label with a count badge — reads like a closed drawer tab, distinct from Alerts' dot index and Work-station's avatar stack. */
export function MeetingsCollapsedRail({ count, onExpand }: { count: number; onExpand: () => void }) {
  return (
    <div
      onClick={onExpand}
      className={motion.cardHover}
      title="Expand meetings"
      style={{ width: 52, flex: 'none', height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0 10px', cursor: 'pointer' }}
    >
      <span style={{ width: 24, height: 24, borderRadius: 7, background: '#f1eefc', color: '#7c4dff', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 11px/1 Inter,sans-serif', flex: 'none' }}>
        {count}
      </span>
      <span style={{ writingMode: 'vertical-rl' as const, transform: 'rotate(180deg)', font: '700 11px/1.4 Inter,sans-serif', letterSpacing: '0.1em', color: '#5c4a8a', textTransform: 'uppercase' as const }}>
        Meetings
      </span>
      <span style={{ display: 'flex', color: '#9aa0a8', transform: 'rotate(-90deg)' }}><ChevronDownIcon size={10} /></span>
    </div>
  );
}
