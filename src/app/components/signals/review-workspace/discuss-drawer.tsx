import { useState } from 'react';
import { X, PaperPlaneTilt, Sparkle } from '@phosphor-icons/react';
import { Drawer, Button } from '@mui/material';
import type { Decision } from '@/constants/signals/decisions.constants';

interface Msg {
  who: 'user' | 'aan';
  text: string;
  ts: number;
}

interface Props {
  decision: Decision | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function DiscussDrawer({ decision, open, onOpenChange }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');

  const send = () => {
    const t = text.trim();
    if (!t || !decision) return;
    const user: Msg = { who: 'user', text: t, ts: Date.now() };
    const aan: Msg = {
      who: 'aan',
      text: `Got it. I'll factor that in when I re-check ${decision.sourceRef.label} — the recommendation still holds on today's data.`,
      ts: Date.now() + 1,
    };
    setMsgs((m) => [...m, user, aan]);
    setText('');
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
            {decision?.insight || ''}
          </div>
        </div>
        <button onClick={() => onOpenChange(false)} style={{ width: 26, height: 26, borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c7c7c' }}>
          <X size={14} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.length === 0 && (
          <div style={{ fontSize: '1.1rem', color: '#9a9a9a', textAlign: 'center', padding: '24px 0' }}>
            Ask me anything about this decision — assumptions, tradeoffs, alternatives, or evidence.
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.who === 'user' ? 'flex-end' : 'flex-start' }}>
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
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #e1e4e8', padding: '10px 12px', display: 'flex', gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Ask Jiva…"
          style={{ flex: 1, height: 34, padding: '0 10px', borderRadius: 6, border: '1px solid #e1e4e8', fontSize: '1.1rem', outline: 'none' }}
        />
        <Button size="small" variant="contained" onClick={send} disabled={!text.trim()} sx={{ minWidth: 36, height: 34, background: '#77469b', '&:hover': { background: '#9551ab' } }}>
          <PaperPlaneTilt size={14} />
        </Button>
      </div>
    </Drawer>
  );
}