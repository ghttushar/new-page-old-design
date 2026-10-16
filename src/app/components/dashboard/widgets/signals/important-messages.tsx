import { CaretDownIcon, EnvelopeSimpleIcon, FileTextIcon, GoogleLogoIcon, SlackLogoIcon } from '@phosphor-icons/react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DASHBOARD_MESSAGES, type DashboardMessage } from '@/constants/dashboard/dashboard-messages.mock';
import type { WidgetBodyProps, WidgetConfig } from '../../dashboard.types';
import styles from '../../dashboard.module.scss';

type Channel = 'all' | DashboardMessage['channel'];

const CHANNEL_ICON = { email: EnvelopeSimpleIcon, slack: SlackLogoIcon, workspace: GoogleLogoIcon } as const;
const CHANNEL_NAME = { email: 'Email', slack: 'Slack', workspace: 'Google Workspace' } as const;

/** Read state lives in the widget's settings, so it survives a reload. */
export function isRead(m: DashboardMessage, config: WidgetConfig): boolean {
  const read = (config.readIds as string[]) ?? [];
  const unread = (config.unreadIds as string[]) ?? [];
  if (read.includes(m.id)) return true;
  if (unread.includes(m.id)) return false;
  return !m.unread;
}

export function messagesFor(config: WidgetConfig): DashboardMessage[] {
  const channel = (config.channel as Channel) ?? 'all';
  return DASHBOARD_MESSAGES
    .filter((m) => channel === 'all' || m.channel === channel)
    .filter((m) => !config.unreadOnly || !isRead(m, config));
}

function MessageRow({ m, read, open, onToggle, onRead, preview }: {
  m: DashboardMessage; read: boolean; open: boolean; onToggle: () => void; onRead: (read: boolean) => void; preview?: boolean;
}) {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const Icon = CHANNEL_ICON[m.channel];
  return (
    <li className={`${styles.msg}${open ? ` ${styles.msgOpen}` : ''}`}>
      <button type="button" className={styles.msgHead} aria-expanded={open} onClick={onToggle} tabIndex={preview ? -1 : 0}>
        <span className={styles.msgIcon} title={`${CHANNEL_NAME[m.channel]}, ${m.thread}`}><Icon size={15} /></span>
        <span className={styles.msgText}>
          <span className={styles.msgTop}>
            <span className={`${styles.msgSender}${read ? '' : ` ${styles.msgUnread}`}`}>{m.sender}</span>
            <span className={styles.msgTime}>{m.time}</span>
          </span>
          <span className={`${styles.msgSubject}${read ? '' : ` ${styles.msgUnread}`}`}>{m.subject}</span>
        </span>
        <CaretDownIcon size={12} weight="bold" className={`${styles.msgCaret}${open ? ` ${styles.caretOpen}` : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className={styles.msgBodyWrap}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 0.8, 0.3, 1] }}
          >
            <div className={styles.msgBody}>
              <span className={styles.msgFrom}>{m.org ? `${m.org}, ` : ''}{m.thread}</span>
              {m.body.map((p) => <p key={p}>{p}</p>)}
              {m.attachments && (
                <ul className={styles.msgFiles}>
                  {m.attachments.map((a) => (
                    <li key={a.name}><FileTextIcon size={14} /><span>{a.name}</span><small>{a.size}</small></li>
                  ))}
                </ul>
              )}
              <div className={styles.msgActions}>
                <button type="button" className={styles.textBtn} onClick={() => navigate('/signals')}>Open in Signals</button>
                <button type="button" className={styles.textBtnMuted} onClick={() => onRead(!read)}>{read ? 'Mark as unread' : 'Mark as read'}</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

/** Important messages. Each one opens on its own, so several can be open at once. */
export default function ImportantMessages({ config, onConfig, preview }: WidgetBodyProps) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const list = messagesFor(config);
  const rows = (config.rows as string) ?? '5';
  const limit = rows === 'all' || showAll ? list.length : Number(rows);

  const setRead = (id: string, read: boolean) => {
    const readIds = ((config.readIds as string[]) ?? []).filter((x) => x !== id);
    const unreadIds = ((config.unreadIds as string[]) ?? []).filter((x) => x !== id);
    onConfig(read ? { readIds: [...readIds, id], unreadIds } : { readIds, unreadIds: [...unreadIds, id] });
  };

  const toggle = (id: string) => {
    setOpen((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
    const m = list.find((x) => x.id === id);
    if (m && !isRead(m, config) && !open.has(id)) setRead(id, true);
  };

  if (list.length === 0) {
    return <div className={styles.empty}>{config.unreadOnly ? 'Everything here is read.' : 'No messages on this channel.'}</div>;
  }

  return (
    <ul className={`${styles.msgList} ${styles.scrollArea}`}>
      {list.slice(0, limit).map((m) => (
        <MessageRow
          key={m.id} m={m} read={isRead(m, config)} open={open.has(m.id)} preview={preview}
          onToggle={() => toggle(m.id)} onRead={(r) => setRead(m.id, r)}
        />
      ))}
      {limit < list.length && (
        <li><button type="button" className={styles.listMore} onClick={() => setShowAll(true)}>Show {list.length - limit} more</button></li>
      )}
    </ul>
  );
}
