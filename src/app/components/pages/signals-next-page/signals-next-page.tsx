import { useState } from 'react';
import { closeDrawerWidth } from '../../layout/side-bar/side-bar-styles';
import { SignalsNextNav, type NavKey } from '../../signals-next/signals-next-nav';
import { SignalsNextOverview, type SectionKey, type EntryMeta } from '../../signals-next/signals-next-overview';
import { SignalsNextJiva } from '../../signals-next/signals-next-jiva';
import { SignalsNextLibrary } from '../../signals-next/signals-next-library';

const SECTION_KEYS: SectionKey[] = ['todos', 'alerts', 'meetings'];
function isSectionKey(key: NavKey): key is SectionKey {
  return (SECTION_KEYS as string[]).includes(key);
}

const HEADER_TITLE: Record<NavKey, string> = {
  todos: 'Signals', alerts: 'Signals', meetings: 'Signals',
  library: 'Library', workspace: 'Custom Workspace',
};

function ComingSoonPlaceholder({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 40 }}>
      <span style={{ width: 56, height: 56, borderRadius: 16, background: '#f6f4fa', color: '#77469b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
      <div style={{ font: '700 17px/1.3 Inter,sans-serif', color: '#23272d' }}>{title}</div>
      <div style={{ font: '400 13px/1.6 Inter,sans-serif', color: '#8a919b', maxWidth: 380, textAlign: 'center' as const }}>{description}</div>
    </div>
  );
}

/**
 * The rebuilt Signals experience — a dedicated inner nav rail (right next to the
 * force-collapsed app shell sidebar) with three sections: Todo/Alerts/Meetings (overview
 * + Jiva), Library, and Custom Workspace. Reachable directly at /signals-next; not yet
 * linked from the main nav.
 *
 * The nav rail fully drives the left column: picking Todo/Alerts/Meetings shows only
 * that domain's own sub-groups (assignment / category / upcoming-completed) — not all
 * three stacked at once. There's no separate "Brief" nav entry — Jiva itself shows the
 * brief whenever its thread is empty (derived in `signals-next-jiva.tsx`), so the brief
 * lives inside the chat, not as its own page.
 *
 * Jiva is rendered from one stable JSX position regardless of which of Todo/Alerts/
 * Meetings is active, so switching between them never remounts it — the conversation
 * (and therefore whether it's showing the brief or a docked chat) survives nav switches
 * instead of resetting.
 *
 * Fixed-positioned against the viewport rather than height:100% — the shared shell
 * (.app/.body/.main in app.module.scss) has no viewport-height chain of its own, it
 * normally just rides the sidebar's tall natural content height. With the sidebar
 * force-collapsed that content is short, so this page reserves its own real height.
 */
export default function SignalsNextPage() {
  const [entryContext, setEntryContext] = useState<string | null>(null);
  const [entryMeta, setEntryMeta] = useState<EntryMeta | null>(null);
  const [entryNonce, setEntryNonce] = useState(0);
  const [activeNav, setActiveNav] = useState<NavKey>('todos');
  const [actionTakenAlertIds, setActionTakenAlertIds] = useState<Set<string>>(new Set());
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  const sendToJiva = (text: string, meta?: EntryMeta) => {
    setEntryContext(text);
    setEntryMeta(meta ?? null);
    setEntryNonce((n) => n + 1);
  };

  const markAlertActioned = (id: string) => {
    setActionTakenAlertIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  };

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: closeDrawerWidth, display: 'flex', background: '#fafbfc', zIndex: 1 }}>
      <SignalsNextNav active={activeNav} onSelect={setActiveNav} badges={{ alerts: actionTakenAlertIds.size }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 'none', height: 52, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #e6e8ec', background: '#fff' }}>
          <span style={{ font: '700 15px/1 Inter,sans-serif', color: '#23272d' }}>{HEADER_TITLE[activeNav]}</span>
        </div>
        <div style={{ flex: 1, minHeight: 0, display: 'flex' }}>
          {isSectionKey(activeNav) && (
            <div style={{ flex: '0 0 30%', maxWidth: '30%', minWidth: 0, borderRight: '1px solid #e6e8ec', display: 'flex', flexDirection: 'column', background: '#fff' }}>
              <SignalsNextOverview domain={activeNav} actionTakenAlertIds={actionTakenAlertIds} selectedAlertId={selectedAlertId} onEntryPoint={sendToJiva} />
            </div>
          )}
          {isSectionKey(activeNav) && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <SignalsNextJiva entryContext={entryContext} entryNonce={entryNonce} entryMeta={entryMeta} actionTakenAlertIds={actionTakenAlertIds} onAlertActioned={markAlertActioned} onSelectAlert={setSelectedAlertId} />
            </div>
          )}
          {activeNav === 'library' && <SignalsNextLibrary />}
          {activeNav === 'workspace' && (
            <ComingSoonPlaceholder
              icon={<svg width="24" height="24" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="9" y="2" width="5" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" /><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" /></svg>}
              title="Custom Workspace"
              description="Build your own dashboard from the cards and charts you use most. This is where that builder will live."
            />
          )}
        </div>
      </div>
    </div>
  );
}
