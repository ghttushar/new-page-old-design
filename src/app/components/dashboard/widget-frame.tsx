import { CopySimpleIcon, DotsSixVerticalIcon, DotsThreeIcon, TrashIcon } from '@phosphor-icons/react';
import { useRef, useState } from 'react';
import { Floating, MiniSelect } from './controls';
import type { WidgetConfig, WidgetInstance } from './dashboard.types';
import { WIDGETS } from './widget-registry';
import styles from './dashboard.module.scss';

/**
 * The frame every widget sits in: a drag handle in the top-left corner, an icon tile, the title and a scope line on the
 * left, the widget's own control and a menu on the right. The handle moves the widget; the bottom right corner resizes
 * it. Both show on hover.
 */
export default function WidgetFrame({ widget, onConfig, onRemove, onDuplicate }: {
  widget: WidgetInstance; onConfig: (patch: WidgetConfig) => void; onRemove: () => void; onDuplicate: () => void;
}) {
  const def = WIDGETS[widget.kind];
  const moreRef = useRef<HTMLButtonElement>(null);
  const [menu, setMenu] = useState(false);
  const { Body, icon: Icon } = def;

  return (
    <article className={styles.widget} aria-label={def.title}>
      <header className={styles.widgetHead}>
        <span className={`${styles.grip} dash-drag-handle`} title="Drag to move" aria-label={`Move ${def.title}`} role="button" tabIndex={-1}>
          <DotsSixVerticalIcon size={14} weight="bold" />
        </span>
        <span className={styles.widgetIcon} aria-hidden><Icon size={16} /></span>
        <div className={styles.widgetHeading}>
          <h3 className={styles.widgetTitle}>{def.title}</h3>
          <p className={styles.widgetScope}>{def.describe(widget.config)}</p>
        </div>
        <div className={styles.widgetActions}>
          {def.header && (
            <MiniSelect
              variant="chip"
              value={String(widget.config[def.header.key] ?? def.defaults[def.header.key])}
              options={def.header.options} label={def.header.label}
              onChange={(v) => onConfig({ [def.header!.key]: v })}
            />
          )}
          <button
            ref={moreRef} type="button" className={styles.iconBtn}
            aria-label={`${def.title} options`} aria-haspopup="menu" aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            <DotsThreeIcon size={18} weight="bold" />
          </button>
        </div>
      </header>

      <div className={styles.widgetBody}>
        <Body config={widget.config} onConfig={onConfig} />
      </div>

      {menu && moreRef.current && (
        <Floating anchor={moreRef.current} onClose={() => setMenu(false)} label={`${def.title} options`} align="end" width={180}>
          <ul role="menu" className={styles.menuList}>
            <li><button type="button" role="menuitem" className={styles.menuItem} onClick={() => { setMenu(false); onDuplicate(); }}><CopySimpleIcon size={15} /><span>Duplicate</span></button></li>
            <li><button type="button" role="menuitem" className={`${styles.menuItem} ${styles.menuDanger}`} onClick={() => { setMenu(false); onRemove(); }}><TrashIcon size={15} /><span>Remove</span></button></li>
          </ul>
        </Floating>
      )}
    </article>
  );
}
