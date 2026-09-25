import { useEffect, useRef, useState } from 'react';
import DiamondMascot from '@/app/components/common/diamond-mascot/diamond-mascot';
import { DASHBOARD_METRICS } from '@/constants/signals/prototype-data';
import { CloseIcon } from '../../alerts/icons';
import motion from '../../alerts/motion.module.scss';
import scrollStyles from '../../alerts/alerts-scroll.module.scss';
import type { WidgetInstance } from './brief-widget-types';
import { kpiMetricIds } from './brief-widget-body';
import { COLOR_WORDS, SERIES_COLORS, SERIES_MAX, chartSeries, isChartSeriesKind, seriesCatalogFor } from './brief-widget-configurable-charts';

interface Props {
  widget: WidgetInstance;
  /** A series id (chart-series kinds) or a metric-slot index as a string (`kpi`/`metricRow`) — narrows every edit to that one item instead of the whole widget. Null when opened from the widget's own header sparkle or an empty chart's "Customize" button. */
  focusKey: string | null;
  onClose: () => void;
  onApply: (changes: Partial<WidgetInstance>) => void;
}

interface ChatMessage { id: string; from: 'jiva' | 'user'; text: string }

// The pre-coded set of one-click actions — pinned above the chat (not tied to how many messages
// have been sent) so there's always a guaranteed-to-work action within reach, not just free-text.
// Every pill is just a canned prompt fed through the same `buildChanges` parser a typed message
// would use, so clicking one applies instantly and shows up as a normal exchange in the transcript.
const SUGGESTIONS_BASE = ['Make this green', 'Make this purple', 'Make this warm', 'Rename to Morning pulse'];
const SUGGESTIONS_KPI_WHOLE = ['Add ROAS', 'Add CVR', 'Show ad spend', 'Remove last'];
const SUGGESTIONS_MEMBER_FOCUS = ['Change to ROAS', 'Change to ad spend', 'Change to CVR', 'Remove this'];
const SUGGESTIONS_CHART_WHOLE = ['Add ROAS', 'Add spend and sales', 'Add top metrics', 'Remove the last bar'];
const SUGGESTIONS_SERIES_FOCUS = ['Make this blue', 'Make this green', 'Change to ROAS', 'Remove this'];

function isMetricFamily(widget: WidgetInstance): boolean {
  return widget.kind === 'kpi' || widget.kind === 'metricRow';
}

function suggestionsFor(widget: WidgetInstance, focusKey: string | null): string[] {
  if (isChartSeriesKind(widget.kind)) return focusKey !== null ? SUGGESTIONS_SERIES_FOCUS : [...SUGGESTIONS_CHART_WHOLE, ...SUGGESTIONS_BASE];
  if (isMetricFamily(widget)) return focusKey !== null ? SUGGESTIONS_MEMBER_FOCUS : [...SUGGESTIONS_KPI_WHOLE, ...SUGGESTIONS_BASE];
  return SUGGESTIONS_BASE;
}

/** What the sheet is actually scoped to right now — null when it's the whole widget. */
function focusLabelFor(widget: WidgetInstance, focusKey: string | null): string | null {
  if (focusKey === null) return null;
  if (isChartSeriesKind(widget.kind)) {
    const item = chartSeries(widget.config).find((s) => s.id === focusKey);
    if (!item) return null;
    return seriesCatalogFor(widget.kind).find((f) => f.id === item.metricId)?.label ?? item.metricId;
  }
  if (isMetricFamily(widget)) {
    const id = kpiMetricIds(widget.config)[Number(focusKey)];
    return DASHBOARD_METRICS.find((m) => m.id === id)?.label ?? null;
  }
  return null;
}

/** Purely local pattern-matching, same as the rest of this app's mocked Jiva features — no real model call, just enough to feel responsive in the prototype. */
function buildChanges(widget: WidgetInstance, prompt: string, focusKey: string | null): Partial<WidgetInstance> | null {
  const lower = prompt.trim().toLowerCase();
  if (!lower) return null;
  const changes: Partial<WidgetInstance> = {};

  if (/\bgreen\b|\bpositive\b/.test(lower)) changes.tone = 'positive';
  else if (/\borange\b|\bwarning\b|\brisk\b|\bred\b/.test(lower)) changes.tone = 'warning';
  else if (/\bpurple\b|\bfocus\b/.test(lower)) changes.tone = 'focus';
  else if (/\bneutral\b|\bdefault\b|\bwhite\b/.test(lower)) changes.tone = 'default';

  const renameMatch = lower.match(/rename(?: it| this)? to (.+)/);
  if (renameMatch) {
    const name = renameMatch[1].trim();
    changes.title = name.charAt(0).toUpperCase() + name.slice(1);
  }

  if (isChartSeriesKind(widget.kind)) {
    const series = chartSeries(widget.config);
    const catalog = seriesCatalogFor(widget.kind);
    const matchedFields = catalog.filter((f) => lower.includes(f.label.toLowerCase()));

    if (focusKey !== null) {
      const target = series.find((s) => s.id === focusKey);
      if (target) {
        if (/\bremove\b|\bdelete\b/.test(lower)) {
          changes.config = { ...widget.config, series: series.filter((s) => s.id !== focusKey) };
        } else {
          const colorHex = COLOR_WORDS.find((c) => lower.includes(c.name))?.hex;
          const nextField = matchedFields[0];
          if (colorHex || nextField) {
            changes.config = {
              ...widget.config,
              series: series.map((s) => (s.id === focusKey ? { ...s, color: colorHex ?? s.color, metricId: nextField?.id ?? s.metricId } : s)),
            };
          }
        }
      }
    } else if (/\bremove\b/.test(lower)) {
      if (/\blast\b/.test(lower) && series.length) {
        changes.config = { ...widget.config, series: series.slice(0, -1) };
      } else if (matchedFields.length) {
        const removeIds = new Set(matchedFields.map((f) => f.id));
        changes.config = { ...widget.config, series: series.filter((s) => !removeIds.has(s.metricId)) };
      }
    } else if (/\btop\b|\bpopular\b/.test(lower) && /metric|bar|line|slice|row/.test(lower)) {
      // "Add top metrics" — no specific name to match, so fill in from a fixed popular-first order instead.
      const preferred = catalog.filter((f) => ['ad-spend', 'ad-sales', 'roas', 'revenue', 'spend'].includes(f.id));
      const rest = catalog.filter((f) => !preferred.includes(f));
      const room = SERIES_MAX - series.length;
      const toAdd = [...preferred, ...rest].filter((f) => !series.some((s) => s.metricId === f.id)).slice(0, Math.max(0, room));
      if (toAdd.length) {
        changes.config = {
          ...widget.config,
          series: [...series, ...toAdd.map((f, i) => ({ id: `s-${Date.now()}-${i}`, metricId: f.id, color: SERIES_COLORS[(series.length + i) % SERIES_COLORS.length] }))],
        };
      }
    } else if (matchedFields.length) {
      const room = SERIES_MAX - series.length;
      const toAdd = matchedFields.filter((f) => !series.some((s) => s.metricId === f.id)).slice(0, Math.max(0, room));
      if (toAdd.length) {
        changes.config = {
          ...widget.config,
          series: [...series, ...toAdd.map((f, i) => ({ id: `s-${Date.now()}-${i}`, metricId: f.id, color: SERIES_COLORS[(series.length + i) % SERIES_COLORS.length] }))],
        };
      }
    }
  } else if (isMetricFamily(widget)) {
    const ids = kpiMetricIds(widget.config);
    const found = DASHBOARD_METRICS.find((m) => lower.includes(m.label.toLowerCase()));

    if (focusKey !== null) {
      const idx = Number(focusKey);
      if (/\bremove\b|\bdelete\b|\bsplit\b/.test(lower) && ids.length > 1) {
        changes.config = { ...widget.config, metricIds: ids.filter((_, i) => i !== idx) };
      } else if (found) {
        changes.config = { ...widget.config, metricIds: ids.map((id, i) => (i === idx ? found.id : id)) };
      }
    } else if (/\bremove\b/.test(lower) && ids.length > 1) {
      changes.config = { ...widget.config, metricIds: ids.slice(0, -1) };
    } else if (/\badd\b/.test(lower) && found && !ids.includes(found.id) && ids.length < SERIES_MAX) {
      changes.config = { ...widget.config, metricIds: [...ids, found.id] };
    } else if (found && ids.length <= 1) {
      // No focus, no explicit "add"/"remove", single slot — a plain "show ROAS" swaps it, same as the original single-metric kpi widget always did.
      changes.config = { ...widget.config, metricIds: [found.id], metricId: undefined };
    }
  }

  return Object.keys(changes).length > 0 ? changes : null;
}

function describeChanges(changes: Partial<WidgetInstance>): string {
  const parts: string[] = [];
  if (changes.title) parts.push(`renamed it to "${changes.title}"`);
  if (changes.tone) parts.push('recolored it');
  if (changes.config) parts.push('updated what it shows');
  return parts.length ? `Done — I ${parts.join(' and ')}.` : 'Done.';
}

/** Same Ask Jiva chat panel used in Alerts/Meetings/Work-station, scoped to editing one Brief widget (or one item inside it) instead of chatting about an alert/meeting. */
export function WidgetAiSheet({ widget, focusKey, onClose, onApply }: Props) {
  const focusLabel = focusLabelFor(widget, focusKey);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm0',
      from: 'jiva',
      text: focusLabel
        ? `Hi, I'm Jiva. Tell me how to change the "${focusLabel}" item in "${widget.title}" — recolor it, swap what it shows, or remove it.`
        : `Hi, I'm Jiva. Tell me how to change "${widget.title}" — add or remove items, recolor it, rename it, or reassign what it shows.`,
    },
  ]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const suggestions = suggestionsFor(widget, focusKey);

  const sendText = (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: `u${Date.now()}`, from: 'user', text }]);
    setDraft('');
    setTyping(true);
    window.setTimeout(() => {
      const changes = buildChanges(widget, text, focusKey);
      setTyping(false);
      if (changes) {
        onApply(changes);
        setMessages((prev) => [...prev, { id: `j${Date.now()}`, from: 'jiva', text: describeChanges(changes) }]);
      } else {
        setMessages((prev) => [...prev, { id: `j${Date.now()}`, from: 'jiva', text: 'That edit is outside this local demo — try changing the color, the title, or which metric shows.' }]);
      }
    }, 700);
  };
  const send = () => sendText(draft.trim());

  return (
    <div className={motion.backdropIn} style={{ position: 'fixed', inset: 0, background: 'rgba(20,24,33,.3)', zIndex: 230 }} onClick={onClose}>
      <div
        className={motion.slideInRight}
        onClick={(e) => e.stopPropagation()}
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 360, background: '#fff', boxShadow: '-12px 0 32px rgba(20,24,33,.16)', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #e6e8ec', display: 'flex', alignItems: 'center', gap: 10, flex: 'none', background: 'linear-gradient(180deg, rgba(119,70,155,.05), transparent)' }}>
          <DiamondMascot size={26} />
          <div style={{ minWidth: 0 }}>
            <div style={{ font: '700 13px/1.2 Inter,sans-serif', color: '#23272d' }}>Ask Jiva</div>
            <div style={{ font: '400 10.5px/1.3 Inter,sans-serif', color: '#9aa0a8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>About: {focusLabel ?? widget.title}</div>
          </div>
          <span
            onClick={onClose}
            className={motion.pressable}
            style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, borderRadius: 7, cursor: 'pointer', flex: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f6f4fa')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <CloseIcon size={14} />
          </span>
        </div>

        <div style={{ padding: '10px 14px', borderBottom: '1px solid #f1f2f4', flex: 'none' }}>
          <div style={{ font: '600 9.5px/1 Inter,sans-serif', letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#9aa0a8', marginBottom: 8 }}>Quick actions</div>
          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 6 }}>
            {suggestions.map((s) => (
              <span
                key={s}
                onClick={() => sendText(s)}
                className={`${motion.pressable} ${motion.btnSecondary}`}
                style={{ padding: '6px 11px', borderRadius: 999, border: '1px solid #e6ddf0', font: '500 11px/1 Inter,sans-serif', color: '#5f3880', cursor: 'pointer', background: '#fbfafd' }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div ref={scrollRef} className={scrollStyles.sleekScroll} style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((m) => (
            <div key={m.id} className={motion.contentFadeIn} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexDirection: m.from === 'user' ? 'row-reverse' : 'row' }}>
              {m.from === 'jiva' && <span style={{ flex: 'none', marginTop: 2 }}><DiamondMascot size={20} /></span>}
              <div
                style={{
                  maxWidth: '82%', padding: '9px 12px', borderRadius: 12,
                  borderTopLeftRadius: m.from === 'jiva' ? 4 : 12,
                  borderTopRightRadius: m.from === 'user' ? 4 : 12,
                  background: m.from === 'user' ? '#77469b' : '#f6f4fa',
                  color: m.from === 'user' ? '#fff' : '#3d2a52',
                  font: '400 12.5px/1.55 Inter,sans-serif',
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <span style={{ flex: 'none', marginTop: 2 }}><DiamondMascot size={20} /></span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderRadius: 12, borderTopLeftRadius: 4, background: '#f6f4fa' }}>
                <span style={{ display: 'flex', gap: 4 }}>
                  {[0, 1, 2].map((i) => (
                    <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: '#b9a3cf', animation: `widgetAiTypingDot 1.1s ${i * 0.15}s ease-in-out infinite` }} />
                  ))}
                </span>
                <span style={{ font: '500 11px/1 Inter,sans-serif', color: '#8a7fa8' }}>Thinking…</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding: '12px 14px', borderTop: '1px solid #f1f2f4', display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
            placeholder="Change this widget…"
            className={motion.focusRing}
            style={{ flex: 1, minWidth: 0, padding: '10px 12px', border: '1px solid #dfe3ea', borderRadius: 8, font: '400 12.5px/1 Inter,sans-serif', color: '#3d434b', outline: 'none' }}
          />
          <span
            onClick={send}
            className={draft.trim() ? `${motion.pressable} ${motion.btnPrimary}` : motion.pressable}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 8, background: draft.trim() ? '#77469b' : '#eee7f5', flex: 'none', cursor: draft.trim() ? 'pointer' : 'default' }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M1.5 8h13M9.5 3l5 5-5 5" stroke={draft.trim() ? '#fff' : '#c3b3d6'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
        <style>{`@keyframes widgetAiTypingDot { 0%, 60%, 100% { opacity: .35; transform: translateY(0); } 30% { opacity: 1; transform: translateY(-2px); } }`}</style>
      </div>
    </div>
  );
}
