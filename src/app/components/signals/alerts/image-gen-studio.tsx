import { useEffect, useRef, useState } from 'react';
import type { PrototypeAlert } from '@/constants/signals/prototype-data';
import { SparkleIcon, CheckIcon, ChevronDownIcon, BackArrowIcon } from './icons';
import motion from './motion.module.scss';
import scrollStyles from './alerts-scroll.module.scss';

interface Props {
  alert: PrototypeAlert;
  onBack: () => void;
  onPublish: () => void;
}

const TOOLS = ['Jiva Studio · Fast', 'Jiva Studio · HD', 'Background remover'];

interface ImageResult {
  id: string;
  seed: number;
  label: string;
}

interface ChatTurn {
  id: string;
  role: 'assistant' | 'user';
  text?: string;
  images?: ImageResult[];
  generating?: boolean;
}

const GRADIENTS = [
  'linear-gradient(135deg,#f6d9c4,#f1f2f4)',
  'linear-gradient(135deg,#d7e6f5,#f1f2f4)',
  'linear-gradient(135deg,#dcead9,#f1f2f4)',
  'linear-gradient(135deg,#efd7ea,#f1f2f4)',
];

function ImageTile({ img, selected, onSelect }: { img: ImageResult; selected: boolean; onSelect: () => void }) {
  return (
    <div
      onClick={onSelect}
      style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', cursor: 'pointer', border: selected ? '2.5px solid #77469b' : '2.5px solid transparent', boxShadow: selected ? '0 0 0 2px #f0e9f7' : '0 1px 3px rgba(20,24,33,.08)' }}
    >
      <div style={{ aspectRatio: '1 / 1', background: GRADIENTS[img.seed % GRADIENTS.length], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="4.5" width="19" height="15" rx="2" stroke="#8a7fa8" strokeWidth="1.4" /><circle cx="8" cy="10" r="1.7" stroke="#8a7fa8" strokeWidth="1.4" /><path d="M3.5 16.5l5-4.5 3 2.5 4-4 5 6" stroke="#8a7fa8" strokeWidth="1.4" strokeLinejoin="round" /></svg>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 7px', background: 'rgba(20,24,33,.55)', font: '600 9.5px/1.4 Inter,sans-serif', color: '#fff' }}>{img.label}</div>
      {selected && (
        <div style={{ position: 'absolute', top: 5, right: 5, width: 18, height: 18, borderRadius: '50%', background: '#77469b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckIcon size={10} /></div>
      )}
    </div>
  );
}

export function ImageGenStudio({ alert, onBack, onPublish }: Props) {
  const [tool, setTool] = useState(TOOLS[0]);
  const [toolMenuOpen, setToolMenuOpen] = useState(false);
  const [input, setInput] = useState('');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      id: 'intro',
      role: 'assistant',
      text: `I can generate a compliant main image for "${alert.title}". Describe what you want, or use the suggested prompt below.`,
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const genCounter = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [turns]);

  const suggestedPrompt = `Pure white (RGB 255,255,255) background, full product in frame, no props, studio lighting, e-commerce main image style.`;

  const runGeneration = (prompt: string) => {
    const userTurn: ChatTurn = { id: `u-${Date.now()}`, role: 'user', text: prompt };
    const genTurn: ChatTurn = { id: `g-${Date.now()}`, role: 'assistant', generating: true };
    setTurns((prev) => [...prev, userTurn, genTurn]);
    setInput('');

    window.setTimeout(() => {
      genCounter.current += 1;
      const batch = genCounter.current;
      const images: ImageResult[] = [0, 1, 2, 3].map((i) => ({ id: `img-${batch}-${i}`, seed: batch + i, label: `Variation ${String.fromCharCode(65 + i)}` }));
      setTurns((prev) => prev.map((t) => (t.id === genTurn.id ? { id: t.id, role: 'assistant', images, text: `Here are 4 white-background options from ${tool}, compliant with the main-image policy.` } : t)));
    }, 1400);
  };

  const selectedImage = turns.flatMap((t) => t.images ?? []).find((i) => i.id === selectedImageId);

  return (
    <div style={{ flex: 1, minWidth: 0, minHeight: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f2f4', display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
        <span onClick={onBack} style={{ display: 'flex', cursor: 'pointer', padding: '2px 4px' }}><BackArrowIcon size={14} /></span>
        <span style={{ font: '700 14px/1 Inter,sans-serif', color: '#23272d' }}>Image Studio</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 4, background: '#f3eefa', font: '600 9px/1.5 Inter,sans-serif', color: '#5f3880' }}><SparkleIcon size={9} /> JIVA</span>
        <span style={{ position: 'relative', marginLeft: 'auto' }}>
          <span onClick={() => setToolMenuOpen((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 11px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>
            {tool} <ChevronDownIcon size={8} />
          </span>
          {toolMenuOpen && (
            <div className={motion.popIn} style={{ position: 'absolute', right: 0, top: 34, width: 200, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 20 }}>
              {TOOLS.map((t) => (
                <div key={t} onClick={() => { setTool(t); setToolMenuOpen(false); }} style={{ padding: '8px 10px', borderRadius: 6, cursor: 'pointer', font: '500 12px/1 Inter,sans-serif', color: t === tool ? '#77469b' : '#3d434b', background: t === tool ? '#f9f7fc' : 'transparent' }}>{t}</div>
              ))}
            </div>
          )}
        </span>
      </div>

      {/* Chat thread */}
      <div ref={scrollRef} className={scrollStyles.sleekScroll} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '18px 20px' }}>
        {turns.map((t) => (
          <div key={t.id} style={{ display: 'flex', justifyContent: t.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
            <div style={{ maxWidth: '86%' }}>
              {t.role === 'assistant' && !t.generating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                  <SparkleIcon size={10} />
                  <span style={{ font: '700 10px/1 Inter,sans-serif', color: '#5f3880' }}>Jiva</span>
                </div>
              )}
              {t.text && (
                <div style={{ padding: '10px 13px', borderRadius: 12, background: t.role === 'user' ? '#77469b' : '#f6f4fa', color: t.role === 'user' ? '#fff' : '#3d2a52', font: '400 12.5px/1.55 Inter,sans-serif' }}>
                  {t.text}
                </div>
              )}
              {t.generating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 13px', borderRadius: 12, background: '#f6f4fa' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a37fc7', animation: 'jivaDot 1s .0s infinite' }} />
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a37fc7', animation: 'jivaDot 1s .15s infinite' }} />
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#a37fc7', animation: 'jivaDot 1s .3s infinite' }} />
                  <span style={{ font: '500 11px/1 Inter,sans-serif', color: '#8a7fa8', marginLeft: 4 }}>Generating with {tool}…</span>
                </div>
              )}
              {t.images && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 8, width: 340 }}>
                  {t.images.map((img) => (
                    <ImageTile key={img.id} img={img} selected={selectedImageId === img.id} onSelect={() => setSelectedImageId(img.id)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <style>{`@keyframes jivaDot { 0%,100% { opacity:.3; transform: translateY(0);} 50% { opacity:1; transform: translateY(-3px);} }`}</style>
      </div>

      {/* Suggested prompt + input */}
      <div style={{ padding: '10px 20px', flex: 'none', borderTop: '1px solid #f1f2f4' }}>
        {turns.length === 1 && (
          <span
            onClick={() => runGeneration(suggestedPrompt)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 10, padding: '8px 12px', borderRadius: 8, border: '1px dashed #d7c6e8', background: '#fbfafd', font: '500 11.5px/1.4 Inter,sans-serif', color: '#5f3880', cursor: 'pointer' }}
          >
            <SparkleIcon size={11} /> Use suggested prompt: “{suggestedPrompt}”
          </span>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <span style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #dfe3ea', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', cursor: 'pointer', color: '#6b7178' }} title="Attach reference image">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M11.5 6.5l-5 5a2.5 2.5 0 0 1-3.5-3.5l6-6a3.5 3.5 0 0 1 5 5l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (input.trim()) runGeneration(input.trim()); } }}
            placeholder="Describe the image you want, or ask for a change…"
            style={{ flex: 1, minHeight: 34, maxHeight: 90, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 10, font: '400 12.5px/1.4 Inter,sans-serif', color: '#3d434b', outline: 'none', resize: 'vertical' as const }}
          />
          <span
            onClick={() => input.trim() && runGeneration(input.trim())}
            style={{ width: 34, height: 34, borderRadius: '50%', background: input.trim() ? '#77469b' : '#e6e0ec', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', cursor: input.trim() ? 'pointer' : 'default' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M2 8h11M8 2.5L13.5 8 8 13.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
      </div>

      {/* Finalize bar */}
      <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10, borderTop: '1px solid #f1f2f4', flex: 'none' }}>
        <span
          onClick={() => selectedImage && onPublish()}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px', borderRadius: 7, background: selectedImage ? '#77469b' : '#e6e0ec', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: selectedImage ? 'pointer' : 'default' }}
        >
          {selectedImage && <CheckIcon size={12} />}
          {selectedImage ? `Use ${selectedImage.label} & publish` : 'Select an image to continue'}
        </span>
        <span onClick={onBack} style={{ padding: '9px 14px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Cancel</span>
      </div>
    </div>
  );
}
