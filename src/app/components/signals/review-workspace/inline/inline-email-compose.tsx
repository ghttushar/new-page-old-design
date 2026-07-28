import { useState } from 'react';
import { PaperPlaneTilt, X, Sparkle, Copy } from '@phosphor-icons/react';
import { Button, TextField } from '@mui/material';
import styles from './inline.module.scss';

export interface EmailDraft {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
}

interface Props {
  initial: EmailDraft;
  onCancel: () => void;
  onSent: () => void;
}

export function InlineEmailCompose({ initial, onCancel, onSent }: Props) {
  const [to, setTo] = useState(initial.to);
  const [cc, setCc] = useState(initial.cc ?? '');
  const [bcc, setBcc] = useState(initial.bcc ?? '');
  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState(initial.body);
  const [showCc, setShowCc] = useState(!!initial.cc);
  const [showBcc, setShowBcc] = useState(!!initial.bcc);

  const canSend = to.trim() && subject.trim() && body.trim();

  return (
    <div className={styles.inlineSection}>
      <div className={styles.inlineHeader}>
        <span className={styles.aanLabel}>
          <Sparkle size={12} weight="fill" /> Aan drafted this email
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className={styles.copyBtn} onClick={() => navigator.clipboard.writeText(body)} title="Copy draft">
            <Copy size={14} />
          </button>
          <button className={styles.cancelBtn} onClick={onCancel}><X size={12} /> Cancel</button>
        </div>
      </div>

      <div className={styles.emailForm}>
        <div className={styles.emailRow}>
          <label className={styles.emailLabel}>To</label>
          <input className={styles.emailInput} value={to} onChange={(e) => setTo(e.target.value)} placeholder="recipient@example.com" />
          <div className={styles.ccBtns}>
            {!showCc && <button onClick={() => setShowCc(true)}>Cc</button>}
            {!showBcc && <button onClick={() => setShowBcc(true)}>Bcc</button>}
          </div>
        </div>
        {showCc && (
          <div className={styles.emailRow}>
            <label className={styles.emailLabel}>Cc</label>
            <input className={styles.emailInput} value={cc} onChange={(e) => setCc(e.target.value)} placeholder="cc@example.com" />
          </div>
        )}
        {showBcc && (
          <div className={styles.emailRow}>
            <label className={styles.emailLabel}>Bcc</label>
            <input className={styles.emailInput} value={bcc} onChange={(e) => setBcc(e.target.value)} placeholder="bcc@example.com" />
          </div>
        )}
        <div className={styles.emailRow}>
          <label className={styles.emailLabel}>Subject</label>
          <input className={`${styles.emailInput} ${styles.subjectInput}`} value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <textarea className={styles.emailBody} value={body} onChange={(e) => setBody(e.target.value)} />
      </div>

      <div className={styles.emailFooter}>
        <span className={styles.emailHint}><Sparkle size={12} /> Edit anything before sending — this draft is not sent yet.</span>
        <Button size="small" variant="contained" disabled={!canSend} onClick={onSent} sx={{ gap: 0.5, fontSize: '1.1rem', textTransform: 'none', background: '#77469b', '&:hover': { background: '#9551ab' } }}>
          <PaperPlaneTilt size={12} /> Send email
        </Button>
      </div>
    </div>
  );
}