import { useState } from 'react';
import type { PrototypeAlert, AlertOption } from '@/constants/signals/prototype-data';
import { ItemsModal } from './items-modal';

interface Props {
  alert: PrototypeAlert | null;
  phase: 'view' | 'executing' | 'report' | 'genReview';
  execProgress: number;
  onExecute: () => void;
  onViewReport: () => void;
  onBackToAlerts: () => void;
  onGenReview: () => void;
  onApproveGenReview: () => void;
  onOpenItems: () => void;
  itemsModalOpen: boolean;
  onCloseItems: () => void;
}

export function AlertDetailPanel({ alert: sel, phase, execProgress, onExecute, onViewReport, onBackToAlerts, onGenReview, onApproveGenReview, onOpenItems, itemsModalOpen, onCloseItems }: Props) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [aiSummaryOpen, setAiSummaryOpen] = useState(false);
  const [detailMenu, setDetailMenu] = useState<'assign' | 'share' | null>(null);
  const [thumb, setThumb] = useState<'up' | 'down' | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [otherText, setOtherText] = useState('');

  if (!sel) {
    return (
      <div style={{ flex: 1, minWidth: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', maxWidth: 300 }}>
            <div style={{ font: '600 14px/1.4 Inter,sans-serif', color: '#23272d' }}>Select an alert</div>
            <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 7 }}>The reasoning, impact and recommended strategy open here.</div>
          </div>
        </div>
      </div>
    );
  }

  const money = (n: number) => {
    const abs = Math.abs(n);
    const sign = n < 0 ? '−$' : '+$';
    if (abs >= 1000000) return sign + (abs / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (abs >= 1000) return sign + (abs / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    return sign + abs.toLocaleString();
  };

  const optId = selectedOptionId || (sel.options.find((o) => o.recommended) || sel.options[0])?.id;
  const pickedOption = sel.options.find((o) => o.id === optId);

  const executeLabel = pickedOption
    ? pickedOption.kind === 'GENERATIVE' ? 'Generate & review'
      : pickedOption.isMeetingAsk ? 'Log for meeting'
      : pickedOption.isOther ? 'Save my action'
      : `Execute: ${pickedOption.label}`
    : 'Execute';

  const handleExecute = () => {
    if (pickedOption?.kind === 'GENERATIVE') { onGenReview(); return; }
    onExecute();
  };

  if (phase === 'executing') {
    return (
      <div style={{ flex: 1, minWidth: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ width: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: execProgress >= 100 ? '#3f7d6a' : '#a8763f' }} />
              <span style={{ font: '500 11px/1 Inter,sans-serif', color: '#6b7178' }}>{execProgress >= 100 ? 'Completed' : 'Applying changes'}</span>
              <span style={{ marginLeft: 'auto', font: '600 13px/1 Inter,sans-serif', color: '#464646' }}>{execProgress}%</span>
            </div>
            <div style={{ font: '600 16px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 11 }}>{sel.title}</div>
            <div style={{ height: 6, borderRadius: 3, background: '#f1f2f4', marginTop: 14, overflow: 'hidden' }}>
              <div style={{ width: `${execProgress}%`, height: '100%', background: '#77469b', transition: 'width .5s ease' }} />
            </div>
            <div style={{ font: '400 12px/1.65 Inter,sans-serif', color: '#6b7178', marginTop: 12 }}>You can leave this alert. Progress continues in the background.</div>
            {execProgress >= 100 && (
              <span onClick={onViewReport} style={{ display: 'inline-block', marginTop: 16, padding: '10px 16px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>View impact report</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'report') {
    return (
      <div style={{ flex: 1, minWidth: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', overflowY: 'auto', padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3f7d6a' }} />
            <span style={{ font: '500 11px/1 Inter,sans-serif', color: '#6b7178' }}>Verified over 7 days on conversion</span>
          </div>
          <div style={{ font: '600 17px/1.4 Inter,sans-serif', color: '#23272d', marginTop: 11 }}>Recovered $7,240</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', padding: '9px 0', borderBottom: '1px solid #f1f2f4', font: '600 9px/1 Inter,sans-serif', letterSpacing: '0.06em', color: '#6b7178', marginTop: 14 }}>
            <div>METRIC</div><div style={{ textAlign: 'right' }}>BEFORE</div><div style={{ textAlign: 'right' }}>AFTER</div><div style={{ textAlign: 'right' }}>CHANGE</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', padding: '11px 0', borderBottom: '1px solid #f1f2f4', font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>
            <div>Conversion</div><div style={{ textAlign: 'right' }}>6.4%</div><div style={{ textAlign: 'right' }}>8.9%</div><div style={{ textAlign: 'right', color: '#3f7d6a', fontWeight: 600 }}>+2.5 pt</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 90px 90px', padding: '11px 0', font: '400 12px/1 Inter,sans-serif', color: '#464646' }}>
            <div>Net profit · 7d</div><div style={{ textAlign: 'right' }}>$12,180</div><div style={{ textAlign: 'right' }}>$19,420</div><div style={{ textAlign: 'right', color: '#3f7d6a', fontWeight: 600 }}>+$7,240</div>
          </div>
          <span onClick={onBackToAlerts} style={{ display: 'inline-block', marginTop: 18, padding: '10px 16px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Back to alerts</span>
        </div>
      </div>
    );
  }

  if (phase === 'genReview') {
    return (
      <div style={{ flex: 1, minWidth: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ height: '100%', overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ font: '600 14px/1 Inter,sans-serif', color: '#23272d' }}>Review generated content</span>
            <span style={{ padding: '2px 7px', borderRadius: 4, background: '#f3eefa', font: '600 9px/1.5 Inter,sans-serif', color: '#5f3880' }}>AI DRAFT · NOT PUBLISHED</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 14 }}>
            <div style={{ background: '#fff', padding: 15 }}>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Live now</div>
              <div style={{ marginTop: 10, padding: 12, border: '1px solid #e6e8ec', borderRadius: 7, background: '#fafbfd', font: '400 12px/1.75 Inter,sans-serif', color: '#6b7178' }}>Premium whey isolate<br />25g protein per serving<br />Great taste, mixes well</div>
            </div>
            <div style={{ background: '#fdfcfe', padding: 15 }}>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#5f3880' }}>Proposed · editable</div>
              <textarea style={{ width: '100%', marginTop: 10, padding: 12, border: '1px solid #77469b', borderRadius: 7, background: '#fff', font: '400 12px/1.75 Inter,sans-serif', color: '#23272d', minHeight: 88, outline: 'none', resize: 'vertical' as const }} defaultValue={`Ultra-filtered whey protein isolate — 25g protein, 0g sugar\nThird-party lab tested for banned substances\nMixes instantly, no clumping`} />
              <div style={{ display: 'flex', gap: 6, marginTop: 9 }}>
                <span style={{ padding: '3px 8px', borderRadius: 5, background: '#eef6f3', font: '600 9px/1.5 Inter,sans-serif', color: '#3f7d6a' }}>COMPLIANCE PASSED</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16 }}>
            <span onClick={onApproveGenReview} style={{ padding: '10px 16px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>Approve and publish</span>
            <span onClick={onBackToAlerts} style={{ padding: '10px 16px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Cancel</span>
          </div>
        </div>
      </div>
    );
  }

  // View phase
  const valueColor = sel.valueNum < 0 ? '#b3453f' : '#3f7d6a';
  return (
    <div style={{ flex: 1, minWidth: 0, height: '100%', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f2f4' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap', rowGap: 8, marginBottom: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 5, background: '#f1f2f4', flex: 'none', whiteSpace: 'nowrap' as const }}>
              <span style={{ width: 16, height: 16, borderRadius: 4, background: sel.mpColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                {sel.mpBrand === 'walmart' ? (
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><g stroke="#fff" strokeWidth="1.5" strokeLinecap="round"><path d="M8 1.2v4.6M8 10.2v4.6M2.3 4l4 2.3M9.7 9.7l4 2.3M2.3 12l4-2.3M9.7 6.3l4-2.3" /></g><circle cx="8" cy="8" r="1.6" fill="#fff" /></svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 16 16" fill="none"><path d="M3.2 10.6c2.6 1.7 6.9 1.9 9.6.15" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" /><path d="M11.6 9.9c.55-.15 1.35 0 1.4.35.1.7-.6 1.5-1 1.85" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </span>
              <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#5c636e', whiteSpace: 'nowrap' }}>{sel.mpCountry} · {sel.account}</span>
            </span>
            <span style={{ padding: '3px 8px', borderRadius: 5, background: '#f3eefa', font: '600 11px/1 Inter,sans-serif', color: '#5f3880', flex: 'none', whiteSpace: 'nowrap' }}>{sel.category}</span>
            {sel.repeated && <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 5, background: '#fbf1ef', font: '600 11px/1 Inter,sans-serif', color: '#a8763f', flex: 'none', whiteSpace: 'nowrap' }}>↻ Repeated</span>}
            {sel.hasMeeting && <span style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 5, background: '#f1f2f4', font: '600 11px/1 Inter,sans-serif', color: '#5c636e', flex: 'none', whiteSpace: 'nowrap' }}>{sel.meetingLabel}</span>}
            <span style={{ marginLeft: 'auto', font: '400 11px/1 Inter,sans-serif', color: '#6b7178', flex: 'none', whiteSpace: 'nowrap' }}>{sel.time}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ font: '600 18px/1.35 Inter,sans-serif', color: '#23272d' }}>{sel.title}</div>
              <div style={{ font: '400 12px/1.55 Inter,sans-serif', color: '#6b7178', marginTop: 6 }}>{sel.subheader}</div>
            </div>
            <div style={{ textAlign: 'right', flex: 'none' }}>
              <div style={{ font: '600 22px/1 Inter,sans-serif', color: valueColor }}>{money(sel.valueNum)}</div>
              <div style={{ marginTop: 6, padding: '2px 7px', borderRadius: 4, background: sel.proof === 'verified' ? '#eef6f3' : '#f1f2f4', font: '600 10px/1.5 Inter,sans-serif', color: sel.proof === 'verified' ? '#3f7d6a' : '#5c636e', display: 'inline-block' }}>{sel.proof === 'verified' ? 'VERIFIED' : 'ESTIMATED'}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Why + Root cause */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ background: '#fff', padding: 14 }}><div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Why it happened</div><div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#464646', marginTop: 7 }}>{sel.why}</div></div>
            <div style={{ background: '#fff', padding: 14 }}><div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Root cause</div><div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#464646', marginTop: 7 }}>{sel.root}</div></div>
          </div>

          {/* Business impact */}
          <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, padding: 14 }}>
            <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Business impact</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 10 }}>
              <div style={{ background: '#fafbfd', padding: 12 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Opportunity window</div><div style={{ font: '600 15px/1 Inter,sans-serif', color: '#23272d', marginTop: 6 }}>{sel.oppWindow}</div></div>
              <div style={{ background: '#fafbfd', padding: 12 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{sel.revLabel}</div><div style={{ font: '600 15px/1 Inter,sans-serif', color: valueColor, marginTop: 6 }}>{sel.revValue}</div></div>
              <div style={{ background: '#fafbfd', padding: 12 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Confidence</div><div style={{ font: '600 15px/1 Inter,sans-serif', color: '#23272d', marginTop: 6 }}>{sel.confidence}%</div></div>
            </div>
            <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 9 }}>Detected via {sel.category} · {sel.source}</div>
          </div>

          {/* AI summary */}
          <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
            <div onClick={() => setAiSummaryOpen(!aiSummaryOpen)} style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: '#fbfafd' }}>
              <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#5f3880' }}>✦ AI summary</span>
              <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#77469b' }}>{aiSummaryOpen ? 'Collapse' : 'Read more'}</span>
            </div>
            {aiSummaryOpen && (
              <div style={{ padding: '0 14px 14px', font: '400 12px/1.65 Inter,sans-serif', color: '#464646' }}>{sel.aiSummary}</div>
            )}
          </div>

          {/* Strategy picker */}
          <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f2f4' }}>
              <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>Choose your strategy</span>
            </div>
            {sel.options.map((o) => (
              <div key={o.id} onClick={() => { setSelectedOptionId(o.id); }} style={{ padding: '13px 14px', borderBottom: '1px solid #f1f2f4', display: 'flex', gap: 11, alignItems: 'flex-start', cursor: 'pointer', background: optId === o.id ? '#fbfafd' : '#fff' }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', border: optId === o.id ? '4px solid #77469b' : '1px solid #dfe3ea', flex: 'none', marginTop: 2 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                    <span style={{ font: '600 12px/1.4 Inter,sans-serif', color: '#23272d' }}>{o.label}</span>
                    {o.recommended && <span style={{ font: '600 10px/1 Inter,sans-serif', color: '#5f3880' }}>◆ Recommended</span>}
                  </div>
                  <div style={{ font: '400 11px/1.55 Inter,sans-serif', color: '#6b7178', marginTop: 4 }}>{o.desc}</div>
                  {o.expected && (
                    <div style={{ display: 'flex', gap: 16, marginTop: 7, font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>
                      <span>Est. <strong style={{ font: '600 11px Inter,sans-serif', color: '#464646' }}>{o.expected}</strong></span>
                      <span>Confidence <strong style={{ font: '600 11px Inter,sans-serif', color: '#464646' }}>{o.confidence}%</strong></span>
                    </div>
                  )}
                  {o.isOther && optId === o.id && (
                    <textarea value={otherText} onChange={(e) => setOtherText(e.target.value)} placeholder="Describe what should happen instead…" style={{ width: '100%', marginTop: 9, padding: '9px 11px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1.5 Inter,sans-serif', color: '#464646', resize: 'vertical' as const, minHeight: 52, outline: 'none' }} />
                  )}
                  {o.isMeetingAsk && (
                    <span style={{ display: 'inline-block', marginTop: 8, padding: '7px 12px', border: '1px solid #dfe3ea', borderRadius: 6, font: '600 11px/1 Inter,sans-serif', color: '#3d434b' }}>Add to meeting</span>
                  )}
                </div>
              </div>
            ))}
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 9, background: '#fafbfd' }}>
              <span onClick={handleExecute} style={{ padding: '10px 16px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8l3.5 3.5L13 4.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {executeLabel}
              </span>
              <span style={{ padding: '9px 14px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Dismiss</span>
            </div>
          </div>

          {/* Affected items */}
          {sel.items.length > 0 && (
            <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f2f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>Affected items</span>
                <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{sel.itemsCount} total</span>
              </div>
              {sel.items.slice(0, 4).map((it, i) => (
                <div key={i} style={{ padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 11, borderBottom: '1px solid #f1f2f4' }}>
                  <span style={{ flex: 1, minWidth: 0, font: '400 12px/1.4 Inter,sans-serif', color: '#464646', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{it.name}</span>
                  <span style={{ font: '600 12px/1 Inter,sans-serif', color: it.color, flex: 'none' }}>{it.impact}</span>
                </div>
              ))}
              <div onClick={onOpenItems} style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#77469b' }}>Show all {sel.itemsCount} →</span>
              </div>
            </div>
          )}
        </div>

        {/* Sticky action bar */}
        <div style={{ position: 'sticky', bottom: 0, background: '#fff', borderTop: '1px solid #e6e8ec', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span onClick={() => setDetailMenu(detailMenu === 'assign' ? null : 'assign')} style={{ padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', position: 'relative' }}>
            👤 Assign
            {detailMenu === 'assign' && (
              <div style={{ position: 'absolute', left: 0, bottom: 38, width: 180, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 70, textAlign: 'left' }}>
                <div style={{ padding: '6px 10px 8px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Assign to</div>
                <div style={{ padding: '9px 10px', borderRadius: 6, font: '500 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Mike Torres</div>
                <div style={{ padding: '9px 10px', borderRadius: 6, font: '500 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Priya Nair</div>
              </div>
            )}
          </span>
          <span onClick={() => setDetailMenu(detailMenu === 'share' ? null : 'share')} style={{ padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', position: 'relative' }}>
            ⤴ Share
            {detailMenu === 'share' && (
              <div style={{ position: 'absolute', left: 0, bottom: 38, width: 180, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 9, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 6, zIndex: 70, textAlign: 'left' }}>
                <div style={{ padding: '6px 10px 8px', font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#9aa0a8' }}>Share via</div>
                <div style={{ padding: '9px 10px', borderRadius: 6, font: '500 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>✉ Email</div>
                <div style={{ padding: '9px 10px', borderRadius: 6, font: '500 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>▦ Workspace · Nutrabay</div>
              </div>
            )}
          </span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 9, position: 'relative' }}>
            <span style={{ font: '400 10px/1 Inter,sans-serif', color: '#9aa0a8' }}>Rate these results</span>
            <span onClick={() => { setThumb('up'); setFeedbackOpen(false); }} style={{ cursor: 'pointer', color: thumb === 'up' ? '#3f7d6a' : '#9aa0a8' }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M6 14H3.5A1.5 1.5 0 0 1 2 12.5V8a1.5 1.5 0 0 1 1.5-1.5H6m0 7.5V6.5m0 7.5h5.2c.7 0 1.3-.5 1.4-1.2l.9-4A1.5 1.5 0 0 0 12 7H9V3.5A1.5 1.5 0 0 0 7.5 2L6 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
            </span>
            <span onClick={() => { setThumb('down'); setFeedbackOpen(true); }} style={{ cursor: 'pointer', color: thumb === 'down' ? '#b3453f' : '#9aa0a8' }}>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ transform: 'rotate(180deg)' }}><path d="M6 14H3.5A1.5 1.5 0 0 1 2 12.5V8a1.5 1.5 0 0 1 1.5-1.5H6m0 7.5V6.5m0 7.5h5.2c.7 0 1.3-.5 1.4-1.2l.9-4A1.5 1.5 0 0 0 12 7H9V3.5A1.5 1.5 0 0 0 7.5 2L6 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
            </span>
            {feedbackOpen && (
              <div style={{ position: 'absolute', right: 0, bottom: 38, width: 280, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 16, zIndex: 75, textAlign: 'left' }}>
                <div style={{ font: '600 13px/1.4 Inter,sans-serif', color: '#23272d' }}>Help us make it better for you</div>
                <textarea placeholder="What was off about this recommendation?" style={{ width: '100%', marginTop: 11, padding: '9px 11px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1.5 Inter,sans-serif', color: '#464646', resize: 'vertical' as const, minHeight: 64, outline: 'none' }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 11 }}>
                  <span onClick={() => setFeedbackOpen(false)} style={{ padding: '9px 15px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>Send</span>
                  <span onClick={() => setFeedbackOpen(false)} style={{ padding: '9px 15px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Cancel</span>
                </div>
              </div>
            )}
          </span>
        </div>
      </div>

      {itemsModalOpen && <ItemsModal items={sel.items} itemCount={sel.itemsCount} breakdown={sel.itemsBreakdown} onClose={onCloseItems} />}
    </div>
  );
}
