import { useEffect, useState } from 'react';
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
    <div role="status" aria-live="polite">
      <StepHeading title="Creating your campaigns" subtitle={`Setting up ${campaigns.length} campaigns for ${selectedProducts.length} product${selectedProducts.length === 1 ? '' : 's'}. Each part is created in order, so you can see exactly where it is.`} />

      <div style={{ height: 4, borderRadius: 999, background: HAIR, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ height: '100%', width: `${(doneCount / rows.length) * 100}%`, background: BRAND, borderRadius: 999, transition: 'width 260ms ease-out' }} />
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {rows.map((row, i) => {
          const done = progress[i] >= row.total && row.total > 0;
          const active = !done && (i === 0 || progress[i - 1] >= rows[i - 1].total);
          return (
            <li key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? GOOD : '#fff', border: `1.5px solid ${done ? GOOD : active ? BRAND : '#d5d9e0'}` }}>
                {done ? <CheckIcon size={10} /> : active ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: BRAND }} /> : null}
              </span>
              <span style={{ flex: 1, font: `${active || done ? 500 : 400} 14px/1.3 ${FONT}`, color: done || active ? TEXT_PRIMARY : TEXT_FAINT }}>{row.label}</span>
              {row.total > 1 && (done || active) && <span className="cc-num" style={{ font: `400 13px/1 ${FONT}`, color: TEXT_MUTED }}>{progress[i]}/{row.total}</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
