import { useEffect, useRef, useState } from 'react';
import { PaperPlaneTilt, X, Check, Sparkle } from '@phosphor-icons/react';
import { Button } from '@mui/material';
import styles from './inline.module.scss';

interface Msg { role: 'user' | 'aan'; text: string; ts: number }

interface Props {
  title: string;
  approveLabel: string;
  approveSuccess: string;
  initialDraft: string;
  onCancel: () => void;
  onApprove: () => void;
}

export function InlineDraftChat({
  title, approveLabel, initialDraft, onCancel, onApprove,
}: Props) {
  const [thread, setThread] = useState<Msg[]>([
    { role: 'aan', text: initialDraft, ts: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [thread]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function send() {
    const text = input.trim();
    if (!text) return;
    setThread((t) => [...t, { role: 'user', text, ts: Date.now() }]);
    setInput('');
    setTimeout(() => {
      setThread((t) => [...t, {
        role: 'aan',
        text: "Got it — I've updated the draft above with that change. Review the latest version and approve when you're ready.",
        ts: Date.now(),
      }]);
    }, 500);
  }

  return (
    <div className={styles.inlineSection}>
      <div className={styles.inlineHeader}>
        <span className={styles.aanLabel}>
          <Sparkle size={12} weight="fill" /> {title}
        </span>
        <button className={styles.cancelBtn} onClick={onCancel}><X size={12} /> Cancel</button>
      </div>

      <div className={styles.chatContainer}>
        <div ref={scrollRef} className={styles.chatScroll}>
          {thread.map((m, i) => (
            <div key={i} className={m.role === 'user' ? styles.chatUser : styles.chatAan}>
              <div className={m.role === 'user' ? styles.userBubble : styles.aanBubble}>
                {m.text.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.chatInputArea}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder="Ask Aan to revise the draft, or add more context…"
            className={styles.chatInput}
          />
          <div className={styles.chatActions}>
            <span className={styles.chatHint}><Sparkle size={10} /> Enter to send · Shift+Enter for new line</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button size="small" variant="text" onClick={send} disabled={!input.trim()} sx={{ fontSize: '1.1rem', textTransform: 'none', gap: 0.5, color: '#7c7c7c' }}>
                <PaperPlaneTilt size={12} /> Send
              </Button>
              <Button size="small" variant="contained" onClick={onApprove} sx={{ fontSize: '1.1rem', textTransform: 'none', gap: 0.5, background: '#77469b', '&:hover': { background: '#9551ab' } }}>
                <Check size={12} /> {approveLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}