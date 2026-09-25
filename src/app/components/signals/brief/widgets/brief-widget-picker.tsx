import { useMemo, useState } from 'react';
import { CloseIcon, PlusIcon, SearchIcon } from '../../alerts/icons';
import motion from '../../alerts/motion.module.scss';
import { WIDGET_CATALOG, WIDGET_CATEGORY_ORDER, type WidgetKind } from './brief-widget-types';

interface Props {
  onClose: () => void;
  onAdd: (kind: WidgetKind, title: string) => void;
}

export function WidgetPicker({ onClose, onAdd }: Props) {
  const [query, setQuery] = useState('');

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? WIDGET_CATALOG.filter((w) => `${w.title} ${w.category} ${w.summary}`.toLowerCase().includes(q)) : WIDGET_CATALOG;
    return WIDGET_CATEGORY_ORDER.map((cat) => ({ cat, items: filtered.filter((w) => w.category === cat) })).filter((g) => g.items.length > 0);
  }, [query]);

  return (
    <div className={motion.backdropIn} style={{ position: 'fixed', inset: 0, background: 'rgba(20,24,33,.44)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 220 }} onClick={onClose}>
      <div className={motion.overlayIn} onClick={(e) => e.stopPropagation()} style={{ width: 640, maxHeight: '82vh', background: '#fff', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e6e8ec', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ font: '700 15px/1 Inter,sans-serif', color: '#23272d' }}>Add a widget</span>
            <span onClick={onClose} className={motion.pressable} style={{ display: 'flex', marginLeft: 'auto', cursor: 'pointer', padding: '0 4px' }}><CloseIcon size={13} /></span>
          </div>
          <div style={{ position: 'relative', marginTop: 12 }}>
            <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', display: 'flex' }}><SearchIcon size={13} /></span>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search metrics, charts, or operations…"
              className={motion.focusRing}
              style={{ width: '100%', padding: '9px 12px 9px 32px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '8px 20px 20px' }}>
          {grouped.length === 0 && (
            <div style={{ padding: '30px 0', textAlign: 'center' as const, font: '400 12px/1.6 Inter,sans-serif', color: '#6b7178' }}>No widgets match “{query}”.</div>
          )}
          {grouped.map((g) => (
            <div key={g.cat} style={{ marginTop: 14 }}>
              <div style={{ font: '600 10px/1 Inter,sans-serif', letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: '#9aa0a8', marginBottom: 8 }}>{g.cat}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {g.items.map((w) => (
                  <div
                    key={w.kind}
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
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
