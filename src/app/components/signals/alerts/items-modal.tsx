import { useEffect, useMemo, useState } from 'react';
import type { ColumnDef, PaginationState, RowSelectionState } from '@tanstack/react-table';
import type { AlertItem } from '@/constants/signals/prototype-data';
import { CustomTableWrapper } from '@/app/components/shared/custom-table-wrapper/custom-table-wrapper';
import ImgComponent from '@/app/components/common/img-component/img-component';
import { deriveSku } from './items-util';
import { CloseIcon, DownloadIcon } from './icons';
import motion from './motion.module.scss';
import tableCompact from './items-table-compact.module.scss';

interface Props {
  items: AlertItem[];
  itemCount: number;
  breakdown: string;
  onClose: () => void;
  /** 'select' (Alerts' Execute): every item starts ticked, and the footer runs the action on the ticked ones. */
  mode?: 'view' | 'select';
  /** The action being executed, for the select-mode title and button. */
  actionLabel?: string;
  onConfirm?: (keys: string[]) => void;
  /** Adds a Status column: the action applied to an item, or Pending. */
  statusFor?: (item: AlertItem) => string;
  title?: string;
}

function downloadItemsCsv(items: AlertItem[]) {
  const header = ['Product Name', 'SKU', 'ASIN Number', 'Impact'];
  const rows = items.map((it) => [it.name, deriveSku(it.name, it.sku), it.sku, it.impact]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'affected-items.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
        customStyles={{ width: 22, height: 22, objectFit: 'contain', borderRadius: 5 }}
      />
    ),
  },
  {
    accessorKey: 'name',
    id: 'productName',
    header: 'PRODUCT NAME',
    size: 340,
  },
  {
    id: 'sku',
    header: 'SKU',
    size: 130,
    cell: (props) => deriveSku(props.row.original.name, props.row.original.sku),
  },
  {
    accessorKey: 'sku',
    id: 'asin',
    header: 'ASIN NUMBER',
    size: 140,
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

const plural = (n: number, one: string) => `${n} ${n === 1 ? one : `${one}s`}`;

export function ItemsModal({ items, itemCount, breakdown, onClose, mode = 'view', actionLabel, onConfirm, statusFor, title }: Props) {
  const selecting = mode === 'select';
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(() => (selecting ? Object.fromEntries(items.map((it) => [it.sku, true])) : {}));
  const picked = Object.keys(rowSelection).filter((k) => rowSelection[k]);
  const columns = useMemo<ColumnDef<AlertItem>[]>(() => (statusFor ? [...COLUMNS, {
    id: 'status',
    header: 'STATUS',
    size: 170,
    cell: (props) => {
      const label = statusFor(props.row.original);
      const pending = label === 'Pending';
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: '500 11.5px/1.3 Inter,sans-serif', color: pending ? '#a8763f' : label === 'Dismissed' ? '#9aa0a8' : '#3f7d6a' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flex: 'none' }} />
          {label}
        </span>
      );
    },
  }] : COLUMNS), [statusFor]);
  const stillAffected = statusFor ? items.filter((it) => statusFor(it) === 'Pending').length : null;
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
          <span style={{ font: '700 15px/1 Inter,sans-serif', color: '#23272d' }}>{title ?? (selecting ? `Choose items · ${actionLabel ?? 'Execute'}` : 'All affected items')}</span>
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
        <div style={{ padding: '8px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 'none' }}>
          <span style={{ font: '400 11px/1 Inter,sans-serif', color: '#9aa0a8' }}>
            {selecting ? `Untick the items to leave out. Showing ${filtered.length} of ${itemCount}` : `Showing ${filtered.length} of ${itemCount}`}
            {stillAffected !== null && stillAffected < items.length && (stillAffected === 0
              ? <> · <b style={{ color: '#3f7d6a', fontWeight: 600 }}>all handled</b></>
              : <> · <b style={{ color: '#a8763f', fontWeight: 600 }}>{stillAffected} still affected</b></>)}
          </span>
          <span
            onClick={() => downloadItemsCsv(filtered)}
            className={`${motion.pressable} ${motion.btnSecondary}`}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 11px', border: '1px solid #dfe3ea', borderRadius: 6, font: '600 11px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer' }}
          >
            <DownloadIcon size={12} /> Download
          </span>
        </div>
        <div style={{ flex: 1, minHeight: 0, padding: '0 22px 20px' }}>
          <CustomTableWrapper
            data={filtered}
            columns={columns}
            getRowId={(row) => row.sku}
            enableRowSelection={selecting}
            rowSelection={selecting ? rowSelection : undefined}
            setRowSelection={selecting ? setRowSelection : undefined}
            width="100%"
            height={selecting ? '400px' : '440px'}
            fixedHeight
            pagination={pagination}
            setPagination={setPagination}
            pageSizes={[10, 25, 50]}
            customStyles={{
              thead: { tr: { th: { className: tableCompact.thCompact, wrapper: tableCompact.cellWrapperCompact } } },
              tbody: { tr: { td: { wrapper: tableCompact.cellWrapperCompact, tdDiv: tableCompact.tdDivCompact } } },
            }}
          />
        </div>
        {selecting && (
          <div style={{ padding: '12px 22px', borderTop: '1px solid #e6e8ec', background: '#fafbfd', display: 'flex', alignItems: 'center', gap: 10, flex: 'none' }}>
            <span style={{ font: '600 12px/1 Inter,sans-serif', color: '#23272d' }}>{picked.length} of {itemCount} selected</span>
            {picked.length < itemCount && picked.length > 0 && (
              <span style={{ font: '400 11.5px/1 Inter,sans-serif', color: '#6b7178' }}>The other {itemCount - picked.length} stay open for a different action.</span>
            )}
            <span onClick={onClose} className={`${motion.pressable} ${motion.btnSecondary}`} style={{ marginLeft: 'auto', padding: '10px 16px', border: '1px solid #dfe3ea', borderRadius: 7, font: '600 12px/1 Inter,sans-serif', color: '#3d434b', cursor: 'pointer', background: '#fff' }}>Cancel</span>
            <span
              role="button" aria-disabled={picked.length === 0}
              onClick={() => { if (picked.length > 0) onConfirm?.(picked); }}
              className={picked.length > 0 ? motion.btnPrimary : undefined}
              style={{ padding: '10px 16px', borderRadius: 7, background: picked.length > 0 ? '#77469b' : '#e6e1ec', color: picked.length > 0 ? '#fff' : '#9a92a6', font: '600 12px/1 Inter,sans-serif', cursor: picked.length > 0 ? 'pointer' : 'not-allowed' }}
            >
              Execute on {plural(picked.length, 'item')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
