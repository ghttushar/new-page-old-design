// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { useEffect, useRef, useState } from 'react';
import { generateCampaigns, totalAdGroups, type CcCampaign, type CcDraft, type CcProduct, type StructureId } from '../campaign-creator.types';
import { BORDER, BRAND, BRAND_TINT, CheckIcon, HAIR, SparkleGlyph, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

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

const ACTION_BTN = { padding: 0, border: 'none', background: 'none', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' } as const;

/** §7.2 Structure 6 — the proposal as a product -> campaigns tree when campaigns are product-scoped. */
function ProposalTree({ proposal, selectedProducts, grouped }: { proposal: CcCampaign[]; selectedProducts: CcProduct[]; grouped: boolean }) {
  if (!grouped) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
        {proposal.map((c) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 11px', borderRadius: 8, background: '#fafbfd', border: `1px solid ${BORDER}` }}>
            <span style={{ font: '600 11.5px/1.4 Inter,sans-serif', color: TEXT_PRIMARY, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.name}</span>
            <span style={{ font: '500 10.5px/1 Inter,sans-serif', color: TEXT_FAINT, flex: 'none' }}>{c.adGroups.length} ad group{c.adGroups.length === 1 ? '' : 's'}</span>
          </div>
        ))}
      </div>
    );
  }
  const groups = selectedProducts
    .map((p) => ({ product: p, campaigns: proposal.filter((c) => c.productIds[0] === p.id) }))
    .filter((g) => g.campaigns.length > 0);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 280, overflowY: 'auto', padding: '10px 11px', borderRadius: 8, background: '#fafbfd', border: `1px solid ${BORDER}` }}>
      {groups.map(({ product, campaigns }) => (
        <div key={product.id}>
          <div style={{ font: '700 11.5px/1.4 Inter,sans-serif', color: TEXT_PRIMARY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{product.title}</div>
          <div style={{ marginTop: 4, marginLeft: 4, paddingLeft: 12, borderLeft: `1.5px solid ${HAIR}`, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {campaigns.map((c) => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, font: '500 11.5px/1.5 Inter,sans-serif', color: '#3d434b' }}>
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{c.name.replace(`${product.title} — `, '')}</span>
                <span style={{ font: '500 10.5px/1.6 Inter,sans-serif', color: TEXT_FAINT, flex: 'none' }}>{c.adGroups.length} ad group{c.adGroups.length === 1 ? '' : 's'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const variantRef = useRef(0);

  const proposal = draft.customCampaigns;
  const applied = draft.structureId === 'custom' && Boolean(proposal);
  // Product-level separation is "Enabled" when every proposed campaign belongs to a single product.
  const productScoped = Boolean(proposal && proposal.length > 0 && proposal.every((c) => c.productIds.length === 1) && selectedProducts.length > 1);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [proposal, thinking]);

  /** Mock generation: each re-run alternates the underlying structure so the proposal visibly changes. */
  function generate(prompt: string, variant: number, previousCount?: number) {
    const wantsProducts = /product|separate/i.test(prompt);
    const order: StructureId[] = wantsProducts ? ['product-targeting', 'product-multi-auto'] : ['targeting-type', 'product-targeting'];
    let campaigns = generateCampaigns(order[variant % 2], selectedProducts, draft.targetingStrategies, draft.dailyBudget, draft.autoTypes);
    if (previousCount !== undefined && campaigns.length === previousCount) {
      campaigns = generateCampaigns(wantsProducts ? 'targeting-type' : 'consolidated', selectedProducts, draft.targetingStrategies, draft.dailyBudget, draft.autoTypes);
    }
    return campaigns;
  }

  function run(prompt: string, variant: number, previousCount?: number) {
    setThinking(true);
    onChange({ customPrompt: prompt, customCampaigns: null, structureId: applied ? null : draft.structureId });
    window.setTimeout(() => {
      onChange({ customPrompt: prompt, customCampaigns: generate(prompt, variant, previousCount) });
      setThinking(false);
    }, 1100);
  }

  function send(text: string) {
    const prompt = text.trim();
    if (!prompt || thinking) return;
    setInput('');
    variantRef.current = 0;
    run(prompt, 0);
  }

  function askAgain() {
    if (thinking || !draft.customPrompt) return;
    variantRef.current += 1;
    run(draft.customPrompt, variantRef.current, proposal?.length);
  }

  function modify() {
    if (thinking) return;
    setInput(draft.customPrompt);
    onChange({ customCampaigns: null, customPrompt: '', structureId: applied ? null : draft.structureId });
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <aside style={{ width: 380, flex: 'none', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', minHeight: 0 }}>
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
            <div style={{ font: '700 12px/1.4 Inter,sans-serif', color: TEXT_PRIMARY }}>Jiva's proposal</div>
            <div style={{ font: '500 11.5px/1.4 Inter,sans-serif', color: TEXT_MUTED, marginBottom: 8 }}>
              Product-level campaign separation: <b style={{ fontWeight: 600, color: productScoped ? '#1e8449' : TEXT_PRIMARY }}>{productScoped ? 'Enabled' : 'Disabled'}</b>
            </div>
            <div style={{ marginBottom: 10 }}>Here's what I'd suggest — <b>{proposal.length} campaigns</b> and <b>{totalAdGroups(proposal)} ad groups</b>.</div>
            <ProposalTree proposal={proposal} selectedProducts={selectedProducts} grouped={productScoped} />
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' as const, gap: '10px 14px', marginTop: 12 }}>
              {applied ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: '700 12px/1 Inter,sans-serif', color: '#1e8449' }}><CheckIcon size={12} color="#1e8449" /> Applied</span>
              ) : (
                <button onClick={() => { onChange({ structureId: 'custom' }); onClose(); }} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: BRAND, color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>Accept structure</button>
              )}
              <button onClick={modify} style={{ ...ACTION_BTN, color: BRAND }}>Modify</button>
              <button onClick={askAgain} style={{ ...ACTION_BTN, color: BRAND }}>Ask Jiva again</button>
              <button onClick={() => onChange({ customCampaigns: null, customPrompt: '', structureId: applied ? null : draft.structureId })} style={{ ...ACTION_BTN, color: TEXT_MUTED }}>Start over</button>
            </div>
          </JivaBubble>
        )}
      </div>

      <div style={{ padding: 14, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, padding: '8px 8px 8px 12px', border: `1px solid ${BORDER}`, borderRadius: 12, background: '#fff' }}>
          <textarea
            ref={inputRef}
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
