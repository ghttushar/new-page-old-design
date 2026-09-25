import { useState } from 'react';
import { GripIcon, MoreVertIcon, PencilIcon, SparkleIcon, TrashIcon } from '../../alerts/icons';
import motion from '../../alerts/motion.module.scss';
import { TONE_TINT, type WidgetInstance } from './brief-widget-types';

interface Props {
  widget: WidgetInstance;
  children: React.ReactNode;
  onTitleChange: (title: string) => void;
  onEditWithAi: () => void;
  onRemove: () => void;
  /** True while another KPI widget is being dragged directly over this one — highlights it as a merge target. */
  dropTarget?: boolean;
}

/** Chrome around every grid cell — drag handle, editable title, "Edit with AI" sparkle, and a remove menu. Only the grip icon is the drag handle, so title editing and the buttons don't fight the grid's own drag-start. */
export function WidgetShell({ widget, children, onTitleChange, onEditWithAi, onRemove, dropTarget }: Props) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const tint = TONE_TINT[widget.tone ?? 'default'];

  return (
    <section
      style={{
        height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 10, background: tint.bg, overflow: 'hidden',
        border: dropTarget ? '2px solid #77469b' : `1px solid ${tint.border}`,
        boxShadow: dropTarget ? '0 0 0 4px rgba(119,70,155,.16)' : '0 1px 2px rgba(20,24,33,.04)',
        transition: 'border-color 120ms ease-out, box-shadow 120ms ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 7px 7px 9px', borderBottom: '1px solid #f1f2f4', flex: 'none' }}>
        <span className="brief-widget-drag-handle" style={{ display: 'flex', color: '#c7cad1', flex: 'none', cursor: 'grab' }}>
          <GripIcon size={12} />
        </span>
        {editingTitle ? (
          <input
            autoFocus
            value={widget.title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
            style={{ flex: 1, minWidth: 0, border: 'none', borderBottom: '1px solid #77469b', outline: 'none', font: '600 12px/1.4 Inter,sans-serif', color: '#23272d', background: 'transparent' }}
          />
        ) : (
          <span
            onClick={() => setEditingTitle(true)}
            style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, font: '600 12px/1.4 Inter,sans-serif', color: '#23272d', cursor: 'text' }}
          >
            {widget.title}
          </span>
        )}
        <span
          onClick={onEditWithAi}
          className={motion.pressable}
          title="Edit with AI"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 23, height: 23, borderRadius: 6, cursor: 'pointer', flex: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#f3eefa')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <SparkleIcon size={13} color="#5f3880" />
        </span>
        <span style={{ position: 'relative', flex: 'none' }}>
          <span
            onClick={() => setMenuOpen((v) => !v)}
            className={motion.pressable}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 23, height: 23, borderRadius: 6, cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f6f8')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <MoreVertIcon size={13} />
          </span>
          {menuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 59 }} onClick={() => setMenuOpen(false)} />
              <div className={motion.popInTop} style={{ position: 'absolute', right: 0, top: 27, width: 160, background: '#fff', border: '1px solid #e6e8ec', borderRadius: 8, boxShadow: '0 12px 28px rgba(20,24,33,.18)', padding: 5, zIndex: 60 }}>
                <div
                  onClick={() => { setEditingTitle(true); setMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', borderRadius: 6, cursor: 'pointer', font: '500 12px/1 Inter,sans-serif', color: '#3d434b' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fafbfd')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <PencilIcon size={12} /> Rename
                </div>
                <div
                  onClick={() => { onRemove(); setMenuOpen(false); }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 9px', borderRadius: 6, cursor: 'pointer', font: '500 12px/1 Inter,sans-serif', color: '#b3453f' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fdecec')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <TrashIcon size={12} /> Remove
                </div>
              </div>
            </>
          )}
        </span>
      </div>
      <div style={{ flex: 1, minHeight: 0, padding: 11, overflow: 'hidden' }}>{children}</div>
    </section>
  );
}
