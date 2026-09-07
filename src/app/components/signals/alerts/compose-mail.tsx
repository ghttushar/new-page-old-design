import { useState } from 'react';
import type { PrototypeAlert } from '@/constants/signals/prototype-data';
import type { ActionType } from '@/constants/signals/action-types.constants';

interface Props {
  alert: PrototypeAlert;
  actionType: ActionType;
  onClose: () => void;
  onSend: (payload: { to: string[]; cc: string[]; bcc: string[]; subject: string; body: string }) => void;
}

function contactFor(account: string): string {
  const handle = account.toLowerCase().replace(/[^a-z0-9]+/g, '.');
  return `${account} team <contact@${handle.replace(/\.+$/, '')}.com>`;
}

function draftSubject(alert: PrototypeAlert, actionType: ActionType): string {
  if (actionType.id === 'resend-followup-email') return `Following up: ${alert.title}`;
  if (actionType.id === 'deliver-creative-assets') return `Creative assets — ${alert.title}`;
  if (actionType.id === 'prepare-presentation-deck') return `Deck for your review — ${alert.title}`;
  return `${alert.account}: ${alert.title}`;
}

function draftBody(alert: PrototypeAlert, actionType: ActionType): string {
  return `Hi ${alert.account} team,\n\n${alert.subheader}\n\n${alert.why}\n\n${alert.root ? `To prevent this recurring: ${alert.root}\n\n` : ''}Recommended next step: ${actionType.label.toLowerCase()}.\n\nHappy to walk through this on a call if useful.\n\nBest,\nJiva (on behalf of the Anarix team)`;
}

function TagInput({ label, values, onChange, placeholder }: { label: string; values: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState('');
  const commit = () => {
    const v = draft.trim();
    if (v) onChange([...values, v]);
    setDraft('');
  };
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 20px', borderBottom: '1px solid #f1f2f4' }}>
      <span style={{ flex: 'none', width: 40, marginTop: 4, font: '500 12px/1 Inter,sans-serif', color: '#9aa0a8' }}>{label}</span>
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {values.map((v, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px', borderRadius: 5, background: '#f1f2f4', font: '500 11px/1.4 Inter,sans-serif', color: '#3d434b' }}>
            {v}
            <span onClick={() => onChange(values.filter((_, idx) => idx !== i))} style={{ cursor: 'pointer', color: '#9aa0a8', fontWeight: 700 }}>×</span>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commit(); } }}
          onBlur={commit}
          placeholder={values.length ? '' : placeholder}
          style={{ flex: 1, minWidth: 120, border: 'none', outline: 'none', font: '400 12px/1 Inter,sans-serif', color: '#3d434b', padding: '4px 0' }}
        />
      </div>
    </div>
  );
}

export function ComposeMail({ alert, actionType, onClose, onSend }: Props) {
  const [to, setTo] = useState<string[]>([contactFor(alert.account)]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState(draftSubject(alert, actionType));
  const [body, setBody] = useState(draftBody(alert, actionType));
  const [sent, setSent] = useState(false);

  const send = () => {
    onSend({ to, cc, bcc, subject, body });
    setSent(true);
    window.setTimeout(onClose, 900);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,24,33,.44)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 230 }}>
      <div style={{ width: 640, maxHeight: '86vh', background: '#fff', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 60px rgba(20,24,33,.28)' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e6e8ec', display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
          <span style={{ font: '700 14px/1 Inter,sans-serif', color: '#23272d' }}>New message</span>
          <span style={{ padding: '2px 7px', borderRadius: 4, background: '#f3eefa', font: '600 9px/1.5 Inter,sans-serif', color: '#5f3880' }}>✦ DRAFTED BY JIVA</span>
          <span onClick={onClose} style={{ marginLeft: 'auto', font: '700 17px/1 Inter,sans-serif', color: '#6b7178', cursor: 'pointer', padding: '0 4px' }}>×</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <TagInput label="To" values={to} onChange={setTo} placeholder="Add recipient and press Enter" />
          {(showCc || cc.length > 0) && <TagInput label="Cc" values={cc} onChange={setCc} placeholder="Add Cc and press Enter" />}
          {(showBcc || bcc.length > 0) && <TagInput label="Bcc" values={bcc} onChange={setBcc} placeholder="Add Bcc and press Enter" />}
          {(!showCc && cc.length === 0) || (!showBcc && bcc.length === 0) ? (
            <div style={{ display: 'flex', gap: 12, padding: '2px 20px 9px 70px' }}>
              {!showCc && cc.length === 0 && <span onClick={() => setShowCc(true)} style={{ font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>Add Cc</span>}
              {!showBcc && bcc.length === 0 && <span onClick={() => setShowBcc(true)} style={{ font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>Add Bcc</span>}
            </div>
          ) : null}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 20px', borderBottom: '1px solid #f1f2f4' }}>
            <span style={{ flex: 'none', width: 40, font: '500 12px/1 Inter,sans-serif', color: '#9aa0a8' }}>Subject</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} style={{ flex: 1, border: 'none', outline: 'none', font: '500 12px/1.4 Inter,sans-serif', color: '#23272d' }} />
          </div>
          <div style={{ padding: '14px 20px' }}>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ width: '100%', minHeight: 260, border: '1px solid #e6e8ec', borderRadius: 8, padding: 14, font: '400 12px/1.7 Inter,sans-serif', color: '#3d434b', outline: 'none', resize: 'vertical' as const }}
            />
          </div>
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid #e6e8ec', display: 'flex', alignItems: 'center', gap: 9, flex: 'none' }}>
          <span
            onClick={to.length > 0 && !sent ? send : undefined}
            style={{ padding: '10px 18px', borderRadius: 7, background: sent ? '#3f7d6a' : to.length ? '#77469b' : '#cfd4dc', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: to.length && !sent ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 7 }}
          >
            {sent ? (<><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>Sent</>) : 'Send'}
          </span>
          <span onClick={onClose} style={{ padding: '9px 14px', borderRadius: 7, border: '1px solid #dfe3ea', font: '500 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Discard</span>
          <span style={{ marginLeft: 'auto', font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>Prototype — no message is actually delivered.</span>
        </div>
      </div>
    </div>
  );
}
