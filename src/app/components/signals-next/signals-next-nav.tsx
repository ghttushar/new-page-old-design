import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
import motion from '../signals/alerts/motion.module.scss';

export type NavKey = 'todos' | 'alerts' | 'meetings' | 'library' | 'workspace';

function TasksIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2.5" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M4.8 8l1.7 1.7 3.2-3.6M4.8 11.3h6.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertsIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2l6.5 11.2H1.5L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M8 6.6v3M8 11.6v.1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function MeetingsIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3" width="12" height="10.5" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function LibraryIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="7" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M11.3 3.3l2.4 1-2.7 7.9-2.4-.9" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="4.3" cy="4.6" r="0.9" fill="currentColor" />
    </svg>
  );
}

function WorkspaceIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="2" width="5" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

interface NavItem {
  key: NavKey;
  label: string;
  icon: (size?: number) => React.ReactNode;
}

const GROUPS: NavItem[][] = [
  [
    { key: 'todos', label: 'Todo', icon: (s) => <TasksIcon size={s} /> },
    { key: 'alerts', label: 'Alerts', icon: (s) => <AlertsIcon size={s} /> },
    { key: 'meetings', label: 'Meetings', icon: (s) => <MeetingsIcon size={s} /> },
  ],
  [{ key: 'library', label: 'Library', icon: (s) => <LibraryIcon size={s} /> }],
  [{ key: 'workspace', label: 'Custom Workspace', icon: (s) => <WorkspaceIcon size={s} /> }],
];

/**
 * The dedicated inner nav rail for the new Signals experience — sits immediately right
 * of the (force-collapsed) app shell sidebar, expanded with labels. Three grouped sections:
 * Todo/Alerts/Meetings (the overview+Jiva pairing — Jiva itself shows the brief whenever
 * its thread is empty, no separate nav entry needed for that), Library (generated reports/
 * presentations/images), Custom Workspace (user-built dashboards). Library and Custom
 * Workspace are placeholders for now — no generated-asset or dashboard-builder data model
 * exists yet.
 */
export function SignalsNextNav({ active, onSelect, badges }: { active: NavKey; onSelect: (key: NavKey) => void; badges?: Partial<Record<NavKey, number>> }) {
  return (
    <div style={{ width: 208, flex: 'none', borderRight: '1px solid #e6e8ec', background: '#fff', display: 'flex', flexDirection: 'column', paddingTop: 18, paddingBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '0 16px', marginBottom: 18 }}>
        <DiamondMascot size={24} />
        <span style={{ font: '700 14px/1 Inter,sans-serif', color: '#23272d' }}>Signals</span>
      </div>
      {GROUPS.map((group, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 10px' }}>
          {i > 0 && <div style={{ height: 1, background: '#eceef1', margin: '10px 6px' }} />}
          {group.map((item) => {
            const isActive = active === item.key;
            const badgeCount = badges?.[item.key] ?? 0;
            return (
              <span
                key={item.key}
                onClick={() => onSelect(item.key)}
                className={motion.pressable}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8,
                  cursor: 'pointer', background: isActive ? '#f3eefa' : 'transparent', color: isActive ? '#77469b' : '#6b7178',
                }}
              >
                <span style={{ display: 'flex', flex: 'none' }}>{item.icon(17)}</span>
                <span style={{ flex: 1, minWidth: 0, font: `${isActive ? '600' : '500'} 12.5px/1 Inter,sans-serif`, color: isActive ? '#5f3880' : '#464646', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
                {badgeCount > 0 && (
                  <span style={{ flex: 'none', padding: '1px 6px', borderRadius: 999, background: '#eef6f3', font: '700 10px/1.5 Inter,sans-serif', color: '#3f7d6a' }}>{badgeCount}</span>
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
