import { useState } from 'react';
import WidgetFrame from '../../dashboard/widget-frame';
import type { WidgetConfig, WidgetInstance, WidgetKind } from '../../dashboard/dashboard.types';
import { WIDGETS } from '../../dashboard/widget-registry';
import styles from './signals-brief.module.scss';

// The Signals brief: the four Signals nuggets from the dashboard, in a fixed layout that fills the tab. Value at risk,
// Opportunity value and Important messages across the top, While you were away across the bottom. Nothing moves or
// resizes and there is nothing to add; each nugget keeps its own setting (period, channel, priority).

const KINDS: WidgetKind[] = ['value-at-risk', 'opportunity-value', 'important-messages', 'while-away'];

export default function SignalsBrief() {
  const [widgets, setWidgets] = useState<WidgetInstance[]>(() =>
    KINDS.map((kind) => ({ id: `brief-${kind}`, kind, config: { ...WIDGETS[kind].defaults } })));
  const patch = (id: string, change: WidgetConfig) =>
    setWidgets((list) => list.map((w) => (w.id === id ? { ...w, config: { ...w.config, ...change } } : w)));

  return (
    <div className={styles.brief}>
      {widgets.map((w) => (
        <div key={w.id} className={styles[w.kind === 'while-away' ? 'wide' : 'cell']}>
          <WidgetFrame widget={w} onConfig={(change) => patch(w.id, change)} fixed />
        </div>
      ))}
    </div>
  );
}
