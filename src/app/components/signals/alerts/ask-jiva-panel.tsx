import { useEffect, useRef, useState } from 'react';
import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
import type { PrototypeAlert } from '@/constants/signals/prototype-data';
import { formatAlertValue } from './format-money';
import { CloseIcon } from './icons';
import scrollStyles from './alerts-scroll.module.scss';
import motion from './motion.module.scss';

interface ChatMessage {
  id: string;
  from: 'jiva' | 'user';
  text: string;
}

interface Props {
  alert: PrototypeAlert;
  onClose: () => void;
}

/**
 * Concept variation: chat with Jiva about one alert, occupying the exact footprint
 * of the alert list column it replaces (not a floating overlay on top of the page).
 */
export function AskJivaPanel({ alert, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm0',
      from: 'jiva',
      text: `Hi, I'm Jiva. I've read "${alert.title}" for ${alert.account} — ask me anything about why it happened, what it's worth, or what to do next.`,
    },
  ]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const reply = (question: string): string => {
    const q = question.toLowerCase();
    if (q.includes('why')) return alert.why;
    if (q.includes('root') || q.includes('cause')) return alert.root;
    if (q.includes('impact') || q.includes('value') || q.includes('worth')) {
      return `Estimated impact is ${formatAlertValue(alert.valueNum)} — ${alert.revLabel.toLowerCase()} at ${alert.confidence}% confidence.`;
    }
    if (q.includes('do') || q.includes('recommend') || q.includes('strategy') || q.includes('should')) {
      const top = alert.options.find((o) => o.recommended) ?? alert.options[0];
      return top ? `I'd go with "${top.label}" — ${top.desc}` : `Open "Choose your strategy" on the right to see the options I've ranked for this one.`;
    }
    return `Here's what I know: ${alert.aiSummary}`;
  };

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: `u${Date.now()}`, from: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setDraft('');
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: `j${Date.now()}`, from: 'jiva', text: reply(text) }]);
    }, 900);
  };

  const suggestions = ['Why did this happen?', 'What should I do?', "What's this worth?"];

  return (
    <div className={motion.contentFadeIn} style={{ flex: '0 0 35%', maxWidth: '35%', minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #e6e8ec', display: 'flex', alignItems: 'center', gap: 10, flex: 'none', background: 'linear-gradient(180deg, rgba(119,70,155,.05), transparent)' }}>
        <DiamondMascot size={26} />
        <div style={{ minWidth: 0 }}>
          <div style={{ font: '700 13px/1.2 Inter,sans-serif', color: '#23272d' }}>Ask Jiva</div>
          <div style={{ font: '400 10.5px/1.3 Inter,sans-serif', color: '#9aa0a8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>About: {alert.title}</div>
        </div>
        <span onClick={onClose} className={motion.pressable} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 7, cursor: 'pointer', flex: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <CloseIcon size={14} />
        </span>
      </div>

      <div ref={scrollRef} className={scrollStyles.sleekScroll} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map((m) => (
          <div key={m.id} className={motion.contentFadeIn} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexDirection: m.from === 'user' ? 'row-reverse' : 'row' }}>
            {m.from === 'jiva' && <span style={{ flex: 'none', marginTop: 2 }}><DiamondMascot size={20} /></span>}
            <div
              style={{
                maxWidth: '82%', padding: '9px 12px', borderRadius: 12,
                borderTopLeftRadius: m.from === 'jiva' ? 4 : 12,
                borderTopRightRadius: m.from === 'user' ? 4 : 12,
                background: m.from === 'user' ? '#77469b' : '#f6f4fa',
                color: m.from === 'user' ? '#fff' : '#3d2a52',
                font: '400 12.5px/1.55 Inter,sans-serif',
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span style={{ flex: 'none', marginTop: 2 }}><DiamondMascot size={20} /></span>
            <div style={{ display: 'flex', gap: 4, padding: '11px 14px', borderRadius: 12, borderTopLeftRadius: 4, background: '#f6f4fa' }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#b9a3cf', animation: `askJivaTypingDot 1.1s ${i * 0.15}s ease-in-out infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {messages.length < 2 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 16px 10px', flex: 'none' }}>
          {suggestions.map((s) => (
            <span
              key={s}
              onClick={() => setDraft(s)}
              className={`${motion.pressable} ${motion.btnSecondary}`}
              style={{ padding: '6px 11px', borderRadius: 999, border: '1px solid #e6ddf0', font: '500 11px/1 Inter,sans-serif', color: '#5f3880', cursor: 'pointer', background: '#fbfafd' }}
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div style={{ padding: '12px 14px', borderTop: '1px solid #f1f2f4', display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
          placeholder="Ask about this alert…"
          className={motion.focusRing}
          style={{ flex: 1, minWidth: 0, padding: '10px 12px', border: '1px solid #dfe3ea', borderRadius: 8, font: '400 12.5px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
        />
        <span
          onClick={send}
          className={draft.trim() ? `${motion.pressable} ${motion.btnPrimary}` : motion.pressable}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, background: draft.trim() ? '#77469b' : '#eee7f5', flex: 'none', cursor: draft.trim() ? 'pointer' : 'default' }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M1.5 8h13M9.5 3l5 5-5 5" stroke={draft.trim() ? '#fff' : '#c3b3d6'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>
      <style>{`@keyframes askJivaTypingDot { 0%, 60%, 100% { opacity: .35; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-2px); } }`}</style>
    </div>
  );
}
