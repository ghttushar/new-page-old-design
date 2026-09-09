import { useEffect, useState } from 'react';
import { MEETING_LIST, MEETING_DETAILS, PREP_RECORDS } from '@/constants/signals/prototype-data';
import { StatCard } from './meeting-detail-panel';
import { BackArrowIcon, CheckIcon } from '../alerts/icons';
import motion from '../alerts/motion.module.scss';

interface Props {
  meetingId: string | null;
  onBack: () => void;
}

export function MeetingPresentation({ meetingId, onBack }: Props) {
  const meeting = MEETING_LIST.find((m) => m.id === meetingId);
  const detail = meetingId ? MEETING_DETAILS[meetingId] : undefined;
  const record = meetingId ? PREP_RECORDS[meetingId] : undefined;

  const [mcpState, setMcpState] = useState<'idle' | 'opening' | 'opened'>('idle');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setMcpState('idle');
    setEditMode(false);
  }, [meetingId]);

  if (!meeting || !detail || !record) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ font: '400 13px/1.6 Inter,sans-serif', color: '#6b7178' }}>Select a meeting to build a report for.</div>
      </div>
    );
  }

  const openInMcp = () => {
    setMcpState('opening');
    window.setTimeout(() => setMcpState('opened'), 900);
  };

  const asks = record.discussion.join('\n');
  const prompt = `Build a five-slide client deck for ${meeting.account}'s ${meeting.dateLabel.toLowerCase()} ${meeting.title.toLowerCase()}. Cover: ${detail.metrics.map((m) => `${m.label} ${m.value} (${m.trend})`).join(', ')}. Context: ${detail.accountStudy} Close with these asks: ${record.discussion.join('; ')}.`;

  return (
    <div key={meetingId} className={motion.contentFadeIn} style={{ height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center', paddingTop: 18 }}>
      <div style={{ maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span onClick={onBack} className={motion.pressable} style={{ display: 'flex', alignItems: 'center', gap: 6, font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>
            <BackArrowIcon size={12} color="#77469b" /> Back to preparation
          </span>
          <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>· Generated report</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden', marginTop: 14 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f2f4', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
            <div>
              <div style={{ font: '600 18px/1.4 Inter,sans-serif', color: '#23272d' }}>{meeting.account} · {meeting.title} report</div>
              <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>{meeting.dateLabel} · client-visible</div>
            </div>
            <div style={{ display: 'flex', gap: 9, flex: 'none' }}>
              {mcpState === 'opened' ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 15px', borderRadius: 7, background: '#eef6f3', color: '#3f7d6a', font: '600 12px/1 Inter,sans-serif' }}><CheckIcon size={11} color="#3f7d6a" /> Opened in MCP</span>
              ) : (
                <span onClick={openInMcp} className={motion.pressable} style={{ padding: '10px 15px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif', cursor: 'pointer' }}>{mcpState === 'opening' ? 'Opening…' : 'View report in MCP'}</span>
              )}
              <span onClick={() => setEditMode((v) => !v)} className={motion.pressable} style={{ padding: '10px 15px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>{editMode ? 'Done' : 'Edit'}</span>
            </div>
          </div>

          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Section 1 */}
            <div>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Section 1 · Performance</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 10 }}>
                {detail.metrics.map((s) => <StatCard key={s.label} stat={s} />)}
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Section 2 · What changed and why</div>
              <div style={{ font: '400 13px/1.8 Inter,sans-serif', color: '#464646', marginTop: 10 }}>{detail.accountStudy}</div>
            </div>

            {/* Section 3 */}
            <div>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Section 3 · What we did and what it returned</div>
              <div style={{ border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 10 }}>
                {record.actions.map((a, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 120px', padding: '11px 15px', borderBottom: i < record.actions.length - 1 ? '1px solid #f1f2f4' : 'none', font: '400 12px/1.5 Inter,sans-serif', alignItems: 'center' }}>
                    <div style={{ color: '#464646' }}>{a.action}</div>
                    <div style={{ textAlign: 'right', fontWeight: 600, color: a.impactColor, fontStyle: a.impactStyle }}>{a.impact}</div>
                    <div style={{ textAlign: 'right', color: a.stateColor }}>{a.state}</div>
                  </div>
                ))}
              </div>
              <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 9 }}>Italic figures are estimates. Only verified lines are presented as results.</div>
            </div>

            {/* Section 4 */}
            <div>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#6b7178' }}>Section 4 · What we are asking for</div>
              {editMode ? (
                <textarea
                  defaultValue={asks}
                  style={{ width: '100%', minHeight: 90, marginTop: 10, padding: 12, border: '1px solid #77469b', borderRadius: 7, font: '400 13px/1.8 Inter,sans-serif', color: '#464646', outline: 'none', resize: 'vertical' as const }}
                />
              ) : (
                <div style={{ font: '400 13px/1.9 Inter,sans-serif', color: '#464646', marginTop: 10 }}>
                  {record.discussion.map((d, i) => <span key={i}>{d}<br /></span>)}
                </div>
              )}
            </div>

            {/* MCP prompt */}
            <div style={{ border: '1px dashed #cfd4dc', borderRadius: 8, padding: 16, background: '#fbfafd' }}>
              <div style={{ font: '600 12px/1 Inter,sans-serif', color: '#5f3880' }}>Pre-populated MCP prompt</div>
              <div style={{ font: '400 12px/1.8 Inter,sans-serif', color: '#6b7178', marginTop: 9 }}>{prompt}</div>
              <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 10 }}>{mcpState === 'opened' ? 'Opened — continue in your configured MCP.' : 'Opens in your configured MCP when you click "View report in MCP" above.'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
