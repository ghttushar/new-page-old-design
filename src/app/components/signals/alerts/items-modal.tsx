import { useState, useMemo } from 'react';
import type { AlertItem } from '@/constants/signals/prototype-data';
import { CloseIcon } from './icons';
import motion from './motion.module.scss';

interface Props {
  items: AlertItem[];
  itemCount: number;
  breakdown: string;
  onClose: () => void;
}

export function ItemsModal({ items, itemCount, breakdown, onClose }: Props) {
  const [search, setSearch] = useState('');
  const [op, setOp] = useState<'>' | '<'>('>');
  const [threshold, setThreshold] = useState('');

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (search && !(it.name + it.sku).toLowerCase().includes(search.toLowerCase())) return false;
      if (threshold) {
        const t = parseFloat(threshold.replace(/[^0-9.]/g, '')) || 0;
        const v = Math.abs(parseFloat(it.impact.replace(/[^0-9.]/g, '')) || 0);
        if (op === '>' && !(v > t)) return false;
        if (op === '<' && !(v < t)) return false;
      }
      return true;
    });
  }, [items, search, op, threshold]);

  const gridCols = filtered.length < 20 ? 1 : filtered.length <= 50 ? 2 : 3;

  return (
    <div className={motion.backdropIn} style={{ position: 'fixed', inset: 0, background: 'rgba(20,24,33,.44)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
      <div className={motion.overlayIn} style={{ width: 1180, maxHeight: '84vh', background: '#fff', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid #e6e8ec', display: 'flex', alignItems: 'center', gap: 12, flex: 'none' }}>
          <span style={{ font: '700 15px/1 Inter,sans-serif', color: '#23272d' }}>All affected items</span>
          <span style={{ font: '400 12px/1 Inter,sans-serif', color: '#6b7178' }}>{breakdown}</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ASIN, listing or campaign" className={motion.focusRing} style={{ marginLeft: 'auto', width: 240, padding: '9px 12px', border: '1px solid #dfe3ea', borderRadius: 7, font: '400 12px/1 Inter,sans-serif', outline: 'none' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, border: '1px solid #dfe3ea', borderRadius: 7, overflow: 'hidden' }}>
            <span onClick={() => setOp('>')} className={motion.pressable} style={{ padding: '9px 10px', background: op === '>' ? '#f0e9f7' : '#fff', font: '700 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', transition: 'background 120ms ease-out' }}>{'>'}</span>
            <span onClick={() => setOp('<')} className={motion.pressable} style={{ padding: '9px 10px', background: op === '<' ? '#f0e9f7' : '#fff', font: '700 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', transition: 'background 120ms ease-out' }}>{'<'}</span>
            <span style={{ width: 1, height: 20, background: '#e6e8ec' }} />
            <span style={{ paddingLeft: 8, font: '600 12px/1 Inter,sans-serif', color: '#9aa0a8' }}>$</span>
            <input value={threshold} onChange={(e) => setThreshold(e.target.value)} placeholder="impact" style={{ width: 80, padding: '9px 10px 9px 2px', border: 'none', font: '400 12px/1 Inter,sans-serif', outline: 'none' }} />
          </div>
          <span onClick={onClose} className={motion.pressable} style={{ display: 'flex', cursor: 'pointer', padding: '0 4px' }}><CloseIcon size={13} /></span>
        </div>
        <div style={{ padding: '8px 22px', font: '400 11px/1 Inter,sans-serif', color: '#9aa0a8', flex: 'none' }}>Showing {filtered.length} of {itemCount}</div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '0 22px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridCols}, 1fr)`, borderLeft: '1px solid #e6e8ec' }}>
            {filtered.map((it, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px', alignItems: 'center', padding: '8px 10px', borderRight: '1px solid #e6e8ec', borderBottom: '1px solid #e6e8ec' }}>
                <div style={{ minWidth: 0, font: '400 12px/1.4 Inter,sans-serif', color: '#464646', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{it.name}</div>
                <div style={{ textAlign: 'right', font: '600 12px/1 Inter,sans-serif', color: it.color }}>{it.impact}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
