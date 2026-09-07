import { PREP_POSITIVES, PREP_NEGATIVES, PREP_ACTIONS, PREP_DISCUSSION } from '@/constants/signals/prototype-data';

interface Props {
  onBack: () => void;
  onCreatePresentation: () => void;
}

export function MeetingPrep({ onBack, onCreatePresentation }: Props) {
  return (
    <div style={{ height: '100%', overflowY: 'auto', display: 'flex', justifyContent: 'center', paddingTop: 18 }}>
      <div style={{ maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span onClick={onBack} style={{ font: '600 11px/1 Inter,sans-serif', color: '#77469b', cursor: 'pointer' }}>Back to meeting</span>
          <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>· Nutrabay Weekly review, today 10:30</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12 }}>
          <div>
            <div style={{ font: '600 20px/1.35 Inter,sans-serif', color: '#23272d' }}>Preparation summary</div>
            <div style={{ font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>Built from four linked alerts, this week's metrics and the open tasks from 25 October.</div>
          </div>
          <span onClick={onCreatePresentation} style={{ padding: '11px 17px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 13px/1 Inter,sans-serif', cursor: 'pointer' }}>Create presentation</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
          {/* Account performance */}
          <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Account performance</span>
              <span style={{ padding: '7px 12px', border: '1px solid #dfe3ea', borderRadius: 6, font: '500 11px/1 Inter,sans-serif', color: '#3d434b' }}>Choose metrics</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 13 }}>
              <div style={{ background: '#fafbfd', padding: 14 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>GMV · October</div><div style={{ font: '600 17px/1 Inter,sans-serif', color: '#23272d', marginTop: 7 }}>$412k</div><div style={{ font: '500 11px/1 Inter,sans-serif', color: '#3f7d6a', marginTop: 6 }}>up 6.2%</div></div>
              <div style={{ background: '#fafbfd', padding: 14 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Net margin</div><div style={{ font: '600 17px/1 Inter,sans-serif', color: '#23272d', marginTop: 7 }}>16.4%</div><div style={{ font: '500 11px/1 Inter,sans-serif', color: '#3f7d6a', marginTop: 6 }}>up 0.9 pt</div></div>
              <div style={{ background: '#fafbfd', padding: 14 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>ROAS</div><div style={{ font: '600 17px/1 Inter,sans-serif', color: '#23272d', marginTop: 7 }}>4.8</div><div style={{ font: '500 11px/1 Inter,sans-serif', color: '#6b7178', marginTop: 6 }}>flat</div></div>
              <div style={{ background: '#fafbfd', padding: 14 }}><div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Conversion</div><div style={{ font: '600 17px/1 Inter,sans-serif', color: '#23272d', marginTop: 7 }}>6.4%</div><div style={{ font: '500 11px/1 Inter,sans-serif', color: '#b3453f', marginTop: 6 }}>down 2.7 pt</div></div>
            </div>
          </div>

          {/* Positives + Negatives */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Positives to raise</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 13 }}>
                {PREP_POSITIVES.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3f7d6a', marginTop: 6, flex: 'none' }} /><span style={{ font: '400 13px/1.7 Inter,sans-serif', color: '#464646' }}>{p}</span></div>
                ))}
              </div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: '18px 20px' }}>
              <div style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Negatives to get ahead of</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 13 }}>
                {PREP_NEGATIVES.map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: i < 2 ? '#b3453f' : '#a8763f', marginTop: 6, flex: 'none' }} /><span style={{ font: '400 13px/1.7 Inter,sans-serif', color: '#464646' }}>{p}</span></div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions table */}
          <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f2f4', font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Relevant alerts, actions taken and impact</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 190px 110px 110px', padding: '9px 20px', background: '#fafbfd', borderBottom: '1px solid #f1f2f4', font: '600 9px/1 Inter,sans-serif', letterSpacing: '0.06em', color: '#6b7178' }}>
              <div>ALERT</div><div>ACTION TAKEN</div><div style={{ textAlign: 'right' }}>IMPACT</div><div style={{ textAlign: 'right' }}>STATE</div>
            </div>
            {PREP_ACTIONS.map((a, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 190px 110px 110px', padding: '12px 20px', borderBottom: i < PREP_ACTIONS.length - 1 ? '1px solid #f1f2f4' : 'none', alignItems: 'center', font: '400 12px/1.5 Inter,sans-serif' }}>
                <div style={{ color: '#464646' }}>{a.alert}</div>
                <div style={{ color: '#6b7178' }}>{a.action}</div>
                <div style={{ textAlign: 'right', fontWeight: 600, color: a.impactColor, fontStyle: a.impactStyle }}>{a.impact}</div>
                <div style={{ textAlign: 'right', color: a.stateColor }}>{a.state}</div>
              </div>
            ))}
          </div>

          {/* Discussion points */}
          <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Discussion points</span>
              <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>Editable · reorder or add your own</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 13 }}>
              {PREP_DISCUSSION.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', border: '1px solid #e6e8ec', borderRadius: 8 }}>
                  <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178', width: 12 }}>{i + 1}</span>
                  <span style={{ flex: 1, font: '400 13px/1.6 Inter,sans-serif', color: '#464646' }}>{d}</span>
                  <span style={{ font: '600 11px/1 Inter,sans-serif', color: '#6b7178' }}>Edit</span>
                </div>
              ))}
              <div style={{ padding: '11px 13px', border: '1px dashed #cfd4dc', borderRadius: 8, font: '400 13px/1 Inter,sans-serif', color: '#6b7178' }}>Add a discussion point</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
