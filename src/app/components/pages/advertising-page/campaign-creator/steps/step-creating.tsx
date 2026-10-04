import { useEffect, useState } from 'react';
import { totalAdGroups, totalTargets, type CcDraft, type CcProduct } from '../campaign-creator.types';
import { BORDER, CheckIcon, SectionCard, StepHeading, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY } from '../campaign-creator-ui';

interface ProgressRow { label: string; total: number; }

export default function StepCreating({ draft, selectedProducts, onDone }: {
  draft: CcDraft; selectedProducts: CcProduct[]; onDone: () => void;
}) {
  const campaigns = draft.generatedCampaigns ?? [];
  const rows: ProgressRow[] = [
    { label: 'Configuration validated', total: 1 },
    { label: 'Campaigns created', total: campaigns.length },
    { label: 'Ad groups created', total: totalAdGroups(campaigns) },
    { label: 'Product ads created', total: totalAdGroups(campaigns) },
    { label: 'Targeting created', total: totalTargets(campaigns) },
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

  return (
    <div>
      <StepHeading title="Creating your campaigns…" subtitle={`Promoting ${selectedProducts.length} product${selectedProducts.length === 1 ? '' : 's'} on ${draft.marketplace === 'walmart' ? 'Walmart' : 'Amazon'}.`} />
      <SectionCard>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rows.map((row, i) => {
            const done = progress[i] >= row.total && row.total > 0;
            const active = !done && (i === 0 || progress[i - 1] >= rows[i - 1].total);
            return (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  width: 20, height: 20, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? '#1e8449' : active ? '#77469b' : '#fff', border: `1.5px solid ${done ? '#1e8449' : active ? '#77469b' : BORDER}`,
                }}>
                  {done && <CheckIcon size={10} />}
                  {!done && active && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#77469b' }} />}
                </span>
                <span style={{ font: '600 12.5px/1 Inter,sans-serif', color: done || active ? TEXT_PRIMARY : TEXT_FAINT, flex: 'none', width: 190 }}>{row.label}</span>
                {row.total > 0 && <span style={{ font: '500 11.5px/1 Inter,sans-serif', color: TEXT_MUTED }}>{progress[i]}/{row.total}</span>}
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
