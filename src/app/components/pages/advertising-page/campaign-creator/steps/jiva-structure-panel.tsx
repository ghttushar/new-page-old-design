import { useEffect, useRef, useState } from 'react';
import { generateCampaigns, totalAdGroups, type CcDraft, type CcProduct } from '../campaign-creator.types';
import { BORDER, BRAND, BRAND_TINT, CheckIcon, SparkleGlyph, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

const SUGGESTIONS = [
  'Separate campaigns for Exact and Phrase keywords; keep Broad and Product Targeting together.',
  'One Auto campaign per product, and a single Manual campaign for everything else.',
  'Split by product, but group all keyword match types in one campaign each.',
];

function JivaBubble({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
      <span style={{ width: 24, height: 24, borderRadius: 8, background: BRAND_TINT, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><SparkleGlyph size={12} /></span>
      <div style={{ flex: 1, minWidth: 0, font: '400 12.5px/1.6 Inter,sans-serif', color: '#3d434b' }}>{children}</div>
    </div>
  );
}

/** Docked right-hand chat panel where Jiva proposes a custom campaign structure. */
export default function JivaStructurePanel({ draft, selectedProducts, onChange, onClose }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void; onClose: () => void;
}) {
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  const proposal = draft.customCampaigns;
  const applied = draft.structureId === 'custom' && Boolean(proposal);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [proposal, thinking]);

  function send(text: string) {
    const prompt = text.trim();
    if (!prompt || thinking) return;
    setInput('');
    setThinking(true);
    onChange({ customPrompt: prompt, customCampaigns: null });
    window.setTimeout(() => {
      const campaigns = generateCampaigns('product-targeting', selectedProducts, draft.targetingStrategies, draft.dailyBudget);
      onChange({ customPrompt: prompt, customCampaigns: campaigns });
      setThinking(false);
    }, 1100);
  }

  return (
    <aside style={{ width: 380, flex: 'none', display: 'flex', flexDirection: 'column', background: '#fff', borderLeft: `1px solid ${BORDER}`, minHeight: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ width: 28, height: 28, borderRadius: 9, background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SparkleGlyph size={14} color="#fff" /></span>
        <div style={{ flex: 1 }}>
          <div style={{ font: '700 13.5px/1.2 Inter,sans-serif', color: TEXT_PRIMARY }}>Ask Jiva</div>
          <div style={{ font: '400 11px/1.4 Inter,sans-serif', color: TEXT_FAINT }}>Custom campaign structure</div>
        </div>
        <button onClick={onClose} aria-label="Close" style={{ width: 28, height: 28, border: 'none', background: 'transparent', borderRadius: 7, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke={TEXT_MUTED} strokeWidth="1.7" strokeLinecap="round"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>
        </button>
      </div>

      <div ref={bodyRef} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <JivaBubble>
          Describe how you want your campaigns organised and I'll propose a structure for you to review. I'll use your {selectedProducts.length} selected product{selectedProducts.length === 1 ? '' : 's'} and chosen targeting.
        </JivaBubble>

        {!draft.customPrompt && !thinking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 33 }}>
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} style={{ textAlign: 'left' as const, padding: '9px 12px', borderRadius: 10, border: `1px solid ${BORDER}`, background: '#fff', font: '500 12px/1.5 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>{s}</button>
            ))}
          </div>
        )}

        {draft.customPrompt && (
          <div style={{ alignSelf: 'flex-end', maxWidth: '86%', padding: '9px 13px', borderRadius: '12px 12px 3px 12px', background: BRAND, color: '#fff', font: '400 12.5px/1.55 Inter,sans-serif' }}>{draft.customPrompt}</div>
        )}

        {thinking && <JivaBubble><span style={{ color: TEXT_MUTED }}>Designing a structure…</span></JivaBubble>}

        {proposal && (
          <JivaBubble>
            <div style={{ marginBottom: 10 }}>Here's what I'd suggest — <b>{proposal.length} campaigns</b> and <b>{totalAdGroups(proposal)} ad groups</b>.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
              {proposal.map((c) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 11px', borderRadius: 8, background: '#fafbfd', border: `1px solid ${BORDER}` }}>
                  <span style={{ font: '600 11.5px/1.4 Inter,sans-serif', color: TEXT_PRIMARY, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.name}</span>
                  <span style={{ font: '500 10.5px/1 Inter,sans-serif', color: TEXT_FAINT, flex: 'none' }}>{c.adGroups.length} ad group{c.adGroups.length === 1 ? '' : 's'}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
              {applied ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: '700 12px/1 Inter,sans-serif', color: '#1e8449' }}><CheckIcon size={12} color="#1e8449" /> Applied</span>
              ) : (
                <button onClick={() => { onChange({ structureId: 'custom' }); onClose(); }} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: BRAND, color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>Accept structure</button>
              )}
              <button onClick={() => onChange({ customCampaigns: null, customPrompt: '', structureId: applied ? null : draft.structureId })} style={{ padding: 0, border: 'none', background: 'none', font: '600 12px/1 Inter,sans-serif', color: TEXT_MUTED, cursor: 'pointer' }}>Start over</button>
            </div>
          </JivaBubble>
        )}
      </div>

      <div style={{ padding: 14, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '8px 8px 8px 12px', border: `1px solid ${BORDER}`, borderRadius: 12, background: '#fff' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Describe your ideal structure…"
            rows={2}
            style={{ flex: 1, border: 'none', outline: 'none', resize: 'none', font: '400 12.5px/1.5 Inter,sans-serif', color: TEXT_PRIMARY, background: 'transparent' }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || thinking}
            aria-label="Send"
            style={{ width: 30, height: 30, borderRadius: 9, border: 'none', background: !input.trim() || thinking ? '#eee7f5' : BRAND, cursor: !input.trim() || thinking ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}
          >
            <svg width={14} height={14} viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" /></svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
