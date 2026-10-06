import { useMemo, useState } from 'react';
import { MOCK_RULES, formatCurrency, type CcCampaign, type CcDraft, type CcProduct } from '../campaign-creator.types';
import { BAD, BORDER, CheckIcon, FONT, GOOD, HAIR, SURFACE_MUTED, TextButton, TEXT_FAINT, TEXT_MUTED, TEXT_PRIMARY, WARN, WarningIcon } from '../campaign-creator-ui';

type Outcome = 'success' | 'partial' | 'failed';

interface FailedEntity {
  id: string;
  entity: string;
  error: string;
  reason: string;
  action: string;
  retryable: boolean;
}

const OUTCOMES: { id: Outcome; label: string }[] = [
  { id: 'success', label: 'Success' },
  { id: 'partial', label: 'Partial' },
  { id: 'failed', label: 'Failed' },
];

const TH: React.CSSProperties = { textAlign: 'left', padding: '10px 14px', font: `500 12px/1 ${FONT}`, color: TEXT_MUTED, background: SURFACE_MUTED, borderBottom: `1px solid ${BORDER}`, whiteSpace: 'nowrap' };
const TD: React.CSSProperties = { padding: '12px 14px', borderBottom: `1px solid ${HAIR}`, verticalAlign: 'top', font: `400 13px/1.45 ${FONT}`, color: TEXT_MUTED };

function adGroupCount(c: CcCampaign) { return c.adGroups.length; }
function targetCount(c: CcCampaign) { return c.adGroups.reduce((n, ag) => n + ag.targets.length, 0); }

function Line({ ok, children, sub }: { ok: boolean; children: React.ReactNode; sub?: string }) {
  return (
    <li style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '9px 0' }}>
      <span style={{ marginTop: 2, flex: 'none', display: 'flex' }}>{ok ? <CheckIcon size={13} color={GOOD} /> : <WarningIcon size={13} color={WARN} />}</span>
      <span>
        <span style={{ font: `500 14px/1.4 ${FONT}`, color: TEXT_PRIMARY }}>{children}</span>
        {sub && <span style={{ display: 'block', marginTop: 2, font: `400 12.5px/1.5 ${FONT}`, color: ok ? TEXT_FAINT : WARN }}>{sub}</span>}
      </span>
    </li>
  );
}

export default function StepResult({ draft, selectedProducts }: { draft: CcDraft; selectedProducts: CcProduct[] }) {
  const campaigns = draft.generatedCampaigns ?? [];
  const [outcome, setOutcome] = useState<Outcome>('success');
  const [retried, setRetried] = useState<Set<string>>(new Set());
  const [ruleRetried, setRuleRetried] = useState(false);

  const rules = MOCK_RULES.filter((r) => draft.ruleIds.includes(r.id));
  const last = campaigns[campaigns.length - 1];

  const failures = useMemo<FailedEntity[]>(() => {
    if (!last) return [];
    if (outcome === 'failed') {
      return [{ id: 'all', entity: 'All campaigns', error: 'Marketplace unavailable', reason: 'The advertising API did not respond, so nothing was created.', action: 'Retry now. Your configuration is saved.', retryable: true }];
    }
    if (outcome === 'partial') {
      const firstTarget = last.adGroups.flatMap((ag) => ag.targets)[0];
      return [
        { id: 'campaign', entity: `Campaign — ${last.name}`, error: 'Budget rejected', reason: `The marketplace rejected a daily budget of ${formatCurrency(last.dailyBudget)} for this campaign.`, action: 'Raise the budget, then retry.', retryable: true },
        ...(firstTarget ? [{ id: 'target', entity: `Target — ${firstTarget.label}`, error: 'Duplicate target', reason: 'This keyword already exists in the ad group, so it was skipped.', action: 'No action needed.', retryable: false }] : []),
      ];
    }
    return [];
  }, [outcome, last]);

  const open = failures.filter((f) => !retried.has(f.id));
  const campaignFailed = outcome === 'failed' ? !retried.has('all') : outcome === 'partial' ? !retried.has('campaign') : false;
  const createdCampaigns = outcome === 'failed' && campaignFailed ? [] : campaignFailed && last ? campaigns.slice(0, -1) : campaigns;
  const adGroups = createdCampaigns.reduce((n, c) => n + adGroupCount(c), 0);
  const targets = createdCampaigns.reduce((n, c) => n + targetCount(c), 0);
  const plannedTargets = campaigns.reduce((n, c) => n + targetCount(c), 0);
  const plannedAdGroups = campaigns.reduce((n, c) => n + adGroupCount(c), 0);

  const state: Outcome = campaignFailed ? (outcome === 'failed' ? 'failed' : 'partial') : open.some((f) => f.retryable) ? 'partial' : 'success';
  const missing = campaigns.length - createdCampaigns.length;

  const heading = state === 'success'
    ? 'Campaign creation completed'
    : state === 'partial' ? 'Campaign creation partially completed' : 'Campaign creation failed';
  const body = state === 'success'
    ? `${createdCampaigns.length} campaign${createdCampaigns.length === 1 ? '' : 's'} created for ${selectedProducts.length} product${selectedProducts.length === 1 ? '' : 's'}. You'll find them in Campaign Manager.`
    : state === 'partial'
      ? `${createdCampaigns.length} campaign${createdCampaigns.length === 1 ? ' was' : 's were'} created successfully. ${missing} campaign${missing === 1 ? '' : 's'} could not be created.`
      : 'Nothing was created. Your products, goals, targeting and structure are still saved, so you can retry without starting over.';
  const tone = state === 'success' ? { bg: '#e9f7ef', fg: GOOD } : state === 'partial' ? { bg: '#fdf8f1', fg: WARN } : { bg: '#fdecec', fg: BAD };

  function retry(id: string) { setRetried((prev) => new Set(prev).add(id)); }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginBottom: 14 }}>
        <span style={{ font: `400 12px/1 ${FONT}`, color: TEXT_FAINT }}>Prototype outcome</span>
        <div role="radiogroup" aria-label="Simulated outcome" style={{ display: 'inline-flex', padding: 2, borderRadius: 8, background: '#f1f2f4' }}>
          {OUTCOMES.map((o) => (
            <button
              key={o.id} type="button" role="radio" aria-checked={outcome === o.id} className="cc-btn"
              onClick={() => { setOutcome(o.id); setRetried(new Set()); setRuleRetried(false); }}
              style={{ padding: '6px 11px', border: 'none', borderRadius: 6, background: outcome === o.id ? '#fff' : 'transparent', boxShadow: outcome === o.id ? '0 1px 2px rgba(20,24,33,.12)' : 'none', font: `600 12px/1 ${FONT}`, color: outcome === o.id ? TEXT_PRIMARY : TEXT_MUTED, cursor: 'pointer' }}
            >{o.label}</button>
          ))}
        </div>
      </div>

      <span style={{ width: 44, height: 44, borderRadius: '50%', background: tone.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        {state === 'success' ? <CheckIcon size={22} color={tone.fg} /> : <WarningIcon size={20} color={tone.fg} />}
      </span>
      <h1 style={{ margin: 0, font: `600 24px/1.25 ${FONT}`, letterSpacing: '-0.015em', color: TEXT_PRIMARY }}>{heading}</h1>
      <p style={{ margin: '8px 0 0', maxWidth: 560, font: `400 14px/1.6 ${FONT}`, color: TEXT_MUTED }}>{body}</p>

      <div style={{ display: 'flex', gap: 18, marginTop: 14 }}>
        {state !== 'failed' && <TextButton onClick={() => {}}>View campaigns</TextButton>}
        {state !== 'success' && failures.some((f) => f.retryable && !retried.has(f.id)) && <TextButton onClick={() => failures.filter((f) => f.retryable).forEach((f) => retry(f.id))}>Retry failed items</TextButton>}
      </div>

      <section style={{ marginTop: 30 }}>
        <h2 style={{ margin: '0 0 4px', font: `600 14px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>What was created</h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          <Line ok={createdCampaigns.length === campaigns.length}>{createdCampaigns.length}/{campaigns.length} campaigns created</Line>
          <Line ok={adGroups === plannedAdGroups}>{adGroups}/{plannedAdGroups} ad groups created</Line>
          <Line ok={adGroups === plannedAdGroups}>{adGroups}/{plannedAdGroups} product ads created</Line>
          <Line ok={targets === plannedTargets}>{targets}/{plannedTargets} targets created</Line>
        </ul>
      </section>

      {rules.length > 0 && (
        <section style={{ marginTop: 24 }}>
          <h2 style={{ margin: '0 0 4px', font: `600 14px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>Rule assignment</h2>
          <p style={{ margin: '0 0 4px', font: `400 12.5px/1.5 ${FONT}`, color: TEXT_FAINT }}>Tracked separately from campaign creation.</p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {rules.map((rule, i) => {
              const target = draft.ruleScope === 'all' ? createdCampaigns.length : createdCampaigns.filter((c) => draft.ruleCampaignIds.includes(c.id)).length;
              const planned = draft.ruleScope === 'all' ? campaigns.length : draft.ruleCampaignIds.length;
              const hasGap = target < planned;
              const partialRule = i === 0 && outcome === 'success' && rules.length > 1 && !ruleRetried;
              const done = partialRule ? Math.max(planned - 1, 0) : target;
              const ok = done === planned;
              return (
                <Line
                  key={rule.id} ok={ok}
                  sub={!ok ? (hasGap ? 'The campaigns that were not created could not be assigned.' : '1 campaign could not be assigned. The Rule was busy updating, so it can be retried.') : undefined}
                >
                  {rule.name} — {done}/{planned} campaigns
                  {!ok && !hasGap && <span style={{ marginLeft: 12 }}><TextButton onClick={() => setRuleRetried(true)}>Retry assignment</TextButton></span>}
                </Line>
              );
            })}
          </ul>
        </section>
      )}

      {open.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <h2 style={{ margin: '0 0 10px', font: `600 14px/1.3 ${FONT}`, color: TEXT_PRIMARY }}>What needs attention</h2>
          <div className="cc-scroll" style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={TH}>Entity</th><th style={TH}>Error</th><th style={TH}>Reason</th><th style={TH}>Next step</th><th style={{ ...TH, width: 70 }} />
                </tr>
              </thead>
              <tbody>
                {open.map((f) => (
                  <tr key={f.id}>
                    <td style={{ ...TD, color: TEXT_PRIMARY, fontWeight: 500 }}>{f.entity}</td>
                    <td style={{ ...TD, color: BAD, whiteSpace: 'nowrap' }}>{f.error}</td>
                    <td style={TD}>{f.reason}</td>
                    <td style={TD}>{f.action}</td>
                    <td style={{ ...TD, textAlign: 'right' }}>{f.retryable ? <TextButton onClick={() => retry(f.id)}>Retry</TextButton> : <span style={{ color: TEXT_FAINT }}>—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
