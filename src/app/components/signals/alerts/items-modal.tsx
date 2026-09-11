import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef, PaginationState } from '@tanstack/react-table';
import type { AlertItem } from '@/constants/signals/prototype-data';
import { CustomTableWrapper } from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import ImgComponent from '@/app/components/common/img-component/img-component';
import { CloseIcon } from './icons';
import motion from './motion.module.scss';

interface Props {
  items: AlertItem[];
  itemCount: number;
  breakdown: string;
  onClose: () => void;
}

const COLUMNS: ColumnDef<AlertItem>[] = [
  {
    id: 'image',
    header: 'IMAGE',
    size: 70,
    cell: () => (
      <ImgComponent
        imageURL=""
        alt="Product"
        isProduct
        customStyles={{ width: 36, height: 36, objectFit: 'contain', borderRadius: 6 }}
      />
    ),
  },
  {
    accessorKey: 'name',
    id: 'productName',
    header: 'PRODUCT NAME',
    size: 420,
  },
  {
    accessorKey: 'sku',
    id: 'asin',
    header: 'ASIN NUMBER',
    size: 160,
  },
  {
    accessorKey: 'impact',
    id: 'impact',
    header: 'IMPACT',
    size: 120,
    cell: (props) => {
      const item = props.row.original;
      return <span style={{ color: item.color, fontWeight: 600 }}>{item.impact}</span>;
    },
  },
];

export function ItemsModal({ items, itemCount, breakdown, onClose }: Props) {
  const [search, setSearch] = useState('');
  const [op, setOp] = useState<'>' | '<'>('>');
  const [threshold, setThreshold] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

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

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [search, op, threshold]);

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
        <div style={{ flex: 1, minHeight: 0, padding: '0 22px 20px' }}>
          <CustomTableWrapper
            data={filtered}
            columns={COLUMNS}
            getRowId={(row, i) => `${row.sku}-${i}`}
            width="100%"
            height="440px"
            fixedHeight
            pagination={pagination}
            setPagination={setPagination}
            pageSizes={[10, 25, 50]}
          />
        </div>
      </div>
    </div>
  );
}
