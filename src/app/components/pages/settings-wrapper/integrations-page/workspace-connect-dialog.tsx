import { CaretDownIcon, SpinnerGapIcon, XIcon } from '@phosphor-icons/react';
import { Dialog, DialogContent } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { showSuccessToastMessage } from 'src/redux/slices/notifications/toast-message.slice';
import { useAppDispatch } from '@/redux/hooks';
import {
  DiscordLogo,
  GoogleLogo,
  SlackLogo,
  TeamsLogo,
  ZoomLogo,
} from '@/app/components/common/integration-logos/integration-logos';
import styles from './workspace-connect-dialog.module.scss';

// Workspace AI: JIVA as a bot in the chat tools a team already uses. A mockup flow — Connect never leaves the app; it
// waits a moment and the workspace counts as connected, with Manage → Disconnect to take it back.

const CONNECT_DELAY_MS = 700;

export interface WorkspaceApp {
  id: string;
  name: string;
  desc: string;
  Logo: (p: { size?: number }) => JSX.Element;
}

export const WORKSPACE_APPS: WorkspaceApp[] = [
  { id: 'slack', name: 'Slack', desc: 'Alerts, answers and approvals in your channels', Logo: SlackLogo },
  { id: 'teams', name: 'Microsoft Teams', desc: 'Chat with JIVA in Teams chats and channels', Logo: TeamsLogo },
  { id: 'google', name: 'Google Workspace', desc: 'JIVA in Google Chat spaces', Logo: GoogleLogo },
  { id: 'discord', name: 'Discord', desc: 'Updates and alerts in your Discord server', Logo: DiscordLogo },
  { id: 'zoom', name: 'Zoom Team Chat', desc: 'Alerts and answers in Zoom Team Chat', Logo: ZoomLogo },
];

/** Three overlapping app marks: the Workspace AI tile on the Integrations card and in this popup's header. */
export function WorkspaceStack({ size = 18 }: { size?: number }) {
  const apps = WORKSPACE_APPS.slice(0, 3);
  return (
    <span className={styles.stack} style={{ ['--stack-size' as string]: `${size + 8}px` }}>
      {apps.map(({ id, Logo }) => (
        <span key={id} className={styles.stackItem}>
          <Logo size={size} />
        </span>
      ))}
    </span>
  );
}

function WorkspaceRow({ app, connected, onConnect, onDisconnect }: {
  app: WorkspaceApp; connected: boolean; onConnect: () => void; onDisconnect: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const connect = () => {
    if (busy) {
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      onConnect();
    }, CONNECT_DELAY_MS);
  };

  const { Logo } = app;
  return (
    <li className={styles.row}>
      <span className={styles.rowLogo}>
        <Logo size={22} />
      </span>
      <div className={styles.rowText}>
        <span className={styles.rowName}>{app.name}</span>
        {connected ? (
          <span className={styles.rowConnected}>
            <i />
            Connected
          </span>
        ) : (
          <span className={styles.rowDesc}>{app.desc}</span>
        )}
      </div>
      <div className={styles.rowAction} ref={menuRef}>
        {connected ? (
          <>
            <button
              type="button"
              className={styles.whiteBtn}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              Manage
              <CaretDownIcon size={12} />
            </button>
            {menuOpen && (
              <div className={styles.menu} role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  onClick={() => {
                    setMenuOpen(false);
                    onDisconnect();
                  }}
                >
                  Disconnect
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            className={styles.whiteBtn}
            onClick={connect}
            disabled={busy}
            aria-label={`Connect ${app.name}`}
          >
            {busy ? <SpinnerGapIcon size={14} className={styles.spin} /> : 'Connect'}
          </button>
        )}
      </div>
    </li>
  );
}

export default function WorkspaceConnectDialog({ open, onClose, connected, onChange }: {
  open: boolean;
  onClose: () => void;
  /** Ids of the connected workspaces. */
  connected: Set<string>;
  onChange: (next: Set<string>) => void;
}) {
  const dispatch = useAppDispatch();
  const setConnected = (id: string, on: boolean) => {
    const next = new Set(connected);
    if (on) {
      next.add(id);
    } else {
      next.delete(id);
    }
    onChange(next);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ className: styles.dialogPaper, sx: { borderRadius: '0.8rem' } }}
    >
      <div className={styles.dialogHeader}>
        <div className={styles.dialogHeaderLeft}>
          <span className={styles.dialogIconWrap}>
            <WorkspaceStack size={11} />
          </span>
          <div>
            <h2 className={styles.dialogTitle}>Connect a workspace</h2>
            <p className={styles.dialogCaption}>
              Bring JIVA into the tools your team already chats in. You can connect more than one.
            </p>
          </div>
        </div>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <XIcon size={18} />
        </button>
      </div>

      <DialogContent className={styles.dialogContent}>
        <ul className={styles.list}>
          {WORKSPACE_APPS.map((app) => (
            <WorkspaceRow
              key={app.id}
              app={app}
              connected={connected.has(app.id)}
              onConnect={() => {
                setConnected(app.id, true);
                dispatch(showSuccessToastMessage({
                  title: `${app.name} connected`,
                  description: 'JIVA can now post alerts and answer questions there.',
                }));
              }}
              onDisconnect={() => setConnected(app.id, false)}
            />
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
