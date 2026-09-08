import { useState, useMemo } from 'react';
import type { LoggedActionItem } from '@/constants/signals/prototype-data';
import { CloseIcon } from './icons';
import motion from './motion.module.scss';

interface Props {
  items: LoggedActionItem[];
  onClose: () => void;
  onOpenAlert: (id: string) => void;
}

function timeAgo(ts: number): string {
  const mins = Math.max(1, Math.round((Date.now() - ts) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function formatDue(dueDate: string): string {
  const d = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return dueDate;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function ActionItemsModal({ items, onClose, onOpenAlert }: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => (it.actionTypeLabel + ' ' + it.alertTitle + ' ' + it.account).toLowerCase().includes(q));
  }, [items, search]);

  const logged = filtered.filter((i) => i.status === 'logged');
  const sent = filtered.filter((i) => i.status === 'sent');

  return (
    <div className={motion.backdropIn} style={{ position: 'fixed', inset: 0, background: 'rgba(20,24,33,.44)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div className={motion.overlayIn} style={{ width: 780, maxHeight: '84vh', background: '#fff', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #e6e8ec', display: 'flex', alignItems: 'center', gap: 12, flex: 'none' }}>
          <span style={{ font: '700 15px/1 Inter,sans-serif', color: '#23272d' }}>Action items</span>
          <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#6b7178' }}>{items.length} logged from alerts</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search action items" style={{ marginLeft: 'auto', width: 240, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', outline: 'none' }} />
          <span onClick={onClose} style={{ display: 'flex', cursor: 'pointer', padding: '0 4px' }}><CloseIcon size={13} /></span>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {items.length === 0 && (
            <div style={{ padding: '48px 20px', textAlign: 'center' }}>
              <div style={{ font: '600 13px/1.4 Inter,sans-serif', color: '#23272d' }}>No action items yet</div>
              <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 6 }}>Pick a strategy on any alert and choose an action type to log one here.</div>
            </div>
          )}
          {sent.length > 0 && (
            <>
              <SectionHeader label="Sent" count={sent.length} />
              {sent.map((it) => <Row key={it.id} it={it} onOpenAlert={onOpenAlert} />)}
            </>
          )}
          {logged.length > 0 && (
            <>
              <SectionHeader label="Logged" count={logged.length} />
              {logged.map((it) => <Row key={it.id} it={it} onOpenAlert={onOpenAlert} />)}
            </>
          )}
          {items.length > 0 && filtered.length === 0 && (
            <div style={{ padding: '30px 20px', textAlign: 'center', font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178' }}>No action items match “{search}”.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div style={{ padding: '9px 22px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#6b7178' }}>{label}</span>
      <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#6b7178' }}>{count}</span>
    </div>
  );
}

function Row({ it, onOpenAlert }: { it: LoggedActionItem; onOpenAlert: (id: string) => void }) {
  return (
    <div style={{ padding: '13px 22px', borderBottom: '1px solid #f1f2f4', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: it.status === 'sent' ? '#3f7d6a' : '#a8763f', flex: 'none', marginTop: 5 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: '600 12px/1.4 Inter,sans-serif', color: '#23272d' }}>{it.actionTypeLabel}</div>
        {it.note && <div style={{ font: '400 12px/1.5 Inter,sans-serif', color: '#464646', marginTop: 4 }}>{it.note}</div>}
        <div style={{ display: 'flex', gap: 14, marginTop: 6, font: '400 11px/1 Inter,sans-serif', color: '#6b7178', flexWrap: 'wrap' }}>
          <span onClick={() => onOpenAlert(it.alertId)} style={{ cursor: 'pointer', color: '#77469b', fontWeight: 600 }}>{it.alertTitle}</span>
          <span>{it.account}</span>
          {it.assignee && <span>{it.assignee}</span>}
          {it.dueDate && <span>Due {formatDue(it.dueDate)}</span>}
          <span>{timeAgo(it.createdAt)}</span>
        </div>
      </div>
      <span style={{ flex: 'none', padding: '3px 8px', borderRadius: 5, background: it.status === 'sent' ? '#eef6f3' : '#fbf6ec', font: '600 10px/1.5 Inter,sans-serif', color: it.status === 'sent' ? '#3f7d6a' : '#a8763f' }}>
        {it.status === 'sent' ? 'SENT' : 'LOGGED'}
      </span>
    </div>
  );
}
