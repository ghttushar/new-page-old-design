import { WORKSTATION_TASKS, ACTION_HISTORY, ACCOUNT_GOALS } from '@/constants/signals/prototype-data';

export function WorkStation() {
  return (
    <div style={{ height: '100%', display: 'flex', gap: 16 }}>
      {/* Left — Task list */}
      <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e6e8ec', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ font: '600 15px/1 Inter,sans-serif', color: '#23272d' }}>Tasks in hand</div>
              <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>From meetings only · 3 of 7 done this week</div>
            </div>
            <span style={{ padding: '9px 14px', borderRadius: 7, background: '#77469b', color: '#fff', font: '600 12px/1 Inter,sans-serif' }}>Create task</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 13 }}>
            <span style={{ flex: 1, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#6b7178' }}>Search tasks</span>
            <span style={{ padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 11px/1 Inter,sans-serif', color: '#3d434b' }}>Not done</span>
            <span style={{ padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '500 11px/1 Inter,sans-serif', color: '#3d434b' }}>1 – 8 Nov</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {WORKSTATION_TASKS.map((t) => (
            <div key={t.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f1f2f4', display: 'flex', gap: 13, alignItems: 'flex-start' }}>
              {t.done ? (
                <span style={{ width: 16, height: 16, borderRadius: 4, background: '#3f7d6a', color: '#fff', font: '700 9px/16px Inter,sans-serif', textAlign: 'center', flex: 'none', marginTop: 2 }}>✓</span>
              ) : (
                <span style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid #cfd4dc', flex: 'none', marginTop: 2 }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: `${t.done ? '400' : '500'} 13px/1.5 Inter,sans-serif`, color: t.done ? '#6b7178' : '#23272d', textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</div>
                <div style={{ display: 'flex', gap: 14, marginTop: 6, font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>
                  <span>{t.assignee}</span>
                  <span>{t.meeting}</span>
                  <span style={{ color: t.dueColor }}>{t.due}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Goals + Actions */}
      <div style={{ flex: '0 0 38%', maxWidth: '38%', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Account goals */}
        <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, padding: '18px 20px' }}>
          <div style={{ font: '600 15px/1 Inter,sans-serif', color: '#23272d' }}>Account goals</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#e6e8ec', border: '1px solid #e6e8ec', borderRadius: 8, overflow: 'hidden', marginTop: 14 }}>
            {ACCOUNT_GOALS.slice(0, 2).map((g, i) => (
              <div key={i} style={{ background: '#fafbfd', padding: 15 }}>
                <div style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>{g.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, marginTop: 8 }}>
                  <span style={{ font: '600 19px/1 Inter,sans-serif', color: '#23272d' }}>{g.current}</span>
                  <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>of {g.target}</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: '#e6e8ec', marginTop: 10, overflow: 'hidden' }}>
                  <div style={{ width: `${g.pct}%`, height: '100%', background: g.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions history */}
        <div style={{ background: '#fff', border: '1px solid #e6e8ec', borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f2f4', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ font: '600 13px/1 Inter,sans-serif', color: '#23272d' }}>Actions taken for net margin</span>
            <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#6b7178' }}>4 this month</span>
          </div>
          {ACTION_HISTORY.map((a, i) => (
            <div key={i} style={{ padding: '14px 20px', borderBottom: i < ACTION_HISTORY.length - 1 ? '1px solid #f1f2f4' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.dotColor }} />
                <span style={{ flex: 1, font: '500 13px/1.4 Inter,sans-serif', color: '#464646' }}>{a.label}</span>
                <span style={{ font: '600 12px/1 Inter,sans-serif', color: a.impactColor, fontStyle: a.impactStyle }}>{a.impact}</span>
              </div>
              <div style={{ font: '400 11px/1.6 Inter,sans-serif', color: '#6b7178', marginTop: 5 }}>{a.meta}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
