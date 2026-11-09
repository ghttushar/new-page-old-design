import { useState } from 'react';
import { type CcCampaign, type CcDraft, type CcProduct } from '../campaign-creator.types';
import { Note, StepHeading } from '../campaign-creator-ui';
import { Panel } from '../ccd-design';
import CampaignsTable from './preview-campaigns';
import KeywordPopup from './keyword-popup';
import { addListsToCampaigns, canTake, usePlanCampaigns, walmartComboIssue, type KeywordLists } from './plan-campaigns';
import type { Scope } from '../product-groups';

// Keywords step: the plan's campaigns, as on Review. Tick the campaigns to add to, then Add keywords opens the keyword
// and negative lists in a popup. Everything here is optional; added targets show in each row's Targeting type.

const PlusIcon = () => <svg width={14} height={14} viewBox="0 0 16 16" fill="none" aria-hidden><path d="M8 3.2v9.6M3.2 8h9.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>;
const plural = (n: number, one: string) => `${n.toLocaleString()} ${n === 1 ? one : `${one}s`}`;

export default function StepKeywords({ draft: sharedDraft, scopes: groupScopes, activeScope, selectedProducts, onChange }: {
  draft: CcDraft; scopes: Scope[]; activeScope?: Scope; selectedProducts: CcProduct[]; onChange: (patch: Partial<CcDraft>) => void;
}) {
  const { campaigns, planBudget } = usePlanCampaigns(sharedDraft, groupScopes, selectedProducts, onChange);
  const draft: CcDraft = { ...sharedDraft, dailyBudget: planBudget };
  const marketplace = sharedDraft.marketplace;
  const [picked, setPicked] = useState<Set<string>>(() => new Set());
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const heading = marketplace === 'walmart' ? 'Add keywords' : 'Add keywords & product targets';
  const commit = (next: CcCampaign[]) => onChange({ generatedCampaigns: next });
  const comboIssue = walmartComboIssue(campaigns, marketplace);

  if (campaigns.length === 0) {
    return (
      <div>
        <StepHeading title={heading} />
        <Panel><p style={{ margin: 0, padding: '28px 0', textAlign: 'center', font: '400 13.5px/1.5 Inter, sans-serif', color: '#646b76' }}>There are no campaigns to add keywords to yet. Go back and choose a structure.</p></Panel>
      </div>
    );
  }

  // Only ids still in the plan count (a structure change rebuilds the campaigns).
  const chosen = campaigns.filter((c) => picked.has(c.id));
  const anyList = chosen.some((c) => (['keyword', 'product', 'negative', 'neg-product'] as const).some((k) => canTake(c, k, marketplace)));
  const why = chosen.length === 0 ? 'Tick the campaigns to add keywords to' : !anyList ? "The ticked campaigns can't take keywords or negatives" : undefined;

  function addLists(lists: KeywordLists) {
    const ids = new Set(chosen.map((c) => c.id));
    const result = addListsToCampaigns(campaigns, ids, lists, marketplace);
    commit(result.campaigns);
    const parts = [result.added > 0
      ? `Added ${plural(result.added, 'entry').replace('entrys', 'entries')} to ${plural(result.campaignCount, 'campaign')}. Each row's Targeting type shows them; the pencil edits them.`
      : 'Nothing new was added: the ticked campaigns already have these.'];
    if (result.skipped.length) parts.push(`${plural(result.skipped.length, 'campaign')} skipped: ${result.skipped[0].reason}.`);
    setNotice(parts.join(' '));
    setPicked(new Set());
    setOpen(false);
  }

  return (
    <div>
      <StepHeading title={heading} />
      {/* Walmart: an ad group can hold at most 1,000 keyword and match-type combinations. */}
      {comboIssue && <div style={{ marginBottom: 14 }}><Note tone="warn">{comboIssue}</Note></div>}
      {notice && <div role="status" className="ccd-kwp-notice"><span>{notice}</span><button type="button" aria-label="Dismiss" onClick={() => setNotice(null)}>×</button></div>}

      <CampaignsTable
        draft={draft} campaigns={campaigns} selectedProducts={selectedProducts} shownScope={groupScopes.length > 0 ? activeScope : undefined}
        onCommit={commit} onApplyNaming={(naming, next) => onChange({ naming, generatedCampaigns: next })}
        selection={{ ids: picked, onChange: (update) => { setPicked(update); setNotice(null); } }}
        action={(
          <button type="button" className="ccd-kwp-add" disabled={Boolean(why)} title={why} aria-haspopup="dialog" onClick={() => setOpen(true)}>
            <PlusIcon />Add keywords
          </button>
        )}
      />

      {open && <KeywordPopup campaigns={chosen} marketplace={marketplace} onAdd={addLists} onClose={() => setOpen(false)} />}
    </div>
  );
}
