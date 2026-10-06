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
  /** Only the Custom widget kind gets the Jiva sparkle — every fixed widget (Key stats, While you
   * were away, Notifications, Actions in progress, Checklist) and every Component Library reference
   * widget is product-defined and has nothing for Jiva to edit. */
  aiEditable?: boolean;
  /** Drops the card (border, fill, shadow, header rule) and shows the title as a plain section heading,
   * with the drag handle and menu only appearing on hover. Used by the two default Brief blocks, which read
   * as sections of one page rather than separate cards. */
  plain?: boolean;
  /** False hides the drag grip, for blocks pinned in place outside the grid. */
  movable?: boolean;
}

/** Chrome around every grid cell — drag handle, editable title, an optional "Edit with AI" sparkle, and a remove menu. Only the grip icon is the drag handle, so title editing and the buttons don't fight the grid's own drag-start. */
export function WidgetShell({ widget, children, onTitleChange, onEditWithAi, onRemove, dropTarget, aiEditable = false, plain = false, movable = true }: Props) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const tint = TONE_TINT[widget.tone ?? 'default'];
  const showControls = !plain || hovered || menuOpen || editingTitle;

  const sectionStyle: React.CSSProperties = plain
    ? {
        height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        outline: dropTarget ? '2px solid #77469b' : 'none', outlineOffset: 4, borderRadius: 8,
      }
    : {
        height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 10, background: tint.bg, overflow: 'hidden',
        border: dropTarget ? '2px solid #77469b' : `1px solid ${tint.border}`,
        boxShadow: dropTarget ? '0 0 0 4px rgba(119,70,155,.16)' : '0 1px 2px rgba(20,24,33,.04)',
        transition: 'border-color 120ms ease-out, box-shadow 120ms ease-out',
      };

  const titleFont = plain ? '600 15px/1.3 Inter,sans-serif' : '600 12px/1.4 Inter,sans-serif';

  return (
    <section style={sectionStyle} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 7, flex: 'none',
          padding: plain ? '0 0 12px' : '7px 7px 7px 9px', borderBottom: plain ? 'none' : '1px solid #f1f2f4',
        }}
      >
        {movable && <span
          className="brief-widget-drag-handle"
          title="Drag to move"
          style={{ display: 'flex', color: '#c7cad1', flex: 'none', cursor: 'grab', opacity: showControls ? 1 : 0, transition: 'opacity 140ms ease-out', marginLeft: plain ? -4 : 0 }}
        >
          <GripIcon size={12} />
        </span>}
        {editingTitle ? (
          <input
            autoFocus
            value={widget.title}
            onChange={(e) => onTitleChange(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
            style={{ flex: 1, minWidth: 0, border: 'none', borderBottom: '1px solid #77469b', outline: 'none', font: titleFont, color: '#23272d', background: 'transparent' }}
          />
        ) : (
          <span
            onClick={() => setEditingTitle(true)}
            title="Click to rename"
            style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const, font: titleFont, letterSpacing: plain ? '-0.005em' : 0, color: '#23272d', cursor: 'text' }}
          >
            {widget.title}
          </span>
        )}
        {aiEditable && (
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
        )}
        <span style={{ position: 'relative', flex: 'none', opacity: showControls ? 1 : 0, transition: 'opacity 140ms ease-out' }}>
          <span
            onClick={() => setMenuOpen((v) => !v)}
            className={motion.pressable}
            title="More"
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
      <div style={{ flex: 1, minHeight: 0, padding: plain ? 0 : 11, overflow: plain ? 'visible' : 'hidden' }}>{children}</div>
    </section>
  );
}
