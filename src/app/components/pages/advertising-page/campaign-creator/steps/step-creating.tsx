// @ts-nocheck -- ported verbatim from the source repo, which uses looser TS settings
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { MOCK_RULES, totalAdGroups, totalTargets, type CcDraft, type CcProduct } from '../campaign-creator.types';
import { BRAND, CheckIcon, FONT, GOOD, HAIR, StepHeading, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

interface ProgressRow { label: string; total: number; }

/** Entities are created in dependency order: campaign, then ad group, then product ad, then targeting, then Rule assignment (spec §10). */
export default function StepCreating({ draft, selectedProducts, onDone }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onDone: () => void;
}) {
  const campaigns = draft.generatedCampaigns ?? [];
  const ruleCount = draft.ruleIds.filter((id) => MOCK_RULES.some((r) => r.id === id)).length;
  const rows: ProgressRow[] = [
    { label: 'Configuration validated and product eligibility rechecked', total: 1 },
    { label: 'Campaigns created', total: campaigns.length },
    { label: 'Ad groups created', total: totalAdGroups(campaigns) },
    { label: 'Product ads created', total: totalAdGroups(campaigns) },
    { label: 'Targeting added', total: totalTargets(campaigns) },
    ...(ruleCount > 0 ? [{ label: 'Campaigns assigned to Rules', total: ruleCount }] : []),
  ];
  const [progress, setProgress] = useState<number[]>(rows.map(() => 0));

  useEffect(() => {
    let rowIndex = 0;
    const timer = window.setInterval(() => {
      setProgress((prev) => {
        const next = [...prev];
        if (rowIndex >= rows.length) { window.clearInterval(timer); window.setTimeout(onDone, 500); return prev; }
        const row = rows[rowIndex];
        const step = Math.max(1, Math.ceil(row.total / 4));
        next[rowIndex] = Math.min(row.total, next[rowIndex] + step);
        if (next[rowIndex] >= row.total) rowIndex += 1;
        return next;
      });
    }, 260);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doneCount = rows.filter((r, i) => progress[i] >= r.total).length;

  return (
    <div role="status" aria-live="polite" className="cc-creating">
      <StepHeading title="Creating your campaigns" />

      <div className="cc-creating-orbit" aria-hidden><motion.span animate={{ rotate: 360 }} transition={{ duration: 3.8, repeat: Infinity, ease: 'linear' }} /><strong>{Math.round((doneCount / rows.length) * 100)}%</strong></div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, font: `600 12px/1 ${FONT}`, color: TEXT_MUTED }}>
        <span>Progress</span>
        <span className="cc-num" style={{ color: BRAND }}>{Math.round((doneCount / rows.length) * 100)}%</span>
      </div>
      <div style={{ height: 8, borderRadius: 999, background: HAIR, overflow: 'hidden', marginBottom: 26, boxShadow: 'inset 0 1px 2px rgba(16,24,40,.06)' }}>
        <motion.div
          initial={false}
          animate={{ width: `${(doneCount / rows.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          className="cc-shimmer"
          style={{ height: '100%', backgroundColor: BRAND, backgroundImage: 'var(--cc-gradient-primary)', borderRadius: 999, boxShadow: '0 0 12px rgba(119,70,155,.45)' }}
        />
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {rows.map((row, i) => {
          const done = progress[i] >= row.total && row.total > 0;
          const active = !done && (i === 0 || progress[i - 1] >= rows[i - 1].total);
          return (
            <motion.li
              key={row.label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, background: active ? 'var(--cc-brand-tint)' : done ? '#f6fbf8' : 'transparent', border: `1px solid ${active ? '#e3d8f0' : 'transparent'}`, transition: 'background-color 240ms ease-out, border-color 240ms ease-out' }}
            >
              <span className={active ? 'cc-pulse' : undefined} style={{ width: 22, height: 22, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? 'var(--cc-gradient-good)' : '#fff', border: `1.5px solid ${done ? GOOD : active ? BRAND : '#d5d9e0'}` }}>
                {done ? <span className="cc-pop" style={{ display: 'flex' }}><CheckIcon size={11} /></span> : active ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: BRAND }} /> : null}
              </span>
              <span style={{ flex: 1, font: `${active || done ? 500 : 400} 14px/1.3 ${FONT}`, color: done || active ? TEXT_PRIMARY : TEXT_FAINT }}>{row.label}</span>
              {row.total > 1 && (done || active) && <span className="cc-num" style={{ font: `600 12.5px/1 ${FONT}`, color: done ? GOOD : BRAND, padding: '4px 8px', borderRadius: 999, background: '#fff', border: `1px solid ${HAIR}` }}>{progress[i]}/{row.total}</span>}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
