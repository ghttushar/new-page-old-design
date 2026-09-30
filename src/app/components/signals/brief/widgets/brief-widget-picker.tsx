import { useState } from 'react';
import { CloseIcon, PlusIcon } from '../../alerts/icons';
import motion from '../../alerts/motion.module.scss';
import { DASHBOARD_PRESETS } from './brief-widget-presets';
import { CUSTOM_WIDGET_CATALOG, FIXED_WIDGET_CATALOG, type WidgetCatalogEntry, type WidgetKind } from './brief-widget-types';

interface Props {
  onClose: () => void;
  onAdd: (kind: WidgetKind, title: string) => void;
  onApplyPreset: (presetId: string) => void;
}

type PickerTab = 'widgets' | 'templates';

function WidgetCard({ w, onAdd }: { w: WidgetCatalogEntry; onAdd: (kind: WidgetKind, title: string) => void }) {
  return (
    <div
      onClick={() => onAdd(w.kind, w.title)}
      className={motion.cardHover}
      style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, padding: '12px 13px', border: '1px solid #e6e8ec', borderRadius: 9, cursor: 'pointer' }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ font: '600 12.5px/1.4 Inter,sans-serif', color: '#23272d' }}>{w.title}</div>
        <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#9aa0a8', marginTop: 3 }}>{w.summary}</div>
      </div>
      <span style={{ display: 'flex', flex: 'none', marginTop: 2 }}><PlusIcon size={11} color="#77469b" /></span>
    </div>
  );
}

export function WidgetPicker({ onClose, onAdd, onApplyPreset }: Props) {
  const [tab, setTab] = useState<PickerTab>('widgets');

  return (
    <div className={motion.backdropIn} style={{ position: 'fixed', inset: 0, background: 'rgba(20,24,33,.44)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 220 }} onClick={onClose}>
      <div className={motion.overlayIn} onClick={(e) => e.stopPropagation()} style={{ width: 640, height: '82vh', background: '#fff', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e6e8ec', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ font: '700 15px/1 Inter,sans-serif', color: '#23272d' }}>Add an item</span>
            <span onClick={onClose} className={motion.pressable} style={{ display: 'flex', marginLeft: 'auto', cursor: 'pointer', padding: '0 4px' }}><CloseIcon size={13} /></span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {(['widgets', 'templates'] as const).map((t) => (
              <span
                key={t}
                onClick={() => setTab(t)}
                className={motion.pressable}
                style={{ padding: '6px 13px', borderRadius: 7, cursor: 'pointer', background: tab === t ? '#77469b' : '#f3f4f6', font: '600 12px/1 Inter,sans-serif', color: tab === t ? '#fff' : '#6b7178' }}
              >
                {t === 'widgets' ? 'Widgets' : 'Templates'}
              </span>
            ))}
          </div>
        </div>

        {tab === 'widgets' ? (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '8px 20px 20px' }}>
            <div style={{ marginTop: 14 }}>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#9aa0a8', marginBottom: 8 }}>Fixed widgets</div>
              <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#9aa0a8', marginBottom: 10 }}>Product-defined — no Jiva editing, just the controls built into each one.</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {FIXED_WIDGET_CATALOG.map((w) => <WidgetCard key={w.kind} w={w} onAdd={onAdd} />)}
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#9aa0a8', marginBottom: 8 }}>Custom</div>
              <div style={{ font: '400 11px/1.5 Inter,sans-serif', color: '#9aa0a8', marginBottom: 10 }}>Starts blank — you describe it to Jiva, Jiva builds it. No preset chart types or metrics.</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {CUSTOM_WIDGET_CATALOG.map((w) => <WidgetCard key={w.kind} w={w} onAdd={onAdd} />)}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '12px 20px 20px' }}>
            <div style={{ font: '400 11.5px/1.6 Inter,sans-serif', color: '#9aa0a8', marginBottom: 10 }}>Replaces everything on the current tab with a ready-made dashboard — best used on a fresh, empty tab.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DASHBOARD_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => { onApplyPreset(preset.id); onClose(); }}
                  className={motion.cardHover}
                  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, padding: '13px 14px', border: '1px solid #e6e8ec', borderRadius: 9, cursor: 'pointer' }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ font: '600 12.5px/1.4 Inter,sans-serif', color: '#23272d' }}>{preset.label}</div>
                    <div style={{ font: '400 11.5px/1.5 Inter,sans-serif', color: '#6b7178', marginTop: 3 }}>{preset.description}</div>
                  </div>
                  <span style={{ display: 'flex', flex: 'none', marginTop: 2 }}><PlusIcon size={11} color="#77469b" /></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
