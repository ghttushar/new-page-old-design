import { useState, useRef, useEffect } from 'react';
import { X, PaperPlaneTilt, Sparkle } from '@phosphor-icons/react';
import { Drawer, Button } from '@mui/material';
import type { Decision } from '@/constants/signals/decisions.constants';
import styles from './discuss-drawer.module.scss';

interface Msg {
  who: 'user' | 'aan';
  text: string;
  ts: number;
}

interface Props {
  decision?: Decision | null;
  taskContext?: { title: string; owner?: string; domain?: string };
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

function formatTs(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'Just now';
  const min = Math.floor(sec / 60);
  return `${min} min ago`;
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{
        borderRadius: 8,
        padding: '8px 14px',
        background: '#f6f6f7',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
      }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#9a9a9a',
              animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
        <style>{`
          @keyframes typingBounce {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-4px); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

export function DiscussDrawer({ decision, taskContext, open, onOpenChange }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const contextTitle = taskContext?.title || decision?.insight || '';

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, typing]);

  const send = () => {
    const t = text.trim();
    if (!t) return;
    const user: Msg = { who: 'user', text: t, ts: Date.now() };
    setMsgs((m) => [...m, user]);
    setText('');
    setTyping(true);

    setTimeout(() => {
      let responseText: string;
      if (taskContext) {
        const ownerPart = taskContext.owner ? ` I'll loop in ${taskContext.owner}` : '';
        responseText = `On it! I'm working on "${taskContext.title}"${ownerPart}. I'll have an update for you shortly.`;
      } else if (decision) {
        responseText = `Got it. I'll factor that in when I re-check ${decision.sourceRef.label} — the recommendation still holds on today's data.`;
      } else {
        responseText = 'Got it. I\'ll look into that and get back to you.';
      }
      const aan: Msg = { who: 'aan', text: responseText, ts: Date.now() };
      setMsgs((m) => [...m, aan]);
      setTyping(false);
    }, 500);
  };

  return (
    <Drawer anchor="right" open={open} onClose={() => onOpenChange(false)} PaperProps={{ sx: { width: 380, display: 'flex', flexDirection: 'column' } }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #e1e4e8', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(119,70,155,0.08)', border: '1px solid rgba(119,70,155,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkle size={14} color="#77469b" />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#23272d' }}>Discuss with Jiva</div>
          <div style={{ fontSize: '1rem', color: '#7c7c7c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {contextTitle}
          </div>
        </div>
        <button onClick={() => onOpenChange(false)} style={{ width: 26, height: 26, borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c7c7c' }}>
          <X size={14} />
        </button>
      </div>

      <div className={styles.chatScroll}>
        {msgs.length === 0 && !typing && (
          <div style={{ fontSize: '1.1rem', color: '#9a9a9a', textAlign: 'center', padding: '24px 0' }}>
            {taskContext ? 'Ask me anything about this task — how to approach it, who to involve, or what to prioritize.' : 'Ask me anything about this decision — assumptions, tradeoffs, alternatives, or evidence.'}
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.who === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '85%',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: '1.1rem',
              background: m.who === 'user' ? '#77469b' : '#f6f6f7',
              color: m.who === 'user' ? '#fff' : '#23272d',
            }}>
              {m.text}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#b0b0b0',
              marginTop: 3,
              paddingLeft: m.who === 'user' ? 0 : 4,
              paddingRight: m.who === 'user' ? 4 : 0,
              alignSelf: m.who === 'user' ? 'flex-end' : 'flex-start',
            }}>
              {formatTs(m.ts)}
            </div>
          </div>
        ))}
        {typing && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <div style={{ borderTop: '1px solid #e1e4e8', padding: '10px 12px', display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Ask Jiva…"
          style={{ flex: 1, height: 34, padding: '0 10px', borderRadius: 6, border: '1px solid #e1e4e8', fontSize: '1.1rem', outline: 'none' }}
        />
        <Button size="small" variant="contained" onClick={send} disabled={!text.trim() || typing} sx={{ minWidth: 36, height: 34, background: '#77469b', '&:hover': { background: '#9551ab' } }}>
          <PaperPlaneTilt size={14} />
        </Button>
      </div>
    </Drawer>
  );
}
