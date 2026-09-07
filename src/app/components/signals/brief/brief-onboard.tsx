import { useState } from 'react';

interface Props {
  onComplete: () => void;
  onSkip: () => void;
}

export function BriefOnboard({ onComplete, onSkip }: Props) {
  const [step] = useState(1);

  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
      <div style={{ width: 720 }}>
        <div style={{ font: '600 22px/1.35 Inter,sans-serif', color: '#23272d' }}>Let's set up your brief</div>
        <div style={{ font: '400 14px/1.7 Inter,sans-serif', color: '#6b7178', marginTop: 8 }}>Four things, about five minutes. You can start with alerts only and add the rest later — each one switches on a section of the brief.</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 18 }}>
          <div style={{ flex: 1, height: 5, borderRadius: 3, background: '#e6e8ec', overflow: 'hidden' }}>
            <div style={{ width: '25%', height: '100%', background: '#77469b' }} />
          </div>
          <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#464646' }}>Step 1 of 4</span>
        </div>

        <div style={{ background: '#fff', border: '1px solid #77469b', borderRadius: 10, padding: 22, marginTop: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#77469b', color: '#fff', font: '700 11px/24px Inter,sans-serif', textAlign: 'center' }}>1</span>
            <span style={{ font: '600 15px/1 Inter,sans-serif', color: '#23272d' }}>Account goals</span>
            <span style={{ marginLeft: 'auto', font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Required</span>
          </div>
          <div style={{ font: '400 13px/1.7 Inter,sans-serif', color: '#6b7178', marginTop: 10 }}>Goals are what every alert and action gets measured against. Set at least one per account.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}><div style={{ font: '600 11px/1 Inter,sans-serif', color: '#6b7178', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Metric</div><div style={{ marginTop: 7, padding: '11px 13px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 13px/1 Inter,sans-serif', color: '#464646' }}>Net margin</div></div>
              <div style={{ width: 150 }}><div style={{ font: '600 11px/1 Inter,sans-serif', color: '#6b7178', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>Target</div><div style={{ marginTop: 7, padding: '11px 13px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 13px/1 Inter,sans-serif', color: '#464646' }}>18%</div></div>
              <div style={{ width: 170 }}><div style={{ font: '600 11px/1 Inter,sans-serif', color: '#6b7178', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>By</div><div style={{ marginTop: 7, padding: '11px 13px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 13px/1 Inter,sans-serif', color: '#464646' }}>31 December 2025</div></div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}><div style={{ marginTop: 7, padding: '11px 13px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 13px/1 Inter,sans-serif', color: '#9aa0a8' }}>Add another metric</div></div>
              <div style={{ width: 150 }}><div style={{ marginTop: 7, padding: '11px 13px', border: '1px solid #f1f2f4', borderRadius: 7, font: '400 13px/1 Inter,sans-serif', color: '#c8ccd2' }}>—</div></div>
              <div style={{ width: 170 }}><div style={{ marginTop: 7, padding: '11px 13px', border: '1px solid #f1f2f4', borderRadius: 7, font: '400 13px/1 Inter,sans-serif', color: '#c8ccd2' }}>—</div></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 18 }}>
            <span onClick={onComplete} style={{ padding: '11px 17px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 13px/1 Inter,sans-serif', cursor: 'pointer' }}>Save and continue</span>
            <span onClick={onSkip} style={{ padding: '11px 17px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 13px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}>Skip for now</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
          {[
            { num: 2, title: 'Calendar', desc: 'Turns on today\'s meetings and alert-to-meeting mapping', action: 'Connect' },
            { num: 3, title: 'WhatsApp or Slack', desc: 'Where your morning brief and nudges arrive', actions: ['WhatsApp', 'Slack'] },
            { num: 4, title: 'Meeting bot', desc: 'Needed for minutes, task extraction and completion detection', action: 'Connect' },
          ].map((item) => (
            <div key={item.num} style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #dfe3ea', color: '#6b7178', font: '600 11px/23px Inter,sans-serif', textAlign: 'center' }}>{item.num}</span>
              <div style={{ flex: 1 }}><div style={{ font: '600 14px/1.4 Inter,sans-serif', color: '#23272d' }}>{item.title}</div><div style={{ font: '400 12px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 3 }}>{item.desc}</div></div>
              {item.actions ? (
                <div style={{ display: 'flex', gap: 7 }}>
                  {item.actions.map((a) => (
                    <span key={a} style={{ padding: '9px 14px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 12px/1 Inter,sans-serif', color: '#3d434b' }}>{a}</span>
                  ))}
                </div>
              ) : (
                <span style={{ padding: '9px 14px', borderRadius: 7, border: '1px solid #dfe3ea', font: '600 12px/1 Inter,sans-serif', color: '#3d434b' }}>{item.action}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
