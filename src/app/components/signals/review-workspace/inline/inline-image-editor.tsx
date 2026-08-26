import { useEffect, useRef, useState } from 'react';
import { X, Sparkle, PaperPlaneTilt } from '@phosphor-icons/react';
import { Button } from '@mui/material';
import styles from './inline.module.scss';

interface ThreadMsg {
  role: 'user' | 'jiva';
  text: string;
  imageUrl?: string;
  ts: number;
}

interface InlineImageEditorProps {
  decision: {
    id: string;
    insight: string;
    valueCaption: string;
    actionVerb: string;
  };
  onCancel: () => void;
}

const GENERATED_IMAGES = [
  '/images/product-coffee.jpg',
  '/images/product-sunscreen-1.jpg',
  '/images/product-sunscreen-2.png',
];

export function InlineImageEditor({ decision, onCancel }: InlineImageEditorProps) {
  const [thread, setThread] = useState<ThreadMsg[]>([]);
  const [input, setInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentImage = GENERATED_IMAGES[imageIdx % GENERATED_IMAGES.length];

  useEffect(() => {
    const t = setTimeout(() => {
      setThread([{
        role: 'jiva',
        text: `Here's your compliant image for this listing.\n\n✅ Pure white background\n✅ No mannequin — ghost shape preserved\n✅ 2000×2000px · sRGB · <10MB\n\nReady for Amazon Seller Central upload. Edit the prompt below to make changes.`,
        imageUrl: currentImage,
        ts: Date.now(),
      }]);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [thread, generating]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function send() {
    const text = input.trim();
    if (!text || generating) return;
    setThread((t) => [...t, { role: 'user', text, ts: Date.now() }]);
    setInput('');
    setGenerating(true);

    const nextIdx = imageIdx + 1;
    const nextImage = GENERATED_IMAGES[nextIdx % GENERATED_IMAGES.length];

    setTimeout(() => {
      setImageIdx(nextIdx);
      setThread((t) => [...t, {
        role: 'jiva',
        text: `Updated. Here's the revised image based on your prompt.\n\nReview below — type another edit or approve when ready.`,
        imageUrl: nextImage,
        ts: Date.now(),
      }]);
      setGenerating(false);
    }, 800);
  }

  return (
    <div className={styles.imageGenSection}>
      <div className={styles.inlineHeader}>
        <span className={styles.aanLabel}>
          <Sparkle size={12} weight="fill" /> Jiva generated a compliant image
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className={styles.cancelBtn} onClick={onCancel}><X size={12} /> Cancel</button>
        </div>
      </div>

      <div className={styles.imageGenContainer}>
        <div ref={scrollRef} className={styles.imageGenScroll}>
          {thread.map((m, i) => (
            <div key={i} className={m.role === 'user' ? styles.imageGenUser : styles.imageGenJiva}>
              <div className={m.role === 'user' ? styles.userBubble : styles.aanBubble}>
                {m.text.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}
              </div>
              {m.imageUrl && (
                <div className={styles.imageGenPreview}>
                  <img src={m.imageUrl} alt="Generated compliant product image" className={styles.imageGenImg} />
                </div>
              )}
            </div>
          ))}
          {generating && (
            <div className={`${styles.imageGenJiva}`}>
              <div className={`${styles.aanBubble} ${styles.imageGenPulse}`}>
                <Sparkle size={14} className={styles.pulseIcon} /> Generating image…
              </div>
            </div>
          )}
        </div>

        <div className={styles.chatInputArea}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder="Describe edits (e.g., 'Add lifestyle background', 'Change to black tube')"
            className={styles.chatInput}
          />
          <div className={styles.chatActions}>
            <span className={styles.chatHint}><Sparkle size={10} /> Enter to send · Shift+Enter for new line</span>
            <Button size="small" variant="text" onClick={send} disabled={!input.trim() || generating} sx={{ fontSize: '1.1rem', textTransform: 'none', gap: 0.5, color: '#7c7c7c' }}>
              <PaperPlaneTilt size={12} /> Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InlineImageEditor;
